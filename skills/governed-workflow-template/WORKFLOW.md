# Governed Workflow

## Identity

- Workflow code:
- Name:
- Version:
- Owner:
- Organization:
- Risk tier:
- Jurisdictions:

## Purpose

Describe the institutional process this workflow performs.

## Ordered steps

For each step provide:

1. sequence
2. step type
3. skill code
4. skill version
5. package hash
6. assigned agent/execution context
7. action class
8. authorization requirement
9. human approval requirement
10. failure policy
11. evidence requirement

## Scope

### Tools
List maximum permitted tools.

### Data
List maximum permitted data scope.

### Network
List maximum permitted destinations.

## Failure policy

Define whether each failure:
- stops the workflow
- retries
- escalates
- invokes rollback
- requires human intervention

## Evidence

Every execution must bind the approved workflow version and digest, every skill/package version, every authorization decision, every step result and any egress events.
