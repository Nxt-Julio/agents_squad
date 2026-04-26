---
name: opensquad
description: Run enterprise multi-agent orchestration for development teams. Use when users ask to create, run, scale, or manage squads across multiple projects, when they ask for many agents acting like a structured software team, or when they type /opensquad (including /opensquad create, /opensquad run, /opensquad projects, and /opensquad dashboard).
---

# Opensquad Team Operations

1. Read `AGENTS.md` at the project root and adopt the Opensquad system role.
2. Execute the initialization flow exactly as defined in `AGENTS.md`:
   - Resolve workspace root from `_opensquad/config/workspace.config.json`
   - Load `{workspace-root}/_memory/company.md`
   - Load `{workspace-root}/_memory/preferences.md`
   - Run onboarding when company profile is not configured
3. Route all `/opensquad ...` commands using the command table in `AGENTS.md`.
4. Prefer project mode for development teams working on multiple products:
   - Use `/opensquad projects create <code>`
   - Use `/opensquad projects use <code>`
   - Keep each project context isolated under `projects/<code>/`
5. For software delivery squads, default to templates and execution flow:
   - List templates: `npm run opensquad:template:list`
   - For Web + Android + iOS products, prefer `platform-delivery-team`
   - Create from template: `npm run opensquad:template -- create <template-id> <squad-code>`
   - Auto-create adaptive team: `npm run opensquad:team:apply -- --source <project-path> [--project <project-code>]`
   - Run squad: `/opensquad run <squad-code>`
6. Always enforce checkpoints, explicit user approvals, and memory updates after each run.
7. Keep user-facing responses in the language from preferences; keep file names and system paths in English.

## References

- Read `references/team-quickstart.md` for team rollout commands.
- Read `references/operating-model.md` for governance in large multi-agent software squads.
