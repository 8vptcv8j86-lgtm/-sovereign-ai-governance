# Session Artifact Manifest Specification

## Artifact types

- ORIGINAL_VIDEO
- ORIGINAL_AUDIO
- SCREENSHOT
- TRANSCRIPT
- CAPTIONS
- SUMMARY
- CHAPTERS
- TITLE
- TRANSLATION
- REDACTED_MEDIA
- CLIP
- REVIEW_ANNOTATIONS
- RECOVERY_FRAGMENT
- INTEGRITY_REPORT

## capture_artifacts

- capture_artifact_code
- organization_id
- capture_session_code
- artifact_type
- canonical
- lifecycle_status
- created_at

## capture_artifact_versions

- capture_artifact_version_code
- organization_id
- capture_artifact_code
- version
- content_reference
- digest_algorithm
- content_digest
- parent_artifact_version_code
- start_offset_ms
- end_offset_ms
- generator_type
- generator_reference
- generator_version
- processing_parameters_digest
- storage_profile_version
- retention_rule
- created_at

## Enforcement

- canonical source media and derived artifacts remain distinct
- each version has an integrity digest
- derived artifacts retain parent/source reference
- material edits create a new version
