# Execution Preflight Specification

## Purpose

Describe intended access, side effects and authorization requirements before execution.

## Proposed execution_preflights fields

- preflight_code
- organization_id
- workflow_code
- workflow_version
- agent_code
- execution_context_code
- requested_by
- planned_skills
- planned_package_hashes
- planned_action_classes
- planned_reads
- planned_writes
- planned_tools
- planned_destinations
- expected_egress_count
- data_classifications
- data_lanes
- required_capability_grants
- required_human_approvals
- required_policy_checks
- rollback_plan
- evidence_requirements
- plan_digest
- status
- approved_by
- approved_at
- expires_at
- created_at

## Enforcement

- side-effecting execution requires an approved preflight when policy requires it
- the preflight plan is hashed
- execution binds to the approved plan digest
- material drift requires a new preflight and authorization
- preflight itself performs no side effects
