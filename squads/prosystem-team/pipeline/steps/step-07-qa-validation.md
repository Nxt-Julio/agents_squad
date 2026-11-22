---
execution: subagent
agent: qa-analyst
inputFile: squads/prosystem-team/output/code-review-report.md
outputFile: squads/prosystem-team/output/qa-report.md
model_tier: powerful
on_reject: step-03-implement-backend
---

# Step 07: Validação de QA

Monte e execute o plano de validação mais enxuto usando:

- `squads/prosystem-team/output/{run_id}/v*/programming-dispatch.md`
- `squads/prosystem-team/output/{run_id}/v*/acceptance-report.md`
- `squads/prosystem-team/output/{run_id}/v*/code-review-report.md`
- os relatórios de implementação dos setores afetados

Rode os comandos da tabela do agente só para os setores afetados. Leia o fluxo de ponta a ponta (tela → endpoint → SQL → resposta → tela) conferindo o contrato. Entregue a lista de smoke pós-deploy (URLs, passos, resultado esperado) para o Caio.

Se encontrar falha, reprove com passos para reproduzir, esperado × obtido, saída do comando e setor (`[BACK]`/`[FRONT]`). Depois da correção, a mudança passa de novo por aceite, revisão e QA.

## Veto Conditions

- Teste, lint ou build relatado como aprovado sem a saída do comando

Caminhos com `v*/` significam: use a pasta `vN/` mais alta do run que contém o arquivo.
