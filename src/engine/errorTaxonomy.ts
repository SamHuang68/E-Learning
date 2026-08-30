/**
 * 錯誤分類學與認知診斷引擎 (Error Taxonomy Engine)
 * 區分 Slip (粗心失誤) vs Misconception (迷思概念) vs Blind Guess (盲猜) vs Unlearned (未習得)
 * 提供精準的處方級弱點修復推薦。
 */

export type ErrorType = 'slip' | 'misconception' | 'blind_guess' | 'unlearned'

export type ErrorDiagnosisInput = {
  itemId: string
  conceptTag: string
  selectedAnswer: string
  correctAnswer: string
  distractorCategory?: string // 例如: "sign_error" | "conjugation" | "false_friend"
  responseTimeSec: number
  userTheta?: number // 學習者目前估計能力值
  itemDifficulty?: number // 題目難度
  previousLapses?: number // 歷史遺忘/錯誤次數
}

export type ErrorDiagnosisResult = {
  errorType: ErrorType
  typeName: string
  confidenceScore: number // 0.0 ~ 1.0 判定信心度
  diagnosticReason: string
  prescriptiveRemediation: string
  suggestedAction: 'review_prompt' | 'visual_lab' | 'scaffolded_hint' | 'check_careless'
}

/**
 * 核心診斷演算法：依據作答時間、歷史表現、干擾選項與難度差綜合判定錯誤類型
 */
export function diagnoseError(input: ErrorDiagnosisInput): ErrorDiagnosisResult {
  const {
    responseTimeSec,
    userTheta = 0.0,
    itemDifficulty = 0.0,
    previousLapses = 0,
    distractorCategory,
  } = input

  // 1. 盲猜行為 (Blind Guess): 作答時間極短 (< 1.5 秒)
  if (responseTimeSec < 1.5) {
    return {
      errorType: 'blind_guess',
      typeName: '⚡ 快速盲猜',
      confidenceScore: 0.92,
      diagnosticReason: `作答時間僅 ${responseTimeSec.toFixed(1)} 秒，尚未進入工作記憶深度處理即點選答案。`,
      prescriptiveRemediation: '建議放慢節奏，利用階梯提示引導思考，避免為了追求速度而盲猜。',
      suggestedAction: 'scaffolded_hint',
    }
  }

  // 2. 粗心失誤 (Slip): 學習者能力顯著高於題目難度，但快速答錯
  const abilityDiff = userTheta - itemDifficulty
  if (abilityDiff >= 0.8 && responseTimeSec < 5.0 && previousLapses <= 1) {
    return {
      errorType: 'slip',
      typeName: '⚠️ 粗心失誤 (Slip)',
      confidenceScore: 0.85,
      diagnosticReason: '您的實力已掌握此概念，但因作答速度較快而在細節上產生偶發失誤。',
      prescriptiveRemediation: '觀念已具備，下次作答請花 2 秒檢查條件、單位或時態變化。',
      suggestedAction: 'check_careless',
    }
  }

  // 3. 迷思概念 (Misconception): 選中了特定已知陷阱選項，或特定文法/符號混淆
  if (distractorCategory || previousLapses >= 2) {
    return {
      errorType: 'misconception',
      typeName: '🎯 迷思概念陷阱',
      confidenceScore: 0.88,
      diagnosticReason: distractorCategory
        ? `觸發了「${distractorCategory}」常見認知陷阱，對干擾選項產生了系統性誤判。`
        : '在此概念上反覆出現多次錯誤，代表心智模型存在特定盲點。',
      prescriptiveRemediation: '建議開啟幾何圖示或語塊微故事解析，深入辨析本質與干擾項之差異。',
      suggestedAction: 'visual_lab',
    }
  }

  // 4. 未習得 / 概念盲區 (Unlearned): 作答時間充裕但答錯，代表先備知識不足
  return {
    errorType: 'unlearned',
    typeName: '🌱 尚未習得之新概念',
    confidenceScore: 0.8,
    diagnosticReason: `作答耗時 ${responseTimeSec.toFixed(1)} 秒並認真嘗試，但題目難度高於目前先備知識儲備。`,
    prescriptiveRemediation: '建議從基礎微學習單元與蘇格拉底階梯提示開始，逐步建立概念階梯。',
    suggestedAction: 'review_prompt',
  }
}

/**
 * 統計一組錯誤記錄之認知診斷分佈，產出學習者處方分析報表
 */
export function summarizeErrorDiagnoses(diagnoses: ErrorDiagnosisResult[]): {
  totalErrors: number
  byType: Record<ErrorType, number>
  dominantPattern: ErrorType | null
  overallRemediation: string
} {
  const byType: Record<ErrorType, number> = {
    slip: 0,
    misconception: 0,
    blind_guess: 0,
    unlearned: 0,
  }

  diagnoses.forEach((d) => {
    byType[d.errorType] += 1
  })

  const totalErrors = diagnoses.length
  if (totalErrors === 0) {
    return {
      totalErrors: 0,
      byType,
      dominantPattern: null,
      overallRemediation: '目前沒有錯誤記錄，學習狀態極佳！',
    }
  }

  // 找出主要錯誤模式
  let dominantPattern: ErrorType = 'unlearned'
  let maxCount = -1
  for (const [type, count] of Object.entries(byType)) {
    if (count > maxCount) {
      maxCount = count
      dominantPattern = type as ErrorType
    }
  }

  let overallRemediation = ''
  switch (dominantPattern) {
    case 'blind_guess':
      overallRemediation = '偵測到較高比例的快速答題。建議深呼吸放慢節奏，善用提示功能。'
      break
    case 'slip':
      overallRemediation = '您的基礎實力良好，多數失誤屬於粗心。加強最後 2 秒複查即可大幅提升得分率！'
      break
    case 'misconception':
      overallRemediation = '發現多個特定觀念陷阱。建議進入專屬教具實驗室與破題訊號卡進行定向強化。'
      break
    case 'unlearned':
      overallRemediation = '目前正在挑戰新概念領域。請依序循著微單元路徑與圖示解題逐步累積。'
      break
  }

  return {
    totalErrors,
    byType,
    dominantPattern,
    overallRemediation,
  }
}
