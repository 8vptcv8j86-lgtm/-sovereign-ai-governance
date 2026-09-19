# Sentinel production readiness

| Control | Status | Evidence or remaining action |
| --- | --- | --- |
| Evidence package frontend coverage | Confirmed | Evidence export generates a versioned JSON package for a registered system. |
| Audit hash generation | Confirmed | Version 2 SHA 256 hashes include canonical event data and the previous hash. |
| Full audit chain revalidation | Confirmed | Verification recomputes every version 2 event hash and checks chain continuity. Legacy events are counted separately. |
| Atomic domain and audit writes | Confirmed | Critical changes and their audit records use D1 batch transactions with stale write protection. |
| Organization isolation | Confirmed in source | Organization scope is derived server side and applied to operational reads and writes. Runtime tenant escape testing remains required before an institutional launch. |
| Authorization flows | Confirmed in source | Central action role mapping, payload validation and server dispatch coverage are tested. Runtime denial tests remain required before an institutional launch. |
| Sovereign Resilience gate | Confirmed | Data residency, concentration, portability, exit, continuity, fallback, language and knowledge transfer controls are scored server side. |
| Recovery exercise evidence | Confirmed in product | Measured RPO, RTO, restore integrity and restored audit chain results can now be recorded and exported. |
| Backup mechanism | Platform supported | D1 Time Travel is supported on production storage. Database backend eligibility must be verified operationally. |
| Independent export | Tooling complete | The recovery verification script creates a restricted SQL export, hash, bookmark and manifest. Scheduling and external encrypted storage are not yet configured. |
| Live restoration exercise | Missing | Run the quarterly drill in an isolated D1 database and record the measured result. |
| Dedicated database claim | Not supported by default | Current architecture is a shared deployment with organization scoped records. A dedicated deployment is available only through a separately agreed configuration. |
| Penetration test | Missing | Obtain an independent test before a high risk institutional production launch. |

## Release gate

Sentinel may be described as production built, but not as independently certified or disaster recovery proven until the live restoration drill, runtime isolation tests and external security assessment are complete.
