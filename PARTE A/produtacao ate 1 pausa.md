# GEAR — Documentação de continuidade até a primeira pausa

**Data de corte:** 15 de julho de 2026  
**Último commit registrado:** `91a795c feat: cria portal GEAR e pipeline editorial`  
**Branch:** `main`  
**Estado do diretório no corte:** limpo, sem alterações pendentes e sem push feito nesta sessão.

Este documento registra de onde o projeto saiu, o que foi decidido, o que já existe no código, o que foi apenas preparado e qual é o caminho mais seguro para a próxima pessoa continuar. Ele deve ser lido junto com o [README](../README.md), o [plano de desenvolvimento](./development-plan.md), as [regras do projeto](./GEAR%20Website%20%E2%80%94%20Project%20Rules.md) e a [arquitetura](./gear-documentacao-arquitetura%20%282%29.md).

## 1. Resumo executivo

O GEAR deixou de ser apenas uma proposta documental e passou a ter uma base funcional de Portal em Next.js. O produto é um portal do Grupo de Estudos Avançados em Robótica da UFMG, com prioridade para aprendizado de robótica, projetos, identidade institucional e manutenção simples por estudantes que se revezam ao longo dos anos.

Até esta pausa, o repositório possui:

- projeto Next.js com App Router, React, TypeScript estrito, Tailwind CSS, npm e lockfile;
- estrutura Feature-First com `app`, `features`, `shared` e `content` separados;
- mapa de rotas do Portal, layout público, Header, Footer, `not-found`, navegação responsiva e estados temporários;
- Home com identidade GEAR/UFMG, logo, mascote, missão, áreas de pesquisa e CTAs para Aprendizado e Projetos;
- faixa global de patrocinadores alimentada por dados locais e logos versionados;
- pipeline editorial MDX com Velite, schemas tipados, relações entre conteúdo, estados de publicação, validação de mídias e integração com o build;
- componentes, dados e testes que já avançam sobre a fundação de conteúdo, incluindo Aulas, Cursos, Trilhas, Busca e Projetos;
- suíte inicial de testes e documentação editorial/onboarding.

O marco formal explicitado no `README.md` é a conclusão das Milestones 4 e 5. O código, porém, já contém trabalho além desse marco. Portanto, a próxima pessoa não deve concluir uma Milestone apenas porque existem arquivos correspondentes: é necessário conferir o checklist e o gate de saída no `development-plan.md`.

## 2. Como o projeto mudou desde o começo da implementação

### 2.1 O planejamento foi refeito

O planejamento original agrupava infraestrutura, design, conteúdo, navegação e produto em fases grandes demais. Isso dificultava saber o que poderia ser demonstrado, testado e considerado concluído.

A mudança principal foi transformar o roadmap em 15 Milestones pequenas e dependentes:

`M0 Planejamento` → `M1 Repositório` → `M2 Mapa navegável` → `M3 Base visual/Home` → `M4 Patrocinadores` → `M5 MDX` → `M6 Aulas` → `M7 Cursos` → `M8 Trilhas` → `M9 Busca` → `M10 Projetos` → `M11 Institucional` → `M12 Notícias` → `M13 Qualidade/Publicação` → `M14 Conteúdo real/Lançamento`.

Cada Milestone recebeu demonstração obrigatória, dependências, itens identificáveis e um critério `Concluída quando`. A seção 14 da arquitetura e o `development-plan.md` foram alinhados para que o plano operacional seja a referência detalhada.

### 2.2 A prioridade de produto ficou explícita

O Portal não é tratado como um site institucional genérico. A plataforma de aprendizado é o fluxo principal. A Home deve orientar o visitante para Aprendizado e Projetos, e a navegação deve tornar esses caminhos claros antes de aprofundar conteúdo institucional.

Também ficou decidido que a primeira versão deve favorecer manutenção, organização e continuidade entre gerações de estudantes. A ordem oficial de desempate é:

1. facilidade de manutenção;
2. organização;
3. escalabilidade;
4. reutilização;
5. performance;
6. UX;
7. SEO.

### 2.3 A arquitetura deixou de ser só intenção

As regras passaram a ser refletidas no código:

- `src/app` faz roteamento e composição, sem concentrar regra de domínio;
- `src/features` organiza domínios como `aulas`, `cursos`, `trilhas`, `busca`, `projetos`, `noticias` e `patrocinadores`;
- `src/shared` contém layout, UI, configuração e utilidades realmente compartilháveis;
- uma feature não deve importar diretamente outra feature;
- conteúdo editorial é código versionado em `src/content`, não um CMS visual;
- o conteúdo é validado no build, para impedir publicação parcial ou relações quebradas.

