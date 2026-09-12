CREATE TABLE `agency_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`decision_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`proposal_title` text NOT NULL,
	`sponsoring_institution` text NOT NULL,
	`public_problem` text NOT NULL,
	`affected_communities` text NOT NULL,
	`ai_appropriateness` text NOT NULL,
	`non_ai_alternative` text NOT NULL,
	`vendor_name` text NOT NULL,
	`vendor_claims_assessment` text NOT NULL,
	`sovereign_conditions` text NOT NULL,
	`data_hosting_requirements` text NOT NULL,
	`independent_assessment` text NOT NULL,
	`community_evidence` text NOT NULL,
	`exit_plan` text NOT NULL,
	`proposed_decision` text NOT NULL,
	`readiness_score` integer NOT NULL,
	`outcome` text NOT NULL,
	`assessed_by` text NOT NULL,
	`approved_by` text,
	`decided_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agency_assessments_decision_code_unique` ON `agency_assessments` (`decision_code`);--> statement-breakpoint
ALTER TABLE `deployment_gates` ADD `agency_decision_code` text DEFAULT 'LEGACY' NOT NULL;