CREATE TABLE `skill_approvals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`approval_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`proposal_code` text NOT NULL,
	`skill_code` text NOT NULL,
	`approver_email` text NOT NULL,
	`approver_role` text NOT NULL,
	`outcome` text NOT NULL,
	`justification` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_approvals_approval_code_unique` ON `skill_approvals` (`approval_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_skill_approvals_org_proposal_approver` ON `skill_approvals` (`organization_id`,`proposal_code`,`approver_email`);--> statement-breakpoint
CREATE INDEX `idx_skill_approvals_org_proposal` ON `skill_approvals` (`organization_id`,`proposal_code`);--> statement-breakpoint
CREATE TABLE `skill_change_proposals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`proposal_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`skill_code` text NOT NULL,
	`from_version` text,
	`proposed_version` text NOT NULL,
	`proposed_version_code` text NOT NULL,
	`change_rationale` text NOT NULL,
	`provenance_refs` text NOT NULL,
	`expected_benefit` text NOT NULL,
	`known_risks` text NOT NULL,
	`affected_workflows` text NOT NULL,
	`affected_tools` text NOT NULL,
	`affected_data` text NOT NULL,
	`rollback_target` text,
	`proposed_by` text NOT NULL,
	`status` text DEFAULT 'proposed' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_change_proposals_proposal_code_unique` ON `skill_change_proposals` (`proposal_code`);--> statement-breakpoint
