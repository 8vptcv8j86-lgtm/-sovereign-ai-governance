# Governed Extension and Plugin Registry Specification

## Extension types

- plugin
- MCP_SERVER
- connector
- tool_adapter
- model_provider_adapter
- agent_runtime
- execution_driver
- workflow_extension
- skill_package

## governed_extensions

- extension_code
- organization_id
- extension_type
- name
- publisher
- source
- owner
- risk_tier
- lifecycle_status
- current_version
- created_at

## governed_extension_versions

- extension_version_code
- organization_id
- extension_code
- version
- package_digest_algorithm
- package_digest
- signature_reference
- provenance_reference
- permissions
- network_destinations
- supported_data_lanes
- required_credentials
- approved_by
- approval_reference
- created_at

## Enforcement

- runtime artifact digest must match approved digest
- version string alone is insufficient
- permission changes create a new version
- unapproved or revoked extensions are blocked
- extension provenance and publisher are preserved
- extension evidence participates in Evidence Export
