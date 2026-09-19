import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("sovereign resilience is a reachable institution-scoped workspace", async () => {
  const [page, workspace, schema, governance] = await Promise.all([
    readFile("app/page.tsx", "utf8"),
    readFile("app/operational-workspace.tsx", "utf8"),
    readFile("db/schema.ts", "utf8"),
    readFile("app/api/governance/route.ts", "utf8"),
  ]);

  assert.match(page, /"Sovereign resilience"/);
  assert.match(workspace, /key:"sovereignResilienceAssessments"/);
  assert.match(workspace, /action:"assess_sovereign_resilience"/);
  assert.match(schema, /sovereign_resilience_assessments/);
  assert.match(schema, /idx_sovereign_resilience_org_system/);
  assert.match(governance, /s\.sovereignResilienceAssessments\.organizationId,org/);
  assert.match(governance, /s\.aiSystems\.organizationId,org/);
});

test("sovereign resilience is scored on the server and preserved as audit evidence", async () => {
  const governance = await readFile("app/api/governance/route.ts", "utf8");

  assert.match(governance, /const readinessScore=Math\.round\(checks\.filter\(Boolean\)\.length\/checks\.length\*100\)/);
  assert.match(governance, /"RESILIENCE READY"/);
  assert.match(governance, /"CAPABILITY GAPS"/);
  assert.match(governance, /"STRATEGIC DEPENDENCY"/);
  assert.match(governance, /"sovereign_resilience\.assessed"/);
  assert.match(governance, /JSON\.stringify\(\{systemCode,jurisdiction,primaryProvider,readinessScore,outcome,failedChecks\}\)/);
  assert.match(governance, /packageVersion:"2\.0"/);
  assert.match(governance, /sovereignResilience/);
});

test("client cannot supply a sovereign resilience score or outcome", async () => {
  const workspace = await readFile("app/operational-workspace.tsx", "utf8");
  const view = workspace.match(/"Sovereign resilience":\{[^\n]+/s)?.[0] ?? "";

  assert.doesNotMatch(view, /f\("readinessScore"/);
  assert.doesNotMatch(view, /f\("outcome"/);
  assert.match(view, /f\("evidenceReference"/);
});
