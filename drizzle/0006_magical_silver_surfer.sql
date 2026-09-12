CREATE TABLE `foresight_scenarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`scenario_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`scenario` text NOT NULL,
	`time_horizon` text NOT NULL,
	`capability_pace` text NOT NULL,
	`human_controllability` text NOT NULL,
	`frontier_concentration` text NOT NULL,
	`critical_domains` text NOT NULL,
	`institutional_impact` text NOT NULL,
	`leading_indicators` text NOT NULL,
	`preventive_controls` text NOT NULL,
	`continuity_response` text NOT NULL,
	`international_dependencies` text NOT NULL,
	`decision_owner` text NOT NULL,
	`review_date` text NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`assessed_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `foresight_scenarios_scenario_code_unique` ON `foresight_scenarios` (`scenario_code`);