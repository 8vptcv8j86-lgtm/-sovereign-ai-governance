import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
const created = () =>
  text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`);
export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: created(),
});
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  authUserId: text("auth_user_id").unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().default("system_owner"),
  organizationId: text("organization_id").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: created(),
});
export const aiSystems = sqliteTable(
  "ai_systems",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    systemCode: text("system_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    name: text("name").notNull(),
    owner: text("owner").notNull(),
    region: text("region").notNull(),
    purpose: text("purpose").notNull(),
    risk: text("risk").notNull().default("Medium"),
    status: text("status").notNull().default("In review"),
    model: text("model").notNull().default("Not specified"),
    data: text("data_categories").notNull().default("Not yet classified"),
    hostingLocation: text("hosting_location").notNull().default("Not recorded"),
    decisionImpact: text("decision_impact").notNull().default("Advisory"),
    reviewDue: text("review_due"),
    createdAt: created(),
  },
  (table) => [
    index("idx_ai_systems_org_created").on(
      table.organizationId,
      table.createdAt,
    ),
  ],
);
export const aiAgents = sqliteTable(
  "ai_agents",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    agentCode: text("agent_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    systemCode: text("system_code").notNull(),
    name: text("name").notNull(),
    owner: text("owner").notNull(),
    purpose: text("purpose").notNull(),
    scope: text("scope").notNull(),
    approvedTools: text("approved_tools").notNull(),
    approvedData: text("approved_data").notNull(),
    jurisdiction: text("jurisdiction").notNull(),
    lifecycleStatus: text("lifecycle_status").notNull().default("proposed"),
    reviewDue: text("review_due").notNull(),
    createdAt: created(),
  },
  (table) => [
    index("idx_ai_agents_org_system").on(
      table.organizationId,
      table.systemCode,
    ),
  ],
);
export const accessGrants = sqliteTable(
  "access_grants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    grantCode: text("grant_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    agentCode: text("agent_code").notNull(),
    requestedBy: text("requested_by").notNull(),
    approvedBy: text("approved_by"),
    resource: text("resource").notNull(),
    permission: text("permission").notNull(),
    purpose: text("purpose").notNull(),
    leastPrivilegeBasis: text("least_privilege_basis").notNull(),
    startsAt: text("starts_at").notNull(),
    expiresAt: text("expires_at").notNull(),
    status: text("status").notNull().default("requested"),
    lastReviewedAt: text("last_reviewed_at"),
    revokedAt: text("revoked_at"),
    createdAt: created(),
  },
  (table) => [
    index("idx_access_grants_authorization").on(
      table.organizationId,
      table.agentCode,
      table.resource,
      table.permission,
      table.status,
    ),
  ],
);
export const agencyAssessments = sqliteTable("agency_assessments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  decisionCode: text("decision_code").notNull().unique(),
  organizationId: text("organization_id").notNull(),
  proposalTitle: text("proposal_title").notNull(),
  sponsoringInstitution: text("sponsoring_institution").notNull(),
  publicProblem: text("public_problem").notNull(),
  affectedCommunities: text("affected_communities").notNull(),
  aiAppropriateness: text("ai_appropriateness").notNull(),
  nonAiAlternative: text("non_ai_alternative").notNull(),
  vendorName: text("vendor_name").notNull(),
  vendorClaimsAssessment: text("vendor_claims_assessment").notNull(),
  criticalityClass: text("criticality_class").notNull().default("Standard"),
  supplierDependencies: text("supplier_dependencies")
    .notNull()
    .default("Not recorded"),
  serviceContinuityPlan: text("service_continuity_plan")
    .notNull()
    .default("Missing"),
  governanceFrameworkMap: text("governance_framework_map")
    .notNull()
    .default("Missing"),
  sovereignConditions: text("sovereign_conditions").notNull(),
  dataHostingRequirements: text("data_hosting_requirements").notNull(),
  independentAssessment: text("independent_assessment").notNull(),
  communityEvidence: text("community_evidence").notNull(),
  exitPlan: text("exit_plan").notNull(),
  proposedDecision: text("proposed_decision").notNull(),
  readinessScore: integer("readiness_score").notNull(),
  outcome: text("outcome").notNull(),
  assessedBy: text("assessed_by").notNull(),
  approvedBy: text("approved_by"),
  decidedAt: text("decided_at"),
  createdAt: created(),
});
export const foresightScenarios = sqliteTable("foresight_scenarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  scenarioCode: text("scenario_code").notNull().unique(),
  organizationId: text("organization_id").notNull(),
  scenario: text("scenario").notNull(),
  timeHorizon: text("time_horizon").notNull(),
  capabilityPace: text("capability_pace").notNull(),
  humanControllability: text("human_controllability").notNull(),
  frontierConcentration: text("frontier_concentration").notNull(),
  criticalDomains: text("critical_domains").notNull(),
  institutionalImpact: text("institutional_impact").notNull(),
  leadingIndicators: text("leading_indicators").notNull(),
  preventiveControls: text("preventive_controls").notNull(),
  continuityResponse: text("continuity_response").notNull(),
  internationalDependencies: text("international_dependencies").notNull(),
  decisionOwner: text("decision_owner").notNull(),
  reviewDate: text("review_date").notNull(),
  status: text("status").notNull().default("ACTIVE"),
  assessedBy: text("assessed_by").notNull(),
  createdAt: created(),
});
export const privacyComplianceAssessments = sqliteTable(
  "privacy_compliance_assessments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assessmentCode: text("assessment_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    systemCode: text("system_code").notNull(),
    jurisdiction: text("jurisdiction").notNull(),
    sector: text("sector").notNull(),
    controllerRegistration: text("controller_registration").notNull(),
    dpoAssigned: text("dpo_assigned").notNull(),
    sensitiveData: text("sensitive_data").notNull(),
    childrenData: text("children_data").notNull(),
    biometricProcessing: text("biometric_processing").notNull(),
    crossBorderTransfer: text("cross_border_transfer").notNull(),
    transferMechanism: text("transfer_mechanism").notNull(),
    priorAuthorization: text("prior_authorization").notNull(),
    processorDueDiligence: text("processor_due_diligence").notNull(),
    rightsProcedure: text("rights_procedure").notNull(),
    retentionSchedule: text("retention_schedule").notNull(),
    breachProcedure: text("breach_procedure").notNull(),
    readinessScore: integer("readiness_score").notNull(),
    outcome: text("outcome").notNull(),
    assessedBy: text("assessed_by").notNull(),
    reviewDate: text("review_date").notNull(),
    createdAt: created(),
  },
);
export const implementationAssessments = sqliteTable(
  "implementation_assessments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assessmentCode: text("assessment_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    jurisdiction: text("jurisdiction").notNull(),
    responsibleInstitution: text("responsible_institution").notNull(),
    legalMandate: text("legal_mandate").notNull(),
    ringFencedBudget: text("ring_fenced_budget").notNull(),
    staffingPlan: text("staffing_plan").notNull(),
    technicalCapability: text("technical_capability").notNull(),
    enforcementPowers: text("enforcement_powers").notNull(),
    regionalReach: text("regional_reach").notNull(),
    complaintChannel: text("complaint_channel").notNull(),
    inspectionProgramme: text("inspection_programme").notNull(),
    procurementControls: text("procurement_controls").notNull(),
    implementationMilestones: text("implementation_milestones").notNull(),
    performanceIndicators: text("performance_indicators").notNull(),
    publicReporting: text("public_reporting").notNull(),
    evidenceReference: text("evidence_reference").notNull(),
    readinessScore: integer("readiness_score").notNull(),
    outcome: text("outcome").notNull(),
    assessedBy: text("assessed_by").notNull(),
    reviewDate: text("review_date").notNull(),
    createdAt: created(),
  },
);
export const workforceAbsorptionAssessments = sqliteTable(
  "workforce_absorption_assessments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assessmentCode: text("assessment_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    jurisdiction: text("jurisdiction").notNull(),
    institution: text("institution").notNull(),
    youthCohort: text("youth_cohort").notNull(),
    skillsPipeline: text("skills_pipeline").notNull(),
    entryLevelRoles: text("entry_level_roles").notNull(),
    paidInternships: text("paid_internships").notNull(),
    experienceBarrier: text("experience_barrier").notNull(),
    skillsBasedHiring: text("skills_based_hiring").notNull(),
    remoteWorkPolicy: text("remote_work_policy").notNull(),
    managerReadiness: text("manager_readiness").notNull(),
    outputBasedPerformance: text("output_based_performance").notNull(),
    localOperationsRoles: text("local_operations_roles").notNull(),
    retentionPathway: text("retention_pathway").notNull(),
    regionalAccess: text("regional_access").notNull(),
    conversionTarget: text("conversion_target").notNull(),
    outcomeEvidence: text("outcome_evidence").notNull(),
    readinessScore: integer("readiness_score").notNull(),
    outcome: text("outcome").notNull(),
    assessedBy: text("assessed_by").notNull(),
    reviewDate: text("review_date").notNull(),
    createdAt: created(),
  },
);
export const infrastructureDividendAssessments = sqliteTable(
  "infrastructure_dividend_assessments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assessmentCode: text("assessment_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    projectName: text("project_name").notNull(),
    jurisdiction: text("jurisdiction").notNull(),
    operator: text("operator").notNull(),
    plannedMegawatts: integer("planned_megawatts").notNull(),
    additionalGeneration: text("additional_generation").notNull(),
    gridSupport: text("grid_support").notNull(),
    networkCostsAssigned: text("network_costs_assigned").notNull(),
    householdTariffProtection: text("household_tariff_protection").notNull(),
    sharedComputeCommitment: text("shared_compute_commitment").notNull(),
    localSkillsPlan: text("local_skills_plan").notNull(),
    localProcurementTarget: text("local_procurement_target").notNull(),
    powerDisclosure: text("power_disclosure").notNull(),
    waterDisclosure: text("water_disclosure").notNull(),
    emissionsDisclosure: text("emissions_disclosure").notNull(),
    publicBenefitTerms: text("public_benefit_terms").notNull(),
    contractEnforcement: text("contract_enforcement").notNull(),
    readinessScore: integer("readiness_score").notNull(),
    outcome: text("outcome").notNull(),
    assessedBy: text("assessed_by").notNull(),
    reviewDate: text("review_date").notNull(),
    createdAt: created(),
  },
);
export const africaFirstAssessments = sqliteTable("africa_first_assessments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  assessmentCode: text("assessment_code").notNull().unique(),
  organizationId: text("organization_id").notNull(),
  systemCode: text("system_code").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  ubuntuImpact: text("ubuntu_impact").notNull(),
  communityResources: text("community_resources").notNull(),
  laborImpact: text("labor_impact").notNull(),
  intergenerationalImpact: text("intergenerational_impact").notNull(),
  localLanguages: text("local_languages").notNull(),
  languagePerformanceEvidence: text("language_performance_evidence").notNull(),
  lowConnectivityDesign: text("low_connectivity_design").notNull(),
  mobileOfflineSupport: text("mobile_offline_support").notNull(),
  localDataControl: text("local_data_control").notNull(),
  foreignDependencyPlan: text("foreign_dependency_plan").notNull(),
  regionalInteroperability: text("regional_interoperability").notNull(),
  smeProportionality: text("sme_proportionality").notNull(),
  hypeChallenge: text("hype_challenge").notNull(),
  readinessScore: integer("readiness_score").notNull(),
  outcome: text("outcome").notNull(),
  assessedBy: text("assessed_by").notNull(),
  reviewDate: text("review_date").notNull(),
  createdAt: created(),
});
export const sovereignResilienceAssessments = sqliteTable(
  "sovereign_resilience_assessments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assessmentCode: text("assessment_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    systemCode: text("system_code").notNull(),
    jurisdiction: text("jurisdiction").notNull(),
    criticalService: text("critical_service").notNull(),
    primaryProvider: text("primary_provider").notNull(),
    providerConcentration: text("provider_concentration").notNull(),
    verifiedAlternatives: text("verified_alternatives").notNull(),
    dataHostingJurisdictions: text("data_hosting_jurisdictions").notNull(),
    dataResidencyControl: text("data_residency_control").notNull(),
    dataExportTest: text("data_export_test").notNull(),
    workflowPortability: text("workflow_portability").notNull(),
    contractAuditRights: text("contract_audit_rights").notNull(),
    contractExitRights: text("contract_exit_rights").notNull(),
    continuityPlan: text("continuity_plan").notNull(),
    recoveryTarget: text("recovery_target").notNull(),
    fallbackCapability: text("fallback_capability").notNull(),
    criticalDependencies: text("critical_dependencies").notNull(),
    localLanguages: text("local_languages").notNull(),
    languageValidation: text("language_validation").notNull(),
    knowledgeTransfer: text("knowledge_transfer").notNull(),
    evidenceReference: text("evidence_reference").notNull(),
    readinessScore: integer("readiness_score").notNull(),
    outcome: text("outcome").notNull(),
    failedChecks: text("failed_checks", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'`),
    assessedBy: text("assessed_by").notNull(),
    reviewDate: text("review_date").notNull(),
    createdAt: created(),
  },
  (table) => [
    index("idx_sovereign_resilience_org_system").on(
      table.organizationId,
      table.systemCode,
    ),
  ],
);
export const recoveryExercises = sqliteTable(
  "recovery_exercises",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    exerciseCode: text("exercise_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    systemCode: text("system_code").notNull(),
    exerciseDate: text("exercise_date").notNull(),
    backupMethod: text("backup_method").notNull(),
    restoreEnvironment: text("restore_environment").notNull(),
    targetRpoMinutes: integer("target_rpo_minutes").notNull(),
    actualDataLossMinutes: integer("actual_data_loss_minutes").notNull(),
    targetRtoMinutes: integer("target_rto_minutes").notNull(),
    actualRecoveryMinutes: integer("actual_recovery_minutes").notNull(),
    restoreIntegrity: text("restore_integrity").notNull(),
    auditChainVerification: text("audit_chain_verification").notNull(),
    evidenceReference: text("evidence_reference").notNull(),
    outcome: text("outcome").notNull(),
    failedChecks: text("failed_checks", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'`),
    performedBy: text("performed_by").notNull(),
    createdAt: created(),
  },
  (table) => [
    index("idx_recovery_exercises_org_system").on(
      table.organizationId,
      table.systemCode,
      table.exerciseDate,
    ),
  ],
);
export const agrifoodSupplyAssessments = sqliteTable(
  "agrifood_supply_assessments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assessmentCode: text("assessment_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    programmeName: text("programme_name").notNull(),
    jurisdiction: text("jurisdiction").notNull(),
    commodity: text("commodity").notNull(),
    farmerIdentity: text("farmer_identity").notNull(),
    lotTraceability: text("lot_traceability").notNull(),
    physicalDigitalLink: text("physical_digital_link").notNull(),
    dataOwnership: text("data_ownership").notNull(),
    algorithmicProcurement: text("algorithmic_procurement").notNull(),
    priceTransparency: text("price_transparency").notNull(),
    smartContractControls: text("smart_contract_controls").notNull(),
    logisticsEvidence: text("logistics_evidence").notNull(),
    foodLossBaseline: text("food_loss_baseline").notNull(),
    farmerEarningsMeasure: text("farmer_earnings_measure").notNull(),
    offlineAccess: text("offline_access").notNull(),
    disputeResolution: text("dispute_resolution").notNull(),
    humanOverride: text("human_override").notNull(),
    readinessScore: integer("readiness_score").notNull(),
    outcome: text("outcome").notNull(),
    assessedBy: text("assessed_by").notNull(),
    reviewDate: text("review_date").notNull(),
    createdAt: created(),
  },
);
export const legalSources = sqliteTable("legal_sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceCode: text("source_code").notNull().unique(),
  organizationId: text("organization_id").notNull(),
  title: text("title").notNull(),
  publisher: text("publisher").notNull(),
  documentType: text("document_type").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  publicationYear: integer("publication_year").notNull(),
  sourceUrl: text("source_url").notNull(),
  frameworkArea: text("framework_area").notNull(),
  applicability: text("applicability").notNull(),
  mappedControls: text("mapped_controls").notNull(),
  evidenceNotes: text("evidence_notes").notNull(),
  authorityLevel: text("authority_level").notNull(),
  verifiedOn: text("verified_on").notNull(),
  nextReview: text("next_review").notNull(),
  status: text("status").notNull(),
  addedBy: text("added_by").notNull(),
  createdAt: created(),
});
export const publicSectorAssessments = sqliteTable(
  "public_sector_assessments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assessmentCode: text("assessment_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    systemCode: text("system_code").notNull(),
    agency: text("agency").notNull(),
    publicDecision: text("public_decision").notNull(),
    aiRole: text("ai_role").notNull(),
    legitimatePurpose: text("legitimate_purpose").notNull(),
    lessIntrusiveAlternative: text("less_intrusive_alternative").notNull(),
    publicValueMeasure: text("public_value_measure").notNull(),
    dueProcess: text("due_process").notNull(),
    citizenNotice: text("citizen_notice").notNull(),
    explanationProcedure: text("explanation_procedure").notNull(),
    contestability: text("contestability").notNull(),
    errorCorrection: text("error_correction").notNull(),
    meaningfulHumanControl: text("meaningful_human_control").notNull(),
    dataQuality: text("data_quality").notNull(),
    distributiveImpact: text("distributive_impact").notNull(),
    surveillanceNecessity: text("surveillance_necessity").notNull(),
    procurementAuditRights: text("procurement_audit_rights").notNull(),
    vendorExit: text("vendor_exit").notNull(),
    generativeAiControls: text("generative_ai_controls").notNull(),
    readinessScore: integer("readiness_score").notNull(),
    outcome: text("outcome").notNull(),
    assessedBy: text("assessed_by").notNull(),
    reviewDate: text("review_date").notNull(),
    createdAt: created(),
  },
);
export const vendorRiskRegister = sqliteTable("vendor_risk_register", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vendorCode: text("vendor_code").notNull().unique(),
  organizationId: text("organization_id").notNull(),
  vendorName: text("vendor_name").notNull(),
  serviceType: text("service_type").notNull(),
  aiInvolvement: text("ai_involvement").notNull(),
  linkedSystems: text("linked_systems").notNull(),
  certifications: text("certifications").notNull(),
  certificationEvidence: text("certification_evidence").notNull(),
  subprocessors: text("subprocessors").notNull(),
  rightToAudit: text("right_to_audit").notNull(),
  contractEnd: text("contract_end").notNull(),
  inherentRisk: text("inherent_risk").notNull(),
  residualRisk: text("residual_risk").notNull(),
  vendorClaimsVerified: text("vendor_claims_verified").notNull(),
  continuityPlan: text("continuity_plan").notNull(),
  riskScore: integer("risk_score").notNull(),
  status: text("status").notNull(),
  assessedBy: text("assessed_by").notNull(),
  nextReview: text("next_review").notNull(),
  createdAt: created(),
});
export const competencyRecords = sqliteTable("competency_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recordCode: text("record_code").notNull().unique(),
  organizationId: text("organization_id").notNull(),
  personEmail: text("person_email").notNull(),
  governanceRole: text("governance_role").notNull(),
  trainingName: text("training_name").notNull(),
  competencyLevel: text("competency_level").notNull(),
  assessmentMethod: text("assessment_method").notNull(),
  completedAt: text("completed_at").notNull(),
  expiresAt: text("expires_at").notNull(),
  evidenceReference: text("evidence_reference").notNull(),
  status: text("status").notNull(),
  recordedBy: text("recorded_by").notNull(),
  createdAt: created(),
});
export const modelRetirements = sqliteTable("model_retirements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  retirementCode: text("retirement_code").notNull().unique(),
  organizationId: text("organization_id").notNull(),
  systemCode: text("system_code").notNull(),
  modelVersion: text("model_version").notNull(),
  reason: text("reason").notNull(),
  retirementDate: text("retirement_date").notNull(),
  dataRetentionPlan: text("data_retention_plan").notNull(),
  dependencyNotifications: text("dependency_notifications").notNull(),
  fallbackModel: text("fallback_model").notNull(),
  evidenceArchive: text("evidence_archive").notNull(),
  requestedBy: text("requested_by").notNull(),
  approvedBy: text("approved_by"),
  status: text("status").notNull().default("PLANNED"),
  createdAt: created(),
});
export const confidentialReports = sqliteTable("confidential_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  trackingCode: text("tracking_code").notNull().unique(),
  organizationId: text("organization_id").notNull(),
  category: text("category").notNull(),
  systemCode: text("system_code").notNull(),
  description: text("description").notNull(),
  retaliationConcern: text("retaliation_concern").notNull(),
  status: text("status").notNull().default("RECEIVED"),
  linkedIncidentCode: text("linked_incident_code"),
  handlerNotes: text("handler_notes"),
  createdAt: created(),
});
export const deploymentGates = sqliteTable("deployment_gates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gateCode: text("gate_code").notNull().unique(),
  organizationId: text("organization_id").notNull(),
  systemCode: text("system_code").notNull(),
  agencyDecisionCode: text("agency_decision_code").notNull().default("LEGACY"),
  accountableOwner: text("accountable_owner").notNull(),
  riskTier: text("risk_tier").notNull(),
  autonomyBoundary: text("autonomy_boundary").notNull(),
  humanApproval: text("human_approval").notNull(),
  outputValidation: text("output_validation").notNull(),
  biasTesting: text("bias_testing").notNull(),
  loggingPlan: text("logging_plan").notNull(),
  incidentPlan: text("incident_plan").notNull(),
  shutdownAuthority: text("shutdown_authority").notNull(),
  readinessScore: integer("readiness_score").notNull(),
  outcome: text("outcome").notNull(),
  assessedBy: text("assessed_by").notNull(),
  approvedBy: text("approved_by"),
  approvedAt: text("approved_at"),
  createdAt: created(),
});
export const modelVersions = sqliteTable("model_versions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: text("organization_id").notNull(),
  systemCode: text("system_code").notNull(),
  version: text("version").notNull(),
  provider: text("provider").notNull(),
  changeSummary: text("change_summary").notNull(),
  validationStatus: text("validation_status").notNull().default("pending"),
  deployedAt: text("deployed_at"),
  createdAt: created(),
});
export const riskAssessments = sqliteTable("risk_assessments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: text("organization_id").notNull(),
  systemCode: text("system_code").notNull(),
  assessorEmail: text("assessor_email").notNull(),
  inherentRisk: text("inherent_risk").notNull(),
  residualRisk: text("residual_risk").notNull(),
  score: integer("score").notNull(),
  rationale: text("rationale").notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: created(),
});
export const controls = sqliteTable("controls", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: text("organization_id").notNull(),
  controlCode: text("control_code").notNull(),
  title: text("title").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  category: text("category").notNull(),
  requirement: text("requirement").notNull(),
  evidenceRequired: text("evidence_required").notNull(),
  version: text("version").notNull().default("1.0"),
  status: text("status").notNull().default("active"),
  createdAt: created(),
});
export const guardrailDecisions = sqliteTable("guardrail_decisions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: text("organization_id").notNull(),
  decisionCode: text("decision_code").notNull().unique(),
  systemCode: text("system_code").notNull(),
  guardrailCode: text("guardrail_code").notNull(),
  level: text("level").notNull(),
  trigger: text("trigger").notNull(),
  deterministicResult: text("deterministic_result").notNull(),
  requiredApprovals: integer("required_approvals").notNull().default(1),
  createdBy: text("created_by").notNull().default("legacy-system"),
  status: text("status").notNull().default("pending"),
  createdAt: created(),
});
export const approvals = sqliteTable(
  "approvals",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: text("organization_id").notNull(),
    decisionCode: text("decision_code").notNull(),
    approverEmail: text("approver_email").notNull(),
    approverRole: text("approver_role").notNull(),
    outcome: text("outcome").notNull(),
    justification: text("justification").notNull(),
    createdAt: created(),
  },
  (table) => [
    uniqueIndex("uq_approvals_org_decision_approver").on(
      table.organizationId,
      table.decisionCode,
      table.approverEmail,
    ),
  ],
);
export const overrides = sqliteTable("overrides", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: text("organization_id").notNull(),
  overrideCode: text("override_code").notNull().unique(),
  decisionCode: text("decision_code").notNull(),
  requestedBy: text("requested_by").notNull(),
  reason: text("reason").notNull(),
  compensatingControls: text("compensating_controls").notNull(),
  expiresAt: text("expires_at").notNull(),
  status: text("status").notNull().default("awaiting_dual_approval"),
  createdAt: created(),
});
export const evidence = sqliteTable("evidence", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: text("organization_id").notNull(),
  evidenceCode: text("evidence_code").notNull().unique(),
  systemCode: text("system_code").notNull(),
  title: text("title").notNull(),
  evidenceType: text("evidence_type").notNull(),
  source: text("source").notNull(),
  hash: text("content_hash").notNull(),
  status: text("status").notNull().default("verified"),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: created(),
});
export const incidents = sqliteTable("incidents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: text("organization_id").notNull(),
  incidentCode: text("incident_code").notNull().unique(),
  systemCode: text("system_code").notNull(),
  severity: text("severity").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("detected"),
  owner: text("owner").notNull(),
  containedAt: text("contained_at"),
  createdAt: created(),
});
export const correctiveActions = sqliteTable("corrective_actions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: text("organization_id").notNull(),
  incidentCode: text("incident_code").notNull(),
  actionCode: text("action_code").notNull().unique(),
  rootCause: text("root_cause").notNull(),
  action: text("action").notNull(),
  owner: text("owner").notNull(),
  dueDate: text("due_date").notNull(),
  effectivenessTest: text("effectiveness_test").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: created(),
});
export const privacyRequests = sqliteTable("privacy_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: text("organization_id").notNull(),
  requestCode: text("request_code").notNull().unique(),
  requestType: text("request_type").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  subjectReference: text("subject_reference").notNull(),
  systemCode: text("system_code").notNull(),
  status: text("status").notNull().default("identity_verification"),
  dueDate: text("due_date").notNull(),
  owner: text("owner").notNull(),
  createdAt: created(),
});
export const policies = sqliteTable("policies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: text("organization_id").notNull(),
  policyCode: text("policy_code").notNull(),
  title: text("title").notNull(),
  version: text("version").notNull(),
  effectiveDate: text("effective_date").notNull(),
  approvedBy: text("approved_by").notNull(),
  status: text("status").notNull().default("draft"),
  body: text("body").notNull(),
  createdAt: created(),
});
export const auditEvents = sqliteTable(
  "audit_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: text("organization_id").notNull(),
    actorEmail: text("actor_email").notNull(),
    actorRole: text("actor_role").notNull(),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityCode: text("entity_code").notNull(),
    details: text("details").notNull(),
    sourceIp: text("source_ip"),
    previousHash: text("previous_hash"),
    eventHash: text("event_hash").notNull(),
    hashVersion: text("hash_version").notNull().default("legacy"),
    createdAt: created(),
  },
  (table) => [
    uniqueIndex("uq_audit_events_org_previous_hash").on(
      table.organizationId,
      table.previousHash,
    ),
    uniqueIndex("uq_audit_events_org_event_hash").on(
      table.organizationId,
      table.eventHash,
    ),
    index("idx_audit_events_org_id").on(table.organizationId, table.id),
  ],
);
export const workforceConductCases = sqliteTable(
  "workforce_conduct_cases",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: text("organization_id").notNull(),
    subjectUserId: integer("subject_user_id").notNull(),
    reportedByUserId: integer("reported_by_user_id"),
    linkedWhistleblowerReportId: integer("linked_whistleblower_report_id"),
    grounds: text("grounds").notNull(),
    description: text("description").notNull(),
    stage: text("stage").notNull().default("informal_resolution"),
    investigatorUserId: integer("investigator_user_id"),
    investigatorConflictChecked: integer("investigator_conflict_checked", {
      mode: "boolean",
    })
      .notNull()
      .default(false),
    outcome: text("outcome"),
    outcomeDate: text("outcome_date"),
    createdAt: created(),
  },
  (table) => [
    index("idx_workforce_conduct_cases_org").on(table.organizationId),
  ],
);
export const workforceConductStageEvents = sqliteTable(
  "workforce_conduct_stage_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: text("organization_id").notNull(),
    caseId: integer("case_id")
      .notNull()
      .references(() => workforceConductCases.id),
    stage: text("stage").notNull(),
    actorUserId: integer("actor_user_id").notNull(),
    notes: text("notes"),
    occurredAt: text("occurred_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_workforce_conduct_stage_events_org_case").on(
      table.organizationId,
      table.caseId,
    ),
  ],
);
export const accountabilitySuccessions = sqliteTable(
  "accountability_successions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: text("organization_id").notNull(),
    outgoingUserId: integer("outgoing_user_id").notNull(),
    incomingUserId: integer("incoming_user_id"),
    role: text("role").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    triggerReason: text("trigger_reason").notNull(),
    handoffDeadline: text("handoff_deadline").notNull(),
    status: text("status").notNull().default("pending"),
    reassignedAt: text("reassigned_at"),
    createdAt: created(),
  },
  (table) => [
    index("idx_accountability_successions_org_status_deadline").on(
      table.organizationId,
      table.status,
      table.handoffDeadline,
    ),
  ],
);
export const conductPatternFlags = sqliteTable(
  "conduct_pattern_flags",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: text("organization_id").notNull(),
    subjectUserId: integer("subject_user_id").notNull(),
    patternType: text("pattern_type").notNull(),
    windowStart: text("window_start").notNull(),
    windowEnd: text("window_end").notNull(),
    eventCount: integer("event_count").notNull(),
    threshold: integer("threshold").notNull(),
    linkedAuditEventIds: text("linked_audit_event_ids", { mode: "json" })
      .$type<number[]>()
      .notNull()
      .default(sql`'[]'`),
    reviewedByUserId: integer("reviewed_by_user_id"),
    reviewStatus: text("review_status").notNull().default("open"),
    linkedConductCaseId: integer("linked_conduct_case_id"),
    createdAt: created(),
  },
  (table) => [
    index("idx_conduct_pattern_flags_org_type_status_subject").on(
      table.organizationId,
      table.patternType,
      table.reviewStatus,
      table.subjectUserId,
    ),
  ],
);


