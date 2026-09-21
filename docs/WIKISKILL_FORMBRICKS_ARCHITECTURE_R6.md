# Sentinel WikiSkill Governance — Formbricks-Informed Architecture R6

## Status

Revision branch:
`feature/wiki-skill-governance-formbricks-r6`

Preserved predecessor:
`archive/wiki-skill-governance-langgenius-r5-2026-09-21`

Parent commit:
`d096b5911025c5ab2edfc029ac2efe9ca67502c4`

R6 extends Version 30 + R1 + R2 + R3 + R4 + R5. It does not modify migration `0025`.

## R6 purpose

R6 governs the human side of the evidence chain.

It adds:

1. Governed Human Evidence Requests
2. Eligibility and Targeting Rules
3. Human Response / Attestation Ledger
4. Interaction State Tracking
5. Response-Driven Governance Actions
6. Evidence Collection Privacy Policy

---

## 1. Governed Human Evidence Requests

A human evidence request is a versioned control artifact that asks a defined person or role to provide evidence, attest to a fact, approve an action, deny an action, explain a condition or confirm a control.

Examples:

- quarterly model-owner attestation
- high-risk workflow approval
- incident follow-up
- vendor control certification
- human override justification
- policy exception request
- deployment approval
- data-transfer consent/approval

A request definition should bind:

- request template code
- version
- purpose
- question set
- answer schema
- evidence requirement
- risk tier
- expiration
- escalation rules
- applicable jurisdictions
- privacy policy
- follow-up actions

### Core rule

A response is valid only against the exact request-template version presented to the respondent.

---

## 2. Eligibility and Targeting Rules

Eligibility determines who should receive a request.

Triggers determine when an eligible request becomes active.

Eligibility may be based on:

- organization
- business unit
- role
- model ownership
- system ownership
- workflow responsibility
- approval authority
- jurisdiction
- risk tier
- incident assignment
- vendor relationship
- data stewardship role

Trigger classes may include:

- schedule
- workflow state
- policy event
- risk threshold
- incident
- deployment
- data egress request
- skill promotion
- manual request
- external event

### Core rule

Eligibility and trigger are separate evidence decisions.

Sentinel should be able to prove both:
- why this person was eligible; and
- why this request was triggered at that time.

---

## 3. Human Response / Attestation Ledger

Responses become first-class evidence records.

Recommended bindings:

- request instance
- request-template version
- respondent identity or governed anonymous mode
- respondent role
- organization
- presented content digest
- answer payload digest
- answer values
- attachments/evidence references
- identity assurance method
- submitted timestamp
- source/channel
- IP/device metadata only where policy permits
- consent/privacy notice version
- signature/attestation statement
- audit reference

### Core rule

The human response record is append-only.

Corrections create a new response or amendment; they do not overwrite the original attestation.

---

## 4. Interaction State Tracking

Sentinel should distinguish delivery from completion.

Interaction states may include:

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

This allows controls such as:

```
Delivered != completed
Completed != accepted
Accepted != still valid
```

### Core rule

A required human control is satisfied only by a qualifying terminal state defined by policy.

---

## 5. Response-Driven Governance Actions

Human responses may trigger governed follow-up.

Examples:

```
YES, model purpose changed
  -> create governance review
  -> suspend stale approval if policy requires

DENY critical execution
  -> block workflow node
  -> record denial evidence

REPORT safety incident
  -> create incident
  -> suspend skill/workflow if threshold reached

ATTEST no material change
  -> record attestation
  -> set next review date
```

Response actions may include:

- approve
- deny
- escalate
- create incident
- create remediation task
- suspend skill
- suspend workflow
- request additional evidence
- revoke grant
- open review
- update review due date

### Core rule

A response never bypasses normal authorization boundaries.

The response may satisfy or trigger a control, but downstream state change still occurs through Sentinel policy and audit mechanisms.

---

## 6. Evidence Collection Privacy Policy

Human evidence collection itself must be governed.

Policy should define:

- minimum necessary fields
- identity mode
- sensitive-question restrictions
- attachment restrictions
- data classification
- data lane
- retention period
- legal/jurisdiction basis
- export restrictions
- redaction requirements
- anonymous/pseudonymous handling
- notification rules
- audit metadata allowed

### Core rule

Sentinel should not collect identity or device metadata merely because the interface can.

Collection must be purpose-bound and policy-authorized.

---

## Integrated R6 control flow

```
Control Requirement
  -> Eligibility Evaluation
  -> Trigger Event
  -> Evidence Request Instance
  -> Delivery / Interaction State
  -> Human Response
  -> Identity / Integrity Validation
  -> Privacy / Data-Lane Enforcement
  -> Response Classification
  -> Policy Decision
  -> Follow-Up Governance Action
  -> Audit / Evidence Export
  -> Freshness / Expiry Monitoring
```

## Database plan

Do not hand-edit `0025`.

Recommended R6 entities for the next generated migration:

- `human_evidence_request_templates`
- `human_evidence_request_versions`
- `human_evidence_targeting_rules`
- `human_evidence_request_instances`
- `human_evidence_interactions`
- `human_attestation_responses`
- `human_attestation_amendments`
- `response_governance_actions`
- `evidence_collection_privacy_policies`

These should be considered together with pending R1–R5 entities during the next generated migration pass.

## Acceptance gates

- response binds exact request-template version
- presented content digest is preserved
- eligibility reason is recorded
- trigger reason is recorded
- required interaction state is enforced
- expired requests cannot satisfy current controls
- amendments preserve original responses
- response-driven actions pass normal authorization
- privacy policy limits collected metadata
- data-lane rules apply to human-submitted evidence
- evidence export respects redaction and retention policy
- cross-organization isolation passes
- audit chain remains valid
