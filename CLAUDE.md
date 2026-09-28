# NXT Transport — Workspace

Este diretorio agrupa os 3 repositorios do NXT Transport e o squad de agentes (Opensquad) que executa toda alteracao.

| Repo | Pasta | Stack |
|------|-------|-------|
| Backend (API) | `project-nxt-transport-backend/` | Node.js, Express, TypeScript, Prisma (PostgreSQL), Socket.io, Jest |
| Web (painel) | `project-nxt-transport-frontend/` | React 18, Vite, TypeScript |
| Mobile (app) | `project-nxt-transport-mobile/` | React Native 0.76 (Android + iOS), TypeScript |

Cada pasta `project-*` e um repositorio git separado. O squad (esta raiz) fica no repo `Nxt-Julio/agents_squad`.

## Execucao na nuvem (Claude Code cloud)

Na nuvem, crie a sessao com 4 repositorios: `Nxt-Julio/agents_squad` e os 3 `alvarogomesilva/project-nxt-transport-*`. A sessao comeca na pasta acima dos clones, entao:

- Os repos de codigo ficam em `project-nxt-transport-*/` (mesmos caminhos relativos usados pelo squad).
- Os arquivos do squad ficam em `agents_squad/`: `AGENTS.md`, `_opensquad/`, `squads/nxt-transport-team/`. Leia caminhos do squad a partir de `agents_squad/`.
- Este arquivo nao e carregado automaticamente nessa pasta: o prompt da tarefa deve pedir para ler `agents_squad/CLAUDE.md` primeiro.
- Se a skill `opensquad` nao estiver disponivel, leia direto `agents_squad/AGENTS.md` e `agents_squad/_opensquad/core/runner.pipeline.md` e execute `run nxt-transport-team`.
- O hook `squad-reminder` nao roda em sessao com varios repos; siga a regra principal abaixo mesmo assim.
- Saidas de execucao (`squads/nxt-transport-team/output/`) ficam so na VM (gitignored). Para guardar o resultado, atualize `squads/nxt-transport-team/_memory/runs.md` e faca commit no `agents_squad` quando o usuario pedir.
- Trabalho em andamento das sessoes locais esta na branch `wip/migracao-nuvem` dos 3 repos de codigo.
- PostgreSQL 16 ja vem instalado na VM (parado): `service postgresql start` antes dos testes do backend.
- Build de APK/IPA nao roda na nuvem; no mobile, valide com `npx tsc --noEmit`, `npm run lint` e `npm test`.

## Regra principal: toda alteracao passa pelo squad

Qualquer pedido que altere codigo em um dos 3 repositorios (feature, correcao de bug, refatoracao, migration, ajuste de tela) deve ser executado pelo squad `nxt-transport-team`:

1. Carregue a skill `opensquad` (ela le `AGENTS.md` e `_opensquad/core/runner.pipeline.md`).
2. Execute `/opensquad run nxt-transport-team`.
3. Use o pedido do usuario como entrada do Step 01; pergunte apenas o que faltar.
4. Siga o pipeline sem pular etapas nem checkpoints:

```
Solicitacao -> Ana (analise) -> Bruno (backend) -> Walter (web) -> Marina (mobile) -> Rafael (revisao) -> Quenia (QA) -> Renato (release) -> Aprovacao final
```

Setores sem impacto ficam `N/A` e geram apenas um relatorio curto — isso mantem o custo baixo em mudancas pequenas.

Nao precisam do pipeline: perguntas, leitura/analise sem alteracao, e manutencao do proprio squad (`_opensquad/`, `squads/`).

## Regras do squad

- Nenhum agente faz commit, push, deploy ou publica build sem pedido explicito do usuario.
- Contratos de API (endpoint, payload, evento Socket.io) sao definidos no backend e consumidos igual por Web e Mobile.
- Migrations Prisma sao sempre novas; nunca editar migrations aplicadas.
- Saidas de cada execucao ficam em `squads/nxt-transport-team/output/<run_id>/`; historico em `squads/nxt-transport-team/_memory/runs.md`.

## Arquivos do squad

- `AGENTS.md` — instrucoes do sistema Opensquad (menu, rotas de comando)
- `_opensquad/` — core (runner, prompts, boas praticas), memoria global e templates
- `squads/nxt-transport-team/` — agentes, pipeline e memoria do time do NXT Transport
- `scripts/` — CLI (`npm run validate:opensquad`, `npm run opensquad:template:list`, etc.)
- `dashboard/` — visualizacao dos squads em execucao (`cd dashboard && npm install && npm run dev`)
- `SQUAD-README.md` — README original do Agents Squad
