# Graph Report - GEAR_SITE  (2026-07-16)

## Corpus Check
- 226 files · ~84,650 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1066 nodes · 1592 edges · 135 communities (91 shown, 44 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e43688d2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TemporaryPage.tsx
- devDependencies
- scripts
- layout.tsx
- compilerOptions
- paths
- include
- dependencies
- schema.ts
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- postcss.config.mjs
- .prettierrc.json
- site-map.spec.ts
- types.ts
- types.ts
- types.ts
- types.ts
- types.ts
- 4. Backlog completo
- 14. Roadmap do Projeto
- Regras do agente — Portal GEAR
- 2.4 Decisões adotadas e recomendações técnicas
- 7. Organização dos Dados
- pull_request_template.md
- Plano de Desenvolvimento — Portal GEAR
- 11. Estratégia de testes
- 7. Convenções de código
- 11. Design System
- 13. Checklist Técnico
- 10. Estratégia de Pull Requests
- 6. Checklists técnicos por etapa de trabalho
- Documentação de Arquitetura — Portal GEAR
- 10. Wireframes ASCII
- 1. Visão Geral
- 4. Fluxos dos Usuários
- Q: Atualizar a Home com a logo principal, mascote, apoiadores e redes sociais do GEAR antes da M6
- Q: Use o Graphify para entender a arquitetura e implemente a milestone 6 deste projeto. Consulte o grafo primeiro, faça as alterações necessárias e rode os testes.
- 12. Estratégia de documentação
- 13. Estratégia para entrada de novos desenvolvedores
- 1. Estratégia geral de desenvolvimento
- 8. Organização das Trilhas/Cursos/Aulas
- 9. Organização dos Componentes
- 0. Como usar este plano
- 16. Cadência e governança
- 5. Dependências entre módulos
- 9. Organização das branches
- 12. Estratégia de Escalabilidade
- 5. Papéis e permissões
- Camada compartilhada
- Patrocinadores
- m5-content.md
- comunicacao-serial.mdx
- controle-motores-dc.mdx
- controle-pid.mdx
- documentacao-projetos.mdx
- fundamentos-eletronica.mdx
- impressao-3d-pecas.mdx
- integracao-sensores.mdx
- introducao-arduino.mdx
- introducao-robotica.mdx
- modelagem-3d-robotica.mdx
- planejamento-trajetoria.mdx
- programacao-c-microcontroladores.mdx
- prototipagem-breadboard.mdx
- pwm-na-pratica.mdx
- python-para-robotica.mdx
- ros-primeiros-passos.mdx
- seguranca-laboratorio.mdx
- sensores-digitais-analogicos.mdx
- servo-motores.mdx
- testes-sistemas-roboticos.mdx
- visao-computacional-basica.mdx
- README.md
- README.md
- README.md
- README.md
- README.md
- README.md
- README.md
- Q: Implementar milestones 7 e 8 consultando o grafo primeiro
- Q: Use o Graphify para entender a arquitetura e implemente a milestone 9 deste projeto.
- Q: Use o Graphify para entender a arquitetura e implemente a milestone 10 deste projeto.
- README.md
- Milestone — Login, Meu aprendizado e progresso
- ADENDO MILESTONE_LOGIN
- Critérios de aceite preliminares
- Dashboard
- Autenticação
- Página `/meu-aprendizado`
- 12. Estratégia de Escalabilidade
- Regras de progresso
- Modelo conceitual de dados
- Inscrição em Cursos e Trilhas
- Integração e segurança do Supabase
- page.tsx
- sitemap.ts
- supabase-rollback.md
- Compatibilidade com a arquitetura do Portal
- README.md
- README.md
- 20260716000100_create_personal_learning.sql
- Q: Use o Graphify para entender a arquitetura e implemente ADENDO MILESTONE_LOGIN deste projeto. Consulte o grafo primeiro, faça as alterações necessárias e rode os testes.
- 0. Como usar este plano

## God Nodes (most connected - your core abstractions)
1. `Milestone extra — Login, inscrições e Meu aprendizado` - 24 edges
2. `Plano de Desenvolvimento — Portal GEAR` - 20 edges
3. `4. Backlog completo` - 19 edges
4. `ADENDO MILESTONE_LOGIN` - 19 edges
5. `scripts` - 18 edges
6. `Badge()` - 18 edges
7. `14. Roadmap do Projeto` - 17 edges
8. `compilerOptions` - 16 edges
9. `Documentação de Arquitetura — Portal GEAR` - 16 edges
10. `Card()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AulaPreRequisitos()` --indirect_call--> `slug()`  [INFERRED]
  src/features/aulas/components/AulaPreRequisitos.tsx → content.schemas.ts
- `resolverAulasDoCurso()` --indirect_call--> `slug()`  [INFERRED]
  src/features/cursos/data/cursos.ts → content.schemas.ts
- `getLearningCatalog()` --indirect_call--> `slug()`  [INFERRED]
  src/features/meu-aprendizado/data/catalogo.ts → content.schemas.ts
- `calculateCourseProgress()` --indirect_call--> `slug()`  [INFERRED]
  src/features/meu-aprendizado/services/progresso.ts → content.schemas.ts
- `calculateTrailProgress()` --indirect_call--> `course()`  [INFERRED]
  src/features/meu-aprendizado/services/progresso.ts → tests/unit/content-validation.test.ts

## Import Cycles
- None detected.

## Communities (135 total, 44 thin omitted)

### Community 1 - "devDependencies"
Cohesion: 0.05
Nodes (37): eslint, eslint-config-next, eslint-config-prettier, jsdom, devDependencies, eslint, eslint-config-next, eslint-config-prettier (+29 more)

### Community 2 - "scripts"
Cohesion: 0.05
Nodes (36): next, dependencies, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, engines (+28 more)

### Community 3 - "layout.tsx"
Cohesion: 0.11
Nodes (17): bodyFont, displayFont, metadata, utilityFont, metadata, SponsorGrid(), SponsorStrip(), SponsorStripProps (+9 more)

### Community 4 - "compilerOptions"
Cohesion: 0.05
Nodes (38): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+30 more)

