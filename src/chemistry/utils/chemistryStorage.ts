import type { ChemistryGradeId, ChemistryStage } from '../data/curriculum'
import { recordActivity, notifyProgressChanged } from '../../utils/storage'

/**
 * 臺灣 108 課綱化學學習狀態資料結構
 */
export interface ChemistryProgressState {
  /** 目前所處學段 (junior: 國中 / senior: 高中) */
  stage: ChemistryStage
  /** 目前選定年級 (g7~g12) */
  gradeId: ChemistryGradeId
  /** 目前選定單元序號 */
  unitId: number
  /** 累積化學經驗值 (XP) */
  xp: number
  /** 已答對完成的題目 ID 列表 */
  completedQuestions: string[]
  /** 錯題本題目 ID 列表 */
  errorQuestions: string[]
  /** 各模擬考最佳得分紀錄 (key: examId, value: score) */
  examScores: Record<string, number>
  /** 已完成的實驗室探究 ID 列表 */
  labCompleted: string[]
  /** 收藏的 3 秒破題訊號卡 ID 列表 */
  bookmarkedSignals: string[]
}

const CHEMISTRY_PROGRESS_KEY = 'chemistry-learning-progress'

// 記憶體備援（用於 SSR 或 Node 測試環境）
let memoryStorage: Record<string, string> = {}

function getStorageItem(key: string): string | null {
  if (typeof localStorage !== 'undefined') {
    try {
      return localStorage.getItem(key)
    } catch {
      return memoryStorage[key] ?? null
    }
  }
  return memoryStorage[key] ?? null
}

function setStorageItem(key: string, value: string): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(key, value)
    } catch {
      memoryStorage[key] = value
    }
  } else {
    memoryStorage[key] = value
  }
}

/** 取得預設化學學習進度狀態 */
export function defaultChemistryProgress(): ChemistryProgressState {
  return {
    stage: 'senior',
    gradeId: 'g10',
    unitId: 1,
    xp: 0,
    completedQuestions: [],
    errorQuestions: [],
    examScores: {},
    labCompleted: [],
    bookmarkedSignals: [],
  }
}

/** 載入化學學習進度 */
export function loadChemistryProgress(): ChemistryProgressState {
  try {
    const raw = getStorageItem(CHEMISTRY_PROGRESS_KEY)
    if (raw) {
      const data = JSON.parse(raw) as Partial<ChemistryProgressState>
      return {
        ...defaultChemistryProgress(),
        ...data,
      }
    }
  } catch {
    /* ignore */
  }
  return defaultChemistryProgress()
}

/** 儲存化學學習進度並觸發自定義事件 */
export function saveChemistryProgress(progress: ChemistryProgressState): void {
  setStorageItem(CHEMISTRY_PROGRESS_KEY, JSON.stringify(progress))
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('chemistry:progress-updated', { detail: progress }))
  }
}

/** 紀錄化學題目作答結果（正確累加 XP，錯誤自動收入錯題本） */
export function recordChemistryAnswer(
  questionId: string,
  isCorrect: boolean,
  xpEarned = 5,
): ChemistryProgressState {
  const current = loadChemistryProgress()
  const completedSet = new Set(current.completedQuestions)
  const errorSet = new Set(current.errorQuestions)

  if (isCorrect) {
    completedSet.add(questionId)
    errorSet.delete(questionId)
  } else {
    errorSet.add(questionId)
  }

  const nextState: ChemistryProgressState = {
    ...current,
    xp: current.xp + (isCorrect ? xpEarned : 0),
    completedQuestions: Array.from(completedSet),
    errorQuestions: Array.from(errorSet),
  }

  saveChemistryProgress(nextState)
  recordActivity(1)
  notifyProgressChanged()
  return nextState
}

/** 紀錄實驗室探究完成度 */
export function recordChemistryLabCompletion(
  labId: string,
  xpEarned = 20,
): ChemistryProgressState {
  const current = loadChemistryProgress()
  const labSet = new Set(current.labCompleted)
  const isNew = !labSet.has(labId)
  labSet.add(labId)

  const nextState: ChemistryProgressState = {
    ...current,
    xp: current.xp + (isNew ? xpEarned : 0),
    labCompleted: Array.from(labSet),
  }

  saveChemistryProgress(nextState)
  if (isNew) {
    recordActivity(3)
    notifyProgressChanged()
  }
  return nextState
}

/** 紀錄模擬試卷成績 */
export function recordChemistryMockScore(
  examId: string,
  score: number,
): ChemistryProgressState {
  const current = loadChemistryProgress()
  const prevScore = current.examScores[examId] ?? 0
  const isImproved = score > prevScore

  const nextState: ChemistryProgressState = {
    ...current,
    xp: current.xp + Math.round(score / 2),
    examScores: {
      ...current.examScores,
      [examId]: Math.max(prevScore, score),
    },
  }

  saveChemistryProgress(nextState)
  if (isImproved) {
    recordActivity(5)
    notifyProgressChanged()
  }
  return nextState
}

/** 切換收藏 3 秒破題訊號卡 */
export function toggleBookmarkChemistrySignal(signalId: string): ChemistryProgressState {
  const current = loadChemistryProgress()
  const bookmarks = new Set(current.bookmarkedSignals)

  if (bookmarks.has(signalId)) {
    bookmarks.delete(signalId)
  } else {
    bookmarks.add(signalId)
  }

  const nextState: ChemistryProgressState = {
    ...current,
    bookmarkedSignals: Array.from(bookmarks),
  }

  saveChemistryProgress(nextState)
  return nextState
}

/** 重設或清除化學進度 */
export function resetChemistryProgress(): ChemistryProgressState {
  const initial = defaultChemistryProgress()
  saveChemistryProgress(initial)
  return initial
}
