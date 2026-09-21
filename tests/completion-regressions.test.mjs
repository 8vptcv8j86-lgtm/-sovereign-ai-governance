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
  const [access, validation, route, skillRoute, advancedRoute] = await Promise.all([
    readFile("app/api/governance/access.ts", "utf8"),
    readFile("app/api/governance/validation.ts", "utf8"),
    readFile("app/api/governance/route.ts", "utf8"),
    readFile("app/api/skill-governance/route.ts", "utf8"),
    readFile("app/api/advanced-governance/route.ts", "utf8"),
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
  const governanceBranches = new Set(
    [...route.matchAll(/action\s*===\s*"([a-z0-9_]+)"/g)].map(
      (match) => match[1],
    ),
  );
  const skillBranches = new Set(
    [...skillRoute.matchAll(/action\s*===\s*"([a-z0-9_]+)"/g)].map(
      (match) => match[1],
    ),
  );
  const skillActions = new Set([
    "register_skill",
    "record_skill_provenance",
    "propose_skill_version",
    "start_skill_validation",
    "complete_skill_validation",
    "approve_skill_change",
    "deny_skill_change",
    "deploy_skill_version",
    "record_skill_performance_review",
    "suspend_skill_version",
    "rollback_skill_version",
    "retire_skill",
    "export_skill_evidence_package",
  ]);
  const advancedBranches = new Set(
    [...advancedRoute.matchAll(/action\s*===\s*"([a-z0-9_]+)"/g)].map(
      (match) => match[1],
    ),
  );
  const advancedActions = new Set([
    "create_advanced_record",
    "transition_advanced_record",
    "export_advanced_governance_package",
  ]);
  const branches = new Set([
    ...governanceBranches,
    ...skillBranches,
    ...advancedBranches,
  ]);

  assert.equal(roleActions.size, 69);
  assert.deepEqual(
    [...roleActions].filter(
      (action) =>
        !skillActions.has(action) &&
        !advancedActions.has(action) &&
        !schemas.has(action),
    ),
    [],
  );
  assert.deepEqual(
    [...skillActions].filter((action) => !skillBranches.has(action)),
    [],
  );
  assert.deepEqual(
    [...advancedActions].filter((action) => !advancedBranches.has(action)),
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
  assert.match(skillRoute, /readJsonObject\(request\)/);
  assert.match(skillRoute, /textValue\(/);
  assert.match(skillRoute, /intValue\(/);
  assert.match(skillRoute, /boolValue\(/);
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