### Community 5 - "paths"
Cohesion: 0.06
Nodes (41): ContentCollections, Course, courseFrontmatterSchema, courses, courseSchema, difficulty, download, Lesson (+33 more)

### Community 6 - "include"
Cohesion: 0.06
Nodes (28): **10\. Controle de Acesso**, **11\. Desenvolvimento**, **12\. Escalabilidade**, **13\. Dependências**, **14\. Convenções**, **15\. Documentação**, **16\. Alterações na Arquitetura**, **17\. Diretrizes para IA** (+20 more)

### Community 7 - "dependencies"
Cohesion: 0.05
Nodes (31): Branches e commits, Como contribuir, Conteudo, Pull Requests, Uso responsavel de IA, Verificacoes locais, ADR 0001 - Supabase para login e Meu aprendizado, Avaliacao das dependencias (+23 more)

### Community 17 - "types.ts"
Cohesion: 0.13
Nodes (23): AulaPage(), AulaPageProps, generateMetadata(), generateStaticParams(), AulasPage(), AulasPageProps, AulaBanner(), AulaBreadcrumbs() (+15 more)

### Community 18 - "types.ts"
Cohesion: 0.15
Nodes (21): CursoPage(), CursoPageProps, generateMetadata(), generateStaticParams(), CursosPage(), CursoAulaLink(), CursoAulas(), CursoBreadcrumbs() (+13 more)

### Community 19 - "types.ts"
Cohesion: 0.11
Nodes (28): generateMetadata(), generateStaticParams(), NoticiaPage(), NoticiaPageProps, metadata, NoticiasPage(), AulaMetadados(), SearchBar() (+20 more)

### Community 20 - "types.ts"
Cohesion: 0.11
Nodes (32): minisearch, minisearch, BuscaDeAulasPage(), BuscaDeConteudosPage(), BuscaDeCursosPage(), BuscaDeTrilhasPage(), BuscaLocal(), BuscaLocalProps (+24 more)

