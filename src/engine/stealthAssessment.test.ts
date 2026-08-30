import { describe, it, expect } from 'vitest'
import {
  computeStealthAssessment,
  type TelemetryEvent,
} from './stealthAssessment'

describe('ECD Stealth Assessment Engine', () => {
  it('handles empty event logs with neutral default profile', () => {
    const profile = computeStealthAssessment([])
    expect(profile.grit).toBe(60)
    expect(profile.exploration).toBe(60)
    expect(profile.compositeIndex).toBe(60)
    expect(profile.learningPersona).toContain('探索者')
  })

  it('rewards high grit for retrying after errors instead of giving up', () => {
    const persistentEvents: TelemetryEvent[] = [
      { actionType: 'answer_submit', isCorrect: false, timeSpentSec: 8 },
      { actionType: 'error_retry', timeSpentSec: 5 },
      { actionType: 'answer_submit', isCorrect: true, timeSpentSec: 6 },
      { actionType: 'answer_submit', isCorrect: false, timeSpentSec: 10 },
      { actionType: 'error_retry', timeSpentSec: 4 },
      { actionType: 'answer_submit', isCorrect: true, timeSpentSec: 7 },
    ]

    const profile = computeStealthAssessment(persistentEvents)
    expect(profile.grit).toBeGreaterThanOrEqual(80)
    expect(profile.strengths.length).toBeGreaterThan(0)
  })

  it('rewards high exploration for active manipulative interactions', () => {
    const labEvents: TelemetryEvent[] = [
      { actionType: 'lab_interaction', sliderManipulationsCount: 15, timeSpentSec: 60 },
      { actionType: 'lab_interaction', sliderManipulationsCount: 10, timeSpentSec: 45 },
    ]

    const profile = computeStealthAssessment(labEvents)
    expect(profile.exploration).toBeGreaterThanOrEqual(80)
  })

  it('identifies agile/efficient learners with fast, accurate answers', () => {
    const agileEvents: TelemetryEvent[] = Array.from({ length: 6 }).map((_, i) => ({
      actionType: 'answer_submit',
      isCorrect: true,
      timeSpentSec: 5.0 + (i % 3),
    }))

    const profile = computeStealthAssessment(agileEvents)
    expect(profile.efficiency).toBeGreaterThanOrEqual(85)
    expect(profile.learningPersona).toContain('敏捷')
  })
})
