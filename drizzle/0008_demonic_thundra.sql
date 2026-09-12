CREATE TABLE `implementation_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assessment_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`responsible_institution` text NOT NULL,
	`legal_mandate` text NOT NULL,
	`ring_fenced_budget` text NOT NULL,
	`staffing_plan` text NOT NULL,
	`technical_capability` text NOT NULL,
	`enforcement_powers` text NOT NULL,
	`regional_reach` text NOT NULL,
	`complaint_channel` text NOT NULL,
	`inspection_programme` text NOT NULL,
	`procurement_controls` text NOT NULL,
	`implementation_milestones` text NOT NULL,
	`performance_indicators` text NOT NULL,
	`public_reporting` text NOT NULL,
	`evidence_reference` text NOT NULL,
	`readiness_score` integer NOT NULL,
	`outcome` text NOT NULL,
	`assessed_by` text NOT NULL,
	`review_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `implementation_assessments_assessment_code_unique` ON `implementation_assessments` (`assessment_code`);