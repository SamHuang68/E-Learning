import { itemKey } from '../data/contentPack'
import { loadLearningMeta, recordActivity, saveLearningMeta } from '../utils/storage'
import { track } from './analytics'
import { unlockAchievements } from './habits'
import { defaultItemState, reviewItem } from './srs'

export type ExerciseItemResult = {
  id: string
  cardId: string
  correct: boolean
}

export type ExerciseSessionResult = {
  correct: number
  total: number
  itemResults: ExerciseItemResult[]
}

export function applyExerciseSessionResult(
  result: ExerciseSessionResult,
  opts: {
    track: 'ja' | 'en'
    kind: string
    review?: boolean
  },
): { correctCards: number; answeredCards: number } {
  const now = new Date()
  const meta = loadLearningMeta()
  const items = { ...meta.items }

  for (const item of result.itemResults) {
    const id = itemKey(opts.track, item.cardId)
    items[id] = reviewItem(
      items[id] ?? defaultItemState(id),
      item.correct ? 'good' : 'again',
      now,
    )
  }

  saveLearningMeta({
    ...meta,
    items,
  })

  const withActivity = recordActivity(result.itemResults.length)
  saveLearningMeta(unlockAchievements(withActivity))

  for (const item of result.itemResults) {
    track('item_answer', {
      track: opts.track,
      kind: opts.kind,
      cardId: item.cardId,
      itemId: itemKey(opts.track, item.cardId),
      exerciseId: item.id,
      correct: item.correct,
      grade: item.correct ? 'good' : 'again',
      review: Boolean(opts.review),
    })
  }

  track('review_complete', {
    track: opts.track,
    kind: opts.kind,
    review: Boolean(opts.review),
    correct: result.correct,
    total: result.total,
    answered: result.itemResults.length,
  })

  return {
    correctCards: new Set(
      result.itemResults
        .filter((item) => item.correct)
        .map((item) => item.cardId),
    ).size,
    answeredCards: new Set(result.itemResults.map((item) => item.cardId)).size,
  }
}
