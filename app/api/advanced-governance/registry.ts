import * as s from "../../../db/schema";

export type AdvancedRevision =
  | "R2" | "R3" | "R4" | "R5" | "R6" | "R7"
  | "R8" | "R9" | "R10" | "R11" | "R12";

export const ADVANCED_GOVERNANCE = {
  governed_workflows: { revision: "R2", label: "Governed workflows", table: s.governedWorkflows },
  governed_workflow_executions: { revision: "R2", label: "Workflow executions", table: s.governedWorkflowExecutions },
  data_egress_events: { revision: "R2", label: "Data egress events", table: s.dataEgressEvents },

  governed_source_records: { revision: "R3", label: "Source freshness and health", table: s.governedSourceRecords },
  execution_preflights: { revision: "R3", label: "Execution preflights", table: s.executionPreflights },
  data_lane_policies: { revision: "R3", label: "Data lane policies", table: s.dataLanePolicies },

  governed_context_records: { revision: "R4", label: "Governed context", table: s.governedContextRecords },
  tool_capability_registry: { revision: "R4", label: "Tool capabilities", table: s.toolCapabilityRegistry },
  governance_evaluation_runs: { revision: "R4", label: "Evaluation runs", table: s.governanceEvaluationRuns },
  governed_loop_controls: { revision: "R4", label: "Loop controls", table: s.governedLoopControls },

  execution_checkpoints: { revision: "R5", label: "Execution checkpoints", table: s.executionCheckpoints },
  execution_resume_events: { revision: "R5", label: "Resume events", table: s.executionResumeEvents },
  sandbox_policy_profiles: { revision: "R5", label: "Sandbox policies", table: s.sandboxPolicyProfiles },
  governed_extensions: { revision: "R5", label: "Governed extensions", table: s.governedExtensions },
  runtime_state_records: { revision: "R5", label: "Runtime state", table: s.runtimeStateRecords },

  human_evidence_requests: { revision: "R6", label: "Human evidence requests", table: s.humanEvidenceRequests },
  human_evidence_interactions: { revision: "R6", label: "Human evidence interactions", table: s.humanEvidenceInteractions },
  human_evidence_responses: { revision: "R6", label: "Human evidence responses", table: s.humanEvidenceResponses },

  governed_usage_events: { revision: "R7", label: "Usage events", table: s.governedUsageEvents },
  governance_entitlements: { revision: "R7", label: "Entitlements", table: s.governanceEntitlements },
  governance_quota_policies: { revision: "R7", label: "Quota policies", table: s.governanceQuotaPolicies },
  governance_threshold_events: { revision: "R7", label: "Threshold events", table: s.governanceThresholdEvents },
  governance_reconciliations: { revision: "R7", label: "Reconciliations", table: s.governanceReconciliations },

  governed_notification_workflows: { revision: "R8", label: "Notification workflows", table: s.governedNotificationWorkflows },
  notification_instances: { revision: "R8", label: "Notification instances", table: s.notificationInstances },
  notification_delivery_attempts: { revision: "R8", label: "Delivery attempts", table: s.notificationDeliveryAttempts },
  notification_acknowledgements: { revision: "R8", label: "Acknowledgements", table: s.notificationAcknowledgements },
  notification_escalations: { revision: "R8", label: "Escalations", table: s.notificationEscalations },
  notification_provider_registry: { revision: "R8", label: "Notification providers", table: s.notificationProviderRegistry },

  governed_evidence_rooms: { revision: "R9", label: "Evidence rooms", table: s.governedEvidenceRooms },
  evidence_artifacts: { revision: "R9", label: "Evidence artifacts", table: s.evidenceArtifacts },
  evidence_artifact_versions: { revision: "R9", label: "Evidence artifact versions", table: s.evidenceArtifactVersions },
  evidence_disclosure_grants: { revision: "R9", label: "Disclosure grants", table: s.evidenceDisclosureGrants },
  evidence_disclosure_activities: { revision: "R9", label: "Disclosure activities", table: s.evidenceDisclosureActivities },
  evidence_request_tasks: { revision: "R9", label: "Evidence request tasks", table: s.evidenceRequestTasks },
  evidence_room_freezes: { revision: "R9", label: "Evidence room freezes", table: s.evidenceRoomFreezes },
  evidence_redaction_jobs: { revision: "R9", label: "Redaction jobs", table: s.evidenceRedactionJobs },

  governed_matters: { revision: "R10", label: "Matters and cases", table: s.governedMatters },
  premise_assertions: { revision: "R10", label: "Premise assertions", table: s.premiseAssertions },
  source_provenance_records: { revision: "R10", label: "Source provenance", table: s.sourceProvenanceRecords },
  artifact_reliance_records: { revision: "R10", label: "Reliance records", table: s.artifactRelianceRecords },
  professional_review_events: { revision: "R10", label: "Professional reviews", table: s.professionalReviewEvents },
  release_gate_decisions: { revision: "R10", label: "Release gates", table: s.releaseGateDecisions },
  source_substitution_events: { revision: "R10", label: "Source substitutions", table: s.sourceSubstitutionEvents },
  verification_memory_records: { revision: "R10", label: "Verification memory", table: s.verificationMemoryRecords },

  governed_capture_sessions: { revision: "R11", label: "Capture sessions", table: s.governedCaptureSessions },
  capture_scope_policies: { revision: "R11", label: "Capture scope policies", table: s.captureScopePolicies },
  capture_artifacts: { revision: "R11", label: "Capture artifacts", table: s.captureArtifacts },
  capture_evidence_anchors: { revision: "R11", label: "Evidence anchors", table: s.captureEvidenceAnchors },
  capture_storage_profiles: { revision: "R11", label: "Capture storage profiles", table: s.captureStorageProfiles },
  capture_processing_events: { revision: "R11", label: "Capture processing", table: s.captureProcessingEvents },
  capture_integrity_checks: { revision: "R11", label: "Capture integrity", table: s.captureIntegrityChecks },
  capture_deletion_events: { revision: "R11", label: "Capture deletion", table: s.captureDeletionEvents },

  data_plane_policies: { revision: "R12", label: "Data-plane policies", table: s.dataPlanePolicies },
  privileged_bypass_identities: { revision: "R12", label: "Privileged bypass identities", table: s.privilegedBypassIdentities },
  privileged_bypass_events: { revision: "R12", label: "Privileged bypass events", table: s.privilegedBypassEvents },
  realtime_channel_policies: { revision: "R12", label: "Realtime channel policies", table: s.realtimeChannelPolicies },
  realtime_subscription_events: { revision: "R12", label: "Realtime subscription events", table: s.realtimeSubscriptionEvents },
  object_storage_policies: { revision: "R12", label: "Object storage policies", table: s.objectStoragePolicies },
  secret_reference_registry: { revision: "R12", label: "Secret references", table: s.secretReferenceRegistry },
  secret_rotation_events: { revision: "R12", label: "Secret rotations", table: s.secretRotationEvents },
  security_lint_rules: { revision: "R12", label: "Security lint rules", table: s.securityLintRules },
  security_lint_findings: { revision: "R12", label: "Security lint findings", table: s.securityLintFindings },
  schema_policy_migration_records: { revision: "R12", label: "Schema/policy migrations", table: s.schemaPolicyMigrationRecords },
  schema_policy_verification_events: { revision: "R12", label: "Migration verification", table: s.schemaPolicyVerificationEvents },
} as const;

export type AdvancedEntity = keyof typeof ADVANCED_GOVERNANCE;

export const ADVANCED_ENTITIES = Object.keys(ADVANCED_GOVERNANCE) as AdvancedEntity[];

export function isAdvancedEntity(value: string): value is AdvancedEntity {
  return Object.prototype.hasOwnProperty.call(ADVANCED_GOVERNANCE, value);
}

export function entitiesForRevision(revision: AdvancedRevision) {
  return ADVANCED_ENTITIES.filter(
    (entity) => ADVANCED_GOVERNANCE[entity].revision === revision,
  );
}

export const RESTRICTED_ADMIN_ENTITIES = new Set<AdvancedEntity>([
  "privileged_bypass_identities",
  "secret_reference_registry",
  "secret_rotation_events",
  "schema_policy_migration_records",
  "schema_policy_verification_events",
]);
