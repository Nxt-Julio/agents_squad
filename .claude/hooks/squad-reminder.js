#!/usr/bin/env node
// UserPromptSubmit hook: lembra o Claude de passar alteracoes de codigo pelo squad nxt-transport-team.
const context = [
  "[Squad NXT Transport] Se este pedido altera codigo em project-nxt-transport-backend, project-nxt-transport-frontend ou project-nxt-transport-mobile",
  "(feature, correcao, refatoracao, migration), execute pelo squad: use a skill `opensquad` com `/opensquad run nxt-transport-team`,",
  "usando o pedido do usuario como entrada do Step 01. Perguntas, leitura/analise sem alteracao e ajustes no proprio squad nao precisam do pipeline.",
].join(" ");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: context },
  })
);
