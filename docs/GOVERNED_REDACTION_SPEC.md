# Governed Evidence Redaction Specification

## Redaction lifecycle

- PENDING
- DETECTING
- REVIEW
- APPLYING
- APPLIED
- FAILED

## Candidate states

- PENDING
- ACCEPTED
- DECLINED
- APPLIED

## evidence_redaction_jobs

- redaction_job_code
- organization_id
- evidence_artifact_code
- source_artifact_version_code
- purpose
- reasons
- custom_terms
- status
- created_by
- reviewer
- result_artifact_version_code
- error_reference
- created_at
- completed_at

## evidence_redactions

- redaction_code
- organization_id
- redaction_job_code
- page_or_location_reference
- coordinates_or_selector
- masked_preview
- category
- confidence
- reason
- source
- status
- reviewed_by
- reviewed_at
- created_at

## Enforcement

- source artifact remains immutable
- applied redaction creates a derivative artifact version
- raw sensitive plaintext is not retained in redaction metadata where avoidable
- post-redaction verification confirms selected content is absent/inaccessible in derivative
- redaction approval and application are separately evidenced
