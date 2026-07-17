# ADR 0001 - Supabase para login e Meu aprendizado

- Status: aceito pelo adendo M13
- Data: 16 de julho de 2026
- Proprietario temporario: Tiago Lopes

## Contexto

Inscricoes, conclusoes e progresso individual exigem identidade e persistencia.
O conteudo editorial continua em MDX/Velite; o banco nao deve virar CMS nem
replicar titulos, descricoes ou relacoes.

## Decisao

Usar Supabase Auth com GitHub, `@supabase/ssr` para cookies no App Router,
`@supabase/supabase-js` para Auth/Data e Supabase Database com duas tabelas RLS.
OAuth usa cliente browser, cliente server, proxy de renovacao e um Route Handler
de callback PKCE. A exclusao de conta e a unica operacao privilegiada e fica em
Route Handler server-only.

## Avaliacao das dependencias

| Criterio             | Evidencia e decisao                                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Necessidade          | Auth, cookies SSR, RLS e migrations evitam implementar OAuth, sessao e isolamento proprios.                                                     |
| Licenca              | `@supabase/ssr`, `@supabase/supabase-js` e Supabase CLI usam MIT.                                                                               |
| Versao               | Versoes exatas ficam no `package-lock.json`; o CLI tambem e fixado no workflow de banco.                                                        |
| Manutencao e impacto | Projetos oficiais Supabase. As ilhas cliente ficam restritas a Auth e acoes pessoais; conteudo publico permanece Server-first.                  |
| Saida                | Tabelas usam UUID e slugs simples; o dominio e os calculos nao dependem de tipos proprietarios. O rollback esta em `docs/supabase-rollback.md`. |

## Consequencias e limites

- exige projeto Supabase, OAuth App GitHub e callbacks por ambiente;
- indisponibilidade do Supabase nao bloqueia leitura do conteudo publico;
- service role nunca entra em variavel `NEXT_PUBLIC_*` nem no bundle;
- nao ha perfil social, senha propria, comentarios, favoritos ou analytics;
- a retencao de backups e os textos legais exigem aceite antes de producao.
