# Sovereign and Local Data Lane Specification

## Default lanes

- PUBLIC
- INTERNAL
- CONFIDENTIAL
- RESTRICTED
- LOCAL_ONLY
- SOVEREIGN_ONLY

## Proposed data_lane_policies fields

- data_lane_code
- organization_id
- lane_name
- description
- allowed_model_classes
- allowed_provider_classes
- allowed_tool_classes
- allowed_destinations
- allowed_jurisdictions
- export_allowed
- public_export_allowed
- external_processing_allowed
- retention_policy
- encryption_requirement
- human_approval_requirement
- created_at

## Enforcement

- data objects receive a lane classification
- models/tools/destinations declare lane capability
- transfers are denied when capability and policy do not match
- egress ledger records lane and decision
- evidence export applies redaction and exclusion rules by lane
- LOCAL_ONLY and SOVEREIGN_ONLY default to deny external processing
