# Documentação de Arquitetura — Portal GEAR

### Grupo de Estudos Avançados em Robótica (UFMG)

**Versão:** 1.3 — Revisão colaborativa consolidada
**Stack obrigatória:** Next.js (App Router) · React · TypeScript · Tailwind CSS · MDX
**Autor:** Arquitetura de Software / Front-end / UX-UI
**Status:** Base atual para gerar o Plano de Desenvolvimento
**Conformidade:** este documento é a fonte de verdade atual da arquitetura revisada. O _GEAR Website — Project Rules_ ainda deve ser harmonizado depois; se houver conflito entre o PDF original e este MD, seguir este MD até nova decisão explícita.

---

## 1. Visão Geral

### 1.1 O que é o projeto

O Portal GEAR é a plataforma digital do Grupo de Estudos Avançados em Robótica da UFMG. Diferente de um site institucional comum, ele é, antes de tudo, **uma plataforma de ensino** — um lugar onde conhecimento de robótica é publicado em Aulas e pode ser organizado em Cursos e Trilhas, complementado pela vitrine dos projetos do grupo, conteúdo institucional, notícias e reconhecimento de patrocinadores.

### 1.2 Ordem de prioridade do produto

| #   | Prioridade                | Implicação arquitetural                                                                                    |
| --- | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | Plataforma de aprendizado | Recebe o modelo de dados mais robusto, a navegação mais trabalhada e o maior investimento em busca/filtros |
| 2   | Divulgação de projetos    | Estrutura de conteúdo mais simples que a de aprendizado, mas com boa curadoria visual                      |
| 3   | Página institucional      | Conteúdo majoritariamente estático, hospedado na Home + `/sobre`                                           |
| 4   | Notícias                  | Estrutura de blog convencional, prioridade menor que projetos                                              |
| 5   | Patrocinadores            | Componente global persistente, sem necessidade de área própria robusta                                     |

Essa é a prioridade de **produto** (o que construir primeiro). Ela é distinta — e complementar — da prioridade de **engenharia** (como decidir entre soluções técnicas equivalentes), definida oficialmente pelo Project Rules e detalhada na seção 1.4.

### 1.3 Público-alvo

Estudantes universitários brasileiros e entusiastas de robótica, em sua maioria acessando de dispositivos móveis e redes universitárias. Isso reforça três exigências não-funcionais: **performance**, **leveza** e **clareza de navegação** — não se pode presumir banda larga ou hardware potente.

### 1.4 Filosofia norteadora

O grupo é mantido por ~7 a 9 estudantes que se revezam ao longo dos anos. Isso muda o problema de arquitetura: o maior risco do projeto não é técnico, é **de conhecimento organizacional se perdendo a cada troca de geração**. Toda decisão deste documento foi pesada contra a pergunta: _"um novo integrante, sem contexto prévio, consegue entender isso em uma tarde?"_

**Ordem de prioridade oficial (Project Rules, seção 1 — prevalece sobre qualquer prioridade anterior em caso de conflito):**

1. Facilidade de manutenção
2. Organização
3. Escalabilidade
4. Reutilização de componentes
5. Performance
6. UX
7. SEO

Essa ordem é o critério de desempate oficial do projeto inteiro: sempre que duas soluções técnicas são igualmente válidas, vence a que favorece o item mais alto da lista. Vale destacar que **reutilização de componentes vem antes de performance** — uma otimização pontual que force duplicação de componentes ou quebre a organização Feature-First não deve ser adotada, mesmo que ganhe alguns milissegundos.

Princípios aplicados neste documento para operacionalizar essa ordem:

1. **Legibilidade antes de esperteza** — um padrão óbvio e um pouco repetitivo vence uma abstração elegante e difícil de decorar. _(serve à manutenção)_
2. **Feature-First** — o código é organizado por domínio (trilhas, aulas, projetos...), não por tipo técnico (todos os hooks juntos, todos os componentes juntos). Isso permite que um novo membro trabalhe em "Notícias" sem precisar entender "Aulas". _(serve à organização e à escalabilidade)_
3. **Baixo acoplamento entre features** — features só se comunicam através da camada `shared/`, nunca importando diretamente umas das outras. _(serve à organização e à reutilização de componentes)_
4. **Conteúdo como código (Content as Code)** — como não haverá painel administrativo nesta versão, os arquivos MDX versionados no Git _são_ o CMS. Isso tem uma vantagem estrutural rara para um projeto acadêmico: todo o histórico de conteúdo fica auditável via `git log`, o que importa muito quando a "equipe editorial" muda todo ano. _(serve à manutenção)_
5. **Simplicidade deliberada** — sempre que uma solução mais simples resolvia o requisito, ela foi preferida a uma mais "impressionante". _(serve à manutenção; reforçado tanto pelo briefing original quanto pelo Project Rules)_

### 1.5 Fora de escopo nesta versão

Documentado aqui para evitar ambiguidade futura:

- Painel administrativo / CMS visual
- Edição de patrocinadores fora do código
- Sistema próprio de comentários, curtidas, respostas ou fórum. Quando o Giscus for ativado, seus recursos nativos poderão ser usados sem serem reimplementados pelo Portal
- Múltiplos idiomas (i18n) — o público-alvo é brasileiro; assume-se `pt-BR` como único idioma da v1
- Perfis de usuário públicos elaborados

---

## 2. Arquitetura

### 2.1 Estilo arquitetural

O Portal GEAR adota uma arquitetura **Feature-First dentro de um monólito modular Next.js**. Não há microsserviços, não há BFF separado — a complexidade de um sistema distribuído não se paga para uma equipe estudantil rotativa. Em vez disso, a modularidade vem da **organização interna do código**, não da infraestrutura.

```
┌──────────────────────────────────────────────────────────────────┐
│                         app/ (App Router)                        │
│   Somente roteamento e composição. Nenhuma regra de negócio.     │
└───────────────────────────────┬────────────────────────────────┘
                                 │ importa e compõe
┌───────────────────────────────▼────────────────────────────────┐
│                            features/                              │
│  trilhas · cursos · aulas · projetos · noticias · busca ·         │
│  giscus · patrocinadores                                          │
│  Cada pasta contém sua própria UI, lógica e tipos.                 │
└───────────────────────────────┬────────────────────────────────┘
                                 │ consome
┌───────────────────────────────▼────────────────────────────────┐
│                             shared/                                │
│  Design System (ui/), layout global, hooks genéricos, utils,      │
│  configuração do site. Não conhece nenhuma feature específica.    │
└───────────────────────────────┬────────────────────────────────┘
                                 │ lê
┌───────────────────────────────▼────────────────────────────────┐
│                       content/ (arquivos MDX)                     │
│         Trilhas, Cursos, Aulas, Projetos, Notícias                │
└───────────────────────────────┬────────────────────────────────┘
                                 │ complementado por
┌───────────────────────────────▼────────────────────────────────┐
│          Serviços externos (ver seção 2.4 — apenas recomendados)  │
│     GitHub/Giscus · Armazenamento de mídia · Hospedagem           │
└──────────────────────────────────────────────────────────────────┘
```

**Regra de dependência:** uma seta só pode apontar para baixo. `app/` pode importar de `features/`; `features/` pode importar de `shared/`; nada importa de `app/`; features nunca se importam entre si diretamente (se duas features precisam compartilhar algo, esse algo sobe para `shared/`).

### 2.2 Estratégia de renderização

Dado que a maior parte do conteúdo (trilhas, cursos, aulas, projetos, notícias) é escrita por Editores e não muda a cada segundo, o padrão adotado é:

| Tipo de página                            | Estratégia                                                                                                                                                 | Justificativa                                                                                                            |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Home, Sobre, Patrocinadores               | **SSG** (Static Site Generation) puro                                                                                                                      | Conteúdo institucional muda raramente                                                                                    |
| Trilha / Curso / Aula / Projeto / Notícia | **SSG** no deploy                                                                                                                                          | Como o conteúdo vem de arquivos versionados no Git, cada merge dispara um novo build/deploy que já incorpora as mudanças |
| Buscas com filtros                        | **Client Component** nas rotas `/aprendizado/trilhas/busca`, `/aprendizado/cursos/busca` e `/aprendizado/aulas/busca`, sobre índices gerados em build-time | Filtros são interações instantâneas; não vale a pena um round-trip ao servidor a cada tecla                              |
| Comentários _(fase futura)_               | **Giscus embed** em Client Component                                                                                                                       | Delegamos login, moderação e persistência para o GitHub/Giscus, reduzindo manutenção e escopo                            |

