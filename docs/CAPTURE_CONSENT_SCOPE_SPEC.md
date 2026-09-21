# Capture Consent and Scope Specification

## Capture operations

- CAPTURE
- STORE_LOCAL
- PROCESS
- TRANSCRIBE
- GENERATE_SUMMARY
- GENERATE_CHAPTERS
- UPLOAD
- SHARE_INTERNAL
- SHARE_EXTERNAL
- EXPORT_ORIGINAL
- DELETE

## capture_scope_policies

- capture_policy_code
- organization_id
- purpose
- allowed_capture_types
- allowed_surfaces
- microphone_allowed
- camera_allowed
- system_audio_allowed
- screenshot_allowed
- event_metadata_allowed
- maximum_duration
- allowed_data_classifications
- participant_notification_rule
- participant_consent_rule
- processing_policy
- storage_profile_code
- retention_rule
- disclosure_policy
- lifecycle_status
- created_at

## capture_authorization_events

- capture_authorization_code
- organization_id
- capture_session_code
- operation
- requested_by
- policy_code
- decision
- approved_by
- reason
- effective_from
- effective_to
- created_at

## Enforcement

- each operation is authorized separately
- capture authority does not imply upload/share authority
- scope is minimum-necessary
- scope expansion requires new authorization
