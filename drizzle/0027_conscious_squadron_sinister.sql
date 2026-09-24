CREATE TABLE `privacy_ai_data_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text,
	`subject_code` text,
	`state` text DEFAULT 'draft' NOT NULL,
	`jurisdiction` text,
	`owner` text NOT NULL,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`evidence_refs` text DEFAULT '' NOT NULL,
	`next_review` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privacy_ai_data_assessments_record_code_unique` ON `privacy_ai_data_assessments` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_privacy_ai_data_assessments_org_state` ON `privacy_ai_data_assessments` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_privacy_ai_data_assessments_org_system` ON `privacy_ai_data_assessments` (`organization_id`,`system_code`);--> statement-breakpoint
CREATE TABLE `privacy_data_inventory_flows` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text,
	`subject_code` text,
	`state` text DEFAULT 'draft' NOT NULL,
	`jurisdiction` text,
	`owner` text NOT NULL,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`evidence_refs` text DEFAULT '' NOT NULL,
	`next_review` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privacy_data_inventory_flows_record_code_unique` ON `privacy_data_inventory_flows` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_privacy_data_inventory_flows_org_state` ON `privacy_data_inventory_flows` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_privacy_data_inventory_flows_org_system` ON `privacy_data_inventory_flows` (`organization_id`,`system_code`);--> statement-breakpoint
CREATE TABLE `privacy_dpia_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text,
	`subject_code` text,
	`state` text DEFAULT 'draft' NOT NULL,
	`jurisdiction` text,
	`owner` text NOT NULL,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`evidence_refs` text DEFAULT '' NOT NULL,
	`next_review` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privacy_dpia_assessments_record_code_unique` ON `privacy_dpia_assessments` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_privacy_dpia_assessments_org_state` ON `privacy_dpia_assessments` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_privacy_dpia_assessments_org_system` ON `privacy_dpia_assessments` (`organization_id`,`system_code`);--> statement-breakpoint
CREATE TABLE `privacy_governance_evidence` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text,
	`subject_code` text,
	`state` text DEFAULT 'draft' NOT NULL,
	`jurisdiction` text,
	`owner` text NOT NULL,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`evidence_refs` text DEFAULT '' NOT NULL,
	`next_review` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privacy_governance_evidence_record_code_unique` ON `privacy_governance_evidence` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_privacy_governance_evidence_org_state` ON `privacy_governance_evidence` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_privacy_governance_evidence_org_system` ON `privacy_governance_evidence` (`organization_id`,`system_code`);--> statement-breakpoint
CREATE TABLE `privacy_purpose_lawfulness` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text,
	`subject_code` text,
	`state` text DEFAULT 'draft' NOT NULL,
	`jurisdiction` text,
	`owner` text NOT NULL,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`evidence_refs` text DEFAULT '' NOT NULL,
	`next_review` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privacy_purpose_lawfulness_record_code_unique` ON `privacy_purpose_lawfulness` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_privacy_purpose_lawfulness_org_state` ON `privacy_purpose_lawfulness` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_privacy_purpose_lawfulness_org_system` ON `privacy_purpose_lawfulness` (`organization_id`,`system_code`);--> statement-breakpoint
CREATE TABLE `privacy_retention_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text,
	`subject_code` text,
	`state` text DEFAULT 'draft' NOT NULL,
	`jurisdiction` text,
	`owner` text NOT NULL,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`evidence_refs` text DEFAULT '' NOT NULL,
	`next_review` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privacy_retention_records_record_code_unique` ON `privacy_retention_records` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_privacy_retention_records_org_state` ON `privacy_retention_records` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_privacy_retention_records_org_system` ON `privacy_retention_records` (`organization_id`,`system_code`);--> statement-breakpoint
CREATE TABLE `privacy_rights_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text,
	`subject_code` text,
	`state` text DEFAULT 'draft' NOT NULL,
	`jurisdiction` text,
	`owner` text NOT NULL,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`evidence_refs` text DEFAULT '' NOT NULL,
	`next_review` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privacy_rights_requests_record_code_unique` ON `privacy_rights_requests` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_privacy_rights_requests_org_state` ON `privacy_rights_requests` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_privacy_rights_requests_org_system` ON `privacy_rights_requests` (`organization_id`,`system_code`);--> statement-breakpoint
CREATE TABLE `privacy_risk_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text,
	`subject_code` text,
	`state` text DEFAULT 'draft' NOT NULL,
	`jurisdiction` text,
	`owner` text NOT NULL,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`evidence_refs` text DEFAULT '' NOT NULL,
	`next_review` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privacy_risk_assessments_record_code_unique` ON `privacy_risk_assessments` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_privacy_risk_assessments_org_state` ON `privacy_risk_assessments` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_privacy_risk_assessments_org_system` ON `privacy_risk_assessments` (`organization_id`,`system_code`);--> statement-breakpoint
CREATE TABLE `privacy_third_party_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text,
	`subject_code` text,
	`state` text DEFAULT 'draft' NOT NULL,
	`jurisdiction` text,
	`owner` text NOT NULL,
	`payload` text NOT NULL,
	`content_digest` text NOT NULL,
	`evidence_refs` text DEFAULT '' NOT NULL,
	`next_review` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privacy_third_party_assessments_record_code_unique` ON `privacy_third_party_assessments` (`record_code`);--> statement-breakpoint
CREATE INDEX `idx_privacy_third_party_assessments_org_state` ON `privacy_third_party_assessments` (`organization_id`,`state`);--> statement-breakpoint
CREATE INDEX `idx_privacy_third_party_assessments_org_system` ON `privacy_third_party_assessments` (`organization_id`,`system_code`);