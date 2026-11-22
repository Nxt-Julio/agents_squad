#!/usr/bin/env node
// UserPromptSubmit hook: lembra o Claude de passar alteracoes de codigo pelo squad certo
// (nxt-transport-team para o NXT Transport, prosystem-team para o ProSystem).
const context = [
  "[Squad NXT Transport] Se este pedido altera codigo em project-nxt-transport-backend, project-nxt-transport-frontend ou project-nxt-transport-mobile",
  "(feature, correcao, refatoracao, migration), execute pelo squad: use a skill `opensquad` com `/opensquad run nxt-transport-team`,",
  "usando o pedido do usuario como entrada do Step 01. Perguntas, leitura/analise sem alteracao e ajustes no proprio squad nao precisam do pipeline.",
  "[Squad ProSystem] Se o pedido altera codigo no repositorio prosystem (D:/prosystem ou prosystem/, Nxt-Julio/prosystem),",
  "execute pelo squad `/opensquad run prosystem-team`, com o pedido do usuario como entrada do Step 01;",
  "merge, deploy no Coolify e mudancas de configuracao so depois da aprovacao do usuario no step 08.",
].join(" ");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: context },
  })
);
