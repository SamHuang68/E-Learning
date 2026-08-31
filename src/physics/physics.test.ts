import { describe, it, expect, beforeEach } from 'vitest'
import {
  PHYSICS_STRAND_NAMES,
  getAllPhysicsGradeIds,
  getPhysicsGradeInfo,
  getPhysicsGradesByStage,
  getPhysicsUnit,
  getAllPhysicsUnits,
  getUnitsByPhysicsStrand,
} from './data/curriculum'
import {
  PHYSICS_SOLVING_SIGNALS,
  getPhysicsSolvingSignals,
  getPhysicsSignalsByStage,
  getPhysicsSignalsByStrand,
} from './data/solvingSignals'
import { PHYSICS_MOCK_EXAMS } from './data/mockExams'
import {
  defaultPhysicsProgress,
  recordPhysicsAnswer,
  recordPhysicsLabCompletion,
  recordPhysicsMockScore,
  clearPhysicsProgress,
} from './utils/physicsStorage'

describe('臺灣 108 課綱物理 (Physics Track) 課程架構與資料完整性測試', () => {
  it('應完整包含 6 個年級（國中 G7~G9 與高中 G10~G12）', () => {
    const gradeIds = getAllPhysicsGradeIds()
    expect(gradeIds).toHaveLength(6)
    expect(gradeIds).toEqual(['g7', 'g8', 'g9', 'g10', 'g11', 'g12'])
  })

  it('國中與高中學段年級分群應正確', () => {
    const junior = getPhysicsGradesByStage('junior')
    const senior = getPhysicsGradesByStage('senior')

    expect(junior).toEqual(['g7', 'g8', 'g9'])
    expect(senior).toEqual(['g10', 'g11', 'g12'])
  })

  it('高中物理必修與選修單元數量應完全符合 108 課綱標準 (G10: 6, G11: 7, G12: 6，共 19 單元)', () => {
    const g10 = getPhysicsGradeInfo('g10')
    const g11 = getPhysicsGradeInfo('g11')
    const g12 = getPhysicsGradeInfo('g12')

    expect(g10.units).toHaveLength(6)
    expect(g11.units).toHaveLength(7)
    expect(g12.units).toHaveLength(6)

    const seniorUnits = [...g10.units, ...g11.units, ...g12.units]
    expect(seniorUnits).toHaveLength(19)
  })

  it('國中物理單元劃分應正確 (G7: 3, G8: 4, G9: 4，共 11 單元)', () => {
    const g7 = getPhysicsGradeInfo('g7')
    const g8 = getPhysicsGradeInfo('g8')
    const g9 = getPhysicsGradeInfo('g9')

    expect(g7.units).toHaveLength(3)
    expect(g8.units).toHaveLength(4)
    expect(g9.units).toHaveLength(4)

    const allUnits = getAllPhysicsUnits()
    expect(allUnits).toHaveLength(30) // 11 (Junior) + 19 (Senior) = 30
  })

  it('五大主軸 (Strands) 定義與中文對應應完整', () => {
    const strands = Object.keys(PHYSICS_STRAND_NAMES)
    expect(strands).toEqual([
      'mechanics',
      'thermodynamics',
      'waves_optics',
      'electromagnetism',
      'modern',
    ])
    strands.forEach((s) => {
      const units = getUnitsByPhysicsStrand(s as any)
      expect(units.length).toBeGreaterThan(0)
    })
  })

  it('每個單元之核心觀念皆應包含 KaTeX 物理公式與實驗室建議', () => {
    const allUnits = getAllPhysicsUnits()
    allUnits.forEach((unit) => {
      expect(unit.title).toBeDefined()
      expect(unit.subtitle).toBeDefined()
      expect(unit.concepts.length).toBeGreaterThan(0)
      expect(unit.suggestedLab).toBeDefined()

      // 檢查觀念中是否含有 LaTeX/KaTeX 標記
      const hasFormula = unit.concepts.some((c) => c.includes('$') || c.includes('\\'))
      expect(hasFormula).toBe(true)
    })
  })

  it('所有物理題目皆應具備完整的答案、詳解、難度與 108 素養標籤', () => {
    const allUnits = getAllPhysicsUnits()
    allUnits.forEach((unit) => {
      expect(unit.questions.length).toBeGreaterThan(0)
      unit.questions.forEach((q) => {
        expect(q.id).toBeDefined()
        expect(q.title).toBeDefined()
        expect(q.question).toBeDefined()
        expect(q.answer).toBeDefined()
        expect(q.solution).toBeDefined()
        expect(q.difficulty).toBeGreaterThanOrEqual(1)
        expect(q.difficulty).toBeLessThanOrEqual(5)
        expect(q.competency).toBeDefined()

        if (q.type === 'choice' || q.type === 'multi-choice') {
          expect(q.options).toBeDefined()
          expect(q.options?.length).toBeGreaterThanOrEqual(2)
        }
      })
    })
  })

  it('可正確取得指定年級與單元資料', () => {
    const g10u4 = getPhysicsUnit('g10', 4)
    expect(g10u4).toBeDefined()
    expect(g10u4?.title).toContain('電與磁的統一')

    const g11u5 = getPhysicsUnit('g11', 5)
    expect(g11u5).toBeDefined()
    expect(g11u5?.title).toContain('萬有引力')

    const g12u6 = getPhysicsUnit('g12', 6)
    expect(g12u6).toBeDefined()
    expect(g12u6?.title).toContain('原子結構與量子近代物理')
  })
})

