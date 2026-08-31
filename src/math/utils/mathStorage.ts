import type { MathGradeId, MathStage } from '../data/curriculum'
import { PROGRESS_STORAGE_KEYS } from '../../utils/progressKeys'

export type MathProgressState = {
  stage: MathStage
  gradeId: MathGradeId
  unitId: number
  xp: number
  completedQuestions: string[]
  errorQuestions: string[]
  examScores: Record<string, number>
  labCompleted: string[]
}

const MATH_PROGRESS_KEY = PROGRESS_STORAGE_KEYS.math

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

export function defaultMathProgress(): MathProgressState {
  return {
    stage: 'elementary',
    gradeId: 'g1',
    unitId: 1,
    xp: 0,
    completedQuestions: [],
    errorQuestions: [],
    examScores: {},
    labCompleted: [],
  }
}

export function loadMathProgress(): MathProgressState {
  try {
    const raw = getStorageItem(MATH_PROGRESS_KEY)
    if (raw) {
      const data = JSON.parse(raw) as Partial<MathProgressState>
      return {
        ...defaultMathProgress(),
        ...data,
      }
    }
  } catch {
    /* ignore */
  }
  return defaultMathProgress()
}

export function saveMathProgress(progress: MathProgressState) {
  setStorageItem(MATH_PROGRESS_KEY, JSON.stringify(progress))
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('math:progress-updated'))
  }
}

import { recordActivity, notifyProgressChanged } from '../../utils/storage'

export function recordMathAnswer(
  questionId: string,
  isCorrect: boolean,
  xpEarned = 5,
): MathProgressState {
  const current = loadMathProgress()
  const completedSet = new Set(current.completedQuestions)
  const errorSet = new Set(current.errorQuestions)

  if (isCorrect) {
    completedSet.add(questionId)
    errorSet.delete(questionId)
  } else {
    errorSet.add(questionId)
  }

  const nextState: MathProgressState = {
    ...current,
    xp: current.xp + (isCorrect ? xpEarned : 0),
    completedQuestions: Array.from(completedSet),
    errorQuestions: Array.from(errorSet),
  }

  saveMathProgress(nextState)
  recordActivity(1)
  notifyProgressChanged()
  return nextState
}

export function recordMockScore(examId: string, score: number): MathProgressState {
  const current = loadMathProgress()
  const nextState: MathProgressState = {
    ...current,
    xp: current.xp + Math.round(score / 2),
    examScores: {
      ...current.examScores,
      [examId]: score,
    },
  }
  saveMathProgress(nextState)
  recordActivity(5)
  notifyProgressChanged()
  return nextState
}
