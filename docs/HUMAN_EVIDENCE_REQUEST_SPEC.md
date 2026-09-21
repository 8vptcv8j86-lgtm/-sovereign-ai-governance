# Human Evidence Request Specification

## Request templates

### human_evidence_request_templates
- request_template_code
- organization_id
- name
- purpose
- owner
- risk_tier
- lifecycle_status
- current_version
- created_at

### human_evidence_request_versions
- request_version_code
- organization_id
- request_template_code
- version
- content_digest
- question_schema
- answer_schema
- evidence_requirements
- expiration_policy
- escalation_policy
- applicable_jurisdictions
- privacy_policy_code
- approved_by
- created_at

## Enforcement

- approved request versions are immutable
- response must bind the exact version shown
- expired/retired templates cannot create new valid requests
- changes create a new version
