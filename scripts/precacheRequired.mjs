import { readdir } from 'node:fs/promises'
import path from 'node:path'

/** Shell files the service worker also lists in STATIC_ASSETS. */
export const REQUIRED_SHELL_FILES = [
  './index.html',
  './favicon.svg',
  './icons.svg',
  './manifest.webmanifest',
  './srs-review.html',
  './content/manifest.json',
]

export const REQUIRED_ROUTE_APPS = [
  'Aoba',
  'Toeic',
  'Math',
  'Calculus',
  'Physics',
  'Chemistry',
  'Cs',
  'Chinese',
]

export const REQUIRED_ASSET_PATTERNS = [
  /assets\/index-.*\.js$/,
  /assets\/vendor-supabase-.*\.js$/,
  /assets\/index-.*\.css$/,
  /git-mental-model\.sequence\.json/,
  /assets\/KaTeX_Main-Regular[^/]*\.woff2$/,
  /assets\/KaTeX_Math-Italic[^/]*\.woff2$/,
]

const PUBLIC_OFFLINE_PREFIXES = ['audio', 'archify', 'content']

export function missingFromPrecache(files, required) {
  const listed = new Set(files)
  return required.filter((item) => {
    if (item instanceof RegExp) return !files.some((file) => item.test(file))
    return !listed.has(item)
  })
}

export function missingRouteApps(files) {
  return REQUIRED_ROUTE_APPS.filter(
    (app) => !files.some((file) => new RegExp(`assets/${app}App-.*\\.js$`).test(file)),
  )
}

async function walkPrefix(absDir, prefix, out) {
  const entries = await readdir(absDir, { withFileTypes: true })
  for (const entry of entries) {
    const rel = `${prefix}/${entry.name}`
    if (entry.isDirectory()) {
      await walkPrefix(path.join(absDir, entry.name), rel, out)
      continue
    }
    out.push(`./${rel}`)
  }
}

/** Every public audio / archify / content file that must be in the precache. */
export async function listPublicOfflineFiles(publicDir) {
  const out = []
  for (const prefix of PUBLIC_OFFLINE_PREFIXES) {
    await walkPrefix(path.join(publicDir, prefix), prefix, out)
  }
  return out.sort()
}