/* WikiSkill / Agent Skill Governance and Provenance */
export const skillRegistry = sqliteTable(
  "skill_registry",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    skillCode: text("skill_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    systemCode: text("system_code").notNull(),
    agentCode: text("agent_code").notNull(),
    name: text("name").notNull(),
    purpose: text("purpose").notNull(),
    currentVersion: text("current_version"),
    lifecycleStatus: text("lifecycle_status").notNull().default("draft"),
    riskTier: text("risk_tier").notNull().default("Medium"),
    owner: text("owner").notNull(),
    approvedScope: text("approved_scope").notNull(),
    approvedTools: text("approved_tools").notNull(),
    approvedData: text("approved_data").notNull(),
    jurisdictions: text("jurisdictions").notNull(),
    reviewDue: text("review_due").notNull(),
    createdAt: created(),
  },
  (table) => [
    index("idx_skill_registry_org_status").on(table.organizationId, table.lifecycleStatus),
    index("idx_skill_registry_org_agent").on(table.organizationId, table.agentCode),
    index("idx_skill_registry_org_system").on(table.organizationId, table.systemCode),
  ],
);

export const skillVersions = sqliteTable(
  "skill_versions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    versionCode: text("version_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    skillCode: text("skill_code").notNull(),
    version: text("version").notNull(),
    content: text("content").notNull(),
    contentDigest: text("content_digest").notNull(),
    sourceType: text("source_type").notNull(),
    parentVersion: text("parent_version"),
    changeSummary: text("change_summary").notNull(),
    behavioralDelta: text("behavioral_delta").notNull(),
    proposedBy: text("proposed_by").notNull(),
    validationStatus: text("validation_status").notNull().default("pending"),
    approvalStatus: text("approval_status").notNull().default("pending"),
    deploymentStatus: text("deployment_status").notNull().default("not_deployed"),
    createdAt: created(),
  },
  (table) => [
    uniqueIndex("uq_skill_versions_org_skill_version").on(
      table.organizationId,
      table.skillCode,
      table.version,
    ),
    index("idx_skill_versions_org_digest").on(table.organizationId, table.contentDigest),
  ],
);

