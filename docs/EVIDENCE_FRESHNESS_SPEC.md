# Evidence Freshness Specification

## Purpose

Track whether evidence remains suitable for current reliance.

## Proposed evidence_freshness_checks fields

- freshness_check_code
- organization_id
- evidence_code
- source_code
- subject_type
- subject_code
- observed_at
- verified_at
- freshness_policy
- verification_method
- status
- contradiction_references
- verifier
- next_verification_due
- audit_reference
- created_at

## Status values

- CURRENT
- STALE
- CONTRADICTED
- UNSUPPORTED
- UNKNOWN

## Enforcement

- mandatory control evidence may require CURRENT status
- STALE evidence triggers configured re-verification or execution block
- CONTRADICTED evidence requires human or policy review
- UNSUPPORTED evidence cannot satisfy a mandatory control
- all checks are append-only
