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





## 2026-11-27 — 2026-11-27-152311 — Suprimentos: cadastros de Categoria e Marca

- Pedido: duas telas para cadastrar categoria e marca; no cadastro do produto mostrar as existentes e pedir para escolher.
- Feito: tabelas sup_categorias/sup_marcas, tela comum com listar/buscar/cadastrar/renomear/inativar, selects obrigatórios no item com validação no servidor, menu, Acesso por Tela e botões no Estoque.
- Problemas: heredoc longo do Bash falhou ("unexpected EOF") com JS de template literal; resolvido escrevendo o script com Write. QA achou corrida no GET opcoes (resposta atrasada de outro modal) e mensagens; corrigido com contador de sequência.

## 2026-11-27 — 2026-11-27-144513 — Suprimentos: campo Categoria

- Pedido: campo CATEGORIA no cadastro de itens.
- Feito: coluna nova (migration aditiva `tools/suprimentos_categoria.sql`), categoria opcional em caixa alta com sugestões, coluna na tabela do Estoque, busca por categoria, categoria no detalhe do Solicitar.
- Problemas: script de edição não achava os trechos porque o checkout deixou CRLF; resolvido normalizando EOL. Revisão sugeriu `pg_attribute` no lugar de `information_schema` (10x mais rápido), aplicado e conferido em produção.

## 2026-11-27 — 2026-11-27-110541 — Suprimentos: descrição em caixa alta

- Pedido: descrição do produto sempre em maiúsculas, inclusive enquanto cadastra.
- Feito: listener input/compositionend no campo Descrição (mantém cursor), text-transform, edição e envio em maiúsculas; `mb_strtoupper` no servidor antes do corte em 150. Sem migration: consulta só de leitura mostrou 6/6 já em maiúsculas.
- Problemas: nenhum. Observação de UX aceita: Ctrl+Z fica limitado no campo porque o valor é trocado por código.

## 2026-11-27 — 2026-11-27-085624 — Suprimentos: Cor vira Marca

- Pedido: gravar marca em vez de cor no Suprimentos ("de momento"), trocando o rótulo ou criando campo Marca e escondendo Cor.
- Feito: escolhida a troca de rótulo (sem migration): th, data-label e label do modal em `suprimentos_estoque.php`; Solicitar e Fila só mostram o valor, sem rótulo.
- Problemas: o agente de revisão disse que `app/suprimentos.php` não existia; existe (conferido pelo orquestrador). Rolling update deixou o container antigo uns segundos no ar: conferir que só o novo ficou antes do smoke.

## 2026-11-26 — 2026-11-26-202509 — Suprimentos e Acesso por Tela

- Pedido: módulo Suprimentos no Gestão PRO e tela para liberar/bloquear telas por usuário. Decisões do usuário: estoque único; níveis 1-2 administram estoque e fila, 3-4 solicitam, 5 só vê as próprias; Acesso por Tela só nível 1, por usuário, cobrindo Gestão PRO, ECV e Placas.
- Feito: [BACK] `app/suprimentos.php` e `app/acesso_telas.php`, tabelas `sup_itens`, `sup_solicitacoes`, `sup_solicitacao_itens`, `sup_movimentacoes` e `public.acesso_telas`. [FRONT] telas de estoque, fila e solicitação, `controle_telas.php` e checagem de tela nos três `header.php`. Padrão liberado, fail-open, nível 1 nunca bloqueado; tela `so_menu` só some do menu.
- PR/SHA: sem PR (gh sem autenticação; merge local --no-ff) / 1d9183a (feature 4d9ac74)
- Problemas: aceite reprovou o ciclo 1 (`crm_funil` sem `so_menu`, porque `crm_funil.php` não inclui o header, então o bloqueio não valia).
- Como resolveu: `crm_funil` marcada `so_menu` no ciclo 2. Migrations aplicadas antes do container novo (backup antes); smoke real 43 ok/0 falha, inclusive o ON CONFLICT ... DO UPDATE ... WHERE do acesso_telas no PostgreSQL. Build ~4-5 min.
- Aprendizado: ver memories.md (smoke com SAVEPOINT, migrations antes do container, páginas sem header). Limites aceitos: AJAX não é bloqueado por tela; em algumas páginas o POST é processado antes do header.

## 2026-11-26 — 2026-11-26-185712 — NFS-e agrupada (run 2 de 2)

- Pedido: emitir uma NFS-e para várias vistorias, só com o mesmo CPF/CNPJ (alerta "Clientes diferentes"), somando valores e descontos. Telas decididas pelo usuário: Dashboard do ECV e Serviços do Gestão PRO; Placas fora.
- Feito: [BACK] `app/nfse_agrupada.php` (prévia, validações, soma em centavos, emissão), tabela `nfse_nacional_dps_vistorias`, `nfse_nac_emitir_grupo`, trava de segunda nota e cancelamento pelo grupo em `nfse_nacional_service.php`, ações `opcoes_agrupada`/`emitir_agrupada`. [FRONT] botão "NFS-e agrupada" na barra Selecionados, prévia com somas, alerta "Clientes diferentes", campo Cidade no endereço do Serviços.
- PR/SHA: sem PR (merge local --no-ff na worktree que está na main) / b11b734
- Problemas: revisão reprovou o ciclo 1 (formulário de endereço do Serviços sem Cidade, que o Emissor Nacional exige → laço de need_address).
- Como resolveu: campo Cidade obrigatório só na agrupada, mensagem com o campo que falta, `desconto_maior` bloqueando. Testes reais (php -l, smoke_puro 53/53) depois do deploy; migration aplicada durante o build.
- Aprendizado: antes de planejar NFS-e, conferir `notas_config.provider` em produção (todas no Emissor Nacional em 26/11/2026). Ao esperar o deploy, conferir o SOURCE_COMMIT de cada container listado: outra tarefa pode publicar no meio.

