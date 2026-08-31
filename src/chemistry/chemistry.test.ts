import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAllChemistryGradeIds,
  getChemistryGradesByStage,
  getChemistryGradeInfo,
  getChemistryGradeUnit,
  getAllChemistryUnits,
} from './data/curriculum'
import { G10_CHEMISTRY_UNITS } from './data/g10'
import { G11_CHEMISTRY_UNITS } from './data/g11'
import { G12_CHEMISTRY_UNITS } from './data/g12'
import { CHEMISTRY_SOLVING_SIGNALS } from './data/solvingSignals'
import { CHEMISTRY_MOCK_EXAMS } from './data/mockExams'
import {
  PERIODIC_TABLE_ELEMENTS,
  VSEPR_SHAPES,
  SOLUBILITY_RULES,
} from './data/interactiveTools'
import {
  defaultChemistryProgress,
  loadChemistryProgress,
  recordChemistryAnswer,
  recordChemistryLabCompletion,
  recordChemistryMockScore,
  toggleBookmarkChemistrySignal,
  resetChemistryProgress,
} from './utils/chemistryStorage'

describe('臺灣 108 課綱化學 (Chemistry Track) 課程架構完整性測試', () => {
  it('應完整包含 6 個年級（國中 G7~G9、高中 G10~G12）', () => {
    const gradeIds = getAllChemistryGradeIds()
    expect(gradeIds).toHaveLength(6)
    expect(gradeIds).toEqual(['g7', 'g8', 'g9', 'g10', 'g11', 'g12'])
  })

  it('國中與高中學段年級分群應完全正確', () => {
    const juniorGrades = getChemistryGradesByStage('junior')
    const seniorGrades = getChemistryGradesByStage('senior')

    expect(juniorGrades).toEqual(['g7', 'g8', 'g9'])
    expect(seniorGrades).toEqual(['g10', 'g11', 'g12'])
  })

  it('高中三年應精確包含：G10 必修 6 單元、G11 選修 5 單元、G12 選修 6 單元 (共 17 單元)', () => {
    expect(G10_CHEMISTRY_UNITS).toHaveLength(6)
    expect(G11_CHEMISTRY_UNITS).toHaveLength(5)
    expect(G12_CHEMISTRY_UNITS).toHaveLength(6)

    const seniorUnits = [
      ...G10_CHEMISTRY_UNITS,
      ...G11_CHEMISTRY_UNITS,
      ...G12_CHEMISTRY_UNITS,
    ]
    expect(seniorUnits).toHaveLength(17)
  })

  it('所有單元皆應包含有效概念 (含 KaTeX 公式)、建議探究實驗與合規題目', () => {
    const allUnits = getAllChemistryUnits()
    expect(allUnits.length).toBeGreaterThanOrEqual(26)

    allUnits.forEach((unit) => {
      expect(unit.id).toBeDefined()
      expect(unit.title).toBeTruthy()
      expect(unit.subtitle).toBeTruthy()
      expect(unit.strand).toBeTruthy()
      expect(unit.band).toBeTruthy()
      expect(unit.targetExam).toBeTruthy()
      expect(unit.concepts.length).toBeGreaterThan(0)
      expect(unit.suggestedLab).toBeTruthy()
      expect(unit.questions.length).toBeGreaterThan(0)

      // 檢查概念中是否含有 KaTeX 或化學式符號
      const hasFormulas = unit.concepts.some(
        (c) => c.includes('$') || c.includes('\\') || c.includes('->') || c.includes('→'),
      )
      expect(hasFormulas).toBe(true)

      // 檢查每道題目結構
      unit.questions.forEach((q) => {
        expect(q.id).toBeTruthy()
        expect(q.title).toBeTruthy()
        expect(q.question).toBeTruthy()
        expect(q.solution).toBeTruthy()
        expect(q.difficulty).toBeGreaterThanOrEqual(1)
        expect(q.difficulty).toBeLessThanOrEqual(5)

        if (q.type === 'choice' || q.type === 'multi-choice') {
          expect(q.options).toBeDefined()
          expect(q.options!.length).toBeGreaterThanOrEqual(3)
        }
      })
    })
  })

  it('能正確索引指定年級與單元資料', () => {
    const g10 = getChemistryGradeInfo('g10')
    expect(g10.name).toContain('必修化學')
    expect(g10.targetExam).toBe('學科能力測驗 (GSAT)')

    const g10u4 = getChemistryGradeUnit('g10', 4)
    expect(g10u4.title).toContain('化學反應式與化學計量')

    const g11u10 = getChemistryGradeUnit('g11', 10)
    expect(g11u10.title).toContain('化學反應速率與動力學')

    const g12u15 = getChemistryGradeUnit('g12', 15)
    expect(g12u15.title).toContain('氧化還原與電化學電池')
  })
})

describe('化學 3 秒破題訊號庫 (Chemistry Solving Signals) 測試', () => {
  it('應完整包含 15 組高頻解題訊號卡', () => {
    expect(CHEMISTRY_SOLVING_SIGNALS.length).toBe(15)
  })

  it('每張訊號卡皆應具備特徵訊號、口訣、第一步算式與秒殺範例', () => {
    CHEMISTRY_SOLVING_SIGNALS.forEach((sig) => {
      expect(sig.id).toBeTruthy()
      expect(sig.topic).toBeTruthy()
      expect(sig.problemSignal).toBeTruthy()
      expect(sig.threeSecondRule).toBeTruthy()
      expect(sig.firstStepFormula).toBeTruthy()
      expect(sig.exampleProblem.question).toBeTruthy()
      expect(sig.exampleProblem.quickSolve).toBeTruthy()
    })
  })
})