Essa combinação mantém o site **majoritariamente estático** (rápido, barato de hospedar, resiliente). A interatividade da v1 fica concentrada na busca, nos filtros e, quando habilitado, no embed do Giscus.

### 2.3 Pipeline de conteúdo (MDX)

> **Regra permanente (Project Rules, seção 4):** todo conteúdo educacional é escrito em MDX — nunca em HTML estático. Isso vale para Aulas, e por extensão (seção 2.4.1 e seção 7) também para Projetos e Notícias, mantendo um único formato de conteúdo em todo o site.

Como não há CMS visual, o "banco de dados" de conteúdo é o próprio sistema de arquivos (`content/`). O fluxo é:

```
Editor escreve/edita arquivo .mdx localmente
        │
        v
Abre Pull Request no repositório Git
        │
        v
CI valida: front-matter obrigatório presente? slugs únicos?
           links internos válidos? build não quebrou?
        │
        v
Revisão por outro Editor (peer review, natural em times acadêmicos)
        │
        v
Merge na branch principal
        │
        v
Build e deploy automáticos com as páginas estáticas atualizadas
```

Este pipeline substitui um CMS por algo que, para uma equipe acadêmica rotativa, é _mais_ robusto: histórico completo, revisão por pares obrigatória e zero custo de manutenção de painel administrativo.

### 2.4 Decisões adotadas e recomendações técnicas

Esta seção distingue decisões de produto já adotadas durante a revisão de recomendações técnicas que ainda devem ser validadas no início da implementação. Giscus, ausência de login próprio e ausência de banco na v1 são decisões. Ferramentas de MDX, hospedagem, mídia e biblioteca de busca continuam sendo recomendações substituíveis por alternativas equivalentes.

> **Critério de avaliação (regra permanente, Project Rules seção 13):** nenhuma dependência externa é recomendada sem checar (1) se ela resolve um problema real, (2) se já existe solução nativa do Next.js/React, (3) impacto na manutenção, (4) impacto no tamanho do projeto, e (5) frequência de manutenção da biblioteca. As tabelas abaixo foram construídas com esses cinco pontos em mente — por isso, sempre que uma alternativa "sem dependência extra" existia (ex: `gray-matter` manual em vez de Velite), ela aparece listada como opção válida, mesmo quando não é a recomendação final.

#### 2.4.1 Processamento de MDX / geração de coleções de conteúdo

| Opção                                    | Prós                                                                                      | Contras                                                                                               |
| ---------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Velite** _(recomendado)_               | Gera tipos automaticamente a partir do schema de conteúdo; ativamente mantido; DX simples | Ferramenta relativamente nova                                                                         |
| Contentlayer2 (fork comunitário)         | Conceito consolidado, boa documentação histórica                                          | Projeto original descontinuado; fork ainda amadurecendo                                               |
| `gray-matter` + `next-mdx-remote` manual | Controle total, zero dependência de framework de conteúdo                                 | Exige construir manualmente validação e tipagem — mais trabalho de manutenção para uma equipe pequena |

**Recomendação:** Velite, pelo equilíbrio entre baixa manutenção e tipagem automática (reduz erros de front-matter, algo crítico quando quem escreve conteúdo muda todo ano).

#### 2.4.2 Autenticação

**Decisão para a v1:** o Portal não terá autenticação própria. Para comentar, o Visitante autentica sua conta GitHub diretamente no fluxo nativo do Giscus. Essa autenticação não cria sessão, perfil ou papel dentro do Portal.

Editores também usam GitHub, mas em outro contexto: criação, revisão e publicação de conteúdo acontecem no repositório, conforme as permissões de organização/time configuradas no próprio GitHub.

Auth.js, Clerk ou Supabase Auth só devem ser avaliados no futuro se surgir uma funcionalidade interna que realmente exija conta no Portal, como progresso individual ou área restrita. Não devem ser instalados apenas para viabilizar comentários.

#### 2.4.3 Banco de dados

**Decisão para a v1:** não provisionar banco de dados próprio. O conteúdo editorial vive em MDX; comentários e seus autores vivem no GitHub Discussions por meio do Giscus; as permissões de Editor vivem no repositório GitHub.

Um banco só deve ser introduzido quando houver um requisito concreto de dados internos, como progresso do aluno, favoritos ou analytics próprios. A tecnologia deverá ser escolhida nesse momento, evitando infraestrutura sem uso no MVP.

#### 2.4.4 Hospedagem

| Opção                                        | Prós                                                                                                                                                         | Contras                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **Vercel** _(recomendado)_                   | Criador do Next.js — suporte de primeira classe a builds, previews por Pull Request e otimização de imagens; tier gratuito tende a cobrir o tráfego esperado | Menos controle de baixo nível que um VPS                                               |
| Netlify                                      | Também maduro para Next.js                                                                                                                                   | Suporte a recursos mais recentes do App Router historicamente um passo atrás da Vercel |
| Infraestrutura própria da UFMG (self-hosted) | Sem dependência de terceiros, alinhado a um projeto acadêmico                                                                                                | Exige alguém do grupo mantendo servidor — risco alto dado o turnover de membros        |

**Recomendação:** Vercel, justamente pelo turnover de equipe: hospedagem "zero manutenção" reduz drasticamente o conhecimento tácito necessário para manter o site no ar.

#### 2.4.5 Armazenamento de mídia (imagens, vídeos, PDFs de aulas/projetos)

| Opção                                                                              | Prós                                                                                            | Contras                                                                                 |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Pasta `public/` versionada no Git                                                  | Zero infraestrutura extra, mídia versionada junto do conteúdo                                   | Repositório cresce indefinidamente; sem otimização automática de imagem/vídeo em escala |
| **CDN de mídia (Cloudinary ou Vercel Blob)** _(recomendado a partir de ~50 aulas)_ | Otimização automática (formatos modernos, tamanhos responsivos); repositório Git permanece leve | Mais uma dependência externa a configurar                                               |

**Recomendação:** iniciar com `public/` (mais simples, adequado à escala inicial) e migrar para Cloudinary/Vercel Blob quando o volume de mídia começar a pesar no repositório — ver seção 12 (Escalabilidade) para o gatilho exato dessa migração.

#### 2.4.6 Sistema de busca

| Opção                                                                                             | Prós                                                                    | Contras                                                              |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Índice client-side (MiniSearch ou FlexSearch) gerado em build-time** _(recomendado para o MVP)_ | Zero infraestrutura, busca instantânea, funciona offline após carregado | Escala mal além de alguns milhares de documentos (não é o caso aqui) |
| Postgres Full-Text Search                                                                         | Escala para um volume maior e permite consultas no servidor             | Exige banco próprio e round-trip ao servidor a cada busca            |
| Algolia (DocSearch, gratuito para projetos acadêmicos/open-source)                                | Busca extremamente rápida e tolerante a erros de digitação              | Dependência de serviço de terceiros; requer aprovação/cadastro       |

**Recomendação:** usar busca client-side no MVP, com consultas segmentadas por classificação. Trilhas, Cursos e Aulas podem compartilhar a mesma base técnica de indexação, mas cada rota de busca deve consultar apenas o seu tipo. Notícias devem usar uma busca separada e mais simples, impedindo mistura entre os domínios. Reavaliar uma solução de servidor somente se a base crescer muito além do planejado.

#### 2.4.7 Sistema de comentários (implementação)

Comentários deixam de ser feature nativa nesta arquitetura. Para reduzir escopo e manutenção, a solução escolhida para a fase futura é o **Giscus**, integrado por embed no conteúdo das Aulas. A autenticação para comentar acontece dentro do próprio Giscus e aceita contas GitHub; o Portal não implementa login paralelo.

Motivo da mudança:

- Comentários são um extra, não uma prioridade central do produto.
- Giscus elimina a necessidade de criar banco, API própria e moderação customizada.
- O custo de implementação cai bastante, e a manutenção futura fica menor.
- O comportamento padrão do Giscus já resolve o caso de uso básico de comentários públicos, respostas e reações no contexto do GitHub.

Limitações assumidas:

- A experiência de comentário depende do GitHub.
- A moderação segue o modelo do Giscus/GitHub Discussions.
- O Portal não restringe nem reimplementa threads, respostas ou reações; vale o comportamento nativo configurado no Giscus.
- Não haverá sistema próprio de resposta oficial nem painel interno de moderação.

