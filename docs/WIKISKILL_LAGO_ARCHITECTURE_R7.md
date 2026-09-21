# Sentinel WikiSkill Governance — Lago-Informed Architecture R7

## Status

Revision branch:
`feature/wiki-skill-governance-lago-r7`

Preserved predecessor:
`archive/wiki-skill-governance-formbricks-r6-2026-09-21`

Parent commit:
`a2c8675d3a339825462b7017ac4f57b0a934646e`

R7 extends Version 30 + R1 + R2 + R3 + R4 + R5 + R6. It does not modify migration `0025`.

## R7 purpose

R7 adds metering-grade accountability for governed AI activity.

It adds:

1. Governed Usage Event Ledger
2. Agent / Skill Entitlement Registry
3. Quota and Allowance Policies
4. Threshold Alert Engine
5. Atomic Governance Batch Rules
6. Reconciliation and Variance Ledger

---

## 1. Governed Usage Event Ledger

Sentinel should record measurable consumption of governed capability.

Example metric classes:

- model_tokens
- model_calls
- tool_calls
- external_api_calls
- workflow_runs
- critical_actions
- irreversible_actions
- human_approval_requests
- human_overrides
- data_egress_bytes
- sandbox_runtime_seconds
- storage_bytes
- evidence_export_runs

Recommended event identity:

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

### Core rule

Usage-event ingestion is idempotent by transaction identity.

Retries must not double-count consumption, duplicate alerts, or create duplicate enforcement.

---

## 2. Agent / Skill Entitlement Registry

Permissions answer whether an action may occur.

Entitlements add quantity, time, scope and consumption constraints.

An entitlement may bind:

- organization
- agent
- skill
- workflow
- tool operation
- metric
- quota
- allowance
- reset period
- effective dates
- data lanes
- jurisdictions
- action-class ceiling
- required approvals
- overage behavior

Example:

```
Agent: AGT-204
Skill: vendor-risk-assessment
Allowance: 100 executions / month
Critical actions: 5 / day
External model calls: 500 / month
Sovereign data: internal providers only
```

### Core rule

Authorization must consider both permission and active entitlement state when policy requires entitlement enforcement.

---

## 3. Quota and Allowance Policies

A quota policy defines measurable limits.

Examples:

- maximum Critical actions/day
- maximum external model calls/month
- maximum egress bytes/day
- maximum workflow runs/hour
- maximum human overrides/month
- maximum sandbox runtime/day

Policy behavior at limit may be:

- ALLOW_AND_WARN
- THROTTLE
- REQUIRE_APPROVAL
- BLOCK
- SUSPEND_AGENT
- SUSPEND_WORKFLOW
- OPEN_REVIEW

### Core rule

Quota evaluation uses reconciled or policy-approved usage totals, not unverified client-side counters.

---

## 4. Threshold Alert Engine

Thresholds are evaluated on measurable governance signals.

A threshold should define:

- metric
- aggregation window
- direction
- threshold value
- recurring/non-recurring
- cooldown
- target entity
- action
- severity
- required evidence

Examples:

```
critical_actions >= 20/day
  -> require compliance review

failed_authorizations >= 5/hour
  -> suspend agent

human_override_rate > 10%
  -> open performance review

external_model_cost > monthly budget
  -> require finance approval
```

### Core rule

Threshold crossings are events with evidence and idempotency identity.

---

## 5. Atomic Governance Batch Rules

Certain governance transitions must commit as all-or-nothing units.

Examples:

### Deployment batch
- package digest
- validation result
- approval evidence
- execution context
- sandbox profile
- capability grants
- deployment record
- audit event

### Critical execution batch
- preflight
- classification
- policy decision
- human approval
- entitlement check
- execution record
- audit event

### Core rule

If any mandatory member of an atomic governance batch fails validation, none of the state-changing members are committed.

This extends existing audited-batch behavior into an explicit governance primitive.

---

## 6. Reconciliation and Variance Ledger

Important governance results should support independent recomputation.

Reconciliation states:

- MATCH
- MISMATCH
- UNVERIFIABLE
- PARTIAL
- PENDING

Possible reconciliations:

- approval quorum
- audit-chain hash
- usage totals
- entitlement consumption
- threshold crossing
- workflow execution count
- data-egress totals
- evidence-package contents

Recommended fields:

- reconciliation_code
- subject_type
- subject_code
- source_result
- independently_computed_result
- variance
- method
- evidence references
- status
- reconciled_at
- reviewer
- remediation reference

### Core rule

A MISMATCH on a policy-critical result can trigger suspension, remediation or human review.

---

## Integrated R7 control flow

```
Execution / Event
  -> Idempotent Usage Event
  -> Metric Aggregation
  -> Entitlement Check
  -> Quota / Allowance Evaluation
  -> Threshold Evaluation
  -> Policy Action
  -> Atomic Governance Batch
  -> Audit / Evidence
  -> Independent Reconciliation
  -> Match / Variance
  -> Remediation if needed
```

## Database plan

Do not hand-edit `0025`.

Recommended R7 entities for the next generated migration:

- `governed_usage_events`
- `governance_metrics`
- `governance_entitlements`
- `governance_quota_policies`
- `governance_usage_aggregates`
- `governance_threshold_rules`
- `governance_threshold_events`
- `governance_atomic_batches`
- `governance_atomic_batch_members`
- `governance_reconciliations`
- `governance_variances`

These should be considered together with pending R1–R6 entities during the next generated migration pass.

## Acceptance gates

- duplicate transaction IDs do not double-count
- usage ingestion is organization-scoped
- entitlement state constrains execution where policy requires
- quota reset windows are deterministic
- threshold crossings are idempotent
- cooldown prevents duplicate alerts
- critical atomic batches roll back on partial failure
- reconciliation independently recomputes policy-critical results
- mismatch creates governed variance evidence
- threshold and reconciliation actions pass normal authorization
- evidence export includes relevant R7 records
- audit chain remains valid
