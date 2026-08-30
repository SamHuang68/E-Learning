/**
 * 證據中心設計 (Evidence-Centered Design, ECD) 隱形評量引擎 (Stealth Assessment Engine)
 * 從學習者自然互動行為（作答時間、提示求助、嘗試修改次數、動態教具操作）默默推估核心素養能力。
 * 消除考試焦慮，實現「無感沈浸式評量」。
 */

export type TelemetryEvent = {
  itemId?: string
  labId?: string
  isCorrect?: boolean
  timeSpentSec: number
  hintsViewedCount?: number
  optionsChangedCount?: number
  sliderManipulationsCount?: number
  actionType: 'answer_submit' | 'hint_request' | 'lab_interaction' | 'error_retry'
}

export type StealthCompetencyProfile = {
  grit: number // 毅力與抗挫力 (0 ~ 100)
  exploration: number // 概念探索度 (0 ~ 100)
  efficiency: number // 解題敏捷度 (0 ~ 100)
  metacognition: number // 後設認知與反思 (0 ~ 100)
  compositeIndex: number // 綜合素養指數 (0 ~ 100)
  learningPersona: string // 學習風格畫像
  strengths: string[]
  growthAdvice: string
}

/**
 * 計算隱形評量素養能力特徵 (ECD Telemetry Synthesis)
 */
export function computeStealthAssessment(events: TelemetryEvent[]): StealthCompetencyProfile {
  if (events.length === 0) {
    return {
      grit: 60,
      exploration: 60,
      efficiency: 60,
      metacognition: 60,
      compositeIndex: 60,
      learningPersona: '🌱 潛力新星探索者',
      strengths: ['剛開始學習歷程，具備高度成長潛力'],
      growthAdvice: '多嘗試互動教具實驗室與不同題型，系統將建立更精準的素養模型。',
    }
  }

  let retryAfterErrorCount = 0
  let errorCount = 0
  let totalHintCount = 0
  let totalSliderChanges = 0
  let totalLabTime = 0
  let fastCorrectCount = 0
  let totalCorrectCount = 0
  let totalAnswers = 0
  let carefulRevisionCount = 0

  events.forEach((evt) => {
    if (evt.actionType === 'answer_submit') {
      totalAnswers += 1
      if (evt.isCorrect) {
        totalCorrectCount += 1
        if (evt.timeSpentSec >= 3.0 && evt.timeSpentSec <= 15.0) {
          fastCorrectCount += 1
        }
      } else {
        errorCount += 1
      }
      if ((evt.optionsChangedCount ?? 0) > 0) {
        carefulRevisionCount += 1
      }
      totalHintCount += evt.hintsViewedCount ?? 0
    } else if (evt.actionType === 'error_retry') {
      retryAfterErrorCount += 1
    } else if (evt.actionType === 'lab_interaction') {
      totalSliderChanges += evt.sliderManipulationsCount ?? 1
      totalLabTime += evt.timeSpentSec
    }
  })

  // 1. 毅力 (Grit): 遭遇錯誤後是否積極重試與查看提示，而非放棄
  const retryRatio = errorCount > 0 ? retryAfterErrorCount / errorCount : 0.8
  const gritScore = Math.min(
    100,
    Math.max(30, Math.round(50 + retryRatio * 35 + Math.min(15, totalAnswers * 1.5))),
  )

  // 2. 探索度 (Exploration): 在教具實驗室中的操作頻率與時間投入
  const explorationScore = Math.min(
    100,
    Math.max(30, Math.round(40 + Math.min(40, totalSliderChanges * 4) + Math.min(20, totalLabTime / 5))),
  )

  // 3. 解題敏捷度 (Efficiency): 一次正確率與合理的作答節奏
  const accuracyRatio = totalAnswers > 0 ? totalCorrectCount / totalAnswers : 0.7
  const efficiencyScore = Math.min(
    100,
    Math.max(30, Math.round(accuracyRatio * 60 + (fastCorrectCount / Math.max(1, totalCorrectCount)) * 30 + 10)),
  )

  // 4. 後設認知 (Metacognition): 遇到卡關時主動運用階梯提示與複查
  const hintUsageBonus = Math.min(25, totalHintCount * 5)
  const revisionBonus = Math.min(25, carefulRevisionCount * 6)
  const metacognitionScore = Math.min(100, Math.max(35, Math.round(50 + hintUsageBonus + revisionBonus)))

  // 綜合素養指數
  const compositeIndex = Math.round(
    gritScore * 0.3 + explorationScore * 0.2 + efficiencyScore * 0.3 + metacognitionScore * 0.2,
  )

  // 判定學習畫像 (Learning Persona)
  let learningPersona = '🎯 穩健全能型學者'
  const strengths: string[] = []

  if (gritScore >= 80 && explorationScore >= 75) {
    learningPersona = '🚀 深度探究型極客'
    strengths.push('抗挫折韌性極高，勇於深入幾何與演算法本質')
  } else if (efficiencyScore >= 85) {
    learningPersona = '⚡ 敏捷直覺型高手'
    strengths.push('概念辨識敏銳，能快速抓住核心破題訊號')
  } else if (metacognitionScore >= 80) {
    learningPersona = '🧠 後設策略型思考家'
    strengths.push('善用階梯提示自我診斷，解題策略條理分明')
  } else {
    strengths.push('各項素養均衡發展，學習節奏平穩')
  }

  let growthAdvice = '保持目前節奏，持續挑戰不同年級與單元之綜合模擬測驗！'
  if (explorationScore < 60) {
    growthAdvice = '建議多進入「互動教具實驗室」動手拉動滑桿，加深對抽象概念的幾何直覺。'
  } else if (gritScore < 60) {
    growthAdvice = '答錯時別氣餒！開啟蘇格拉底提示並重試一次，能快速鞏固長期記憶。'
  }

  return {
    grit: gritScore,
    exploration: explorationScore,
    efficiency: efficiencyScore,
    metacognition: metacognitionScore,
    compositeIndex,
    learningPersona,
    strengths,
    growthAdvice,
  }
}
