import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("recovery exercises are measured, institution scoped and audit recorded", async () => {
  const [page, workspace, schema, route, access, validation] =
    await Promise.all([
      readFile("app/page.tsx", "utf8"),
      readFile("app/operational-workspace.tsx", "utf8"),
      readFile("db/schema.ts", "utf8"),
      readFile("app/api/governance/route.ts", "utf8"),
      readFile("app/api/governance/access.ts", "utf8"),
      readFile("app/api/governance/validation.ts", "utf8"),
    ]);

  assert.match(page, /"Recovery exercises"/);
  assert.match(workspace, /action: "record_recovery_exercise"/);
  assert.match(schema, /recovery_exercises/);
  assert.match(schema, /idx_recovery_exercises_org_system/);
  assert.match(route, /s\.recoveryExercises\.organizationId/);
  assert.match(route, /"recovery\.exercise_recorded"/);
  assert.match(route, /actualDataLossMinutes <= targetRpoMinutes/);
  assert.match(route, /actualRecoveryMinutes <= targetRtoMinutes/);
  assert.match(access, /record_recovery_exercise/);
  assert.match(validation, /record_recovery_exercise/);
});

test("evidence export contains assurance, recovery and unresolved findings", async () => {
  const route = await readFile("app/api/governance/route.ts", "utf8");

  assert.match(route, /packageVersion: "2\.0"/);
  assert.match(route, /deploymentModel: "Shared application deployment"/);
  assert.match(route, /dedicatedDeployment:/);
  assert.match(route, /auditIntegrity,/);
  assert.match(route, /auditHistory,/);
  assert.match(route, /recoveryAssurance:/);
  assert.match(route, /unresolvedFindings,/);
  assert.match(route, /highRiskVendors:/);
  assert.doesNotMatch(route, /generatedBy: actor,/);
});

test("recovery runbook does not claim an unperformed drill", async () => {
  const [runbook, readiness] = await Promise.all([
    readFile("docs/DISASTER_RECOVERY.md", "utf8"),
    readFile("docs/PRODUCTION_READINESS.md", "utf8"),
  ]);

  assert.match(runbook, /A live restoration exercise remains unconfirmed/);
  assert.match(readiness, /Live restoration exercise \| Missing/);
  assert.match(readiness, /shared deployment with organization scoped records/);
});
