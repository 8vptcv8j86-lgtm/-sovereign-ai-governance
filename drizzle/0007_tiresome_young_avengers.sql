CREATE TABLE `privacy_compliance_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assessment_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`sector` text NOT NULL,
	`controller_registration` text NOT NULL,
	`dpo_assigned` text NOT NULL,
	`sensitive_data` text NOT NULL,
	`children_data` text NOT NULL,
	`biometric_processing` text NOT NULL,
	`cross_border_transfer` text NOT NULL,
	`transfer_mechanism` text NOT NULL,
	`prior_authorization` text NOT NULL,
	`processor_due_diligence` text NOT NULL,
	`rights_procedure` text NOT NULL,
	`retention_schedule` text NOT NULL,
	`breach_procedure` text NOT NULL,
	`readiness_score` integer NOT NULL,
	`outcome` text NOT NULL,
	`assessed_by` text NOT NULL,
	`review_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `privacy_compliance_assessments_assessment_code_unique` ON `privacy_compliance_assessments` (`assessment_code`);