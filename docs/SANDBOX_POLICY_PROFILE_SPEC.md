# Sandbox Policy Profile Specification

## Purpose

Define verifiable containment conditions for governed code and agent execution.

## Proposed sandbox_policy_profiles fields

- sandbox_profile_code
- organization_id
- name
- owner
- lifecycle_status
- current_version
- created_at

## Proposed sandbox_profile_versions fields

- sandbox_profile_version_code
- organization_id
- sandbox_profile_code
- version
- profile_digest
- runtime_type
- cpu_limit
- memory_limit
- execution_timeout_seconds
- filesystem_mode
- mount_policy
- syscall_policy
- process_policy
- network_policy
- egress_allowlist
- secrets_policy
- install_policy
- supported_data_lanes
- jurisdictions
- evidence_settings
- approved_by
- created_at

## Enforcement

- execution binds exact profile version/digest
- network deny-by-default may be required by policy
- secret material is referenced, not embedded in profile
- sandbox changes require a new version
- expired/disabled profiles block new execution
