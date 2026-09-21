# Sentinel WikiSkill Governance — Papermark-Informed Architecture R9

## Status

Revision branch:
`feature/wiki-skill-governance-papermark-r9`

Preserved predecessor:
`archive/wiki-skill-governance-novu-r8-2026-09-21`

Parent commit:
`1f1f5c70017e1b9d6cffc6d056b45a12493dc850`

R9 extends Version 30 + R1 + R2 + R3 + R4 + R5 + R6 + R7 + R8. It does not modify migration `0025`.

## R9 purpose

R9 governs controlled disclosure of institutional evidence.

It adds:

1. Governed Evidence Room Registry
2. Evidence Disclosure Access Grants
3. Evidence Package and Document Version Registry
4. Disclosure Activity Ledger
5. Evidence Request and Submission Tasks
6. Evidence Room Freeze and Integrity Seal
7. Governed Redaction Pipeline

---

## 1. Governed Evidence Room Registry

An evidence room is a scoped disclosure environment for a defined audience and purpose.

Examples:

- regulator examination
- external audit
- board review
- incident investigation
- vendor due diligence
- legal review
- independent assurance engagement

Recommended identity:

- evidence_room_code
- organization_id
- name
- purpose
- disclosure_class
- owner
- target audience
- jurisdiction
- data-lane policy
- lifecycle status
- opens_at
- expires_at
- frozen_at
- integrity seal

### Core rule

Creating an evidence room does not grant access to underlying Sentinel records.

Only explicitly disclosed artifacts and versions are visible.

---

## 2. Evidence Disclosure Access Grants

Disclosure access should be granular.

Permission types:

- VIEW
- DOWNLOAD_REDACTED
- DOWNLOAD_DERIVATIVE
- DOWNLOAD_ORIGINAL
- UPLOAD_EVIDENCE
- COMMENT
- ACKNOWLEDGE
- RESPOND_TO_REQUEST

A disclosure grant may bind:

- recipient
- recipient group
- role
- email/domain allowlist
- denylist
- authentication requirement
- effective dates
- expiration
- permitted artifacts/folders
- permission set
- download policy
- watermark policy
- jurisdiction
- data lanes

### Core rule

Disclosure grants cannot widen the underlying organizational authorization boundary.

They create a narrower external disclosure boundary.

---

## 3. Evidence Package and Document Version Registry

Every disclosed artifact should be version-bound.

Recommended controls:

- canonical artifact code
- artifact type
- source record references
- version
- content digest
- original/derivative/redacted classification
- source version reference
- created_by
- created_at
- disclosure status
- retention
- integrity metadata

### Core rule

A derivative or redacted artifact is a new versioned evidence object.

The source evidence is never silently overwritten to create an external disclosure copy.

---

## 4. Disclosure Activity Ledger

Sentinel should preserve what happened inside the evidence room.

Activity types may include:

- ROOM_OPENED
- ACCESS_GRANTED
- ACCESS_REVOKED
- VIEW_STARTED
- VIEW_COMPLETED
- DOWNLOAD_ATTEMPTED
- DOWNLOAD_COMPLETED
- ORIGINAL_DOWNLOAD_BLOCKED
- COMMENT_ADDED
- ACKNOWLEDGED
- EVIDENCE_UPLOADED
- REQUEST_COMPLETED
- ROOM_FROZEN
- ROOM_EXPIRED

Each activity should bind:

- room
- recipient/viewer
- grant
- artifact/version
- permission used
- timestamp
- source channel/session
- result
- audit reference

### Core rule

Possessing a disclosure link or room invitation is not evidence that an artifact was viewed or downloaded.

---

## 5. Evidence Request and Submission Tasks

Evidence rooms may contain formal requests.

Task types may include:

- TODO
- UPLOAD
- ACKNOWLEDGE
- RESPOND
- REMEDIATE
- CERTIFY

Task status may include:

- OPEN
- IN_PROGRESS
- SUBMITTED
- ACCEPTED
- REJECTED
- COMPLETED
- EXPIRED

Tasks should bind:

- requestor
- assignee
- room
- required evidence type
- due date
- destination folder/artifact scope
- submission evidence
- review result
- reminders
- activity log

### Core rule

Evidence submission is not automatically evidence acceptance.

Acceptance is a separate governed action.

---

## 6. Evidence Room Freeze and Integrity Seal

An evidence room may be frozen to create an immutable examination snapshot.

Freeze should produce:

- frozen timestamp
- frozen by
- room manifest
- artifact list and versions
- access-grant snapshot
- activity snapshot
- package hash
- archive reference
- integrity algorithm
- verification result

### Core rule

After freeze, the sealed room cannot silently change.

New evidence requires either:
- a new room version; or
- a formally recorded supplemental disclosure.

---

## 7. Governed Redaction Pipeline

Sensitive evidence should support a reviewable redaction process.

Lifecycle:

```
SOURCE VERSION
  -> DETECTION
  -> REDACTION CANDIDATES
  -> REVIEW
  -> ACCEPT / DECLINE
  -> APPLY
  -> DERIVATIVE VERSION
  -> POST-REDACTION VERIFICATION
```

Redaction reasons may include:

- PRIVACY
- REGULATORY
- LEGAL_PRIVILEGE
- COMMERCIAL
- SECURITY
- STRATEGIC
- DATA_MINIMIZATION
- OTHER

Sensitive categories may include:

- PII_NAME
- PII_EMAIL
- PII_PHONE
- PII_ADDRESS
- PII_ACCOUNT
- FINANCIAL
- HEALTH
- CREDENTIAL
- SECRET
- CONTRACTUAL
- CUSTOM_TERM

### Core rule

Redaction records should avoid storing the sensitive plaintext value where possible.

Store masked preview, location, category, reason, confidence and decision evidence.

---

## Integrated R9 disclosure flow

```
Internal Evidence
  -> Package / Artifact Version
  -> Redaction if required
  -> Derivative Disclosure Version
  -> Evidence Room
  -> Disclosure Grant
  -> Authentication / Eligibility
  -> View / Download / Upload
  -> Activity Ledger
  -> Request / Submission Tasks
  -> Freeze / Integrity Seal
  -> Export / Regulatory Evidence
```

## Database plan

Do not hand-edit `0025`.

Recommended R9 entities for the next generated migration:

- `governed_evidence_rooms`
- `evidence_room_versions`
- `evidence_disclosure_grants`
- `evidence_room_groups`
- `evidence_artifacts`
- `evidence_artifact_versions`
- `evidence_room_items`
- `evidence_disclosure_activities`
- `evidence_request_tasks`
- `evidence_request_assignments`
- `evidence_request_activities`
- `evidence_room_freezes`
- `evidence_redaction_jobs`
- `evidence_redactions`

These should be considered together with pending R1–R8 entities during the next generated migration pass.

## Acceptance gates

- room creation alone grants no evidence access
- grants are recipient/group and artifact scoped
- view/download/original-download permissions are distinct
- access expiration is enforced
- disclosed artifact binds exact version/digest
- redacted derivative never overwrites source evidence
- activity ledger distinguishes invitation, view and download
- task submission and acceptance remain separate
- room freeze creates verifiable manifest/hash
- post-freeze changes require supplemental disclosure or new room version
- redaction decisions are reviewable and auditable
- sensitive plaintext is minimized in redaction metadata
- data-lane and jurisdiction rules remain enforced
- cross-organization isolation passes
- audit chain remains valid
