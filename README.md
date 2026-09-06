# Portal GEAR

Portal do Grupo de Estudos Avancados em Robotica da UFMG, criado com foco principal em uma plataforma de aprendizado de robotica. O projeto usa Next.js App Router, React, TypeScript estrito, Tailwind CSS e conteudo educacional em MDX.

## Pre-requisitos

- Node.js 24.18.0 LTS, conforme `.nvmrc`.
- npm 11.x.
- Docker Desktop ou runtime compativel para o Supabase local e testes RLS.

## Instalacao

```bash
npm ci
npm run content:validate
npm run dev
```

O servidor local fica disponivel em `http://localhost:3000`.

## Comandos

| Comando                    | Finalidade                                    |
| -------------------------- | --------------------------------------------- |
| `npm run dev`              | Inicia o ambiente de desenvolvimento.         |
| `npm run build`            | Gera o build de producao.                     |
| `npm run start`            | Executa o build de producao.                  |
| `npm run lint`             | Verifica regras de codigo.                    |
| `npm run format`           | Formata os arquivos suportados.               |
| `npm run format:check`     | Confere a formatacao sem alterar arquivos.    |
| `npm run typecheck`        | Executa a checagem de tipos.                  |
| `npm run content:validate` | Valida schemas, relações e mídias editoriais. |
| `npm test`                 | Executa o smoke test unitario.                |
| `npm run test:e2e`         | Executa o smoke test no navegador.            |
| `npm run velite:proof`     | Valida o schema minimo com Velite.            |
| `npm run supabase:start`   | Inicia Auth e banco locais via Docker.        |
| `npm run supabase:reset`   | Reaplica migrations e seed locais.            |
| `npm run test:db`          | Executa os testes pgTAP de schema e RLS.      |

## Arquitetura

O projeto e um monolito modular Feature-First. `src/app` contem apenas roteamento e composicao; cada dominio fica em `src/features`; codigo generico fica em `src/shared`; e o conteudo editorial fica em `src/content`. Dependencias seguem somente `app -> features -> shared`, e uma feature nunca importa diretamente outra feature.

## Estado atual

O portal já oferece Home, aprendizado com busca por tipo, aulas, cursos, trilhas, projetos, notícias, páginas institucionais, calendário público integrado ao Notion e acompanhamento pessoal via Supabase.

O catálogo inicial contém **8 aulas, 3 cursos, 2 trilhas, 2 propostas de projetos didáticos e 2 guias na seção de notícias**. Os conteúdos seguem os campos do GEAR Content Studio e estão identificados como material elaborado com IA. Os projetos são propostas de estudo; os guias não anunciam eventos ou resultados institucionais. Quando há conteúdo publicado real em uma coleção, o aviso `em-producao` é removido da saída gerada.

A revisão de interface preserva a identidade visual, padroniza movimento e breadcrumbs e apresenta os textos MDX de cursos e trilhas. Veja [a revisão e o catálogo inicial](./docs/revisao-portal-2026-09.md) para escopo, fontes e validação.

## Documentacao do projeto

- [Arquitetura](./PARTE%20A/gear-documentacao-arquitetura%20%282%29.md)
- [Regras permanentes](./PARTE%20A/GEAR%20Website%20%E2%80%94%20Project%20Rules.md)
- [Plano de desenvolvimento](./PARTE%20A/development-plan.md)
- [Como contribuir](./CONTRIBUTING.md)
- [Guia editorial de conteúdo](./docs/content-editorial.md)

O comando `npm run velite:proof:invalid` e uma demonstracao negativa: ele deve terminar com erro porque o fixture nao possui o campo obrigatorio `titulo`.

## Login e Meu aprendizado

A M13 extra usa GitHub via Supabase Auth e duas tabelas protegidas por RLS para
inscricoes e aulas concluidas. Veja [a configuracao do Supabase](./docs/supabase-setup.md)
e o [ADR da integracao](./docs/adr/0001-supabase-auth-learning.md). Credenciais e
service role nunca devem ser versionadas nem expostas ao navegador.
