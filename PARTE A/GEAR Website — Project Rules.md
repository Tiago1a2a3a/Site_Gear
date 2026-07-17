# **GEAR Website — Project Rules**

Versão: 1.0

Este documento define as regras permanentes do projeto do site do GEAR (Grupo de Estudos Avançados em Robótica da UFMG).

Toda implementação deve seguir estas regras, salvo decisão explícita da equipe de desenvolvimento.

---

# **1\. Filosofia do Projeto**

O projeto deve priorizar, nesta ordem:

1. Facilidade de manutenção.
2. Organização.
3. Escalabilidade.
4. Reutilização de componentes.
5. Performance.
6. UX.
7. SEO.

O projeto será mantido por diferentes gerações de estudantes. Portanto, toda decisão deve favorecer simplicidade, legibilidade e facilidade de manutenção.

---

# **2\. Stack Oficial**

A stack oficial do projeto é:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- MDX para conteúdos educacionais

Nenhuma tecnologia adicional deve ser adotada sem justificativa técnica.

---

# **3\. Arquitetura**

A arquitetura oficial do projeto é **Feature First**.

Toda nova funcionalidade deve ser organizada seguindo esta arquitetura.

Não reorganize pastas existentes sem aprovação da equipe.

---

# **4\. Organização do Conteúdo**

A plataforma de aprendizado seguirá obrigatoriamente a estrutura:

Trilha

↓

Curso

↓

Post/Aula (MDX)

Todo conteúdo educacional será armazenado em arquivos MDX.

Não utilizar HTML estático para escrever aulas.

---

# **5\. Componentes**

Todo componente deve:

- possuir responsabilidade única;
- ser reutilizável sempre que possível;
- ser pequeno;
- possuir baixo acoplamento;
- possuir alta coesão.

Evite componentes excessivamente grandes.

Antes de criar um novo componente, verifique se já existe outro capaz de atender ao mesmo propósito.

---

# **6\. Estrutura do Código**

Sempre:

- utilizar TypeScript em modo estrito;
- evitar duplicação de código;
- utilizar nomes descritivos;
- organizar imports;
- manter funções pequenas;
- evitar arquivos excessivamente grandes.

Sempre priorizar clareza em vez de otimizações prematuras.

---

# **7\. Organização Visual**

Toda interface deve seguir o Design System definido na arquitetura.

A identidade visual deve transmitir:

- ambiente acadêmico;
- tecnologia;
- organização;
- modernidade.

Paleta principal:

- vermelho;
- cinza;
- tons escuros.

Dark Mode faz parte do projeto.

---

# **8\. Conteúdo**

Cursos, projetos e notícias devem utilizar dados estruturados.

Nenhum conteúdo deve ficar espalhado em múltiplos arquivos sem necessidade.

---

# **9\. Comentários**

Comentários exigem login.

Cada comentário pode receber apenas uma resposta oficial de um Editor.

Não existem:

- curtidas;
- respostas infinitas;
- discussões em árvore.

---

# **10\. Controle de Acesso**

Existem apenas dois papéis.

Visitante.

Editor.

Não existe painel administrativo completo.

Todo gerenciamento institucional continuará sendo realizado diretamente pelo código.

---

# **11\. Desenvolvimento**

O projeto deve ser desenvolvido incrementalmente.

Nunca implementar todo o sistema de uma única vez.

Toda implementação deve seguir as Milestones definidas no arquivo `development-plan.md`.

Uma nova Milestone somente deve começar após a conclusão da anterior.

---

# **12\. Escalabilidade**

Toda decisão deve considerar que futuramente existirão:

- mais de 100 Posts/Aulas;
- dezenas de Cursos;
- dezenas de Trilhas.

Evite decisões que dificultem o crescimento do projeto.

---

# **13\. Dependências**

Antes de adicionar qualquer biblioteca externa, verificar:

- se realmente resolve um problema;
- se já existe solução nativa;
- impacto na manutenção;
- impacto no tamanho do projeto;
- frequência de manutenção da biblioteca.

Evitar dependências desnecessárias.

---

# **14\. Convenções**

Utilizar nomenclatura consistente em todo o projeto.

Evitar abreviações.

Pastas, componentes e arquivos devem possuir nomes claros e previsíveis.

---

# **15\. Documentação**

Toda decisão arquitetural relevante deve ser documentada.

Quando uma regra deste documento deixar de representar a realidade do projeto, ela deve ser atualizada antes da continuação do desenvolvimento.

---

# **16\. Alterações na Arquitetura**

Nenhuma alteração estrutural significativa deve ser realizada sem justificativa técnica.

Caso seja necessária uma mudança arquitetural, ela deve ser registrada e aprovada antes da implementação.

---

# **17\. Diretrizes para IA**

Sempre considerar este documento como prioridade durante a implementação.

Caso exista conflito entre este documento e o código gerado, este documento deve prevalecer.

Caso alguma decisão não esteja especificada:

