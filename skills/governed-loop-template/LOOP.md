# Governed Loop

## Identity

- Loop code:
- Name:
- Organization:
- Owner:
- Risk tier:

## Purpose

Describe the recurring institutional job.

## Cadence

Specify the schedule or event source.

## Acts when

Define the exact condition that permits action.

## Skills used

List skill codes, versions and approved version ranges.

## State

- Watermark:
- Dedupe key:
- Cooldown:
- In-flight lock:
- Maximum retries:

## Action ceiling

Maximum permitted action class:

## Human gate

Describe actions that require human approval.

## Stop conditions

List conditions that suspend or terminate the loop.

## Kill switch

Define:
- who may activate it
- what execution behavior stops
- how in-flight work is handled
- how restart is authorized

## Self-check

Define what the loop verifies before action.

## Evidence

Each cycle must record:
- trigger
- state before
- idempotency key
- preflight
- authorization
- action/result
- state after
- evidence references
