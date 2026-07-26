import { itemKey } from '../data/contentPack'
import type { SpeakableCard, UnitPractice } from '../data/practiceTypes'
import type { LearningMeta } from '../utils/storage'
import { buildDailyQueue } from './srs'

type Track = 'ja' | 'en'

export function srsProgressPct(
  allIds: string[],
  items: LearningMeta['items'],
  fallbackPct: number,
): number {
  if (allIds.length === 0) return fallbackPct
  const states = allIds.map((id) => items[id]).filter(Boolean)
  if (states.length === 0) return fallbackPct

  const seenPct = (states.filter((item) => item.seen > 0).length / allIds.length) * 100
  const masteredPct =
    (states.filter((item) => item.intervalDays >= 1).length / allIds.length) * 100
  return Math.round(Math.max(fallbackPct, seenPct * 0.35 + masteredPct * 0.65))
}

export function buildReviewQueueWithForced(opts: {
  allIds: string[]
  meta: LearningMeta
}): { reviews: string[]; news: string[]; queue: string[]; forced: string[] } {
  const unitIds = new Set(opts.allIds)
  const forced = unique(opts.meta.forcedReviewIds.filter((id) => unitIds.has(id)))
  const base = buildDailyQueue({
    allIds: opts.allIds,
    items: opts.meta.items,
    newLimit: opts.meta.dailyGoalCards,
  })
  const reviews = unique([
    ...forced,
    ...base.reviews.filter((id) => !forced.includes(id)),
  ])
  const news = base.news.filter((id) => !reviews.includes(id))

  return {
    forced,
    reviews,
    news,
    queue: [...reviews, ...news],
  }
}

export function weakTagsToReviewIds(
  track: Track,
  pack: UnitPractice | null,
  weakTags: string[],
): string[] {
  if (!pack || weakTags.length === 0) return []
  const normalizedTags = weakTags.map(normalizeTag).filter(Boolean)
  if (normalizedTags.length === 0) return []

  const matched = [
    ...cardsForSection(pack, normalizedTags),
    ...allCards(pack).filter((card) => matchesCardTags(card, normalizedTags)),
  ]

  return unique(matched.map((card) => itemKey(track, card.id)))
}

export function addForcedReviewIds(
  meta: LearningMeta,
  ids: string[],
  limit = 60,
): LearningMeta {
  return {
    ...meta,
    forcedReviewIds: unique([...ids, ...meta.forcedReviewIds]).slice(0, limit),
  }
}

export function clearForcedReviewIds(meta: LearningMeta, ids: string[]): LearningMeta {
  if (ids.length === 0) return meta
  const remove = new Set(ids)
  return {
    ...meta,
    forcedReviewIds: meta.forcedReviewIds.filter((id) => !remove.has(id)),
  }
}

function cardsForSection(pack: UnitPractice, tags: string[]): SpeakableCard[] {
  const cards: SpeakableCard[] = []
  if (tags.some((tag) => ['vocab', 'word', 'words'].includes(tag))) {
    cards.push(...pack.vocab)
  }
  if (tags.some((tag) => ['grammar', 'part5', 'part 5'].includes(tag))) {
    cards.push(...pack.grammar)
  }
  if (tags.some((tag) => ['reading', 'listening'].includes(tag))) {
    cards.push(...pack.passage)
  }
  return cards
}

function matchesCardTags(card: SpeakableCard, tags: string[]): boolean {
  const haystack = [
    card.head,
    card.meaning,
    card.sentence,
    card.sentenceZh,
    card.scenario,
    card.register,
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase()
  return tags.some((tag) => haystack.includes(tag))
}

function allCards(pack: UnitPractice): SpeakableCard[] {
  return [...pack.vocab, ...pack.passage, ...pack.grammar]
}

function normalizeTag(tag: string): string {
  return tag.trim().toLocaleLowerCase()
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)]
}
