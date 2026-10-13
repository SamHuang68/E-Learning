import type { AudioLessonSegment } from './audioLessonTypes'
import { LOCAL_PREFERENCE_KEYS } from './progressKeys'

type Position = { lessonId: string; segmentKey: string }
const key = LOCAL_PREFERENCE_KEYS.audioLessonPosition
const limit = 50

function segmentKey(segment: AudioLessonSegment): string {
  return JSON.stringify([segment.id, segment.text, segment.lang, segment.kind, segment.audioSrc ?? null])
}

function parsePositions(raw: string | null): Position[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw ?? 'null')
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  const seen = new Set<string>()
  return parsed.filter((value): value is Position => {
    if (!value || typeof value !== 'object' || Array.isArray(value)
      || typeof value.lessonId !== 'string' || !value.lessonId
      || typeof value.segmentKey !== 'string' || !value.segmentKey
      || seen.has(value.lessonId)) return false
    seen.add(value.lessonId)
    return true
  }).slice(0, limit).map(({ lessonId, segmentKey }) => ({ lessonId, segmentKey }))
}

/** 僅還原目前練習目標，不代表已完成、播放秒數或循環輪次。讀取不寫回。 */
export function loadAudioLessonPosition(lessonId: string, items: AudioLessonSegment[]): number | null {
  try {
    const saved = parsePositions(localStorage.getItem(key)).find((position) => position.lessonId === lessonId)
    if (!saved) return null
    let match: number | null = null
    for (let index = 0; index < items.length; index += 1) {
      if (segmentKey(items[index]) !== saved.segmentKey) continue
      if (match !== null) return null
      match = index
    }
    return match
  } catch {
    return null
  }
}

/** 最近寫入的課程置前；只保存本瀏覽器位置，不觸發學習進度同步。 */
export function saveAudioLessonPosition(lessonId: string, segment: AudioLessonSegment): boolean {
  if (!lessonId) return false
  try {
    // 讀取遭拒必須停止，避免用空資料覆蓋不可讀的其他課程。
    const positions = parsePositions(localStorage.getItem(key))
    const next = [{ lessonId, segmentKey: segmentKey(segment) }, ...positions.filter((position) => position.lessonId !== lessonId)]
    localStorage.setItem(key, JSON.stringify(next.slice(0, limit)))
    return true
  } catch {
    return false
  }
}

/** 只清除此課位置；保留其他項目，不觸發學習進度同步。 */
export function clearAudioLessonPosition(lessonId: string): boolean {
  if (!lessonId) return false
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return true
    const positions: unknown = JSON.parse(raw)
    if (!Array.isArray(positions)) return false
    // 清除不順便修剪、去重或整理其他課程的資料。
    const next = positions.filter((position: unknown) => !position || typeof position !== 'object'
      || Array.isArray(position) || !('lessonId' in position) || position.lessonId !== lessonId)
    if (next.length === positions.length) return true
    localStorage.setItem(key, JSON.stringify(next))
    return true
  } catch {
    return false
  }
}
