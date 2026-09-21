# Sentinel Frontend / Backend Integration Audit

Date: 2026-09-21

Branch: `feature/sentinel-integration-hardening`

Baseline preserved at:

`archive/wiki-skill-governance-supabase-r12-2026-09-21`

Baseline commit:

`e4e6383f0479c4096d663fdcce72a8f1ff5ba8d8`

## Scope

This audit traces:

frontend → API → validation → authorization → organization scope → database → audit → evidence export

for the current Version 30 / WikiSkill runtime.

It separately identifies R2–R12 features that remain architecture/specification only.

## Confirmed connected

- authenticated actor resolution through `actorFor`
- organization-scoped queries and writes
- server-generated capability list from `ACTION_ROLES`
- core governance GET/POST route
- WikiSkill GET/POST route
- nine WikiSkill governance ledgers
- audited writes / audited batches
- skill digest and approval gates
- Evidence Export integration
- operator workspaces for the WikiSkill lifecycle
- current legitimate migration head `0025_perpetual_avengers.sql`

## Gaps found and repaired

### Missing operator paths

Backend operations existed without dedicated UI paths:

- `update_user`
- `advance_workforce_conduct_stage`
- `reassign_accountability_succession`
- `flag_overdue_successions`
- `review_conduct_pattern`

Dedicated workspaces are now present for all five.

### Duplicate system-registration mutation path

The main page previously registered AI systems through `POST /api/systems` while the operational workspace used the canonical governance action `register_system`.

The main page now posts:

`POST /api/governance { action: "register_system", ... }`

This gives the primary UI one canonical validation / authorization / audit mutation path.

The legacy `/api/systems` route remains for compatibility but is no longer the main-page mutation path.

### Contract-test gap

A new `tests/frontend-backend-contract.test.mjs` checks:

- every ACTION_ROLES action has backend dispatch
- every backend action has role policy
- every core governance action has request validation
- every authorized action has an operator-visible invocation path
- the five previously disconnected actions stay wired
- main-page system registration stays on the canonical governance mutation path

### CI gap

A GitHub Actions workflow now runs:

- dependency installation
- TypeScript typecheck
- lint
- production build + tests
- migration-head verification

The migration guard explicitly requires the current head to remain `0025` until genuine generated `0026` work begins.

## Still not implemented

R2–R12 architecture additions are not yet fully present in the production runtime.

Examples include:

- governed workflows and action-classification entities
- source-health and data-lane entities
- runtime checkpoint / resume entities
- human-evidence request ledgers
- metering / entitlement / quota entities
- notification workflow / delivery / acknowledgement entities
- evidence-room / disclosure / redaction entities
- matter / reliance / professional-review entities
- session-capture / artifact / evidence-anchor entities
- data-plane policy / bypass / realtime / object-storage / secrets / security-lint entities

These must not be described as implemented merely because specification files exist.

## Database rule

Do not modify `0025`.

R2–R12 runtime implementation requires:

1. update Drizzle schema
2. generate migration through Drizzle from the current `0025` snapshot
3. commit genuine `0026` SQL + snapshot + journal update
4. wire APIs and ACTION_ROLES
5. wire audited writes
6. wire Evidence Export
7. wire frontend workspaces
8. add integration and negative authorization tests
9. pass CI/build
10. independently verify before merge

No hand-authored fake migration or snapshot is acceptable.

## Merge status

Do not merge this hardening branch until CI passes.

R2–R12 runtime implementation remains a separate controlled implementation phase requiring genuine migration generation.
