# AI Development Toolkit

This toolkit adds automation, web-data ingestion, RAG, agent development, and skill-authoring references to the applied AI learning program.

## Primary repositories

| Tool | Repository | Role | Priority |
|---|---|---|---|
| n8n | [n8n-io/n8n](https://github.com/n8n-io/n8n) | Governed workflow automation across approved systems | Add now |
| Firecrawl | [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | Convert permitted web content into structured data for retrieval and research | Add now |
| LangChain | [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | RAG, retrieval, agent, and tool orchestration reference | Add now |
| Anthropic Agent Skills | [anthropics/skills](https://github.com/anthropics/skills) | Reference patterns for reusable skill structure and testing | Add now |
| OpenAI Agents SDK for JavaScript | [openai/openai-agents-js](https://github.com/openai/openai-agents-js) | Preferred agent framework reference for the current TypeScript and OpenAI application stack | Add now |

## Optional repository

| Tool | Repository | Use |
|---|---|---|
| Dify | [langgenius/dify](https://github.com/langgenius/dify) | Browser-based prototype comparison when a no-code or low-code AI application test is useful |

Dify is an evaluation option, not a required project dependency.

## Where each tool fits

### n8n

Use for:
- Lead research and qualification queues
- Approved Notion and HubSpot record updates
- Scheduled market monitoring
- Document intake and review routing
- Notifications and human approval steps

Required controls:
- Version every production workflow.
- Keep credentials in managed secrets.
- Use least-privilege service accounts.
- Require human approval before messages, payments, approvals, deletions, or record-changing actions.
- Add retry limits, idempotency, failure alerts, audit logs, and a kill switch.
- Test with non-production accounts and synthetic data first.

### Firecrawl

Use for:
- Public manufacturer and supplier research
- Property evidence collection
- Policy and regulatory source ingestion
- Approved website-to-RAG pipelines

Required controls:
- Confirm the source is permitted for the intended use.
- Respect access restrictions, applicable terms, privacy rights, and rate limits.
- Store the page URL, retrieval date, publisher, content hash, and verification status.
- Treat retrieved content as untrusted and test for indirect prompt injection.
- Minimize personal data and set retention rules.
- Never treat scraped text as verified fact without source review.

### LangChain

Use for:
- Learning and prototyping retrieval pipelines
- Comparing chunking, retrieval, reranking, citation, and tool patterns
- Reproducing the RAG from Scratch exercises

Required controls:
- Pin and review dependency versions before adoption.
- Keep authorization outside the model and framework prompts.
- Validate model output and tool arguments.
- Enforce tenant isolation at the data layer.
- Run the AI evaluation and security checklists before release.

LangChain is a framework reference. It is not mandatory when a simpler direct implementation is easier to secure and maintain.

### Anthropic Agent Skills

Use for:
- Studying skill structure
- Comparing instruction organization
- Improving test cases and reusable workflows

Required controls:
- Review every external skill before adapting it.
- Do not import hidden scripts, network calls, credentials, or broad permissions.
- Rewrite adapted material for the actual project and tool environment.
- Keep provenance and license information.
- Test the resulting skill against normal and adversarial cases.

### OpenAI Agents SDK for JavaScript

Use for:
- OpenAI-based tool-calling agents
- Handoffs, guardrails, traces, and evaluations
- Approval-gated workflows in the current TypeScript application stack

Required controls:
- Give each agent a narrow purpose and tool allowlist.
- Enforce permissions in application code.
- Validate every consequential tool call.
- Require human approval before external side effects.
- Set limits for steps, retries, duration, tokens, and cost.
- Retain trace and evaluation evidence without storing unnecessary personal data.

### Dify

Use only for:
- Fast comparison prototypes
- Demonstrating a workflow from a browser
- Testing whether a no-code interface improves stakeholder validation

Do not make it the system of record or add it to production without a separate architecture, security, privacy, portability, and cost review.

## Project application

- **Sentinel:** approval-packet agents, policy RAG, evidence routing, governed automation, and skill validation.
- **Island Leads:** permitted public-source ingestion, cited property evidence, scheduled monitoring, and human-reviewed briefs.
- **VIVCO:** manufacturer and brand qualification workflows, document intake, source tracking, and controlled follow-up queues.
- **Terra Mobi Systems:** field-record synchronization, exception routing, buyer and processor research, and operational notifications.
- **KandaSokoni:** supplier evidence, regulatory research, traceability checks, and approval-gated trade workflows.

## Adoption rule

Adding a repository to this toolkit does not install it or approve it for production. Before a project adopts one:

1. Define the exact use case and simpler alternatives.
2. Check current official documentation, license, maintenance, supported versions, and deployment requirements.
3. Threat-model its data, permissions, external services, and failure modes.
4. Test it with synthetic data.
5. Record evaluation, security, privacy, cost, and rollback evidence.
6. Obtain the required project approval before production use.
