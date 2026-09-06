# Revisão do portal e catálogo inicial — setembro de 2026

## Escopo

Esta revisão preserva o layout e a identidade do GEAR. Centraliza a reprodução dos cinco carrosséis em `useCarouselPlayback`, com intervalo de cinco segundos, pausa por foco, mouse, aba oculta e controle explícito. A preferência por movimento reduzido desativa a reprodução automática. O destaque principal mantém sua transição em duas fases e corrige a direção do swipe.

Os breadcrumbs compartilham separador, espaçamento e quebra de títulos longos. Aulas e cursos passam a ter uma navegação básica renderizada mesmo antes do JavaScript. Conteúdo revelado por rolagem permanece visível no HTML e na impressão; a animação só é aplicada a blocos fora da tela quando há suporte no navegador.

Cursos e trilhas passam a exibir seus corpos MDX. Blocos de código podem receber foco e rolar pelo teclado. Tabelas e código longo não alargam a página. Metadados e sitemap usam o endereço público do portal como padrão. Datas editoriais inexistentes, como 30 de fevereiro, são rejeitadas.

## Origem e formato

Foram consultados `src/shared/ai-content-prompt.ts`, `src/shared/schema.ts` e `docs/CASOS-DE-TESTE-GPT.md` do projeto irmão `gear-content-studio`. O frontmatter foi adaptado às cinco coleções atuais do site, sem adicionar campos não reconhecidos. As relações entre aulas, cursos e trilhas são verificadas pelo Velite e pela validação editorial existente.

O acervo encontrado no repositório local do Studio incluía textos de preenchimento e anúncios sem confirmação. O novo material é original e identificado como elaborado com IA. Projetos são propostas didáticas; notícias são guias de uso do portal. Não foram atribuídos ao grupo novos eventos, protótipos físicos ou resultados de pesquisa.

## Catálogo

| Tipo               | Itens                                                                                                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aulas              | Introdução à robótica; Sensores e atuadores; Controle em malha fechada; Primeiros passos com Python; Classes em Python para simular um robô; Testando a lógica de um robô; Como registrar um experimento; Planejando um projeto de robótica |
| Cursos             | Fundamentos de robótica; Python para robótica; Documentação de protótipos                                                                                                                                                                   |
| Trilhas            | Robótica do zero; Da ideia ao protótipo                                                                                                                                                                                                     |
| Projetos didáticos | Carrinho virtual; Estação de medições                                                                                                                                                                                                       |
| Guias em Notícias  | Conheça os percursos de aprendizado do portal; Como acompanhar o calendário público                                                                                                                                                         |

As quatro capas SVG são diagramas locais criados para o material. As aulas de Python referenciam documentação oficial de [controle de fluxo](https://docs.python.org/3/tutorial/controlflow.html), [classes](https://docs.python.org/3/tutorial/classes.html) e [unittest](https://docs.python.org/3/library/unittest.html). Os exemplos são originais e executáveis sem hardware.

## Verificação

Resultado local desta revisão: validação editorial estrita, lint, formatação dos arquivos alterados e build de produção aprovados; **91 testes unitários e 46 testes de navegador passaram**. A interface foi conferida também no Chrome em desktop e celular. As alterações ainda não foram publicadas na Vercel.

Use `npm run content:validate`, `npm run lint`, `npm test` e `npm run build`. Instale o navegador de testes com `npx playwright install chromium` antes de `npm run test:e2e`. Em máquinas com poucos recursos, `npm test -- --maxWorkers=1 --pool=threads` evita excesso de workers. Não execute a limpeza do Velite simultaneamente com o servidor Next.js.

Os testes de catálogo foram atualizados para verificar o material publicado, sua ordem e os índices segregados. Fixtures específicos continuam cobrindo rascunhos e avisos. Há regressões para pausa dos carrosséis, datas inválidas, breadcrumb contextual, conteúdo sem JavaScript e rolagem de código no celular. Os testes de calendário deixam de depender de um evento específico e da quantidade de eventos futuros em uma data fixa; os casos determinísticos de eventos confirmados e provisórios continuam nos testes unitários.

O ambiente Windows desta revisão tinha um npm global incompleto e falhas do Turbopack durante acesso lento ao disco. A validação local usou os executáveis Node de cada ferramenta e `next build --webpack`. Isso não altera os comandos padrão do projeto. Exemplos de Python foram executados e comparados com as saídas publicadas, incluindo os quatro casos de `unittest`.

Esta revisão não altera credenciais, schema do Supabase ou configuração da integração Notion.
