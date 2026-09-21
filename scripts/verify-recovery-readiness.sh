#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${SENTINEL_D1_DATABASE:-}" ]]; then
  echo "SENTINEL_D1_DATABASE is required." >&2
  exit 2
fi

sentinel_timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
sentinel_output_root="${SENTINEL_RECOVERY_OUTPUT_DIR:-.recovery-evidence}"
sentinel_evidence_dir="${sentinel_output_root}/${sentinel_timestamp}"
sentinel_dump="${sentinel_evidence_dir}/sentinel-d1.sql"

umask 077
mkdir -p "${sentinel_evidence_dir}"

npx wrangler d1 info "${SENTINEL_D1_DATABASE}" \
  > "${sentinel_evidence_dir}/database-info.txt"
npx wrangler d1 time-travel info "${SENTINEL_D1_DATABASE}" \
  > "${sentinel_evidence_dir}/time-travel-bookmark.txt"
npx wrangler d1 export "${SENTINEL_D1_DATABASE}" --remote \
  --output="${sentinel_dump}"

if [[ ! -s "${sentinel_dump}" ]]; then
  echo "D1 export is empty." >&2
  exit 1
fi

sha256sum "${sentinel_dump}" \
  > "${sentinel_evidence_dir}/sentinel-d1.sql.sha256"

{
  echo "created_at_utc=${sentinel_timestamp}"
  echo "database=${SENTINEL_D1_DATABASE}"
  echo "export_file=sentinel-d1.sql"
  echo "export_bytes=$(wc -c < "${sentinel_dump}")"
  echo "verification=bookmark_retrieved_and_export_hashed"
} > "${sentinel_evidence_dir}/manifest.txt"

echo "Recovery evidence created at ${sentinel_evidence_dir}"
echo "The export contains production data. Keep it encrypted and access controlled."
