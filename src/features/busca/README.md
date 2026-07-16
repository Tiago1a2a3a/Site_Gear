# Busca

Propósito: fornecer buscas locais segregadas para Trilhas, Cursos e Aulas. Não
existe busca global e documentos de classificações diferentes nunca compartilham
o mesmo índice.

## Contrato e indexação

`data/indices.ts` converte as coleções publicadas do Velite em três conjuntos de
`DocumentoBusca` e cria um MiniSearch independente para cada rota. Título,
descrição/resumo, conteúdo MDX compilado e tags são pesquisáveis. Apenas os campos
aplicáveis a cada domínio são armazenados e filtrados:

- Trilhas: área;
- Cursos: dificuldade, categoria e tags;
- Aulas: dificuldade, categoria e tags.

Para adicionar um campo, primeiro atualize `DocumentoBusca` e o mapeamento da
classificação; só então inclua o campo em `camposIndexados` ou
`camposArmazenados`. Preserve a normalização pt-BR e cubra a mudança nos testes de
segregação, indexação e filtros.

## Limites para reavaliar a busca client-side

Meça `JSON.stringify(indice).length` e o tempo de uma consulta após mudanças
relevantes no conteúdo. Reavalie a estratégia se qualquer índice ultrapassar
250 KB, se a consulta automatizada ultrapassar 100 ms ou se a transferência e a
interação em rede/dispositivo modestos apresentarem regressão perceptível.

Manutenção: responsabilidade atual de @Tiago1a2a3a; revise a Parte A antes de
alterar.
