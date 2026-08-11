# Guia editorial de conteúdo

O conteúdo do portal fica em `src/content` e é validado pelo Velite antes de cada build. Um arquivo inválido, uma relação quebrada ou uma mídia local inexistente interrompe o processo com o caminho de origem.

## Fluxo de publicação

1. Crie um arquivo na pasta da entidade desejada e mantenha a extensão `.mdx`.
2. Use um `slug` único por coleção, em minúsculas e separado por hífens.
3. Preencha o frontmatter, escreva o corpo em MDX e mantenha `status: rascunho` durante a revisão.
4. Execute `npm run content:validate` e `npm test`.
5. Abra a revisão editorial. Troque para `status: publicado` somente após aprovação.

Rascunhos de Trilhas, Cursos, Aulas e Notícias não entram na saída pública. Projetos usam o estado próprio `em andamento` ou `concluído` e sempre integram a coleção.

## Entidades e relações

- **Trilha** (`aprendizado/trilhas`): exige capa, área, ordem e `itens`. Cada item é somente `{ tipo: curso | aula, slug }`; a ordem declarada é a ordem de leitura.
- **Curso** (`aprendizado/cursos`): exige capa, dificuldade e `aulaSlugs`. Um curso publicado tem ao menos uma Aula publicada, na ordem declarada.
- **Aula** (`aprendizado/aulas`): exige resumo, dificuldade, data, autores e estado. `preRequisitos` referencia outras Aulas e não pode formar ciclos.
- **Projeto** (`projetos`): descreve mídia, tecnologias, repositório e documentação opcionais, além do estado do projeto.
- **Notícia** (`noticias`): exige capa, resumo, data, autor e estado de publicação.

Pré-requisitos de Curso podem apontar para Cursos ou Aulas publicados. Trilhas podem apontar diretamente para Cursos e Aulas; não existe módulo, capítulo ou uma quarta camada.

## Campos e formatos

Datas usam `YYYY-MM-DD`. URLs externas usam `https://`. Imagens e downloads locais começam com `/` e precisam existir em `public/`.

Enquanto uma coleção não tem conteúdo real publicado, ela mantém um aviso `em-producao.mdx`. O slug `em-producao` é reservado para esse aviso. Assim que qualquer outro MDX publicado entra na mesma coleção, o aviso é removido automaticamente da saída pública pelo `prepareContent`; não é necessário apagá-lo nem alterar as páginas.

Use os avisos versionados como referência dos campos de cada entidade:

- `src/content/aprendizado/trilhas/em-producao.mdx`
- `src/content/aprendizado/cursos/em-producao.mdx`
- `src/content/aprendizado/aulas/em-producao.mdx`
- `src/content/projetos/em-producao.mdx`
- `src/content/noticias/em-producao.mdx`

O aviso de Curso pode ter `aulaSlugs: []` e o aviso de Trilha pode ter `itens: []`. Essa exceção vale somente para o slug reservado; qualquer Curso publicado real continua exigindo uma Aula publicada e qualquer Trilha real continua exigindo ao menos um item.

O corpo MDX aceita texto, títulos, listas, links, imagens, blocos de código e os recursos de vídeo/download declarados no frontmatter. Não importe componentes React arbitrários no conteúdo sem uma decisão arquitetural específica.

## Diagnóstico

- **slug duplicado**: altere o slug e todas as referências que apontam para ele.
- **inexistente ou não publicado**: corrija a referência ou publique primeiro o destino aprovado.
- **ciclo de pré-requisitos**: remova uma das dependências indicadas na sequência do erro.
- **arquivo inexistente**: adicione o recurso sob `public/` ou corrija o caminho absoluto.
- **erro de schema**: confira nome, obrigatoriedade, enum e formato do campo no exemplo da entidade.

O comando `npm run build` executa a validação automaticamente; não há publicação parcial quando o conteúdo falha.