describe('化學模擬試卷庫 (Mock Exams) 測試', () => {
  it('國中會考 (CAP)、高中學測 (GSAT)、高中分科測驗 (AST) 試卷應完整齊備', () => {
    expect(CHEMISTRY_MOCK_EXAMS.cap).toBeDefined()
    expect(CHEMISTRY_MOCK_EXAMS.gsat).toBeDefined()
    expect(CHEMISTRY_MOCK_EXAMS.ast).toBeDefined()

    expect(CHEMISTRY_MOCK_EXAMS.cap.questions.length).toBeGreaterThanOrEqual(4)
    expect(CHEMISTRY_MOCK_EXAMS.gsat.questions.length).toBeGreaterThanOrEqual(3)
    expect(CHEMISTRY_MOCK_EXAMS.ast.questions.length).toBeGreaterThanOrEqual(3)
  })
})

describe('化學實用教具資料庫 (Periodic Table & VSEPR) 測試', () => {
  it('元素週期表應包含 1~36 號完整元素與電子組態', () => {
    expect(PERIODIC_TABLE_ELEMENTS).toHaveLength(36)
    const carbon = PERIODIC_TABLE_ELEMENTS.find((e) => e.symbol === 'C')
    expect(carbon).toBeDefined()
    expect(carbon!.nameZh).toBe('碳')
    expect(carbon!.atomicMass).toBeCloseTo(12.011, 2)
  })

  it('VSEPR 構型庫應包含常見幾何構型與混成軌域', () => {
    expect(VSEPR_SHAPES.length).toBeGreaterThanOrEqual(10)
    const tetrahedral = VSEPR_SHAPES.find((s) => s.formulaType === 'AX4')
    expect(tetrahedral).toBeDefined()
    expect(tetrahedral!.hybridization).toBe('sp³')
    expect(tetrahedral!.geometryZh).toBe('正四面體')
  })

  it('沉澱溶解度規則表應包含常見離子與沉澱特徵', () => {
    expect(SOLUBILITY_RULES.length).toBeGreaterThanOrEqual(5)
  })
})

describe('化學學習進度與狀態管理 (Chemistry Storage) 測試', () => {
  beforeEach(() => {
    resetChemistryProgress()
  })

  it('初始狀態應為預設值', () => {
    const initial = defaultChemistryProgress()
    expect(initial.stage).toBe('senior')
    expect(initial.gradeId).toBe('g10')
    expect(initial.xp).toBe(0)
    expect(initial.completedQuestions).toEqual([])
    expect(initial.errorQuestions).toEqual([])
  })

  it('作答正確應累加 XP 並紀錄已完成題目', () => {
    const qId = 'g10_u1_q1'
    const updated = recordChemistryAnswer(qId, true, 10)
    expect(updated.completedQuestions).toContain(qId)
    expect(updated.errorQuestions).not.toContain(qId)
    expect(updated.xp).toBe(10)
  })

  it('作答錯誤應自動收入錯題本且不增加 XP', () => {
    const qId = 'g11_u7_q1'
    const updated = recordChemistryAnswer(qId, false, 10)
    expect(updated.errorQuestions).toContain(qId)
    expect(updated.completedQuestions).not.toContain(qId)
    expect(updated.xp).toBe(0)
  })

  it('錯題再次答對後應自錯題本移除並加入完成清單', () => {
    const qId = 'g12_u12_q1'
    recordChemistryAnswer(qId, false)
    const errState = loadChemistryProgress()
    expect(errState.errorQuestions).toContain(qId)

    const fixedState = recordChemistryAnswer(qId, true, 5)
    expect(fixedState.errorQuestions).not.toContain(qId)
    expect(fixedState.completedQuestions).toContain(qId)
    expect(fixedState.xp).toBe(5)
  })

  it('完成實驗探究應正確累加 XP 並紀錄完成清單', () => {
    const labId = 'lab_g10_chromatography'
    const updated = recordChemistryLabCompletion(labId, 25)
    expect(updated.labCompleted).toContain(labId)
    expect(updated.xp).toBe(25)
  })

  it('紀錄模擬考成績應更新最佳得分與 XP', () => {
    const examId = 'exam_gsat_chemistry'
    const updated = recordChemistryMockScore(examId, 80)
    expect(updated.examScores[examId]).toBe(80)
    expect(updated.xp).toBe(40)
  })

  it('切換收藏訊號卡狀態應正常運作', () => {
    const sigId = 'sig-density-molarity'
    const s1 = toggleBookmarkChemistrySignal(sigId)
    expect(s1.bookmarkedSignals).toContain(sigId)

    const s2 = toggleBookmarkChemistrySignal(sigId)
    expect(s2.bookmarkedSignals).not.toContain(sigId)
  })
})

describe('化學錯題筆記本 (Chemistry Error Vault) 雙軌題庫檢索與實驗室智慧導航測試', () => {
  it('單元題庫與大考模擬考題目應能被完整納入錯題檢索池', () => {
    const allUnits = getAllChemistryUnits()
    const allMockExams = Object.values(CHEMISTRY_MOCK_EXAMS)

    const unitQIds = allUnits.flatMap((u) => u.questions.map((q) => q.id))
    const mockQIds = allMockExams.flatMap((e) => e.questions.map((q) => q.id))

    expect(unitQIds.length).toBeGreaterThan(0)
    expect(mockQIds.length).toBeGreaterThan(0)

    // 驗證會考、學測與分科測驗化學錯題 ID 能被檢索
    expect(mockQIds).toContain('cap_q1')
    expect(mockQIds).toContain('gsat_q1')
    expect(mockQIds).toContain('ast_q1')
  })
})

