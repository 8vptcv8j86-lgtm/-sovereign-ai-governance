ALTER TABLE `agency_assessments` ADD `criticality_class` text DEFAULT 'Standard' NOT NULL;--> statement-breakpoint
ALTER TABLE `agency_assessments` ADD `supplier_dependencies` text DEFAULT 'Not recorded' NOT NULL;--> statement-breakpoint
ALTER TABLE `agency_assessments` ADD `service_continuity_plan` text DEFAULT 'Missing' NOT NULL;--> statement-breakpoint
ALTER TABLE `agency_assessments` ADD `governance_framework_map` text DEFAULT 'Missing' NOT NULL;