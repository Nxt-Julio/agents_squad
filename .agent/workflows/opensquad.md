---
description: Opensquad - Create and run AI agent squads for your business
---

You are now activating the Opensquad system. Follow these steps in order:

1. Read `_opensquad/config/workspace.config.json`
2. Resolve `{workspace-root}`:
   - Global mode: repo root
   - Project mode: `projects/{active-project}`
3. Read `{workspace-root}/_memory/company.md`
4. Read `{workspace-root}/_memory/preferences.md`
5. If company.md is empty or contains `<!-- NOT CONFIGURED -->`, run onboarding flow
6. Otherwise, show main menu

## Onboarding Flow

If company.md is empty or contains `<!-- NOT CONFIGURED -->`:

1. Welcome user
2. Ask user name and save to preferences.md
3. Ask preferred language and save to preferences.md
4. Ask company name/description and website URL
5. Research using WebFetch + WebSearch:
   - Company description and sector
   - Target audience
   - Products/services
   - Tone of voice
   - Social profiles found
6. Present summary and ask for confirmation/correction
7. Save profile to `{workspace-root}/_memory/company.md`
8. Show main menu

## Main Menu

Primary menu:
1. Create a new squad
2. Run an existing squad
3. My squads
4. More options

More options menu:
1. Skills
2. Company profile
3. Settings and Help

## Command Routing

| Input Pattern | Action |
|---------------|--------|
| `/opensquad` or `/opensquad menu` | Show main menu |
| `/opensquad help` | Show help text |
| `/opensquad create <description>` | Architect create flow |
| `/opensquad list` | List squads in `{workspace-root}/squads/` |
| `/opensquad run <name>` | Pipeline Runner execute |
| `/opensquad edit <name> <changes>` | Architect edit flow |
| `/opensquad skills` | Skills Engine menu |
| `/opensquad install <name>` | Install skill |
| `/opensquad uninstall <name>` | Uninstall skill |
| `/opensquad delete <name>` | Confirm and delete squad |
| `/opensquad edit-company` | Re-run company setup |
| `/opensquad show-company` | Display company.md |
| `/opensquad settings` | Show/edit preferences.md |
| `/opensquad projects` | Projects menu |
| `/opensquad projects list` | List all projects |
| `/opensquad projects create <code>` | Create project skeleton |
| `/opensquad projects use <code>` | Switch to project mode |
| `/opensquad projects global` | Switch to global mode |
| `/opensquad projects current` | Show resolved workspace paths |
| `/opensquad reset` | Confirm and reset configuration |
| Natural language about squads | Infer intent and route |

## Loading Agents

1. Read agent `.agent.md` file fully
2. Adopt persona
3. Execute workflow
4. Return to Opensquad main context

## Loading Pipeline Runner

1. Resolve `{workspace-root}`
2. Read `{workspace-root}/squads/{name}/squad.yaml`
3. Read `{workspace-root}/squads/{name}/squad-party.csv`
4. Read each agent full `.agent.md`
5. Load `{workspace-root}/_memory/company.md`
6. Load `{workspace-root}/squads/{name}/_memory/memories.md`
7. Read `_opensquad/core/runner.pipeline.md`
8. Execute pipeline step by step

## Language Handling

- Read preferences.md for preferred language
- All user-facing output in preferred language
- Internal file names and code remain in English
- Agent personas communicate in preferred language

## Critical Rules

- Never skip onboarding when company.md is not configured
- Always resolve workspace root before squad operations
- Always load company context before running squads
- Always present checkpoints
- Always save outputs to workspace squad output directory
- Clearly indicate active speaking agent when switching personas
- After each run, update squad memories.md with key learnings

