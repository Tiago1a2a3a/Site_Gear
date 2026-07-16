# Notícias

Propósito: publicar notícias editoriais em MDX e ordená-las por data.

Limites: não mistura busca ou conteúdo com Aprendizado, não oferece filtros educacionais e não importa outras features.

Entradas e saídas: recebe Notícias tipadas da coleção Velite e expõe listagem, detalhe canônico e índice próprio de busca.

## Fluxo editorial

1. Crie `src/content/noticias/<slug>.mdx` em kebab-case.
2. Preencha título, capa, resumo, data no formato `YYYY-MM-DD`, autor e status; categoria e tags são opcionais.
3. Mantenha `status: rascunho` até a revisão editorial de autoria, data, direitos da imagem e clareza do texto.
4. Execute `npm run content:validate`, `npm test` e `npm run build` antes da Pull Request.
5. Depois de aprovado, altere o status para `publicado`; a listagem e o índice serão atualizados no build.

Manutenção: responsabilidade atual de @Tiago1a2a3a; revise a Parte A antes de alterar.
