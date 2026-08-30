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
import { recordMathAnswer } from '../../utils/mathStorage'
import { CALCULUS_BADGES, type CalculusBadge } from '../data/calculusBadges'
import type { CalculusProblem } from '../types'

export function useCalculusLearningCoordinator() {
  const [fsrsMap, setFsrsMap] = useState<Record<string, FsrsItemState>>({})
  const [userResponses, setUserResponses] = useState<UserResponse[]>([])
  const [telemetries] = useState<TelemetryEvent[]>([])
  const [gameState, setGameState] = useState<GamificationState>(() => defaultGamificationState())
  const [lastPipelineResult, setLastPipelineResult] = useState<CognitivePipelineResponse | null>(null)
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<CalculusBadge[]>([])
  const [currentTheta, setCurrentTheta] = useState<number>(0.0)

  const handleSolveProblem = useCallback(
    async (problem: CalculusProblem, isCorrect: boolean) => {
      const packet: LearningSubmissionPacket = {
        itemId: problem.id,
        track: 'math',
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

      // 同步全域數學進度與連勝
      recordMathAnswer(problem.id, isCorrect, isCorrect ? 15 : 2)

      // 更新內部狀態
      setFsrsMap((prev) => ({ ...prev, [problem.id]: result.fsrsState }))
      setUserResponses((prev) => [
        ...prev,
        {
          itemId: problem.id,
          isCorrect,
          difficulty: problem.difficulty,
          discrimination: 1.4,
          pseudoGuessing: 0.2,
          responseTimeSec: 6.0,
        },
      ])
      setGameState(result.gamification.currentState)
      setLastPipelineResult(result)
      setCurrentTheta(result.abilityEstimate.theta)

      // 檢查徽章解鎖
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
