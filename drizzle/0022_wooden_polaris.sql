CREATE INDEX `idx_access_grants_authorization` ON `access_grants` (`organization_id`,`agent_code`,`resource`,`permission`,`status`);--> statement-breakpoint
CREATE INDEX `idx_ai_agents_org_system` ON `ai_agents` (`organization_id`,`system_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_approvals_org_decision_approver` ON `approvals` (`organization_id`,`decision_code`,`approver_email`);