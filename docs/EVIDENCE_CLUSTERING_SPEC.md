# Evidence Clustering Specification

## Purpose

Prevent duplicate or derivative references from being miscounted as independent corroboration.

## Proposed evidence_clusters fields

- cluster_code
- organization_id
- subject_type
- subject_code
- canonical_claim_or_event
- confidence
- contradiction_state
- freshness_state
- independent_source_count
- reviewed_by
- created_at
- reviewed_at

## Proposed evidence_cluster_members fields

- member_code
- organization_id
- cluster_code
- evidence_code
- source_code
- relationship
- independence_group
- observed_at
- created_at

## Relationship values

- independent
- duplicate
- derivative
- republication
- summary_of
- contradicts
- supports

## Enforcement

- raw member count is never treated as corroboration count
- independent_source_count is computed from independence groups
- contradictions remain visible
- cluster freshness reflects member freshness and policy
