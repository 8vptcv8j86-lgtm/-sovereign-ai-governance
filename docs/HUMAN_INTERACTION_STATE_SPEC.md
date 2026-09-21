# Human Evidence Interaction State Specification

## States

- ELIGIBLE
- QUEUED
- DELIVERED
- SEEN
- STARTED
- COMPLETED
- DECLINED
- SKIPPED
- EXPIRED
- ESCALATED
- INVALIDATED

## Proposed human_evidence_interactions fields

- interaction_code
- organization_id
- request_instance_code
- state
- channel
- actor_reference
- occurred_at
- metadata_digest
- audit_reference

## Enforcement

- interaction history is append-only
- delivery is not treated as completion
- completion is not automatically treated as approval
- policy defines which terminal states satisfy a control
- reminders/escalations respect cooldown and dedupe controls
