/* eslint-disable @typescript-eslint/no-unused-vars */
import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import * as s from "../../../db/schema";
import { actorFor, type Actor } from "../../org-auth";
import { errorResponse, json, readJsonObject } from "../http";
import {
  assertActionAllowed,
  canReadAudit,
  canReadSensitive,
  capabilitiesFor,
} from "./access";
import { audit, auditedBatch, auditedWrite, verifyAuditChain } from "./audit";
import { validateActionPayload } from "./validation";

const id = (prefix: string) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
const allowed = (actor: Actor, roles: string[]) =>
  roles.includes(actor.role) || actor.role === "admin";
const conductGrounds = [
  "unauthorized_confidential_data_entry",
  "approval_threshold_bypass",
  "unauthorized_override",
  "other",
];
const conductStages = [
  "informal_resolution",
  "written_warning",
  "formal_review",
  "separation",
];
const successionRoles = [
  "system_owner",
  "approver",
  "reviewer",
  "dpo",
  "oversight_role",
  "accountable_executive",
];
const reviewStatuses = ["reviewed_no_action", "escalated_to_conduct_case"];
const systemBoundActions = new Set([
  "register_agent",
  "model_version",
  "model_retirement",
  "risk_assessment",
  "guardrail_decision",
  "evidence",
  "incident",
  "assess_public_sector_ai",
  "assess_africa_first",
  "assess_sovereign_resilience",
  "record_recovery_exercise",
  "assess_privacy_compliance",
  "privacy_request",
  "confidential_report",
  "export_package",
]);
const requiredText = (value: unknown, name: string) => {
  const result = String(value ?? "").trim();
  if (!result) throw new Error(`${name} is required`);
  return result;
};
const requiredId = (value: unknown, name: string) => {
  const result = Number(value);
  if (!Number.isInteger(result) || result <= 0)
    throw new Error(`${name} must be a positive integer`);
  return result;
};
const timestamp = (value: string) =>
  Date.parse(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);

export async function GET(request: Request) {
  try {
    const { db, actor } = await actorFor(request);
    const org = actor.organizationId;
    const sensitive = canReadSensitive(actor);
    const auditAccess = canReadAudit(actor);
    const [
      agencyAssessments,
      africaFirstAssessments,
      sovereignResilienceAssessments,
      agrifoodSupplyAssessments,
      implementationAssessments,
      infrastructureDividendAssessments,
      foresightScenarios,
      privacyComplianceAssessments,
      legalSources,
      systems,
      deploymentGates,
      agents,
      grantRows,
      models,
      risks,
      controls,
      decisions,
      approvalRows,
      overrideRows,
      evidenceRows,
      incidentRows,
      capaRows,
      privacyRows,
      policyRows,
      auditRows,
      userRows,
    ] = await Promise.all([
      db
        .select()
        .from(s.agencyAssessments)
        .where(eq(s.agencyAssessments.organizationId, org))
        .orderBy(desc(s.agencyAssessments.id))
        .limit(100),
      db
        .select()
        .from(s.africaFirstAssessments)
        .where(eq(s.africaFirstAssessments.organizationId, org))
        .orderBy(desc(s.africaFirstAssessments.id))
        .limit(100),
      db
        .select()
        .from(s.sovereignResilienceAssessments)
        .where(eq(s.sovereignResilienceAssessments.organizationId, org))
        .orderBy(desc(s.sovereignResilienceAssessments.id))
        .limit(100),
      db
        .select()
        .from(s.agrifoodSupplyAssessments)
        .where(eq(s.agrifoodSupplyAssessments.organizationId, org))
        .orderBy(desc(s.agrifoodSupplyAssessments.id))
        .limit(100),
      db
        .select()
        .from(s.implementationAssessments)
        .where(eq(s.implementationAssessments.organizationId, org))
        .orderBy(desc(s.implementationAssessments.id))
        .limit(100),
      db
        .select()
        .from(s.infrastructureDividendAssessments)
        .where(eq(s.infrastructureDividendAssessments.organizationId, org))
        .orderBy(desc(s.infrastructureDividendAssessments.id))
        .limit(100),
      db
        .select()
        .from(s.foresightScenarios)
        .where(eq(s.foresightScenarios.organizationId, org))
        .orderBy(desc(s.foresightScenarios.id))
        .limit(100),
      db
        .select()
        .from(s.privacyComplianceAssessments)
        .where(eq(s.privacyComplianceAssessments.organizationId, org))
        .orderBy(desc(s.privacyComplianceAssessments.id))
        .limit(100),
      db
        .select()
        .from(s.legalSources)
        .where(eq(s.legalSources.organizationId, org))
        .orderBy(desc(s.legalSources.id))
        .limit(200),
      db
        .select()
        .from(s.aiSystems)
        .where(eq(s.aiSystems.organizationId, org))
        .orderBy(desc(s.aiSystems.id))
        .limit(100),
      db
        .select()
        .from(s.deploymentGates)
        .where(eq(s.deploymentGates.organizationId, org))
        .orderBy(desc(s.deploymentGates.id))
        .limit(100),
      db
        .select()
        .from(s.aiAgents)
        .where(eq(s.aiAgents.organizationId, org))
        .orderBy(desc(s.aiAgents.id))
        .limit(100),
      db
        .select()
        .from(s.accessGrants)
        .where(eq(s.accessGrants.organizationId, org))
        .orderBy(desc(s.accessGrants.id))
        .limit(100),
      db
        .select()
        .from(s.modelVersions)
        .where(eq(s.modelVersions.organizationId, org))
        .orderBy(desc(s.modelVersions.id))
        .limit(50),
      db
        .select()
        .from(s.riskAssessments)
        .where(eq(s.riskAssessments.organizationId, org))
        .orderBy(desc(s.riskAssessments.id))
        .limit(50),
      db
        .select()
        .from(s.controls)
        .where(eq(s.controls.organizationId, org))
        .orderBy(desc(s.controls.id))
        .limit(100),
      db
        .select()
        .from(s.guardrailDecisions)
        .where(eq(s.guardrailDecisions.organizationId, org))
        .orderBy(desc(s.guardrailDecisions.id))
        .limit(100),
      db
        .select()
        .from(s.approvals)
        .where(eq(s.approvals.organizationId, org))
        .orderBy(desc(s.approvals.id))
        .limit(100),
      db
        .select()
        .from(s.overrides)
        .where(eq(s.overrides.organizationId, org))
        .orderBy(desc(s.overrides.id))
        .limit(100),
      db
        .select()
        .from(s.evidence)
        .where(eq(s.evidence.organizationId, org))
        .orderBy(desc(s.evidence.id))
        .limit(100),
      db
        .select()
        .from(s.incidents)
        .where(eq(s.incidents.organizationId, org))
        .orderBy(desc(s.incidents.id))
        .limit(100),
      db
        .select()
        .from(s.correctiveActions)
        .where(eq(s.correctiveActions.organizationId, org))
        .orderBy(desc(s.correctiveActions.id))
        .limit(100),
      sensitive
        ? db
            .select()
            .from(s.privacyRequests)
            .where(eq(s.privacyRequests.organizationId, org))
            .orderBy(desc(s.privacyRequests.id))
            .limit(100)
        : Promise.resolve([]),
      db
        .select()
        .from(s.policies)
        .where(eq(s.policies.organizationId, org))
        .orderBy(desc(s.policies.id))
        .limit(100),
      auditAccess
        ? db
            .select()
            .from(s.auditEvents)
            .where(eq(s.auditEvents.organizationId, org))
            .orderBy(desc(s.auditEvents.id))
            .limit(100)
        : Promise.resolve([]),
      sensitive
        ? db
            .select({
              id: s.users.id,
              email: s.users.email,
              displayName: s.users.displayName,
              role: s.users.role,
              status: s.users.status,
            })
            .from(s.users)
            .where(eq(s.users.organizationId, org))
        : Promise.resolve([]),
    ]);
    const publicSectorAssessments = await db
      .select()
      .from(s.publicSectorAssessments)
      .where(eq(s.publicSectorAssessments.organizationId, org))
      .orderBy(desc(s.publicSectorAssessments.id))
      .limit(100);
    const recoveryExercises = await db
      .select()
      .from(s.recoveryExercises)
      .where(eq(s.recoveryExercises.organizationId, org))
      .orderBy(desc(s.recoveryExercises.id))
      .limit(100);
    const workforceAbsorptionAssessments = await db
      .select()
      .from(s.workforceAbsorptionAssessments)
      .where(eq(s.workforceAbsorptionAssessments.organizationId, org))
      .orderBy(desc(s.workforceAbsorptionAssessments.id))
      .limit(100);
    const [
      vendorRisk,
      competencyRecords,
      modelRetirements,
      confidentialReports,
    ] = await Promise.all([
      db
        .select()
        .from(s.vendorRiskRegister)
        .where(eq(s.vendorRiskRegister.organizationId, org))
        .orderBy(desc(s.vendorRiskRegister.id))
        .limit(100),
      db
        .select()
        .from(s.competencyRecords)
        .where(eq(s.competencyRecords.organizationId, org))
        .orderBy(desc(s.competencyRecords.id))
        .limit(100),
      db
        .select()
        .from(s.modelRetirements)
        .where(eq(s.modelRetirements.organizationId, org))
        .orderBy(desc(s.modelRetirements.id))
        .limit(100),
      sensitive
        ? db
            .select({
              id: s.confidentialReports.id,
              trackingCode: s.confidentialReports.trackingCode,
              category: s.confidentialReports.category,
              systemCode: s.confidentialReports.systemCode,
              status: s.confidentialReports.status,
              createdAt: s.confidentialReports.createdAt,
            })
            .from(s.confidentialReports)
            .where(eq(s.confidentialReports.organizationId, org))
            .orderBy(desc(s.confidentialReports.id))
            .limit(100)
        : Promise.resolve([]),
    ]);
    const privileged = allowed(actor, ["admin", "auditor"]);
    const [
      workforceConductCases,
      workforceConductStageEvents,
      accountabilitySuccessions,
      conductPatternFlags,
    ] = privileged
      ? await Promise.all([
          db
            .select()
            .from(s.workforceConductCases)
            .where(eq(s.workforceConductCases.organizationId, org))
            .orderBy(desc(s.workforceConductCases.id))
            .limit(100),
          db
            .select()
            .from(s.workforceConductStageEvents)
            .where(eq(s.workforceConductStageEvents.organizationId, org))
            .orderBy(desc(s.workforceConductStageEvents.id))
            .limit(200),
          db
            .select()
            .from(s.accountabilitySuccessions)
            .where(eq(s.accountabilitySuccessions.organizationId, org))
            .orderBy(desc(s.accountabilitySuccessions.id))
            .limit(100),
          db
            .select()
            .from(s.conductPatternFlags)
            .where(eq(s.conductPatternFlags.organizationId, org))
            .orderBy(desc(s.conductPatternFlags.id))
            .limit(100),
        ])
      : [[], [], [], []];
    const accountableExecutive = await db
      .select({
        id: s.users.id,
        email: s.users.email,
        displayName: s.users.displayName,
        status: s.users.status,
      })
      .from(s.users)
      .where(
        and(
          eq(s.users.organizationId, org),
          eq(s.users.role, "accountable_executive"),
          eq(s.users.status, "active"),
        ),
      )
      .get();
    const now = Date.now();
    const accessGrants = grantRows.map((g) =>
      g.status === "active" && Date.parse(g.expiresAt) <= now
        ? { ...g, status: "expired" }
        : g,
    );
    const datedLegalSources = legalSources.map((row) => ({
      ...row,
      status: Date.parse(row.nextReview) < now ? "REVIEW DUE" : row.status,
    }));
    const expiredCompetencies = competencyRecords.filter(
      (row) => Date.parse(row.expiresAt) < now,
    ).length;
    const highRiskVendors = vendorRisk.filter((row) =>
      ["High", "Critical"].includes(row.residualRisk),
    ).length;
    const strategicDependencies = sovereignResilienceAssessments.filter(
      (row) => row.outcome === "STRATEGIC DEPENDENCY",
    ).length;
    const overdueReviews = vendorRisk.filter(
      (row) => Date.parse(row.nextReview) < now,
    ).length;
    const expiringAuthorizations = accessGrants.filter(
      (row) =>
        row.status === "active" &&
        Date.parse(row.expiresAt) <= now + 7 * 86400000,
    ).length;
    const openIncidents = incidentRows.filter(
      (row) => row.status !== "closed",
    ).length;
    const complianceDashboard = [
      {
        generatedAt: new Date().toISOString(),
        overdueReviews,
        expiringAuthorizations,
        openIncidents,
        expiredCompetencies,
        highRiskVendors,
        strategicDependencies,
      },
    ];
    const boardReport = [
      {
        period: new Date().toISOString().slice(0, 7),
        totalSystems: systems.length,
        criticalSystems: systems.filter((row) => row.risk === "Critical")
          .length,
        approvedDeployments: deploymentGates.filter(
          (row) => row.outcome === "APPROVED",
        ).length,
        openIncidents,
        highRiskVendors,
        strategicDependencies,
        actionsRequired:
          overdueReviews +
          expiredCompetencies +
          openIncidents +
          highRiskVendors +
          strategicDependencies,
      },
    ];
    const auditIntegrity = auditAccess ? await verifyAuditChain(db, org) : null;
    return json({
      actor,
      capabilities: capabilitiesFor(actor),
      agencyAssessments,
      africaFirstAssessments,
      sovereignResilienceAssessments,
      recoveryExercises,
      agrifoodSupplyAssessments,
      implementationAssessments,
      workforceAbsorptionAssessments,
      infrastructureDividendAssessments,
      foresightScenarios,
      privacyComplianceAssessments,
      legalSources: datedLegalSources,
      publicSectorAssessments,
      vendorRisk,
      competencyRecords,
      modelRetirements,
      confidentialReports: sensitive ? confidentialReports : [],
      complianceDashboard,
      boardReport,
      systems,
      deploymentGates,
      agents,
      accessGrants,
      models,
      risks,
      controls,
      decisions,
      approvals: approvalRows,
      overrides: overrideRows,
      evidence: evidenceRows,
      incidents: incidentRows,
      capas: capaRows,
      privacy: sensitive ? privacyRows : [],
      policies: policyRows,
      audit: auditAccess ? auditRows : [],
      auditIntegrity,
      users: sensitive ? userRows : [],
      accountableExecutive: accountableExecutive ?? null,
      workforceConductCases,
      workforceConductStageEvents,
      accountabilitySuccessions,
      conductPatternFlags,
    });
  } catch (e) {
    return errorResponse(e, "governance.read");
  }
}

