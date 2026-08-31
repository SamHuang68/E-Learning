import { describe, it, expect } from 'vitest'
import { PHYSICS_SOLVING_SIGNALS } from './data/solvingSignals'
import { CHEMISTRY_SOLVING_SIGNALS } from '../chemistry/data/solvingSignals'

describe('3秒破題訊號卡與翻轉測驗模式 (Signals & Quick Drill) 資料完整性測試', () => {
  it('物理破題訊號庫應包含 19 組國中與高中訊號', () => {
    expect(PHYSICS_SOLVING_SIGNALS).toHaveLength(19)
    const junior = PHYSICS_SOLVING_SIGNALS.filter((s) => s.stage === 'junior')
    const senior = PHYSICS_SOLVING_SIGNALS.filter((s) => s.stage === 'senior')
    expect(junior).toHaveLength(4)
    expect(senior).toHaveLength(15)
  })

  it('化學破題訊號庫應包含 15 組國中與高中訊號', () => {
    expect(CHEMISTRY_SOLVING_SIGNALS).toHaveLength(15)
    const junior = CHEMISTRY_SOLVING_SIGNALS.filter((s) => s.stage === 'junior')
    const senior = CHEMISTRY_SOLVING_SIGNALS.filter((s) => s.stage === 'senior')
    expect(junior).toHaveLength(3)
    expect(senior).toHaveLength(12)
  })

  it('物理與化學 34 組訊號卡皆具備完整必備欄位', () => {
    const allSignals = [...PHYSICS_SOLVING_SIGNALS, ...CHEMISTRY_SOLVING_SIGNALS]
    expect(allSignals).toHaveLength(34)

    allSignals.forEach((sig) => {
      expect(sig.id).toBeTruthy()
      expect(sig.topic).toBeTruthy()
      expect(sig.gradeBand).toBeTruthy()
      expect(sig.problemSignal).toBeTruthy()
      expect(sig.threeSecondRule).toBeTruthy()
      expect(sig.firstStepFormula).toBeTruthy()
      expect(sig.exampleProblem.question).toBeTruthy()
      expect(sig.exampleProblem.quickSolve).toBeTruthy()
    })
  })
})
