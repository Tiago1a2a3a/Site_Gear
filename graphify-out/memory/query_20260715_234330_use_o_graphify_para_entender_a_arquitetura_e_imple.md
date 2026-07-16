---
type: "query"
date: "2026-07-15T23:43:30.141708+00:00"
question: "Use o Graphify para entender a arquitetura e implemente a milestone 9 deste projeto."
contributor: "graphify"
outcome: "useful"
source_nodes: ["M9 - Busca educacional", "BuscaLocal", "prepararBusca", "FilterDrawer"]
---

# Q: Use o Graphify para entender a arquitetura e implemente a milestone 9 deste projeto.

## Answer

Expanded from original query via vocab: [busca, buscas, educacional, filtro, filtros, query, conteudo, aula, aulas, curso, trilha]. A M9 implementa tres indices MiniSearch independentes para Trilhas, Cursos e Aulas, rotas locais segregadas, normalizacao pt-BR, filtros especificos por dominio, estado persistido na query string e drawer movel acessivel. Fontes confirmadas no roadmap, development-plan, regras 19.3 e contratos Velite. Verificacao: format, typecheck, lint, 36 unitarios, build e 28 E2E passaram.

## Outcome

- Signal: useful

## Source Nodes

- M9 - Busca educacional
- BuscaLocal
- prepararBusca
- FilterDrawer