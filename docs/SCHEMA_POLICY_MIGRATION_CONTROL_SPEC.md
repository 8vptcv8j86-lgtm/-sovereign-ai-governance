# Schema and Policy Migration Control Specification

## schema_policy_migration_records

- migration_record_code
- organization_id
- migration_identifier
- schema_digest_before
- schema_digest_after
- policy_digest_before
- policy_digest_after
- generation_tool
- generation_tool_version
- generated_at
- generated_by
- test_result
- access_control_test_result
- security_lint_result
- approved_by
- target_environment
- applied_at
- rollback_plan_reference
- status
- created_at

## schema_policy_verification_events

- verification_event_code
- organization_id
- migration_record_code
- environment
- observed_schema_digest
- observed_policy_digest
- expected_schema_digest
- expected_policy_digest
- verification_result
- verified_by
- verified_at
- variance_reference
- created_at

## Migration states

- GENERATED
- REVIEWED
- TESTED
- APPROVED
- APPLIED
- VERIFIED
- FAILED
- ROLLED_BACK

## Enforcement

- existing migrations are immutable
- new changes require generated migration artifacts
- policy diff is reviewed alongside schema diff
- security lint runs before approval
- post-apply verification is mandatory
- Sentinel migration `0025` remains untouched
- next legitimate generated DB migration is `0026`
