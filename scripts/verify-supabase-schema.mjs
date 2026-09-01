import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const schemaPath = path.join(root, 'supabase', 'schema.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260901010000_add_stem_progress_columns.sql')
const preflightPath = path.join(root, 'supabase', 'checks', '20260901010000_add_stem_progress.preflight.sql')
const postflightPath = path.join(root, 'supabase', 'checks', '20260901010000_add_stem_progress.postflight.sql')
const cloudProgressPath = path.join(root, 'src', 'utils', 'cloudProgress.ts')

const [schema, migration, preflight, postflight, cloudProgress] = await Promise.all(
  [schemaPath, migrationPath, preflightPath, postflightPath, cloudProgressPath]
    .map((file) => readFile(file, 'utf8')),
)

let checkCount = 0

function assert(condition, message) {
  if (!condition) throw new Error(message)
  checkCount += 1
}

const migrationWithoutComments = migration.replace(/--.*$/gm, '')

const tracks = ['math', 'physics', 'chemistry']
for (const track of tracks) {
  const schemaColumn = new RegExp(`\\b${track}\\s+jsonb\\s+not\\s+null\\s+default\\s+'\\{\\}'::jsonb`, 'i')
  assert(schemaColumn.test(schema), `Fresh-install schema is missing the ${track} JSONB contract.`)

  const migrationColumn = new RegExp(`add\\s+column\\s+if\\s+not\\s+exists\\s+${track}\\s+jsonb\\s+not\\s+null\\s+default\\s+'\\{\\}'::jsonb`, 'i')
  assert(migrationColumn.test(migration), `Migration is missing the ${track} additive contract.`)

  assert(cloudProgress.includes(track), `Cloud progress contract does not mention ${track}.`)
  assert(postflight.includes(`jsonb_typeof(${track})`), `Postflight does not validate ${track} object values.`)
}

assert(!/alter\s+table\s+public\.user_progress\s+add\s+column/i.test(schema), 'Fresh-install schema must not embed historical add-column migrations.')
assert(/^\s*begin;/im.test(migration) && /^\s*commit;/im.test(migration), 'Migration must be a single explicit transaction.')
assert(/set\s+local\s+lock_timeout/i.test(migration), 'Migration must bound lock acquisition time.')
assert(/set\s+local\s+statement_timeout/i.test(migration), 'Migration must bound statement execution time.')
assert(/relrowsecurity/i.test(migration), 'Migration must fail closed when RLS is disabled.')
assert(/pg_get_expr\(d\.adbin,\s*d\.adrelid\)/i.test(migration), 'Migration must verify existing-column defaults.')

const allAlterTableStatements = migrationWithoutComments.match(/alter\s+table[\s\S]*?;/gi) ?? []
assert(allAlterTableStatements.length === 1, 'Migration must contain exactly one ALTER TABLE statement in total.')
const alterTableStatements = migrationWithoutComments.match(/alter\s+table\s+public\.user_progress[\s\S]*?;/gi) ?? []
assert(alterTableStatements.length === 1, 'Migration must contain exactly one user_progress ALTER TABLE statement.')
assert(
  /^alter\s+table\s+public\.user_progress\s+add\s+column\s+if\s+not\s+exists\s+math\s+jsonb\s+not\s+null\s+default\s+'\{\}'::jsonb\s*,\s*add\s+column\s+if\s+not\s+exists\s+physics\s+jsonb\s+not\s+null\s+default\s+'\{\}'::jsonb\s*,\s*add\s+column\s+if\s+not\s+exists\s+chemistry\s+jsonb\s+not\s+null\s+default\s+'\{\}'::jsonb\s*;$/i.test(alterTableStatements[0].trim()),
  'Migration ALTER TABLE must stay on the exact three-column additive allowlist.',
)
assert(
  !/\b(insert\s+into|update\s+[\w."']+|delete\s+from|merge\s+into|truncate|copy\s+[\w."']+|drop\s+|create\s+|grant\s+|revoke\s+|alter\s+policy|owner\s+to|rename\s+to|disable\s+row\s+level\s+security|force\s+row\s+level\s+security|no\s+force\s+row\s+level\s+security)\b/i.test(migrationWithoutComments),
  'Migration contains DML, destructive DDL, or an authorization-changing statement.',
)
assert(/begin\s+transaction\s+read\s+only/i.test(preflight), 'Preflight must be read-only.')
assert(/begin\s+transaction\s+read\s+only/i.test(postflight), 'Postflight must be read-only.')
assert(/set\s+local\s+statement_timeout/i.test(preflight) && /set\s+local\s+statement_timeout/i.test(postflight), 'Read-only checks must bound scan time.')
assert(/to_jsonb\(u\)/i.test(preflight) && /jsonb_typeof\(snapshot\.row_json\s*->\s*'math'\)/i.test(preflight), 'Preflight must reject incompatible values in existing STEM columns before DDL.')
assert(/pg_policies/i.test(preflight) && /table_privileges/i.test(preflight), 'Preflight must expose policy and human-readable grant evidence.')
assert(/pg_policies/i.test(postflight) && /table_privileges/i.test(postflight), 'Postflight must expose policy and human-readable grant evidence.')
assert(/pg_attribute/i.test(preflight) && /attacl/i.test(preflight), 'Preflight must expose exact column ACL catalog evidence.')
assert(/pg_attribute/i.test(postflight) && /attacl/i.test(postflight), 'Postflight must expose exact column ACL catalog evidence.')
assert(/attname\s+in\s*\(\s*'math'\s*,\s*'physics'\s*,\s*'chemistry'\s*\)[\s\S]*?attacl\s+is\s+not\s+null/i.test(postflight), 'Postflight must reject explicit ACLs on new STEM columns.')

console.log(JSON.stringify({
  verdict: 'PASS',
  tracks,
  migration: path.relative(root, migrationPath).replaceAll('\\', '/'),
  checks: checkCount,
}))
