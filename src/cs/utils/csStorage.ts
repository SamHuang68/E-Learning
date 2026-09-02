import { PROGRESS_STORAGE_KEYS } from '../../utils/progressKeys'
import { notifyProgressChanged } from '../../utils/storage'

export interface CsProgress {
  completedQuestions: string[]
  xp: number
  errorQuestions: string[]
  examScores: Record<string, number>
  labCompleted: string[]
  lastActiveDate: string
}

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

export const DEFAULT_CS_PROGRESS: CsProgress = {
  completedQuestions: [],
  xp: 0,
  errorQuestions: [],
  examScores: {},
  labCompleted: [],
  lastActiveDate: new Date().toISOString().split('T')[0],
}

export function loadCsProgress(): CsProgress {
  try {
    const raw = getStorageItem(PROGRESS_STORAGE_KEYS.cs)
    if (!raw) return { ...DEFAULT_CS_PROGRESS }
    const parsed = JSON.parse(raw) as Partial<CsProgress>
    return {
      ...DEFAULT_CS_PROGRESS,
      ...parsed,
      completedQuestions: Array.isArray(parsed.completedQuestions) ? parsed.completedQuestions : [],
      errorQuestions: Array.isArray(parsed.errorQuestions) ? parsed.errorQuestions : [],
      labCompleted: Array.isArray(parsed.labCompleted) ? parsed.labCompleted : [],
      examScores: typeof parsed.examScores === 'object' && parsed.examScores !== null ? parsed.examScores : {},
    }
  } catch {
    return { ...DEFAULT_CS_PROGRESS }
  }
}

export function saveCsProgress(progress: CsProgress): void {
  try {
    setStorageItem(PROGRESS_STORAGE_KEYS.cs, JSON.stringify(progress))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cs:progress-updated', { detail: progress }))
    }
    notifyProgressChanged()
  } catch (err) {
    console.error('Failed to save CS progress:', err)
  }
}

export function resetCsProgress(): void {
  memoryStorage = {}
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(PROGRESS_STORAGE_KEYS.cs)
      localStorage.removeItem(PROGRESS_STORAGE_KEYS.csSignals)
    } catch {
      // ignore
    }
  }
}

export function loadCsSignalsMastery(): Record<string, boolean> {
  try {
    const raw = getStorageItem(PROGRESS_STORAGE_KEYS.csSignals)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveCsSignalsMastery(mastery: Record<string, boolean>): void {
  try {
    setStorageItem(PROGRESS_STORAGE_KEYS.csSignals, JSON.stringify(mastery))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cs:signals-mastery-updated', { detail: mastery }))
    }
    notifyProgressChanged()
  } catch (err) {
    console.error('Failed to save CS signals mastery:', err)
  }
}
