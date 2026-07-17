import type { UnitPractice } from './practiceTypes'

export function itemKey(track: 'ja' | 'en', cardId: string): string {
  return `${track}:${cardId}`
}

export function collectUnitCardIds(pack: UnitPractice): string[] {
  return [...pack.vocab, ...pack.passage, ...pack.grammar].map((card) => card.id)
}

export function packCounts(pack: UnitPractice): {
  words: number
  passage: number
  grammar: number
} {
  return {
    words: pack.vocab.length,
    passage: pack.passage.length,
    grammar: pack.grammar.length,
  }
}

export function alignUnitMeta<
  T extends { words: number; reading?: number; listening?: number },
>(unit: T, pack: UnitPractice | null): T {
  if (!pack) return unit

  const next: T = {
    ...unit,
    words: pack.vocab.length,
  }

  if ('reading' in next) {
    return {
      ...next,
      reading: pack.passage.length,
    } as T
  }

  if ('listening' in next) {
    return {
      ...next,
      listening: pack.passage.length,
    } as T
  }

  return next
}
