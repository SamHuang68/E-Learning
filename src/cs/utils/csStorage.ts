import { PROGRESS_STORAGE_KEYS } from '../../utils/progressKeys'
import { notifyProgressChanged } from '../../utils/storage'
import {
  normalizeCsProgress,
  normalizeCsSignalsMastery,
  type CsProgress,
} from './csProgressSchema'

export {
  DEFAULT_CS_PROGRESS,
  normalizeCsProgress,
  normalizeCsSignalsMastery,
  type CsProgress,
} from './csProgressSchema'

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

export function loadCsProgress(): CsProgress {
  try {
    const raw = getStorageItem(PROGRESS_STORAGE_KEYS.cs)
    return raw ? normalizeCsProgress(JSON.parse(raw)) : normalizeCsProgress({})
  } catch {
    return normalizeCsProgress({})
  }
}

export function saveCsProgress(progress: CsProgress): void {
  try {
    const normalized = normalizeCsProgress(progress)
    setStorageItem(PROGRESS_STORAGE_KEYS.cs, JSON.stringify(normalized))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cs:progress-updated', { detail: normalized }))
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
    return raw ? normalizeCsSignalsMastery(JSON.parse(raw)) : {}
  } catch {
    return {}
  }
}

export function saveCsSignalsMastery(mastery: Record<string, boolean>): void {
  try {
    const normalized = normalizeCsSignalsMastery(mastery)
    setStorageItem(PROGRESS_STORAGE_KEYS.csSignals, JSON.stringify(normalized))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cs:signals-mastery-updated', { detail: normalized }))
    }
    notifyProgressChanged()
  } catch (err) {
    console.error('Failed to save CS signals mastery:', err)
  }
}
