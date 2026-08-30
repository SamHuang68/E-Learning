/**
 * 統一認知學習調度器外觀層 (Unified Cognitive Learning Coordinator Facade)
 * 將 5 大認知學習引擎（FSRS 4.5, 2PL IRT CAT, 錯誤分類學, 蘇格拉底階梯提示, ECD 隱形評量）
 * 封裝為高層次、單一入口的學習流轉全閉環。
 */

import { selectNextAdaptiveItem, estimateAbilityTheta, type IrtItem, type IrtAbilityEstimate, type UserResponse } from './adaptive'
import { reviewFsrsItem, type FsrsItemState, type FsrsGrade } from './fsrs'
import { diagnoseError, type ErrorDiagnosisResult } from './errorTaxonomy'
import { getHeuristicScaffoldHints, requestSocraticHintFromOllama, type HintLevel, type QuestionContext } from './scaffoldedHints'
import { computeStealthAssessment, type StealthCompetencyProfile, type TelemetryEvent } from './stealthAssessment'
import { recordAnswerGamification, type GamificationState, type Badge } from './gamification'
import { computeMathRadar, computeAobaRadar, computeToeicRadar, type TrackRadar } from './radar'

export type LearningTrackId = 'math' | 'ja' | 'en'

export type UniversalExerciseItem = IrtItem & {
  track: LearningTrackId
  topic: string
  prompt: string
  choices?: string[]
  answer: string
  solutionSteps?: string[]
  explanation?: string
  keySignal?: string
  distractorCategory?: string
}

export type LearningSubmissionPacket = {
  itemId: string
  track: LearningTrackId
  conceptTag: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  responseTimeSec: number
  itemDifficulty: number
  distractorCategory?: string
  hintsViewedCount: number
  optionsChangedCount: number
  labInteractionsCount?: number
}

export type CognitivePipelineResponse = {
  diagnosis?: ErrorDiagnosisResult
  fsrsState: FsrsItemState
  abilityEstimate: IrtAbilityEstimate
  stealthProfile: StealthCompetencyProfile
  gamification: {
    xpEarned: number
    multiplier: number
    leveledUp: boolean
    newBadges: Badge[]
    currentState: GamificationState
  }
  nextAction: {
    actionType: 'continue_adaptive' | 'open_lab' | 'review_fsrs_due' | 'session_complete'
    recommendedItemId?: string
    recommendedLabId?: string
    guidanceMessage: string
  }
}

export class LearningCoordinator {
  /**
   * 1. 推薦自適應下一題 (Max Fisher Information in Golden Zone)
   */
  recommendNextItem(
    candidatePool: UniversalExerciseItem[],
    currentTheta: number,
    historyIds: Set<string>,
  ): UniversalExerciseItem | null {
    return selectNextAdaptiveItem(candidatePool, currentTheta, historyIds)
  }

  /**
   * 2. 請求 4 級蘇格拉底階梯提示
   */
  async getScaffoldHint(
    ctx: QuestionContext,
    targetLevel: HintLevel,
    useLlm = true,
  ): Promise<string> {
    if (useLlm) {
      try {
        return await requestSocraticHintFromOllama(ctx, targetLevel)
      } catch {
        // Fallback to heuristic
      }
    }
    const hints = getHeuristicScaffoldHints(ctx)
    return hints[targetLevel - 1].content
  }

