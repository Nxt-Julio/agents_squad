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
