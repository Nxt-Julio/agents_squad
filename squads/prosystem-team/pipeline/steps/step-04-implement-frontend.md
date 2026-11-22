---
execution: subagent
agent: frontend-engineer
inputFile: squads/prosystem-team/output/backend-implementation-report.md
outputFile: squads/prosystem-team/output/frontend-implementation-report.md
model_tier: powerful
---

# Step 04: Implementação Frontend

Execute só o Prompt Frontend de `squads/prosystem-team/output/{run_id}/v*/programming-dispatch.md`, no repositório `<PROSYSTEM_DIR>`.

Leia também `squads/prosystem-team/output/{run_id}/v*/backend-implementation-report.md` para usar exatamente o contrato que o Backend entregou.

Se o Frontend estiver `N/A`, não leia arquivos do repositório: escreva um relatório de uma linha.

## Retorno por reprovação

Leia o mesmo relatório de reprovação usado no step 03, corrija **apenas** os itens `[FRONT]` e responda item a item. Sem item `[FRONT]`: o relatório é "Sem pendências para este setor".

## Validação

Rode na raiz do `agents_squad` e cole a saída no relatório:

- `node squads/prosystem-team/tools/php-lint.js --changed <PROSYSTEM_DIR>`
- `git -C <PROSYSTEM_DIR> diff --check`

Liste os passos de teste manual da tela para o smoke pós-deploy.

## Veto Conditions

- Comando de lint/teste/build relatado sem a saída colada
- Arquivo `.sql` que já existe na `main` foi editado
- Arquivos do setor Backend alterados sem o despacho atribuir ao Frontend

Caminhos com `v*/` significam: use a pasta `vN/` mais alta do run que contém o arquivo.
