# Learning and Retrospective Specification

## Purpose

Convert operational experience into governed learning without allowing autonomous mutation of production behavior.

## learning_retrospectives

Recommended fields:

- retrospective_code
- organization_id
- system_code
- agent_code
- workflow_execution_code
- skill_code
- skill_version
- execution_code
- outcome
- success_factors
- failure_factors
- unexpected_behavior
- human_overrides
- policy_events
- tool_errors
- data_issues
- incident_references
- reviewed_by
- created_at

## learning_candidates

Recommended fields:

- learning_candidate_code
- organization_id
- retrospective_code
- candidate_type
- lesson
- evidence_references
- confidence
- risk_tier
- promotable
- reviewed_by
- disposition
- linked_skill_proposal
- created_at

## Enforcement

- learning records are evidence, not executable instructions
- a learning candidate cannot directly alter a deployed skill
- promotion requires a normal WikiSkill change proposal
- skill proposal must bind the source learning/evidence references
- validation and approval remain mandatory
- production behavior changes only when a newly approved skill version is deployed
