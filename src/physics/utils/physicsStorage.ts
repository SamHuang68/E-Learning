/**
 * 臺灣 108 課綱物理學習狀態管理 (Physics Storage & Progress Management)
 * 管理項目：
 * - 物理學段 (Junior/Senior)、年級 (G7~G12) 與單元選擇
 * - 學習經驗值 (XP)
 * - 題目完成清單與錯題本 (Error Notebook)
 * - 物理實驗室教具完成狀態 (Labs)
 * - 會考、學測與分科測驗模擬考成績 (Exam Scores)
 */

import type { PhysicsGradeId, PhysicsStage } from '../data/curriculum'
import { recordActivity, notifyProgressChanged } from '../../utils/storage'

export type PhysicsProgressState = {
  stage: PhysicsStage
  gradeId: PhysicsGradeId
  unitId: number
  xp: number
  completedQuestions: string[]
  errorQuestions: string[]
  examScores: Record<string, number>
  labCompleted: string[]
}

const PHYSICS_PROGRESS_KEY = 'physics-learning-progress'

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

/** 取得物理初始預設學習進度狀態 */
export function defaultPhysicsProgress(): PhysicsProgressState {
  return {
    stage: 'senior',
    gradeId: 'g10',
    unitId: 1,
    xp: 0,
    completedQuestions: [],
    errorQuestions: [],
    examScores: {},
    labCompleted: [],
  }
}

/** 載入物理學習進度 (含 LocalStorage 快取與記憶體備援) */
export function loadPhysicsProgress(): PhysicsProgressState {
  try {
    const raw = getStorageItem(PHYSICS_PROGRESS_KEY)
    if (raw) {
      const data = JSON.parse(raw) as Partial<PhysicsProgressState>
      return {
        ...defaultPhysicsProgress(),
        ...data,
      }
    }
  } catch {
    /* ignore */
  }
  return defaultPhysicsProgress()
}

/** 儲存物理學習進度並觸發全域廣播事件 */
export function savePhysicsProgress(progress: PhysicsProgressState): void {
  setStorageItem(PHYSICS_PROGRESS_KEY, JSON.stringify(progress))
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('physics:progress-updated'))
  }
}

/**
 * 記錄題目作答結果
 * - 正確：加入 completedQuestions，自錯題本移除，增加 XP
 * - 錯誤：自動收入錯題本 errorQuestions
 */
export function recordPhysicsAnswer(
  questionId: string,
  isCorrect: boolean,
  xpEarned = 10,
): PhysicsProgressState {
  const current = loadPhysicsProgress()
  const completedSet = new Set(current.completedQuestions)
  const errorSet = new Set(current.errorQuestions)

  if (isCorrect) {
    completedSet.add(questionId)
    errorSet.delete(questionId)
  } else {
    errorSet.add(questionId)
  }

  const nextState: PhysicsProgressState = {
    ...current,
    xp: current.xp + (isCorrect ? xpEarned : 0),
    completedQuestions: Array.from(completedSet),
    errorQuestions: Array.from(errorSet),
  }

  savePhysicsProgress(nextState)
  recordActivity(1)
  notifyProgressChanged()
  return nextState
}

/**
 * 記錄物理實驗室教具操作完成狀態
 */
export function recordPhysicsLabCompletion(labId: string, xpEarned = 25): PhysicsProgressState {
  const current = loadPhysicsProgress()
  const labSet = new Set(current.labCompleted)
  const isNew = !labSet.has(labId)
  labSet.add(labId)

  const nextState: PhysicsProgressState = {
    ...current,
    xp: current.xp + (isNew ? xpEarned : 5),
    labCompleted: Array.from(labSet),
  }

  savePhysicsProgress(nextState)
  recordActivity(2)
  notifyProgressChanged()
  return nextState
}

/**
 * 記錄模擬考成績
 */
export function recordPhysicsMockScore(examId: string, score: number): PhysicsProgressState {
  const current = loadPhysicsProgress()
  const nextState: PhysicsProgressState = {
    ...current,
    xp: current.xp + Math.round(score / 2),
    examScores: {
      ...current.examScores,
      [examId]: score,
    },
  }

  savePhysicsProgress(nextState)
  recordActivity(5)
  notifyProgressChanged()
  return nextState
}

/**
 * 清除物理所有進度暫存（測試與重置用）
 */
export function clearPhysicsProgress(): void {
  memoryStorage = {}
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(PHYSICS_PROGRESS_KEY)
    } catch {
      /* ignore */
    }
  }
}
