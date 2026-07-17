export type SrsGrade = 'again' | 'hard' | 'good' | 'easy'

export type ItemState = {
  id: string
  ease: number
  intervalDays: number
  dueAt: string
  correctStreak: number
  seen: number
  lastResult?: SrsGrade
  lapses: number
}

const DEFAULT_EASE = 2.5
const MIN_EASE = 1.3
const AGAIN_INTERVAL_DAYS = 0.01
const DAY_MS = 24 * 60 * 60 * 1000

function addDays(now: Date, days: number): string {
  return new Date(now.getTime() + days * DAY_MS).toISOString()
}

export function defaultItemState(id: string): ItemState {
  return {
    id,
    ease: DEFAULT_EASE,
    intervalDays: 0,
    dueAt: new Date(0).toISOString(),
    correctStreak: 0,
    seen: 0,
    lapses: 0,
  }
}

export function reviewItem(
  state: ItemState,
  grade: SrsGrade,
  now = new Date(),
): ItemState {
  const ease = Number.isFinite(state.ease) ? state.ease : DEFAULT_EASE
  const intervalDays = Number.isFinite(state.intervalDays)
    ? Math.max(0, state.intervalDays)
    : 0
  const correctStreak = Number.isFinite(state.correctStreak)
    ? Math.max(0, Math.floor(state.correctStreak))
    : 0
  const seen = Number.isFinite(state.seen) ? Math.max(0, Math.floor(state.seen)) : 0
  const lapses = Number.isFinite(state.lapses)
    ? Math.max(0, Math.floor(state.lapses))
    : 0

  let nextEase = ease
  let nextInterval = intervalDays
  let nextStreak = correctStreak
  let nextLapses = lapses

  switch (grade) {
    case 'again':
      nextInterval = AGAIN_INTERVAL_DAYS
      nextEase = Math.max(MIN_EASE, ease - 0.2)
      nextStreak = 0
      nextLapses += 1
      break
    case 'hard':
      nextInterval = Math.max(1, intervalDays * 1.2)
      nextEase = Math.max(MIN_EASE, ease - 0.15)
      break
    case 'good':
      nextInterval =
        correctStreak === 0
          ? 1
          : correctStreak === 1
            ? 3
            : Math.max(1, intervalDays * ease)
      nextStreak = correctStreak + 1
      break
    case 'easy':
      nextInterval =
        correctStreak === 0 ? 2 : Math.max(1, intervalDays * ease * 1.3)
      nextEase = ease + 0.15
      nextStreak = correctStreak + 1
      break
  }

  return {
    ...state,
    ease: nextEase,
    intervalDays: nextInterval,
    dueAt: addDays(now, nextInterval),
    correctStreak: nextStreak,
    seen: seen + 1,
    lastResult: grade,
    lapses: nextLapses,
  }
}

export function isDue(state: ItemState, now = new Date()): boolean {
  return new Date(state.dueAt).getTime() <= now.getTime()
}

export function getDueItems(
  items: Record<string, ItemState>,
  now = new Date(),
): ItemState[] {
  return Object.values(items)
    .filter((item) => isDue(item, now))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
}

export function getNewItemIds(
  allIds: string[],
  items: Record<string, ItemState>,
  limit: number,
): string[] {
  return allIds.filter((id) => !items[id]).slice(0, Math.max(0, limit))
}

export function buildDailyQueue(opts: {
  allIds: string[]
  items: Record<string, ItemState>
  newLimit?: number
  reviewLimit?: number
  now?: Date
}): { reviews: string[]; news: string[]; queue: string[] } {
  const reviewLimit = opts.reviewLimit ?? 100
  const newLimit = opts.newLimit ?? 20
  const reviews = getDueItems(opts.items, opts.now)
    .slice(0, Math.max(0, reviewLimit))
    .map((item) => item.id)
  const news = getNewItemIds(opts.allIds, opts.items, newLimit)

  return {
    reviews,
    news,
    queue: [...reviews, ...news],
  }
}