export const skillProvenance = sqliteTable(
  "skill_provenance",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    provenanceCode: text("provenance_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    skillCode: text("skill_code").notNull(),
    agentCode: text("agent_code").notNull(),
    evidenceType: text("evidence_type").notNull(),
    evidenceReference: text("evidence_reference").notNull(),
    observationSummary: text("observation_summary").notNull(),
    pattern: text("pattern").notNull(),
    sourceExecutionIds: text("source_execution_ids").notNull(),
    sensitiveDataClassification: text("sensitive_data_classification").notNull(),
    retentionRule: text("retention_rule").notNull(),
    recordedBy: text("recorded_by").notNull(),
    createdAt: created(),
  },
  (table) => [
    index("idx_skill_provenance_org_skill").on(table.organizationId, table.skillCode),
  ],
);

export const skillChangeProposals = sqliteTable(
  "skill_change_proposals",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    proposalCode: text("proposal_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    skillCode: text("skill_code").notNull(),
    fromVersion: text("from_version"),
    proposedVersion: text("proposed_version").notNull(),
    proposedVersionCode: text("proposed_version_code").notNull(),
    changeRationale: text("change_rationale").notNull(),
    provenanceRefs: text("provenance_refs").notNull(),
    expectedBenefit: text("expected_benefit").notNull(),
    knownRisks: text("known_risks").notNull(),
    affectedWorkflows: text("affected_workflows").notNull(),
    affectedTools: text("affected_tools").notNull(),
    affectedData: text("affected_data").notNull(),
    rollbackTarget: text("rollback_target"),
    proposedBy: text("proposed_by").notNull(),
    status: text("status").notNull().default("proposed"),
    createdAt: created(),
  },
  (table) => [
    index("idx_skill_change_proposals_org_status").on(table.organizationId, table.status),
    index("idx_skill_change_proposals_org_skill").on(table.organizationId, table.skillCode),
  ],
);

