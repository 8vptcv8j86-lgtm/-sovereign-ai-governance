# Sentinel WikiSkill Governance — LangGenius-Informed Architecture R5

## Status

Revision branch:
`feature/wiki-skill-governance-langgenius-r5`

Preserved predecessor:
`archive/wiki-skill-governance-marketingskills-r4-2026-09-21`

Parent commit:
`fd2446e615a3e7eeccc2fc66ab1f879a5a14b14c`

R5 extends Version 30 + R1 + R2 + R3 + R4. It does not modify migration `0025`.

## R5 purpose

R5 governs live execution state and runtime boundaries.

It adds:

1. Execution Checkpoint and Resume Registry
2. Node and Edge Governance Policy
3. Sandbox Policy Profiles
4. Governed Extension / Plugin Registry
5. Trace Correlation Registry
6. Governed Runtime State Registry

---

## 1. Execution Checkpoint and Resume Registry

A workflow may pause while waiting for:

- human input
- policy approval
- external system response
- scheduled continuation
- retry window
- recovery action

Checkpoint states may include:

- RUNNING
- WAITING_FOR_HUMAN
- WAITING_FOR_POLICY
- WAITING_FOR_TOOL
- WAITING_FOR_EVENT
- SUSPENDED
- RESUMABLE
- TERMINATED
- COMPLETED

A checkpoint should bind:

- workflow execution
- workflow version/digest
- current node
- completed nodes
- state digest
- variable pool digest
- agent
- skill/package versions
- context versions
- execution context
- sandbox profile
- authorization references
- pending approvals
- pending tool call
- trace/span identifiers
- created_at
- resume_after / expiry

### Core rule

Resumption is a new authorization event.

Before continuation, Sentinel must re-evaluate:

- agent status
- skill status
- workflow status
- capability grants
- policy decisions
- source health/freshness if required
- human approval validity
- data-lane constraints
- kill switches
- checkpoint integrity

---

## 2. Node and Edge Governance Policy

Workflows are governed at graph granularity.

### Node policy

Each executable node may define:

- node code/type
- skill
- agent
- action class
- required capability
- data read/write scope
- approved tools
- approved models
- human gate
- sandbox profile
- evidence requirement
- timeout/retry policy

### Edge policy

Each transition may define:

- source node
- target node
- condition
- condition digest
- policy reference
- authorization requirement
- evidence requirement
- maximum traversal count
- fallback transition

### Core rule

Sentinel must preserve why an execution moved from one node to another.

A transition that would exceed approved workflow scope is denied.

---

## 3. Sandbox Policy Profiles

Execution containment must be represented as a versioned governed object.

A sandbox profile may include:

- profile code/version
- runtime type
- CPU/memory limits
- execution timeout
- filesystem mode
- mount policy
- process/syscall restrictions
- network policy
- egress allowlist
- secrets policy
- tool installation policy
- package installation policy
- data lanes supported
- jurisdiction
- logging/evidence settings

### Core rule

"Sandboxed" is not sufficient evidence.

Every governed execution must bind to an exact sandbox policy profile version when sandbox controls are required.

---

## 4. Governed Extension / Plugin Registry

Third-party and internal extensions are part of the execution supply chain.

Extension types include:

- plugin
- MCP server
- connector
- tool adapter
- model provider adapter
- agent runtime
- execution driver
- workflow extension
- skill package

Recommended identity:

- extension code
- type
- publisher
- source
- version
- package digest
- signature / attestation
- permissions
- network destinations
- data lanes
- risk tier
- approval status
- lifecycle status

### Core rule

The running artifact digest must match the approved artifact digest.

Version name alone is not sufficient.

---

## 5. Trace Correlation Registry

Sentinel should correlate governance evidence with operational telemetry without becoming the telemetry backend.

Recommended references:

- execution code
- workflow execution
- node execution
- trace provider
- trace id
- span id
- parent span id
- authorization reference
- audit event
- tool call
- model call
- external observability URL/reference
- observed_at

### Core rule

Trace correlation supplements, but does not replace, Sentinel audit evidence.

---

## 6. Governed Runtime State Registry

Runtime variables and memory require explicit ownership and retention policy.

State scopes:

- EPHEMERAL
- NODE_SCOPED
- WORKFLOW_SCOPED
- SESSION_SCOPED
- AGENT_SCOPED
- ORGANIZATION_SCOPED
- PERSISTENT

Each state item may bind:

- state code
- execution
- scope
- owner
- writer
- authorized readers
- value digest
- data classification
- data lane
- source
- retention rule
- created_at
- expires_at
- superseded_by

### Core rule

Runtime state cannot silently become durable institutional memory.

Promotion from ephemeral/runtime state into persistent context, wiki knowledge, or skill knowledge must pass the relevant governance flow.

---

## Integrated R5 runtime flow

```
Intent / Trigger
  -> Invocation Policy
  -> Shared Context
  -> Workflow Graph
  -> Node Policy
  -> Edge Policy
  -> Preflight
  -> Sandbox Profile
  -> Extension / Tool Resolution
  -> Authorization
  -> Execution
  -> Runtime State
  -> Checkpoint / Pause
  -> Resume Reauthorization
  -> Trace Correlation
  -> Evidence / Audit / Egress
  -> Retrospective
  -> WikiSkill Learning
```

## Database plan

Do not hand-edit `0025`.

Recommended R5 entities for the next generated migration:

- `execution_checkpoints`
- `execution_resume_events`
- `workflow_node_policies`
- `workflow_edge_policies`
- `sandbox_policy_profiles`
- `sandbox_profile_versions`
- `governed_extensions`
- `governed_extension_versions`
- `trace_correlations`
- `runtime_state_items`

These should be considered together with pending R1–R4 schema entities during the next generated migration pass.

## Acceptance gates

- checkpoint integrity digest validated before resume
- resume always rechecks current authorization
- revoked grants block resumed execution
- suspended skills/workflows block resumed execution
- node action classes enforced
- edge conditions and transitions recorded
- traversal loops bounded
- sandbox profile version bound to execution evidence
- running extension digest matches approved digest
- unapproved extension blocked
- trace/span correlation recorded when telemetry exists
- runtime state respects data lanes and retention
- runtime state cannot become persistent knowledge without governed promotion
- cross-organization isolation passes
- audit chain remains valid
