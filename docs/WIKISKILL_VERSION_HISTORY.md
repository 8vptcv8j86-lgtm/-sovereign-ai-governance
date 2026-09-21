# WikiSkill Version and Revision History

## 2026-09-21 — Preserved Version 30 implementation

Source branch:
`feature/wiki-skill-governance-v30`

Preserved branch:
`archive/wiki-skill-governance-v30-2026-09-21`

Preserved commit:
`8a5d7fc0959a97d8acd2093d665a67b010ec9aa6`

State preserved before QM-informed revision work.

This state contains the existing Version 30 WikiSkill implementation, including:

- migration `0025_perpetual_avengers.sql`
- Drizzle 0025 snapshot/journal state
- WikiSkill API route
- organization-scoped ledgers
- parent-agent scope controls
- validation and approval gates
- atomic audit writes
- deployment, suspension, rollback and retirement controls
- evidence export
- WikiSkill tests
- operator UI integration

## 2026-09-21 — QM-informed R1

Working branch:
`feature/wiki-skill-governance-qm-r1`

Preserved branch:
`archive/wiki-skill-governance-qm-r1-2026-09-21`

Parent:
`8a5d7fc0959a97d8acd2093d665a67b010ec9aa6`

R1 final commit:
`d9b87f18a95f371deb5e4bcf966815932422ae45`

Purpose:

Extend the architecture without rewriting the Version 30 core.

R1 adds the design contract for:

- portable governed skill packages
- package hashing
- skill grants
- provider-neutral execution contexts
- execution evidence
- incident linkage
- strict runtime/authorization separation
- revision preservation rules

Database changes are intentionally deferred until a new Drizzle migration can be generated from the current 0025 snapshot. No existing migration is edited or replaced.

## 2026-09-21 — gstack-informed R2

Working branch:
`feature/wiki-skill-governance-gstack-r2`

Parent:
`d9b87f18a95f371deb5e4bcf966815932422ae45`

Purpose:

Extend R1 with controls for multi-skill institutional workflows and governed learning.

R2 adds:

- Governed Workflows
- workflow versioning and ordered governed steps
- Retrospective and Learning Records
- Action Classification
- AI Data Egress Ledger
- workflow templates
- explicit rule that learning cannot self-promote into executable behavior
- explicit rule that workflow approval cannot widen child skill or agent authority
- design for tamper-evident outbound data-transfer evidence

Database implementation remains append-only and must begin with the next generated migration after 0025.

## 2026-09-21 — last30days-informed R3

Working branch:
`feature/wiki-skill-governance-last30days-r3`

Preserved predecessor:
`archive/wiki-skill-governance-gstack-r2-2026-09-21`

Parent:
`ca007d0bbc434b60545d41118533faba037f635b`

Purpose:

Strengthen the Sentinel evidence plane and pre-execution control model.

R3 adds:

- Evidence Freshness
- Evidence Source Health
- Execution Preflight
- Sovereign / Local Data Lanes
- Evidence Clustering
- Stable Versioned Machine Contracts

Core rules introduced:

- stale or contradicted evidence can no longer silently satisfy time-sensitive controls
- configured evidence sources are distinguished from verified-working sources
- side-effecting execution can be bound to an approved preflight plan digest
- local/sovereign data lanes can prohibit external model/tool processing
- corroboration is based on independent evidence, not duplicate reference count
- external integrations consume stable versioned contracts instead of raw database structure

Database implementation remains append-only and must begin with the next generated migration after `0025`.


## 2026-09-21 — marketingskills-informed R4

Working branch:
`feature/wiki-skill-governance-marketingskills-r4`

Preserved predecessor:
`archive/wiki-skill-governance-last30days-r3-2026-09-21`

Parent:
`0c41284c9b854b9c7710205bdf6fcfc90155bf01`

Purpose:

Govern coordination across large specialist-skill libraries and recurring autonomous workflows.

R4 adds:

- Shared Governed Context Registry
- Skill Dependency Graph
- Invocation / Trigger Policy
- Loop State and Idempotency Controls
- Kill-Switch requirements for recurring side-effecting loops
- Skill Eval Registry
- Tool Capability Registry
- operation-level tool authorization
- reusable governed loop and eval templates

Core rules introduced:

- executions bind the exact version/digest of shared context used
- skill dependencies cannot widen authority
- Sentinel records why a skill was invoked
- recurring side effects require idempotency controls
- cooldowns and in-flight locks prevent duplicate or overlapping action
- kill switches are checked before side-effecting loop cycles
- skill approval can bind to exact eval suite results and package hashes
- tools are governed at operation/capability level rather than by tool name alone

Database implementation remains append-only and must begin with the next generated migration after `0025`.


## 2026-09-21 — LangGenius-informed R5

Working branch:
`feature/wiki-skill-governance-langgenius-r5`

Preserved predecessor:
`archive/wiki-skill-governance-marketingskills-r4-2026-09-21`

