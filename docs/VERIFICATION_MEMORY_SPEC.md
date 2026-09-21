# Verification Memory Specification

## Purpose

Reuse verified authority without pretending verification lasts forever.

## verification_memory_records

- verification_memory_code
- organization_id
- matter_code
- subject_type
- subject_code
- proposition_digest
- source_reference
- source_class
- source_content_digest
- jurisdiction
- verified_by
- verified_at
- freshness_window_seconds
- next_verification_at
- status
- superseded_by
- created_at

## Status

- CURRENT
- STALE
- CONTRADICTED
- SUPERSEDED
- REVOKED

## Enforcement

- only verified records enter verification memory
- freshness expiration downgrades CURRENT to STALE
- changed source digest triggers re-verification
- verification memory can reduce duplicate work but cannot bypass policy-required fresh review