### 2.4 A identidade visual foi materializada

A Home passou a usar os assets reais disponíveis em `public/images/brand`, incluindo logo compacta, logo principal e folha de poses do mascote. A faixa de parceiros usa os logos de UFMG, VERLab, Escola de Engenharia e DCC.

Também foram adicionados links institucionais e sociais centralizados em `src/shared/config/site.ts`. O link de WhatsApp ainda está como `/404` provisório e precisa ser substituído por um endereço aprovado antes de publicação.

## 3. Estado das Milestones

Esta tabela separa implementação observável de aceite formal. “Base implementada” significa que há código e testes relacionados; “aceite formal” só deve ser marcado após o gate do plano ser comprovado.

| Milestone | Estado no corte | Evidência principal | Observação |
| --- | --- | --- | --- |
| M0 — Planejamento executável | Documentação criada | `development-plan.md`, arquitetura e regras | Ainda existem pendências operacionais, como responsáveis, ADR e hospedagem aprovada. |
| M1 — Repositório pronto | Base implementada | `package.json`, `.nvmrc`, lockfile, configs, README, CONTRIBUTING, templates e testes | Licença institucional e onboarding em clone limpo ainda precisam ser confirmados. |
| M2 — Esqueleto navegável | Implementado na base | rotas em `src/app/(site)`, Header, Footer, `not-found` e E2E de sitemap | Revalidar o gate completo quando as páginas deixarem de ser temporárias. |
| M3 — Base visual/Home | Implementado na base | `globals.css`, UI compartilhada, Home, assets de marca e testes | Fazer auditoria visual final em viewport móvel e desktop. |
| M4 — Patrocinadores | Declarada concluída | `SponsorStrip`, `sponsors.ts`, logos, integração no layout e testes | Dados ainda são locais, como previsto; não há painel administrativo. |
| M5 — Fundação MDX | Declarada concluída | `content.schemas.ts`, `content.validation.ts`, `velite.config.mts`, exemplos e documentação | Validação atual passou; páginas consumidoras devem ser avaliadas nas próximas Milestones. |
| M6 — Aulas | Código presente, aceite a confirmar | páginas/componentes de Aula, dados, MDX e testes | Conferir ponta a ponta contra todos os itens M6 antes de marcar concluída. |
| M7 — Cursos | Código presente, aceite a confirmar | `src/features/cursos`, rota de detalhe e relações por slug | Validar ordenação, relações publicadas e comportamento de 404. |
| M8 — Trilhas | Código presente, aceite a confirmar | `src/features/trilhas`, itens de Curso/Aula e rotas | Validar percurso misto e URLs canônicas. |
| M9 — Busca | Código presente, aceite a confirmar | MiniSearch, índices separados, filtros, drawer e testes | Conferir performance, URL query string e E2E completo. |
| M10 em diante | Planejado ou parcialmente preparado | rotas, schemas e componentes de alguns domínios | Não puxar escopo de M10+ sem fechar os gates anteriores. |

## 4. Base técnica atual

### Stack e comandos

- Node.js `24.18.0`, fixado em `.nvmrc`;
- npm `11.x` e `package-lock.json` versionado;
- Next.js `16.2.10`;
- React `19.2.4`;
- TypeScript `strict`;
- Tailwind CSS 4;
- Velite para MDX e geração de coleções;
- Vitest + Testing Library para testes unitários/componentes;
- Playwright para E2E;
- ESLint e Prettier.

