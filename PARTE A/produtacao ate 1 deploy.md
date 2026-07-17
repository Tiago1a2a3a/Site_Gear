# GEAR — Atualizações de produção até o primeiro deploy

**Data de corte:** 17 de julho de 2026  
**Branch de referência:** `main`  
**Commit de referência:** `986dcd7 feat: destacar progresso nos percursos de aprendizado`  
**Sincronização no corte:** `main` e `origin/main` apontavam para `986dcd7`  
**Marco deste documento:** primeiro ciclo real de deploy e teste público no Cloudflare

Este é o documento operacional de continuidade do Portal GEAR. Ele reúne o que
mudou desde o início da implementação até o primeiro deploy, com atenção especial
ao contexto que não está consolidado nos demais arquivos Markdown. O objetivo é
permitir que outra pessoa ou IA entenda rapidamente o estado real do projeto,
saiba o que já foi comprovado, evite repetir tentativas descartadas e retome do
ponto correto.

Este documento não substitui as fontes oficiais. Antes de alterar arquitetura,
escopo, hospedagem, autenticação ou uma Milestone, ler nesta ordem:

1. [`gear-documentacao-arquitetura (2).md`](./gear-documentacao-arquitetura%20%282%29.md);
2. [`GEAR Website — Project Rules.md`](./GEAR%20Website%20%E2%80%94%20Project%20Rules.md);
3. [`development-plan.md`](./development-plan.md);
4. [`milestone_login.md`](./milestone_login.md), quando o trabalho tocar login,
   inscrições, progresso, conta, Supabase ou dados pessoais;
5. este documento;
6. [`agent.md`](../agent.md), para o procedimento operacional do agente.

Em caso de divergência, seguir a hierarquia descrita em `agent.md` e confirmar o
comportamento no código atual. O Graphify é um mapa útil de relações, não uma
autoridade sobre requisitos.

## 1. Resumo executivo

O Portal GEAR deixou de ser um esqueleto de Next.js e chegou ao primeiro deploy
público com as principais superfícies do produto implementadas:

- Home e identidade visual GEAR/UFMG;
- navegação responsiva, Header, Footer, 404 e componentes compartilhados;
- Aprendizado com Aulas, Cursos, Trilhas, destaques, conteúdos recentes,
  breadcrumbs e buscas;
- Projetos com listagem, detalhe, galeria, tecnologias e destaques na Home;
- área institucional, página Sobre e Patrocinadores;
- Notícias com listagem, pesquisa, detalhe em MDX, metadata e 404;
- pipeline editorial MDX/Velite com validações de relações, mídias e rascunhos;
- login GitHub via Supabase, inscrições, conclusões de Aulas, cálculo de progresso,
  dashboard `Meu aprendizado` e exclusão de conta;
- testes unitários, E2E, validações editoriais e testes de banco/RLS preparados;
- primeiro ciclo de publicação no Cloudflare, com diagnóstico de binding e teste
  do site já hospedado em navegadores/dispositivos.

O código está mais avançado do que a seção “Estado atual” do `README.md`, que ainda
fala apenas nas Milestones 4 e 5. Não usar esse trecho isoladamente para decidir
onde recomeçar.

Também é essencial separar três conceitos:

1. **implementado no código:** existem rotas, componentes, dados e testes;
2. **validado localmente:** os checks correspondentes passaram em uma execução
   conhecida;
3. **formalmente concluído:** todos os itens e o gate da Milestone possuem
   evidência e aceite conforme o plano.

A presença de código ou um deploy bem-sucedido não conclui automaticamente uma
Milestone.

## 2. Linha do tempo consolidada

### 2.1 Planejamento, arquitetura e bootstrap

- O roadmap original foi convertido em Milestones pequenas, dependentes e
  demonstráveis.
- A arquitetura Feature-First foi fixada: `app` roteia e compõe, `features`
  contém domínio, `shared` contém reutilização genérica e `src/content` contém o
  conteúdo editorial.
- Foi criado o projeto Next.js com App Router, React, TypeScript estrito,
  Tailwind CSS, npm e lockfile.
- O mapa de rotas, layout público, navegação responsiva, 404 e suíte inicial de
  testes foram estabelecidos.

### 2.2 Base visual, Home, patrocinadores e conteúdo

- A identidade GEAR foi materializada com vermelho, grafite, branco e cinza
  claro. O azul não é a cor principal de destaque.
