# Action Classification Specification

## Classes

| Class | Meaning | Default authorization |
| --- | --- | --- |
| OBSERVE | Read authorized information | In-scope authorization |
| ANALYZE | Transform or assess without side effect | Policy check |
| PREPARE | Create a draft/staged action | Policy check + approval where required |
| EXECUTE | Cause external/persistent state change | Explicit capability authorization |
| CRITICAL | High-impact or regulated state change | Enhanced policy + human approval |
| IRREVERSIBLE | Severe or non-reversible consequence | Explicit human approval + dual control where required |

## Proposed action_classifications record

- classification_code
- organization_id
- action_name
- entity_type
- entity_code
- proposed_class
- effective_class
- rationale
- policy_reference
- requires_human_approval
- requires_dual_control
- classified_by
- created_at

## Enforcement

- runtime proposals do not override Sentinel policy
- effective class is determined by Sentinel policy and institutional configuration
- higher class wins when multiple controls apply
- execution is blocked until all controls for the effective class are satisfied
- classification decision is included in execution evidence
