# Spec: Sovereign Resilience Gate

## Objective

Add one institution-scoped assessment that proves whether a registered AI system can remain governable through provider failure, price shock, export restriction, contract termination, or jurisdictional change. The gate must turn sovereignty from a policy statement into deterministic, auditable controls.

Success means an authorized reviewer can assess provider concentration, data control, portability, contractual rights, continuity, substitution, local-language validation, and retained institutional capability; receive a deterministic score and outcome; and preserve the failed-control evidence in Sentinel's audit chain.

## Tech Stack

- Next.js 16 / React 19 / TypeScript
- Cloudflare Workers and D1
- Drizzle ORM with SQLite migrations
- Node test runner

## Commands

- Install: `npm ci --ignore-scripts`
- Generate migration: `npm run db:generate`
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
- Audit: `npm audit --omit=dev`

## Project Structure

- `app/page.tsx` — navigation
- `app/operational-workspace.tsx` — assessment form and records table
- `app/api/governance/route.ts` — tenant-scoped reads, validation, scoring, and audit event
- `db/schema.ts` — assessment record
- `drizzle/` — D1 migration
- `tests/` — source-level governance and isolation checks

## Code Style

Match the existing compact TypeScript style and deterministic assessment pattern:

```ts
const failedChecks=checks.map((ok,index)=>ok?null:labels[index]).filter(Boolean);
const readinessScore=Math.round(checks.filter(Boolean).length/checks.length*100);
```

## Testing Strategy

- Verify the section is reachable from desktop and mobile navigation.
- Verify the API reads and writes only within the authenticated organization.
- Verify the registered AI system must belong to that organization.
- Verify scoring is deterministic and failed checks are written to the audit record.
- Run the complete build, test, lint, and dependency audit suite.

## Threat Model

- Spoofing/elevation: only authorized organization roles may submit assessments.
- Tampering/repudiation: calculated outcomes and failed controls are server-side and hash-chained in the audit log.
- Information disclosure: GET queries and system lookup are scoped by `organizationId`.
- Malicious input: required enums, dates, identifiers, scores, and bounded text are validated server-side.

## Boundaries

- Always: preserve tenant isolation, server-side scoring, role checks, input validation, and audit evidence.
- Ask first: change authentication, roles, external integrations, or collection of new personal data.
- Never: trust client-provided scores/outcomes, expose cross-tenant records, or claim full national sovereignty from one assessment.

## Success Criteria

- A new `Sovereign resilience` workspace exists.
- Every assessment references an existing institution-owned AI system.
- Twelve objective controls produce a 0–100 score.
- Missing data control, portability, continuity, or substitution evidence creates a visible failed-control record.
- Outcomes are `RESILIENCE READY`, `CAPABILITY GAPS`, or `STRATEGIC DEPENDENCY`.
- Assessment creation is audit logged with its score, outcome, and failed controls.
- Sovereign-resilience records are included in system evidence-package exports.
- Existing tests continue to pass.

## Open Questions

None. The requested strengthening points are implemented as one coherent governance gate rather than separate overlapping registers.
