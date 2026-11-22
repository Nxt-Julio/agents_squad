---
type: checkpoint
outputFile: squads/prosystem-team/output/merge-approval.md
---

# Step 08: Aprovação para Merge e Deploy

Mostre ao usuário um resumo curto, montado a partir de:

- `squads/prosystem-team/output/{run_id}/v*/programming-dispatch.md`
- `squads/prosystem-team/output/{run_id}/v*/acceptance-report.md`
- `squads/prosystem-team/output/{run_id}/v*/code-review-report.md`
- `squads/prosystem-team/output/{run_id}/v*/qa-report.md`

O resumo tem:

1. Pedido e critérios de aceite (✅/⚠️)
2. Arquivos alterados (`git -C <PROSYSTEM_DIR> status --short`)
3. Testes executados e o que não pôde ser testado localmente
4. Migrations a aplicar (arquivos SQL novos) ou "nenhuma"
5. Riscos e o que o Caio vai conferir pós-deploy

Inclua os caminhos dos relatórios para o usuário revisar e pergunte:

1. Aprovar — autoriza o fluxo completo: commit, PR e merge em `main` (Gustavo), deploy, ajustes de configuração no Coolify e aplicação das migrations listadas acima (Caio), e commit da memória (Mônica)
2. Pedir ajustes — o usuário descreve o que mudar
3. Abortar

Grave no arquivo:

```
# Aprovação para Merge

**Escolha:** {1. Aprovar | 2. Pedir ajustes | 3. Abortar}
**Data:** {YYYY-MM-DD}
**Migrations a aplicar:** {lista de arquivos SQL ou "nenhuma"}
**Ajustes pedidos:** {itens marcados [BACK]/[FRONT], ou "nenhum"}
**Observações do usuário:** {texto livre ou "nenhuma"}
```

Depois da escolha:

- **1. Aprovar:** siga para o step 09.
- **2. Pedir ajustes:** marque cada ajuste com `[BACK]` ou `[FRONT]` (pergunte se não estiver claro) e volte para `step-03-implement-backend`. Conta como um ciclo de revisão (`max_review_cycles: 3`); a mudança passa de novo por aceite, revisão, QA e por esta aprovação.
- **3. Abortar:** ofereça descartar as alterações do run no `<PROSYSTEM_DIR>` (mostre a lista de arquivos e só descarte com confirmação explícita) e encerre o pipeline sem merge nem deploy.

Caminhos com `v*/` significam: use a pasta `vN/` mais alta do run que contém o arquivo.
