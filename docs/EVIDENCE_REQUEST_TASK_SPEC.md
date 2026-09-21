# Evidence Request and Submission Task Specification

## Task types

- TODO
- UPLOAD
- ACKNOWLEDGE
- RESPOND
- REMEDIATE
- CERTIFY

## Task statuses

- OPEN
- IN_PROGRESS
- SUBMITTED
- ACCEPTED
- REJECTED
- COMPLETED
- EXPIRED

## evidence_request_tasks

- evidence_request_task_code
- organization_id
- evidence_room_code
- title
- description
- task_type
- required_evidence_type
- destination_scope
- due_at
- status
- created_by
- created_at

## evidence_request_assignments

- assignment_code
- organization_id
- task_code
- assignee_reference
- assignee_group_code
- assigned_at
- notified_at
- last_reminder_at

## evidence_request_activities

- task_activity_code
- organization_id
- task_code
- activity_type
- actor_reference
- from_status
- to_status
- submission_reference
- comment
- created_at

## Enforcement

- task activity is append-only
- submission is distinct from acceptance
- rejected evidence remains historically visible
- reminders follow notification governance
