import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("every authorized governance action has backend dispatch and an operator path", async () => {
  const [access, validation, governance, skill, advanced, workspace, page] = await Promise.all([
    readFile("app/api/governance/access.ts", "utf8"),
    readFile("app/api/governance/validation.ts", "utf8"),
    readFile("app/api/governance/route.ts", "utf8"),
    readFile("app/api/skill-governance/route.ts", "utf8"),
    readFile("app/api/advanced-governance/route.ts", "utf8"),
    readFile("app/operational-workspace.tsx", "utf8"),
    readFile("app/page.tsx", "utf8"),
  ]);

  const authorized = new Set(
    [...access.matchAll(/^\s{2}([a-z][a-z0-9_]+):\s/gm)].map((m) => m[1]),
  );
  const governanceBranches = new Set(
    [...governance.matchAll(/action\s*===\s*"([a-z0-9_]+)"/g)].map((m) => m[1]),
  );
  const skillBranches = new Set(
    [...skill.matchAll(/action\s*===\s*"([a-z0-9_]+)"/g)].map((m) => m[1]),
  );
  const advancedBranches = new Set(
    [...advanced.matchAll(/action\s*===\s*"([a-z0-9_]+)"/g)].map((m) => m[1]),
  );
  const backend = new Set([
    ...governanceBranches,
    ...skillBranches,
    ...advancedBranches,
  ]);

  assert.deepEqual(
    [...authorized].filter((action) => !backend.has(action)),
    [],
    "authorized actions must have a backend dispatch branch",
  );
  assert.deepEqual(
    [...backend].filter((action) => !authorized.has(action)),
    [],
    "backend actions must be represented in ACTION_ROLES",
  );

  const uiSource = workspace + "\n" + page;
  const missingUi = [...authorized].filter(
    (action) => !uiSource.includes('"' + action + '"'),
  );
  assert.deepEqual(
    missingUi,
    [],
    "every authorized backend action must have an operator-visible invocation path",
  );

  const validationSchemas = new Set(
    [...validation.matchAll(/^\s{2}([a-z][a-z0-9_]+):\s/gm)].map((m) => m[1]),
  );
  assert.deepEqual(
    [...governanceBranches].filter((action) => !validationSchemas.has(action)),
    [],
    "every core governance action must have a request validation schema",
  );

  for (const action of [
    "update_user",
    "advance_workforce_conduct_stage",
    "reassign_accountability_succession",
    "flag_overdue_successions",
    "review_conduct_pattern",
  ]) {
    assert.ok(authorized.has(action));
    assert.ok(governanceBranches.has(action));
    assert.match(workspace, new RegExp('action: "' + action + '"'));
  }

  assert.ok(skillBranches.has("export_skill_evidence_package"));
  for (const action of [
    "create_advanced_record",
    "transition_advanced_record",
    "export_advanced_governance_package",
  ]) {
    assert.ok(advancedBranches.has(action));
    assert.match(workspace, new RegExp('action: "' + action + '"'));
  }
});

test("system registration uses one canonical governance mutation path", async () => {
  const page = await readFile("app/page.tsx", "utf8");
  assert.match(page, /fetch\("\/api\/governance"/);
  assert.match(page, /action:\s*"register_system"/);
  assert.doesNotMatch(page, /fetch\("\/api\/systems"[\s\S]{0,120}method:\s*"POST"/);
});
