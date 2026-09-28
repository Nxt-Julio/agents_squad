---
execution: subagent
agent: code-reviewer
inputFile: squads/nxt-transport-team/output/mobile-implementation-report.md
outputFile: squads/nxt-transport-team/output/code-review-report.md
model_tier: powerful
on_reject: step-03-implement-backend
---

# Step 06: Code Review

Review the full change set using:

- `squads/nxt-transport-team/output/{run_id}/v*/programming-dispatch.md`
- `squads/nxt-transport-team/output/{run_id}/v*/backend-implementation-report.md`
- `squads/nxt-transport-team/output/{run_id}/v*/web-implementation-report.md`
- `squads/nxt-transport-team/output/{run_id}/v*/mobile-implementation-report.md`
- The actual diffs: `git -C project-nxt-transport-backend diff`, `git -C project-nxt-transport-frontend diff`, `git -C project-nxt-transport-mobile diff` (only affected sectors)

Prioritize bugs, regressions, contract mismatches between sectors, unsafe architecture, missing tests, and acceptance criteria gaps.

On rejection, list required fixes per sector; implementation steps for unaffected sectors stay `N/A`.

Keep findings concise.

Paths with `v*/` mean: use the highest `vN/` folder under the run folder that contains that file.
