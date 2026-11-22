# Quality Criteria — ProSystem

## Regras globais do squad

1. Nada de merge, push em `main` ou alteração no Coolify antes da aprovação do usuário no step 08. A aprovação no step 08 autoriza o fluxo completo: merge, deploy, ajustes de configuração no Coolify, aplicação das migrations listadas no resumo e o commit da memória.
2. Contrato de API definido pela análise e implementado igual por back e front.
3. Migrations sempre novas (arquivo `.sql` novo em `tools/`, idempotente); nunca editar SQL que já está na `main`.
4. Segredos só em variável de ambiente; nunca em arquivo versionado, log de relatório ou cérebro.
5. Setores sem impacto ficam `N/A` com relatório de uma linha.
6. Ninguém afirma resultado de comando sem colar a saída.

## Critérios por etapa

- Análise: critérios de aceite numerados e testáveis; contrato definido quando back e front mudam juntos; riscos de banco, autenticação/permissão, quebra de endpoint e dados sensíveis sinalizados.
- Implementação: `php-lint.js --changed` sem erro e `git diff --check` limpo, com a saída colada; só arquivos do próprio setor; SQL com prepared statements (PDO com parâmetros), nunca concatenando entrada do usuário; checagem de sessão/permissão nas telas e endpoints novos ou alterados; saída HTML escapada (`htmlspecialchars`).
- Aceite: todo critério marcado ✅, ❌ ou ⚠️ com evidência (arquivo/linha ou saída de comando).
- Revisão: feita sobre o diff real; correções obrigatórias com `[BACK]`/`[FRONT]`, arquivo e linha.
- QA: comandos dos setores afetados com saída colada; checagens manuais pós-deploy listadas para o Caio.
- GitHub: PR com resumo, critérios, testes e riscos; merge squash em `main` só com checks verdes ou ausentes (registrado no relatório).
- Deploy: deploy do SHA do merge com status `finished`, `/healthz` respondendo `ok`, telas afetadas sem erro 500 e sem `PHP Fatal error`/`PHP Parse error` no log.
- Cérebro: entrada curta e pesquisável, sem segredos nem dados pessoais, sem duplicar o que já existe.
