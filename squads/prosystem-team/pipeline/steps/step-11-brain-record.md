---
execution: subagent
agent: brain-keeper
inputFile: squads/prosystem-team/output/deploy-report.md
outputFile: squads/prosystem-team/output/brain-record.md
model_tier: fast
---

# Step 11: Registro no Cérebro

Leia todos os relatórios do run (`squads/prosystem-team/output/{run_id}/` e as pastas `v*/`) e os arquivos atuais de `squads/prosystem-team/_memory/`.

Registre, sem duplicar:

1. `_memory/memories.md`: conhecimento durável (decisões explícitas do usuário, regras de negócio, armadilhas técnicas, particularidades do deploy), na seção certa.
2. `_memory/runs.md`: uma linha nova no topo da tabela (data, run_id, tema, resultado, PR/SHA).
3. `_memory/cerebro.md`: uma entrada nova no topo (pedido, o que foi feito, problemas encontrados e como foram resolvidos).
4. Obsidian (`D:/Cerebro`): uma nota por aprendizado relevante com `salvar_memoria_auto.js`, usando o slug da área alterada.
5. Commit no `agents_squad` só de `squads/prosystem-team/_memory/*` (`Squad: registra run <run_id> (prosystem-team)`) e push da branch atual.

Nada de segredos, tokens ou dados pessoais. O `brain-record.md` lista o que entrou em cada lugar e o SHA do commit.

Caminhos com `v*/` significam: use a pasta `vN/` mais alta do run que contém o arquivo.