- A Home passou a usar assets reais de marca, carrossel no hero, seções
  institucionais, áreas de pesquisa, projetos em destaque e animações discretas.
- A faixa global de patrocinadores e a página expandida compartilham a mesma
  fonte de dados.
- O pipeline Velite/MDX ganhou schemas, validação de slugs, relações, ciclos,
  publicação, URLs, imagens e downloads.
- `npm run build` executa `npm run content:validate` antes do build do Next.js.

### 2.3 Aprendizado

- Foram implementadas listagens e detalhes de Aulas, Cursos e Trilhas.
- A página principal de Aprendizado possui Cursos em destaque, conteúdos recentes
  e entradas para explorar os três tipos.
- A busca unificada de Aprendizado e as buscas específicas permanecem separadas.
- Cursos e Trilhas resolvem suas relações pelos slugs editoriais; rascunhos não
  devem aparecer nas superfícies públicas.
- Breadcrumbs são navegação real, não apenas texto decorativo.
- O commit `986dcd7` acrescentou destaque visual de progresso nos percursos de
  aprendizado.

### 2.4 Projetos, institucional e Notícias

- Projetos possuem listagem, detalhe estático, metadata, galeria, tecnologias,
  conteúdo MDX e destaques na Home.
- Home e Sobre reutilizam `src/shared/config/institutional.ts`, evitando cópias
  divergentes de missão e áreas de pesquisa.
- Nenhuma identidade de membro foi inventada. Enquanto não houver dados aprovados,
  a interface deve manter um estado explícito de equipe em atualização.
- `SponsorStrip` e `SponsorGrid` usam a mesma fonte de patrocinadores.
- Notícias possuem fonte editorial MDX, ordenação, busca própria, cards, detalhe,
  metadata e testes. Notícias não entram na busca educacional.
- Foram extraídos pontos de reutilização como renderização MDX, campo de busca,
  normalização textual, extração de texto e formatação de data.

### 2.5 M13 extra — Login, inscrições e Meu aprendizado

O plano foi alterado por uma exceção explicitamente aprovada. A numeração vigente
deve ser interpretada assim:

- M12 — Notícias;
- M13 — Login, inscrições e Meu aprendizado;
- M14 — Qualidade e publicação, antiga M13;
- M15 — Conteúdo real e lançamento, antiga M14.

A M13 extra implementou:

- `@supabase/ssr`, `@supabase/supabase-js` e Supabase CLI em versões fixadas;
- clientes Supabase para browser e servidor;
- renovação de sessão por `proxy.ts`;
- OAuth PKCE com GitHub e callback em `/auth/callback`;
- rotas `/login`, `/meu-aprendizado` e `/api/conta`;
- tabelas `learning_enrollments` e `lesson_completions`;
- migrations, índices, grants mínimos, RLS por `auth.uid()` e cascade de exclusão;
- inscrição e saída de Cursos/Trilhas;
- marcação e desmarcação de Aulas concluídas;
- progresso pessoal calculado sobre o conteúdo editorial;
- dashboard com estudos em andamento, concluídos, aulas recentes e configurações;
- exclusão de conta e dados ativos;
- documentação de configuração, ADR e rollback;
- testes unitários, E2E e pgTAP/CI de banco preparados.

As páginas públicas continuam funcionando sem variáveis Supabase. Isso é
intencional: indisponibilidade ou ausência do serviço pessoal não deve derrubar o
conteúdo público.

Privacidade e Termos foram aprovados por Tiago Lopes em 16 de julho de 2026. Ainda
assim, a ativação real completa de autenticação em produção depende da configuração
externa descrita na seção 7.

## 3. Estado atual por área

| Área | Estado observado no corte | Onde confirmar |
| --- | --- | --- |
| Base Next.js e arquitetura | Implementada | `src/app`, `src/features`, `src/shared`, configs |
| Home e visual | Implementados e aprovados localmente | `src/app/(site)/page.tsx`, `src/styles/globals.css` |
| Patrocinadores | Implementados | `src/features/patrocinadores` |
| Pipeline MDX | Implementado e integrado ao build | `content.schemas.ts`, `content.validation.ts`, `velite.config.mts` |
| Aulas, Cursos e Trilhas | Implementados; confirmar gates formais no plano | `src/features/aulas`, `cursos`, `trilhas` |
| Busca de Aprendizado | Implementada | `src/features/busca` e rotas de busca |
| Projetos | Implementados | `src/features/projetos` |
| Institucional | Implementado sem inventar membros | `src/features/institucional`, `institutional.ts` |
| Notícias | Implementadas e separadas de Aprendizado | `src/features/noticias` |
| Login e Meu aprendizado | Código implementado; ativação externa e gate final ainda exigem prova | `milestone_login.md`, `src/features/autenticacao`, `src/features/meu-aprendizado`, `supabase` |
| Qualidade/publicação | Parcial; houve primeiro deploy, mas M14 não está formalmente fechada | `development-plan.md`, `.github/workflows` |
| Conteúdo real/lançamento | Não presumir concluído | M15 no plano vigente |

