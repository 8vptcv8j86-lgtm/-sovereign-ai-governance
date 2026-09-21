# Notification Escalation and Acknowledgement Specification

## notification_acknowledgements

- acknowledgement_code
- organization_id
- notification_instance_code
- recipient_reference
- acknowledgement_type
- identity_assurance_method
- response
- acknowledged_at
- evidence_reference
- audit_reference
- created_at

## notification_escalations

- escalation_code
- organization_id
- notification_instance_code
- escalation_level
- escalation_reason
- previous_attempt_references
- target_recipient_reference
- target_topic_code
- channel
- required_by
- triggered_at
- acknowledged_at
- status
- created_at

## Enforcement

- delivery is not acknowledgement
- acknowledgement identity requirements follow policy
- escalation timers use deterministic timestamps
- each escalation is linked to prior delivery evidence
- escalation actions remain subject to data-lane and recipient policy