### Community 21 - "types.ts"
Cohesion: 0.06
Nodes (41): AprendizadoPage(), areas, TrilhasPage(), generateMetadata(), generateStaticParams(), TrilhaPage(), TrilhaPageProps, metadata (+33 more)

### Community 24 - "4. Backlog completo"
Cohesion: 0.11
Nodes (19): 4. Backlog completo, Backlog futuro — fora do MVP, M0 — Planejamento executável, M10 — Projetos, M11 — Institucional completo e patrocinadores, M12 — Notícias, M13 — Qualidade e publicação, M14 — Conteúdo real e lançamento (+11 more)

### Community 25 - "14. Roadmap do Projeto"
Cohesion: 0.12
Nodes (17): 14. Roadmap do Projeto, Backlog futuro (fora do escopo desta versão, mas compatível com a arquitetura), Milestone 0 — Planejamento executável, Milestone 10 — Projetos, Milestone 11 — Institucional completo e patrocinadores, Milestone 12 — Notícias, Milestone 13 — Qualidade e publicação, Milestone 14 — Conteúdo real e lançamento (+9 more)

### Community 26 - "Regras do agente — Portal GEAR"
Cohesion: 0.14
Nodes (13): 10. Objetivo, 1. Hierarquia das fontes de verdade, 2. Roteamento obrigatório pelo Graphify, 3. Leitura proporcional das fontes oficiais, 4. Gates e limites de implementação, 5. Segurança de conteúdo e dados, 6. Qualidade antes de declarar concluído, 7. Processo de trabalho curto (+5 more)

### Community 27 - "2.4 Decisões adotadas e recomendações técnicas"
Cohesion: 0.17
Nodes (12): 2.1 Estilo arquitetural, 2.2 Estratégia de renderização, 2.3 Pipeline de conteúdo (MDX), 2.4.1 Processamento de MDX / geração de coleções de conteúdo, 2.4.2 Autenticação, 2.4.3 Banco de dados, 2.4.4 Hospedagem, 2.4.5 Armazenamento de mídia (imagens, vídeos, PDFs de aulas/projetos) (+4 more)

### Community 28 - "7. Organização dos Dados"
Cohesion: 0.22
Nodes (9): 7.1 Trilha, 7.2 Curso, 7.3 Aula / Post, 7.4 Projeto, 7.5 Notícia, 7.6 Dados externos do Giscus, 7.7 Patrocinador _(editado no código, sem UI)_, 7.8 Relações entre entidades (+1 more)

### Community 29 - "pull_request_template.md"
Cohesion: 0.25
Nodes (7): Checklist, Como validar, Escopo, Impactos e riscos, Item do backlog, O que mudou, Uso de IA

### Community 30 - "Plano de Desenvolvimento — Portal GEAR"
Cohesion: 0.29
Nodes (7): 14. Riscos técnicos do projeto, 15. Boas práticas durante o desenvolvimento, 2. Ordem correta de implementação, 3. Divisão em Milestones, 8. Convenções de nomenclatura, Plano de Desenvolvimento — Portal GEAR, Referências operacionais externas

### Community 31 - "11. Estratégia de testes"
Cohesion: 0.25
Nodes (8): 11.1 Princípio, 11.2 Camadas, 11.3 Pirâmide e critérios por mudança, 11.4 Jornadas E2E mínimas do MVP, 11.5 Dados de teste, 11.6 Cobertura e qualidade da suíte, 11.7 Matriz de execução, 11. Estratégia de testes

### Community 32 - "7. Convenções de código"
Cohesion: 0.29
Nodes (7): 7.1 TypeScript e contratos, 7.2 Componentes React e Next.js, 7.3 Funções, arquivos e imports, 7.4 Erros e observabilidade, 7.5 Estilo e acessibilidade, 7.6 Comentários no código, 7. Convenções de código

