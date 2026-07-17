# Plano de Desenvolvimento — Portal GEAR

**Versão:** 1.0  
**Data:** 15 de julho de 2026  
**Status:** plano executável da Milestone 0  
**Público:** estudantes, Editores, revisores humanos e agentes de IA  
**Fontes de verdade:** `PARTE A/gear-documentacao-arquitetura (2).md` v1.3 e `PARTE A/GEAR Website — Project Rules.md` v1.0

---

## 0. Como usar este plano

Este documento transforma a arquitetura aprovada em trabalho executável. Ele não redefine a arquitetura. Em caso de dúvida ou conflito:

1. prevalece `gear-documentacao-arquitetura (2).md` v1.3;
2. depois, prevalece a seção 19 de `GEAR Website — Project Rules.md`;
3. em seguida, valem as demais regras permanentes do Project Rules;
4. este plano decide somente aspectos operacionais não definidos nas fontes acima;
5. uma alteração estrutural exige proposta separada, justificativa, aprovação da equipe e atualização da documentação arquitetural **antes** da implementação.

### 0.1 Restrições invariáveis

- Stack: Next.js com App Router, React, TypeScript estrito, Tailwind CSS e MDX.
- Arquitetura: monólito modular Feature-First.
- `app/` contém apenas roteamento e composição; regras de domínio ficam nas features.
- Dependências seguem apenas o sentido `app` → `features` → `shared`; features não importam diretamente umas das outras.
- Conteúdo editorial é Content as Code, versionado em MDX e publicado por Pull Request.
- A Aula é a unidade canônica mínima. Trilhas podem conter Cursos e Aulas; Cursos podem existir sem Trilha; Aulas podem existir sem Curso ou Trilha.
- Não há quarto nível educacional na v1 e não há duplicação de arquivos MDX.
- O MVP não inclui autenticação própria, banco de dados, comentários, progresso individual, favoritos, perfis, CMS visual, painel administrativo nem analytics próprios.
- Giscus é futuro e, quando habilitado, não pode ser substituído por sistema próprio sem revisão arquitetural.
- Light mode é o padrão da v1; dark mode é backlog futuro opcional.
- Uma Milestone só começa depois de a anterior satisfazer integralmente seu gate de saída.

### 0.2 Decisões operacionais complementares

As escolhas abaixo fecham lacunas de execução sem modificar a arquitetura.

| Tema                   | Decisão                                                                                  | Justificativa para um projeto acadêmico de longo prazo                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gerenciador de pacotes | npm, com lockfile versionado                                                             | Já acompanha o Node.js, reduz preparação do ambiente e evita uma ferramenta global adicional.                                                             |
| Runtime                | versão LTS ativa do Node.js no início da Milestone 1, fixada no repositório              | LTS reduz mudanças inesperadas; fixar a versão torna ambientes locais e CI reproduzíveis.                                                                 |
| Processamento MDX      | Velite                                                                                   | É a recomendação arquitetural e reduz manutenção ao unir schema, validação e tipos. A viabilidade deve ser confirmada por uma prova curta na Milestone 1. |
| Hospedagem             | Vercel                                                                                   | É a recomendação arquitetural, oferece preview por PR e reduz conhecimento operacional necessário.                                                        |
| Mídia inicial          | `public/` versionado                                                                     | É a opção mais simples na escala inicial; migração para CDN só ocorre quando os gatilhos arquiteturais forem observados.                                  |
| Busca                  | MiniSearch, com índices separados por classificação                                      | Atende o volume previsto no cliente e permite uma implementação pequena. A segregação entre Trilhas, Cursos, Aulas e Notícias é obrigatória.              |
| Formatação             | ESLint para regras e Prettier para formatação automática                                 | Separa correção de estilo de formatação, reduz discussões em revisão e facilita contribuições de iniciantes.                                              |
| Testes unitários       | Vitest + React Testing Library                                                           | Integração adequada ao ecossistema Next.js e feedback rápido para funções, hooks e componentes síncronos.                                                 |
| Testes E2E             | Playwright                                                                               | Cobre navegação real, responsividade, busca e Server Components assíncronos em ambiente próximo à produção.                                               |
| Fluxo Git              | trunk-based simplificado, com `main` protegida e branches curtas                         | Evita a manutenção de branches permanentes divergentes e é mais fácil de ensinar a equipes rotativas.                                                     |
| Integração             | squash merge                                                                             | Mantém uma unidade reversível por PR e histórico principal legível.                                                                                       |
| Planejamento           | issues pequenas, ligadas a um único item deste backlog                                   | Permite colaboração segura entre estudantes e IAs, com contexto e aceite verificáveis.                                                                    |
| Idioma técnico         | domínio em português; termos de framework e componentes genéricos conforme a arquitetura | Preserva o vocabulário oficial (`trilhaSlug`, `aulaSlugs`) sem traduzir convenções obrigatórias do Next.js.                                               |

Se Velite, Vercel ou MiniSearch falharem na validação objetiva, a equipe deve registrar a evidência e escolher uma das alternativas já admitidas pela arquitetura. Isso não autoriza mudança de modelo de domínio, camadas, rotas ou escopo.

### 0.3 Unidade de trabalho e estados

Cada item do backlog vira uma issue. Use os estados:

- **Pronto:** contexto, dependências e critérios de aceite estão claros.
- **Em andamento:** há uma pessoa responsável e uma branch vinculada.
- **Em revisão:** PR aberto, CI executando e evidências anexadas.
- **Bloqueado:** impedimento, responsável pela remoção e próxima data de revisão registrados.
- **Concluído:** PR integrado, critérios de aceite e checklist da Milestone atendidos.

Tamanhos relativos:

- **PP:** até meio dia de trabalho focado;
- **P:** aproximadamente um dia;
- **M:** dois a três dias;
- **G:** quatro a cinco dias e forte candidato a decomposição;
- itens maiores que G não entram em desenvolvimento sem divisão.

---

## 1. Estratégia geral de desenvolvimento

### 1.1 Princípios de execução

1. **Construir fatias navegáveis:** cada Milestone termina com uma entrega demonstrável, não apenas infraestrutura invisível.
2. **Reduzir risco cedo:** validar ambiente, pipeline MDX, modelo relacional e deploy antes de multiplicar páginas.
3. **Conteúdo representativo desde o início:** exemplos devem cobrir Aula avulsa, Curso independente e Trilha com Curso + Aula direta.
4. **Server-first:** todo componente nasce como Server Component; interatividade vira uma pequena ilha Client apenas quando estado ou evento no navegador for indispensável.
5. **Reutilização orientada por uso real:** criar componentes compartilhados apenas quando uma necessidade concreta aparecer; não antecipar um Design System inteiro.
6. **Qualidade contínua:** lint, tipos, testes relevantes, validação de conteúdo, acessibilidade e documentação fazem parte da issue, não de uma fase de correção tardia.
7. **Mudanças pequenas e reversíveis:** uma issue, uma branch, um PR, um objetivo principal.
8. **Humano responsável por toda entrega:** IAs podem implementar, revisar preliminarmente e gerar testes, mas uma pessoa da equipe responde por escopo, validação e merge.
9. **Sem trabalho especulativo fora do MVP:** ideias futuras entram no backlog futuro e não criam dependências na v1.

### 1.2 Ciclo padrão de uma issue

1. Refinar objetivo, dependências e aceite.
2. Confirmar que pertence à Milestone ativa.
3. Designar responsável humano e, se aplicável, registrar a tarefa dada à IA.
4. Criar branch curta a partir de `main` atualizada.
5. Implementar e testar somente o escopo da issue.
6. Atualizar documentação afetada no mesmo PR.
7. Abrir PR com evidências de teste, imagens quando houver UI e riscos conhecidos.
8. Corrigir feedback e resolver todas as conversas.
9. Obter aprovação humana e CI verde.
10. Fazer squash merge, excluir a branch e conferir o preview/deploy.

### 1.3 Definition of Ready global

Uma issue só pode começar quando:

- [ ] tem ID deste backlog;
- [ ] descreve o valor ou risco tratado;
- [ ] pertence à Milestone ativa;
- [ ] lista dependências concluídas;
- [ ] possui critérios de aceite observáveis;
- [ ] identifica rotas, conteúdo ou módulos afetados;
- [ ] informa o que está explicitamente fora do escopo;
- [ ] cabe em até G ou foi dividida;
- [ ] tem responsável humano;
- [ ] não exige decisão arquitetural pendente.

### 1.4 Definition of Done global

Uma issue só está concluída quando:

- [ ] critérios de aceite foram demonstrados;
- [ ] TypeScript estrito, lint e formatação passam;
- [ ] testes proporcionais ao risco foram adicionados e passam;
- [ ] build de produção passa;
- [ ] conteúdo e referências foram validados quando aplicável;
- [ ] interface foi conferida em viewport móvel e desktop quando aplicável;
- [ ] navegação por teclado e foco visível foram conferidos quando aplicável;
- [ ] nenhum rascunho vazou para rota, busca ou sitemap de produção;
- [ ] documentação afetada foi atualizada;
- [ ] PR recebeu revisão humana, CI verde e todas as conversas foram resolvidas;
- [ ] não introduziu dependência entre features nem funcionalidade fora do MVP;
- [ ] preview ou ambiente integrado foi verificado após o merge.

---

## 2. Ordem correta de implementação

A ordem é obrigatória e preserva o roadmap arquitetural:

| Ordem | Milestone                      | Dependência principal | Resultado                                       |
| ----: | ------------------------------ | --------------------- | ----------------------------------------------- |
|     0 | Planejamento executável        | arquitetura aprovada  | trabalho refinável e governado                  |
|     1 | Repositório pronto             | M0                    | ambiente reproduzível e estrutura base          |
|     2 | Esqueleto navegável            | M1                    | sitemap inteiro sem 404 inesperada              |
|     3 | Base visual e Home inicial     | M2                    | identidade e primeiro fluxo de valor            |
|     4 | Patrocinadores na Home         | M3                    | componente global orientado a dados             |
|     5 | Fundação de conteúdo MDX       | M4                    | conteúdo tipado, validado e relacionável        |
|     6 | Aulas                          | M5                    | primeira fatia educacional completa             |
|     7 | Cursos                         | M6                    | agrupamento ordenado de Aulas                   |
|     8 | Trilhas                        | M7                    | caminhos com Cursos e Aulas diretas             |
|     9 | Busca educacional              | M8                    | busca segregada e filtros responsivos           |
|    10 | Projetos                       | M9                    | segunda prioridade de produto                   |
|    11 | Institucional e patrocinadores | M10                   | apresentação completa do grupo                  |
|    12 | Notícias                       | M11                   | publicação editorial secundária e busca própria |
|    13 | Qualidade e publicação         | M12                   | automação, conformidade e produção              |
|    14 | Conteúdo real e lançamento     | M13                   | MVP validado por usuários e sustentável         |

Não se antecipa uma feature de Milestone posterior. É permitido preparar apenas contratos mínimos indispensáveis à Milestone ativa, sem implementar UI ou comportamento futuro.

---

## 3. Divisão em Milestones

| Milestone | Objetivo                        | Demonstração obrigatória                                | Gate de saída                                            |
| --------- | ------------------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| M0        | Tornar a arquitetura executável | novo integrante explica sequência, backlog e regras     | plano aprovado e decisões complementares registradas     |
| M1        | Padronizar o ambiente           | clone limpo inicia o projeto e executa verificações     | onboarding técnico reproduzível                          |
| M2        | Materializar o mapa do site     | navegação por todas as rotas planejadas                 | zero link interno quebrado ou 404 inesperada             |
| M3        | Estabelecer linguagem visual    | Home responsiva com CTAs principais                     | tokens, tipografia e acessibilidade essenciais aplicados |
| M4        | Exibir parceiros globalmente    | dados locais alimentam strip e links                    | patrocinadores consistentes sem banco ou admin           |
| M5        | Tornar MDX a fonte operacional  | exemplos válidos e inválidos passam/falham corretamente | schemas, relações, rascunhos e build validados           |
| M6        | Entregar Aulas                  | localizar e consumir uma Aula completa                  | Aula canônica realista ponta a ponta                     |
| M7        | Entregar Cursos                 | Curso independente ordena Aulas                         | referências válidas, sem duplicação de MDX               |
| M8        | Entregar Trilhas                | Trilha mistura Curso e Aula direta                      | contexto flexível e URLs canônicas preservados           |
| M9        | Entregar descoberta educacional | pesquisar cada classificação em separado                | nenhum resultado cruza Trilhas, Cursos e Aulas           |
| M10       | Entregar Projetos               | abrir galeria e detalhes de um Projeto                  | destaques integram a Home                                |
| M11       | Completar institucional         | entender missão, áreas, membros e parceiros             | `/sobre` e `/patrocinadores` completos                   |
| M12       | Entregar Notícias               | publicar e pesquisar Notícia                            | busca não mistura Notícias e Aprendizado                 |
| M13       | Preparar produção               | PR bloqueado por falha e deploy aprovado                | CI, proteção, SEO, legal, a11y e performance auditados   |
| M14       | Lançar com conteúdo real        | estudantes executam jornadas críticas                   | conteúdo revisado, feedback incorporado e handover feito |

---

## 4. Backlog completo

### Regras do backlog

- **P0:** bloqueia a Milestone ou a integridade arquitetural.
- **P1:** necessário para o gate da Milestone.
- **P2:** melhoria desejável, executada somente se não atrasar P0/P1.
- A coluna **Dep.** usa IDs deste documento. `M anterior` significa que todo o gate anterior deve estar concluído.
- Critérios transversais da Definition of Done não são repetidos em cada item; continuam obrigatórios.

### M0 — Planejamento executável

| ID    | Pri. | Tam. | Item e critério específico de aceite                                                                                                                                                | Dep.  |
| ----- | ---- | ---: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| M0-01 | P0   |    M | Consolidar este `development-plan.md`; aceito quando os 15 tópicos solicitados, as 15 Milestones e o backlog futuro estiverem cobertos.                                             | —     |
| M0-02 | P0   |    P | Revisar o plano contra os dois documentos da Parte A; aceito quando conflitos estiverem resolvidos pela hierarquia da seção 0.                                                      | M0-01 |
| M0-03 | P1   |    P | Confirmar responsáveis iniciais: responsável técnico, responsável editorial, mantenedor de CI/deploy e facilitador de onboarding; nomes podem mudar, papéis não podem ficar vagos.  | M0-01 |
| M0-04 | P0   |    P | Aprovar hospedagem Vercel e identificar a conta/organização institucional proprietária; aceito com proprietário e plano de recuperação registrados, sem credenciais no repositório. | M0-03 |
| M0-05 | P1   |    P | Transformar M1 em issues no GitHub, preservando IDs, dependências e aceites; nenhuma issue de M2+ deve entrar em execução.                                                          | M0-02 |
| M0-06 | P1   |   PP | Criar registro de decisões operacionais e processo de ADR; aceito quando existir local e modelo simples para decisões futuras, sem duplicar a arquitetura.                          | M0-02 |
| M0-07 | P1   |   PP | Realizar leitura guiada do plano com ao menos uma pessoa que não participou da arquitetura; dúvidas recorrentes viram correções no documento.                                       | M0-02 |

