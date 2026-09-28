# Output Examples

## Implementation report

- Status: done
- Files changed: `src/routes/freight.routes.ts`, `src/services/freight.service.ts`, `src/tests/freight.test.ts`
- Contract changes: `GET /api/freights?status=` agora aceita `status` opcional
- Tests/validation: `npm run typecheck` (ok), `npm test` (42 passed)
- Notes for reviewer: filtro aplicado no service, nao no controller

## No-op report

- Status: N/A
- Reason: a mudanca e apenas visual no painel web; backend e mobile nao sao afetados.
