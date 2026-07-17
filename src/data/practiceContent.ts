import type { UnitPractice } from './practiceTypes'
import { ensureUnitDepth } from './practice/expandUnit'
import { n5n4Practice } from './practice/n5n4'
import { n3Practice } from './practice/n3'
import { n2n1Practice } from './practice/n2n1'

const baseJaPracticeContent: Record<string, UnitPractice> = {
  ...n5n4Practice,
  ...n3Practice,
  ...n2n1Practice,
}

export const jaPracticeContent: Record<string, UnitPractice> = Object.fromEntries(
  Object.entries(baseJaPracticeContent).map(([key, pack]) => [
    key,
    ensureUnitDepth(key, pack, { vocab: 40, passage: 8, grammar: 10 }),
  ]),
)

export function getJaPractice(
  levelId: string,
  unitId: number,
): UnitPractice | null {
  return jaPracticeContent[`${levelId}:${unitId}`] ?? null
}
