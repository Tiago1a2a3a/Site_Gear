# Milestone extra — Login, inscrições e Meu aprendizado

## Status

Milestone extra autorizada por **Tiago Lopes** para execução antes da M13, condicionada ao cumprimento dos gates, critérios de aceite e decisões registrados neste documento.

## Contexto arquitetural

A v1 documentada originalmente não possui autenticação própria nem banco de dados. A documentação prevê avaliar autenticação e armazenamento no futuro caso surja uma funcionalidade interna que realmente exija conta no Portal, como progresso individual.

Esta proposta trata o progresso individual como esse requisito concreto. Portanto, sua execução exige uma atualização formal da arquitetura, do `development-plan.md`, das regras de privacidade e dos gates correspondentes. A existência desta proposta não substitui essa aprovação.

Esta Milestone é um extra do roadmap principal. Ela não altera a ordem das Milestones existentes e não deve ser usada para antecipar funcionalidades futuras sem uma decisão explícita da equipe.

## Objetivo

Permitir que uma pessoa entre no Portal GEAR usando sua conta GitHub e mantenha, na página `/meu-aprendizado`, as inscrições em Cursos e Trilhas e o registro das Aulas que marcou como concluídas.

O recurso deve permitir que a pessoa:

- entre e saia da conta;
- inscreva-se em um Curso ou uma Trilha;
- remova uma inscrição;
- marque uma Aula como concluída;
- desfaça a conclusão de uma Aula;
- acompanhe o progresso calculado dos Cursos e Trilhas;
- consulte seu histórico de Aulas concluídas.

O conteúdo público continuará sendo proveniente dos arquivos MDX versionados. O banco armazenará somente as relações entre uma pessoa autenticada e os conteúdos públicos.

## Responsabilidades

- **Supabase Auth:** autenticação via GitHub e sessão do usuário.
- **Supabase Database:** inscrições e conclusões de Aulas, protegidas por políticas de acesso por usuário. Os dados básicos de identidade permanecem no Supabase Auth.
- **MDX/Velite:** fonte de verdade de Cursos, Trilhas, Aulas, relações, slugs, status editorial e conteúdo publicado.
- **Portal GEAR:** interface, fluxo de autenticação, ações de inscrição e conclusão, regras de progresso, estados de carregamento/erro e página `/meu-aprendizado`.

O Portal não armazenará senhas e não acessará repositórios, organizações, Issues, Gists ou outros dados da conta GitHub além dos dados de identidade necessários.

## Compatibilidade com a arquitetura do Portal

A implementação deve preservar as regras existentes:

- `app/` roteia e compõe páginas;
- regras de domínio ficam em `features/`;
- componentes genéricos ficam em `shared/`;
- o conteúdo editorial permanece em MDX;
- Server Components são o padrão;
- Client Components só serão usados para eventos, estado local ou APIs do navegador indispensáveis;
- features não importam diretamente umas às outras;
- as páginas públicas de conteúdo continuam podendo ser geradas sem depender da sessão de um usuário.

### Organização sugerida

> **Sugestão de estrutura:** criar uma feature própria para o domínio pessoal, sem colocar regras de progresso diretamente em `app/`.

```text
src/features/meu-aprendizado/
├── components/
├── data/
├── services/
├── types.ts
└── README.md
```

```text
src/app/(site)/login/page.tsx
src/app/(site)/meu-aprendizado/page.tsx
```

A página em `app/` deve apenas compor a feature e controlar a rota. A localização exata de clientes Supabase, Server Actions ou Route Handlers permanece dependente da decisão de integração descrita abaixo.

## Autenticação

### Provedor

O botão `Login` do header deve iniciar a autenticação do Portal usando GitHub por meio do Supabase Auth.

O Portal não deve implementar OAuth, armazenamento de senha ou recuperação de conta próprios.

### Escopos de identidade

O Portal deve solicitar somente a identidade necessária para vincular a sessão à pessoa e apresentar sua identificação na página pessoal:

- identificador único do usuário no Supabase Auth;
- identificador do usuário no GitHub, quando fornecido pelo provedor;
- nome de usuário ou nome público;
- nome de exibição, quando disponível;
- URL do avatar, somente se o Portal exibir o avatar;
- identificador do provedor GitHub.

