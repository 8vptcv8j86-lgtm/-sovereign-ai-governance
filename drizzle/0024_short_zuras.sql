CREATE TABLE `recovery_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exercise_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text NOT NULL,
	`exercise_date` text NOT NULL,
	`backup_method` text NOT NULL,
	`restore_environment` text NOT NULL,
	`target_rpo_minutes` integer NOT NULL,
	`actual_data_loss_minutes` integer NOT NULL,
	`target_rto_minutes` integer NOT NULL,
	`actual_recovery_minutes` integer NOT NULL,
	`restore_integrity` text NOT NULL,
	`audit_chain_verification` text NOT NULL,
	`evidence_reference` text NOT NULL,
	`outcome` text NOT NULL,
	`failed_checks` text DEFAULT '[]' NOT NULL,
	`performed_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recovery_exercises_exercise_code_unique` ON `recovery_exercises` (`exercise_code`);--> statement-breakpoint
CREATE INDEX `idx_recovery_exercises_org_system` ON `recovery_exercises` (`organization_id`,`system_code`,`exercise_date`);