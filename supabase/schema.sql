-- Run once in the Supabase SQL editor.
-- Auth: enable Email/Password in Authentication → Providers.
-- Set Site URL / Redirect URLs to your GitHub Pages origin
-- (e.g. https://<user>.github.io/<repo>/).

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  aoba jsonb not null default '{}'::jsonb,
  kana jsonb not null default '{}'::jsonb,
  toeic jsonb not null default '{}'::jsonb,
  math jsonb not null default '{}'::jsonb,
  physics jsonb not null default '{}'::jsonb,
  chemistry jsonb not null default '{}'::jsonb,
  lang text not null default 'hub',
  meta jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Additive migration for projects created from an earlier schema revision.
alter table public.user_progress
  add column if not exists math jsonb not null default '{}'::jsonb,
  add column if not exists physics jsonb not null default '{}'::jsonb,
  add column if not exists chemistry jsonb not null default '{}'::jsonb;

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

-- Future normalized learning progress tables (Wave 1+).
-- create table if not exists public.item_progress (
--   user_id uuid not null references auth.users (id) on delete cascade,
--   item_id text not null,
--   state jsonb not null default '{}'::jsonb,
--   updated_at timestamptz not null default now(),
--   primary key (user_id, item_id)
-- );
--
-- create table if not exists public.learning_events (
--   id bigint generated always as identity primary key,
--   user_id uuid not null references auth.users (id) on delete cascade,
--   t timestamptz not null default now(),
--   type text not null,
--   payload jsonb
-- );

-- Wave 4 CMS stubs.
-- create table if not exists public.cms_courses (
--   id text primary key,
--   title text not null,
--   lang text not null,
--   payload jsonb not null default '{}'::jsonb,
--   published_at timestamptz
-- );
--
-- create table if not exists public.cms_items (
--   id text primary key,
--   course_id text not null references public.cms_courses (id) on delete cascade,
--   item_type text not null,
--   payload jsonb not null default '{}'::jsonb,
--   updated_at timestamptz not null default now()
-- );
