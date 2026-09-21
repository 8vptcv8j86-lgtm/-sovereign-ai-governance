# Capture Storage and Residency Specification

## Storage modes

- LOCAL_ONLY
- ORGANIZATION_OBJECT_STORE
- SOVEREIGN_REGION
- APPROVED_CLOUD
- HYBRID

## capture_storage_profiles

- storage_profile_code
- organization_id
- name
- owner
- lifecycle_status
- current_version
- created_at

## capture_storage_profile_versions

- storage_profile_version_code
- organization_id
- storage_profile_code
- version
- profile_digest
- storage_mode
- provider_reference
- organization_owned
- region
- jurisdiction
- encryption_requirement
- key_ownership
- signed_access_required
- replication_policy
- external_processing_allowed
- permitted_processing_regions
- retention_rule
- deletion_method
- backup_policy
- recovery_policy
- approved_by
- created_at

## Enforcement

- execution binds exact storage profile version
- external processing is separately evaluated
- storage failover cannot violate residency policy
- retention/deletion behavior is versioned and auditable
