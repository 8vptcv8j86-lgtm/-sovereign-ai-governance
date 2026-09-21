# Sentinel WikiSkill Governance — Claude for Legal-Informed Architecture R10

## Status

Revision branch:
`feature/wiki-skill-governance-claude-legal-r10`

Preserved predecessor:
`archive/wiki-skill-governance-papermark-r9-2026-09-21`

Parent commit:
`d407e64da598d6ebba7dc6a7623501659a70ca28`

R10 extends Version 30 + R1 through R9. It does not modify migration `0025`.

## R10 purpose

R10 governs professional reliance on AI-assisted analysis and work product.

It adds:

1. Governed Matter / Case Workspace Registry
2. Premise and Assertion Verification Ledger
3. Source Provenance Classification
4. Reliance Classification Registry
5. Professional Review and Verification Ledger
6. Destination / Confidentiality Release Gate
7. Authoritative Source Substitution Policy

---

## 1. Governed Matter / Case Workspace Registry

A matter workspace creates an explicit scope boundary for investigations, regulatory reviews, litigation matters, audits, incidents, vendor reviews and other case-specific work.

Recommended identity:

- matter_code
- organization_id
- matter_type
- name
- purpose
- owner
- jurisdiction
- confidentiality_class
- privilege_claim
- data_lane
- lifecycle_status
- opened_at
- closed_at

Matter membership may bind:

- humans
- agents
- systems
- evidence rooms
- workflows
- skills
- source collections

### Core rule

Matter-local context is default-deny outside that matter.

Cross-matter retrieval requires an explicit policy decision and audit evidence.

---

## 2. Premise and Assertion Verification Ledger

Important assertions should be independently tracked before downstream reliance.

Assertion examples:

- statute applies
- regulation effective date
- model is deployed in a jurisdiction
- vendor uses customer data for training
- policy version is current
- incident affected a regulated population
- contractual clause is present
- approval remains active

Verification states:

- ASSERTED
- VERIFIED
- CONTRADICTED
- UNVERIFIED
- PARTIALLY_VERIFIED
- NOT_APPLICABLE

Recommended fields:

- assertion_code
- organization_id
- matter_code
- subject
- assertion_text_digest
- assertion_type
- asserted_by
- source_reference
- verification_status
- verification_method
- verification_source
- verified_by
- verified_at
- freshness_policy
- expires_at

### Core rule

Policy-critical workflows may not treat an unverified premise as established fact.

---

## 3. Source Provenance Classification

Every material claim should be classifiable by actual provenance.

Suggested source classes:

- PRIMARY_SOURCE_VERIFIED
- OFFICIAL_SOURCE_VERIFIED
- CONNECTED_ENTERPRISE_SOURCE
- USER_PROVIDED
- THIRD_PARTY_DATABASE
- WEB_SEARCH_VERIFY
- MODEL_KNOWLEDGE_VERIFY
- UNKNOWN

A source record should bind:

- source class
- source identity
- retrieval method
- retrieval timestamp
- content digest
- jurisdiction
- freshness status
- authoritative status
- citation/reference

### Core rule

Source provenance describes what actually occurred.

The system cannot label model knowledge as retrieved authority.

---

## 4. Reliance Classification Registry

AI output and authorized professional reliance are distinct states.

Suggested reliance states:

- DRAFT
- ANALYSIS
- UNVERIFIED
- VERIFIED
- PROFESSIONALLY_REVIEWED
- APPROVED_FOR_INTERNAL_RELIANCE
- APPROVED_FOR_EXTERNAL_USE
- SUPERSEDED
- WITHDRAWN

A reliance record should bind:

- output/artifact version
- matter
- sources
- verified premises
- unresolved qualifications
- jurisdiction
- reviewer requirements
- release scope
- approved destination classes
- expiration/review date

### Core rule

Generation does not confer reliance status.

Reliance elevation requires the evidence and reviewer requirements defined by policy.

