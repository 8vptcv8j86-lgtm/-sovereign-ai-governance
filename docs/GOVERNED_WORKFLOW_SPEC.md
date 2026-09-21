# Governed Workflow Specification

## Purpose

Define a versioned, auditable business process composed of governed AI skills, agents, approval gates and evidence requirements.

## Proposed records

### governed_workflows
- workflow_code
- organization_id
- name
- purpose
- owner
- risk_tier
- lifecycle_status
- current_version
- jurisdictions
- review_due

### governed_workflow_versions
- workflow_version_code
- organization_id
- workflow_code
- version
- workflow_digest
- change_summary
- proposed_by
- validation_status
- approval_status
- deployment_status

### governed_workflow_steps
- step_code
- organization_id
- workflow_code
- workflow_version
- sequence
- step_type
- skill_code
- skill_version
- package_hash
- agent_code
- execution_context_code
- action_class
- required_approval
- failure_policy
- evidence_requirement

### workflow_executions
- workflow_execution_code
- organization_id
- workflow_code
- workflow_version
- workflow_digest
- initiated_by
- authorization_reference
- status
- started_at
- completed_at
- outcome

### workflow_step_executions
- step_execution_code
- organization_id
- workflow_execution_code
- step_code
- skill_code
- skill_version
- package_hash
- agent_code
- action_class
- authorization_reference
- input_digest
- output_digest
- status
- started_at
- completed_at
- evidence_reference

## Enforcement

- workflow versions are immutable after approval
- step sequence is deterministic unless an approved branch condition exists
- skill/package hash must match the approved workflow version
- suspended/retired skills block execution
- a workflow cannot expand skill, agent, data, tool or network scope
- each step requires a fresh authorization decision
- critical/irreversible steps require configured human approval
- failed steps follow the approved failure policy
- execution history is append-only
