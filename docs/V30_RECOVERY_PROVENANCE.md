# Sentinel Version 30 Recovery Provenance

## Status

This branch is the verified recovery baseline for Sentinel Version 30.

It is **not** represented as the original missing Git commit `bfa171c2ceb57b46bc22169ad91ce4fd0ea4d2c3`.

The original commit object has not been recovered from Git history.

## Exact recovered evidence

Recovered source bundle:

- Archive: `Sentinel-Version-30-updated-files.zip`
- SHA-256: `d8a6145db38a4f4833349ca2fee6f19975a5065e8b3b03c1a2003691624e9cb2`
- ZIP comment: `bfa171c2ceb57b46bc22169ad91ce4fd0ea4d2c3`
- Files: exactly 18

Every recovered file was converted to a Git blob and its Git blob SHA was verified against the ZIP bytes before the overlay tree was created.

Exact overlay branch:

`recovery/v30-overlay-on-v29`

Exact overlay commit:

`8beb90d0e4fc3df9c4779b1e88275f3e8edc9050`

Preserved Version 29 parent used for the overlay:

`4ec409f8fd088d0f87f9dc26dde80a778da79c3f`

## Exact 18 recovered files

1. `.gitignore`
2. `package.json`
3. `docs/NITDA_OUTREACH_DRAFT.md`
4. `docs/PRODUCTION_READINESS.md`
5. `docs/SOVEREIGN_INFRASTRUCTURE_ASSURANCE_PILOT.md`
6. `docs/DISASTER_RECOVERY.md`
7. `drizzle/0024_short_zuras.sql`
8. `drizzle/meta/0024_snapshot.json`
9. `drizzle/meta/_journal.json`
10. `scripts/verify-recovery-readiness.sh`
11. `tests/assurance-export.test.mjs`
12. `tests/completion-regressions.test.mjs`
13. `app/api/governance/access.ts`
14. `app/api/governance/route.ts`
15. `app/api/governance/validation.ts`
16. `app/operational-workspace.tsx`
17. `app/page.tsx`
18. `db/schema.ts`

## Parent-tree gaps discovered by verification

The 18-file bundle was an updated-files export, not a complete repository checkout.

A direct overlay onto preserved Version 29 exposed missing parent-tree state.

The following files or states were reconstructed from preserved production records and the recovered Version 30 regression contracts:

- `app/api/http.ts`
- `app/api/governance/audit.ts`
- `app/org-auth.ts`
- `app/api/systems/route.ts`
- `package-lock.json`

The regenerated `package-lock.json` is now persisted in this branch.

The reconstructed files are **not claimed to be byte-identical copies of the missing production parent tree**.

## Verification-only test maintenance

Some Version 29 regression tests encoded source formatting or behavior that Version 30 had explicitly changed.

On this recovery baseline only, those inherited tests were updated to verify Version 30 behavior rather than Version 29 source formatting.

The exact 18 recovered files were not modified for those test corrections.

## Migration state

Version 30 uses migrations through:

`0024_short_zuras`

Any Agent Skill Governance implementation must therefore begin at migration **0025** and be generated against the 0024 snapshot.

The prior reference implementation's `0021_agent_skill_governance.sql` must not be reused.

## Verification evidence

Normal repository CI passed on recovery baseline commit:

`0c4195beefafadf73e6f1a087d78762e466e83a0`

GitHub Actions run:

`35436567012`

Passed:

- dependency installation from the persisted lockfile
- all migrations through 0024 on scratch SQLite
- SQLite integrity check
- lint
- production build
- full regression test suite

A separate recovery workflow also passed before the temporary workflow was removed.

## Provenance boundary

What is proven:

- the recovered ZIP is preserved;
- the 18-file contents are byte-faithful to that ZIP;
- the recovered Version 30 update set can be combined with reconstructed parent dependencies into a repository that installs, migrates, lints, builds and passes the regression suite;
- that repository is durably stored in GitHub.

What is not proven:

- that this reconstructed full tree is byte-for-byte identical to the complete tree of missing commit `bfa171c2ceb57b46bc22169ad91ce4fd0ea4d2c3`;
- that the original Git commit object has been recovered.

## Merge state

Do not merge solely on recovery evidence.

The recovery baseline remains separate from production and main until the previously established review gates are explicitly cleared.
