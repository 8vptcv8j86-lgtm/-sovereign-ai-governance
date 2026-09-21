# Governed Notification Workflow

## Identity

- Workflow code:
- Version:
- Organization:
- Owner:
- Purpose:
- Criticality:

## Trigger events

List governance events that invoke this workflow.

## Recipients

Define:
- individual/role/topic
- eligibility rule
- resolution source

## Preferences

Define:
- channels that respect user preference
- channels that are mandatory
- whether critical override is allowed

## Channels

Define ordered delivery channels.

## Digest / Delay / Throttle

- grouping key:
- digest window:
- delay:
- maximum frequency:
- cooldown:
- critical bypass:

## Retry

- retryable failures:
- retry count:
- backoff:
- terminal failure:

## Provider failover

- preferred provider:
- alternate provider:
- jurisdiction constraints:
- data-lane constraints:

## Acknowledgement

- required:
- acceptable acknowledgement state:
- due time:
- identity assurance:

## Escalation

Define level, timing, recipient/topic and channel.

## Evidence

Record:
- trigger
- recipient resolution
- preference/criticality decision
- each delivery attempt
- provider result
- acknowledgement
- escalation
- audit reference
