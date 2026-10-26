# 12 Week Applied AI Learning Plan

Time target: four focused hours each week. Each week must end with a GitHub artifact, test result, or documented decision.

## Weeks 1 and 2: Generative AI foundations

Course: Microsoft Generative AI for Beginners.

Build:
- Week 1: a structured business brief generator using a fixed schema.
- Week 2: a document question-answering prototype with citations.

Apply to:
- VIVCO: turn interview notes into a validation brief.
- Sentinel: summarize one AI-system record without inventing facts.

Evidence:
- Prompt and sample inputs
- Expected output schema
- Five test cases
- Failure notes

## Weeks 3 and 4: RAG

Course: LangChain RAG from Scratch.

Toolkit references: Firecrawl for permitted web ingestion and LangChain for retrieval experiments.

Build:
- Week 3: ingest a small approved document set and return cited answers.
- Week 4: test retrieval quality, missing evidence, conflicting sources, and malicious text inside a document.

Apply to Sentinel:
- Answer governance questions only from approved policies.
- Refuse or label answers when evidence is missing.
- Show the source used for every material claim.

Exit gate:
- At least 90% of factual claims supported by retrieved evidence.
- No answer presented as fact when the source set does not support it.

## Weeks 5 and 6: Agents

Courses: Microsoft AI Agents for Beginners and Hugging Face Agents Course.

Toolkit references: OpenAI Agents SDK for JavaScript for the current application stack and Anthropic Agent Skills for skill-structure comparison.

Build:
- Week 5: a read-only agent that selects between search, retrieval, and calculation tools.
- Week 6: an approval-gated agent that proposes an action but cannot execute it without an authorized decision.

Apply to Sentinel:
- Prepare an approval packet.
- Detect missing evidence.
- Recommend the next governance action.
- Never approve, retire, export, or alter a record on its own.

Exit gate:
- 100% correct permission behavior in the test set.
- Zero unapproved external actions.
- Tool calls and results are traceable.

## Weeks 7 and 8: Evaluation and observability

Courses: Hugging Face agent evaluation material and LLM Zoomcamp.

Build:
- A versioned evaluation set containing normal, edge, adversarial, and refusal cases.
- A results table comparing the current version with the previous baseline.

Measure:
- Task success
- Groundedness
- Citation correctness
- Tool selection
- Permission compliance
- Data leakage
- Cost and latency

Exit gate:
- All critical safety and authorization tests pass.
- No material regression from the approved baseline.

## Weeks 9 and 10: Security and governance

References: OWASP GenAI, MITRE ATLAS, NIST AI RMF, and the NIST Generative AI Profile.

Build:
- A threat model for one Sentinel workflow.
- A completed security evaluation.
- A completed governance record and release decision.

Exercise:
- Attempt prompt injection through user text and retrieved documents.
- Attempt cross-user and cross-organization data access.
- Attempt unauthorized tool use and sensitive-data extraction.

Exit gate:
- No unresolved critical or high risk.
- Named owner and mitigation date for accepted lower risks.
- Evidence attached to every release gate.

## Weeks 11 and 12: Production operations

Courses: Made With ML and selected MLOps Zoomcamp modules.

Toolkit reference: n8n for one approval-gated automation exercise. Dify may be used only for an optional browser-based comparison prototype.

Build:
- Monitoring for quality, security events, failures, cost, and latency.
- A rollback and incident-response exercise.
- A final small production feature for Sentinel.

Final demonstration:
- State the intended use and prohibited use.
- Run the evaluation set.
- Show security and governance evidence.
- Demonstrate human approval and rollback.
- Record the release decision.

## Later deep study

After the applied program:
- Microsoft AI for Beginners for broader foundations
- Karpathy Neural Networks: Zero to Hero
- Sebastian Raschka LLMs from Scratch
- Full MLOps Zoomcamp

These are valuable, but they should not delay learning how to ship reliable, governed AI features.
