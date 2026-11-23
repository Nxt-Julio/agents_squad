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

## 2026-11-23 — 2026-11-23-101119 — Controle de Acessos e modo duplo ECV + Placas

- Pedido: cadastrar e editar usuários com empresa e produtos no Controle de Acessos, prazo em dias para troca de senha, e login que abre ECV na aba atual e Placas em nova aba para quem só tem os dois; manter as contas existentes como estão.
- Feito: [BACK] `app/acesso_produtos.php` (acesso_senha_*), `app/portal_contexto.php` (novo), `app/portal_produtos.php`, `app/conexao.php`, ações novas em `controle_acessos.php`, `tools/acesso_senha.sql`, linha de ajuste em 49 telas de ECV e Placas; [FRONT] telas de troca de senha e de abertura do modo duplo no `/login.php`, formulários do Controle de Acessos, atalho "Abrir <outro>" nos cabeçalhos.
- PR/SHA: sem PR (gh sem login; merge local --no-ff) / 9889612e362e840fc30ec5d3f84b31bdb40a0c05
- Problemas: aceite reprovou (20 telas liam a empresa antes do ajuste do modo duplo); revisão reprovou (modo duplo sobrevivia à entrada por login antigo); a sessão negou os comandos de banco por SSH; o smoke rodado pelo PowerShell deu 1 falha falsa por acento corrompido.
- Como resolveu: linha de ajuste nas 49 telas; modo duplo preso ao usuário e ao id da sessão; o usuário rodou o smoke no terminal dele, e pelo `cmd` fechou 144/144; varredura HTTP de 53 URLs idêntica antes e depois.
- Aprendizado: tirar a linha de base HTTP antes do push; conferir arquivo novo no commit e no container; no Windows mandar script por stdin pelo `cmd`. Ficou pendente o teste de navegador (71 passos), que depende de login do usuário; a migration não foi aplicada porque a aplicação cria a tabela sozinha.

## 2026-11-22 — 2026-11-21-232031 — ProMaq (protótipo)

- Pedido: criar o produto ProMaq a partir de 14 imagens de um app de terraplenagem, somando práticas do nicho; protótipo.
- Feito: [BACK] `app/promaq.php` (pm_*), 7 tabelas em `promaq` (`tools/promaq_schema.sql`), catálogo/acesso/portal; [FRONT] `public_html/promaq/` (Início, Obras, Máquinas, Apontar, Relatórios, Perfil), entrada no login. Esqueleto antigo removido.
- PR/SHA: sem PR (gh não autenticado; merge local --no-ff) / 28a530157f1a1f6a4c82f3f72603e6c71fef1d4f
- Problemas: no step 08 o usuário pediu para corrigir as pendências antes de publicar (lançamento em dobro, sem editar/excluir, franquia cheia, dia parado, número digitado). A revisão do ciclo 2 achou 3 defeitos de regra (arredondamento do horímetro, horímetro caindo ao excluir, local não limpo).
- Como resolveu: ciclo 2 de ajustes + revisão; correções aplicadas; smoke real no container com rollback (23/23).
- Aprendizado: dá para testar regra com PHP e banco reais depois do deploy por `docker exec -i <app> php` com script em stdin, dentro de transação com ROLLBACK e empresa fictícia.