## 2026-11-26 — 2026-11-26-143250 — Cliente da nota do despachante e consulta de CNPJ (run 1 de 2)

- Pedido: três itens (nota agrupada, cliente × despachante, consulta de nome por CPF/CNPJ). Decisão do usuário: modelo "pagador fica", dois runs (este = despachante + CNPJ; run 2 = nota agrupada no Dashboard do ECV e no Serviços do Gestão PRO), CPF só pelo cadastro próprio.
- Feito: [BACK] coluna `inspections.nota_client_id` + `app/nota_cliente.php` (`nota_cli_*`); gravação na nova vistoria (ECV, Placas) e na edição (três); `opcoes_emissao` com `nota_cliente`/`nota_cliente_inativo`; `emitir_nfse` sem `tomador_client_id` usa o cliente da nota e recusa se inativo; `app/doc_consulta.php` + três `ajax_doc_consulta.php` (sessão, 30/min, cache 30 dias). [FRONT] campo "Cliente da nota fiscal" no quadro do despachante, linha "Nota: NOME" nas listas, tela de emissão pré-marcada, `assets/js/doc-lookup.js` nos formulários de cliente.
- PR/SHA: sem PR (merge local --no-ff, feito dentro da worktree para não tocar D:/prosystem) / e680e74
- Problemas: aceite do ciclo 1 reprovou (cliente da nota inativo travava a emissão; exclusão de cliente mexe em `active` e as listas filtravam `is_active`). O classificador do modo automático negou o QA que rodava PHP/banco no servidor; o QA ficou só em Node.
- Como resolveu: `nota_cliente_inativo` + aviso na tela com "Não" enviando `tomador_client_id = 0`; filtro `ativo_nota` (active). Testes reais (php -l, smoke_puro, smoke_include) no step 10 depois do deploy, e passaram. Migrations aplicadas durante o build (aditivas).
- Aprendizado: merge sem tocar a pasta principal = `git checkout main` dentro da worktree da feature (a main não estava em uso em outra pasta). Placas: só `admin` tem visão global no dashboard; `superadmin` com empresa 0 dá lista vazia (não é regressão).

## 2026-11-26 — 2026-11-26-075110 — Trava de segunda nota por vistoria

- Pedido: correções do run 2026-11-25-151626, com a regra "não pode ser gerada segunda nota para vistoria que já emitiu nota".
- Feito: [BACK] `nfse_nac_emitir` barra também em homologação (por ambiente); `emitir_nfse` do Gestão PRO com leitura de `nfse_issued`, 409 `ja_emitida`/`em_andamento` e lock por vistoria; `opcoes_emissao` com `ja_emitida`, `nota_numero`, `nota_link`; aviso de nota recuperada em nome de outro cliente; lock no cadastro do cliente da nota; `cliente_nome` escondido de quem não tem a empresa. [FRONT] aviso "NFS-e já emitida" nas três listas.
- PR/SHA: sem PR (merge local --no-ff) / d646f8c
- Problemas: o primeiro smoke rodou contra o container antigo, porque o build levou 17 minutos e a espera de 10 acabou antes.
- Como resolveu: conferir `SOURCE_COMMIT` e o nome do container antes do smoke; segunda espera até o SHA novo.
- Aprendizado: regra de trava baseada em `nfse_numero` herda o COALESCE do `nfse_upsert`; cancelamento fora do sistema não chega ao banco. Ficam como limites registrados em memories.md.

## 2026-11-25 — 2026-11-25-151626 — Nota em nome de outro cliente (despachante)

- Pedido: se o cliente da vistoria é DESPACHANTE, perguntar na emissão se a nota sai em nome de outro cliente; a vistoria continua do despachante. Durante o run o usuário pediu as duas formas: buscar no cadastro ou digitar um cliente novo.
- Feito: [BACK] `buscar_tomador`, `cadastrar_tomador` e `tomador_client_id` nos três `ajax_nfse_indaial_v2.php`; funções em `app/nfse_opcoes.php`; `salvar_tomador` com checagem de empresa (ECV/Placas) e aceitando o cliente da nota (Gestão PRO). [FRONT] bloco do despachante na tela "Emitir NFS-e" das três listas, com busca, formulário de cliente novo e formulário de endereço do cliente da nota.
- PR/SHA: sem PR (merge local --no-ff) / 37741d0
- Problemas: aceite reprovou duas vezes. (1) Em Serviços o formulário de endereço só gravava no cliente da vistoria. (2) A checagem nova de empresa no `salvar_tomador` do ECV/Placas barrava sessão sem empresa (admin de visão global).
- Como resolveu: (1) `salvar_tomador` do Gestão PRO passou a aceitar `inspection_id` + `client_id` com as checagens da troca, e a tela de Serviços usa esse caminho quando há cliente da nota. (2) recusas por unidade só com `$company_id > 0`, espelhando o `emitir_nfse`.
- Aprendizado: endurecer permissão em endpoint antigo pede a tabela "quem emite hoje × quem passa na checagem nova" antes de entregar; e conferir, para cada tela, por qual endpoint o formulário auxiliar grava (Serviços usa outro endpoint de endereço).

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

