# Sentinel WikiSkill Governance — Supabase-Informed Architecture R12

## Status

Revision branch:
`feature/wiki-skill-governance-supabase-r12`

Preserved predecessor:
`archive/wiki-skill-governance-capsoftware-r11-2026-09-21`

Parent commit:
`0c2b087a851d4747b5c7f8cd5381ac48bae366bd`

R12 extends Version 30 + R1 through R11. It does not modify migration `0025`.

## R12 purpose

R12 moves governance enforcement into the data plane itself.

It adds:

1. Data-Plane Policy Registry
2. Row / Record Access Policy Engine
3. Privileged Bypass Identity Registry
4. Realtime / Event-Stream Authorization
5. Governed Object Storage Policy
6. Secrets and Key Reference Registry
7. Security Policy Linter / Advisor
8. Schema and Policy Migration Control

---

## 1. Data-Plane Policy Registry

Sentinel should not rely exclusively on application-layer authorization.

Data-plane policies should govern:

- database rows
- database views
- object storage
- event streams / subscriptions
- derived datasets
- analytics/reporting access
- evidence exports
- service identities

Policy may bind:

- organization
- matter
- subject identity
- role
- data lane
- action
- table/resource
- jurisdiction
- time window
- environment
- privileged bypass state

### Core rule

Application authorization and data-plane authorization are independent controls.

A route bug must not automatically become a data breach.

---

## 2. Row / Record Access Policy Engine

Sensitive Sentinel records should use default-deny row access.

Policy dimensions may include:

- organization_id
- matter_code
- owner
- participant
- reviewer
- role
- data classification
- lifecycle state
- data lane

Operations remain distinct:

- SELECT
- INSERT
- UPDATE
- DELETE

Example:

```
human_attestation_responses

SELECT:
  same organization
  AND authorized matter access
  AND HUMAN_EVIDENCE_READ

INSERT:
  authorized respondent/service identity

UPDATE:
  blocked after submission

DELETE:
  retention/deletion workflow only
```

### Core rule

Derived views must not silently widen access beyond underlying records.

---

## 3. Privileged Bypass Identity Registry

Some internal services may need broader-than-normal access.

Examples:

- evidence export worker
- reconciliation job
- migration runner
- security scanner
- backup/restore service
- regulator export processor

A bypass identity should bind:

- identity code
- purpose
- owner
- environment
- allowed resources
- allowed operations
- data lanes
- jurisdictions
- effective period
- approval
- audit requirement
- emergency-use flag

### Core rule

There is no anonymous or implicit superuser authority.

Privileged bypass must be named, scoped, time-bounded and auditable.

---

## 4. Realtime / Event-Stream Authorization

Live event streams need authorization just like database reads.

Possible stream types:

- incident updates
- approval events
- agent execution status
- threshold alerts
- evidence-room activity
- workflow transitions
- governance notifications

A subscription authorization should bind:

- channel/topic
- organization
- matter
- subscriber identity
- permitted event classes
- publish/subscribe capability
- data lane
- expiration
- session/authentication state

### Core rule

Subscription authorization must be checked before joining a private governance stream.

---

## 5. Governed Object Storage Policy

Files inherit governance requirements.

Examples:

- evidence exports
- session recordings
- transcripts
- attachments
- model cards
- incident files
- regulator packages
- redacted derivatives

Object policy should govern:

- bucket/container
- organization
- matter
- object prefix/path
- read/write/delete
- download-original privilege
- signed URL duration
- storage residency
- retention
- encryption
- service identity

### Core rule

Possession of an object URL does not confer access.

Object access is evaluated against current policy.

---

## 6. Secrets and Key Reference Registry

Secrets should be referenced, not embedded in ordinary governance records.

Secret classes may include:

- API_KEY
- ACCESS_TOKEN
- REFRESH_TOKEN
- SIGNING_KEY
- ENCRYPTION_KEY
- DATABASE_CREDENTIAL
- PROVIDER_SECRET
- WEBHOOK_SECRET

Registry should track:

- secret reference
- owner
- purpose
- provider/system
- environment
- rotation policy
- expiration
- last rotated
- allowed consumers
- data lane
- lifecycle state

### Core rule

Secret material is not stored in audit/event payloads.

Audit records reference a secret identifier/version, never plaintext secret content.

---

## 7. Security Policy Linter / Advisor

Sentinel should automatically flag dangerous configuration.

Potential checks:

- sensitive table without row policy
- table exposed to API without row enforcement
- view executing with elevated creator authority
- privileged identity with broad resource wildcard
- object bucket with public access
- secret-like values found in ordinary tables/logs
- long-lived signed URLs
- stale bypass grants
- realtime private channel without authorization policy
- cross-org query path
- UPDATE/DELETE without corresponding visibility policy
- missing indexes on policy-critical columns
- migration removes policy unexpectedly

Severity:

- INFO
- WARNING
- HIGH
- CRITICAL

### Core rule

Security findings are evidence records and can block deployment according to policy.

---

## 8. Schema and Policy Migration Control

Schema changes and access-policy changes must be governed together.

Flow:

```
Schema Change
  -> Generated Migration
  -> Schema Diff
  -> Policy Diff
  -> Security Lint
  -> Test Environment
  -> Access-Control Tests
  -> Migration Approval
  -> Production Apply
  -> Post-Apply Verification
```

Migration record should bind:

- migration number/id
- schema digest before/after
- policy digest before/after
- generated-by tool/version
- test result
- security-lint result
- approver
- applied environment
- applied timestamp
- verification result
- rollback plan

### Core rule

Existing migrations are immutable.

New schema work must create a new generated migration from the current schema state.

For Sentinel, `0025` remains untouched; the next legitimate DB work must become a genuine generated `0026`.

---

## Integrated R12 enforcement flow

```
Request / Subscription / Object Access
  -> Identity / Session
  -> Organization / Matter Context
  -> App Authorization
  -> Data-Plane Policy
  -> Bypass Check if applicable
  -> Row / Object / Channel Decision
  -> Access
  -> Audit / Evidence
```

## Database plan

Do not hand-edit `0025`.

Recommended R12 entities for the next generated migration:

- `data_plane_policies`
- `data_plane_policy_versions`
- `record_access_policies`
- `privileged_bypass_identities`
- `privileged_bypass_events`
- `realtime_channel_policies`
- `realtime_subscription_events`
- `object_storage_policies`
- `secret_reference_registry`
- `secret_rotation_events`
- `security_lint_rules`
- `security_lint_findings`
- `schema_policy_migration_records`
- `schema_policy_verification_events`

These should be considered together with pending R1–R11 entities during the next generated migration pass.

## Acceptance gates

- sensitive tables default deny
- cross-organization reads fail at data layer
- matter restrictions apply beneath API routes
- derived views cannot widen access
- privileged bypass identities are explicit and scoped
- bypass use is always audited
- realtime private channels require authorization
- object storage honors organization/matter/data-lane policy
- signed access is time-bounded
- secret plaintext does not enter audit/event payloads
- security lint detects missing/unsafe policies
- schema/policy migrations are generated and versioned
- migration verification checks post-apply policy state
- `0025` remains unchanged
