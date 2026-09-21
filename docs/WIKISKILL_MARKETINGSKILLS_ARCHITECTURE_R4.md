# Sentinel WikiSkill Governance — marketingskills-Informed Architecture R4

## Status

Revision branch:
`feature/wiki-skill-governance-marketingskills-r4`

Preserved predecessor:
`archive/wiki-skill-governance-last30days-r3-2026-09-21`

Parent commit:
`0c41284c9b854b9c7710205bdf6fcfc90155bf01`

R4 extends Version 30 + R1 + R2 + R3. It does not modify migration `0025`.

## R4 purpose

R4 governs how large libraries of specialist skills stay coordinated, discoverable, versioned, testable and safe when invoked repeatedly.

It adds:

1. Shared Governed Context Registry
2. Skill Dependency Graph
3. Invocation and Trigger Policy
4. Loop State and Idempotency Controls
5. Skill Eval Registry
6. Tool Capability Registry

---

## 1. Shared Governed Context Registry

Skills frequently depend on a common institutional context.

Examples:
- organization policy profile
- product/system description
- jurisdiction profile
- regulated business unit
- risk appetite
- approved terminology
- prohibited claims
- control requirements

A shared context version must be immutable once bound to an execution.

Recommended identity:

- context_code
- organization_id
- context_type
- version
- digest
- effective_from
- effective_to
- owner
- approved_by
- change_summary
- source references
- status

### Core rule

Every execution that relies on shared context must record the exact context version and digest.

Updating context must not retroactively rewrite past execution evidence.

---

## 2. Skill Dependency Graph

A skill may require or invoke other skills.

Dependency metadata should record:

- parent skill
- parent version
- dependency skill
- permitted version range
- dependency type
- required/optional
- allowed invocation mode
- scope inheritance rule
- fallback behavior

Dependency types may include:

- prerequisite
- enrichment
- validation
- approval
- evidence
- rollback
- post-processing

### Core rule

Dependency resolution cannot expand authorization.

A child skill inherits the narrower of:
- parent scope
- child approved scope
- workflow scope
- capability grant
- active policy decision

---

## 3. Invocation and Trigger Policy

Every automated skill selection must be explainable.

A governed invocation policy should capture:

- skill code/version
- trigger type
- trigger expression or matcher
- matched input/evidence
- routing priority
- exclusions
- conflict-resolution rule
- required context
- required source health
- action class ceiling
- approval requirement

Trigger classes:

- explicit user request
- workflow step
- event
- schedule
- threshold
- policy condition
- dependency call
- recovery/rollback
- human escalation

### Core rule

Sentinel must preserve why a skill was selected, not only that it ran.

---

## 4. Loop State and Idempotency Controls

Recurring agents require persistent execution state.

A governed loop should define:

- cadence
- action condition
- purpose
- skills used
- state location
- watermark
- dedupe key
- cooldown
- in-flight lock
- maximum retries
- escalation threshold
- stop conditions
- kill switch
- human gate
- output/evidence requirement

### Core rule

A recurring workflow must not perform the same material side effect twice for the same idempotency key unless explicitly reauthorized.

Examples:
- send the same regulatory notice twice
- create duplicate payment actions
- notify the same incident repeatedly
- file the same case twice
- deploy the same package repeatedly

Kill-switch state must be checked before every side-effecting cycle.

---

## 5. Skill Eval Registry

Validation should bind a skill version to a reproducible eval suite.

Recommended eval metadata:

- eval_suite_code
- organization_id
- skill_code
- skill_version
- package_hash
- suite_version
- test cases
- pass threshold
- safety-critical cases
- policy-critical cases
- environment
- model/runtime
- executed_at
- result
- failures
- reviewer
- evidence reference

### Core rule

Approval of a skill version must refer to the exact eval suite result used to validate it.

High/Critical risk skills may require mandatory safety-critical cases with zero tolerated failures.

---

## 6. Tool Capability Registry

Tools should be governed as typed capabilities, not opaque names.

Each tool record should describe:

- tool_code
- provider
- interface type
- operations
- read/write semantics
- supported action classes
- data lanes accepted
- jurisdictions
- auth method
- credential reference type
- network destinations
- side-effect behavior
- dry-run support
- reversibility
- rate/usage constraints
- lifecycle state

Tool operations should support capability-level grants such as:

```
Tool: CRM
Operation: READ_CONTACT
Action class: OBSERVE
```

versus:

```
Tool: CRM
Operation: DELETE_CONTACT
Action class: CRITICAL
```

### Core rule

Authorization is granted to an operation/capability, not merely to a tool name.

---

## Integrated R4 execution path

```
Intent / Event / Schedule
  -> Invocation Policy
  -> Shared Context Resolution
  -> Dependency Resolution
  -> Source Health / Evidence Freshness
  -> Execution Preflight
  -> Tool Capability Resolution
  -> Action Classification
  -> Policy Decision
  -> Capability Grant
  -> Human Approval if required
  -> Idempotency / Kill-Switch Check
  -> Execution
  -> Evidence / Egress / Audit
  -> Eval / Monitoring
  -> Retrospective
  -> Learning Candidate
  -> WikiSkill Proposal
```

## Database plan

Do not hand-edit `0025`.

Recommended R4 entities for the next generated migration:

- `governed_contexts`
- `governed_context_versions`
- `skill_dependencies`
- `skill_invocation_policies`
- `skill_invocation_events`
- `governed_loops`
- `governed_loop_state`
- `skill_eval_suites`
- `skill_eval_runs`
- `tool_capability_registry`
- `tool_operations`

These should be considered together with pending R1/R2/R3 entities during the next schema-generation pass.

## Acceptance gates

- execution evidence binds exact shared-context version/digest
- dependency cycles are rejected or explicitly bounded
- child dependency cannot widen authorization
- invocation reason is recorded
- trigger conflicts resolve deterministically
- recurring side effects are idempotent
- cooldown and in-flight locks are enforced
- kill switch blocks side-effecting cycles
- eval results bind exact package hash
- safety-critical eval failures block approval where policy requires
- tool operation grants are narrower than tool-level grants
- dry-run capability is surfaced where available
- cross-organization isolation passes
- audit chain remains valid
