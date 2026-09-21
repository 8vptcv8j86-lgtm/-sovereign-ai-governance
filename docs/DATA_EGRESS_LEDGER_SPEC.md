# AI Data Egress Ledger Specification

## Purpose

Provide a tamper-evident institutional record of governed outbound data transfers initiated or mediated by AI systems and agents.

## Proposed data_egress_events record

- egress_code
- organization_id
- system_code
- agent_code
- execution_code
- workflow_code
- workflow_version
- skill_code
- skill_version
- package_hash
- destination
- destination_class
- provider
- data_classification
- payload_digest
- payload_size
- purpose
- authorization_reference
- policy_decision_reference
- human_approval_reference
- jurisdiction
- retention_rule
- outcome
- previous_hash
- event_hash
- created_at

## Destination classes

Examples:

- model_provider
- external_api
- browser
- email
- messaging
- cloud_storage
- partner_system
- regulator
- public_internet
- internal_cross_boundary

## Enforcement

- outbound transfer requires an authorization reference
- data classification must be evaluated before transfer
- restricted destinations are policy-blocked
- payload digest is computed before or at transfer boundary where technically possible
- sensitive payload content should not be duplicated into the ledger unless required
- event integrity must be verifiable
- egress events are included in evidence export
- a policy breach may trigger incident creation, skill suspension or workflow suspension
