# Audit transaction correction — October 5, 2026

Two defects in the deployed audit helper prevented its claimed transaction behavior:

- The stale-write guard was constructed but never executed.
- The async preparation helper returned a thenable Drizzle insert builder. Promise resolution executed the audit insert before the batch and returned its result instead of its query builder.

The helper now wraps the unexecuted statement in an object. Audited batches execute domain statements and the audit insert together. The audit insert evaluates the guard through a CASE expression on its required organization ID. A false guard violates that column's NOT NULL constraint, causing D1 to roll back the entire batch. The helper translates that specific failure to the existing refresh-and-retry error contract while preserving other errors.

Cloudflare documents sequential transactional execution and rollback on failed batch statements: https://developers.cloudflare.com/d1/worker-api/d1-database/#batch

The installer now re-executes its shell wrappers through Bash, so the advertised install command works with the tracked 100644 script mode.

Seven executable transaction tests use the real Drizzle D1 adapter and emitted SQL against an isolated SQLite database applying every existing migration. They cover false-guard rollback, zero-row stale updates, successful result mapping and hash-chain/tamper checks, rollback of earlier batch statements, unguarded compatibility, standalone audit append, and unrelated database failures. All seven reject the original deployment implementation. This local adapter models D1 batch semantics; it is not a remote production test.

The existing GitHub main response diagnostics are retained in the deployed frontend. No schema, migration, authorization policy, organization scope, or sharing changes are required. Migration head remains 0027.

Verification: installer command passed; typecheck and lint passed; build and artifact validation passed; all 32 tests passed before incorporating the already-merged frontend diagnostics. Final release checks rerun against the combined source. Authenticated production workflows and operational restoration remain separate assurance gates.