**Decisão:** adotar Giscus quando os comentários entrarem no roadmap. A integração é um extra e fica fora do MVP inicial; qualquer solução customizada permanece no backlog futuro e só será considerada se surgir uma necessidade real.

---

## 3. Sitemap

```
/                                        Home institucional + vitrine
├── /aprendizado                         Área principal de navegação do conteúdo educacional
│    ├── /aprendizado/trilhas            Listagem de trilhas de aprendizado
│    │    ├── /aprendizado/trilhas/busca              Busca local só de Trilhas
│    │    └── /aprendizado/trilhas/[trilha]         Página da trilha → lista de cursos e aulas relacionadas
│    ├── /aprendizado/cursos             Listagem de cursos
│    │    ├── /aprendizado/cursos/busca               Busca local só de Cursos
│    │    └── /aprendizado/cursos/[curso]           Página do curso → lista de aulas
│    └── /aprendizado/aulas              Listagem de todas as aulas, avulsas ou relacionadas
│         ├── /aprendizado/aulas/busca                Busca local só de Aulas
│         └── /aprendizado/aulas/[aula]            Aula/Post (conteúdo MDX; Giscus futuro)
│
├── /projetos                            Listagem de projetos do grupo
│    └── /projetos/[projeto]             Detalhe do projeto
│
├── /noticias                            Listagem de notícias
│    └── /noticias/[noticia]             Detalhe da notícia
│
├── /sobre                               Institucional expandido (missão, áreas de pesquisa, membros)
├── /patrocinadores                      Lista expandida de patrocinadores e parceiros
├── /privacidade                         Política de privacidade — recomendado (ver nota abaixo)
├── /termos                              Termos de uso — recomendado
│
└── infraestrutura de rota (sem UI própria)
     ├── sitemap.xml                     Gerado automaticamente
     ├── robots.txt                      Gerado automaticamente
     ├── opengraph-image                 Imagem OG gerada dinamicamente
     └── not-found                       Página 404 customizada
```

> **Nota sobre `/privacidade` e `/termos`:** não estavam especificados no briefing, mas o site poderá carregar um embed de terceiro (Giscus/GitHub) e pode usar métricas de acesso. Antes de ativar essas integrações, a política deve descrever quais dados são tratados. Como se trata de um projeto de uma universidade pública brasileira, incluir essas páginas estáticas evita retrabalho posterior.

---

## 4. Fluxos dos Usuários

### 4.1 Jornada do Visitante na plataforma de aprendizado

```
[Home] → [Aprendizado] → [Trilhas] / [Cursos] / [Aulas] → [Item escolhido]
                                                                    │
                                            ┌───────────────────────┼────────────────────────┐
                                            v                       v                        v
                                     [Consome vídeo,          [Baixa PDF /            [Acessa link do
                                      texto, imagens]          material]               GitHub externo]
                                            │
                                            v
                       [Giscus está habilitado e quer comentar?] ──não──> [Continua navegando]
                                            │
                                           sim
                                            v
[Está autenticado no Giscus?] ──não──> [Giscus inicia autenticação no GitHub]
                                            │                          │
                                           sim                         v
                                            │              [Retorna ao embed na Aula]
                                            v
                                  [Publica no Giscus]
                                            │
                                            v
[Comentário fica visível] → [Discussão mantida no GitHub via Giscus]
```

### 4.2 Fluxo de busca e filtro

```
[Visitante abre /aprendizado/trilhas/busca, /aprendizado/cursos/busca ou /aprendizado/aulas/busca]
        │
        v
[Índice da classificação atual filtra em tempo real por título, conteúdo e tags]
        │
        v
[Aplica filtros disponíveis para aquela classificação]
        │
        v
[Resultados combinados (busca ∩ filtros) atualizam a lista instantaneamente]
        │
        v
[Seleciona um resultado] → [Navega para a Trilha, Curso ou Aula correspondente]
```

**Regras de navegação da busca:**

- A busca da área de Aprendizado é segmentada por aba. Trilhas, Cursos e Aulas têm suas próprias páginas de busca, e cada uma pesquisa apenas a sua própria classificação.
- As listagens de Trilhas, Cursos e Aulas reutilizam a mesma base de componentes, mas a consulta fica travada ao tipo da aba atual. O usuário pesquisa sem sair daquele conjunto.
- Notícias têm uma busca própria e independente, restrita a Notícias. Ela é simples, baseada principalmente em título e semelhança de texto, sem filtros por tags, área ou dificuldade.
- Uma busca no site inteiro não faz parte do escopo atual.

### 4.3 Autenticação para comentários no Giscus

```
[Visitante clica para comentar no embed do Giscus]
        │
        v
[Giscus solicita autenticação com GitHub]
        │
        v
[GitHub confirma a identidade diretamente para o Giscus]
        │
        v
[Visitante comenta usando os recursos nativos do Giscus]
```

O Portal não recebe callback próprio, não cria registro de usuário e não transforma essa autenticação em permissão de Editor.

### 4.4 Fluxo de publicação de conteúdo (Editor)

Importante: como não há painel administrativo, este é um **fluxo de desenvolvimento (Git)**, não uma ação dentro do site publicado.

```
[Editor cria/edita o arquivo `.mdx` da entidade em `content/aprendizado/`]
        │
        v
[Preenche o front-matter obrigatório para aquele tipo de conteúdo]
        │
        v
[Roda preview local (ambiente de desenvolvimento)]
        │
        v
[Abre Pull Request]
        │
        v
[CI valida front-matter e integridade de links/slugs]
        │
        v
[Outro Editor revisa o conteúdo]
        │
        v
[Merge] → [Build automático] → [Deploy das páginas estáticas atualizadas]
        │
        v
[Conteúdo publicado no site, sem necessidade de admin visual]
```

### 4.5 Fluxo de comentários via Giscus _(fase futura)_

```
[Visitante abre uma Aula com Giscus]
        │
        v
[Autentica no GitHub para comentar]
        │
[Escreve comentário no Giscus]
        │
        v
[Thread, reações, respostas e moderação seguem o comportamento nativo do Giscus/GitHub]
```

---

## 5. Papéis e permissões

### 5.1 Papéis

Existem dois papéis relevantes: **Visitante** e **Editor**. O Portal público não mantém login nem sessão na v1. Quando um Visitante autentica no Giscus para comentar, ele continua sendo Visitante no Portal; essa autenticação vale apenas para a integração externa.

Além disso, há uma distinção arquitetural que vale destacar, sem contradizer os dois papéis acima:

> **Autorização fora do Portal.** A criação, edição, revisão e exclusão de conteúdo acontecem via Git (arquivos MDX + Pull Request). Essa permissão é controlada pelo acesso ao repositório GitHub. Comentários também são externos: o Portal apenas exibe o Giscus e não implementa lógica própria de thread, resposta, reação ou moderação.

### 5.2 Matriz de permissões

| Ação                                                     |                 Visitante                 |            Editor            | Onde a permissão é aplicada |
| -------------------------------------------------------- | :---------------------------------------: | :--------------------------: | --------------------------- |
| Navegar, pesquisar e visualizar conteúdo                 |                    ✅                     |              ✅              | Portal público              |
| Comentar em uma Aula, quando o Giscus estiver habilitado | ✅, após autenticar no GitHub pelo Giscus |   ✅, nas mesmas condições   | Giscus/GitHub               |
| Usar respostas, threads e reações disponíveis            |       Conforme configuração nativa        | Conforme configuração nativa | Giscus/GitHub               |
| Criar, editar, revisar ou apagar conteúdo                |                    ❌                     |              ✅              | Repositório GitHub          |
| Publicar conteúdo                                        |                    ❌                     |              ✅              | Pull Request, CI e deploy   |

### 5.3 Como uma pessoa se torna Editor

Uma pessoa se torna Editor ao receber acesso adequado ao repositório GitHub, preferencialmente por um time da organização GEAR. A troca anual de membros é administrada nesse time, sem banco, allowlist ou painel dentro do Portal. As regras de proteção de branch e revisão por Pull Request continuam valendo para todos os Editores.

---

## 6. Estrutura de Pastas

