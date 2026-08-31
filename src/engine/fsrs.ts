/**
 * FSRS (Free Spaced Repetition Scheduler) 核心演算法
 * 基於 DSR 記憶模型（Difficulty 難度, Stability 穩定度, Retrievability 可提取性）
 * 比傳統 SM-2 減少 20%~30% 的無效重複，並消除 Ease Hell 缺陷。
 */

export type FsrsGrade = 'again' | 'hard' | 'good' | 'easy'

export type FsrsItemState = {
  id: string
  difficulty: number // D: 1 (極易) ~ 10 (極難)
  stability: number // S: 記憶穩定度（天數，即 R 降至 targetRetention 所需時間）
  retrievability: number // R: 當前可提取機率 0.0 ~ 1.0
  lastReview: string // 上次複習時間 (ISO 8601)
  dueAt: string // 下次到期時間 (ISO 8601)
  reps: number // 總複習次數
  lapses: number // 遺忘次數 (選 again 的次數)
  state: 'new' | 'learning' | 'review' | 'relearning'
}

export type FsrsParameters = {
  requestRetention: number // 目標保留率，預設 0.9 (90%)
  maximumInterval: number // 最大複習間隔天數，預設 36500 (100 年)
  w: number[] // FSRS 權重模型參數 (17 個標準權重)
}

/**
 * FSRS-4.5 標準預設權重 (標準擬合參數)
 */
export const DEFAULT_FSRS_PARAMETERS: FsrsParameters = {
  requestRetention: 0.9,
  maximumInterval: 36500,
  w: [
    0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
    0.1192, 1.01925, 1.9395, 0.11, 0.29605, 0.22695, 0.56995, 2.85535,
  ],
}

const DAY_MS = 24 * 60 * 60 * 1000
const FACTOR = 19 / 81 // FSRS 遺忘冪律常數

/**
 * 計算在經過 elapsedDays 後的即時可提取性 (Retrievability, R)
 * R(t, S) = (1 + FACTOR * (t / S))^(-0.5)
 */
export function calculateRetrievability(elapsedDays: number, stability: number): number {
  if (stability <= 0) return 0
  if (elapsedDays <= 0) return 1
  return Math.pow(1 + FACTOR * (elapsedDays / stability), -0.5)
}

/**
 * 依據目標保留率與當前穩定度推導最佳複習間隔天數 (Interval, I)
 * I(S, R_target) = (S / FACTOR) * (R_target^(-1/0.5) - 1) = (S / FACTOR) * (R_target^(-2) - 1)
 */
export function calculateNextInterval(
  stability: number,
  requestRetention = 0.9,
  maxInterval = 36500,
): number {
  if (stability <= 0) return 0.01 // 約 15 分鐘後重試
  const interval = (stability / FACTOR) * (Math.pow(requestRetention, -2) - 1)
  return Math.min(maxInterval, Math.max(1, Math.round(interval)))
}

/**
 * 建立全新項目的預設 FSRS 狀態
 */
export function defaultFsrsItemState(id: string): FsrsItemState {
  return {
    id,
    difficulty: 5.0, // 初始中等難度
    stability: 0,
    retrievability: 1.0,
    lastReview: new Date(0).toISOString(),
    dueAt: new Date(0).toISOString(),
    reps: 0,
    lapses: 0,
    state: 'new',
  }
}

/**
 * 等級評分轉換為數值 gradeNumber: again=1, hard=2, good=3, easy=4
 */
function gradeToNumber(grade: FsrsGrade): number {
  switch (grade) {
    case 'again':
      return 1
    case 'hard':
      return 2
    case 'good':
      return 3
    case 'easy':
      return 4
  }
}

/**
 * FSRS 核心排程運算：複習項目並計算新的 D, S, R 與下次複習時間
 */
