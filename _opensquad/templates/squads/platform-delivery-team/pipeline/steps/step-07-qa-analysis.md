---
execution: subagent
agent: qa-analyst
inputFile: squads/__SQUAD_CODE__/output/code-review-report.md
outputFile: squads/__SQUAD_CODE__/output/qa-report.md
model_tier: powerful
---

# Step 07: QA Analysis

Create and execute the leanest validation plan for the change.

Use:

- `squads/__SQUAD_CODE__/output/programming-dispatch.md`
- `squads/__SQUAD_CODE__/output/code-review-report.md`
- implementation reports for affected platforms

Prefer existing automated tests. Add manual checks only where automation is missing.

Keep output concise and evidence-based.