```
gear-portal/
├── src/
│   │
│   ├── app/                                # Roteamento (App Router) — só composição, sem regra de negócio
│   │   ├── (site)/                         # Grupo de rotas com layout público padrão
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                            # Home
│   │   │   ├── aprendizado/
│   │   │   │   ├── page.tsx                        # Entrada da área educacional
│   │   │   │   ├── trilhas/
│   │   │   │   │   ├── page.tsx                    # Listagem de trilhas
│   │   │   │   │   ├── busca/page.tsx              # Busca local de trilhas
│   │   │   │   │   └── [trilha]/page.tsx           # Página da trilha
│   │   │   │   ├── cursos/
│   │   │   │   │   ├── page.tsx                    # Listagem de cursos
│   │   │   │   │   ├── busca/page.tsx              # Busca local de cursos
│   │   │   │   │   └── [curso]/page.tsx            # Página do curso
│   │   │   │   └── aulas/
│   │   │   │       ├── page.tsx                    # Listagem de todas as aulas
│   │   │   │       ├── busca/page.tsx              # Busca local de aulas
│   │   │   │       └── [aula]/page.tsx             # Aula/Post canônico
│   │   │   ├── projetos/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [projeto]/page.tsx
│   │   │   ├── noticias/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [noticia]/page.tsx
│   │   │   ├── sobre/page.tsx
│   │   │   ├── patrocinadores/page.tsx
│   │   │   ├── privacidade/page.tsx
│   │   │   └── termos/page.tsx
│   │   │
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx
│   │   └── not-found.tsx
│   │
│   ├── features/                           # Núcleo Feature-First — um domínio por pasta
│   │   ├── trilhas/
│   │   │   ├── components/
│   │   │   ├── lib/                        # leitura/parsing específico da feature
│   │   │   └── types.ts
│   │   ├── cursos/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── types.ts
│   │   ├── aulas/
│   │   │   ├── components/
│   │   │   │   ├── AulaBanner/
│   │   │   │   ├── AulaConteudoMDX/
│   │   │   │   ├── AulaPreRequisitos/
│   │   │   │   ├── AulaMetadados/            # data, autor, tags, dificuldade
│   │   │   │   └── AulaRecursos/             # PDFs, downloads, GitHub, links externos
│   │   │   ├── lib/
│   │   │   └── types.ts
│   │   ├── projetos/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── types.ts
│   │   ├── noticias/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── types.ts
│   │   ├── busca/
│   │   │   ├── components/                 # Base compartilhada para SearchBar, FilterPanel, ResultList
│   │   │   └── lib/                        # geração/consulta do índice por aba
│   │   ├── giscus/
│   │   │   └── components/                 # GiscusEmbed; só entra quando o backlog de comentários for implementado
│   │   └── patrocinadores/
│   │       ├── components/                 # SponsorStrip, SponsorGrid
│   │       └── data/                       # editado diretamente no código (sem UI admin)
│   │
│   ├── shared/                             # Reutilizável por qualquer feature
│   │   ├── components/
│   │   │   ├── ui/                         # Design System puro: Button, Badge, Card, Input...
│   │   │   └── layout/                     # Header, Footer, Container, ThemeProvider
│   │   ├── hooks/                          # hooks genéricos (ex: useDebounce, useMediaQuery)
│   │   ├── lib/                            # utilitários genéricos (formatação de data, slugify...)
│   │   ├── types/                          # tipos compartilhados entre features
│   │   └── config/                         # navegação, metadados do site, constantes globais
│   │
│   ├── content/                            # "CMS" em arquivos MDX
│   │   ├── aprendizado/
│   │   │   ├── trilhas/
│   │   │   │   └── robotica.mdx            # referencia Cursos e/ou Aulas em ordem
│   │   │   ├── cursos/
│   │   │   │   └── arduino.mdx             # referencia suas Aulas em ordem
│   │   │   └── aulas/
│   │   │       ├── instalando-arduino-ide.mdx
│   │   │       ├── primeiro-blink.mdx
│   │   │       ├── pwm.mdx
│   │   │       └── servo-motor.mdx
│   │   ├── projetos/
│   │   │   └── braco-robotico.mdx
│   │   └── noticias/
│   │       └── 2026-07-hackathon-gear.mdx
│   │
│   └── styles/                             # Tokens do Design System (ver seção 11)
│
├── public/
│   ├── images/
│   ├── videos/
│   └── downloads/
│
├── tailwind.config (ponto único de configuração de tokens visuais)
├── next.config
└── package.json
```

**Por que essa estrutura escala bem:** um novo membro que entra para trabalhar em "Notícias" abre exatamente uma pasta (`features/noticias/`) e uma pasta de conteúdo (`content/noticias/`). Na área educacional, separar Trilhas, Cursos e Aulas evita duplicar uma Aula quando ela for avulsa ou aparecer em mais de um caminho de aprendizado.

### 6.1 Convenções de código (regra permanente do projeto)

Válido para todo o código-fonte, em qualquer feature:

- TypeScript em **modo estrito** (`strict: true`), sem exceções.
- Evitar duplicação de código — se uma mesma lógica aparece duas vezes, ela sobe para `shared/lib/` ou para o `lib/` da feature.
- Nomes descritivos e sem abreviações (o próprio vocabulário deste documento — `trilhaSlug`, `aulaSlugs`, `preRequisitos` — é o vocabulário esperado no código, não abreviações como `trl` ou `preReq`).
- Imports organizados (externos → internos de `shared/` → internos da própria feature).
- Funções pequenas e com um único propósito; arquivos que crescem demais são um sinal de que a responsabilidade deveria ser dividida em mais de um módulo.
- Clareza antes de otimização prematura — qualquer otimização de performance precisa ser justificada por um problema real observado, não por precaução.

---

## 7. Organização dos Dados

Os modelos abaixo representam a **forma do conteúdo editorial**, armazenado em front-matter e corpo MDX. Dados de comentários e contas GitHub pertencem ao Giscus/GitHub e não fazem parte do modelo interno do Portal.

### 7.1 Trilha

| Campo          | Tipo                                            | Obrigatório | Descrição                                                          |
| -------------- | ----------------------------------------------- | :---------: | ------------------------------------------------------------------ |
| slug           | texto (kebab-case)                              |     ✅      | Identificador único na URL                                         |
| titulo         | texto                                           |     ✅      | Nome de exibição                                                   |
| descricaoCurta | texto                                           |     ✅      | Usada em listagens e SEO                                           |
| descricaoLonga | texto                                           |      —      | Usada na página da própria trilha                                  |
| imagemCapa     | caminho de imagem                               |     ✅      |                                                                    |
| area           | texto/categoria                                 |     ✅      | Ex: Eletrônica, Programação, Mecânica                              |
| ordem          | número                                          |     ✅      | Ordem de exibição entre trilhas                                    |
| itens          | lista ordenada de `{tipo: curso \| aula, slug}` |     ✅      | Caminho proposto pela Trilha; pode misturar Cursos e Aulas diretas |
| status         | rascunho / publicado                            |     ✅      | Controla visibilidade                                              |

### 7.2 Curso

| Campo          | Tipo                                 | Obrigatório | Descrição                                                        |
| -------------- | ------------------------------------ | :---------: | ---------------------------------------------------------------- |
| slug           | texto (kebab-case)                   |     ✅      | Identificador único e canônico do Curso                          |
| titulo         | texto                                |     ✅      |                                                                  |
| descricao      | texto                                |     ✅      |                                                                  |
| imagemCapa     | caminho de imagem                    |     ✅      |                                                                  |
| dificuldade    | iniciante / intermediário / avançado |     ✅      |                                                                  |
| categoria/tags | lista de texto                       |      —      | Usado em filtros                                                 |
| preRequisitos  | lista de slugs (cursos/aulas)        |      —      |                                                                  |
| aulaSlugs      | lista ordenada de slugs              |     ✅      | Aulas que compõem o Curso; Curso publicado deve ter ao menos uma |
| status         | rascunho / publicado                 |     ✅      |                                                                  |

### 7.3 Aula / Post

