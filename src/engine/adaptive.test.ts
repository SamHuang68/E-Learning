import { describe, it, expect } from 'vitest'
import {
  calculateProbabilityOfCorrect,
  calculateFisherInformation,
  estimateAbilityTheta,
  selectNextAdaptiveItem,
  shouldTerminateCat,
  type IrtItem,
  type UserResponse,
} from './adaptive'

describe('2PL IRT & Adaptive Testing (CAT) Engine', () => {
  it('calculates probability of correct answer increasing with ability theta', () => {
    const diff = 0.0 // 中等難度題目
    const pLow = calculateProbabilityOfCorrect(-1.5, diff)
    const pMed = calculateProbabilityOfCorrect(0.0, diff)
    const pHigh = calculateProbabilityOfCorrect(1.5, diff)

    expect(pLow).toBeLessThan(pMed)
    expect(pMed).toBeLessThan(pHigh)
    expect(pMed).toBeGreaterThan(0.5)
    expect(pLow).toBeGreaterThanOrEqual(0.25) // 不低於猜測率 c=0.25
  })

  it('calculates Fisher Information peaking near theta = difficulty', () => {
    const diff = 1.0
    const infoAtDiff = calculateFisherInformation(1.0, diff)
    const infoFar = calculateFisherInformation(-2.0, diff)

    expect(infoAtDiff).toBeGreaterThan(infoFar)
    expect(infoAtDiff).toBeGreaterThan(0.5)
  })

  it('updates ability theta upward for correct responses and downward for incorrect', () => {
    const correctResponses: UserResponse[] = [
      { itemId: 'q1', isCorrect: true, difficulty: 0.0, discrimination: 1.2, pseudoGuessing: 0.25 },
      { itemId: 'q2', isCorrect: true, difficulty: 0.5, discrimination: 1.2, pseudoGuessing: 0.25 },
      { itemId: 'q3', isCorrect: true, difficulty: 1.0, discrimination: 1.2, pseudoGuessing: 0.25 },
    ]
    const highEstimate = estimateAbilityTheta(correctResponses)
    expect(highEstimate.theta).toBeGreaterThan(0.5)
    expect(highEstimate.standardError).toBeLessThan(1.0)

    const wrongResponses: UserResponse[] = [
      { itemId: 'q1', isCorrect: false, difficulty: 0.0, discrimination: 1.2, pseudoGuessing: 0.25 },
      { itemId: 'q2', isCorrect: false, difficulty: -0.5, discrimination: 1.2, pseudoGuessing: 0.25 },
      { itemId: 'q3', isCorrect: false, difficulty: -1.0, discrimination: 1.2, pseudoGuessing: 0.25 },
    ]
    const lowEstimate = estimateAbilityTheta(wrongResponses)
    expect(lowEstimate.theta).toBeLessThan(-0.5)
  })

  it('selects the best adaptive item matching the learners current ability', () => {
    const itemPool: IrtItem[] = [
      { id: 'easy-1', difficulty: -2.0 },
      { id: 'mid-1', difficulty: 0.2 },
      { id: 'hard-1', difficulty: 2.5 },
    ]

    const answered = new Set<string>()
    // 對能力值 theta = 0.0 的學習者，自適應選題應選中等難度的 mid-1
    const selected = selectNextAdaptiveItem(itemPool, 0.0, answered)
    expect(selected?.id).toBe('mid-1')

    // 答對 mid-1 後，能力上升至 theta = 2.0，下一題應選 hard-1
    answered.add('mid-1')
    const nextSelected = selectNextAdaptiveItem(itemPool, 2.0, answered)
    expect(nextSelected?.id).toBe('hard-1')
  })

  it('determines CAT termination properly on min items and target standard error', () => {
    const responses: UserResponse[] = Array.from({ length: 5 }).map((_, i) => ({
      itemId: `q-${i}`,
      isCorrect: true,
      difficulty: i * 0.3,
      discrimination: 1.2,
      pseudoGuessing: 0.25,
    }))

    const initialEstimate = estimateAbilityTheta(responses)
    // 少於 minItems (6) 時不應終止
    expect(shouldTerminateCat(responses, initialEstimate, 6, 15, 0.35)).toBe(false)

    // 超過 15 題強制終止
    const longResponses: UserResponse[] = Array.from({ length: 15 }).map((_, i) => ({
      itemId: `q-${i}`,
      isCorrect: true,
      difficulty: 0.5,
      discrimination: 1.2,
      pseudoGuessing: 0.25,
    }))
    const longEstimate = estimateAbilityTheta(longResponses)
    expect(shouldTerminateCat(longResponses, longEstimate, 6, 15, 0.35)).toBe(true)
  })
})
