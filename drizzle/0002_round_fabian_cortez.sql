CREATE TABLE `access_grants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`grant_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`agent_code` text NOT NULL,
	`requested_by` text NOT NULL,
	`approved_by` text,
	`resource` text NOT NULL,
	`permission` text NOT NULL,
	`purpose` text NOT NULL,
	`least_privilege_basis` text NOT NULL,
	`starts_at` text NOT NULL,
	`expires_at` text NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`last_reviewed_at` text,
	`revoked_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_grants_grant_code_unique` ON `access_grants` (`grant_code`);--> statement-breakpoint
CREATE TABLE `ai_agents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`system_code` text NOT NULL,
	`name` text NOT NULL,
	`owner` text NOT NULL,
	`purpose` text NOT NULL,
	`scope` text NOT NULL,
	`approved_tools` text NOT NULL,
	`approved_data` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`lifecycle_status` text DEFAULT 'proposed' NOT NULL,
	`review_due` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_agents_agent_code_unique` ON `ai_agents` (`agent_code`);