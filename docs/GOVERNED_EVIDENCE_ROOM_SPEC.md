# Governed Evidence Room Specification

## governed_evidence_rooms

- evidence_room_code
- organization_id
- name
- purpose
- disclosure_class
- owner_reference
- audience_type
- jurisdiction
- data_lane_policy
- lifecycle_status
- opens_at
- expires_at
- created_at

## evidence_room_versions

- room_version_code
- organization_id
- evidence_room_code
- version
- room_manifest_digest
- description
- status
- approved_by
- created_at

## Enforcement

- evidence rooms expose only explicitly attached evidence items
- room versions are immutable after freeze
- room expiry blocks new access
- internal source evidence remains governed independently from disclosure-room visibility
