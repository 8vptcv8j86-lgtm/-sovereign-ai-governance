CREATE TABLE `africa_first_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assessment_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`ubuntu_impact` text NOT NULL,
	`community_resources` text NOT NULL,
	`labor_impact` text NOT NULL,
	`intergenerational_impact` text NOT NULL,
	`local_languages` text NOT NULL,
	`language_performance_evidence` text NOT NULL,
	`low_connectivity_design` text NOT NULL,
	`mobile_offline_support` text NOT NULL,
	`local_data_control` text NOT NULL,
	`foreign_dependency_plan` text NOT NULL,
	`regional_interoperability` text NOT NULL,
	`sme_proportionality` text NOT NULL,
	`hype_challenge` text NOT NULL,
	`readiness_score` integer NOT NULL,
	`outcome` text NOT NULL,
	`assessed_by` text NOT NULL,
	`review_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `africa_first_assessments_assessment_code_unique` ON `africa_first_assessments` (`assessment_code`);