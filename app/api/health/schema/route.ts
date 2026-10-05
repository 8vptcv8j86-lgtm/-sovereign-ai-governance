import { getDb } from "../../../../db";
import { sql } from "drizzle-orm";

// Metadata only. The existing owner-private Sites dispatch boundary protects
// this maintenance endpoint, including platform-issued non-user API access.
// Never accept table names, SQL, identities, or an organization from a caller.
const tables = [
  "privacy_ai_data_assessments", "privacy_data_inventory_flows",
  "privacy_dpia_assessments", "privacy_governance_evidence",
  "privacy_purpose_lawfulness", "privacy_retention_records",
  "privacy_rights_requests", "privacy_risk_assessments",
  "privacy_third_party_assessments",
] as const;

export async function GET() {
  try {
    const database = await getDb();
    const definitions = await database.all<{name: string; type: string; tbl_name: string; sql: string | null}>(sql`
      SELECT name, type, tbl_name, sql FROM sqlite_master
      WHERE type IN ('table', 'index')
        AND tbl_name IN (${sql.join(tables.map(table => sql`${table}`), sql`, `)})
      ORDER BY name
    `);
    const columns = await Promise.all(tables.map(async table => ({
      table,
      // Only identifiers from the hardcoded allowlist enter this PRAGMA.
      columns: await database.all(sql.raw(`PRAGMA table_info('${table}')`)),
    })));
    const present = definitions.filter(row => row.type === "table").map(row => row.name);
    const missing = tables.filter(table => !present.includes(table));
    return Response.json({
      migration: "0027_conscious_squadron_sinister.sql",
      status: missing.length ? "MISSING_TABLES" : "TABLES_PRESENT",
      missing, definitions, columns,
      verification: "live schema metadata; migration history and workflows are separate checks",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "SCHEMA_CHECK_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
