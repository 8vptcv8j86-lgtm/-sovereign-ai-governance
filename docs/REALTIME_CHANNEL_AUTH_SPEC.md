# Realtime / Event-Stream Authorization Specification

## realtime_channel_policies

- channel_policy_code
- organization_id
- channel_pattern
- topic_type
- publish_allowed
- subscribe_allowed
- permitted_event_types
- organization_rule
- matter_rule
- role_rule
- data_lane_rule
- session_requirement
- lifecycle_status
- created_at

## realtime_subscription_events

- subscription_event_code
- organization_id
- channel_policy_code
- channel_name
- subscriber_reference
- action
- authorization_result
- session_reference
- connected_at
- disconnected_at
- denial_reason
- audit_reference
- created_at

## Enforcement

- private channels require authorization before subscribe/publish
- session loss may revoke live access according to policy
- channel access cannot exceed underlying data-plane permissions
