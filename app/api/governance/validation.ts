import { badRequest } from "../http";

type Kind =
  "text" | "email" | "date" | "datetime" | "integer" | "number" | "url";
type Rule = {
  kind?: Kind;
  required?: boolean;
  max?: number;
  min?: number;
  maximum?: number;
  values?: readonly string[];
};
type Schema = Record<string, Rule>;

const text = (max = 500, required = true): Rule => ({
  kind: "text",
  max,
  required,
});
const optionalText = (max = 500): Rule => text(max, false);
const date = (): Rule => ({ kind: "date", required: true });
const datetime = (): Rule => ({ kind: "datetime", required: true });
const email = (): Rule => ({ kind: "email", required: true, max: 254 });
const integer = (min = 1, maximum = Number.MAX_SAFE_INTEGER): Rule => ({
  kind: "integer",
  required: true,
  min,
  maximum,
});
const number = (min = 0, maximum = 100): Rule => ({
  kind: "number",
  required: true,
  min,
  maximum,
});
const oneOf = (...values: string[]): Rule => ({
  required: true,
  values,
  max: 100,
});
const fields = (...names: string[]) =>
  Object.fromEntries(names.map((name) => [name, text()]));

const schemas: Record<string, Schema> = {
  invite_user: {
    displayName: text(120),
    email: email(),
    role: oneOf("admin", "system_owner", "reviewer", "approver", "auditor"),
  },
  update_user: {
    userId: integer(),
    role: oneOf(
      "admin",
      "system_owner",
      "reviewer",
      "approver",
      "auditor",
      "accountable_executive",
    ),
    status: oneOf("active", "inactive"),
  },
  designate_accountable_executive: { userId: integer() },
  open_workforce_conduct_case: {
    subjectUserId: integer(),
    grounds: oneOf(
      "unauthorized_confidential_data_entry",
      "approval_threshold_bypass",
      "unauthorized_override",
      "other",
    ),
    description: text(5000),
    investigatorUserId: { ...integer(), required: false },
    linkedWhistleblowerReportId: { ...integer(), required: false },
    linkedOverrideAuthorizerId: { ...integer(), required: false },
  },
  advance_workforce_conduct_stage: {
    caseId: integer(),
    stage: oneOf(
      "informal_resolution",
      "written_warning",
      "formal_review",
      "separation",
      "closed_no_action",
    ),
    outcome: optionalText(2000),
    notes: optionalText(2000),
  },
  open_accountability_succession: {
    outgoingUserId: integer(),
    incomingUserId: { ...integer(), required: false },
    role: oneOf(
      "system_owner",
      "approver",
      "reviewer",
      "dpo",
      "oversight_role",
      "accountable_executive",
    ),
    entityType: text(100),
    entityId: text(200),
    triggerReason: oneOf("exit", "reassignment"),
    handoffDeadline: datetime(),
  },
  reassign_accountability_succession: {
    successionId: integer(),
    incomingUserId: integer(),
  },
  flag_overdue_successions: {},
  scan_conduct_patterns: {
    windowDays: { ...integer(1, 365), required: false },
    threshold: { ...integer(2, 100), required: false },
  },
  review_conduct_pattern: {
    flagId: integer(),
    reviewStatus: oneOf("reviewed_no_action", "escalated_to_conduct_case"),
  },
  register_system: {
    name: text(200),
    owner: text(200),
    region: text(300),
    purpose: text(4000),
    risk: oneOf("Low", "Medium", "High", "Critical"),
    model: optionalText(300),
    data: optionalText(1000),
    hostingLocation: optionalText(300),
    decisionImpact: optionalText(500),
  },
  register_agent: {
    systemCode: text(100),
    name: text(200),
    owner: text(200),
    purpose: text(4000),
    scope: text(4000),
    approvedTools: text(2000),
    approvedData: text(2000),
    jurisdiction: text(200),
    reviewDue: date(),
  },
  request_access: {
    agentCode: text(100),
    resource: text(500),
    permission: text(200),
    purpose: text(2000),
    leastPrivilegeBasis: text(3000),
    startsAt: datetime(),
    expiresAt: datetime(),
  },
  access_transition: {
    grantCode: text(100),
    transition: oneOf("approve", "review", "revoke"),
  },
  authorize_agent_action: {
    agentCode: text(100),
    resource: text(500),
    permission: text(200),
  },
  evaluate_agency_gate: {
    ...fields("proposalTitle", "sponsoringInstitution", "vendorName"),
    publicProblem: text(4000),
    affectedCommunities: text(4000),
    aiAppropriateness: oneOf("Complete", "Missing"),
    nonAiAlternative: oneOf("Complete", "Missing"),
    criticalityClass: oneOf("Standard", "Important", "Critical infrastructure"),
    vendorClaimsAssessment: oneOf("Complete", "Missing"),
    supplierDependencies: text(4000),
    serviceContinuityPlan: oneOf("Complete", "Missing"),
    governanceFrameworkMap: oneOf("Complete", "Missing"),
    sovereignConditions: text(4000),
    dataHostingRequirements: text(4000),
    independentAssessment: oneOf("Complete", "Missing"),
    communityEvidence: oneOf("Complete", "Missing"),
    exitPlan: oneOf("Complete", "Missing"),
    proposedDecision: oneOf("Adopt", "Refuse"),
  },
  agency_transition: {
    decisionCode: text(100),
    transition: oneOf("approve", "suspend", "discontinue"),
  },
  evaluate_deployment_gate: {
    ...fields("systemCode", "agencyDecisionCode", "accountableOwner"),
    riskTier: oneOf("Low", "Medium", "High", "Critical"),
    autonomyBoundary: text(4000),
    humanApproval: oneOf("Complete", "Missing"),
    outputValidation: oneOf("Complete", "Missing"),
    biasTesting: oneOf("Complete", "Missing"),
    loggingPlan: oneOf("Complete", "Missing"),
    incidentPlan: oneOf("Complete", "Missing"),
    shutdownAuthority: text(500),
  },
  approve_deployment_gate: { gateCode: text(100) },
  model_version: {
    systemCode: text(100),
    version: text(100),
    provider: text(300),
    changeSummary: text(4000),
  },
  model_retirement: {
    systemCode: text(100),
    modelVersion: text(100),
    reason: oneOf(
      "Superseded",
      "Vendor deprecated",
      "Risk finding",
      "Business decision",
      "Regulatory change",
    ),
    retirementDate: date(),
    dataRetentionPlan: text(4000),
    dependencyNotifications: text(4000),
    fallbackModel: text(1000),
    evidenceArchive: text(1000),
  },
  model_retirement_transition: {
    retirementCode: text(100),
    transition: oneOf("notify", "decommission", "archive"),
  },
  risk_assessment: {
    systemCode: text(100),
    inherentRisk: text(100),
    residualRisk: text(100),
    score: number(0, 100),
    rationale: text(4000),
  },
  vendor_risk: {
    vendorName: text(200),
    serviceType: oneOf(
      "Model provider",
      "Hosting",
      "Data processor",
      "Consulting",
      "Embedded AI",
      "Other",
    ),
    aiInvolvement: oneOf(
      "Core model",
      "Embedded component",
      "Infrastructure",
      "Advisory",
    ),
    linkedSystems: text(1000),
    certifications: text(1000),
    certificationEvidence: text(2000),
    subprocessors: text(4000),
    rightToAudit: oneOf("Enforceable", "Limited", "Missing"),
    contractEnd: date(),
    inherentRisk: oneOf("Low", "Moderate", "High", "Critical"),
    residualRisk: oneOf("Low", "Moderate", "High", "Critical"),
    vendorClaimsVerified: oneOf("Complete", "Partial", "Missing"),
    continuityPlan: text(4000),
    riskScore: number(0, 100),
    nextReview: date(),
  },
  competency_record: {
    personEmail: email(),
    governanceRole: oneOf(
      "admin",
      "system_owner",
      "reviewer",
      "approver",
      "auditor",
    ),
    trainingName: text(500),
    competencyLevel: oneOf("Foundational", "Operational", "Advanced", "Expert"),
    assessmentMethod: text(1000),
    completedAt: date(),
    expiresAt: date(),
    evidenceReference: text(2000),
  },
  assess_workforce_absorption: {
    ...fields("jurisdiction", "institution", "youthCohort"),
    skillsPipeline: oneOf("Operational", "Developing", "Missing"),
    entryLevelRoles: oneOf("Funded", "Planned", "Missing"),
    paidInternships: oneOf("Operational", "Limited", "Missing"),
    experienceBarrier: oneOf("Complete", "Partial", "Missing"),
    skillsBasedHiring: oneOf("Operational", "Partial", "Missing"),
    remoteWorkPolicy: oneOf("Operational", "Limited", "Missing"),
    managerReadiness: oneOf("Complete", "Partial", "Missing"),
    outputBasedPerformance: oneOf("Operational", "Partial", "Missing"),
    localOperationsRoles: oneOf("Funded", "Planned", "Missing"),
    retentionPathway: oneOf("Operational", "Partial", "Missing"),
    regionalAccess: oneOf("National", "Partial", "Capital only"),
    conversionTarget: text(4000),
    outcomeEvidence: text(4000),
    reviewDate: date(),
  },
  assess_public_sector_ai: {
    ...fields("systemCode", "agency"),
    publicDecision: text(4000),
    aiRole: oneOf(
      "Administrative automation",
      "Decision support",
      "Recommendation",
      "Decision substitution",
    ),
    legitimatePurpose: text(4000),
    lessIntrusiveAlternative: oneOf("Complete", "Partial", "Missing"),
    publicValueMeasure: text(4000),
    dueProcess: oneOf("Complete", "Partial", "Missing"),
    citizenNotice: oneOf("Complete", "Partial", "Missing"),
    explanationProcedure: oneOf("Operational", "Partial", "Missing"),
    contestability: oneOf("Operational", "Partial", "Missing"),
    errorCorrection: oneOf("Operational", "Partial", "Missing"),
    meaningfulHumanControl: oneOf("Demonstrated", "Partial", "Nominal"),
    dataQuality: oneOf("Complete", "Partial", "Missing"),
    distributiveImpact: oneOf("Complete", "Partial", "Missing"),
    surveillanceNecessity: oneOf("Complete", "Not applicable", "Missing"),
    procurementAuditRights: oneOf("Enforceable", "Limited", "Missing"),
    vendorExit: oneOf("Enforceable", "Limited", "Missing"),
    generativeAiControls: oneOf("Complete", "Not applicable", "Missing"),
    reviewDate: date(),
  },
  create_foresight_scenario: {
    scenario: oneOf(
      "AI Stall",
      "Precarious Precipice",
      "Hypercompetition",
      "Hyperpower",
      "Rogue ASI",
    ),
    timeHorizon: text(200),
    capabilityPace: oneOf("Slow", "Uneven", "Rapid", "Extreme"),
    humanControllability: oneOf("High", "Degrading", "Low", "Lost"),
    frontierConcentration: oneOf(
      "Distributed",
      "Few actors",
      "Single actor",
      "Unknown",
    ),
    criticalDomains: text(4000),
    institutionalImpact: text(4000),
    leadingIndicators: text(4000),
    preventiveControls: text(4000),
    continuityResponse: text(4000),
    internationalDependencies: text(4000),
    decisionOwner: text(300),
    reviewDate: date(),
  },
  assess_implementation_capacity: {
    ...fields("jurisdiction", "responsibleInstitution"),
    legalMandate: oneOf("Complete", "Partial", "Missing"),
    ringFencedBudget: oneOf("Funded", "Partially funded", "Missing"),
    staffingPlan: oneOf("Complete", "Partial", "Missing"),
    technicalCapability: oneOf("Operational", "Developing", "Missing"),
    enforcementPowers: oneOf("Operational", "Limited", "Missing"),
    regionalReach: oneOf("National", "Partial", "Capital only"),
    complaintChannel: oneOf("Operational", "Developing", "Missing"),
    inspectionProgramme: oneOf("Operational", "Planned", "Missing"),
    procurementControls: oneOf("Operational", "Draft", "Missing"),
    implementationMilestones: text(4000),
    performanceIndicators: text(4000),
    publicReporting: oneOf("Operational", "Irregular", "Missing"),
    evidenceReference: text(4000),
    reviewDate: date(),
  },
  assess_infrastructure_dividend: {
    ...fields("projectName", "jurisdiction", "operator"),
    plannedMegawatts: number(0.01, 1_000_000),
    additionalGeneration: oneOf("Contracted", "Partial", "None"),
    gridSupport: oneOf("Contracted", "Possible", "None"),
    networkCostsAssigned: oneOf("Complete", "Partial", "Missing"),
    householdTariffProtection: oneOf("Contracted", "Partial", "Missing"),
    sharedComputeCommitment: text(4000),
    localSkillsPlan: oneOf("Funded", "Partial", "Missing"),
    localProcurementTarget: text(4000),
    powerDisclosure: oneOf("Public", "Partial", "Missing"),
    waterDisclosure: oneOf("Public", "Partial", "Missing"),
    emissionsDisclosure: oneOf("Public", "Partial", "Missing"),
    publicBenefitTerms: text(4000),
    contractEnforcement: oneOf("Enforceable", "Limited", "Missing"),
    reviewDate: date(),
  },
  assess_africa_first: {
    ...fields("systemCode", "jurisdiction", "localLanguages"),
    ubuntuImpact: oneOf("Complete", "Partial", "Missing"),
    communityResources: text(4000),
    laborImpact: text(4000),
    intergenerationalImpact: text(4000),
    languagePerformanceEvidence: oneOf("Complete", "Partial", "Missing"),
    lowConnectivityDesign: oneOf("Operational", "Partial", "Missing"),
    mobileOfflineSupport: oneOf("Operational", "Partial", "Missing"),
    localDataControl: oneOf(
      "Sovereign",
      "Contractually protected",
      "Offshore uncontrolled",
    ),
    foreignDependencyPlan: text(4000),
    regionalInteroperability: oneOf("Complete", "Partial", "Missing"),
    smeProportionality: oneOf("Defined", "Partial", "Missing"),
    hypeChallenge: oneOf("Complete", "Partial", "Missing"),
    reviewDate: date(),
  },
  assess_sovereign_resilience: {
    systemCode: text(100),
    jurisdiction: text(200),
    criticalService: text(4000),
    primaryProvider: text(300),
    providerConcentration: oneOf(
      "Diversified",
      "Moderate",
      "Single-provider critical",
    ),
    verifiedAlternatives: oneOf("Multiple verified", "One verified", "None"),
    dataHostingJurisdictions: text(4000),
    dataResidencyControl: oneOf("Enforceable", "Partial", "Missing"),
    dataExportTest: oneOf("Passed", "Partial", "Failed", "Not tested"),
    workflowPortability: oneOf("Demonstrated", "Partial", "Missing"),
    contractAuditRights: oneOf("Enforceable", "Limited", "Missing"),
    contractExitRights: oneOf("Enforceable", "Limited", "Missing"),
    continuityPlan: oneOf("Tested", "Documented only", "Missing"),
    recoveryTarget: text(500),
    fallbackCapability: oneOf("Operational", "Partial", "Missing"),
    criticalDependencies: text(4000),
    localLanguages: text(500),
    languageValidation: oneOf("Complete", "Partial", "Missing", "Not applicable"),
    knowledgeTransfer: oneOf("Funded", "Partial", "Missing"),
    evidenceReference: text(4000),
    reviewDate: date(),
  },
  record_recovery_exercise: {
    systemCode: text(100),
    exerciseDate: date(),
    backupMethod: oneOf("D1 Time Travel", "Encrypted SQL export", "Both"),
    restoreEnvironment: text(300),
    targetRpoMinutes: integer(0, 43_200),
    actualDataLossMinutes: integer(0, 43_200),
    targetRtoMinutes: integer(1, 43_200),
    actualRecoveryMinutes: integer(0, 43_200),
    restoreIntegrity: oneOf("Passed", "Failed"),
    auditChainVerification: oneOf("Passed", "Failed"),
    evidenceReference: text(4000),
  },
  assess_agrifood_supply: {
    ...fields("programmeName", "jurisdiction", "commodity"),
    farmerIdentity: oneOf("Complete", "Partial", "Missing"),
    lotTraceability: oneOf("Operational", "Partial", "Missing"),
    physicalDigitalLink: oneOf("Verified", "Partial", "Missing"),
    dataOwnership: oneOf("Defined", "Partial", "Missing"),
    algorithmicProcurement: oneOf("Auditable", "Partial", "Opaque"),
    priceTransparency: oneOf("Transparent", "Partial", "Opaque"),
    smartContractControls: oneOf("Controlled", "Partial", "Missing"),
    logisticsEvidence: oneOf("End-to-end", "Partial", "Missing"),
    foodLossBaseline: text(4000),
    farmerEarningsMeasure: text(4000),
    offlineAccess: oneOf("Operational", "Partial", "Missing"),
    disputeResolution: oneOf("Operational", "Partial", "Missing"),
    humanOverride: oneOf("Defined", "Partial", "Missing"),
    reviewDate: date(),
  },
  register_legal_source: {
    ...fields(
      "title",
      "publisher",
      "jurisdiction",
      "applicability",
      "mappedControls",
      "evidenceNotes",
    ),
    documentType: oneOf(
      "Law",
      "Regulation",
      "Strategy",
      "Guidance",
      "Court decision",
      "Research report",
      "Policy analysis",
    ),
    publicationYear: integer(1900, 2200),
    sourceUrl: { kind: "url", required: true, max: 2048 },
    frameworkArea: oneOf(
      "AI governance",
      "Data protection",
      "Judicial systems",
      "Digital sovereignty",
      "Institutional capacity",
      "Cross-border cooperation",
      "Legal technology",
    ),
    authorityLevel: oneOf(
      "Binding",
      "Official non-binding",
      "Judicial authority",
      "Independent research",
    ),
    verifiedOn: date(),
    nextReview: date(),
  },
  assess_privacy_compliance: {
    ...fields("systemCode", "jurisdiction", "sector"),
    controllerRegistration: oneOf("Complete", "Not required", "Missing"),
    dpoAssigned: oneOf("Complete", "Not required", "Missing"),
    sensitiveData: oneOf(
      "No",
      "Yes — safeguards documented",
      "Yes — safeguards missing",
    ),
    childrenData: oneOf(
      "No",
      "Yes — authorization documented",
      "Yes — authorization missing",
    ),
    biometricProcessing: oneOf(
      "No",
      "Yes — notified and safeguarded",
      "Yes — controls missing",
    ),
    crossBorderTransfer: oneOf("No", "Yes"),
    transferMechanism: text(4000),
    priorAuthorization: oneOf("Complete", "Not required", "Missing"),
    processorDueDiligence: oneOf("Complete", "Missing"),
    rightsProcedure: oneOf("Complete", "Missing"),
    retentionSchedule: oneOf("Complete", "Missing"),
    breachProcedure: oneOf("Complete", "Missing"),
    reviewDate: date(),
  },
  control: {
    title: text(300),
    jurisdiction: text(200),
    category: text(200),
    requirement: text(4000),
    evidenceRequired: text(2000),
    version: text(50),
  },
  guardrail_decision: {
    systemCode: text(100),
    guardrailCode: text(100),
    level: oneOf("BLOCK", "WARN", "ALLOW"),
    trigger: text(4000),
  },
  approve: {
    decisionCode: text(100),
    outcome: oneOf("approved", "denied"),
    justification: text(3000),
  },
  request_override: {
    decisionCode: text(100),
    reason: text(4000),
    compensatingControls: text(4000),
    expiresAt: date(),
  },
  override_approve: { overrideCode: text(100), justification: text(3000) },
  override_deny: { overrideCode: text(100), justification: text(3000) },
  evidence: {
    systemCode: text(100),
    title: text(300),
    evidenceType: text(200),
    source: text(4000),
  },
  incident: {
    systemCode: text(100),
    severity: oneOf("Low", "Medium", "High", "Critical"),
    title: text(300),
    description: text(5000),
    owner: text(300),
  },
  incident_advance: {
    incidentCode: text(100),
    status: oneOf(
      "triaged",
      "contained",
      "investigating",
      "capa_open",
      "effectiveness_review",
      "closed",
    ),
  },
  capa: {
    incidentCode: text(100),
    rootCause: text(4000),
    correctiveAction: text(4000),
    owner: text(300),
    dueDate: date(),
    effectivenessTest: text(4000),
  },
  capa_transition: {
    actionCode: text(100),
    status: oneOf("implemented", "effectiveness_verified", "closed"),
    notes: text(4000),
  },
  privacy_request: {
    requestType: text(100),
    jurisdiction: text(200),
    subjectReference: text(500),
    systemCode: text(100),
    dueDate: date(),
    owner: optionalText(300),
  },
  privacy_transition: {
    requestCode: text(100),
    status: oneOf("in_progress", "fulfilled", "denied", "closed"),
    notes: text(4000),
  },
  confidential_report: {
    category: oneOf(
      "Governance bypass",
      "Guardrail override abuse",
      "Data misuse",
      "Retaliation",
      "Safety concern",
      "Other",
    ),
    systemCode: text(100),
    description: text(5000),
    retaliationConcern: oneOf("Yes", "No", "Unsure"),
  },
  confidential_report_transition: {
    trackingCode: text(100),
    status: oneOf("TRIAGED", "INVESTIGATING", "RESOLVED"),
    notes: text(4000),
    linkedIncidentCode: optionalText(100),
  },
  policy: {
    policyCode: text(100),
    title: text(300),
    version: text(50),
    effectiveDate: date(),
    body: text(20_000),
  },
  export_package: { systemCode: text(100) },
};

