---
name: opensquad
---

# Opensquad - Project Instructions

This repository uses **Opensquad**, a multi-agent orchestration framework.

## Quick Start

Type `/opensquad` to open the main menu, or use:
- `/opensquad create`
- `/opensquad run <name>`
- `/opensquad help`
- `/opensquad projects`

## Directory Structure

- `_opensquad/` - Opensquad core files
- `_opensquad/config/workspace.config.json` - workspace mode and active project
- `_opensquad/_memory/` - global memory (used in global mode)
- `projects/<project>/` - project-isolated workspace
- `skills/` - global skills
- `squads/` - global squads (global mode)
- `_opensquad/_browser_profile/` - browser session state

## How It Works

1. `/opensquad` is the single entry point
2. Architect creates and modifies squads
3. Pipeline Runner executes squads
4. Workspace root is resolved first:
   - Global mode uses repo root
   - Project mode uses `projects/<active-project>/`
5. Checkpoints pause execution for user input

## Rules

- Prefer `/opensquad` commands instead of manual edits
- Do not edit `_opensquad/core/` manually unless you know the impact
- Resolve workspace root before any squad operation
- Company context is loaded from `{workspace-root}/_memory/company.md`

## Antigravity Environment: Subagents

If this runtime does not support background/parallel subagents:

1. Inform user work will run step by step inline
2. Execute all tasks sequentially in current conversation
3. Do not skip deferred work

## Interaction Rules

- Ask one question at a time
- When options exist, present numbered list format

