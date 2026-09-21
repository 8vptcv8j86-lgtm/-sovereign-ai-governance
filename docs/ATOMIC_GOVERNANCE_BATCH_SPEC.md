# Atomic Governance Batch Specification

## Purpose

Represent multi-record governance transitions that must succeed or fail as a unit.

## Proposed governance_atomic_batches fields

- atomic_batch_code
- organization_id
- batch_type
- subject_type
- subject_code
- requested_by
- expected_member_count
- batch_digest
- status
- committed_at
- failed_at
- failure_reason
- audit_reference
- created_at

## Proposed governance_atomic_batch_members fields

- batch_member_code
- organization_id
- atomic_batch_code
- sequence
- member_type
- member_reference
- required
- validation_status
- state_change
- member_digest
- created_at

## Enforcement

- mandatory members validate before state-changing commit
- partial commit is prohibited for configured atomic batch types
- failure records preserve diagnostic evidence
- retries use the original batch identity unless policy requires a new transaction
- audit event commits atomically with the governed transition where technically supported
