# Squad Memory: NXT Transport Team

## Estilo de Escrita

## Design Visual

## Estrutura de Conteudo

## Proibicoes Explicitas

## Tecnico (especifico do squad)
- Deploy do backend: push em `main` dispara auto-deploy (Coolify/sslip.io), mas migrations Prisma NAO rodam sozinhas; aplicar manualmente no servidor (Prisma CLI e devDependency, fora da imagem runtime).
- APK de teste: `project-nxt-transport-mobile/dist/regerar-apk.bat` (ou `scripts/build-test-apk.bat`); usbRelease assinado com debug keystore via `-PALLOW_DEBUG_SIGNED_RELEASE=true`.
- Cobranca (decisao do usuario): a 1a carga do grupo e gratis; a partir da 2a, taxa % sobre o frete, gerada ao publicar. Bloqueio e carga gratis valem por CNPJ raiz (8 digitos). Pendencia → 402 + rascunho no servidor + botao "Ir para Financeiro". O motorista ve o valor cheio + taxa + liquido. Pix manual (baixa via admin/CLI) ate existir um gateway.
- Filiais (decisao do usuario): cadastro publico so aceita matriz (/0001 ou identificador_matriz_filial da BrasilAPI); filiais sao criadas pela matriz (web e app) e tem login proprio. Matriz ve tudo e pode "entrar como" filial (claim JWT `act`); filial so ve os dados dela. Toda checagem de dono role E usa `getEnterpriseScope`/`accessibleIds` (fora do escopo → 404). Desativar/excluir com dependencias → 409. Implementado na run 2026-09-28-232906.
- Chave Google Maps fica so no `.env` do mobile (gitignored), nunca no `.env.example`; a chave atual nao tem Directions API, linha da rota vem do backend (OSRM).
