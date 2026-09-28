# Domain Framework

NXT Transport: plataforma de gestao de transporte/fretes com API, painel web e app para empresas e motoristas.

## Arquitetura

```
navegador -> nxt-frontend (nginx :8080) --/api, /socket.io--> nxt-backend (:5000) -> PostgreSQL
app mobile -------------------------------------------------> nxt-backend (:5000)
```

- Backend: API REST + tempo real (Socket.io, Redis adapter opcional), JWT + bcryptjs, Zod, Prisma, Sentry, S3.
- Web: painel React + Vite; fala com a API via `/api` e `/socket.io` (proxy nginx).
- Mobile: React Native 0.76 (Android + iOS) para empresas e motoristas; aponta para a API via `API_BASE_URL`.

## Regras de contrato

- Toda mudanca de endpoint, payload ou evento Socket.io e definida primeiro no backend e consumida igual por Web e Mobile.
- Mudancas quebrando contrato exigem plano de compatibilidade (o app mobile publicado demora para atualizar).
- Migrations Prisma sao sempre novas; nunca editar migrations ja aplicadas.