**Checklist técnico de saída da M0**

- [ ] Fontes de verdade e precedência estão explícitas.
- [ ] Escopo e itens fora do MVP estão inequívocos.
- [ ] Decisões não arquiteturais têm justificativa.
- [ ] Backlog possui IDs, prioridades, dependências e aceite.
- [ ] Responsáveis de continuidade estão nomeados.
- [ ] Estratégia de hospedagem está aprovada.
- [ ] M1 está refinada e nenhuma Milestone posterior foi iniciada.

### M1 — Repositório pronto para desenvolver

| ID    | Pri. | Tam. | Item e critério específico de aceite                                                                                                                                      | Dep.                       |
| ----- | ---- | ---: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| M1-01 | P0   |    P | Inicializar o repositório GitHub institucional e definir `main` como branch padrão; aceito quando todo membro autorizado consegue clonar.                                 | M0                         |
| M1-02 | P0   |    M | Inicializar Next.js App Router com React, TypeScript estrito, Tailwind CSS e npm; aceito com execução local e build inicial válidos.                                      | M1-01                      |
| M1-03 | P0   |    P | Fixar runtime LTS e versionar lockfile; aceito quando máquina limpa e CI usam a mesma família de runtime e dependências determinísticas.                                  | M1-02                      |
| M1-04 | P0   |    M | Criar a estrutura Feature-First prevista na arquitetura, apenas com arquivos mínimos necessários; aceito sem regra de negócio em `app/` e sem importação entre features.  | M1-02                      |
| M1-05 | P1   |    P | Configurar aliases de importação coerentes com `app`, `features`, `shared` e `content`; aceito quando evitam caminhos relativos profundos sem esconder limites de camada. | M1-04                      |
| M1-06 | P0   |    M | Configurar ESLint, Prettier e checagem de tipos; aceito quando comandos separados falham diante de erro intencional e passam após a correção.                             | M1-02                      |
| M1-07 | P1   |    P | Criar `.gitignore` e `.env.example`; aceito sem segredo versionado e com toda variável explicada.                                                                         | M1-02                      |
| M1-08 | P1   |    M | Criar `README.md` raiz com propósito, pré-requisitos, instalação, comandos, arquitetura resumida e links para Parte A e este plano.                                       | M1-03                      |
| M1-09 | P1   |    M | Criar `CONTRIBUTING.md` com branches, commits, PRs, testes, conteúdo e uso responsável de IA.                                                                             | M1-08                      |
| M1-10 | P1   |    P | Adotar licença aprovada institucionalmente pela equipe/UFMG; aceito quando o tipo e a autorização estiverem registrados.                                                  | M1-01                      |
| M1-11 | P0   |    M | Executar prova técnica curta do Velite com um schema mínimo descartável ou de teste; aceito quando build, tipagem e falha de validação forem demonstrados.                | M1-02                      |
| M1-12 | P1   |    M | Configurar base de Vitest + React Testing Library e Playwright, ainda sem suíte extensa; aceito com um smoke test de cada ferramenta.                                     | M1-02                      |
| M1-13 | P1   |    P | Criar templates de issue e PR, mais `CODEOWNERS` inicial; aceito quando revisão apropriada é solicitada automaticamente para áreas críticas.                              | M1-01                      |
| M1-14 | P1   |    P | Criar um README de cinco linhas para cada feature declarada, incluindo features futuras vazias; aceito com propósito, limites e contatos de manutenção.                   | M1-04                      |
| M1-15 | P0   |    P | Testar onboarding em clone limpo; aceito quando uma pessoa nova instala, inicia, testa e faz build seguindo apenas o README.                                              | M1-03, M1-06, M1-08, M1-12 |

**Checklist técnico de saída da M1**

- [ ] Stack e App Router estão corretos; TypeScript está em `strict: true`.
- [ ] Versão de Node e lockfile tornam o ambiente reproduzível.
- [ ] Estrutura de pastas reflete exatamente a arquitetura.
- [ ] `app/` não contém lógica de domínio.
- [ ] Nenhuma feature importa outra feature.
- [ ] Lint, formatação, tipos, teste unitário smoke, teste E2E smoke e build passam.
- [ ] Velite foi validado ou a alternativa arquitetural foi registrada com evidência.
- [ ] README, CONTRIBUTING, licença, templates e CODEOWNERS existem.
- [ ] Segredos não estão versionados.
- [ ] Onboarding de clone limpo foi comprovado.

### M2 — Esqueleto navegável do Portal

| ID    | Pri. | Tam. | Item e critério específico de aceite                                                                                                                                     | Dep.         |
| ----- | ---- | ---: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| M2-01 | P0   |    M | Criar layout público `(site)` com estrutura semântica, Container, Header e Footer mínimos; aceito sem lógica de feature no layout.                                       | M1           |
| M2-02 | P0   |    M | Criar configuração central de navegação e metadados do site em `shared/config`; aceito quando Header e Footer consomem uma única fonte.                                  | M2-01        |
| M2-03 | P0   |    G | Criar todas as rotas estáticas e dinâmicas do sitemap arquitetural com estados temporários intencionais; aceito quando nenhuma rota planejada resulta em 404 inesperada. | M2-01        |
| M2-04 | P1   |    M | Implementar Header móvel e desktop com indicação de página atual; aceito por teclado, com menu móvel fechável e sem armadilha de foco.                                   | M2-02        |
| M2-05 | P1   |    P | Implementar Footer com navegação institucional, redes sociais e links legais temporários válidos.                                                                        | M2-02        |
| M2-06 | P1   |    P | Criar `not-found` customizado com caminho de retorno; aceito quando URL inexistente exibe mensagem clara e link funcional.                                               | M2-01        |
| M2-07 | P0   |    M | Adicionar teste automático de links internos e E2E do mapa principal; aceito cobrindo Home, Aprendizado, Projetos, Notícias, Sobre e Patrocinadores.                     | M2-03, M2-04 |
| M2-08 | P1   |    P | Definir estados temporários acessíveis para áreas futuras; aceito sem texto fictício que possa ser confundido com conteúdo publicado.                                    | M2-03        |
| M2-09 | P1   |    P | Validar navegação em viewport móvel estreita e desktop; aceito sem overflow horizontal e com foco sempre visível.                                                        | M2-04, M2-05 |

**Checklist técnico de saída da M2**

- [ ] Todas as rotas do sitemap existem.
- [ ] Links internos e estados ativos funcionam.
- [ ] Header e menu móvel operam por teclado.
- [ ] Footer contém os destinos institucionais previstos.
- [ ] 404 customizada funciona.
- [ ] Não há regra de negócio nas páginas de rota.
- [ ] Não há overflow horizontal nos viewports de referência.
- [ ] Testes E2E de navegação passam.

### M3 — Base visual e Home inicial

| ID    | Pri. | Tam. | Item e critério específico de aceite                                                                                                           | Dep.                |
| ----- | ---- | ---: | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| M3-01 | P0   |    M | Implementar os tokens oficiais de cor em ponto único de configuração; aceito sem cores de marca espalhadas por componentes.                    | M2                  |
| M3-02 | P0   |    M | Configurar Space Grotesk, IBM Plex Sans e IBM Plex Mono com carregamento otimizado e fallback; aceito sem salto visual relevante e com `swap`. | M3-01               |
| M3-03 | P0   |    M | Implementar escala tipográfica, grade de 4 px, raios, bordas e movimento de 150–200 ms; aceito conforme Design System arquitetural.            | M3-01               |
| M3-04 | P0   |    M | Criar somente os primitivos necessários nesta etapa: Button, Card, Badge, Container e foco padrão; aceito com variantes mínimas documentadas.  | M3-01, M3-03        |
| M3-05 | P0   |    M | Implementar Hero da Home com identificação GEAR/UFMG e CTAs para Aprendizado e Projetos.                                                       | M3-04               |
| M3-06 | P1   |    P | Implementar resumo de missão; aceito com conteúdo institucional aprovado e estrutura semântica.                                                | M3-05               |
| M3-07 | P1   |    M | Implementar prévia de áreas de pesquisa usando dados estruturados locais; aceito sem duplicar conteúdo em componentes.                         | M3-04               |
| M3-08 | P1   |    M | Criar estados vazios intencionais para Trilhas e Projetos em destaque até suas features existirem; aceito sem dados falsos publicados.         | M3-05               |
| M3-09 | P1   |    P | Implementar a assinatura visual de circuito apenas nos locais previstos e de forma adaptável; aceito sem impor hierarquia inexistente.         | M3-03               |
| M3-10 | P0   |    M | Auditar contraste AA, hierarquia de headings, foco, textos de links e alvos de toque.                                                          | M3-05, M3-06, M3-07 |
| M3-11 | P1   |    M | Validar Home em móvel, tablet e desktop; aceito com CTAs visíveis, conteúdo legível e sem depender de hover.                                   | M3-10               |
| M3-12 | P1   |    P | Documentar tokens e primitivos no README de `shared`; aceito com exemplos de uso em linguagem natural e critérios para novas variantes.        | M3-04               |

**Checklist técnico de saída da M3**

- [ ] Paleta, tipografia, espaçamento, raios e movimento seguem a arquitetura.
- [ ] Light mode é o único requisito do MVP; não há ThemeToggle prematuro.
- [ ] Componentes compartilhados possuem responsabilidade única.
- [ ] Home apresenta o GEAR e aponta para Aprendizado e Projetos.
- [ ] Conteúdo institucional é aprovado, não placeholder.
- [ ] Contraste AA, foco e semântica foram verificados.
- [ ] Layout é utilizável em móvel, tablet e desktop.
- [ ] Tokens e variantes estão documentados.

### M4 — Patrocinadores na Home

| ID    | Pri. | Tam. | Item e critério específico de aceite                                                                                                       | Dep.  |
| ----- | ---- | ---: | ------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| M4-01 | P0   |    P | Definir dados locais de patrocinadores com `nome`, `logo`, `url`, `nivel` opcional e `ordem`; aceito com validação e ordem determinística. | M3    |
| M4-02 | P0   |    M | Implementar SponsorStrip na feature `patrocinadores`; aceito consumindo dados, sem conteúdo hardcoded na UI.                               | M4-01 |
| M4-03 | P0   |    P | Integrar SponsorStrip ao layout global em posição consistente; aceito visível em todas as páginas públicas sem duplicação.                 | M4-02 |
| M4-04 | P1   |    P | Garantir logos responsivos, texto alternativo e links externos seguros; aceito por teclado e leitor de tela.                               | M4-02 |
| M4-05 | P1   |    P | Definir estado vazio sem seção quebrada; aceito quando lista vazia não deixa título ou espaço órfão.                                       | M4-02 |
| M4-06 | P1   |    P | Documentar como adicionar, ordenar, atualizar e remover patrocinador via código e PR.                                                      | M4-01 |

**Checklist técnico de saída da M4**

- [ ] Dados de patrocinadores têm uma única fonte.
- [ ] SponsorStrip está no layout global e é responsivo.
- [ ] Logos têm dimensões, texto alternativo e links válidos.
- [ ] Ordem é determinística.
- [ ] Estado vazio é seguro.
- [ ] Não existe banco, API ou painel administrativo.
- [ ] Fluxo editorial está documentado.

### M5 — Fundação de conteúdo MDX

| ID    | Pri. | Tam. | Item e critério específico de aceite                                                                                                          | Dep.          |
| ----- | ---- | ---: | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| M5-01 | P0   |    M | Formalizar schemas de Trilha, Curso, Aula, Projeto e Notícia exatamente conforme a seção 7 da arquitetura.                                    | M4            |
| M5-02 | P0   |    G | Configurar pipeline Velite para ler coleções separadas e gerar dados tipados; aceito quando adicionar MDX válido o torna disponível no build. | M5-01         |
| M5-03 | P0   |    M | Validar obrigatoriedade, enumerações, datas, URLs e formato de slug; aceito com casos válidos e inválidos automatizados.                      | M5-02         |
| M5-04 | P0   |    M | Validar unicidade de slug dentro de cada tipo; aceito quando duplicata falha com mensagem que identifica os arquivos.                         | M5-02         |
| M5-05 | P0   |    G | Validar relações: itens de Trilha, Aulas de Curso e pré-requisitos devem apontar para slugs existentes e tipos permitidos.                    | M5-02         |
| M5-06 | P0   |    M | Validar que Curso publicado contém ao menos uma Aula e que não há quarto nível ou ciclo de pré-requisitos.                                    | M5-05         |
| M5-07 | P0   |    M | Implementar regra de publicação: rascunhos ficam fora de rotas públicas, índices e sitemap de produção.                                       | M5-02         |
| M5-08 | P0   |    M | Criar dados derivados e ordenação estável sem duplicar conteúdo; aceito preservando `itens`, `aulaSlugs` e `ordem`.                           | M5-05         |
| M5-09 | P0   |    M | Criar exemplos representativos: Aula avulsa, Curso independente, Trilha com Curso e Aula direta, Projeto e Notícia.                           | M5-01         |
| M5-10 | P1   |    M | Padronizar renderização MDX permitida, incluindo texto, imagens, vídeo, downloads, links e blocos de código, sem HTML de Aula fora de MDX.    | M5-02         |
| M5-11 | P1   |    P | Validar caminhos de mídia e downloads locais referenciados; aceito quando referência inexistente bloqueia integração.                         | M5-02         |
| M5-12 | P0   |    G | Criar suíte unitária do parsing e das relações; aceito cobrindo sucesso, ausência de campo, duplicata, referência inválida, rascunho e ciclo. | M5-03 a M5-08 |
| M5-13 | P1   |    M | Documentar templates e instruções editoriais por entidade, com todos os campos e exemplos conceituais.                                        | M5-01, M5-09  |
| M5-14 | P0   |    M | Integrar validação de conteúdo ao comando de verificação e ao build; aceito quando conteúdo inválido impede o build local.                    | M5-03 a M5-07 |
| M5-15 | P1   |    P | Medir tempo e tamanho inicial do build/índices como baseline; aceito com resultado registrado para comparação futura.                         | M5-14         |

**Checklist técnico de saída da M5**

- [ ] Cinco schemas refletem a arquitetura sem campos inventados obrigatórios.
- [ ] Slugs, enums, datas, URLs e campos obrigatórios são validados.
- [ ] Relações apontam para entidades existentes e não criam quarto nível.
- [ ] Curso publicado tem ao menos uma Aula.
- [ ] Rascunhos não aparecem em produção, busca ou sitemap.
- [ ] Exemplos cobrem todas as combinações educacionais permitidas.
- [ ] Mídia e links internos inválidos são detectados.
- [ ] Testes de parsing e relações passam.
- [ ] Build falha de forma compreensível diante de conteúdo inválido.
- [ ] Editores têm documentação para criar conteúdo.

