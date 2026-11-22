# Output Examples — ProSystem

## Relatório de implementação (Beto)

- Status: concluído
- Arquivos alterados: `app/db.php`, `public_html/ECV/modulos/clientes/acoes_cliente.php`, `tools/20261121_clientes_whatsapp.sql` (novo)
- O que mudou: coluna `servicos.clients.whatsapp` (criada sozinha por `cliente_tem_whatsapp()` e pelo SQL novo); `acoes_cliente.php` grava e devolve o campo no JSON `{ ok, cliente: { id, nome, whatsapp } }`
- Testes: não há suíte automatizada; lint e diff conferidos
- Comandos:
  ```
  $ node squads/prosystem-team/tools/php-lint.js --changed D:/prosystem
  OK   app/db.php
  OK   public_html/ECV/modulos/clientes/acoes_cliente.php
  2 arquivo(s), 0 erro(s) [php-parser]
  $ git -C D:/prosystem diff --check
  (sem saída)
  ```
- Notas para o front: campo `whatsapp` (texto, só dígitos, até 13), erro 422 `{ ok: false, erro: "WhatsApp inválido" }`
- Migration: `tools/20261121_clientes_whatsapp.sql` (idempotente) — aplicar no step 10

## Relatório sem impacto

- Status: N/A — a mudança é só no texto do botão da tela de login; backend não é afetado.

## Resposta a reprovação

- Relatório lido: `v6/code-review-report.md`
- [BACK] 1. `acoes_cliente.php:48` sem checar sessão → corrigido com `exigir_login()` na linha 12
- [BACK] 2. Sem pendência restante
- Itens [FRONT]: não são deste setor

## Conferência de aceite (Paula)

| # | Critério | Situação | Evidência |
|---|----------|----------|-----------|
| 1 | Campo WhatsApp aparece no cadastro | ✅ | `clientes/form.php:88` |
| 2 | Valor salvo e mostrado na edição | ⚠️ | grava, mas a edição não preenche o campo (`form.php:40`) |
| 3 | Número inválido mostra erro | ❌ | front não trata o 422 |

Veredito: REPROVADO — [FRONT] preencher o campo na edição; [FRONT] mostrar a mensagem do 422.

## Relatório de deploy (Caio)

- Aplicação `bkklyxn7cexx7vmxlcbcuj54`: deploy `abc123` do SHA `9f1e2d3` → `finished` (3m12s)
- `curl -fsS https://prosystem.com.br/healthz` → `ok`
- `/ECV/modulos/clientes/` → 302 para login (esperado sem sessão); log sem `PHP Fatal error`
- Ajustes no Coolify: nenhum
- Migration `tools/20261121_clientes_whatsapp.sql`: backup `banco/backups/...` feito, aplicada (`ALTER TABLE`, `CREATE INDEX`)
- Pendências: conferir a tela logado (sem credencial de teste em produção)