| Campo                            | Tipo                                         |                   Obrigatório                    | Descrição                                                           |
| -------------------------------- | -------------------------------------------- | :----------------------------------------------: | ------------------------------------------------------------------- |
| slug                             | texto (kebab-case)                           |                        ✅                        | Identificador único e URL canônica, independente de Curso ou Trilha |
| titulo                           | texto                                        |                        ✅                        |                                                                     |
| banner                           | caminho de imagem                            |                        —                         |                                                                     |
| resumo                           | texto curto                                  |                        ✅                        | Usado em listagens, busca e SEO                                     |
| conteudo                         | corpo MDX                                    |                        ✅                        | O texto da aula em si                                               |
| tags                             | lista de texto                               |                        —                         |                                                                     |
| categoria                        | texto                                        |                        —                         |                                                                     |
| dificuldade                      | iniciante / intermediário / avançado         |                        ✅                        |                                                                     |
| dataPublicacao / dataAtualizacao | data                                         |                      ✅ / —                      |                                                                     |
| autores                          | lista de nomes ou identificadores editoriais |                        ✅                        | Metadado estático; não depende de conta no Portal                   |
| preRequisitos                    | lista de slugs de aulas                      |                        —                         |                                                                     |
| videos                           | lista de URLs do YouTube                     |                        —                         |                                                                     |
| linksExternos                    | lista de {titulo, url}                       |                        —                         |                                                                     |
| downloads                        | lista de {titulo, arquivo} (PDF ou outro)    |                        —                         |                                                                     |
| repositorioGithub                | URL                                          |                        —                         |                                                                     |
| status                           | rascunho / publicado                         |                        ✅                        |                                                                     |
| permiteComentarios               | booleano                                     | — (padrão: falso até o Giscus entrar no roadmap) | Permite habilitar o embed por Aula no futuro                        |

### 7.4 Projeto

| Campo                           | Tipo                         | Obrigatório | Descrição                 |
| ------------------------------- | ---------------------------- | :---------: | ------------------------- |
| slug                            | texto                        |     ✅      |                           |
| titulo                          | texto                        |     ✅      |                           |
| descricaoCurta / descricaoLonga | texto                        |   ✅ / —    |                           |
| imagens                         | lista de imagens (galeria)   |      —      |                           |
| videos                          | lista de URLs                |      —      |                           |
| tecnologias                     | lista de tags                |      —      |                           |
| repositorioGithub               | URL                          |      —      |                           |
| documentacao                    | URL ou conteúdo MDX embutido |      —      |                           |
| status                          | em andamento / concluído     |     ✅      |                           |
| destaque                        | booleano                     |      —      | Controla exibição na Home |

### 7.5 Notícia

| Campo          | Tipo                            | Obrigatório | Descrição                                         |
| -------------- | ------------------------------- | :---------: | ------------------------------------------------- |
| slug           | texto                           |     ✅      |                                                   |
| titulo         | texto                           |     ✅      |                                                   |
| imagemCapa     | caminho de imagem               |     ✅      |                                                   |
| categoria      | texto                           |      —      |                                                   |
| tags           | lista de texto                  |      —      |                                                   |
| resumo         | texto curto                     |     ✅      |                                                   |
| conteudo       | corpo MDX                       |     ✅      |                                                   |
| dataPublicacao | data                            |     ✅      |                                                   |
| autor          | nome ou identificador editorial |     ✅      | Metadado estático; não depende de conta no Portal |
| status         | rascunho / publicado            |     ✅      |                                                   |

### 7.6 Dados externos do Giscus

O Portal não define schema de Comentário nem de Usuário. O Giscus associa cada página a uma discussão do GitHub e controla autor, conteúdo, data, respostas, reações, visibilidade e moderação. A implementação deve apenas configurar de forma estável o mapeamento entre a URL/slug canônico da Aula e a discussão correspondente.

### 7.7 Patrocinador _(editado no código, sem UI)_

| Campo | Tipo                        | Obrigatório | Descrição |
| ----- | --------------------------- | :---------: | --------- |
| nome  | texto                       |     ✅      |           |
| logo  | caminho de imagem           |     ✅      |           |
| url   | link externo                |     ✅      |           |
| nivel | ex: Ouro / Prata / Apoiador |      —      |           |
| ordem | número                      |     ✅      |           |

### 7.8 Relações entre entidades

```
Trilha ──── referencia em ordem ───► Cursos e/ou Aulas
Curso  ──── referencia em ordem ───► Aulas
Curso  ──── pode existir sem ──────► Trilha
Aula   ──── pode existir sem ──────► Curso ou Trilha (post avulso)
Aula   (1) ──── pode ter muitos ───► preRequisito → Aula (auto-relação)
Editor ──── é autor de ────────────► Conteúdo via Git, não via banco
Projeto e Notícia são independentes — não se relacionam com Trilha/Curso/Aula
```

**Regra prática do conteúdo de aprendizado:** a Trilha organiza e orienta, o Curso agrupa e aprofunda um assunto, e a Aula é a unidade mínima de conteúdo. Uma Trilha pode combinar Cursos e Aulas diretas; um Curso pode existir sem Trilha; uma Aula pode existir sem Curso e sem Trilha. As relações não alteram a URL canônica nem exigem cópia do arquivo.

---

## 8. Organização das Trilhas/Cursos/Aulas

### 8.1 Convenção de nomenclatura e ordenação

- Trilhas, Cursos e Aulas ficam em coleções separadas dentro de `content/aprendizado/`.
- Cada arquivo usa o slug canônico em `kebab-case`: `trilhas/robotica.mdx`, `cursos/arduino.mdx`, `aulas/primeiro-blink.mdx`.
- O arquivo não recebe prefixo numérico. A ordem contextual vive na lista `itens` da Trilha ou em `aulaSlugs` do Curso, evitando que o mesmo arquivo precise de números diferentes em contextos diferentes.
- Slugs são únicos dentro do tipo de entidade e validados pelo CI.

### 8.2 Exemplos de combinações permitidas

```
Trilha: Robótica
 ├── Aula direta: O que é robótica?
 └── Curso: Arduino
      ├── Aula: Instalando Arduino IDE
      ├── Aula: Primeiro Blink
      ├── Aula: PWM
      └── Aula: Servo Motor

Curso independente: Git para projetos de robótica
 ├── Aula: Criando um repositório
 └── Aula: Trabalhando com branches

Aula avulsa: Instalando o VS Code
```

Esses são caminhos de organização, não uma hierarquia obrigatória. Uma Trilha pode apontar diretamente para Aulas e para Cursos; todo Curso publicado contém ao menos uma Aula; e uma Aula pode ser publicada sozinha como post avulso. Não existe quarto nível na v1.

### 8.3 Como as páginas são geradas

Cada coleção gera automaticamente suas rotas canônicas em `/aprendizado/trilhas/[trilha]`, `/aprendizado/cursos/[curso]` e `/aprendizado/aulas/[aula]`. Adicionar uma Aula avulsa exige apenas seu arquivo `.mdx`; relacioná-la a um Curso ou Trilha exige adicionar o slug à lista ordenada da entidade correspondente. Nenhuma rota manual ou cópia de conteúdo é necessária.

### 8.4 Rascunho vs. Publicado

O campo `status` em Trilha/Curso/Aula/Notícia permite que Editores trabalhem em conteúdo incompleto sem que ele apareça no site público. A revisão deve acontecer localmente ou no preview da Pull Request; conteúdo com `status: rascunho` é excluído do índice de busca, do sitemap e das rotas públicas do build de produção.

---

## 9. Organização dos Componentes

> **Regra permanente (Project Rules, seção 5):** todo componente deve ter **responsabilidade única**, ser **reutilizável** sempre que possível, ser **pequeno**, ter **baixo acoplamento** e **alta coesão**. Componentes excessivamente grandes devem ser divididos. **Antes de criar um novo componente, verifique se um já existente em `shared/components/ui/` ou na própria feature resolve o mesmo propósito** — duplicar um componente por não ter procurado o equivalente já existente vai contra essa regra.

### 9.1 Camadas de componentes

```
shared/components/ui/         → Design System puro. Não sabe o que é uma "Aula" ou um "Projeto".
                                 Ex: Button, Badge, Card, Input, Modal, Avatar, Tooltip, Skeleton.

shared/components/layout/     → Estrutura global da página.
                                 Ex: Header, Footer, Container, ThemeProvider, SponsorStrip.

features/*/components/        → Componentes que conhecem o domínio, montados a partir dos
                                 componentes de shared/components/ui/.
                                 Ex: AulaBanner usa Badge + Avatar internamente.
```

**Regra prática:** se um componente menciona um conceito do domínio do GEAR (Aula, Trilha, Giscus, Patrocinador) no nome ou nos dados que recebe, ele pertence a uma `feature/`. Se ele só recebe `título`, `cor`, `tamanho`, `children` — sem saber nada sobre robótica — ele pertence a `shared/components/ui/`.