Não “voltar para M6” automaticamente como recomendava a versão antiga deste
documento. Primeiro auditar o estado atual e os gates. A M13 extra foi autorizada
mesmo sem fechamento retroativo de M6–M12, portanto a ordem cronológica do código
não prova a ordem dos aceites formais.

## 4. Arquitetura e contratos que não devem ser quebrados

- `src/app` deve permanecer fino: rota, metadata e composição.
- Regra de domínio fica em `src/features`.
- Reutilização genérica fica em `src/shared`.
- Features não importam diretamente outras features.
- Conteúdo editorial permanece em `src/content` e é versionado no Git.
- `.velite` é saída gerada; nunca editar manualmente.
- Server Components são o padrão. Client Components entram apenas quando estado,
  eventos ou APIs do navegador forem indispensáveis.
- Conteúdo público não deve depender da disponibilidade do Supabase.
- Identificadores pessoais no banco referenciam slugs/IDs editoriais; o conteúdo
  de Cursos, Trilhas e Aulas não deve ser duplicado no banco.
- Remover inscrição preserva conclusões de Aulas; excluir a conta remove os dados
  pessoais ativos.
- Busca de Notícias e busca de Aprendizado são domínios separados.
- Home/Sobre compartilham dados institucionais; faixa/grid compartilham dados de
  patrocinadores.
- Não inventar membros, autores, links institucionais, patrocinadores ou conteúdo
  apresentado como real.

## 5. Estado do Git no corte

Histórico recente relevante:

```text
986dcd7 feat: destacar progresso nos percursos de aprendizado
be2d06e feat: concluir portal e integrar autenticacao Supabase
e43688d Revert "Corrigir carregamento de imagens no Cloudflare"
9795586 Corrigir carregamento de imagens no Cloudflare
f999811 Preparar site para deploy na Vercel
2c1f6a7 docs: update agent guidance
7531065 docs: add new project notes
4c20968 chore: update Graphify code index
91a795c feat: cria portal GEAR e pipeline editorial
```

No corte, `main` e `origin/main` estavam sincronizados em `986dcd7`. Isso corrige
o contexto antigo em que a branch local estava vários commits à frente do remoto.
Sempre verificar novamente com:

```bash
git status -sb
git branch -vv
git log --oneline --decorate -10
```

Não presumir que uma futura publicação usa o commit local mais recente sem
confirmar o commit do deploy no provedor.

## 6. Primeiro deploy: o que aconteceu e o que foi aprendido

### 6.1 Escolha de hospedagem

O primeiro preparo foi commitado com a mensagem “Preparar site para deploy na
Vercel”, mas a decisão operacional mudou durante o processo: o provedor escolhido
para o primeiro deploy foi o **Cloudflare**. Seguir a decisão mais recente; não
retomar Vercel por causa do nome histórico do commit.

### 6.2 Falha inicial de binding

O build/upload avançou, mas a publicação falhou inicialmente com:

```text
Service binding 'WORKER_SELF_REFERENCE' references Worker 'gear-portal'
which was not found. [code: 10143]
```

O alvo usado no Cloudflare tinha o nome `sitegear`, enquanto o binding referenciava
`gear-portal`. Essa foi uma falha de configuração do provedor após o build, não
uma falha da aplicação Next.js nem da validação Velite.

Ao diagnosticar publicação futura, separar:

1. aplicação compila localmente;
2. repositório remoto contém o commit esperado;
3. Cloudflare constrói o commit esperado;
4. nomes de Worker/serviço/bindings coincidem;
5. o deployment recebe uma URL pública e responde;
6. smoke tests passam nessa URL.

### 6.3 Site público e imagens

