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
