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

## 2026-11-25 — 2026-11-25-144440 — Opções de placa e valor na emissão da NFS-e

- Pedido: ao clicar em emitir nota, abrir uma tela perguntando se a placa vai na nota; com chave marcada no Emissor Nacional, perguntar também se a nota sai com valor total ou com desconto.
- Feito: [BACK] `app/nfse_opcoes.php`; `acao=opcoes_emissao` e parâmetros `incluir_placa`/`valor_modo` nos três `ajax_nfse_indaial_v2.php`; coluna `nac_escolher_valor` (config + SQL em `tools/`); checkbox em Fiscal > Emissor Nacional. [FRONT] tela "Emitir NFS-e" no lugar do confirm nos dashboards de ECV e Placas e em Serviços, com as escolhas repetidas no reenvio depois do endereço.
- PR/SHA: sem PR (merge local --no-ff) / 5168bf2
- Problemas: nenhum (aceite, revisão e QA aprovaram no primeiro ciclo).
- Como resolveu: n/a
- Aprendizado: pedido com pontos em aberto pode seguir com padrões registrados no `request-input.md` e conferidos pelo usuário no step 08; o padrão sem escolha tem que ser idêntico ao comportamento anterior quando a mudança mexe em valor de nota.

## 2026-11-25 — 2026-11-25-141713 — NFS-e para vistoria não paga

- Pedido: emitir nota também para vistoria ainda não paga; depois, colocar a opção dentro do painel Emissor Nacional.
- Feito: [BACK] `app/nfse_pendente.php`; endpoint do Serviços passa a conferir a chave; Emissor Nacional grava `bloquear_se_pendente`. [FRONT] botão de nota em vistoria pendente em Serviços e nos dashboards de ECV e Placas quando a empresa permite; chave na tela Emissor Nacional; aviso do Emitir Nota diz onde liberar.
- PR/SHA: sem PR (merge local --no-ff) / 9d8f693
- Problemas: nenhum.
- Como resolveu: n/a
- Aprendizado: antes de criar trava ou liberação, procurar chave de configuração já existente; a regra pedida já existia por empresa e só faltava nas listas.

## 2026-11-25 — 2026-11-25-134955 — Busca por placa nas duas grafias

- Pedido: vistoriadores queriam achar o veículo digitando a placa no padrão antigo ou Mercosul (RLO4666 / RLO4G66), qualquer que fosse a grafia cadastrada.
- Feito: [BACK] `app/placa_equivalente.php` e uso em 8 filtros de placa + aviso de duplicidade no cadastro de ECV e Placas; os PDFs de ECV e Placas deixaram de descartar minúsculas do filtro. [FRONT] N/A.
- PR/SHA: sem PR (merge local --no-ff) / 1bd896e
- Problemas: a sessão negou rodar PHP no container, antes e depois do deploy.
- Como resolveu: sintaxe por php-parser e `php -l` no container, tabela conferida em Node, URLs e log depois do deploy.
- Aprendizado: placa antiga e Mercosul diferem só no 5º caractere por tabela fixa; busca parcial fica sem equivalência porque não dá para saber a posição do caractere. Pendente o teste de navegador.

## 2026-11-25 — 2026-11-25-092651 — Filtros com seleção múltipla nos dashboards

- Pedido: poder marcar várias opções nos filtros do dashboard (ex.: Pix + Crédito; 3 empresas) e o resultado respeitar cada uma.
- Feito: [BACK] `filtro_lista()` e WHERE com placeholders numerados nos dashboards de ECV e Placas (Vistoriador, Pagamento, Status), nos dois `gerar_relatorio.php` e `company_filter[]` no dashboard do Gestão PRO (cruzado com as empresas permitidas); [FRONT] componente `msel` (botão + checkboxes) nas três telas, envio só pelo "Filtrar" no Gestão PRO.
- PR/SHA: sem PR (gh sem login; merge local --no-ff) / 3aa507a47d510df415fa6ffb9c2bf34c8430429f
- Problemas: o aceite reprovou o ciclo 1: o despacho mandou manter a regra de pagamento própria de cada PDF, e ela procurava o slug por `LIKE` onde o banco guarda nome ou id, então Pix + Crédito no PDF sairia só com Pix.
- Como resolveu: ciclo 2 levou para os PDFs a regra do dashboard (`EXISTS` em `payment_history` + `pm.slug`). Smoke pós-deploy com a tela incluída em CLI: Pix 30 + Crédito 3 = 33 no ECV, tela = PDF.
- Aprendizado: quando tela e relatório têm o mesmo filtro, a análise confere no dump como o dado é guardado antes de mandar "manter a regra atual". Pendente: teste de navegador (seletor, celular, Gestão PRO com 3 empresas).

## 2026-11-24 — 2026-11-24-145113 — Permissão por nível numérico no Gestão PRO e no login

- Pedido: conta com perfil `super_admin` fez saída de caixa para a RODEIO e ela caiu na VALE VISTORIAS; corrigir e parar de tratar permissão por nome, usando níveis 1-2-3-4 (viewer = 5).
- Causa raiz: as telas de caixa só reconheciam `admin`, `master` e `superadmin`; o perfil `super_admin` não foi reconhecido, a conta foi tratada como usuário comum (sem filtro de empresa) e o lançamento foi gravado na empresa do cadastro.
- Feito: [BACK] `app/nivel.php` (helpers `nivel_e_*`), coluna `servicos.users.nivel` + trigger `users_nivel_sincronizar` (`tools/users_nivel.sql`), login e portal gravam o nível na sessão; [FRONT] telas e endpoints do Gestão PRO e Controle de Acessos passaram a testar nível (44 arquivos). ECV, Placas, ProMaq, Consulta e Flutter ficam para a segunda entrega.
- PR/SHA: sem PR (gh sem login; merge local --no-ff) / f94821879866afd0e45fd094695478d52d837b6f
- Problemas: a revisão reprovou o ciclo 1 com 3 correções de permissão (a principal: oferecer o nível 3 no Controle de Acessos criava conta que ECV/Placas tratam como global); o aceite aprovou; sessões abertas antes do deploy não têm o nível; Controle de Acessos não pode oferecer nível 3 enquanto ECV/Placas tratarem `master` como global; 502/504 passageiros na troca de container.
- Como resolveu: ciclo 2 corrigiu os 3 pontos; nível 3 fora do Controle de Acessos até a segunda entrega; migration antes do código; segunda varredura HTTP idêntica à linha de base; smoke PHP real 9/9 com ROLLBACK e 8/8 telas sem erro fatal.
- Correção de dado: lançamento `cash_book` 2717 movido da empresa 1 para a 8 em 24/11/2026, autorizado pelo usuário e registrado em `system_logs` (ação `CORRECAO_CAIXA`).
- Aprendizado: testar com PHP 8.4 real no container antes do deploy e SQL em banco descartável; CLI não exercita `filter_input`. Pendente: teste de navegador por nível (roteiro em v2/qa-report.md) e riscos de nível 2 / conta nível 1 sem `company_id`.

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

