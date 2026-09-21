import type { UnitPractice } from './practiceTypes'
import { n5n4Practice } from './practice/n5n4'
import { n3Practice } from './practice/n3'
import { n2n1Practice } from './practice/n2n1'
import { validateUnitPractice } from './practiceTypes'

export const jaPracticeContent: Record<string, UnitPractice> = {
  ...n5n4Practice,
  ...n3Practice,
  ...n2n1Practice,
}

// Harden: validate every practice pack at load time against strict schema
for (const [key, pack] of Object.entries(jaPracticeContent)) {
  validateUnitPractice(pack, key)
}

export function getJaPractice(
  levelId: string,
  unitId: number,
): UnitPractice | null {
  return jaPracticeContent[`${levelId}:${unitId}`] ?? null
}