O e-mail não é requisito desta Milestone e não deve ser solicitado deliberadamente apenas para o progresso.

O vínculo técnico principal das tabelas do Portal deve ser o `user_id` do Supabase Auth. O identificador do GitHub é um dado do provedor, não deve substituir o ID interno de autenticação.

### Sessão e retorno

O fluxo deve funcionar nos ambientes de desenvolvimento, preview e produção, com URLs de callback específicas para cada ambiente.

Quando a pessoa tentar executar uma ação que exige autenticação, o Portal deve:

1. preservar a rota de origem;
2. iniciar o login com GitHub;
3. tratar aprovação, cancelamento e erro do callback;
4. retornar à rota de origem depois do login;
5. concluir a ação original somente uma vez;
6. exibir feedback caso a ação não possa ser concluída.

O site não deve exigir login apenas para navegar, ler conteúdo ou pesquisar.

### Ações que exigem autenticação

A autenticação será necessária para:

- inscrever-se em um Curso;
- inscrever-se em uma Trilha;
- remover uma inscrição;
- marcar uma Aula como concluída;
- desfazer a conclusão de uma Aula;
- consultar o conteúdo personalizado de `/meu-aprendizado`.

Uma pessoa não autenticada que acessar `/meu-aprendizado` deve ver uma apresentação curta do recurso e um botão para entrar com GitHub.

## Modelo conceitual de dados

O modelo exato do banco ainda precisa ser aprovado, mas deve representar os conceitos abaixo.

### Identidade

O Supabase Auth será a fonte da sessão e do usuário autenticado. Esta Milestone não criará uma tabela própria de perfil. Caso uma funcionalidade futura exija dados adicionais, essa necessidade deverá ser avaliada em uma nova decisão arquitetural.

### Inscrição

Uma inscrição representa a intenção de acompanhar um Curso ou uma Trilha.

```text
Inscrição
- user_id
- content_type: curso | trilha
- content_identifier
- enrolled_at
- last_activity_at
```

Deve existir uma restrição para impedir duas inscrições ativas iguais para a mesma pessoa e o mesmo conteúdo.

`last_activity_at` deve ser atualizado somente por eventos definidos pelo domínio, como inscrição e conclusão de Aula relacionada. Abrir uma página não deve alterar esse campo automaticamente.

### Conclusão de Aula

Uma Aula não terá estado persistido de “iniciada” ou “em andamento”. Ela será considerada concluída quando existir um registro para o usuário.

```text
Conclusão de Aula
- user_id
- lesson_identifier
- completed_at
```

A ausência do registro representa Aula não concluída. A operação de marcar como concluída e a operação de desfazer conclusão devem ser idempotentes.

## Identificação de conteúdo

O conteúdo editorial possui coleções separadas e slugs canônicos por tipo. O banco não deve copiar títulos, descrições, relações ou conteúdo MDX.

O campo `content_identifier` será composto pelo tipo e pelo slug canônico:

```text
content_type + slug
```

Exemplos:

```text
curso + fundamentos-de-arduino
trilha + primeiros-passos-em-robotica
aula + introducao-robotica
```

O slug deve permanecer estável depois que o conteúdo for utilizado por dados de aprendizado. Renomeações futuras devem seguir a política de estabilidade de URLs e, se necessário, uma regra explícita de migração.

## Inscrição em Cursos e Trilhas

### Curso

Um Curso terá um botão `Inscrever-se` quando a pessoa não estiver inscrita.

Após a inscrição:

- o registro será salvo no Supabase;
- o botão poderá exibir `Inscrito` ou `Continuar estudando`;
- o Curso aparecerá em `/meu-aprendizado`;
- o usuário poderá acessar suas Aulas normalmente.

### Trilha

Uma Trilha terá o mesmo fluxo de inscrição de um Curso. A Trilha pode conter Cursos e Aulas diretas, conforme o modelo editorial existente.

### Remover inscrição