Após corrigir o fluxo de publicação, o site pôde ser testado publicamente. As
imagens apareceram em celular e em janela anônima, e assets de `public/images`
responderam por URL direta. Isso provou que os arquivos estavam publicados.

Foi testada a hipótese de desabilitar a otimização do `next/image`:

```ts
images: {
  unoptimized: true;
}
```

Essa alteração gerou o commit `9795586`, mas não foi comprovada como causa real e
foi revertida corretamente pelo commit `e43688d`. O estado atual de
`next.config.ts` voltou a ser uma configuração vazia.

Não reaplicar `images.unoptimized = true` por reflexo. Se imagens falharem:

1. testar o asset direto;
2. comparar navegador normal, anônimo e celular;
3. verificar cache e console/rede do navegador;
4. inspecionar dimensões/layout e o comportamento do `next/image`;
5. só então testar uma mudança reversível.

### 6.4 URL pública

O ciclo de deploy foi comprovado por testes no site hospedado, mas a URL exata
não está versionada nos arquivos do projeto nem preservada de forma confiável
neste handoff. Não inventar uma URL. Obter o endereço atual no dashboard do
Cloudflare e registrar junto do commit do deployment antes de divulgar.

## 7. Dependências externas e pendências reais

### 7.1 Supabase e GitHub OAuth

O código de autenticação não significa que o login esteja automaticamente ativo
em todo ambiente. Para ativação real, confirmar:

- projeto Supabase exclusivo do ambiente;
- migrations aplicadas;
- GitHub OAuth App configurado;
- callback e URLs permitidas corretas para local, preview e produção;
- variáveis públicas do Supabase configuradas no provedor;
- `SUPABASE_SERVICE_ROLE_KEY` disponível somente no servidor;
- nenhum segredo enviado ao cliente, ao Git ou ao Graphify;
- testes de login, logout, RLS, inscrição, conclusão e exclusão na URL hospedada;
- retenção de backups do plano Supabase contratado.

Seguir `docs/supabase-setup.md` e `docs/supabase-rollback.md`. Nunca copiar valores
de `.env.local` para documentação, mensagens, commits ou saídas de ferramenta.

### 7.2 Gates que continuam abertos

- Não há evidência consolidada neste documento de ruleset/proteção completa da
  `main`, aprovações obrigatórias e todos os checks bloqueantes de PR.
- O workflow de banco existe, mas os testes pgTAP dependem de Supabase/Docker e
  precisam de evidência de execução no ambiente adequado.
- O primeiro deploy não fecha sozinho a Milestone de Qualidade e publicação.
- Ainda são necessários smoke tests formais de produção, auditorias de
  acessibilidade, performance, SEO, segurança e dados conforme o plano.
- O conteúdo de demonstração não deve ser confundido com pacote editorial real
  aprovado para lançamento.
- Dados de membros, links sociais e outros detalhes institucionais só podem ser
  publicados após aprovação.
- O endereço público e o commit de cada deploy devem passar a ser registrados.

## 8. Validações conhecidas

Na entrega de M11/M12 passaram:

- `npm run format:check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm test`;
- `npm run content:validate`;
- `npm run velite:proof`;
- `npm run build`;
- `npm run test:e2e`, com 37/37 testes.

No Windows, Playwright com `next dev`/Turbopack apresentou corrida de manifests
com vários workers. O projeto adotou um worker no Windows em
`playwright.config.ts`; manter essa proteção enquanto o problema existir.

Na entrega da M13 extra houve ampliação significativa de testes e build, mas a
próxima pessoa deve executar novamente a suíte atual em vez de depender apenas
do resultado histórico. Para banco/RLS, Docker e Supabase local são pré-requisitos.

