import { and, desc, eq } from "drizzle-orm";
import { actorFor } from "../../org-auth";
import { errorResponse, json, readJsonObject } from "../http";
import { assertActionAllowed, capabilitiesFor } from "../governance/access";
import { auditedWrite } from "../governance/audit";
import {
  PRIVACY_ENTITIES,
  PRIVACY_GOVERNANCE,
  entityForAction,
  isPrivacyEntity,
  type PrivacyEntity,
} from "./registry";

const TERMINAL_STATES = new Set(["closed", "deleted", "superseded", "withdrawn"]);

function cleanText(value: unknown, max = 4000) {
  const text = String(value ?? "").trim();
  if (text.length > max) throw new Error("Value exceeds " + max + " characters");
  return text;
}

function compactPayload(input: Record<string, unknown>) {
  const ignored = new Set([
    "action", "entity", "recordCode", "expectedState", "nextState",
    "state", "systemCode", "subjectCode", "jurisdiction", "owner",
    "evidenceRefs", "nextReview",
  ]);
  return Object.fromEntries(
    Object.entries(input)
      .filter(([key, value]) => !ignored.has(key) && String(value ?? "").trim() !== "")
      .map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]),
  );
}

async function digest(value: unknown) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(value)),
  );
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function requireFields(entity: PrivacyEntity, body: Record<string, unknown>) {
  const need = (field: string, message: string) => {
    if (!cleanText(body[field], 4000)) throw new Error(message);
  };

  if (entity === "privacy_purpose_lawfulness") {
    need("businessPurpose", "Business purpose is required");
    need("lawfulBasis", "Lawful basis is required");
    need("necessityAssessment", "Necessity assessment is required");
    need("minimisationDecision", "Data minimisation decision is required");
  }
  if (entity === "privacy_data_inventory_flows") {
    need("dataCategories", "Data categories are required");
    need("source", "Data source is required");
    need("destinations", "Data destinations are required");
    need("accessRoles", "Access roles are required");
  }
  if (entity === "privacy_rights_requests") {
    need("rightType", "Data subject right type is required");
    need("requestStatus", "Request status is required");
  }
  if (entity === "privacy_third_party_assessments") {
    need("vendorName", "Vendor name is required");
    need("dataShared", "Data shared with the vendor is required");
    need("agreementStatus", "DPA/agreement status is required");
    need("exitDisposition", "End-of-relationship data disposition is required");
  }
  if (entity === "privacy_risk_assessments") {
    need("riskToIndividual", "Risk to the individual is required");
    need("likelihood", "Likelihood is required");
    need("impact", "Impact is required");
    need("controls", "Existing controls are required");
  }
  if (entity === "privacy_dpia_assessments") {
    need("processingDescription", "Processing description is required");
    need("highRiskTrigger", "High-risk trigger is required");
    need("safeguards", "Safeguards are required");
    need("residualRisk", "Residual risk is required");
  }
  if (entity === "privacy_ai_data_assessments") {
    need("personalDataInputs", "Personal data inputs are required");
    need("providerDestinations", "AI/provider destinations are required");
    need("trainingUse", "Training-use determination is required");
    need("automatedDecisioning", "Automated decisioning determination is required");
    need("humanReview", "Human-review control is required");
  }
  if (entity === "privacy_retention_records") {
    need("retentionPurpose", "Retention purpose is required");
    need("retentionPeriod", "Retention period is required");
    need("deletionTrigger", "Deletion trigger is required");
    need("deletionEvidence", "Deletion evidence method is required");
  }
  if (entity === "privacy_governance_evidence") {
    need("accountableOwner", "Accountable owner is required");
    need("controlEvidence", "Control evidence is required");
    need("reviewCadence", "Review cadence is required");
    need("regulatorReadiness", "Regulator-readiness status is required");
  }
}

function makeCode(entity: PrivacyEntity) {
  const prefix = {
    privacy_purpose_lawfulness: "PPL",
    privacy_data_inventory_flows: "PDF",
    privacy_rights_requests: "DSR",
    privacy_third_party_assessments: "PTP",
    privacy_risk_assessments: "PRK",
    privacy_dpia_assessments: "DPIA",
    privacy_ai_data_assessments: "AIDP",
    privacy_retention_records: "RET",
    privacy_governance_evidence: "PGE",
  }[entity];
  return prefix + "-" + Date.now().toString(36).toUpperCase() + "-" +
    crypto.randomUUID().slice(0, 6).toUpperCase();
}

export async function GET(request: Request) {
  try {
    const { db, actor } = await actorFor(request);
    const url = new URL(request.url);
    const requested = url.searchParams.get("entity");
    const entities = requested && isPrivacyEntity(requested) ? [requested] : PRIVACY_ENTITIES;
    const records: Record<string, unknown[]> = {};

    for (const entity of entities) {
      const table = PRIVACY_GOVERNANCE[entity].table;
      records[entity] = await db
        .select()
        .from(table)
        .where(eq(table.organizationId, actor.organizationId))
        .orderBy(desc(table.id))
        .limit(100);
    }

    const privacyRecords = Object.entries(records).flatMap(([entity, rows]) =>
      rows.map((row) => ({ ...(row as Record<string, unknown>), entity })),
    );

    return json({
      actor: {
        displayName: actor.displayName,
        role: actor.role,
        organizationName: actor.organizationName,
      },
      capabilities: capabilitiesFor(actor),
      privacyRecords,
      records,
      framework: {
        domains: [
          "Purpose & lawful processing",
          "Data architecture & movement",
          "Privacy controls & rights",
          "External & high-risk processing",
          "Governance & evidence",
        ],
        sourceSections: 15,
      },
    });
  } catch (error) {
    return errorResponse(error, "privacy-governance.read");
  }
}

