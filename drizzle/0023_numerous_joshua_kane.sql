CREATE TABLE `sovereign_resilience_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assessment_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`critical_service` text NOT NULL,
	`primary_provider` text NOT NULL,
	`provider_concentration` text NOT NULL,
	`verified_alternatives` text NOT NULL,
	`data_hosting_jurisdictions` text NOT NULL,
	`data_residency_control` text NOT NULL,
	`data_export_test` text NOT NULL,
	`workflow_portability` text NOT NULL,
	`contract_audit_rights` text NOT NULL,
	`contract_exit_rights` text NOT NULL,
	`continuity_plan` text NOT NULL,
	`recovery_target` text NOT NULL,
	`fallback_capability` text NOT NULL,
	`critical_dependencies` text NOT NULL,
	`local_languages` text NOT NULL,
	`language_validation` text NOT NULL,
	`knowledge_transfer` text NOT NULL,
	`evidence_reference` text NOT NULL,
	`readiness_score` integer NOT NULL,
	`outcome` text NOT NULL,
	`failed_checks` text DEFAULT '[]' NOT NULL,
	`assessed_by` text NOT NULL,
	`review_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sovereign_resilience_assessments_assessment_code_unique` ON `sovereign_resilience_assessments` (`assessment_code`);--> statement-breakpoint
CREATE INDEX `idx_sovereign_resilience_org_system` ON `sovereign_resilience_assessments` (`organization_id`,`system_code`);