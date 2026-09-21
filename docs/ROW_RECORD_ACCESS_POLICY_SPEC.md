# Row / Record Access Policy Specification

## record_access_policies

Recommended fields:

- record_access_policy_code
- organization_id
- resource_name
- operation
- policy_mode
- subject_expression
- organization_expression
- matter_expression
- role_expression
- data_lane_expression
- row_filter_expression
- with_check_expression
- lifecycle_status
- created_at

## Operations

- SELECT
- INSERT
- UPDATE
- DELETE

## Policy modes

- PERMISSIVE
- RESTRICTIVE

## Enforcement

- sensitive resources use default deny
- restrictive policies narrow all otherwise-allowed access
- UPDATE/DELETE rules must not rely on invisible rows
- views/reporting layers may not widen underlying authority
- organization/matter boundary tests are mandatory