export async function POST(request: Request) {
  try {
    const { db, actor } = await actorFor(request);
    const b = validateActionPayload(await readJsonObject(request));
    const action = String(b.action);
    assertActionAllowed(actor, action);
    const org = actor.organizationId;
    let result: unknown;
    if (
      systemBoundActions.has(action) &&
      String(b.systemCode).toLowerCase() !== "not applicable"
    ) {
      const system = await db
        .select({ id: s.aiSystems.id })
        .from(s.aiSystems)
        .where(
          and(
            eq(s.aiSystems.organizationId, org),
            eq(s.aiSystems.systemCode, String(b.systemCode)),
          ),
        )
        .get();
      if (!system) throw new Error("AI system not found");
    }
    if (["approve", "request_override"].includes(action)) {
      const decision = await db
        .select({ id: s.guardrailDecisions.id })
        .from(s.guardrailDecisions)
        .where(
          and(
            eq(s.guardrailDecisions.organizationId, org),
            eq(s.guardrailDecisions.decisionCode, String(b.decisionCode)),
          ),
        )
        .get();
      if (!decision) throw new Error("Guardrail decision not found");
    }
    if (action === "capa") {
      const incident = await db
        .select({ id: s.incidents.id })
        .from(s.incidents)
        .where(
          and(
            eq(s.incidents.organizationId, org),
            eq(s.incidents.incidentCode, String(b.incidentCode)),
          ),
        )
        .get();
      if (!incident) throw new Error("Incident not found");
    }
    if (action === "invite_user") {
      if (!allowed(actor, ["admin"])) throw new Error("ACCESS_DENIED");
      const email = String(b.email).toLowerCase();
      const role = String(b.role);
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .insert(s.users)
            .values({
              email,
              displayName: String(b.displayName),
              role,
              organizationId: org,
            })
            .returning(),
        ],
        {
          action: "user.role_recorded",
          entityType: "user",
          entityCode: email,
          details: JSON.stringify({ role, siteAccessGranted: false }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "update_user") {
      const userId = requiredId(b.userId, "userId");
      const role = String(b.role);
      const status = String(b.status);
      const target = await db
        .select()
        .from(s.users)
        .where(and(eq(s.users.id, userId), eq(s.users.organizationId, org)))
        .get();
      if (!target) throw new Error("Organization user not found");
      if (userId === actor.userId && status !== "active")
        throw new Error("You cannot deactivate your own account");
      if (
        target.role === "admin" &&
        (role !== "admin" || status !== "active")
      ) {
        const admins = await db
          .select({ id: s.users.id })
          .from(s.users)
          .where(
            and(
              eq(s.users.organizationId, org),
              eq(s.users.role, "admin"),
              eq(s.users.status, "active"),
            ),
          );
        if (admins.length <= 1)
          throw new Error(
            "The organization must retain an active administrator",
          );
      }
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .update(s.users)
            .set({ role, status })
            .where(
              and(
                eq(s.users.id, userId),
                eq(s.users.organizationId, org),
                eq(s.users.role, target.role),
                eq(s.users.status, target.status),
              ),
            )
            .returning(),
        ],
        {
          action: "user.access_updated",
          entityType: "user",
          entityCode: target.email,
          details: JSON.stringify({
            from: { role: target.role, status: target.status },
            to: { role, status },
          }),
          guard: sql`changes() = 1`,
        },
      );
      const row = rows[0];
      if (!row) throw new Error("User changed; refresh and try again");
      result = row;
    } else if (action === "designate_accountable_executive") {
      if (!allowed(actor, ["admin"])) throw new Error("ACCESS_DENIED");
      const userId = requiredId(b.userId, "userId");
      const target = await db
        .select()
        .from(s.users)
        .where(
          and(
            eq(s.users.id, userId),
            eq(s.users.organizationId, org),
            eq(s.users.status, "active"),
          ),
        )
        .get();
      if (!target) throw new Error("Active organization user not found");
      await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .update(s.users)
            .set({ role: "admin" })
            .where(
              and(
                eq(s.users.organizationId, org),
                eq(s.users.role, "accountable_executive"),
                ne(s.users.id, userId),
              ),
            ),
          db
            .update(s.users)
            .set({ role: "accountable_executive" })
            .where(
              and(eq(s.users.organizationId, org), eq(s.users.id, userId)),
            ),
        ],
        {
          action: "accountable_executive.designated",
          entityType: "user",
          entityCode: target.email,
          details: JSON.stringify({
            userId: target.id,
            priorRole: target.role,
          }),
          guard: sql`changes() = 1`,
        },
      );
      result = {
        id: target.id,
        email: target.email,
        displayName: target.displayName,
        role: "accountable_executive",
      };
    } else if (action === "open_workforce_conduct_case") {
      if (!allowed(actor, ["admin"])) throw new Error("ACCESS_DENIED");
      const subjectUserId = requiredId(b.subjectUserId, "subjectUserId");
      const grounds = requiredText(b.grounds, "grounds");
      const description = requiredText(b.description, "description");
      if (!conductGrounds.includes(grounds))
        throw new Error("Invalid conduct grounds");
      if (subjectUserId === actor.userId)
        throw new Error("Cannot open a conduct case against yourself");
      const subject = await db
        .select()
        .from(s.users)
        .where(
          and(eq(s.users.id, subjectUserId), eq(s.users.organizationId, org)),
        )
        .get();
      if (!subject) throw new Error("Subject user not found");
      const investigatorUserId =
        b.investigatorUserId == null
          ? null
          : requiredId(b.investigatorUserId, "investigatorUserId");
      if (investigatorUserId === subjectUserId)
        throw new Error("Investigator cannot be the subject of the case");
      if (investigatorUserId) {
        const investigator = await db
          .select()
          .from(s.users)
          .where(
            and(
              eq(s.users.id, investigatorUserId),
              eq(s.users.organizationId, org),
              eq(s.users.status, "active"),
            ),
          )
          .get();
        if (!investigator) throw new Error("Active investigator not found");
      }
      if (
        b.linkedOverrideAuthorizerId != null &&
        investigatorUserId ===
          requiredId(b.linkedOverrideAuthorizerId, "linkedOverrideAuthorizerId")
      )
        throw new Error(
          "Investigator cannot be the person who authorized the action under review",
        );
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.workforceConductCases)
          .values({
            organizationId: org,
            subjectUserId,
            reportedByUserId: actor.userId,
            linkedWhistleblowerReportId:
              b.linkedWhistleblowerReportId == null
                ? null
                : requiredId(
                    b.linkedWhistleblowerReportId,
                    "linkedWhistleblowerReportId",
                  ),
            grounds,
            description,
            stage: "informal_resolution",
            investigatorUserId,
            investigatorConflictChecked: investigatorUserId !== null,
          })
          .returning(),
        {
          action: "workforce_conduct.case_opened",
          entityType: "workforce_conduct_case",
          entityCode: `subject:${subjectUserId}`,
          details: JSON.stringify({
            subjectUserId,
            grounds,
            investigatorUserId,
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "advance_workforce_conduct_stage") {
      if (!allowed(actor, ["admin"])) throw new Error("ACCESS_DENIED");
      const caseId = requiredId(b.caseId, "caseId");
      const nextStage = requiredText(b.stage, "stage");
      if (![...conductStages, "closed_no_action"].includes(nextStage))
        throw new Error("Invalid conduct stage");
      const target = await db
        .select()
        .from(s.workforceConductCases)
        .where(
          and(
            eq(s.workforceConductCases.id, caseId),
            eq(s.workforceConductCases.organizationId, org),
          ),
        )
        .get();
      if (!target) throw new Error("Conduct case not found");
      if (target.subjectUserId === actor.userId)
        throw new Error("Cannot act on your own conduct case");
      if (["separation", "closed_no_action"].includes(target.stage))
        throw new Error("Conduct case is already closed");
      const currentIndex = conductStages.indexOf(target.stage);
      const validNext =
        nextStage === "closed_no_action" ||
        conductStages[currentIndex + 1] === nextStage;
      if (!validNext) throw new Error("Invalid conduct stage transition");
      const outcome = ["separation", "closed_no_action"].includes(nextStage)
        ? requiredText(b.outcome, "outcome")
        : b.outcome == null
          ? undefined
          : String(b.outcome);
      await auditedBatch(
        db,
        actor,
        request,
        [
          db.insert(s.workforceConductStageEvents).values({
            organizationId: org,
            caseId,
            stage: nextStage,
            actorUserId: actor.userId,
            notes: b.notes == null ? null : String(b.notes),
          }),
          db
            .update(s.workforceConductCases)
            .set({
              stage: nextStage,
              outcome,
              outcomeDate: ["separation", "closed_no_action"].includes(
                nextStage,
              )
                ? new Date().toISOString()
                : undefined,
            })
            .where(
              and(
                eq(s.workforceConductCases.id, caseId),
                eq(s.workforceConductCases.organizationId, org),
                eq(s.workforceConductCases.stage, target.stage),
              ),
            ),
        ],
        {
          action: "workforce_conduct.stage_advanced",
          entityType: "workforce_conduct_case",
          entityCode: String(caseId),
          details: JSON.stringify({ from: target.stage, to: nextStage }),
          guard: sql`changes() = 1`,
        },
      );
      result = { caseId, stage: nextStage };
    } else if (action === "open_accountability_succession") {
      if (!allowed(actor, ["admin"])) throw new Error("ACCESS_DENIED");
      const outgoingUserId = requiredId(b.outgoingUserId, "outgoingUserId");
      const role = requiredText(b.role, "role");
      const entityType = requiredText(b.entityType, "entityType");
      const entityId = requiredText(b.entityId, "entityId");
      const triggerReason = requiredText(b.triggerReason, "triggerReason");
      const handoffDeadline = requiredText(
        b.handoffDeadline,
        "handoffDeadline",
      );
      if (!successionRoles.includes(role))
        throw new Error("Invalid succession role");
      if (!["exit", "reassignment"].includes(triggerReason))
        throw new Error("Invalid succession trigger");
      if (!Number.isFinite(Date.parse(handoffDeadline)))
        throw new Error("Invalid handoff deadline");
      const outgoing = await db
        .select()
        .from(s.users)
        .where(
          and(eq(s.users.id, outgoingUserId), eq(s.users.organizationId, org)),
        )
        .get();
      if (!outgoing) throw new Error("Outgoing user not found");
      const incomingUserId =
        b.incomingUserId == null
          ? null
          : requiredId(b.incomingUserId, "incomingUserId");
      if (incomingUserId === outgoingUserId)
        throw new Error("Incoming user must differ from outgoing user");
      if (incomingUserId) {
        const incoming = await db
          .select()
          .from(s.users)
          .where(
            and(
              eq(s.users.id, incomingUserId),
              eq(s.users.organizationId, org),
              eq(s.users.status, "active"),
            ),
          )
          .get();
        if (!incoming) throw new Error("Active incoming user not found");
      }
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.accountabilitySuccessions)
          .values({
            organizationId: org,
            outgoingUserId,
            incomingUserId,
            role,
            entityType,
            entityId,
            triggerReason,
            handoffDeadline,
            status: incomingUserId ? "reassigned" : "pending",
            reassignedAt: incomingUserId ? new Date().toISOString() : null,
          })
          .returning(),
        {
          action: "accountability_succession.opened",
          entityType,
          entityCode: entityId,
          details: JSON.stringify({
            outgoingUserId,
            incomingUserId,
            role,
            handoffDeadline,
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "reassign_accountability_succession") {
      if (!allowed(actor, ["admin"])) throw new Error("ACCESS_DENIED");
      const successionId = requiredId(b.successionId, "successionId");
      const incomingUserId = requiredId(b.incomingUserId, "incomingUserId");
      const target = await db
        .select()
        .from(s.accountabilitySuccessions)
        .where(
          and(
            eq(s.accountabilitySuccessions.id, successionId),
            eq(s.accountabilitySuccessions.organizationId, org),
          ),
        )
        .get();
      if (!target) throw new Error("Succession record not found");
      if (target.status === "reassigned")
        throw new Error("Succession is already reassigned");
      if (incomingUserId === target.outgoingUserId)
        throw new Error("Incoming user must differ from outgoing user");
      const incoming = await db
        .select()
        .from(s.users)
        .where(
          and(
            eq(s.users.id, incomingUserId),
            eq(s.users.organizationId, org),
            eq(s.users.status, "active"),
          ),
        )
        .get();
      if (!incoming) throw new Error("Active incoming user not found");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .update(s.accountabilitySuccessions)
          .set({
            incomingUserId,
            status: "reassigned",
            reassignedAt: new Date().toISOString(),
          })
          .where(
            and(
              eq(s.accountabilitySuccessions.id, successionId),
              eq(s.accountabilitySuccessions.organizationId, org),
              eq(s.accountabilitySuccessions.status, target.status),
            ),
          )
          .returning(),
        {
          action: "accountability_succession.reassigned",
          entityType: "accountability_succession",
          entityCode: String(successionId),
          details: JSON.stringify({ incomingUserId }),
          guard: sql`changes() = 1`,
        },
      );
      if (!rows[0])
        throw new Error("Succession changed; refresh and try again");
      result = rows[0];
    } else if (action === "flag_overdue_successions") {
      if (!allowed(actor, ["admin", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const pending = await db
        .select()
        .from(s.accountabilitySuccessions)
        .where(
          and(
            eq(s.accountabilitySuccessions.organizationId, org),
            eq(s.accountabilitySuccessions.status, "pending"),
          ),
        );
      const overdue = pending.filter(
        (row) => timestamp(row.handoffDeadline) < Date.now(),
      );
      result = { flagged: overdue.length, ids: overdue.map((row) => row.id) };
      if (overdue.length) {
        await auditedWrite(
          db,
          actor,
          request,
          db
            .update(s.accountabilitySuccessions)
            .set({ status: "flagged_unowned" })
            .where(
              and(
                eq(s.accountabilitySuccessions.organizationId, org),
                eq(s.accountabilitySuccessions.status, "pending"),
                inArray(
                  s.accountabilitySuccessions.id,
                  overdue.map((row) => row.id),
                ),
              ),
            ),
          {
            action: "accountability_succession.overdue_scan",
            entityType: "accountability_succession",
            entityCode: "overdue-scan",
            details: JSON.stringify(result),
            guard: sql`changes() = ${overdue.length}`,
          },
        );
      } else {
        await audit(
          db,
          actor,
          request,
          "accountability_succession.overdue_scan",
          "accountability_succession",
          "overdue-scan",
          JSON.stringify(result),
        );
      }
    } else if (action === "vendor_risk") {
      if (!allowed(actor, ["admin", "system_owner", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const score = Number(b.riskScore);
      if (!Number.isFinite(score) || score < 0 || score > 100)
        throw new Error("Risk score must be between 0 and 100");
      const code = id("VND");
      const status =
        ["High", "Critical"].includes(String(b.residualRisk)) ||
        String(b.rightToAudit) === "Missing"
          ? "ACTION REQUIRED"
          : "MONITORED";
      const vendorName = String(b.vendorName);
      const residualRisk = String(b.residualRisk);
      const rightToAudit = String(b.rightToAudit);
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.vendorRiskRegister)
          .values({
            vendorCode: code,
            organizationId: org,
            vendorName,
            serviceType: String(b.serviceType),
            aiInvolvement: String(b.aiInvolvement),
            linkedSystems: String(b.linkedSystems),
            certifications: String(b.certifications),
            certificationEvidence: String(b.certificationEvidence),
            subprocessors: String(b.subprocessors),
            rightToAudit,
            contractEnd: String(b.contractEnd),
            inherentRisk: String(b.inherentRisk),
            residualRisk,
            vendorClaimsVerified: String(b.vendorClaimsVerified),
            continuityPlan: String(b.continuityPlan),
            riskScore: score,
            status,
            assessedBy: actor.email,
            nextReview: String(b.nextReview),
          })
          .returning(),
        {
          action: "vendor.risk_registered",
          entityType: "vendor",
          entityCode: code,
          details: JSON.stringify({
            vendorName,
            residualRisk,
            riskScore: score,
            status,
            rightToAudit,
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "competency_record") {
      if (!allowed(actor, ["admin", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      if (Date.parse(String(b.expiresAt)) <= Date.parse(String(b.completedAt)))
        throw new Error("Expiry must be after completion");
      const code = id("CMP");
      const status =
        Date.parse(String(b.expiresAt)) < Date.now()
          ? "EXPIRED"
          : Date.parse(String(b.expiresAt)) < Date.now() + 30 * 86400000
            ? "EXPIRING"
            : "CURRENT";
      const personEmail = String(b.personEmail).toLowerCase();
      const governanceRole = String(b.governanceRole);
      const trainingName = String(b.trainingName);
      const expiresAt = String(b.expiresAt);
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.competencyRecords)
          .values({
            recordCode: code,
            organizationId: org,
            personEmail,
            governanceRole,
            trainingName,
            competencyLevel: String(b.competencyLevel),
            assessmentMethod: String(b.assessmentMethod),
            completedAt: String(b.completedAt),
            expiresAt,
            evidenceReference: String(b.evidenceReference),
            status,
            recordedBy: actor.email,
          })
          .returning(),
        {
          action: "competency.recorded",
          entityType: "competency_record",
          entityCode: code,
          details: JSON.stringify({
            personEmail,
            role: governanceRole,
            training: trainingName,
            status,
            expiresAt,
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "model_retirement") {
      if (!allowed(actor, ["admin", "system_owner", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const code = id("RET");
      const systemCode = String(b.systemCode);
      const modelVersion = String(b.modelVersion);
      const reason = String(b.reason);
      const retirementDate = String(b.retirementDate);
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.modelRetirements)
          .values({
            retirementCode: code,
            organizationId: org,
            systemCode,
            modelVersion,
            reason,
            retirementDate,
            dataRetentionPlan: String(b.dataRetentionPlan),
            dependencyNotifications: String(b.dependencyNotifications),
            fallbackModel: String(b.fallbackModel),
            evidenceArchive: String(b.evidenceArchive),
            requestedBy: actor.email,
            status: "PLANNED",
          })
          .returning(),
        {
          action: "model.retirement_planned",
          entityType: "model_retirement",
          entityCode: code,
          details: JSON.stringify({
            systemCode,
            modelVersion,
            reason,
            retirementDate,
            status: "PLANNED",
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "model_retirement_transition") {
      if (!allowed(actor, ["admin", "approver", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const target = await db
        .select()
        .from(s.modelRetirements)
        .where(
          and(
            eq(s.modelRetirements.organizationId, org),
            eq(s.modelRetirements.retirementCode, String(b.retirementCode)),
          ),
        )
        .get();
      if (!target) throw new Error("Retirement record not found");
      const transition = String(b.transition);
      const map: Record<string, { from: string; to: string }> = {
        notify: { from: "PLANNED", to: "NOTIFIED" },
        decommission: { from: "NOTIFIED", to: "DECOMMISSIONED" },
        archive: { from: "DECOMMISSIONED", to: "ARCHIVED" },
      };
      const step = map[transition];
      if (!step || target.status !== step.from)
        throw new Error("Invalid retirement transition");
      if (transition === "decommission" && target.requestedBy === actor.email)
        throw new Error("Requester cannot approve their own decommissioning");
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .update(s.modelRetirements)
            .set({
              status: step.to,
              approvedBy:
                transition === "decommission" ? actor.email : target.approvedBy,
            })
            .where(
              and(
                eq(s.modelRetirements.organizationId, org),
                eq(s.modelRetirements.retirementCode, target.retirementCode),
                eq(s.modelRetirements.status, target.status),
              ),
            )
            .returning(),
        ],
        {
          action: `model.retirement_${transition}d`,
          entityType: "model_retirement",
          entityCode: target.retirementCode,
          details: JSON.stringify({
            systemCode: target.systemCode,
            modelVersion: target.modelVersion,
            from: target.status,
            to: step.to,
            actor: actor.email,
          }),
          guard: sql`changes() = 1`,
        },
      );
      if (!rows[0])
        throw new Error("Retirement record changed; refresh and try again");
      result = {
        ...target,
        status: step.to,
        approvedBy:
          transition === "decommission" ? actor.email : target.approvedBy,
      };
    } else if (action === "confidential_report") {
      const code = id("SAFE");
      const category = String(b.category);
      const systemCode = String(b.systemCode);
      const confidentialActor = {
        ...actor,
        email: "confidential-reporter",
        displayName: "Confidential reporter",
      };
      const rows = await auditedWrite(
        db,
        confidentialActor,
        request,
        db
          .insert(s.confidentialReports)
          .values({
            trackingCode: code,
            organizationId: org,
            category,
            systemCode,
            description: String(b.description),
            retaliationConcern: String(b.retaliationConcern),
            status: "RECEIVED",
          })
          .returning(),
        {
          action: "confidential_report.received",
          entityType: "confidential_report",
          entityCode: code,
          details: JSON.stringify({ category, systemCode, status: "RECEIVED" }),
        },
      );
      const row = rows[0];
      result = { trackingCode: row.trackingCode, status: row.status };
    } else if (action === "assess_workforce_absorption") {
      if (!allowed(actor, ["admin", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const checks = [
        String(b.skillsPipeline) === "Operational",
        String(b.entryLevelRoles) === "Funded",
        String(b.paidInternships) === "Operational",
        String(b.experienceBarrier) === "Complete",
        String(b.skillsBasedHiring) === "Operational",
        String(b.remoteWorkPolicy) === "Operational",
        String(b.managerReadiness) === "Complete",
        String(b.outputBasedPerformance) === "Operational",
        String(b.localOperationsRoles) === "Funded",
        String(b.retentionPathway) === "Operational",
        String(b.regionalAccess) === "National",
        String(b.conversionTarget).trim().length > 10,
        String(b.outcomeEvidence).trim().length > 10,
      ];
      const readinessScore = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );
      const outcome =
        readinessScore >= 85
          ? "ABSORPTION READY"
          : readinessScore >= 55
            ? "TRANSITION GAP"
            : "PAPER READINESS";
      const code = id("WRK");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.workforceAbsorptionAssessments)
          .values({
            assessmentCode: code,
            organizationId: org,
            jurisdiction: String(b.jurisdiction),
            institution: String(b.institution),
            youthCohort: String(b.youthCohort),
            skillsPipeline: String(b.skillsPipeline),
            entryLevelRoles: String(b.entryLevelRoles),
            paidInternships: String(b.paidInternships),
            experienceBarrier: String(b.experienceBarrier),
            skillsBasedHiring: String(b.skillsBasedHiring),
            remoteWorkPolicy: String(b.remoteWorkPolicy),
            managerReadiness: String(b.managerReadiness),
            outputBasedPerformance: String(b.outputBasedPerformance),
            localOperationsRoles: String(b.localOperationsRoles),
            retentionPathway: String(b.retentionPathway),
            regionalAccess: String(b.regionalAccess),
            conversionTarget: String(b.conversionTarget),
            outcomeEvidence: String(b.outcomeEvidence),
            readinessScore,
            outcome,
            assessedBy: actor.email,
            reviewDate: String(b.reviewDate),
          })
          .returning(),
        {
          action: "workforce.absorption_assessed",
          entityType: "workforce_absorption_assessment",
          entityCode: code,
          details: JSON.stringify({
            jurisdiction: String(b.jurisdiction),
            institution: String(b.institution),
            readinessScore,
            outcome,
            failedChecks: checks
              .map((ok, index) =>
                ok
                  ? null
                  : [
                      "skills pipeline",
                      "entry-level roles",
                      "paid internships",
                      "experience barriers",
                      "skills-based hiring",
                      "remote work",
                      "manager readiness",
                      "output-based performance",
                      "local operations roles",
                      "retention pathway",
                      "regional access",
                      "conversion target",
                      "outcome evidence",
                    ][index],
              )
              .filter(Boolean),
          }),
          guard: sql`changes() = 1`,
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "assess_public_sector_ai") {
      if (!allowed(actor, ["admin", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const checks = [
        String(b.legitimatePurpose).trim().length > 10,
        String(b.lessIntrusiveAlternative) === "Complete",
        String(b.publicValueMeasure).trim().length > 10,
        String(b.dueProcess) === "Complete",
        String(b.citizenNotice) === "Complete",
        String(b.explanationProcedure) === "Operational",
        String(b.contestability) === "Operational",
        String(b.errorCorrection) === "Operational",
        String(b.meaningfulHumanControl) === "Demonstrated",
        String(b.dataQuality) === "Complete",
        String(b.distributiveImpact) === "Complete",
        ["Complete", "Not applicable"].includes(
          String(b.surveillanceNecessity),
        ),
        String(b.procurementAuditRights) === "Enforceable",
        String(b.vendorExit) === "Enforceable",
        ["Complete", "Not applicable"].includes(String(b.generativeAiControls)),
      ];
      const readinessScore = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );
      const outcome =
        readinessScore >= 85
          ? "DEMOCRATIC CONTROL READY"
          : readinessScore >= 55
            ? "PUBLIC-VALUE GAPS"
            : "ACCOUNTABILITY FAILURE";
      const code = id("PUB");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.publicSectorAssessments)
          .values({
            assessmentCode: code,
            organizationId: org,
            systemCode: String(b.systemCode),
            agency: String(b.agency),
            publicDecision: String(b.publicDecision),
            aiRole: String(b.aiRole),
            legitimatePurpose: String(b.legitimatePurpose),
            lessIntrusiveAlternative: String(b.lessIntrusiveAlternative),
            publicValueMeasure: String(b.publicValueMeasure),
            dueProcess: String(b.dueProcess),
            citizenNotice: String(b.citizenNotice),
            explanationProcedure: String(b.explanationProcedure),
            contestability: String(b.contestability),
            errorCorrection: String(b.errorCorrection),
            meaningfulHumanControl: String(b.meaningfulHumanControl),
            dataQuality: String(b.dataQuality),
            distributiveImpact: String(b.distributiveImpact),
            surveillanceNecessity: String(b.surveillanceNecessity),
            procurementAuditRights: String(b.procurementAuditRights),
            vendorExit: String(b.vendorExit),
            generativeAiControls: String(b.generativeAiControls),
            readinessScore,
            outcome,
            assessedBy: actor.email,
            reviewDate: String(b.reviewDate),
          })
          .returning(),
        {
          action: "public_sector.democratic_control_assessed",
          entityType: "public_sector_assessment",
          entityCode: code,
          details: JSON.stringify({
            systemCode: String(b.systemCode),
            agency: String(b.agency),
            aiRole: String(b.aiRole),
            readinessScore,
            outcome,
            failedChecks: checks
              .map((ok, index) =>
                ok
                  ? null
                  : [
                      "legitimate purpose",
                      "less-intrusive alternative",
                      "public-value measure",
                      "due process",
                      "citizen notice",
                      "explanation",
                      "contestability",
                      "error correction",
                      "meaningful human control",
                      "data quality",
                      "distributive impact",
                      "surveillance necessity",
                      "procurement audit rights",
                      "vendor exit",
                      "generative-AI controls",
                    ][index],
              )
              .filter(Boolean),
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "create_foresight_scenario") {
      if (!allowed(actor, ["admin", "system_owner", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const code = id("SCN");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.foresightScenarios)
          .values({
            scenarioCode: code,
            organizationId: org,
            scenario: String(b.scenario),
            timeHorizon: String(b.timeHorizon),
            capabilityPace: String(b.capabilityPace),
            humanControllability: String(b.humanControllability),
            frontierConcentration: String(b.frontierConcentration),
            criticalDomains: String(b.criticalDomains),
            institutionalImpact: String(b.institutionalImpact),
            leadingIndicators: String(b.leadingIndicators),
            preventiveControls: String(b.preventiveControls),
            continuityResponse: String(b.continuityResponse),
            internationalDependencies: String(b.internationalDependencies),
            decisionOwner: String(b.decisionOwner),
            reviewDate: String(b.reviewDate),
            assessedBy: actor.email,
          })
          .returning(),
        {
          action: "foresight.scenario_created",
          entityType: "foresight_scenario",
          entityCode: code,
          details: JSON.stringify({
            scenario: String(b.scenario),
            capabilityPace: String(b.capabilityPace),
            humanControllability: String(b.humanControllability),
            frontierConcentration: String(b.frontierConcentration),
            decisionOwner: String(b.decisionOwner),
            reviewDate: String(b.reviewDate),
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "assess_implementation_capacity") {
      if (!allowed(actor, ["admin", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const acceptable = (v: string, accepted: string[]) =>
        accepted.includes(v);
      const checks = [
        String(b.legalMandate) === "Complete",
        String(b.ringFencedBudget) === "Funded",
        String(b.staffingPlan) === "Complete",
        String(b.technicalCapability) === "Operational",
        String(b.enforcementPowers) === "Operational",
        String(b.regionalReach) === "National",
        String(b.complaintChannel) === "Operational",
        String(b.inspectionProgramme) === "Operational",
        String(b.procurementControls) === "Operational",
        String(b.implementationMilestones).trim().length > 10,
        String(b.performanceIndicators).trim().length > 10,
        String(b.publicReporting) === "Operational",
        String(b.evidenceReference).trim().length > 10,
      ];
      const readinessScore = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );
      const outcome =
        readinessScore >= 85
          ? "IMPLEMENTATION READY"
          : readinessScore >= 55
            ? "CAPACITY GAP"
            : "PAPER GOVERNANCE";
      const code = id("IMP");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.implementationAssessments)
          .values({
            assessmentCode: code,
            organizationId: org,
            jurisdiction: String(b.jurisdiction),
            responsibleInstitution: String(b.responsibleInstitution),
            legalMandate: String(b.legalMandate),
            ringFencedBudget: String(b.ringFencedBudget),
            staffingPlan: String(b.staffingPlan),
            technicalCapability: String(b.technicalCapability),
            enforcementPowers: String(b.enforcementPowers),
            regionalReach: String(b.regionalReach),
            complaintChannel: String(b.complaintChannel),
            inspectionProgramme: String(b.inspectionProgramme),
            procurementControls: String(b.procurementControls),
            implementationMilestones: String(b.implementationMilestones),
            performanceIndicators: String(b.performanceIndicators),
            publicReporting: String(b.publicReporting),
            evidenceReference: String(b.evidenceReference),
            readinessScore,
            outcome,
            assessedBy: actor.email,
            reviewDate: String(b.reviewDate),
          })
          .returning(),
        {
          action: "implementation.capacity_assessed",
          entityType: "implementation_assessment",
          entityCode: code,
          details: JSON.stringify({
            jurisdiction: String(b.jurisdiction),
            responsibleInstitution: String(b.responsibleInstitution),
            readinessScore,
            outcome,
            failedChecks: checks
              .map((ok, index) =>
                ok
                  ? null
                  : [
                      "mandate",
                      "budget",
                      "staffing",
                      "technical capability",
                      "enforcement powers",
                      "regional reach",
                      "complaint channel",
                      "inspection programme",
                      "procurement controls",
                      "milestones",
                      "performance indicators",
                      "public reporting",
                      "published evidence",
                    ][index],
              )
              .filter(Boolean),
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "assess_infrastructure_dividend") {
      if (!allowed(actor, ["admin", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const checks = [
        Number(b.plannedMegawatts) > 0,
        String(b.additionalGeneration) === "Contracted",
        String(b.gridSupport) === "Contracted",
        String(b.networkCostsAssigned) === "Complete",
        String(b.householdTariffProtection) === "Contracted",
        String(b.sharedComputeCommitment).trim().length > 10,
        String(b.localSkillsPlan) === "Funded",
        String(b.localProcurementTarget).trim().length > 10,
        String(b.powerDisclosure) === "Public",
        String(b.waterDisclosure) === "Public",
        String(b.emissionsDisclosure) === "Public",
        String(b.publicBenefitTerms).trim().length > 10,
        String(b.contractEnforcement) === "Enforceable",
      ];
      const readinessScore = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );
      const outcome =
        readinessScore >= 85
          ? "PUBLIC DIVIDEND READY"
          : readinessScore >= 55
            ? "NEEDS CONDITIONS"
            : "PRIVATE ISLAND RISK";
      const code = id("DIV");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.infrastructureDividendAssessments)
          .values({
            assessmentCode: code,
            organizationId: org,
            projectName: String(b.projectName),
            jurisdiction: String(b.jurisdiction),
            operator: String(b.operator),
            plannedMegawatts: Number(b.plannedMegawatts),
            additionalGeneration: String(b.additionalGeneration),
            gridSupport: String(b.gridSupport),
            networkCostsAssigned: String(b.networkCostsAssigned),
            householdTariffProtection: String(b.householdTariffProtection),
            sharedComputeCommitment: String(b.sharedComputeCommitment),
            localSkillsPlan: String(b.localSkillsPlan),
            localProcurementTarget: String(b.localProcurementTarget),
            powerDisclosure: String(b.powerDisclosure),
            waterDisclosure: String(b.waterDisclosure),
            emissionsDisclosure: String(b.emissionsDisclosure),
            publicBenefitTerms: String(b.publicBenefitTerms),
            contractEnforcement: String(b.contractEnforcement),
            readinessScore,
            outcome,
            assessedBy: actor.email,
            reviewDate: String(b.reviewDate),
          })
          .returning(),
        {
          action: "infrastructure.public_dividend_assessed",
          entityType: "infrastructure_dividend",
          entityCode: code,
          details: JSON.stringify({
            projectName: String(b.projectName),
            jurisdiction: String(b.jurisdiction),
            plannedMegawatts: Number(b.plannedMegawatts),
            readinessScore,
            outcome,
            failedChecks: checks
              .map((ok, index) =>
                ok
                  ? null
                  : [
                      "megawatts",
                      "additional generation",
                      "grid support",
                      "network costs",
                      "tariff protection",
                      "shared compute",
                      "local skills",
                      "local procurement",
                      "power disclosure",
                      "water disclosure",
                      "emissions disclosure",
                      "public-benefit terms",
                      "contract enforcement",
                    ][index],
              )
              .filter(Boolean),
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "assess_africa_first") {
      if (!allowed(actor, ["admin", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const checks = [
        String(b.ubuntuImpact) === "Complete",
        String(b.communityResources).trim().length > 10,
        String(b.laborImpact).trim().length > 10,
        String(b.intergenerationalImpact).trim().length > 10,
        String(b.localLanguages).trim().length > 0,
        String(b.languagePerformanceEvidence) === "Complete",
        String(b.lowConnectivityDesign) === "Operational",
        String(b.mobileOfflineSupport) === "Operational",
        ["Sovereign", "Contractually protected"].includes(
          String(b.localDataControl),
        ),
        String(b.foreignDependencyPlan).trim().length > 10,
        String(b.regionalInteroperability) === "Complete",
        String(b.smeProportionality) === "Defined",
        String(b.hypeChallenge) === "Complete",
      ];
      const readinessScore = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );
      const outcome =
        readinessScore >= 85
          ? "AFRICA-FIRST READY"
          : readinessScore >= 55
            ? "LOCALIZATION GAPS"
            : "IMPORTED-FRAMEWORK RISK";
      const code = id("AFR");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.africaFirstAssessments)
          .values({
            assessmentCode: code,
            organizationId: org,
            systemCode: String(b.systemCode),
            jurisdiction: String(b.jurisdiction),
            ubuntuImpact: String(b.ubuntuImpact),
            communityResources: String(b.communityResources),
            laborImpact: String(b.laborImpact),
            intergenerationalImpact: String(b.intergenerationalImpact),
            localLanguages: String(b.localLanguages),
            languagePerformanceEvidence: String(b.languagePerformanceEvidence),
            lowConnectivityDesign: String(b.lowConnectivityDesign),
            mobileOfflineSupport: String(b.mobileOfflineSupport),
            localDataControl: String(b.localDataControl),
            foreignDependencyPlan: String(b.foreignDependencyPlan),
            regionalInteroperability: String(b.regionalInteroperability),
            smeProportionality: String(b.smeProportionality),
            hypeChallenge: String(b.hypeChallenge),
            readinessScore,
            outcome,
            assessedBy: actor.email,
            reviewDate: String(b.reviewDate),
          })
          .returning(),
        {
          action: "africa_first.design_assessed",
          entityType: "africa_first_assessment",
          entityCode: code,
          details: JSON.stringify({
            systemCode: String(b.systemCode),
            jurisdiction: String(b.jurisdiction),
            readinessScore,
            outcome,
            failedChecks: checks
              .map((ok, index) =>
                ok
                  ? null
                  : [
                      "Ubuntu impact",
                      "community resources",
                      "labor ecosystem",
                      "intergenerational impact",
                      "local languages",
                      "language performance",
                      "low-connectivity design",
                      "mobile/offline support",
                      "local data control",
                      "foreign dependency exit",
                      "regional interoperability",
                      "SME proportionality",
                      "hype challenge",
                    ][index],
              )
              .filter(Boolean),
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "assess_sovereign_resilience") {
      const systemCode = String(b.systemCode);
      const jurisdiction = String(b.jurisdiction);
      const primaryProvider = String(b.primaryProvider);
      const providerConcentration = String(b.providerConcentration);
      const verifiedAlternatives = String(b.verifiedAlternatives);
      const dataResidencyControl = String(b.dataResidencyControl);
      const dataExportTest = String(b.dataExportTest);
      const workflowPortability = String(b.workflowPortability);
      const contractAuditRights = String(b.contractAuditRights);
      const contractExitRights = String(b.contractExitRights);
      const continuityPlan = String(b.continuityPlan);
      const recoveryTarget = String(b.recoveryTarget);
      const fallbackCapability = String(b.fallbackCapability);
      const languageValidation = String(b.languageValidation);
      const knowledgeTransfer = String(b.knowledgeTransfer);
      const checks = [
        providerConcentration !== "Single-provider critical",
        verifiedAlternatives !== "None",
        dataResidencyControl === "Enforceable",
        dataExportTest === "Passed",
        workflowPortability === "Demonstrated",
        contractAuditRights === "Enforceable",
        contractExitRights === "Enforceable",
        continuityPlan === "Tested",
        recoveryTarget.length >= 5,
        fallbackCapability === "Operational",
        ["Complete", "Not applicable"].includes(languageValidation),
        knowledgeTransfer === "Funded",
      ];
      const labels = [
        "provider concentration",
        "verified alternative provider",
        "data residency control",
        "tested data export",
        "workflow portability",
        "contract audit rights",
        "contract exit rights",
        "tested continuity plan",
        "approved recovery targets",
        "operational fallback",
        "local-language validation",
        "funded knowledge transfer",
      ];
      const failedChecks = checks
        .map((ok, index) => (ok ? null : labels[index]))
        .filter((value): value is string => value !== null);
      const readinessScore = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );
      const outcome =
        readinessScore >= 85
          ? "RESILIENCE READY"
          : readinessScore >= 55
            ? "CAPABILITY GAPS"
            : "STRATEGIC DEPENDENCY";
      const code = id("SVR");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.sovereignResilienceAssessments)
          .values({
            assessmentCode: code,
            organizationId: org,
            systemCode,
            jurisdiction,
            criticalService: String(b.criticalService),
            primaryProvider,
            providerConcentration,
            verifiedAlternatives,
            dataHostingJurisdictions: String(b.dataHostingJurisdictions),
            dataResidencyControl,
            dataExportTest,
            workflowPortability,
            contractAuditRights,
            contractExitRights,
            continuityPlan,
            recoveryTarget,
            fallbackCapability,
            criticalDependencies: String(b.criticalDependencies),
            localLanguages: String(b.localLanguages),
            languageValidation,
            knowledgeTransfer,
            evidenceReference: String(b.evidenceReference),
            readinessScore,
            outcome,
            failedChecks,
            assessedBy: actor.email,
            reviewDate: String(b.reviewDate),
          })
          .returning(),
        {
          action: "sovereign_resilience.assessed",
          entityType: "sovereign_resilience_assessment",
          entityCode: code,
          details: JSON.stringify({
            systemCode,
            jurisdiction,
            primaryProvider,
            readinessScore,
            outcome,
            failedChecks,
          }),
        },
      );
      result = rows[0];
    } else if (action === "record_recovery_exercise") {
      const systemCode = String(b.systemCode);
      const targetRpoMinutes = Number(b.targetRpoMinutes);
      const actualDataLossMinutes = Number(b.actualDataLossMinutes);
      const targetRtoMinutes = Number(b.targetRtoMinutes);
      const actualRecoveryMinutes = Number(b.actualRecoveryMinutes);
      const checks = [
        actualDataLossMinutes <= targetRpoMinutes,
        actualRecoveryMinutes <= targetRtoMinutes,
        String(b.restoreIntegrity) === "Passed",
        String(b.auditChainVerification) === "Passed",
      ];
      const labels = [
        "recovery point objective",
        "recovery time objective",
        "restored data integrity",
        "restored audit chain",
      ];
      const failedChecks = checks
        .map((ok, index) => (ok ? null : labels[index]))
        .filter((value): value is string => value !== null);
      const exerciseCode = id("DR");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.recoveryExercises)
          .values({
            exerciseCode,
            organizationId: org,
            systemCode,
            exerciseDate: String(b.exerciseDate),
            backupMethod: String(b.backupMethod),
            restoreEnvironment: String(b.restoreEnvironment),
            targetRpoMinutes,
            actualDataLossMinutes,
            targetRtoMinutes,
            actualRecoveryMinutes,
            restoreIntegrity: String(b.restoreIntegrity),
            auditChainVerification: String(b.auditChainVerification),
            evidenceReference: String(b.evidenceReference),
            outcome: failedChecks.length ? "FAILED" : "PASSED",
            failedChecks,
            performedBy: actor.email,
          })
          .returning(),
        {
          action: "recovery.exercise_recorded",
          entityType: "recovery_exercise",
          entityCode: exerciseCode,
          details: JSON.stringify({
            systemCode,
            targetRpoMinutes,
            actualDataLossMinutes,
            targetRtoMinutes,
            actualRecoveryMinutes,
            outcome: failedChecks.length ? "FAILED" : "PASSED",
            failedChecks,
          }),
        },
      );
      result = rows[0];
    } else if (action === "assess_agrifood_supply") {
      if (!allowed(actor, ["admin", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const checks = [
        String(b.farmerIdentity) === "Complete",
        String(b.lotTraceability) === "Operational",
        String(b.physicalDigitalLink) === "Verified",
        String(b.dataOwnership) === "Defined",
        String(b.algorithmicProcurement) === "Auditable",
        String(b.priceTransparency) === "Transparent",
        String(b.smartContractControls) === "Controlled",
        String(b.logisticsEvidence) === "End-to-end",
        String(b.foodLossBaseline).trim().length > 10,
        String(b.farmerEarningsMeasure).trim().length > 10,
        String(b.offlineAccess) === "Operational",
        String(b.disputeResolution) === "Operational",
        String(b.humanOverride) === "Defined",
      ];
      const readinessScore = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );
      const outcome =
        readinessScore >= 85
          ? "SUPPLY CHAIN READY"
          : readinessScore >= 55
            ? "CONTROL GAPS"
            : "DIGITAL CLAIMS UNPROVEN";
      const code = id("AGR");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.agrifoodSupplyAssessments)
          .values({
            assessmentCode: code,
            organizationId: org,
            programmeName: String(b.programmeName),
            jurisdiction: String(b.jurisdiction),
            commodity: String(b.commodity),
            farmerIdentity: String(b.farmerIdentity),
            lotTraceability: String(b.lotTraceability),
            physicalDigitalLink: String(b.physicalDigitalLink),
            dataOwnership: String(b.dataOwnership),
            algorithmicProcurement: String(b.algorithmicProcurement),
            priceTransparency: String(b.priceTransparency),
            smartContractControls: String(b.smartContractControls),
            logisticsEvidence: String(b.logisticsEvidence),
            foodLossBaseline: String(b.foodLossBaseline),
            farmerEarningsMeasure: String(b.farmerEarningsMeasure),
            offlineAccess: String(b.offlineAccess),
            disputeResolution: String(b.disputeResolution),
            humanOverride: String(b.humanOverride),
            readinessScore,
            outcome,
            assessedBy: actor.email,
            reviewDate: String(b.reviewDate),
          })
          .returning(),
        {
          action: "agrifood.supply_chain_assessed",
          entityType: "agrifood_supply_assessment",
          entityCode: code,
          details: JSON.stringify({
            programmeName: String(b.programmeName),
            jurisdiction: String(b.jurisdiction),
            commodity: String(b.commodity),
            readinessScore,
            outcome,
            failedChecks: checks
              .map((ok, index) =>
                ok
                  ? null
                  : [
                      "farmer identity",
                      "lot traceability",
                      "physical-digital link",
                      "data ownership",
                      "algorithmic procurement",
                      "price transparency",
                      "smart-contract controls",
                      "logistics evidence",
                      "food-loss baseline",
                      "farmer earnings",
                      "offline access",
                      "dispute resolution",
                      "human override",
                    ][index],
              )
              .filter(Boolean),
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "register_legal_source") {
      if (!allowed(actor, ["admin", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      let parsed: URL;
      try {
        parsed = new URL(String(b.sourceUrl));
      } catch {
        throw new Error("A valid authoritative source URL is required");
      }
      if (!["http:", "https:"].includes(parsed.protocol))
        throw new Error("Source URL must use HTTPS or HTTP");
      const verifiedOn = String(b.verifiedOn),
        nextReview = String(b.nextReview);
      if (Date.parse(nextReview) <= Date.parse(verifiedOn))
        throw new Error("Next review must be after verification date");
      const code = id("SRC");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.legalSources)
          .values({
            sourceCode: code,
            organizationId: org,
            title: String(b.title),
            publisher: String(b.publisher),
            documentType: String(b.documentType),
            jurisdiction: String(b.jurisdiction),
            publicationYear: Number(b.publicationYear),
            sourceUrl: parsed.toString(),
            frameworkArea: String(b.frameworkArea),
            applicability: String(b.applicability),
            mappedControls: String(b.mappedControls),
            evidenceNotes: String(b.evidenceNotes),
            authorityLevel: String(b.authorityLevel),
            verifiedOn,
            nextReview,
            status: "CURRENT",
            addedBy: actor.email,
          })
          .returning(),
        {
          action: "legal_source.registered",
          entityType: "legal_source",
          entityCode: code,
          details: JSON.stringify({
            title: String(b.title),
            publisher: String(b.publisher),
            jurisdiction: String(b.jurisdiction),
            authorityLevel: String(b.authorityLevel),
            frameworkArea: String(b.frameworkArea),
            mappedControls: String(b.mappedControls),
            nextReview: String(b.nextReview),
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "assess_privacy_compliance") {
      if (!allowed(actor, ["admin", "system_owner", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const unsafe = (v: string) =>
        [
          "Missing",
          "Yes — safeguards missing",
          "Yes — authorization missing",
          "Yes — controls missing",
        ].includes(v);
      const checks = [
        !unsafe(String(b.controllerRegistration)),
        !unsafe(String(b.dpoAssigned)),
        !unsafe(String(b.sensitiveData)),
        !unsafe(String(b.childrenData)),
        !unsafe(String(b.biometricProcessing)),
        String(b.crossBorderTransfer) === "No" ||
          String(b.transferMechanism).trim().length > 10,
        !unsafe(String(b.priorAuthorization)),
        String(b.processorDueDiligence) === "Complete",
        String(b.rightsProcedure) === "Complete",
        String(b.retentionSchedule) === "Complete",
        String(b.breachProcedure) === "Complete",
      ];
      const readinessScore = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );
      const outcome = readinessScore === 100 ? "READY" : "BLOCKED";
      const code = id("PRV");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.privacyComplianceAssessments)
          .values({
            assessmentCode: code,
            organizationId: org,
            systemCode: String(b.systemCode),
            jurisdiction: String(b.jurisdiction),
            sector: String(b.sector),
            controllerRegistration: String(b.controllerRegistration),
            dpoAssigned: String(b.dpoAssigned),
            sensitiveData: String(b.sensitiveData),
            childrenData: String(b.childrenData),
            biometricProcessing: String(b.biometricProcessing),
            crossBorderTransfer: String(b.crossBorderTransfer),
            transferMechanism: String(b.transferMechanism),
            priorAuthorization: String(b.priorAuthorization),
            processorDueDiligence: String(b.processorDueDiligence),
            rightsProcedure: String(b.rightsProcedure),
            retentionSchedule: String(b.retentionSchedule),
            breachProcedure: String(b.breachProcedure),
            readinessScore,
            outcome,
            assessedBy: actor.email,
            reviewDate: String(b.reviewDate),
          })
          .returning(),
        {
          action: "privacy.compliance_assessed",
          entityType: "privacy_compliance",
          entityCode: code,
          details: JSON.stringify({
            systemCode: String(b.systemCode),
            jurisdiction: String(b.jurisdiction),
            readinessScore,
            outcome,
            failedChecks: checks
              .map((ok, index) =>
                ok
                  ? null
                  : [
                      "registration",
                      "DPO",
                      "sensitive data",
                      "children data",
                      "biometrics",
                      "cross-border transfer",
                      "prior authorization",
                      "processor due diligence",
                      "data-subject rights",
                      "retention",
                      "breach response",
                    ][index],
              )
              .filter(Boolean),
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "evaluate_agency_gate") {
      if (!allowed(actor, ["admin", "system_owner", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const checks = [
        String(b.publicProblem).trim().length > 0,
        String(b.affectedCommunities).trim().length > 0,
        String(b.aiAppropriateness) === "Complete",
        String(b.nonAiAlternative) === "Complete",
        String(b.vendorClaimsAssessment) === "Complete",
        String(b.supplierDependencies).trim().length > 0,
        String(b.serviceContinuityPlan) === "Complete",
        String(b.governanceFrameworkMap) === "Complete",
        String(b.sovereignConditions).trim().length > 0,
        String(b.dataHostingRequirements).trim().length > 0,
        String(b.independentAssessment) === "Complete",
        String(b.communityEvidence) === "Complete",
        String(b.exitPlan) === "Complete",
      ];
      const readinessScore = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );
      const proposedDecision = String(b.proposedDecision);
      const outcome =
        proposedDecision === "Refuse"
          ? "REFUSED"
          : readinessScore === 100
            ? "READY_FOR_APPROVAL"
            : "BLOCKED";
      const code = id("AGENCY");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.agencyAssessments)
          .values({
            decisionCode: code,
            organizationId: org,
            proposalTitle: String(b.proposalTitle),
            sponsoringInstitution: String(b.sponsoringInstitution),
            publicProblem: String(b.publicProblem),
            affectedCommunities: String(b.affectedCommunities),
            aiAppropriateness: String(b.aiAppropriateness),
            nonAiAlternative: String(b.nonAiAlternative),
            vendorName: String(b.vendorName),
            vendorClaimsAssessment: String(b.vendorClaimsAssessment),
            criticalityClass: String(b.criticalityClass),
            supplierDependencies: String(b.supplierDependencies),
            serviceContinuityPlan: String(b.serviceContinuityPlan),
            governanceFrameworkMap: String(b.governanceFrameworkMap),
            sovereignConditions: String(b.sovereignConditions),
            dataHostingRequirements: String(b.dataHostingRequirements),
            independentAssessment: String(b.independentAssessment),
            communityEvidence: String(b.communityEvidence),
            exitPlan: String(b.exitPlan),
            proposedDecision,
            readinessScore,
            outcome,
            assessedBy: actor.email,
            decidedAt: outcome === "REFUSED" ? new Date().toISOString() : null,
          })
          .returning(),
        {
          action: "agency_gate.evaluated",
          entityType: "agency_assessment",
          entityCode: code,
          details: JSON.stringify({
            proposalTitle: String(b.proposalTitle),
            criticalityClass: String(b.criticalityClass),
            readinessScore,
            outcome,
            proposedDecision,
            failedChecks: checks
              .map((ok, index) =>
                ok
                  ? null
                  : [
                      "public problem",
                      "affected communities",
                      "AI appropriateness",
                      "non-AI alternative",
                      "vendor claims",
                      "supplier dependencies",
                      "service continuity",
                      "framework mapping",
                      "sovereign conditions",
                      "data hosting",
                      "independent assessment",
                      "community evidence",
                      "exit plan",
                    ][index],
              )
              .filter(Boolean),
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "agency_transition") {
      if (!allowed(actor, ["admin", "approver"]))
        throw new Error("ACCESS_DENIED");
      const target = await db
        .select()
        .from(s.agencyAssessments)
        .where(
          and(
            eq(s.agencyAssessments.organizationId, org),
            eq(s.agencyAssessments.decisionCode, String(b.decisionCode)),
          ),
        )
        .get();
      if (!target) throw new Error("Agency decision not found");
      const transition = String(b.transition);
      let outcome: string;
      if (transition === "approve") {
        if (target.assessedBy === actor.email)
          throw new Error(
            "Assessor cannot authorize their own adoption decision",
          );
        if (target.outcome !== "READY_FOR_APPROVAL")
          throw new Error(
            "Adoption cannot be authorized until the agency gate is complete",
          );
        outcome = "ADOPTION_AUTHORIZED";
      } else if (transition === "suspend") {
        if (target.outcome !== "ADOPTION_AUTHORIZED")
          throw new Error("Only an authorized adoption can be suspended");
        outcome = "SUSPENDED";
      } else if (transition === "discontinue") {
        if (!["ADOPTION_AUTHORIZED", "SUSPENDED"].includes(target.outcome))
          throw new Error(
            "Only an authorized or suspended adoption can be discontinued",
          );
        outcome = "DISCONTINUED";
      } else throw new Error("Invalid agency transition");
      const decidedAt = new Date().toISOString();
      const linked = ["SUSPENDED", "DISCONTINUED"].includes(outcome)
        ? await db
            .select()
            .from(s.deploymentGates)
            .where(
              and(
                eq(s.deploymentGates.organizationId, org),
                eq(s.deploymentGates.agencyDecisionCode, target.decisionCode),
              ),
            )
        : [];
      await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .update(s.deploymentGates)
            .set({ outcome: "BLOCKED" })
            .where(
              and(
                eq(s.deploymentGates.organizationId, org),
                inArray(
                  s.deploymentGates.gateCode,
                  linked.map((gate) => gate.gateCode),
                ),
              ),
            ),
          db
            .update(s.aiSystems)
            .set({ status: "Action required" })
            .where(
              and(
                eq(s.aiSystems.organizationId, org),
                inArray(s.aiSystems.systemCode, [
                  ...new Set(linked.map((gate) => gate.systemCode)),
                ]),
              ),
            ),
          db
            .update(s.agencyAssessments)
            .set({
              outcome,
              approvedBy:
                transition === "approve" ? actor.email : target.approvedBy,
              decidedAt,
            })
            .where(
              and(
                eq(s.agencyAssessments.organizationId, org),
                eq(s.agencyAssessments.decisionCode, target.decisionCode),
                eq(s.agencyAssessments.outcome, target.outcome),
              ),
            ),
        ],
        {
          action: `agency_gate.${transition}d`,
          entityType: "agency_assessment",
          entityCode: target.decisionCode,
          details: JSON.stringify({
            proposalTitle: target.proposalTitle,
            authorizedBy: actor.email,
            previousOutcome: target.outcome,
            outcome,
          }),
          guard: sql`changes() = 1`,
        },
      );
      result = {
        ...target,
        outcome,
        approvedBy: transition === "approve" ? actor.email : target.approvedBy,
        decidedAt,
      };
    } else if (action === "register_system") {
      if (!allowed(actor, ["admin", "system_owner"]))
        throw new Error("ACCESS_DENIED");
      const code = id("AI");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.aiSystems)
          .values({
            systemCode: code,
            organizationId: org,
            name: String(b.name),
            owner: String(b.owner),
            region: String(b.region),
            purpose: String(b.purpose),
            risk: String(b.risk || "Medium"),
            model: String(b.model || "Not specified"),
            data: String(b.data || "Not classified"),
            hostingLocation: String(b.hostingLocation || "Not recorded"),
            decisionImpact: String(b.decisionImpact || "Advisory"),
          })
          .returning(),
        {
          action: "system.registered",
          entityType: "ai_system",
          entityCode: code,
          details: String(b.name),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "evaluate_deployment_gate") {
      if (!allowed(actor, ["admin", "system_owner", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const systemCode = String(b.systemCode);
      const agencyDecisionCode = String(b.agencyDecisionCode);
      const [system, agencyDecision] = await Promise.all([
        db
          .select()
          .from(s.aiSystems)
          .where(
            and(
              eq(s.aiSystems.organizationId, org),
              eq(s.aiSystems.systemCode, systemCode),
            ),
          )
          .get(),
        db
          .select()
          .from(s.agencyAssessments)
          .where(
            and(
              eq(s.agencyAssessments.organizationId, org),
              eq(s.agencyAssessments.decisionCode, agencyDecisionCode),
            ),
          )
          .get(),
      ]);
      if (!system) throw new Error("AI system not found");
      if (!agencyDecision || agencyDecision.outcome !== "ADOPTION_AUTHORIZED")
        throw new Error(
          "Institutional adoption must be authorized before deployment review",
        );
      const checks = [
        String(b.accountableOwner).trim().length > 0,
        String(b.riskTier).trim().length > 0,
        String(b.autonomyBoundary).trim().length > 0,
        String(b.humanApproval) === "Complete",
        String(b.outputValidation) === "Complete",
        String(b.biasTesting) === "Complete",
        String(b.loggingPlan) === "Complete",
        String(b.incidentPlan) === "Complete",
        String(b.shutdownAuthority).trim().length > 0,
      ];
      const readinessScore = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );
      const outcome = readinessScore === 100 ? "READY_FOR_APPROVAL" : "BLOCKED";
      const code = id("GATE");
      const [batchRows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .insert(s.deploymentGates)
            .values({
              gateCode: code,
              organizationId: org,
              systemCode,
              agencyDecisionCode,
              accountableOwner: String(b.accountableOwner),
              riskTier: String(b.riskTier),
              autonomyBoundary: String(b.autonomyBoundary),
              humanApproval: String(b.humanApproval),
              outputValidation: String(b.outputValidation),
              biasTesting: String(b.biasTesting),
              loggingPlan: String(b.loggingPlan),
              incidentPlan: String(b.incidentPlan),
              shutdownAuthority: String(b.shutdownAuthority),
              readinessScore,
              outcome,
              assessedBy: actor.email,
            })
            .returning(),
          db
            .update(s.aiSystems)
            .set({ status: "In review", risk: String(b.riskTier) })
            .where(
              and(
                eq(s.aiSystems.organizationId, org),
                eq(s.aiSystems.systemCode, systemCode),
              ),
            ),
        ],
        {
          action: "deployment_gate.evaluated",
          entityType: "deployment_gate",
          entityCode: code,
          details: JSON.stringify({
            systemCode,
            agencyDecisionCode,
            readinessScore,
            outcome,
            failedChecks: checks
              .map((ok, index) =>
                ok
                  ? null
                  : [
                      "accountable owner",
                      "risk tier",
                      "autonomy boundaries",
                      "human approval",
                      "output validation",
                      "bias testing",
                      "logging",
                      "incident response",
                      "shutdown authority",
                    ][index],
              )
              .filter(Boolean),
          }),
          guard: sql`changes() = 1`,
        },
      );
      result = batchRows[0];
    } else if (action === "approve_deployment_gate") {
      if (!allowed(actor, ["admin", "approver"]))
        throw new Error("ACCESS_DENIED");
      const gate = await db
        .select()
        .from(s.deploymentGates)
        .where(
          and(
            eq(s.deploymentGates.organizationId, org),
            eq(s.deploymentGates.gateCode, String(b.gateCode)),
          ),
        )
        .get();
      if (!gate) throw new Error("Deployment gate not found");
      const agencyDecision = await db
        .select()
        .from(s.agencyAssessments)
        .where(
          and(
            eq(s.agencyAssessments.organizationId, org),
            eq(s.agencyAssessments.decisionCode, gate.agencyDecisionCode),
          ),
        )
        .get();
      if (!agencyDecision || agencyDecision.outcome !== "ADOPTION_AUTHORIZED")
        throw new Error("Institutional adoption authority is no longer active");
      if (gate.assessedBy === actor.email)
        throw new Error("Assessor cannot approve their own deployment gate");
      if (gate.outcome !== "READY_FOR_APPROVAL")
        throw new Error(
          "Deployment remains blocked until every gate requirement is complete",
        );
      const approvedAt = new Date().toISOString();
      await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .update(s.aiSystems)
            .set({ status: "Approved" })
            .where(
              and(
                eq(s.aiSystems.organizationId, org),
                eq(s.aiSystems.systemCode, gate.systemCode),
              ),
            ),
          db
            .update(s.deploymentGates)
            .set({ outcome: "APPROVED", approvedBy: actor.email, approvedAt })
            .where(
              and(
                eq(s.deploymentGates.organizationId, org),
                eq(s.deploymentGates.gateCode, gate.gateCode),
                eq(s.deploymentGates.outcome, gate.outcome),
              ),
            ),
        ],
        {
          action: "deployment_gate.approved",
          entityType: "deployment_gate",
          entityCode: gate.gateCode,
          details: JSON.stringify({
            systemCode: gate.systemCode,
            agencyDecisionCode: gate.agencyDecisionCode,
            approvedBy: actor.email,
            result: "Deployment authorized",
            readinessScore: gate.readinessScore,
          }),
          guard: sql`changes() = 1`,
        },
      );
      result = {
        ...gate,
        outcome: "APPROVED",
        approvedBy: actor.email,
        approvedAt,
      };
    } else if (action === "register_agent") {
      if (!allowed(actor, ["admin", "system_owner"]))
        throw new Error("ACCESS_DENIED");
      const code = id("AGT");
      const systemCode = String(b.systemCode);
      const scope = String(b.scope);
      const approvedTools = String(b.approvedTools);
      const approvedData = String(b.approvedData);
      const jurisdiction = String(b.jurisdiction);
      const owner = String(b.owner);
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.aiAgents)
          .values({
            agentCode: code,
            organizationId: org,
            systemCode,
            name: String(b.name),
            owner,
            purpose: String(b.purpose),
            scope,
            approvedTools,
            approvedData,
            jurisdiction,
            reviewDue: String(b.reviewDue),
            lifecycleStatus: "approved",
          })
          .returning(),
        {
          action: "agent.identity_created",
          entityType: "ai_agent",
          entityCode: code,
          details: JSON.stringify({
            authorizedBy: actor.email,
            systemCode,
            scope,
            tools: approvedTools,
            data: approvedData,
            jurisdiction,
            result: "Agent identity activated",
            notified: owner,
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "request_access") {
      if (!allowed(actor, ["admin", "system_owner", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const code = id("GNT");
      const agent = await db
        .select()
        .from(s.aiAgents)
        .where(
          and(
            eq(s.aiAgents.organizationId, org),
            eq(s.aiAgents.agentCode, String(b.agentCode)),
          ),
        )
        .get();
      if (!agent) throw new Error("Agent identity not found");
      if (Date.parse(String(b.expiresAt)) <= Date.parse(String(b.startsAt)))
        throw new Error("Access must expire after it starts");
      const resource = String(b.resource);
      const permission = String(b.permission);
      const purpose = String(b.purpose);
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.accessGrants)
          .values({
            grantCode: code,
            organizationId: org,
            agentCode: agent.agentCode,
            requestedBy: actor.email,
            resource,
            permission,
            purpose,
            leastPrivilegeBasis: String(b.leastPrivilegeBasis),
            startsAt: String(b.startsAt),
            expiresAt: String(b.expiresAt),
          })
          .returning(),
        {
          action: "access.requested",
          entityType: "access_grant",
          entityCode: code,
          details: JSON.stringify({
            agentCode: agent.agentCode,
            resource,
            permission,
            purpose,
            result: "Awaiting independent approval",
            notified: agent.owner,
          }),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "access_transition") {
      if (!allowed(actor, ["admin", "approver", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const target = await db
        .select()
        .from(s.accessGrants)
        .where(
          and(
            eq(s.accessGrants.organizationId, org),
            eq(s.accessGrants.grantCode, String(b.grantCode)),
          ),
        )
        .get();
      if (!target) throw new Error("Access grant not found");
      const transition = String(b.transition);
      let nextStatus = target.status;
      let changes: {
        status?: string;
        approvedBy?: string;
        lastReviewedAt?: string;
        revokedAt?: string;
      } = {};
      if (transition === "approve") {
        if (target.requestedBy === actor.email)
          throw new Error("Requester cannot approve own access");
        if (target.status !== "requested")
          throw new Error("Only requested access can be approved");
        if (Date.parse(target.expiresAt) <= Date.now())
          throw new Error("Access request has expired");
        nextStatus = "active";
        changes = {
          status: nextStatus,
          approvedBy: actor.email,
          lastReviewedAt: new Date().toISOString(),
        };
      } else if (transition === "review") {
        if (target.status !== "active")
          throw new Error("Only active access can be reviewed");
        if (Date.parse(target.expiresAt) <= Date.now())
          throw new Error("Access grant has expired");
        changes = { lastReviewedAt: new Date().toISOString() };
      } else if (transition === "revoke") {
        if (!["requested", "active"].includes(target.status))
          throw new Error("Access is already inactive");
        nextStatus = "revoked";
        changes = { status: nextStatus, revokedAt: new Date().toISOString() };
      } else throw new Error("Invalid access transition");
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .update(s.accessGrants)
            .set(changes)
            .where(
              and(
                eq(s.accessGrants.organizationId, org),
                eq(s.accessGrants.grantCode, target.grantCode),
                eq(s.accessGrants.status, target.status),
              ),
            )
            .returning(),
        ],
        {
          action: `access.${transition}d`,
          entityType: "access_grant",
          entityCode: target.grantCode,
          details: JSON.stringify({
            authorizedBy: actor.email,
            agentCode: target.agentCode,
            resource: target.resource,
            permission: target.permission,
            action: transition,
            result: nextStatus,
          }),
          guard: sql`changes() = 1`,
        },
      );
      if (!rows[0])
        throw new Error("Access grant changed; refresh and try again");
      result = { ...target, status: nextStatus };
    } else if (action === "authorize_agent_action") {
      const agentCode = String(b.agentCode);
      const resource = String(b.resource);
      const permission = String(b.permission);
      const now = Date.now();
      const agent = await db
        .select()
        .from(s.aiAgents)
        .where(
          and(
            eq(s.aiAgents.organizationId, org),
            eq(s.aiAgents.agentCode, agentCode),
          ),
        )
        .get();
      const grant = await db
        .select()
        .from(s.accessGrants)
        .where(
          and(
            eq(s.accessGrants.organizationId, org),
            eq(s.accessGrants.agentCode, agentCode),
            eq(s.accessGrants.resource, resource),
            eq(s.accessGrants.permission, permission),
            eq(s.accessGrants.status, "active"),
          ),
        )
        .get();
      const blocking = agent
        ? await db
            .select()
            .from(s.guardrailDecisions)
            .where(
              and(
                eq(s.guardrailDecisions.organizationId, org),
                eq(s.guardrailDecisions.systemCode, agent.systemCode),
                eq(s.guardrailDecisions.level, "BLOCK"),
              ),
            )
            .orderBy(desc(s.guardrailDecisions.id))
            .limit(1)
        : [];
      const reasons: string[] = [];
      if (!agent) reasons.push("unknown_agent");
      else if (!["active", "approved"].includes(agent.lifecycleStatus))
        reasons.push("agent_not_active");
      if (!grant) reasons.push("no_matching_active_grant");
      else {
        if (Date.parse(grant.startsAt) > now) reasons.push("grant_not_started");
        if (Date.parse(grant.expiresAt) <= now) reasons.push("grant_expired");
      }
      if (blocking[0] && blocking[0].status !== "approved")
        reasons.push("blocking_guardrail");
      const isAllowed = reasons.length === 0;
      result = {
        allowed: isAllowed,
        agentCode,
        resource,
        permission,
        reasons,
        checkedAt: new Date().toISOString(),
      };
      await audit(
        db,
        actor,
        request,
        isAllowed ? "agent_action.allowed" : "agent_action.denied",
        "ai_agent",
        agentCode,
        JSON.stringify({ resource, permission, reasons }),
      );
    } else if (action === "model_version") {
      if (!allowed(actor, ["admin", "system_owner", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const systemCode = String(b.systemCode);
      const version = String(b.version);
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.modelVersions)
          .values({
            organizationId: org,
            systemCode,
            version,
            provider: String(b.provider),
            changeSummary: String(b.changeSummary),
          })
          .returning(),
        {
          action: "model.version_added",
          entityType: "model_version",
          entityCode: `${systemCode}:${version}`,
          details: String(b.changeSummary),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "risk_assessment") {
      if (!allowed(actor, ["admin", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const systemCode = String(b.systemCode);
      const score = Number(b.score);
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.riskAssessments)
          .values({
            organizationId: org,
            systemCode,
            assessorEmail: actor.email,
            inherentRisk: String(b.inherentRisk),
            residualRisk: String(b.residualRisk),
            score,
            rationale: String(b.rationale),
            status: "submitted",
          })
          .returning(),
        {
          action: "risk.assessed",
          entityType: "risk_assessment",
          entityCode: systemCode,
          details: `${systemCode} score ${score}`,
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "control") {
      if (!allowed(actor, ["admin", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const code = id("CTL");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.controls)
          .values({
            organizationId: org,
            controlCode: code,
            title: String(b.title),
            jurisdiction: String(b.jurisdiction),
            category: String(b.category),
            requirement: String(b.requirement),
            evidenceRequired: String(b.evidenceRequired),
            version: String(b.version || "1.0"),
          })
          .returning(),
        {
          action: "control.created",
          entityType: "control",
          entityCode: code,
          details: String(b.title),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "guardrail_decision") {
      if (!allowed(actor, ["admin", "system_owner", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const level = String(b.level).toUpperCase();
      const code = id("DEC");
      const deterministicResult =
        level === "BLOCK"
          ? "Execution prevented"
          : level === "WARN"
            ? "Queued for human review"
            : "Permitted with audit logging";
      const requiredApprovals =
        level === "BLOCK" ? 2 : level === "WARN" ? 1 : 0;
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.guardrailDecisions)
          .values({
            organizationId: org,
            decisionCode: code,
            systemCode: String(b.systemCode),
            guardrailCode: String(b.guardrailCode),
            level,
            trigger: String(b.trigger),
            deterministicResult,
            requiredApprovals,
            createdBy: actor.email,
            status: requiredApprovals ? "pending" : "allowed",
          })
          .returning(),
        {
          action: "guardrail.evaluated",
          entityType: "guardrail_decision",
          entityCode: code,
          details: `${level}: ${deterministicResult}`,
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "approve") {
      if (!allowed(actor, ["admin", "approver", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const decisionCode = String(b.decisionCode);
      const outcome = String(b.outcome);
      const justification = String(b.justification);
      const decision = await db
        .select()
        .from(s.guardrailDecisions)
        .where(
          and(
            eq(s.guardrailDecisions.organizationId, org),
            eq(s.guardrailDecisions.decisionCode, decisionCode),
          ),
        )
        .get();
      if (!decision) throw new Error("Guardrail decision not found");
      if (decision.createdBy === actor.email)
        throw new Error("Requester cannot approve their own decision");
      if (!["pending", "partially_approved"].includes(decision.status))
        throw new Error("Guardrail decision is no longer awaiting approval");
      const existing = await db
        .select()
        .from(s.approvals)
        .where(
          and(
            eq(s.approvals.organizationId, org),
            eq(s.approvals.decisionCode, decisionCode),
            eq(s.approvals.approverEmail, actor.email),
          ),
        );
      if (existing.length) throw new Error("You already decided this item");
      const [inserted, updated] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .insert(s.approvals)
            .values({
              organizationId: org,
              decisionCode,
              approverEmail: actor.email,
              approverRole: actor.role,
              outcome,
              justification,
            })
            .returning(),
          db
            .update(s.guardrailDecisions)
            .set({
              status:
                outcome === "denied"
                  ? "denied"
                  : sql`case when (select count(*) from ${s.approvals} where ${and(eq(s.approvals.organizationId, org), eq(s.approvals.decisionCode, decisionCode), eq(s.approvals.outcome, "approved"))}) >= ${decision.requiredApprovals} then 'approved' else 'partially_approved' end`,
            })
            .where(
              and(
                eq(s.guardrailDecisions.organizationId, org),
                eq(s.guardrailDecisions.decisionCode, decisionCode),
                eq(s.guardrailDecisions.status, decision.status),
              ),
            )
            .returning(),
        ],
        {
          action: "approval.recorded",
          entityType: "guardrail_decision",
          entityCode: decisionCode,
          details: JSON.stringify({
            decisionCode,
            outcome,
            requiredApprovals: decision.requiredApprovals,
          }),
          guard: sql`changes() = 1`,
        },
      );
      const row = inserted[0];
      if (!updated[0])
        throw new Error("Guardrail decision changed; refresh and try again");
      result = { approval: row, decisionStatus: updated[0].status };
    } else if (action === "request_override") {
      if (!allowed(actor, ["admin", "system_owner"]))
        throw new Error("ACCESS_DENIED");
      const code = id("OVR");
      const rows = await auditedWrite(
        db,
        actor,
        request,
        db
          .insert(s.overrides)
          .values({
            organizationId: org,
            overrideCode: code,
            decisionCode: String(b.decisionCode),
            requestedBy: actor.email,
            reason: String(b.reason),
            compensatingControls: String(b.compensatingControls),
            expiresAt: String(b.expiresAt),
          })
          .returning(),
        {
          action: "override.requested",
          entityType: "override",
          entityCode: code,
          details: String(b.reason),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "override_approve") {
      if (!allowed(actor, ["admin", "approver"]))
        throw new Error("ACCESS_DENIED");
      const target = await db
        .select()
        .from(s.overrides)
        .where(
          and(
            eq(s.overrides.organizationId, org),
            eq(s.overrides.overrideCode, String(b.overrideCode)),
          ),
        )
        .get();
      if (!target) throw new Error("Override not found");
      if (target.requestedBy === actor.email)
        throw new Error("Requester cannot approve own override");
      if (
        !["awaiting_dual_approval", "awaiting_second_approval"].includes(
          target.status,
        )
      )
        throw new Error("Override is no longer awaiting approval");
      if (Date.parse(target.expiresAt) <= Date.now())
        throw new Error("Override has expired");
      const prior = await db
        .select()
        .from(s.approvals)
        .where(
          and(
            eq(s.approvals.organizationId, org),
            eq(s.approvals.decisionCode, target.overrideCode),
            eq(s.approvals.approverEmail, actor.email),
          ),
        );
      if (prior.length) throw new Error("You already approved this override");
      const [, updated] = await auditedBatch(
        db,
        actor,
        request,
        [
          db.insert(s.approvals).values({
            organizationId: org,
            decisionCode: target.overrideCode,
            approverEmail: actor.email,
            approverRole: actor.role,
            outcome: "approved",
            justification: String(b.justification),
          }),
          db
            .update(s.overrides)
            .set({
              status: sql`case when (select count(*) from ${s.approvals} where ${and(eq(s.approvals.organizationId, org), eq(s.approvals.decisionCode, target.overrideCode), eq(s.approvals.outcome, "approved"))}) >= 2 then 'approved' else 'awaiting_second_approval' end`,
            })
            .where(
              and(
                eq(s.overrides.organizationId, org),
                eq(s.overrides.overrideCode, target.overrideCode),
                eq(s.overrides.status, target.status),
              ),
            )
            .returning(),
        ],
        {
          action: "override.approved",
          entityType: "override",
          entityCode: target.overrideCode,
          details: "Independent approval recorded; two approvals required",
          guard: sql`changes() = 1`,
        },
      );
      const nextStatus = updated[0]?.status;
      if (!nextStatus)
        throw new Error("Override changed; refresh and try again");
      result = {
        ...target,
        approvalCount: nextStatus === "approved" ? 2 : 1,
        status: nextStatus,
      };
    } else if (action === "override_deny") {
      if (!allowed(actor, ["admin", "approver"]))
        throw new Error("ACCESS_DENIED");
      const overrideCode = requiredText(b.overrideCode, "overrideCode");
      const justification = requiredText(b.justification, "justification");
      const target = await db
        .select()
        .from(s.overrides)
        .where(
          and(
            eq(s.overrides.organizationId, org),
            eq(s.overrides.overrideCode, overrideCode),
          ),
        )
        .get();
      if (!target) throw new Error("Override not found");
      if (target.requestedBy === actor.email)
        throw new Error("Requester cannot decide their own override");
      if (
        !["awaiting_dual_approval", "awaiting_second_approval"].includes(
          target.status,
        )
      )
        throw new Error("Override is no longer awaiting a decision");
      await auditedBatch(
        db,
        actor,
        request,
        [
          db.insert(s.approvals).values({
            organizationId: org,
            decisionCode: target.overrideCode,
            approverEmail: actor.email,
            approverRole: actor.role,
            outcome: "denied",
            justification,
          }),
          db
            .update(s.overrides)
            .set({ status: "denied" })
            .where(
              and(
                eq(s.overrides.organizationId, org),
                eq(s.overrides.overrideCode, target.overrideCode),
                eq(s.overrides.status, target.status),
              ),
            ),
        ],
        {
          action: "override.denied",
          entityType: "override",
          entityCode: target.overrideCode,
          details: JSON.stringify({
            requestedBy: target.requestedBy,
            justification,
          }),
          guard: sql`changes() = 1`,
        },
      );
      result = { ...target, status: "denied" };
    } else if (action === "scan_conduct_patterns") {
      if (!allowed(actor, ["admin", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const windowDays = b.windowDays == null ? 30 : Number(b.windowDays);
      if (!Number.isInteger(windowDays) || windowDays < 1 || windowDays > 365)
        throw new Error("windowDays must be an integer between 1 and 365");
      const threshold = b.threshold == null ? 3 : Number(b.threshold);
      if (!Number.isInteger(threshold) || threshold < 2 || threshold > 100)
        throw new Error("threshold must be an integer between 2 and 100");
      const windowEnd = new Date();
      const windowStart = new Date(windowEnd.getTime() - windowDays * 86400000);
      const [deniedOverrides, denialAudits, userRowsForScan, openFlags] =
        await Promise.all([
          db
            .select()
            .from(s.overrides)
            .where(
              and(
                eq(s.overrides.organizationId, org),
                eq(s.overrides.status, "denied"),
              ),
            ),
          db
            .select()
            .from(s.auditEvents)
            .where(
              and(
                eq(s.auditEvents.organizationId, org),
                eq(s.auditEvents.action, "override.denied"),
              ),
            ),
          db
            .select({ id: s.users.id, email: s.users.email })
            .from(s.users)
            .where(eq(s.users.organizationId, org)),
          db
            .select()
            .from(s.conductPatternFlags)
            .where(
              and(
                eq(s.conductPatternFlags.organizationId, org),
                eq(
                  s.conductPatternFlags.patternType,
                  "repeated_denied_overrides",
                ),
                eq(s.conductPatternFlags.reviewStatus, "open"),
              ),
            ),
        ]);
      const auditByOverride = new Map(
        denialAudits
          .filter(
            (event) => timestamp(event.createdAt) >= windowStart.getTime(),
          )
          .map((event) => [event.entityCode, event.id]),
      );
      const userIdByEmail = new Map(
        userRowsForScan.map((user) => [user.email, user.id]),
      );
      const grouped = new Map<number, { count: number; auditIds: number[] }>();
      for (const denied of deniedOverrides) {
        const auditId = auditByOverride.get(denied.overrideCode);
        const subjectUserId = userIdByEmail.get(denied.requestedBy);
        if (!auditId || !subjectUserId) continue;
        const group = grouped.get(subjectUserId) ?? { count: 0, auditIds: [] };
        group.count += 1;
        group.auditIds.push(auditId);
        grouped.set(subjectUserId, group);
      }
      const candidateFlags: Array<typeof s.conductPatternFlags.$inferInsert> =
        [];
      for (const [subjectUserId, group] of grouped) {
        if (
          group.count < threshold ||
          openFlags.some((flag) => flag.subjectUserId === subjectUserId)
        )
          continue;
        candidateFlags.push({
          organizationId: org,
          subjectUserId,
          patternType: "repeated_denied_overrides",
          windowStart: windowStart.toISOString(),
          windowEnd: windowEnd.toISOString(),
          eventCount: group.count,
          threshold,
          linkedAuditEventIds: group.auditIds,
          reviewStatus: "open",
        });
      }
      let createdFlags: Array<typeof s.conductPatternFlags.$inferSelect> = [];
      const auditDetails = JSON.stringify({
        windowDays,
        threshold,
        subjectsFlagged: candidateFlags.map((flag) => flag.subjectUserId),
      });
      if (candidateFlags.length) {
        const rows = await auditedWrite(
          db,
          actor,
          request,
          db.insert(s.conductPatternFlags).values(candidateFlags).returning(),
          {
            action: "conduct_pattern.scan_completed",
            entityType: "conduct_pattern_flag",
            entityCode: "denied-override-scan",
            details: auditDetails,
            guard: sql`changes() = ${candidateFlags.length}`,
          },
        );
        createdFlags = rows;
      } else {
        await audit(
          db,
          actor,
          request,
          "conduct_pattern.scan_completed",
          "conduct_pattern_flag",
          "denied-override-scan",
          auditDetails,
        );
      }
      result = { windowDays, threshold, created: createdFlags };
    } else if (action === "review_conduct_pattern") {
      if (!allowed(actor, ["admin"])) throw new Error("ACCESS_DENIED");
      const flagId = requiredId(b.flagId, "flagId");
      const reviewStatus = requiredText(b.reviewStatus, "reviewStatus");
      if (!reviewStatuses.includes(reviewStatus))
        throw new Error("Invalid review status");
      const flag = await db
        .select()
        .from(s.conductPatternFlags)
        .where(
          and(
            eq(s.conductPatternFlags.id, flagId),
            eq(s.conductPatternFlags.organizationId, org),
          ),
        )
        .get();
      if (!flag) throw new Error("Conduct pattern flag not found");
      if (flag.reviewStatus !== "open")
        throw new Error("Conduct pattern flag is already reviewed");
      let linkedConductCaseId: null | number = null;
      if (reviewStatus === "escalated_to_conduct_case") {
        const [conductRows, flagRows] = await auditedBatch(
          db,
          actor,
          request,
          [
            db
              .insert(s.workforceConductCases)
              .values({
                organizationId: org,
                subjectUserId: flag.subjectUserId,
                reportedByUserId: actor.userId,
                grounds:
                  flag.patternType === "repeated_denied_overrides"
                    ? "unauthorized_override"
                    : "other",
                description: `Escalated from conduct pattern flag ${flag.id}: ${flag.eventCount} denied override requests between ${flag.windowStart} and ${flag.windowEnd}.`,
                stage: "informal_resolution",
              })
              .returning(),
            db
              .update(s.conductPatternFlags)
              .set({
                reviewStatus,
                reviewedByUserId: actor.userId,
                linkedConductCaseId: sql`last_insert_rowid()`,
              })
              .where(
                and(
                  eq(s.conductPatternFlags.id, flagId),
                  eq(s.conductPatternFlags.organizationId, org),
                  eq(s.conductPatternFlags.reviewStatus, "open"),
                ),
              )
              .returning(),
          ],
          {
            action: "conduct_pattern.reviewed",
            entityType: "conduct_pattern_flag",
            entityCode: String(flagId),
            details: JSON.stringify({ reviewStatus, conductCaseCreated: true }),
            guard: sql`changes() = 1`,
          },
        );
        linkedConductCaseId = conductRows[0].id;
        if (!flagRows[0])
          throw new Error("Conduct pattern changed; refresh and try again");
      } else {
        const rows = await auditedWrite(
          db,
          actor,
          request,
          db
            .update(s.conductPatternFlags)
            .set({
              reviewStatus,
              reviewedByUserId: actor.userId,
              linkedConductCaseId: null,
            })
            .where(
              and(
                eq(s.conductPatternFlags.id, flagId),
                eq(s.conductPatternFlags.organizationId, org),
                eq(s.conductPatternFlags.reviewStatus, "open"),
              ),
            )
            .returning(),
          {
            action: "conduct_pattern.reviewed",
            entityType: "conduct_pattern_flag",
            entityCode: String(flagId),
            details: JSON.stringify({
              reviewStatus,
              conductCaseCreated: false,
            }),
            guard: sql`changes() = 1`,
          },
        );
        if (!rows[0])
          throw new Error("Conduct pattern changed; refresh and try again");
      }
      result = { flagId, reviewStatus, linkedConductCaseId };
    } else if (action === "evidence") {
      if (!allowed(actor, ["admin", "system_owner", "reviewer", "auditor"]))
        throw new Error("ACCESS_DENIED");
      const code = id("EVD");
      const value = JSON.stringify({
        systemCode: b.systemCode,
        title: b.title,
        evidenceType: b.evidenceType,
        source: b.source,
      });
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(value),
      );
      const hash = Array.from(new Uint8Array(digest))
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .insert(s.evidence)
            .values({
              organizationId: org,
              evidenceCode: code,
              systemCode: String(b.systemCode),
              title: String(b.title),
              evidenceType: String(b.evidenceType),
              source: String(b.source),
              hash,
              status: "reference_recorded",
              uploadedBy: actor.email,
            })
            .returning(),
        ],
        {
          action: "evidence.added",
          entityType: "evidence",
          entityCode: code,
          details: String(b.title),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "incident") {
      const code = id("INC");
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .insert(s.incidents)
            .values({
              organizationId: org,
              incidentCode: code,
              systemCode: String(b.systemCode),
              severity: String(b.severity),
              title: String(b.title),
              description: String(b.description),
              owner: String(b.owner || actor.email),
            })
            .returning(),
        ],
        {
          action: "incident.reported",
          entityType: "incident",
          entityCode: code,
          details: String(b.title),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "incident_advance") {
      if (!allowed(actor, ["admin", "reviewer", "approver"]))
        throw new Error("ACCESS_DENIED");
      const flow = [
        "detected",
        "triaged",
        "contained",
        "investigating",
        "capa_open",
        "effectiveness_review",
        "closed",
      ];
      const target = await db
        .select()
        .from(s.incidents)
        .where(
          and(
            eq(s.incidents.organizationId, org),
            eq(s.incidents.incidentCode, String(b.incidentCode)),
          ),
        )
        .get();
      if (!target) throw new Error("Incident not found");
      const next = String(b.status);
      if (flow.indexOf(next) !== flow.indexOf(target.status) + 1)
        throw new Error("Invalid incident transition");
      if (next === "capa_open") {
        const capa = await db
          .select({ id: s.correctiveActions.id })
          .from(s.correctiveActions)
          .where(
            and(
              eq(s.correctiveActions.organizationId, org),
              eq(s.correctiveActions.incidentCode, target.incidentCode),
            ),
          )
          .get();
        if (!capa)
          throw new Error("A corrective action is required before CAPA review");
      }
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .update(s.incidents)
            .set({
              status: next,
              containedAt:
                next === "contained"
                  ? new Date().toISOString()
                  : target.containedAt,
            })
            .where(
              and(
                eq(s.incidents.organizationId, org),
                eq(s.incidents.incidentCode, target.incidentCode),
                eq(s.incidents.status, target.status),
              ),
            )
            .returning(),
        ],
        {
          action: "incident.advanced",
          entityType: "incident",
          entityCode: target.incidentCode,
          details: `${target.status} → ${next}`,
          guard: sql`changes() = 1`,
        },
      );
      if (!rows[0]) throw new Error("Incident changed; refresh and try again");
      result = rows[0];
    } else if (action === "capa") {
      if (!allowed(actor, ["admin", "reviewer"]))
        throw new Error("ACCESS_DENIED");
      const code = id("CAPA");
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .insert(s.correctiveActions)
            .values({
              organizationId: org,
              incidentCode: String(b.incidentCode),
              actionCode: code,
              rootCause: String(b.rootCause),
              action: String(b.correctiveAction),
              owner: String(b.owner),
              dueDate: String(b.dueDate),
              effectivenessTest: String(b.effectivenessTest),
            })
            .returning(),
        ],
        {
          action: "capa.created",
          entityType: "corrective_action",
          entityCode: code,
          details: String(b.correctiveAction),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "capa_transition") {
      const code = String(b.actionCode);
      const next = String(b.status);
      const flow = ["open", "implemented", "effectiveness_verified", "closed"];
      const target = await db
        .select()
        .from(s.correctiveActions)
        .where(
          and(
            eq(s.correctiveActions.organizationId, org),
            eq(s.correctiveActions.actionCode, code),
          ),
        )
        .get();
      if (!target) throw new Error("Corrective action not found");
      if (flow.indexOf(next) !== flow.indexOf(target.status) + 1)
        throw new Error("Invalid corrective-action transition");
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .update(s.correctiveActions)
            .set({ status: next })
            .where(
              and(
                eq(s.correctiveActions.organizationId, org),
                eq(s.correctiveActions.actionCode, code),
                eq(s.correctiveActions.status, target.status),
              ),
            )
            .returning(),
        ],
        {
          action: "capa.status_changed",
          entityType: "corrective_action",
          entityCode: code,
          details: JSON.stringify({
            from: target.status,
            to: next,
            notes: String(b.notes),
          }),
          guard: sql`changes() = 1`,
        },
      );
      const row = rows[0];
      if (!row)
        throw new Error("Corrective action changed; refresh and try again");
      result = row;
    } else if (action === "privacy_request") {
      const code = id("DSR");
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .insert(s.privacyRequests)
            .values({
              organizationId: org,
              requestCode: code,
              requestType: String(b.requestType),
              jurisdiction: String(b.jurisdiction),
              subjectReference: String(b.subjectReference),
              systemCode: String(b.systemCode),
              dueDate: String(b.dueDate),
              owner: String(b.owner || actor.email),
            })
            .returning(),
        ],
        {
          action: "privacy.request_logged",
          entityType: "privacy_request",
          entityCode: code,
          details: String(b.requestType),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "privacy_transition") {
      const code = String(b.requestCode);
      const next = String(b.status);
      const flow = [
        "identity_verification",
        "in_progress",
        "fulfilled",
        "closed",
      ];
      const target = await db
        .select()
        .from(s.privacyRequests)
        .where(
          and(
            eq(s.privacyRequests.organizationId, org),
            eq(s.privacyRequests.requestCode, code),
          ),
        )
        .get();
      if (!target) throw new Error("Privacy request not found");
      const valid =
        next === "denied" ||
        flow.indexOf(next) === flow.indexOf(target.status) + 1 ||
        (target.status === "denied" && next === "closed");
      if (!valid) throw new Error("Invalid privacy-request transition");
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .update(s.privacyRequests)
            .set({ status: next })
            .where(
              and(
                eq(s.privacyRequests.organizationId, org),
                eq(s.privacyRequests.requestCode, code),
                eq(s.privacyRequests.status, target.status),
              ),
            )
            .returning(),
        ],
        {
          action: "privacy.status_changed",
          entityType: "privacy_request",
          entityCode: code,
          details: JSON.stringify({
            from: target.status,
            to: next,
            notes: String(b.notes),
          }),
          guard: sql`changes() = 1`,
        },
      );
      const row = rows[0];
      if (!row)
        throw new Error("Privacy request changed; refresh and try again");
      result = row;
    } else if (action === "confidential_report_transition") {
      const code = String(b.trackingCode);
      const next = String(b.status);
      const flow = ["RECEIVED", "TRIAGED", "INVESTIGATING", "RESOLVED"];
      const target = await db
        .select()
        .from(s.confidentialReports)
        .where(
          and(
            eq(s.confidentialReports.organizationId, org),
            eq(s.confidentialReports.trackingCode, code),
          ),
        )
        .get();
      if (!target) throw new Error("Confidential report not found");
      if (flow.indexOf(next) !== flow.indexOf(target.status) + 1)
        throw new Error("Invalid confidential-report transition");
      const linkedIncidentCode = b.linkedIncidentCode
        ? String(b.linkedIncidentCode)
        : target.linkedIncidentCode;
      if (linkedIncidentCode) {
        const incident = await db
          .select({ id: s.incidents.id })
          .from(s.incidents)
          .where(
            and(
              eq(s.incidents.organizationId, org),
              eq(s.incidents.incidentCode, linkedIncidentCode),
            ),
          )
          .get();
        if (!incident) throw new Error("Linked incident not found");
      }
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .update(s.confidentialReports)
            .set({
              status: next,
              handlerNotes: String(b.notes),
              linkedIncidentCode,
            })
            .where(
              and(
                eq(s.confidentialReports.organizationId, org),
                eq(s.confidentialReports.trackingCode, code),
                eq(s.confidentialReports.status, target.status),
              ),
            )
            .returning(),
        ],
        {
          action: "confidential_report.status_changed",
          entityType: "confidential_report",
          entityCode: code,
          details: JSON.stringify({
            from: target.status,
            to: next,
            linkedIncidentCode,
          }),
          guard: sql`changes() = 1`,
        },
      );
      const row = rows[0];
      if (!row)
        throw new Error("Confidential report changed; refresh and try again");
      result = {
        trackingCode: row.trackingCode,
        status: row.status,
        linkedIncidentCode: row.linkedIncidentCode,
      };
    } else if (action === "policy") {
      if (!allowed(actor, ["admin", "approver"]))
        throw new Error("ACCESS_DENIED");
      const policyCode = String(b.policyCode);
      const version = String(b.version);
      const [rows] = await auditedBatch(
        db,
        actor,
        request,
        [
          db
            .insert(s.policies)
            .values({
              organizationId: org,
              policyCode,
              title: String(b.title),
              version,
              effectiveDate: String(b.effectiveDate),
              approvedBy: actor.email,
              status: "active",
              body: String(b.body),
            })
            .returning(),
        ],
        {
          action: "policy.published",
          entityType: "policy",
          entityCode: `${policyCode}:${version}`,
          details: String(b.title),
        },
      );
      const row = rows[0];
      result = row;
    } else if (action === "export_package") {
      const code = String(b.systemCode);
      const [
        system,
        models,
        risks,
        decisions,
        evidenceRows,
        incidents,
        sovereignResilience,
        recoveryExercises,
        deploymentGates,
        publicSectorAssessments,
        africaFirstAssessments,
        privacyComplianceAssessments,
        modelRetirements,
        agents,
        vendorRows,
        skills,
      ] =
        await Promise.all([
          db
            .select()
            .from(s.aiSystems)
            .where(
              and(
                eq(s.aiSystems.organizationId, org),
                eq(s.aiSystems.systemCode, code),
              ),
            )
            .get(),
          db
            .select()
            .from(s.modelVersions)
            .where(
              and(
                eq(s.modelVersions.organizationId, org),
                eq(s.modelVersions.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.riskAssessments)
            .where(
              and(
                eq(s.riskAssessments.organizationId, org),
                eq(s.riskAssessments.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.guardrailDecisions)
            .where(
              and(
                eq(s.guardrailDecisions.organizationId, org),
                eq(s.guardrailDecisions.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.evidence)
            .where(
              and(
                eq(s.evidence.organizationId, org),
                eq(s.evidence.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.incidents)
            .where(
              and(
                eq(s.incidents.organizationId, org),
                eq(s.incidents.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.sovereignResilienceAssessments)
            .where(
              and(
                eq(s.sovereignResilienceAssessments.organizationId, org),
                eq(s.sovereignResilienceAssessments.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.recoveryExercises)
            .where(
              and(
                eq(s.recoveryExercises.organizationId, org),
                eq(s.recoveryExercises.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.deploymentGates)
            .where(
              and(
                eq(s.deploymentGates.organizationId, org),
                eq(s.deploymentGates.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.publicSectorAssessments)
            .where(
              and(
                eq(s.publicSectorAssessments.organizationId, org),
                eq(s.publicSectorAssessments.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.africaFirstAssessments)
            .where(
              and(
                eq(s.africaFirstAssessments.organizationId, org),
                eq(s.africaFirstAssessments.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.privacyComplianceAssessments)
            .where(
              and(
                eq(s.privacyComplianceAssessments.organizationId, org),
                eq(s.privacyComplianceAssessments.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.modelRetirements)
            .where(
              and(
                eq(s.modelRetirements.organizationId, org),
                eq(s.modelRetirements.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.aiAgents)
            .where(
              and(
                eq(s.aiAgents.organizationId, org),
                eq(s.aiAgents.systemCode, code),
              ),
            ),
          db
            .select()
            .from(s.vendorRiskRegister)
            .where(eq(s.vendorRiskRegister.organizationId, org)),
          db
            .select()
            .from(s.skillRegistry)
            .where(
              and(
                eq(s.skillRegistry.organizationId, org),
                eq(s.skillRegistry.systemCode, code),
              ),
            ),
        ]);
      if (!system) throw new Error("AI system not found");
      const agentCodes = agents.map((row) => row.agentCode);
      const skillCodes = skills.map((row) => row.skillCode);
      const decisionCodes = decisions.map((row) => row.decisionCode);
      const incidentCodes = incidents.map((row) => row.incidentCode);
      const linkedVendors = vendorRows.filter((row) =>
        String(row.linkedSystems)
          .split(/[,;|\n]/)
          .map((value) => value.trim())
          .includes(code),
      );
      const [accessGrants, approvals, overrides, correctiveActions] =
        await Promise.all([
          agentCodes.length
            ? db
                .select()
                .from(s.accessGrants)
                .where(
                  and(
                    eq(s.accessGrants.organizationId, org),
                    inArray(s.accessGrants.agentCode, agentCodes),
                  ),
                )
            : Promise.resolve([]),
          decisionCodes.length
            ? db
                .select()
                .from(s.approvals)
                .where(
                  and(
                    eq(s.approvals.organizationId, org),
                    inArray(s.approvals.decisionCode, decisionCodes),
                  ),
                )
            : Promise.resolve([]),
          decisionCodes.length
            ? db
                .select()
                .from(s.overrides)
                .where(
                  and(
                    eq(s.overrides.organizationId, org),
                    inArray(s.overrides.decisionCode, decisionCodes),
                  ),
                )
            : Promise.resolve([]),
          incidentCodes.length
            ? db
                .select()
                .from(s.correctiveActions)
                .where(
                  and(
                    eq(s.correctiveActions.organizationId, org),
                    inArray(s.correctiveActions.incidentCode, incidentCodes),
                  ),
                )
            : Promise.resolve([]),
        ]);
      const [
        skillVersions,
        skillProvenance,
        skillProposals,
        skillValidations,
        skillApprovals,
        skillDeployments,
        skillPerformanceReviews,
        skillRollbacks,
      ] = await Promise.all([
        skillCodes.length
          ? db.select().from(s.skillVersions).where(and(eq(s.skillVersions.organizationId, org), inArray(s.skillVersions.skillCode, skillCodes)))
          : Promise.resolve([]),
        skillCodes.length
          ? db.select().from(s.skillProvenance).where(and(eq(s.skillProvenance.organizationId, org), inArray(s.skillProvenance.skillCode, skillCodes)))
          : Promise.resolve([]),
        skillCodes.length
          ? db.select().from(s.skillChangeProposals).where(and(eq(s.skillChangeProposals.organizationId, org), inArray(s.skillChangeProposals.skillCode, skillCodes)))
          : Promise.resolve([]),
        skillCodes.length
          ? db.select().from(s.skillValidationRuns).where(and(eq(s.skillValidationRuns.organizationId, org), inArray(s.skillValidationRuns.skillCode, skillCodes)))
          : Promise.resolve([]),
        skillCodes.length
          ? db.select().from(s.skillApprovals).where(and(eq(s.skillApprovals.organizationId, org), inArray(s.skillApprovals.skillCode, skillCodes)))
          : Promise.resolve([]),
        skillCodes.length
          ? db.select().from(s.skillDeployments).where(and(eq(s.skillDeployments.organizationId, org), inArray(s.skillDeployments.skillCode, skillCodes)))
          : Promise.resolve([]),
        skillCodes.length
          ? db.select().from(s.skillPerformanceReviews).where(and(eq(s.skillPerformanceReviews.organizationId, org), inArray(s.skillPerformanceReviews.skillCode, skillCodes)))
          : Promise.resolve([]),
        skillCodes.length
          ? db.select().from(s.skillRollbacks).where(and(eq(s.skillRollbacks.organizationId, org), inArray(s.skillRollbacks.skillCode, skillCodes)))
          : Promise.resolve([]),
      ]);
      const [
        privacyPurposeLawfulness,
        privacyDataInventoryFlows,
        privacyRightsRequests,
        privacyThirdPartyAssessments,
        privacyRiskAssessments,
        privacyDpiaAssessments,
        privacyAiDataAssessments,
        privacyRetentionRecords,
        privacyGovernanceEvidence,
      ] = await Promise.all([
        db.select().from(s.privacyPurposeLawfulness).where(and(eq(s.privacyPurposeLawfulness.organizationId, org), eq(s.privacyPurposeLawfulness.systemCode, code))),
        db.select().from(s.privacyDataInventoryFlows).where(and(eq(s.privacyDataInventoryFlows.organizationId, org), eq(s.privacyDataInventoryFlows.systemCode, code))),
        db.select().from(s.privacyRightsRequests).where(and(eq(s.privacyRightsRequests.organizationId, org), eq(s.privacyRightsRequests.systemCode, code))),
        db.select().from(s.privacyThirdPartyAssessments).where(and(eq(s.privacyThirdPartyAssessments.organizationId, org), eq(s.privacyThirdPartyAssessments.systemCode, code))),
        db.select().from(s.privacyRiskAssessments).where(and(eq(s.privacyRiskAssessments.organizationId, org), eq(s.privacyRiskAssessments.systemCode, code))),
        db.select().from(s.privacyDpiaAssessments).where(and(eq(s.privacyDpiaAssessments.organizationId, org), eq(s.privacyDpiaAssessments.systemCode, code))),
        db.select().from(s.privacyAiDataAssessments).where(and(eq(s.privacyAiDataAssessments.organizationId, org), eq(s.privacyAiDataAssessments.systemCode, code))),
        db.select().from(s.privacyRetentionRecords).where(and(eq(s.privacyRetentionRecords.organizationId, org), eq(s.privacyRetentionRecords.systemCode, code))),
        db.select().from(s.privacyGovernanceEvidence).where(and(eq(s.privacyGovernanceEvidence.organizationId, org), eq(s.privacyGovernanceEvidence.systemCode, code))),
      ]);

      const relatedEntityCodes = [
        code,
        ...models.map((row) => String(row.id)),
        ...decisions.map((row) => row.decisionCode),
        ...evidenceRows.map((row) => row.evidenceCode),
        ...incidents.map((row) => row.incidentCode),
        ...sovereignResilience.map((row) => row.assessmentCode),
        ...recoveryExercises.map((row) => row.exerciseCode),
        ...deploymentGates.map((row) => row.gateCode),
        ...modelRetirements.map((row) => row.retirementCode),
        ...agents.map((row) => row.agentCode),
        ...skills.map((row) => row.skillCode),
        ...privacyPurposeLawfulness.map((row) => row.recordCode),
        ...privacyDataInventoryFlows.map((row) => row.recordCode),
        ...privacyRightsRequests.map((row) => row.recordCode),
        ...privacyThirdPartyAssessments.map((row) => row.recordCode),
        ...privacyRiskAssessments.map((row) => row.recordCode),
        ...privacyDpiaAssessments.map((row) => row.recordCode),
        ...privacyAiDataAssessments.map((row) => row.recordCode),
        ...privacyRetentionRecords.map((row) => row.recordCode),
        ...privacyGovernanceEvidence.map((row) => row.recordCode),
        ...accessGrants.map((row) => row.grantCode),
        ...correctiveActions.map((row) => row.actionCode),
      ];
      const [auditIntegrity, auditHistory] = await Promise.all([
        verifyAuditChain(db, org),
        db
          .select({
            id: s.auditEvents.id,
            actorEmail: s.auditEvents.actorEmail,
            actorRole: s.auditEvents.actorRole,
            action: s.auditEvents.action,
            entityType: s.auditEvents.entityType,
            entityCode: s.auditEvents.entityCode,
            details: s.auditEvents.details,
            previousHash: s.auditEvents.previousHash,
            eventHash: s.auditEvents.eventHash,
            hashVersion: s.auditEvents.hashVersion,
            createdAt: s.auditEvents.createdAt,
          })
          .from(s.auditEvents)
          .where(
            and(
              eq(s.auditEvents.organizationId, org),
              inArray(s.auditEvents.entityCode, relatedEntityCodes),
            ),
          )
          .orderBy(s.auditEvents.id),
      ]);
      const latestRecovery = recoveryExercises.at(-1) ?? null;
      const unresolvedFindings = {
        resilience: sovereignResilience.flatMap((row) => row.failedChecks),
        failedRecoveryExercises: recoveryExercises
          .filter((row) => row.outcome !== "PASSED")
          .map((row) => ({
            exerciseCode: row.exerciseCode,
            failedChecks: row.failedChecks,
          })),
        deploymentGates: deploymentGates
          .filter((row) => row.outcome !== "APPROVED")
          .map((row) => ({ gateCode: row.gateCode, outcome: row.outcome })),
        openIncidents: incidents
          .filter((row) => row.status !== "closed")
          .map((row) => ({
            incidentCode: row.incidentCode,
            severity: row.severity,
            status: row.status,
          })),
        highRiskVendors: linkedVendors
          .filter((row) => ["High", "Critical"].includes(row.residualRisk))
          .map((row) => ({
            vendorCode: row.vendorCode,
            vendorName: row.vendorName,
            residualRisk: row.residualRisk,
          })),
        skillGovernance: {
          suspendedOrRetired: skills
            .filter((row) => ["suspended", "retired"].includes(row.lifecycleStatus))
            .map((row) => ({ skillCode: row.skillCode, status: row.lifecycleStatus })),
          failedValidations: skillValidations
            .filter((row) => row.outcome === "VALIDATION_FAILED")
            .map((row) => ({ validationCode: row.validationCode, skillCode: row.skillCode })),
          pendingApprovals: skillProposals
            .filter((row) => ["ready_for_approval", "partially_approved"].includes(row.status))
            .map((row) => ({ proposalCode: row.proposalCode, skillCode: row.skillCode, status: row.status })),
        },
      };
      result = {
        packageVersion: "2.0",
        generatedAt: new Date().toISOString(),
        generatedBy: {
          displayName: actor.displayName,
          email: actor.email,
          role: actor.role,
          organizationName: actor.organizationName,
        },
        scope: {
          organizationId: org,
          systemCode: code,
          deploymentModel: "Shared application deployment",
          isolationModel:
            "Organization-scoped records with server-side authorization",
          dedicatedDeployment:
            "Available only when separately agreed and configured",
          persistence: "Cloudflare D1",
          offlineMode: "Not supported",
        },
        auditIntegrity,
        auditHistory,
        system,
        models,
        modelRetirements,
        risks,
        decisions,
        approvals,
        overrides,
        evidence: evidenceRows,
        incidents,
        correctiveActions,
        deploymentGates,
        agents,
        accessGrants,
        skillGovernance: {
          registry: skills,
          versions: skillVersions,
          provenance: skillProvenance,
          proposals: skillProposals,
          validations: skillValidations,
          approvals: skillApprovals,
          deployments: skillDeployments,
          performanceReviews: skillPerformanceReviews,
          rollbacks: skillRollbacks,
        },
        vendors: linkedVendors,
        publicSectorAssessments,
        africaFirstAssessments,
        privacyComplianceAssessments,
        dataProtectionGovernance: {
          purposeAndLawfulness: privacyPurposeLawfulness,
          dataInventoryAndFlows: privacyDataInventoryFlows,
          dataSubjectRights: privacyRightsRequests,
          thirdParties: privacyThirdPartyAssessments,
          privacyRisk: privacyRiskAssessments,
          dpias: privacyDpiaAssessments,
          aiDataProtection: privacyAiDataAssessments,
          retentionAndDeletion: privacyRetentionRecords,
          governanceEvidence: privacyGovernanceEvidence,
        },
        sovereignResilience,
        recoveryAssurance: {
          status: latestRecovery?.outcome ?? "NO EXERCISE RECORDED",
          latestExercise: latestRecovery,
          exercises: recoveryExercises,
        },
        unresolvedFindings,
      };
      await audit(
        db,
        actor,
        request,
        "evidence.package_exported",
        "ai_system",
        code,
        "Complete governance evidence package generated",
      );
    } else throw new Error("Unknown action");
    return json({ ok: true, result });
  } catch (e) {
    return errorResponse(e, "governance.write");
  }
}
