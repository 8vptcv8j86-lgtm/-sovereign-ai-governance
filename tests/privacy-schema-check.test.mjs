import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { drizzle } from "drizzle-orm/d1";
import ts from "typescript";

test("live schema checker reads the nine real migration tables and detects a missing table", async () => {
  const directory = await mkdtemp(resolve(".sites-runtime/schema-check-"));
  const sqlite = new DatabaseSync(":memory:");
  try {
    sqlite.exec((await readFile("drizzle/0027_conscious_squadron_sinister.sql", "utf8")).replaceAll("--> statement-breakpoint", ""));
    function prepare(query, values = []) {
      assert.match(query.trim(), /^(SELECT|PRAGMA)\b/i);
      return {
        bind(...parameters) { return prepare(query, parameters); },
        async all() { return { success: true, results: sqlite.prepare(query).all(...values) }; },
      };
    }
    const db = drizzle({ prepare });
    const source = (await readFile("app/api/health/schema/route.ts", "utf8"))
      .replace('import { getDb } from "../../../../db";', 'import { getDb } from "./fixture.mjs";');
    await writeFile(resolve(directory, "fixture.mjs"), "let database; export function setDb(value){ database=value; } export async function getDb(){ return database; }");
    await writeFile(resolve(directory, "route.mjs"), ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText);
    const fixture = await import(pathToFileURL(resolve(directory, "fixture.mjs")));
    fixture.setDb(db);
    const route = await import(pathToFileURL(resolve(directory, "route.mjs")));
    const response = await route.GET();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    const body = await response.json();
    assert.equal(body.status, "TABLES_PRESENT");
    assert.equal(body.definitions.filter(row => row.type === "table").length, 9);
    assert.equal(body.definitions.filter(row => row.type === "index").length, 27);
    const expectedColumns = ["id", "record_code", "organization_id", "system_code", "subject_code", "state", "jurisdiction", "owner", "payload", "content_digest", "evidence_refs", "next_review", "created_by", "created_at", "updated_at"];
    for (const table of body.columns) assert.deepEqual(table.columns.map(column => column.name), expectedColumns);
    assert.equal(sqlite.prepare("SELECT count(*) AS count FROM privacy_rights_requests").get().count, 0);
    sqlite.exec("DROP TABLE privacy_rights_requests");
    const missing = await (await route.GET()).json();
    assert.equal(missing.status, "MISSING_TABLES");
    assert.deepEqual(missing.missing, ["privacy_rights_requests"]);
    fixture.setDb({ all() { throw new Error("sensitive internal failure"); } });
    const failed = await route.GET();
    assert.equal(failed.status, 503);
    assert.deepEqual(await failed.json(), { error: "SCHEMA_CHECK_UNAVAILABLE" });
  } finally {
    sqlite.close();
    await rm(directory, { recursive: true, force: true });
  }
});