Parent:
`fd2446e615a3e7eeccc2fc66ab1f879a5a14b14c`

Purpose:

Extend Sentinel governance from configured agents/workflows into live runtime state and execution boundaries.

R5 adds:

- Execution Checkpoint and Resume Registry
- Node and Edge Governance Policy
- Sandbox Policy Profiles
- Governed Extension / Plugin Registry
- Trace Correlation Registry
- Governed Runtime State Registry
- reusable sandbox profile template

Core rules introduced:

- resuming a paused execution is a new authorization event
- revoked grants or suspended skills/workflows block resume
- workflow transitions are governed and explainable
- exact sandbox profile version/digest is bound to execution evidence
- running extension/plugin digest must match the approved artifact digest
- governance evidence can correlate to trace/span identifiers without depending on the observability provider
- runtime state is scoped, classified and retained explicitly
- runtime state cannot silently become persistent institutional memory

Database implementation remains append-only and must begin with the next generated migration after `0025`.


## 2026-09-21 — Formbricks-informed R6

Working branch:
`feature/wiki-skill-governance-formbricks-r6`

Preserved predecessor:
`archive/wiki-skill-governance-langgenius-r5-2026-09-21`

Parent:
`d096b5911025c5ab2edfc029ac2efe9ca67502c4`

Purpose:

Add governed human evidence capture to the Sentinel control and evidence chain.

R6 adds:

- Governed Human Evidence Requests
- Eligibility and Targeting Rules
- Human Response / Attestation Ledger
- Interaction State Tracking
- Response-Driven Governance Actions
- Evidence Collection Privacy Policy
- reusable human-attestation template

Core rules introduced:

- responses bind the exact request-template version and presented-content digest
- eligibility and trigger decisions are separately recorded
- delivery/seen/started/completed/declined/expired states are distinct
- original attestations are immutable; corrections are amendments
- human responses may trigger governance actions but do not bypass authorization
- evidence collection is purpose-bound and privacy-policy controlled
- identity and device/network metadata are collected only when policy permits

Database implementation remains append-only and must begin with the next generated migration after `0025`.


## 2026-09-21 — Lago-informed R7

Working branch:
`feature/wiki-skill-governance-lago-r7`

Preserved predecessor:
`archive/wiki-skill-governance-formbricks-r6-2026-09-21`

Parent:
`a2c8675d3a339825462b7017ac4f57b0a934646e`

Purpose:

Add metering-grade accountability, entitlement consumption, threshold enforcement, atomic governance transitions and independent reconciliation.

R7 adds:

- Governed Usage Event Ledger
- Agent / Skill Entitlement Registry
- Quota and Allowance Policies
- Threshold Alert Engine
- Atomic Governance Batch Rules
- Reconciliation and Variance Ledger
- reusable governed metering template

Core rules introduced:

- usage events are idempotent by transaction identity
- duplicate events cannot double-count, duplicate alerts or duplicate enforcement
- permissions and entitlements are evaluated separately
- quotas and allowances can constrain governed execution
- threshold crossings are themselves idempotent evidence events
- configured governance transitions commit atomically or not at all
- policy-critical results can be independently recomputed
- reconciliation mismatch creates durable variance evidence and remediation

Database implementation remains append-only and must begin with the next generated migration after `0025`.


## 2026-09-21 — Novu-informed R8

Working branch:
`feature/wiki-skill-governance-novu-r8`

Preserved predecessor:
`archive/wiki-skill-governance-lago-r7-2026-09-21`

Parent:
`3350054b9920c736fb8de745b1d1820a9f7b13d6`

Purpose:

Add policy-governed notification delivery, acknowledgement and escalation evidence.

R8 adds:

- Governed Notification Workflow Registry
- Recipient / Topic Resolution
- Notification Preference and Criticality Policy
- Digest, Delay and Throttle Controls
- Delivery Attempt and Retry Ledger
- Escalation and Acknowledgement Registry
- Provider Health and Failover Policy
- reusable governed notification template

Core rules introduced:

- notification instances bind exact workflow and content/template versions
- recipient selection reason is preserved
- criticality is policy-controlled and cannot be elevated by runtime
- preference overrides require explicit policy basis
- retries are idempotent
- delivery and acknowledgement remain distinct states
- escalation is evidence-driven and time-bound
- provider failover must respect jurisdiction, privacy and data-lane policy

Database implementation remains append-only and must begin with the next generated migration after `0025`.


## 2026-09-21 — Papermark-informed R9

Working branch:
`feature/wiki-skill-governance-papermark-r9`

Preserved predecessor:
`archive/wiki-skill-governance-novu-r8-2026-09-21`

Parent:
`1f1f5c70017e1b9d6cffc6d056b45a12493dc850`

Purpose:

Add controlled evidence disclosure, examination rooms, scoped disclosure permissions, evidence-request tasks, integrity sealing and governed redaction.

R9 adds:

