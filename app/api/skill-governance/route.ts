import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import * as s from "../../../db/schema";
import { actorFor, type Actor } from "../../org-auth";

const code=(prefix:string)=>`${prefix}-${Date.now().toString(36).toUpperCase()}${crypto.randomUUID().slice(0,4).toUpperCase()}`;
const roles=(actor:Actor,allowed:string[])=>actor.role==="admin"||allowed.includes(actor.role);
const textValue=(value:unknown,name:string)=>{const v=String(value??"").trim();if(!v)throw new Error(`${name} is required`);return v};
const intValue=(value:unknown,name:string)=>{const v=Number(value);if(!Number.isInteger(v)||v<0)throw new Error(`${name} must be a non-negative integer`);return v};
const boolValue=(value:unknown)=>value===true||value==="true"||value==="1"||value===1||value==="Yes"||value==="Pass";
const csv=(value:unknown)=>String(value??"").split(",").map(x=>x.trim()).filter(Boolean);
const subset=(child:string[],parent:string[])=>child.every(x=>parent.includes(x));
async function digest(value:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes)).map(b=>b.toString(16).padStart(2,"0")).join("")}
function fail(error:unknown){const message=error instanceof Error?error.message:"Request failed";const status=message==="AUTH_REQUIRED"?401:message==="ACCESS_DENIED"?403:400;return Response.json({error:message},{status})}

async function audit(db:Awaited<ReturnType<typeof getDb>>,actor:Actor,request:Request,action:string,entityType:string,entityCode:string,details:unknown){
  const prior=await db.select().from(s.auditEvents).where(eq(s.auditEvents.organizationId,actor.organizationId)).orderBy(desc(s.auditEvents.id)).limit(1);
  const previousHash=prior[0]?.eventHash??"GENESIS";
  const occurredAt=new Date().toISOString();
  const detailText=typeof details==="string"?details:JSON.stringify(details);
  const payload=`${previousHash}|${actor.email}|${action}|${entityType}|${entityCode}|${detailText}|${occurredAt}`;
  const eventHash=await digest(payload);
  await db.insert(s.auditEvents).values({organizationId:actor.organizationId,actorEmail:actor.email,actorRole:actor.role,action,entityType,entityCode,details:detailText,sourceIp:request.headers.get("x-forwarded-for"),previousHash,eventHash,createdAt:occurredAt});
}

async function skillFor(db:Awaited<ReturnType<typeof getDb>>,org:string,skillCode:string){
  const skill=await db.select().from(s.skillRegistry).where(and(eq(s.skillRegistry.organizationId,org),eq(s.skillRegistry.skillCode,skillCode))).get();
  if(!skill)throw new Error("Skill not found");
  return skill;
}
async function versionFor(db:Awaited<ReturnType<typeof getDb>>,org:string,skillCode:string,version:string){
  const row=await db.select().from(s.skillVersions).where(and(eq(s.skillVersions.organizationId,org),eq(s.skillVersions.skillCode,skillCode),eq(s.skillVersions.version,version))).get();
  if(!row)throw new Error("Skill version not found");
  return row;
}
async function proposalFor(db:Awaited<ReturnType<typeof getDb>>,org:string,proposalCode:string){
  const row=await db.select().from(s.skillChangeProposals).where(and(eq(s.skillChangeProposals.organizationId,org),eq(s.skillChangeProposals.proposalCode,proposalCode))).get();
  if(!row)throw new Error("Skill change proposal not found");
  return row;
}

