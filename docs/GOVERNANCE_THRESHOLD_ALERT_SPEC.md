# Governance Threshold Alert Specification

## governance_threshold_rules

Recommended fields:

- threshold_rule_code
- organization_id
- metric_code
- subject_type
- subject_code
- aggregation_window
- comparison_operator
- threshold_value
- direction
- recurring
- cooldown_seconds
- severity
- action_type
- action_target
- evidence_requirement
- lifecycle_status
- created_at

## governance_threshold_events

Recommended fields:

- threshold_event_code
- organization_id
- threshold_rule_code
- subject_type
- subject_code
- measured_value
- threshold_value
- window_start
- window_end
- transaction_key
- first_crossed_at
- last_observed_at
- action_reference
- status
- created_at

## Enforcement

- crossing event has deterministic transaction identity
- recurring thresholds respect configured cooldown
- threshold actions use normal policy/authorization
- disabling a rule prevents future actions but preserves historical evidence
