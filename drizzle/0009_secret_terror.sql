CREATE TABLE `infrastructure_dividend_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assessment_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`project_name` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`operator` text NOT NULL,
	`planned_megawatts` integer NOT NULL,
	`additional_generation` text NOT NULL,
	`grid_support` text NOT NULL,
	`network_costs_assigned` text NOT NULL,
	`household_tariff_protection` text NOT NULL,
	`shared_compute_commitment` text NOT NULL,
	`local_skills_plan` text NOT NULL,
	`local_procurement_target` text NOT NULL,
	`power_disclosure` text NOT NULL,
	`water_disclosure` text NOT NULL,
	`emissions_disclosure` text NOT NULL,
	`public_benefit_terms` text NOT NULL,
	`contract_enforcement` text NOT NULL,
	`readiness_score` integer NOT NULL,
	`outcome` text NOT NULL,
	`assessed_by` text NOT NULL,
	`review_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `infrastructure_dividend_assessments_assessment_code_unique` ON `infrastructure_dividend_assessments` (`assessment_code`);