### Community 33 - "11. Design System"
Cohesion: 0.29
Nodes (7): 11.1 Direção de design, 11.2 Cor, 11.3 Tipografia, 11.4 Forma, espaçamento e elevação, 11.5 Movimento, 11.6 Acessibilidade (não-negociável, mesmo não mencionada explicitamente no briefing), 11. Design System

### Community 34 - "13. Checklist Técnico"
Cohesion: 0.29
Nodes (7): 13. Checklist Técnico, Acessibilidade, Conteúdo, Performance, Qualidade / DX, Segurança / Dados, SEO (baixa prioridade, mas presente)

### Community 35 - "10. Estratégia de Pull Requests"
Cohesion: 0.33
Nodes (6): 10.1 Escopo e tamanho, 10.2 Descrição obrigatória, 10.3 Revisão, 10.4 Merge e rastreabilidade, 10.5 Trabalho com IA, 10. Estratégia de Pull Requests

### Community 36 - "6. Checklists técnicos por etapa de trabalho"
Cohesion: 0.33
Nodes (6): 6.1 Antes de implementar, 6.2 Durante a implementação, 6.3 Antes de abrir PR, 6.4 Antes do merge, 6.5 Depois do merge, 6. Checklists técnicos por etapa de trabalho

### Community 37 - "Documentação de Arquitetura — Portal GEAR"
Cohesion: 0.20
Nodes (10): 3. Sitemap, 6.1 Convenções de código (regra permanente do projeto), 6. Estrutura de Pastas, 9.1 Camadas de componentes, 9.2 Principais componentes do Design System (`shared/ui`), 9.3 Principais componentes de feature, 9.4 Composição Server/Client, 9. Organização dos Componentes (+2 more)

### Community 38 - "10. Wireframes ASCII"
Cohesion: 0.33
Nodes (6): 10.1 Home, 10.2 Listagem de Trilhas / Cursos (mesmo padrão visual), 10.3 Página da Aula/Post, 10.4 Página de Projeto, 10.5 Busca com filtros, 10. Wireframes ASCII

### Community 39 - "1. Visão Geral"
Cohesion: 0.33
Nodes (6): 1.1 O que é o projeto, 1.2 Ordem de prioridade do produto, 1.3 Público-alvo, 1.4 Filosofia norteadora, 1.5 Fora de escopo nesta versão, 1. Visão Geral

### Community 40 - "4. Fluxos dos Usuários"
Cohesion: 0.33
Nodes (6): 4.1 Jornada do Visitante na plataforma de aprendizado, 4.2 Fluxo de busca e filtro, 4.3 Autenticação para comentários no Giscus, 4.4 Fluxo de publicação de conteúdo (Editor), 4.5 Fluxo de comentários via Giscus _(fase futura)_, 4. Fluxos dos Usuários

### Community 41 - "Q: Atualizar a Home com a logo principal, mascote, apoiadores e redes sociais do GEAR antes da M6"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Atualizar a Home com a logo principal, mascote, apoiadores e redes sociais do GEAR antes da M6, Source Nodes

### Community 42 - "Q: Use o Graphify para entender a arquitetura e implemente a milestone 6 deste projeto. Consulte o grafo primeiro, faça as alterações necessárias e rode os testes."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Use o Graphify para entender a arquitetura e implemente a milestone 6 deste projeto. Consulte o grafo primeiro, faça as alterações necessárias e rode os testes., Source Nodes

### Community 43 - "12. Estratégia de documentação"
Cohesion: 0.40
Nodes (5): 12.1 Mapa documental, 12.2 ADR mínimo, 12.3 Documentação editorial, 12.4 Política de atualização, 12. Estratégia de documentação

### Community 44 - "13. Estratégia para entrada de novos desenvolvedores"
Cohesion: 0.40
Nodes (5): 13.1 Objetivo mensurável, 13.2 Trilha de onboarding, 13.3 Buddy e progressão, 13.4 Entrada de agentes de IA, 13. Estratégia para entrada de novos desenvolvedores

