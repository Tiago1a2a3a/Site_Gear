# Configuração do Supabase

## Projetos e ambientes

Use um projeto Supabase exclusivo para produção. Para desenvolvimento e preview,
use o stack local ou um segundo projeto sem dados reais. No Dashboard Supabase:

1. crie o projeto e aguarde o banco ficar disponível;
2. no diálogo **Connect** e em **Project Settings > API Keys**, copie a URL, a
   chave publicável e a chave legada `service_role` usada pelo Route Handler
   atual;
3. vincule o CLI ao projeto e aplique as migrations antes de habilitar o login:

   ```powershell
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npx supabase db push --linked
   ```

4. nunca copie a `service_role`, o Client Secret GitHub ou senhas para arquivos
   versionados, logs, Issues ou mensagens.

| Ambiente        | `SITE_URL`                                    | Supabase                             | Redirect permitido no Supabase            |
| --------------- | --------------------------------------------- | ------------------------------------ | ----------------------------------------- |
| desenvolvimento | `http://localhost:3000`                       | stack local ou projeto não produtivo | `http://localhost:3000/auth/callback`     |
| preview Vercel  | domínio estável da branch ou domínio canônico | projeto não produtivo                | `https://*-<conta-ou-time>.vercel.app/**` |
| produção        | domínio canônico HTTPS                        | projeto exclusivo de produção        | `https://<dominio>/auth/callback`         |

No Vercel, cadastre as variáveis em **Project > Settings > Environment
Variables**, escolhendo separadamente Development, Preview e Production. Uma
alteração só entra em deployments novos; faça redeploy depois de salvar.

```dotenv
SITE_URL=https://<dominio-do-ambiente>
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=<service-role-legada-somente-no-servidor>
```

O código monta o retorno OAuth a partir da origem aberta no navegador. Portanto,
cada domínio de preview realmente usado deve corresponder à allow list do
Supabase. Em produção, prefira sempre a URL exata, sem wildcard.

## Ambiente local de banco

1. Instale e inicie Docker Desktop ou runtime compativel.
2. Execute `npm run supabase:start`.
3. Copie `.env.example` para `.env`, preencha as credenciais GitHub e mude
   `[auth.external.github].enabled` para `true`. O Next.js e o Supabase CLI
   carregarão esse arquivo local ignorado pelo Git.
4. Use `npm run supabase:reset` para reaplicar migrations e seed.
5. Execute `npm run test:db` para a matriz RLS.

O ambiente local nao cria dados pessoais no seed. Os testes usam transacao e
rollback. O arquivo `supabase/config.toml` e versionado e nao contem segredos.

## GitHub OAuth

1. No GitHub, abra **Settings > Developer settings > OAuth Apps > New OAuth
   App** sob a conta temporária aprovada.
2. Preencha `Application name` com `Portal GEAR`, `Homepage URL` com o domínio
   público e desative Device Flow.
3. Em `Authorization callback URL`, use o callback do **Auth Supabase**, não a
   rota do Portal:
   `https://<project-ref>.supabase.co/auth/v1/callback`. Para o stack local, use
   `http://localhost:54321/auth/v1/callback`.
4. Habilite GitHub em **Authentication > Sign In / Providers** no Supabase e
   guarde Client ID
   e Client Secret apenas no provedor/ambiente seguro.
5. Em **Authentication > URL Configuration**, defina `Site URL` como o domínio
   de produção e cadastre os redirects da tabela acima.

Um OAuth App GitHub aceita apenas uma callback principal. Para usar o Supabase
local e o hospedado ao mesmo tempo, crie OAuth Apps GitHub separados, por exemplo
`Portal GEAR (local)` e `Portal GEAR (produção)`.

Para OAuth local pelo CLI, habilite `[auth.external.github]` em
`supabase/config.toml` somente no ambiente de desenvolvimento e defina
`SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID` e
`SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET` no `.env` da raiz, fora do Git. Depois de
alterar a configuração, execute `npm run supabase:stop` e
`npm run supabase:start` novamente.

## Validação antes de produção

- login, cancelamento, callback e logout nos tres ambientes;
- `supabase db reset` e `supabase test db` verdes;
- nenhuma service role em bundle, logs ou Git;
- privacidade e termos aprovados por Tiago Lopes em 16 de julho de 2026;
- retenção de backups conferida em **Database > Backups** e registrada abaixo;
- exclusao de conta testada com usuario de teste sem dado real.

### Registro obrigatório de backups

Preencher somente depois de criar o projeto que será usado em produção:

- projeto/ref: `PENDENTE`;
- plano contratado: `PENDENTE`;
- retenção exibida em **Database > Backups**: `PENDENTE`;
- exportação externa/recuperação adotada: `PENDENTE`;
- data e responsável pela verificação: `PENDENTE`.

Referência operacional atual: projetos Pro possuem 7 dias de backups diários,
Team 14 dias e Enterprise até 30 dias. Projetos Free devem manter exportações
externas periódicas. Confirme sempre no Dashboard do projeto, pois plano e
política podem mudar.
