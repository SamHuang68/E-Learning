import { describe, expect, it } from 'vitest'
import {
  CHINESE_GRAMMAR_SIGNALS,
  CHINESE_SUPPORT_EN as GRAMMAR_SIGNALS_SUPPORT_EN,
} from './data/grammarSignals'
import {
  CHINESE_SUPPORT_EN as PINYIN_SUPPORT_EN,
  CHINESE_TONES,
} from './data/pinyinBopomofo'
import { TOCFL_MOCK_QUESTIONS } from './data/tocflExam'
import {
  auditChineseEnglishCoverage,
  chineseFieldRole,
  type ChineseSupportDictionary,
  hasNonEnglishLearnerScript,
  localizeChineseData,
  localizeTocflQuestion,
} from './teachingCopy'

const dataModules = import.meta.glob('./data/**/*.ts', { eager: true }) as Record<
  string,
  Record<string, unknown>
>

type Coverage = {
  modules: number
  objectExports: number
  ids: number
  targetStrings: number
  supportStrings: number
  localizedSupportStrings: number
}

function walkRaw(value: unknown, path: string[], coverage: Coverage) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkRaw(item, [...path, String(index)], coverage))
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      walkRaw(child, [...path, key], coverage)
    }
    return
  }
  const role = chineseFieldRole(path)
  if (path.at(-1) === 'id') coverage.ids += 1
  if (role === 'target' && typeof value === 'string') coverage.targetStrings += 1
  if (role === 'support' && typeof value === 'string') {
    coverage.supportStrings += 1
    if (hasNonEnglishLearnerScript(value)) coverage.localizedSupportStrings += 1
  }
}

function fingerprint(values: string[]): string {
  let hash = 0x811c9dc5
  for (const value of values.join('\n')) {
    hash ^= value.charCodeAt(0)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function collectMixedTargetStrings(
  value: unknown,
  path: string[],
  findings: Array<{ path: string; value: string }>,
) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectMixedTargetStrings(item, [...path, String(index)], findings))
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      collectMixedTargetStrings(child, [...path, key], findings)
    }
    return
  }
  const field = [...path].reverse().find((part) => !/^\d+$/.test(part)) ?? ''
  const learnerExampleFields = new Set([
    'zh',
    'wordZh',
    'termZh',
    'idiomZh',
    'classifierZh',
    'locationZh',
    'exampleZh',
    'exampleSentenceZh',
    'exampleContextZh',
    'promptZh',
    'pattern',
    'wrong',
    'options',
    'cloze',
    'samplePhraseZh',
    'patternZh',
  ])
  const hasJapaneseKana =
    typeof value === 'string' &&
    learnerExampleFields.has(field) &&
    /[\u3041-\u3096\u30a1-\u30fa]/.test(value)
  const hasEmbeddedGrammarSupport =
    typeof value === 'string' &&
    path[0].includes('grammarSignals.ts') &&
    ['pattern', 'wrong', 'zh'].includes(field) &&
    /[\uff08(][^\uff09)]*[\uff09)]/.test(value)
  if (
    typeof value === 'string' &&
    chineseFieldRole(path) === 'target' &&
    (hasJapaneseKana || hasEmbeddedGrammarSupport)
  ) {
    findings.push({ path: path.join('.'), value })
  }
}

function objectExports() {
  return Object.entries(dataModules)
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([modulePath, exports]) => {
      const dictionary = exports.CHINESE_SUPPORT_EN
      expect(dictionary, `${modulePath}:CHINESE_SUPPORT_EN`).toBeTruthy()
      expect(Array.isArray(dictionary), `${modulePath}:CHINESE_SUPPORT_EN`).toBe(false)
      return Object.entries(exports)
        .filter(
          (entry): entry is [string, object] =>
            entry[0] !== 'CHINESE_SUPPORT_EN' && entry[1] !== null && typeof entry[1] === 'object',
        )
        .map(([exportName, value]) => ({
          modulePath,
          exportName,
          value,
          dictionary: dictionary as ChineseSupportDictionary,
        }))
    })
}

function walkPair(
  raw: unknown,
  localized: unknown,
  path: string[],
  coverage: Coverage,
) {
  if (Array.isArray(raw)) {
    expect(Array.isArray(localized), path.join('.')).toBe(true)
    expect((localized as unknown[]).length, path.join('.')).toBe(raw.length)
    raw.forEach((value, index) => walkPair(value, (localized as unknown[])[index], [...path, String(index)], coverage))
    return
  }
  if (raw && typeof raw === 'object') {
    expect(localized && typeof localized === 'object', path.join('.')).toBeTruthy()
    expect(Object.keys(localized as object).sort(), path.join('.')).toEqual(Object.keys(raw as object).sort())
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      walkPair(value, (localized as Record<string, unknown>)[key], [...path, key], coverage)
    }
    return
  }

  const role = chineseFieldRole(path)
  if (path.at(-1) === 'id') coverage.ids += 1
  if (role === 'identity') expect(localized, path.join('.')).toBe(raw)
  if (role === 'target' && typeof raw === 'string') {
    coverage.targetStrings += 1
    expect(localized, path.join('.')).toBe(raw)
  }
  if (role === 'support' && typeof raw === 'string') {
    coverage.supportStrings += 1
    expect(typeof localized, path.join('.')).toBe('string')
    expect((localized as string).trim(), path.join('.')).not.toBe('')
    if (hasNonEnglishLearnerScript(raw)) {
      coverage.localizedSupportStrings += 1
      expect(localized as string, path.join('.')).not.toBe(raw)
      expect(localized as string, path.join('.')).toMatch(/[A-Za-z]{2,}/)
      expect(localized as string, path.join('.')).not.toMatch(/[\u3040-\u30ff]/)
      expect((localized as string).trim(), path.join('.')).not.toMatch(
        /^(?:english|placeholder|todo|tbd|translation|unknown)$/i,
      )
    }
  }
}

