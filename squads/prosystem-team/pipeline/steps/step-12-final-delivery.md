---
type: checkpoint
outputFile: squads/prosystem-team/output/final-delivery.md
---

# Step 12: Entrega Final

O Claude (orquestrador) apresenta a entrega ao usuário a partir dos relatórios do run (`squads/prosystem-team/output/{run_id}/` e pastas `v*/`):

1. Pedido × entregue: cada critério de aceite com ✅/⚠️
2. Arquivos alterados e repositório (`Nxt-Julio/prosystem`)
3. PR (URL) e SHA do merge
4. URL do deploy, status e healthcheck
5. Testes executados (e o que só foi conferido pós-deploy)
6. Ajustes feitos no Coolify e migrations aplicadas
7. O que foi registrado no cérebro (squad e Obsidian)
8. Pendências e riscos

Inclua os caminhos de `deploy-report.md` e `brain-record.md` e pergunte:

1. Concluir
2. Abrir nova correção — começa um run novo no step 01 com o pedido do usuário
3. Reverter — confirme com o usuário (mostre o SHA e o que volta); com o sim, o Gustavo abre um PR com `git revert <sha do merge>`, faz o merge e o Caio acompanha o novo deploy. Migrations aplicadas não são desfeitas sem um pedido separado.

Grave no arquivo:

```
# Entrega Final

**Escolha:** {1. Concluir | 2. Abrir nova correção | 3. Reverter}
**Data:** {YYYY-MM-DD}
**PR:** {url}
**SHA do merge:** {sha}
**Deploy:** {status}
**Observações do usuário:** {texto livre ou "nenhuma"}
```

Caminhos com `v*/` significam: use a pasta `vN/` mais alta do run que contém o arquivo.
