# Governed Matter / Case Workspace Specification

## governed_matters

- matter_code
- organization_id
- matter_type
- name
- purpose
- owner_reference
- jurisdiction
- confidentiality_class
- privilege_claim
- data_lane
- lifecycle_status
- opened_at
- closed_at
- created_at

## governed_matter_memberships

- matter_membership_code
- organization_id
- matter_code
- member_type
- member_reference
- role
- permissions
- effective_from
- effective_to
- created_at

## governed_matter_context_bindings

- context_binding_code
- organization_id
- matter_code
- context_type
- context_reference
- version
- digest
- binding_scope
- created_at

## Enforcement

- matter-local context is default-deny outside the matter
- cross-matter reads require explicit policy
- outputs bind the active matter when matter mode is enabled
- closed matters are read-only except authorized evidence/retention operations
