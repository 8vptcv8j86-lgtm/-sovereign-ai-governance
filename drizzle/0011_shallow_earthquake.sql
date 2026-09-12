CREATE TABLE `agrifood_supply_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assessment_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`programme_name` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`commodity` text NOT NULL,
	`farmer_identity` text NOT NULL,
	`lot_traceability` text NOT NULL,
	`physical_digital_link` text NOT NULL,
	`data_ownership` text NOT NULL,
	`algorithmic_procurement` text NOT NULL,
	`price_transparency` text NOT NULL,
	`smart_contract_controls` text NOT NULL,
	`logistics_evidence` text NOT NULL,
	`food_loss_baseline` text NOT NULL,
	`farmer_earnings_measure` text NOT NULL,
	`offline_access` text NOT NULL,
	`dispute_resolution` text NOT NULL,
	`human_override` text NOT NULL,
	`readiness_score` integer NOT NULL,
	`outcome` text NOT NULL,
	`assessed_by` text NOT NULL,
	`review_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agrifood_supply_assessments_assessment_code_unique` ON `agrifood_supply_assessments` (`assessment_code`);