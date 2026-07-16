---
type: "query"
date: "2026-07-15T23:04:50.673729+00:00"
question: "Implementar milestones 7 e 8 consultando o grafo primeiro"
contributor: "graphify"
outcome: "useful"
source_nodes: ["CursoDetalhe()", "TrilhaDetalhe()", "CursoAulas()", "TrilhaPercurso()", "AulaBreadcrumbs()"]
---

# Q: Implementar milestones 7 e 8 consultando o grafo primeiro

## Answer

Expanded from original query via vocab: [aula, aulas, curso, cursos, trilha, trilhas, content, page, routes, test, responsive, velite]. O grafo orientou a separacao feature-first: rotas SSG compoem CursoDetalhe e TrilhaDetalhe; dados tipados resolvem referencias Velite; Card e Breadcrumbs permanecem compartilhados; contexto de Trilha e Curso via query preserva URLs canonicas. Implementacao validada com content:validate, typecheck, 31 testes unitarios, lint, build SSG de 49 paginas e 22 testes Playwright.

## Outcome

- Signal: useful

## Source Nodes

- CursoDetalhe()
- TrilhaDetalhe()
- CursoAulas()
- TrilhaPercurso()
- AulaBreadcrumbs()