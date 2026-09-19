CREATE TABLE `recovery_exercises` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `exercise_code` text NOT NULL,
  `organization_id` text NOT NULL,
  `system_code` text NOT NULL,
  `exercise_date` text NOT NULL,
  `restoration_source` text NOT NULL,
  `target_rpo_minutes` integer NOT NULL,
  `measured_rpo_minutes` integer NOT NULL,
  `target_rto_minutes` integer NOT NULL,
  `measured_rto_minutes` integer NOT NULL,
  `restored_data_integrity` text NOT NULL,
  `restored_audit_chain` text NOT NULL,
  `evidence_reference` text NOT NULL,
  `failed_checks` text DEFAULT '[]' NOT NULL,
  `outcome` text NOT NULL,
  `conducted_by` text NOT NULL,
  `reviewed_by` text,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recovery_exercises_exercise_code_unique` ON `recovery_exercises` (`exercise_code`);
--> statement-breakpoint
CREATE INDEX `idx_recovery_exercises_org_system_date` ON `recovery_exercises` (`organization_id`,`system_code`,`exercise_date`);
