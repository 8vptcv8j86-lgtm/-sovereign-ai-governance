# Project Labs

Each lab produces a small, reviewable artifact. Use synthetic or public data until privacy and access controls are verified.

## Lab 1: Grounded policy assistant

Project: Sentinel

Goal: answer governance questions from an approved policy set.

Required behavior:
- Cite the supporting passage.
- Separate retrieved facts from suggestions.
- Say when evidence is absent or conflicting.
- Ignore instructions embedded inside retrieved documents.
- Never expose another organization’s records.

Tests:
- Five supported questions
- Three unsupported questions
- Two conflicting-source questions
- Five prompt-injection attempts
- Five cross-tenant access attempts

## Lab 2: Approval packet agent

Project: Sentinel

Goal: compile evidence and recommend approve, reject, or request more information.

Required behavior:
- Validate that mandatory fields exist.
- Explain the recommendation against the policy.
- Preserve human decision authority.
- Log inputs, retrieved evidence, recommendation, model version, and final human decision.
- Block any attempt by the model to execute approval.

## Lab 3: Property evidence brief

Project: Island Leads

Goal: compare two properties using traceable public and customer-provided evidence.

Required behavior:
- Show source and date for each material fact.
- Mark estimates and assumptions.
- Separate facts, risks, and questions requiring professional inspection.
- Avoid claiming that a property is undervalued without a defined method and sufficient evidence.

## Lab 4: Manufacturing readiness brief

Project: VIVCO Signal

Goal: convert founder and manufacturer information into a readiness assessment.

Required behavior:
- Identify missing technical, compliance, volume, packaging, and commercial information.
- Never infer certifications or capacity.
- Separate verified capability from a founder or supplier claim.
- Produce the next qualification questions before recommending a call.

## Lab 5: Field sourcing assistant

Project: Terra Mobi Systems or KandaSokoni

Goal: structure supplier, commodity, inspection, and logistics evidence.

Required behavior:
- Work offline where practical and queue synchronization safely.
- Preserve the source, collector, date, location precision, and verification status.
- Apply role-based access.
- Flag inconsistent quantity, quality, pricing, or identity data.
- Do not approve payments or suppliers automatically.

## Definition of done for every lab

- Intended user and decision are named.
- Success metric and failure cost are stated.
- Data sources and prohibited data are listed.
- Ten or more representative tests exist.
- A project-specific `DESIGN.md` exists and the UI Design Toolkit quality gates pass.
- Mobile, tablet, desktop, keyboard, reduced-motion, and key interface states are verified.
- Security, evaluation, and governance checklists are completed.
- Human approval is required for consequential actions.
- Results and remaining risks are committed to GitHub.