export function reviewFsrsItem(
  item: FsrsItemState,
  grade: FsrsGrade,
  now = new Date(),
  params = DEFAULT_FSRS_PARAMETERS,
): FsrsItemState {
  const g = gradeToNumber(grade)
  const lastReviewDate = new Date(item.lastReview).getTime() > 0 ? new Date(item.lastReview) : now
  const elapsedDays = (now.getTime() - lastReviewDate.getTime()) / DAY_MS
  // 若為同一天或即時演練，以目標保留率 (0.9) 作為基準提取率計算增長
  const effectiveR =
    elapsedDays > 0.05 && item.stability > 0
      ? calculateRetrievability(elapsedDays, item.stability)
      : params.requestRetention

  let newD = item.difficulty
  let newS = item.stability
  let nextState: FsrsItemState['state'] = item.state
  let nextLapses = item.lapses

  const w = params.w

  if (item.state === 'new' || item.reps === 0) {
    // 首次學習 (Initial Stability & Difficulty)
    newD = Math.min(10, Math.max(1, w[4] - Math.exp(w[5] * (g - 1)) + 1))
    newS = Math.max(0.1, w[g - 1])
    nextState = grade === 'again' ? 'learning' : 'review'
    if (grade === 'again') nextLapses += 1
  } else if (grade === 'again') {
    // 遺忘 (Forgetting / Lapse)
    nextLapses += 1
    nextState = 'relearning'
    // 難度上升
    newD = Math.min(10, Math.max(1, item.difficulty + w[6] * (11 - item.difficulty)))
    // 穩定度衰減
    newS = Math.max(
      0.1,
      w[11] *
        Math.pow(item.difficulty, -w[12]) *
        (Math.pow(item.stability + 1, w[13]) - 1) *
        Math.exp((1 - effectiveR) * w[14]),
    )
  } else {
    // 成功回憶 (Recall: hard / good / easy)
    nextState = 'review'
    // 難度微調 (Mean Reversion)
    const deltaD = -w[6] * (g - 3)
    const targetD = item.difficulty + deltaD
    newD = Math.min(10, Math.max(1, w[7] * 5.0 + (1 - w[7]) * targetD))

    // 穩定度增長
    const hardPenalty = grade === 'hard' ? w[15] : 1.0
    const easyBonus = grade === 'easy' ? w[16] : 1.0
    newS = Math.max(
      item.stability,
      item.stability *
        (1 +
          Math.exp(w[8]) *
            (11 - newD) *
            Math.pow(item.stability, -w[9]) *
            (Math.exp((1 - effectiveR) * w[10]) - 1) *
            hardPenalty *
            easyBonus),
    )
  }

  const nextIntervalDays =
    grade === 'again'
      ? 0.01 // 遺忘後約 15 分鐘重測
      : calculateNextInterval(newS, params.requestRetention, params.maximumInterval)

  const nextDue = new Date(now.getTime() + nextIntervalDays * DAY_MS).toISOString()

  return {
    id: item.id,
    difficulty: Number(newD.toFixed(3)),
    stability: Number(newS.toFixed(3)),
    retrievability: 1.0,
    lastReview: now.toISOString(),
    dueAt: nextDue,
    reps: item.reps + 1,
    lapses: nextLapses,
    state: nextState,
  }
}

/**
 * 判斷該項目是否已到期需複習
 */
export function isFsrsDue(item: FsrsItemState, now = new Date()): boolean {
  return new Date(item.dueAt).getTime() <= now.getTime()
}

/**
 * 將舊版 SM-2 ItemState 平滑遷移轉換至 FSRS FsrsItemState
 */
export function migrateSm2ToFsrs(sm2: {
  id: string
  ease?: number
  intervalDays?: number
  dueAt?: string
  correctStreak?: number
  seen?: number
  lapses?: number
}): FsrsItemState {
  const ease = sm2.ease ?? 2.5
  // Ease 2.5 對應 Difficulty 5.0，Ease 1.3 對應 Difficulty 9.0
  const difficulty = Math.min(10, Math.max(1, 10 - (ease - 1.3) * (5 / 1.2)))
  const stability = Math.max(0.1, sm2.intervalDays ?? 1.0)
  const reps = sm2.seen ?? 0
  const lapses = sm2.lapses ?? 0

  return {
    id: sm2.id,
    difficulty: Number(difficulty.toFixed(2)),
    stability: Number(stability.toFixed(2)),
    retrievability: 1.0,
    lastReview: new Date().toISOString(),
    dueAt: sm2.dueAt ?? new Date(0).toISOString(),
    reps,
    lapses,
    state: reps === 0 ? 'new' : 'review',
  }
}
