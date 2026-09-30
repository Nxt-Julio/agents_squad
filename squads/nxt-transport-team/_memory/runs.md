# Run History: NXT Transport Team

| Data | Run ID | Tema | Output | Resultado |
|------|--------|------|--------|-----------|
| 2026-09-30 | 2026-09-30-011408 | Aba Dashboard (primeira no web e no app) com financeiro recebido/a receber, taxas e cargas | Backend: GET /dashboard (periodo -03:00, escopo matriz/filial) + 14 testes; Web: DashboardView primeira aba; Mobile: aba Dashboard do motorista e Inicio→Dashboard da empresa | Publicado (merge na main) |
| 2026-09-29 | 2026-09-28-232906 | Gestao de filiais pela matriz (cadastro so matriz, escopo matriz/filial, entrar como, 409 de dependencias) | Backend: escopo em todos os pontos de dono E, ownerEnterpriseId, CLI branch-report, 26 testes de integracao; Web/Mobile: contrato conferido, 403 ENTERPRISE_INACTIVE com logout, Financeiro alinhado | Aprovado (migrations 100000/150000/210000 pendentes em producao) |
| 2026-09-28 | 2026-09-28-145748 | Monetizacao pay-per-post (1a carga gratis, 3% a partir da 2a) com bloqueio 402 por CNPJ raiz, rascunho e tela Financeiro | Backend: invoices/billing_groups + guard 402 + Pix BR Code + baixa admin/CLI; Web/Mobile: 402 com rascunho, Financeiro, pricing; planejamento de filiais | Aprovado (migration pendente em producao) |
| 2026-09-28 | 2026-09-28-093252 | Trocar Cloudinary por storage S3 na VPS (MinIO via Coolify), bucket privado servido pela API | Backend: upload multipart + MinIO + rota de arquivo assinada; Web/Mobile: upload via API, fila de comprovantes pendentes | Aprovado |
| 2026-09-25 | 2026-09-25-133923 | Paridade do painel web com backend+mobile (recuperar senha, erros PT-BR, mapas/rota do backend, logs remotos + Diagnostico) | Backend: platform web em /client-logs + testes; Web: fluxo de senha, erros PT-BR, mapas, logger e tela Diagnostico | Aprovado |
| 2026-09-25 | 2026-09-25-072807 | APK de teste para celular real + logs remotos + mapas (Google/rota do backend) | Backend: /client-logs + migration; Mobile: logger, tela Diagnostico, mapas, APK e bat de build | Aprovado (migration pendente em producao) |
| 2026-09-24 | 2026-09-24-141511 | Fluxo "Esqueceu sua senha" (CPF/CNPJ, codigo por e-mail, OTP, nova senha) | Backend: 3 rotas + migration + SMTP; Mobile: 3 telas | Publicado |
| 2026-09-24 | 2026-09-24-134030 | Validar e corrigir erros de tela no login por empresa | Mobile: mensagens PT-BR, painel, headers, tab bar | Aprovado |