### M6 — Aulas: primeira fatia funcional

| ID    | Pri. | Tam. | Item e critério específico de aceite                                                                                                                                   | Dep.          |
| ----- | ---- | ---: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| M6-01 | P0   |    M | Implementar acesso tipado a Aulas publicadas dentro da feature `aulas`; aceito com listagem ordenada e busca por slug, sem leitura de conteúdo em `app/`.              | M5            |
| M6-02 | P0   |    G | Implementar listagem `/aprendizado/aulas` com resumo, dificuldade, tags/categoria quando presentes e paginação ou estratégia equivalente prevista para 100+ itens.     | M6-01         |
| M6-03 | P0   |    G | Implementar rota canônica `/aprendizado/aulas/[aula]` gerada estaticamente; aceito com 404 para slug inexistente ou rascunho.                                          | M6-01         |
| M6-04 | P0   |    M | Implementar AulaBanner e AulaMetadados; aceito com fallback quando banner, tags ou atualização forem opcionais.                                                        | M6-03         |
| M6-05 | P0   |    G | Implementar AulaConteudoMDX com tipografia de leitura e componentes MDX permitidos; aceito com texto, imagem, vídeo, download, link e bloco de código representativos. | M5-10, M6-03  |
| M6-06 | P1   |    M | Implementar AulaPreRequisitos com links canônicos válidos e estado ausente sem seção vazia.                                                                            | M6-03         |
| M6-07 | P1   |    M | Implementar AulaRecursos para vídeos, links, downloads e repositório GitHub; aceito sem Client Component maior que a interação necessária.                             | M6-03         |
| M6-08 | P0   |    M | Implementar Breadcrumbs para Aula avulsa como `Aprendizado → Aulas → Aula`; aceito sem inventar Curso ou Trilha.                                                       | M6-03         |
| M6-09 | P1   |    P | Gerar metadados e OpenGraph específicos da Aula a partir de título, resumo e banner/fallback.                                                                          | M6-03         |
| M6-10 | P0   |    M | Garantir que `permiteComentarios` não renderize Giscus no MVP; aceito com ausência de login, embed ou placeholder interativo.                                          | M6-03         |
| M6-11 | P0   |    M | Publicar ao menos uma Aula representativa ponta a ponta, revisada tecnicamente e editorialmente.                                                                       | M6-04 a M6-08 |
| M6-12 | P0   |    G | Criar testes unitários de transformações e E2E de listar, abrir, consumir recursos, navegar pré-requisitos e tratar 404/rascunho.                                      | M6-02 a M6-11 |
| M6-13 | P1   |    M | Auditar legibilidade móvel, imagens responsivas, lazy load de vídeo, heading order, links e downloads.                                                                 | M6-11         |

**Checklist técnico de saída da M6**

- [ ] Listagem mostra somente Aulas publicadas.
- [ ] Cada Aula possui URL canônica independente.
- [ ] Aula avulsa não recebe hierarquia inventada.
- [ ] MDX renderiza conteúdo e recursos permitidos.
- [ ] Metadados, pré-requisitos e estados opcionais são corretos.
- [ ] Vídeos e imagens não penalizam o carregamento inicial indevidamente.
- [ ] Giscus não está presente no MVP.
- [ ] Aula representativa foi revisada e testada de ponta a ponta.
- [ ] Mobile, teclado e 404/rascunho foram verificados.

### M7 — Cursos

| ID    | Pri. | Tam. | Item e critério específico de aceite                                                                                               | Dep.          |
| ----- | ---- | ---: | ---------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| M7-01 | P0   |    M | Implementar acesso tipado a Cursos publicados na feature `cursos`; aceito com ordenação determinística e resolução de `aulaSlugs`. | M6            |
| M7-02 | P0   |    M | Implementar CursoCard por composição de primitivos compartilhados, sem duplicar Card base.                                         | M7-01         |
| M7-03 | P0   |    G | Implementar listagem `/aprendizado/cursos`; aceito com título, descrição, dificuldade, tags opcionais e estado vazio.              | M7-02         |
| M7-04 | P0   |    G | Implementar `/aprendizado/cursos/[curso]` estaticamente; aceito com metadados, pré-requisitos e Aulas na ordem de `aulaSlugs`.     | M7-01         |
| M7-05 | P0   |    M | Resolver links do Curso para URLs canônicas das Aulas sem copiar ou mover MDX.                                                     | M7-04         |
| M7-06 | P1   |    M | Preservar contexto de Curso nos breadcrumbs quando a Aula for acessada a partir dele, sem mudar a URL canônica da Aula.            | M7-04, M6-08  |
| M7-07 | P1   |    P | Gerar metadados e OpenGraph de Curso a partir do conteúdo estruturado.                                                             | M7-04         |
| M7-08 | P0   |    M | Publicar exemplo de Curso independente, com ao menos duas Aulas existentes e ordem verificável.                                    | M7-04, M7-05  |
| M7-09 | P0   |    G | Criar testes unitários de resolução/ordem e E2E de listagem, detalhe, navegação para Aulas, Curso independente, 404 e rascunho.    | M7-03 a M7-08 |
| M7-10 | P1   |    P | Auditar responsividade, teclado, imagens e estados opcionais das páginas de Curso.                                                 | M7-09         |

**Checklist técnico de saída da M7**

- [ ] Curso publicado contém ao menos uma Aula existente.
- [ ] Ordem de `aulaSlugs` é preservada.
- [ ] Curso funciona sem pertencer a Trilha.
- [ ] Links apontam para a URL canônica da Aula.
- [ ] Não há arquivo MDX duplicado.
- [ ] Contexto no breadcrumb não altera a entidade canônica.
- [ ] Listagem, detalhe, rascunho e 404 têm testes.

### M8 — Trilhas

| ID    | Pri. | Tam. | Item e critério específico de aceite                                                                                               | Dep.          |
| ----- | ---- | ---: | ---------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| M8-01 | P0   |    M | Implementar acesso tipado a Trilhas publicadas na feature `trilhas`; aceito resolvendo `itens` discriminados por tipo.             | M7            |
| M8-02 | P0   |    M | Implementar TrilhaCard por composição de primitivos compartilhados.                                                                | M8-01         |
| M8-03 | P0   |    G | Implementar listagem `/aprendizado/trilhas` ordenada pelo campo `ordem`; aceito com área, descrição e estado vazio.                | M8-02         |
| M8-04 | P0   |    G | Implementar `/aprendizado/trilhas/[trilha]`; aceito exibindo Cursos e Aulas diretas na ordem exata de `itens`.                     | M8-01         |
| M8-05 | P0   |    M | Implementar apresentação visual do percurso com assinatura de circuito; aceito distinguindo Curso e Aula sem sugerir quarto nível. | M8-04         |
| M8-06 | P0   |    M | Preservar URLs canônicas ao navegar da Trilha para Curso ou Aula; nenhuma entidade é aninhada na URL da Trilha.                    | M8-04         |
| M8-07 | P1   |    M | Preservar contexto válido nos breadcrumbs quando a navegação parte de uma Trilha, inclusive `Trilha → Aula` direta.                | M8-04, M8-06  |
| M8-08 | P1   |    P | Gerar metadados e OpenGraph de Trilha a partir do conteúdo estruturado.                                                            | M8-04         |
| M8-09 | P0   |    M | Publicar exemplo de Trilha que combine ao menos um Curso e uma Aula direta.                                                        | M8-04 a M8-07 |
| M8-10 | P0   |    G | Criar testes unitários da resolução discriminada e E2E de ordem mista, contexto, links canônicos, 404 e rascunho.                  | M8-03 a M8-09 |
| M8-11 | P1   |    P | Auditar o percurso em móvel e desktop, incluindo textos que identifiquem o tipo de cada item.                                      | M8-10         |

**Checklist técnico de saída da M8**

- [ ] Trilhas são ordenadas por `ordem`.
- [ ] `itens` mistura Cursos e Aulas diretas corretamente.
- [ ] Ordem contextual é preservada sem prefixos numéricos em arquivos.
- [ ] URLs canônicas continuam independentes da Trilha.
- [ ] Não existe quarto nível nem duplicação de conteúdo.
- [ ] Breadcrumbs mostram somente contexto real.
- [ ] Percurso misto funciona em móvel, teclado e desktop.

### M9 — Busca educacional

| ID    | Pri. | Tam. | Item e critério específico de aceite                                                                                                                    | Dep.          |
| ----- | ---- | ---: | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| M9-01 | P0   |    M | Definir contrato comum de documento de busca e campos indexáveis por tipo, sem apagar as diferenças de domínio.                                         | M8            |
| M9-02 | P0   |    G | Gerar em build-time três índices independentes: Trilhas, Cursos e Aulas; aceito sem rascunhos e sem documentos de outro tipo.                           | M9-01         |
| M9-03 | P0   |    M | Implementar base SearchBar com rótulo acessível, limpeza, estado vazio e atualização controlada.                                                        | M9-01         |
| M9-04 | P0   |    G | Implementar consulta MiniSearch por título, resumo/descrição, conteúdo aplicável e tags, com normalização adequada ao pt-BR.                            | M9-02, M9-03  |
| M9-05 | P0   |    G | Implementar `/aprendizado/trilhas/busca` consultando exclusivamente Trilhas e filtros pertinentes, incluindo área quando disponível.                    | M9-04         |
| M9-06 | P0   |    G | Implementar `/aprendizado/cursos/busca` consultando exclusivamente Cursos e filtros pertinentes, incluindo dificuldade/tags quando disponíveis.         | M9-04         |
| M9-07 | P0   |    G | Implementar `/aprendizado/aulas/busca` consultando exclusivamente Aulas e filtros pertinentes, incluindo dificuldade/categoria/tags quando disponíveis. | M9-04         |
| M9-08 | P0   |    M | Implementar composição busca ∩ filtros e contador de resultados; aceito com atualização instantânea e previsível.                                       | M9-05 a M9-07 |
| M9-09 | P1   |    M | Implementar FilterPanel reutilizável: painel em desktop e Modal/drawer em móvel, mantendo o mesmo conteúdo e foco acessível.                            | M9-05 a M9-07 |
| M9-10 | P1   |    M | Implementar ResultList e estados: inicial, sem resultado, erro de índice e filtros ativos; aceito com ação clara para limpar filtros.                   | M9-08         |
| M9-11 | P1   |    P | Definir persistência de termo e filtros na URL por query string; aceito com link compartilhável e navegação voltar/avançar coerente.                    | M9-08         |
| M9-12 | P0   |    G | Criar testes unitários de indexação, segregação, normalização e interseção, além de E2E das três rotas e drawer móvel.                                  | M9-02 a M9-11 |
| M9-13 | P0   |    M | Medir tamanho dos índices, tempo de carregamento e resposta em dispositivo/rede modestos; aceito sem regressão material frente à baseline.              | M9-12         |
| M9-14 | P1   |    P | Documentar como novos campos entram no índice e os gatilhos para reavaliar busca client-side.                                                           | M9-13         |

**Checklist técnico de saída da M9**

- [ ] Há três índices e três rotas independentes.
- [ ] Trilhas, Cursos e Aulas nunca se misturam.
- [ ] Rascunhos não entram em índice algum.
- [ ] Busca e filtros usam interseção e estados claros.
- [ ] Filtros são específicos para cada classificação.
- [ ] Drawer móvel gerencia foco e fecha por teclado.
- [ ] Query string permite compartilhar e restaurar busca.
- [ ] Tamanho e tempo do índice foram medidos.
- [ ] Não há busca global do site.

### M10 — Projetos

| ID     | Pri. | Tam. | Item e critério específico de aceite                                                                                          | Dep.            |
| ------ | ---- | ---: | ----------------------------------------------------------------------------------------------------------------------------- | --------------- |
| M10-01 | P0   |    M | Implementar acesso tipado a Projetos na feature `projetos`, com ordenação estável e filtro de destaque.                       | M9              |
| M10-02 | P0   |    M | Implementar ProjetoCard com imagem/fallback, descrição curta, status e tecnologias opcionais.                                 | M10-01          |
| M10-03 | P0   |    G | Implementar `/projetos` com listagem responsiva, estado vazio e links canônicos.                                              | M10-02          |
| M10-04 | P0   |    G | Implementar `/projetos/[projeto]` com descrição, status, tecnologias, galeria, vídeo, GitHub e documentação quando presentes. | M10-01          |
| M10-05 | P1   |    G | Implementar ProjetoGaleria acessível, responsiva e otimizada; aceito com controles por teclado e alternativas textuais.       | M10-04          |
| M10-06 | P1   |    P | Implementar ProjetoTecnologias com badges sem transformar tags em navegação inexistente.                                      | M10-04          |
| M10-07 | P0   |    M | Conectar Projetos com `destaque: true` à Home, com limite e ordem documentados.                                               | M10-01, M10-02  |
| M10-08 | P1   |    P | Gerar metadados e OpenGraph de Projeto com imagem/fallback.                                                                   | M10-04          |
| M10-09 | P0   |    M | Publicar ao menos um Projeto representativo com combinações de mídia e links válidos.                                         | M10-04 a M10-06 |
| M10-10 | P0   |    G | Criar testes unitários de destaques e E2E de listagem, detalhe, galeria, links externos, 404 e Home.                          | M10-03 a M10-09 |
| M10-11 | P1   |    P | Auditar carregamento de mídia, responsividade, teclado e ausência segura de campos opcionais.                                 | M10-10          |

**Checklist técnico de saída da M10**

- [ ] Listagem e detalhe consomem MDX tipado.
- [ ] Galeria e mídia têm otimização e acessibilidade.
- [ ] Campos opcionais não geram blocos vazios.
- [ ] Status e tecnologias são claros.
- [ ] Links externos são válidos e seguros.
- [ ] Destaques aparecem na Home por dado estruturado.
- [ ] Projeto representativo e jornadas E2E foram validados.

### M11 — Institucional completo e patrocinadores

| ID     | Pri. | Tam. | Item e critério específico de aceite                                                                                                   | Dep.            |
| ------ | ---- | ---: | -------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| M11-01 | P0   |    M | Consolidar fonte estruturada de missão, áreas de pesquisa e membros; aceito quando Home e `/sobre` não mantêm cópias divergentes.      | M10             |
| M11-02 | P0   |    G | Implementar `/sobre` com missão, história/contexto aprovado, áreas e membros; aceito com conteúdo institucional revisado.              | M11-01          |
| M11-03 | P1   |    M | Criar componentes de área de pesquisa e membro na camada correta; aceito sem promover conceito de domínio específico para `shared/ui`. | M11-01          |
| M11-04 | P0   |    M | Completar seções correspondentes da Home a partir da mesma fonte estruturada.                                                          | M11-01, M11-03  |
| M11-05 | P0   |    M | Implementar SponsorGrid em `/patrocinadores`, respeitando nível opcional e ordem.                                                      | M4-01, M4-06    |
| M11-06 | P1   |    P | Explicar na página de patrocinadores como estabelecer contato/parceria, usando canal institucional aprovado.                           | M11-05          |
| M11-07 | P1   |    P | Gerar metadados e OpenGraph de Sobre e Patrocinadores.                                                                                 | M11-02, M11-05  |
| M11-08 | P0   |    M | Criar testes de consistência dos dados e E2E de Sobre, Home e Patrocinadores.                                                          | M11-02 a M11-07 |
| M11-09 | P1   |    P | Auditar fotos/logos, texto alternativo, links, teclado, responsividade e dados pessoais publicados.                                    | M11-08          |

