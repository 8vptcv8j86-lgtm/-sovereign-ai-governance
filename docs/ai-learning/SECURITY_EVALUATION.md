# AI Security Evaluation

Complete this for every AI feature and repeat after material changes to models, prompts, tools, data sources, permissions, or integrations.

## Threat model

- [ ] Assets are named: credentials, personal data, confidential records, approvals, exports, payments, and audit evidence.
- [ ] Trust boundaries are mapped: user input, uploaded files, retrieved documents, model output, tools, APIs, database, logs, and administrators.
- [ ] Abuse cases cover spoofing, tampering, repudiation, information disclosure, denial of service, and privilege escalation.
- [ ] Each risk has an owner, severity, mitigation, evidence, and review date.

## Identity and access

- [ ] Authentication is enforced server side.
- [ ] Authorization is checked for every record and action.
- [ ] Organization and tenant isolation has negative tests.
- [ ] Privileged actions require the correct role and human approval.
- [ ] Service accounts and tools use least privilege.
- [ ] Sessions expire and can be revoked.

## Prompt, RAG, and agent security

- [ ] User text, retrieved text, files, web content, and model output are treated as untrusted.
- [ ] Permissions are enforced in code, not by instructions to the model.
- [ ] Prompt injection tests cover direct, indirect, encoded, multilingual, and tool-mediated attacks.
- [ ] Retrieved documents cannot override system rules or tool permissions.
- [ ] Model output is validated before database, shell, browser, email, payment, or file operations.
- [ ] Consequential tools use allowlisted operations and schema-validated arguments.
- [ ] Side effects require confirmation or an approved workflow gate.
- [ ] The agent has limits for steps, time, tokens, cost, retries, and parallel work.
- [ ] External URLs are restricted and protected against server-side request forgery.
- [ ] Model denial of a policy is never treated as proof that an action is safe.

## Data and privacy

- [ ] Only data needed for a stated purpose is collected.
- [ ] Personal and sensitive fields are classified.
- [ ] Secrets never enter prompts, code, logs, or GitHub.
- [ ] Cross-customer data cannot enter a shared prompt or retrieval result.
- [ ] Encryption, retention, export, correction, and deletion rules are defined.
- [ ] Third-party model and tool providers are documented.
- [ ] User consent and disclosure match actual data use.
- [ ] Logs redact credentials and unnecessary personal information.

## Application and supply chain

- [ ] Inputs are length-limited and schema-validated at the boundary.
- [ ] Queries are parameterized and output is safely encoded.
- [ ] Security headers, CORS, cookies, rate limits, and error handling are reviewed.
- [ ] File types, sizes, content, storage paths, and malware risks are controlled.
- [ ] Dependency audit is run against the committed lockfile.
- [ ] New packages and install scripts are reviewed.
- [ ] Secret scanning and dependency updates are enabled.
- [ ] Backups and restoration are tested.

## Operational readiness

- [ ] Security events are logged with actor, action, target, time, and result.
- [ ] Alerts exist for repeated authentication failures, access denials, unusual exports, prompt attacks, and tool failures.
- [ ] Incident owner, containment steps, notification path, and rollback are documented.
- [ ] A kill switch can disable the model or consequential tools.
- [ ] A tabletop incident exercise has been completed.

## Release rule

- Critical or high risks: fix before release unless the authorized risk owner formally accepts a time-bounded exception.
- Medium risks: mitigation and due date required.
- Low risks: track and review.
- Any permission bypass, cross-tenant exposure, secret leakage, or unapproved consequential action blocks release.
