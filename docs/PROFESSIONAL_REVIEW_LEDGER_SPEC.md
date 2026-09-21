# Professional Review and Verification Ledger Specification

## professional_review_events

- professional_review_code
- organization_id
- matter_code
- artifact_version_code
- reviewer_reference
- reviewer_role
- reviewer_authority
- review_type
- source_checks_completed
- verified_assertion_references
- unresolved_issues
- qualifications
- disposition
- reliance_state_granted
- permitted_use
- reviewed_at
- audit_reference
- created_at

## Dispositions

- APPROVED
- APPROVED_WITH_QUALIFICATIONS
- RETURN_FOR_REVISION
- REJECTED
- ESCALATED

## Enforcement

- review binds exact artifact version/digest
- reviewer authority is checked by policy
- material artifact changes require renewed review where configured
- unresolved qualifications travel with the reliance record
- review does not authorize destinations beyond permitted use
