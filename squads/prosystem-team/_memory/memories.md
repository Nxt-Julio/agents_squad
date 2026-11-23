# Squad Memory: ProSystem Team

## Estilo de Escrita

## Design Visual

## Estrutura de Conteudo

## Proibicoes Explicitas
- Nada de merge, push em `main`, deploy ou mudança no Coolify antes da aprovação do step 08 (decisão do usuário na criação do squad, 21/11/2026).
- Nunca gravar `COOLIFY_TOKEN` ou outro segredo em arquivo versionado, relatório ou cérebro.

## Tecnico (especifico do squad)
- Repositório único `Nxt-Julio/prosystem` (back e front juntos): PHP 8.4 + Apache, PostgreSQL 18, Bootstrap 5/jQuery/Alpine. Sem suíte de testes nem CI no GitHub (verificado em 21/11/2026).
- Máquina local sem `php`, `psql` e Docker: validação local é só sintaxe (`tools/php-lint.js`, usa `php-parser` no Node). O fluxo real só é testado depois do deploy.
- Deploy: aplicação Coolify `bkklyxn7cexx7vmxlcbcuj54` (Dockerfile na raiz), servidor 2.25.101.139, atrás do Cloudflare (SSL Full). Health check `/healthz`. OPcache sem revalidação: mudança de código exige deploy novo. Volume persistente em `/data`.
- Banco: container PostgreSQL `wc1jvo2bvdp68wdxhmoqpgg1`, banco `prosystem` com um schema por sistema. Acesso por `tools/coolify_db.sh` (SSH alias `coolify-prosystem`).
- Mudança de banco (regra do squad): SQL novo e idempotente em `tools/` + criação automática no PHP quando o padrão permitir. O Caio aplica em produção no step 10 só os arquivos listados em "Migrations a aplicar" do step 08, sempre com `tools/coolify_db.sh backup` antes. SQL destrutivo só com confirmação explícita separada.
- Em 21/11/2026 o `gh` não estava instalado e `COOLIFY_TOKEN`/`GH_TOKEN` não estavam definidos na máquina local; o Gustavo e o Caio param e pedem ao usuário se continuar assim.
- Variáveis `SMTP_*` ainda não existem no app do Coolify (e-mails do sistema não saem) — pendência do usuário desde 19/11/2026.
- ProMaq (`/promaq/`, desde 22/11/2026): produto de gestão de máquinas e obras de terraplenagem, no molde da Consulta de Placas. Regras em `app/promaq.php` (prefixo `pm_`), telas em `public_html/promaq/modulos/` (helpers `pmv_`). Fechado por padrão: só super administrador até liberar no Controle de Acessos. Nome decidido: ProMaq (as imagens de referência traziam "TerraPro"); "Projetos" virou "Obras".
- ProMaq, regras: horas = horímetro final − inicial − paradas; parte diária não pode cruzar a faixa de horímetro de outra da mesma máquina; medição = max(horas, franquia proporcional aos dias alocados no mês) × valor da hora, e o mês corrente conta até hoje. As tabelas antigas em inglês do schema `promaq` (machines, projects...) não são usadas e não foram apagadas.
- Smoke pós-deploy com PHP e banco reais: `ssh coolify-prosystem 'docker exec -i <container do app> php' < script.php`, com `require /home/prosystembrasil/app/<arquivo>.php`, tudo dentro de uma transação com ROLLBACK e `company_id` fictício. O container não tem `git`; o SHA em uso está em `SOURCE_COMMIT`. O app conecta no banco como `postgres`.
- `.gitignore` do prosystem ignora `*.sql`: arquivo novo em `tools/` precisa de `git add -f`.
- Em 22/11/2026 o `gh` seguia sem autenticação e `COOLIFY_TOKEN` indefinido: com o step 08 aprovado, o merge foi local (`--no-ff`) com push em `main`, sem PR, e o deploy foi acompanhado por SSH e URLs. O heredoc do Bash da ferramenta falha com apóstrofos em texto longo: escrever o script em arquivo e rodar.
- Validade de senha (desde 23/11/2026): tabela `public.acesso_senha` (origem, usuario_id, validade_dias, alterada_em, forcar_troca, hash_ref). Sem linha a senha nunca vence. `hash_ref` = sha256 do hash da conta: quando outra tela troca a senha, a leitura percebe e recomeça o prazo. Só `/login.php` cobra a troca; logins antigos (`ECV/login.php`, `PLACAS/login.php`, `GESTAOPRO/login.php`) e o app Flutter não cobram. PRO360 fica fora. Decisão do usuário: sem validade padrão global e sem bloquear Gestão PRO em massa.
- Modo duplo ECV + Placas (desde 23/11/2026): vale para quem tem exatamente esses dois produtos (Gestão PRO precisa estar bloqueado com linha `liberado=0`). A sessão guarda uma empresa por produto (`portal_empresas`) e `portal_ajustar_contexto()` (`app/portal_contexto.php`) define `company_id` a cada requisição pelo caminho `/ECV/` ou `/PLACAS/`. O modo fica preso a `portal_duplo_uid` e `portal_duplo_sid`. Tela nova de ECV ou Placas que leia `$_SESSION['company_id']` antes de incluir `conexao.php` precisa da linha de ajuste logo após `session_start()` (49 telas já têm).
- Arquivo novo incluído por `require` sem `is_file` (caso de `app/portal_contexto.php`) derruba o login se ficar fora do commit: conferir `git status` por `??` antes do commit e o arquivo dentro do container depois do deploy.
- Smoke por stdin no Windows: o PowerShell troca acentos por `?` ao canalizar o script para o `ssh` e gera falha falsa em teste com texto acentuado. Usar `cmd /c "ssh coolify-prosystem docker exec -i <container> php < arquivo.php"`.
- A sessão do Claude Code negou (classificador do modo automático) comandos que tocam o banco de produção por SSH (`psql` e script PHP em transação), mesmo só de leitura; `docker ps`, `printenv`, `php -l` e `docker logs` passaram. Nesses casos o usuário roda o comando no terminal dele e cola a saída.
- Varredura HTTP antes × depois do deploy (script em `output/2026-11-23-101119/v1/smoke/smoke_http.sh`) serve de linha de base para mudança que toca muitas telas. Já existiam antes de 23/11/2026: `500` em `ECV/.../editar_vistoria.php` sem sessão e erro fatal em `ECV/.../emitir_nfse1.php` (caminho `../app/conexao.php`).
- Pendências conhecidas de acesso, fora do run de 23/11/2026: `portal_contas` sobrevive à entrada por login antigo e permite trocar de programa para contas de outra pessoa sem senha; `salvar_dist` grava `nivel_acesso` com maiúscula (o CHECK do banco é minúsculo); Distribuidora, Consulta de Placas e ProMaq não encerram sessão aberta quando a senha vence.