---

## 5. Professional Review and Verification Ledger

For regulated or expert-domain work, Sentinel should record the professional review itself.

Recommended fields:

- professional_review_code
- organization_id
- matter_code
- artifact_version
- reviewer_reference
- reviewer_role
- reviewer_authority
- review_type
- source_checks_completed
- premises_verified
- unresolved_issues
- qualifications
- disposition
- reliance_state_granted
- permitted_use
- reviewed_at
- audit_reference

Review dispositions:

- APPROVED
- APPROVED_WITH_QUALIFICATIONS
- RETURN_FOR_REVISION
- REJECTED
- ESCALATED

### Core rule

A professional review is attributable to the reviewer and exact artifact version reviewed.

Later edits require renewed review when material.

---

## 6. Destination / Confidentiality Release Gate

Confidentiality labels alone are not controls.

Before an artifact leaves a governed workspace, Sentinel should evaluate:

- destination
- recipient
- recipient authorization
- matter scope
- confidentiality class
- privilege/work-product treatment
- reliance state
- disclosure artifact version
- jurisdiction
- data lane
- evidence-room grant
- approved purpose
- release approval

Release decisions:

- ALLOW
- DENY
- REQUIRE_REDACTION
- REQUIRE_REVIEW
- REQUIRE_NEW_DERIVATIVE
- REQUIRE_ADDITIONAL_APPROVAL

### Core rule

No external filing, sending, publication or regulator disclosure may rely solely on an AI-generated draft where policy requires professional review.

---

## 7. Authoritative Source Substitution Policy

When a preferred authoritative source is unavailable or thin, Sentinel must not silently downgrade evidence quality.

Substitution policy should define:

- preferred source class
- acceptable fallback source classes
- prohibited fallback classes
- human approval requirement
- mandatory warning/qualification
- reliance ceiling
- freshness ceiling
- verification requirement

Example:

```
Required: PRIMARY_SOURCE_VERIFIED

Available: WEB_SEARCH_VERIFY

Policy:
  do not silently substitute
  mark authority gap
  require reviewer decision
  maximum reliance state = UNVERIFIED
```

### Core rule

Evidence-source substitution is an explicit policy event.

---

## Verification memory

R10 integrates with R3 Evidence Freshness.

A verified authority may retain:

- last-confirmed date
- verified source
- verifier
- content digest
- jurisdiction
- freshness window
- next verification date

This allows reuse without pretending verification is permanent.

---

## Integrated R10 reliance flow

```
Input / Assertion
  -> Matter Scope
  -> Premise Verification
  -> Source Retrieval
  -> Provenance Classification
  -> Freshness Check
  -> Analysis / Draft
  -> Reliance Classification
  -> Professional Review
  -> Destination / Confidentiality Check
  -> Release Authorization
  -> Evidence Room / External Use
  -> Verification Memory
```

## Database plan

Do not hand-edit `0025`.

Recommended R10 entities for the next generated migration:

- `governed_matters`
- `governed_matter_memberships`
- `governed_matter_context_bindings`
- `premise_assertions`
- `premise_verification_events`
- `source_provenance_records`
- `artifact_reliance_records`
- `professional_review_events`
- `release_gate_decisions`
- `source_substitution_policies`
- `source_substitution_events`
- `verification_memory_records`

These should be considered together with pending R1–R9 entities during the next generated migration pass.

## Acceptance gates

- cross-matter context is default-deny
- critical premises cannot silently become verified
- provenance labels reflect actual retrieval method
- model knowledge cannot masquerade as primary authority
- reliance elevation requires configured evidence/review gates
- review binds exact artifact version
- material edits invalidate or downgrade review where policy requires
- release gate checks destination and confidentiality state
- external use can require professionally reviewed reliance state
- source substitution is explicit and auditable
- verification memory respects freshness windows
- cross-organization isolation passes
- audit chain remains valid