Comandos principais:

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run content:validate
npm run build
npm run test:e2e
```

No corte, foram verificados com sucesso:

- `npm run typecheck`;
- `npm run lint`;
- `npm run content:validate`;
- `npm test`: 11 arquivos e 40 testes aprovados.

O build de produção e a suíte E2E completa devem ser executados novamente antes de declarar uma próxima Milestone concluída.

### Camadas e pontos de entrada

- `src/app/layout.tsx`: metadata e layout raiz;
- `src/app/(site)/layout.tsx`: composição do Portal público e `SponsorStrip` global;
- `src/app/(site)/page.tsx`: Home;
- `src/shared/config/site.ts`: navegação, links legais e sociais;
- `src/shared/config/institutional.ts`: textos e áreas institucionais da Home;
- `src/shared/components/layout`: `Header`, `Footer`, `Container` e estados temporários;
- `src/shared/components/ui`: Button, Card, Badge, Breadcrumbs e mídia;
- `content.schemas.ts`: contratos de todas as coleções MDX;
- `content.validation.ts`: slugs, referências, ciclos e mídias;
- `velite.config.mts`: entrada do pipeline e exclusão de rascunhos na saída pública;
- `src/features/*/data`: acesso ordenado às coleções geradas;
- `tests/unit`, `tests/e2e` e `tests/velite`: evidências automatizadas.

## 5. Modelo editorial e conteúdo atual

As coleções são:

- **Trilha:** `itens` ordenados, cada item sendo um Curso ou uma Aula;
- **Curso:** `aulaSlugs` ordenados, dificuldade, tags e pré-requisitos;
- **Aula:** resumo, dificuldade, datas, autores, pré-requisitos, vídeos, links e downloads;
- **Projeto:** imagens, vídeos, tecnologias, repositório, documentação, status e destaque;
- **Notícia:** capa, resumo, data, autor, tags e status.

Regras importantes:

- slugs são únicos por coleção, minúsculos e separados por hífen;
- `rascunho` é aceito na entrada, mas não entra na saída pública;
- Cursos publicados só podem referenciar Aulas publicadas;
- Trilhas publicadas só podem referenciar Cursos/Aulas publicados;
- pré-requisitos não podem formar ciclos;
- imagens e downloads locais precisam existir em `public/`;
- URLs externas precisam usar `https://`;
- `npm run build` executa a validação de conteúdo antes do build Next.

O baseline registrado em `docs/baselines/m5-content.md` indica uma amostra de uma Trilha publicada, um Curso publicado, três Aulas publicadas, uma Aula em rascunho, um Projeto e uma Notícia. Os arquivos com nomes como `curso-interno.mdx`, `trilha-interna.mdx` e `rascunho-interno.mdx` são fixtures/rascunhos de desenvolvimento, não devem ser tratados como conteúdo editorial final.

Para adicionar conteúdo, seguir `docs/content-editorial.md`, copiar um exemplo próximo e manter `status: rascunho` até a revisão humana.

## 6. O que ainda não deve ser presumido como pronto

1. **Produção:** não há evidência neste corte de CI completo, proteção da `main`, Vercel configurada ou deploy de produção.
2. **Conteúdo real:** vários textos, imagens e MDX ainda são exemplos de validação. Não publicar sem revisão técnica, editorial e de direitos.
3. **Institucional:** `/sobre`, `/patrocinadores`, `/privacidade` e `/termos` ainda precisam ser auditadas quanto a conteúdo aprovado e completude.
4. **Links sociais:** o link de WhatsApp em `siteConfig` é placeholder.
5. **Giscus:** existe a pasta da feature, mas não existe integração ativa; não declarar comentários como recurso disponível.
6. **Status de Milestones:** a presença de rotas ou componentes de Aulas, Cursos, Trilhas, Busca e Projetos não substitui os gates do plano.
7. **Grafo:** `graphify-out/graph.json` foi gerado antes do commit final e registra `built_at_commit` como `f5ae9a5...`; ele está desatualizado em relação a `91a795c`. Regenerar/atualizar o grafo antes de usar seus relatórios para decisões arquiteturais novas. O comando `graphify` também não estava disponível no PATH desta sessão.

## 7. Próximo passo recomendado

A continuação mais segura é fechar e documentar a M6 antes de ampliar o escopo:

1. executar `npm run build` e `npm run test:e2e`;
2. conferir as páginas de Aula no navegador em móvel e desktop;
3. validar listagem, detalhe, MDX renderizado, pré-requisitos, recursos, 404 e rascunhos;
4. comparar cada resultado com o checklist M6 do `development-plan.md`;
5. corrigir pendências e atualizar este documento/README com o status real;
6. só então formalizar M6 e seguir para M7.

Se a auditoria mostrar que M6, M7, M8 ou M9 já satisfazem seus gates, registrar essa conclusão explicitamente em vez de apenas continuar codificando. Se não satisfizerem, tratar o trabalho existente como base parcial e completar o menor conjunto necessário.

## 8. Procedimento para uma nova pessoa ou IA

1. Ler este documento e depois os quatro documentos de referência indicados no início.
2. Rodar `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` e `npm run content:validate`.
3. Inspecionar o `development-plan.md` e identificar a primeira Milestone sem gate comprovado.
4. Consultar componentes existentes antes de criar outro componente equivalente.
5. Não colocar regra de domínio em `app/` e não importar uma feature diretamente de outra.
6. Para conteúdo, trabalhar em `src/content` e validar com Velite; não editar `.velite` manualmente.
7. Para imagens/downloads, confirmar o arquivo em `public/` e o caminho absoluto no frontmatter.
8. Escrever ou atualizar testes junto da mudança.
9. Atualizar a documentação de continuidade quando uma decisão alterar arquitetura, escopo, milestone ou fluxo editorial.
10. Fazer commits pequenos e descritivos; o commit de referência desta pausa é `91a795c`.

## 9. Referências rápidas

- [README e comandos](../README.md)
- [Plano operacional e gates](./development-plan.md)
- [Arquitetura e roadmap](./gear-documentacao-arquitetura%20%282%29.md)
- [Regras permanentes](./GEAR%20Website%20%E2%80%94%20Project%20Rules.md)
- [Guia editorial](../docs/content-editorial.md)
- [Baseline M5](../docs/baselines/m5-content.md)
- [Relatório do grafo](../graphify-out/GRAPH_REPORT.md)

## 10. Adendo visual e de navegação — 16 de julho de 2026

> **Escopo deste adendo:** estas decisões vieram de testes visuais locais aprovados pelo responsável do projeto. Elas refinam a aparência e a navegação do Portal, mas não substituem gates formais de Milestones. Preservar estas escolhas salvo nova orientação explícita.

### 10.1 Direção visual aprovada

- O Portal deve ter mais identidade GEAR: vermelho GEAR, grafite, branco e cinza claro. O azul não deve ser a cor de destaque principal.
- Em telas desktop, a área útil deve ser ampla; evitar grandes faixas vazias nas laterais. A leitura de textos continua limitada por colunas internas, sem esticar parágrafos até a borda.
- O fundo global deve permanecer **cinza liso**. Foram testadas texturas/padrões técnicos no fundo e elas foram rejeitadas por parecerem densas ou distrativas. Não reintroduzir padrão no fundo sem nova aprovação.
- Usar animações discretas, com pouco deslocamento e fade curto. O objetivo é dar vida ao site, não criar sensação de página deslizando ou de efeitos excessivos.
- Respeitar `prefers-reduced-motion`: pessoas que pedem menos movimento devem ver o conteúdo sem animações de entrada.

### 10.2 Home / landing page

- A Home usa uma largura de container maior e uma paleta em vermelho, grafite, branco e cinza claro.
- O hero deixou de ser estático: ele é um carrossel de conteúdo completo, trocando título, descrição, CTAs e pose do mascote a cada **5 segundos**. Os pontos permitem troca manual; o ciclo pausa quando há interação.
- O hero usa a logo compacta somente no painel visual interno; o Header usa a logo principal tradicional.
- As seções da Home possuem linhas divisórias em vermelho claro, levemente mais grossas. Não usar `>` no fim das linhas e não adicionar linha inferior extra no último bloco.
- Os rótulos técnicos das seções (`01 / MISSÃO`, `02 / ÁREAS DE PESQUISA` etc.) foram aumentados levemente e devem manter o estilo monoespaçado/vermelho.
- A Home usa entrada de conteúdo no scroll para as seções principais: fade curto + pequeno deslocamento vertical, uma única vez por bloco.

### 10.3 Patrocinadores e rodapé

- A faixa de patrocinadores deve ser compacta, no fim da página, com logos clicáveis e sem ocupar a altura de uma seção grande.
- O fundo grafite para patrocinadores foi testado e rejeitado porque prejudicava a leitura de logos escuras/azuis. A versão aprovada usa fundo cinza muito claro, cartões brancos e borda vermelha discreta no topo.
- Visualmente, mostrar só as logos; os nomes continuam disponíveis para acessibilidade.

### 10.4 Header e acessos provisórios

- Manter a logo principal tradicional no Header.
- Agrupar os links principais no lado direito, próximos aos acessos de conta.
- A ordem visual aprovada é: links principais → `Meu aprendizado` → `Login`.
- `Meu aprendizado` aponta temporariamente para `/meu-aprendizado`, que deve exibir o 404 até existir a funcionalidade real. `Login` também continua provisório em `/login`.
- No mobile, `Meu aprendizado` deve continuar acessível pelo menu, sem comprimir o Header.

### 10.5 Página principal de Aprendizado

Estrutura aprovada, na ordem:

1. cabeçalho de Aprendizado;
2. carrossel compacto de Cursos em destaque;
3. bloco `Novos conteúdos`;
4. bloco `Explorar` com Aulas, Cursos e Trilhas.

Regras específicas:

- O carrossel de cursos mostra apenas **imagem de capa/banner + título**. Não adicionar descrição, CTA ou card complexo dentro do slide. O slide inteiro é clicável e abre o curso.
- Exibir até quatro cursos marcados com `destaque: true`; trocar a cada **4 segundos**. A imagem vem de `imagemCapa`, portanto o upload/troca da capa continua sendo responsabilidade do conteúdo do Curso, não de um cadastro duplicado do carrossel.
- `Novos conteúdos` é uma lista compacta de cinco links, sem imagens/cards grandes, podendo misturar Curso, Trilha e Aula. O título fica à esquerda; o mascote em pose pensativa aparece à direita.
- Cursos e Trilhas podem usar `dataPublicacao` para participar da lista de conteúdos recentes. Conteúdo deve estar `publicado`; rascunhos não podem aparecer na vitrine, listagens ou busca.
- O bloco `Explorar` mantém Aulas, Cursos e Trilhas e recebe as mesmas linhas e animações suaves da linguagem visual da Home.

### 10.6 Busca unificada e breadcrumbs

- Acima dos três cards de `Explorar`, manter o botão `Pesquisar todos os conteúdos` levando a `/aprendizado/busca`.
- A busca unificada consulta Aulas, Cursos e Trilhas publicados. Deve permitir filtro por tipo de conteúdo, dificuldade, categoria, tags e área de trilha quando aplicável.
- As buscas específicas continuam existindo; a busca geral não as substitui.
- Em toda página de Aprendizado que represente uma lista ou busca, caminhos visíveis devem ser breadcrumbs reais, não apenas texto decorativo. Cada nível anterior deve ser clicável.
- Exemplos: `APRENDIZADO / CURSOS`, `APRENDIZADO / AULAS / BUSCA` e `APRENDIZADO / BUSCA`. Páginas internas de Aula, Curso e Trilha já seguem o mesmo princípio.

### 10.7 Orientação para mudanças futuras

- Antes de alterar visual aprovado, discutir a intenção com o responsável e preferir testes locais reversíveis.
- Reutilizar os componentes de carrossel, busca, breadcrumbs e revelação no scroll já criados; não duplicar a fonte de conteúdo em componentes visuais.
- Quando uma capa real de Curso for aprovada, substituir o arquivo/caminho de `imagemCapa` no MDX correspondente. Não editar o carrossel para trocar apenas a imagem.
- Manter a verificação proporcional após mudanças: `npm run build` e `npm test` passaram após este conjunto de ajustes visuais e de navegação.

## 11. M13 extra — Login e Meu aprendizado — 16 de julho de 2026

O adendo `ADENDO MILESTONE_LOGIN` foi implementado no código local com a
fronteira híbrida oficial do Supabase:

- `@supabase/ssr`, `@supabase/supabase-js` e Supabase CLI em versões fixadas;
- clientes browser/server, proxy de renovação e callback OAuth PKCE;
- rotas `/login`, `/meu-aprendizado`, `/auth/callback` e `/api/conta`;
- migrations para `learning_enrollments` e `lesson_completions`, grants mínimos,
  RLS por `auth.uid()`, índices e cascade de exclusão;
- feature `meu-aprendizado` com seletores puros de progresso, dashboard, listas,
  inscrições, conclusão de Aulas e Configurações;
- controles pessoais compostos pelas páginas de Curso, Trilha e Aula sem imports
  diretos entre features;
- sitemap sem rotas pessoais, `noindex`, textos legais, ADR, configuração,
  rollback, testes unitários, E2E e pgTAP/CI.

O código funciona em modo visitante sem variáveis Supabase e preserva as páginas
públicas. A ativação real ainda depende de ações externas do proprietário:
configurar o projeto Supabase e o OAuth App GitHub, preencher URLs/segredos por
ambiente, executar a suíte pgTAP com Docker/Supabase local e verificar a retenção
de backups antes de produção. Privacidade e Termos foram aprovados por Tiago
Lopes em 16 de julho de 2026. As pendências restantes não
devem ser confundidas com falha do build local nem com login já ativo.
