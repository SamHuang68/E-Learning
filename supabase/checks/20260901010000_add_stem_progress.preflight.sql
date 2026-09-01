-- Read-only evidence to capture before applying the matching migration.

begin transaction read only;

set local lock_timeout = '5s';
set local statement_timeout = '5min';

do $preflight$
declare
  v_kind "char";
  v_rls boolean;
  v_bad_base text;
  v_bad_stem text;
  v_bad_stem_values bigint;
begin
  select c.relkind, c.relrowsecurity
    into v_kind, v_rls
  from pg_catalog.pg_class as c
  where c.oid = to_regclass('public.user_progress');

  if v_kind is null or v_kind not in ('r', 'p') then
    raise exception 'public.user_progress is missing or is not a table';
  end if;

  if not v_rls then
    raise exception 'RLS is not enabled on public.user_progress';
  end if;

  with expected(column_name, udt_name) as (
    values
      ('user_id', 'uuid'),
      ('aoba', 'jsonb'),
      ('kana', 'jsonb'),
      ('toeic', 'jsonb'),
      ('lang', 'text'),
      ('meta', 'jsonb'),
      ('updated_at', 'timestamptz')
  )
  select string_agg(e.column_name, ', ' order by e.column_name)
    into v_bad_base
  from expected as e
  left join information_schema.columns as c
    on c.table_schema = 'public'
   and c.table_name = 'user_progress'
   and c.column_name = e.column_name
  where c.column_name is null or c.udt_name <> e.udt_name;

  if v_bad_base is not null then
    raise exception 'Incompatible base columns: %', v_bad_base;
  end if;

  select string_agg(a.attname::text, ', ' order by a.attname)
    into v_bad_stem
  from pg_catalog.pg_attribute as a
  left join pg_catalog.pg_attrdef as d
    on d.adrelid = a.attrelid
   and d.adnum = a.attnum
  where a.attrelid = 'public.user_progress'::regclass
    and not a.attisdropped
    and a.attname in ('math', 'physics', 'chemistry')
    and (
      a.atttypid <> 'jsonb'::regtype
      or not a.attnotnull
      or d.oid is null
      or pg_get_expr(d.adbin, d.adrelid) is distinct from '''{}''::jsonb'
    );

  if v_bad_stem is not null then
    raise exception 'Existing STEM columns are incompatible: %', v_bad_stem;
  end if;

  -- Inspect only STEM keys that already exist in this table revision. Building
  -- a JSON object from the row avoids referencing a column that is not present
  -- yet, while still failing before DDL if an existing value is an array,
  -- scalar, or JSON null instead of the application-required object.
  select count(*) into v_bad_stem_values
  from public.user_progress as u
  cross join lateral (select to_jsonb(u) as row_json) as snapshot
  where (snapshot.row_json ? 'math'
           and jsonb_typeof(snapshot.row_json -> 'math') is distinct from 'object')
     or (snapshot.row_json ? 'physics'
           and jsonb_typeof(snapshot.row_json -> 'physics') is distinct from 'object')
     or (snapshot.row_json ? 'chemistry'
           and jsonb_typeof(snapshot.row_json -> 'chemistry') is distinct from 'object');

  if v_bad_stem_values <> 0 then
    raise exception
      'Existing STEM values violate the object contract: % rows',
      v_bad_stem_values;
  end if;
end
$preflight$;

select
  current_user as migration_user,
  current_setting('server_version') as server_version,
  c.relowner::regrole as table_owner,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced,
  c.relacl as table_acl,
  pg_total_relation_size(c.oid) as total_bytes,
  (select count(*) from public.user_progress) as row_count
from pg_catalog.pg_class as c
where c.oid = 'public.user_progress'::regclass;

select policyname, permissive, roles, cmd, qual, with_check
from pg_catalog.pg_policies
where schemaname = 'public' and tablename = 'user_progress'
order by policyname;

-- Catalog ACL fingerprints are the authoritative pre/post comparison. Unlike
-- information_schema privilege views, these do not expand table grants into a
-- synthetic row for every column.
select attname as column_name, attacl as column_acl
from pg_catalog.pg_attribute
where attrelid = 'public.user_progress'::regclass
  and attnum > 0
  and not attisdropped
order by attnum;

-- Human-readable privilege reports include PUBLIC, grantor, and grantability.
select grantor, grantee, privilege_type, is_grantable
from information_schema.table_privileges
where table_schema = 'public' and table_name = 'user_progress'
order by grantor, grantee, privilege_type;

select column_name, grantor, grantee, privilege_type, is_grantable
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'user_progress'
order by column_name, grantor, grantee, privilege_type;

select tgname, pg_get_triggerdef(oid) as definition
from pg_catalog.pg_trigger
where tgrelid = 'public.user_progress'::regclass and not tgisinternal
order by tgname;

select locktype, mode, granted, count(*) as lock_count
from pg_catalog.pg_locks
where relation = 'public.user_progress'::regclass
group by locktype, mode, granted
order by locktype, mode, granted;

commit;
