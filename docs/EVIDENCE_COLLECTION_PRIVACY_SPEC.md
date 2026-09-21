# Evidence Collection Privacy Specification

## Proposed evidence_collection_privacy_policies fields

- privacy_policy_code
- organization_id
- name
- purpose
- identity_mode
- minimum_required_fields
- prohibited_fields
- attachment_policy
- data_classification
- data_lane
- allowed_jurisdictions
- retention_rule
- export_policy
- redaction_policy
- notification_policy
- audit_metadata_policy
- approved_by
- lifecycle_status
- created_at

## Identity modes

- IDENTIFIED
- VERIFIED_ROLE
- PSEUDONYMOUS
- ANONYMOUS

## Enforcement

- collect only purpose-bound fields
- identity/device/network metadata requires policy basis
- attachment type/size/classification restrictions apply
- data-lane and export restrictions apply to responses
- retention/expiry are enforced
