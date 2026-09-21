# Shared Governed Context Specification

## Purpose

Provide canonical, versioned institutional context that multiple skills and workflows may consume without duplicating or silently drifting foundational assumptions.

## Proposed records

### governed_contexts
- context_code
- organization_id
- context_type
- name
- owner
- lifecycle_status
- current_version
- created_at

### governed_context_versions
- context_version_code
- organization_id
- context_code
- version
- digest
- content_reference
- change_summary
- source_references
- proposed_by
- approved_by
- effective_from
- effective_to
- status
- created_at

## Enforcement

- approved versions are immutable
- every dependent execution records exact context version and digest
- updates create a new version
- prior versions remain available for evidence reconstruction
- context scope cannot override policy, skill or capability restrictions
