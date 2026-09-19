# Sentinel Recovery Baseline — Version 30 Provenance Unverified

## Status

This branch is a **Recovery Baseline — Version 30 provenance unverified**. It is not the original Version 30 git commit and does not prove production parity.

Original production record:
- Version: 30
- Recorded production commit: `bfa171c2ceb57b46bc22169ad91ce4fd0ea4d2c3`
- Production date: 2026-09-16
- Site project: `appgprj_6a81ee4354348191958cd4b9bbc9316c`
- Site source version: 30

Durable recovery anchor:
- Version 29 git commit: `4ec409f8fd088d0f87f9dc26dde80a778da79c3f`

The original Version 30 commit object is not present in the connected GitHub repository. This branch reconstructs the Version 30 delta from the preserved production readiness record, Site metadata, Notion production archive, and the durable Version 29 source.

## Recovered Version 30 controls

- Recovery exercise ledger with RPO, RTO, restoration source, data-integrity verification, audit-chain verification, evidence reference, failed checks and outcome.
- Audit Version 2 events persist the exact timestamp used in the event hash.
- Audit integrity verification recomputes Version 2 event hashes and verifies chain continuity while counting legacy events separately.
- Evidence Export 2.0 includes:
  - truthful shared-deployment and organization-scoped isolation statement;
  - audit integrity result and audit history;
  - deployment gates;
  - authorization records;
  - providers and subprocessors;
  - sovereign resilience assessments;
  - recovery exercises;
  - incidents and corrective actions;
  - unresolved findings.
- Recovery exercises and Evidence export interfaces restored to the Sentinel navigation.

## Provenance limits

This branch does **not** claim byte-for-byte identity with the lost `bfa171c2` commit.

Until the original commit or exact tree is recovered:
- SOURCE PRESERVED: true for this recovered branch
- REMOTE VERIFIED: true after the branch is confirmed on GitHub
- RECOVERY VERIFIED: pending build/test execution
- PROVENANCE VERIFIED: false for the original Version 30 commit

If the original Version 30 tree is later recovered, compare it against this branch and retain both the original and recovery record.

## Frozen scope

Do not add Agent Skill Governance to this branch. That work must start from this recovered baseline only after the recovery branch passes CI and independent review.

## CI recovery note

CI normalizes repository shell-script permissions before invoking the production build so verification does not depend on executable-bit preservation in the checkout environment.


## Production behavior comparison gate

Green CI proves buildability and internal regression consistency only. Before this baseline is relied on or merged, compare it against the live production application for audit-chain verification, authorization enforcement, organization scoping, and Evidence Export 2.0 output.

Any divergence must be documented as a baseline difference.

## Independent review expansion

The human review must include recovery-exercise ledger immutability. RPO/RTO evidence is not credible if recovery exercise records can be edited after creation without governed amendment history.

## Required provenance label

Any evidence export, release note, or assurance package from this branch must identify itself as:

**Recovery Baseline — Version 30 provenance unverified**
