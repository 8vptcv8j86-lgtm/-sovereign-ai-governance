# Notification Delivery and Retry Specification

## notification_instances

Recommended fields:

- notification_instance_code
- organization_id
- workflow_code
- workflow_version
- event_reference
- recipient_reference
- resolved_channels
- criticality
- content_digest
- created_at
- expires_at
- status

## notification_delivery_attempts

- delivery_attempt_code
- organization_id
- notification_instance_code
- transaction_id
- recipient_reference
- channel
- provider_code
- provider_message_id
- attempt_number
- attempted_at
- status
- failure_category
- provider_response_reference
- retryable
- next_retry_at
- final_disposition
- created_at

## Delivery states

- QUEUED
- PROVIDER_ACCEPTED
- SENT
- DELIVERED
- READ
- ACKNOWLEDGED
- FAILED
- SUPPRESSED
- EXPIRED
- CANCELED

## Enforcement

- retry transaction identity is deterministic
- duplicate retries do not create duplicate semantic notifications
- raw provider payload is stored only by reference/digest where possible
- permanent failures stop automatic retry