O usuário poderá remover uma inscrição por uma ação explícita. O texto final da interface ainda deve ser escolhido entre opções como `Sair do curso`, `Sair da trilha` ou `Remover dos meus estudos`.

Ao remover a inscrição:

- o item deixa de aparecer entre os estudos em andamento;
- a operação deve exigir confirmação quando houver progresso associado;
- o usuário deve receber feedback de sucesso ou erro;
- a ação deve poder ser repetida sem criar estado inconsistente.

As conclusões de Aulas serão preservadas quando o usuário remover uma inscrição. Se ele se inscrever novamente no mesmo Curso ou Trilha, as conclusões anteriores serão reutilizadas no cálculo do progresso.

## Conclusão de Aulas

O botão ficará no final da Aula:

- `Marcar como concluída`, quando não houver conclusão registrada;
- `Desmarcar como concluída`, quando houver conclusão registrada.

Ao marcar uma Aula como concluída:

- o registro será salvo para o usuário autenticado;
- a Aula aparecerá em `Aulas concluídas`;
- os Cursos relacionados terão o progresso recalculado;
- as Trilhas relacionadas terão o progresso recalculado conforme a regra aprovada;
- a atividade das inscrições relacionadas será atualizada.

Uma Aula avulsa, sem inscrição em Curso ou Trilha, também aparecerá em `Aulas concluídas` após ser marcada como concluída.

Se a operação falhar, a interface não deve informar conclusão definitiva antes da confirmação do Supabase.

## Regras de progresso

### Curso

O progresso de um Curso deve ser derivado das Aulas publicadas relacionadas ao Curso pela ordem editorial definida em `aulaSlugs`.

Regra preliminar:

```text
progresso do Curso =
  aulas publicadas concluídas pelo usuário /
  total de aulas publicadas do Curso
```

O percentual deve ser inteiro, com regra de arredondamento definida antes da implementação. Um Curso sem Aulas publicadas deve ser rejeitado pela validação de conteúdo ou ter um comportamento explicitamente definido antes de entrar no banco.

Aulas em rascunho, inválidas ou excluídas do build não entram no denominador.

Um Curso é considerado concluído quando seu percentual atingir 100%.

### Trilha

Uma Trilha pode combinar Cursos e Aulas diretas, conforme o percurso editorial definido no MDX.

O progresso da Trilha será calculado por itens do percurso:

- cada Curso conta como um item;
- cada Aula direta conta como um item;
- um Curso só conta como concluído quando atingir 100% de progresso próprio;
- uma Aula direta só conta como concluída quando o usuário a marcar como concluída.

Exemplo:

```text
Trilha com 2 Cursos e 1 Aula direta
1 Curso concluído + 1 Aula direta concluída
Progresso: 66%
```

Essa regra é mais simples e evita duplicar Aulas dentro da Trilha, mas pode esconder o progresso parcial de um Curso. O progresso detalhado continua visível na página do próprio Curso.

### Alterações editoriais

O progresso deve usar identificadores estáveis e conteúdo publicado, não posições visuais.

Quando novas Aulas forem adicionadas a um Curso:

- elas entram no denominador;
- o percentual é recalculado;
- conclusões existentes continuam válidas.

Quando uma Aula apenas mudar de ordem, título ou descrição, o progresso não muda.

Quando uma Aula for removida do percurso, despublicada ou substituída, ela deixa de contar no novo cálculo e desaparece do histórico de Aulas concluídas. Nenhum registro visível ou snapshot do conteúdo será mantido no Portal.

Se uma Aula for substituída por outra com novo identificador, o sistema deve tratá-la como uma Aula não concluída, salvo se for aprovada uma regra explícita de migração.

## Página `/meu-aprendizado`

`/meu-aprendizado` será uma página do Portal GEAR, não um produto ou área independente.

### Estrutura visual

A página terá:

- navegação lateral à esquerda em telas largas;
- conteúdo principal à direita;
- adaptação para navegação em telas pequenas;
- visão inicial de resumo ou dashboard;
- listas pessoais derivadas dos dados do usuário e do conteúdo público.

### Navegação da página

As três categorias de conteúdo serão:

