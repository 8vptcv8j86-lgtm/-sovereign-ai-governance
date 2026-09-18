# Agent Skill Governance and Provenance

Status: Architecture approved. Production implementation pending against the current Version 30 source of truth.

## Purpose

Govern AI agent behavior changes as controlled institutional changes. Sentinel must preserve the evidence behind each skill change, validate the candidate against a baseline, require independent approval, bind deployment to an approved version digest, monitor post deployment behavior, and support governed rollback.

## Lifecycle

Experience evidence -> knowledge record -> skill proposal -> validation -> approval -> deployment -> monitoring -> retain, suspend, or rollback.

## Required workspaces

1. Skill Registry
2. Skill Version Ledger
3. Experience and Knowledge Provenance
4. Skill Change Proposals
5. Validation and Benchmark Gate
6. Skill Approval
7. Deployment Ledger
8. Post Deployment Performance Evidence
9. Rollback and Suspension

## Data model

Add these organization scoped tables:

- skill_registry
- skill_versions
- skill_provenance
- skill_change_proposals
- skill_validation_runs
- skill_approvals
- skill_deployments
- skill_performance_reviews
- skill_rollbacks

Each record must be scoped by organization_id.

## Core fields

### Skill registry

- skill_code
- organization_id
- system_code
- agent_code
- name
- purpose
- current_version
- lifecycle_status
- risk_tier
- owner
- approved_scope
- approved_tools
- approved_data
- jurisdictions
- review_due

Lifecycle:

draft -> proposed -> validating -> ready_for_approval -> approved -> active -> suspended -> retired

### Skill version

- skill_code
- version
- content_digest
- source_type
- parent_version
- change_summary
- behavioral_delta
- proposed_by
- validation_status
- approval_status
- deployment_status

No destructive overwrite of prior versions.

### Provenance

- provenance_code
- skill_code
- agent_code
- evidence_type
- evidence_reference
- observation_summary
- pattern
- source_execution_ids
- sensitive_data_classification
- retention_rule
- recorded_by

### Validation

- validation_code
- skill_code
- candidate_version
- baseline_version
- test_set_reference
- baseline_result
- candidate_result
- safety_result
- policy_result
- tool_scope_result
- data_scope_result
- threshold
- result
- reviewed_by

Outcomes:

BLOCKED, VALIDATION_FAILED, READY_FOR_APPROVAL

### Deployment

- deployment_code
- skill_code
- approved_version
- target_agent
- target_system
- environment
- deployed_by
- approval_reference
- validation_reference
- prior_active_version
- rollback_version
- deployment_digest
- status

## Server side enforcement

- No skill version can become active without a passing validation record.
- No material skill change can become active without independent approval.
- A proposer cannot be the sole approver.
- A skill cannot gain tools, data classes, or permissions beyond the parent agent's approved scope.
- High risk changes require dual approval.
- Deployment must reference the exact approved content digest.
- Any content change after validation invalidates validation and approval.
- Suspended and retired skills cannot execute.
- Rollback must target a previously approved deployable version.
- Every state transition emits an audit event.
- Skill evidence must be exportable.

## API actions

- register_skill
- propose_skill_version
- record_skill_provenance
- start_skill_validation
- complete_skill_validation
- approve_skill_change
- deny_skill_change
- deploy_skill_version
- suspend_skill_version
- rollback_skill_version
- record_skill_performance_review
- retire_skill
- export_skill_evidence_package

## Authorization

Administrator: configuration and emergency suspension.

System owner: register skills, propose versions, submit evidence.

Reviewer: validation and performance review.

Approver: independent authorization for deployment and rollback.

Auditor: read only access to provenance, validation, approval, deployment, rollback, and audit evidence.

## Existing Sentinel integrations

Link this capability to:

- AI agent identity register
- Continuous authorization
- Pre deployment governance gate
- Evidence vault
- Audit trail
- Approvals and overrides
- Incident and CAPA
- Continuous compliance monitoring
- Model version ledger
- Board and executive reporting
- Export package

## Dashboard indicators

- Active governed skills
- Awaiting validation
- Awaiting approval
- Failed validations
- Recently deployed skills
- Performance regressions
- Emergency suspensions
- Rollbacks
- Overdue reviews
- Behavior changes without current approval

## Export package

Include:

1. Skill identity and ownership
2. Parent system and agent
3. Complete version lineage
4. Content digests
5. Provenance records
6. Change rationale
7. Validation protocol
8. Baseline and candidate results
9. Safety and policy checks
10. Approval history
11. Deployment history
12. Post deployment performance
13. Rollbacks or suspensions
14. Related incidents and CAPA
15. Audit chain references

## Acceptance criteria

- [ ] Database migration applied
- [ ] Server side validation implemented
- [ ] Role authorization implemented
- [ ] Self approval blocked
- [ ] Dual approval enforced for high risk changes
- [ ] Version digests recorded
- [ ] Validation results immutable after approval
- [ ] Deployment tied to approved digest
- [ ] Rollback implemented
- [ ] Audit events emitted for every state transition
- [ ] Operational workspace added
- [ ] Navigation entry added
- [ ] Dashboard indicators added
- [ ] Evidence package export extended
- [ ] Regression tests cover approval bypass, digest mismatch, scope expansion, and rollback
- [ ] Production build passes
- [ ] Deployment verified

## Research basis

Informed by WikiSkill: Compiling Agent Experience into Persistent Knowledge for Skill Evolution, arXiv:2608.27454v1, especially its separation of raw experience, persistent knowledge, and executable skills, and its use of validation gating and rollback before retaining evolved skills.
