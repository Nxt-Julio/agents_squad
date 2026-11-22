---
execution: subagent
agent: backend-engineer
inputFile: squads/prosystem-team/output/programming-dispatch.md
outputFile: squads/prosystem-team/output/backend-implementation-report.md
model_tier: powerful
---

# Step 03: Implementação Backend

Execute só o Prompt Backend de `squads/prosystem-team/output/{run_id}/v*/programming-dispatch.md`, no repositório `<PROSYSTEM_DIR>` (ver `pipeline/data/domain-framework.md`).

Se o Backend estiver `N/A`, não leia arquivos do repositório: escreva um relatório de uma linha.

## Retorno por reprovação

Este step é o destino de todo `on_reject` (steps 05, 06, 07, 09 e 10) e da opção "Pedir ajustes" do step 08. Nesse caso:

1. Leia o relatório que causou o retorno (o runner informa qual). Se não informar, use o mais recente entre: `{run_id}/v*/acceptance-report.md`, `{run_id}/v*/code-review-report.md`, `{run_id}/v*/qa-report.md`, `{run_id}/merge-approval.md`, `{run_id}/v*/github-report.md` e `{run_id}/v*/deploy-report.md`.
2. Corrija **apenas** os itens `[BACK]` e responda item a item.
3. Sem item `[BACK]`: o relatório é "Sem pendências para este setor" e nada é alterado.

## Validação

Rode na raiz do `agents_squad` e cole a saída no relatório:

- `node squads/prosystem-team/tools/php-lint.js --changed <PROSYSTEM_DIR>`
- `git -C <PROSYSTEM_DIR> diff --check`

## Veto Conditions

- Comando de lint/teste/build relatado sem a saída colada
- Arquivo `.sql` que já existe na `main` foi editado (mudança de banco tem que ser arquivo novo)
- Arquivos do setor Frontend alterados sem o despacho atribuir ao Backend

Caminhos com `v*/` significam: use a pasta `vN/` mais alta do run que contém o arquivo.
