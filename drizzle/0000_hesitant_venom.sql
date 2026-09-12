CREATE TABLE `ai_systems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`system_code` text NOT NULL,
	`name` text NOT NULL,
	`owner` text NOT NULL,
	`region` text NOT NULL,
	`purpose` text NOT NULL,
	`risk` text DEFAULT 'Medium' NOT NULL,
	`status` text DEFAULT 'In review' NOT NULL,
	`model` text DEFAULT 'Not specified' NOT NULL,
	`data_categories` text DEFAULT 'Not yet classified' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_systems_system_code_unique` ON `ai_systems` (`system_code`);