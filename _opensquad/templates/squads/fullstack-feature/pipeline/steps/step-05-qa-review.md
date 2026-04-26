---
execution: subagent
agent: qa-reviewer
inputFile: squads/__SQUAD_CODE__/output/frontend-report.md
outputFile: squads/__SQUAD_CODE__/output/review-verdict.md
model_tier: fast
on_reject: step-03-implement-backend
---

# Step 05: QA Review

Validate end-to-end behavior and produce approve/reject verdict.

