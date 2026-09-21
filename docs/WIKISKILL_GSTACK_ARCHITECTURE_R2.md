# Sentinel WikiSkill Governance — gstack-Informed Architecture R2

## Status

Revision branch:
`feature/wiki-skill-governance-gstack-r2`

Preserved predecessor:
`archive/wiki-skill-governance-qm-r1-2026-09-21`

Parent commit:
`d9b87f18a95f371deb5e4bcf966815932422ae45`

R2 extends the existing Version 30 + R1 architecture. It does not replace or renumber migration `0025`.

## R2 additions

R2 adds four institutional control models:

1. Governed Workflows
2. Retrospective and Learning Records
3. Action Classification
4. AI Data Egress Ledger

These are designed to make multi-skill, multi-agent business processes governable end-to-end.

---

## 1. Governed Workflows

A Governed Workflow is an approved orchestration of skills, agents, approval gates, tools and evidence requirements.

Example:

```
Vendor Risk Assessment
  1. vendor-research v2.1
  2. data-classification v1.7
  3. jurisdiction-check v3.0
  4. model-risk-review v2.4
  5. human-approval-gate
  6. evidence-export v1.2
```

Every workflow version must bind:

- workflow code
- version
- workflow digest
- organization
- owner
- risk tier
- ordered steps
- step skill code/version/package hash
- agent or execution context
- approval requirements
- allowed tool/data/network scope
- failure policy
- rollback path
- evidence requirements

### Core rule

Workflow approval does not override skill, agent, tool, data, network or policy restrictions.

Every step must independently satisfy Sentinel authorization.

### Workflow lifecycle

`draft -> proposed -> validating -> ready_for_approval -> approved -> active -> suspended -> retired`

---

## 2. Retrospective and Learning Records

Execution outcomes may generate learning candidates, but learning must not directly mutate production behavior.

Required lifecycle:

```
EXECUTION
  -> OUTCOME
  -> RETROSPECTIVE
  -> LESSON
  -> KNOWLEDGE CANDIDATE
  -> WIKI KNOWLEDGE
  -> SKILL CHANGE PROPOSAL
  -> VALIDATION
  -> APPROVAL
  -> NEW VERSION
```

A retrospective record should capture:

- workflow/skill/agent/execution references
- outcome
- success/failure factors
- unexpected behavior
- human overrides
- policy events
- tool errors
- data issues
- incident references
- proposed lesson
- confidence
- reviewer
- whether the lesson is promotable

### Core rule

A learning record has no execution authority.

Only an approved, validated, versioned skill package can change executable behavior.

---

## 3. Action Classification

Sentinel classifies actions by operational effect and authorization burden.

### Default classes

#### OBSERVE
Read-only acquisition of authorized information.

Examples:
- read a record
- inspect logs
- retrieve a document
- run a non-mutating query

Default control:
- in-scope authorization
- audit evidence

#### ANALYZE
Transform or assess information without external side effects.

Examples:
- risk scoring
- classification
- summarization
- recommendation generation

Default control:
- policy check
- audit evidence

#### PREPARE
Create an artifact or proposed action that is not yet externally committed.

Examples:
- draft an email
- stage a transaction
- prepare a filing
- prepare configuration changes

Default control:
- policy check
- approval where required
- audit evidence

#### EXECUTE
Create an external or persistent side effect.

Examples:
- send a message
- modify a production record
- invoke an external API that changes state
- deploy a skill

Default control:
- explicit capability authorization
- execution evidence

#### CRITICAL
High-impact or regulated action.

Examples:
- payment movement
- deletion of regulated records
- regulator filing
- privileged infrastructure change
- employment or eligibility determination where applicable

Default control:
- enhanced policy evaluation
- human approval
- separation of duties where required
- execution evidence

#### IRREVERSIBLE
Action whose effects cannot reasonably be reversed or whose failure has severe consequence.

Default control:
- explicit human approval
- strongest available authentication
- dual control where required
- pre-execution evidence checkpoint
- post-execution verification

### Core rule

The runtime may classify or propose a class, but Sentinel is the authority for the final class and authorization requirement.

---

## 4. AI Data Egress Ledger

The Data Egress Ledger records governed transfers of data from an institutional boundary to another system, model provider, agent runtime, API, browser session, external party or network destination.

Minimum record:

```
egress_code
organization_id
system_code
agent_code
execution_code
workflow_code
workflow_version
skill_code
skill_version
package_hash
destination
destination_class
provider
data_classification
payload_digest
purpose
authorization_reference
policy_decision_reference
human_approval_reference
jurisdiction
retention_rule
outcome
created_at
```

### Hash-chain requirement

Egress records should participate in an integrity mechanism that permits tamper detection.

The implementation may:
- join the existing Sentinel Version 2 audit chain; or
- maintain a dedicated egress chain whose head is anchored into the main audit chain.

The design must not create an unaudited parallel evidence system.

### Core rule

Payload content does not need to be stored when doing so would create unnecessary sensitive-data retention. Store a cryptographic digest plus governed evidence references where appropriate.

---

## Cross-control interaction

```
Intent
  -> Governed Workflow
  -> Step
  -> Action Classification
  -> Policy Decision
  -> Capability Grant
  -> Human Approval if required
  -> Execution Context
  -> Skill Package
  -> Execution
  -> Data Egress Ledger if applicable
  -> Evidence
  -> Retrospective
  -> Learning Candidate
  -> WikiSkill Governance
```

## Provider neutrality

These controls apply regardless of runtime:

- OpenAI
- Codex
- Claude
- Gemini
- QM
- LangGraph
- CrewAI
- browser agents
- institution-specific agents
- future runtimes

## Database plan

Do not hand-edit `0025`.

The next generated migration should introduce the R2 ledgers after the current `0025` snapshot.

Recommended entities:

- `governed_workflows`
- `governed_workflow_versions`
- `governed_workflow_steps`
- `workflow_executions`
- `workflow_step_executions`
- `learning_retrospectives`
- `learning_candidates`
- `action_classifications`
- `data_egress_events`

Potential extension entities from R1:

- `skill_grants`
- `execution_contexts`
- `skill_execution_events`
- `skill_incidents`

All new ledgers must be organization-scoped and integrated with Sentinel authorization and atomic audit writes.

## Acceptance gates

Before production promotion:

- workflow step ordering and version binding tested
- disabled/suspended skill blocks workflow execution
- workflow cannot widen child skill scope
- action classification drives authorization requirement
- execute/critical/irreversible controls tested
- learning cannot self-promote into executable skill
- egress record generated for governed outbound transfers
- egress digest integrity tested
- cross-organization isolation tested
- audit chain remains valid
- evidence export contains R2 records
- rollback behavior tested
- regression suite passes
