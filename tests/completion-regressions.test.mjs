import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("verified email remains usable when Sites omits the account id", async () => {
  const auth = await readFile("app/org-auth.ts", "utf8");
  assert.match(auth, /authUserId: string \| null/);
  assert.match(auth, /identity\.authUserId &&\s*invited\?\.authUserId/);
  assert.match(auth, /identity\.authUserId \?\? `email:\$\{identity\.email\}`/);
  assert.doesNotMatch(auth, /authUserId \|\|= `email:/);
});

test("critical authorization writes are atomic and duplicate approvals are constrained", async () => {
  const [audit, governance, systems, schema] = await Promise.all([
    readFile("app/api/governance/audit.ts", "utf8"),
    readFile("app/api/governance/route.ts", "utf8"),
    readFile("app/api/systems/route.ts", "utf8"),
    readFile("db/schema.ts", "utf8"),
  ]);
  assert.match(audit, /export async function auditedBatch/);
  assert.match(governance, /auditedBatch\(\s*db,\s*actor,\s*request/);
  assert.match(systems, /auditedBatch\(\s*db,\s*actor,\s*request/);
  assert.match(schema, /uq_approvals_org_decision_approver/);
  assert.match(schema, /idx_access_grants_authorization/);
  assert.match(audit, /export async function auditedWrite/);
  assert.match(audit, /case when \$\{input\.guard\}/);
  assert.match(governance, /guard: sql`changes\(\) = 1`/);
  assert.match(governance, /select count\(\*\) from \$\{s\.approvals\}/);
  assert.doesNotMatch(
    governance,
    /await db\s*\.\s*(?:insert|update|delete|batch)/,
  );
});

test("every authorized governance action is validated and dispatched", async () => {
  const [access, validation, route] = await Promise.all([
    readFile("app/api/governance/access.ts", "utf8"),
    readFile("app/api/governance/validation.ts", "utf8"),
    readFile("app/api/governance/route.ts", "utf8"),
  ]);
  const roleActions = new Set(
    [...access.matchAll(/^\s{2}([a-z][a-z0-9_]+):\s/gm)].map(
      (match) => match[1],
    ),
  );
  const schemas = new Set(
    [...validation.matchAll(/^\s{2}([a-z][a-z0-9_]+):\s/gm)].map(
      (match) => match[1],
    ),
  );
  const branches = new Set(
    [...route.matchAll(/(?:if|else if) \(action === "([a-z0-9_]+)"\)/g)].map(
      (match) => match[1],
    ),
  );

  assert.equal(roleActions.size, 53);
  assert.deepEqual(
    [...roleActions].filter((action) => !schemas.has(action)),
    [],
  );
  assert.deepEqual(
    [...roleActions].filter((action) => !branches.has(action)),
    [],
  );
  assert.deepEqual(
    [...branches].filter((action) => !roleActions.has(action)),
    [],
  );
  assert.match(access, /authorize_agent_action: ownerReview/);
});

test("unfinished operational workflows and enforcement have UI and server coverage", async () => {
  const [access, validation, route, workspace, page] = await Promise.all([
    readFile("app/api/governance/access.ts", "utf8"),
    readFile("app/api/governance/validation.ts", "utf8"),
    readFile("app/api/governance/route.ts", "utf8"),
    readFile("app/operational-workspace.tsx", "utf8"),
    readFile("app/page.tsx", "utf8"),
  ]);
  for (const action of [
    "authorize_agent_action",
    "privacy_transition",
    "confidential_report_transition",
    "capa_transition",
    "update_user",
  ]) {
    assert.match(access, new RegExp(`${action}:`));
    assert.match(validation, new RegExp(`${action}:`));
    assert.match(route, new RegExp(`action === "${action}"`));
  }
  for (const label of [
    "Agent enforcement",
    "Evidence export",
    "Executive accountability",
    "Workforce conduct",
    "Conduct monitoring",
    "Accountability succession",
  ]) {
    assert.match(workspace + page, new RegExp(label));
  }
});