1. `Cursos e trilhas em andamento`;
2. `Cursos e trilhas concluídos`;
3. `Aulas concluídas`.

Esses nomes são preferidos porque os dois primeiros grupos incluem Cursos e Trilhas. A implementação deve decidir se serão links de navegação com URLs compartilháveis ou tabs ARIA dentro da mesma rota.

As categorias serão representadas por links de navegação na mesma página, usando parâmetros de URL:

```text
/meu-aprendizado
/meu-aprendizado?tab=em-andamento
/meu-aprendizado?tab=concluidos
/meu-aprendizado?tab=aulas-concluidas
```

Essa opção mantém uma única rota e uma única composição de página, preserva o histórico do navegador, permite compartilhar uma visão específica e pode ser renderizada no servidor a partir do parâmetro recebido. Os links serão estilizados visualmente como abas, mas não dependerão de uma implementação client-side de tabs ARIA.

Cada link deve ter nome acessível, indicação semântica da página selecionada e funcionamento completo por teclado. Um parâmetro ausente ou inválido deve abrir a visão padrão `Resumo` sem quebrar a página.

### Listas de Cursos e Trilhas

Cada item exibirá:

- nome;
- tipo: Curso ou Trilha;
- percentual de conclusão;
- status derivado: em andamento ou concluído;
- data ou indicação da atividade mais recente;
- ação `Continuar estudando`;
- ação explícita para remover a inscrição quando aplicável.

Itens concluídos devem exibir progresso de 100%.

### Lista de Aulas concluídas

A lista exibirá:

- título da Aula;
- Curso ou Trilha relacionada, quando existir;
- data de conclusão;
- link para rever a Aula;
- indicação clara caso o conteúdo não esteja mais disponível.

## Dashboard

A página terá uma visão inicial `Resumo` ou `Início`, além das três categorias de conteúdo.

O dashboard deve ser simples e mostrar somente os blocos abaixo.

### Gráfico de estudos

Um gráfico de rosca circular com duas partes:

- `Estudos em andamento`: Cursos e Trilhas inscritos cujo progresso ainda não chegou a 100%;
- `Estudos concluídos`: Cursos e Trilhas inscritos cujo progresso chegou a 100%.

O gráfico deve apresentar os valores também em texto, com legenda, contagem e nome acessível, para não depender exclusivamente de cores ou da visualização gráfica.

### Total de Aulas concluídas

Um indicador numérico com a quantidade total de Aulas marcadas como concluídas pelo usuário, incluindo Aulas avulsas e Aulas relacionadas a Cursos ou Trilhas.

### Estudos em andamento recentes

Uma lista com até os três Cursos ou Trilhas em andamento mais recentes. Cada item deve mostrar:

- nome;
- tipo: Curso ou Trilha;
- percentual de conclusão;
- ação `Continuar estudando`.

Os itens devem ser ordenados por `last_activity_at`, atualizado por inscrição e conclusões relacionadas. Abrir a página não deve alterar essa ordem.

### Aulas concluídas recentes

Uma lista com até as duas Aulas concluídas mais recentes. Cada item deve mostrar:

- título;
- data de conclusão;
- link para rever a Aula.

As duas listas devem exibir estados vazios quando ainda não houver itens.

Exemplo:

```text
Fundamentos de Arduino
Curso · 60% concluído
Faltam 4 de 10 Aulas
[Continuar estudando]
```

Se não houver inscrições ou conclusões, o dashboard deve exibir um estado vazio com orientação para explorar o Aprendizado. Se houver erro de carregamento, deve informar a falha e oferecer uma ação de tentar novamente.

## Integração e segurança do Supabase

### Cliente e servidor

As consultas e mutações dos dados pessoais serão feitas pelo cliente oficial do Supabase no navegador, sempre protegidas por RLS. Essa é a opção mais simples para as ações interativas desta Milestone e evita criar Server Actions ou Route Handlers apenas para repassar operações ao Supabase.

O uso do cliente no navegador ficará restrito a pequenas ilhas de interação da feature `meu-aprendizado`, como login, inscrição, remoção de inscrição e conclusão de Aula. O conteúdo público continuará seguindo o padrão Server-first do projeto.

