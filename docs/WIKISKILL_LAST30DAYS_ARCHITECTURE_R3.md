# Sentinel WikiSkill Governance — last30days-Informed Architecture R3

## Status

Revision branch:
`feature/wiki-skill-governance-last30days-r3`

Preserved predecessor:
`archive/wiki-skill-governance-gstack-r2-2026-09-21`

Parent commit:
`ca007d0bbc434b60545d41118533faba037f635b`

R3 extends the existing Version 30 + R1 + R2 architecture. It does not modify migration `0025`.

## R3 purpose

R3 strengthens the evidence plane and pre-execution governance layer.

It adds:

1. Evidence Freshness
2. Evidence Source Health
3. Execution Preflight
4. Sovereign / Local Data Lanes
5. Evidence Clustering
6. Stable Versioned Machine Contracts

---

## 1. Evidence Freshness

Evidence must carry not only provenance but temporal validity.

Default freshness states:

- CURRENT
- STALE
- CONTRADICTED
- UNSUPPORTED
- UNKNOWN

A freshness decision should bind:

- evidence code
- source code
- claim or evidence subject
- observed timestamp
- verified timestamp
- freshness policy
- verification method
- verifier
- result
- contradictory evidence references
- next verification due
- audit reference

### Enforcement

- authorization may require CURRENT evidence for configured control categories;
- STALE evidence may trigger re-verification or block execution;
- CONTRADICTED evidence must trigger review before continued reliance;
- UNSUPPORTED evidence may not satisfy a mandatory control;
- freshness decisions are append-only.

---

## 2. Evidence Source Health

Configured is not equivalent to operational.

Each source should expose a health state:

- WORKING
- ENABLED_UNVERIFIED
- DEGRADED
- NOT_WORKING
- AVAILABLE_NOT_CONFIGURED
- DISABLED

Health records should capture:

- source code
- provider
- source type
- configuration state
- credential state
- last successful access
- last failed access
- failure reason
- last probe
- data recency
- reliability state
- jurisdiction
- sensitivity class
- next check due

### Enforcement

If a workflow requires a source that is NOT_WORKING or DEGRADED beyond policy tolerance, execution must pause, downgrade, reroute or escalate according to policy.

---

## 3. Execution Preflight

Before governed execution, Sentinel should produce a machine-readable plan describing intended access and effects.

Minimum preflight output:

- system
- agent
- execution context
- workflow
- skills and package hashes
- action classes
- data to read
- data to write
- tools to invoke
- external destinations
- expected egress events
- sensitive-data classes
- jurisdictional constraints
- human approvals required
- capability grants required
- policy checks required
- rollback path
- evidence requirements
- planned side effects

### Core rule

Sentinel authorizes the planned execution, not merely the agent identity.

Any material divergence from an approved preflight requires re-authorization.

---

## 4. Sovereign / Local Data Lanes

Data policy must control where information is permitted to travel.

Default lane classes:

- PUBLIC
- INTERNAL
- CONFIDENTIAL
- RESTRICTED
- LOCAL_ONLY
- SOVEREIGN_ONLY

Example:

```
LOCAL_ONLY
  allowed:
    local retrieval
    local model
    local scoring
    approved internal storage

  prohibited:
    external model provider
    external reranker
    public evidence export
    public internet destination
```

### Enforcement

- execution context must declare supported data lanes;
- every tool/model destination must declare accepted data lanes;
- a transfer is denied when destination capability does not satisfy data-lane policy;
- egress events must record lane and decision;
- evidence export must respect redaction/export rules for each lane.

---

## 5. Evidence Clustering

Multiple references may describe the same underlying event or claim.

Sentinel should group those references into an evidence cluster rather than count them as independent corroboration.

Cluster model:

- cluster code
- organization
- subject/entity
- canonical event/claim
- source evidence references
- independent-source count
- duplicate/derivative relationships
- contradiction state
- confidence
- freshness state
- created/reviewed timestamps

### Core rule

Corroboration strength is based on independent sources, not raw reference count.

---

## 6. Stable Versioned Machine Contracts

External integrations must depend on stable contracts, not raw internal database structure.

Every externally consumed Sentinel payload should include:

```
schema_version
contract_version
generated_at
organization_scope
integrity_metadata
```

Contract examples:

- evidence package
- execution preflight
- source health
- audit verification
- workflow execution
- data egress event
- skill package metadata

### Versioning policy

- breaking changes increment major contract version;
- additive backward-compatible changes increment minor version;
- internal database refactors do not force external contract changes;
- deprecated fields require a defined sunset period.

---

## R3 integrated control flow

```
Intent
  -> Evidence Source Health
  -> Evidence Freshness
  -> Evidence Clustering
  -> Execution Preflight
  -> Data Lane Check
  -> Action Classification
  -> Policy Decision
  -> Capability Grant
  -> Human Approval if required
  -> Execution
  -> Data Egress Ledger
  -> Evidence
  -> Retrospective
  -> Learning Candidate
  -> WikiSkill Governance
```

## Database plan

Do not hand-edit migration `0025`.

The next generated migration should incorporate R1/R2/R3 ledgers together from the current `0025` snapshot.

R3 recommended entities:

- `evidence_freshness_checks`
- `evidence_source_registry`
- `evidence_source_health_events`
- `execution_preflights`
- `data_lane_policies`
- `evidence_clusters`
- `evidence_cluster_members`

R1/R2 pending entities remain candidates for the same migration generation pass.

## Acceptance gates

- stale evidence policy blocks or escalates as configured
- contradiction handling tested
- source-health degradation affects execution according to policy
- preflight is generated before side-effecting actions
- material preflight drift forces re-authorization
- data-lane violations are blocked
- local/sovereign data is excluded from disallowed external destinations
- evidence clustering distinguishes duplicate from independent evidence
- stable machine contracts are versioned and regression-tested
- evidence export honors lane restrictions
- cross-organization isolation passes
- audit integrity remains valid
