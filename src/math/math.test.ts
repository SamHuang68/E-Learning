import { describe, it, expect } from 'vitest'
import { ALL_MATH_GRADES, getGradeInfo, getGradeUnit, getGradesInStage } from './data/gradeStore'
import { MOCK_EXAMS } from './data/mockExams'
import { recordMathAnswer, defaultMathProgress } from './utils/mathStorage'

describe('臺灣 108 課綱 K-12 數學課程架構與資料完整性測試', () => {
  it('應完整包含 12 個年級（國小 G1~G6、國中 G7~G9、高中 G10~G12）', () => {
    const gradeIds = Object.keys(ALL_MATH_GRADES)
    expect(gradeIds).toHaveLength(12)
    expect(gradeIds).toEqual([
      'g1', 'g2', 'g3', 'g4', 'g5', 'g6',
      'g7', 'g8', 'g9',
      'g10', 'g11', 'g12'
    ])
  })

  it('國小、國中、高中各學段年級分群應正確', () => {
    const elem = getGradesInStage('elementary')
    const junior = getGradesInStage('junior')
    const senior = getGradesInStage('senior')

    expect(elem).toHaveLength(6)
    expect(junior).toHaveLength(3)
    expect(senior).toHaveLength(3)
  })

  it('每個年級的單元與題目皆應具備有效的題目、答案與詳解', () => {
    Object.values(ALL_MATH_GRADES).forEach((grade) => {
      expect(grade.units.length).toBeGreaterThan(0)
      grade.units.forEach((unit) => {
        expect(unit.title).toBeDefined()
        expect(unit.questions.length).toBeGreaterThan(0)
        unit.questions.forEach((q) => {
          expect(q.id).toBeDefined()
          expect(q.question).toBeDefined()
          expect(q.answer).toBeDefined()
          expect(q.solution).toBeDefined()
          expect(q.difficulty).toBeGreaterThanOrEqual(1)
          expect(q.difficulty).toBeLessThanOrEqual(5)
        })
      })
    })
  })

  it('能正確取得指定年級與單元資料', () => {
    const g7 = getGradeInfo('g7')
    expect(g7.name).toContain('七年級')

    const g7u2 = getGradeUnit('g7', 2)
    expect(g7u2.title).toContain('一元一次方程式')
  })
})

describe('模擬考模組 (Mock Exams) 測試', () => {
  it('國小學力、國中會考與高中學測考卷應完整存在', () => {
    expect(MOCK_EXAMS.elementary).toBeDefined()
    expect(MOCK_EXAMS.cap).toBeDefined()
    expect(MOCK_EXAMS.gsat).toBeDefined()

    expect(MOCK_EXAMS.cap.questions.length).toBeGreaterThanOrEqual(5)
    expect(MOCK_EXAMS.gsat.questions.length).toBeGreaterThanOrEqual(4)
  })

  it('作答紀錄與錯題本收入機制運作正常', () => {
    const p2 = recordMathAnswer('g7_u1_q1', false)
    expect(p2.errorQuestions).toContain('g7_u1_q1')

    const p3 = recordMathAnswer('g7_u1_q1', true)
    expect(p3.errorQuestions).not.toContain('g7_u1_q1')
    expect(p3.completedQuestions).toContain('g7_u1_q1')
  })
})

describe('數學進度與作答紀錄 (Math Storage) 測試', () => {
  it('初始狀態應為預設值', () => {
    const initial = defaultMathProgress()
    expect(initial.stage).toBe('elementary')
    expect(initial.gradeId).toBe('g1')
    expect(initial.xp).toBeGreaterThanOrEqual(0)
  })

  it('作答正確應累加 XP 並紀錄已完成題目', () => {
    const qId = 'g1-1-1'
    const updated = recordMathAnswer(qId, true, 5)
    expect(updated.completedQuestions).toContain(qId)
    expect(updated.errorQuestions).not.toContain(qId)
    expect(updated.xp).toBeGreaterThanOrEqual(5)
  })

  it('作答錯誤應自動收入錯題清單', () => {
    const qId = 'g8-2-1'
    const updated = recordMathAnswer(qId, false)
    expect(updated.errorQuestions).toContain(qId)
  })
})
