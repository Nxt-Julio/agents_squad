# Opensquad Squad Templates

This directory contains reusable squad blueprints for software teams.

## Available templates

- `backend-feature` - Plan, implement, and validate a backend feature
- `fullstack-feature` - Coordinate backend and frontend delivery with QA
- `platform-delivery-team` - Analyst, Web, Android, iOS, review, QA, and release flow
- `qa-regression` - Build and execute regression strategy for a release scope
- `release-ops` - Prepare and validate release operations and rollout safety

## Adaptive team blueprints

Use `../team-blueprints.json` with:

- `npm run opensquad:team:list`
- `npm run opensquad:team:detect -- --source <project-path>`
- `npm run opensquad:team:apply -- --source <project-path> [--project <project-code>]`

## Tokens

Template files may contain tokens replaced during scaffold:

- `__SQUAD_CODE__`
- `__SQUAD_NAME__`
- `__TODAY__`