Sequência recomendada:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run content:validate
npm run velite:proof
npm run build
npm run test:e2e
```

Quando Supabase local estiver disponível:

```bash
npm run supabase:start
npm run supabase:reset
npm run test:db
npm run supabase:stop
```

`npm run velite:proof:invalid` é uma prova negativa e deve falhar pelo campo
obrigatório `titulo`; não tratar essa falha esperada como regressão.

## 9. Como usar o Graphify neste estado

Existe `graphify-out/graph.json`. Antes de navegar manualmente pelo código:

1. executar `graphify reflect --if-stale`;
2. ler `graphify-out/reflections/LESSONS.md`;
3. consultar o grafo com tokens presentes em `graphify-out/.vocab.txt`;
4. confirmar no arquivo apontado por `source_location`;
5. usar `rg` para arquivos novos ou informações que o grafo não cobre;
6. salvar consultas úteis com resultado marcado;
7. após mudança estrutural, atualizar com `graphify update .`.

Neste corte, o grafo mapeava bem Aprendizado, Projetos, Notícias, Login e
Supabase. O vocabulário não cobria de forma útil o histórico operacional de
Cloudflare/deploy; por isso esta seção de deploy foi confirmada pelo Git,
configuração atual e histórico do trabalho, não inferida de arestas inexistentes.

O caminho do interpretador fica em `graphify-out/.graphify_python`. Em PowerShell,
se o comando global não estiver no PATH:

```powershell
$py = (Get-Content graphify-out/.graphify_python).Trim()
& $py -m graphify query "termos presentes no vocabulario"
```

## 10. Ponto seguro para retomar

A próxima pessoa não deve começar criando uma nova feature. Deve primeiro fazer
uma auditoria curta do estado implantado:

1. ler os documentos listados no início;
2. conferir `git status -sb`, branch, remoto e commit atual;
3. consultar o Graphify para a área do pedido;
4. executar a suíte local proporcional;
5. abrir o deployment atual do Cloudflare e registrar URL + commit;
6. testar rotas públicas, imagens, 404, busca e responsividade;
7. se Supabase estiver configurado, testar OAuth, sessão, RLS, inscrições,
   conclusões, progresso e exclusão de conta;
8. comparar a evidência com os gates vigentes da M13 extra e da M14;
9. escolher o menor item ainda não comprovado, sem antecipar M15;
10. atualizar este handoff quando houver novo deploy, aceite ou decisão duradoura.

Se o objetivo imediato for formalizar a M13 extra, começar pelas pendências
externas e evidências do gate `ML-16`, não por reescrever a implementação. Se o
objetivo for seguir para Qualidade e publicação, tratar a etapa como **M14**,
apesar de seções antigas do corpo do plano ainda exibirem a numeração anterior.

## 11. Checklist rápido para IA ou pessoa nova

- [ ] Li arquitetura, regras, plano e este handoff.
- [ ] Li `milestone_login.md` se o pedido toca dados pessoais ou Supabase.
- [ ] Consultei o Graphify e confirmei os arquivos no código.
- [ ] Sei qual Milestone/item está ativo e qual gate anterior é exigido.
- [ ] Não confundi código presente com aceite formal.
- [ ] Não li, imprimi nem versionei segredos de `.env.local`.
- [ ] Preservei Feature-First e evitei imports diretos entre features.
- [ ] Mantive conteúdo público independente do Supabase.
- [ ] Não inventei pessoas, autoria, links ou conteúdo institucional.
- [ ] Rodei validações proporcionais e relatei exatamente o que passou.
- [ ] Confirmei URL e commit do deploy antes de declarar produção atualizada.
- [ ] Listei arquivos criados, modificados, renomeados e limitações.

## 12. Referências rápidas

- [README e comandos](../README.md)
- [Plano operacional e gates](./development-plan.md)
- [Arquitetura e roadmap](./gear-documentacao-arquitetura%20%282%29.md)
- [Regras permanentes](./GEAR%20Website%20%E2%80%94%20Project%20Rules.md)
- [Especificação da M13 extra](./milestone_login.md)
- [Guia editorial](../docs/content-editorial.md)
- [Configuração do Supabase](../docs/supabase-setup.md)
- [Rollback do Supabase](../docs/supabase-rollback.md)
- [ADR Supabase](../docs/adr/0001-supabase-auth-learning.md)
- [Relatório do grafo](../graphify-out/GRAPH_REPORT.md)

## 13. Regra de manutenção deste documento

Atualizar este arquivo quando ocorrer qualquer um destes eventos:

- novo deploy ou rollback;
- mudança de provedor, domínio, Worker, binding ou pipeline;
- conclusão/aceite formal de Milestone;
- mudança de arquitetura ou dependência externa;
- ativação ou alteração de autenticação/banco;
- descoberta de limitação que possa induzir outra pessoa ao erro;
- mudança do ponto recomendado de retomada.

Cada atualização deve registrar data, commit, ambiente, validações executadas,
resultado do smoke test, pendências e decisão humana relevante. Não transformar
este documento em diário de cada pequena edição: preservar apenas contexto
necessário para continuidade.
