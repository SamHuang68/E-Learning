import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve('dist')
const manifestPath = path.join(distDir, 'precache-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const files = Array.isArray(manifest.files) ? manifest.files : []

if (manifest.version !== 1 || files.length === 0) throw new Error('Invalid or empty precache manifest.')
if (!/^[a-f0-9]{16}$/.test(manifest.buildId)) throw new Error('Invalid precache build id.')
if (new Set(files).size !== files.length) throw new Error('Precache manifest contains duplicate paths.')
if (files.some((file) => file.includes('visual-check'))) throw new Error('QA screenshots must not enter the offline cache.')

await Promise.all(files.map((file) => access(path.join(distDir, file.replace(/^\.\//, '')))))

const routeChunks = files.filter((file) => /assets\/(Aoba|Toeic|Math|Calculus|Physics|Chemistry)App-.*\.js$/.test(file))
if (routeChunks.length !== 6) throw new Error(`Expected six lazy route chunks, found ${routeChunks.length}.`)
if (!files.some((file) => /assets\/index-.*\.js$/.test(file))) throw new Error('Entry JavaScript is not precached.')
if (!files.some((file) => /assets\/index-.*\.css$/.test(file))) throw new Error('Entry CSS is not precached.')
if (!files.some((file) => file.startsWith('./audio/'))) throw new Error('Bundled learning audio is not precached.')

const workerSource = await readFile(path.join(distDir, 'sw.js'), 'utf8')
if (workerSource.includes('__PRECACHE_VERSION__')) throw new Error('Service worker cache version was not injected.')
if (!workerSource.includes(`e-learning-${manifest.buildId}`)) throw new Error('Service worker cache version does not match the manifest build id.')

console.log(JSON.stringify({ verdict: 'PASS', buildId: manifest.buildId, files: files.length, lazyRouteChunks: routeChunks.length }))
