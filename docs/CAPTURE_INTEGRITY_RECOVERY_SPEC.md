# Capture Integrity, Recovery and Completion Specification

## Integrity states

- RECORDING
- FINALIZING
- COMPLETE
- PARTIAL
- RECOVERED
- CORRUPT
- FAILED
- DELETED

## capture_integrity_checks

- integrity_check_code
- organization_id
- capture_session_code
- artifact_version_code
- expected_duration_ms
- observed_duration_ms
- expected_segment_count
- observed_segment_count
- missing_ranges
- digest_verified
- media_readable
- validation_method
- status
- checked_at
- evidence_reference
- created_at

## capture_recovery_events

- recovery_event_code
- organization_id
- capture_session_code
- source_fragment_references
- recovery_method
- recovered_artifact_version_code
- recovered_ranges
- unrecoverable_ranges
- status
- performed_by
- performed_at
- created_at

## capture_retention_events

- retention_event_code
- organization_id
- capture_session_code
- event_type
- retention_policy_reference
- scheduled_for
- performed_at
- result
- evidence_reference
- created_at

## capture_deletion_events

- deletion_event_code
- organization_id
- capture_session_code
- artifact_version_code
- deletion_method
- storage_location_reference
- requested_by
- authorized_by
- deleted_at
- verification_result
- evidence_reference
- created_at

## Enforcement

- incomplete capture remains visibly partial/recovered
- integrity is verified before high-reliance use
- deletion produces evidence rather than silent disappearance
- recovery never overwrites source fragments