**Checklist técnico de saída da M11**

- [ ] Missão, áreas e membros têm fonte única.
- [ ] Home e `/sobre` não divergem.
- [ ] Conteúdo institucional foi aprovado pelo GEAR.
- [ ] SponsorGrid e SponsorStrip compartilham os mesmos dados.
- [ ] Imagens, dados pessoais e links foram autorizados.
- [ ] Páginas funcionam em móvel, teclado e desktop.

### M12 — Notícias

| ID     | Pri. | Tam. | Item e critério específico de aceite                                                                                             | Dep.            |
| ------ | ---- | ---: | -------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| M12-01 | P0   |    M | Implementar acesso tipado a Notícias publicadas, ordenadas por data decrescente.                                                 | M11             |
| M12-02 | P0   |    M | Implementar NoticiaCard com capa, título, resumo, data, autor e metadados opcionais.                                             | M12-01          |
| M12-03 | P0   |    G | Implementar `/noticias` com listagem escalável e busca simples exclusiva de Notícias.                                            | M12-02          |
| M12-04 | P0   |    G | Implementar `/noticias/[noticia]` com MDX, metadados e 404 para ausente/rascunho.                                                | M12-01          |
| M12-05 | P0   |    M | Implementar índice de Notícias separado, restrito principalmente a título e semelhança textual; aceito sem filtros educacionais. | M12-03          |
| M12-06 | P1   |    P | Gerar metadados e OpenGraph de Notícia a partir de capa, título e resumo.                                                        | M12-04          |
| M12-07 | P0   |    M | Publicar ao menos uma Notícia representativa revisada editorialmente.                                                            | M12-04          |
| M12-08 | P0   |    G | Criar testes unitários de ordenação/índice e E2E de listar, pesquisar, abrir, 404 e rascunho.                                    | M12-03 a M12-07 |
| M12-09 | P0   |    P | Criar teste negativo que prove que Notícias não aparecem em Aprendizado e vice-versa.                                            | M12-05, M9-02   |
| M12-10 | P1   |    P | Documentar fluxo editorial de Notícias, convenção de slug e revisão de data/autor.                                               | M12-07          |

**Checklist técnico de saída da M12**

- [ ] Notícias publicadas são ordenadas por data.
- [ ] Rascunhos não aparecem em listagem, rota, busca ou sitemap.
- [ ] Busca de Notícias é simples e independente.
- [ ] Não há filtros educacionais nem busca global.
- [ ] Notícias e Aprendizado não se misturam.
- [ ] Publicação editorial está documentada e testada.

### M13 — Qualidade e publicação

| ID     | Pri. | Tam. | Item e critério específico de aceite                                                                                                                                                    | Dep.            |
| ------ | ---- | ---: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| M13-01 | P0   |    G | Configurar CI em toda PR com instalação determinística, formatação, lint, tipos, testes unitários, validação de conteúdo e build.                                                       | M12             |
| M13-02 | P0   |    M | Executar E2E smoke em PR e suíte completa na integração/agenda definida; aceito com artefatos de falha úteis.                                                                           | M13-01          |
| M13-03 | P0   |    M | Configurar proteção/ruleset da `main`: PR obrigatório, uma aprovação humana, CI obrigatório, conversas resolvidas, sem force-push/delete e aprovação invalidada após mudança relevante. | M13-01          |
| M13-04 | P1   |    P | Exigir duas aprovações para dependências, workflows, segurança, deploy ou proposta arquitetural; aceito por CODEOWNERS/regra documentada.                                               | M13-03          |
| M13-05 | P0   |    M | Conectar Vercel com preview por PR e deploy de produção somente após merge em `main`; aceito com proprietário institucional e rollback testado.                                         | M0-04, M13-01   |
| M13-06 | P0   |    M | Gerar `sitemap.xml` apenas com páginas publicadas e rotas canônicas.                                                                                                                    | M12             |
| M13-07 | P0   |    P | Configurar `robots.txt`, URL base e canonical metadata coerentes por ambiente.                                                                                                          | M13-06          |
| M13-08 | P1   |    M | Finalizar OpenGraph global e fallbacks; aceito com preview de compartilhamento para Home e cada tipo de conteúdo.                                                                       | M13-07          |
| M13-09 | P0   |    M | Elaborar `/privacidade` e `/termos` aprovados pela coordenação responsável, descrevendo integrações efetivamente usadas; não mencionar Giscus como ativo se ainda não estiver.          | M12             |
| M13-10 | P0   |    G | Auditar acessibilidade AA: contraste, headings, landmarks, nomes acessíveis, teclado, foco, modal/drawer, mídia e texto alternativo; corrigir bloqueadores.                             | M13-02          |
| M13-11 | P0   |    G | Auditar performance em páginas representativas e rede/dispositivo modestos; corrigir imagens sem dimensão, fontes, JavaScript cliente excessivo e embeds antecipados.                   | M13-02          |
| M13-12 | P1   |    M | Auditar SEO: títulos, descrições, canonical, sitemap, robots, OG, status 404 e links internos.                                                                                          | M13-06 a M13-08 |
| M13-13 | P0   |    M | Auditar segurança e dados: segredos, dependências, links externos, headers aplicáveis, conteúdo MDX confiável e variáveis públicas.                                                     | M13-01, M13-05  |
| M13-14 | P1   |    M | Configurar atualização periódica e controlada de dependências, sempre por PR e sem merge automático de major versions.                                                                  | M13-01          |
| M13-15 | P0   |    M | Criar checklist de release, rollback e incidente; executar ensaio de deploy e rollback.                                                                                                 | M13-05          |
| M13-16 | P1   |    P | Registrar baselines finais de build, bundle/JS cliente, tamanho de índices e métricas web para comparação futura.                                                                       | M13-11          |
| M13-17 | P0   |    M | Executar revisão arquitetural final de dependências e imports; aceito sem violação de camadas ou feature cruzada.                                                                       | M13-01          |
| M13-18 | P0   |    P | Demonstrar que uma PR inválida é bloqueada por cada check crítico; aceito com evidência anexada à Milestone.                                                                            | M13-01 a M13-05 |

**Checklist técnico de saída da M13**

- [ ] CI reproduz instalação, validação, testes e build.
- [ ] `main` é protegida e não aceita push direto.
- [ ] PR exige aprovação humana, checks verdes e conversas resolvidas.
- [ ] Preview e deploy de produção seguem branches corretas.
- [ ] Rollback foi ensaiado.
- [ ] Sitemap, robots, canonical e OpenGraph foram verificados.
- [x] Privacidade e termos refletem apenas o tratamento real de dados; conteúdo aprovado por Tiago Lopes em 16 de julho de 2026.
- [ ] Auditorias de acessibilidade, performance, SEO e segurança não têm bloqueadores.
- [ ] Rascunhos e segredos não vazam.
- [ ] Camadas arquiteturais permanecem íntegras.
- [ ] Baselines estão registradas.

### M14 — Conteúdo real e lançamento

| ID     | Pri. | Tam. | Item e critério específico de aceite                                                                                                                                                             | Dep.           |
| ------ | ---- | ---: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| M14-01 | P0   |    M | Definir pacote mínimo de lançamento com responsáveis editoriais: Aulas, ao menos um Curso, ao menos uma Trilha, Projetos, institucional, patrocinadores e Notícia conforme disponibilidade real. | M13            |
| M14-02 | P0   |    G | Substituir exemplos identificados como fictícios por conteúdo real aprovado, preservando exemplos de teste fora da produção.                                                                     | M14-01         |
| M14-03 | P0   |    G | Fazer revisão técnica dos conteúdos: referências, comandos descritos, mídia, downloads, repositórios, pré-requisitos e ordem.                                                                    | M14-02         |
| M14-04 | P0   |    G | Fazer revisão editorial pt-BR: título, resumo, clareza, autoria, datas, consistência terminológica e direitos de uso.                                                                            | M14-02         |
| M14-05 | P0   |    M | Validar todas as relações reais de Trilha/Curso/Aula e provar que URLs canônicas não mudam entre contextos.                                                                                      | M14-02         |
| M14-06 | P0   |    G | Conduzir teste moderado com estudantes em móvel e desktop cobrindo descoberta, busca, consumo de Aula e exploração de Projeto.                                                                   | M14-03, M14-04 |
| M14-07 | P0   |    M | Classificar achados: bloqueadores antes do lançamento, importantes com responsável/data e melhorias para backlog.                                                                                | M14-06         |
| M14-08 | P0   |    G | Corrigir bloqueadores e repetir jornadas afetadas; aceito sem falhas críticas abertas.                                                                                                           | M14-07         |
| M14-09 | P1   |    M | Atualizar README, CONTRIBUTING, READMEs de features e manual editorial com lições reais do lançamento.                                                                                           | M14-08         |
| M14-10 | P0   |    M | Executar onboarding de uma pessoa nova em até uma tarde, incluindo pequena alteração de conteúdo em PR de teste.                                                                                 | M14-09         |
| M14-11 | P0   |    M | Executar release candidate, smoke test em produção, verificação de links, busca, mídia, sitemap e compartilhamento.                                                                              | M14-08, M14-09 |
| M14-12 | P0   |    P | Registrar aceite de lançamento, responsáveis de operação, canal de incidente e calendário mínimo de revisão de conteúdo/dependências.                                                            | M14-11         |
| M14-13 | P1   |    P | Realizar retrospectiva e mover somente itens não bloqueantes para backlog futuro com contexto e prioridade.                                                                                      | M14-12         |

**Checklist técnico de saída da M14**

- [ ] Conteúdo de produção é real, autorizado e revisado.
- [ ] Relações e URLs canônicas foram validadas.
- [ ] Links, mídia, downloads, autoria e datas estão corretos.
- [ ] Testes com estudantes incluíram móvel e desktop.
- [ ] Não há bloqueador crítico aberto.
- [ ] Documentação reflete a operação real.
- [ ] Uma pessoa nova concluiu onboarding e PR de conteúdo.
- [ ] Smoke test de produção passou.
- [ ] Responsáveis e canal de incidente estão registrados.
- [ ] Retrospectiva e backlog pós-lançamento existem.

### Milestone extra — Login, inscrições e Meu aprendizado (execução autorizada antes da M13)

Esta Milestone extra foi autorizada por **Tiago Lopes** para execução antes da M13, apesar de o planejamento original tratar progresso individual como backlog futuro. A especificação detalhada, os critérios de aceite e os gates estão em [`milestone_login.md`](milestone_login.md).

O escopo autorizado inclui:

- login GitHub por Supabase Auth;
- inscrições em Cursos e Trilhas;
- conclusão e reversão de conclusão de Aulas;
- progresso derivado do conteúdo MDX publicado;
- página `/meu-aprendizado` com dashboard e listas pessoais;
- RLS para impedir acesso aos dados de outro usuário;
- testes de autenticação, isolamento, progresso, acessibilidade e E2E.

O escopo não inclui senha própria, comentários próprios, sincronização de progresso com o GitHub, acesso a repositórios ou outras funcionalidades de conta. A implementação só começa depois dos gates definidos no documento detalhado e da revisão dos critérios de aceite.

### Backlog futuro — fora do MVP

Estes itens não podem ser puxados antes de M14, salvo autorização explícita e documentada em uma exceção arquitetural própria. Cada um exige uma nova decisão de produto e uma Milestone própria.

| ID   | Item                                 | Gatilho de entrada                                                                   | Restrições preservadas                                                                                                     |
| ---- | ------------------------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| F-01 | Integrar Giscus em Aulas             | MVP estável e decisão explícita de ativar comentários                                | Login, persistência, threads, reações e moderação continuam nativos do Giscus/GitHub; nenhuma API, conta ou banco próprio. |
| F-02 | Dark mode                            | demanda comprovada e capacidade de manter dois temas                                 | Derivar dos mesmos tokens; vermelho GEAR permanece assinatura; light continua plenamente suportado.                        |
| F-03 | Progresso individual em Trilha/Curso | substituído pela Milestone extra autorizada antes da M13 | Implementar somente conforme `milestone_login.md`; Supabase Auth/Database, RLS e escopo aprovado; não reutilizar login do Giscus. |
| F-04 | Favoritos/perfis                     | requisito de usuário validado                                                        | Exige revisão arquitetural e LGPD antes de implementar.                                                                    |
| F-05 | Feed RSS de Notícias                 | demanda editorial                                                                    | Deve consumir a coleção existente, sem duplicar conteúdo.                                                                  |
| F-06 | CDN de mídia                         | repositório começando a pesar por imagens/vídeos ou operação editorial ficando lenta | Avaliar Cloudinary/Vercel Blob conforme arquitetura e manter URLs/migração documentadas.                                   |
| F-07 | Busca de servidor                    | índice client-side perceptivelmente lento ou volume muito acima do previsto          | Avaliar Postgres FTS/Algolia sem criar busca global automaticamente.                                                       |
| F-08 | Analytics próprios                   | pergunta concreta de produto que métricas simples não respondem                      | Definir privacidade, base legal, retenção e arquitetura antes de coletar dados.                                            |
| F-09 | CMS visual/painel administrativo     | fluxo Git se tornar impedimento comprovado                                           | Requer mudança arquitetural aprovada; não criar parcialmente dentro do MVP.                                                |
| F-10 | i18n                                 | público não lusófono se tornar prioridade                                            | Requer estratégia de URL, conteúdo e governança editorial antes de traduzir.                                               |
| F-11 | Recursos sociais além do Giscus      | comunidade demonstrar necessidade não atendida                                       | É decisão de produto/arquitetura; não estender o Portal informalmente.                                                     |

---

## 5. Dependências entre módulos

### 5.1 Regra de direção

| Origem                         | Pode depender de                                                             | Não pode depender de                                        |
| ------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `src/app`                      | `features`, `shared`, configuração de rota                                   | regra de negócio própria; parsing MDX próprio               |
| `src/features/<feature>`       | `shared`, coleções de conteúdo geradas e módulos internos da própria feature | outra feature; `app`                                        |
| `src/shared/components/ui`     | React, utilitários genéricos e tokens                                        | qualquer conceito GEAR, feature, rota ou conteúdo           |
| `src/shared/components/layout` | `shared/ui`, `shared/config`                                                 | regra específica de Aula, Curso, Trilha, Projeto ou Notícia |
| `src/shared/lib`               | bibliotecas genéricas e tipos compartilhados                                 | componentes, páginas ou conceitos exclusivos de feature     |
| `src/content`                  | arquivos de mídia pública e referências por slug                             | componentes, funções de aplicação ou conteúdo duplicado     |
| `public`                       | nenhuma camada de código                                                     | lógica, metadados editoriais ou segredos                    |

