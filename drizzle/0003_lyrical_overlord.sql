CREATE TABLE `deployment_gates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`gate_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text NOT NULL,
	`accountable_owner` text NOT NULL,
	`risk_tier` text NOT NULL,
	`autonomy_boundary` text NOT NULL,
	`human_approval` text NOT NULL,
	`output_validation` text NOT NULL,
	`bias_testing` text NOT NULL,
	`logging_plan` text NOT NULL,
	`incident_plan` text NOT NULL,
	`shutdown_authority` text NOT NULL,
	`readiness_score` integer NOT NULL,
	`outcome` text NOT NULL,
	`assessed_by` text NOT NULL,
	`approved_by` text,
	`approved_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `deployment_gates_gate_code_unique` ON `deployment_gates` (`gate_code`);