Server Actions e Route Handlers não serão criados nesta Milestone, salvo se uma limitação concreta do fluxo ou uma exigência de segurança justificar uma revisão explícita.

Independentemente da escolha:

- a chave de serviço nunca pode ser enviada ao navegador;
- credenciais devem ficar em variáveis de ambiente;
- a chave pública só pode acessar dados protegidos por RLS;
- o usuário autenticado deve ser obtido da sessão validada;
- o `user_id` não pode ser aceito livremente do cliente;
- as operações devem usar o usuário da sessão como proprietário dos dados.

### RLS e isolamento

O banco deve garantir que:

- uma pessoa só leia suas próprias inscrições;
- uma pessoa só leia suas próprias conclusões;
- uma pessoa só insira registros para si mesma;
- uma pessoa só altere ou remova seus próprios registros;
- um usuário não consiga trocar o `user_id` de um registro;
- consultas públicas de conteúdo não exponham dados pessoais.

Essas regras devem ser testadas diretamente ou por testes de integração equivalentes.

## Privacidade e segurança de dados

- Solicitar somente os dados GitHub necessários.
- Não armazenar senha ou token sensível do GitHub no Portal.
- Não acessar repositórios ou organizações sem requisito aprovado.
- Não expor dados de progresso entre usuários.
- Manter `/privacidade` e `/termos` aprovados e atualizados antes de ativar login em produção. O conteúdo atual foi aprovado por Tiago Lopes em 16 de julho de 2026.
- Documentar o tratamento de dados pessoais conforme a LGPD.
- Manter credenciais e configurações secretas fora do Git.
- Quando a pessoa excluir a conta, suas inscrições, conclusões e demais dados pessoais do recurso devem ser excluídos permanentemente.

## Rotas, SEO e estado público

As novas rotas previstas são:

```text
/login
/meu-aprendizado
```

Antes da implementação será necessário:

- criar as páginas;
- remover o comportamento provisório de 404;
- atualizar os testes E2E que esperam 404;
- definir metadata específica;
- excluir `/meu-aprendizado` do sitemap;
- aplicar `noindex` em `/login` e `/meu-aprendizado`;
- garantir que as páginas públicas de Aprendizado continuem funcionando sem sessão.

O Header não deve tornar todas as páginas públicas dependentes de uma consulta ao banco apenas para exibir o estado da sessão. A estratégia de carregamento precisa preservar o caráter majoritariamente estático do Portal.

## Estados de experiência do usuário

O fluxo deve especificar e testar os seguintes estados:

- visitante não autenticado;
- usuário autenticado sem inscrições;
- usuário autenticado com inscrições;
- usuário com Cursos e Trilhas concluídos;
- sessão carregando;
- sessão expirada;
- login cancelado;
- callback OAuth com erro;
- operação de inscrição carregando;
- inscrição concluída;
- inscrição já existente;
- remoção de inscrição aguardando confirmação;
- conclusão de Aula carregando;
- conclusão já registrada;
- erro de rede;
- Supabase indisponível;
- conteúdo removido ou despublicado;
- lista longa de Aulas concluídas.

Toda ação pessoal deve ter feedback acessível, foco preservado ou reposicionado de forma previsível, mensagem de erro compreensível e operação por teclado.

## Escopo inicial

1. Atualizar a arquitetura e os documentos oficiais para registrar a necessidade de progresso individual.
2. Definir o proprietário institucional dos projetos Supabase.
3. Definir o identificador persistente dos conteúdos.
4. Configurar ambientes e login GitHub no Supabase.
5. Definir e aplicar o modelo mínimo de identidade, inscrições e conclusões.
6. Aplicar RLS e validar isolamento por usuário.
7. Criar `/login` e `/meu-aprendizado`.
8. Implementar inscrição em Cursos e Trilhas.
9. Implementar remoção de inscrição.
10. Implementar conclusão e reversão de conclusão de Aulas.
11. Implementar listas e dashboard de `/meu-aprendizado`.
12. Implementar estados de carregamento, vazio, erro e sessão expirada.
13. Atualizar metadata, sitemap e testes de navegação.
14. Adicionar testes unitários, de integração, acessibilidade e E2E das jornadas pessoais.