Toda exceção aparente deve ser resolvida por composição em `app/`, por contrato genérico em `shared/` ou por dado gerado no build. Nunca por importação direta entre features.

### 5.2 Matriz funcional

| Módulo           | Depende de                                       | Consumido por                                               | Contrato principal                               |
| ---------------- | ------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------ |
| `shared/ui`      | tokens e utilitários genéricos                   | todas as features e layouts                                 | propriedades visuais sem vocabulário de domínio  |
| `shared/layout`  | `shared/ui`, `shared/config`                     | layouts em `app`                                            | Header, Footer e Container                       |
| `shared/config`  | constantes versionadas                           | `app`, layout e metadados                                   | navegação, site, redes e URLs base               |
| pipeline MDX     | `content`, schemas e mídia                       | features de conteúdo, sitemap e índices                     | coleções tipadas e apenas conteúdo válido        |
| `aulas`          | coleção de Aulas, `shared`                       | rotas de Aulas e composição em Curso/Trilha via `app`/dados | Aula canônica por slug                           |
| `cursos`         | coleção de Cursos e referências tipadas de Aulas | rotas de Cursos e composição de Trilha                      | lista ordenada de `aulaSlugs`                    |
| `trilhas`        | coleção de Trilhas e referências discriminadas   | rotas de Trilhas e Home                                     | lista ordenada de Curso/Aula                     |
| `busca`          | coleções geradas, contrato de índice e `shared`  | rotas `/busca`                                              | índices segregados por tipo                      |
| `projetos`       | coleção de Projetos e `shared`                   | rotas de Projetos e Home                                    | projetos publicados/destaques                    |
| `noticias`       | coleção de Notícias e `shared`                   | rotas de Notícias                                           | notícias publicadas por data                     |
| `patrocinadores` | dados locais e `shared`                          | layout global, Home e página própria                        | patrocinadores ordenados                         |
| `giscus` futuro  | configuração pública e Giscus externo            | Aula, somente após nova Milestone                           | embed externo; nenhum usuário/comentário interno |
| SEO de rota      | coleções publicadas e `shared/config`            | sitemap, robots e metadados                                 | somente URLs canônicas publicadas                |

### 5.3 Dependências externas autorizadas

Antes de adicionar qualquer pacote, a issue e o PR devem responder:

1. qual problema real ele resolve;
2. por que Next.js, React ou a base atual não resolvem de forma suficiente;
3. qual o custo de manutenção e aprendizado;
4. qual o impacto no cliente, build e lockfile;
5. como estão manutenção, licença e estratégia de saída.

Pacotes previstos por este plano ainda passam por essa análise. Uma nova dependência de produção requer duas aprovações na M13 em diante; uma dependência que mude a arquitetura exige o processo arquitetural antes de qualquer instalação.

---

## 6. Checklists técnicos por etapa de trabalho

Os checklists específicos de cada Milestone estão no backlog. Estes gates se aplicam a toda issue.

### 6.1 Antes de implementar

- [ ] A issue passou pela Definition of Ready.
- [ ] A Milestone anterior está formalmente concluída.
- [ ] A arquitetura e o README da feature foram lidos.
- [ ] Componentes e utilitários existentes foram pesquisados.
- [ ] O contrato de dados e os estados vazio/erro/rascunho estão claros.
- [ ] O responsável sabe quais testes provarão o aceite.
- [ ] Nenhuma biblioteca será adicionada sem a análise de dependência.

### 6.2 Durante a implementação

- [ ] Limites `app`/`features`/`shared` são respeitados.
- [ ] Server Component continua sendo o padrão.
- [ ] Client Component está isolado na menor ilha interativa possível.
- [ ] Não há duplicação de conteúdo nem de componente existente.
- [ ] Estados opcionais não produzem UI vazia ou quebrada.
- [ ] Semântica, teclado, foco e viewport móvel são considerados desde o início.
- [ ] Testes são escritos junto da mudança, não ao final da Milestone.
- [ ] Decisão inesperada é registrada antes de prosseguir.

### 6.3 Antes de abrir PR

- [ ] Branch está atualizada com `main`.
- [ ] Formatação, lint, tipos, testes relevantes, validação de conteúdo e build passam localmente.
- [ ] Nenhum segredo, log temporário, placeholder ou arquivo gerado indevido entrou no diff.
- [ ] Diff contém somente o objetivo da issue.
- [ ] Documentação e exemplos afetados estão atualizados.
- [ ] Capturas de móvel/desktop existem quando há UI.
- [ ] Evidência de acessibilidade e de estados vazios/erro está preparada.
- [ ] Uso de IA e validação humana estão descritos.

### 6.4 Antes do merge

- [ ] CI está verde.
- [ ] Preview foi verificado.
- [ ] Critérios de aceite foram marcados com evidência.
- [ ] Há aprovação humana independente do autor.
- [ ] CODEOWNERS aprovaram áreas críticas quando aplicável.
- [ ] Todas as conversas foram resolvidas.
- [ ] Mudança relevante após aprovação recebeu nova revisão.
- [ ] Não há conflito ou alteração arquitetural implícita.

### 6.5 Depois do merge

- [ ] Deploy/preview integrado foi conferido.
- [ ] Issue foi fechada e ligada ao PR.
- [ ] Branch foi removida.
- [ ] Falha observada virou issue, não conhecimento informal.
- [ ] Métricas ou baselines afetadas foram atualizadas.
- [ ] Gate da Milestone foi reavaliado.

---

## 7. Convenções de código

### 7.1 TypeScript e contratos

- `strict: true` é obrigatório.
- Evitar `any`; em fronteiras desconhecidas, receber `unknown` e validar antes de usar.
- Tipos editoriais devem nascer dos schemas ou de uma única definição, sem versões paralelas manuais.
- Uniões discriminadas devem representar itens de Trilha (`curso` ou `aula`) e estados fechados.
- Campos opcionais permanecem opcionais; a UI deve tratar ausência explicitamente.
- Não usar coerção de tipo para esconder conteúdo inválido.
- Funções públicas de feature devem ter entradas e saídas claras e pequenas.

### 7.2 Componentes React e Next.js

- Componentes possuem responsabilidade única, alta coesão e baixo acoplamento.
- Server Component é o padrão; usar Client Component somente por estado, evento ou API do navegador.
- Componentes de rota apenas carregam dados, definem metadados e compõem features.
- Primitivos genéricos ficam em `shared/components/ui`; conceitos GEAR ficam na feature.
- Preferir composição a variantes extensas ou componentes monolíticos.
- Não criar wrapper sem comportamento, acessibilidade ou consistência que justifique sua existência.
- Exportações padrão ficam restritas aos arquivos exigidos pelo Next.js; módulos comuns usam exportações nomeadas para facilitar refatoração.
- Propriedades de componente devem representar intenção, não detalhes arbitrários de estilo.

### 7.3 Funções, arquivos e imports

- Uma função executa um propósito e tem nome verbal.
- Arquivo com responsabilidades diferentes deve ser dividido; tamanho é sinal, não regra automática.
- Ordem de imports: pacotes externos, `shared`, coleção/infraestrutura autorizada, módulos internos da feature, estilos/tipos locais.
- Não usar caminhos relativos profundos quando houver alias oficial.
- Evitar barrel files amplos que escondam ciclos ou aumentem acoplamento; usar apenas pontos de entrada pequenos e intencionais.
- Constantes globais ficam em `shared/config`; constantes específicas ficam na feature.
- Remover código morto, comentários temporários e flags sem plano de retirada.

### 7.4 Erros e observabilidade

- Erros de validação de conteúdo devem citar entidade, slug/arquivo, campo e ação corretiva.
- A interface pública não deve exibir stack trace ou detalhe interno.
- Falha opcional de mídia deve ter fallback; falha de integridade editorial deve bloquear build.
- Logs de desenvolvimento não permanecem no cliente em produção.
- Não introduzir plataforma própria de analytics ou monitoramento no MVP.

### 7.5 Estilo e acessibilidade

- Usar tokens oficiais; não repetir hex de marca ou valores de espaçamento sem necessidade.
- Tailwind deve expressar os tokens, não criar uma segunda paleta informal.
- Layout deve funcionar primeiro em móvel e crescer progressivamente.
- Elementos interativos usam HTML semântico antes de ARIA customizada.
- Foco nunca é removido sem substituto visível.
- Ícone não é o único indicador de estado.
- Animações respeitam 150–200 ms, `ease-out` e preferência por movimento reduzido.
- Imagens têm dimensões e texto alternativo apropriado; imagens decorativas são identificadas como tal.

### 7.6 Comentários no código

- Comentar **por que** existe uma restrição ou decisão não óbvia, não narrar o que o código faz.
- TODO exige issue vinculada, contexto e condição de remoção.
- Não usar comentário para compensar nome ruim ou função excessivamente grande.
- Decisão duradoura pertence a ADR/documentação, não apenas a comentário.

---

## 8. Convenções de nomenclatura

| Elemento                   | Convenção                                                        | Exemplo conceitual                                   |
| -------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| Domínio/feature            | português, plural, minúsculas, sem acento                        | `aulas`, `noticias`, `patrocinadores`                |
| Pasta de rota              | kebab-case/minúscula conforme URL pt-BR sem acento               | `aprendizado`, `patrocinadores`                      |
| Rota dinâmica              | nome singular do parâmetro                                       | `[aula]`, `[curso]`, `[trilha]`                      |
| Componente React           | PascalCase, substantivo descritivo                               | `AulaBanner`, `ProjetoGaleria`                       |
| Pasta de componente        | PascalCase quando o componente possui arquivos associados        | `AulaConteudoMDX/`                                   |
| Arquivo utilitário         | kebab-case ou nome técnico já estabelecido, consistente na pasta | `formatar-data.ts`                                   |
| Função/variável            | camelCase; domínio em português                                  | `obterAulaPorSlug`, `aulaSlugs`                      |
| Booleano                   | verbo/predicado explícito                                        | `permiteComentarios`, `estaPublicado`, `temRecursos` |
| Tipo                       | PascalCase, singular, sem prefixo `I` ou `T`                     | `Aula`, `ItemTrilha`                                 |
| Hook                       | `use` + PascalCase/camelCase descritivo                          | `useDebounce` para hook genérico documentado         |
| Constante realmente global | SCREAMING_SNAKE_CASE                                             | `SITE_URL`                                           |
| Teste unitário/componente  | mesmo nome do módulo + `.test`                                   | `formatar-data.test.ts`                              |
| Teste E2E                  | fluxo em kebab-case + `.spec`                                    | `busca-de-aulas.spec.ts`                             |
| Arquivo MDX                | slug canônico em kebab-case, sem prefixo numérico                | `primeiro-blink.mdx`                                 |
| Slug                       | kebab-case, estável, único dentro do tipo                        | `instalando-arduino-ide`                             |
| Branch                     | tipo/ID-slug-curto                                               | `feat/M6-03-aula-canonica`                           |
| Commit                     | tipo e descrição curta no imperativo                             | `feat(aulas): adiciona página canônica`              |

Regras adicionais:

- Não abreviar palavras de domínio (`preRequisitos`, não `preReq`).
- Não usar acentos em identificadores, caminhos ou slugs.
- Não renomear slug publicado casualmente; alteração de URL exige plano de redirecionamento e revisão de links.
- Datas editoriais usam formato inequívoco no conteúdo; exibição pública é pt-BR.
- Termos genéricos já definidos na arquitetura, como Button, Card e SearchBar, mantêm o nome aprovado.

---

## 9. Organização das branches

### 9.1 Modelo

- `main`: única branch permanente, sempre potencialmente publicável e protegida.
- Não haverá `develop`, branches por Milestone nem branches pessoais permanentes.
- Toda mudança parte da `main` atualizada e retorna por Pull Request.
- Branch deve viver poucos dias. Se crescer demais, dividir a issue e os PRs.

### 9.2 Prefixos

| Prefixo     | Uso                                                  |
| ----------- | ---------------------------------------------------- |
| `feat/`     | nova capacidade do produto                           |
| `fix/`      | correção de defeito                                  |
| `content/`  | conteúdo MDX ou dado editorial sem mudança funcional |
| `docs/`     | documentação                                         |
| `test/`     | cobertura ou infraestrutura de testes sem feature    |
| `refactor/` | reorganização interna sem mudança observável         |
| `chore/`    | manutenção e ferramentas                             |
| `ci/`       | workflows, deploy e automação                        |

Formato: `<tipo>/<ID>-<descricao-curta>`. Exemplo: `content/M14-04-revisao-aulas-arduino`.

### 9.3 Proteções

- Push direto, force-push e exclusão de `main` são proibidos.
- Merge exige PR, checks obrigatórios e aprovação humana.
- Branch desatualizada deve ser sincronizada antes do merge quando houver risco de integração.
- Branch integrada é excluída.
- Hotfix também usa branch e PR; urgência reduz o escopo, não elimina revisão e CI.

---

## 10. Estratégia de Pull Requests

### 10.1 Escopo e tamanho

- Um PR resolve uma issue e possui um objetivo principal.
- Meta: até cerca de 400 linhas líquidas de lógica/UI alteradas, desconsiderando lockfile, arquivos gerados e conteúdo editorial volumoso. Ultrapassar exige justificativa ou divisão.
- Refatoração não relacionada não entra em PR de feature.
- Mudança arquitetural nunca fica escondida em PR de implementação.
- PR de conteúdo deve separar revisão editorial de mudança estrutural sempre que possível.

### 10.2 Descrição obrigatória

Todo PR informa:

- issue e item do backlog;
- problema e solução em linguagem simples;
- dentro e fora do escopo;
- módulos, rotas e conteúdo afetados;
- como validar localmente;
- testes executados e evidências;
- capturas móvel/desktop para UI;
- impacto em acessibilidade, performance, conteúdo e documentação;
- dependência adicionada e análise dos cinco critérios, se houver;
- riscos, limitações e rollback;
- uso de IA: tarefa delegada, partes geradas e validação humana realizada.

### 10.3 Revisão

- Exigir uma aprovação humana de pessoa diferente do autor.
- Exigir duas aprovações para dependências, CI/workflows, deploy, segurança, dados pessoais ou proposta arquitetural.
- Autor não resolve unilateralmente uma solicitação de mudança sem resposta e evidência.
- Comentários bloqueantes devem explicar risco e condição de aceite; sugestões opcionais devem ser marcadas como não bloqueantes.
- Push relevante após aprovação invalida a aprovação anterior.
- Revisar primeiro arquitetura e comportamento; depois testes, acessibilidade, clareza e estilo.

### 10.4 Merge e rastreabilidade

- Usar squash merge.
- Título final segue Conventional Commits com escopo quando útil.
- Mensagem liga issue e descreve o resultado, não a sequência de tentativas.
- Merge somente com preview conferido, CI verde e conversas resolvidas.
- Reversão usa novo PR sempre que a situação permitir.

