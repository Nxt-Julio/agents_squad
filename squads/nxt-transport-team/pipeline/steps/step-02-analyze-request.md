---
execution: inline
agent: request-analyst
inputFile: squads/nxt-transport-team/output/request-input.md
outputFile: squads/nxt-transport-team/output/programming-dispatch.md
---

# Step 02: Analyze Request

Validate the request and produce a compact programming dispatch.

The dispatch must include:

1. Decision: proceed, clarify, or reject
2. Acceptance criteria
3. Shared contract (endpoint, payload, socket event, Prisma model), when more than one sector is affected
4. Backend prompt (`project-nxt-transport-backend/`)
5. Web prompt (`project-nxt-transport-frontend/`)
6. Mobile prompt (`project-nxt-transport-mobile/`)
7. Risks (migrations, auth, breaking API changes)

Keep prompts small. Each sector prompt should fit in 10 bullets or fewer. Mark unaffected sectors as `N/A`.

If the decision is `clarify`, ask the user the open questions before continuing.