### 9.2 Principais componentes do Design System (`shared/ui`)

| Componente          | Uso                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------- |
| Button              | Ações primárias/secundárias/destrutivas                                                |
| Badge / Tag         | Dificuldade, categoria, status                                                         |
| Card                | Base visual para conteúdo em grade (variações compostas nas features)                  |
| Input / SearchInput | Campos de formulário e busca                                                           |
| Modal / Dialog      | Confirmações e filtros em telas pequenas                                               |
| Avatar              | Foto de usuário/autor                                                                  |
| Tooltip             | Dicas contextuais leves                                                                |
| Skeleton            | Estados de carregamento                                                                |
| Pagination          | Listagens longas                                                                       |
| Breadcrumbs         | Mostra apenas o contexto disponível: Aprendizado → Aula, Curso → Aula ou Trilha → item |
| VideoEmbed          | Wrapper padronizado para vídeos do YouTube                                             |
| DownloadLink        | Padroniza links de PDF/download com ícone e tamanho de arquivo                         |
| ThemeToggle         | Opcional futuro para alternância light/dark; light é o padrão visual da v1             |

### 9.3 Principais componentes de feature

| Feature              | Componentes-chave                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `aulas`              | AulaBanner, AulaConteudoMDX, AulaPreRequisitos, AulaMetadados, AulaRecursos                                           |
| `trilhas` / `cursos` | TrilhaCard, CursoCard, ProgressoTrilha (estrutura pronta para uma futura barra de progresso, mesmo que não exista v1) |
| `projetos`           | ProjetoCard, ProjetoGaleria, ProjetoTecnologias                                                                       |
| `noticias`           | NoticiaCard, NoticiaConteudoMDX                                                                                       |
| `busca`              | Base compartilhada de SearchBar, FilterPanel, ResultList para Trilhas/Cursos/Aulas                                    |
| `giscus` _(futuro)_  | GiscusEmbed; sem formulário ou thread próprios                                                                        |
| `patrocinadores`     | SponsorStrip (global, presente em todas as páginas), SponsorGrid (usado em `/patrocinadores`)                         |

### 9.4 Composição Server/Client

Como padrão, todo componente nasce **Server Component** (mais rápido, menos JavaScript enviado ao navegador). Ele só se torna **Client Component** quando precisa de interatividade real: estado local, eventos de clique, formulários. Isso é decidido componente a componente, não pasta a pasta — por exemplo, dentro de `features/aulas/`, `AulaConteudoMDX` é Server, mas `AulaRecursos` (que pode ter um botão de "copiar link") pode conter uma pequena ilha de Client Component isolada, mantendo o resto da árvore estática.

---

## 10. Wireframes ASCII

### 10.1 Home

```
┌──────────────────────────────────────────────────────────────────┐
│  [Logo GEAR]          Aprendizado   Projetos   Notícias   Sobre      │ ← Header fixo
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│     GRUPO DE ESTUDOS AVANÇADOS EM ROBÓTICA — UFMG                 │
│     [Texto de apresentação — lorem ipsum]                         │
│     [CTA: Explorar Aprendizado]  [CTA secundário: Ver Projetos]   │
│                                                                    │
├──────────────────────────────────────────────────────────────────┤
│  MISSÃO                                                            │
│  [Parágrafo institucional — lorem ipsum]                          │
├──────────────────────────────────────────────────────────────────┤
│  ÁREAS DE PESQUISA                                                 │
│  [Card]   [Card]   [Card]   [Card]                                │
├──────────────────────────────────────────────────────────────────┤
│  TRILHAS EM DESTAQUE                                               │
│  [TrilhaCard]  [TrilhaCard]  [TrilhaCard]        [Ver todas →]    │
├──────────────────────────────────────────────────────────────────┤
│  PROJETOS EM DESTAQUE                                              │
│  [ProjetoCard grande com imagem]   [ProjetoCard]  [Ver todos →]   │
├──────────────────────────────────────────────────────────────────┤
│  MEMBROS                                                           │
│  [Avatar+nome] [Avatar+nome] [Avatar+nome] [Avatar+nome] ...      │
├──────────────────────────────────────────────────────────────────┤
│  PARCEIROS E PATROCINADORES              (SponsorStrip — global)  │
│  [logo] [logo] [logo] [logo] [logo]                                │
├──────────────────────────────────────────────────────────────────┤
│  Footer — links institucionais, redes sociais, /privacidade       │
└──────────────────────────────────────────────────────────────────┘
```

### 10.2 Listagem de Trilhas / Cursos (mesmo padrão visual)

```
┌──────────────────────────────────────────────────────────────────┐
│  [Header]                                                          │
├──────────────────────────────────────────────────────────────────┤
│  Trilhas de Aprendizado                                            │
│  [SearchBar.......................................] [Filtros ▾]   │
├──────────────────────────────────────────────────────────────────┤
│  [TrilhaCard]        [TrilhaCard]        [TrilhaCard]              │
│  [TrilhaCard]        [TrilhaCard]        [TrilhaCard]              │
└──────────────────────────────────────────────────────────────────┘
```

> Cada aba da área de Aprendizado usa sua própria busca local e seus filtros próprios para facilitar a navegação dentro da respectiva classificação. Trilhas, Cursos e Aulas nunca misturam resultados entre si; Notícias seguem uma busca separada.

### 10.3 Página da Aula/Post

```
┌──────────────────────────────────────────────────────────────────┐
│  [Header]                                                          │
│  Robótica  ›  Arduino  ›  Primeiro Blink        (Breadcrumbs)      │
├──────────────────────────────────────────────────────────────────┤
│  [ AulaBanner — imagem de capa ]                                   │
│  Primeiro Blink                                                    │
│  [Badge: Iniciante]  [Badge: Arduino]   Publicado em 12/07/2026    │
├───────────────────────────────────────────┬──────────────────────┤
│  [Conteúdo MDX: texto, imagens, vídeo      │  Pré-requisitos:      │
│   embutido do YouTube, blocos de código]   │  • Instalando IDE     │
│                                             │                        │
│  [Downloads: PDF do circuito]              │  Recursos:             │
│  [Link do repositório GitHub]              │  • Repositório GitHub  │
│                                             │  • Link externo        │
├───────────────────────────────────────────┴──────────────────────┤
│  [GiscusEmbed — somente quando a fase futura for habilitada]       │
│  Login, comentários, respostas, reações e moderação são nativos    │
│  do Giscus/GitHub; o Portal não replica esses controles.           │
└──────────────────────────────────────────────────────────────────┘
```

> A Aula tem sempre sua própria URL canônica. Quando acessada a partir de uma Trilha ou Curso, a interface pode preservar esse contexto nos breadcrumbs; quando for avulsa, mostra apenas `Aprendizado → Aulas → Aula`, sem inventar relações.

### 10.4 Página de Projeto

```
┌──────────────────────────────────────────────────────────────────┐
│  [Header]                                                          │
├──────────────────────────────────────────────────────────────────┤
│  [Galeria de imagens/vídeo do projeto]                              │
│  Nome do Projeto                                                    │
│  [Badge: Em andamento]   [Tags de tecnologias]                     │
├──────────────────────────────────────────────────────────────────┤
│  Descrição completa do projeto — lorem ipsum                        │
│  [Botão: Ver no GitHub]   [Botão: Ver documentação]                 │
└──────────────────────────────────────────────────────────────────┘
```

### 10.5 Busca com filtros

> Este wireframe é um exemplo da base visual reutilizável da busca. Os filtros exibidos mudam conforme a aba ativa: Trilhas, Cursos ou Aulas.

```
┌──────────────────────────────────────────────────────────────────┐
│  [Header]                                                          │
├──────────────┬───────────────────────────────────────────────────┤
│ FILTROS       │  [SearchBar................................]      │
│ Categoria ▾   │                                                    │
│ Área      ▾   │  Resultados (24)                                   │
│ Dificuldade▾  │  [Card resultado]                                  │
│               │  [Card resultado]                                  │
│               │  [Card resultado]                                  │
└──────────────┴───────────────────────────────────────────────────┘
```

> Em telas móveis, o painel de filtros da seção 10.5 colapsa em um botão "Filtros" que abre um `Modal`/drawer — mantendo o mesmo componente `FilterPanel`, apenas mudando o contêiner visual.

> Nas listagens de Trilhas, Cursos e Aulas, a busca reutiliza a mesma base de componentes, mas cada aba consulta apenas a sua própria classificação. Em Notícias, a busca é separada, simples e restrita a título/semelhança textual, sem filtros educacionais.

