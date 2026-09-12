CREATE TABLE `competency_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`record_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`person_email` text NOT NULL,
	`governance_role` text NOT NULL,
	`training_name` text NOT NULL,
	`competency_level` text NOT NULL,
	`assessment_method` text NOT NULL,
	`completed_at` text NOT NULL,
	`expires_at` text NOT NULL,
	`evidence_reference` text NOT NULL,
	`status` text NOT NULL,
	`recorded_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `competency_records_record_code_unique` ON `competency_records` (`record_code`);--> statement-breakpoint
CREATE TABLE `confidential_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tracking_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`category` text NOT NULL,
	`system_code` text NOT NULL,
	`description` text NOT NULL,
	`retaliation_concern` text NOT NULL,
	`status` text DEFAULT 'RECEIVED' NOT NULL,
	`linked_incident_code` text,
	`handler_notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `confidential_reports_tracking_code_unique` ON `confidential_reports` (`tracking_code`);--> statement-breakpoint
CREATE TABLE `model_retirements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`retirement_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text NOT NULL,
	`model_version` text NOT NULL,
	`reason` text NOT NULL,
	`retirement_date` text NOT NULL,
	`data_retention_plan` text NOT NULL,
	`dependency_notifications` text NOT NULL,
	`fallback_model` text NOT NULL,
	`evidence_archive` text NOT NULL,
	`requested_by` text NOT NULL,
	`approved_by` text,
	`status` text DEFAULT 'PLANNED' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `model_retirements_retirement_code_unique` ON `model_retirements` (`retirement_code`);--> statement-breakpoint
CREATE TABLE `vendor_risk_register` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vendor_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`vendor_name` text NOT NULL,
	`service_type` text NOT NULL,
	`ai_involvement` text NOT NULL,
	`linked_systems` text NOT NULL,
	`certifications` text NOT NULL,
	`certification_evidence` text NOT NULL,
	`subprocessors` text NOT NULL,
	`right_to_audit` text NOT NULL,
	`contract_end` text NOT NULL,
	`inherent_risk` text NOT NULL,
	`residual_risk` text NOT NULL,
	`vendor_claims_verified` text NOT NULL,
	`continuity_plan` text NOT NULL,
	`risk_score` integer NOT NULL,
	`status` text NOT NULL,
	`assessed_by` text NOT NULL,
	`next_review` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vendor_risk_register_vendor_code_unique` ON `vendor_risk_register` (`vendor_code`);