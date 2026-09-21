# Governed Object Storage Policy Specification

## object_storage_policies

- object_storage_policy_code
- organization_id
- storage_profile_code
- bucket_or_container
- object_prefix
- allowed_operations
- subject_scope
- matter_scope
- data_lane
- jurisdiction
- signed_url_max_seconds
- original_download_allowed
- encryption_requirement
- retention_rule
- lifecycle_status
- created_at

## Operations

- READ
- WRITE
- DELETE
- LIST
- DOWNLOAD_DERIVATIVE
- DOWNLOAD_ORIGINAL
- CREATE_SIGNED_ACCESS

## Enforcement

- object URLs do not bypass policy
- signed access is short-lived and scope-bound
- original download is separately controlled
- storage residency policy remains active during access
