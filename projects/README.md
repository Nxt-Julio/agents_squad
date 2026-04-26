# Opensquad Multi-Project Workspace

Use `projects/` to isolate context, squads, memory, and outputs per initiative.

## Recommended Layout

```text
projects/
  <project-code>/
    _memory/
      company.md
      preferences.md
    skills/
    squads/
```

## Why This Matters

- Prevents cross-project context leakage.
- Allows specialized squads and skills per project.
- Simplifies governance for larger teams.

## Migration Strategy

1. Keep legacy global structure working (`_opensquad/` + root `squads/`).
2. Create new projects under `projects/`.
3. Move one squad at a time, validating behavior before moving the next.

## CLI Helpers

```bash
npm run opensquad:project:list
npm run opensquad:project -- create my-project
npm run opensquad:project -- use my-project
npm run opensquad:project:current
npm run opensquad:migrate-squad -- my-squad my-project
```
