# Response-Driven Governance Action Specification

## Proposed response_governance_actions fields

- response_action_code
- organization_id
- response_code
- request_template_code
- response_condition
- action_type
- target_entity_type
- target_entity_code
- required_authorization
- required_human_approval
- policy_reference
- status
- execution_reference
- created_at

## Action types

- APPROVE
- DENY
- ESCALATE
- CREATE_INCIDENT
- CREATE_REMEDIATION
- SUSPEND_SKILL
- SUSPEND_WORKFLOW
- REQUEST_MORE_EVIDENCE
- REVOKE_GRANT
- OPEN_REVIEW
- SET_REVIEW_DUE

## Enforcement

- human response may trigger but does not bypass authorization
- state-changing actions use normal Sentinel execution controls
- action outcome is linked back to the originating response
