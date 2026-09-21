# Evidence Disclosure Activity Specification

## Activity classes

- ROOM_OPENED
- ACCESS_GRANTED
- ACCESS_REVOKED
- VIEW_STARTED
- VIEW_COMPLETED
- DOWNLOAD_ATTEMPTED
- DOWNLOAD_COMPLETED
- ORIGINAL_DOWNLOAD_BLOCKED
- COMMENT_ADDED
- ACKNOWLEDGED
- EVIDENCE_UPLOADED
- REQUEST_COMPLETED
- ROOM_FROZEN
- ROOM_EXPIRED

## Proposed evidence_disclosure_activities fields

- disclosure_activity_code
- organization_id
- evidence_room_code
- room_version_code
- recipient_reference
- disclosure_grant_code
- artifact_version_code
- activity_type
- permission_used
- result
- source_session_reference
- occurred_at
- audit_reference
- created_at

## Enforcement

- access invitation does not imply view
- view does not imply download
- blocked attempts are evidenced
- viewer/activity records remain scoped to the room and organization
