# Rollback do Meu aprendizado

1. Desabilitar o login GitHub no projeto Supabase e remover as URLs de redirect.
2. Remover do deploy as variaveis publicas do Supabase para que o Portal volte ao
   estado visitante sem bloquear conteudo publico.
3. Reverter a aplicacao antes de remover dados. Exportar os identificadores
   pessoais somente se houver base legal e autorizacao do responsavel.
4. Para desfazer o schema em desenvolvimento, executar em uma nova migration:
   `drop table public.lesson_completions;` e depois
   `drop table public.learning_enrollments;`.

Nunca aplicar `supabase db reset --linked` em producao. A reversao remota deve ser
uma migration revisada e executada com backup e janela de manutencao.
