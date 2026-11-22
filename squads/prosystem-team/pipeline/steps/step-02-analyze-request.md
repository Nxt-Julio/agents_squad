---
execution: inline
agent: request-analyst
inputFile: squads/prosystem-team/output/request-input.md
outputFile: squads/prosystem-team/output/programming-dispatch.md
model_tier: powerful
---

# Step 02: Análise do Pedido

Valide o pedido e produza o despacho de programação, seguindo `pipeline/data/domain-framework.md`.

O despacho deve ter:

1. Decisão: prosseguir, esclarecer ou rejeitar
2. Objetivo e escopo
3. Critérios de aceite numerados e testáveis
4. Setores afetados: Backend / Frontend (setor sem impacto = `N/A` + uma frase) e a lista de arquivos de cada um
5. Contrato (arquivo/URL, método, parâmetros, resposta, erros, campos, colunas), quando os dois setores mudam
6. Mudança de banco: arquivo SQL novo previsto em `tools/` ou "nenhuma"
7. Prompt Backend (até 10 bullets)
8. Prompt Frontend (até 10 bullets)
9. Riscos (banco, autenticação/permissões, quebra de endpoint, dados sensíveis)

Se a decisão for `esclarecer`, faça as perguntas (no máximo 5, numa mensagem só) e espere as respostas antes de gravar o despacho final. Se for `rejeitar`, explique o motivo ao usuário e pare o pipeline.

Máximo de 120 linhas.
