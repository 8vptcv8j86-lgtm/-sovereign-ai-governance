CREATE TABLE `artifact_reliance_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `artifact_reliance_records_record_code_unique` ON `artifact_reliance_records` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_artifact_reliance_records_org_state` ON `artifact_reliance_records` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_artifact_reliance_records_org_subject` ON `artifact_reliance_records` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `capture_artifacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `capture_artifacts_record_code_unique` ON `capture_artifacts` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_capture_artifacts_org_state` ON `capture_artifacts` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_capture_artifacts_org_subject` ON `capture_artifacts` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `capture_deletion_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `capture_deletion_events_record_code_unique` ON `capture_deletion_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_capture_deletion_events_org_state` ON `capture_deletion_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_capture_deletion_events_org_subject` ON `capture_deletion_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `capture_evidence_anchors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `capture_evidence_anchors_record_code_unique` ON `capture_evidence_anchors` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_capture_evidence_anchors_org_state` ON `capture_evidence_anchors` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_capture_evidence_anchors_org_subject` ON `capture_evidence_anchors` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `capture_integrity_checks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `capture_integrity_checks_record_code_unique` ON `capture_integrity_checks` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_capture_integrity_checks_org_state` ON `capture_integrity_checks` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_capture_integrity_checks_org_subject` ON `capture_integrity_checks` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `capture_processing_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `capture_processing_events_record_code_unique` ON `capture_processing_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_capture_processing_events_org_state` ON `capture_processing_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_capture_processing_events_org_subject` ON `capture_processing_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `capture_scope_policies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `capture_scope_policies_record_code_unique` ON `capture_scope_policies` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_capture_scope_policies_org_state` ON `capture_scope_policies` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_capture_scope_policies_org_subject` ON `capture_scope_policies` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `capture_storage_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `capture_storage_profiles_record_code_unique` ON `capture_storage_profiles` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_capture_storage_profiles_org_state` ON `capture_storage_profiles` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_capture_storage_profiles_org_subject` ON `capture_storage_profiles` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `data_egress_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `data_egress_events_record_code_unique` ON `data_egress_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_data_egress_events_org_state` ON `data_egress_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_data_egress_events_org_subject` ON `data_egress_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `data_lane_policies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `data_lane_policies_record_code_unique` ON `data_lane_policies` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_data_lane_policies_org_state` ON `data_lane_policies` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_data_lane_policies_org_subject` ON `data_lane_policies` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `data_plane_policies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `data_plane_policies_record_code_unique` ON `data_plane_policies` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_data_plane_policies_org_state` ON `data_plane_policies` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_data_plane_policies_org_subject` ON `data_plane_policies` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `evidence_artifact_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `evidence_artifact_versions_record_code_unique` ON `evidence_artifact_versions` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_evidence_artifact_versions_org_state` ON `evidence_artifact_versions` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_evidence_artifact_versions_org_subject` ON `evidence_artifact_versions` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `evidence_artifacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `evidence_artifacts_record_code_unique` ON `evidence_artifacts` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_evidence_artifacts_org_state` ON `evidence_artifacts` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_evidence_artifacts_org_subject` ON `evidence_artifacts` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `evidence_disclosure_activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `evidence_disclosure_activities_record_code_unique` ON `evidence_disclosure_activities` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_evidence_disclosure_activities_org_state` ON `evidence_disclosure_activities` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_evidence_disclosure_activities_org_subject` ON `evidence_disclosure_activities` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `evidence_disclosure_grants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `evidence_disclosure_grants_record_code_unique` ON `evidence_disclosure_grants` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_evidence_disclosure_grants_org_state` ON `evidence_disclosure_grants` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_evidence_disclosure_grants_org_subject` ON `evidence_disclosure_grants` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `evidence_redaction_jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `evidence_redaction_jobs_record_code_unique` ON `evidence_redaction_jobs` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_evidence_redaction_jobs_org_state` ON `evidence_redaction_jobs` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_evidence_redaction_jobs_org_subject` ON `evidence_redaction_jobs` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `evidence_request_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `evidence_request_tasks_record_code_unique` ON `evidence_request_tasks` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_evidence_request_tasks_org_state` ON `evidence_request_tasks` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_evidence_request_tasks_org_subject` ON `evidence_request_tasks` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `evidence_room_freezes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `evidence_room_freezes_record_code_unique` ON `evidence_room_freezes` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_evidence_room_freezes_org_state` ON `evidence_room_freezes` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_evidence_room_freezes_org_subject` ON `evidence_room_freezes` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `execution_checkpoints` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `execution_checkpoints_record_code_unique` ON `execution_checkpoints` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_execution_checkpoints_org_state` ON `execution_checkpoints` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_execution_checkpoints_org_subject` ON `execution_checkpoints` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `execution_preflights` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `execution_preflights_record_code_unique` ON `execution_preflights` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_execution_preflights_org_state` ON `execution_preflights` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_execution_preflights_org_subject` ON `execution_preflights` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `execution_resume_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `execution_resume_events_record_code_unique` ON `execution_resume_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_execution_resume_events_org_state` ON `execution_resume_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_execution_resume_events_org_subject` ON `execution_resume_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governance_entitlements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governance_entitlements_record_code_unique` ON `governance_entitlements` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governance_entitlements_org_state` ON `governance_entitlements` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governance_entitlements_org_subject` ON `governance_entitlements` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governance_evaluation_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governance_evaluation_runs_record_code_unique` ON `governance_evaluation_runs` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governance_evaluation_runs_org_state` ON `governance_evaluation_runs` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governance_evaluation_runs_org_subject` ON `governance_evaluation_runs` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governance_quota_policies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governance_quota_policies_record_code_unique` ON `governance_quota_policies` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governance_quota_policies_org_state` ON `governance_quota_policies` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governance_quota_policies_org_subject` ON `governance_quota_policies` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governance_reconciliations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governance_reconciliations_record_code_unique` ON `governance_reconciliations` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governance_reconciliations_org_state` ON `governance_reconciliations` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governance_reconciliations_org_subject` ON `governance_reconciliations` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governance_threshold_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governance_threshold_events_record_code_unique` ON `governance_threshold_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governance_threshold_events_org_state` ON `governance_threshold_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governance_threshold_events_org_subject` ON `governance_threshold_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governed_capture_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governed_capture_sessions_record_code_unique` ON `governed_capture_sessions` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governed_capture_sessions_org_state` ON `governed_capture_sessions` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governed_capture_sessions_org_subject` ON `governed_capture_sessions` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governed_context_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governed_context_records_record_code_unique` ON `governed_context_records` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governed_context_records_org_state` ON `governed_context_records` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governed_context_records_org_subject` ON `governed_context_records` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governed_evidence_rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governed_evidence_rooms_record_code_unique` ON `governed_evidence_rooms` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governed_evidence_rooms_org_state` ON `governed_evidence_rooms` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governed_evidence_rooms_org_subject` ON `governed_evidence_rooms` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governed_extensions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governed_extensions_record_code_unique` ON `governed_extensions` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governed_extensions_org_state` ON `governed_extensions` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governed_extensions_org_subject` ON `governed_extensions` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governed_loop_controls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governed_loop_controls_record_code_unique` ON `governed_loop_controls` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governed_loop_controls_org_state` ON `governed_loop_controls` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governed_loop_controls_org_subject` ON `governed_loop_controls` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governed_matters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governed_matters_record_code_unique` ON `governed_matters` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governed_matters_org_state` ON `governed_matters` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governed_matters_org_subject` ON `governed_matters` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governed_notification_workflows` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governed_notification_workflows_record_code_unique` ON `governed_notification_workflows` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governed_notification_workflows_org_state` ON `governed_notification_workflows` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governed_notification_workflows_org_subject` ON `governed_notification_workflows` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governed_source_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governed_source_records_record_code_unique` ON `governed_source_records` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governed_source_records_org_state` ON `governed_source_records` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governed_source_records_org_subject` ON `governed_source_records` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governed_usage_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governed_usage_events_record_code_unique` ON `governed_usage_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governed_usage_events_org_state` ON `governed_usage_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governed_usage_events_org_subject` ON `governed_usage_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governed_workflow_executions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governed_workflow_executions_record_code_unique` ON `governed_workflow_executions` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governed_workflow_executions_org_state` ON `governed_workflow_executions` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governed_workflow_executions_org_subject` ON `governed_workflow_executions` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `governed_workflows` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `governed_workflows_record_code_unique` ON `governed_workflows` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_governed_workflows_org_state` ON `governed_workflows` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_governed_workflows_org_subject` ON `governed_workflows` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `human_evidence_interactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `human_evidence_interactions_record_code_unique` ON `human_evidence_interactions` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_human_evidence_interactions_org_state` ON `human_evidence_interactions` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_human_evidence_interactions_org_subject` ON `human_evidence_interactions` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `human_evidence_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `human_evidence_requests_record_code_unique` ON `human_evidence_requests` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_human_evidence_requests_org_state` ON `human_evidence_requests` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_human_evidence_requests_org_subject` ON `human_evidence_requests` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `human_evidence_responses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `human_evidence_responses_record_code_unique` ON `human_evidence_responses` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_human_evidence_responses_org_state` ON `human_evidence_responses` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_human_evidence_responses_org_subject` ON `human_evidence_responses` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `notification_acknowledgements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `notification_acknowledgements_record_code_unique` ON `notification_acknowledgements` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_notification_acknowledgements_org_state` ON `notification_acknowledgements` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_notification_acknowledgements_org_subject` ON `notification_acknowledgements` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `notification_delivery_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `notification_delivery_attempts_record_code_unique` ON `notification_delivery_attempts` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_notification_delivery_attempts_org_state` ON `notification_delivery_attempts` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_notification_delivery_attempts_org_subject` ON `notification_delivery_attempts` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `notification_escalations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `notification_escalations_record_code_unique` ON `notification_escalations` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_notification_escalations_org_state` ON `notification_escalations` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_notification_escalations_org_subject` ON `notification_escalations` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `notification_instances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `notification_instances_record_code_unique` ON `notification_instances` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_notification_instances_org_state` ON `notification_instances` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_notification_instances_org_subject` ON `notification_instances` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `notification_provider_registry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `notification_provider_registry_record_code_unique` ON `notification_provider_registry` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_notification_provider_registry_org_state` ON `notification_provider_registry` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_notification_provider_registry_org_subject` ON `notification_provider_registry` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `object_storage_policies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `object_storage_policies_record_code_unique` ON `object_storage_policies` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_object_storage_policies_org_state` ON `object_storage_policies` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_object_storage_policies_org_subject` ON `object_storage_policies` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `premise_assertions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `premise_assertions_record_code_unique` ON `premise_assertions` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_premise_assertions_org_state` ON `premise_assertions` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_premise_assertions_org_subject` ON `premise_assertions` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `privileged_bypass_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privileged_bypass_events_record_code_unique` ON `privileged_bypass_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_privileged_bypass_events_org_state` ON `privileged_bypass_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_privileged_bypass_events_org_subject` ON `privileged_bypass_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `privileged_bypass_identities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privileged_bypass_identities_record_code_unique` ON `privileged_bypass_identities` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_privileged_bypass_identities_org_state` ON `privileged_bypass_identities` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_privileged_bypass_identities_org_subject` ON `privileged_bypass_identities` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `professional_review_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `professional_review_events_record_code_unique` ON `professional_review_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_professional_review_events_org_state` ON `professional_review_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_professional_review_events_org_subject` ON `professional_review_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `realtime_channel_policies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `realtime_channel_policies_record_code_unique` ON `realtime_channel_policies` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_realtime_channel_policies_org_state` ON `realtime_channel_policies` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_realtime_channel_policies_org_subject` ON `realtime_channel_policies` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `realtime_subscription_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `realtime_subscription_events_record_code_unique` ON `realtime_subscription_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_realtime_subscription_events_org_state` ON `realtime_subscription_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_realtime_subscription_events_org_subject` ON `realtime_subscription_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `release_gate_decisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `release_gate_decisions_record_code_unique` ON `release_gate_decisions` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_release_gate_decisions_org_state` ON `release_gate_decisions` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_release_gate_decisions_org_subject` ON `release_gate_decisions` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `runtime_state_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `runtime_state_records_record_code_unique` ON `runtime_state_records` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_runtime_state_records_org_state` ON `runtime_state_records` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_runtime_state_records_org_subject` ON `runtime_state_records` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `sandbox_policy_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sandbox_policy_profiles_record_code_unique` ON `sandbox_policy_profiles` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_sandbox_policy_profiles_org_state` ON `sandbox_policy_profiles` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_sandbox_policy_profiles_org_subject` ON `sandbox_policy_profiles` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `schema_policy_migration_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `schema_policy_migration_records_record_code_unique` ON `schema_policy_migration_records` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_schema_policy_migration_records_org_state` ON `schema_policy_migration_records` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_schema_policy_migration_records_org_subject` ON `schema_policy_migration_records` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `schema_policy_verification_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `schema_policy_verification_events_record_code_unique` ON `schema_policy_verification_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_schema_policy_verification_events_org_state` ON `schema_policy_verification_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_schema_policy_verification_events_org_subject` ON `schema_policy_verification_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `secret_reference_registry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `secret_reference_registry_record_code_unique` ON `secret_reference_registry` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_secret_reference_registry_org_state` ON `secret_reference_registry` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_secret_reference_registry_org_subject` ON `secret_reference_registry` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `secret_rotation_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `secret_rotation_events_record_code_unique` ON `secret_rotation_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_secret_rotation_events_org_state` ON `secret_rotation_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_secret_rotation_events_org_subject` ON `secret_rotation_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `security_lint_findings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `security_lint_findings_record_code_unique` ON `security_lint_findings` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_security_lint_findings_org_state` ON `security_lint_findings` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_security_lint_findings_org_subject` ON `security_lint_findings` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `security_lint_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `security_lint_rules_record_code_unique` ON `security_lint_rules` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_security_lint_rules_org_state` ON `security_lint_rules` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_security_lint_rules_org_subject` ON `security_lint_rules` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `source_provenance_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `source_provenance_records_record_code_unique` ON `source_provenance_records` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_source_provenance_records_org_state` ON `source_provenance_records` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_source_provenance_records_org_subject` ON `source_provenance_records` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `source_substitution_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `source_substitution_events_record_code_unique` ON `source_substitution_events` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_source_substitution_events_org_state` ON `source_substitution_events` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_source_substitution_events_org_subject` ON `source_substitution_events` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `tool_capability_registry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tool_capability_registry_record_code_unique` ON `tool_capability_registry` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_tool_capability_registry_org_state` ON `tool_capability_registry` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_tool_capability_registry_org_subject` ON `tool_capability_registry` (`organization_id`,`subject_code`);--> statement-breakpoint
CREATE TABLE `verification_memory_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`subject_code` text,
	`parent_code` text,
	`state` text DEFAULT 'active' NOT NULL,
	`data_lane` text DEFAULT 'INTERNAL' NOT NULL,
	`jurisdiction` text,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`created_by` text NOT NULL,
	`effective_at` text,
	`expires_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `verification_memory_records_record_code_unique` ON `verification_memory_records` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_verification_memory_records_org_state` ON `verification_memory_records` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_verification_memory_records_org_subject` ON `verification_memory_records` (`organization_id`,`subject_code`);