export const skillValidationRuns = sqliteTable(
  "skill_validation_runs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    validationCode: text("validation_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    proposalCode: text("proposal_code").notNull(),
    skillCode: text("skill_code").notNull(),
    candidateVersion: text("candidate_version").notNull(),
    candidateDigest: text("candidate_digest").notNull(),
    baselineVersion: text("baseline_version"),
    testSetReference: text("test_set_reference").notNull(),
    baselineScore: integer("baseline_score").notNull().default(0),
    candidateScore: integer("candidate_score").notNull().default(0),
    thresholdDelta: integer("threshold_delta").notNull().default(0),
    safetyPass: integer("safety_pass", { mode: "boolean" }).notNull().default(false),
    policyPass: integer("policy_pass", { mode: "boolean" }).notNull().default(false),
    toolScopePass: integer("tool_scope_pass", { mode: "boolean" }).notNull().default(false),
    dataScopePass: integer("data_scope_pass", { mode: "boolean" }).notNull().default(false),
    resultArtifact: text("result_artifact").notNull(),
    outcome: text("outcome").notNull().default("VALIDATING"),
    reviewedBy: text("reviewed_by"),
    createdAt: created(),
    completedAt: text("completed_at"),
  },
  (table) => [
    index("idx_skill_validation_org_proposal").on(table.organizationId, table.proposalCode),
  ],
);

