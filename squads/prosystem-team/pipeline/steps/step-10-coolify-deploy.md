---
execution: subagent
agent: coolify-specialist
inputFile: squads/prosystem-team/output/github-report.md
outputFile: squads/prosystem-team/output/deploy-report.md
model_tier: powerful
on_reject: step-03-implement-backend
---

# Step 10: Acompanhamento do Deploy no Coolify

Use:

- `squads/prosystem-team/output/{run_id}/v*/github-report.md` (SHA do merge)
- `squads/prosystem-team/output/{run_id}/merge-approval.md` (migrations autorizadas)
- `squads/prosystem-team/output/{run_id}/v*/qa-report.md` (lista de smoke pós-deploy)
- `pipeline/data/domain-framework.md` (aplicação, API, SSH, banco)

Se o `github-report.md` não tiver SHA de merge, pare e escreva isso no relatório.

1. Ache o deploy do SHA do merge na aplicação `bkklyxn7cexx7vmxlcbcuj54` (dispare um se não começar em ~3 minutos) e acompanhe até terminar.
2. Leia os logs de build e de runtime.
3. Aplique as migrations listadas em "Migrations a aplicar", sempre com `tools/coolify_db.sh backup` antes.
4. Verifique `/healthz`, as URLs do smoke e os logs, colando as saídas.
5. Falha de configuração: ajuste no Coolify, refaça o deploy e registre o que mudou. Falha de código: reprove com itens `[BACK]`/`[FRONT]`, logs e diagnóstico.

## Veto Conditions

- Deploy declarado como concluído sem verificar o status do deploy e o healthcheck (saídas coladas)
- Deploy de um SHA diferente do SHA do merge declarado como o deploy do run
- Recurso, volume ou banco apagado, rollback feito ou SQL destrutivo executado sem confirmação explícita do usuário

Caminhos com `v*/` significam: use a pasta `vN/` mais alta do run que contém o arquivo.
