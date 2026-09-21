# Source Provenance and Reliance Specification

## Source provenance classes

- PRIMARY_SOURCE_VERIFIED
- OFFICIAL_SOURCE_VERIFIED
- CONNECTED_ENTERPRISE_SOURCE
- USER_PROVIDED
- THIRD_PARTY_DATABASE
- WEB_SEARCH_VERIFY
- MODEL_KNOWLEDGE_VERIFY
- UNKNOWN

## source_provenance_records

- provenance_record_code
- organization_id
- matter_code
- source_class
- source_identity
- retrieval_method
- retrieval_reference
- content_digest
- jurisdiction
- retrieved_at
- authoritative_status
- freshness_status
- citation_reference
- created_at

## Reliance states

- DRAFT
- ANALYSIS
- UNVERIFIED
- VERIFIED
- PROFESSIONALLY_REVIEWED
- APPROVED_FOR_INTERNAL_RELIANCE
- APPROVED_FOR_EXTERNAL_USE
- SUPERSEDED
- WITHDRAWN

## artifact_reliance_records

- reliance_record_code
- organization_id
- matter_code
- artifact_version_code
- reliance_state
- source_references
- premise_references
- unresolved_qualifications
- jurisdiction
- release_scope
- approved_destination_classes
- granted_by
- granted_at
- expires_at
- superseded_by
- created_at

## Enforcement

- provenance reflects actual retrieval
- model knowledge cannot be promoted to verified source without evidence
- reliance state is version-specific
- superseded/withdrawn artifacts cannot satisfy current reliance requirements
