# Evidence Room Freeze and Integrity Seal Specification

## evidence_room_freezes

Recommended fields:

- freeze_code
- organization_id
- evidence_room_code
- room_version_code
- frozen_by
- frozen_at
- manifest_reference
- manifest_digest_algorithm
- manifest_digest
- artifact_count
- grant_snapshot_digest
- activity_snapshot_digest
- archive_reference
- archive_digest
- verification_status
- verified_at
- created_at

## Freeze behavior

A freeze manifest should include:

- room identity/version
- included artifacts and exact versions
- artifact digests
- folder/item structure
- active disclosure grants
- relevant activity range
- request/task states
- policy references
- generated timestamp

## Enforcement

- frozen room version is immutable
- new evidence after freeze requires supplement or new room version
- verification recomputes manifest/archive digest independently
- mismatch creates reconciliation/variance evidence
