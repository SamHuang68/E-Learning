import { useState, useCallback } from 'react'
import {
  learningCoordinator,
  type LearningSubmissionPacket,
  type CognitivePipelineResponse,
} from '../../../engine/learningCoordinator'
import { type FsrsItemState, defaultFsrsItemState } from '../../../engine/fsrs'
import { type UserResponse } from '../../../engine/adaptive'
import { type TelemetryEvent } from '../../../engine/stealthAssessment'
import { type GamificationState, defaultGamificationState } from '../../../engine/gamification'
import { loadMathProgress, recordMathAnswer, saveMathProgress } from '../../utils/mathStorage'
import { CALCULUS_BADGES, type CalculusBadge } from '../data/calculusBadges'
import type { CalculusProblem } from '../types'

const RESPONSE_LIMIT = 200

function persistCoordinatorState(next: {
  theta: number
  fsrs: Record<string, FsrsItemState>
  responses: UserResponse[]
}) {
  const current = loadMathProgress()
  saveMathProgress({
    ...current,
    calculusTheta: next.theta,
    calculusFsrs: next.fsrs,
    calculusResponses: next.responses.slice(-RESPONSE_LIMIT),
  })
}

export function useCalculusLearningCoordinator() {
  const persisted = loadMathProgress()
  const [fsrsMap, setFsrsMap] = useState<Record<string, FsrsItemState>>(
    () => persisted.calculusFsrs ?? {},
  )
  const [userResponses, setUserResponses] = useState<UserResponse[]>(
    () => persisted.calculusResponses ?? [],
  )
  const [telemetries] = useState<TelemetryEvent[]>([])
  const [gameState, setGameState] = useState<GamificationState>(() => defaultGamificationState())
  const [lastPipelineResult, setLastPipelineResult] = useState<CognitivePipelineResponse | null>(null)
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<CalculusBadge[]>([])
  const [currentTheta, setCurrentTheta] = useState<number>(() => persisted.calculusTheta ?? 0)

  const handleSolveProblem = useCallback(
    async (problem: CalculusProblem, isCorrect: boolean) => {
      const packet: LearningSubmissionPacket = {
        itemId: problem.id,
        track: 'calculus',
        conceptTag: problem.conceptTag,
        userAnswer: isCorrect ? 'correct' : 'wrong',
        correctAnswer: 'correct',
        isCorrect,
        responseTimeSec: 6.0,
        itemDifficulty: problem.difficulty,
        hintsViewedCount: 0,
        optionsChangedCount: 0,
      }

      const currentFsrs = fsrsMap[problem.id] ?? defaultFsrsItemState(problem.id)

      const result = await learningCoordinator.processSubmission(
        packet,
        currentFsrs,
        userResponses,
        telemetries,
        gameState,
      )

      recordMathAnswer(problem.id, isCorrect, isCorrect ? 15 : 2)

      const nextFsrs = { ...fsrsMap, [problem.id]: result.fsrsState }
      const nextResponses: UserResponse[] = [
        ...userResponses,
        {
          itemId: problem.id,
          isCorrect,
          difficulty: problem.difficulty,
          discrimination: 1.4,
          pseudoGuessing: 0.2,
          responseTimeSec: 6.0,
        },
      ].slice(-RESPONSE_LIMIT)

      setFsrsMap(nextFsrs)
      setUserResponses(nextResponses)
      setGameState(result.gamification.currentState)
      setLastPipelineResult(result)
      setCurrentTheta(result.abilityEstimate.theta)
      persistCoordinatorState({
        theta: result.abilityEstimate.theta,
        fsrs: nextFsrs,
        responses: nextResponses,
      })

      const unlocked: CalculusBadge[] = []
      if (isCorrect) {
        if (problem.targetMode === 'tangent_secant') {
          const b = CALCULUS_BADGES.find((x) => x.id === 'badge-calc-tangent-seeker')
          if (b) unlocked.push(b)
        }
        if (problem.targetMode === 'riemann_sum') {
          const b = CALCULUS_BADGES.find((x) => x.id === 'badge-calc-riemann-master')
          if (b) unlocked.push(b)
        }
        if (problem.targetMode === 'newton_slope_field') {
          const b = CALCULUS_BADGES.find((x) => x.id === 'badge-calc-newton-hunter')
          if (b) unlocked.push(b)
        }
      }

      if (unlocked.length > 0) {
        setNewlyUnlockedBadges(unlocked)
      }

      return result
    },
    [fsrsMap, userResponses, telemetries, gameState],
  )

  const clearBadgeNotification = useCallback(() => {
    setNewlyUnlockedBadges([])
  }, [])

  return {
    handleSolveProblem,
    clearBadgeNotification,
    currentTheta,
    gameState,
    lastPipelineResult,
    newlyUnlockedBadges,
  }
}
