# Domain Framework — ProSystem

ProSystem: conjunto de ERPs SaaS em PHP para vistoriadoras (ECV), estampadoras de placas (PLACAS), gestão (GESTAOPRO), distribuidora (DISTRIBUIDORA/MedLife), Consulta de Placas, PRO360 e os sites `prosystem.com.br` e `portalecv.com.br`, com login unificado.

## Repositório

Um repositório só, que tem back e front juntos:

| Item | Valor |
|------|-------|
| GitHub | `Nxt-Julio/prosystem` (branch principal `main`) |
| Pasta local | `D:/prosystem` |
| Pasta na nuvem | `prosystem/`, ao lado de `agents_squad/` |
| Stack | PHP 8.4 + Apache (`.htaccess`), PostgreSQL 18 (PDO `pdo_pgsql`), Bootstrap 5, jQuery, DataTables, Alpine.js, TCPDF |
| Testes automatizados | não existem (sem PHPUnit, sem `package.json`, sem CI no GitHub) |

Nos steps, `<PROSYSTEM_DIR>` é a pasta local se ela existir; se não, a pasta da nuvem. Todo comando git usa `git -C <PROSYSTEM_DIR>`.

## Setores (divisão por camada no mesmo repositório)

| Setor | Marca | Dono | O que entra |
|-------|-------|------|-------------|
| Backend | `[BACK]` | Beto | `app/` (`db.php`, `conexao*.php`, `Controller/`, `Model/`, `service/`, `lib/`, `nfse/`, `actions/`, `config/`), endpoints PHP que gravam ou devolvem JSON (`public_html/api/`, `acoes_*.php`, `salvar*`, `processar*`, `ajax*`, crons), SQL (`tools/*.sql`, schemas criados pelo PHP), `Dockerfile` e `docker/` |
| Frontend | `[FRONT]` | Fernanda | Telas PHP (HTML gerado), JavaScript (inline ou `.js`), CSS, `public_html/assets/`, layout, textos de tela, formulários e chamadas `fetch`/`$.ajax` |

- Arquivo que mistura as duas coisas (PHP com SQL no topo e HTML embaixo) fica com um setor só, definido pela análise. Se os dois precisarem mexer no mesmo arquivo, o backend altera primeiro (step 03) e o front altera depois (step 04) sem desfazer o que o backend fez.
- Não edite pastas de terceiros (`tcpdf/`, `stripe-php/`, arquivos `.min.js`/`.min.css`) nem builds do Flutter Web.

## Arquitetura e deploy

```
navegador -> Cloudflare (proxy, SSL Full) -> Coolify (2.25.101.139) -> container PHP 8.4 + Apache :80 -> PostgreSQL 18 (container no mesmo servidor)
```

- Imagem: `Dockerfile` na raiz (guia em `docker/README.md`). O build roda `php -l app/conexao.php` e `apache2ctl -t`; erro de sintaxe em outros arquivos só aparece em execução.
- Código copiado para `/home/prosystembrasil/` (~170 caminhos fixos no código). Volume persistente em `/data` (uploads, certificados A1, sessões).
- OPcache sem revalidação: toda mudança de código precisa de deploy novo.
- Health check: `GET /healthz` (deve responder `ok`).
- Domínios na mesma aplicação: `prosystem.com.br` (+ www), `portalecv.com.br` (+ www), `360.prosystem.com.br`, `painel.prosystem.com.br`, `zuffpet.com.br`. Para domínio novo, editar `docker/apache/prosystem.conf`.
- Variáveis de ambiente da aplicação: `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`, `SMTP_*`, `CDP_API_KEY`, `CDP_WEBHOOK_SECRET` (lista completa em `docker/README.md`).
- Banco: um banco `prosystem` com um schema por sistema antigo (`servicos`, `distribuidora`, `cautelar`, `central`, `notas`, `promaq`, `prosystem`, `parceiros`, `consulta`, `public`). Conexão única em `app/db.php`.

