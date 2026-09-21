# Governed Runtime State Specification

## State scopes

- EPHEMERAL
- NODE_SCOPED
- WORKFLOW_SCOPED
- SESSION_SCOPED
- AGENT_SCOPED
- ORGANIZATION_SCOPED
- PERSISTENT

## Proposed runtime_state_items fields

- state_code
- organization_id
- execution_code
- workflow_execution_code
- node_code
- scope
- owner_reference
- writer_reference
- authorized_reader_references
- value_digest
- content_reference
- data_classification
- data_lane
- source_reference
- retention_rule
- created_at
- expires_at
- superseded_by
- status

## Enforcement

- state reads/writes require scope-compatible authorization
- restricted/local/sovereign data lanes remain enforced
- cross-tenant/session leakage is blocked
- expired state cannot be read except through authorized evidence/recovery paths
- runtime state cannot silently become persistent institutional memory
- promotion to governed context, wiki knowledge or a skill proposal requires the normal governance lifecycle
