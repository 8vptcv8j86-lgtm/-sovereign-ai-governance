# Governed Usage Event Specification

## Proposed governance_metrics fields

- metric_code
- organization_id
- name
- unit
- aggregation_type
- description
- lifecycle_status
- created_at

## Proposed governed_usage_events fields

- usage_event_code
- transaction_id
- organization_id
- subject_type
- subject_code
- metric_code
- quantity
- unit
- occurred_at
- received_at
- source
- execution_code
- workflow_execution_code
- metadata_digest
- audit_reference
- created_at

## Idempotency

- transaction_id must be unique within the configured organization/metric scope
- retrying the same event must return the existing semantic result
- duplicate events do not increment aggregates
- duplicate events do not re-fire threshold actions
- conflicting reuse of a transaction_id is rejected and audited

## Aggregation

Supported examples:
- SUM
- COUNT
- MAX
- MIN
- DISTINCT_COUNT
- RATE
- DURATION
