# Cérebro: ProSystem Team

Uma entrada por execução, a mais nova no topo. Curto e pesquisável; sem segredos nem dados pessoais.

Formato:

```
## {YYYY-MM-DD} — {run_id} — {tema}

- Pedido: {1-2 linhas}
- Feito: {o que mudou, por setor}
- PR/SHA: {url} / {sha}
- Problemas: {reprovações, falhas de CI, erros de deploy — ou "nenhum"}
- Como resolveu: {...}
- Aprendizado: {regra para o próximo run, ou "nenhum"}
```

<!-- entradas abaixo -->

## 2026-11-22 — 2026-11-21-232031 — ProMaq (protótipo)

- Pedido: criar o produto ProMaq a partir de 14 imagens de um app de terraplenagem, somando práticas do nicho; protótipo.
- Feito: [BACK] `app/promaq.php` (pm_*), 7 tabelas em `promaq` (`tools/promaq_schema.sql`), catálogo/acesso/portal; [FRONT] `public_html/promaq/` (Início, Obras, Máquinas, Apontar, Relatórios, Perfil), entrada no login. Esqueleto antigo removido.
- PR/SHA: sem PR (gh não autenticado; merge local --no-ff) / 28a530157f1a1f6a4c82f3f72603e6c71fef1d4f
- Problemas: no step 08 o usuário pediu para corrigir as pendências antes de publicar (lançamento em dobro, sem editar/excluir, franquia cheia, dia parado, número digitado). A revisão do ciclo 2 achou 3 defeitos de regra (arredondamento do horímetro, horímetro caindo ao excluir, local não limpo).
- Como resolveu: ciclo 2 de ajustes + revisão; correções aplicadas; smoke real no container com rollback (23/23).
- Aprendizado: dá para testar regra com PHP e banco reais depois do deploy por `docker exec -i <app> php` com script em stdin, dentro de transação com ROLLBACK e empresa fictícia.