  /**
   * 3. 處理作答封包，觸發 錯誤分類 ➜ FSRS ➜ IRT ➜ ECD ➜ 遊戲化 一體化更新
   */
  async processSubmission(
    packet: LearningSubmissionPacket,
    currentFsrs: FsrsItemState,
    responseHistory: UserResponse[],
    telemetryHistory: TelemetryEvent[],
    gameState: GamificationState,
  ): Promise<CognitivePipelineResponse> {
    // A. 錯誤分類診斷
    let diagnosis: ErrorDiagnosisResult | undefined
    if (!packet.isCorrect) {
      diagnosis = diagnoseError({
        itemId: packet.itemId,
        conceptTag: packet.conceptTag,
        selectedAnswer: packet.userAnswer,
        correctAnswer: packet.correctAnswer,
        distractorCategory: packet.distractorCategory,
        responseTimeSec: packet.responseTimeSec,
        itemDifficulty: packet.itemDifficulty,
        previousLapses: currentFsrs.lapses,
      })
    }

    // B. FSRS 記憶模型排程更新
    const fsrsGrade: FsrsGrade = packet.isCorrect
      ? packet.responseTimeSec < 3.0 && packet.hintsViewedCount === 0
        ? 'easy'
        : 'good'
      : packet.hintsViewedCount > 0
        ? 'hard'
        : 'again'
    const updatedFsrs = reviewFsrsItem(currentFsrs, fsrsGrade)

    // C. IRT 能力估計線上更新
    const updatedResponses: UserResponse[] = [
      ...responseHistory,
      {
        itemId: packet.itemId,
        isCorrect: packet.isCorrect,
        difficulty: packet.itemDifficulty,
        discrimination: 1.2,
        pseudoGuessing: 0.25,
        responseTimeSec: packet.responseTimeSec,
      },
    ]
    const updatedAbility = estimateAbilityTheta(updatedResponses)

    // D. ECD 隱形評量素養特徵萃取
    const newTelemetry: TelemetryEvent[] = [
      ...telemetryHistory,
      {
        itemId: packet.itemId,
        actionType: 'answer_submit',
        isCorrect: packet.isCorrect,
        timeSpentSec: packet.responseTimeSec,
        hintsViewedCount: packet.hintsViewedCount,
        optionsChangedCount: packet.optionsChangedCount,
        sliderManipulationsCount: packet.labInteractionsCount ?? 0,
      },
    ]
    const updatedStealth = computeStealthAssessment(newTelemetry)

    // E. 遊戲化激勵更新
    const diffTag =
      packet.itemDifficulty > 1.5
        ? 'challenge'
        : packet.itemDifficulty > 0.5
          ? 'hard'
          : 'medium'
    const gameResult = recordAnswerGamification(gameState, diffTag, packet.isCorrect)

    // F. 決策推薦下一步行動
    let nextAction: CognitivePipelineResponse['nextAction'] = {
      actionType: 'continue_adaptive',
      guidanceMessage: '表現出色！繼續挑戰下一道自適應精選題。',
    }

    if (
      diagnosis &&
      (diagnosis.errorType === 'misconception' || diagnosis.errorType === 'unlearned')
    ) {
      nextAction = {
        actionType: 'open_lab',
        recommendedLabId: packet.conceptTag,
        guidanceMessage: `偵測到「${diagnosis.typeName}」，建議先進入具象教具實驗室釐清本質。`,
      }
    }

    return {
      diagnosis,
      fsrsState: updatedFsrs,
      abilityEstimate: updatedAbility,
      stealthProfile: updatedStealth,
      gamification: {
        xpEarned: gameResult.xpEarned,
        multiplier: gameResult.xpEarned / (packet.isCorrect ? 20 : 2),
        leveledUp: gameResult.leveledUp,
        newBadges: gameResult.newBadges,
        currentState: gameResult.nextState,
      },
      nextAction,
    }
  }

  /**
   * 4. 戰力雷達加權計算
   */
  refreshTrackRadar(
    track: LearningTrackId,
    data: {
      completedQuestions?: string[]
      examScores?: Record<string, number>
      labCompleted?: string[]
      cardsDone?: number
      kanjiMastered?: number
      speakingDone?: number
      streak?: number
      chunkCount?: number
      examScore?: number
    },
  ): TrackRadar {
    if (track === 'math') {
      return computeMathRadar(
        data.completedQuestions ?? [],
        data.examScores ?? {},
        data.labCompleted ?? [],
      )
    }
    if (track === 'ja') {
      return computeAobaRadar(
        data.cardsDone ?? 0,
        data.kanjiMastered ?? 0,
        data.speakingDone ?? 0,
        data.streak ?? 0,
      )
    }
    return computeToeicRadar(
      data.cardsDone ?? 0,
      data.chunkCount ?? 0,
      data.examScore ?? 750,
    )
  }
}

export const learningCoordinator = new LearningCoordinator()
