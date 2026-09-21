# Governance Reconciliation and Variance Specification

## governance_reconciliations

Recommended fields:

- reconciliation_code
- organization_id
- subject_type
- subject_code
- reconciliation_type
- source_result_digest
- recomputed_result_digest
- source_value
- recomputed_value
- variance_value
- variance_unit
- computation_method
- evidence_references
- status
- reviewer
- reconciled_at
- created_at

## governance_variances

Recommended fields:

- variance_code
- organization_id
- reconciliation_code
- severity
- description
- policy_impact
- remediation_required
- remediation_reference
- status
- created_at
- resolved_at

## Status values

- MATCH
- MISMATCH
- UNVERIFIABLE
- PARTIAL
- PENDING

## Enforcement

- policy-critical reconciliation uses an independent computation path
- a MISMATCH cannot be silently normalized away
- remediation and disposition are auditable
- resolved variance preserves original mismatch evidence
