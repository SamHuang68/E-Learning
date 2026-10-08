import { describe, expect, it } from 'vitest'
import { gradeAnswer, sessionFromUnitPractice } from '../engine/exercises'
import { toeicPracticeContent, toeicPracticeMeaningEn } from './data/practiceContent'
import { TOEIC_CHUNK_WEEKS } from './data/chunks'
import {
  auditToeicEnglishCoverage,
  hasEastAsianScript,
  localizeToeicData,
  localizeToeicPractice,
  toeicFieldRole,
} from './teachingCopy'

const dataModules = import.meta.glob('./data/**/*.ts', { eager: true }) as Record<
  string,
  Record<string, unknown>
>

const consumerSources = import.meta.glob(['./components/*.tsx', '!./components/*.test.tsx', './ToeicApp.tsx'], {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>

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
  const role = toeicFieldRole(path)
  if (path.at(-1) === 'id') coverage.ids += 1
  if (role === 'target' && typeof value === 'string') coverage.targetStrings += 1
  if (role === 'support' && typeof value === 'string') {
    coverage.supportStrings += 1
    if (hasEastAsianScript(value)) coverage.localizedSupportStrings += 1
  }
}

function objectExports() {
  return Object.entries(dataModules)
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([modulePath, exports]) =>
      Object.entries(exports)
        .filter((entry): entry is [string, object] => entry[1] !== null && typeof entry[1] === 'object')
        .map(([exportName, value]) => ({ modulePath, exportName, value })),
    )
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

  const role = toeicFieldRole(path)
  if (path.at(-1) === 'id') coverage.ids += 1
  if (role === 'identity') expect(localized, path.join('.')).toBe(raw)
  if (role === 'target' && typeof raw === 'string') {
    coverage.targetStrings += 1
    expect(localized, path.join('.')).toBe(raw)
  }
  if (role === 'support' && typeof raw === 'string') {
    coverage.supportStrings += 1
    if (path.at(-1) === 'sentenceZh' && localized === undefined) {
      coverage.localizedSupportStrings += Number(hasEastAsianScript(raw))
      return
    }
    expect(typeof localized, path.join('.')).toBe('string')
    expect((localized as string).trim(), path.join('.')).not.toBe('')
    if (hasEastAsianScript(raw)) {
      coverage.localizedSupportStrings += 1
      expect(localized as string, path.join('.')).not.toMatch(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/)
    }
  }
}

