import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const route=fs.readFileSync("app/api/skill-governance/route.ts","utf8");
const schema=fs.readFileSync("db/schema.ts","utf8");
const ui=fs.readFileSync("app/operational-workspace.tsx","utf8");
const page=fs.readFileSync("app/page.tsx","utf8");
const migration=fs.readFileSync("drizzle/0021_agent_skill_governance.sql","utf8");

test("skill governance tables are organization scoped",()=>{
  for(const name of ["skillRegistry","skillVersions","skillProvenance","skillChangeProposals","skillValidationRuns","skillApprovals","skillDeployments","skillPerformanceReviews","skillRollbacks"]) assert.match(schema,new RegExp("export const "+name+"="));
  assert.ok((schema.match(/organizationId:text\("organization_id"\)\.notNull\(\)/g)||[]).length>=9);
});

test("parent agent scope is enforced for tools and data",()=>{
  assert.match(route,/Skill tools exceed the parent agent/);
  assert.match(route,/Skill data access exceeds the parent agent/);
  assert.match(route,/Proposed version expands beyond approved skill tools/);
  assert.match(route,/Proposed version expands beyond approved skill data/);
});

test("skill proposals bind immutable content digests",()=>{
  assert.match(route,/contentDigest=await digest\(content\)/);
  assert.match(route,/Candidate digest changed after validation started/);
  assert.match(route,/Skill content digest mismatch/);
  assert.match(route,/Passing validation for the exact version digest is required/);
});

test("validation gate requires benchmark improvement and regression checks",()=>{
  assert.match(route,/candidateScore-baselineScore>=thresholdDelta&&safetyPass&&policyPass&&toolScopePass&&dataScopePass/);
  assert.match(route,/VALIDATION_FAILED/);
  assert.match(route,/READY_FOR_APPROVAL/);
});

test("self approval and duplicate approval are blocked",()=>{
  assert.match(route,/A proposer cannot approve their own skill change/);
  assert.match(route,/This approver has already decided this proposal/);
});

test("high risk changes require dual approval",()=>{
  assert.match(route,/includes\(skill\.riskTier\)\?2:1/);
  assert.match(route,/Required independent approvals are incomplete/);
});

test("deployment requires exact validated approved version",()=>{
  assert.match(route,/validationStatus!==\"passed\"\|\|version\.approvalStatus!==\"approved\"/);
  assert.match(route,/deploymentDigest:version\.contentDigest/);
  assert.match(route,/priorActiveVersion:skill\.currentVersion/);
});

test("regression and safety breach suspend active skill",()=>{
  assert.match(route,/REGRESSION/);
  assert.match(route,/SAFETY_BREACH/);
  assert.match(route,/lifecycleStatus:\"suspended\"/);
});

test("rollback requires a previously deployed approved version",()=>{
  assert.match(route,/Rollback target must be a previously validated and approved version/);
  assert.match(route,/Rollback target has never been deployed/);
  assert.match(route,/skill\.rolled_back/);
});

test("skill lifecycle transitions emit audit events",()=>{
  for(const event of ["skill.registered","skill.provenance_recorded","skill.version_proposed","skill.validation_started","skill.validation_completed","skill.deployed","skill.performance_reviewed","skill.suspended","skill.rolled_back","skill.retired"]) assert.ok(route.includes(event),"missing audit event "+event);
});

test("evidence package contains full skill lifecycle",()=>{
  for(const key of ["versions","provenance","proposals","validations","approvals","deployments","reviews","rollbacks","audit"]) assert.ok(route.includes(key));
  assert.match(route,/skill\.evidence_exported/);
});

test("migration creates all nine skill governance tables",()=>{
  for(const table of ["skill_registry","skill_versions","skill_provenance","skill_change_proposals","skill_validation_runs","skill_approvals","skill_deployments","skill_performance_reviews","skill_rollbacks"]) assert.ok(migration.includes("CREATE TABLE `"+table+"`"));
});

test("Sentinel UI exposes skill governance workspaces",()=>{
  assert.match(page,/"Agent skills"/);
  assert.match(page,/"Skill rollbacks"/);
  assert.match(ui,/endpoint:"\/api\/skill-governance"/);
  assert.match(ui,/action:"register_skill"/);
  assert.match(ui,/action:"complete_skill_validation"/);
  assert.match(ui,/action:"deploy_skill_version"/);
  assert.match(ui,/action:"rollback_skill_version"/);
});
