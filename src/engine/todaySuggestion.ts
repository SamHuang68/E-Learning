import type { LangId } from '../utils/storage'

export type TodaySuggestion = {
  id: LangId
  reason: string
}

export type TodaySuggestionInput = {
  preferred: LangId | null
  dueByTrack: Partial<Record<LangId, number>>
  hasProgress: boolean
}

/**
 * Hub「今日建議」：到期複習 > 上次軌道 > 目錄起點。
 * 禁止依數學→微積分…掃第一個未完成軌。
 */
export function pickTodaySuggestion(input: TodaySuggestionInput): TodaySuggestion {
  const dueEntries = (Object.entries(input.dueByTrack) as Array<[LangId, number]>)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])

  if (dueEntries.length > 0) {
    const [id, count] = dueEntries[0]
    return { id, reason: `到期複習 ${count} 項` }
  }

  if (input.preferred) {
    return {
      id: input.preferred,
      reason: input.hasProgress ? '繼續上次軌道' : '你上次選擇的軌道',
    }
  }

  return { id: 'math', reason: '目錄起點（尚未選擇軌道）' }
}

export function dueCountBySrsItems(
  items: Record<string, { id?: string; dueAt?: string }>,
  now = new Date(),
): Partial<Record<LangId, number>> {
  const counts: Partial<Record<LangId, number>> = {}
  const nowMs = now.getTime()
  for (const item of Object.values(items)) {
    if (!item?.dueAt) continue
    const dueMs = Date.parse(item.dueAt)
    if (!Number.isFinite(dueMs) || dueMs > nowMs) continue
    const id = typeof item.id === 'string' ? item.id : ''
    const track: LangId | null = id.startsWith('ja:')
      ? 'ja'
      : id.startsWith('en:')
        ? 'en'
        : id.startsWith('zh:')
          ? 'zh'
          : null
    if (!track) continue
    counts[track] = (counts[track] ?? 0) + 1
  }
  return counts
}

export function dueCountFromFsrsMap(
  fsrs: Record<string, { dueAt?: string }> | undefined,
  now = new Date(),
): number {
  if (!fsrs) return 0
  const nowMs = now.getTime()
  return Object.values(fsrs).filter((item) => {
    if (!item?.dueAt) return false
    const dueMs = Date.parse(item.dueAt)
    return Number.isFinite(dueMs) && dueMs <= nowMs
  }).length
}
