# Trace Correlation Specification

## Purpose

Link Sentinel governance events to external operational telemetry.

## Proposed trace_correlations fields

- correlation_code
- organization_id
- execution_code
- workflow_execution_code
- node_execution_code
- trace_provider
- trace_id
- span_id
- parent_span_id
- authorization_reference
- audit_event_reference
- tool_call_reference
- model_call_reference
- external_trace_reference
- observed_at
- created_at

## Enforcement

- trace identifiers are evidence references, not authorization
- missing telemetry does not invalidate Sentinel audit evidence unless policy requires telemetry
- trace provider data is treated as external evidence and subject to source health/freshness policy where applicable
- correlation must remain organization-scoped
