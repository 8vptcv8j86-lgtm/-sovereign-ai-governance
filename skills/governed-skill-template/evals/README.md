# Governed Skill Eval Bundle

This directory contains reproducible validation cases for a governed skill version.

Recommended files:

- `suite.json` — eval suite metadata
- `cases/` — individual test cases
- `expected/` — expected outcomes or constraints
- `results/` — generated results, if retained locally

## Requirements

Every qualifying eval run must bind:

- skill code
- skill version
- package SHA-256
- eval suite version
- execution context
- model/runtime
- timestamp
- result
- failed cases
- evidence reference

Safety-critical and policy-critical tests should be explicitly labeled.

Eval results do not authorize deployment by themselves. They are evidence consumed by Sentinel validation and approval controls.