export const skillApprovals = sqliteTable(
  "skill_approvals",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    approvalCode: text("approval_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    proposalCode: text("proposal_code").notNull(),
    skillCode: text("skill_code").notNull(),
    approverEmail: text("approver_email").notNull(),
    approverRole: text("approver_role").notNull(),
    outcome: text("outcome").notNull(),
    justification: text("justification").notNull(),
    createdAt: created(),
  },
  (table) => [
    uniqueIndex("uq_skill_approvals_org_proposal_approver").on(
      table.organizationId,
      table.proposalCode,
      table.approverEmail,
    ),
    index("idx_skill_approvals_org_proposal").on(table.organizationId, table.proposalCode),
  ],
);

export const skillDeployments = sqliteTable(
  "skill_deployments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deploymentCode: text("deployment_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    skillCode: text("skill_code").notNull(),
    approvedVersion: text("approved_version").notNull(),
    targetAgent: text("target_agent").notNull(),
    targetSystem: text("target_system").notNull(),
    environment: text("environment").notNull(),
    deployedBy: text("deployed_by").notNull(),
    approvalReference: text("approval_reference").notNull(),
    validationReference: text("validation_reference").notNull(),
    priorActiveVersion: text("prior_active_version"),
    rollbackVersion: text("rollback_version"),
    deploymentDigest: text("deployment_digest").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: created(),
  },
  (table) => [
    index("idx_skill_deployments_org_skill_status").on(
      table.organizationId,
      table.skillCode,
      table.status,
    ),
  ],
);

