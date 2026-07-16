# Como contribuir

Toda contribuicao deve respeitar a arquitetura, as regras do projeto e a ordem definida em `PARTE A/development-plan.md`.

## Branches e commits

- Atualize `main` antes de iniciar o trabalho.
- Crie uma branch curta no formato `<tipo>/<ID>-<descricao-curta>`, como `feat/M6-03-aula-canonica`.
- Use os prefixos `feat`, `fix`, `content`, `docs`, `test`, `refactor`, `chore` ou `ci` conforme a natureza da mudanca.
- Escreva commits no imperativo e no formato Conventional Commits, como `feat(aulas): adiciona pagina canonica`.
- Nao faca push direto, force-push ou exclusao da `main`.

## Pull Requests

- Um PR resolve um item do backlog e possui um objetivo principal.
- Descreva escopo, arquivos afetados, validacao, riscos e estrategia de reversao.
- Inclua evidencias dos comandos executados e capturas quando houver mudanca visual.
- Exija revisao humana independente, checks verdes e conversas resolvidas antes do merge.
- Use squash merge e exclua a branch integrada.

## Verificacoes locais

Antes de abrir um PR, execute:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Conteudo

- Conteudo editorial usa MDX e revisao por Pull Request.
- Nao duplique uma Aula para relaciona-la a um Curso ou Trilha; use referencias por slug.
- Preserve slugs publicados e mantenha rascunhos fora das saidas publicas.
- Midia, autoria, datas e direitos de uso exigem revisao editorial.

## Uso responsavel de IA

- Forneca a IA apenas o item do backlog, os arquivos permitidos e os criterios de aceite.
- Nao compartilhe segredos, credenciais ou dados pessoais nao publicos.
- Declare no PR o que foi delegado ou gerado por IA.
- Revise o diff, execute todas as verificacoes e valide arquitetura, seguranca, acessibilidade e licencas.
- IA nao aprova mudanca arquitetural e nao substitui revisao humana.
