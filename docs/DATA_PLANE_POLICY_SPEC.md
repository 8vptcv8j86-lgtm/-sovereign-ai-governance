# Data-Plane Policy Specification

## data_plane_policies

- data_plane_policy_code
- organization_id
- name
- resource_type
- owner
- lifecycle_status
- current_version
- created_at

## data_plane_policy_versions

- data_plane_policy_version_code
- organization_id
- data_plane_policy_code
- version
- policy_digest
- resource_scope
- subject_scope
- allowed_operations
- organization_rule
- matter_rule
- role_rule
- data_lane_rule
- jurisdiction_rule
- effective_from
- effective_to
- approved_by
- created_at

## Enforcement

- default deny unless policy grants access
- application authorization cannot override a data-plane denial
- policy versions are immutable after activation
