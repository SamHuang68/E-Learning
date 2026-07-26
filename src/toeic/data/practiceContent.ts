import type { UnitPractice } from '../../data/practiceTypes'
import { ensureUnitDepth } from '../../data/practice/expandUnit'
import { orangePractice } from './practice/orange'
import { greenPractice } from './practice/green'
import { bluePractice } from './practice/blue'
import { goldPractice } from './practice/gold'

const baseToeicPracticeContent: Record<string, UnitPractice> = {
  ...orangePractice,
  ...greenPractice,
  ...bluePractice,
  ...goldPractice,
}

export const toeicPracticeContent: Record<string, UnitPractice> = Object.fromEntries(
  Object.entries(baseToeicPracticeContent).map(([key, pack]) => [
    key,
    ensureUnitDepth(key, pack, { vocab: 40, passage: 12, grammar: 10 }),
  ]),
)

export function getToeicPractice(certId: string, unitId: number): UnitPractice | null {
  return toeicPracticeContent[`${certId}:${unitId}`] ?? null
}
