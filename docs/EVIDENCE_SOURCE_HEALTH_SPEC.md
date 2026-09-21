# Evidence Source Health Specification

## Registry

### evidence_source_registry
- source_code
- organization_id
- provider
- source_type
- purpose
- jurisdiction
- sensitivity_class
- owner
- lifecycle_status
- expected_refresh_interval
- created_at

### evidence_source_health_events
- health_event_code
- organization_id
- source_code
- configuration_state
- credential_state
- health_status
- last_success_at
- last_failure_at
- failure_reason
- probe_method
- probed_at
- observed_data_recency
- reliability_state
- next_check_due
- created_at

## Health states

- WORKING
- ENABLED_UNVERIFIED
- DEGRADED
- NOT_WORKING
- AVAILABLE_NOT_CONFIGURED
- DISABLED

## Enforcement

Required sources that are unhealthy must trigger policy-defined behavior:
- block
- degrade
- reroute
- request alternate evidence
- human escalation
