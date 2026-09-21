# Node and Edge Governance Specification

## workflow_node_policies

Recommended fields:

- node_policy_code
- organization_id
- workflow_code
- workflow_version
- node_code
- node_type
- skill_code
- skill_version
- agent_code
- action_class
- required_capabilities
- allowed_reads
- allowed_writes
- allowed_tools
- allowed_models
- human_gate
- sandbox_profile_code
- timeout_seconds
- retry_policy
- evidence_requirement
- created_at

## workflow_edge_policies

Recommended fields:

- edge_policy_code
- organization_id
- workflow_code
- workflow_version
- source_node_code
- target_node_code
- transition_condition
- condition_digest
- policy_reference
- authorization_requirement
- evidence_requirement
- maximum_traversal_count
- fallback_target_node
- created_at

## Enforcement

- node execution cannot exceed node policy
- edges are traversed only when approved conditions are satisfied
- transition reasons are preserved
- unbounded graph loops are rejected
- edge traversal cannot widen tool/data/model scope
