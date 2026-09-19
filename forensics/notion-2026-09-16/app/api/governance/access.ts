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

const allRoles = [...ROLES];
const ownerReview = ["admin", "system_owner", "reviewer"];
const assurance = ["admin", "reviewer", "auditor"];

export const ACTION_ROLES: Record<string, readonly string[]> = {
  invite_user: ["admin"],
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
  assess_agrifood_supply: assurance,
  register_legal_source: assurance,
  assess_privacy_compliance: assurance,
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
  privacy_request: allRoles,
  confidential_report: allRoles,
  policy: ["admin", "approver"],
  export_package: ["admin", "system_owner", "reviewer", "auditor"],
};

export function assertKnownRole(role: string): asserts role is Role {
  if (!ROLES.includes(role as Role)) throw new Error("ACCESS_DENIED");
}

export function assertActionAllowed(actor: Actor, action: string) {
  const roles = ACTION_ROLES[action];
  if (!roles) throw new ApiError("UNKNOWN_ACTION", "Unknown action", 400);
  if (!roles.includes(actor.role)) throw new Error("ACCESS_DENIED");
}

export function capabilitiesFor(actor: Actor) {
  return Object.entries(ACTION_ROLES)
    .filter(([, roles]) => roles.includes(actor.role))
    .map(([action]) => action);
}

export function canReadSensitive(actor: Actor) {
  return ["admin", "reviewer", "auditor", "accountable_executive"].includes(actor.role);
}

export function canReadAudit(actor: Actor) {
  return ["admin", "auditor", "accountable_executive"].includes(actor.role);
}
