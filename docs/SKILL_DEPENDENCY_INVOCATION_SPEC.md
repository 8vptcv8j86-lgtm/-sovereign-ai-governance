# Skill Dependency and Invocation Specification

## Skill dependencies

Recommended fields:
- dependency_code
- organization_id
- parent_skill_code
- parent_skill_version
- dependency_skill_code
- allowed_version_range
- dependency_type
- required
- invocation_mode
- scope_inheritance_rule
- fallback_behavior
- created_at

## Invocation policies

Recommended fields:
- invocation_policy_code
- organization_id
- skill_code
- skill_version
- trigger_type
- trigger_expression
- routing_priority
- exclusions
- required_contexts
- required_source_health
- action_class_ceiling
- approval_requirement
- conflict_resolution_rule
- lifecycle_status
- created_at

## Invocation events

Recommended fields:
- invocation_event_code
- organization_id
- skill_code
- skill_version
- invocation_policy_code
- trigger_type
- matched_input_digest
- matched_evidence_references
- dependency_parent
- routing_decision
- selected_at
- execution_reference
- created_at

## Enforcement

- dependency resolution cannot widen scope
- dependency cycles are rejected unless explicitly modeled as bounded recovery
- routing conflicts resolve deterministically
- invocation reason is preserved in evidence
- explicit user invocation is distinguishable from autonomous selection
