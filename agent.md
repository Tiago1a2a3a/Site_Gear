# Regras do agente — Portal GEAR

Este arquivo define como trabalhar no Portal GEAR com segurança, rastreabilidade e
baixo desperdício de contexto. O Graphify é a primeira ferramenta de orientação
do código, mas não substitui as fontes oficiais nem a revisão humana.

## 1. Hierarquia das fontes de verdade

Em caso de conflito, aplicar esta ordem:

1. `PARTE A/gear-documentacao-arquitetura (2).md` — arquitetura e decisões de produto.
2. Seção 19 de `PARTE A/GEAR Website — Project Rules.md` — atualizações às regras.
3. Demais seções de `PARTE A/GEAR Website — Project Rules.md` — regras permanentes.
4. `PARTE A/development-plan.md` — ordem das Milestones, backlog, dependências, gates e testes.
5. `agent.md`, READMEs de features e código — instruções operacionais derivadas.
6. Graphify — mapa de relações, localização e histórico de consultas; nunca autoridade para inventar requisitos.

O Graphify pode estar desatualizado. Quando houver divergência entre o grafo e os
arquivos atuais, confirmar com os arquivos e considerar os arquivos como corretos.

## 2. Roteamento obrigatório pelo Graphify

Antes de procurar arquivos manualmente para uma pergunta sobre arquitetura,
relações, fluxo, componente ou localização, verificar se existe
`graphify-out/graph.json`.

### Perguntas e diagnósticos

- Se o grafo existir, usar o fast path de `graphify query`.
- Antes da travessia, expandir a pergunta somente com tokens presentes no
  vocabulário do grafo; não inventar sinônimos ou arestas.
- Para cadeia específica, usar DFS/path; para contexto amplo, usar BFS.
- Ler `graphify-out/reflections/LESSONS.md` após `graphify reflect --if-stale`.
- Se a resposta depender de um detalhe factual, abrir o arquivo indicado por
  `source_location` e confirmar no código.
- Se o grafo não tiver informação suficiente, dizer isso e usar `rg`/leitura
  direcionada; nunca reconstruir a arquitetura por suposição.
- Consultas úteis devem ser salvas com `graphify save-result`, marcando o
  resultado como `useful`, `dead_end` ou `corrected` conforme a evidência.

### Mudanças no código

1. Consultar o Graphify para localizar a rota, componente, feature, teste e
   dependências relacionadas.
2. Ler somente os arquivos apontados e seus contratos imediatos antes de editar.
3. Usar `rg`/`rg --files` para confirmar arquivos que o grafo possa não ter
   indexado ou que tenham sido alterados depois da última extração.
4. Após uma mudança estrutural ou de vários arquivos, atualizar o grafo com
   `graphify <path> --update` quando o ambiente permitir.

O Graphify deve excluir conceitualmente `node_modules`, `.next`, arquivos gerados
e `graphify-out` das decisões de produto. Esses diretórios podem ser consultados
apenas para diagnóstico de build, nunca como fonte de arquitetura.

## 3. Leitura proporcional das fontes oficiais

A leitura integral dos três documentos da Parte A é obrigatória:

- ao iniciar uma Milestone;
- ao retomar uma Milestone interrompida;
- ao mudar de Milestone;
- ao propor alteração arquitetural, nova dependência, nova rota, novo modelo de
  conteúdo, autenticação, banco, hospedagem ou escopo do MVP.

Para uma alteração localizada dentro da Milestone já validada, é suficiente ler:

- as seções da Parte A ligadas ao comportamento alterado;
- os itens correspondentes do `development-plan.md`;
- o README da feature e os testes afetados;
- `agent.md` e as decisões salvas pelo Graphify.

Se não for possível provar que a Milestone atual está clara e seu gate anterior
foi cumprido, parar a implementação e fazer a leitura integral antes de seguir.

## 4. Gates e limites de implementação

- Confirmar a Milestone ativa, seus IDs, dependências e gate anterior antes de
  criar ou alterar código.
- Implementar somente itens da Milestone ativa ou uma correção necessária para
  preservar um gate já entregue.
- Não antecipar UI ou comportamento de Milestones futuras apenas porque o
  contrato de dados já existe.
- Não alterar arquitetura, camadas, rotas ou dependências sem justificativa e
  aprovação explícita da equipe.
