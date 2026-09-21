import { access, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve('dist')
const manifestPath = path.join(distDir, 'precache-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const files = Array.isArray(manifest.files) ? manifest.files : []

if (manifest.version !== 1 || files.length === 0) throw new Error('Invalid or empty precache manifest.')
if (!/^[a-f0-9]{16}$/.test(manifest.buildId)) throw new Error('Invalid precache build id.')
if (new Set(files).size !== files.length) throw new Error('Precache manifest contains duplicate paths.')
if (files.some((file) => file.includes('visual-check'))) throw new Error('QA screenshots must not enter the offline cache.')

await Promise.all(files.map((file) => access(path.join(distDir, file.replace(/^.\//, '')))))

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

const routeChunks = files.filter((file) => /assets\/(Aoba|Toeic|Math|Calculus|Physics|Chemistry|Cs|Chinese)App-.*\.js$/.test(file))
if (routeChunks.length !== 8) throw new Error(`Expected eight lazy route chunks (all Hub tracks for full offline Hub), found ${routeChunks.length}.`)
if (!files.some((file) => /assets\/index-.*\.js$/.test(file))) throw new Error('Entry JavaScript is not precached.')
if (!files.some((file) => /assets\/vendor-supabase-.*\.js$/.test(file))) throw new Error('Supabase vendor chunk is not precached.')
if (!files.some((file) => /assets\/index-.*\.css$/.test(file))) throw new Error('Entry CSS is not precached.')
if (!files.some((file) => file.startsWith('./audio/'))) throw new Error('Bundled learning audio is not precached.')
if (!files.some((file) => file.startsWith('./archify/'))) throw new Error('CS Archify assets are not precached.')
if (!files.some((file) => /assets\/KaTeX_Main-Regular[^/]*\.woff2$/.test(file))) {
  throw new Error('KaTeX_Main-Regular woff2 is not precached (physics formula sheet offline).')
}
if (!files.some((file) => /assets\/KaTeX_Math-Italic[^/]*\.woff2$/.test(file))) {
  throw new Error('KaTeX_Math-Italic woff2 is not precached (physics formula sheet offline).')
}
const katexWoff2 = files.filter((file) => /assets\/KaTeX_.*\.woff2$/.test(file))
if (katexWoff2.length < 10) {
  throw new Error(`KaTeX formula fonts are not precached for offline physics formulas (${katexWoff2.length} woff2).`)
}
if (!files.some((file) => /assets\/PhysicsApp-.*\.js$/.test(file))) {
  throw new Error('PhysicsApp chunk is not precached (formula sheet lives in the physics route).')
}
// Tightened: critical Hub assets (all 8 tracks + main entry + shared) now strictly verified for offline precache

const workerSource = await readFile(path.join(distDir, 'sw.js'), 'utf8')
if (workerSource.includes('__PRECACHE_VERSION__')) throw new Error('Service worker cache version was not injected.')
if (!workerSource.includes(`e-learning-${manifest.buildId}`)) throw new Error('Service worker cache version does not match the manifest build id.')
if (!workerSource.includes("key.startsWith('e-learning-')")) {
  throw new Error('Service worker must only delete e-learning-* caches so other Pages caches stay intact.')
}

console.log(JSON.stringify({
  verdict: 'PASS',
  buildId: manifest.buildId,
  files: files.length,
  lazyRouteChunks: routeChunks.length,
  largestJs,
}))