---

## 11. Design System

### 11.1 Direção de design

O briefing visual dos cartazes aponta para uma identidade limpa, institucional e de alto contraste: **branco dominante**, **preto/cinza-escuro** para tipografia e estrutura, **vermelho GEAR** como cor de assinatura e um **azul discreto** apenas como apoio visual. A aparência deve lembrar material de divulgação acadêmica e técnica, com leitura rápida e sensação de organização, sem depender de um painel escuro para parecer "moderna".

**Elemento de assinatura:** como Trilhas e Cursos propõem caminhos ordenados entre conteúdos, a identidade visual usa uma **trilha de conexão estilo placa de circuito** — linhas com ângulos retos e pequenos "pads" quadrados nos pontos de conexão — para ilustrar breadcrumbs e sequências. O motivo visual deve se adaptar tanto a `Trilha → Curso → Aula` quanto a `Trilha → Aula`, sem sugerir que toda Aula pertence obrigatoriamente a uma hierarquia.

### 11.2 Cor

| Token              | Hex       | Uso                                                                       |
| ------------------ | --------- | ------------------------------------------------------------------------- |
| `fundo-base`       | `#F6F7F9` | Fundo principal, inspirado nos cartazes mais claros                       |
| `fundo-superficie` | `#FFFFFF` | Cards, painéis e áreas de conteúdo                                        |
| `borda-sutil`      | `#D7DCE2` | Divisores, contornos de card (hairline)                                   |
| `vermelho-gear`    | `#F03A3A` | Cor de assinatura — CTAs primários, links ativos, marcadores de progresso |
| `azul-sinalizacao` | `#2F6E9E` | Apoio visual em detalhes, estados informativos e elementos secundários    |
| `cinza-gear`       | `#3A3D42` | Títulos fortes, ícones e blocos neutros escuros                           |
| `texto-primario`   | `#1E1F22` | Texto principal sobre fundo claro                                         |
| `texto-secundario` | `#5E646D` | Texto de apoio, metadados                                                 |

O **light mode** é o padrão visual desta paleta. Se um dark mode for usado depois, ele deve ser derivado dos mesmos tokens, invertendo os neutros e mantendo `vermelho-gear` como assinatura, sem introduzir novas cores de marca.

### 11.3 Tipografia

| Papel                                        | Fonte             | Justificativa                                                                                           |
| -------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------- |
| Display (títulos)                            | **Space Grotesk** | Geométrica, com leve caráter técnico/mecânico — remete a rótulos de equipamento sem ser fria            |
| Corpo de texto                               | **IBM Plex Sans** | Desenhada pela IBM para documentação técnica/de engenharia — alta legibilidade em textos longos de aula |
| Dados/utilitário (badges, código, metadados) | **IBM Plex Mono** | Reforça o motivo "circuito/datasheet" em tags, timestamps e trechos de código                           |

Escala tipográfica sugerida (base 16px, razão ~1.25): `12 · 14 · 16 · 20 · 25 · 31 · 39 · 49px`, com pesos concentrados em Regular (corpo) e SemiBold/Bold (destaques) — evitando o uso indiscriminado de múltiplos pesos, que é um dos sinais de design "genérico".

### 11.4 Forma, espaçamento e elevação

- **Raio de borda:** pequeno e consistente (`4px` em cards, `2px` em botões/badges) — reforça a sensação de precisão técnica em vez de um visual "SaaS" arredondado e genérico.
- **Elevação:** preferência por **bordas finas (`borda-sutil`)** sobre sombras pesadas — hairlines combinam melhor com a estética técnica e institucional dos cartazes de referência.
- **Grade de espaçamento:** múltiplos de 4px (4, 8, 12, 16, 24, 32, 48, 64) — padrão simples de memorizar para uma equipe que roda a cada ano.

### 11.5 Movimento

Conforme exigido no briefing ("animações devem ser leves"):

- Transições de **150–200ms**, `ease-out`.
- Sem easings elásticos ou bounce — reforça o tom "sério, técnico" da marca.
- Uso de movimento limitado a: hover states sutis (mudança de cor de borda, leve elevação), revelação suave de cards ao rolar a página, e transição de abertura de modais/drawers.

### 11.6 Acessibilidade (não-negociável, mesmo não mencionada explicitamente no briefing)

- Contraste mínimo AA (4.5:1) entre `texto-primario`/`texto-secundario` e seus respectivos fundos — validado principalmente no light mode, que é o padrão.
- Foco de teclado sempre visível (essencial em uma plataforma educacional, usada também via navegação por teclado).
- Ícones nunca são o único indicador de estado; todo estado relevante também deve ter rótulo textual acessível.

---

## 12. Estratégia de Escalabilidade

O briefing projeta 100+ Aulas, dezenas de Cursos e Trilhas. A arquitetura já foi desenhada para isso, mas vale destacar os mecanismos específicos:

### 12.1 Crescimento de conteúdo

- Adicionar conteúdo é sempre **adicionar um arquivo**, nunca alterar código (seção 8.3) — o esforço de engenharia por Aula tende a zero.
- O deploy automático após cada merge mantém o conteúdo estático sincronizado com o Git; para a escala prevista, um build completo favorece simplicidade e previsibilidade.
- O **CI de validação de front-matter** (seção 2.3) se torna mais importante, não menos, conforme o volume cresce — é a rede de segurança que substitui a ausência de um CMS com validação de formulário.

### 12.2 Gatilhos de migração de infraestrutura

Para que a equipe futura saiba _quando_ revisitar as recomendações da seção 2.4, seguem gatilhos objetivos:

| Sinal observado                                                                 | Ação recomendada                                                                                                            |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Repositório Git começando a pesar (muitos vídeos/imagens grandes em `public/`)  | Migrar mídia para Cloudinary/Vercel Blob (seção 2.4.5)                                                                      |
| Busca client-side perceptivelmente lenta ou índice muito grande                 | Avaliar Postgres Full-Text Search ou Algolia (seção 2.4.6)                                                                  |
| Necessidade de relatórios/analytics sobre conteúdo (visualizações, engajamento) | Considerar uma camada de analytics própria — fora de escopo deste documento                                                 |
| Comunidade pedindo recursos além dos oferecidos pelo Giscus                     | Reavaliar deliberadamente; uma solução social própria é uma decisão de produto e só se justifica com necessidade comprovada |

### 12.3 Escalabilidade de equipe (não só de tráfego)

O maior fator de risco de um projeto estudantil de longo prazo é a **perda de contexto entre gerações**. Recomendações concretas, alinhadas à filosofia do projeto:

- Um `README.md` por feature (`features/aulas/README.md`, etc.) explicando em 5 linhas o que aquela pasta faz — barato de manter, alto valor de onboarding.
- Repositório aberto (ou ao menos visível internamente) no GitHub, com um `CONTRIBUTING.md` descrevendo o fluxo da seção 2.3 — reduz a curva de entrada de novos membros a cada início de semestre.
- Convenções de nomenclatura documentadas neste próprio arquivo (seções 6 e 8) servem como fonte única da verdade — evitar duplicar essas regras em outro lugar.

---

## 13. Checklist Técnico

### Performance

- [ ] Imagens servidas via componente de otimização de imagem do Next.js (dimensionamento automático)
- [ ] Vídeos do YouTube carregados via `VideoEmbed` com carregamento adiado (lazy) até interação/scroll
- [ ] Fontes (Space Grotesk, IBM Plex Sans, IBM Plex Mono) carregadas como variable fonts com `font-display: swap`
- [ ] JavaScript de Client Components restrito às "ilhas" que realmente precisam (busca, filtros e, futuramente, embed do Giscus)
- [ ] Build e deploy automáticos executados após merge de conteúdo na branch principal

### SEO (baixa prioridade, mas presente)

- [ ] `sitemap.xml` gerado automaticamente a partir do conteúdo publicado
- [ ] `robots.txt` configurado
- [ ] Metadados OpenGraph por página (título, descrição, imagem) — essenciais para compartilhamento de Aulas/Notícias em redes sociais de estudantes
- [ ] URLs semânticas já garantidas pela estrutura de slugs (seção 7)

### Acessibilidade

- [ ] Contraste AA validado em light mode (padrão) e, se implementado, também em dark mode
- [ ] Navegação 100% operável por teclado
- [ ] Textos alternativos obrigatórios em imagens de conteúdo MDX

