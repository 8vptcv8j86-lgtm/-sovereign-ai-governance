# Timestamped Evidence Anchor Specification

## capture_evidence_anchors

- evidence_anchor_code
- organization_id
- capture_session_code
- artifact_version_code
- start_offset_ms
- end_offset_ms
- transcript_segment_reference
- event_type
- event_reference
- workflow_execution_code
- node_execution_code
- audit_event_reference
- description_digest
- created_by
- created_at

## Supported event examples

- MODEL_OUTPUT
- TOOL_CALL
- HUMAN_OVERRIDE
- JUSTIFICATION
- APPROVAL_REQUEST
- APPROVAL_GRANTED
- APPROVAL_DENIED
- POLICY_WARNING
- INCIDENT
- ATTESTATION
- DATA_EGRESS
- WORKFLOW_TRANSITION

## Enforcement

- anchor always identifies exact artifact version
- timestamps are within artifact duration
- anchor does not replace underlying governance event
- corrected anchors create new records rather than rewriting history where policy requires
