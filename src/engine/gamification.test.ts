import { describe, it, expect } from 'vitest'
import {
  calculateLevel,
  calculateLevelProgress,
  calculateQuestionXp,
  recordAnswerGamification,
  defaultGamificationState,
} from './gamification'
import { computeMathRadar, computeAobaRadar, computeToeicRadar } from './radar'

describe('Gamification & Radar Engine', () => {
  describe('Gamification Calculations', () => {
    it('calculates player levels with non-linear XP thresholds', () => {
      expect(calculateLevel(0)).toBe(1)
      expect(calculateLevel(24)).toBe(1)
      expect(calculateLevel(25)).toBe(2)
      expect(calculateLevel(100)).toBe(3)
      expect(calculateLevel(400)).toBe(5)
    })

    it('calculates level progress percentage', () => {
      const progress = calculateLevelProgress(50)
      expect(progress.currentLevel).toBe(2)
      expect(progress.levelStartXP).toBe(25)
      expect(progress.nextLevelXP).toBe(100)
      expect(progress.progressPct).toBe(33)
    })

    it('rewards higher XP for harder questions and combo multipliers', () => {
      const easyNoCombo = calculateQuestionXp('easy', true, 1)
      const challengeCombo10 = calculateQuestionXp('challenge', true, 10)

      expect(easyNoCombo.xpEarned).toBe(10)
      expect(challengeCombo10.multiplier).toBe(2.0)
      expect(challengeCombo10.xpEarned).toBe(100) // 50 * 2.0
    })

    it('records correct answers, increments combo, and unlocks first-step badge', () => {
      const state = defaultGamificationState()
      const result = recordAnswerGamification(state, 'medium', true)

      expect(result.nextState.currentCombo).toBe(1)
      expect(result.nextState.totalXp).toBe(20)
      expect(result.newBadges.some((b) => b.id === 'badge-first-step')).toBe(true)
    })

    it('resets combo on incorrect answer but still grants participation XP', () => {
      const state = { ...defaultGamificationState(), currentCombo: 5 }
      const result = recordAnswerGamification(state, 'medium', false)

      expect(result.nextState.currentCombo).toBe(0)
      expect(result.xpEarned).toBe(2)
    })
  })

  describe('Multi-dimensional Knowledge Radar', () => {
    it('computes math radar dimensions and identifies strong/weak areas', () => {
      const radar = computeMathRadar(['q1', 'q2', 'q3'], { 'mock-1': 85 }, ['blocks', 'pythagoras'])
      expect(radar.track).toBe('math')
      expect(radar.dimensions.length).toBe(5)
      expect(radar.averageScore).toBeGreaterThan(30)
      expect(radar.strongestDimension).toBeTruthy()
      expect(radar.weakestDimension).toBeTruthy()
    })

    it('computes Japanese and TOEIC radar dimensions properly', () => {
      const jaRadar = computeAobaRadar(15, 10, 5, 7)
      expect(jaRadar.dimensions.length).toBe(5)
      expect(jaRadar.dimensions.find((d) => d.key === 'kana')?.score).toBeGreaterThan(60)

      const toeicRadar = computeToeicRadar(20, 8, 750)
      expect(toeicRadar.dimensions.length).toBe(5)
      expect(toeicRadar.averageScore).toBeGreaterThan(50)
    })

    it('contains valid badges across all 7 tracks plus universal', async () => {
      const { BADGE_CATALOG } = await import('./gamification')
      expect(BADGE_CATALOG.length).toBeGreaterThanOrEqual(20)
      const categories = new Set(BADGE_CATALOG.map((b) => b.category))
      expect(categories.has('universal')).toBe(true)
      expect(categories.has('math')).toBe(true)
      expect(categories.has('calculus')).toBe(true)
      expect(categories.has('physics')).toBe(true)
      expect(categories.has('chemistry')).toBe(true)
      expect(categories.has('ja')).toBe(true)
      expect(categories.has('en')).toBe(true)
      expect(categories.has('zh')).toBe(true)
    })
  })
})