export const skillPerformanceReviews = sqliteTable(
  "skill_performance_reviews",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    reviewCode: text("review_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    skillCode: text("skill_code").notNull(),
    version: text("version").notNull(),
    baselineMetric: text("baseline_metric").notNull(),
    postDeploymentMetric: text("post_deployment_metric").notNull(),
    evaluationWindow: text("evaluation_window").notNull(),
    safetyIncidents: integer("safety_incidents").notNull().default(0),
    policyViolations: integer("policy_violations").notNull().default(0),
    humanOverrideRate: text("human_override_rate").notNull(),
    failureRate: text("failure_rate").notNull(),
    toolErrorRate: text("tool_error_rate").notNull(),
    unexpectedBehavior: text("unexpected_behavior").notNull(),
    conclusion: text("conclusion").notNull(),
    reviewedBy: text("reviewed_by").notNull(),
    nextReview: text("next_review").notNull(),
    createdAt: created(),
  },
  (table) => [
    index("idx_skill_performance_org_skill").on(table.organizationId, table.skillCode),
  ],
);

export const skillRollbacks = sqliteTable(
  "skill_rollbacks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    rollbackCode: text("rollback_code").notNull().unique(),
    organizationId: text("organization_id").notNull(),
    skillCode: text("skill_code").notNull(),
    trigger: text("trigger").notNull(),
    suspendedVersion: text("suspended_version").notNull(),
    restoredVersion: text("restored_version").notNull(),
    authorizedBy: text("authorized_by").notNull(),
    affectedExecutions: text("affected_executions").notNull(),
    incidentReference: text("incident_reference"),
    evidencePackageReference: text("evidence_package_reference").notNull(),
    createdAt: created(),
  },
  (table) => [
    index("idx_skill_rollbacks_org_skill").on(table.organizationId, table.skillCode),
  ],
);


