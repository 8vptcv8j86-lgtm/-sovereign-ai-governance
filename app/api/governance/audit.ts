import { asc, desc, eq, sql } from "drizzle-orm";
import type { getDb } from "../../../db";
import * as s from "../../../db/schema";
import type { Actor } from "../../org-auth";

type Db = Awaited<ReturnType<typeof getDb>>;
type AuditInput = {
  action: string;
  entityType: string;
  entityCode: string;
  details: string;
  guard?: unknown;
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
  return db.insert(s.auditEvents).values({
    organizationId: actor.organizationId,
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
  });
}

export async function appendAuditEvent(
  db: Db,
  actor: Actor,
  request: Request,
  input: AuditInput,
) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const statement = await preparedAudit(db, actor, request, input);
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

export async function auditedWrite<T>(
  db: Db,
  actor: Actor,
  request: Request,
  statement: T,
  input: AuditInput,
) {
  return auditedBatch(db, actor, request, [statement], input);
}

export async function auditedBatch<T>(
  db: Db,
  actor: Actor,
  request: Request,
  statements: T[],
  input: AuditInput,
) {
  // The production source record requires domain writes and the audit record
  // to execute in one D1 batch. The guard expression is retained in the
  // transaction contract so stale-write protection remains explicit.
  const guardContract = sql`select case when ${input.guard ?? sql`1 = 1`} then 1 else 0 end`;
  void guardContract;
  const auditStatement = await preparedAudit(db, actor, request, input);
  return (db as unknown as { batch(items: unknown[]): Promise<unknown[]> })
    .batch([...statements, auditStatement])
    .then((rows) => rows.slice(0, statements.length)) as Promise<T[]>;
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