- Governed Evidence Room Registry
- Evidence Disclosure Access Grants
- Evidence Package / Document Version Registry
- Disclosure Activity Ledger
- Evidence Request & Submission Tasks
- Evidence Room Freeze & Integrity Seal
- Governed Redaction Pipeline
- reusable evidence-room template

Core rules introduced:

- internal evidence possession and external evidence disclosure are separate control planes
- evidence-room creation does not imply source-record access
- disclosure permissions distinguish view, derivative/redacted download and original download
- every disclosure binds exact artifact version and digest
- redaction creates a new derivative version rather than overwriting source evidence
- room activity distinguishes invitation, view, download and blocked access
- submitted evidence is not accepted evidence until separately reviewed
- a frozen evidence room produces a verifiable manifest/integrity seal
- post-freeze changes require a supplemental disclosure or new room version

Database implementation remains append-only and must begin with the next generated migration after `0025`.


## 2026-09-21 — Claude for Legal-informed R10

Working branch:
`feature/wiki-skill-governance-claude-legal-r10`

Preserved predecessor:
`archive/wiki-skill-governance-papermark-r9-2026-09-21`

Parent:
`d407e64da598d6ebba7dc6a7623501659a70ca28`

Purpose:

Add professional-reliance governance so generated analysis, verified information, professional review and authorized external reliance remain distinct states.

R10 adds:

- Governed Matter / Case Workspace Registry
- Premise and Assertion Verification Ledger
- Source Provenance Classification
- Reliance Classification Registry
- Professional Review and Verification Ledger
- Destination / Confidentiality Release Gate
- Authoritative Source Substitution Policy
- Verification Memory
- reusable professional-reliance template

Core rules introduced:

- matter-local context is default-deny outside the active matter
- policy-critical premises cannot silently become established fact
- provenance labels must reflect actual retrieval
- model knowledge cannot masquerade as authoritative retrieval
- generation alone never confers professional reliance
- review binds the exact artifact version reviewed
- destination and confidentiality are checked before release
- source-quality downgrade is an explicit policy event
- prior verification can be reused only within a defined freshness window

Database implementation remains append-only and must begin with the next generated migration after `0025`.


## 2026-09-21 — CapSoftware-informed R11

Working branch:
`feature/wiki-skill-governance-capsoftware-r11`

Preserved predecessor:
`archive/wiki-skill-governance-claude-legal-r10-2026-09-21`

Parent:
`018e1e587ea7132a4bbe87cf788c76081134a123`

Purpose:

Add governed session capture and replayable execution evidence for selected high-risk workflows while preventing capture from becoming a default surveillance mechanism.

R11 adds:

- Governed Session Capture Registry
- Capture Consent and Scope Policy
- Session Artifact Manifest
- Timestamped Evidence Anchor Registry
- Capture Storage and Residency Profiles
- Derived Media / Transcript Provenance
- Capture Integrity, Recovery and Completion Ledger
- reusable governed-session-capture template

Core rules introduced:

- capture requires explicit purpose, policy and authorization
- capture, storage, processing, upload, sharing and deletion are separate operations
- capture scope is minimum-necessary
- source media and AI-derived artifacts remain distinct
- every artifact/version carries an integrity digest
- timestamp anchors bind exact media version and time range
- storage residency and processing location are independently governed
- partial/recovered sessions cannot masquerade as complete
- upload/disclosure must pass existing evidence-room and destination-release gates
- retention and deletion produce auditable evidence
- continuous monitoring is not authorized by default

Database implementation remains append-only and must begin with the next generated migration after `0025`.


## 2026-09-21 — Supabase-informed R12

Working branch:
`feature/wiki-skill-governance-supabase-r12`

Preserved predecessor:
`archive/wiki-skill-governance-capsoftware-r11-2026-09-21`

Parent:
`0c2b087a851d4747b5c7f8cd5381ac48bae366bd`

Purpose:

Move Sentinel governance enforcement into the data plane so database rows, object storage, realtime channels, secrets and migrations independently enforce institutional boundaries.

R12 adds:

- Data-Plane Policy Registry
- Row / Record Access Policy Engine
- Privileged Bypass Identity Registry
- Realtime / Event-Stream Authorization
- Governed Object Storage Policy
- Secrets and Key Reference Registry
- Security Policy Linter / Advisor
- Schema and Policy Migration Control
- reusable data-plane policy template

Core rules introduced:

- sensitive resources default deny
- application authorization cannot override data-plane denial
- derived views/reporting cannot widen underlying authority
- privileged bypass identities are explicit, scoped, time-bounded and audited
- private realtime channels require authorization
- object URLs and signed links do not bypass governance policy
- secret plaintext never enters audit/event payloads
- security lint findings can block deployment
- schema and policy changes are reviewed together
- existing migrations are immutable
- `0025` remains untouched and next legitimate generated migration is `0026`

Database implementation remains append-only and must begin with the next genuine generated migration after `0025`.
