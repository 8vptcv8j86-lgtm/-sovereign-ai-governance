CREATE INDEX `idx_ai_systems_org_created` ON `ai_systems` (`organization_id`,`created_at`);--> statement-breakpoint
PRAGMA optimize;
