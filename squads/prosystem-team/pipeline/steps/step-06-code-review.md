---
execution: subagent
agent: code-reviewer
inputFile: squads/prosystem-team/output/acceptance-report.md
outputFile: squads/prosystem-team/output/code-review-report.md
model_tier: powerful
on_reject: step-03-implement-backend
---

# Step 06: Revisão de Código

Revise o conjunto da mudança usando:

- `squads/prosystem-team/output/{run_id}/v*/programming-dispatch.md`
- `squads/prosystem-team/output/{run_id}/v*/backend-implementation-report.md`
- `squads/prosystem-team/output/{run_id}/v*/frontend-implementation-report.md`
- `squads/prosystem-team/output/{run_id}/v*/acceptance-report.md`
- O diff real: `git -C <PROSYSTEM_DIR> status --short`, `git -C <PROSYSTEM_DIR> diff` e o conteúdo dos arquivos novos

Priorize bugs, regressões, divergência de contrato entre back e front, segurança (SQL com entrada concatenada, sessão/permissão, escape, segredos), SQL novo não idempotente, arquitetura frágil e testes/casos manuais faltando.

Ao reprovar, liste as correções obrigatórias com `[BACK]`/`[FRONT]`, arquivo e linha. Sugestões opcionais ficam separadas e não reprovam.

## Veto Conditions

- Aprovação sem ter lido o diff real (o relatório não lista os arquivos que aparecem no `git status`/`git diff`)

Caminhos com `v*/` significam: use a pasta `vN/` mais alta do run que contém o arquivo.