## Coolify

| Item | Valor |
|------|-------|
| Painel | `https://panel.devalvaro.tech/` |
| API | `https://panel.devalvaro.tech/api/v1` com `Authorization: Bearer $COOLIFY_TOKEN` |
| Aplicação ProSystem (UUID) | `bkklyxn7cexx7vmxlcbcuj54` (back e front são a mesma aplicação) |
| Container do PostgreSQL | `wc1jvo2bvdp68wdxhmoqpgg1` |
| Deploy automático | push/merge em `main` |
| SSH (diagnóstico) | alias `coolify-prosystem` (chave `~/.ssh/coolify_prosystem`) |
| Acesso ao banco | `tools/coolify_db.sh` (`info`, `backup`, `psql`, ...), roda `psql` dentro do container via SSH |

Chamadas da API usadas pelo squad (confira a documentação do Coolify v4 se a resposta vier diferente):

- `GET /applications/{uuid}`: configuração e status da aplicação
- `GET /deployments/applications/{uuid}`: deploys da aplicação (o mais recente primeiro)
- `GET /deployments/{deployment_uuid}`: status, commit e log de build de um deploy
- `GET /applications/{uuid}/logs?lines=200`: log de runtime do container
- `GET /applications/{uuid}/envs` e `PATCH /applications/{uuid}/envs`: variáveis de ambiente
- `GET /deploy?uuid={uuid}`: dispara um deploy novo

O token fica só na variável de ambiente `COOLIFY_TOKEN`. Nunca escreva o valor em arquivo, relatório, commit ou cérebro.

## Contratos

Quando back e front mudam juntos, a análise define o contrato antes da programação:

- endpoint (arquivo PHP e URL), método, parâmetros (`$_GET`/`$_POST`/JSON), formato da resposta (JSON ou redirect + mensagem de sessão), códigos de erro HTTP e mensagens, nomes de campos de formulário, colunas e tabelas novas.

## Mudanças de banco ("migrations")

O projeto não tem ferramenta de migration. O padrão é:

1. Quando possível, o próprio PHP cria a coluna/tabela na primeira chamada, de forma idempotente (ex.: `caixa_tem_vinculo` em `app/db.php`, schema `consulta` criado na primeira abertura).
2. Sempre existe também um arquivo SQL **novo** em `tools/` (ex.: `tools/cash_book_inspection_id.sql`), idempotente (`IF NOT EXISTS`), com comentário no topo dizendo para que serve e como aplicar.
3. Arquivo `.sql` que já está na `main` nunca é editado: a correção vai em um arquivo novo.
4. Comando destrutivo (`DROP`, `DELETE`, `TRUNCATE`, `ALTER ... DROP`) só com confirmação explícita do usuário, separada da aprovação do step 08.

## Comandos de validação

Não há PHP, `psql` nem Docker na máquina local (Windows). O squad usa:

| Uso | Comando (na raiz do `agents_squad`) |
|-----|-------------------------------------|
| Sintaxe PHP e JS dos arquivos alterados | `node squads/prosystem-team/tools/php-lint.js --changed <PROSYSTEM_DIR>` |
| Sintaxe de arquivos específicos | `node squads/prosystem-team/tools/php-lint.js <arquivo> [...]` |
| Espaços e conflitos no diff | `git -C <PROSYSTEM_DIR> diff --check` |
| Arquivos alterados | `git -C <PROSYSTEM_DIR> status --short` |
| Pós-deploy | `curl -fsS https://prosystem.com.br/healthz` e `curl -s -o /dev/null -w "%{http_code}" <url da tela afetada>` |

O `php-lint.js` usa `php -l` quando existe PHP no PATH; se não, usa o `php-parser` (instalado sozinho em `squads/prosystem-team/tools/node_modules`, fora do Git). Ele pega erro de sintaxe, não erro de execução: o fluxo real só é exercitado depois do deploy (smoke do Caio). Os relatórios devem dizer isso.