export async function GET(request:Request){
  try{
    const {db,actor}=await actorFor(request);const org=actor.organizationId;
    const [skills,versions,provenance,proposals,validations,approvals,deployments,reviews,rollbacks]=await Promise.all([
      db.select().from(s.skillRegistry).where(eq(s.skillRegistry.organizationId,org)).orderBy(desc(s.skillRegistry.id)).limit(200),
      db.select().from(s.skillVersions).where(eq(s.skillVersions.organizationId,org)).orderBy(desc(s.skillVersions.id)).limit(300),
      db.select().from(s.skillProvenance).where(eq(s.skillProvenance.organizationId,org)).orderBy(desc(s.skillProvenance.id)).limit(300),
      db.select().from(s.skillChangeProposals).where(eq(s.skillChangeProposals.organizationId,org)).orderBy(desc(s.skillChangeProposals.id)).limit(200),
      db.select().from(s.skillValidationRuns).where(eq(s.skillValidationRuns.organizationId,org)).orderBy(desc(s.skillValidationRuns.id)).limit(200),
      db.select().from(s.skillApprovals).where(eq(s.skillApprovals.organizationId,org)).orderBy(desc(s.skillApprovals.id)).limit(300),
      db.select().from(s.skillDeployments).where(eq(s.skillDeployments.organizationId,org)).orderBy(desc(s.skillDeployments.id)).limit(300),
      db.select().from(s.skillPerformanceReviews).where(eq(s.skillPerformanceReviews.organizationId,org)).orderBy(desc(s.skillPerformanceReviews.id)).limit(200),
      db.select().from(s.skillRollbacks).where(eq(s.skillRollbacks.organizationId,org)).orderBy(desc(s.skillRollbacks.id)).limit(200)
    ]);
    const now=Date.now();
    const dashboard=[{
      activeGovernedSkills:skills.filter(x=>x.lifecycleStatus==="active").length,
      awaitingValidation:proposals.filter(x=>["proposed","validating"].includes(x.status)).length,
      awaitingApproval:proposals.filter(x=>x.status==="ready_for_approval").length,
      failedValidations:validations.filter(x=>x.outcome==="VALIDATION_FAILED").length,
      recentDeployments:deployments.filter(x=>Date.parse(x.createdAt)>=now-30*86400000).length,
      performanceRegressions:reviews.filter(x=>["REGRESSION","SAFETY_BREACH"].includes(x.conclusion)).length,
      emergencySuspensions:skills.filter(x=>x.lifecycleStatus==="suspended").length,
      rollbacks:rollbacks.length,
      overdueReviews:skills.filter(x=>Date.parse(x.reviewDue)<now).length
    }];
    return Response.json({actor,skills,versions,provenance,proposals,validations,approvals,deployments,reviews,rollbacks,dashboard});
  }catch(e){return fail(e)}
}

