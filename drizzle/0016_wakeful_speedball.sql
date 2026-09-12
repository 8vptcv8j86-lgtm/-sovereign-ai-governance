CREATE TABLE `accountability_successions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`outgoing_user_id` integer NOT NULL,
	`incoming_user_id` integer,
	`role` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`trigger_reason` text NOT NULL,
	`handoff_deadline` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reassigned_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `conduct_pattern_flags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`subject_user_id` integer NOT NULL,
	`pattern_type` text NOT NULL,
	`window_start` text NOT NULL,
	`window_end` text NOT NULL,
	`event_count` integer NOT NULL,
	`threshold` integer NOT NULL,
	`linked_audit_event_ids` text DEFAULT '[]' NOT NULL,
	`reviewed_by_user_id` integer,
	`review_status` text DEFAULT 'open' NOT NULL,
	`linked_conduct_case_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workforce_conduct_cases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`subject_user_id` integer NOT NULL,
	`reported_by_user_id` integer,
	`linked_whistleblower_report_id` integer,
	`grounds` text NOT NULL,
	`description` text NOT NULL,
	`stage` text DEFAULT 'informal_resolution' NOT NULL,
	`investigator_user_id` integer,
	`investigator_conflict_checked` integer DEFAULT false NOT NULL,
	`outcome` text,
	`outcome_date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workforce_conduct_stage_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` text NOT NULL,
	`case_id` integer NOT NULL,
	`stage` text NOT NULL,
	`actor_user_id` integer NOT NULL,
	`notes` text,
	`occurred_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `workforce_conduct_cases`(`id`) ON UPDATE no action ON DELETE no action
);
