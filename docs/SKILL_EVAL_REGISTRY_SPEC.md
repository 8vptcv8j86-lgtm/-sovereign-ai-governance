# Skill Eval Registry Specification

## Proposed skill_eval_suites fields

- eval_suite_code
- organization_id
- skill_code
- suite_version
- purpose
- test_case_count
- required_pass_threshold
- safety_critical_case_count
- policy_critical_case_count
- lifecycle_status
- created_at

## Proposed skill_eval_runs fields

- eval_run_code
- organization_id
- eval_suite_code
- skill_code
- skill_version
- package_hash
- execution_context_code
- model_provider
- model_name
- model_version
- started_at
- completed_at
- passed
- score
- failed_cases
- safety_critical_failures
- policy_critical_failures
- reviewer
- evidence_reference

## Enforcement

- eval run must bind exact skill package hash
- approval evidence references the qualifying eval run
- expired or superseded evals may be rejected by policy
- safety-critical and policy-critical cases may require zero failures
- evaluation environment is part of the evidence record