describe('TOEIC 教材英文支援欄位政策', () => {
  it('全量遍歷每個資料匯出，保留識別、答案與英文目標語料，只翻譯支援欄位', () => {
    const exports = objectExports()
    const coverage: Coverage = {
      modules: Object.keys(dataModules).length,
      objectExports: exports.length,
      ids: 0,
      targetStrings: 0,
      supportStrings: 0,
      localizedSupportStrings: 0,
    }

    const allGaps: ReturnType<typeof auditToeicEnglishCoverage> = []
    const gapModules = new Set<string>()
    for (const { modulePath, exportName, value } of exports) {
      expect(localizeToeicData(value, 'zh-Hant'), `${modulePath}:${exportName}`).toBe(value)
      const before = JSON.stringify(value)
      const gaps = auditToeicEnglishCoverage(value, `${modulePath}:${exportName}`)
      walkRaw(value, [modulePath, exportName], coverage)
      expect(JSON.stringify(value), `${modulePath}:${exportName}`).toBe(before)
      if (gaps.length === 0) {
        const localized = localizeToeicData(value, 'en', 'zh')
        const localizedWithJapanesePreference = localizeToeicData(value, 'en', 'ja')
        const comparisonCoverage = { ...coverage }
        walkPair(value, localized, [modulePath, exportName], comparisonCoverage)
        walkPair(value, localizedWithJapanesePreference, [modulePath, exportName], comparisonCoverage)
      } else {
        gapModules.add(modulePath)
        allGaps.push(...gaps)
        expect(() => localizeToeicData(value, 'en', 'zh'), `${modulePath}:${exportName}`).toThrow(
          /Missing TOEIC English translation|Unclassified TOEIC English-mode field/,
        )
      }
    }

    expect(coverage).toEqual({
      modules: 51,
      objectExports: 97,
      ids: 1035,
      targetStrings: 2771,
      supportStrings: 4045,
      localizedSupportStrings: 3136,
    })
    expect([...gapModules]).toEqual([])
    expect(allGaps).toEqual([])
  })

  it('所有練習包保留卡片 ID、英文句子及可評分答案', () => {
    let cardCount = 0
    for (const [packId, raw] of Object.entries(toeicPracticeContent)) {
      const localized = localizeToeicPractice(raw, 'en')!
      expect(localizeToeicPractice(raw, 'zh-Hant')).toBe(raw)
      const rawCards = [...raw.vocab, ...raw.passage, ...raw.grammar]
      const cards = [...localized.vocab, ...localized.passage, ...localized.grammar]
      cardCount += cards.length
      expect(cards.map((card) => card.id), packId).toEqual(rawCards.map((card) => card.id))
      expect(cards.map((card) => card.sentence), packId).toEqual(rawCards.map((card) => card.sentence))
      expect(cards.map((card) => card.meaning), packId).toEqual(
        rawCards.map((card) => toeicPracticeMeaningEn[card.id]),
      )
      expect(cards.map((card) => card.sentenceZh), packId).toEqual(
        rawCards.map((card) => card.sentence),
      )
      for (const kind of ['vocab', 'listening', 'grammar'] as const) {
        const rawExercises = sessionFromUnitPractice(raw, kind, 'en')
        const exercises = sessionFromUnitPractice(localized, kind, 'en')
        expect(exercises.map((exercise) => exercise.id), `${packId}:${kind}`).toEqual(
          rawExercises.map((exercise) => exercise.id),
        )
        for (const exercise of exercises) expect(gradeAnswer(exercise, exercise.answer)).toBe(true)
      }
    }
    expect({ packs: Object.keys(toeicPracticeContent).length, cards: cardCount }).toEqual({
      packs: 24,
      cards: 312,
    })
    expect(Object.keys(toeicPracticeMeaningEn)).toHaveLength(312)
    expect(toeicPracticeMeaningEn['orange-1-v1']).toContain('ordered set of letters')
    expect(toeicPracticeMeaningEn['orange-5-v2']).toContain('latest time')
    expect(toeicPracticeMeaningEn['blue-1-v1']).toContain('subjects to be discussed')
    expect(toeicPracticeMeaningEn['gold-6-v4']).toContain('best interest')
  })

  it('英文語塊複習提示保留語意但不直接洩漏答案', () => {
    const weeks = localizeToeicData(TOEIC_CHUNK_WEEKS, 'en', 'ja')
    const production = weeks.flatMap((week) =>
      week.chunks.flatMap((chunk) => chunk.production),
    )

    expect(production).toHaveLength(9)
    for (const item of production) {
      expect(item.promptZh).not.toBe(item.answerEn)
      expect(item.promptJa).not.toBe(item.answerEn)
      expect(item.promptZh).not.toMatch(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/)
      expect(item.promptJa).not.toMatch(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/)
    }
  })

  it('所有直接讀取 TOEIC 教材的可達消費端都通過英文支援邊界', () => {
    const dataImport = /from\s+['"](?:\.\.\/|\.\/)data\/[^'"]+['"]/
    const localizationBoundary = /\b(?:localizeToeicData|localizeToeicSignal|localizeToeicPractice|localizeToeicCertificate|toeicSupportLang)\b/
    const directConsumers = Object.entries(consumerSources)
      .filter(([, source]) => dataImport.test(source))
      .map(([path]) => path.replace('./components/', '').replace('./', ''))
      .sort()

    expect(directConsumers).toEqual([
      'AiCloudLab.tsx',
      'AntitrustHhiLab.tsx',
      'AntitrustLab.tsx',
      'BondedWarehouseLab.tsx',
      'BusinessInterruptionLab.tsx',
      'ChartAnalysisLab.tsx',
      'CloudSlaLab.tsx',
      'ColdChainLab.tsx',
      'ConferenceLab.tsx',
      'ConflictMineralsLab.tsx',
      'CybersecurityLab.tsx',
      'DoublePassageLab.tsx',
      'EmailMasterLab.tsx',
      'EsgLab.tsx',
      'FcpaComplianceLab.tsx',
      'ForceMajeureLab.tsx',
      'GdprPrivacyLab.tsx',
      'InterviewLab.tsx',
      'IpLab.tsx',
      'LetterOfCreditLab.tsx',
      'MarineInsuranceLab.tsx',
      'MarketingLab.tsx',
      'MnaLab.tsx',
      'NdaTradeSecretsLab.tsx',
      'NegotiationLab.tsx',
      'PatentLitigationLab.tsx',
      'PhoneLab.tsx',
      'PhonicsLab.tsx',
      'PrLab.tsx',
      'RealEstateLab.tsx',
      'RfpBiddingLab.tsx',
      'RoyaltyAuditLab.tsx',
      'SupplyChainLab.tsx',
      'TechTransferLab.tsx',
      'ToeicApp.tsx',
      'ToeicAudioPlayer.tsx',
      'ToeicBuilder.tsx',
      'ToeicChunkLab.tsx',
      'ToeicErrorVault.tsx',
      'ToeicPractice.tsx',
      'ToeicSidebar.tsx',
      'ToeicSignalsView.tsx',
      'ToeicStoryReview.tsx',
      'ToeicSynthesisSeries.tsx',
      'ToeicToday.tsx',
      'TradeLab.tsx',
      'TravelLab.tsx',
    ])

    const bypasses = Object.entries(consumerSources)
      .filter(([, source]) => dataImport.test(source) && !localizationBoundary.test(source))
      .map(([path]) => path)
      .sort()
    expect(bypasses).toEqual([])

    const app = consumerSources['./ToeicApp.tsx']
    const requiredLazyViews = [
      'AiCloudLab',
      'ChartAnalysisLab',
      'ConferenceLab',
      'DoublePassageLab',
      'EmailMasterLab',
      'NegotiationLab',
      'PhoneLab',
      'PhonicsLab',
      'ToeicChunkLab',
      'ToeicSignalsView',
      'ToeicStoryReview',
      'ToeicSynthesisSeries',
    ]
    for (const view of requiredLazyViews) {
      expect(app, view).toContain(`./components/${view}`)
      expect(app, view).toMatch(new RegExp(`const ${view} = lazy\\(`))
    }
  })

  it('共用情境實驗室的卡片欄寬可縮到窄螢幕容器內', () => {
    const scenarioLab = consumerSources['./components/ScenarioListeningLab.tsx']

    expect(scenarioLab).toContain('minmax(min(280px, 100%), 1fr)')
    expect(scenarioLab).not.toContain('minmax(280px, 1fr)')
  })
})
