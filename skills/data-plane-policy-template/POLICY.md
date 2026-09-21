# Governed Data-Plane Policy

## Identity

- Policy code:
- Organization:
- Owner:
- Resource type:
- Resource:

## Default

- Default decision: DENY / ALLOW
- Policy mode: PERMISSIVE / RESTRICTIVE

## Subject scope

Define:
- humans
- agents
- services
- roles
- matter membership
- organization boundary

## Operations

Define independently:
- SELECT / READ
- INSERT / WRITE
- UPDATE
- DELETE
- SUBSCRIBE
- PUBLISH
- DOWNLOAD
- CREATE_SIGNED_ACCESS

## Row / object / channel constraints

- organization:
- matter:
- data lane:
- jurisdiction:
- lifecycle:
- time window:

## Privileged bypass

- permitted:
- identity:
- scope:
- expiration:
- audit requirement:

## Secrets

List only secret references/version identifiers. Never include plaintext.

## Security lint

List required lint checks and blocking severity.

## Migration

- generated migration:
- schema digest before/after:
- policy digest before/after:
- test result:
- post-apply verification:

## Evidence

Record:
- policy version/digest
- authorization decision
- bypass use if any
- object/channel/row result
- audit reference
