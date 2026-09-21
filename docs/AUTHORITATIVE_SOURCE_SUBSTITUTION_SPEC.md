# Authoritative Source Substitution Specification

## source_substitution_policies

- substitution_policy_code
- organization_id
- subject_domain
- required_source_class
- acceptable_fallback_classes
- prohibited_fallback_classes
- approval_requirement
- required_warning
- maximum_reliance_state
- maximum_freshness_window
- verification_requirement
- lifecycle_status
- created_at

## source_substitution_events

- substitution_event_code
- organization_id
- matter_code
- requested_source_class
- available_source_class
- source_reference
- policy_code
- approved_by
- decision
- qualification
- resulting_reliance_ceiling
- created_at

## Enforcement

- fallback is never silent
- prohibited source classes cannot satisfy mandatory authority controls
- lower-authority substitution can lower the maximum reliance state
- substitution event becomes part of professional review evidence