### Community 45 - "1. Estratégia geral de desenvolvimento"
Cohesion: 0.40
Nodes (5): 1.1 Princípios de execução, 1.2 Ciclo padrão de uma issue, 1.3 Definition of Ready global, 1.4 Definition of Done global, 1. Estratégia geral de desenvolvimento

### Community 46 - "8. Organização das Trilhas/Cursos/Aulas"
Cohesion: 0.40
Nodes (5): 8.1 Convenção de nomenclatura e ordenação, 8.2 Exemplos de combinações permitidas, 8.3 Como as páginas são geradas, 8.4 Rascunho vs. Publicado, 8. Organização das Trilhas/Cursos/Aulas

### Community 47 - "9. Organização dos Componentes"
Cohesion: 0.07
Nodes (52): config, proxy(), DELETE(), GET(), LoginPage(), LoginPageProps, metadata, metadata (+44 more)

### Community 48 - "0. Como usar este plano"
Cohesion: 0.10
Nodes (26): Home(), ProjetosPage(), generateMetadata(), generateStaticParams(), ProjetoPage(), ProjetoPageProps, AulaConteudoMDX(), ProjetoCard() (+18 more)

### Community 49 - "16. Cadência e governança"
Cohesion: 0.50
Nodes (4): 16.1 Ritos mínimos, 16.2 Papéis operacionais, 16.3 Critério final de sucesso, 16. Cadência e governança

### Community 50 - "5. Dependências entre módulos"
Cohesion: 0.50
Nodes (4): 5.1 Regra de direção, 5.2 Matriz funcional, 5.3 Dependências externas autorizadas, 5. Dependências entre módulos

### Community 51 - "9. Organização das branches"
Cohesion: 0.50
Nodes (4): 9.1 Modelo, 9.2 Prefixos, 9.3 Proteções, 9. Organização das branches

### Community 52 - "12. Estratégia de Escalabilidade"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Use o Graphify para entender a arquitetura e implemente a milestone 11 e 12 deste projeto. Reveja o codigo para analisar reutilizacao entre as partes 11, 12 e aprendizado., Source Nodes

### Community 53 - "5. Papéis e permissões"
Cohesion: 0.50
Nodes (4): 5.1 Papéis, 5.2 Matriz de permissões, 5.3 Como uma pessoa se torna Editor, 5. Papéis e permissões

### Community 54 - "Camada compartilhada"
Cohesion: 0.50
Nodes (3): Camada compartilhada, Primitivos disponíveis, Tokens visuais

### Community 56 - "m5-content.md"
Cohesion: 0.08
Nodes (25): 10.1 Direção visual aprovada, 10.2 Home / landing page, 10.3 Patrocinadores e rodapé, 10.4 Header e acessos provisórios, 10.5 Página principal de Aprendizado, 10.6 Busca unificada e breadcrumbs, 10.7 Orientação para mudanças futuras, 10. Adendo visual e de navegação — 16 de julho de 2026 (+17 more)

### Community 79 - "README.md"
Cohesion: 0.50
Nodes (3): Busca, Contrato e indexação, Limites para reavaliar a busca client-side

### Community 106 - "Q: Implementar milestones 7 e 8 consultando o grafo primeiro"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Implementar milestones 7 e 8 consultando o grafo primeiro, Source Nodes

### Community 107 - "Q: Use o Graphify para entender a arquitetura e implemente a milestone 9 deste projeto."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Use o Graphify para entender a arquitetura e implemente a milestone 9 deste projeto., Source Nodes

### Community 108 - "Q: Use o Graphify para entender a arquitetura e implemente a milestone 10 deste projeto."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Use o Graphify para entender a arquitetura e implemente a milestone 10 deste projeto., Source Nodes

### Community 113 - "Milestone — Login, Meu aprendizado e progresso"
Cohesion: 0.13
Nodes (15): Conclusão de Aulas, Contexto arquitetural, Escopo inicial, Estados de experiência do usuário, Fora do escopo inicial, Gates de execução, Identificação de conteúdo, Milestone extra — Login, inscrições e Meu aprendizado (+7 more)

