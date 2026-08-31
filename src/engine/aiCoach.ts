import type { LearningMeta } from '../utils/storage'
import {
  diagnoseError,
  summarizeErrorDiagnoses,
  type ErrorDiagnosisResult,
} from './errorTaxonomy'

export function buildWeakReviewIds(meta: LearningMeta, limit = 5): string[] {
  return Object.values(meta.items)
    .filter(
      (item) =>
        item.lastResult === 'again' ||
        item.ease <= 2 ||
        item.lapses > 0,
    )
    .sort((a, b) => {
      if (a.lastResult === 'again' && b.lastResult !== 'again') return -1
      if (a.lastResult !== 'again' && b.lastResult === 'again') return 1
      if (a.ease !== b.ease) return a.ease - b.ease
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
    })
    .slice(0, Math.max(0, limit))
    .map((item) => item.id)
}

/**
 * 依據學習者近期的錯誤日誌產出認知教練處方診斷
 */
export function generateCognitiveCoachReport(meta: LearningMeta): {
  weakIds: string[]
  dominantErrorPattern: string | null
  prescriptiveAdvice: string
  actionItems: string[]
} {
  const weakIds = buildWeakReviewIds(meta, 5)

  // 模擬/抽取錯誤事件進行分類診斷
  const errorEvents = meta.events.filter((e) => e.type.includes('error') || e.type.includes('wrong'))
  const sampleDiagnoses: ErrorDiagnosisResult[] = errorEvents.map((evt, idx) =>
    diagnoseError({
      itemId: (evt.payload?.id as string) ?? `err-${idx}`,
      conceptTag: (evt.payload?.tag as string) ?? 'general',
      selectedAnswer: 'wrong_choice',
      correctAnswer: 'correct_choice',
      responseTimeSec: (evt.payload?.durationSec as number) ?? 4.0,
      previousLapses: 1,
    }),
  )

  const summary = summarizeErrorDiagnoses(sampleDiagnoses)

  const actionItems: string[] = []
  if (weakIds.length > 0) {
    actionItems.push(`針對 ${weakIds.length} 個高遺忘卡片執行 FSRS 間隔提取複習`)
  }
  if (summary.dominantPattern === 'misconception') {
    actionItems.push('開啟破題訊號卡與幾何圖示，辨析易混淆概念')
  } else if (summary.dominantPattern === 'slip') {
    actionItems.push('練習時啟用 2 秒冷靜複查習慣')
  } else if (summary.dominantPattern === 'blind_guess') {
    actionItems.push('善用 4 級蘇格拉底提示，禁止未經思考盲猜')
  } else {
    actionItems.push('依序完成今日微單元與每日挑戰')
  }

  return {
    weakIds,
    dominantErrorPattern: summary.dominantPattern,
    prescriptiveAdvice: summary.overallRemediation,
    actionItems,
  }
}

export function buildScenarioMission(track: 'ja' | 'en'): {
  title: string
  checklist: string[]
} {
  if (track === 'ja') {
    return {
      title: '今日の敬語ミッション',
      checklist: [
        '先用一句丁寧語開場，不直接命令對方',
        '說明原因時使用「〜てしまいました／〜ております」降低衝突',
        '收尾用「よろしくお願いいたします」或感謝語',
      ],
    }
  }

  return {
    title: 'Business register mission',
    checklist: [
      'Open with a polite acknowledgement',
      'State one clear constraint without blaming the other person',
      'Close with a specific next step and deadline',
    ],
  }
}
