---
execution: subagent
agent: request-analyst
inputFile: squads/prosystem-team/output/frontend-implementation-report.md
outputFile: squads/prosystem-team/output/acceptance-report.md
model_tier: powerful
on_reject: step-03-implement-backend
---

# Step 05: Conferência de Aceite

Confira se o pedido foi atendido usando:

- `squads/prosystem-team/output/{run_id}/request-input.md`
- `squads/prosystem-team/output/{run_id}/v*/programming-dispatch.md`
- `squads/prosystem-team/output/{run_id}/v*/backend-implementation-report.md`
- `squads/prosystem-team/output/{run_id}/v*/frontend-implementation-report.md`
- O diff real: `git -C <PROSYSTEM_DIR> status --short` e `git -C <PROSYSTEM_DIR> diff`

Marque cada critério de aceite como ✅ atendido, ❌ não atendido ou ⚠️ parcial, com evidência (arquivo:linha ou saída de comando).

Veredito `APROVADO` só se todos estiverem ✅ (⚠️ só é aceitável se não impedir o uso e estiver justificado). Qualquer ❌ reprova: liste o que falta por setor com `[BACK]`/`[FRONT]`.

Caminhos com `v*/` significam: use a pasta `vN/` mais alta do run que contém o arquivo.
