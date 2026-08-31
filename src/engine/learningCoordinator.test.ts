import { describe, it, expect } from 'vitest'
import {
  LearningCoordinator,
  type UniversalExerciseItem,
  type LearningSubmissionPacket,
} from './learningCoordinator'
import { defaultFsrsItemState } from './fsrs'
import { defaultGamificationState } from './gamification'

describe('LearningCoordinator (Unified Cognitive Facade)', () => {
  const coordinator = new LearningCoordinator()

  it('recommends next adaptive item based on learner ability', () => {
    const pool: UniversalExerciseItem[] = [
      { id: 'm1', track: 'math', topic: '幾何', prompt: '題目1', answer: 'A', difficulty: -1.0 },
      { id: 'm2', track: 'math', topic: '代數', prompt: '題目2', answer: 'B', difficulty: 0.5 },
      { id: 'm3', track: 'math', topic: '微積分', prompt: '題目3', answer: 'C', difficulty: 2.0 },
    ]

    const item = coordinator.recommendNextItem(pool, 0.4, new Set())
    expect(item?.id).toBe('m2')
  })

  it('processes correct submission updating FSRS, IRT, ECD, and Gamification', async () => {
    const packet: LearningSubmissionPacket = {
      itemId: 'q-correct',
      track: 'math',
      conceptTag: 'algebra',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      responseTimeSec: 4.5,
      itemDifficulty: 0.5,
      hintsViewedCount: 0,
      optionsChangedCount: 0,
    }

    const fsrs = defaultFsrsItemState('q-correct')
    const gameState = defaultGamificationState()

    const result = await coordinator.processSubmission(packet, fsrs, [], [], gameState)

    expect(result.diagnosis).toBeUndefined()
    expect(result.fsrsState.reps).toBe(1)
    expect(result.fsrsState.stability).toBeGreaterThan(0)
    expect(result.abilityEstimate.theta).toBeGreaterThanOrEqual(0)
    expect(result.stealthProfile.efficiency).toBeGreaterThanOrEqual(50)
    expect(result.gamification.xpEarned).toBeGreaterThan(0)
    expect(result.nextAction.actionType).toBe('continue_adaptive')
  })

  it('processes incorrect submission with misconception directing to lab', async () => {
    const packet: LearningSubmissionPacket = {
      itemId: 'q-wrong',
      track: 'ja',
      conceptTag: 'keigo_direction',
      userAnswer: 'kudasai',
      correctAnswer: 'itadaku',
      isCorrect: false,
      responseTimeSec: 6.0,
      itemDifficulty: 0.8,
      distractorCategory: 'direction_error',
      hintsViewedCount: 1,
      optionsChangedCount: 2,
    }

    const fsrs = defaultFsrsItemState('q-wrong')
    const gameState = defaultGamificationState()

    const result = await coordinator.processSubmission(packet, fsrs, [], [], gameState)

    expect(result.diagnosis).toBeDefined()
    expect(result.diagnosis?.errorType).toBe('misconception')
    expect(result.nextAction.actionType).toBe('open_lab')
    expect(result.nextAction.recommendedLabId).toBe('keigo_direction')
  })

  it('calculates track radars properly', () => {
    const radar = coordinator.refreshTrackRadar('math', {
      completedQuestions: ['q1', 'q2'],
      examScores: { mock1: 90 },
      labCompleted: ['blocks'],
    })

    expect(radar.track).toBe('math')
    expect(radar.dimensions.length).toBe(5)
  })
})
