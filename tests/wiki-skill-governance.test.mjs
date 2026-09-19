import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const schema = readFileSync("db/schema.ts", "utf8");
const access = readFileSync("app/api/governance/access.ts", "utf8");
const skillRoute = readFileSync("app/api/skill-governance/route.ts", "utf8");
const governanceRoute = readFileSync("app/api/governance/route.ts", "utf8");
const workspace = readFileSync("app/operational-workspace.tsx", "utf8");
const page = readFileSync("app/page.tsx", "utf8");

test("WikiSkill schema contains nine organization-scoped ledgers", () => {
  for (const table of [
    "skill_registry",
    "skill_versions",
    "skill_provenance",
    "skill_change_proposals",
    "skill_validation_runs",
    "skill_approvals",
    "skill_deployments",
    "skill_performance_reviews",
    "skill_rollbacks",
  ]) {
    assert.match(schema, new RegExp('"' + table + '"'));
  }
  assert.match(schema, /uq_skill_versions_org_skill_version/);
  assert.match(schema, /uq_skill_approvals_org_proposal_approver/);
});

test("WikiSkill uses Version 30 authentication, authorization, audit, and org scoping", () => {
  assert.match(skillRoute, /actorFor\(request\)/);
  assert.match(skillRoute, /assertActionAllowed\(actor,action\)/);
  assert.match(skillRoute, /governanceAudit/);
  assert.doesNotMatch(skillRoute, /async function audit\(/);
  assert.match(skillRoute, /organizationId,org/);
  for (const action of [
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
  ]) {
    assert.match(access, new RegExp(action + ":"));
  }
});

test("WikiSkill state changes use the Version 30 atomic audit batch", () => {
  assert.match(skillRoute, /auditedBatch/);
  assert.match(skillRoute, /atomicSkillWrite/);
  assert.doesNotMatch(skillRoute, /await db\.insert/);
  assert.doesNotMatch(skillRoute, /await db\.update/);
});

test("skill scope cannot expand beyond the parent agent", () => {
  assert.match(skillRoute, /Skill tools exceed the parent agent's approved tools/);
  assert.match(skillRoute, /Skill data access exceeds the parent agent's approved data/);
  assert.match(skillRoute, /Proposed version expands beyond approved skill tools/);
  assert.match(skillRoute, /Proposed version expands beyond approved skill data/);
  assert.match(skillRoute, /Parent AI agent is not currently deployable/);
  assert.match(skillRoute, /Skill tool scope exceeds the parent agent's current approved tools/);
  assert.match(skillRoute, /Skill data scope exceeds the parent agent's current approved data/);
});

test("approval and digest gates block unsafe deployment", () => {
  assert.match(skillRoute, /A proposer cannot approve their own skill change/);
  assert.match(skillRoute, /This approver has already decided this proposal/);
  assert.match(skillRoute, /\["High","Critical"\]\.includes\(skill\.riskTier\)\?2:1/);
  assert.match(skillRoute, /Candidate digest changed after validation started/);
  assert.match(skillRoute, /Skill content digest mismatch/);
  assert.match(skillRoute, /Passing validation for the exact version digest is required/);
  assert.match(skillRoute, /Required independent approvals are incomplete/);
});

test("performance regression and rollback have operational enforcement", () => {
  assert.match(skillRoute, /\["REGRESSION","SAFETY_BREACH"\]\.includes\(conclusion\)/);
  assert.match(skillRoute, /skillDeployments\)\.set\(\{status:"suspended"\}\)/);
  assert.match(skillRoute, /Rollback target must be a previously validated and approved version/);
  assert.match(skillRoute, /Rollback target has never been deployed/);
  assert.match(skillRoute, /Suspend the active skill before retirement/);
});

test("Evidence Export 2.0 carries linked WikiSkill governance evidence", () => {
  assert.match(governanceRoute, /skillGovernance:/);
  for (const key of [
    "registry: skills",
    "versions: skillVersions",
    "provenance: skillProvenance",
    "proposals: skillProposals",
    "validations: skillValidations",
    "approvals: skillApprovals",
    "deployments: skillDeployments",
    "performanceReviews: skillPerformanceReviews",
    "rollbacks: skillRollbacks",
  ]) {
    assert.ok(governanceRoute.includes(key), "Missing evidence export key: " + key);
  }
  assert.match(skillRoute, /auditIntegrity/);
  assert.match(skillRoute, /verifyAuditChain\(db,org\)/);
});

test("operator UI exposes WikiSkill lifecycle and direct controls", () => {
  for (const section of [
    "Skill governance",
    "Agent skills",
    "Skill provenance",
    "Skill proposals",
    "Skill validation",
    "Skill validation results",
    "Skill approvals",
    "Skill denials",
    "Skill deployments",
    "Skill performance",
    "Skill suspension",
    "Skill rollbacks",
    "Skill retirement",
    "Skill evidence export",
  ]) {
    assert.match(page, new RegExp('"' + section + '"'));
    assert.match(workspace, new RegExp('"' + section + '"'));
  }
  assert.match(workspace, /endpoint: "\/api\/skill-governance"/);
  assert.match(workspace, /action: "deny_skill_change"/);
  assert.match(workspace, /action: "suspend_skill_version"/);
  assert.match(workspace, /action: "retire_skill"/);
  assert.match(workspace, /action: "export_skill_evidence_package"/);
});

test("WikiSkill migration is generated after Version 30 migration 0024", () => {
  const migration = readdirSync("drizzle").find((name) => /^0025_.*\.sql$/.test(name));
  assert.ok(migration, "Expected a generated 0025 Drizzle migration");
  const journal = readFileSync("drizzle/meta/_journal.json", "utf8");
  assert.match(journal, /"idx": 25/);
  assert.match(journal, /"tag": "0025_/);
});
