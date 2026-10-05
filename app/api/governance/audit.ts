import { asc, desc, eq, sql, type SQL } from "drizzle-orm";
import type { getDb } from "../../../db";
import * as s from "../../../db/schema";
import type { Actor } from "../../org-auth";

type Db = Awaited<ReturnType<typeof getDb>>;
type AuditInput = {
  action: string;
  entityType: string;
  entityCode: string;
  details: string;
  guard?: SQL;
};
type AuditEvent = typeof s.auditEvents.$inferSelect;

const GENESIS = "GENESIS";
const HASH_VERSION = "v2";

function sourceIp(request: Request, actor: Actor) {
  if (actor.email === "confidential-reporter") return null;
  const candidate =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0];
  const value = candidate?.trim();
  return value && /^[0-9a-f:.]{3,45}$/i.test(value) ? value : null;
}

export async function auditHash(value: Record<string, string>) {
  const canonical = JSON.stringify(value);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function preparedAudit(
  db: Db,
  actor: Actor,
  request: Request,
  input: AuditInput,
) {
  const prior = await db
    .select({ eventHash: s.auditEvents.eventHash })
    .from(s.auditEvents)
    .where(eq(s.auditEvents.organizationId, actor.organizationId))
    .orderBy(desc(s.auditEvents.id))
    .limit(1);
  const occurredAt = new Date().toISOString();
  const previousHash = prior[0]?.eventHash ?? GENESIS;
  const details = input.details.slice(0, 12_000);
  const eventHash = await auditHash({
    version: HASH_VERSION,
    organizationId: actor.organizationId,
    actorEmail: actor.email,
    actorRole: actor.role,
    action: input.action,
    entityType: input.entityType,
    entityCode: input.entityCode,
    details,
    occurredAt,
    previousHash,
  });
  // Query builders are thenable. Wrapping the statement prevents this async
  // helper from executing it before the caller adds it to the transaction.
  return { statement: db.insert(s.auditEvents).values({
    // D1 executes batches sequentially in one transaction. A false guard
    // violates this column's NOT NULL constraint and rolls back every write.
    // Evaluate here so changes() still refers to the final domain statement.
    organizationId: input.guard
      ? sql`case when ${input.guard} then ${actor.organizationId} else null end`
      : actor.organizationId,
    actorEmail: actor.email,
    actorRole: actor.role,
    action: input.action,
    entityType: input.entityType,
    entityCode: input.entityCode,
    details,
    sourceIp: sourceIp(request, actor),
    previousHash,
    eventHash,
    hashVersion: HASH_VERSION,
    createdAt: occurredAt,
  }) };
}

export async function appendAuditEvent(
  db: Db,
  actor: Actor,
  request: Request,
  input: AuditInput,
) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const { statement } = await preparedAudit(db, actor, request, input);
      const rows = await statement.returning();
      return rows[0];
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/unique constraint failed.*audit_events.*organization_id.*previous_hash/i.test(message) || attempt === 4) {
        throw error;
      }
    }
  }
  throw new Error("AUDIT_APPEND_FAILED");
}

export function audit(
  db: Db,
  actor: Actor,
  request: Request,
  action: string,
  entityType: string,
  entityCode: string,
  details: string,
) {
  return appendAuditEvent(db, actor, request, { action, entityType, entityCode, details });
}

type StatementResult<T> = T extends { _: { result: infer R } } ? R : unknown;

export async function auditedWrite<T>(
  db: Db,
  actor: Actor,
  request: Request,
  statement: T,
  input: AuditInput,
): Promise<StatementResult<T>> {
  const [result] = await auditedBatch(db, actor, request, [statement] as const, input);
  return result as StatementResult<T>;
}

export async function auditedBatch<const T extends readonly unknown[]>(
  db: Db,
  actor: Actor,
  request: Request,
  statements: T,
  input: AuditInput,
): Promise<{ [K in keyof T]: StatementResult<T[K]> }> {
  const { statement: auditStatement } = await preparedAudit(db, actor, request, input);
  try {
    const rows = await (db as unknown as { batch(items: unknown[]): Promise<unknown[]> })
      .batch([...statements, auditStatement]);
    return rows.slice(0, statements.length) as {
      [K in keyof T]: StatementResult<T[K]>;
    };
  } catch (error) {
    // Drizzle or D1 may wrap the constraint error in a cause. Translate only
    // the deliberate guard failure, leaving other database errors untouched.
    let cause: unknown = error;
    for (let depth = 0; cause instanceof Error && depth < 5; depth += 1) {
      if (input.guard && /NOT NULL constraint failed:\s*audit_events\.organization_id/i.test(cause.message)) {
        throw new Error("Record changed; refresh and try again", { cause: error });
      }
      cause = cause.cause;
    }
    throw error;
  }
}

export async function verifyAuditChain(db: Db, organizationId: string) {
  const events = await db
    .select()
    .from(s.auditEvents)
    .where(eq(s.auditEvents.organizationId, organizationId))
    .orderBy(asc(s.auditEvents.id));
  let priorHash = GENESIS;
  let verifiedV2 = 0;
  let legacyEvents = 0;
  for (const event of events) {
    if ((event.previousHash ?? GENESIS) !== priorHash) {
      return integrityResult(false, events, verifiedV2, legacyEvents, event.id);
    }
    if (event.hashVersion === HASH_VERSION) {
      const expected = await auditHash({
        version: HASH_VERSION,
        organizationId: event.organizationId,
        actorEmail: event.actorEmail,
        actorRole: event.actorRole,
        action: event.action,
        entityType: event.entityType,
        entityCode: event.entityCode,
        details: event.details,
        occurredAt: event.createdAt,
        previousHash: event.previousHash ?? GENESIS,
      });
      if (expected !== event.eventHash) {
        return integrityResult(false, events, verifiedV2, legacyEvents, event.id);
      }
      verifiedV2 += 1;
    } else {
      legacyEvents += 1;
    }
    priorHash = event.eventHash;
  }
  return integrityResult(true, events, verifiedV2, legacyEvents, null);
}

function integrityResult(
  valid: boolean,
  events: AuditEvent[],
  verifiedV2: number,
  legacyEvents: number,
  firstInvalidEventId: number | null,
) {
  return {
    status: valid ? "VERIFIED" : "BROKEN",
    totalEvents: events.length,
    verifiedV2,
    legacyEvents,
    firstInvalidEventId,
    headHash: events.at(-1)?.eventHash ?? GENESIS,
    verifiedAt: new Date().toISOString(),
  };
}
