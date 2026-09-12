CREATE TABLE `workforce_absorption_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assessment_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`institution` text NOT NULL,
	`youth_cohort` text NOT NULL,
	`skills_pipeline` text NOT NULL,
	`entry_level_roles` text NOT NULL,
	`paid_internships` text NOT NULL,
	`experience_barrier` text NOT NULL,
	`skills_based_hiring` text NOT NULL,
	`remote_work_policy` text NOT NULL,
	`manager_readiness` text NOT NULL,
	`output_based_performance` text NOT NULL,
	`local_operations_roles` text NOT NULL,
	`retention_pathway` text NOT NULL,
	`regional_access` text NOT NULL,
	`conversion_target` text NOT NULL,
	`outcome_evidence` text NOT NULL,
	`readiness_score` integer NOT NULL,
	`outcome` text NOT NULL,
	`assessed_by` text NOT NULL,
	`review_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workforce_absorption_assessments_assessment_code_unique` ON `workforce_absorption_assessments` (`assessment_code`);