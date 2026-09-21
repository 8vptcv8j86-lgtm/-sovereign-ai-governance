# Notification Recipient, Topic and Preference Specification

## notification_recipient_rules

- recipient_rule_code
- organization_id
- notification_workflow_code
- recipient_type
- recipient_reference
- role
- business_unit
- topic_code
- eligibility_expression
- jurisdiction
- required_channels
- created_at

## notification_topics

- topic_code
- organization_id
- name
- purpose
- lifecycle_status
- created_at

## notification_topic_members

- topic_member_code
- organization_id
- topic_code
- member_reference
- member_role
- effective_from
- effective_to
- created_at

## notification_preferences

- preference_code
- organization_id
- recipient_reference
- workflow_code
- channel
- enabled
- source
- effective_from
- effective_to
- created_at

## Enforcement

- recipient resolution is organization-scoped
- topic membership is time-bound where required
- preferences are evaluated per workflow/channel
- policy-controlled critical notices may override preferences only when explicitly allowed