/* R2–R12 Advanced Governance Runtime — migration generation source */
const advancedGovernanceLedger = (tableName: string) =>
  sqliteTable(
    tableName,
    {
      id: integer("id").primaryKey({ autoIncrement: true }),
      recordCode: text("record_code").notNull().unique(),
      organizationId: text("organization_id").notNull(),
      subjectCode: text("subject_code"),
      parentCode: text("parent_code"),
      state: text("state").notNull().default("active"),
      dataLane: text("data_lane").notNull().default("INTERNAL"),
      jurisdiction: text("jurisdiction"),
      payload: text("payload", { mode: "json" })
        .$type<Record<string, unknown>>()
        .notNull(),
      contentDigest: text("content_digest").notNull(),
      createdBy: text("created_by").notNull(),
      effectiveAt: text("effective_at"),
      expiresAt: text("expires_at"),
      createdAt: created(),
    },
    (table) => [
      index(`idx_${tableName}_org_state`).on(table.organizationId, table.state),
      index(`idx_${tableName}_org_subject`).on(table.organizationId, table.subjectCode),
    ],
  );

/* R2 — Governed Workflows & Action Classification */
export const governedWorkflows = advancedGovernanceLedger("governed_workflows");
export const governedWorkflowExecutions = advancedGovernanceLedger("governed_workflow_executions");
export const dataEgressEvents = advancedGovernanceLedger("data_egress_events");

/* R3 — Freshness, Source Health & Data Lanes */
export const governedSourceRecords = advancedGovernanceLedger("governed_source_records");
export const executionPreflights = advancedGovernanceLedger("execution_preflights");
export const dataLanePolicies = advancedGovernanceLedger("data_lane_policies");

/* R4 — Context, Tool Capability, Evaluation & Loop Controls */
export const governedContextRecords = advancedGovernanceLedger("governed_context_records");
export const toolCapabilityRegistry = advancedGovernanceLedger("tool_capability_registry");
export const governanceEvaluationRuns = advancedGovernanceLedger("governance_evaluation_runs");
export const governedLoopControls = advancedGovernanceLedger("governed_loop_controls");

/* R5 — Checkpoints, Resume, Sandbox & Extensions */
export const executionCheckpoints = advancedGovernanceLedger("execution_checkpoints");
export const executionResumeEvents = advancedGovernanceLedger("execution_resume_events");
export const sandboxPolicyProfiles = advancedGovernanceLedger("sandbox_policy_profiles");
export const governedExtensions = advancedGovernanceLedger("governed_extensions");
export const runtimeStateRecords = advancedGovernanceLedger("runtime_state_records");

/* R6 — Governed Human Evidence */
export const humanEvidenceRequests = advancedGovernanceLedger("human_evidence_requests");
export const humanEvidenceInteractions = advancedGovernanceLedger("human_evidence_interactions");
export const humanEvidenceResponses = advancedGovernanceLedger("human_evidence_responses");

/* R7 — Metering-Grade Accountability */
export const governedUsageEvents = advancedGovernanceLedger("governed_usage_events");
export const governanceEntitlements = advancedGovernanceLedger("governance_entitlements");
export const governanceQuotaPolicies = advancedGovernanceLedger("governance_quota_policies");
export const governanceThresholdEvents = advancedGovernanceLedger("governance_threshold_events");
export const governanceReconciliations = advancedGovernanceLedger("governance_reconciliations");

