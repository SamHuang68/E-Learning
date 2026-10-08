import { describe, expect, it } from 'vitest'
import { localizeMathExam } from '../../i18n/mathTeachingCopy'
import { MOCK_EXAMS } from '../data/mockExams'
import {
  deriveMathMockResultDisplay,
  type MathMockScoreResult,
} from './MathMockExam'
import source from './MathMockExam.tsx?raw'

describe('MathMockExam 語系即時更新結果契約', () => {
  it('以穩定的錯題 ID 推導目前語系的結果', () => {
    const sourceExam = MOCK_EXAMS.cap
    const wrongQuestionIds = [
      sourceExam.questions[0].id,
      sourceExam.questions[0].id,
      sourceExam.questions[1].id,
    ]
    const result: MathMockScoreResult = {
      correctCount: sourceExam.questions.length - 2,
      totalCount: sourceExam.questions.length,
      percentage: Math.round(
        ((sourceExam.questions.length - 2) / sourceExam.questions.length) * 100,
      ),
      wrongQuestionIds,
    }
    const originalResult = structuredClone(result)
    const zhExam = localizeMathExam(sourceExam, 'zh-Hant')
    const enExam = localizeMathExam(sourceExam, 'en')

    const zhDisplay = deriveMathMockResultDisplay(result, zhExam, 'zh-Hant')
    const enDisplay = deriveMathMockResultDisplay(result, enExam, 'en')

    expect(zhDisplay.scaleGrade).toContain('這是練習卷答對率')
    expect(enDisplay.scaleGrade).toContain('This is a practice-paper result')
    expect(zhDisplay.weakStrands).toEqual([
      zhExam.questions[0].title,
      zhExam.questions[1].title,
    ])
    expect(enDisplay.weakStrands).toEqual([
      enExam.questions[0].title,
      enExam.questions[1].title,
    ])
    expect(enDisplay.weakStrands).not.toEqual(zhDisplay.weakStrands)
    expect(result).toEqual(originalResult)
  })

  it('只保存穩定評分事實，並以目前語系推導顯示內容', () => {
    expect(source).toContain(
      'useState<MathMockScoreResult | null>(null)',
    )
    expect(source).toContain('wrongQuestionIds: wrongQIds')
    expect(source).toContain(
      'deriveMathMockResultDisplay(scoreResult, exam, locale)',
    )
    expect(source).toContain('[exam, locale, scoreResult]')
    expect(source).not.toContain('scaleGrade: scale')
    expect(source).not.toContain('weakStrands: weakList')
  })
})
