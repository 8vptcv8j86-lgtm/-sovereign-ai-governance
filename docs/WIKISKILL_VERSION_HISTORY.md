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

Parent:
`8a5d7fc0959a97d8acd2093d665a67b010ec9aa6`

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
