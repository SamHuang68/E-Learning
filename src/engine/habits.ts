import type { LearningMeta } from '../utils/storage'

export function todayKey(d = new Date()): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function previousDayKey(today: string): string | null {
  const parts = today.split('-').map(Number)
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    return null
  }
  const [year, month, day] = parts
  return todayKey(new Date(year, month - 1, day - 1))
}

export function nextStreak(
  prevStreak: number,
  lastActiveDate: string | null,
  today: string,
): number {
  if (lastActiveDate === today) return Math.max(1, prevStreak)
  if (lastActiveDate === previousDayKey(today)) return Math.max(0, prevStreak) + 1
  return 1
}

export function dailyProgress(
  meta: LearningMeta,
): { done: number; goal: number; pct: number } {
  const goal = Math.max(1, meta.dailyGoalCards)
  const done =
    meta.dailyDoneDate === todayKey() ? Math.max(0, meta.dailyDoneCards) : 0
  return {
    done,
    goal,
    pct: Math.min(100, Math.round((done / goal) * 100)),
  }
}

export const ACHIEVEMENTS: {
  id: string
  title: string
  test: (meta: LearningMeta) => boolean
}[] = [
  {
    id: 'first-card',
    title: 'First card reviewed',
    test: (meta) => meta.dailyDoneCards > 0 || Object.keys(meta.items).length > 0,
  },
  {
    id: 'daily-goal',
    title: 'Daily goal reached',
    test: (meta) => dailyProgress(meta).pct >= 100,
  },
  {
    id: 'streak-3',
    title: '3-day streak',
    test: (meta) => meta.streak >= 3,
  },
  {
    id: 'streak-7',
    title: '7-day streak',
    test: (meta) => meta.streak >= 7,
  },
  {
    id: 'kanji-10',
    title: '10 kanji mastered',
    test: (meta) => meta.kanjiMastered.length >= 10,
  },
  {
    id: 'speaking-5',
    title: '5 speaking drills completed',
    test: (meta) => meta.speakingDone >= 5,
  },
]

export function unlockAchievements(meta: LearningMeta): LearningMeta {
  const unlocked = new Set(meta.achievements)
  for (const achievement of ACHIEVEMENTS) {
    if (achievement.test(meta)) unlocked.add(achievement.id)
  }
  return {
    ...meta,
    achievements: [...unlocked],
  }
}

/**
 * 計算今日待複習卡片與記憶保鮮狀態摘要
 */
export function computeDueReviewSummary(
  items: Record<string, { due?: string; repetitions?: number }>,
  now = new Date(),
): { dueCount: number; freshCount: number; totalCount: number; urgencyLevel: 'low' | 'medium' | 'high' } {
  const nowIso = now.toISOString()
  let dueCount = 0
  let freshCount = 0
  const entries = Object.values(items)
  const totalCount = entries.length

  for (const item of entries) {
    if (item.due && item.due <= nowIso) {
      dueCount++
    } else {
      freshCount++
    }
  }

  const urgencyLevel: 'low' | 'medium' | 'high' =
    dueCount >= 10 ? 'high' : dueCount >= 3 ? 'medium' : 'low'

  return { dueCount, freshCount, totalCount, urgencyLevel }
}
