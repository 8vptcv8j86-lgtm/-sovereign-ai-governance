PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ai_systems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`system_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`owner` text NOT NULL,
	`region` text NOT NULL,
	`purpose` text NOT NULL,
	`risk` text DEFAULT 'Medium' NOT NULL,
	`status` text DEFAULT 'In review' NOT NULL,
	`model` text DEFAULT 'Not specified' NOT NULL,
	`data_categories` text DEFAULT 'Not yet classified' NOT NULL,
	`hosting_location` text DEFAULT 'Not recorded' NOT NULL,
	`decision_impact` text DEFAULT 'Advisory' NOT NULL,
	`review_due` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_ai_systems`("id", "system_code", "organization_id", "name", "owner", "region", "purpose", "risk", "status", "model", "data_categories", "hosting_location", "decision_impact", "review_due", "created_at") SELECT "id", "system_code", "organization_id", "name", "owner", "region", "purpose", "risk", "status", "model", "data_categories", "hosting_location", "decision_impact", "review_due", "created_at" FROM `ai_systems`;--> statement-breakpoint
DROP TABLE `ai_systems`;--> statement-breakpoint
ALTER TABLE `__new_ai_systems` RENAME TO `ai_systems`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `ai_systems_system_code_unique` ON `ai_systems` (`system_code`);--> statement-breakpoint
ALTER TABLE `users` ADD `auth_user_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_auth_user_id_unique` ON `users` (`auth_user_id`);
--> statement-breakpoint
PRAGMA optimize;
