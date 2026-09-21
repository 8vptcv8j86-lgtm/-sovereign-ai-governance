# Evidence Artifact and Version Specification

## evidence_artifacts

- evidence_artifact_code
- organization_id
- artifact_type
- name
- source_system
- source_record_references
- owner
- lifecycle_status
- created_at

## evidence_artifact_versions

- artifact_version_code
- organization_id
- evidence_artifact_code
- version
- classification
- source_version_reference
- content_reference
- content_digest_algorithm
- content_digest
- derivative_type
- redaction_job_reference
- created_by
- retention_rule
- created_at

## Derivative types

- ORIGINAL
- DERIVATIVE
- REDACTED
- REGULATORY_EXPORT
- BOARD_EXPORT
- AUDIT_EXPORT

## Enforcement

- every disclosure binds exact artifact version/digest
- derived versions preserve their source-version reference
- source evidence is not overwritten by disclosure transformations
