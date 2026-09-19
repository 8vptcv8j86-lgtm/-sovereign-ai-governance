import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const schema=readFileSync("db/schema.ts","utf8");
const route=readFileSync("app/api/governance/route.ts","utf8");
const page=readFileSync("app/page.tsx","utf8");
const workspace=readFileSync("app/operational-workspace.tsx","utf8");
const migration=readFileSync("drizzle/0021_version30_recovery_assurance.sql","utf8");

test("Version 30 recovery exercise schema is preserved",()=>{
  assert.match(schema,/recoveryExercises=sqliteTable\("recovery_exercises"/);
  for(const field of ["target_rpo_minutes","measured_rpo_minutes","target_rto_minutes","measured_rto_minutes","restored_data_integrity","restored_audit_chain","failed_checks","evidence_reference"]) assert.match(schema,new RegExp(field));
  assert.match(migration,/CREATE TABLE `recovery_exercises`/);
});

test("Version 2 audit events bind the stored timestamp to the hash",()=>{
  assert.match(route,/const occurredAt=new Date\(\)\.toISOString\(\)/);
  assert.match(route,/eventHash=`v2:/);
  assert.match(route,/createdAt:occurredAt/);
  assert.match(route,/verifyAuditIntegrity/);
  assert.match(route,/event hash mismatch/);
  assert.match(route,/previous hash mismatch/);
});

test("Evidence Export 2.0 includes the assurance record",()=>{
  assert.match(route,/packageVersion:"2\.0"/);
  for(const key of ["deploymentAndIsolation","auditIntegrity","auditHistory","deploymentGates","authorizationRecords","providersAndSubprocessors","sovereignResilience","recoveryExercises","correctiveActions","unresolvedFindings"]) assert.match(route,new RegExp(key));
  assert.match(route,/dedicatedInfrastructureClaim:false/);
  assert.match(route,/shared application deployment with organization-scoped logical isolation/);
});

test("Recovery workflow computes failed assurance checks",()=>{
  assert.match(route,/record_recovery_exercise/);
  assert.match(route,/RPO target missed/);
  assert.match(route,/RTO target missed/);
  assert.match(route,/Restored data integrity not verified/);
  assert.match(route,/Restored audit chain not verified/);
});

test("Version 30 surfaces are wired into the interface",()=>{
  assert.match(page,/"Recovery exercises"/);
  assert.match(page,/"Evidence export"/);
  assert.match(workspace,/"Recovery exercises":/);
  assert.match(workspace,/"Evidence export":/);
  assert.match(workspace,/Evidence Export 2\.0/);
});
