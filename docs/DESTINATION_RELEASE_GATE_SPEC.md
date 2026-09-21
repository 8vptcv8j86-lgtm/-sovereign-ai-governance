# Destination / Confidentiality Release Gate Specification

## release_gate_decisions

Recommended fields:

- release_gate_decision_code
- organization_id
- matter_code
- artifact_version_code
- reliance_record_code
- destination_type
- destination_reference
- recipient_reference
- purpose
- confidentiality_class
- privilege_treatment
- data_lane
- jurisdiction
- disclosure_grant_reference
- required_review_state
- required_redaction
- decision
- denial_reason
- approved_by
- decided_at
- audit_reference

## Decisions

- ALLOW
- DENY
- REQUIRE_REDACTION
- REQUIRE_REVIEW
- REQUIRE_NEW_DERIVATIVE
- REQUIRE_ADDITIONAL_APPROVAL

## Enforcement

- confidentiality label alone never authorizes release
- release checks exact destination and artifact version
- external use may require professionally reviewed reliance state
- privilege/work-product treatment is destination-aware
- release through evidence rooms remains subject to R9 disclosure controls
