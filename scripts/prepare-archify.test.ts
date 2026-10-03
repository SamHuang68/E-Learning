import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  ARCHIFY_ASSETS,
  ARCHIFY_PAGES,
  prepareArchify,
  preparePage,
  sharedTag,
  standalonePage,
} from './prepare-archify.mjs'

const normalize = (value: string) => value.replace(/\r\n/g, '\n')
const digest = (value: string) => createHash('sha256').update(normalize(value)).digest('hex')
const assets = Object.fromEntries(Object.entries(ARCHIFY_ASSETS).map(([kind, asset]) => [
  kind, normalize(readFileSync(asset.file, 'utf8')),
]))
const pages = ARCHIFY_PAGES.map((file) => ({ file, html: readFileSync(file, 'utf8') }))
const temporaryDirectories: string[] = []

function temporaryDirectory() {
  const directory = mkdtempSync(path.join(tmpdir(), 'archify-prepare-'))
  temporaryDirectories.push(directory)
  return directory
}

function write(root: string, file: string, contents: string) {
  const destination = path.join(root, file)
  mkdirSync(path.dirname(destination), { recursive: true })
  writeFileSync(destination, contents)
}

function fixture({ inline = false, shared = true } = {}) {
  const root = temporaryDirectory()
  for (const { file, html } of pages) {
    write(root, file, inline ? standalonePage(html, file, assets) : html)
  }
  if (shared) {
    for (const [kind, asset] of Object.entries(ARCHIFY_ASSETS)) write(root, asset.file, assets[kind])
  }
  return root
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    // Only delete the direct temporary children created by this test.
    if (path.dirname(path.resolve(directory)) !== path.resolve(tmpdir())
      || !path.basename(directory).startsWith('archify-prepare-')) throw new Error('Unsafe test cleanup path')
    rmSync(directory, { recursive: true, force: true })
  }
})

