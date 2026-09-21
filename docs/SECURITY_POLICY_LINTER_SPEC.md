# Security Policy Linter / Advisor Specification

## security_lint_rules

- lint_rule_code
- organization_id
- name
- category
- severity
- target_resource_type
- rule_definition
- blocking
- lifecycle_status
- created_at

## security_lint_findings

- lint_finding_code
- organization_id
- lint_rule_code
- resource_type
- resource_reference
- severity
- finding
- evidence_digest
- detected_at
- remediation_reference
- status
- resolved_at
- created_at

## Example rules

- sensitive table missing row policy
- exposed resource without organization isolation
- elevated view semantics
- broad privileged bypass identity
- public object bucket
- secret-looking value in logs/data
- long-lived signed URL policy
- stale bypass grant
- private channel lacking auth policy
- cross-org access path
- migration removes policy
- missing index on policy-critical field

## Enforcement

- findings are auditable evidence
- blocking findings can prevent migration/deployment
- resolved findings retain original evidence
