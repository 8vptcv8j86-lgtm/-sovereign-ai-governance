import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { after, before, test } from "node:test";
import ts from "typescript";
import { drizzle } from "drizzle-orm/d1";
import { eq, sql } from "drizzle-orm";

let compiledDirectory;
let audit;
let schema;

before(async () => {
  await mkdir(".sites-runtime", { recursive: true });
  compiledDirectory = await mkdtemp(resolve(".sites-runtime/audit-tests-"));
  for (const [source, output] of [
    ["db/schema.ts", "schema.mjs"],
    ["app/api/governance/audit.ts", "audit.mjs"],
  ]) {
    const text = (await readFile(source, "utf8"))
      .replace('"../../../db/schema"', '"./schema.mjs"');
    const compiled = ts.transpileModule(text, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    await writeFile(resolve(compiledDirectory, output), compiled);
  }
  schema = await import(pathToFileURL(resolve(compiledDirectory, "schema.mjs")));
  audit = await import(pathToFileURL(resolve(compiledDirectory, "audit.mjs")));
});

after(async () => {
  if (compiledDirectory) await rm(compiledDirectory, { recursive: true, force: true });
});

// Exercise Drizzle's real D1 adapter and emitted SQL against SQLite. This
// adapter models D1's documented sequential, all-or-nothing batch semantics.
async function fixture(t) {
  const sqlite = new DatabaseSync(":memory:");
  t.after(() => sqlite.close());
  for (const migration of (await readdir("drizzle")).filter(x => x.endsWith(".sql")).sort()) {
    sqlite.exec((await readFile("drizzle/" + migration, "utf8"))
      .replaceAll("--> statement-breakpoint", ""));
  }
  sqlite.exec("INSERT INTO users (email, display_name, role, organization_id) VALUES ('test@example.test', 'Test', 'admin', 'org-test')");
  function prepare(query, parameters = []) {
    return {
      bind(...values) { return prepare(query, values); },
      async all() {
        const statement = sqlite.prepare(query);
        const results = statement.all(...parameters).map(row => ({ ...row }));
        return { success: true, results };
      },
      async raw() {
        const statement = sqlite.prepare(query);
        return statement.all(...parameters).map(row => Object.values(row));
      },
      async run() {
        return { success: true, results: [], meta: sqlite.prepare(query).run(...parameters) };
      },
    };
  }
  const binding = {
    prepare,
    async batch(statements) {
      sqlite.exec("BEGIN");
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.all());
        sqlite.exec("COMMIT");
        return results;
      } catch (error) {
        sqlite.exec("ROLLBACK");
        throw error;
      }
    },
  };
  return { sqlite, db: drizzle(binding, { schema }) };
}

const actor = { email: "test@example.test", role: "admin", organizationId: "org-test" };
const request = new Request("https://sentinel.example.test/api/governance");
const input = {
  action: "user.access_updated", entityType: "user", entityCode: "test@example.test", details: "test change",
};
const count = sqlite => sqlite.prepare("SELECT count(*) AS n FROM audit_events").get().n;
const role = sqlite => sqlite.prepare("SELECT role FROM users WHERE id = 1").get().role;

test("false guard rolls back domain changes and the audit insert", async t => {
  const { sqlite, db } = await fixture(t);
  await assert.rejects(audit.auditedWrite(db, actor, request,
    db.update(schema.users).set({ role: "reviewer" }).where(eq(schema.users.id, 1)).returning(),
    { ...input, guard: sql`0 = 1` }), /changed; refresh/);
  assert.equal(role(sqlite), "admin");
  assert.equal(count(sqlite), 0);
});

test("zero-row stale update cannot append a success audit event", async t => {
  const { sqlite, db } = await fixture(t);
  await assert.rejects(audit.auditedWrite(db, actor, request,
    db.update(schema.users).set({ role: "reviewer" }).where(eq(schema.users.id, 999)).returning(),
    { ...input, guard: sql`changes() = 1` }), /changed; refresh/);
  assert.equal(role(sqlite), "admin");
  assert.equal(count(sqlite), 0);
});

test("successful guarded writes return domain results and maintain the hash chain", async t => {
  const { sqlite, db } = await fixture(t);
  for (const nextRole of ["reviewer", "admin"]) {
    const rows = await audit.auditedWrite(db, actor, request,
      db.update(schema.users).set({ role: nextRole }).where(eq(schema.users.id, 1)).returning(),
      { ...input, guard: sql`changes() = 1` });
    assert.equal(rows[0].role, nextRole);
  }
  assert.equal(count(sqlite), 2);
  const integrity = await audit.verifyAuditChain(db, "org-test");
  assert.equal(integrity.status, "VERIFIED");
  assert.equal(integrity.verifiedV2, 2);
  sqlite.exec("UPDATE audit_events SET details = 'tampered' WHERE id = 1");
  assert.equal((await audit.verifyAuditChain(db, "org-test")).status, "BROKEN");
});

test("failed final guard rolls back every earlier statement in the batch", async t => {
  const { sqlite, db } = await fixture(t);
  await assert.rejects(audit.auditedBatch(db, actor, request, [
    db.update(schema.users).set({ role: "reviewer" }).where(eq(schema.users.id, 1)).returning(),
    db.update(schema.users).set({ status: "inactive" }).where(eq(schema.users.id, 999)).returning(),
  ], { ...input, guard: sql`changes() = 1` }), /changed; refresh/);
  assert.equal(role(sqlite), "admin");
  assert.equal(count(sqlite), 0);
});

test("unguarded writes remain compatible and return only domain results", async t => {
  const { sqlite, db } = await fixture(t);
  const results = await audit.auditedBatch(db, actor, request, [
    db.update(schema.users).set({ role: "reviewer" }).where(eq(schema.users.id, 1)).returning(),
  ], input);
  assert.equal(results.length, 1);
  assert.equal(results[0][0].role, "reviewer");
  assert.equal(count(sqlite), 1);
});

test("standalone audit appends execute once and return the inserted event", async t => {
  const { sqlite, db } = await fixture(t);
  const event = await audit.appendAuditEvent(db, actor, request, input);
  assert.equal(event.action, input.action);
  assert.equal(count(sqlite), 1);
  assert.equal((await audit.verifyAuditChain(db, "org-test")).status, "VERIFIED");
});

test("unrelated database errors propagate and roll back without a stale-state message", async t => {
  const { sqlite, db } = await fixture(t);
  await assert.rejects(audit.auditedWrite(db, actor, request,
    db.update(schema.users).set({ role: "reviewer" }).where(eq(schema.users.id, 1)).returning(),
    { ...input, entityType: null, guard: sql`changes() = 1` }), error =>
      /audit_events.entity_type/.test(error.message) && !/changed; refresh/.test(error.message));
  assert.equal(role(sqlite), "admin");
  assert.equal(count(sqlite), 0);
});
