-- Existing-project migration: add STEM/CS signal mastery JSON to user_progress.
-- Additive only. Does not recreate RLS policies, alter grants, or drop columns.

begin;

set local lock_timeout = '5s';
set local statement_timeout = '30s';

do $guard$
declare
  v_kind "char";
  v_rls boolean;
begin
  select c.relkind, c.relrowsecurity
    into v_kind, v_rls
  from pg_catalog.pg_class as c
  where c.oid = to_regclass('public.user_progress');

  if v_kind is null then
    raise exception
      'public.user_progress does not exist; use the fresh-install schema';
  end if;

  if v_kind not in ('r', 'p') then
    raise exception
      'public.user_progress is not an ordinary or partitioned table';
  end if;

  if not v_rls then
    raise exception
      'RLS is not enabled on public.user_progress; repair security separately';
  end if;
end
$guard$;

alter table public.user_progress
  add column if not exists math_signals
    jsonb not null default '{}'::jsonb,
  add column if not exists physics_signals
    jsonb not null default '{}'::jsonb,
  add column if not exists chemistry_signals
    jsonb not null default '{}'::jsonb,
  add column if not exists cs_signals
    jsonb not null default '{}'::jsonb;

do $contract$
declare
  v_count integer;
  v_bad text;
begin
  select
    count(*)::integer,
    string_agg(a.attname::text, ', ' order by a.attname)
      filter (
        where a.atttypid <> 'jsonb'::regtype
           or not a.attnotnull
           or d.oid is null
           or pg_get_expr(d.adbin, d.adrelid)
                is distinct from '''{}''::jsonb'
      )
  into v_count, v_bad
  from pg_catalog.pg_attribute as a
  left join pg_catalog.pg_attrdef as d
    on d.adrelid = a.attrelid
   and d.adnum = a.attnum
  where a.attrelid = 'public.user_progress'::regclass
    and not a.attisdropped
    and a.attname in ('math_signals', 'physics_signals', 'chemistry_signals', 'cs_signals');

  if v_count <> 4 then
    raise exception 'Signal mastery column count is %, expected 4', v_count;
  end if;

  if v_bad is not null then
    raise exception 'Incompatible signal mastery column contract: %', v_bad;
  end if;
end
$contract$;

commit;
