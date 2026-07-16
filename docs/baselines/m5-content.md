# Baseline do pipeline de conteúdo — M5

Medição local em 15 de julho de 2026, no Windows, com Node.js 24 e cache de dependências já instalado.

| Indicador                                       |   Resultado |
| ----------------------------------------------- | ----------: |
| Execução completa de `npm run content:validate` |      3,11 s |
| Etapa informada pelo Velite                     |      1,08 s |
| Arquivos gerados em `.velite`                   |           7 |
| Tamanho total da saída                          | 8.782 bytes |

A amostra contém uma Trilha publicada, um Curso publicado, três Aulas publicadas, uma Aula em rascunho, um Projeto e uma Notícia. A Aula em rascunho é validada na entrada e removida da saída gerada.

Esta baseline serve para detectar regressões grosseiras; diferenças pequenas entre máquinas e execuções são esperadas.