### Segurança / Dados

- [ ] Validação de front-matter no CI antes de qualquer merge de conteúdo
- [ ] Embed do Giscus configurado com GitHub e sem sistema interno de comentários duplicado
- [ ] Página `/privacidade` refletindo o tratamento de dados sob a LGPD
- [ ] Nenhuma credencial ou configuração sensível do GitHub/Giscus exposta além das chaves públicas exigidas pelo embed

### Qualidade / DX

- [ ] TypeScript em modo estrito
- [ ] Lint + checagem de tipos rodando no CI a cada Pull Request
- [ ] Nenhum componente novo criado sem antes verificar se um equivalente já existe (seção 9)
- [ ] Nenhuma dependência nova adicionada sem passar pelos 5 critérios da seção 2.4 (Project Rules, seção 13)
- [ ] Testes recomendados: testes unitários leves para parsing e relações de conteúdo, mais testes end-to-end para navegação e busca; quando o Giscus entrar, adicionar um teste simples de carregamento do embed

### Conteúdo

- [ ] Todo campo obrigatório dos modelos da seção 7 presente em cada `.mdx`
- [ ] Slugs únicos validados automaticamente
- [ ] Pré-requisitos referenciando slugs que de fato existem (link-checking no CI)

---

## 14. Roadmap do Projeto

> **Regra permanente (Project Rules, seção 11):** o desenvolvimento é incremental: uma nova Milestone só começa após a conclusão verificável da anterior. Cada Milestone deve entregar uma fatia pequena, navegável e validável do Portal. A formalização oficial, com responsáveis e critérios detalhados de aceite, deve viver em um `development-plan.md` próprio do projeto.

> **Princípio de priorização:** a ordem considera dependências, valor para o usuário e risco técnico — não apenas complexidade. A plataforma de aprendizado permanece como prioridade funcional do Portal; a Home e a navegação entram antes para tornar esse percurso visível desde o início.

### Milestone 0 — Planejamento executável

- Criar o `development-plan.md` a partir deste roadmap, com critérios de aceite por Milestone
- Registrar backlog futuro e decisões pendentes de infraestrutura
- Definir a estratégia de hospedagem antes do primeiro deploy

**Concluída quando:** existe um plano de desenvolvimento versionado, compreensível por um novo integrante e alinhado a esta arquitetura.

### Milestone 1 — Repositório pronto para desenvolver

- Criar o projeto Next.js com TypeScript estrito e Tailwind CSS
- Inicializar e conectar o repositório ao GitHub
- Configurar lint, checagem de tipos, `.gitignore`, `.env.example` e convenções básicas
- Criar `README.md`, licença e um `CONTRIBUTING.md` inicial
- Criar a estrutura Feature-First vazia prevista na seção 6

**Concluída quando:** uma pessoa nova consegue clonar o repositório, instalar dependências, rodar o projeto localmente e entender como contribuir.

### Milestone 2 — Esqueleto navegável do Portal

- Criar o layout público responsivo, com `Header`, `Footer`, navegação e contêiner global
- Criar todas as rotas principais do sitemap
- Garantir que todos os links de navegação levem a uma rota válida; áreas futuras devem exibir um estado temporário intencional

**Concluída quando:** é possível navegar por todo o mapa do site sem links quebrados ou páginas 404 inesperadas.

### Milestone 3 — Base visual e Home inicial

- Aplicar os tokens visuais, tipografia e regras de acessibilidade essenciais do Design System
- Criar somente os componentes reutilizáveis necessários até esta etapa
- Implementar Hero, apresentação institucional curta e CTAs para Aprendizado e Projetos na Home

**Concluída quando:** a Home comunica a identidade do GEAR, funciona em telas móveis e direciona o visitante para os dois fluxos principais.

### Milestone 4 — Patrocinadores na Home

- Implementar o `SponsorStrip` global usando dados locais versionados
- Exibir logos, links externos e ordem definida para patrocinadores e parceiros

**Concluída quando:** patrocinadores aparecem de forma consistente no layout público, sem exigir painel administrativo ou banco de dados.

### Milestone 5 — Fundação de conteúdo MDX

- Definir schemas e pipeline de leitura para Trilhas, Cursos, Aulas, Projetos e Notícias
- Adicionar conteúdo de exemplo representativo para validar os modelos
- Validar front-matter, slugs, relações e build do conteúdo

**Concluída quando:** adicionar um arquivo MDX válido é suficiente para disponibilizar conteúdo estruturado ao código, sem duplicação manual de dados.

### Milestone 6 — Aulas: primeira fatia funcional

- Implementar a listagem de Aulas
- Implementar a página canônica de Aula renderizando MDX, metadados, pré-requisitos e recursos
- Publicar ao menos uma Aula representativa de ponta a ponta

**Concluída quando:** um visitante consegue encontrar, abrir e consumir uma Aula completa.

### Milestone 7 — Cursos

- Implementar listagem e detalhe de Cursos
- Relacionar Cursos às Aulas por slug e na ordem definida no conteúdo

**Concluída quando:** um visitante consegue navegar de um Curso para todas as suas Aulas, sem duplicar arquivos MDX.

### Milestone 8 — Trilhas

- Implementar listagem e detalhe de Trilhas
- Exibir Cursos e Aulas diretas na ordem definida pela Trilha

**Concluída quando:** uma Trilha organiza corretamente um percurso de aprendizado, inclusive com Cursos e Aulas diretas combinados.

### Milestone 9 — Busca educacional

- Implementar buscas locais independentes para Trilhas, Cursos e Aulas
- Implementar filtros apenas onde fizerem sentido para cada classificação
- Validar a interação em telas móveis, incluindo o painel de filtros

**Concluída quando:** nenhuma busca mistura classificações e os resultados são atualizados corretamente a partir do índice de conteúdo.

### Milestone 10 — Projetos

- Implementar listagem e detalhe de Projetos
- Exibir galeria, tecnologias, status e links externos quando existirem
- Conectar Projetos em destaque à Home

**Concluída quando:** o Portal apresenta os projetos do grupo em páginas próprias e a Home direciona para eles.

### Milestone 11 — Institucional completo e patrocinadores

- Completar `/sobre`, áreas de pesquisa e membros
- Criar a página `/patrocinadores` com a listagem expandida
- Completar as seções institucionais correspondentes da Home

**Concluída quando:** o visitante entende o que é o GEAR, suas áreas de atuação, integrantes e parceiros.

### Milestone 12 — Notícias

- Implementar listagem e página de Notícia em MDX
- Implementar busca simples e exclusiva de Notícias

**Concluída quando:** notícias podem ser publicadas por arquivo MDX e pesquisadas sem se misturar ao conteúdo de Aprendizado.

### Milestone 13 — Qualidade e publicação

- Configurar CI para Pull Requests, lint, tipos, build e validação de conteúdo
- Configurar proteção de branch, fluxo de revisão e deploy
- Implementar sitemap, robots, OpenGraph, `/privacidade` e `/termos`
- Auditar acessibilidade, responsividade e performance conforme o checklist técnico

**Concluída quando:** alterações passam por validações automáticas, o site está publicado e os requisitos técnicos essenciais foram revisados.

### Milestone 14 — Conteúdo real e lançamento

- Substituir conteúdo de exemplo pelas primeiras Aulas, Cursos e Trilhas reais
- Fazer revisão editorial e testes com estudantes
- Atualizar documentação de onboarding para a próxima geração de membros

**Concluída quando:** há conteúdo inicial real, feedback de usuários incorporado e a equipe consegue manter o Portal após o lançamento.

### Backlog futuro (fora do escopo desta versão, mas compatível com a arquitetura)

- Integração do Giscus nas Aulas, usando apenas autenticação e recursos nativos do GitHub
- Barra de progresso individual por Trilha/Curso, caso o produto futuramente justifique autenticação e armazenamento próprios
- Feed RSS de Notícias
- Migração de mídia para CDN dedicado quando os gatilhos da seção 12.2 forem atingidos
- Reavaliação do sistema de busca caso o volume de conteúdo supere o previsto

---

_Fim da documentação de arquitetura. Durante esta revisão colaborativa, este documento registra as decisões estruturais atualmente adotadas para o Portal GEAR. Antes de ser declarado briefing final de implementação, ele deverá ser harmonizado com o GEAR Website — Project Rules e atualizado sempre que uma decisão for revista._
