---
execution: subagent
agent: qa-reviewer
inputFile: squads/__SQUAD_CODE__/output/implementation-report.md
outputFile: squads/__SQUAD_CODE__/output/review-verdict.md
model_tier: fast
on_reject: step-03-implement-feature
---

# Step 04: Test and Review

## Instructions

1. Validate acceptance criteria and critical regressions.
2. Produce approve/reject verdict with evidence.
3. If reject, provide exact remediation list.

