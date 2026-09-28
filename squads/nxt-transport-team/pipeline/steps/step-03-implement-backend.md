---
execution: subagent
agent: backend-engineer
inputFile: squads/nxt-transport-team/output/programming-dispatch.md
outputFile: squads/nxt-transport-team/output/backend-implementation-report.md
model_tier: powerful
---

# Step 03: Backend Implementation

Execute only the Backend prompt from the programming dispatch.

If Backend is marked `N/A`, do not inspect unrelated files. Write a no-op report explaining why.

Keep the final report compact and include files changed, validation, and reviewer notes.

## Veto Conditions

- Report claims a validation passed without showing the command that was run
- Files outside the Backend repository were changed without being required by the dispatch
