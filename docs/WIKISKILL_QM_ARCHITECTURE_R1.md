# Sentinel WikiSkill Governance — QM-Informed Architecture R1

## Status

Revision branch: `feature/wiki-skill-governance-qm-r1`

Preserved predecessor:
`archive/wiki-skill-governance-v30-2026-09-21`

The preserved predecessor is immutable reference material for rollback and later comparison. This revision does not replace the existing Version 30 WikiSkill governance implementation.

## Existing Version 30 foundation

Migration `0025_perpetual_avengers.sql` already establishes the core institutional WikiSkill governance model:

- skill registry
- immutable skill versions
- provenance
- change proposals
- validation
- independent approvals
- deployments
- performance review
- rollback
- atomic audit enforcement
- evidence export
- parent-agent scope enforcement

The existing implementation remains authoritative.

## R1 architectural additions

This revision adopts useful patterns from YC Software's QM architecture without making QM a Sentinel runtime dependency.

### 1. Portable governed skill package

Every deployable skill should be representable as a portable package:

```
skill/
  SKILL.md
  manifest.json
  provenance.json
  policies/
  tests/
  evidence/
```

The package is an artifact. Sentinel remains the authority that validates, approves, grants, deploys, suspends, rolls back and retires it.

### 2. Package identity

A governed deployment must bind:

- `skill_code`
- `version`
- canonical package SHA-256
- validation reference
- approval reference
- deployment reference
- execution context reference

The package hash identifies the exact executable artifact, not merely a display version.

### 3. Execution contexts

Sentinel should model execution independently from any single provider or harness.

Execution context fields should include:

- organization
- system
- agent
- model provider
- model name/version
- agent harness/framework
- environment
- permitted tools
- permitted data
- permitted network destinations
- credential references
- jurisdiction
- active/suspended/retired status

Examples of valid harnesses include OpenAI Agents, Codex, Claude Code, Gemini tooling, LangGraph, CrewAI, QM and institution-specific runtimes.

### 4. Authorization boundary

Agents and sandboxes are not trusted authorization authorities.

Required control path:

```
Agent request
  -> Sentinel policy / authorization
  -> approved capability
  -> execution context
  -> tool / model / API
  -> evidence + audit
```

No runtime may self-authorize a scope expansion.

### 5. Grants

Skill ownership and skill permission are separate.

Sentinel grants should support:

- organization-wide grants
- business-unit grants
- agent-specific grants
- execution-context grants
- read/use/deploy/admin permission levels
- effective and expiry timestamps
- revocation
- approver identity
- audit linkage

### 6. Execution evidence

Each governed execution should bind the exact skill package and execution context.

Minimum evidence:

- execution code
- skill code + version
- package hash
- agent + system
- execution context
- authorization reference
- tool calls or tool-call evidence references
- input/output digests where appropriate
- outcome
- human override/escalation
- policy events
- incident linkage
- timestamps

### 7. Incident linkage

Skill-related incidents must be first-class governance records, not only free-text performance notes.

An incident should be linkable to:

- skill/version/package hash
- deployment
- execution(s)
- agent
- authorization decision
- policy breach
- suspension
- rollback
- corrective action
- evidence export

### 8. Provider neutrality

Sentinel must remain provider- and framework-neutral.

The governance model applies to any model, agent harness, application or institutional runtime. Provider identity is evidence and routing metadata, not the product boundary.

## Lifecycle

```
RAW TRACE
  -> KNOWLEDGE EXTRACTION
  -> WIKI KNOWLEDGE
  -> SKILL PROPOSAL
  -> VALIDATION
  -> RISK CLASSIFICATION
  -> INDEPENDENT APPROVAL
  -> HASHED/SIGNED PACKAGE
  -> GRANT
  -> DEPLOYMENT
  -> AUTHORIZED EXECUTION
  -> MONITORING
  -> EVIDENCE
  -> IMPROVE / SUSPEND / ROLLBACK / RETIRE
```

## Migration discipline

Do not modify or renumber `0025`.

Any database expansion for package artifacts, grants, execution contexts, execution evidence or incidents must be generated as the next migration from the current `0025` schema snapshot and must include the corresponding Drizzle snapshot and journal entry.

This protects migration lineage and preserves the Version 30 evidence chain.

## Rollback discipline

Before each material WikiSkill revision:

1. preserve the current branch head under `archive/`;
2. create a new feature/revision branch;
3. record predecessor commit and branch in the revision history;
4. never force-push preserved archive branches;
5. keep schema migrations append-only;
6. compare revisions before promotion.

## Design boundary

Sentinel governs agent environments such as QM; it does not need to become one.

QM-style runtime patterns may inform:
- scoped workspaces
- portable skills
- tool isolation
- harness independence

Sentinel remains responsible for:
- authorization
- institutional approval
- audit integrity
- evidence
- policy enforcement
- accountability
- rollback
- regulatory proof
