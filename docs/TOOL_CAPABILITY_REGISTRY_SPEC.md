# Tool Capability Registry Specification

## Purpose

Represent tools as governed operations with explicit side effects, data constraints and authorization requirements.

## Proposed tool_capability_registry fields

- tool_code
- organization_id
- provider
- interface_type
- purpose
- auth_method
- credential_reference_type
- supported_data_lanes
- allowed_jurisdictions
- network_destinations
- dry_run_supported
- lifecycle_status
- created_at

## Proposed tool_operations fields

- operation_code
- organization_id
- tool_code
- operation_name
- description
- read_write_mode
- action_class
- side_effecting
- reversible
- required_data_lanes
- required_approval
- rate_constraints
- evidence_requirement
- lifecycle_status
- created_at

## Enforcement

- grants target tool operations, not just tool names
- operation action class cannot be lowered by runtime request
- data-lane compatibility is checked before invocation
- dry-run is preferred during preflight where available
- disabled operations cannot execute