export async function POST(request: Request) {
  try {
    const { db, actor } = await actorFor(request);
    const input = await readJsonObject(request);
    const action = cleanText(input.action, 120);
    assertActionAllowed(actor, action);

    if (action === "export_privacy_evidence_package") {
      const systemCode = cleanText(input.systemCode, 200);
      const packageRecords: Record<string, unknown[]> = {};
      for (const entity of PRIVACY_ENTITIES) {
        const table = PRIVACY_GOVERNANCE[entity].table;
        packageRecords[entity] = await db
          .select()
          .from(table)
          .where(
            systemCode
              ? and(
                  eq(table.organizationId, actor.organizationId),
                  eq(table.systemCode, systemCode),
                )
              : eq(table.organizationId, actor.organizationId),
          )
          .orderBy(desc(table.id));
      }
      const body = {
        contract: "sentinel.data-protection.v1",
        framework: "DPO Structural Thinking Framework",
        generatedAt: new Date().toISOString(),
        generatedBy: actor.email,
        organizationId: actor.organizationId,
        systemCode: systemCode || null,
        domains: {
          purposeAndLawfulness: packageRecords.privacy_purpose_lawfulness,
          inventoryAndFlows: packageRecords.privacy_data_inventory_flows,
          rights: packageRecords.privacy_rights_requests,
          thirdParties: packageRecords.privacy_third_party_assessments,
          risk: packageRecords.privacy_risk_assessments,
          dpias: packageRecords.privacy_dpia_assessments,
          aiData: packageRecords.privacy_ai_data_assessments,
          retention: packageRecords.privacy_retention_records,
          governanceEvidence: packageRecords.privacy_governance_evidence,
        },
      };
      return json({ result: body, digest: await digest(body) });
    }

    if (action === "transition_privacy_record") {
      const entity = cleanText(input.entity, 120);
      if (!isPrivacyEntity(entity)) throw new Error("Unknown privacy entity");
      const table = PRIVACY_GOVERNANCE[entity].table;
      const recordCode = cleanText(input.recordCode, 200);
      const expectedState = cleanText(input.expectedState, 100);
      const nextState = cleanText(input.nextState, 100);
      if (!recordCode || !expectedState || !nextState) {
        throw new Error("recordCode, expectedState and nextState are required");
      }
      const existing = await db
        .select()
        .from(table)
        .where(
          and(
            eq(table.organizationId, actor.organizationId),
            eq(table.recordCode, recordCode),
          ),
        )
        .get();
      if (!existing) throw new Error("Privacy record not found");
      if (existing.state !== expectedState) throw new Error("Record changed; refresh and retry");
      if (TERMINAL_STATES.has(existing.state.toLowerCase())) {
        throw new Error("Terminal privacy records cannot be changed");
      }
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db.update(table)
          .set({
            state: nextState,
            contentDigest: await digest({
              priorDigest: existing.contentDigest,
              nextState,
              payload: existing.payload,
            }),
            updatedAt: new Date().toISOString(),
          })
          .where(
            and(
              eq(table.organizationId, actor.organizationId),
              eq(table.recordCode, recordCode),
              eq(table.state, expectedState),
            ),
          )
          .returning(),
        {
          action: "privacy." + entity + ".transitioned",
          entityType: entity,
          entityCode: recordCode,
          details: JSON.stringify({ from: expectedState, to: nextState }),
        },
      );
      if (!rows[0]) throw new Error("Record changed; refresh and retry");
      return json({ result: rows[0] });
    }

    const entity = entityForAction(action);
    if (!entity) throw new Error("UNKNOWN_ACTION");
    const table = PRIVACY_GOVERNANCE[entity].table;
    const body = compactPayload(input);
    requireFields(entity, body);
    const state = cleanText(input.state || "draft", 100) || "draft";
    const systemCode = cleanText(input.systemCode, 200) || null;
    const subjectCode = cleanText(input.subjectCode, 200) || null;
    const jurisdiction = cleanText(input.jurisdiction, 300) || null;
    const owner = cleanText(input.owner || actor.email, 300) || actor.email;
    const evidenceRefs = cleanText(input.evidenceRefs, 4000);
    const nextReview = cleanText(input.nextReview, 100) || null;
    const recordCode = makeCode(entity);
    const contentDigest = await digest({
      entity,
      systemCode,
      subjectCode,
      state,
      jurisdiction,
      owner,
      body,
      evidenceRefs,
      nextReview,
    });

    const rows = await auditedWrite(
      db,
      actor,
      request,
      db.insert(table)
        .values({
          recordCode,
          organizationId: actor.organizationId,
          systemCode,
          subjectCode,
          state,
          jurisdiction,
          owner,
          payload: body,
          contentDigest,
          evidenceRefs,
          nextReview,
          createdBy: actor.email,
          updatedAt: new Date().toISOString(),
        })
        .returning(),
      {
        action: "privacy." + entity + ".created",
        entityType: entity,
        entityCode: recordCode,
        details: JSON.stringify({ systemCode, state, jurisdiction }),
      },
    );
    return json({ result: rows[0] });
  } catch (error) {
    return errorResponse(error, "privacy-governance.write");
  }
}
