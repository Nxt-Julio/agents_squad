---
execution: subagent
agent: code-reviewer
inputFile: squads/__SQUAD_CODE__/output/ios-implementation-report.md
outputFile: squads/__SQUAD_CODE__/output/code-review-report.md
model_tier: powerful
on_reject: step-03-implement-web
---

# Step 06: Code Review

Review the full change set using:

- `squads/__SQUAD_CODE__/output/programming-dispatch.md`
- `squads/__SQUAD_CODE__/output/web-implementation-report.md`
- `squads/__SQUAD_CODE__/output/android-implementation-report.md`
- `squads/__SQUAD_CODE__/output/ios-implementation-report.md`

Prioritize bugs, regressions, unsafe architecture, missing tests, and acceptance criteria gaps.

Keep findings concise.
