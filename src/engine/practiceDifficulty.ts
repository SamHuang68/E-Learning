import type { PracticeRegister } from '../data/practiceTypes'
import type { IrtItem } from './adaptive'

/** Catalog band for routing. Not a fitted IRT b, not an exam or fluency score. */
export type PracticeDifficultyTag = 'intro' | 'core' | 'stretch'

const REGISTER_BAND: Record<PracticeRegister, PracticeDifficultyTag> = {
  casual: 'intro',
  polite: 'intro',
  business: 'core',
  sonkeigo: 'stretch',
  kenjougo: 'stretch',
}

const STRETCH_KINDS = new Set(['orderWords', 'passageQuiz'])

export function normalizePracticeDifficultyTag(
  register: PracticeRegister,
  kind: string,
): PracticeDifficultyTag {
  const base = REGISTER_BAND[register]
  if (base === 'stretch') return 'stretch'
  if (STRETCH_KINDS.has(kind) && base === 'intro') return 'core'
  if (STRETCH_KINDS.has(kind) && base === 'core') return 'stretch'
  return base
}

/** Map a teaching tag to a coarse IRT b hint for CAT routing only. */
export function practiceDifficultyIrtHint(tag: PracticeDifficultyTag): number {
  switch (tag) {
    case 'intro':
      return -1
    case 'core':
      return 0
    case 'stretch':
      return 1
  }
}

export function exerciseToIrtRoutingItem(input: {
  id: string
  difficultyTag: PracticeDifficultyTag
  tags?: string[]
}): IrtItem {
  return {
    id: input.id,
    difficulty: practiceDifficultyIrtHint(input.difficultyTag),
    tags: input.tags,
  }
}
