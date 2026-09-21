# Governance Entitlement and Quota Specification

## governance_entitlements

Recommended fields:

- entitlement_code
- organization_id
- subject_type
- subject_code
- capability_type
- capability_code
- metric_code
- allowance
- reset_period
- effective_from
- effective_to
- action_class_ceiling
- permitted_data_lanes
- permitted_jurisdictions
- required_approval
- overage_behavior
- lifecycle_status
- created_at

## governance_quota_policies

Recommended fields:

- quota_policy_code
- organization_id
- metric_code
- subject_type
- subject_code
- limit_value
- window_type
- window_value
- reset_rule
- warning_threshold
- enforcement_behavior
- grace_amount
- required_approval
- created_at

## Enforcement

- permission and entitlement are evaluated independently
- entitlement expiry immediately affects new authorization
- quota totals come from governed usage aggregates
- reset windows use organization-configured timezone/policy
- overage behavior is explicit and audited
