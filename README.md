# Agents Squad

Agents Squad e uma skill para Codex que cria e executa equipes de agentes de IA para desenvolvimento de software.

O objetivo e permitir que um time inteiro use o mesmo padrao de trabalho: analise da solicitacao, programacao por especialidade, revisao, QA e release, com memoria por projeto e squads reutilizaveis.

## O Que Esta Incluido

- Skill `opensquad` pronta para instalar no Codex.
- Equipe padrao `platform-delivery-team`:
  - Analista da solicitacao
  - Especialista Web
  - Especialista Android
  - Especialista iOS
  - Revisor de codigo
  - Analista de QA
  - Gerente de release
- Blueprints adaptativos para diferentes tipos de projeto:
  - `mobile-web-app`
  - `landing-page`
  - `ecommerce`
  - `software-general`
- Templates de squads para backend, fullstack, QA, release e multiplataforma.
- Dashboard para acompanhar squads em execucao.
- Scripts para instalar a skill globalmente no Codex.

## Como Baixar

Opcao 1: clonar com Git

```bash
git clone https://github.com/Nxt-Julio/agents_squad.git
cd agents_squad
```

Opcao 2: baixar ZIP

1. Abra `https://github.com/Nxt-Julio/agents_squad`
2. Clique em `Code`
3. Clique em `Download ZIP`
4. Extraia a pasta e abra um terminal dentro dela

## Instalar No Codex

Depois de baixar o projeto, instale as dependencias e registre a skill no Codex:

```bash
npm install
npm run codex:skill:install
```

Para atualizar uma instalacao existente:

```bash
npm run codex:skill:install:force
```

Para conferir onde a skill foi instalada:

```bash
npm run codex:skill:path
```

Depois disso, qualquer pessoa do time pode chamar no Codex:

```text
/opensquad
```

## Criar A Equipe Padrao

Para criar diretamente a equipe com Analista, Web, Android, iOS, Revisor, QA e Release:

```bash
npm run opensquad:template -- create platform-delivery-team minha-equipe-dev
```

Fluxo da equipe:

```text
Solicitacao -> Analise -> Web -> Android -> iOS -> Revisao -> QA -> Release -> Aprovacao final
```

A equipe foi desenhada para economizar tokens: o analista gera prompts curtos, cada setor trabalha apenas na sua plataforma, e plataformas sem impacto ficam como `N/A`.

## Criar Equipe Adaptativa

Para deixar a skill escolher o melhor blueprint conforme o projeto:

```bash
npm run opensquad:team:detect -- --source .
npm run opensquad:team:apply -- --source . --project meu-projeto
```

Para forcar um blueprint especifico:

```bash
npm run opensquad:team:apply -- --blueprint mobile-web-app --source . --project meu-app
npm run opensquad:team:apply -- --blueprint landing-page --source . --project minha-landing
npm run opensquad:team:apply -- --blueprint ecommerce --source . --project minha-loja
```

## Trabalhar Com Projetos

O Opensquad suporta contexto global e contexto por projeto.

```bash
npm run opensquad:project:list
npm run opensquad:project -- create meu-projeto
npm run opensquad:project -- use meu-projeto
npm run opensquad:project:current
```

No modo por projeto, cada projeto fica isolado em:

```text
projects/<projeto>/_memory
projects/<projeto>/squads
projects/<projeto>/skills
```

## Templates Disponiveis

```bash
npm run opensquad:template:list
```

Templates principais:

- `platform-delivery-team`: equipe completa para Web, Android, iOS, revisao, QA e release.
- `backend-feature`: entrega de feature backend.
- `fullstack-feature`: entrega backend + frontend.
- `qa-regression`: validacao de regressao.
- `release-ops`: preparacao de release.

## Validar O Projeto

Antes de publicar ou atualizar:

```bash
npm run validate:opensquad
```

Build do dashboard:

```bash
cd dashboard
npm install
npm run build
```

## Estrutura

```text
.agents/skills/opensquad        Skill instalavel no Codex
_opensquad/templates/squads      Templates de squads
_opensquad/templates             Blueprints adaptativos
_opensquad/core                  Prompts, runner e boas praticas
scripts                          CLI de projetos, templates e instalacao
dashboard                        Visualizacao dos squads
projects                         Workspaces por projeto
squads                           Squads globais
```

## Intuito

Este repositorio existe para padronizar como times de desenvolvimento usam agentes no Codex.

Em vez de cada pessoa criar prompts diferentes, a equipe usa uma mesma skill com papeis claros, pipeline previsivel, memoria por projeto e um fluxo de validacao que passa por analise, desenvolvimento, revisao, QA e release.

Isso ajuda a reduzir retrabalho, preservar contexto entre execucoes e manter qualidade mesmo quando varios projetos e varios agentes estao rodando em paralelo.
