---
execution: subagent
agent: github-specialist
inputFile: squads/prosystem-team/output/merge-approval.md
outputFile: squads/prosystem-team/output/github-report.md
model_tier: fast
on_reject: step-03-implement-backend
---

# Step 09: Commit, PR e Merge no GitHub

Leia `squads/prosystem-team/output/{run_id}/merge-approval.md`. Se a escolha não for `1. Aprovar`, pare sem tocar no Git e escreva isso no relatório.

Use também, para montar o PR:

- `squads/prosystem-team/output/{run_id}/v*/programming-dispatch.md`
- `squads/prosystem-team/output/{run_id}/v*/acceptance-report.md`
- `squads/prosystem-team/output/{run_id}/v*/qa-report.md`

No repositório `<PROSYSTEM_DIR>` (`Nxt-Julio/prosystem`):

1. Branch `feat/<run_id>-<slug>` ou `fix/<run_id>-<slug>` a partir da `main` atualizada. Se este run já teve um PR mergeado (retorno por falha de deploy), use uma branch nova com sufixo `-2`, `-3`... a partir da `main` atual.
2. Commits Conventional Commits em português, sem `.env`, dumps, `banco/backups/`, `.pfx` ou segredos.
3. Push da branch e PR para `main` com resumo, critérios de aceite, testes, mudança de banco e riscos.
4. Espere os checks. Lista vazia = registre "sem checks configurados". Check falhando = reprove com itens `[BACK]`/`[FRONT]` e o log, sem merge.
5. Merge squash em `main`, apague a branch remota, atualize a `main` local e anote o SHA.

## Veto Conditions

- Merge feito com check de CI falhando ou pendente
- Merge feito sem a escolha `1. Aprovar` no `merge-approval.md`
- Commit contendo `.env`, dump, certificado ou segredo

Caminhos com `v*/` significam: use a pasta `vN/` mais alta do run que contém o arquivo.