describe('Archify shared renderer preparation', () => {
  it('keeps the original renderer and stylesheet bytes, including export CSS collection', () => {
    for (const [kind, asset] of Object.entries(ARCHIFY_ASSETS)) {
      expect(digest(assets[kind])).toBe(asset.sha256)
      expect(Buffer.byteLength(assets[kind])).toBe(asset.bytes)
    }
    expect(assets.script).toContain('document.styleSheets')
    expect(assets.script).toContain('sheet.cssRules')
    expect(assets.script).toContain('new XMLSerializer().serializeToString(clone)')
  })

  it.each(ARCHIFY_PAGES)('keeps classic-script order and resolves %s under both deployment bases', (file) => {
    const html = readFileSync(file, 'utf8')
    const style = sharedTag(file, 'style')
    const script = sharedTag(file, 'script')
    expect(html.indexOf(style)).toBeLessThan(html.indexOf('</head>'))
    expect(html.indexOf(script)).toBeGreaterThan(html.indexOf('id="archify-i18n-data"'))
    expect(html.indexOf(script)).toBeGreaterThan(html.lastIndexOf('</svg>'))
    expect(script).not.toMatch(/async|defer|type="module"/)
    for (const [kind, asset] of Object.entries(ARCHIFY_ASSETS)) {
      const reference = sharedTag(file, kind).match(/(?:href|src)="([^"]+)"/)![1]
      for (const base of ['/', '/E-Learning/']) {
        const resolved = new URL(reference, 'https://example.test' + base + file.slice('public/'.length))
        expect(resolved.pathname).toBe(base + asset.file.slice('public/'.length))
      }
    }
  })

  it('extracts all nine matching original exports without changing their authored bytes', () => {
    const root = fixture({ inline: true, shared: false })
    const originals = new Map(ARCHIFY_PAGES.map((file) => [file, readFileSync(path.join(root, file), 'utf8')]))
    const result = prepareArchify({ root })
    expect(result.changed).toEqual(ARCHIFY_PAGES)
    expect(result.savedBytes).toBeGreaterThan(5_000_000)
    for (const { file } of pages) {
      const prepared = readFileSync(path.join(root, file), 'utf8')
      expect(standalonePage(prepared, file, assets)).toBe(originals.get(file))
      expect(preparePage(prepared, file, assets)).toBe(prepared)
    }
    for (const [kind, asset] of Object.entries(ARCHIFY_ASSETS)) {
      expect(readFileSync(path.join(root, asset.file), 'utf8')).toBe(assets[kind])
    }
  })

  it('is idempotent and --check leaves every input untouched', () => {
    const root = fixture()
    const files = [...ARCHIFY_PAGES, ...Object.values(ARCHIFY_ASSETS).map((asset) => asset.file)]
    const before = files.map((file) => readFileSync(path.join(root, file), 'utf8'))
    expect(prepareArchify({ root }).changed).toEqual([])
    expect(prepareArchify({ root, check: true }).changed).toEqual([])
    expect(files.map((file) => readFileSync(path.join(root, file), 'utf8'))).toEqual(before)
  })

  it('fails check on a regenerated inline page without normalizing it implicitly', () => {
    const root = fixture({ inline: true })
    const original = readFileSync(path.join(root, ARCHIFY_PAGES[0]), 'utf8')
    expect(() => prepareArchify({ root, check: true })).toThrow('Run node scripts/prepare-archify.mjs')
    expect(readFileSync(path.join(root, ARCHIFY_PAGES[0]), 'utf8')).toBe(original)
  })

  it('rejects a changed upstream runtime before any of the nine pages are written', () => {
    const root = fixture({ inline: true, shared: false })
    const last = ARCHIFY_PAGES.at(-1)!
    write(root, last, readFileSync(path.join(root, last), 'utf8').replace('var Archify = {};', 'var Archify = { drift: true };'))
    const firstBefore = readFileSync(path.join(root, ARCHIFY_PAGES[0]), 'utf8')
    expect(() => prepareArchify({ root })).toThrow('differs from the pinned 2.16.0 renderer')
    expect(readFileSync(path.join(root, ARCHIFY_PAGES[0]), 'utf8')).toBe(firstBefore)
    expect(existsSync(path.join(root, ARCHIFY_ASSETS.script.file))).toBe(false)
  })

  it('rejects drift in the authoritative common stylesheet', () => {
    const root = fixture()
    write(root, ARCHIFY_ASSETS.style.file, assets.style + '\n/* unexpected renderer change */')
    expect(() => prepareArchify({ root, check: true })).toThrow('differs from the pinned 2.16.0 renderer')
  })

  it('rejects missing or invalid relative dependencies', () => {
    const root = fixture()
    const file = ARCHIFY_PAGES[0]
    write(root, file, readFileSync(path.join(root, file), 'utf8').replace('./shared/archify-2.16.0.js', '../wrong.js'))
    expect(() => prepareArchify({ root, check: true })).toThrow('missing or invalid shared script reference')
  })

  it('reconstructs self-contained HTML outside the deployed public tree', () => {
    const root = fixture()
    const output = temporaryDirectory()
    expect(prepareArchify({ root, standaloneDir: output }).mode).toBe('standalone')
    for (const { file, html } of pages) {
      const portable = readFileSync(path.join(output, path.relative('public', file)), 'utf8')
      expect(portable).not.toContain('data-archify-shared=')
      expect(portable).toBe(standalonePage(html, file, assets))
      expect(preparePage(portable, file, assets)).toBe(html)
    }
    expect(() => prepareArchify({ root, standaloneDir: path.join(root, 'public', 'portable') }))
      .toThrow('outside public/')
    expect(existsSync(path.join(root, 'public', 'portable'))).toBe(false)
  })

  it('preserves authored text and newline style for LF and CRLF exports', () => {
    const { file, html } = pages[0]
    for (const eol of ['\n', '\r\n']) {
      const portable = normalize(standalonePage(html, file, assets)).replace(/\n/g, eol)
      const prepared = preparePage(portable, file, assets)
      expect(standalonePage(prepared, file, assets)).toBe(portable)
    }
  })
})