CREATE INDEX `idx_skill_change_proposals_org_status` ON `skill_change_proposals` (`organization_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_skill_change_proposals_org_skill` ON `skill_change_proposals` (`organization_id`,`skill_code`);--> statement-breakpoint
CREATE TABLE `skill_deployments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deployment_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`skill_code` text NOT NULL,
	`approved_version` text NOT NULL,
	`target_agent` text NOT NULL,
	`target_system` text NOT NULL,
	`environment` text NOT NULL,
	`deployed_by` text NOT NULL,
	`approval_reference` text NOT NULL,
	`validation_reference` text NOT NULL,
	`prior_active_version` text,
	`rollback_version` text,
	`deployment_digest` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_deployments_deployment_code_unique` ON `skill_deployments` (`deployment_code`);--> statement-breakpoint
CREATE INDEX `idx_skill_deployments_org_skill_status` ON `skill_deployments` (`organization_id`,`skill_code`,`status`);--> statement-breakpoint
CREATE TABLE `skill_performance_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`review_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`skill_code` text NOT NULL,
	`version` text NOT NULL,
	`baseline_metric` text NOT NULL,
	`post_deployment_metric` text NOT NULL,
	`evaluation_window` text NOT NULL,
	`safety_incidents` integer DEFAULT 0 NOT NULL,
	`policy_violations` integer DEFAULT 0 NOT NULL,
	`human_override_rate` text NOT NULL,
	`failure_rate` text NOT NULL,
	`tool_error_rate` text NOT NULL,
	`unexpected_behavior` text NOT NULL,
	`conclusion` text NOT NULL,
	`reviewed_by` text NOT NULL,
	`next_review` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_performance_reviews_review_code_unique` ON `skill_performance_reviews` (`review_code`);--> statement-breakpoint
CREATE INDEX `idx_skill_performance_org_skill` ON `skill_performance_reviews` (`organization_id`,`skill_code`);--> statement-breakpoint
CREATE TABLE `skill_provenance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provenance_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`skill_code` text NOT NULL,
	`agent_code` text NOT NULL,
	`evidence_type` text NOT NULL,
	`evidence_reference` text NOT NULL,
	`observation_summary` text NOT NULL,
	`pattern` text NOT NULL,
	`source_execution_ids` text NOT NULL,
	`sensitive_data_classification` text NOT NULL,
	`retention_rule` text NOT NULL,
	`recorded_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_provenance_provenance_code_unique` ON `skill_provenance` (`provenance_code`);--> statement-breakpoint
CREATE INDEX `idx_skill_provenance_org_skill` ON `skill_provenance` (`organization_id`,`skill_code`);--> statement-breakpoint
CREATE TABLE `skill_registry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`skill_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text NOT NULL,
	`agent_code` text NOT NULL,
	`name` text NOT NULL,
	`purpose` text NOT NULL,
	`current_version` text,
	`lifecycle_status` text DEFAULT 'draft' NOT NULL,
	`risk_tier` text DEFAULT 'Medium' NOT NULL,
	`owner` text NOT NULL,
	`approved_scope` text NOT NULL,
	`approved_tools` text NOT NULL,
	`approved_data` text NOT NULL,
	`jurisdictions` text NOT NULL,
	`review_due` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_registry_skill_code_unique` ON `skill_registry` (`skill_code`);--> statement-breakpoint
CREATE INDEX `idx_skill_registry_org_status` ON `skill_registry` (`organization_id`,`lifecycle_status`);--> statement-breakpoint
CREATE INDEX `idx_skill_registry_org_agent` ON `skill_registry` (`organization_id`,`agent_code`);--> statement-breakpoint
CREATE INDEX `idx_skill_registry_org_system` ON `skill_registry` (`organization_id`,`system_code`);--> statement-breakpoint
CREATE TABLE `skill_rollbacks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rollback_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`skill_code` text NOT NULL,
	`trigger` text NOT NULL,
	`suspended_version` text NOT NULL,
	`restored_version` text NOT NULL,
	`authorized_by` text NOT NULL,
	`affected_executions` text NOT NULL,
	`incident_reference` text,
	`evidence_package_reference` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_rollbacks_rollback_code_unique` ON `skill_rollbacks` (`rollback_code`);--> statement-breakpoint
CREATE INDEX `idx_skill_rollbacks_org_skill` ON `skill_rollbacks` (`organization_id`,`skill_code`);--> statement-breakpoint
CREATE TABLE `skill_validation_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`validation_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`proposal_code` text NOT NULL,
	`skill_code` text NOT NULL,
	`candidate_version` text NOT NULL,
	`candidate_digest` text NOT NULL,
	`baseline_version` text,
	`test_set_reference` text NOT NULL,
	`baseline_score` integer DEFAULT 0 NOT NULL,
	`candidate_score` integer DEFAULT 0 NOT NULL,
	`threshold_delta` integer DEFAULT 0 NOT NULL,
	`safety_pass` integer DEFAULT false NOT NULL,
	`policy_pass` integer DEFAULT false NOT NULL,
	`tool_scope_pass` integer DEFAULT false NOT NULL,
	`data_scope_pass` integer DEFAULT false NOT NULL,
	`result_artifact` text NOT NULL,
	`outcome` text DEFAULT 'VALIDATING' NOT NULL,
	`reviewed_by` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_validation_runs_validation_code_unique` ON `skill_validation_runs` (`validation_code`);--> statement-breakpoint
CREATE INDEX `idx_skill_validation_org_proposal` ON `skill_validation_runs` (`organization_id`,`proposal_code`);--> statement-breakpoint
CREATE TABLE `skill_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`version_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`skill_code` text NOT NULL,
	`version` text NOT NULL,
	`content` text NOT NULL,
	`content_digest` text NOT NULL,
	`source_type` text NOT NULL,
	`parent_version` text,
	`change_summary` text NOT NULL,
	`behavioral_delta` text NOT NULL,
	`proposed_by` text NOT NULL,
	`validation_status` text DEFAULT 'pending' NOT NULL,
	`approval_status` text DEFAULT 'pending' NOT NULL,
	`deployment_status` text DEFAULT 'not_deployed' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_versions_version_code_unique` ON `skill_versions` (`version_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_skill_versions_org_skill_version` ON `skill_versions` (`organization_id`,`skill_code`,`version`);--> statement-breakpoint
CREATE INDEX `idx_skill_versions_org_digest` ON `skill_versions` (`organization_id`,`content_digest`);