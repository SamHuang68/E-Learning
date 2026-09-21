import { describe, expect, it } from 'vitest'
import {
  exerciseToIrtRoutingItem,
  normalizePracticeDifficultyTag,
  practiceDifficultyIrtHint,
} from './practiceDifficulty'
import { selectNextAdaptiveItem } from './adaptive'

describe('practice difficulty tags (teaching metadata)', () => {
  it('maps register and kind to intro/core/stretch without claiming an exam score', () => {
    expect(normalizePracticeDifficultyTag('casual', 'recognize')).toBe('intro')
    expect(normalizePracticeDifficultyTag('business', 'fillBlank')).toBe('core')
    expect(normalizePracticeDifficultyTag('sonkeigo', 'recognize')).toBe('stretch')
    expect(normalizePracticeDifficultyTag('polite', 'passageQuiz')).toBe('core')
    expect(normalizePracticeDifficultyTag('business', 'orderWords')).toBe('stretch')
  })

  it('uses coarse IRT hints only for routing order, not as ability scores', () => {
    expect(practiceDifficultyIrtHint('intro')).toBe(-1)
    expect(practiceDifficultyIrtHint('core')).toBe(0)
    expect(practiceDifficultyIrtHint('stretch')).toBe(1)
    const pool = [
      exerciseToIrtRoutingItem({ id: 'easy', difficultyTag: 'intro' }),
      exerciseToIrtRoutingItem({ id: 'hard', difficultyTag: 'stretch' }),
    ]
    const next = selectNextAdaptiveItem(pool, -1, new Set())
    expect(next?.id).toBe('easy')
    expect(next?.difficulty).toBe(-1)
  })
})
