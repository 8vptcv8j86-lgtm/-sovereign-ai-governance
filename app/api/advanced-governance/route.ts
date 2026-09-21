import { and, desc, eq } from "drizzle-orm";
import { actorFor } from "../../org-auth";
import { errorResponse, json, readJsonObject } from "../http";
import { assertActionAllowed } from "../governance/access";
import { auditedWrite } from "../governance/audit";
import {
  ADVANCED_ENTITIES,
  ADVANCED_GOVERNANCE,
  RESTRICTED_ADMIN_ENTITIES,
  isAdvancedEntity,
  type AdvancedEntity,
} from "./registry";

const DATA_LANES = new Set([
  "PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED",
  "LOCAL_ONLY", "SOVEREIGN_ONLY", "REGULATORY_DISCLOSURE",
]);

const TERMINAL_STATES = new Set([
  "frozen", "revoked", "expired", "deleted", "retired", "completed", "closed",
]);

function recordCode(revision: string) {
  return revision + "-" + Date.now().toString(36).toUpperCase() + "-" +
    crypto.randomUUID().slice(0, 6).toUpperCase();
}

async function digest(value: unknown) {
  const canonical = JSON.stringify(value);
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function cleanText(value: unknown, max = 500) {
  const result = String(value ?? "").trim();
  if (result.length > max) throw new Error("Value exceeds " + max + " characters");
  return result;
}

function cleanPayload(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("payload must be a JSON object");
  }
  return value as Record<string, unknown>;
}

function rejectSecretValues(entity: AdvancedEntity, body: Record<string, unknown>) {
  if (entity !== "secret_reference_registry" && entity !== "secret_rotation_events") return;
  const serialized = JSON.stringify(body).toLowerCase();
  const forbidden = [
    "\"secret\"", "\"token\"", "\"password\"", "\"api_key\"",
    "\"apikey\"", "\"private_key\"", "\"credential\"",
  ];
  if (forbidden.some((needle) => serialized.includes(needle))) {
    throw new Error(
      "Secret governance records may store references and rotation metadata only, never secret values",
    );
  }
}

function requireDomainInvariants(
  entity: AdvancedEntity,
  state: string,
  body: Record<string, unknown>,
) {
  if (entity === "execution_resume_events" && !cleanText(body.authorizationReference, 500)) {
    throw new Error("Resume events require a fresh authorizationReference");
  }
  if (entity === "evidence_artifact_versions" && !cleanText(body.sourceDigest, 200)) {
    throw new Error("Evidence artifact versions require sourceDigest");
  }
  if (entity === "evidence_room_freezes" && !cleanText(body.integrityHash, 200)) {
    throw new Error("Evidence room freezes require integrityHash");
  }
  if (entity === "privileged_bypass_events" && !cleanText(body.justification, 2000)) {
    throw new Error("Privileged bypass events require justification");
  }
  if (
    entity === "schema_policy_verification_events" &&
    !["verified", "failed", "partial"].includes(state.toLowerCase())
  ) {
    throw new Error("Schema/policy verification state must be verified, failed or partial");
  }
}

export async function GET(request: Request) {
  try {
    const { db, actor } = await actorFor(request);
    const url = new URL(request.url);
    const requestedEntity = url.searchParams.get("entity");
    const requestedRevision = url.searchParams.get("revision");

    const entities = requestedEntity
      ? [requestedEntity]
      : ADVANCED_ENTITIES.filter(
          (entity) =>
            !requestedRevision ||
            ADVANCED_GOVERNANCE[entity].revision === requestedRevision,
        );

    const result: Record<string, unknown[]> = {};
    for (const raw of entities) {
      if (!isAdvancedEntity(raw)) continue;
      if (RESTRICTED_ADMIN_ENTITIES.has(raw) && actor.role !== "admin") continue;
      const table = ADVANCED_GOVERNANCE[raw].table;
      result[raw] = await db
        .select()
        .from(table)
        .where(eq(table.organizationId, actor.organizationId))
        .orderBy(desc(table.id))
        .limit(100);
    }

    return json({
      actor: {
        displayName: actor.displayName,
        role: actor.role,
        organizationName: actor.organizationName,
      },
      entities: ADVANCED_ENTITIES.map((entity) => ({
        entity,
        revision: ADVANCED_GOVERNANCE[entity].revision,
        label: ADVANCED_GOVERNANCE[entity].label,
        restricted: RESTRICTED_ADMIN_ENTITIES.has(entity),
      })),
      records: result,
    });
  } catch (error) {
    return errorResponse(error, "advanced-governance.read");
  }
}