describe('華語教材英文支援欄位政策', () => {
  it('全量遍歷每個資料匯出，保留 ID、答案與目標華語，只翻譯支援欄位', () => {
    const exports = objectExports()
    const mixedTargetStrings: Array<{ path: string; value: string }> = []
    const coverage: Coverage = {
      modules: Object.keys(dataModules).length,
      objectExports: exports.length,
      ids: 0,
      targetStrings: 0,
      supportStrings: 0,
      localizedSupportStrings: 0,
    }

    const allGaps: ReturnType<typeof auditChineseEnglishCoverage> = []
    for (const { modulePath, exportName, value, dictionary } of exports) {
      expect(localizeChineseData(value, 'zh-Hant', dictionary), `${modulePath}:${exportName}`).toBe(value)
      const before = JSON.stringify(value)
      const gaps = auditChineseEnglishCoverage(value, dictionary, `${modulePath}:${exportName}`)
      walkRaw(value, [modulePath, exportName], coverage)
      collectMixedTargetStrings(
        value,
        [modulePath, exportName],
        mixedTargetStrings,
      )
      expect(JSON.stringify(value), `${modulePath}:${exportName}`).toBe(before)
      allGaps.push(...gaps)
      const localized = localizeChineseData(value, 'en', dictionary)
      const comparisonCoverage = { ...coverage }
      walkPair(value, localized, [modulePath, exportName], comparisonCoverage)
    }

    expect({ coverage, gaps: {
      count: allGaps.length,
      unclassified: allGaps.filter((gap) => gap.reason === 'unclassified-field').length,
      fingerprint: fingerprint(allGaps.map((gap) => gap.path).sort()),
    } }).toEqual({ coverage: {
      modules: 42,
      objectExports: 45,
      ids: 163,
      targetStrings: 1530,
      supportStrings: 1541,
      localizedSupportStrings: 1405,
    }, gaps: { count: 0, unclassified: 0, fingerprint: '811c9dc5' } })
    expect(mixedTargetStrings).toEqual([])
  })

  it('文法與聲調範例將目標華語與學習者支援分欄，英文模式不洩漏日文', () => {
    const grammar = localizeChineseData(
      CHINESE_GRAMMAR_SIGNALS,
      'en',
      GRAMMAR_SIGNALS_SUPPORT_EN,
    )
    expect(grammar.map(({ pattern, patternDescriptionJa }) => [pattern, patternDescriptionJa])).toEqual([
      ['把字句', 'Disposal construction'],
      ['被字句', 'Passive construction'],
      ['了1 vs 了2', 'Completion versus change of state'],
      ['是…的', 'Focus construction'],
      ['動詞 + 過', 'Experiential aspect'],
      ['比較句', 'Comparison construction with 比'],
      ['兼語文', 'Causative constructions with 讓, 叫, or 請'],
    ])
    expect(grammar.map(({ pitfall }) => pitfall.wrong)).toEqual([
      '❌ 我把書看。',
      '❌ 我被他稱讚了。',
      '❌ 昨天我常去了那家咖啡店。',
      '❌ 我是昨天買了這本書的。',
      '❌ 我不吃過臭豆腐。',
      '❌ 今天比昨天很熱。',
      '❌ 我請他在。',
    ])
    expect(grammar[2].contrastExample.zh).toBe('下雨了！ vs 我買了一本書。')

    const tones = localizeChineseData(CHINESE_TONES, 'en', PINYIN_SUPPORT_EN)
    expect(tones.map(({ exampleZh, exampleMeaningJa }) => [exampleZh, exampleMeaningJa])).toEqual([
      ['媽媽', 'Mother'],
      ['麻煩', 'Trouble or inconvenience'],
      ['馬上', 'Immediately or right away'],
      ['罵人', 'To scold or insult someone'],
      ['你好嗎？', 'How are you?'],
    ])
  })

  it('五題 TOCFL mock 保留目標語料、答案及分數，支援欄位完整英文化', () => {
    expect(TOCFL_MOCK_QUESTIONS).toHaveLength(5)
    for (const raw of TOCFL_MOCK_QUESTIONS) {
      const localized = localizeTocflQuestion(raw, 'en')
      expect(localizeTocflQuestion(raw, 'zh-Hant')).toBe(raw)
      expect(localized.id).toBe(raw.id)
      expect(localized.correctIndex).toBe(raw.correctIndex)
      expect(localized.point).toBe(raw.point)
      expect(localized.promptZh).toBe(raw.promptZh)
      expect(localized.promptPinyin).toBe(raw.promptPinyin)
      expect(localized.promptBopomofo).toBe(raw.promptBopomofo)
      expect(localized.audioText).toBe(raw.audioText)
      expect(localized.options.map((option) => option.zh)).toEqual(raw.options.map((option) => option.zh))
      expect(localized.options.map((option) => option.pinyin)).toEqual(raw.options.map((option) => option.pinyin))
      expect([localized.level, localized.section, localized.promptJa, localized.explanationJa, ...localized.options.map((option) => option.ja)].join(' ')).not.toMatch(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/)
    }
  })
})