### Community 114 - "ADENDO MILESTONE_LOGIN"
Cohesion: 0.11
Nodes (19): ADENDO MILESTONE_LOGIN, Compatibilidade e precedência limitada, Conflitos identificados e resolução adotada no planejamento, Critérios objetivos de conclusão, Decisões aprovadas nesta revisão, Decisões operacionais aprovadas nesta revisão, Escopo explicitamente excluído, Escopo incluído (+11 more)

### Community 115 - "Critérios de aceite preliminares"
Cohesion: 0.33
Nodes (6): Aulas e progresso, Autenticação, Critérios de aceite preliminares, Inscrições, Página pessoal, Qualidade do projeto

### Community 116 - "Dashboard"
Cohesion: 0.40
Nodes (5): Aulas concluídas recentes, Dashboard, Estudos em andamento recentes, Gráfico de estudos, Total de Aulas concluídas

### Community 117 - "Autenticação"
Cohesion: 0.40
Nodes (5): Autenticação, Ações que exigem autenticação, Escopos de identidade, Provedor, Sessão e retorno

### Community 118 - "Página `/meu-aprendizado`"
Cohesion: 0.40
Nodes (5): Estrutura visual, Lista de Aulas concluídas, Listas de Cursos e Trilhas, Navegação da página, Página `/meu-aprendizado`

### Community 119 - "12. Estratégia de Escalabilidade"
Cohesion: 0.50
Nodes (4): 12.1 Crescimento de conteúdo, 12.2 Gatilhos de migração de infraestrutura, 12.3 Escalabilidade de equipe (não só de tráfego), 12. Estratégia de Escalabilidade

### Community 120 - "Regras de progresso"
Cohesion: 0.50
Nodes (4): Alterações editoriais, Curso, Regras de progresso, Trilha

### Community 121 - "Modelo conceitual de dados"
Cohesion: 0.50
Nodes (4): Conclusão de Aula, Identidade, Inscrição, Modelo conceitual de dados

### Community 122 - "Inscrição em Cursos e Trilhas"
Cohesion: 0.50
Nodes (4): Curso, Inscrição em Cursos e Trilhas, Remover inscrição, Trilha

### Community 123 - "Integração e segurança do Supabase"
Cohesion: 0.67
Nodes (3): Cliente e servidor, Integração e segurança do Supabase, RLS e isolamento

### Community 133 - "Q: Use o Graphify para entender a arquitetura e implemente ADENDO MILESTONE_LOGIN deste projeto. Consulte o grafo primeiro, faça as alterações necessárias e rode os testes."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Use o Graphify para entender a arquitetura e implemente ADENDO MILESTONE_LOGIN deste projeto. Consulte o grafo primeiro, faça as alterações necessárias e rode os testes., Source Nodes

### Community 134 - "0. Como usar este plano"
Cohesion: 0.50
Nodes (4): 0.1 Restrições invariáveis, 0.2 Decisões operacionais complementares, 0.3 Unidade de trabalho e estados, 0. Como usar este plano

## Knowledge Gaps
- **512 isolated node(s):** `plugins`, `publicationStatus`, `difficulty`, `trailItem`, `titledUrl` (+507 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `minisearch` connect `types.ts` to `scripts`, `types.ts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `dependencies` connect `scripts` to `types.ts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `Documentação de Arquitetura — Portal GEAR` connect `Documentação de Arquitetura — Portal GEAR` to `11. Design System`, `13. Checklist Técnico`, `10. Wireframes ASCII`, `include`, `1. Visão Geral`, `4. Fluxos dos Usuários`, `8. Organização das Trilhas/Cursos/Aulas`, `5. Papéis e permissões`, `12. Estratégia de Escalabilidade`, `14. Roadmap do Projeto`, `2.4 Decisões adotadas e recomendações técnicas`, `7. Organização dos Dados`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `plugins`, `publicationStatus`, `difficulty` to the rest of the system?**
  _512 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1092436974789916 - nodes in this community are weakly interconnected._