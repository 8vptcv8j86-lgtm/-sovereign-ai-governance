# Secrets and Key Reference Registry Specification

## Secret classes

- API_KEY
- ACCESS_TOKEN
- REFRESH_TOKEN
- SIGNING_KEY
- ENCRYPTION_KEY
- DATABASE_CREDENTIAL
- PROVIDER_SECRET
- WEBHOOK_SECRET

## secret_reference_registry

- secret_reference_code
- organization_id
- secret_class
- provider_or_system
- purpose
- environment
- secret_version
- storage_backend_reference
- owner_reference
- allowed_consumers
- permitted_data_lanes
- rotation_policy
- last_rotated_at
- expires_at
- lifecycle_status
- created_at

## secret_rotation_events

- rotation_event_code
- organization_id
- secret_reference_code
- prior_version
- new_version
- rotated_by
- reason
- rotated_at
- validation_result
- created_at

## Enforcement

- secret material never enters audit/event payloads
- only references/versions are stored in governance records
- consumption is limited to approved identities
- expired/revoked secrets fail closed
