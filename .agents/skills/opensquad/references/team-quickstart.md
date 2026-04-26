# Team Quickstart

Use this rollout when a development team wants a repeatable, multi-project setup.

## 1) One-time setup per machine

Run from this repository root:

```bash
npm run codex:skill:install
```

This installs the `opensquad` skill into the local Codex home (`$CODEX_HOME/skills` or `~/.codex/skills`).

## 2) Start a project workspace

```bash
/opensquad projects create payments-platform
/opensquad projects use payments-platform
/opensquad projects current
```

## 3) Create a squad from ready templates

```bash
npm run opensquad:template:list
npm run opensquad:template -- create fullstack-feature payments-api-v1
```

Or bootstrap an adaptive default team from project signals:

```bash
npm run opensquad:team:detect -- --source .
npm run opensquad:team:apply -- --source . --project payments-platform
```

## 4) Run the squad pipeline

```bash
/opensquad run payments-api-v1
```

## 5) Repeat for more teams/projects

- New project: `/opensquad projects create <code>`
- Switch context: `/opensquad projects use <code>`
- Return global mode: `/opensquad projects global`
- Portfolio report: `npm run opensquad:report:portfolio`
