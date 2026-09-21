# Notification Digest, Delay and Throttle Specification

## Digest policy

Recommended fields:

- digest_policy_code
- organization_id
- grouping_key
- window_seconds
- maximum_items
- aggregation_mode
- bypass_criticality
- created_at

## Delay policy

- delay_policy_code
- organization_id
- delay_seconds
- delay_until_condition
- bypass_criticality
- created_at

## Throttle policy

- throttle_policy_code
- organization_id
- recipient_scope
- channel_scope
- maximum_count
- window_seconds
- cooldown_seconds
- bypass_criticality
- created_at

## Enforcement

- control steps are deterministic
- grouped notifications preserve underlying event references
- throttle suppression is evidenced
- mandatory critical notifications bypass only according to policy
