# Squad Memory: NXT Transport Team

## Estilo de Escrita

## Design Visual

## Estrutura de Conteudo

## Proibicoes Explicitas

## Tecnico (especifico do squad)
- Deploy do backend: push em `main` dispara auto-deploy (Coolify/sslip.io), mas migrations Prisma NAO rodam sozinhas; aplicar manualmente no servidor (Prisma CLI e devDependency, fora da imagem runtime).
- APK de teste: `project-nxt-transport-mobile/dist/regerar-apk.bat` (ou `scripts/build-test-apk.bat`); usbRelease assinado com debug keystore via `-PALLOW_DEBUG_SIGNED_RELEASE=true`.
- Cobranca (decisao do usuario): a 1a carga do grupo e gratis; a partir da 2a, taxa % sobre o frete, gerada ao publicar. Bloqueio e carga gratis valem por CNPJ raiz (8 digitos). Pendencia → 402 + rascunho no servidor + botao "Ir para Financeiro". O motorista ve o valor cheio + taxa + liquido. Pix manual (baixa via admin/CLI) ate existir um gateway.
- Filiais (decisao do usuario): a matriz gerencia as filiais e as cargas delas, e cada filial tem login proprio. Login da matriz ve tudo; login da filial so ve os dados dela. Planejado, ainda nao implementado.
- Chave Google Maps fica so no `.env` do mobile (gitignored), nunca no `.env.example`; a chave atual nao tem Directions API, linha da rota vem do backend (OSRM).