- `app/` apenas roteia e compõe; domínio fica em `features/`; reutilização
  genérica fica em `shared/`; conteúdo editorial fica em MDX.
- Features não importam diretamente umas às outras.
- Server Component é o padrão; Client Component só entra por estado, evento ou
  API do navegador indispensável.
- Não criar banco, autenticação própria, CMS, analytics, comentários próprios,
  dark mode obrigatório ou busca global no MVP.
- Patrocinadores e dados institucionais são versionados no código, sem painel.

## 5. Segurança de conteúdo e dados

- Não expor segredos, tokens, `.env`, credenciais ou dados pessoais em código,
  Graphify, testes, commits ou mensagens.
- Conteúdo inválido, slug duplicado, relação inexistente, mídia ausente ou
  rascunho vazando deve bloquear a validação quando a regra exigir.
- Não inventar conteúdo institucional, autoria, membros, patrocinadores,
  relações ou arestas do grafo.
- Links externos devem usar HTTPS e abrir em nova aba somente quando isso for
  intencional, com indicação acessível.
- Imagens precisam de dimensão, texto alternativo adequado e fallback quando
  forem opcionais; respeitar direitos/autorização dos arquivos fornecidos.

## 6. Qualidade antes de declarar concluído

Antes de concluir uma mudança, executar o conjunto proporcional ao risco:

- formatação e lint;
- TypeScript estrito;
- testes unitários afetados;
- validação de conteúdo quando aplicável;
- build de produção;
- E2E de navegação/responsividade quando houver rota ou UI;
- teclado, foco, contraste, estados vazios, 404 e ausência de overflow quando
  houver interface.

Não declarar inspeção visual manual se o navegador/preview não foi realmente
acessado. Relatar limitações e separar claramente testes automatizados de revisão
visual.

## 7. Processo de trabalho curto

1. Classificar o pedido: pergunta, diagnóstico, correção localizada, feature,
   Milestone ou decisão arquitetural.
2. Consultar Graphify e atualizar/refletir suas lições quando necessário.
3. Confirmar gate, escopo e arquivos afetados.
4. Ler apenas as fontes proporcionais definidas na seção 3.
5. Implementar a menor mudança reversível, usando `apply_patch` para texto.
6. Verificar diff, testes e build.
7. Atualizar documentação e Graphify quando a mudança alterar relações ou
   decisões duradouras.
8. Entregar resumo com arquivos, validações, limitações e pontos que exigem
   revisão humana.

## 8. Condições para parar e pedir direção

Parar antes de editar quando:

- houver conflito não resolvido entre fontes de verdade;
- a Milestone/gate ativo não puder ser identificado;
- a mudança exigir decisão arquitetural ou ampliar o MVP;
- houver dúvida sobre autorização de uso de logo, foto, texto ou dado pessoal;
- a correção exigir segredo, credencial, serviço externo ou publicação não
  autorizada.

O agente deve explicar o bloqueio com evidência concreta e pedir somente a
decisão necessária.

## 9. Documento de continuidade

Antes de iniciar ou retomar trabalho, ler
`PARTE A/produtacao ate 1 deploy.md`. Esse documento registra o estado do Portal
até 17 de julho de 2026 e o primeiro ciclo real de deploy: evolução das
Milestones, decisões visuais, M11/M12, M13 extra com Supabase, histórico recente
do Git, diagnóstico do Cloudflare, tentativa de correção de imagens já revertida,
pendências externas e o ponto seguro de retomada.

Usar esse handoff para evitar repetir investigações e para distinguir código
implementado, validação conhecida e aceite formal. Antes de declarar produção
atualizada, confirmar no provedor a URL pública, o commit implantado, bindings e
smoke tests; a URL exata não deve ser inferida ou inventada.

Ele é um registro operacional de continuidade, não substitui a hierarquia das
fontes oficiais acima. Quando o documento de continuidade divergir do código,
do estado do deploy ou das fontes oficiais, confirmar na fonte correspondente e
atualizar o documento após a decisão.

## 10. Objetivo

Garantir que cada mudança do Portal GEAR seja pequena, rastreável, testável e
consistente com a arquitetura, usando o Graphify para reduzir leitura repetida
sem transformar o mapa do código em autoridade sobre o produto.
