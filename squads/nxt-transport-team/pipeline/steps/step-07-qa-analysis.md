---
execution: subagent
agent: qa-analyst
inputFile: squads/nxt-transport-team/output/code-review-report.md
outputFile: squads/nxt-transport-team/output/qa-report.md
model_tier: powerful
---

# Step 07: QA Analysis

Create and execute the leanest validation plan for the change.

Use:

- `squads/nxt-transport-team/output/{run_id}/v*/programming-dispatch.md`
- `squads/nxt-transport-team/output/{run_id}/v*/code-review-report.md`
- implementation reports for affected sectors

Run the validation commands only for affected repositories. Prefer existing automated tests. Add manual checks only where automation is missing.

Keep output concise and evidence-based.

## Veto Conditions

- A test or build is reported as passing without the command output

Paths with `v*/` mean: use the highest `vN/` folder under the run folder that contains that file.
