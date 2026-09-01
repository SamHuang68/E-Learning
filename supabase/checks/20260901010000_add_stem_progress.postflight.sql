-- Read-only contract and security evidence to capture after migration.

begin transaction read only;

set local lock_timeout = '5s';
set local statement_timeout = '5min';

do $postflight$
declare
  v_count integer;
  v_bad text;
  v_null_rows bigint;
  v_non_object_rows bigint;
  v_stem_column_acl_rows integer;
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
    and a.attname in ('math', 'physics', 'chemistry');

  if v_count <> 3 or v_bad is not null then
    raise exception 'Invalid STEM contract; count %, incompatible %', v_count, v_bad;
  end if;

  select count(*) into v_null_rows
  from public.user_progress
  where math is null or physics is null or chemistry is null;

  select count(*) into v_non_object_rows
  from public.user_progress
  where jsonb_typeof(math) is distinct from 'object'
     or jsonb_typeof(physics) is distinct from 'object'
     or jsonb_typeof(chemistry) is distinct from 'object';

  if v_null_rows <> 0 or v_non_object_rows <> 0 then
    raise exception
      'Invalid STEM data; null rows %, non-object rows %',
      v_null_rows, v_non_object_rows;
  end if;

  select count(*)::integer into v_stem_column_acl_rows
  from pg_catalog.pg_attribute
  where attrelid = 'public.user_progress'::regclass
    and not attisdropped
    and attname in ('math', 'physics', 'chemistry')
    and attacl is not null;

  if v_stem_column_acl_rows <> 0 then
    raise exception
      'New STEM columns unexpectedly have explicit column ACLs: % columns',
      v_stem_column_acl_rows;
  end if;
end
$postflight$;

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

select
  count(*) filter (where math = '{}'::jsonb) as empty_math_rows,
  count(*) filter (where physics = '{}'::jsonb) as empty_physics_rows,
  count(*) filter (where chemistry = '{}'::jsonb) as empty_chemistry_rows
from public.user_progress;

select policyname, permissive, roles, cmd, qual, with_check
from pg_catalog.pg_policies
where schemaname = 'public' and tablename = 'user_progress'
order by policyname;

-- Compare owner/RLS/relacl and policy rows with preflight exactly. For column
-- ACLs, every pre-existing attname/attacl pair must be unchanged and the three
-- new STEM columns must report NULL.
select attname as column_name, attacl as column_acl
from pg_catalog.pg_attribute
where attrelid = 'public.user_progress'::regclass
  and attnum > 0
  and not attisdropped
order by attnum;

-- Human-readable privilege reports include PUBLIC, grantor, and grantability.
-- Table grants legitimately expand to the new columns in column_privileges;
-- use the catalog ACL rows above for the no-drift decision.
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

commit;
