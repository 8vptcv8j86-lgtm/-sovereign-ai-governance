# Human Response and Attestation Ledger Specification

## Proposed human_attestation_responses fields

- response_code
- organization_id
- request_instance_code
- request_template_code
- request_version
- respondent_reference
- respondent_role
- identity_mode
- identity_assurance_method
- presented_content_digest
- answer_payload_digest
- answer_values
- attachment_references
- source_channel
- privacy_notice_version
- attestation_statement
- audit_reference
- submitted_at
- status

## Proposed human_attestation_amendments fields

- amendment_code
- organization_id
- original_response_code
- amended_response_code
- amendment_reason
- requested_by
- approved_by
- created_at

## Enforcement

- original responses are immutable
- amendments never erase original evidence
- response integrity is verifiable
- anonymous/pseudonymous modes must be policy-approved
- sensitive metadata is collected only when authorized
