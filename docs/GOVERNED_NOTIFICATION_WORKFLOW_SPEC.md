# Governed Notification Workflow Specification

## governed_notification_workflows

- notification_workflow_code
- organization_id
- name
- purpose
- owner
- lifecycle_status
- current_version
- created_at

## governed_notification_workflow_versions

- notification_workflow_version_code
- organization_id
- notification_workflow_code
- version
- workflow_digest
- event_types
- recipient_rule_references
- channel_sequence
- criticality
- preference_policy
- digest_policy
- delay_policy
- throttle_policy
- acknowledgement_policy
- escalation_policy
- provider_policy
- content_template_digest
- evidence_requirements
- approved_by
- created_at

## Enforcement

- approved versions are immutable
- every notification instance binds exact version/digest
- runtime cannot increase criticality
- version changes create a new immutable version