### 10.5 Trabalho com IA

- IA recebe issue fechada, documentos da Parte A, arquivos permitidos e critérios de aceite.
- IA não decide mudança arquitetural nem amplia escopo.
- Saída de IA é tratada como contribuição não confiável até revisão, execução dos testes e inspeção do diff.
- O responsável humano valida imports, segurança, acessibilidade, conteúdo e licenças.
- Não enviar segredos, dados pessoais não públicos ou credenciais a modelos.
- Uma segunda IA pode fazer revisão preliminar, mas não substitui aprovação humana.

---

## 11. Estratégia de testes

### 11.1 Princípio

Testar contratos e jornadas de risco, não detalhes de implementação. A suíte deve permanecer compreensível e rápida o suficiente para ser executada por estudantes em cada PR.

### 11.2 Camadas

| Camada                | Ferramenta                                                       | Foco                                              | Exemplos obrigatórios                                                                        |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Validação de conteúdo | Vitest                                                           | schemas, slugs, relações, rascunhos, datas, mídia | campo ausente, slug duplicado, referência inexistente, Curso vazio, ciclo, rascunho excluído |
| Unidade               | Vitest                                                           | funções puras e transformações                    | ordenação, data, dados derivados, normalização da busca                                      |
| Componente            | Vitest + React Testing Library                                   | componentes síncronos e interativos isolados      | SearchBar, FilterPanel, estados opcionais, foco de modal                                     |
| Integração de build   | comandos do projeto                                              | geração de coleções, páginas e índices            | MDX válido gera; inválido bloqueia; sitemap não inclui rascunho                              |
| E2E                   | Playwright                                                       | jornadas reais e Server Components                | navegação, Aula, Curso, Trilha mista, buscas segregadas, Projeto, Notícia, 404               |
| Acessibilidade        | consultas semânticas, Playwright e auditoria automatizada/manual | WCAG AA e operação por teclado                    | foco, nomes acessíveis, landmarks, contraste, drawer, mídia                                  |
| Performance           | build, métricas web e auditoria de páginas representativas       | baixo custo em móvel/rede universitária           | imagens, fontes, JS cliente, vídeos lazy, índices                                            |
| Revisão visual        | preview e capturas direcionadas                                  | regressões de layout                              | Home, listagens, Aula e busca em móvel/desktop                                               |

O Next.js recomenda E2E para Server Components assíncronos que ainda não são plenamente cobertos por runners unitários. Por isso, não se deve forçar a renderização unitária de páginas assíncronas; testar a função pura separadamente e a página pelo navegador.

### 11.3 Pirâmide e critérios por mudança

- Função pura alterada: teste unitário de sucesso e limites.
- Schema/relação alterado: teste de conteúdo válido e cada erro novo.
- Componente interativo alterado: teste por papel/nome acessível e E2E da jornada relevante.
- Rota alterada: smoke E2E de sucesso, rascunho/404 quando aplicável e metadados essenciais.
- Busca alterada: unidade para segregação/normalização/interseção e E2E nas três classificações.
- UI alterada: evidência móvel/desktop, teclado e estado vazio/erro.
- Dependência ou build alterado: instalação limpa e build de produção.

### 11.4 Jornadas E2E mínimas do MVP

1. Home → Aprendizado → Aulas → Aula canônica.
2. Curso independente → Aulas na ordem definida → voltar ao contexto.
3. Trilha com Curso + Aula direta → destinos canônicos corretos.
4. Busca de Trilhas não retorna Curso/Aula.
5. Busca de Cursos não retorna Trilha/Aula.
6. Busca de Aulas não retorna Trilha/Curso/Notícia.
7. Busca de Notícias não retorna Aprendizado.
8. Rascunho e slug inexistente não são públicos.
9. Projeto em destaque na Home → detalhe e links.
10. Menu e filtros móveis funcionam somente por teclado.
11. Sitemap contém publicados e exclui rascunhos.
12. Rotas legais e 404 oferecem navegação válida.

### 11.5 Dados de teste

- Fixtures pequenas e explícitas, separadas do conteúdo real de produção.
- Conjunto mínimo cobre Aula avulsa, Curso independente e Trilha mista.
- Incluir acentos, tags ausentes, mídia ausente, datas e texto pt-BR na busca.
- Casos inválidos ficam em fixtures de teste e nunca em `content/` de produção.
- Testes não dependem de ordem do sistema de arquivos, relógio local ou rede externa.
- Giscus, quando futuro, deve ser simulado nos testes comuns; um teste separado valida apenas o carregamento do embed.

### 11.6 Cobertura e qualidade da suíte

- Não perseguir porcentagem global que incentive testes superficiais de páginas declarativas.
- Na M13, validação de conteúdo, resolução de relações e busca devem ter cobertura alta de branches, com todas as regras arquiteturais representadas por casos positivos e negativos.
- Toda correção de bug começa por um teste que reproduz a falha quando viável.
- Evitar snapshots grandes; preferir expectativas semânticas e resultados observáveis.
- Teste instável deve ser corrigido ou isolado com issue, responsável e prazo curto; não pode ser simplesmente repetido até passar.
- Tempo da suíte deve ser monitorado. Testes rápidos rodam em toda PR; E2E completa pode rodar após integração e em agenda, mantendo smoke crítico obrigatório na PR.

### 11.7 Matriz de execução

| Momento                 | Verificações                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------- |
| Durante desenvolvimento | teste focal em watch, tipos da área e preview local                                |
| Antes da PR             | formatação, lint, tipos, unidade, conteúdo, build e E2E afetado                    |
| Toda PR                 | instalação limpa, formatação, lint, tipos, unidade, conteúdo, build e smoke E2E    |
| Merge em `main`         | suíte E2E completa, deploy e smoke de produção                                     |
| Semanal/agendado        | dependências, links, suíte completa e regressões acumuladas                        |
| Antes do lançamento     | matriz de navegadores/viewports, a11y, performance, SEO, segurança e conteúdo real |

---

## 12. Estratégia de documentação

### 12.1 Mapa documental

| Documento                    | Função                                       | Responsável por manter         | Atualizar quando                          |
| ---------------------------- | -------------------------------------------- | ------------------------------ | ----------------------------------------- |
| Parte A — arquitetura        | fonte de verdade estrutural                  | liderança/arquitetura aprovada | decisão arquitetural mudar                |
| `development-plan.md`        | sequência, backlog, qualidade e governança   | Tech Lead/facilitador          | Milestone, risco ou processo mudar        |
| `README.md`                  | entrada técnica rápida                       | mantenedores do repositório    | instalação/comandos/stack mudar           |
| `CONTRIBUTING.md`            | fluxo de contribuição                        | Tech Lead                      | branches, PR, testes ou revisão mudar     |
| README por feature           | propósito, limites, entradas e saídas        | dono atual da feature          | contrato ou estrutura da feature mudar    |
| Manual editorial             | criar/revisar MDX e mídia                    | responsável editorial          | schema ou publicação mudar                |
| ADRs                         | decisões técnicas relevantes e substituíveis | proponente + aprovadores       | nova decisão for aprovada                 |
| Runbook de release/incidente | deploy, rollback e contatos                  | responsável de operação        | infraestrutura mudar ou ocorrer incidente |
| Changelog/releases           | impacto entregue                             | responsável da release         | lançamento ocorrer                        |

### 12.2 ADR mínimo

Cada ADR contém: contexto, decisão, alternativas consideradas, consequências, compatibilidade com a Parte A, responsáveis, data e condição de revisão. ADR não altera arquitetura sozinho; decisão estrutural só entra em vigor após atualização e aprovação da fonte arquitetural.

### 12.3 Documentação editorial

O manual deve explicar, por entidade:

- localização e convenção do arquivo;
- campos obrigatórios e opcionais;
- slugs e estabilidade de URL;
- relações permitidas e proibidas;
- status rascunho/publicado;
- mídia, texto alternativo, direitos e tamanho recomendado;
- preview local, validação, PR e revisão por outro Editor;
- como corrigir mensagens de erro do pipeline;
- checklist editorial de título, resumo, autoria, data e links.

### 12.4 Política de atualização

- Documentação muda no mesmo PR que altera o comportamento.
- Não duplicar uma regra permanente em vários lugares; apontar para a fonte.
- Exemplos devem ser testáveis e revisados após upgrade de ferramentas.
- Links internos dos documentos entram na verificação periódica.
- A cada fim de semestre, executar revisão de proprietário, instruções de onboarding, acessos e conteúdo institucional.
- Documentação obsoleta é defeito P1 de manutenção, não melhoria opcional.

---

## 13. Estratégia para entrada de novos desenvolvedores

### 13.1 Objetivo mensurável

Uma pessoa nova deve, em até uma tarde:

1. entender o propósito e os itens fora do MVP;
2. explicar as camadas e a regra de dependência;
3. iniciar o ambiente e executar verificações;
4. localizar uma feature e seu conteúdo;
5. fazer uma alteração pequena de documentação ou conteúdo;
6. abrir uma PR correta e responder a uma revisão.

### 13.2 Trilha de onboarding

| Bloco           | Atividade                                                                 | Evidência                                                     |
| --------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1. Contexto     | Ler README, resumo da Parte A, seções 0–3 deste plano e itens fora do MVP | explica produto e prioridades sem inventar autenticação/banco |
| 2. Arquitetura  | Seguir um fluxo `app` → feature → shared → content                        | identifica onde uma mudança deve viver                        |
| 3. Ambiente     | Clonar, instalar, iniciar, testar e fazer build                           | checklist de clone limpo concluído                            |
| 4. Conteúdo     | Criar uma fixture ou rascunho guiado e observar validação                 | entende schema, slug e publicação                             |
| 5. Qualidade    | Rodar lint, tipos, testes e E2E smoke                                     | interpreta uma falha e a corrige                              |
| 6. Contribuição | Resolver uma issue PP/P com buddy e abrir PR                              | PR segue template, escopo e evidências                        |
| 7. Revisão      | Revisar uma PR pequena de outra pessoa                                    | comentário claro e não meramente estilístico                  |

### 13.3 Buddy e progressão

- Cada ingressante recebe um buddy humano por pelo menos as duas primeiras PRs.
- Primeira PR: documentação ou conteúdo pequeno.
- Segunda PR: teste ou correção localizada.
- Terceira PR: pequena mudança funcional dentro de uma feature.
- Acesso de Editor ao repositório segue o time GitHub institucional e princípio de menor privilégio.
- Antes de assumir deploy, CI ou schemas, a pessoa acompanha ao menos uma mudança dessas áreas com um mantenedor.
- Ao final do onboarding, o ingressante aponta uma lacuna documental; corrigir essa lacuna faz parte do processo.

### 13.4 Entrada de agentes de IA

O contexto mínimo enviado a uma IA inclui:

- issue e ID do backlog;
- trechos relevantes da Parte A e deste plano;
- estrutura/README da feature;
- arquivos permitidos e explicitamente proibidos;
- critérios de aceite e comandos de verificação;
- aviso de que arquitetura, escopo e dependências não podem ser alterados.

Toda sessão deve terminar com resumo do que mudou, testes executados, limitações e pontos que exigem revisão humana.

---

## 14. Riscos técnicos do projeto

Escala: probabilidade e impacto **Baixo / Médio / Alto**. O dono é um papel, não uma pessoa fixa.

| ID  | Risco                                                                 |     Prob.     |  Impacto   | Sinal precoce                                              | Mitigação / contingência                                                                  | Dono                    |
| --- | --------------------------------------------------------------------- | :-----------: | :--------: | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------- |
| R01 | Perda de conhecimento na troca de estudantes                          |     Alta      |    Alto    | tarefas dependem de uma única pessoa; docs divergentes     | README por feature, ADR, buddy, revisão semestral e ensaio de onboarding                  | Tech Lead               |
| R02 | Quebra da arquitetura Feature-First                                   |     Média     |    Alto    | imports entre features; lógica em `app`                    | regra documentada, revisão de imports, CODEOWNERS e auditoria M13                         | Tech Lead               |
| R03 | Conteúdo MDX inválido quebrar build/deploy                            |     Média     |    Alto    | erros recorrentes de front-matter ou referência            | schema, mensagens acionáveis, preview, testes e CI bloqueante                             | Editorial + CI          |
| R04 | Slug alterado quebrar URLs e links externos                           |     Média     |    Alto    | renomeação casual de arquivo publicado                     | política de estabilidade, link checking e plano de redirect antes da mudança              | Editorial               |
| R05 | Relações criarem ciclos, duplicação ou hierarquia falsa               |     Média     |    Alto    | Curso vazio, cópia de Aula, quarto nível                   | validação de grafo e testes das combinações permitidas                                    | Conteúdo/Aprendizado    |
| R06 | Rascunho vazar para produção, busca ou sitemap                        |     Baixa     |    Alto    | item não aprovado aparece em preview de produção           | filtro central de publicação e testes negativos em todas as saídas                        | Conteúdo/CI             |
| R07 | Busca misturar domínios                                               |     Média     |    Alto    | Notícia em Aulas ou Curso em Trilhas                       | índices separados, tipos discriminados e testes cruzados negativos                        | Busca                   |
| R08 | Índice client-side crescer e prejudicar rede móvel                    | Baixa inicial |   Médio    | bundle/índice e tempo de interação sobem continuamente     | baseline, orçamento, carregamento por tipo e gatilho de migração                          | Performance             |
| R09 | Excesso de Client Components degradar performance                     |     Média     |   Médio    | diretiva cliente sobe na árvore; JS cresce                 | revisão server-first, ilhas pequenas e baseline de JS                                     | Front-end               |
| R10 | Mídia tornar repositório pesado                                       |     Média     | Médio/Alto | clone/build lentos; arquivos grandes em `public`           | limites editoriais, otimização e migração por gatilho para CDN                            | Editorial + Infra       |
| R11 | Dependência nova ser abandonada ou incompatível                       |     Média     | Médio/Alto | upgrades travados, falhas no App Router                    | análise dos cinco critérios, lockfile, atualizações controladas e saída documentada       | Tech Lead               |
| R12 | Acessibilidade ser tratada somente no final                           |     Média     |    Alto    | componentes sem foco/labels; drawer inacessível            | checklist por issue, testes semânticos e auditoria contínua                               | Front-end/QA            |
| R13 | CI lento ou instável ser ignorado                                     |     Média     |   Médio    | reexecuções frequentes; merges atrasados                   | separar smoke/suíte completa, cache seguro, owner e política contra flaky tests           | CI                      |
| R14 | Credencial ou dado pessoal entrar no Git/IA                           |     Baixa     |    Alto    | `.env` no diff; fotos/dados sem autorização                | `.gitignore`, secret scanning, revisão, mínimo privilégio e política de IA                | Segurança               |
| R15 | Conta de deploy ficar vinculada a aluno que sai                       |     Média     |    Alto    | só uma pessoa controla Vercel/domínio                      | propriedade institucional, dois mantenedores e runbook de recuperação                     | Operação                |
| R16 | PRs de IA parecerem corretas, mas violarem regras                     |     Alta      |    Alto    | diff grande, abstração desnecessária, teste superficial    | issues pequenas, divulgação de IA, revisão humana, CI e validação manual                  | Autor humano            |
| R17 | Conteúdo real atrasar o lançamento                                    |     Alta      |    Alto    | exemplos persistem após M10; sem donos editoriais          | pacote mínimo na M14, responsáveis e revisão editorial paralela dentro da mesma Milestone | Coordenação editorial   |
| R18 | Escopo futuro invadir o MVP                                           |     Média     |    Alto    | Auth, banco, Giscus ou dark mode surgem em PRs atuais      | backlog futuro explícito e rejeição de mudança sem nova Milestone aprovada                | Product Owner/Tech Lead |
| R19 | SEO/legais descreverem integrações inexistentes ou omitirem as ativas |     Média     | Médio/Alto | política genérica copiada; Giscus citado antes da ativação | revisão factual M13 e atualização no mesmo PR de integração                               | Coordenação + Legal     |
| R20 | Dependência de serviços externos causar indisponibilidade             |     Baixa     |   Médio    | preview/deploy falha; mídia externa lenta                  | site majoritariamente estático, fallbacks, runbook e estratégia de saída                  | Operação                |

