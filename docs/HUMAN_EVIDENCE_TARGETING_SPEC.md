# Human Evidence Eligibility and Targeting Specification

## Proposed human_evidence_targeting_rules fields

- targeting_rule_code
- organization_id
- request_template_code
- request_version
- eligibility_type
- eligibility_expression
- target_role
- target_business_unit
- target_system_code
- target_model_code
- target_vendor_code
- jurisdiction
- risk_tier
- trigger_type
- trigger_expression
- priority
- exclusions
- lifecycle_status
- created_at

## Proposed request instance fields

- request_instance_code
- organization_id
- request_template_code
- request_version
- targeting_rule_code
- respondent_reference
- respondent_role
- eligibility_reason
- trigger_type
- trigger_reference
- trigger_reason
- presented_content_digest
- issued_at
- due_at
- expires_at
- status

## Enforcement

- eligibility and trigger are evaluated separately
- targeting decisions are recorded
- target identity/role is organization-scoped
- expired instances cannot satisfy controls
