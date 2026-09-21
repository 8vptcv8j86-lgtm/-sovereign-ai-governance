# Privileged Bypass Identity Specification

## privileged_bypass_identities

- bypass_identity_code
- organization_id
- name
- identity_type
- owner_reference
- purpose
- environment
- allowed_resources
- allowed_operations
- permitted_data_lanes
- permitted_jurisdictions
- effective_from
- effective_to
- emergency_only
- required_approval
- lifecycle_status
- created_at

## privileged_bypass_events

- bypass_event_code
- organization_id
- bypass_identity_code
- operation
- resource
- purpose
- authorization_reference
- emergency_use
- started_at
- completed_at
- result
- audit_reference
- created_at

## Enforcement

- no implicit superuser identity
- bypass identities are least-privilege
- wildcard resource/operation grants require elevated approval
- every bypass use is audited
- expired/revoked identities fail closed