O registro de riscos deve ser revisto no fechamento de cada Milestone. Risco Alto sem mitigação e responsável bloqueia o início da Milestone seguinte.

---

## 15. Boas práticas durante o desenvolvimento

1. Limitar WIP a uma issue ativa por pessoa; terminar vale mais que começar muitas.
2. Demonstrar o incremento ao final de cada Milestone para estudantes e Editores.
3. Fazer refinamento curto antes de iniciar a Milestone, sem detalhar prematuramente todo o futuro.
4. Preferir PRs pequenos, com risco e rollback claros.
5. Tratar conteúdo como produto: revisão técnica e editorial por pessoas diferentes quando possível.
6. Criar abstração compartilhada somente após necessidade real e nome estável.
7. Medir antes de otimizar e comparar com baselines registradas.
8. Testar primeiro em móvel e teclado nos fluxos educacionais e de busca.
9. Usar estados vazios e dados reais/representativos; não esconder lacunas com lorem ipsum.
10. Manter uma única fonte para navegação, tokens, conteúdo e dados institucionais.
11. Não fazer upgrade grande de framework junto com feature de produto.
12. Reservar uma janela periódica pequena para dependências, links, documentação e dívida técnica.
13. Fazer retrospectiva com ações, responsável e prazo; evitar conclusões sem acompanhamento.
14. Registrar incidentes e quase-incidentes de forma não punitiva para melhorar o processo.
15. Remover acesso de membros que saem e transferir propriedade institucional ao fim de cada ciclo.
16. Não aceitar “funciona na minha máquina” como evidência; reproduzir em clone limpo, CI ou preview.
17. Não permitir que urgência elimine testes essenciais, revisão humana ou proteção de branch.
18. Manter o backlog futuro separado do MVP e revisar gatilhos com dados, não entusiasmo tecnológico.
19. Quando a arquitetura não responder algo, documentar a decisão e justificativa antes de implementar.
20. Se uma regra da Parte A deixar de representar a realidade, interromper a mudança estrutural, atualizar e aprovar a fonte de verdade primeiro.

---

## 16. Cadência e governança

### 16.1 Ritos mínimos

- **Início da Milestone:** confirmar gate anterior, objetivo, riscos, responsáveis e issues prontas.
- **Acompanhamento semanal:** revisar fluxo, bloqueios, riscos e WIP; não usar como relatório individual de horas.
- **Demonstração:** executar o cenário obrigatório da Milestone no preview.
- **Fechamento:** conferir checklist, documentação, métricas e aceite; somente então liberar a próxima Milestone.
- **Fim de semestre:** rotacionar acessos, testar onboarding, rever donos de áreas e atualizar runbooks.

### 16.2 Papéis operacionais

| Papel                      | Responsabilidade                                                        |
| -------------------------- | ----------------------------------------------------------------------- |
| Product Owner/coordenação  | prioridade de produto, conteúdo institucional e aceite de escopo        |
| Tech Lead                  | integridade arquitetural, plano, riscos técnicos e qualidade de revisão |
| Responsável editorial      | schemas na prática, qualidade MDX, direitos de mídia, autores e datas   |
| Responsável de CI/operação | workflows, Vercel, domínio, deploy, rollback e acessos                  |
| Pessoa desenvolvedora      | issue, implementação, testes, documentação e resposta à revisão         |
| Pessoa revisora            | comportamento, arquitetura, testes, acessibilidade e clareza            |
| IA assistente              | execução delimitada e análise preliminar sob supervisão humana          |

Uma pessoa pode acumular papéis, mas nenhuma área crítica deve depender de uma única conta ou de conhecimento não documentado.

### 16.3 Critério final de sucesso

O plano terá cumprido seu objetivo quando a equipe conseguir entregar o MVP na ordem definida, publicar e manter conteúdo por MDX/PR, preservar as relações flexíveis de aprendizado, operar o site sem autenticação ou banco próprios e transferir a manutenção para uma nova geração sem redefinir decisões arquiteturais.

---

## Referências operacionais externas

Estas referências não substituem a Parte A; apenas sustentam as escolhas de ferramentas e governança deste plano.

