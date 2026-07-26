import {
  loadLearningMeta,
  saveLearningMeta,
  type LearningMeta,
} from '../utils/storage'

export type LearningTrack = 'ja' | 'en'

export function isPro(meta: LearningMeta): boolean {
  return meta.proUnlocked
}

export function canAccessUnit(
  meta: LearningMeta,
  track: LearningTrack,
  levelOrCert: string,
  unitId?: number | string,
): boolean {
  if (isPro(meta)) return true

  // Free tier: foundation content plus the first 2 units of the starter track.
  if (track === 'ja') {
    if (levelOrCert === 'kana' || unitId === 'kana') return true
    return levelOrCert === 'n5n4' && Number(unitId) >= 1 && Number(unitId) <= 2
  }

  if (levelOrCert === 'phonics' || unitId === 'phonics') return true
  return levelOrCert === 'orange' && Number(unitId) >= 1 && Number(unitId) <= 2
}

export function unlockPro(code?: string): boolean {
  const accepted = code === undefined || code.trim() === '' || code.trim() === 'AOBA-PRO'
  if (!accepted) return false

  try {
    const meta = loadLearningMeta()
    saveLearningMeta({ ...meta, proUnlocked: true })
  } catch {
    // Demo unlock should not crash non-browser tests or private browsing contexts.
  }
  return true
}

export function startCheckout(): boolean {
  try {
    if (typeof window === 'undefined') return false
    window.open('https://example.com/aoba-pro-stripe-coming-soon', '_blank', 'noopener,noreferrer')
    return true
  } catch {
    return false
  }
}