export async function POST(request:Request){
  try{
    const {db,actor}=await actorFor(request);const org=actor.organizationId;const body=await request.json() as Record<string,unknown>;const action=String(body.action||"");let result:unknown;

    if(action==="register_skill"){
      if(!roles(actor,["system_owner"]))throw new Error("ACCESS_DENIED");
      const systemCode=textValue(body.systemCode,"systemCode"),agentCode=textValue(body.agentCode,"agentCode");
      const agent=await db.select().from(s.aiAgents).where(and(eq(s.aiAgents.organizationId,org),eq(s.aiAgents.agentCode,agentCode))).get();
      if(!agent)throw new Error("Parent AI agent not found");
      if(agent.systemCode!==systemCode)throw new Error("Agent does not belong to the specified AI system");
      const approvedTools=csv(body.approvedTools),approvedData=csv(body.approvedData);
      if(!subset(approvedTools,csv(agent.approvedTools)))throw new Error("Skill tools exceed the parent agent's approved tools");
      if(!subset(approvedData,csv(agent.approvedData)))throw new Error("Skill data access exceeds the parent agent's approved data");
      const skillCode=code("SKL");
      const [row]=await db.insert(s.skillRegistry).values({
        skillCode,organizationId:org,systemCode,agentCode,name:textValue(body.name,"name"),purpose:textValue(body.purpose,"purpose"),
        riskTier:textValue(body.riskTier,"riskTier"),owner:textValue(body.owner,"owner"),approvedScope:textValue(body.approvedScope,"approvedScope"),
        approvedTools:approvedTools.join(", "),approvedData:approvedData.join(", "),jurisdictions:textValue(body.jurisdictions,"jurisdictions"),
        reviewDue:textValue(body.reviewDue,"reviewDue"),lifecycleStatus:"draft"
      }).returning();
      result=row;await audit(db,actor,request,"skill.registered","skill",skillCode,{agentCode,systemCode,riskTier:row.riskTier});
    }

    else if(action==="record_skill_provenance"){
      if(!roles(actor,["system_owner","reviewer"]))throw new Error("ACCESS_DENIED");
      const skillCode=textValue(body.skillCode,"skillCode"),skill=await skillFor(db,org,skillCode);
      const provenanceCode=code("SKP");
      const [row]=await db.insert(s.skillProvenance).values({
        provenanceCode,organizationId:org,skillCode,agentCode:skill.agentCode,evidenceType:textValue(body.evidenceType,"evidenceType"),
        evidenceReference:textValue(body.evidenceReference,"evidenceReference"),observationSummary:textValue(body.observationSummary,"observationSummary"),
        pattern:textValue(body.pattern,"pattern"),sourceExecutionIds:textValue(body.sourceExecutionIds,"sourceExecutionIds"),
        sensitiveDataClassification:textValue(body.sensitiveDataClassification,"sensitiveDataClassification"),
        retentionRule:textValue(body.retentionRule,"retentionRule"),recordedBy:actor.email
      }).returning();
      result=row;await audit(db,actor,request,"skill.provenance_recorded","skill",skillCode,{provenanceCode,evidenceType:row.evidenceType});
    }

    else if(action==="propose_skill_version"){
      if(!roles(actor,["system_owner"]))throw new Error("ACCESS_DENIED");
      const skillCode=textValue(body.skillCode,"skillCode"),skill=await skillFor(db,org,skillCode);
      const version=textValue(body.version,"version"),content=textValue(body.content,"content"),contentDigest=await digest(content);
      const affectedTools=csv(body.affectedTools),affectedData=csv(body.affectedData);
      if(!subset(affectedTools,csv(skill.approvedTools)))throw new Error("Proposed version expands beyond approved skill tools");
      if(!subset(affectedData,csv(skill.approvedData)))throw new Error("Proposed version expands beyond approved skill data");
      const existing=await db.select().from(s.skillVersions).where(and(eq(s.skillVersions.organizationId,org),eq(s.skillVersions.skillCode,skillCode),eq(s.skillVersions.version,version))).get();
      if(existing)throw new Error("This skill version already exists");
      const versionCode=code("SKV");
      await db.insert(s.skillVersions).values({
        versionCode,organizationId:org,skillCode,version,content,contentDigest,sourceType:textValue(body.sourceType,"sourceType"),
        parentVersion:skill.currentVersion,changeSummary:textValue(body.changeSummary,"changeSummary"),
        behavioralDelta:textValue(body.behavioralDelta,"behavioralDelta"),proposedBy:actor.email
      });
      const proposalCode=code("SCP");
      const [proposal]=await db.insert(s.skillChangeProposals).values({
        proposalCode,organizationId:org,skillCode,fromVersion:skill.currentVersion,proposedVersion:version,proposedVersionCode:versionCode,
        changeRationale:textValue(body.changeRationale,"changeRationale"),provenanceRefs:textValue(body.provenanceRefs,"provenanceRefs"),
        expectedBenefit:textValue(body.expectedBenefit,"expectedBenefit"),knownRisks:textValue(body.knownRisks,"knownRisks"),
        affectedWorkflows:textValue(body.affectedWorkflows,"affectedWorkflows"),affectedTools:affectedTools.join(", "),
        affectedData:affectedData.join(", "),rollbackTarget:skill.currentVersion,proposedBy:actor.email,status:"proposed"
      }).returning();
      await db.update(s.skillRegistry).set({lifecycleStatus:"proposed"}).where(and(eq(s.skillRegistry.organizationId,org),eq(s.skillRegistry.skillCode,skillCode)));
      result={proposal,versionCode,contentDigest};await audit(db,actor,request,"skill.version_proposed","skill",skillCode,{proposalCode,version,contentDigest});
    }

    else if(action==="start_skill_validation"){
      if(!roles(actor,["reviewer"]))throw new Error("ACCESS_DENIED");
      const proposalCode=textValue(body.proposalCode,"proposalCode"),proposal=await proposalFor(db,org,proposalCode);
      if(!["proposed","validation_failed"].includes(proposal.status))throw new Error("Proposal is not eligible for validation");
      const version=await versionFor(db,org,proposal.skillCode,proposal.proposedVersion);
      const validationCode=code("SKT");
      const [row]=await db.insert(s.skillValidationRuns).values({
        validationCode,organizationId:org,proposalCode,skillCode:proposal.skillCode,candidateVersion:proposal.proposedVersion,
        candidateDigest:version.contentDigest,baselineVersion:proposal.fromVersion,testSetReference:textValue(body.testSetReference,"testSetReference"),
        resultArtifact:textValue(body.resultArtifact,"resultArtifact"),outcome:"VALIDATING"
      }).returning();
      await db.update(s.skillChangeProposals).set({status:"validating"}).where(and(eq(s.skillChangeProposals.organizationId,org),eq(s.skillChangeProposals.proposalCode,proposalCode)));
      await db.update(s.skillVersions).set({validationStatus:"validating"}).where(and(eq(s.skillVersions.organizationId,org),eq(s.skillVersions.versionCode,proposal.proposedVersionCode)));
      result=row;await audit(db,actor,request,"skill.validation_started","skill",proposal.skillCode,{proposalCode,validationCode,candidateDigest:version.contentDigest});
    }

    else if(action==="complete_skill_validation"){
      if(!roles(actor,["reviewer"]))throw new Error("ACCESS_DENIED");
      const validationCode=textValue(body.validationCode,"validationCode");
      const validation=await db.select().from(s.skillValidationRuns).where(and(eq(s.skillValidationRuns.organizationId,org),eq(s.skillValidationRuns.validationCode,validationCode))).get();
      if(!validation)throw new Error("Validation run not found");
      if(validation.outcome!=="VALIDATING")throw new Error("Validation run is already complete");
      const version=await versionFor(db,org,validation.skillCode,validation.candidateVersion);
      if(version.contentDigest!==validation.candidateDigest)throw new Error("Candidate digest changed after validation started");
      const baselineScore=intValue(body.baselineScore,"baselineScore"),candidateScore=intValue(body.candidateScore,"candidateScore"),thresholdDelta=intValue(body.thresholdDelta,"thresholdDelta");
      const safetyPass=boolValue(body.safetyPass),policyPass=boolValue(body.policyPass),toolScopePass=boolValue(body.toolScopePass),dataScopePass=boolValue(body.dataScopePass);
      const passed=candidateScore-baselineScore>=thresholdDelta&&safetyPass&&policyPass&&toolScopePass&&dataScopePass;
      const outcome=passed?"READY_FOR_APPROVAL":"VALIDATION_FAILED",completedAt=new Date().toISOString();
      await db.update(s.skillValidationRuns).set({baselineScore,candidateScore,thresholdDelta,safetyPass,policyPass,toolScopePass,dataScopePass,outcome,reviewedBy:actor.email,completedAt,resultArtifact:textValue(body.resultArtifact,"resultArtifact")}).where(and(eq(s.skillValidationRuns.organizationId,org),eq(s.skillValidationRuns.validationCode,validationCode)));
      const proposalStatus=passed?"ready_for_approval":"validation_failed";
      await db.update(s.skillChangeProposals).set({status:proposalStatus}).where(and(eq(s.skillChangeProposals.organizationId,org),eq(s.skillChangeProposals.proposalCode,validation.proposalCode)));
      await db.update(s.skillVersions).set({validationStatus:passed?"passed":"failed"}).where(and(eq(s.skillVersions.organizationId,org),eq(s.skillVersions.skillCode,validation.skillCode),eq(s.skillVersions.version,validation.candidateVersion)));
      await db.update(s.skillRegistry).set({lifecycleStatus:passed?"ready_for_approval":"proposed"}).where(and(eq(s.skillRegistry.organizationId,org),eq(s.skillRegistry.skillCode,validation.skillCode)));
      result={validationCode,outcome,baselineScore,candidateScore,thresholdDelta};await audit(db,actor,request,"skill.validation_completed","skill",validation.skillCode,result);
    }

    else if(action==="approve_skill_change"||action==="deny_skill_change"){
      if(!roles(actor,["approver"]))throw new Error("ACCESS_DENIED");
      const proposalCode=textValue(body.proposalCode,"proposalCode"),proposal=await proposalFor(db,org,proposalCode);
      if(proposal.proposedBy===actor.email)throw new Error("A proposer cannot approve their own skill change");
      if(!["ready_for_approval","partially_approved"].includes(proposal.status))throw new Error("Proposal is not ready for approval");
      const duplicate=await db.select().from(s.skillApprovals).where(and(eq(s.skillApprovals.organizationId,org),eq(s.skillApprovals.proposalCode,proposalCode),eq(s.skillApprovals.approverEmail,actor.email))).get();
      if(duplicate)throw new Error("This approver has already decided this proposal");
      const outcome=action==="approve_skill_change"?"approved":"denied";
      const approvalCode=code("SKA");
      await db.insert(s.skillApprovals).values({approvalCode,organizationId:org,proposalCode,skillCode:proposal.skillCode,approverEmail:actor.email,approverRole:actor.role,outcome,justification:textValue(body.justification,"justification")});
      if(outcome==="denied"){
        await db.update(s.skillChangeProposals).set({status:"denied"}).where(and(eq(s.skillChangeProposals.organizationId,org),eq(s.skillChangeProposals.proposalCode,proposalCode)));
        await db.update(s.skillVersions).set({approvalStatus:"denied"}).where(and(eq(s.skillVersions.organizationId,org),eq(s.skillVersions.versionCode,proposal.proposedVersionCode)));
        await db.update(s.skillRegistry).set({lifecycleStatus:"proposed"}).where(and(eq(s.skillRegistry.organizationId,org),eq(s.skillRegistry.skillCode,proposal.skillCode)));
        result={proposalCode,status:"denied"};
      }else{
        const skill=await skillFor(db,org,proposal.skillCode);
        const priorApprovals=await db.select().from(s.skillApprovals).where(and(eq(s.skillApprovals.organizationId,org),eq(s.skillApprovals.proposalCode,proposalCode),eq(s.skillApprovals.outcome,"approved")));
        const required=["High","Critical"].includes(skill.riskTier)?2:1;
        const count=priorApprovals.length;
        const status=count>=required?"approved":"partially_approved";
        await db.update(s.skillChangeProposals).set({status}).where(and(eq(s.skillChangeProposals.organizationId,org),eq(s.skillChangeProposals.proposalCode,proposalCode)));
        await db.update(s.skillVersions).set({approvalStatus:status==="approved"?"approved":"pending"}).where(and(eq(s.skillVersions.organizationId,org),eq(s.skillVersions.versionCode,proposal.proposedVersionCode)));
        await db.update(s.skillRegistry).set({lifecycleStatus:status==="approved"?"approved":"ready_for_approval"}).where(and(eq(s.skillRegistry.organizationId,org),eq(s.skillRegistry.skillCode,proposal.skillCode)));
        result={proposalCode,status,approvals:count,required};
      }
      await audit(db,actor,request,`skill.change_${outcome}`,"skill",proposal.skillCode,{proposalCode,approvalCode,outcome});
    }

    else if(action==="deploy_skill_version"){
      if(!roles(actor,["approver","system_owner"]))throw new Error("ACCESS_DENIED");
      const proposalCode=textValue(body.proposalCode,"proposalCode"),proposal=await proposalFor(db,org,proposalCode);
      if(proposal.status!=="approved")throw new Error("Skill change is not fully approved");
      const skill=await skillFor(db,org,proposal.skillCode),version=await versionFor(db,org,proposal.skillCode,proposal.proposedVersion);
      if(version.validationStatus!=="passed"||version.approvalStatus!=="approved")throw new Error("Validated and approved version required");
      const currentDigest=await digest(version.content);
      if(currentDigest!==version.contentDigest)throw new Error("Skill content digest mismatch");
      const validation=await db.select().from(s.skillValidationRuns).where(and(eq(s.skillValidationRuns.organizationId,org),eq(s.skillValidationRuns.proposalCode,proposalCode),eq(s.skillValidationRuns.outcome,"READY_FOR_APPROVAL"))).orderBy(desc(s.skillValidationRuns.id)).limit(1);
      if(!validation[0]||validation[0].candidateDigest!==version.contentDigest)throw new Error("Passing validation for the exact version digest is required");
      const approvals=await db.select().from(s.skillApprovals).where(and(eq(s.skillApprovals.organizationId,org),eq(s.skillApprovals.proposalCode,proposalCode),eq(s.skillApprovals.outcome,"approved")));
      const required=["High","Critical"].includes(skill.riskTier)?2:1;if(approvals.length<required)throw new Error("Required independent approvals are incomplete");
      await db.update(s.skillDeployments).set({status:"superseded"}).where(and(eq(s.skillDeployments.organizationId,org),eq(s.skillDeployments.skillCode,skill.skillCode),eq(s.skillDeployments.status,"active")));
      const deploymentCode=code("SKD");
      const [row]=await db.insert(s.skillDeployments).values({
        deploymentCode,organizationId:org,skillCode:skill.skillCode,approvedVersion:version.version,targetAgent:skill.agentCode,targetSystem:skill.systemCode,
        environment:textValue(body.environment,"environment"),deployedBy:actor.email,approvalReference:approvals.map(x=>x.approvalCode).join(", "),
        validationReference:validation[0].validationCode,priorActiveVersion:skill.currentVersion,rollbackVersion:skill.currentVersion,deploymentDigest:version.contentDigest,status:"active"
      }).returning();
      await db.update(s.skillVersions).set({deploymentStatus:"deployed"}).where(and(eq(s.skillVersions.organizationId,org),eq(s.skillVersions.versionCode,version.versionCode)));
      await db.update(s.skillRegistry).set({currentVersion:version.version,lifecycleStatus:"active"}).where(and(eq(s.skillRegistry.organizationId,org),eq(s.skillRegistry.skillCode,skill.skillCode)));
      result=row;await audit(db,actor,request,"skill.deployed","skill",skill.skillCode,{deploymentCode,version:version.version,digest:version.contentDigest});
    }

    else if(action==="record_skill_performance_review"){
      if(!roles(actor,["reviewer"]))throw new Error("ACCESS_DENIED");
      const skillCode=textValue(body.skillCode,"skillCode"),skill=await skillFor(db,org,skillCode);
      if(!skill.currentVersion)throw new Error("Skill has no active version");
      const conclusion=textValue(body.conclusion,"conclusion");
      if(!["STABLE","IMPROVED","REGRESSION","SAFETY_BREACH"].includes(conclusion))throw new Error("Invalid review conclusion");
      const reviewCode=code("SKR");
      const [row]=await db.insert(s.skillPerformanceReviews).values({
        reviewCode,organizationId:org,skillCode,version:skill.currentVersion,baselineMetric:textValue(body.baselineMetric,"baselineMetric"),
        postDeploymentMetric:textValue(body.postDeploymentMetric,"postDeploymentMetric"),evaluationWindow:textValue(body.evaluationWindow,"evaluationWindow"),
        safetyIncidents:intValue(body.safetyIncidents,"safetyIncidents"),policyViolations:intValue(body.policyViolations,"policyViolations"),
        humanOverrideRate:textValue(body.humanOverrideRate,"humanOverrideRate"),failureRate:textValue(body.failureRate,"failureRate"),
        toolErrorRate:textValue(body.toolErrorRate,"toolErrorRate"),unexpectedBehavior:textValue(body.unexpectedBehavior,"unexpectedBehavior"),
        conclusion,reviewedBy:actor.email,nextReview:textValue(body.nextReview,"nextReview")
      }).returning();
      if(["REGRESSION","SAFETY_BREACH"].includes(conclusion))await db.update(s.skillRegistry).set({lifecycleStatus:"suspended"}).where(and(eq(s.skillRegistry.organizationId,org),eq(s.skillRegistry.skillCode,skillCode)));
      result=row;await audit(db,actor,request,"skill.performance_reviewed","skill",skillCode,{reviewCode,conclusion});
    }

    else if(action==="suspend_skill_version"){
      if(!roles(actor,["approver"]))throw new Error("ACCESS_DENIED");
      const skillCode=textValue(body.skillCode,"skillCode"),skill=await skillFor(db,org,skillCode);
      await db.update(s.skillRegistry).set({lifecycleStatus:"suspended"}).where(and(eq(s.skillRegistry.organizationId,org),eq(s.skillRegistry.skillCode,skillCode)));
      await db.update(s.skillDeployments).set({status:"suspended"}).where(and(eq(s.skillDeployments.organizationId,org),eq(s.skillDeployments.skillCode,skillCode),eq(s.skillDeployments.status,"active")));
      result={skillCode,version:skill.currentVersion,status:"suspended"};await audit(db,actor,request,"skill.suspended","skill",skillCode,{version:skill.currentVersion,reason:textValue(body.reason,"reason")});
    }

    else if(action==="rollback_skill_version"){
      if(!roles(actor,["approver"]))throw new Error("ACCESS_DENIED");
      const skillCode=textValue(body.skillCode,"skillCode"),skill=await skillFor(db,org,skillCode),restoredVersion=textValue(body.restoredVersion,"restoredVersion");
      if(!skill.currentVersion)throw new Error("Skill has no deployed version");
      if(restoredVersion===skill.currentVersion)throw new Error("Rollback target must differ from the current version");
      const target=await versionFor(db,org,skillCode,restoredVersion);
      if(target.approvalStatus!=="approved"||target.validationStatus!=="passed")throw new Error("Rollback target must be a previously validated and approved version");
      const priorDeployment=await db.select().from(s.skillDeployments).where(and(eq(s.skillDeployments.organizationId,org),eq(s.skillDeployments.skillCode,skillCode),eq(s.skillDeployments.approvedVersion,restoredVersion))).orderBy(desc(s.skillDeployments.id)).limit(1);
      if(!priorDeployment[0])throw new Error("Rollback target has never been deployed");
      await db.update(s.skillDeployments).set({status:"rolled_back"}).where(and(eq(s.skillDeployments.organizationId,org),eq(s.skillDeployments.skillCode,skillCode),eq(s.skillDeployments.status,"active")));
      const deploymentCode=code("SKD");
      await db.insert(s.skillDeployments).values({
        deploymentCode,organizationId:org,skillCode,approvedVersion:restoredVersion,targetAgent:skill.agentCode,targetSystem:skill.systemCode,
        environment:priorDeployment[0].environment,deployedBy:actor.email,approvalReference:priorDeployment[0].approvalReference,
        validationReference:priorDeployment[0].validationReference,priorActiveVersion:skill.currentVersion,rollbackVersion:restoredVersion,
        deploymentDigest:target.contentDigest,status:"active"
      });
      const rollbackCode=code("SKB");
      const [row]=await db.insert(s.skillRollbacks).values({
        rollbackCode,organizationId:org,skillCode,trigger:textValue(body.trigger,"trigger"),suspendedVersion:skill.currentVersion,
        restoredVersion,authorizedBy:actor.email,affectedExecutions:textValue(body.affectedExecutions,"affectedExecutions"),
        incidentReference:body.incidentReference?String(body.incidentReference):null,evidencePackageReference:textValue(body.evidencePackageReference,"evidencePackageReference")
      }).returning();
      await db.update(s.skillRegistry).set({currentVersion:restoredVersion,lifecycleStatus:"active"}).where(and(eq(s.skillRegistry.organizationId,org),eq(s.skillRegistry.skillCode,skillCode)));
      result=row;await audit(db,actor,request,"skill.rolled_back","skill",skillCode,{rollbackCode,from:skill.currentVersion,to:restoredVersion});
    }

    else if(action==="retire_skill"){
      if(!roles(actor,["system_owner"]))throw new Error("ACCESS_DENIED");
      const skillCode=textValue(body.skillCode,"skillCode"),skill=await skillFor(db,org,skillCode);
      if(skill.lifecycleStatus==="active")throw new Error("Suspend the active skill before retirement");
      await db.update(s.skillRegistry).set({lifecycleStatus:"retired"}).where(and(eq(s.skillRegistry.organizationId,org),eq(s.skillRegistry.skillCode,skillCode)));
      result={skillCode,status:"retired"};await audit(db,actor,request,"skill.retired","skill",skillCode,{reason:textValue(body.reason,"reason")});
    }

    else if(action==="export_skill_evidence_package"){
      if(!roles(actor,["auditor","reviewer","approver","system_owner"]))throw new Error("ACCESS_DENIED");
      const skillCode=textValue(body.skillCode,"skillCode"),skill=await skillFor(db,org,skillCode);
      const [versions,provenance,proposals,validations,approvals,deployments,reviews,rollbacks,auditRows]=await Promise.all([
        db.select().from(s.skillVersions).where(and(eq(s.skillVersions.organizationId,org),eq(s.skillVersions.skillCode,skillCode))).orderBy(s.skillVersions.id),
        db.select().from(s.skillProvenance).where(and(eq(s.skillProvenance.organizationId,org),eq(s.skillProvenance.skillCode,skillCode))).orderBy(s.skillProvenance.id),
        db.select().from(s.skillChangeProposals).where(and(eq(s.skillChangeProposals.organizationId,org),eq(s.skillChangeProposals.skillCode,skillCode))).orderBy(s.skillChangeProposals.id),
        db.select().from(s.skillValidationRuns).where(and(eq(s.skillValidationRuns.organizationId,org),eq(s.skillValidationRuns.skillCode,skillCode))).orderBy(s.skillValidationRuns.id),
        db.select().from(s.skillApprovals).where(and(eq(s.skillApprovals.organizationId,org),eq(s.skillApprovals.skillCode,skillCode))).orderBy(s.skillApprovals.id),
        db.select().from(s.skillDeployments).where(and(eq(s.skillDeployments.organizationId,org),eq(s.skillDeployments.skillCode,skillCode))).orderBy(s.skillDeployments.id),
        db.select().from(s.skillPerformanceReviews).where(and(eq(s.skillPerformanceReviews.organizationId,org),eq(s.skillPerformanceReviews.skillCode,skillCode))).orderBy(s.skillPerformanceReviews.id),
        db.select().from(s.skillRollbacks).where(and(eq(s.skillRollbacks.organizationId,org),eq(s.skillRollbacks.skillCode,skillCode))).orderBy(s.skillRollbacks.id),
        db.select().from(s.auditEvents).where(and(eq(s.auditEvents.organizationId,org),eq(s.auditEvents.entityType,"skill"),eq(s.auditEvents.entityCode,skillCode))).orderBy(s.auditEvents.id)
      ]);
      result={generatedAt:new Date().toISOString(),skill,versions,provenance,proposals,validations,approvals,deployments,reviews,rollbacks,audit:auditRows};
      await audit(db,actor,request,"skill.evidence_exported","skill",skillCode,{versionCount:versions.length,proposalCount:proposals.length});
    }

    else throw new Error("Unknown skill governance action");

    return Response.json({ok:true,result});
  }catch(e){return fail(e)}
}
