CREATE TABLE `legal_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_code` text NOT NULL,
	`organization_id` text NOT NULL,
	`title` text NOT NULL,
	`publisher` text NOT NULL,
	`document_type` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`publication_year` integer NOT NULL,
	`source_url` text NOT NULL,
	`framework_area` text NOT NULL,
	`applicability` text NOT NULL,
	`mapped_controls` text NOT NULL,
	`evidence_notes` text NOT NULL,
	`authority_level` text NOT NULL,
	`verified_on` text NOT NULL,
	`next_review` text NOT NULL,
	`status` text NOT NULL,
	`added_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `legal_sources_source_code_unique` ON `legal_sources` (`source_code`);