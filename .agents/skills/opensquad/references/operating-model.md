# Operating Model

Use this model to run Opensquad like a large structured engineering team.

## Delivery structure

1. Planner/Architect defines scope and acceptance criteria.
2. Implementer agents own independent code slices.
3. QA agent validates behavior and regressions.
4. Reviewer agent approves or rejects with actionable feedback.

## Governance rules

1. Keep one clear responsibility per agent.
2. Prefer project workspace mode for multi-client or multi-product operations.
3. Require checkpoints before irreversible actions (deploy, migrations, credential changes).
4. Save all outputs in squad output folders for run traceability.
5. Update squad memory only with explicit user feedback.

## Recommended software pipeline

1. Scope checkpoint
2. Architecture and plan
3. Implementation
4. Test and validation
5. Review
6. Release or next-step checkpoint

## Template mapping

- `backend-feature`: backend architecture, implementation, API validation
- `fullstack-feature`: backend + frontend delivery with QA loop
- `platform-delivery-team`: analyst dispatch, Web/Android/iOS implementation, review, QA, and release
- `qa-regression`: release readiness and regression coverage
- `release-ops`: release plan, runbook, go/no-go criteria

## Adaptive bootstrap

For fast onboarding across many repositories, use:

- `npm run opensquad:team:detect -- --source <project-path>`
- `npm run opensquad:team:apply -- --source <project-path> [--project <project-code>]`

This selects a blueprint (`mobile-web-app`, `landing-page`, `ecommerce`, or `software-general`) and creates a ready squad set with minimal manual setup.
