# Sentinel WikiSkill Governance — CapSoftware-Informed Architecture R11

## Status

Revision branch:
`feature/wiki-skill-governance-capsoftware-r11`

Preserved predecessor:
`archive/wiki-skill-governance-claude-legal-r10-2026-09-21`

Parent commit:
`018e1e587ea7132a4bbe87cf788c76081134a123`

R11 extends Version 30 + R1 through R10. It does not modify migration `0025`.

## R11 purpose

R11 adds governed session capture and replayable execution evidence for selected high-risk workflows.

It adds:

1. Governed Session Capture Registry
2. Capture Consent and Scope Policy
3. Session Artifact Manifest
4. Timestamped Evidence Anchor Registry
5. Capture Storage and Residency Profiles
6. Derived Media / Transcript Provenance
7. Capture Integrity, Recovery and Completion Ledger

R11 treats capture as exceptional and purpose-bound. It must not become a default employee or user surveillance mechanism.

---

## 1. Governed Session Capture Registry

A capture session represents an authorized recording of a defined workflow or interaction.

Possible capture subjects:

- human operator workflow
- agent execution review
- critical approval
- incident reconstruction
- control testing
- regulated training/certification
- supervised validation
- forensic investigation

Recommended identity:

- capture_session_code
- organization_id
- matter_code
- workflow_execution_code
- purpose
- capture_type
- initiated_by
- authorized_by
- subject_references
- capture_policy_code
- storage_profile_code
- status
- started_at
- stopped_at
- completed_at

### Core rule

Capture requires explicit policy justification and authorization.

No policy = no capture.

---

## 2. Capture Consent and Scope Policy

Capture authorization must define exactly what may be observed.

Scope dimensions may include:

- screen
- application/window
- browser tab
- microphone
- camera
- system audio
- screenshots
- keyboard/mouse event metadata
- workflow event feed
- duration
- participant identities
- data classifications

Operations must remain distinct:

- CAPTURE
- STORE_LOCAL
- PROCESS
- TRANSCRIBE
- GENERATE_SUMMARY
- GENERATE_CHAPTERS
- UPLOAD
- SHARE_INTERNAL
- SHARE_EXTERNAL
- EXPORT_ORIGINAL
- DELETE

### Core rule

Authority to capture does not imply authority to upload, transcribe, share or externally disclose.

---

## 3. Session Artifact Manifest

A governed capture session may produce multiple artifacts.

Examples:

- original recording
- audio track
- screenshots
- transcript
- captions
- chapters
- AI summary
- AI title
- reviewer comments
- integrity report
- recovery fragments

Each artifact should bind:

- session
- artifact type
- version
- content reference
- digest
- media/time range
- generation source
- generator/model/tool version
- parent artifact/version
- storage profile
- retention policy
- lifecycle status

### Core rule

Derived artifacts are not equivalent to source media.

The original capture remains the canonical evidentiary source unless policy states otherwise.

---

## 4. Timestamped Evidence Anchor Registry

Important governance events may reference exact portions of a session.

An anchor may bind:

- session
- artifact/version
- start timestamp
- end timestamp
- transcript segment reference
- event type
- audit event
- workflow execution
- human approval
- model output
- override
- tool call
- incident
- attestation

Example:

```
00:05:03 AI recommendation displayed
00:05:41 operator override
00:05:53 justification entered
00:06:11 supervisor approval requested
```

### Core rule

Anchors are pointers to evidence, not replacements for the underlying audit event.

---

## 5. Capture Storage and Residency Profiles

Storage profile should define:

- LOCAL_ONLY
- ORGANIZATION_OBJECT_STORE
- SOVEREIGN_REGION
- APPROVED_CLOUD
- HYBRID

A profile may specify:

- storage provider
- organization ownership
- region/jurisdiction
- encryption
- key ownership
- signed-access requirements
- replication
- external processing restrictions
- retention
- deletion method
- backup policy
- recovery policy

### Core rule

Storage location, AI processing location and disclosure destination are evaluated separately.

---

## 6. Derived Media / Transcript Provenance

AI-derived media must preserve provenance.

Derived types may include:

- TRANSCRIPT
- CAPTIONS
- SUMMARY
- CHAPTERS
- TITLE
- TRANSLATION
- REDACTED_MEDIA
- CLIP
- SCREENSHOT

Provenance should capture:

- source artifact/version
- source digest
- tool/provider
- model/version
- processing parameters digest
- generated_at
- reviewer state
- confidence/quality metadata where available

### Core rule

A transcript or summary cannot silently replace the source recording for evidentiary purposes.

---

## 7. Capture Integrity, Recovery and Completion Ledger

Capture may fail or terminate unexpectedly.

Integrity states:

- RECORDING
- FINALIZING
- COMPLETE
- PARTIAL
- RECOVERED
- CORRUPT
- FAILED
- DELETED

Completion evidence should include:

- expected start/stop
- observed duration
- segment count
- missing ranges
- artifact digests
- recovery actions
- validation result
- export result
- upload result
- deletion result

### Core rule

A partial or recovered session must remain visibly classified as such.

The system must not present incomplete media as complete evidence.

---

## Capture minimization policy

Session capture should be limited to justified cases such as:

- regulated control testing
- incident reconstruction
- critical human approval
- high-risk AI validation
- forensic investigation
- supervised testing
- regulator-directed evidence collection
- certified training assessment

Default behavior should avoid continuous monitoring.

Capture policy should define:

- legitimate purpose
- subject notification/consent requirements
- minimum necessary surfaces
- retention
- review authority
- access
- redaction
- deletion
- jurisdiction

---

## Integrated R11 flow

```
Governance Need
  -> Capture Policy
  -> Authorization / Consent
  -> Target Selection
  -> Capture Session
  -> Integrity Validation
  -> Storage / Residency Enforcement
  -> Artifact Manifest
  -> Transcript / Derived AI Artifacts
  -> Timestamped Evidence Anchors
  -> Review
  -> Upload / Disclosure Gate
  -> Retention / Deletion
  -> Evidence / Audit
```

## Database plan

Do not hand-edit `0025`.

Recommended R11 entities for the next generated migration:

- `governed_capture_sessions`
- `capture_scope_policies`
- `capture_authorization_events`
- `capture_participants`
- `capture_artifacts`
- `capture_artifact_versions`
- `capture_evidence_anchors`
- `capture_storage_profiles`
- `capture_storage_profile_versions`
- `capture_processing_events`
- `capture_integrity_checks`
- `capture_recovery_events`
- `capture_retention_events`
- `capture_deletion_events`

These should be considered together with pending R1–R10 entities during the next generated migration pass.

## Acceptance gates

- capture cannot start without approved policy and authorization
- capture scope is explicit and minimum-necessary
- capture/upload/share/delete are separate operations
- participants and consent/notification requirements are recorded
- every artifact/version has a digest
- derived artifacts preserve source provenance
- timestamp anchors bind exact artifact/version and time range
- storage profile enforces residency and processing restrictions
- partial/recovered sessions cannot masquerade as complete
- upload/disclosure passes R9/R10 release controls
- retention and deletion are evidenced
- default policy does not authorize continuous monitoring
- cross-organization isolation passes
- audit chain remains valid
