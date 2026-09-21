# Execution Checkpoint and Resume Specification

## Proposed execution_checkpoints fields

- checkpoint_code
- organization_id
- workflow_execution_code
- workflow_code
- workflow_version
- workflow_digest
- current_node_code
- completed_node_codes
- state_digest
- variable_pool_digest
- agent_code
- skill_bindings
- context_bindings
- execution_context_code
- sandbox_profile_code
- sandbox_profile_version
- authorization_references
- pending_approval_reference
- pending_tool_reference
- trace_id
- span_id
- status
- resume_after
- expires_at
- created_at

## Proposed execution_resume_events fields

- resume_event_code
- organization_id
- checkpoint_code
- requested_by
- previous_authorization_references
- current_policy_result
- current_grant_result
- current_skill_status
- current_workflow_status
- current_kill_switch_status
- integrity_verified
- authorized
- denial_reason
- resumed_at
- created_at

## Enforcement

- checkpoint state is immutable after creation
- checkpoint integrity must validate before resume
- resume is never implicit continuation
- current policy and grants are re-evaluated
- expired or revoked approvals are not reused
- changed workflow/skill digest requires explicit migration or restart
