/**
 * 台湾華語・中国語：學習進度與狀態管理 (Chinese Learning Storage)
 */

export interface ChineseProgressState {
  xp: number
  masteredTones: number[]
  masteredPinyin: string[]
  masteredFalseFriends: string[]
  masteredGrammarSignals: string[]
  completedDialogues: string[]
}

const CHINESE_PROGRESS_KEY = 'chinese_learning_progress_v1'

// 記憶體備援（用於 SSR 或 Node/Vitest 測試環境）
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

export function defaultChineseProgress(): ChineseProgressState {
  return {
    xp: 0,
    masteredTones: [],
    masteredPinyin: [],
    masteredFalseFriends: [],
    masteredGrammarSignals: [],
    completedDialogues: [],
  }
}

export function loadChineseProgress(): ChineseProgressState {
  try {
    const raw = getStorageItem(CHINESE_PROGRESS_KEY)
    if (!raw) return defaultChineseProgress()
    const parsed = JSON.parse(raw)
    return {
      ...defaultChineseProgress(),
      ...parsed,
    }
  } catch {
    return defaultChineseProgress()
  }
}

export function saveChineseProgress(progress: ChineseProgressState) {
  try {
    setStorageItem(CHINESE_PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    /* ignore */
  }
}
