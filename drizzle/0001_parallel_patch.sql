CREATE TABLE `approvals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`decision_code` text NOT NULL,
	`approver_email` text NOT NULL,
	`approver_role` text NOT NULL,
	`outcome` text NOT NULL,
	`justification` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `audit_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`actor_email` text NOT NULL,
	`actor_role` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_code` text NOT NULL,
	`details` text NOT NULL,
	`source_ip` text,
	`previous_hash` text,
	`event_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `controls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`control_code` text NOT NULL,
	`title` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`category` text NOT NULL,
	`requirement` text NOT NULL,
	`evidence_required` text NOT NULL,
	`version` text DEFAULT '1.0' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `corrective_actions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`incident_code` text NOT NULL,
	`action_code` text NOT NULL,
	`root_cause` text NOT NULL,
	`action` text NOT NULL,
	`owner` text NOT NULL,
	`due_date` text NOT NULL,
	`effectiveness_test` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `corrective_actions_action_code_unique` ON `corrective_actions` (`action_code`);--> statement-breakpoint
CREATE TABLE `evidence` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`evidence_code` text NOT NULL,
	`system_code` text NOT NULL,
	`title` text NOT NULL,
	`evidence_type` text NOT NULL,
	`source` text NOT NULL,
	`content_hash` text NOT NULL,
	`status` text DEFAULT 'verified' NOT NULL,
	`uploaded_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `evidence_evidence_code_unique` ON `evidence` (`evidence_code`);--> statement-breakpoint
CREATE TABLE `guardrail_decisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`decision_code` text NOT NULL,
	`system_code` text NOT NULL,
	`guardrail_code` text NOT NULL,
	`level` text NOT NULL,
	`trigger` text NOT NULL,
	`deterministic_result` text NOT NULL,
	`required_approvals` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guardrail_decisions_decision_code_unique` ON `guardrail_decisions` (`decision_code`);--> statement-breakpoint
CREATE TABLE `incidents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`incident_code` text NOT NULL,
	`system_code` text NOT NULL,
	`severity` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'detected' NOT NULL,
	`owner` text NOT NULL,
	`contained_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `incidents_incident_code_unique` ON `incidents` (`incident_code`);--> statement-breakpoint
CREATE TABLE `model_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text NOT NULL,
	`version` text NOT NULL,
	`provider` text NOT NULL,
	`change_summary` text NOT NULL,
	`validation_status` text DEFAULT 'pending' NOT NULL,
	`deployed_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_unique` ON `organizations` (`slug`);--> statement-breakpoint
CREATE TABLE `overrides` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`override_code` text NOT NULL,
	`decision_code` text NOT NULL,
	`requested_by` text NOT NULL,
	`reason` text NOT NULL,
	`compensating_controls` text NOT NULL,
	`expires_at` text NOT NULL,
	`status` text DEFAULT 'awaiting_dual_approval' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `overrides_override_code_unique` ON `overrides` (`override_code`);--> statement-breakpoint
CREATE TABLE `policies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`policy_code` text NOT NULL,
	`title` text NOT NULL,
	`version` text NOT NULL,
	`effective_date` text NOT NULL,
	`approved_by` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `privacy_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`request_code` text NOT NULL,
	`request_type` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`subject_reference` text NOT NULL,
	`system_code` text NOT NULL,
	`status` text DEFAULT 'identity_verification' NOT NULL,
	`due_date` text NOT NULL,
	`owner` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privacy_requests_request_code_unique` ON `privacy_requests` (`request_code`);--> statement-breakpoint
CREATE TABLE `risk_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text NOT NULL,
	`assessor_email` text NOT NULL,
	`inherent_risk` text NOT NULL,
	`residual_risk` text NOT NULL,
	`score` integer NOT NULL,
	`rationale` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`role` text DEFAULT 'system_owner' NOT NULL,
	`organization_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `ai_systems` ADD `organization_id` text DEFAULT 'org-sovereign' NOT NULL;--> statement-breakpoint
ALTER TABLE `ai_systems` ADD `hosting_location` text DEFAULT 'Not recorded' NOT NULL;--> statement-breakpoint
ALTER TABLE `ai_systems` ADD `decision_impact` text DEFAULT 'Advisory' NOT NULL;--> statement-breakpoint
ALTER TABLE `ai_systems` ADD `review_due` text;