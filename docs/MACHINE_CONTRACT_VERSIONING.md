# Sentinel Machine Contract Versioning

## Rule

External consumers must integrate with versioned contracts, never raw internal table shapes.

## Required envelope

```json
{
  "schema_version": "1.0",
  "contract_version": "1.0",
  "generated_at": "ISO-8601",
  "organization_scope": "ORG-...",
  "integrity_metadata": {}
}
```

## Applies to

- Evidence Export
- Execution Preflight
- Source Health
- Audit Integrity
- Governed Workflow Execution
- Skill Package Metadata
- Data Egress Events
- Incident Evidence
- Regulatory Export Packages

## Change policy

- breaking change: major version
- additive compatible change: minor version
- documentation-only/internal change: no contract bump
- deprecated fields remain supported through an announced sunset period
- contract tests must protect backwards compatibility
