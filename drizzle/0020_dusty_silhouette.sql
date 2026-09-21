ALTER TABLE `audit_events` ADD `hash_version` text DEFAULT 'legacy' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `uq_audit_events_org_previous_hash` ON `audit_events` (`organization_id`,`previous_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_audit_events_org_event_hash` ON `audit_events` (`organization_id`,`event_hash`);--> statement-breakpoint
CREATE INDEX `idx_audit_events_org_id` ON `audit_events` (`organization_id`,`id`);