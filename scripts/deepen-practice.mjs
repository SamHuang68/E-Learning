import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tempDir = mkdtempSync(path.join(tmpdir(), 'practice-depth-'))
const tscBin = path.join(root, 'node_modules', '.bin', 'tsc')

const jaTargets = { vocab: 40, passage: 8, grammar: 10 }
const toeicTargets = { vocab: 40, passage: 12, grammar: 10 }
const samplePacks = [
  { key: 'n5n4:1', file: 'packs/ja-n5n4-1.json', family: 'japanese' },
  { key: 'green:2', file: 'packs/toeic-green-2.json', family: 'toeic' },
]

function compilePracticeModules() {
  execFileSync(
    tscBin,
    [
      '--ignoreConfig',
      '--ignoreDeprecations',
      '6.0',
      '--module',
      'commonjs',
      '--target',
      'es2020',
      '--moduleResolution',
      'node10',
      '--outDir',
      tempDir,
      '--rootDir',
      'src',
      '--skipLibCheck',
      '--esModuleInterop',
      'src/data/practiceContent.ts',
      'src/toeic/data/practiceContent.ts',
    ],
    { cwd: root, stdio: 'inherit' },
  )
}

function assertDepth(name, pack, targets) {
  for (const section of /** @type {const} */ (['vocab', 'passage', 'grammar'])) {
    if (pack[section].length < targets[section]) {
      throw new Error(
        `${name} has ${pack[section].length} ${section} cards; expected ${targets[section]}`,
      )
    }
  }
}

function countContrasts(pack) {
  return pack.grammar.filter((card) => {
    const text = `${card.head} ${card.meaning} ${card.sentence}`
    return text.includes('↔') || text.includes('vs') || text.includes('Direct')
  }).length
}

function loadExpandedPractice() {
  const require = createRequire(import.meta.url)
  const ja = require(path.join(tempDir, 'data', 'practiceContent.js'))
  const toeic = require(path.join(tempDir, 'toeic', 'data', 'practiceContent.js'))
  return {
    jaPracticeContent: ja.jaPracticeContent,
    toeicPracticeContent: toeic.toeicPracticeContent,
  }
}

function verifyAll({ jaPracticeContent, toeicPracticeContent }) {
  for (const [key, pack] of Object.entries(jaPracticeContent)) {
    assertDepth(key, pack, jaTargets)
  }
  for (const [key, pack] of Object.entries(toeicPracticeContent)) {
    assertDepth(key, pack, toeicTargets)
  }

  for (const key of ['n3:4', 'n2n1:1']) {
    if (countContrasts(jaPracticeContent[key]) < 4) {
      throw new Error(`${key} needs at least four keigo contrast grammar cards`)
    }
  }
  for (const key of ['green:2', 'gold:1', 'gold:2']) {
    if (countContrasts(toeicPracticeContent[key]) < 4) {
      throw new Error(`${key} needs at least four diplomatic contrast grammar cards`)
    }
  }
}

function writeSamplePacks({ jaPracticeContent, toeicPracticeContent }) {
  const packsDir = path.join(root, 'public', 'content', 'packs')
  mkdirSync(packsDir, { recursive: true })

  for (const sample of samplePacks) {
    const pack =
      sample.family === 'japanese'
        ? jaPracticeContent[sample.key]
        : toeicPracticeContent[sample.key]
    const filePath = path.join(root, 'public', 'content', sample.file)
    writeFileSync(
      filePath,
      `${JSON.stringify({ key: sample.key, family: sample.family, ...pack }, null, 2)}\n`,
    )
  }

  const manifestPath = path.join(root, 'public', 'content', 'manifest.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const packs = new Set([...(manifest.packs ?? []), ...samplePacks.map((pack) => pack.file)])
  writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        ...manifest,
        updatedAt: new Date().toISOString(),
        packs: [...packs].sort(),
      },
      null,
      2,
    )}\n`,
  )
}

try {
  compilePracticeModules()
  const expandedPractice = loadExpandedPractice()
  verifyAll(expandedPractice)
  if (process.argv.includes('--write')) {
    writeSamplePacks(expandedPractice)
  }
  console.log('Practice depth verification passed.')
} finally {
  rmSync(tempDir, { recursive: true, force: true })
}
