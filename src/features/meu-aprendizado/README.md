# Meu aprendizado

Domínio pessoal de inscrições, conclusões e progresso. A feature consome as
coleções tipadas geradas pelo Velite sem importar `features/aulas`,
`features/cursos` ou `features/trilhas`.

- O Supabase persiste apenas identificadores e relações do usuário.
- Progresso de Curso considera suas Aulas publicadas e usa `Math.floor`.
- Progresso de Trilha considera cada Curso e Aula direta como um item.
- Remover uma inscrição preserva conclusões; excluir a conta remove tudo por
  cascade.
- Páginas públicas continuam independentes da disponibilidade do Supabase.
