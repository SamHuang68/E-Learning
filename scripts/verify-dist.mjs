import { access, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import {
  listPublicOfflineFiles,
  missingFromPrecache,
  missingRouteApps,
  REQUIRED_ASSET_PATTERNS,
  REQUIRED_ROUTE_APPS,
  REQUIRED_SHELL_FILES,
} from './precacheRequired.mjs'

const distDir = path.resolve('dist')
const publicDir = path.resolve('public')
const manifestPath = path.join(distDir, 'precache-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const files = Array.isArray(manifest.files) ? manifest.files : []

if (manifest.version !== 1 || files.length === 0) throw new Error('Invalid or empty precache manifest.')
if (!/^[a-f0-9]{16}$/.test(manifest.buildId)) throw new Error('Invalid precache build id.')
if (new Set(files).size !== files.length) throw new Error('Precache manifest contains duplicate paths.')
if (files.some((file) => file.includes('visual-check'))) throw new Error('QA screenshots must not enter the offline cache.')

await Promise.all(files.map((file) => access(path.join(distDir, file.replace(/^.\//, '')))))

const requiredPublic = [...REQUIRED_SHELL_FILES, ...await listPublicOfflineFiles(publicDir)]
const missingPublic = missingFromPrecache(files, requiredPublic)
if (missingPublic.length > 0) {
  throw new Error(`Precache missing ${missingPublic.length} required public entries: ${missingPublic.join(', ')}`)
}
await Promise.all(
  requiredPublic.map((file) => access(path.join(distDir, file.replace(/^.\//, '')))),
)

const missingAssets = missingFromPrecache(files, REQUIRED_ASSET_PATTERNS)
if (missingAssets.length > 0) {
  throw new Error(`Precache missing hashed assets: ${missingAssets.map(String).join(', ')}`)
}

const missingApps = missingRouteApps(files)
if (missingApps.length > 0) {
  throw new Error(`Lazy route chunks missing from precache (offline Hub): ${missingApps.join(', ')}`)
}

const maxJsBytes = 500_000
const jsFiles = files.filter((file) => /^.\/assets\/.*\.js$/.test(file))
const jsSizes = await Promise.all(jsFiles.map(async (file) => ({
  file,
  bytes: (await stat(path.join(distDir, file.replace(/^.\//, '')))).size,
})))
const oversizedJs = jsSizes.filter(({ bytes }) => bytes >= maxJsBytes)
if (oversizedJs.length > 0) {
  throw new Error(`JavaScript chunks must stay below ${maxJsBytes} bytes: ${JSON.stringify(oversizedJs)}`)
}
const largestJs = jsSizes.sort((a, b) => b.bytes - a.bytes)[0]

const katexWoff2 = files.filter((file) => /assets\/KaTeX_.*\.woff2$/.test(file))
if (katexWoff2.length < 10) {
  throw new Error(`KaTeX formula fonts are not precached for offline physics formulas (${katexWoff2.length} woff2).`)
}

const workerSource = await readFile(path.join(distDir, 'sw.js'), 'utf8')
if (workerSource.includes('__PRECACHE_VERSION__')) throw new Error('Service worker cache version was not injected.')
if (!workerSource.includes(`e-learning-${manifest.buildId}`)) throw new Error('Service worker cache version does not match the manifest build id.')
if (!workerSource.includes("key.startsWith('e-learning-')")) {
  throw new Error('Service worker must only delete e-learning-* caches so other Pages caches stay intact.')
}
for (const shell of REQUIRED_SHELL_FILES) {
  if (!workerSource.includes(shell)) {
    throw new Error(`Service worker STATIC_ASSETS is missing ${shell}.`)
  }
}

console.log(JSON.stringify({
  verdict: 'PASS',
  buildId: manifest.buildId,
  files: files.length,
  requiredPublic: requiredPublic.length,
  lazyRouteChunks: REQUIRED_ROUTE_APPS.length,
  largestJs,
}))
