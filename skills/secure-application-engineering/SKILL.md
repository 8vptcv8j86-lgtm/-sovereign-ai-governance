# Secure Application Engineering — Data-Plane Governance

## Scope

This is a cross-project engineering skill.

Apply it to every application, service, API, agent, workflow engine, database-backed product, internal tool, and production codebase unless a stricter project-specific policy overrides it.

It is not Sentinel-specific.

## Core principle

Application code is not the only security boundary.

Every system should enforce access at the lowest practical layer:

- application authorization
- database row/record policies
- object storage policies
- realtime/event-stream authorization
- secrets/key controls
- migration/policy controls

A defect in one layer should not automatically create unrestricted access in another.

## Mandatory defaults

### 1. Default deny

Sensitive resources default to deny.

Grant only the minimum required operations, scope, records, objects, topics, and duration.

### 2. Tenant and workspace isolation

For multi-tenant systems, enforce tenant boundaries in the data layer.

Common scope keys include:

- organization_id
- tenant_id
- account_id
- workspace_id
- project_id
- matter_id
- owner_id

Cross-tenant access must fail beneath the API layer.

### 3. Operation-specific authorization

Treat independently:

- SELECT / READ
- INSERT / CREATE
- UPDATE
- DELETE
- SUBSCRIBE
- PUBLISH
- DOWNLOAD
- UPLOAD
- CREATE_SIGNED_ACCESS
- ADMIN / BYPASS

Never assume permission to read implies permission to mutate.

### 4. Derived views must not widen access

Views, reports, analytics queries, exports, materialized views, pipelines, and generated APIs must preserve the restrictions of the underlying data.

Avoid security-definer or creator-privilege behavior unless explicitly required, reviewed, and audited.

### 5. Privileged service identities

No anonymous superuser access.

Every privileged identity must have:

- explicit name
- owner
- purpose
- environment
- allowed resources
- allowed operations
- effective dates
- rotation/expiration
- audit requirement

Wildcard or bypass privileges require elevated review.

### 6. Realtime/event streams

Private channels and subscriptions require authorization.

Validate:

- subscriber identity
- tenant/workspace scope
- permitted event types
- publish vs subscribe
- session validity
- data classification

Session loss or revoked access should terminate or reauthorize live access according to policy.

### 7. Object storage

Object URLs do not equal authorization.

Govern:

- bucket/container
- path/prefix
- read/write/delete/list
- signed access
- original vs derivative download
- residency
- retention
- encryption

Signed URLs should be short-lived and scoped.

### 8. Secrets

Never store secret plaintext in:

- application logs
- audit logs
- analytics events
- database metadata intended for ordinary reads
- client code
- public environment variables

Store references to managed secrets, keys, tokens, or credentials.

Record version/identifier, not plaintext value.

### 9. Security linting

Before production, automatically check for:

- sensitive tables without access policies
- exposed tables without tenant isolation
- views that bypass underlying policies
- overly broad service identities
- public storage buckets
- long-lived signed links
- secrets in code/logs/data
- realtime channels without auth policy
- cross-tenant query paths
- missing indexes on policy-critical columns
- migrations that remove security controls
- frontend exposure of privileged keys

Critical findings block release.

### 10. Migration discipline

Existing migrations are immutable after release.

Schema and security-policy changes move together:

Schema change
-> generated migration
-> schema diff
-> policy diff
-> lint
-> tests
-> approval
-> apply
-> post-apply verification

Never fabricate migration snapshots or hand-author generated artifacts when the migration framework is expected to generate them.

### 11. Tests

Every production application should include negative authorization tests.

At minimum test:

- cross-tenant read blocked
- cross-tenant write blocked
- expired identity blocked
- revoked permission blocked
- unauthorized object access blocked
- unauthorized realtime subscription blocked
- privileged bypass scope enforced
- secret never returned to client
- policy survives derived view/report path

### 12. Evidence

For security-relevant changes preserve:

- policy version
- schema/migration identifier
- test results
- security-lint results
- approver/reviewer where required
- deployment environment
- post-apply verification result

## Build checklist

Before considering a data-backed application production-ready, answer:

1. What is the tenant/workspace boundary?
2. Where is it enforced in the database?
3. What service identities can bypass it?
4. How are files protected?
5. How are live streams protected?
6. Where do secrets live?
7. What security lint runs?
8. What negative authorization tests exist?
9. How are migrations generated and verified?
10. Can a bug in the API expose another tenant's data?

If any answer is unclear, the security boundary is incomplete.
