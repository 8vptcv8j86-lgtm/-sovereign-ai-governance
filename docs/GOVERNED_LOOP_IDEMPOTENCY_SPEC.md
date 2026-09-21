# Governed Loop and Idempotency Specification

## Purpose

Control recurring, scheduled and event-driven agent work so repeated cycles remain safe, deduplicated and interruptible.

## Proposed governed_loops fields

- loop_code
- organization_id
- name
- purpose
- cadence
- action_condition
- workflow_code
- skills
- action_class_ceiling
- cooldown_seconds
- maximum_retries
- escalation_threshold
- stop_conditions
- kill_switch_status
- human_gate_policy
- lifecycle_status
- created_at

## Proposed governed_loop_state fields

- loop_state_code
- organization_id
- loop_code
- watermark
- last_run_at
- last_success_at
- last_action_at
- dedupe_key
- cooldown_until
- in_flight_key
- retry_count
- last_outcome
- last_execution_reference
- updated_at

## Idempotency rules

- side-effecting operations require a deterministic idempotency key where technically possible
- the same key cannot cause the same material side effect twice without explicit override
- cooldown applies before the next eligible material action
- an in-flight lock prevents overlapping cycles
- retries preserve the original idempotency identity
- operator override is audited

## Kill switch

- kill-switch status is checked before every side-effecting cycle
- activating the kill switch prevents new material actions
- in-flight handling follows policy: finish-safe-step, suspend, or abort
- kill-switch changes require authorization and audit evidence
