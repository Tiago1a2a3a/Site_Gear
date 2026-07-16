# Camada compartilhada

`shared` reúne contratos e componentes genéricos que podem ser consumidos por qualquer feature. Ela não conhece regras específicas de Aula, Curso, Trilha, Projeto ou Notícia.

## Tokens visuais

As cores, famílias tipográficas, espaçamentos, raios, bordas e durações oficiais vivem em `src/styles/globals.css`. Componentes devem usar esses tokens sem repetir valores hexadecimais de marca. O light mode é o único tema da v1.

## Primitivos disponíveis

- `Button`: ação ou link interno nas variantes `primary` e `secondary`. Uma nova variante só deve existir quando representar uma intenção recorrente, não uma necessidade isolada de uma página.
- `Card`: superfície genérica com borda e elevação leve; aceita outro elemento semântico por `as`.
- `Badge`: rótulo curto para categoria ou contexto, nunca como único indicador de estado.
- `Container`: limita a largura e mantém as margens responsivas do layout.
- foco padrão: todo elemento interativo recebe um contorno visível por `:focus-visible`.

Primitivos permanecem pequenos e sem vocabulário do GEAR. Componentes que conhecem um domínio devem ser criados dentro da feature correspondente e compostos a partir desta base.