export async function POST(request: Request) {
  try {
    const { db, actor } = await actorFor(request);
    const input = await readJsonObject(request);
    const action = cleanText(input.action, 100);
    assertActionAllowed(actor, action);

    if (action === "export_advanced_governance_package") {
      const exported: Record<string, unknown[]> = {};
      for (const entity of ADVANCED_ENTITIES) {
        if (RESTRICTED_ADMIN_ENTITIES.has(entity) && actor.role !== "admin") continue;
        const table = ADVANCED_GOVERNANCE[entity].table;
        exported[entity] = await db
          .select()
          .from(table)
          .where(eq(table.organizationId, actor.organizationId))
          .orderBy(desc(table.id));
      }
      const packageBody = {
        contract: "sentinel.advanced-governance.v1",
        organizationId: actor.organizationId,
        generatedAt: new Date().toISOString(),
        generatedBy: actor.email,
        revisions: ["R2","R3","R4","R5","R6","R7","R8","R9","R10","R11","R12"],
        records: exported,
      };
      return json({ result: packageBody, digest: await digest(packageBody) });
    }

    const entity = cleanText(input.entity, 120);
    if (!isAdvancedEntity(entity)) throw new Error("Unknown advanced governance entity");
    if (RESTRICTED_ADMIN_ENTITIES.has(entity) && actor.role !== "admin") {
      throw new Error("ACCESS_DENIED");
    }

    const config = ADVANCED_GOVERNANCE[entity];
    const table = config.table;

    if (action === "create_advanced_record") {
      const data = cleanPayload(input.payload);
      rejectSecretValues(entity, data);
      const state = cleanText(input.state || "active", 100) || "active";
      requireDomainInvariants(entity, state, data);
      const dataLane = cleanText(input.dataLane || "INTERNAL", 100) || "INTERNAL";
      if (!DATA_LANES.has(dataLane)) throw new Error("Invalid data lane");

      const code = recordCode(config.revision);
      const digestInput = {
        entity,
        revision: config.revision,
        subjectCode: cleanText(input.subjectCode, 300) || null,
        parentCode: cleanText(input.parentCode, 300) || null,
        state,
        dataLane,
        jurisdiction: cleanText(input.jurisdiction, 300) || null,
        payload: data,
      };
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db.insert(table).values({
          recordCode: code,
          organizationId: actor.organizationId,
          subjectCode: digestInput.subjectCode,
          parentCode: digestInput.parentCode,
          state,
          dataLane,
          jurisdiction: digestInput.jurisdiction,
          payload: data,
          contentDigest: await digest(digestInput),
          createdBy: actor.email,
          effectiveAt: cleanText(input.effectiveAt, 100) || null,
          expiresAt: cleanText(input.expiresAt, 100) || null,
        }).returning(),
        {
          action: "advanced." + entity + ".created",
          entityType: entity,
          entityCode: code,
          details: JSON.stringify({
            revision: config.revision,
            state,
            dataLane,
            subjectCode: digestInput.subjectCode,
          }),
        },
      );
      return json({ result: rows[0] });
    }

    if (action === "transition_advanced_record") {
      const code = cleanText(input.recordCode, 200);
      const expectedState = cleanText(input.expectedState, 100);
      const nextState = cleanText(input.nextState, 100);
      if (!code || !expectedState || !nextState) {
        throw new Error("recordCode, expectedState and nextState are required");
      }

      const existing = await db
        .select()
        .from(table)
        .where(
          and(
            eq(table.organizationId, actor.organizationId),
            eq(table.recordCode, code),
          ),
        )
        .get();
      if (!existing) throw new Error("Advanced governance record not found");
      if (existing.state !== expectedState) throw new Error("Record changed; refresh and try again");
      if (TERMINAL_STATES.has(existing.state.toLowerCase())) {
        throw new Error("Terminal governance records cannot be mutated");
      }

      const nextPayload =
        input.payload && typeof input.payload === "object" && !Array.isArray(input.payload)
          ? { ...existing.payload, ...(input.payload as Record<string, unknown>) }
          : existing.payload;
      rejectSecretValues(entity, nextPayload);
      requireDomainInvariants(entity, nextState, nextPayload);
      const nextDigest = await digest({
        entity,
        priorDigest: existing.contentDigest,
        nextState,
        payload: nextPayload,
      });

      const rows = await auditedWrite(
        db,
        actor,
        request,
        db.update(table)
          .set({ state: nextState, payload: nextPayload, contentDigest: nextDigest })
          .where(
            and(
              eq(table.organizationId, actor.organizationId),
              eq(table.recordCode, code),
              eq(table.state, expectedState),
            ),
          )
          .returning(),
        {
          action: "advanced." + entity + ".transitioned",
          entityType: entity,
          entityCode: code,
          details: JSON.stringify({ from: expectedState, to: nextState }),
        },
      );
      if (!rows[0]) throw new Error("Record changed; refresh and try again");
      return json({ result: rows[0] });
    }

    throw new Error("UNKNOWN_ACTION");
  } catch (error) {
    return errorResponse(error, "advanced-governance.write");
  }
}