/* R8 — Governed Notifications */
export const governedNotificationWorkflows = advancedGovernanceLedger("governed_notification_workflows");
export const notificationInstances = advancedGovernanceLedger("notification_instances");
export const notificationDeliveryAttempts = advancedGovernanceLedger("notification_delivery_attempts");
export const notificationAcknowledgements = advancedGovernanceLedger("notification_acknowledgements");
export const notificationEscalations = advancedGovernanceLedger("notification_escalations");
export const notificationProviderRegistry = advancedGovernanceLedger("notification_provider_registry");

/* R9 — Controlled Evidence Disclosure */
export const governedEvidenceRooms = advancedGovernanceLedger("governed_evidence_rooms");
export const evidenceArtifacts = advancedGovernanceLedger("evidence_artifacts");
export const evidenceArtifactVersions = advancedGovernanceLedger("evidence_artifact_versions");
export const evidenceDisclosureGrants = advancedGovernanceLedger("evidence_disclosure_grants");
export const evidenceDisclosureActivities = advancedGovernanceLedger("evidence_disclosure_activities");
export const evidenceRequestTasks = advancedGovernanceLedger("evidence_request_tasks");
export const evidenceRoomFreezes = advancedGovernanceLedger("evidence_room_freezes");
export const evidenceRedactionJobs = advancedGovernanceLedger("evidence_redaction_jobs");

/* R10 — Professional Reliance */
export const governedMatters = advancedGovernanceLedger("governed_matters");
export const premiseAssertions = advancedGovernanceLedger("premise_assertions");
export const sourceProvenanceRecords = advancedGovernanceLedger("source_provenance_records");
export const artifactRelianceRecords = advancedGovernanceLedger("artifact_reliance_records");
export const professionalReviewEvents = advancedGovernanceLedger("professional_review_events");
export const releaseGateDecisions = advancedGovernanceLedger("release_gate_decisions");
export const sourceSubstitutionEvents = advancedGovernanceLedger("source_substitution_events");
export const verificationMemoryRecords = advancedGovernanceLedger("verification_memory_records");

/* R11 — Governed Session Capture */
export const governedCaptureSessions = advancedGovernanceLedger("governed_capture_sessions");
export const captureScopePolicies = advancedGovernanceLedger("capture_scope_policies");
export const captureArtifacts = advancedGovernanceLedger("capture_artifacts");
export const captureEvidenceAnchors = advancedGovernanceLedger("capture_evidence_anchors");
export const captureStorageProfiles = advancedGovernanceLedger("capture_storage_profiles");
export const captureProcessingEvents = advancedGovernanceLedger("capture_processing_events");
export const captureIntegrityChecks = advancedGovernanceLedger("capture_integrity_checks");
export const captureDeletionEvents = advancedGovernanceLedger("capture_deletion_events");

/* R12 — Data-Plane Governance */
export const dataPlanePolicies = advancedGovernanceLedger("data_plane_policies");
export const privilegedBypassIdentities = advancedGovernanceLedger("privileged_bypass_identities");
export const privilegedBypassEvents = advancedGovernanceLedger("privileged_bypass_events");
export const realtimeChannelPolicies = advancedGovernanceLedger("realtime_channel_policies");
export const realtimeSubscriptionEvents = advancedGovernanceLedger("realtime_subscription_events");
export const objectStoragePolicies = advancedGovernanceLedger("object_storage_policies");
export const secretReferenceRegistry = advancedGovernanceLedger("secret_reference_registry");
export const secretRotationEvents = advancedGovernanceLedger("secret_rotation_events");
export const securityLintRules = advancedGovernanceLedger("security_lint_rules");
export const securityLintFindings = advancedGovernanceLedger("security_lint_findings");
export const schemaPolicyMigrationRecords = advancedGovernanceLedger("schema_policy_migration_records");
export const schemaPolicyVerificationEvents = advancedGovernanceLedger("schema_policy_verification_events");


/* Data Protection & Privacy Governance Module */
const privacyGovernanceLedger = (tableName: string) =>
  sqliteTable(
    tableName,
    {
      id: integer("id").primaryKey({ autoIncrement: true }),
      recordCode: text("record_code").notNull().unique(),
      organizationId: text("organization_id").notNull(),
      systemCode: text("system_code"),
      subjectCode: text("subject_code"),
      state: text("state").notNull().default("draft"),
      jurisdiction: text("jurisdiction"),
      owner: text("owner").notNull(),
      payload: text("payload", { mode: "json" })
        .$type<Record<string, unknown>>()
        .notNull(),
      contentDigest: text("content_digest").notNull(),
      evidenceRefs: text("evidence_refs").notNull().default(""),
      nextReview: text("next_review"),
      createdBy: text("created_by").notNull(),
      createdAt: created(),
      updatedAt: text("updated_at"),
    },
    (table) => [
      index(\`idx_\${tableName}_org_state\`).on(table.organizationId, table.state),
      index(\`idx_\${tableName}_org_system\`).on(table.organizationId, table.systemCode),
    ],
  );

export const privacyPurposeLawfulness = privacyGovernanceLedger("privacy_purpose_lawfulness");
export const privacyDataInventoryFlows = privacyGovernanceLedger("privacy_data_inventory_flows");
export const privacyRightsRequests = privacyGovernanceLedger("privacy_rights_requests");
export const privacyThirdPartyAssessments = privacyGovernanceLedger("privacy_third_party_assessments");
export const privacyRiskAssessments = privacyGovernanceLedger("privacy_risk_assessments");
export const privacyDpiaAssessments = privacyGovernanceLedger("privacy_dpia_assessments");
export const privacyAiDataAssessments = privacyGovernanceLedger("privacy_ai_data_assessments");
export const privacyRetentionRecords = privacyGovernanceLedger("privacy_retention_records");
export const privacyGovernanceEvidence = privacyGovernanceLedger("privacy_governance_evidence");
