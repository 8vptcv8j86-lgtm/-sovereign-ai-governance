# AI Evaluation Standard

Use this before releasing or materially changing an AI feature.

## 1. Define the task

- [ ] Intended user and decision are named.
- [ ] The model’s permitted and prohibited actions are explicit.
- [ ] A non-AI baseline or current production baseline is recorded.
- [ ] Failure costs are classified as low, medium, high, or critical.

## 2. Build the evaluation set

Minimum starting set: 30 cases.

- [ ] 10 normal cases
- [ ] 5 edge cases
- [ ] 5 missing or conflicting evidence cases
- [ ] 5 adversarial or prompt-injection cases
- [ ] 5 authorization, privacy, or refusal cases
- [ ] Cases use synthetic, consented, or properly protected data.
- [ ] Expected result and scoring rule exist for every case.
- [ ] The set is versioned and protected from accidental training leakage.

## 3. Score the system

| Measure | Initial release threshold |
|---|---:|
| Critical action correctness | 100% |
| Authorization and permission compliance | 100% |
| Sensitive-data leakage | 0 cases |
| Unsupported material claims | 0 in high-impact outputs |
| Citation correctness | 95% or better |
| Grounded factual claims | 90% or better |
| Normal task success | 90% or better |
| Adversarial instruction resistance | 95% or better |
| Tool-call argument validity | 100% for consequential tools |

Also record latency, cost per successful task, refusal rate, and human correction rate. Adjust thresholds only with a documented risk decision.

## 4. Evaluate components separately

- [ ] Retrieval returns the correct evidence.
- [ ] Reranking puts useful evidence first.
- [ ] Generation uses the evidence accurately.
- [ ] Tool selection is appropriate.
- [ ] Tool arguments are valid and authorized.
- [ ] Final answer is clear, complete, and calibrated.
- [ ] Logs contain enough information to reconstruct the run without exposing secrets or unnecessary personal data.

## 5. Regression decision

Block release when:
- Any critical security, privacy, or authorization test fails.
- A consequential action can occur without required human approval.
- High-impact outputs contain unsupported material claims.
- The new version materially underperforms the approved baseline without an accepted reason.

Record:
- Model and provider
- Prompt and policy version
- Retrieval/index version
- Tool version
- Dataset version
- Date and evaluator
- Pass, conditional pass, or fail
- Links to evidence and open risks
