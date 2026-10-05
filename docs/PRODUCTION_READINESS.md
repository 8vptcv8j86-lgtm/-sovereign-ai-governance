# Sentinel production readiness

Reviewed October 5, 2026, after the Version 35 audit fix and Version 36 Next.js patch.

## Verification boundary

- Clean dependency installation, typecheck, lint, production build, artifact validation and 32/32 tests passed. Seven audit transaction tests execute the actual helper and Drizzle D1 SQL against isolated SQLite; they are not live D1 workflow tests.
- Next.js 16.3.6 fixes GHSA-vcvr-r3jv-pc5j. No `next/og` or `ImageResponse` use was found in application source. The production dependency audit reports zero known vulnerabilities; CI now runs that audit on each release check.
- Source migration head is `0027_conscious_squadron_sinister.sql`. The bounded production database overview does not expose its migration history or privacy tables, so exact production application remains unconfirmed.
- Production `audit_events` and `ai_systems` were read directly and contain zero rows. There is no retained audit chain to rehash in this database. This does not prove earlier records never existed or reconcile historical domain changes. Preserve and inspect historical backups if available.
- Authenticated registration, approval, rejection, role denial, cross-organization isolation, privacy and export remain blocked by unavailable sign-in. Missing/forged identity denial evidence does not prove those authorized paths work.
- Production SQL export, Time Travel and isolated D1 restoration were unavailable through the read-only connector. Live restore readiness, measured RPO/RTO and backup eligibility are not established.
- R Coleman is the documented Platform Owner. A separate Recovery Operator and Evidence Approver must be named and receive appropriate access. The independent security assessor remains unassigned.
- Kanda/Afuo ingestion remains a reviewed integration dependency, not a deployed capability. The historical starter proposal uses PostgreSQL and placeholder authentication; it cannot be merged into D1 unchanged.

| Control | Status | Evidence or remaining action |
| --- | --- | --- |
| Evidence package frontend coverage | Confirmed | Evidence export generates a versioned JSON package for a registered system. |
| Audit hash generation | Confirmed | Version 2 SHA 256 hashes include canonical event data and the previous hash. |
| Full audit chain revalidation | Confirmed | Verification recomputes every version 2 event hash and checks chain continuity. Legacy events are counted separately. |
| Atomic domain and audit writes | Verified locally after Version 35 fix | Domain and audit statements share a D1 batch. Supplied guards execute during audit insertion and failed guards roll back the batch. Unguarded operations do not automatically gain a stale-state check. Live authenticated behavior remains unverified. |
| Organization isolation | Confirmed in source | Organization scope is derived server side and applied to operational reads and writes. Runtime tenant escape testing remains required before an institutional launch. |
| Authorization flows | Confirmed in source | Central action role mapping, payload validation and server dispatch coverage are tested. Runtime denial tests remain required before an institutional launch. |
| Sovereign Resilience gate | Confirmed | Data residency, concentration, portability, exit, continuity, fallback, language and knowledge transfer controls are scored server side. |
| Recovery exercise evidence | Confirmed in product | Measured RPO, RTO, restore integrity and restored audit chain results can now be recorded and exported. |
| Backup mechanism | Platform feature; project eligibility unverified | D1 Time Travel exists as a platform feature. This project's eligibility, retention and export arrangements require operational evidence. |
| Independent export | Tooling complete | The recovery verification script creates a restricted SQL export, hash, bookmark and manifest. Scheduling and external encrypted storage are not yet configured. |
| Live restoration exercise | Missing | Run the quarterly drill in an isolated D1 database and record the measured result. |
| Dedicated database claim | Not supported by default | Current architecture is a shared deployment with organization scoped records. A dedicated deployment is available only through a separately agreed configuration. |
| Penetration test | Missing | Obtain an independent test before a high risk institutional production launch. |

## Release gate

Deployment and passing local checks support architecture review, not an unqualified institutional assurance claim. Authenticated workflows, exact production schema, historical audit reconciliation where retained data exists, live isolated restoration and independent assessment remain open. The current release and exact source archive are recorded in the canonical Notion project.
