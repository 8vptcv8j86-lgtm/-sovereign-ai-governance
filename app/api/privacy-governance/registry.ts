import * as s from "../../../db/schema";

export const PRIVACY_GOVERNANCE = {
  privacy_purpose_lawfulness: {
    label: "Purpose, lawfulness and minimisation",
    table: s.privacyPurposeLawfulness,
    action: "record_privacy_purpose",
  },
  privacy_data_inventory_flows: {
    label: "Data inventory and flows",
    table: s.privacyDataInventoryFlows,
    action: "record_privacy_data_flow",
  },
  privacy_rights_requests: {
    label: "Data subject rights",
    table: s.privacyRightsRequests,
    action: "record_privacy_rights",
  },
  privacy_third_party_assessments: {
    label: "Third-party privacy",
    table: s.privacyThirdPartyAssessments,
    action: "assess_privacy_third_party",
  },
  privacy_risk_assessments: {
    label: "Privacy risk",
    table: s.privacyRiskAssessments,
    action: "assess_privacy_risk",
  },
  privacy_dpia_assessments: {
    label: "DPIA",
    table: s.privacyDpiaAssessments,
    action: "conduct_privacy_dpia",
  },
  privacy_ai_data_assessments: {
    label: "AI data protection",
    table: s.privacyAiDataAssessments,
    action: "assess_ai_data_privacy",
  },
  privacy_retention_records: {
    label: "Retention and deletion",
    table: s.privacyRetentionRecords,
    action: "record_privacy_retention",
  },
  privacy_governance_evidence: {
    label: "Governance and evidence",
    table: s.privacyGovernanceEvidence,
    action: "record_privacy_evidence",
  },
} as const;

export type PrivacyEntity = keyof typeof PRIVACY_GOVERNANCE;
export const PRIVACY_ENTITIES = Object.keys(PRIVACY_GOVERNANCE) as PrivacyEntity[];

export function isPrivacyEntity(value: string): value is PrivacyEntity {
  return Object.prototype.hasOwnProperty.call(PRIVACY_GOVERNANCE, value);
}

export function entityForAction(action: string): PrivacyEntity | null {
  return (
    PRIVACY_ENTITIES.find(
      (entity) => PRIVACY_GOVERNANCE[entity].action === action,
    ) ?? null
  );
}
