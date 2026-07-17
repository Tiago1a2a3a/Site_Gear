create table public.learning_enrollments (
  user_id uuid not null references auth.users(id) on delete cascade,
  content_type text not null check (content_type in ('curso', 'trilha')),
  content_identifier text not null check (content_identifier ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  enrolled_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  primary key (user_id, content_type, content_identifier)
);

create table public.lesson_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_identifier text not null check (lesson_identifier ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_identifier)
);

create index learning_enrollments_recent_idx
  on public.learning_enrollments (user_id, last_activity_at desc);
create index lesson_completions_recent_idx
  on public.lesson_completions (user_id, completed_at desc);

revoke all on table public.learning_enrollments from anon, authenticated;
revoke all on table public.lesson_completions from anon, authenticated;
grant select, insert, update, delete on table public.learning_enrollments to authenticated;
grant select, insert, update, delete on table public.lesson_completions to authenticated;

alter table public.learning_enrollments enable row level security;
alter table public.lesson_completions enable row level security;

create policy "learning_enrollments_select_own"
  on public.learning_enrollments for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "learning_enrollments_insert_own"
  on public.learning_enrollments for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "learning_enrollments_update_own"
  on public.learning_enrollments for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "learning_enrollments_delete_own"
  on public.learning_enrollments for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "lesson_completions_select_own"
  on public.lesson_completions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "lesson_completions_insert_own"
  on public.lesson_completions for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "lesson_completions_update_own"
  on public.lesson_completions for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "lesson_completions_delete_own"
  on public.lesson_completions for delete to authenticated
  using ((select auth.uid()) = user_id);

comment on table public.learning_enrollments is
  'Personal course and trail enrollment identifiers. Editorial content remains in MDX.';
comment on table public.lesson_completions is
  'Personal lesson completion identifiers. Editorial content remains in MDX.';
