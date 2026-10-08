import { describe, expect, it } from 'vitest'
import { jaMockQuestions } from '../data/mock/ja'
import { jaPlacementQuestions } from '../data/placement/ja'
import { jaScenarios } from '../data/scenarios'
import {
  JA_MOCK_QUESTION_EN,
  JA_PLACEMENT_QUESTION_EN,
  JA_SCENARIO_EN,
  localizeJaMockQuestions,
  localizeJaPlacementQuestions,
  localizeJaScenarios,
} from './jaInteractiveCopy'

const HAN = /[\u3400-\u9fff\uf900-\ufaff]/

const SCENARIO_IDS = ['ja-shop', 'ja-coworker', 'ja-manager', 'ja-client']
const MOCK_IDS = [
  'ja-m-01',
  'ja-m-02',
  'ja-m-03',
  'ja-m-04',
  'ja-m-05',
  'ja-m-06',
  'ja-m-07',
  'ja-m-08',
  'ja-m-09',
  'ja-m-10',
  'ja-m-11',
  'ja-m-12',
]
const PLACEMENT_IDS = [
  'ja-p-01',
  'ja-p-02',
  'ja-p-03',
  'ja-p-04',
  'ja-p-05',
  'ja-p-06',
  'ja-p-07',
  'ja-p-08',
  'ja-p-09',
  'ja-p-10',
  'ja-p-11',
  'ja-p-12',
  'ja-p-13',
  'ja-p-14',
  'ja-p-15',
  'ja-p-16',
  'ja-p-17',
  'ja-p-18',
]

const MOCK_TARGET_CHOICE_INDEXES: Readonly<Record<string, readonly number[]>> = {
  'ja-m-02': [0, 1, 2, 3],
  'ja-m-03': [0, 1, 2, 3],
  'ja-m-04': [0, 1, 2, 3],
  'ja-m-05': [0, 1, 2, 3],
  'ja-m-06': [0, 1, 2, 3],
  'ja-m-08': [0, 1, 2, 3],
  'ja-m-09': [0, 1, 2, 3],
  'ja-m-11': [0, 1, 2, 3],
  'ja-m-12': [0, 1, 2, 3],
}

const PLACEMENT_TARGET_CHOICE_INDEXES: Readonly<Record<string, readonly number[]>> = {
  'ja-p-02': [0, 1, 2, 3],
  'ja-p-03': [0, 1, 2, 3],
  'ja-p-06': [0, 1, 2, 3],
  'ja-p-08': [0, 1, 2, 3],
  'ja-p-09': [0, 1, 2, 3],
}

function assertQuestionIdentity(
  source: { id: string; tag: string; choices: string[]; answer: string },
  localized: { id: string; tag: string; choices: string[]; answer: string },
) {
  expect(localized.id).toBe(source.id)
  expect(localized.tag).toBe(source.tag)
  expect(localized.choices).toHaveLength(source.choices.length)
  expect(localized.choices.indexOf(localized.answer), `${source.id}.answer`).toBe(
    source.choices.indexOf(source.answer),
  )
}

function stripExactSegments(text: string, segments: readonly string[]): string {
  return segments.reduce((result, segment) => result.split(segment).join(''), text)
}

