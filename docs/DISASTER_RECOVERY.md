# Sentinel backup and disaster recovery runbook

## Current recovery objectives

Sentinel's provisional production objectives are:

| Measure | Target |
| --- | ---: |
| Recovery point objective | 15 minutes |
| Recovery time objective | 4 hours |
| Restoration exercise | Quarterly and before a major institutional launch |
| Independent SQL export | Weekly, encrypted, outside the runtime account |

These are operating objectives, not guarantees. They become confirmed only after a measured restoration exercise is recorded in Sentinel.

## Recovery sources

1. Cloudflare D1 Time Travel is the primary point in time recovery mechanism. Confirm that `wrangler d1 info DATABASE` reports the production storage backend. Time Travel is always enabled on supported D1 production databases and retains restorable history for the period provided by the applicable Cloudflare plan.
2. A full SQL export is the independent recovery copy. Run `npm run recovery:verify` with `SENTINEL_D1_DATABASE` set. The script retrieves the current Time Travel bookmark, exports the database, hashes the export and writes a manifest under `.recovery-evidence/`.
3. Store the SQL export and manifest in an encrypted repository outside the Sentinel runtime account. R2 is not currently configured for this project, so the repository must not claim that off account exports are automated.

## Quarterly restoration exercise

Never restore over production during a drill.

1. Create a new, empty D1 drill database in the approved recovery account.
2. Run the recovery verification script against production to create the evidence bundle.
3. Import the SQL export into the empty drill database with `wrangler d1 execute DRILL_DATABASE --remote --file=PATH_TO_EXPORT`.
4. Confirm table counts, system records, evidence hashes and application startup against the drill database.
5. Run Sentinel's audit chain verification against the restored data.
6. Measure data loss in minutes and total recovery time in minutes.
7. Record the result in **Recovery exercises**. Attach the export hash, Time Travel bookmark, command log and validation results through the evidence reference.
8. Delete the drill database only after the exercise record and evidence have been retained under the approved policy.

## Production incident procedure

1. Stop nonessential writes and record the incident start time.
2. Preserve the current Time Travel bookmark before any restore.
3. Identify the last known valid timestamp using audit and incident evidence.
4. Obtain approval from the accountable incident authority.
5. Restore D1 to the approved timestamp. This overwrites the database in place and cancels in flight queries.
6. Verify system counts, evidence records and the complete institutional audit chain.
7. Resume writes only after integrity checks pass.
8. Record actual RPO, actual RTO, decision authority, failed checks and corrective actions.

## Evidence required for a passed exercise

- D1 database information confirming Time Travel support
- Pre restore bookmark
- Export SHA 256 digest
- Restoration command log
- Row count and application health checks
- Restored audit chain result
- Measured data loss and recovery time
- Named operator and approver

## Current limitation

The runbook and evidence capture are implemented. A live restoration exercise remains unconfirmed until an isolated D1 drill database and approved evidence storage location are available.

## Authoritative references

- Cloudflare D1 Time Travel and backups: https://developers.cloudflare.com/d1/reference/time-travel/
- Cloudflare D1 import and export: https://developers.cloudflare.com/d1/best-practices/import-export-data/
