"use client";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
type Field = { name: string; label: string; type?: string; options?: string[] };
type View = {
  key: string;
  title: string;
  intro: string;
  action?: string;
  button?: string;
  fields?: Field[];
  columns: string[];
  endpoint?: string;
};
const views: Record<string, View> = {
  "Data protection purpose & lawfulness": {
    key: "privacyRecords",
    title: "Purpose, lawfulness and data minimisation",
    intro:
      "Document why personal data is processed, the lawful basis, necessity and the minimum data required before processing begins.",
    endpoint: "/api/privacy-governance",
    action: "record_privacy_purpose",
    button: "Record purpose & lawfulness",
    fields: [
      f("systemCode", "AI system or process code"),
      f("subjectCode", "Processing activity code"),
      f("businessPurpose", "Business purpose", "textarea"),
      f("lawfulBasis", "Lawful basis"),
      f("necessityAssessment", "Necessity assessment", "textarea"),
      f("minimisationDecision", "Data minimisation decision", "textarea"),
      f("dataCategories", "Personal data categories"),
      f("jurisdiction", "Jurisdiction"),
      f("owner", "Accountable owner"),
      f("evidenceRefs", "Evidence references", "textarea"),
      f("nextReview", "Next review", "date"),
    ],
    columns: ["entity", "recordCode", "systemCode", "state", "jurisdiction", "owner", "nextReview"],
  },
  "Data inventory & flows": {
    key: "privacyRecords",
    title: "Personal data inventory and flow mapping",
    intro:
      "Trace what personal data is processed, where it originates, every destination and recipient, access roles, transfers and storage locations.",
    endpoint: "/api/privacy-governance",
    action: "record_privacy_data_flow",
    button: "Record data flow",
    fields: [
      f("systemCode", "AI system or process code"),
      f("subjectCode", "Processing activity code"),
      f("dataCategories", "Personal data categories", "textarea"),
      f("source", "Collection source"),
      f("destinations", "Systems, recipients and destinations", "textarea"),
      f("accessRoles", "Who has access", "textarea"),
      f("internationalTransfers", "International transfers"),
      f("storageLocations", "Storage locations"),
      f("jurisdiction", "Jurisdiction"),
      f("owner", "Accountable owner"),
      f("evidenceRefs", "Data maps / evidence references", "textarea"),
      f("nextReview", "Next review", "date"),
    ],
    columns: ["entity", "recordCode", "systemCode", "state", "jurisdiction", "owner", "nextReview"],
  },
  "Data subject rights": {
    key: "privacyRecords",
    title: "Data subject rights operations",
    intro:
      "Track access, correction, objection, deletion and consent-withdrawal requests through completion with evidence.",
    endpoint: "/api/privacy-governance",
    action: "record_privacy_rights",
    button: "Record rights request",
    fields: [
      f("systemCode", "Related system or process code"),
      f("subjectCode", "Request / subject reference"),
      f("rightType", "Right exercised", "select", ["access", "correction", "objection", "deletion", "restriction", "portability", "withdraw_consent"]),
      f("requestStatus", "Request status", "select", ["received", "identity_verified", "in_progress", "fulfilled", "denied", "closed"]),
      f("receivedDate", "Received date", "date"),
      f("deadline", "Response deadline", "date"),
      f("systemsSearched", "Systems searched", "textarea"),
      f("responseEvidence", "Response / completion evidence", "textarea"),
      f("jurisdiction", "Jurisdiction"),
      f("owner", "Case owner"),
      f("evidenceRefs", "Evidence references", "textarea"),
    ],
    columns: ["entity", "recordCode", "subjectCode", "state", "jurisdiction", "owner", "createdAt"],
  },
  "Third-party privacy": {
    key: "privacyRecords",
    title: "Third-party privacy assessment",
    intro:
      "Assess processors and vendors before data sharing, including data scope, agreements, security evidence, transfers and end-of-contract disposition.",
    endpoint: "/api/privacy-governance",
    action: "assess_privacy_third_party",
    button: "Assess third party",
    fields: [
      f("systemCode", "Related system or process code"),
      f("vendorName", "Vendor / processor name"),
      f("dataShared", "Personal data shared", "textarea"),
      f("agreementStatus", "DPA / agreement status"),
      f("securityAssessment", "Security assessment", "textarea"),
      f("subprocessors", "Known subprocessors"),
      f("transferLocations", "Processing / transfer locations"),
      f("exitDisposition", "Return / deletion at contract end", "textarea"),
      f("jurisdiction", "Jurisdiction"),
      f("owner", "Accountable owner"),
      f("evidenceRefs", "DPA / questionnaire / evidence references", "textarea"),
      f("nextReview", "Next review", "date"),
    ],
    columns: ["entity", "recordCode", "systemCode", "state", "jurisdiction", "owner", "nextReview"],
  },
  "Privacy risk assessment": {
    key: "privacyRecords",
    title: "Privacy risk assessment",
    intro:
      "Assess potential harm to individuals, likelihood, severity, existing controls and additional mitigations before deciding whether a DPIA or escalation is required.",
    endpoint: "/api/privacy-governance",
    action: "assess_privacy_risk",
    button: "Assess privacy risk",
    fields: [
      f("systemCode", "AI system or process code"),
      f("subjectCode", "Processing activity code"),
      f("riskToIndividual", "Potential harm to individuals", "textarea"),
      f("likelihood", "Likelihood", "select", ["Low", "Medium", "High", "Very High"]),
      f("impact", "Impact / severity", "select", ["Low", "Medium", "High", "Severe"]),
      f("controls", "Existing controls", "textarea"),
      f("additionalControls", "Additional controls required", "textarea"),
      f("residualRisk", "Residual risk"),
      f("dpiaRequired", "DPIA required?"),
      f("jurisdiction", "Jurisdiction"),
      f("owner", "Risk owner"),
      f("evidenceRefs", "Assessment / evidence references", "textarea"),
      f("nextReview", "Next review", "date"),
    ],
    columns: ["entity", "recordCode", "systemCode", "state", "jurisdiction", "owner", "nextReview"],
  },
  "Privacy risk & DPIA": {
    key: "privacyRecords",
    title: "Privacy risk and DPIA assessment",
    intro:
      "Assess potential harm to individuals and document high-risk processing, safeguards and residual risk before go-live.",
    endpoint: "/api/privacy-governance",
    action: "conduct_privacy_dpia",
    button: "Record DPIA",
    fields: [
      f("systemCode", "AI system or process code"),
      f("subjectCode", "Processing activity code"),
      f("processingDescription", "Processing description", "textarea"),
      f("highRiskTrigger", "Why DPIA / high-risk review is required", "textarea"),
      f("affectedPeople", "People affected"),
      f("riskToIndividual", "Potential harm to individuals", "textarea"),
      f("likelihood", "Likelihood"),
      f("impact", "Impact / severity"),
      f("controls", "Existing controls", "textarea"),
      f("safeguards", "Additional safeguards", "textarea"),
      f("residualRisk", "Residual risk"),
      f("consultationRequired", "Regulator / DPO consultation required?"),
      f("jurisdiction", "Jurisdiction"),
      f("owner", "DPIA owner"),
      f("evidenceRefs", "DPIA / evidence references", "textarea"),
      f("nextReview", "Next review", "date"),
    ],
    columns: ["entity", "recordCode", "systemCode", "state", "jurisdiction", "owner", "nextReview"],
  },
  "AI data protection": {
    key: "privacyRecords",
    title: "AI data protection assessment",
    intro:
      "Determine what personal data enters an AI system, where it goes, whether it is retained or used for training, and whether automated decisions require human review.",
    endpoint: "/api/privacy-governance",
    action: "assess_ai_data_privacy",
    button: "Assess AI data use",
    fields: [
      f("systemCode", "AI system code"),
      f("personalDataInputs", "Personal data inputs", "textarea"),
      f("providerDestinations", "Providers / destinations receiving data", "textarea"),
      f("trainingUse", "Used for model/provider training?"),
      f("promptRetention", "Prompt / input retention"),
      f("exposureRisk", "Potential personal-data exposure", "textarea"),
      f("automatedDecisioning", "Automated decisions involved?"),
      f("humanReview", "Human review / contestability control", "textarea"),
      f("specialCategoryData", "Sensitive / special-category data"),
      f("jurisdiction", "Jurisdiction"),
      f("owner", "Accountable owner"),
      f("evidenceRefs", "Provider terms / assessment evidence", "textarea"),
      f("nextReview", "Next review", "date"),
    ],
    columns: ["entity", "recordCode", "systemCode", "state", "jurisdiction", "owner", "nextReview"],
  },
  "Retention & deletion": {
    key: "privacyRecords",
    title: "Retention and deletion governance",
    intro:
      "Define why data is retained, the approved period, deletion trigger, archive protections and the evidence proving deletion or anonymisation.",
    endpoint: "/api/privacy-governance",
    action: "record_privacy_retention",
    button: "Record retention rule",
    fields: [
      f("systemCode", "System or process code"),
      f("subjectCode", "Dataset / processing activity code"),
      f("retentionPurpose", "Why the data is retained", "textarea"),
      f("retentionPeriod", "Approved retention period"),
      f("deletionTrigger", "Deletion / anonymisation trigger"),
      f("archiveProtection", "Archived-data controls", "textarea"),
      f("deletionEvidence", "How deletion is proven", "textarea"),
      f("jurisdiction", "Jurisdiction"),
      f("owner", "Data owner"),
      f("evidenceRefs", "Retention schedule / evidence references", "textarea"),
      f("nextReview", "Next review", "date"),
    ],
    columns: ["entity", "recordCode", "systemCode", "state", "jurisdiction", "owner", "nextReview"],
  },
  "Privacy governance evidence": {
    key: "privacyRecords",
    title: "Privacy governance and regulator evidence",
    intro:
      "Bind accountable ownership, control evidence, review cadence and regulator-readiness evidence into an auditable governance record.",
    endpoint: "/api/privacy-governance",
    action: "record_privacy_evidence",
    button: "Record governance evidence",
    fields: [
      f("systemCode", "System or process code"),
      f("accountableOwner", "Data / control owner"),
      f("policies", "Applicable policies", "textarea"),
      f("controlEvidence", "Control evidence", "textarea"),
      f("trainingRecords", "Training / awareness evidence"),
      f("breachLogs", "Breach / incident records"),
      f("ropaReference", "Record of Processing Activities reference"),
      f("reviewCadence", "Review cadence"),
      f("regulatorReadiness", "Regulator-ready status"),
      f("jurisdiction", "Jurisdiction"),
      f("owner", "DPO / governance owner"),
      f("evidenceRefs", "Evidence-folder references", "textarea"),
      f("nextReview", "Next review", "date"),
    ],
    columns: ["entity", "recordCode", "systemCode", "state", "jurisdiction", "owner", "nextReview"],
  },
  "Privacy record transitions": {
    key: "privacyRecords",
    title: "Privacy record state transitions",
    intro:
      "Move privacy records through review, approval, remediation, closure or withdrawal with optimistic concurrency and audit evidence.",
    endpoint: "/api/privacy-governance",
    action: "transition_privacy_record",
    button: "Transition privacy record",
    fields: [
      f("entity", "Privacy ledger"),
      f("recordCode", "Record code"),
      f("expectedState", "Current expected state"),
      f("nextState", "Next state"),
    ],
    columns: ["entity", "recordCode", "systemCode", "state", "owner", "updatedAt"],
  },
  "Privacy regulator export": {
    key: "privacyRecords",
    title: "Regulator-ready privacy evidence package",
    intro:
      "Generate a digest-bound institution or system-scoped package containing purpose, flows, rights, vendors, risks, DPIAs, AI-data assessments, retention and governance evidence.",
    endpoint: "/api/privacy-governance",
    action: "export_privacy_evidence_package",
    button: "Export privacy evidence",
    fields: [f("systemCode", "Optional AI system code")],
    columns: ["entity", "recordCode", "systemCode", "state", "owner", "createdAt"],
  },
  "Advanced governance": {
    key: "advancedRecords",
    title: "R2–R12 advanced governance runtime",
    intro:
      "Create governed workflow, source-health, runtime, human-evidence, metering, notification, disclosure, reliance, capture and data-plane records with organization scope, digest binding and audit evidence.",
    endpoint: "/api/advanced-governance",
    action: "create_advanced_record",
    button: "Create advanced record",
    fields: [
      f("entity", "Governance ledger", "select", [
        "governed_workflows",
        "governed_workflow_executions",
        "data_egress_events",
        "governed_source_records",
        "execution_preflights",
        "data_lane_policies",
        "governed_context_records",
        "tool_capability_registry",
        "governance_evaluation_runs",
        "governed_loop_controls",
        "execution_checkpoints",
        "execution_resume_events",
        "sandbox_policy_profiles",
        "governed_extensions",
        "runtime_state_records",
        "human_evidence_requests",
        "human_evidence_interactions",
        "human_evidence_responses",
        "governed_usage_events",
        "governance_entitlements",
        "governance_quota_policies",
        "governance_threshold_events",
        "governance_reconciliations",
        "governed_notification_workflows",
        "notification_instances",
        "notification_delivery_attempts",
        "notification_acknowledgements",
        "notification_escalations",
        "notification_provider_registry",
        "governed_evidence_rooms",
        "evidence_artifacts",
        "evidence_artifact_versions",
        "evidence_disclosure_grants",
        "evidence_disclosure_activities",
        "evidence_request_tasks",
        "evidence_room_freezes",
        "evidence_redaction_jobs",
        "governed_matters",
        "premise_assertions",
        "source_provenance_records",
        "artifact_reliance_records",
        "professional_review_events",
        "release_gate_decisions",
        "source_substitution_events",
        "verification_memory_records",
        "governed_capture_sessions",
        "capture_scope_policies",
        "capture_artifacts",
        "capture_evidence_anchors",
        "capture_storage_profiles",
        "capture_processing_events",
        "capture_integrity_checks",
        "capture_deletion_events",
        "data_plane_policies",
        "privileged_bypass_identities",
        "privileged_bypass_events",
        "realtime_channel_policies",
        "realtime_subscription_events",
        "object_storage_policies",
        "secret_reference_registry",
        "secret_rotation_events",
        "security_lint_rules",
        "security_lint_findings",
        "schema_policy_migration_records",
        "schema_policy_verification_events",
      ]),
      f("subjectCode", "Subject or governed object code"),
      f("parentCode", "Parent or lineage code"),
      f("state", "Initial state"),
      f("dataLane", "Data lane", "select", [
        "PUBLIC",
        "INTERNAL",
        "CONFIDENTIAL",
        "RESTRICTED",
        "LOCAL_ONLY",
        "SOVEREIGN_ONLY",
        "REGULATORY_DISCLOSURE",
      ]),
      f("jurisdiction", "Jurisdiction"),
      f("payload", "Policy/evidence payload as JSON", "textarea"),
      f("effectiveAt", "Effective at", "datetime-local"),
      f("expiresAt", "Expires at", "datetime-local"),
    ],
    columns: [
      "revision",
      "entity",
      "recordCode",
      "subjectCode",
      "state",
      "dataLane",
      "jurisdiction",
      "createdBy",
      "createdAt",
    ],
  },
  "Advanced governance transitions": {
    key: "advancedRecords",
    title: "R2–R12 governed state transitions",
    intro:
      "Move a governed record through an explicit state change with optimistic concurrency, digest rebinding and an immutable audit event.",
    endpoint: "/api/advanced-governance",
    action: "transition_advanced_record",
    button: "Transition advanced record",
    fields: [
      f("entity", "Governance ledger"),
      f("recordCode", "Record code"),
      f("expectedState", "Current expected state"),
      f("nextState", "Next state"),
      f("payload", "Optional payload amendment as JSON", "textarea"),
    ],
    columns: [
      "revision",
      "entity",
      "recordCode",
      "subjectCode",
      "state",
      "contentDigest",
      "createdAt",
    ],
  },
  "Advanced governance export": {
    key: "advancedRecords",
    title: "R2–R12 evidence export",
    intro:
      "Generate an institution-scoped, digest-bound evidence package containing the advanced governance runtime records available to the current role.",
    endpoint: "/api/advanced-governance",
    action: "export_advanced_governance_package",
    button: "Export advanced evidence",
    fields: [],
    columns: [
      "revision",
      "entity",
      "recordCode",
      "subjectCode",
      "state",
      "dataLane",
      "createdAt",
    ],
  },
  "AI systems": {
    key: "systems",
    title: "AI system register",
    intro:
      "An accountable inventory of AI your institution builds, buys and deploys.",
    action: "register_system",
    button: "Register AI system",
    fields: [
      f("name", "System name"),
      f("owner", "Accountable owner"),
      f("region", "Markets"),
      f("purpose", "Business purpose", "textarea"),
      f("risk", "Initial risk", "select", [
        "Low",
        "Medium",
        "High",
        "Critical",
      ]),
      f("model", "Model or provider"),
      f("data", "Data categories"),
      f("hostingLocation", "Hosting location"),
    ],
    columns: ["systemCode", "name", "owner", "region", "risk", "status"],
  },
  "Skill governance": {
    key: "dashboard",
    title: "WikiSkill governance dashboard",
    intro:
      "Track governed agent skills from experience evidence through validation, approval, deployment, monitoring and rollback.",
    endpoint: "/api/skill-governance",
    columns: [
      "activeGovernedSkills",
      "awaitingValidation",
      "awaitingApproval",
      "failedValidations",
      "recentDeployments",
      "performanceRegressions",
      "emergencySuspensions",
      "rollbacks",
      "overdueReviews",
    ],
  },
  "Agent skills": {
    key: "skills",
    title: "Agent skill registry",
    intro:
      "Govern reusable agent behavior as a versioned institutional asset with explicit scope, ownership, risk and review deadlines.",
    endpoint: "/api/skill-governance",
    action: "register_skill",
    button: "Register skill",
    fields: [
      f("systemCode", "Parent AI system code"),
      f("agentCode", "Parent agent code"),
      f("name", "Skill name"),
      f("purpose", "Purpose", "textarea"),
      f("riskTier", "Risk tier", "select", ["Low", "Medium", "High", "Critical"]),
      f("owner", "Accountable owner"),
      f("approvedScope", "Approved execution scope", "textarea"),
      f("approvedTools", "Approved tools, comma separated"),
      f("approvedData", "Approved data classes, comma separated"),
      f("jurisdictions", "Jurisdictions"),
      f("reviewDue", "Review due", "date"),
    ],
    columns: ["skillCode", "name", "agentCode", "currentVersion", "riskTier", "lifecycleStatus", "reviewDue"],
  },
  "Skill provenance": {
    key: "provenance",
    title: "Skill experience and knowledge provenance",
    intro:
      "Preserve the evidence and operational patterns that justify a behavioral change without exposing unrestricted raw traces to the operating agent.",
    endpoint: "/api/skill-governance",
    action: "record_skill_provenance",
    button: "Record provenance",
    fields: [
      f("skillCode", "Skill code"),
      f("evidenceType", "Evidence type"),
      f("evidenceReference", "Evidence reference"),
      f("observationSummary", "Observation summary", "textarea"),
      f("pattern", "Failure or success pattern", "textarea"),
      f("sourceExecutionIds", "Source execution IDs"),
      f("sensitiveDataClassification", "Sensitive data classification"),
      f("retentionRule", "Retention rule"),
    ],
    columns: ["provenanceCode", "skillCode", "evidenceType", "evidenceReference", "recordedBy", "createdAt"],
  },
  "Skill proposals": {
    key: "proposals",
    title: "Skill change proposals",
    intro:
      "Make each proposed behavior change explicit, attributable and reviewable before validation or deployment.",
    endpoint: "/api/skill-governance",
    action: "propose_skill_version",
    button: "Propose skill version",
    fields: [
      f("skillCode", "Skill code"),
      f("version", "Proposed version"),
      f("content", "Complete skill content", "textarea"),
      f("sourceType", "Source type", "select", ["human_authored", "agent_evolved", "imported", "policy_change"]),
      f("changeSummary", "Change summary", "textarea"),
      f("behavioralDelta", "Behavioral delta", "textarea"),
      f("changeRationale", "Change rationale", "textarea"),
      f("provenanceRefs", "Provenance references"),
      f("expectedBenefit", "Expected benefit", "textarea"),
      f("knownRisks", "Known risks", "textarea"),
      f("affectedWorkflows", "Affected workflows"),
      f("affectedTools", "Affected tools, comma separated"),
      f("affectedData", "Affected data, comma separated"),
    ],
    columns: ["proposalCode", "skillCode", "fromVersion", "proposedVersion", "proposedBy", "status", "createdAt"],
  },
  "Skill validation": {
    key: "validations",
    title: "Skill validation gate",
    intro:
      "Bind a candidate version to a fixed digest and benchmark artifact before acceptance testing begins.",
    endpoint: "/api/skill-governance",
    action: "start_skill_validation",
    button: "Start validation",
    fields: [
      f("proposalCode", "Proposal code"),
      f("testSetReference", "Baseline test set reference"),
      f("resultArtifact", "Initial validation artifact reference"),
    ],
    columns: ["validationCode", "proposalCode", "candidateVersion", "candidateDigest", "outcome", "reviewedBy", "completedAt"],
  },
  "Skill validation results": {
    key: "validations",
    title: "Complete skill validation",
    intro:
      "Compare baseline and candidate performance and block candidates that fail safety, policy, tool scope or data scope checks.",
    endpoint: "/api/skill-governance",
    action: "complete_skill_validation",
    button: "Complete validation",
    fields: [
      f("validationCode", "Validation code"),
      f("baselineScore", "Baseline score", "number"),
      f("candidateScore", "Candidate score", "number"),
      f("thresholdDelta", "Minimum required improvement", "number"),
      f("safetyPass", "Safety regression check", "select", ["Pass", "Fail"]),
      f("policyPass", "Policy regression check", "select", ["Pass", "Fail"]),
      f("toolScopePass", "Tool scope check", "select", ["Pass", "Fail"]),
      f("dataScopePass", "Data scope check", "select", ["Pass", "Fail"]),
      f("resultArtifact", "Final result artifact reference"),
    ],
    columns: ["validationCode", "proposalCode", "baselineScore", "candidateScore", "thresholdDelta", "outcome", "reviewedBy", "completedAt"],
  },
  "Skill approvals": {
    key: "approvals",
    title: "Independent skill approvals",
    intro:
      "Authorize validated changes with independent approval and dual authorization for high risk skills.",
    endpoint: "/api/skill-governance",
    action: "approve_skill_change",
    button: "Approve skill change",
    fields: [
      f("proposalCode", "Proposal code"),
      f("justification", "Approval justification", "textarea"),
    ],
    columns: ["approvalCode", "proposalCode", "skillCode", "approverEmail", "outcome", "createdAt"],
  },
  "Skill denials": {
    key: "approvals",
    title: "Deny a skill change",
    intro:
      "Record an explicit independent denial with a retained justification and audit trail.",
    endpoint: "/api/skill-governance",
    action: "deny_skill_change",
    button: "Deny skill change",
    fields: [
      f("proposalCode", "Proposal code"),
      f("justification", "Denial justification", "textarea"),
    ],
    columns: ["approvalCode", "proposalCode", "skillCode", "approverEmail", "outcome", "createdAt"],
  },
  "Skill deployments": {
    key: "deployments",
    title: "Skill deployment ledger",
    intro:
      "Deploy only the exact validated and approved digest and retain the prior version as a governed rollback target.",
    endpoint: "/api/skill-governance",
    action: "deploy_skill_version",
    button: "Deploy approved skill",
    fields: [
      f("proposalCode", "Approved proposal code"),
      f("environment", "Environment", "select", ["production", "staging", "pilot"]),
    ],
    columns: ["deploymentCode", "skillCode", "approvedVersion", "targetAgent", "environment", "deploymentDigest", "status", "createdAt"],
  },
  "Skill performance": {
    key: "reviews",
    title: "Post deployment skill performance",
    intro:
      "Separate approval from proven operating performance and suspend material regressions or safety breaches.",
    endpoint: "/api/skill-governance",
    action: "record_skill_performance_review",
    button: "Record performance review",
    fields: [
      f("skillCode", "Skill code"),
      f("baselineMetric", "Baseline metric"),
      f("postDeploymentMetric", "Post deployment metric"),
      f("evaluationWindow", "Evaluation window"),
      f("safetyIncidents", "Safety incidents", "number"),
      f("policyViolations", "Policy violations", "number"),
      f("humanOverrideRate", "Human override rate"),
      f("failureRate", "Failure rate"),
      f("toolErrorRate", "Tool error rate"),
      f("unexpectedBehavior", "Unexpected behavior", "textarea"),
      f("conclusion", "Conclusion", "select", ["IMPROVED", "STABLE", "REGRESSION", "SAFETY_BREACH"]),
      f("nextReview", "Next review", "date"),
    ],
    columns: ["reviewCode", "skillCode", "version", "conclusion", "reviewedBy", "nextReview", "createdAt"],
  },
  "Skill suspension": {
    key: "deployments",
    title: "Emergency skill suspension",
    intro:
      "Stop an active skill and its active deployment while preserving the reason in the Version 30 audit chain.",
    endpoint: "/api/skill-governance",
    action: "suspend_skill_version",
    button: "Suspend skill",
    fields: [
      f("skillCode", "Skill code"),
      f("reason", "Suspension reason", "textarea"),
    ],
    columns: ["deploymentCode", "skillCode", "approvedVersion", "status", "createdAt"],
  },
  "Skill rollbacks": {
    key: "rollbacks",
    title: "Governed skill rollback",
    intro:
      "Restore a previously validated, approved and deployed version while preserving the trigger and evidence trail.",
    endpoint: "/api/skill-governance",
    action: "rollback_skill_version",
    button: "Rollback skill",
    fields: [
      f("skillCode", "Skill code"),
      f("restoredVersion", "Version to restore"),
      f("trigger", "Rollback trigger", "textarea"),
      f("affectedExecutions", "Affected execution references"),
      f("incidentReference", "Incident reference"),
      f("evidencePackageReference", "Evidence package reference"),
    ],
    columns: ["rollbackCode", "skillCode", "suspendedVersion", "restoredVersion", "authorizedBy", "createdAt"],
  },
  "Skill retirement": {
    key: "skills",
    title: "Retire a governed skill",
    intro:
      "Retire a suspended or inactive skill without deleting its version, provenance, approval or deployment history.",
    endpoint: "/api/skill-governance",
    action: "retire_skill",
    button: "Retire skill",
    fields: [
      f("skillCode", "Skill code"),
      f("reason", "Retirement reason", "textarea"),
    ],
    columns: ["skillCode", "name", "currentVersion", "lifecycleStatus", "reviewDue"],
  },
  "Skill evidence export": {
    key: "skills",
    title: "Skill evidence package",
    intro:
      "Generate the skill specific evidence package with lineage, provenance, validation, approvals, deployment, performance, rollback and audit integrity.",
    endpoint: "/api/skill-governance",
    action: "export_skill_evidence_package",
    button: "Generate skill evidence package",
    fields: [f("skillCode", "Skill code")],
    columns: ["skillCode", "name", "currentVersion", "lifecycleStatus"],
  },
  "AI agents": {
    key: "agents",
    title: "AI agent identity register",
    intro:
      "Give every autonomous agent a unique identity, accountable owner, approved scope, tools, data and lifecycle status.",
    action: "register_agent",
    button: "Register AI agent",
    fields: [
      f("systemCode", "Parent system code"),
      f("name", "Agent name"),
      f("owner", "Responsible owner"),
      f("purpose", "Purpose", "textarea"),
      f("scope", "Permitted scope", "textarea"),
      f("approvedTools", "Approved tools"),
      f("approvedData", "Approved data"),
      f("jurisdiction", "Jurisdiction"),
      f("reviewDue", "Review due", "date"),
    ],
    columns: [
      "agentCode",
      "name",
      "systemCode",
      "owner",
      "jurisdiction",
      "lifecycleStatus",
      "reviewDue",
    ],
  },
  "Continuous authorization": {
    key: "accessGrants",
    title: "Continuous authorization",
    intro:
      "Request, approve, monitor, review and revoke time-bound least-privilege access for every AI agent.",
    action: "request_access",
    button: "Request access",
    fields: [
      f("agentCode", "Agent code"),
      f("resource", "Resource or system"),
      f("permission", "Permission"),
      f("purpose", "Business purpose", "textarea"),
      f(
        "leastPrivilegeBasis",
        "Why this is the minimum access required",
        "textarea",
      ),
      f("startsAt", "Starts", "datetime-local"),
      f("expiresAt", "Expires", "datetime-local"),
    ],
    columns: [
      "grantCode",
      "agentCode",
      "resource",
      "permission",
      "requestedBy",
      "status",
      "expiresAt",
      "lastReviewedAt",
      "actions",
    ],
  },
  "Agency & adoption": {
    key: "agencyAssessments",
    title: "Institutional agency and critical-infrastructure gate",
    intro:
      "Treat governance as operational infrastructure: define the public problem, test whether AI is appropriate, verify the supply chain, prove resilience, set sovereign conditions and preserve the authority to refuse, suspend or discontinue.",
    action: "evaluate_agency_gate",
    button: "Evaluate AI proposal",
    fields: [
      f("proposalTitle", "Proposal title"),
      f("sponsoringInstitution", "Sponsoring institution"),
      f("publicProblem", "Public problem to be solved", "textarea"),
      f("affectedCommunities", "Affected communities", "textarea"),
      f("aiAppropriateness", "AI appropriateness assessment", "select", [
        "Complete",
        "Missing",
      ]),
      f("nonAiAlternative", "Non-AI alternative assessment", "select", [
        "Complete",
        "Missing",
      ]),
      f("criticalityClass", "Operational criticality", "select", [
        "Standard",
        "Important",
        "Critical infrastructure",
      ]),
      f("vendorName", "Vendor or technology provider"),
      f(
        "vendorClaimsAssessment",
        "Independent verification of vendor claims",
        "select",
        ["Complete", "Missing"],
      ),
      f(
        "supplierDependencies",
        "Models, infrastructure, data and embedded-AI dependencies",
        "textarea",
      ),
      f(
        "serviceContinuityPlan",
        "Resilience, fallback and service-continuity evidence",
        "select",
        ["Complete", "Missing"],
      ),
      f(
        "governanceFrameworkMap",
        "Recognized governance framework mapping (for example NIST AI RMF)",
        "select",
        ["Complete", "Missing"],
      ),
      f(
        "sovereignConditions",
        "Institutional negotiation and sovereign conditions",
        "textarea",
      ),
      f(
        "dataHostingRequirements",
        "Data sovereignty and hosting requirements",
        "textarea",
      ),
      f("independentAssessment", "Independent technical assessment", "select", [
        "Complete",
        "Missing",
      ]),
      f(
        "communityEvidence",
        "Citizen and affected-community evidence",
        "select",
        ["Complete", "Missing"],
      ),
      f("exitPlan", "Refusal, suspension and exit plan", "select", [
        "Complete",
        "Missing",
      ]),
      f("proposedDecision", "Proposed institutional decision", "select", [
        "Adopt",
        "Refuse",
      ]),
    ],
    columns: [
      "decisionCode",
      "proposalTitle",
      "criticalityClass",
      "vendorName",
      "readinessScore",
      "proposedDecision",
      "outcome",
      "approvedBy",
      "actions",
    ],
  },
  "Strategic foresight": {
    key: "foresightScenarios",
    title: "AI futures and national resilience planning",
    intro:
      "Prepare before certainty arrives. Stress-test institutional authority, critical decisions and continuity plans across five advanced-AI futures.",
    action: "create_foresight_scenario",
    button: "Create scenario plan",
    fields: [
      f("scenario", "AI future", "select", [
        "AI Stall",
        "Precarious Precipice",
        "Hypercompetition",
        "Hyperpower",
        "Rogue ASI",
      ]),
      f("timeHorizon", "Planning horizon"),
      f("capabilityPace", "Pace of AI capability gains", "select", [
        "Slow",
        "Uneven",
        "Rapid",
        "Extreme",
      ]),
      f("humanControllability", "Human controllability", "select", [
        "High",
        "Degrading",
        "Low",
        "Lost",
      ]),
      f("frontierConcentration", "Control of frontier capability", "select", [
        "Distributed",
        "Few actors",
        "Single actor",
        "Unknown",
      ]),
      f("criticalDomains", "Protected decision domains", "textarea"),
      f(
        "institutionalImpact",
        "Employment, institutional and infrastructure impact",
        "textarea",
      ),
      f(
        "leadingIndicators",
        "Leading indicators and trigger thresholds",
        "textarea",
      ),
      f(
        "preventiveControls",
        "Checks, standards and preventive controls",
        "textarea",
      ),
      f(
        "continuityResponse",
        "Continuity, shutdown and recovery response",
        "textarea",
      ),
      f(
        "internationalDependencies",
        "Cross-border dependencies and governance mechanisms",
        "textarea",
      ),
      f("decisionOwner", "Named executive or public authority"),
      f("reviewDate", "Next scenario review", "date"),
    ],
    columns: [
      "scenarioCode",
      "scenario",
      "timeHorizon",
      "capabilityPace",
      "humanControllability",
      "frontierConcentration",
      "decisionOwner",
      "reviewDate",
      "status",
    ],
  },
  "Implementation capacity": {
    key: "implementationAssessments",
    title: "Strategy-to-implementation capacity gate",
    intro:
      "Measure whether AI governance exists beyond paper: funded institutions, skilled staff, enforceable mandates, regional reach, inspections, complaint handling and public evidence of results.",
    action: "assess_implementation_capacity",
    button: "Assess implementation",
    fields: [
      f("jurisdiction", "Country or jurisdiction"),
      f("responsibleInstitution", "Responsible regulator or institution"),
      f("legalMandate", "Clear statutory or executive mandate", "select", [
        "Complete",
        "Partial",
        "Missing",
      ]),
      f("ringFencedBudget", "Ring-fenced implementation budget", "select", [
        "Funded",
        "Partially funded",
        "Missing",
      ]),
      f("staffingPlan", "Approved staffing and recruitment plan", "select", [
        "Complete",
        "Partial",
        "Missing",
      ]),
      f(
        "technicalCapability",
        "Technical, audit and investigative capability",
        "select",
        ["Operational", "Developing", "Missing"],
      ),
      f(
        "enforcementPowers",
        "Enforcement, sanction and suspension powers",
        "select",
        ["Operational", "Limited", "Missing"],
      ),
      f("regionalReach", "Operational reach beyond the capital", "select", [
        "National",
        "Partial",
        "Capital only",
      ]),
      f(
        "complaintChannel",
        "Accessible complaint and redress channel",
        "select",
        ["Operational", "Developing", "Missing"],
      ),
      f(
        "inspectionProgramme",
        "Risk-based inspection or supervision programme",
        "select",
        ["Operational", "Planned", "Missing"],
      ),
      f("procurementControls", "Mandatory AI procurement controls", "select", [
        "Operational",
        "Draft",
        "Missing",
      ]),
      f(
        "implementationMilestones",
        "Funded implementation milestones",
        "textarea",
      ),
      f("performanceIndicators", "Measurable impact indicators", "textarea"),
      f("publicReporting", "Public reporting and transparency", "select", [
        "Operational",
        "Irregular",
        "Missing",
      ]),
      f(
        "evidenceReference",
        "Published evidence, budget or enforcement reference",
        "textarea",
      ),
      f("reviewDate", "Next capacity review", "date"),
    ],
    columns: [
      "assessmentCode",
      "jurisdiction",
      "responsibleInstitution",
      "readinessScore",
      "outcome",
      "assessedBy",
      "reviewDate",
    ],
  },
  "Workforce absorption": {
    key: "workforceAbsorptionAssessments",
    title: "AI workforce absorption and institutional-readiness gate",
    intro:
      "Measure whether AI training converts into paid work, local operational control and retained capability—not certificates without opportunity.",
    action: "assess_workforce_absorption",
    button: "Assess workforce absorption",
    fields: [
      f("jurisdiction", "Country or jurisdiction"),
      f("institution", "Employer, agency or infrastructure operator"),
      f("youthCohort", "Target youth or graduate cohort"),
      f("skillsPipeline", "Verified AI and digital-skills pipeline", "select", [
        "Operational",
        "Developing",
        "Missing",
      ]),
      f("entryLevelRoles", "Funded entry-level AI or digital roles", "select", [
        "Funded",
        "Planned",
        "Missing",
      ]),
      f(
        "paidInternships",
        "Paid internships, apprenticeships or graduate placements",
        "select",
        ["Operational", "Limited", "Missing"],
      ),
      f(
        "experienceBarrier",
        "Obsolete experience requirements removed",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f("skillsBasedHiring", "Skills-based assessment and hiring", "select", [
        "Operational",
        "Partial",
        "Missing",
      ]),
      f("remoteWorkPolicy", "Remote and hybrid work pathway", "select", [
        "Operational",
        "Limited",
        "Missing",
      ]),
      f(
        "managerReadiness",
        "Managers trained for AI-enabled and Gen Z teams",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f(
        "outputBasedPerformance",
        "Performance measured by output and impact",
        "select",
        ["Operational", "Partial", "Missing"],
      ),
      f(
        "localOperationsRoles",
        "Local roles to operate, secure and innovate infrastructure",
        "select",
        ["Funded", "Planned", "Missing"],
      ),
      f(
        "retentionPathway",
        "Career progression and retention pathway",
        "select",
        ["Operational", "Partial", "Missing"],
      ),
      f("regionalAccess", "Access beyond major cities", "select", [
        "National",
        "Partial",
        "Capital only",
      ]),
      f(
        "conversionTarget",
        "Twelve-month training-to-paid-work conversion target",
        "textarea",
      ),
      f(
        "outcomeEvidence",
        "Placements, retention and wage outcome evidence",
        "textarea",
      ),
      f("reviewDate", "Next absorption review", "date"),
    ],
    columns: [
      "assessmentCode",
      "jurisdiction",
      "institution",
      "readinessScore",
      "outcome",
      "assessedBy",
      "reviewDate",
    ],
  },
  "Infrastructure dividend": {
    key: "infrastructureDividendAssessments",
    title: "AI infrastructure public-dividend gate",
    intro:
      "Require every AI megawatt to strengthen the public system through additional power, honest cost allocation, shared compute, local capability and transparent, enforceable public-benefit terms.",
    action: "assess_infrastructure_dividend",
    button: "Assess infrastructure project",
    fields: [
      f("projectName", "AI infrastructure project"),
      f("jurisdiction", "Country or jurisdiction"),
      f("operator", "Project operator"),
      f("plannedMegawatts", "Planned megawatts", "number"),
      f(
        "additionalGeneration",
        "New generation, storage or grid capacity",
        "select",
        ["Contracted", "Partial", "None"],
      ),
      f("gridSupport", "Public-grid support during stress", "select", [
        "Contracted",
        "Possible",
        "None",
      ]),
      f(
        "networkCostsAssigned",
        "Network upgrades and balancing costs assigned to project",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f(
        "householdTariffProtection",
        "Household and small-business tariff protection",
        "select",
        ["Contracted", "Partial", "Missing"],
      ),
      f(
        "sharedComputeCommitment",
        "Compute allocation for universities, startups, public agencies and SMEs",
        "textarea",
      ),
      f(
        "localSkillsPlan",
        "Local technicians, cybersecurity, energy and research skills plan",
        "select",
        ["Funded", "Partial", "Missing"],
      ),
      f(
        "localProcurementTarget",
        "Enforceable local procurement target",
        "textarea",
      ),
      f(
        "powerDisclosure",
        "Expected and actual power-demand disclosure",
        "select",
        ["Public", "Partial", "Missing"],
      ),
      f("waterDisclosure", "Water-use and cooling disclosure", "select", [
        "Public",
        "Partial",
        "Missing",
      ]),
      f(
        "emissionsDisclosure",
        "Emissions and energy-source disclosure",
        "select",
        ["Public", "Partial", "Missing"],
      ),
      f(
        "publicBenefitTerms",
        "Public-benefit obligations in permits, incentives and financing",
        "textarea",
      ),
      f(
        "contractEnforcement",
        "Audit, penalty and clawback mechanisms",
        "select",
        ["Enforceable", "Limited", "Missing"],
      ),
      f("reviewDate", "Next public-dividend review", "date"),
    ],
    columns: [
      "assessmentCode",
      "projectName",
      "jurisdiction",
      "plannedMegawatts",
      "readinessScore",
      "outcome",
      "assessedBy",
      "reviewDate",
    ],
  },
  "Africa-first design": {
    key: "africaFirstAssessments",
    title: "Africa-first governance design gate",
    intro:
      "Test collective wellbeing, local-language performance, low-connectivity operation, data sovereignty, regional interoperability and proportionate controls before importing a foreign framework.",
    action: "assess_africa_first",
    button: "Assess Africa-first design",
    fields: [
      f("systemCode", "AI system code"),
      f("jurisdiction", "Country or jurisdiction"),
      f(
        "ubuntuImpact",
        "Collective-wellbeing and Ubuntu impact assessment",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f(
        "communityResources",
        "Impact on shared community resources",
        "textarea",
      ),
      f(
        "laborImpact",
        "Formal and informal labor-ecosystem impact",
        "textarea",
      ),
      f(
        "intergenerationalImpact",
        "Intergenerational and long-term community impact",
        "textarea",
      ),
      f("localLanguages", "Languages required for affected users"),
      f(
        "languagePerformanceEvidence",
        "Performance and disparity evidence for each required language",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f(
        "lowConnectivityDesign",
        "Architecture for low-connectivity environments",
        "select",
        ["Operational", "Partial", "Missing"],
      ),
      f(
        "mobileOfflineSupport",
        "Mobile-first and offline workflow support",
        "select",
        ["Operational", "Partial", "Missing"],
      ),
      f(
        "localDataControl",
        "Local control of training and operational data",
        "select",
        ["Sovereign", "Contractually protected", "Offshore uncontrolled"],
      ),
      f(
        "foreignDependencyPlan",
        "Foreign cloud, model and vendor dependency exit plan",
        "textarea",
      ),
      f(
        "regionalInteroperability",
        "Alignment with AU and applicable regional-community rules",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f("smeProportionality", "Proportionate control path for SMEs", "select", [
        "Defined",
        "Partial",
        "Missing",
      ]),
      f(
        "hypeChallenge",
        "Documented non-AI alternative and vendor-hype challenge",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f("reviewDate", "Next Africa-first review", "date"),
    ],
    columns: [
      "assessmentCode",
      "systemCode",
      "jurisdiction",
      "readinessScore",
      "outcome",
      "assessedBy",
      "reviewDate",
    ],
  },
  "Sovereign resilience": {
    key: "sovereignResilienceAssessments",
    title: "Sovereign AI resilience gate",
    intro:
      "Prove that a critical AI service can withstand provider failure, price shock, export restriction or contract termination while the institution retains control of its data, operations and evidence.",
    action: "assess_sovereign_resilience",
    button: "Assess sovereign resilience",
    fields: [
      f("systemCode", "Registered AI system code"),
      f("jurisdiction", "Country or jurisdiction"),
      f("criticalService", "Essential service or institutional function", "textarea"),
      f("primaryProvider", "Primary model, cloud or platform provider"),
      f("providerConcentration", "Provider concentration", "select", [
        "Diversified",
        "Moderate",
        "Single-provider critical",
      ]),
      f("verifiedAlternatives", "Verified replacement providers or internal alternatives", "select", [
        "Multiple verified",
        "One verified",
        "None",
      ]),
      f("dataHostingJurisdictions", "All data-hosting and processing jurisdictions", "textarea"),
      f("dataResidencyControl", "Enforceable control over data location and transfer", "select", [
        "Enforceable",
        "Partial",
        "Missing",
      ]),
      f("dataExportTest", "Full data, prompt, log and configuration export test", "select", [
        "Passed",
        "Partial",
        "Failed",
        "Not tested",
      ]),
      f("workflowPortability", "Workflow reconstruction on an alternative service", "select", [
        "Demonstrated",
        "Partial",
        "Missing",
      ]),
      f("contractAuditRights", "Contractual audit and evidence rights", "select", [
        "Enforceable",
        "Limited",
        "Missing",
      ]),
      f("contractExitRights", "Termination, transition assistance and deletion rights", "select", [
        "Enforceable",
        "Limited",
        "Missing",
      ]),
      f("continuityPlan", "Continuity and recovery exercise", "select", [
        "Tested",
        "Documented only",
        "Missing",
      ]),
      f("recoveryTarget", "Approved recovery-time and recovery-point targets"),
      f("fallbackCapability", "Alternative provider, local model or manual fallback", "select", [
        "Operational",
        "Partial",
        "Missing",
      ]),
      f("criticalDependencies", "Models, cloud, chips, connectivity, data and subprocessor dependencies", "textarea"),
      f("localLanguages", "Languages required for affected users, or Not applicable"),
      f("languageValidation", "Independent performance evidence for required languages", "select", [
        "Complete",
        "Partial",
        "Missing",
        "Not applicable",
      ]),
      f("knowledgeTransfer", "Funded local capability and knowledge-transfer plan", "select", [
        "Funded",
        "Partial",
        "Missing",
      ]),
      f("evidenceReference", "Test results, contract clauses and continuity evidence reference", "textarea"),
      f("reviewDate", "Next resilience review", "date"),
    ],
    columns: [
      "assessmentCode",
      "systemCode",
      "jurisdiction",
      "primaryProvider",
      "readinessScore",
      "outcome",
      "failedChecks",
      "assessedBy",
      "reviewDate",
    ],
  },
  "Recovery exercises": {
    key: "recoveryExercises",
    title: "Backup and recovery exercises",
    intro:
      "Record measured restoration results. Recovery is not treated as proven until data integrity, audit-chain integrity and approved recovery targets all pass.",
    action: "record_recovery_exercise",
    button: "Record recovery exercise",
    fields: [
      f("systemCode", "Registered AI system code"),
      f("exerciseDate", "Exercise date", "date"),
      f("backupMethod", "Recovery source", "select", [
        "D1 Time Travel",
        "Encrypted SQL export",
        "Both",
      ]),
      f("restoreEnvironment", "Isolated restoration environment"),
      f("targetRpoMinutes", "Target recovery point in minutes", "number"),
      f("actualDataLossMinutes", "Measured data loss in minutes", "number"),
      f("targetRtoMinutes", "Target recovery time in minutes", "number"),
      f("actualRecoveryMinutes", "Measured recovery time in minutes", "number"),
      f("restoreIntegrity", "Restored data integrity", "select", [
        "Passed",
        "Failed",
      ]),
      f("auditChainVerification", "Restored audit-chain verification", "select", [
        "Passed",
        "Failed",
      ]),
      f("evidenceReference", "Export manifest, logs and verification evidence", "textarea"),
    ],
    columns: [
      "exerciseCode",
      "systemCode",
      "exerciseDate",
      "backupMethod",
      "actualDataLossMinutes",
      "actualRecoveryMinutes",
      "outcome",
      "failedChecks",
      "performedBy",
    ],
  },
  "Agrifood supply chains": {
    key: "agrifoodSupplyAssessments",
    title: "AI-enabled agrifood supply-chain gate",
    intro:
      "Govern AI, blockchain, digital procurement and smart logistics as one accountable system—linking digital records to physical lots while protecting farmers, food security and market transparency.",
    action: "assess_agrifood_supply",
    button: "Assess agrifood programme",
    fields: [
      f("programmeName", "Programme or platform name"),
      f("jurisdiction", "Country or corridor"),
      f("commodity", "Commodity or product"),
      f("farmerIdentity", "Verified producer identity and consent", "select", [
        "Complete",
        "Partial",
        "Missing",
      ]),
      f("lotTraceability", "Farm-to-buyer lot traceability", "select", [
        "Operational",
        "Partial",
        "Missing",
      ]),
      f(
        "physicalDigitalLink",
        "Tamper-evident link between digital record and physical lot",
        "select",
        ["Verified", "Partial", "Missing"],
      ),
      f(
        "dataOwnership",
        "Farmer data ownership, access and reuse terms",
        "select",
        ["Defined", "Partial", "Missing"],
      ),
      f(
        "algorithmicProcurement",
        "AI procurement decision rules and bias testing",
        "select",
        ["Auditable", "Partial", "Opaque"],
      ),
      f(
        "priceTransparency",
        "Price, deductions, fees and payment terms visible to farmers",
        "select",
        ["Transparent", "Partial", "Opaque"],
      ),
      f(
        "smartContractControls",
        "Blockchain or smart-contract code audit and emergency pause",
        "select",
        ["Controlled", "Partial", "Missing"],
      ),
      f(
        "logisticsEvidence",
        "Pickup, cold-chain, custody and delivery evidence",
        "select",
        ["End-to-end", "Partial", "Missing"],
      ),
      f(
        "foodLossBaseline",
        "Baseline and target for measured food-loss reduction",
        "textarea",
      ),
      f(
        "farmerEarningsMeasure",
        "Baseline and target for farmer income and payment speed",
        "textarea",
      ),
      f(
        "offlineAccess",
        "Offline and assisted access for producers",
        "select",
        ["Operational", "Partial", "Missing"],
      ),
      f(
        "disputeResolution",
        "Accessible dispute and correction process",
        "select",
        ["Operational", "Partial", "Missing"],
      ),
      f(
        "humanOverride",
        "Named authority to stop or correct automated procurement/logistics decisions",
        "select",
        ["Defined", "Partial", "Missing"],
      ),
      f("reviewDate", "Next programme review", "date"),
    ],
    columns: [
      "assessmentCode",
      "programmeName",
      "jurisdiction",
      "commodity",
      "readinessScore",
      "outcome",
      "assessedBy",
      "reviewDate",
    ],
  },
  "Deployment gate": {
    key: "deploymentGates",
    title: "Pre-deployment governance gate",
    intro:
      "No AI system can become active until institutional adoption is authorized and accountability, risk, validation, bias testing, logging, incident response and shutdown authority are proven.",
    action: "evaluate_deployment_gate",
    button: "Evaluate deployment",
    fields: [
      f("systemCode", "System code"),
      f("agencyDecisionCode", "Authorized agency decision code"),
      f("accountableOwner", "Named accountable owner"),
      f("riskTier", "Risk tier", "select", [
        "Low",
        "Medium",
        "High",
        "Critical",
      ]),
      f(
        "autonomyBoundary",
        "Autonomous decisions and prohibited actions",
        "textarea",
      ),
      f("humanApproval", "Human approval requirement", "select", [
        "Complete",
        "Missing",
      ]),
      f("outputValidation", "Output validation evidence", "select", [
        "Complete",
        "Missing",
      ]),
      f("biasTesting", "Bias testing evidence", "select", [
        "Complete",
        "Missing",
      ]),
      f("loggingPlan", "Logging plan", "select", ["Complete", "Missing"]),
      f("incidentPlan", "Unexpected-behavior response plan", "select", [
        "Complete",
        "Missing",
      ]),
      f("shutdownAuthority", "Named shutdown authority"),
    ],
    columns: [
      "gateCode",
      "systemCode",
      "agencyDecisionCode",
      "riskTier",
      "readinessScore",
      "outcome",
      "assessedBy",
      "approvedBy",
      "actions",
    ],
  },
  "Model versions": {
    key: "models",
    title: "Model version ledger",
    intro: "Preserve model lineage, provider changes and deployment history.",
    action: "model_version",
    button: "Add model version",
    fields: [
      f("systemCode", "System code"),
      f("version", "Version"),
      f("provider", "Provider"),
      f("changeSummary", "Change summary", "textarea"),
    ],
    columns: [
      "systemCode",
      "version",
      "provider",
      "validationStatus",
      "createdAt",
    ],
  },
  "Risk reviews": {
    key: "risks",
    title: "Risk and impact assessments",
    intro:
      "Assess inherent and residual risk with a named, timestamped reviewer.",
    action: "risk_assessment",
    button: "Start risk review",
    fields: [
      f("systemCode", "System code"),
      f("inherentRisk", "Inherent risk"),
      f("residualRisk", "Residual risk"),
      f("score", "Score", "number"),
      f("rationale", "Rationale", "textarea"),
    ],
    columns: [
      "systemCode",
      "inherentRisk",
      "residualRisk",
      "score",
      "status",
      "assessorEmail",
    ],
  },
  "Vendor risk": {
    key: "vendorRisk",
    title: "Vendor and third-party AI risk register",
    intro:
      "Continuously govern model providers, hosting partners, processors and embedded AI suppliers through evidence, contract rights, subprocessor visibility and recurring review.",
    action: "vendor_risk",
    button: "Register vendor risk",
    fields: [
      f("vendorName", "Vendor name"),
      f("serviceType", "Service type", "select", [
        "Model provider",
        "Hosting",
        "Data processor",
        "Consulting",
        "Embedded AI",
        "Other",
      ]),
      f("aiInvolvement", "AI involvement", "select", [
        "Core model",
        "Embedded component",
        "Infrastructure",
        "Advisory",
      ]),
      f("linkedSystems", "Linked AI system codes"),
      f(
        "certifications",
        "SOC 2, ISO 42001, ISO 27001 or other certifications",
      ),
      f("certificationEvidence", "Certification evidence reference"),
      f("subprocessors", "Subprocessors, roles and jurisdictions", "textarea"),
      f("rightToAudit", "Contractual right to audit", "select", [
        "Enforceable",
        "Limited",
        "Missing",
      ]),
      f("contractEnd", "Contract end date", "date"),
      f("inherentRisk", "Inherent risk", "select", [
        "Low",
        "Moderate",
        "High",
        "Critical",
      ]),
      f("residualRisk", "Residual risk", "select", [
        "Low",
        "Moderate",
        "High",
        "Critical",
      ]),
      f(
        "vendorClaimsVerified",
        "Vendor claims independently verified",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f("continuityPlan", "Exit and service-continuity plan", "textarea"),
      f("riskScore", "Risk score", "number"),
      f("nextReview", "Next vendor review", "date"),
    ],
    columns: [
      "vendorCode",
      "vendorName",
      "serviceType",
      "residualRisk",
      "riskScore",
      "status",
      "assessedBy",
      "nextReview",
    ],
  },
  "AI competency": {
    key: "competencyRecords",
    title: "AI literacy and role-competency records",
    intro:
      "Prove that every person operating, reviewing, approving or auditing AI has current, role-specific competence and refresh evidence.",
    action: "competency_record",
    button: "Record competency",
    fields: [
      f("personEmail", "Staff member email", "email"),
      f("governanceRole", "Governance role", "select", [
        "admin",
        "system_owner",
        "reviewer",
        "approver",
        "auditor",
      ]),
      f("trainingName", "Training or competency requirement"),
      f("competencyLevel", "Demonstrated level", "select", [
        "Foundational",
        "Operational",
        "Advanced",
        "Expert",
      ]),
      f("assessmentMethod", "Assessment method"),
      f("completedAt", "Completion date", "date"),
      f("expiresAt", "Refresh or expiry date", "date"),
      f("evidenceReference", "Certificate or assessment evidence"),
    ],
    columns: [
      "recordCode",
      "personEmail",
      "governanceRole",
      "trainingName",
      "competencyLevel",
      "status",
      "expiresAt",
    ],
  },
  "Model retirement": {
    key: "modelRetirements",
    title: "Model retirement and decommissioning workflow",
    intro:
      "Control model end-of-life through approval, dependency notification, data retention, fallback readiness and preserved audit evidence.",
    action: "model_retirement",
    button: "Plan model retirement",
    fields: [
      f("systemCode", "AI system code"),
      f("modelVersion", "Model version"),
      f("reason", "Retirement reason", "select", [
        "Superseded",
        "Vendor deprecated",
        "Risk finding",
        "Business decision",
        "Regulatory change",
      ]),
      f("retirementDate", "Retirement date", "date"),
      f("dataRetentionPlan", "Data retention and deletion plan", "textarea"),
      f(
        "dependencyNotifications",
        "Systems and stakeholders requiring notification",
        "textarea",
      ),
      f("fallbackModel", "Fallback model or manual process"),
      f("evidenceArchive", "Evidence archive reference"),
    ],
    columns: [
      "retirementCode",
      "systemCode",
      "modelVersion",
      "reason",
      "retirementDate",
      "status",
      "requestedBy",
      "approvedBy",
      "actions",
    ],
  },
  "Confidential reporting": {
    key: "confidentialReports",
    title: "Confidential AI-governance reporting channel",
    intro:
      "Provide a protected, minimally identifying route to report governance bypass, override abuse, data misuse or retaliation and track institutional response.",
    action: "confidential_report",
    button: "Submit confidential report",
    fields: [
      f("category", "Concern category", "select", [
        "Governance bypass",
        "Guardrail override abuse",
        "Data misuse",
        "Retaliation",
        "Safety concern",
        "Other",
      ]),
      f("systemCode", "AI system code or Not applicable"),
      f(
        "description",
        "Describe the concern without identifying yourself",
        "textarea",
      ),
      f("retaliationConcern", "Retaliation concern", "select", [
        "Yes",
        "No",
        "Unsure",
      ]),
    ],
    columns: ["trackingCode", "category", "systemCode", "status", "createdAt"],
  },
  "Compliance monitoring": {
    key: "complianceDashboard",
    title: "Continuous compliance monitoring",
    intro:
      "A rolling view of overdue reviews, expiring authorizations, aging incidents, competency renewals, high-risk vendors and unresolved strategic dependency.",
    columns: [
      "generatedAt",
      "overdueReviews",
      "expiringAuthorizations",
      "openIncidents",
      "expiredCompetencies",
      "highRiskVendors",
      "strategicDependencies",
    ],
  },
  "Board reporting": {
    key: "boardReport",
    title: "Board and executive AI-governance report",
    intro:
      "A concise, non-technical oversight package showing portfolio risk, deployment status, incidents, vendor exposure, strategic dependency and actions requiring executive attention.",
    columns: [
      "period",
      "totalSystems",
      "criticalSystems",
      "approvedDeployments",
      "openIncidents",
      "highRiskVendors",
      "strategicDependencies",
      "actionsRequired",
    ],
  },
  "Control library": {
    key: "controls",
    title: "Institutional control library",
    intro:
      "Translate policies and jurisdiction requirements into versioned, testable controls.",
    action: "control",
    button: "Create control",
    fields: [
      f("title", "Control title"),
      f("jurisdiction", "Jurisdiction"),
      f("category", "Category"),
      f("requirement", "Requirement", "textarea"),
      f("evidenceRequired", "Evidence required"),
      f("version", "Version"),
    ],
    columns: [
      "controlCode",
      "title",
      "jurisdiction",
      "category",
      "version",
      "status",
    ],
  },
  "Legal source register": {
    key: "legalSources",
    title: "African legal and policy evidence register",
    intro:
      "Link every governance requirement to an authoritative source, record its jurisdiction and legal weight, map it to operational controls and review it before the evidence becomes stale.",
    action: "register_legal_source",
    button: "Register legal source",
    fields: [
      f("title", "Report, law, strategy or guidance title"),
      f("publisher", "Publisher or issuing authority"),
      f("documentType", "Document type", "select", [
        "Law",
        "Regulation",
        "Strategy",
        "Guidance",
        "Court decision",
        "Research report",
        "Policy analysis",
      ]),
      f("jurisdiction", "Country, region or continental scope"),
      f("publicationYear", "Publication year", "number"),
      f("sourceUrl", "Authoritative source URL", "url"),
      f("frameworkArea", "Governance area", "select", [
        "AI governance",
        "Data protection",
        "Judicial systems",
        "Digital sovereignty",
        "Institutional capacity",
        "Cross-border cooperation",
        "Legal technology",
      ]),
      f("applicability", "How the source applies", "textarea"),
      f("mappedControls", "Control codes or workspaces supported", "textarea"),
      f(
        "evidenceNotes",
        "Key evidence and implementation implications",
        "textarea",
      ),
      f("authorityLevel", "Legal or evidentiary weight", "select", [
        "Binding",
        "Official non-binding",
        "Judicial authority",
        "Independent research",
      ]),
      f("verifiedOn", "Date source was verified", "date"),
      f("nextReview", "Next legal-source review", "date"),
    ],
    columns: [
      "sourceCode",
      "title",
      "publisher",
      "documentType",
      "jurisdiction",
      "publicationYear",
      "authorityLevel",
      "status",
      "nextReview",
    ],
  },
  "Regulatory horizon": {
    key: "legalSources",
    title: "Cross-border regulatory horizon",
    intro:
      "Track binding and emerging non-African AI obligations for institutions serving EU, US and other cross-border markets using the same verified legal-source evidence register.",
    action: "register_legal_source",
    button: "Add horizon source",
    fields: [
      f("title", "Law, regulation or official framework"),
      f("publisher", "Issuing authority"),
      f("documentType", "Document type", "select", [
        "Law",
        "Regulation",
        "Strategy",
        "Guidance",
        "Court decision",
        "Research report",
        "Policy analysis",
      ]),
      f("jurisdiction", "Non-African jurisdiction"),
      f("publicationYear", "Publication year", "number"),
      f("sourceUrl", "Authoritative source URL", "url"),
      f("frameworkArea", "Governance area", "select", [
        "AI governance",
        "Data protection",
        "Judicial systems",
        "Digital sovereignty",
        "Institutional capacity",
        "Cross-border cooperation",
        "Legal technology",
      ]),
      f("applicability", "Cross-border applicability", "textarea"),
      f("mappedControls", "Mapped institutional controls", "textarea"),
      f(
        "evidenceNotes",
        "Requirements, deadlines and implementation implications",
        "textarea",
      ),
      f("authorityLevel", "Legal weight", "select", [
        "Binding",
        "Official non-binding",
        "Judicial authority",
        "Independent research",
      ]),
      f("verifiedOn", "Date verified", "date"),
      f("nextReview", "Next horizon review", "date"),
    ],
    columns: [
      "sourceCode",
      "title",
      "publisher",
      "jurisdiction",
      "publicationYear",
      "authorityLevel",
      "status",
      "nextReview",
    ],
  },
  "Public-sector AI": {
    key: "publicSectorAssessments",
    title: "Public-sector AI and democratic-control gate",
    intro:
      "Judge government AI by public value, legality and democratic accountability—not administrative speed alone. Protect due process, citizen challenge, meaningful human control and institutional responsibility.",
    action: "assess_public_sector_ai",
    button: "Assess public-sector AI",
    fields: [
      f("systemCode", "AI system code"),
      f("agency", "Public agency or institution"),
      f(
        "publicDecision",
        "Public service, benefit, sanction or decision affected",
        "textarea",
      ),
      f("aiRole", "AI role in the decision", "select", [
        "Administrative automation",
        "Decision support",
        "Recommendation",
        "Decision substitution",
      ]),
      f(
        "legitimatePurpose",
        "Legitimate public purpose and legal authority",
        "textarea",
      ),
      f(
        "lessIntrusiveAlternative",
        "Assessment of less intrusive alternatives",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f(
        "publicValueMeasure",
        "Public-value, rights and service outcome measures",
        "textarea",
      ),
      f(
        "dueProcess",
        "Accuracy, due process and procedural safeguards",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f(
        "citizenNotice",
        "Notice that AI is used and what role it plays",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f(
        "explanationProcedure",
        "Intelligible reasons for affected people",
        "select",
        ["Operational", "Partial", "Missing"],
      ),
      f("contestability", "Appeal and independent human review", "select", [
        "Operational",
        "Partial",
        "Missing",
      ]),
      f(
        "errorCorrection",
        "Record correction and outcome remediation",
        "select",
        ["Operational", "Partial", "Missing"],
      ),
      f(
        "meaningfulHumanControl",
        "Official has authority, information and competence to override",
        "select",
        ["Demonstrated", "Partial", "Nominal"],
      ),
      f(
        "dataQuality",
        "Representative, accurate and fit-for-purpose data evidence",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f(
        "distributiveImpact",
        "False-positive, false-negative and affected-group impact analysis",
        "select",
        ["Complete", "Partial", "Missing"],
      ),
      f(
        "surveillanceNecessity",
        "Necessity and proportionality for monitoring, biometrics or profiling",
        "select",
        ["Complete", "Not applicable", "Missing"],
      ),
      f(
        "procurementAuditRights",
        "Contractual access to model, testing, security and performance evidence",
        "select",
        ["Enforceable", "Limited", "Missing"],
      ),
      f(
        "vendorExit",
        "Portability, continuity and vendor-exit provisions",
        "select",
        ["Enforceable", "Limited", "Missing"],
      ),
      f(
        "generativeAiControls",
        "Hallucination, citation, confidentiality and prompt-injection controls",
        "select",
        ["Complete", "Not applicable", "Missing"],
      ),
      f("reviewDate", "Next democratic-control review", "date"),
    ],
    columns: [
      "assessmentCode",
      "systemCode",
      "agency",
      "aiRole",
      "readinessScore",
      "outcome",
      "assessedBy",
      "reviewDate",
    ],
  },
  "Guardrail decisions": {
    key: "decisions",
    title: "Deterministic guardrail decisions",
    intro:
      "Rules execute before AI narration: BLOCK, WARN or ALLOW with a recorded outcome.",
    action: "guardrail_decision",
    button: "Evaluate decision",
    fields: [
      f("systemCode", "System code"),
      f("guardrailCode", "Guardrail code"),
      f("level", "Decision", "select", ["BLOCK", "WARN", "ALLOW"]),
      f("trigger", "Trigger", "textarea"),
    ],
    columns: [
      "decisionCode",
      "systemCode",
      "guardrailCode",
      "level",
      "deterministicResult",
      "status",
      "actions",
    ],
  },
  "Approvals & overrides": {
    key: "overrides",
    title: "Approvals and controlled overrides",
    intro:
      "Enforce separation of duties, expiry, compensating controls and dual authorization.",
    action: "request_override",
    button: "Request override",
    fields: [
      f("decisionCode", "Decision code"),
      f("reason", "Reason", "textarea"),
      f("compensatingControls", "Compensating controls", "textarea"),
      f("expiresAt", "Expires", "date"),
    ],
    columns: [
      "overrideCode",
      "decisionCode",
      "requestedBy",
      "status",
      "expiresAt",
      "actions",
    ],
  },
  Evidence: {
    key: "evidence",
    title: "Evidence vault",
    intro:
      "Record integrity hashes for evidence references linked to systems and controls, ready for audit packages.",
    action: "evidence",
    button: "Add evidence",
    fields: [
      f("systemCode", "System code"),
      f("title", "Evidence title"),
      f("evidenceType", "Evidence type"),
      f("source", "Source or reference"),
    ],
    columns: [
      "evidenceCode",
      "systemCode",
      "title",
      "evidenceType",
      "uploadedBy",
      "createdAt",
    ],
  },
  "Incidents & CAPA": {
    key: "incidents",
    title: "AI incidents and CAPA",
    intro:
      "Move incidents through detection, containment, correction, effectiveness review and closure.",
    action: "incident",
    button: "Report incident",
    fields: [
      f("systemCode", "System code"),
      f("severity", "Severity", "select", [
        "Low",
        "Medium",
        "High",
        "Critical",
      ]),
      f("title", "Incident title"),
      f("description", "Description", "textarea"),
      f("owner", "Owner"),
    ],
    columns: [
      "incidentCode",
      "systemCode",
      "severity",
      "title",
      "status",
      "owner",
      "actions",
    ],
  },
  "Corrective actions": {
    key: "capas",
    title: "Corrective and preventive actions",
    intro:
      "Document root cause, accountable remediation, due dates and the effectiveness test before an incident can close.",
    action: "capa",
    button: "Add corrective action",
    fields: [
      f("incidentCode", "Incident code"),
      f("rootCause", "Verified root cause", "textarea"),
      f("correctiveAction", "Corrective or preventive action", "textarea"),
      f("owner", "Accountable owner"),
      f("dueDate", "Due date", "date"),
      f("effectivenessTest", "Effectiveness test", "textarea"),
    ],
    columns: [
      "actionCode",
      "incidentCode",
      "rootCause",
      "action",
      "owner",
      "dueDate",
      "status",
      "effectivenessTest",
    ],
  },
  Privacy: {
    key: "privacy",
    title: "Privacy rights operations",
    intro:
      "Track access, correction, deletion, objection and human-review requests to deadline.",
    action: "privacy_request",
    button: "Log privacy request",
    fields: [
      f("requestType", "Request type"),
      f("jurisdiction", "Jurisdiction"),
      f("subjectReference", "Subject reference"),
      f("systemCode", "System code"),
      f("dueDate", "Due date", "date"),
    ],
    columns: [
      "requestCode",
      "requestType",
      "jurisdiction",
      "systemCode",
      "dueDate",
      "status",
    ],
  },
  "African privacy compliance": {
    key: "privacyComplianceAssessments",
    title: "African privacy and data-sovereignty gate",
    intro:
      "Operationalize controller registration, DPO accountability, sensitive and biometric-data safeguards, cross-border transfer controls, prior authorizations and enforceable data-subject rights by jurisdiction.",
    action: "assess_privacy_compliance",
    button: "Assess privacy compliance",
    fields: [
      f("systemCode", "AI system code"),
      f("jurisdiction", "African jurisdiction"),
      f("sector", "Sector"),
      f(
        "controllerRegistration",
        "Controller or processor registration",
        "select",
        ["Complete", "Not required", "Missing"],
      ),
      f("dpoAssigned", "Named DPO or privacy lead", "select", [
        "Complete",
        "Not required",
        "Missing",
      ]),
      f("sensitiveData", "Sensitive personal data involved", "select", [
        "No",
        "Yes — safeguards documented",
        "Yes — safeguards missing",
      ]),
      f("childrenData", "Children's data involved", "select", [
        "No",
        "Yes — authorization documented",
        "Yes — authorization missing",
      ]),
      f("biometricProcessing", "Biometric processing", "select", [
        "No",
        "Yes — notified and safeguarded",
        "Yes — controls missing",
      ]),
      f("crossBorderTransfer", "Cross-border data transfer", "select", [
        "No",
        "Yes",
      ]),
      f(
        "transferMechanism",
        "Adequacy, authorization or transfer safeguard",
        "textarea",
      ),
      f(
        "priorAuthorization",
        "Required DPA declaration or prior authorization",
        "select",
        ["Complete", "Not required", "Missing"],
      ),
      f(
        "processorDueDiligence",
        "Processor and subprocessor due diligence",
        "select",
        ["Complete", "Missing"],
      ),
      f(
        "rightsProcedure",
        "Access, correction, deletion, objection and human-review procedure",
        "select",
        ["Complete", "Missing"],
      ),
      f("retentionSchedule", "Data retention and deletion schedule", "select", [
        "Complete",
        "Missing",
      ]),
      f(
        "breachProcedure",
        "Breach response and DPA notification procedure",
        "select",
        ["Complete", "Missing"],
      ),
      f("reviewDate", "Next compliance review", "date"),
    ],
    columns: [
      "assessmentCode",
      "systemCode",
      "jurisdiction",
      "sector",
      "readinessScore",
      "outcome",
      "assessedBy",
      "reviewDate",
    ],
  },
  Policies: {
    key: "policies",
    title: "Policy register",
    intro:
      "Publish approved, versioned institutional AI policies with clear effective dates.",
    action: "policy",
    button: "Publish policy",
    fields: [
      f("policyCode", "Policy code"),
      f("title", "Title"),
      f("version", "Version"),
      f("effectiveDate", "Effective date", "date"),
      f("body", "Policy statement", "textarea"),
    ],
    columns: [
      "policyCode",
      "title",
      "version",
      "effectiveDate",
      "approvedBy",
      "status",
    ],
  },
  "Audit trail": {
    key: "audit",
    title: "Chain of accountability",
    intro:
      "Prove who authorized the agent, what it accessed, which tools it used, what changed, the result and who was notified.",
    columns: [
      "createdAt",
      "actorEmail",
      "action",
      "entityType",
      "entityCode",
      "details",
      "eventHash",
    ],
  },
  "User access management": {
    key: "users",
    title: "User access management",
    intro:
      "Change an institution user's application role or deactivate access through the same server-side authorization policy used by the rest of Sentinel.",
    action: "update_user",
    button: "Update user access",
    fields: [
      f("userId", "Organization user ID", "number"),
      f("role", "Role", "select", [
        "admin",
        "system_owner",
        "reviewer",
        "approver",
        "auditor",
        "accountable_executive",
      ]),
      f("status", "Status", "select", ["active", "inactive"]),
    ],
    columns: ["id", "displayName", "email", "role", "status"],
  },
  "Workforce conduct progression": {
    key: "workforceConductCases",
    title: "Advance workforce conduct case",
    intro:
      "Advance a conduct case through its governed disciplinary stages while retaining the outcome and review notes.",
    action: "advance_workforce_conduct_stage",
    button: "Advance conduct case",
    fields: [
      f("caseId", "Conduct case ID", "number"),
      f("stage", "New stage", "select", [
        "informal_resolution",
        "written_warning",
        "formal_review",
        "separation",
        "closed_no_action",
      ]),
      f("outcome", "Outcome", "textarea"),
      f("notes", "Review notes", "textarea"),
    ],
    columns: [
      "id",
      "subjectUserId",
      "grounds",
      "stage",
      "investigatorUserId",
      "outcome",
    ],
  },
  "Succession reassignment": {
    key: "accountabilitySuccessions",
    title: "Reassign accountability succession",
    intro:
      "Complete an open accountability handoff by assigning the incoming accountable person.",
    action: "reassign_accountability_succession",
    button: "Reassign accountability",
    fields: [
      f("successionId", "Succession ID", "number"),
      f("incomingUserId", "Incoming user ID", "number"),
    ],
    columns: [
      "id",
      "outgoingUserId",
      "incomingUserId",
      "role",
      "entityType",
      "entityId",
      "status",
      "handoffDeadline",
    ],
  },
  "Succession overdue scan": {
    key: "accountabilitySuccessions",
    title: "Scan overdue accountability handoffs",
    intro:
      "Run the server-side overdue scan and flag unresolved accountability transfers that have passed their deadline.",
    action: "flag_overdue_successions",
    button: "Scan overdue successions",
    fields: [],
    columns: [
      "id",
      "outgoingUserId",
      "incomingUserId",
      "role",
      "entityType",
      "entityId",
      "status",
      "handoffDeadline",
    ],
  },
  "Conduct pattern review": {
    key: "conductPatternFlags",
    title: "Review conduct pattern",
    intro:
      "Record the accountable review disposition for a detected conduct pattern and escalate it to a conduct case when required.",
    action: "review_conduct_pattern",
    button: "Review conduct pattern",
    fields: [
      f("flagId", "Pattern flag ID", "number"),
      f("reviewStatus", "Review disposition", "select", [
        "reviewed_no_action",
        "escalated_to_conduct_case",
      ]),
    ],
    columns: [
      "id",
      "subjectUserId",
      "patternType",
      "eventCount",
      "threshold",
      "reviewStatus",
    ],
  },
  "Executive accountability": {
    key: "users",
    title: "Executive accountability",
    intro:
      "Designate one active executive who remains accountable for institutional AI governance.",
    action: "designate_accountable_executive",
    button: "Designate executive",
    fields: [f("userId", "Organization user ID", "number")],
    columns: ["id", "displayName", "email", "role", "status"],
  },
  "Workforce conduct": {
    key: "workforceConductCases",
    title: "Workforce conduct cases",
    intro:
      "Open and progress confidential, conflict-checked cases when AI governance rules are bypassed.",
    action: "open_workforce_conduct_case",
    button: "Open conduct case",
    fields: [
      f("subjectUserId", "Subject user ID", "number"),
      f("grounds", "Grounds", "select", [
        "unauthorized_confidential_data_entry",
        "approval_threshold_bypass",
        "unauthorized_override",
        "other",
      ]),
      f("description", "Case description", "textarea"),
    ],
    columns: [
      "id",
      "subjectUserId",
      "grounds",
      "stage",
      "investigatorUserId",
      "outcome",
      "actions",
    ],
  },
  "Accountability succession": {
    key: "accountabilitySuccessions",
    title: "Accountability succession",
    intro:
      "Record and complete handoffs when an accountable person exits or is reassigned.",
    action: "open_accountability_succession",
    button: "Open succession",
    fields: [
      f("outgoingUserId", "Outgoing user ID", "number"),
      f("incomingUserId", "Incoming user ID", "number"),
      f("role", "Accountable role", "select", [
        "system_owner",
        "approver",
        "reviewer",
        "dpo",
        "oversight_role",
        "accountable_executive",
      ]),
      f("entityType", "Entity type"),
      f("entityId", "Entity identifier"),
      f("triggerReason", "Trigger", "select", ["exit", "reassignment"]),
      f("handoffDeadline", "Handoff deadline", "datetime-local"),
    ],
    columns: [
      "id",
      "outgoingUserId",
      "incomingUserId",
      "role",
      "entityType",
      "entityId",
      "status",
      "handoffDeadline",
      "actions",
    ],
  },
  "Conduct monitoring": {
    key: "conductPatternFlags",
    title: "Conduct pattern monitoring",
    intro:
      "Scan the audit record for repeated denied overrides and route patterns to accountable review.",
    action: "scan_conduct_patterns",
    button: "Run pattern scan",
    fields: [],
    columns: [
      "id",
      "subjectUserId",
      "patternType",
      "eventCount",
      "threshold",
      "reviewStatus",
      "actions",
    ],
  },
  "Agent enforcement": {
    key: "accessGrants",
    title: "Agent access enforcement",
    intro:
      "Test a proposed agent action against its live identity, time-bound grant, permission and blocking guardrails.",
    action: "authorize_agent_action",
    button: "Check agent action",
    fields: [
      f("agentCode", "Agent code"),
      f("resource", "Exact resource"),
      f("permission", "Exact permission"),
    ],
    columns: [
      "grantCode",
      "agentCode",
      "resource",
      "permission",
      "status",
      "expiresAt",
    ],
  },
  "Evidence export": {
    key: "systems",
    title: "Governance evidence export",
    intro:
      "Generate a complete, institution-scoped governance package for a registered AI system.",
    action: "export_package",
    button: "Generate evidence package",
    fields: [f("systemCode", "System code")],
    columns: ["systemCode", "name", "owner", "risk", "status"],
  },
  "Users & roles": {
    key: "users",
    title: "Users and role separation",
    intro:
      "Institution-scoped application roles. Site access must also be granted in the Site sharing controls.",
    action: "invite_user",
    button: "Add internal role",
    fields: [
      f("displayName", "Name"),
      f("email", "Email", "email"),
      f("role", "Role", "select", [
        "admin",
        "system_owner",
        "reviewer",
        "approver",
        "auditor",
      ]),
    ],
    columns: ["id", "displayName", "email", "role", "status", "actions"],
  },
};
function f(
  name: string,
  label: string,
  type?: string,
  options?: string[],
): Field {
  return { name, label, type, options };
}
const pretty = (s: string) =>
  s.replace(/([A-Z])/g, " $1").replace(/^./, (x) => x.toUpperCase());
const shown = (v: unknown) =>
  v == null || v === ""
    ? "—"
    : String(v).length > 30
      ? String(v).slice(0, 29) + "…"
      : String(v);
const optionalFields = new Set([
  "model",
  "data",
  "hostingLocation",
  "decisionImpact",
  "owner",
  "incomingUserId",
  "investigatorUserId",
  "linkedWhistleblowerReportId",
  "linkedOverrideAuthorizerId",
  "linkedIncidentCode",
  "subjectCode",
  "parentCode",
  "jurisdiction",
  "payload",
  "effectiveAt",
  "expiresAt",
]);

type ApiPayload = {
  error?: string;
  code?: string;
  requestId?: string;
  [key: string]: unknown;
};
async function responseJson(response: Response): Promise<ApiPayload> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json"))
    throw new Error(
      "The server returned an unexpected response. Please try again.",
    );
  const payload = (await response.json()) as ApiPayload;
  if (!response.ok)
    throw new Error(
      payload.error || "The request could not be completed. Please try again.",
    );
  return payload;
}

export function OperationalWorkspace({
  section,
  flash,
}: {
  section: string;
  flash: (s: string) => void;
}) {
  const c = views[section] || views["AI systems"];
  const endpoint = c.endpoint ?? "/api/governance";
  const [data, setData] = useState<Record<string, unknown>>({});
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLFormElement>(null);
  const priorFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    priorFocus.current = document.activeElement as HTMLElement;
    queueMicrotask(() =>
      dialogRef.current
        ?.querySelector<HTMLElement>("input, select, textarea, button")
        ?.focus(),
    );
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("keydown", close);
      priorFocus.current?.focus();
    };
  }, [open, busy]);
  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        signal,
      });
      const payload = await responseJson(response);
      if (!signal?.aborted) {
        setData(payload);
        setError("");
      }
    } catch (cause) {
      if (!signal?.aborted)
        setError(
          cause instanceof Error
            ? cause.message
            : "The governance record could not be loaded.",
        );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [endpoint]);
  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => void load(controller.signal));
    return () => controller.abort();
  }, [load, section]);
  const rows = Array.isArray(data[c.key])
    ? (data[c.key] as Array<Record<string, unknown>>)
    : [];
  const capabilities = Array.isArray(data.capabilities)
    ? (data.capabilities as string[])
    : [];
  const canAct = (action: string | undefined) =>
    Boolean(action && capabilities.includes(action));
  async function post(payload: Record<string, unknown>) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
    return responseJson(response);
  }
  async function perform(payload: Record<string, unknown>, message: string) {
    setBusy(true);
    setError("");
    try {
      await post(payload);
      flash(message);
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The request could not be completed.",
      );
    } finally {
      setBusy(false);
    }
  }
  const transition = (grantCode: string, transitionName: string) =>
    perform(
      { action: "access_transition", grantCode, transition: transitionName },
      `Access ${transitionName} completed`,
    );
  const approveGate = (gateCode: string) =>
    perform(
      { action: "approve_deployment_gate", gateCode },
      "Deployment gate approved",
    );
  const agencyTransition = (decisionCode: string, transitionName: string) =>
    perform(
      { action: "agency_transition", decisionCode, transition: transitionName },
      `Institutional decision ${transitionName} completed`,
    );
  function justification(label: string) {
    const value = window.prompt(`${label} justification`);
    return value?.trim() || null;
  }
  function decideGuardrail(decisionCode: string, outcome: string) {
    const reason = justification(
      outcome === "approved" ? "Approval" : "Denial",
    );
    if (reason)
      void perform(
        { action: "approve", decisionCode, outcome, justification: reason },
        `Decision ${outcome}`,
      );
  }
  function decideOverride(overrideCode: string, outcome: "approve" | "deny") {
    const reason = justification(
      outcome === "approve" ? "Override approval" : "Override denial",
    );
    if (reason)
      void perform(
        {
          action: outcome === "approve" ? "override_approve" : "override_deny",
          overrideCode,
          justification: reason,
        },
        `Override ${outcome === "approve" ? "approved" : "denied"}`,
      );
  }
  function retirementTransition(
    retirementCode: string,
    transitionName: string,
  ) {
    void perform(
      {
        action: "model_retirement_transition",
        retirementCode,
        transition: transitionName,
      },
      `Retirement ${transitionName} completed`,
    );
  }
  function advanceIncident(incidentCode: string, status: string) {
    void perform(
      { action: "incident_advance", incidentCode, status },
      `Incident advanced to ${status.replaceAll("_", " ")}`,
    );
  }
  function rowActions(row: Record<string, unknown>) {
    const status = String(row.status ?? "");
    const outcome = String(row.outcome ?? "");
    if (c.key === "accessGrants")
      return (
        <div className="row-actions">
          {canAct("access_transition") && status === "requested" && (
            <button
              disabled={busy}
              onClick={() => void transition(String(row.grantCode), "approve")}
            >
              Approve
            </button>
          )}
          {canAct("access_transition") && status === "active" && (
            <button
              disabled={busy}
              onClick={() => void transition(String(row.grantCode), "review")}
            >
              Review
            </button>
          )}
          {canAct("access_transition") &&
            ["requested", "active"].includes(status) && (
              <button
                disabled={busy}
                onClick={() => void transition(String(row.grantCode), "revoke")}
              >
                Revoke
              </button>
            )}
        </div>
      );
    if (c.key === "agencyAssessments")
      return (
        <div className="row-actions">
          {canAct("agency_transition") && outcome === "READY_FOR_APPROVAL" && (
            <button
              disabled={busy}
              onClick={() =>
                void agencyTransition(String(row.decisionCode), "approve")
              }
            >
              Authorize adoption
            </button>
          )}
          {canAct("agency_transition") && outcome === "ADOPTION_AUTHORIZED" && (
            <>
              <button
                disabled={busy}
                onClick={() =>
                  void agencyTransition(String(row.decisionCode), "suspend")
                }
              >
                Suspend
              </button>
              <button
                disabled={busy}
                onClick={() =>
                  void agencyTransition(String(row.decisionCode), "discontinue")
                }
              >
                Discontinue
              </button>
            </>
          )}
          {canAct("agency_transition") && outcome === "SUSPENDED" && (
            <button
              disabled={busy}
              onClick={() =>
                void agencyTransition(String(row.decisionCode), "discontinue")
              }
            >
              Discontinue
            </button>
          )}
          {["BLOCKED", "REFUSED", "DISCONTINUED"].includes(outcome) && (
            <span>{outcome.replaceAll("_", " ")}</span>
          )}
        </div>
      );
    if (c.key === "deploymentGates")
      return (
        <div className="row-actions">
          {canAct("approve_deployment_gate") &&
            outcome === "READY_FOR_APPROVAL" && (
              <button
                disabled={busy}
                onClick={() => void approveGate(String(row.gateCode))}
              >
                Approve deployment
              </button>
            )}
          {outcome === "BLOCKED" && <span>Resolve gaps</span>}
          {outcome === "APPROVED" && <span>✓ Active</span>}
        </div>
      );
    if (c.key === "modelRetirements") {
      const next: Record<string, [string, string]> = {
        PLANNED: ["notify", "Record notification"],
        NOTIFIED: ["decommission", "Approve decommission"],
        DECOMMISSIONED: ["archive", "Archive evidence"],
      };
      const action = next[status];
      return (
        <div className="row-actions">
          {action && canAct("model_retirement_transition") ? (
            <button
              disabled={busy}
              onClick={() =>
                retirementTransition(String(row.retirementCode), action[0])
              }
            >
              {action[1]}
            </button>
          ) : (
            <span>{status.replaceAll("_", " ")}</span>
          )}
        </div>
      );
    }
    if (c.key === "decisions")
      return (
        <div className="row-actions">
          {canAct("approve") &&
          ["pending", "partially_approved"].includes(status) ? (
            <>
              <button
                disabled={busy}
                onClick={() =>
                  decideGuardrail(String(row.decisionCode), "approved")
                }
              >
                Approve
              </button>
              <button
                disabled={busy}
                onClick={() =>
                  decideGuardrail(String(row.decisionCode), "denied")
                }
              >
                Deny
              </button>
            </>
          ) : (
            <span>{status.replaceAll("_", " ")}</span>
          )}
        </div>
      );
    if (c.key === "overrides")
      return (
        <div className="row-actions">
          {canAct("override_approve") &&
          ["awaiting_dual_approval", "awaiting_second_approval"].includes(
            status,
          ) ? (
            <>
              <button
                disabled={busy}
                onClick={() =>
                  decideOverride(String(row.overrideCode), "approve")
                }
              >
                Approve
              </button>
              <button
                disabled={busy}
                onClick={() => decideOverride(String(row.overrideCode), "deny")}
              >
                Deny
              </button>
            </>
          ) : (
            <span>{status.replaceAll("_", " ")}</span>
          )}
        </div>
      );
    if (c.key === "incidents") {
      const flow = [
        "detected",
        "triaged",
        "contained",
        "investigating",
        "capa_open",
        "effectiveness_review",
        "closed",
      ];
      const next = flow[flow.indexOf(status) + 1];
      return (
        <div className="row-actions">
          {next && canAct("incident_advance") ? (
            <button
              disabled={busy}
              onClick={() => advanceIncident(String(row.incidentCode), next)}
            >
              Advance to {next.replaceAll("_", " ")}
            </button>
          ) : (
            <span>{status.replaceAll("_", " ")}</span>
          )}
        </div>
      );
    }
    if (c.key === "capas") {
      const flow = ["open", "implemented", "effectiveness_verified", "closed"];
      const next = flow[flow.indexOf(status) + 1];
      return (
        <div className="row-actions">
          {next && canAct("capa_transition") ? (
            <button
              disabled={busy}
              onClick={() => {
                const notes = justification("CAPA transition");
                if (notes)
                  void perform(
                    {
                      action: "capa_transition",
                      actionCode: row.actionCode,
                      status: next,
                      notes,
                    },
                    `Corrective action advanced to ${next.replaceAll("_", " ")}`,
                  );
              }}
            >
              Advance to {next?.replaceAll("_", " ")}
            </button>
          ) : (
            <span>{status.replaceAll("_", " ")}</span>
          )}
        </div>
      );
    }
    if (c.key === "privacy") {
      const next: Record<string, string> = {
        identity_verification: "in_progress",
        in_progress: "fulfilled",
        fulfilled: "closed",
        denied: "closed",
      };
      const target = next[status];
      return (
        <div className="row-actions">
          {target && canAct("privacy_transition") ? (
            <button
              disabled={busy}
              onClick={() => {
                const notes = justification("Privacy request");
                if (notes)
                  void perform(
                    {
                      action: "privacy_transition",
                      requestCode: row.requestCode,
                      status: target,
                      notes,
                    },
                    `Privacy request advanced to ${target.replaceAll("_", " ")}`,
                  );
              }}
            >
              Advance to {target?.replaceAll("_", " ")}
            </button>
          ) : (
            <span>{status.replaceAll("_", " ")}</span>
          )}
        </div>
      );
    }
    if (c.key === "confidentialReports") {
      const next: Record<string, string> = {
        RECEIVED: "TRIAGED",
        TRIAGED: "INVESTIGATING",
        INVESTIGATING: "RESOLVED",
      };
      const target = next[status];
      return (
        <div className="row-actions">
          {target && canAct("confidential_report_transition") ? (
            <button
              disabled={busy}
              onClick={() => {
                const notes = justification("Investigation");
                if (notes)
                  void perform(
                    {
                      action: "confidential_report_transition",
                      trackingCode: row.trackingCode,
                      status: target,
                      notes,
                    },
                    `Report advanced to ${target.toLowerCase()}`,
                  );
              }}
            >
              Advance to {target?.toLowerCase()}
            </button>
          ) : (
            <span>{status.replaceAll("_", " ")}</span>
          )}
        </div>
      );
    }
    return <span>—</span>;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setError("");
    try {
      const payload = Object.fromEntries(new FormData(form));
      if (
        ["create_advanced_record", "transition_advanced_record"].includes(
          String(c.action),
        ) &&
        typeof payload.payload === "string"
      ) {
        const raw = payload.payload.trim();
        payload.payload = raw ? JSON.parse(raw) : {};
      }
      const response = await post({ action: c.action, ...payload });
      if (
        c.action === "export_package" ||
        c.action === "export_skill_evidence_package" ||
        c.action === "export_advanced_governance_package" ||
        c.action === "export_privacy_evidence_package"
      ) {
        const blob = new Blob([JSON.stringify(response.result, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =
          c.action === "export_skill_evidence_package"
            ? `sentinel-skill-evidence-${String(payload.skillCode)}.json`
            : c.action === "export_advanced_governance_package"
              ? "sentinel-r2-r12-governance-evidence.json"
              : c.action === "export_privacy_evidence_package"
                ? `sentinel-privacy-evidence-${String(payload.systemCode || "institution")}.json`
                : `sentinel-evidence-${String(payload.systemCode)}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
      setOpen(false);
      flash(`${c.button} completed`);
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The request could not be completed.",
      );
    } finally {
      setBusy(false);
    }
  }
  const actor = data.actor as
    | { displayName?: string; role?: string; organizationName?: string }
    | undefined;
  const integrity = data.auditIntegrity as
    | {
        status?: string;
        totalEvents?: number;
        verifiedV2?: number;
        legacyEvents?: number;
      }
    | null
    | undefined;
  return (
    <div className="page ops-page">
      <div className="ops-hero">
        <div>
          <p className="eyebrow">INSTITUTIONAL EXECUTION LAYER</p>
          <h1>{c.title}</h1>
          <p>{c.intro}</p>
        </div>
        {c.action && canAct(c.action) && (
          <button
            className="primary"
            onClick={() => {
              setError("");
              setOpen(true);
            }}
          >
            ＋ {c.button}
          </button>
        )}
      </div>
      <div className="ops-context">
        <span>
          Institution{" "}
          <b>
            {actor?.organizationName || (loading ? "Loading…" : "Unavailable")}
          </b>
        </span>
        <span>
          User{" "}
          <b>{actor?.displayName || (loading ? "Loading…" : "Unavailable")}</b>
        </span>
        <span>
          Role <b>{actor?.role || "—"}</b>
        </span>
      </div>
      {section === "Audit trail" && integrity && (
        <div
          className={
            integrity.status === "VERIFIED"
              ? "ops-integrity verified"
              : "ops-integrity broken"
          }
        >
          <b>Audit chain {integrity.status?.toLowerCase()}</b>
          <span>
            {integrity.totalEvents || 0} events · {integrity.verifiedV2 || 0}{" "}
            cryptographically verified · {integrity.legacyEvents || 0} legacy
          </span>
        </div>
      )}
      {error && (
        <div className="ops-error" role="alert">
          {error}
        </div>
      )}
      <section className="panel ops-table" aria-busy={loading}>
        <div className="panel-head">
          <div>
            <p className="eyebrow">LIVE GOVERNANCE RECORD</p>
            <h2>
              {loading
                ? "Loading records…"
                : `${rows.length} record${rows.length === 1 ? "" : "s"}`}
            </h2>
          </div>
          <button disabled={loading || busy} onClick={() => void load()}>
            Refresh ↻
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {c.columns.map((column) => (
                  <th key={column}>{pretty(column)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && rows.length ? (
                rows.map((row, index) => {
                  const key = String(row.id ?? row.email ?? index);
                  return (
                    <tr key={key}>
                      {c.columns.map((column) => (
                        <td key={column} title={String(row[column] ?? "")}>
                          {column === "actions" ? (
                            rowActions(row)
                          ) : column.toLowerCase().includes("hash") ? (
                            <code>{shown(row[column])}</code>
                          ) : (
                            shown(row[column])
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : !loading ? (
                <tr>
                  <td className="empty-row" colSpan={c.columns.length}>
                    No records yet.{" "}
                    {c.action && canAct(c.action)
                      ? `Use “${c.button}” to create the first defensible record.`
                      : "No records are available for this role."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
      <div className="ops-assurance">
        <b>Control principle</b>
        <span>Rules before AI</span>
        <span>Institution isolation</span>
        <span>Named accountability</span>
        <span>Tamper-evident audit chain</span>
        <span>Human authorization</span>
      </div>
      {open && (
        <div
          className="modal-backdrop"
          onMouseDown={() => !busy && setOpen(false)}
        >
          <form
            ref={dialogRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={c.button}
            onSubmit={submit}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <p className="eyebrow">CONTROLLED WORKFLOW</p>
                <h2>{c.button}</h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>
            {c.fields?.map((field) => (
              <label key={field.name}>
                {field.label}
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    required={!optionalFields.has(field.name)}
                  >
                    {field.options?.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    required={!optionalFields.has(field.name)}
                    maxLength={field.name === "body" ? 20000 : 5000}
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    required={!optionalFields.has(field.name)}
                    maxLength={field.type === "email" ? 254 : 2048}
                  />
                )}
              </label>
            ))}
            {error && (
              <div className="ops-error" role="alert">
                {error}
              </div>
            )}
            <div className="modal-actions">
              <button
                type="button"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button className="primary" type="submit" disabled={busy}>
                {busy ? "Recording…" : c.button}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
