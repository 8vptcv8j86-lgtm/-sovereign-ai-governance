# Notification Provider Health and Failover Specification

## notification_provider_registry

- provider_code
- organization_id
- channel
- provider_name
- priority
- jurisdictions
- supported_data_lanes
- auth_reference_type
- lifecycle_status
- created_at

## notification_provider_health_events

- provider_health_event_code
- organization_id
- provider_code
- health_status
- observed_at
- failure_rate
- latency
- last_success_at
- last_failure_at
- failure_reason
- created_at

## Health states

- HEALTHY
- DEGRADED
- FAILING
- UNAVAILABLE
- DISABLED

## Enforcement

- failover uses only approved providers
- destination jurisdiction and data-lane checks occur before failover
- provider health changes do not erase delivery history
- failed provider attempts remain part of evidence
