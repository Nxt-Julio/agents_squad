# Anti-Patterns — ProSystem

- Fazer merge, push em `main`, deploy ou mudar configuração no Coolify antes da aprovação do step 08.
- Implementar back e front com nomes de campos, URL ou formato de resposta diferentes do contrato da análise.
- Editar um `.sql` de `tools/` que já está na `main` em vez de criar um novo; SQL não idempotente.
- Escrever token, senha, chave de API ou `.env` em arquivo versionado, relatório, PR, log ou cérebro (inclui `COOLIFY_TOKEN`, `PG_PASSWORD`, `CDP_API_KEY`, `SMTP_PASSWORD`).
- Ler e alterar arquivos de um setor marcado `N/A`, ou escrever relatório longo para setor sem impacto.
- Dizer que um comando passou, que o deploy terminou ou que a tela abriu sem colar a saída.
- Resumir o repositório inteiro em vez de ler só os arquivos do escopo.
- Concatenar `$_GET`/`$_POST` em SQL; esquecer checagem de sessão/permissão; imprimir entrada do usuário sem `htmlspecialchars`.
- Trocar caminhos `/home/prosystembrasil/...` fixos no código sem necessidade (a imagem depende deles).
- Editar bibliotecas de terceiros (`tcpdf/`, `stripe-php/`, `.min.js`) ou builds do Flutter Web.
- Corrigir código direto no Coolify ou no container: falha de código volta para a programação.
- Usar `--force` em `main`, pular checks ou fazer commit de `.env`.
- Apagar recurso, volume ou banco, fazer rollback ou rodar SQL destrutivo sem confirmação explícita do usuário.
