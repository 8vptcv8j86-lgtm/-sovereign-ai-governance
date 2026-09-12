CREATE INDEX `idx_accountability_successions_org_status_deadline` ON `accountability_successions` (`organization_id`,`status`,`handoff_deadline`);--> statement-breakpoint
CREATE INDEX `idx_conduct_pattern_flags_org_type_status_subject` ON `conduct_pattern_flags` (`organization_id`,`pattern_type`,`review_status`,`subject_user_id`);--> statement-breakpoint
CREATE INDEX `idx_workforce_conduct_cases_org` ON `workforce_conduct_cases` (`organization_id`);--> statement-breakpoint
CREATE INDEX `idx_workforce_conduct_stage_events_org_case` ON `workforce_conduct_stage_events` (`organization_id`,`case_id`);--> statement-breakpoint
PRAGMA optimize;
