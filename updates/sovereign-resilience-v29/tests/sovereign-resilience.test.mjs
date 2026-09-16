import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("sovereign resilience is reachable and institution scoped", async () => {
  const [page, workspace, schema, governance, access, validation] =
    await Promise.all([
      readFile("app/page.tsx", "utf8"),
      readFile("app/operational-workspace.tsx", "utf8"),
      readFile("db/schema.ts", "utf8"),
      readFile("app/api/governance/route.ts", "utf8"),
      readFile("app/api/governance/access.ts", "utf8"),
      readFile("app/api/governance/validation.ts", "utf8"),
    ]);

  assert.match(page, /"Sovereign resilience"/);
  assert.match(workspace, /key: "sovereignResilienceAssessments"/);
  assert.match(workspace, /action: "assess_sovereign_resilience"/);
  assert.match(schema, /sovereign_resilience_assessments/);
  assert.match(schema, /idx_sovereign_resilience_org_system/);
  assert.match(governance, /s\.sovereignResilienceAssessments\.organizationId/);
  assert.match(governance, /s\.aiSystems\.organizationId/);
  assert.match(access, /assess_sovereign_resilience/);
  assert.match(validation, /assess_sovereign_resilience/);
});

test("server scores resilience and preserves failed checks in audit evidence", async () => {
  const governance = await readFile("app/api/governance/route.ts", "utf8");

  assert.match(governance, /"RESILIENCE READY"/);
  assert.match(governance, /"CAPABILITY GAPS"/);
  assert.match(governance, /"STRATEGIC DEPENDENCY"/);
  assert.match(governance, /"sovereign_resilience\.assessed"/);
  assert.match(governance, /failedChecks/);
  assert.match(governance, /sovereignResilience/);
});

test("client cannot supply a resilience score or outcome", async () => {
  const workspace = await readFile("app/operational-workspace.tsx", "utf8");
  const start = workspace.indexOf('"Sovereign resilience"');
  const end = workspace.indexOf('"Agrifood supply chains"', start);
  const view = workspace.slice(start, end);

  assert.doesNotMatch(view, /f\("readinessScore"/);
  assert.doesNotMatch(view, /f\("outcome"/);
  assert.match(view, /f\("evidenceReference"/);
});