- [Next.js — visão geral de estratégias de teste](https://nextjs.org/docs/app/guides/testing)
- [Next.js — Vitest e React Testing Library](https://nextjs.org/docs/app/guides/testing/vitest)
- [MiniSearch — repositório e documentação oficial](https://github.com/lucaong/minisearch)
- [GitHub — proteção de branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub — revisão de Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)

---

## ADENDO MILESTONE_LOGIN

**Data:** 16 de julho de 2026

**Status:** planejamento validado; implementação não iniciada

**Especificação detalhada:** [`milestone_login.md`](milestone_login.md)

### Compatibilidade e precedência limitada

A Milestone extra é **compatível de forma condicionada** com o Portal GEAR porque as seções 2.4.2 e 2.4.3 da arquitetura e a seção 19.5 do Project Rules registram uma exceção explícita para Supabase Auth, Supabase Database, inscrições e progresso individual. A exceção não altera o modelo editorial: Aulas, Cursos e Trilhas continuam em MDX/Velite, e o banco guarda somente relações pessoais com identificadores canônicos de conteúdo.

Este adendo prevalece apenas sobre as afirmações do plano original que colocam autenticação, banco e progresso individual fora de qualquer execução anterior à M14. Permanecem válidas todas as demais restrições: Feature-First, `app` somente para rota e composição, direção `app` → `features` → `shared`, ausência de importação direta entre features, Server Components como padrão, conteúdo editorial em MDX, dependências justificadas e desenvolvimento incremental.

A Milestone não duplica outra entrega. Ela substitui operacionalmente o item futuro F-03 e não inclui comentários, favoritos, perfil social, CMS, painel administrativo ou analytics.

### Conflitos identificados e resolução adotada no planejamento

| Fonte | Conflito | Alternativas | Recomendação deste adendo |
| --- | --- | --- | --- |
| Seções 0.1, 1.1, 1.4, R18 e 16.3 deste plano | O texto original proíbe autenticação, banco, progresso e trabalho fora do MVP. | Rejeitar a Milestone; reescrever o plano original; ou registrar exceção delimitada. | Manter o plano histórico e aplicar esta exceção somente ao escopo de `milestone_login.md`. |
| Project Rules 19.5 e 19.7 | A seção 19.5 autoriza a exceção antes da M13, enquanto 19.7 mantém progresso fora do MVP inicial. | Tratar a exceção como redefinição total do MVP; ou como incremento extraordinário fora do baseline original. | Tratar como incremento extraordinário aprovado, sem liberar os demais itens fora do MVP. |
| Regra de desenvolvimento incremental e ordem M0–M14 | “Antes da M13” não define uma posição exata nem o número definitivo da entrega. | Manter uma Milestone sem número; inserir após qualquer Milestone; ou renumerar as etapas finais. | Aprovado: **M12 → M13 Login e Meu aprendizado → M14 Qualidade e publicação → M15 Conteúdo real e lançamento**. O roadmap passa a ter 16 Milestones, de M0 a M15. |
| Regra de não importar features entre si | O cálculo de progresso precisa das relações de Aulas, Cursos e Trilhas. | Importar as features educacionais; mover o domínio para `shared`; ou consumir diretamente as coleções geradas. | A feature pessoal consome as coleções tipadas geradas pelo Velite e contém seus próprios seletores de progresso; não importa `features/aulas`, `features/cursos` ou `features/trilhas`. |
| `milestone_login.md`, integração “somente no navegador” | OAuth no App Router pode exigir callback, troca de código e renovação segura de cookies no servidor. | Cliente puro; integração híbrida oficial; ou backend próprio. | Usar integração híbrida mínima do SDK oficial: clientes browser/server e Route Handler de callback, sem API de domínio própria. A exceção prevista no próprio documento fica acionada por necessidade concreta de autenticação. |
| `milestone_login.md`, histórico de conteúdo removido | Um trecho diz que Aula removida desaparece do histórico; outros critérios exigem indicação de conteúdo indisponível. | Excluir o registro; manter snapshot; ou preservar só identificador e data. | Aprovado: remover também os registros de conclusão daquele slug. A Aula some do histórico, nada editorial ou pessoal é preservado e o progresso é recalculado com o conteúdo publicado restante. |

### Numeração oficial após o adendo

| Sequência | Milestone válida após este adendo | Observação |
| ---: | --- | --- |
| 12 | M12 — Notícias | Mantém número e escopo atuais. |
| 13 | M13 — Login, inscrições e Meu aprendizado | Nova Milestone deste adendo. |
| 14 | M14 — Qualidade e publicação | Corresponde à antiga M13 do corpo original do plano. |
| 15 | M15 — Conteúdo real e lançamento | Corresponde à antiga M14 do corpo original do plano. |

Nas seções anteriores a este adendo, toda referência à antiga M13 deve ser lida como M14, e toda referência à antiga M14 deve ser lida como M15. O conteúdo e os gates dessas duas Milestones não mudam; somente seus números e dependências finais são deslocados em uma posição.

### Objetivo

Permitir login com GitHub e oferecer uma área pessoal `/meu-aprendizado` na qual a pessoa possa administrar inscrições em Cursos e Trilhas, marcar ou desmarcar Aulas concluídas e acompanhar progresso calculado sobre o conteúdo MDX publicado.

### Escopo incluído

- autenticação e logout por GitHub via Supabase Auth;
- sessão válida em desenvolvimento, preview e produção;
- preservação segura da rota de origem no fluxo de login;
- inscrições idempotentes em Cursos e Trilhas e remoção explícita de inscrição;
- conclusão e reversão idempotentes de Aulas;
- cálculo derivado de progresso de Curso e Trilha;
- dashboard e listas pessoais em `/meu-aprendizado`;
- estados de visitante, carregamento, vazio, sucesso, erro e sessão expirada;
- banco mínimo, migrations versionadas, constraints, índices, grants e RLS por usuário;
- metadata, `noindex`, exclusão de `/meu-aprendizado` do sitemap e atualização das rotas antes provisórias;
- atualização de `/privacidade` e `/termos` antes de ativar login em produção;
- documentação de configuração, operação, exclusão de dados pessoais e aceite explícito do risco de não haver recuperação;
- categoria `Configurações` na navegação esquerda de `/meu-aprendizado`, contendo inicialmente apenas a exclusão permanente da conta;
- testes unitários, de componente, banco/RLS, integração, acessibilidade e E2E.

### Escopo explicitamente excluído

- senha própria, cadastro manual ou recuperação de senha pelo Portal;
- tabela de perfil social ou perfil público elaborado;
- comentários, curtidas, seguidores, feed, ranking ou competição;
- favoritos, certificados e recomendações personalizadas;
- acesso a repositórios, organizações, Issues, Gists ou progresso do GitHub;
- painel administrativo ou CMS visual;
- analytics próprios;
- progresso parcial de vídeo/leitura ou estado persistido de Aula “em andamento”;
- snapshots de títulos, descrições ou corpos MDX no Supabase;
- sincronização entre o login do Portal e o login futuro do Giscus;
- migração do Supabase para propriedade institucional ou criação de segundo mantenedor/plano de recuperação nesta fase.

### Pré-requisitos e dependências

1. A nova M13 pode começar sobre o estado atual do projeto sem comprovação formal dos gates M6–M12, por decisão explícita de Tiago Lopes. Isso não declara essas Milestones concluídas; lacunas técnicas encontradas que bloqueiem Login, Cursos, Trilhas, Aulas ou progresso devem ser corrigidas dentro da M13.
2. Conteúdo publicado de Aulas, Cursos e Trilhas validado, com slugs canônicos estáveis.
3. Tiago Lopes é o único responsável humano, proprietário temporário do Supabase e responsável final pelo aceite. Não haverá segundo mantenedor nem plano de recuperação nesta fase; revisões técnicas de segurança, banco, RLS e exclusão serão feitas por IAs.
4. Projeto Supabase e OAuth App do GitHub configurados sem credenciais no repositório.
5. URLs de site, callback e retorno serão preenchidas durante a configuração de desenvolvimento, previews e produção; não são decisão pendente de arquitetura.
6. Modelo físico mínimo, RLS, exclusão de conteúdo, arredondamento por piso e exclusão de conta conforme as decisões aprovadas neste adendo.
7. `/privacidade` e `/termos` foram aprovados por Tiago Lopes em 16 de julho de 2026. A verificação da retenção técnica de backups permanece obrigatória antes de ativar Login em produção.
8. Testes de banco e RLS usarão Supabase local no CI, sem contas ou dados pessoais reais.

### Áreas e arquivos provavelmente afetados

- `package.json` e `package-lock.json`: SDKs oficiais estritamente necessários e comandos de teste/migration;
- `.env.example` e documentação de ambiente: URL, chave publicável e callbacks, nunca service role no cliente;
- `supabase/config.toml`, `supabase/migrations/*` e testes SQL/RLS: infraestrutura versionada;
- `src/shared/lib/supabase/client.ts` e `src/shared/lib/supabase/server.ts`: fronteira técnica genérica;
- `src/features/autenticacao/*`: login, logout, sessão e ações de conta no Header;
- `src/features/meu-aprendizado/components/*`, `data/*`, `services/*`, `types.ts` e `README.md`: domínio pessoal e progresso;
- `src/app/(site)/login/page.tsx` e `src/app/(site)/meu-aprendizado/page.tsx`: rotas e composição;
- `src/app/auth/callback/route.ts`: troca do código OAuth e retorno validado;
- `src/app/api/conta/route.ts`: exclusão autenticada da conta por operação privilegiada exclusivamente no servidor;
- `src/app/(site)/layout.tsx`, `src/shared/components/layout/Header.tsx` e `src/shared/config/site.ts`: composição do acesso de conta sem tornar o layout público dependente do banco;
- páginas/componentes de Curso, Trilha e Aula: slots de composição para inscrição e conclusão, sem imports cruzados entre features;
- geração de sitemap/robots/metadata quando existente e testes que hoje esperam 404 em `/login` ou `/meu-aprendizado`;
- `src/app/(site)/privacidade/page.tsx` e `src/app/(site)/termos/page.tsx`;
- `tests/unit/*`, `tests/e2e/*` e nova suíte de integração/RLS;
- README, documentação operacional e documento de continuidade.

### Plano executável

| ID | Pri. | Tam. | Etapa e critério específico de aceite | Dependência |
| --- | --- | ---: | --- | --- |
| ML-01 | P0 | P | Registrar o ADR da exceção e as decisões aprovadas neste adendo; aceito com nova numeração M13–M15, modelo mínimo, `floor`, remoção definitiva de conteúdo, exclusão de conta e fronteira OAuth documentados. | M12 |
| ML-02 | P0 | M | Avaliar e registrar os cinco critérios das dependências Supabase; aceito com versão fixada, licença, impacto, manutenção e estratégia de saída documentados. | ML-01 |
| ML-03 | P0 | M | Configurar projeto Supabase, GitHub OAuth e ambientes sob propriedade exclusiva de Tiago Lopes; aceito com callback e retorno funcionando em desenvolvimento, preview e produção, sem segredo no Git. | ML-02 |
| ML-04 | P0 | M | Versionar o schema mínimo de duas tabelas descrito neste adendo; aceito com chaves compostas, unicidade, `on delete cascade`, timestamps, check de tipo e índices de consultas recentes. | ML-03 |
| ML-05 | P0 | G | Aplicar grants mínimos e RLS para SELECT/INSERT/UPDATE/DELETE; aceito quando usuário A não lê nem altera dados de B, visitante não acessa dados pessoais e `user_id` não pode ser forjado. | ML-04 |
| ML-06 | P0 | G | Implementar fronteiras browser/server e callback OAuth; aceito com login, cancelamento, erro, logout, renovação/expiração de sessão e retorno seguro à origem. | ML-03, ML-05 |
| ML-07 | P0 | M | Implementar contratos e seletores puros de conteúdo/progresso dentro de `meu-aprendizado`; aceito sem imports entre features e sem copiar conteúdo para o banco. | ML-01 |
| ML-08 | P0 | G | Implementar inscrição, remoção e reinscrição de Curso/Trilha; aceito com operações idempotentes, confirmação quando houver progresso e preservação das conclusões. | ML-05 a ML-07 |
| ML-09 | P0 | G | Implementar conclusão e reversão de Aula; aceito somente após confirmação do Supabase, incluindo Aula avulsa e atualização coerente da atividade relacionada. | ML-05 a ML-07 |
| ML-10 | P0 | G | Implementar `/meu-aprendizado` com resumo, filtros por query string, listas, estados completos e categoria `Configurações` na navegação esquerda; aceito em mobile, desktop, teclado e leitor de tela. | ML-08, ML-09 |
| ML-11 | P1 | M | Integrar controles pessoais em Header, Curso, Trilha e Aula por composição/slots; aceito sem consulta obrigatória ao banco para renderizar o conteúdo público e sem importação direta entre features. | ML-06, ML-08, ML-09 |
| ML-12 | P0 | M | Implementar metadata, `noindex`, sitemap e comportamento de rotas; aceito com páginas pessoais fora do sitemap e conteúdo público inalterado para visitantes. | ML-10 |
| ML-13 | P0 | M | Implementar em `Configurações` o botão `Excluir minha conta`, confirmação explícita e Route Handler server-only que exclui o usuário do Supabase Auth; aceito quando o cascade apaga inscrições/conclusões, encerra a sessão e nenhum segredo privilegiado chega ao navegador. | ML-05, ML-06, ML-10 |
| ML-14 | P0 | M | Privacidade e termos foram atualizados e aprovados por Tiago Lopes em 16 de julho de 2026; concluir verificando e registrando a retenção técnica de backups do plano Supabase usado antes de habilitar Login em produção. | ML-03, ML-13 |
| ML-15 | P0 | G | Criar suíte automatizada com Supabase local no CI e executar validação completa; aceito com isolamento, idempotência, progresso, exclusão de conta, OAuth simulado, acessibilidade e jornadas E2E cobertos sem API externa real nem dados reais. | ML-05 a ML-14 |
| ML-16 | P0 | M | Auditar preview e fechar a M13; aceito com demonstração, revisões independentes por IA nas áreas de segurança/dados, aceite final de Tiago Lopes, CI verde, rollback documentado e riscos Altos mitigados ou explicitamente aceitos pelo proprietário. | ML-15 |

### Modelo físico mínimo aprovado

O modelo mais simples usa somente duas tabelas públicas. Não haverá tabela própria de perfil.

```text
learning_enrollments
- user_id uuid not null references auth.users(id) on delete cascade
- content_type text not null check (content_type in ('curso', 'trilha'))
- content_identifier text not null
- enrolled_at timestamptz not null default now()
- last_activity_at timestamptz not null default now()
- primary key (user_id, content_type, content_identifier)

lesson_completions
- user_id uuid not null references auth.users(id) on delete cascade
- lesson_identifier text not null
- completed_at timestamptz not null default now()
- primary key (user_id, lesson_identifier)
```

Índices adicionais ficam limitados às consultas reais do dashboard:

- `learning_enrollments (user_id, last_activity_at desc)`;
- `lesson_completions (user_id, completed_at desc)`.

As migrations devem:

1. criar as duas tabelas, checks, chaves e índices;
2. revogar acesso de `anon`;
3. conceder a `authenticated` somente `select`, `insert`, `update` e `delete` necessários;
4. habilitar RLS nas duas tabelas;
5. criar políticas para leitura, inserção, atualização e exclusão usando o usuário autenticado da sessão: `auth.uid() = user_id`;
6. impedir troca de proprietário com `with check` nas operações de escrita;
7. ser versionadas em `supabase/migrations/` e possuir rollback ou procedimento de reversão documentado.

Esse modelo é suficiente porque Cursos, Trilhas, Aulas, títulos e relações continuam no MDX. O banco registra apenas quem se inscreveu e quais Aulas concluiu.

### Regras objetivas de domínio

- `user_id` é sempre o ID de `auth.users`; identidade do GitHub nunca é chave primária das tabelas pessoais.
- Inscrição é única por `(user_id, content_type, content_identifier)`.
- Conclusão é única por `(user_id, lesson_identifier)`.
- Inserir estado já existente e remover estado ausente são operações idempotentes.
- O banco não valida nem replica títulos ou relações MDX; a aplicação valida o identificador contra as coleções publicadas antes da mutação.
- Curso usa somente Aulas publicadas de `aulaSlugs`; rascunhos e referências inválidas não entram no denominador. O percentual inteiro usa `Math.floor`, portanto `2 / 3 = 66%`.
- Trilha conta cada Curso como um item e cada Aula direta como um item; Curso só conclui o item em 100%.
- Mudança de ordem, título ou descrição não altera conclusão; novo slug é nova identidade até existir migração aprovada.
- A remoção ou despublicação definitiva de uma Aula exige, no mesmo conjunto de mudanças, uma migration que apague de `lesson_completions` todos os registros daquele `lesson_identifier`. A Aula desaparece do histórico e o progresso é recalculado sem ela; nenhum snapshot ou marcador de indisponibilidade é mantido.
- A ação de abandonar uma inscrição usa texto específico por contexto: `Sair do curso` ou `Sair da trilha`. Essa ação remove somente a inscrição e não exclui a conta nem as conclusões de outras Aulas.
- `Excluir minha conta` fica em `Configurações`, exige confirmação explícita, exclui o usuário do Supabase Auth no servidor e usa `on delete cascade` para remover imediatamente os dados da aplicação.
- A confirmação visual de exclusão usa um modal com aviso de irreversibilidade e botão final `Excluir permanentemente`.
- O Header público deve continuar renderizável sem leitura obrigatória das tabelas pessoais; estado de conta fica em ilha pequena e tolerante a falha.
- Nenhuma chave service role ou segredo do GitHub é enviado ao navegador.

### Critérios objetivos de conclusão

- Login e logout GitHub funcionam nos três ambientes e tratam cancelamento/erro sem sessão falsa.
- Retorno à origem aceita apenas destinos internos válidos e a ação original não é duplicada.
- Visitantes continuam lendo e pesquisando todo conteúdo público sem conta.
- Inscrição, remoção, conclusão e reversão são idempotentes e exibem feedback acessível.
- Progresso de Curso e Trilha corresponde às regras aprovadas e não duplica Aulas.
- `/meu-aprendizado` cobre resumo, andamento, concluídos, Aulas concluídas, `Configurações`, estados vazios, erro, lista longa e sessão expirada.
- Usuário A não lê, cria, altera ou remove dados do usuário B em nenhuma operação coberta.
- Conteúdo editorial permanece exclusivamente em MDX/Velite; Aula removida não deixa conclusão ou snapshot persistido.
- `/login` e `/meu-aprendizado` usam `noindex`; `/meu-aprendizado` não entra no sitemap.
- Privacidade e termos foram aprovados; a retenção de backups ainda precisa ser conferida no plano de produção e registrada como evidência.
- Testes não dependem de serviço externo real nem de conta/dado pessoal real.
- Lint, tipos, testes, conteúdo, build e E2E passam; preview mobile/desktop e teclado foram verificados.

### Testes e validações obrigatórios

- **Unidade:** progresso 0/100, `floor` incluindo 2/3 = 66%, Curso sem Aula válida, rascunhos, Trilha mista, Aula avulsa, remoção de conteúdo e identificadores estáveis.
- **Componente:** estados de botões, confirmação de remoção, feedback assíncrono, foco, nomes acessíveis, gráfico com equivalente textual e tabs por links.
- **Banco/RLS:** matriz anon/A/B para select, insert, update e delete; tentativa de forjar `user_id`; duplicatas; grants; índices; cascade de exclusão de conta; limpeza de Aula removida; rollback de migration.
- **Integração:** sessão válida/expirada, indisponibilidade do Supabase, mutações idempotentes e composição com coleções Velite.
- **E2E:** login simulado e retorno, acesso anônimo, inscrição/remoção, conclusão/reversão, dashboard, query string, `Configurações`, confirmação/exclusão de conta, mobile e teclado.
- **Segurança:** redirect interno permitido, segredo ausente do bundle/Git, service role ausente do cliente, RLS habilitada em toda tabela exposta e menor privilégio.
- **Projeto:** `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run content:validate`, `npm run build` e `npm run test:e2e`.

### Riscos

| ID | Risco | Prob. | Impacto | Mitigação / gate |
| --- | --- | :---: | :---: | --- |
| ML-R01 | RLS incorreta expor dados entre usuários | Média | Alto | migrations revisadas por duas pessoas e testes negativos A/B bloqueantes |
| ML-R02 | OAuth/cookies quebrarem em preview ou produção | Média | Alto | callbacks por ambiente, integração híbrida oficial e E2E de retorno/expiração |
| ML-R03 | Serviço externo degradar páginas públicas | Média | Alto | conteúdo público independente da sessão, ilhas pequenas e fallbacks |
| ML-R04 | Importação cruzada quebrar Feature-First | Média | Alto | coleções geradas como contrato, composição em `app` e auditoria de imports |
| ML-R05 | Mudança de slug invalidar histórico | Média | Alto | política de slug imutável e migration explícita antes de renomear |
| ML-R06 | Escopo crescer para perfil/social/admin | Alta | Alto | critérios fora do escopo bloqueantes e issues futuras separadas |
| ML-R07 | Conta Supabase pessoal ficar inacessível | Média | Alto | risco aceito temporariamente por Tiago Lopes; não haverá segundo mantenedor nem recuperação nesta fase |
| ML-R08 | LGPD/retenção/exclusão ficarem indefinidas | Média | Alto | aprovação de privacidade, termos e fluxo de exclusão antes de produção |
| ML-R09 | Dashboard adicionar JS excessivo | Média | Médio | Server-first, gráfico simples sem biblioteca quando possível e medição de bundle |

### Decisões aprovadas nesta revisão

1. O roadmap passa a ser **M12 → M13 Login e Meu aprendizado → M14 Qualidade e publicação → M15 Conteúdo real e lançamento**.
2. A integração será híbrida para App Router, com cliente browser, cliente server e Route Handler de callback.
3. O banco usará somente `learning_enrollments` e `lesson_completions`, com chaves compostas, índices mínimos, grants para `authenticated`, RLS por `auth.uid()` e migrations versionadas.
4. O progresso inteiro usa arredondamento por piso (`floor`).
5. Aula removida/despublicada some do histórico; suas conclusões são apagadas e o progresso é recalculado sem guardar snapshot.
6. A navegação esquerda terá `Configurações`, inicialmente apenas com o botão `Excluir minha conta`.
7. A exclusão da conta ocorre no servidor e remove inscrições e conclusões por cascade.

### Decisões operacionais aprovadas nesta revisão

1. Tiago Lopes será o proprietário temporário e único responsável geral pelo projeto, Supabase e GitHub OAuth App.
2. Não haverá segundo mantenedor nem mecanismo de recuperação nesta fase. O risco de indisponibilidade da conta fica explicitamente aceito por Tiago Lopes.
3. Revisões de banco, RLS, exclusão de conta e segurança serão realizadas por IAs; Tiago Lopes fará o aceite humano final. Não se alegará revisão humana independente.
4. A M13 pode começar sem comprovação formal dos gates M6–M12. Isso não muda retroativamente o status dessas Milestones.
5. Licença institucional e onboarding em clone limpo não bloqueiam a M13 e permanecem como dívida operacional do plano geral.
6. A numeração M13–M15 permanecerá harmonizada somente por este adendo nesta fase; arquitetura e `milestone_login.md` não serão reescritos agora.
7. Testes de banco e RLS usarão Supabase local no CI, sem dados reais.
8. Exclusão de conta usará modal com aviso permanente e botão `Excluir permanentemente`.
9. `/privacidade` e `/termos` foram aprovados por Tiago Lopes em 16 de julho de 2026; a retenção técnica de backups será verificada obrigatoriamente antes de ativar Login em produção.

### Pendências que não bloqueiam o início da implementação

- preencher as URLs reais de callback e retorno conforme cada ambiente for configurado;
- ~~redigir e aprovar `/privacidade` e `/termos` antes da produção;~~ concluído em 16 de julho de 2026, com aceite de Tiago Lopes;
- verificar a retenção técnica do plano Supabase efetivamente contratado antes da produção.

### Gate de saída

A nova M13 só está concluída quando todos os itens ML-01 a ML-16 e os critérios objetivos acima possuem evidência, o isolamento e a exclusão de dados foram provados, as pendências legais pré-produção foram resolvidas, o preview recebeu revisões por IA e aceite final de Tiago Lopes, e a M14 pode começar já considerando autenticação, banco e dados pessoais em suas auditorias.