export function validateActionPayload(input: Record<string, unknown>) {
  const action = cleanText(input.action, "action", 80);
  const schema = schemas[action];
  if (!schema) throw badRequest("Unknown action");

  const output: Record<string, unknown> = { action };
  for (const [name, rule] of Object.entries(schema)) {
    const raw = input[name];
    if (raw === undefined || raw === null || raw === "") {
      if (rule.required) throw badRequest(`${label(name)} is required`);
      continue;
    }
    output[name] = validateValue(raw, name, rule);
  }
  validateRelationships(action, output);
  return output;
}

function validateRelationships(action: string, value: Record<string, unknown>) {
  if (
    action === "request_access" &&
    Date.parse(String(value.expiresAt)) <= Date.parse(String(value.startsAt))
  ) {
    throw badRequest("Access must expire after it starts");
  }
  if (
    action === "competency_record" &&
    Date.parse(String(value.expiresAt)) <= Date.parse(String(value.completedAt))
  ) {
    throw badRequest("Expiry must be after completion");
  }
  if (
    action === "register_legal_source" &&
    Date.parse(String(value.nextReview)) < Date.parse(String(value.verifiedOn))
  ) {
    throw badRequest("Next review cannot be before the verification date");
  }
  if (
    action === "request_override" &&
    Date.parse(String(value.expiresAt)) <= Date.now()
  ) {
    throw badRequest("Override expiry must be in the future");
  }
  if (
    action === "assess_privacy_compliance" &&
    value.crossBorderTransfer === "Yes" &&
    String(value.transferMechanism).length <= 10
  ) {
    throw badRequest(
      "Transfer mechanism is required for cross-border processing",
    );
  }
}

