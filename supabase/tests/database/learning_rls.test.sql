begin;

create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;
select plan(24);

select has_table('public', 'learning_enrollments', 'tabela de inscricoes existe');
select has_table('public', 'lesson_completions', 'tabela de conclusoes existe');
select has_pk('public', 'learning_enrollments', 'inscricoes usam chave composta');
select has_pk('public', 'lesson_completions', 'conclusoes usam chave composta');
select results_eq($$select count(*)::bigint from pg_policies where schemaname = 'public' and tablename = 'learning_enrollments'$$, array[4::bigint], 'inscricoes possuem quatro politicas RLS');
select results_eq($$select count(*)::bigint from pg_policies where schemaname = 'public' and tablename = 'lesson_completions'$$, array[4::bigint], 'conclusoes possuem quatro politicas RLS');
select has_table_privilege('authenticated', 'public.learning_enrollments', 'select', 'authenticated pode ler inscricoes');
select has_table_privilege('authenticated', 'public.learning_enrollments', 'insert', 'authenticated pode inserir inscricoes');
select has_table_privilege('authenticated', 'public.learning_enrollments', 'update', 'authenticated pode atualizar inscricoes');
select has_table_privilege('authenticated', 'public.learning_enrollments', 'delete', 'authenticated pode remover inscricoes');
select has_table_privilege('authenticated', 'public.lesson_completions', 'select', 'authenticated pode ler conclusoes');
select has_table_privilege('authenticated', 'public.lesson_completions', 'insert', 'authenticated pode inserir conclusoes');
select has_table_privilege('authenticated', 'public.lesson_completions', 'update', 'authenticated pode atualizar conclusoes');
select has_table_privilege('authenticated', 'public.lesson_completions', 'delete', 'authenticated pode remover conclusoes');
select hasnt_table_privilege('anon', 'public.learning_enrollments', 'select', 'anon nao le inscricoes');
select hasnt_table_privilege('anon', 'public.lesson_completions', 'select', 'anon nao le conclusoes');

insert into auth.users (id, email) values
  ('11111111-1111-4111-8111-111111111111', 'user-a@example.test'),
  ('22222222-2222-4222-8222-222222222222', 'user-b@example.test');
insert into public.learning_enrollments (user_id, content_type, content_identifier) values
  ('11111111-1111-4111-8111-111111111111', 'curso', 'fundamentos-arduino'),
  ('22222222-2222-4222-8222-222222222222', 'trilha', 'robotica-do-zero');
insert into public.lesson_completions (user_id, lesson_identifier) values
  ('11111111-1111-4111-8111-111111111111', 'introducao-arduino'),
  ('22222222-2222-4222-8222-222222222222', 'introducao-robotica');

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
set local request.jwt.claim.role = 'authenticated';
select results_eq('select count(*) from public.learning_enrollments', array[1::bigint], 'usuario A le somente sua inscricao');
select results_eq('select count(*) from public.lesson_completions', array[1::bigint], 'usuario A le somente sua conclusao');
select lives_ok($$insert into public.learning_enrollments (user_id, content_type, content_identifier) values ('11111111-1111-4111-8111-111111111111', 'curso', 'git-para-robotica')$$, 'usuario A insere para si');
select throws_ok($$insert into public.lesson_completions (user_id, lesson_identifier) values ('22222222-2222-4222-8222-222222222222', 'git-repositorio')$$, '42501', null, 'usuario A nao forja user_id de B');
select lives_ok($$update public.learning_enrollments set last_activity_at = now() where content_identifier = 'fundamentos-arduino'$$, 'usuario A atualiza seu registro');
select lives_ok($$delete from public.lesson_completions where lesson_identifier = 'introducao-arduino'$$, 'usuario A remove sua conclusao');

reset role;
select throws_ok($$insert into public.learning_enrollments (user_id, content_type, content_identifier) values ('11111111-1111-4111-8111-111111111111', 'curso', 'fundamentos-arduino')$$, '23505', null, 'chave composta impede duplicata');
delete from auth.users where id = '22222222-2222-4222-8222-222222222222';
select results_eq($$select (select count(*) from public.learning_enrollments where user_id = '22222222-2222-4222-8222-222222222222') + (select count(*) from public.lesson_completions where user_id = '22222222-2222-4222-8222-222222222222')$$, array[0::bigint], 'exclusao da conta remove dados por cascade');

select * from finish();
rollback;