describe('物理 3 秒破題訊號庫 (Physics Solving Signals) 測試', () => {
  it('破題訊號庫應包含高頻解題訊號卡 (>= 15 組)', () => {
    const signals = getPhysicsSolvingSignals()
    expect(signals.length).toBeGreaterThanOrEqual(15)
  })

  it('每張訊號卡皆應包含完整關鍵特徵、秒殺口訣、第一步算式與範例', () => {
    PHYSICS_SOLVING_SIGNALS.forEach((sig) => {
      expect(sig.id).toBeDefined()
      expect(sig.gradeBand).toBeDefined()
      expect(sig.topic).toBeDefined()
      expect(sig.problemSignal).toBeDefined()
      expect(sig.threeSecondRule).toBeDefined()
      expect(sig.firstStepFormula).toBeDefined()
      expect(sig.exampleProblem.question).toBeDefined()
      expect(sig.exampleProblem.quickSolve).toBeDefined()
    })
  })

  it('能依學段與主軸正確篩選破題訊號卡', () => {
    const juniorSignals = getPhysicsSignalsByStage('junior')
    const seniorSignals = getPhysicsSignalsByStage('senior')
    expect(juniorSignals.length).toBeGreaterThan(0)
    expect(seniorSignals.length).toBeGreaterThan(0)

    const mechanicsSignals = getPhysicsSignalsByStrand('mechanics')
    expect(mechanicsSignals.length).toBeGreaterThan(0)
  })
})

describe('物理模擬試卷 (Mock Exams) 測試', () => {
  it('國中會考 (CAP)、高中學測 (GSAT) 與分科測驗 (AST) 試卷應完整存在', () => {
    expect(PHYSICS_MOCK_EXAMS.cap).toBeDefined()
    expect(PHYSICS_MOCK_EXAMS.gsat).toBeDefined()
    expect(PHYSICS_MOCK_EXAMS.ast).toBeDefined()

    expect(PHYSICS_MOCK_EXAMS.cap.questions.length).toBeGreaterThanOrEqual(4)
    expect(PHYSICS_MOCK_EXAMS.gsat.questions.length).toBeGreaterThanOrEqual(4)
    expect(PHYSICS_MOCK_EXAMS.ast.questions.length).toBeGreaterThanOrEqual(4)
  })
})

describe('物理學習進度與狀態管理 (Physics Storage) 測試', () => {
  beforeEach(() => {
    clearPhysicsProgress()
  })

  it('初始狀態應為高一必修預設值', () => {
    const initial = defaultPhysicsProgress()
    expect(initial.stage).toBe('senior')
    expect(initial.gradeId).toBe('g10')
    expect(initial.unitId).toBe(1)
    expect(initial.xp).toBe(0)
    expect(initial.completedQuestions).toEqual([])
    expect(initial.errorQuestions).toEqual([])
  })

  it('作答正確應累加 XP 並紀錄已完成題目', () => {
    const qId = 'g10_u1_q1'
    const updated = recordPhysicsAnswer(qId, true, 15)
    expect(updated.completedQuestions).toContain(qId)
    expect(updated.errorQuestions).not.toContain(qId)
    expect(updated.xp).toBe(15)
  })

  it('作答錯誤應自動收入錯題本，重新答對後應自錯題本移出', () => {
    const qId = 'g11_u2_q1'

    // 第一次答錯
    const step1 = recordPhysicsAnswer(qId, false)
    expect(step1.errorQuestions).toContain(qId)
    expect(step1.completedQuestions).not.toContain(qId)

    // 第二次答對（複習修正）
    const step2 = recordPhysicsAnswer(qId, true, 10)
    expect(step2.errorQuestions).not.toContain(qId)
    expect(step2.completedQuestions).toContain(qId)
    expect(step2.xp).toBe(10)
  })

  it('記錄實驗室完成狀態應發放 XP 並標記完成', () => {
    const labId = 'lab-faraday-induction'
    const updated = recordPhysicsLabCompletion(labId, 25)
    expect(updated.labCompleted).toContain(labId)
    expect(updated.xp).toBe(25)
  })

  it('記錄模擬考成績應正確累加經驗值與登記分數', () => {
    const state = recordPhysicsMockScore('gsat', 88)
    expect(state.examScores.gsat).toBe(88)
    expect(state.xp).toBe(44) // Math.round(88 / 2)
  })
})
