-- Run once in the Supabase SQL editor.
-- Auth: enable Email/Password in Authentication → Providers.
-- Set Site URL / Redirect URLs to your GitHub Pages origin
-- (e.g. https://<user>.github.io/<repo>/).

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  aoba jsonb not null default '{}'::jsonb,
  kana jsonb not null default '{}'::jsonb,
  toeic jsonb not null default '{}'::jsonb,
  lang text not null default 'hub',
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

drop policy if exists "user_progress_select_own" on public.user_progress;
create policy "user_progress_select_own"
  on public.user_progress
  for select
  using (auth.uid() = user_id);

drop policy if exists "user_progress_insert_own" on public.user_progress;
create policy "user_progress_insert_own"
  on public.user_progress
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_progress_update_own" on public.user_progress;
create policy "user_progress_update_own"
  on public.user_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user_progress_delete_own" on public.user_progress;
create policy "user_progress_delete_own"
  on public.user_progress
  for delete
  using (auth.uid() = user_id);
