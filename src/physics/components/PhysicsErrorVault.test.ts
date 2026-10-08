import { describe, expect, it } from 'vitest'
import { getAllPhysicsUnits, getPhysicsUnit } from '../data/curriculum'
import { PHYSICS_MOCK_EXAMS } from '../data/mockExams'
import { resolvePhysicsLab } from './physicsErrorVaultLabResolver'

describe('物理錯題本實驗室關聯', () => {
  it('直尺最小刻度題不得連到浮力或拋體實驗室', () => {
    const measurementUnit = getPhysicsUnit('g7', 1)
    const rulerQuestion = measurementUnit?.questions.find((question) => question.id === 'g7_u1_q1')

    expect(rulerQuestion).toBeDefined()
    expect(resolvePhysicsLab(rulerQuestion!, measurementUnit?.suggestedLab)).toBeUndefined()
  })

  it('密度與浮力題仍應連到阿基米德實驗室', () => {
    const densityUnit = getPhysicsUnit('g7', 2)
    const densityQuestion = densityUnit?.questions[0]

    expect(densityQuestion).toBeDefined()
    expect(resolvePhysicsLab(densityQuestion!, densityUnit?.suggestedLab)?.id).toBe('buoyancy')
  })

  it('不接受只含有實驗室關鍵字、但不在明確契約中的提示 ID', () => {
    const measurementUnit = getPhysicsUnit('g7', 1)
    const rulerQuestion = measurementUnit?.questions.find((question) => question.id === 'g7_u1_q1')

    expect(rulerQuestion).toBeDefined()
    for (const unsupportedHint of [
      'unsupported-density-analysis',
      'not-a-circuit-lab',
      'future-optics-topic',
    ]) {
      expect(resolvePhysicsLab(rulerQuestion!, unsupportedHint), unsupportedHint).toBeUndefined()
    }
  })

  it('逐題依單元的明確實驗室契約連結，其餘單元 fail-closed', () => {
    const expectedBySuggestedLab: Record<string, string> = {
      'lab-projectile-motion': 'projectile',
      'lab-shm-oscillation': 'shm',
      'lab-j8-lens-optics': 'optics',
      'lab-j9-circuit-magnetism': 'circuit',
      'lab-kirchhoff-circuit': 'circuit',
      'lab-j7-density': 'buoyancy',
      'lab-j8-buoyancy-pressure': 'buoyancy',
    }

    for (const unit of getAllPhysicsUnits()) {
      const expected = unit.suggestedLab
        ? expectedBySuggestedLab[unit.suggestedLab]
        : undefined
      for (const question of unit.questions) {
        expect(
          resolvePhysicsLab(question, unit.suggestedLab)?.id,
          `${question.id}:${unit.suggestedLab}`,
        ).toBe(expected)
      }
    }
  })

  it('模擬考只在題幹有專有主題證據時連結實驗室', () => {
    const expectedByQuestion: Record<string, string | undefined> = {
      mock_cap_q1: 'buoyancy',
      mock_cap_q2: undefined,
      mock_cap_q3: 'optics',
      mock_cap_q4: undefined,
      mock_cap_q5: 'circuit',
      mock_gsat_q1: undefined,
      mock_gsat_q2: undefined,
      mock_gsat_q3: undefined,
      mock_gsat_q4: undefined,
      mock_ast_q1: undefined,
      mock_ast_q2: undefined,
      mock_ast_q3: undefined,
      mock_ast_q4: 'shm',
    }

    for (const question of Object.values(PHYSICS_MOCK_EXAMS).flatMap((exam) => exam.questions)) {
      expect(resolvePhysicsLab(question)?.id, question.id).toBe(expectedByQuestion[question.id])
    }
  })
})
