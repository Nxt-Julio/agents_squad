---
execution: subagent
agent: web-engineer
inputFile: squads/nxt-transport-team/output/programming-dispatch.md
outputFile: squads/nxt-transport-team/output/web-implementation-report.md
model_tier: powerful
---

# Step 04: Web Implementation

Execute only the Web prompt from the programming dispatch.

Also read `squads/nxt-transport-team/output/{run_id}/v*/backend-implementation-report.md` (when it exists) to use the exact API contract delivered by Backend.

If Web is marked `N/A`, do not inspect unrelated files. Write a no-op report explaining why.

Keep the final report compact and include files changed, validation, and reviewer notes.

## Veto Conditions

- Report claims a validation passed without showing the command that was run
- Files outside the Web repository were changed without being required by the dispatch

Paths with `v*/` mean: use the highest `vN/` folder under the run folder that contains that file.
