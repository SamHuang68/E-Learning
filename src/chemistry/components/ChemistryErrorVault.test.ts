import { describe, expect, it } from 'vitest'
import { getAllChemistryUnits, type ChemistryQuestion } from '../data/curriculum'
import { CHEMISTRY_MOCK_EXAMS } from '../data/mockExams'
import { resolveChemistryLab } from './chemistryErrorVaultLabResolver'
import { findMatchingChemistrySignal } from './chemistryErrorVaultSignalMatcher'

const allQuestions = [
  ...getAllChemistryUnits().flatMap((unit) => unit.questions),
  ...Object.values(CHEMISTRY_MOCK_EXAMS).flatMap((exam) => exam.questions),
]

const EXPECTED_MATCHES: Record<string, string> = {
  g10_u6_q1: 'sig-atom-economy',
  g11_u7_q1: 'sig-water-vapor-pressure',
  g11_u8_q1: 'sig-colligative-freezing',
  g11_u9_q2: 'sig-vsepr-hybridization',
  g12_u16_q1: 'sig-faraday-electrolysis',
  gsat_q1: 'sig-atom-economy',
  ast_q2: 'sig-buffer-henderson',
}

const EXPECTED_LAB_MATCHES: Record<string, string> = {
  g7_u1_q1: 'solubility',
  g7_u1_q2: 'solubility',
  g8_u4_q4: 'gas',
  g10_u2_q2: 'periodic',
  g10_u4_q1: 'gas',
  g11_u9_q2: 'vsepr',
  g12_u13_q1: 'titration',
  g12_u13_q2: 'titration',
  cap_q1: 'solubility',
  cap_q3: 'titration',
  gsat_q2: 'gas',
}

describe('化學錯題本破題訊號配對', () => {
  it('80 題只保留 7 組具足夠語義證據的精確命中', () => {
    expect(allQuestions).toHaveLength(80)
    const actual = Object.fromEntries(
      allQuestions.flatMap((question) => {
        const match = findMatchingChemistrySignal(question, 'en')
        return match ? [[question.id, match.id]] : []
      }),
    )

    expect(actual).toEqual(EXPECTED_MATCHES)
  })

  it('英文與繁中模式使用同一組命中 ID，未命中時皆 fail-closed', () => {
    for (const question of allQuestions) {
      const englishMatch = findMatchingChemistrySignal(question, 'en')
      const traditionalChineseMatch = findMatchingChemistrySignal(question, 'zh-Hant')
      expect(traditionalChineseMatch?.id, question.id).toBe(englishMatch?.id)
      expect(englishMatch?.id, question.id).toBe(EXPECTED_MATCHES[question.id])
    }
  })

  it('未知舊錯題 ID 在英文與繁中模式都直接 fail-closed，不要求 registry 文案', () => {
    const legacyQuestion: ChemistryQuestion = {
      id: 'saved-legacy-id',
      title: 'Saved legacy review item',
      strand: 'reactions',
      type: 'choice',
      difficulty: 3,
      question: 'Review the governing chemical equation for this saved item.',
      answer: 'A',
      solution: 'Balance the equation and conserve amount of substance.',
    }

    expect(findMatchingChemistrySignal(legacyQuestion, 'en')).toBeUndefined()
    expect(findMatchingChemistrySignal(legacyQuestion, 'zh-Hant')).toBeUndefined()
  })
})

describe('化學錯題本實驗室契約', () => {
  it('掃描 26 個單元與 80 題，只回傳 11 組可由現有五個實驗室直接支援的明確命中', () => {
    const units = getAllChemistryUnits()
    const suggestedLabs = units.map((unit) => unit.suggestedLab)
    expect(units).toHaveLength(26)
    expect(new Set(suggestedLabs).size).toBe(26)
    expect(
      suggestedLabs.filter((suggestedLab) =>
        ['titration', 'periodic', 'vsepr', 'gas', 'solubility'].includes(suggestedLab),
      ),
    ).toEqual([])
    expect(allQuestions).toHaveLength(80)

    const actual = Object.fromEntries(
      allQuestions.flatMap((question) => {
        const match = resolveChemistryLab(question)
        return match ? [[question.id, match.id]] : []
      }),
    )

    expect(actual).toEqual(EXPECTED_LAB_MATCHES)
    expect(new Set(Object.values(actual))).toEqual(
      new Set(['titration', 'periodic', 'vsepr', 'gas', 'solubility']),
    )
  })

  it('不以主軸、通用字詞或不受支援的實驗敘述猜測實驗室', () => {
    for (const questionId of ['g11_u7_q2', 'g12_u13_q3', 'g12_u14_q1']) {
      const question = allQuestions.find((candidate) => candidate.id === questionId)
      expect(question, questionId).toBeDefined()
      expect(resolveChemistryLab(question!), questionId).toBeUndefined()
    }
  })

  it('未知舊錯題 ID 即使帶有 reactions 主軸與通用實驗室文案仍 fail-closed', () => {
    const legacyQuestion: ChemistryQuestion = {
      id: 'saved-legacy-id',
      title: 'Saved legacy review item',
      strand: 'reactions',
      type: 'choice',
      difficulty: 3,
      question: 'Review a solution reaction and the relevant laboratory model.',
      answer: 'A',
      solution: 'Balance the equation and conserve amount of substance.',
    }

    expect(resolveChemistryLab(legacyQuestion)).toBeUndefined()
  })
})
