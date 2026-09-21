# Premise and Assertion Verification Specification

## premise_assertions

- assertion_code
- organization_id
- matter_code
- subject_type
- subject_code
- assertion_type
- assertion_text_digest
- asserted_by
- source_reference
- criticality
- created_at

## premise_verification_events

- verification_event_code
- organization_id
- assertion_code
- status
- verification_method
- verification_source_reference
- verifier_reference
- verified_at
- freshness_policy_code
- expires_at
- contradiction_reference
- notes_digest
- created_at

## Verification states

- ASSERTED
- VERIFIED
- CONTRADICTED
- UNVERIFIED
- PARTIALLY_VERIFIED
- NOT_APPLICABLE

## Enforcement

- critical assertions require explicit verification before reliance where policy requires
- contradiction downgrades dependent reliance
- verification expiry interacts with evidence freshness
- downstream artifacts preserve assertion dependencies
