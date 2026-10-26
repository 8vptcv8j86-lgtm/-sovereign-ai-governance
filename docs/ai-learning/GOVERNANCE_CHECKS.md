# AI Governance Checks

This checklist follows the NIST AI RMF functions: Govern, Map, Measure, and Manage.

## Govern

- [ ] AI system has a unique inventory record.
- [ ] Business owner, technical owner, risk owner, and reviewer are named.
- [ ] Intended use, users, affected people, and prohibited uses are stated.
- [ ] Applicable laws, policies, contracts, and sector rules are identified.
- [ ] Roles and approval authority are documented.
- [ ] Staff competency and required training are recorded.
- [ ] Model, vendor, data source, prompt, policy, and tool versions are traceable.
- [ ] Whistleblower, appeal, complaint, and incident routes exist.
- [ ] Retirement and evidence-retention requirements are defined.

## Map

- [ ] Business process and decision being supported are described.
- [ ] Impact on people, organizations, and rights is assessed.
- [ ] Data origin, quality, consent, representativeness, and limitations are documented.
- [ ] Dependencies, vendors, jurisdictions, and data locations are mapped.
- [ ] Human oversight is meaningful and assigned to a competent person.
- [ ] Misuse, foreseeable abuse, affected groups, and worst credible failure are documented.
- [ ] Risk tier is assigned: minimal, limited, high, or prohibited.

## Measure

- [ ] Accuracy, reliability, groundedness, robustness, privacy, security, bias, explainability, and accessibility have test methods.
- [ ] Baseline and release thresholds are approved.
- [ ] Evaluation includes affected-user and operational scenarios.
- [ ] Independent review is required for high-risk systems.
- [ ] Red-team and adversarial tests match the threat model.
- [ ] Results, failures, limitations, and uncertainty are recorded.
- [ ] Monitoring can detect drift, misuse, degradation, and incidents.

## Manage

- [ ] Risks are accepted, mitigated, transferred, or avoided by an authorized owner.
- [ ] Critical controls are implemented and evidenced.
- [ ] Deployment can be limited, paused, rolled back, or retired.
- [ ] Users receive instructions, limitations, and a way to contest outcomes.
- [ ] Incidents trigger investigation, notification, remediation, and lessons learned.
- [ ] Material changes trigger re-evaluation and re-approval.
- [ ] Periodic review date is set.

## Release gates by risk tier

| Tier | Example | Required gate |
|---|---|---|
| Minimal | Drafting internal text with no sensitive data | Owner review and basic tests |
| Limited | Recommendations with a human decision maker | Documented evaluation, security review, disclosure, monitoring |
| High | Decisions affecting access, rights, finance, employment, health, identity, or public services | Independent review, impact assessment, strict human oversight, full audit evidence, executive risk approval |
| Prohibited | Manipulative, unlawful, discriminatory, covert, or uncontrollable use | Do not deploy |

## Approval record

- System and version:
- Risk tier:
- Intended use:
- Prohibited use:
- Evaluation result:
- Security result:
- Privacy and impact result:
- Known limitations:
- Open risks and owners:
- Monitoring owner:
- Rollback owner:
- Decision: approve / conditional approval / reject
- Approver and date:
- Evidence links:
