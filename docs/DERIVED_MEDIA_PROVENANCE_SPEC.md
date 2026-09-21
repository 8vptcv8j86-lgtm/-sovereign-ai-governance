# Derived Media and Transcript Provenance Specification

## capture_processing_events

- processing_event_code
- organization_id
- capture_session_code
- source_artifact_version_code
- output_artifact_version_code
- processing_type
- tool_provider
- tool_code
- tool_version
- model_code
- model_version
- parameters_digest
- started_at
- completed_at
- result
- quality_metadata
- audit_reference
- created_at

## Processing types

- TRANSCRIPTION
- CAPTIONING
- SUMMARIZATION
- CHAPTER_GENERATION
- TITLE_GENERATION
- TRANSLATION
- REDACTION
- CLIPPING
- EXPORT

## Enforcement

- every derived output references exact source version/digest
- processing provider/model version is preserved
- AI-derived transcript/summary cannot be represented as source media
- revised transcript creates a new artifact version
