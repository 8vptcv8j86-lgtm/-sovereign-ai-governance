# Governed Session Capture Specification

## governed_capture_sessions

- capture_session_code
- organization_id
- matter_code
- workflow_execution_code
- purpose
- capture_type
- initiated_by
- authorized_by
- capture_policy_code
- storage_profile_code
- status
- started_at
- stopped_at
- completed_at
- created_at

## capture_participants

- participant_code
- organization_id
- capture_session_code
- participant_type
- participant_reference
- role
- notification_required
- notified_at
- consent_required
- consent_reference
- created_at

## Enforcement

- capture requires active approved policy
- participant obligations are checked before capture where required
- capture status is append-only through events
- capture remains matter/org scoped
