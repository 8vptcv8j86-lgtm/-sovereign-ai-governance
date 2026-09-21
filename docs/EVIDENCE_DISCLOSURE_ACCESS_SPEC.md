# Evidence Disclosure Access Specification

## Permission classes

- VIEW
- DOWNLOAD_REDACTED
- DOWNLOAD_DERIVATIVE
- DOWNLOAD_ORIGINAL
- UPLOAD_EVIDENCE
- COMMENT
- ACKNOWLEDGE
- RESPOND_TO_REQUEST

## Proposed evidence_disclosure_grants fields

- disclosure_grant_code
- organization_id
- evidence_room_code
- recipient_reference
- recipient_group_code
- recipient_role
- allowlist
- denylist
- authentication_requirement
- permissions
- artifact_scope
- effective_from
- effective_to
- watermark_policy
- data_lane_policy
- jurisdiction
- granted_by
- revoked_at
- revocation_reason
- created_at

## Enforcement

- default deny
- permissions are evaluated per artifact/item
- original-download right is distinct from derivative/redacted download
- revoked/expired grants block access immediately
- disclosure grants cannot create broader organizational authority
