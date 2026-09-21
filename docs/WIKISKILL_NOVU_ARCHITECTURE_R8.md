# Sentinel WikiSkill Governance — Novu-Informed Architecture R8

## Status

Revision branch:
`feature/wiki-skill-governance-novu-r8`

Preserved predecessor:
`archive/wiki-skill-governance-lago-r7-2026-09-21`

Parent commit:
`3350054b9920c736fb8de745b1d1820a9f7b13d6`

R8 extends Version 30 + R1 + R2 + R3 + R4 + R5 + R6 + R7. It does not modify migration `0025`.

## R8 purpose

R8 governs delivery, acknowledgement and escalation of governance communications.

It adds:

1. Governed Notification Workflow Registry
2. Recipient / Topic Resolution
3. Notification Preference and Criticality Policy
4. Digest, Delay and Throttle Controls
5. Delivery Attempt and Retry Ledger
6. Escalation and Acknowledgement Registry
7. Provider Health and Failover Policy

---

## 1. Governed Notification Workflow Registry

A governance notification is a versioned workflow, not a raw message send.

Examples:

- incident alert
- approval request
- attestation request
- policy breach
- threshold alert
- failed authorization warning
- deployment approval
- review reminder
- regulator evidence notice

A workflow version should bind:

- notification workflow code
- version
- purpose
- event types
- recipient resolution
- channel sequence
- criticality
- preference policy
- digest/delay/throttle settings
- escalation path
- acknowledgement requirement
- provider policy
- template/content digest
- evidence requirements

### Core rule

Every delivery attempt binds to the exact notification-workflow version and message/template digest.

---

## 2. Recipient / Topic Resolution

Recipients may be individuals, roles, groups or governed topics.

Examples:

- named incident owner
- model owner
- compliance lead
- security operations
- Model Risk Committee
- approval quorum
- regulator liaison

Recipient resolution should capture:

- recipient reference
- organization
- role
- topic/group
- resolution source
- eligibility result
- channel endpoints available
- preference state
- critical override state
- jurisdiction
- data lane constraints

### Core rule

Sentinel must preserve why a recipient was selected.

---

## 3. Notification Preference and Criticality Policy

Ordinary notices may respect user/channel preferences.

Critical governance notifications may follow stricter policy where explicitly authorized.

Criticality levels may include:

- ROUTINE
- IMPORTANT
- HIGH
- CRITICAL

Policy can define:

- which channels are optional
- which channels are required
- whether preference opt-out applies
- whether digesting is allowed
- whether delay is allowed
- whether acknowledgement is mandatory
- maximum delivery latency

### Core rule

Critical mode cannot be inferred by the runtime.

It must be explicitly defined by approved policy.

---

## 4. Digest, Delay and Throttle Controls

Notification workflows may include first-class control steps.

### Digest

Aggregate related governance events over a defined window.

### Delay

Pause before a downstream channel or escalation step.

### Throttle

Limit frequency to reduce alert fatigue.

Each control should record:

- grouping key
- time window
- max items
- cooldown
- bypass conditions
- criticality override

### Core rule

Digest/throttle behavior must not suppress a policy-required critical notice.

---

## 5. Delivery Attempt and Retry Ledger

A notification is not complete when send is requested.

Delivery states may include:

- QUEUED
- PROVIDER_ACCEPTED
- SENT
- DELIVERED
- READ
- ACKNOWLEDGED
- FAILED
- SUPPRESSED
- EXPIRED
- CANCELED

Each attempt should capture:

- notification instance
- recipient
- channel
- provider
- provider message id
- attempt number
- attempted_at
- result
- failure category
- raw-provider-response digest/reference
- retryable
- next_retry_at
- final disposition

### Core rule

Retry attempts are idempotent and must not create duplicate semantic notifications.

---

## 6. Escalation and Acknowledgement Registry

Some governance notices require positive acknowledgement.

Examples:

```
Critical incident
  -> in-app immediately
  -> if unread after 10 minutes, email
  -> if unacknowledged after 30 minutes, SMS
  -> if unresolved after 60 minutes, compliance lead
```

Acknowledgement should bind:

- notification instance
- recipient
- acknowledgement type
- identity assurance
- timestamp
- response
- evidence/audit reference

Escalation should bind:

- source notification
- reason
- previous attempts
- escalation level
- target recipient/topic
- channel
- SLA clock
- status

### Core rule

Delivered is not equivalent to acknowledged.

Acknowledgement requirements are satisfied only by the policy-defined state.

---

## 7. Provider Health and Failover Policy

Notification providers are execution dependencies.

Provider health states may include:

- HEALTHY
- DEGRADED
- FAILING
- UNAVAILABLE
- DISABLED

Policy may define:

- preferred provider
- alternate provider
- failover threshold
- retry behavior
- jurisdiction constraints
- data-lane constraints
- channel-specific restrictions

### Core rule

Failover cannot route data to a provider that violates data-lane, jurisdiction or privacy policy.

---

## Integrated R8 flow

```
Governance Event
  -> Notification Workflow Resolution
  -> Recipient / Topic Resolution
  -> Preference / Criticality Check
  -> Channel Eligibility
  -> Digest / Delay / Throttle
  -> Delivery Attempt
  -> Retry / Provider Failover
  -> Delivery State
  -> Acknowledgement Check
  -> Escalation if required
  -> Evidence / Audit
```

## Database plan

Do not hand-edit `0025`.

Recommended R8 entities for the next generated migration:

- `governed_notification_workflows`
- `governed_notification_workflow_versions`
- `notification_recipient_rules`
- `notification_topics`
- `notification_topic_members`
- `notification_preferences`
- `notification_instances`
- `notification_delivery_attempts`
- `notification_acknowledgements`
- `notification_escalations`
- `notification_provider_registry`
- `notification_provider_health_events`

These should be considered together with pending R1–R7 entities during the next generated migration pass.

## Acceptance gates

- delivery attempt binds exact workflow/template version
- recipient selection reason is preserved
- criticality is policy-controlled
- preference bypass occurs only when policy explicitly permits
- digest/throttle cannot suppress mandatory critical notices
- retries are idempotent
- provider failures produce explicit evidence
- delivered and acknowledged states remain distinct
- escalation timers are deterministic
- provider failover respects jurisdiction and data-lane policy
- cross-organization isolation passes
- audit chain remains valid
