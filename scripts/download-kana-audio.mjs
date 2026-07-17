import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import https from 'node:https'

/**
 * Download hiragana pronunciation MP3s (Tofugu free lesson assets).
 * Katakana reuses the same files by romaji — same mora sound.
 *
 * Attribution: audio from https://www.tofugu.com/japanese/learn-hiragana/
 */

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'audio', 'kana')

/** Unique romaji → representative hiragana char for download. */
const ROMAJI_TO_HIRA = {
  a: 'あ',
  i: 'い',
  u: 'う',
  e: 'え',
  o: 'お',
  ka: 'か',
  ki: 'き',
  ku: 'く',
  ke: 'け',
  ko: 'こ',
  sa: 'さ',
  shi: 'し',
  su: 'す',
  se: 'せ',
  so: 'そ',
  ta: 'た',
  chi: 'ち',
  tsu: 'つ',
  te: 'て',
  to: 'と',
  na: 'な',
  ni: 'に',
  nu: 'ぬ',
  ne: 'ね',
  no: 'の',
  ha: 'は',
  hi: 'ひ',
  fu: 'ふ',
  he: 'へ',
  ho: 'ほ',
  ma: 'ま',
  mi: 'み',
  mu: 'む',
  me: 'め',
  mo: 'も',
  ya: 'や',
  yu: 'ゆ',
  yo: 'よ',
  ra: 'ら',
  ri: 'り',
  ru: 'る',
  re: 'れ',
  ro: 'ろ',
  wa: 'わ',
  n: 'ん',
  ga: 'が',
  gi: 'ぎ',
  gu: 'ぐ',
  ge: 'げ',
  go: 'ご',
  za: 'ざ',
  ji: 'じ',
  zu: 'ず',
  ze: 'ぜ',
  zo: 'ぞ',
  da: 'だ',
  de: 'で',
  do: 'ど',
  ba: 'ば',
  bi: 'び',
  bu: 'ぶ',
  be: 'べ',
  bo: 'ぼ',
  pa: 'ぱ',
  pi: 'ぴ',
  pu: 'ぷ',
  pe: 'ぺ',
  po: 'ぽ',
}

const BASE =
  'https://files.tofugu.com/articles/japanese/2014-06-30-learn-hiragana/'

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchBuffer(res.headers.location).then(resolve, reject)
          return
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`))
          res.resume()
          return
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => resolve(Buffer.concat(chunks)))
      })
      .on('error', reject)
  })
}

mkdirSync(outDir, { recursive: true })

const entries = Object.entries(ROMAJI_TO_HIRA)
let ok = 0
let fail = 0

for (const [romaji, char] of entries) {
  const dest = join(outDir, `${romaji}.mp3`)
  if (existsSync(dest)) {
    console.log('skip', romaji)
    ok += 1
    continue
  }
  const url = `${BASE}${encodeURIComponent(char)}.mp3`
  try {
    const buf = await fetchBuffer(url)
    writeFileSync(dest, buf)
    console.log('ok', romaji, char, buf.length)
    ok += 1
  } catch (e) {
    console.error('fail', romaji, char, e.message)
    fail += 1
  }
}

writeFileSync(
  join(outDir, 'ATTRIBUTION.txt'),
  `Kana pronunciation MP3s sourced from Tofugu hiragana lesson assets:
https://www.tofugu.com/japanese/learn-hiragana/
https://files.tofugu.com/articles/japanese/2014-06-30-learn-hiragana/

Used for educational playback in E-Learning Hub. Prefer linking/attributing Tofugu.
`,
)

console.log(`done ok=${ok} fail=${fail} → ${outDir}`)