describe('日語互動資料英文支援', () => {
  it('完整覆蓋 4 個情境、12 個步驟與 36 個日語選項', () => {
    expect(jaScenarios.map(({ id }) => id)).toEqual(SCENARIO_IDS)
    expect(Object.keys(JA_SCENARIO_EN)).toEqual(SCENARIO_IDS)
    expect(jaScenarios.flatMap(({ beats }) => beats)).toHaveLength(12)
    expect(jaScenarios.flatMap(({ beats }) => beats.flatMap(({ options }) => options))).toHaveLength(36)

    const localized = localizeJaScenarios('en')
    expect(localized).toHaveLength(jaScenarios.length)
    localized.forEach((scenario, scenarioIndex) => {
      const source = jaScenarios[scenarioIndex]
      expect(scenario.id).toBe(source.id)
      expect(scenario.beats).toHaveLength(source.beats.length)
      expect(scenario.title, `${source.id}.title`).not.toMatch(HAN)
      expect(scenario.scene, `${source.id}.scene`).not.toMatch(HAN)

      scenario.beats.forEach((beat, beatIndex) => {
        const sourceBeat = source.beats[beatIndex]
        expect(beat.prompt, `${source.id}.beats[${beatIndex}].prompt`).not.toMatch(HAN)
        expect(beat.options).toHaveLength(sourceBeat.options.length)
        beat.options.forEach((option, optionIndex) => {
          const sourceOption = sourceBeat.options[optionIndex]
          expect(option.text).toBe(sourceOption.text)
          expect(option.correct).toBe(sourceOption.correct)
          expect(option.register, `${source.id}.beats[${beatIndex}].options[${optionIndex}].register`).not.toMatch(HAN)
        })
      })
    })
  })

  it('完整走訪 12 題模擬試題，只翻譯 learner-support 選項', () => {
    expect(jaMockQuestions.map(({ id }) => id)).toEqual(MOCK_IDS)
    expect(Object.keys(JA_MOCK_QUESTION_EN)).toEqual(MOCK_IDS)

    const localized = localizeJaMockQuestions('en')
    expect(localized).toHaveLength(12)
    localized.forEach((question, questionIndex) => {
      const source = jaMockQuestions[questionIndex]
      const targetIndexes = new Set(MOCK_TARGET_CHOICE_INDEXES[source.id] ?? [])
      assertQuestionIdentity(source, question)

      // 模擬試題的 prompt 全部是日語題幹，不能為了通過漢字掃描而改寫。
      expect(question.prompt).toBe(source.prompt)
      question.choices.forEach((choice, choiceIndex) => {
        if (targetIndexes.has(choiceIndex)) {
          expect(choice, `${source.id}.choices[${choiceIndex}]`).toBe(source.choices[choiceIndex])
          return
        }
        expect(choice, `${source.id}.choices[${choiceIndex}]`).not.toMatch(HAN)
        if (HAN.test(source.choices[choiceIndex])) {
          expect(choice).not.toBe(source.choices[choiceIndex])
        }
      })
    })
  })

  it('完整走訪 18 題分級試題，僅允許原題日語片段與日語選項含漢字', () => {
    expect(jaPlacementQuestions.map(({ id }) => id)).toEqual(PLACEMENT_IDS)
    expect(Object.keys(JA_PLACEMENT_QUESTION_EN)).toEqual(PLACEMENT_IDS)

    const localized = localizeJaPlacementQuestions('en')
    expect(localized).toHaveLength(18)
    localized.forEach((question, questionIndex) => {
      const source = jaPlacementQuestions[questionIndex]
      const targetIndexes = new Set(PLACEMENT_TARGET_CHOICE_INDEXES[source.id] ?? [])
      const japanesePromptSegments = source.prompt.match(/「[^」]*」/g) ?? []
      assertQuestionIdentity(source, question)

      japanesePromptSegments.forEach((segment) => expect(question.prompt).toContain(segment))
      expect(stripExactSegments(question.prompt, japanesePromptSegments), `${source.id}.prompt support`).not.toMatch(HAN)

      question.choices.forEach((choice, choiceIndex) => {
        if (targetIndexes.has(choiceIndex)) {
          expect(choice, `${source.id}.choices[${choiceIndex}]`).toBe(source.choices[choiceIndex])
          return
        }
        expect(choice, `${source.id}.choices[${choiceIndex}]`).not.toMatch(HAN)
        expect(choice).not.toBe(source.choices[choiceIndex])
      })
    })
  })

  it('維持 zh-Hant 原始資料 reference，不建立多餘副本', () => {
    expect(localizeJaScenarios('zh-Hant')).toBe(jaScenarios)
    expect(localizeJaMockQuestions('zh-Hant')).toBe(jaMockQuestions)
    expect(localizeJaPlacementQuestions('zh-Hant')).toBe(jaPlacementQuestions)
  })

  it('代表樣本具有精確英文語意，且答案跟著翻譯後選項移動', () => {
    const scenarios = localizeJaScenarios('en')
    const mock = localizeJaMockQuestions('en')
    const placement = localizeJaPlacementQuestions('en')

    expect(scenarios[0].title).toBe('Shop Clerk: Asking About a Return')
    expect(scenarios[2].beats[1].options[2].register).toBe('blame-shifting')
    expect(mock[0]).toMatchObject({ choices: ['ticket', 'umbrella', 'chair', 'pencil'], answer: 'ticket' })
    expect(mock[9]).toMatchObject({ choices: ['reservation', 'cancellation', 'payment', 'explanation'], answer: 'reservation' })
    expect(placement[12]).toMatchObject({
      prompt: 'In 「資料を拝見します。」, what type of language is 「拝見」?',
      choices: ['Humble language', 'Honorific language', 'Plain form', 'Imperative form'],
      answer: 'Humble language',
    })
    expect(placement[17].answer).toBe('Prior to ...')
  })

  it('遇到未知 ID 或答案位置漂移時明確失敗，不使用 generic fallback', () => {
    expect(() => localizeJaScenarios('en', [{ ...jaScenarios[0], id: 'ja-new' }])).toThrow(
      '缺少日語情境英文支援翻譯：ja-new',
    )
    expect(() => localizeJaMockQuestions('en', [{ ...jaMockQuestions[0], id: 'ja-m-new' }])).toThrow(
      '缺少日語模擬試題英文支援翻譯：ja-m-new',
    )
    expect(() => localizeJaPlacementQuestions('en', [{ ...jaPlacementQuestions[0], id: 'ja-p-new' }])).toThrow(
      '缺少日語分級試題英文支援翻譯：ja-p-new',
    )
    expect(() => localizeJaMockQuestions('en', [{
      ...jaMockQuestions[0],
      choices: ['雨傘', '車票', '椅子', '鉛筆'],
      answer: '車票',
    }])).toThrow('日語模擬試題答案位置不一致：ja-m-01')
  })
})