- escolher a alternativa mais adequada para um projeto acadêmico de longo prazo;
- justificar brevemente a decisão antes da implementação;
- manter consistência com a arquitetura existente.

Nunca alterar a arquitetura sem autorização explícita.

---

# **18\. Objetivo Final**

O objetivo do projeto é produzir um site moderno, organizado, escalável e de fácil manutenção, capaz de ser desenvolvido e mantido por diferentes gerações de estudantes do GEAR, preservando qualidade de código, consistência arquitetural e facilidade de evolução ao longo dos anos.

---

# **19. Novas diretrizes adotadas após revisão**

As diretrizes abaixo foram adotadas após revisão colaborativa da arquitetura do site. Caso qualquer item desta seção entre em conflito com regras escritas anteriormente neste documento, **esta seção deve prevalecer** até nova decisão explícita da equipe.

## **19.1 Fonte de verdade atual**

O documento `gear-documentacao-arquitetura (2).md` é a fonte de verdade atual para gerar o Plano de Desenvolvimento.

Este documento de Project Rules continua válido como base permanente do projeto, mas as decisões revisadas nesta seção corrigem e atualizam pontos que ficaram obsoletos após a revisão.

## **19.2 Organização flexível do aprendizado**

A estrutura de aprendizado não é uma hierarquia rígida obrigatória.

A regra atual é:

- Trilha pode conter Cursos e também Aulas diretas.
- Curso pode conter Aulas.
- Curso pode existir sem pertencer a uma Trilha.
- Aula/Post pode existir sozinha, como conteúdo avulso.
- Aula é a unidade mínima de conteúdo educacional e deve ter URL canônica própria.

As relações entre Trilha, Curso e Aula devem ser feitas por slugs/referências, sem duplicar arquivos MDX.

## **19.3 Rotas e buscas da área de Aprendizado**

A área de Aprendizado deve ter rotas independentes para Trilhas, Cursos e Aulas:

- `/aprendizado/trilhas`
- `/aprendizado/cursos`
- `/aprendizado/aulas`

Cada classificação deve ter sua própria busca local:

- `/aprendizado/trilhas/busca` pesquisa somente Trilhas.
- `/aprendizado/cursos/busca` pesquisa somente Cursos.
- `/aprendizado/aulas/busca` pesquisa somente Aulas.

Não deve existir busca global do site na v1.

Notícias devem ter busca própria, simples e independente, restrita a Notícias. Notícias não devem aparecer na área de Aprendizado, e conteúdos de Aprendizado não devem aparecer na busca de Notícias.

## **19.4 Comentários**

Comentários não fazem parte do MVP inicial.

Quando comentários forem implementados, a solução adotada será Giscus.

O Portal não deve implementar:

- sistema próprio de login para comentários;
- banco de dados próprio para comentários;
- API própria de comentários;
- formulário próprio de comentário;
- painel próprio de moderação;
- regra própria de resposta oficial;
- sistema próprio de curtidas, respostas ou threads.

Login, comentários, respostas, reações, threads e moderação devem seguir o comportamento nativo do Giscus/GitHub.

## **19.5 Autenticação e banco de dados**

A v1 do Portal não deve ter autenticação própria.

A v1 do Portal não deve ter banco de dados próprio.

Editores publicam conteúdo via GitHub, Pull Request e revisão por outro Editor.

Visitantes que comentarem futuramente pelo Giscus continuam sendo Visitantes no Portal; a autenticação GitHub usada pelo Giscus não cria conta, perfil ou papel interno no site.

### Exceção aprovada — progresso individual

Tiago Lopes autorizou a execução, antes da M13, da Milestone extra de login, inscrições e progresso individual descrita em [`milestone_login.md`](milestone_login.md). Para essa Milestone, o Portal poderá usar Supabase Auth com login GitHub e Supabase Database para manter inscrições, conclusões de Aulas e dados necessários ao `Meu aprendizado`.

Essa exceção não altera o restante da regra da v1: não haverá senha própria, comentários próprios, sincronização de progresso com o GitHub, acesso a repositórios ou outras funcionalidades de conta fora do escopo aprovado. O documento `milestone_login.md` é a especificação detalhada e seus gates continuam obrigatórios.

## **19.6 Design visual**

A identidade visual deve se inspirar nos materiais gráficos do GEAR.

Direção de cor:

- branco dominante;
- preto e cinza escuro para texto e estrutura;
- vermelho GEAR como cor de assinatura;
- azul apenas como apoio visual.

Light mode é o padrão visual da v1.

Dark mode é opcional futuro e não deve ser tratado como requisito obrigatório do MVP.

## **19.7 Escopo do MVP**

O MVP deve priorizar a Plataforma de Aprendizado.

Comentários, progresso individual, perfis de usuário, favoritos, painel administrativo, CMS visual, analytics próprios e banco de dados ficam fora do MVP inicial.

O desenvolvimento deve continuar incremental: uma Milestone só deve começar após a conclusão da anterior.