## Fora do escopo inicial

- senha própria;
- cadastro manual de usuário;
- perfil social completo;
- ranking ou competição entre usuários;
- certificados;
- recomendações personalizadas;
- seguidores, curtidas ou feed social;
- painel administrativo de usuários;
- sincronização de progresso com o GitHub;
- acesso a repositórios, organizações, Issues ou Gists;
- comentários ou recursos sociais próprios;
- analytics próprios;
- progresso de vídeo ou leitura parcial;
- estado persistido de Aula “em andamento”.

## Critérios de aceite preliminares

### Autenticação

- A pessoa consegue entrar e sair usando GitHub.
- O login funciona em desenvolvimento, preview e produção configurados.
- O cancelamento ou erro do login não cria uma sessão falsa.
- A pessoa retorna à ação original depois de autenticar.
- A sessão expirada é tratada sem expor dados privados.

### Inscrições

- Uma pessoa autenticada consegue inscrever-se em um Curso.
- Uma pessoa autenticada consegue inscrever-se em uma Trilha.
- Inscrição duplicada não cria registros duplicados.
- A pessoa consegue remover uma inscrição conforme a regra aprovada.
- O item removido deixa de aparecer em andamento.
- Reinscrição segue a política aprovada para conclusões anteriores.

### Aulas e progresso

- Uma Aula só aparece como concluída depois da confirmação da ação.
- A conclusão pode ser desfeita.
- Uma Aula avulsa concluída aparece em `Aulas concluídas`.
- O progresso de Curso usa somente Aulas publicadas e a relação editorial oficial.
- O progresso de Trilha usa a regra aprovada para Cursos e Aulas diretas.
- O percentual não duplica Aulas.
- Alterações editoriais seguem a política de identificadores estáveis.

### Página pessoal

- Usuário A não consegue ler ou alterar dados do usuário B.
- A página funciona com estado vazio, erro, carregamento e lista longa.
- Cursos e Trilhas aparecem com tipo, progresso e ação de continuidade.
- Itens concluídos aparecem com 100%.
- As Aulas concluídas aparecem com data e link válido ou estado de conteúdo removido.
- O dashboard apresenta o gráfico de estudos, o total de Aulas concluídas, até três estudos em andamento e até duas Aulas concluídas recentes.
- A página é acessível por teclado e leitor de tela.
- A página funciona em desktop e mobile.

### Qualidade do projeto

- A implementação respeita a separação `app` → `features` → `shared`.
- Nenhuma dependência nova é adicionada sem a avaliação exigida pelo projeto.
- As páginas públicas permanecem navegáveis sem login.
- `/login` e `/meu-aprendizado` deixam de ser tratados como rotas provisórias 404.
- O sitemap e os metadados seguem a política aprovada para páginas pessoais.
- Testes não dependem de uma API externa real ou de dados pessoais reais.

## Propriedade temporária do Supabase

Durante esta fase, o projeto Supabase ficará vinculado à conta GitHub pessoal do mantenedor atual, que também é o proprietário temporário do repositório em desenvolvimento.

A migração futura para uma conta ou organização institucional não faz parte desta Milestone e não deve bloquear o planejamento ou a implementação, desde que as credenciais permaneçam fora do repositório e exista uma forma segura de recuperação da conta.

## Gates de execução

A atualização formal da Parte A e do `development-plan.md` foi realizada. Permanecem obrigatórios:

- configuração segura dos ambientes Supabase;
- aplicação e validação das políticas RLS;
- definição dos critérios de aceite finais;
- testes de autenticação, isolamento, progresso, acessibilidade e E2E;
- verificação da retenção técnica de backups do plano Supabase efetivamente usado antes da produção.

O conteúdo de `/privacidade` e `/termos` foi aprovado por Tiago Lopes em 16 de julho de 2026. Esse aceite não substitui a verificação de retenção de backups.

## Regra de implementação

As ações de implementação podem começar dentro da Milestone extra autorizada, desde que os gates acima sejam respeitados e a implementação permaneça limitada ao escopo aprovado.
