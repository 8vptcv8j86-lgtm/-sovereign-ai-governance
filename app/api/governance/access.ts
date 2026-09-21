import type { Actor } from "../../org-auth";
import { ApiError } from "../http";

export const ROLES = [
  "admin",
  "system_owner",
  "reviewer",
  "approver",
  "auditor",
  "accountable_executive",
] as const;

export type Role = (typeof ROLES)[number];

const allRoles: readonly Role[] = [...ROLES];
const ownerReview: readonly Role[] = ["admin", "system_owner", "reviewer"];
const assurance: readonly Role[] = ["admin", "reviewer", "auditor"];

export const ACTION_ROLES = {
  invite_user: ["admin"],
  update_user: ["admin"],
  designate_accountable_executive: ["admin"],
  open_workforce_conduct_case: ["admin"],
  advance_workforce_conduct_stage: ["admin"],
  open_accountability_succession: ["admin"],
  reassign_accountability_succession: ["admin"],
  flag_overdue_successions: ["admin", "auditor"],
  scan_conduct_patterns: ["admin", "auditor"],
  review_conduct_pattern: ["admin"],
  register_system: ["admin", "system_owner"],
  register_agent: ["admin", "system_owner"],
  request_access: ownerReview,
  access_transition: ["admin", "approver", "reviewer"],
  authorize_agent_action: ownerReview,
  evaluate_agency_gate: ownerReview,
  agency_transition: ["admin", "approver"],
  evaluate_deployment_gate: ownerReview,
  approve_deployment_gate: ["admin", "approver"],
  model_version: ownerReview,
  model_retirement: ownerReview,
  model_retirement_transition: ["admin", "approver", "reviewer"],
  risk_assessment: assurance,
  vendor_risk: ["admin", "system_owner", "reviewer", "auditor"],
  competency_record: assurance,
  assess_workforce_absorption: assurance,
  assess_public_sector_ai: assurance,
  create_foresight_scenario: ownerReview,
  assess_implementation_capacity: assurance,
  assess_infrastructure_dividend: assurance,
  assess_africa_first: assurance,
  assess_sovereign_resilience: ["admin", "system_owner", "reviewer", "auditor"],
  record_recovery_exercise: ["admin", "reviewer", "auditor"],
  assess_agrifood_supply: assurance,
  register_legal_source: assurance,
  assess_privacy_compliance: ["admin", "system_owner", "reviewer", "auditor"],
  control: ["admin", "reviewer"],
  guardrail_decision: ownerReview,
  approve: ["admin", "approver", "reviewer"],
  request_override: ["admin", "system_owner"],
  override_approve: ["admin", "approver"],
  override_deny: ["admin", "approver"],
  evidence: ["admin", "system_owner", "reviewer", "auditor"],
  incident: ["admin", "system_owner", "reviewer"],
  incident_advance: ["admin", "reviewer", "approver"],
  capa: ["admin", "reviewer"],
  capa_transition: ["admin", "reviewer", "auditor"],
  privacy_request: allRoles,
  privacy_transition: ["admin", "reviewer", "auditor", "accountable_executive"],
  confidential_report: allRoles,
  confidential_report_transition: [
    "admin",
    "reviewer",
    "auditor",
    "accountable_executive",
  ],
  policy: ["admin", "approver"],
  export_package: ["admin", "system_owner", "reviewer", "auditor"],
  register_skill: ["admin", "system_owner"],
  record_skill_provenance: ["admin", "system_owner", "reviewer"],
  propose_skill_version: ["admin", "system_owner"],
  start_skill_validation: ["admin", "reviewer"],
  complete_skill_validation: ["admin", "reviewer"],
  approve_skill_change: ["admin", "approver"],
  deny_skill_change: ["admin", "approver"],
  deploy_skill_version: ["admin", "system_owner", "approver"],
  record_skill_performance_review: ["admin", "reviewer"],
  suspend_skill_version: ["admin", "approver"],
  rollback_skill_version: ["admin", "approver"],
  retire_skill: ["admin", "system_owner"],
  export_skill_evidence_package: ["admin", "system_owner", "reviewer", "auditor"],
} satisfies Record<string, readonly Role[]>;

export function assertKnownRole(role: string): asserts role is Role {
  if (!ROLES.includes(role as Role)) throw new Error("ACCESS_DENIED");
}

export function assertActionAllowed(actor: Actor, action: string) {
  const roles = ACTION_ROLES[
    action as keyof typeof ACTION_ROLES
  ] as readonly Role[] | undefined;
  if (!roles) throw new ApiError("UNKNOWN_ACTION", "Unknown action", 400);
  if (!roles.includes(actor.role as Role)) throw new Error("ACCESS_DENIED");
}

export function capabilitiesFor(actor: Actor) {
  return Object.entries(ACTION_ROLES)
    .filter(([, roles]) => (roles as readonly Role[]).includes(actor.role as Role))
    .map(([action]) => action);
}

export function canReadSensitive(actor: Actor) {
  return ["admin", "reviewer", "auditor", "accountable_executive"].includes(
    actor.role as Role,
  );
}

export function canReadAudit(actor: Actor) {
  return ["admin", "auditor", "accountable_executive"].includes(actor.role as Role);
}
