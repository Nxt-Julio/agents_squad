# Quality Criteria

- Criterios de aceite da solicitacao atendidos e verificaveis.
- Backend: `npm run typecheck` e `npm test` passando; novas regras com teste Jest/Supertest.
- Web: `npm run build` passando.
- Mobile: `npx tsc --noEmit`, `npm run lint` e `npm test` passando.
- Contrato identico entre Backend, Web e Mobile.
- Validacao de entrada com Zod e checagem de permissao em rotas novas/alteradas.
- Nenhum segredo, `.env` ou credencial versionado.
