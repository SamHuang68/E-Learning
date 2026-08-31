import { readFile, readdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

const distDir = path.resolve('dist')

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  }))
  return files.flat()
}

const shellFiles = new Set([
  'index.html',
  'srs-review.html',
  'favicon.svg',
  'icons.svg',
  'manifest.webmanifest',
])

const allFiles = await walk(distDir)
const files = allFiles
  .map((file) => path.relative(distDir, file).replaceAll('\\', '/'))
  .filter((file) => shellFiles.has(file) || file.startsWith('assets/') || file.startsWith('audio/') || file.startsWith('content/'))
  .filter((file) => !file.includes('.visual-check.'))
  .sort()

const workerPath = path.join(distDir, 'sw.js')
const workerSource = await readFile(workerPath, 'utf8')
const hash = createHash('sha256')
hash.update(workerSource)
for (const file of files) {
  hash.update(file)
  hash.update(await readFile(path.join(distDir, file)))
}
const buildId = hash.digest('hex').slice(0, 16)
const cacheFiles = files.map((file) => `./${file}`)

await writeFile(
  path.join(distDir, 'precache-manifest.json'),
  `${JSON.stringify({ version: 1, buildId, files: cacheFiles }, null, 2)}\n`,
  'utf8',
)

if (!workerSource.includes('__PRECACHE_VERSION__')) {
  throw new Error('Service worker cache-version placeholder is missing.')
}
await writeFile(workerPath, workerSource.replaceAll('__PRECACHE_VERSION__', buildId), 'utf8')

console.log(`Generated precache manifest ${buildId} with ${cacheFiles.length} files.`)
