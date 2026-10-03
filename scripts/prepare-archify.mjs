import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ARCHIFY_PAGES = [
  'public/archify/ai-pc-architecture.html',
  'public/archify/ai-server-architecture.html',
  'public/archify/cache-coherence-sequence.html',
  'public/archify/lsm-tree-architecture.html',
  'public/archify/percolator-transaction.html',
  'public/archify/process-lifecycle.html',
  'public/archify/tcp-handshake-sequence.html',
  'public/archify/transformer-attention.html',
  'public/srs-review.html',
]

// These are the unchanged, identical blocks in all nine Archify 2.16.0 exports.
// Pinning their LF-normalized bytes prevents an upstream renderer upgrade from
// silently replacing the common renderer used by existing diagrams.
export const ARCHIFY_ASSETS = {
  style: {
    file: 'public/archify/shared/archify-2.16.0.css',
    sha256: '359085f552efb058c83d122dcb0fdbed9dc9730172c1b05bc46e3eb7be55897e',
    bytes: 186037,
  },
  script: {
    file: 'public/archify/shared/archify-2.16.0.js',
    sha256: '6d7da2e81bf135bfd5a0274fb4ebdb6c4150a5f766bd63d423efed65378251b5',
    bytes: 451594,
  },
}
const repositoryRoot = fileURLToPath(new URL('..', import.meta.url))
const normalize = (text) => text.replace(/\r\n/g, '\n')
const sha256 = (text) => createHash('sha256').update(text).digest('hex')

function inlineBlock(html, kind, file) {
  const expression = new RegExp('<' + kind + '>([\\s\\S]*?)</' + kind + '>', 'g')
  const blocks = [...html.matchAll(expression)]
    .filter((match) => Buffer.byteLength(match[1]) > 100000)
  if (blocks.length > 1) throw new Error(file + ': multiple large ' + kind + ' blocks')
  return blocks[0]
}

function validateAsset(content, kind, source) {
  const expected = ARCHIFY_ASSETS[kind]
  if (sha256(normalize(content)) !== expected.sha256) {
    throw new Error(source + ': Archify ' + kind + ' differs from the pinned 2.16.0 renderer; review the upstream change before updating shared assets')
  }
}

export function sharedTag(file, kind) {
  const relative = './' + path.posix.relative(path.posix.dirname(file), ARCHIFY_ASSETS[kind].file)
  return kind === 'style'
    ? '<link rel="stylesheet" href="' + relative + '" data-archify-shared="style">'
    : '<script src="' + relative + '" data-archify-shared="script"></script>'
}

export function preparePage(html, file, assets) {
  if (!html.includes('<meta name="generator" content="archify 2.16.0">')) {
    throw new Error(file + ': expected Archify 2.16.0 generator metadata')
  }
  let output = html
  for (const kind of ['style', 'script']) {
    validateAsset(assets[kind], kind, ARCHIFY_ASSETS[kind].file)
    const block = inlineBlock(output, kind, file)
    const reference = sharedTag(file, kind)
    const marker = 'data-archify-shared="' + kind + '"'
    if (block) {
      if (output.includes(marker)) throw new Error(file + ': duplicate inline/shared ' + kind)
      validateAsset(block[1], kind, file)
      // Replace only the original block; retain all diagram data, markup,
      // early theme bootstrap and classic script execution order unchanged.
      output = output.replace(block[0], () => reference)
    } else if (output.split(reference).length !== 2 || output.split(marker).length !== 2) {
      throw new Error(file + ': missing or invalid shared ' + kind + ' reference')
    }
  }
  return output
}

export function standalonePage(html, file, assets) {
  let output = preparePage(html, file, assets)
  const eol = html.includes('\r\n') ? '\r\n' : '\n'
  for (const kind of ['style', 'script']) {
    const content = normalize(assets[kind]).replace(/\n/g, eol)
    output = output.replace(sharedTag(file, kind), () => '<' + kind + '>' + content + '</' + kind + '>')
  }
  return output
}

/** Validate everything before writing; --check never changes tracked files. */
export function prepareArchify({ root = repositoryRoot, check = false, standaloneDir } = {}) {
  if (check && standaloneDir) throw new Error('--check and --standalone are mutually exclusive')
  const pages = ARCHIFY_PAGES.map((file) => ({ file, html: readFileSync(path.join(root, file), 'utf8') }))
  const assets = {}
  const missingAssets = []
  for (const kind of ['style', 'script']) {
    const definition = ARCHIFY_ASSETS[kind]
    const assetPath = path.join(root, definition.file)
    if (existsSync(assetPath)) {
      assets[kind] = normalize(readFileSync(assetPath, 'utf8'))
    } else {
      if (check) throw new Error(definition.file + ': shared asset missing')
      const source = pages.map(({ file, html }) => inlineBlock(html, kind, file)).find(Boolean)
      if (!source) throw new Error(definition.file + ': no original inline asset to extract')
      assets[kind] = normalize(source[1])
      missingAssets.push(kind)
    }
    validateAsset(assets[kind], kind, definition.file)
  }
  const prepared = pages.map(({ file, html }) => ({ file, html, output: preparePage(html, file, assets) }))
  const changed = prepared.filter(({ html, output }) => html !== output).map(({ file }) => file)
  if (check && changed.length) throw new Error('Run node scripts/prepare-archify.mjs to prepare: ' + changed.join(', '))

  if (standaloneDir) {
    const destination = path.resolve(standaloneDir)
    const publicRoot = path.resolve(root, 'public')
    const relative = path.relative(publicRoot, destination)
    if (relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative))) {
      throw new Error('Standalone copies must be outside public/ to avoid duplicating deployed assets')
    }
    for (const { file, html } of prepared) {
      const target = path.join(destination, path.relative('public', file))
      mkdirSync(path.dirname(target), { recursive: true })
      writeFileSync(target, standalonePage(html, file, assets), 'utf8')
    }
  } else if (!check) {
    for (const kind of missingAssets) {
      const target = path.join(root, ARCHIFY_ASSETS[kind].file)
      mkdirSync(path.dirname(target), { recursive: true })
      writeFileSync(target, assets[kind], 'utf8')
    }
    for (const { file, html, output } of prepared) {
      if (html !== output) writeFileSync(path.join(root, file), output, 'utf8')
    }
  }

  const originalInlineBytes = prepared.reduce((sum, { html, file }) =>
    sum + Buffer.byteLength(normalize(standalonePage(html, file, assets))), 0)
  const preparedBytes = prepared.reduce((sum, { output }) => sum + Buffer.byteLength(normalize(output)), 0)
  const sharedBytes = Object.values(assets).reduce((sum, content) => sum + Buffer.byteLength(content), 0)
  return {
    mode: check ? 'check' : standaloneDir ? 'standalone' : 'prepare',
    pages: pages.length,
    changed,
    originalInlineBytes,
    preparedBytes,
    sharedBytes,
    totalBytes: preparedBytes + sharedBytes,
    savedBytes: originalInlineBytes - preparedBytes - sharedBytes,
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2)
    let options = {}
    if (args.length === 1 && args[0] === '--check') options = { check: true }
    else if (args.length === 2 && args[0] === '--standalone') options = { standaloneDir: args[1] }
    else if (args.length) throw new Error('Usage: node scripts/prepare-archify.mjs [--check | --standalone <output-directory>]')
    console.log(JSON.stringify(prepareArchify(options), null, 2))
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