function validateValue(raw: unknown, name: string, rule: Rule) {
  if (typeof raw !== "string" && typeof raw !== "number") {
    throw badRequest(`${label(name)} has an invalid value`);
  }
  const value = typeof raw === "string" ? raw.trim() : raw;
  if (rule.values && !rule.values.includes(String(value))) {
    throw badRequest(`${label(name)} has an invalid value`);
  }
  if (typeof value === "string" && value.length > (rule.max ?? 500)) {
    throw badRequest(`${label(name)} is too long`);
  }
  if (
    rule.kind === "email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
  ) {
    throw badRequest(`${label(name)} must be a valid email address`);
  }
  if (rule.kind === "url") {
    try {
      const url = new URL(String(value));
      if (url.protocol !== "https:") throw new Error();
    } catch {
      throw badRequest(`${label(name)} must be a valid HTTPS URL`);
    }
  }
  if (rule.kind === "date") {
    const rawDate = String(value);
    const parsed = new Date(`${rawDate}T00:00:00.000Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(rawDate) ||
      !Number.isFinite(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== rawDate
    ) {
      throw badRequest(`${label(name)} must be a valid date`);
    }
  }
  if (rule.kind === "datetime" && !Number.isFinite(Date.parse(String(value)))) {
    throw badRequest(`${label(name)} must be a valid date and time`);
  }
  if (rule.kind === "integer" || rule.kind === "number") {
    const numeric = Number(value);
    if (
      !Number.isFinite(numeric) ||
      (rule.kind === "integer" && !Number.isInteger(numeric))
    ) {
      throw badRequest(`${label(name)} must be a valid number`);
    }
    if (
      numeric < (rule.min ?? -Infinity) ||
      numeric > (rule.maximum ?? Infinity)
    ) {
      throw badRequest(`${label(name)} is outside the allowed range`);
    }
    return numeric;
  }
  return value;
}

function cleanText(value: unknown, name: string, max: number) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) {
    throw badRequest(`${label(name)} is required`);
  }
  return value.trim();
}

function label(name: string) {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase());
}
