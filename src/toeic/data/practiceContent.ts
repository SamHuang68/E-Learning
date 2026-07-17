import type { UnitPractice } from '../../data/practiceTypes'
import { orangePractice } from './practice/orange'
import { greenPractice } from './practice/green'
import { bluePractice } from './practice/blue'
import { goldPractice } from './practice/gold'

export const toeicPracticeContent: Record<string, UnitPractice> = {
  ...orangePractice,
  ...greenPractice,
  ...bluePractice,
  ...goldPractice,
}

export function getToeicPractice(certId: string, unitId: number): UnitPractice | null {
  return toeicPracticeContent[`${certId}:${unitId}`] ?? null
}
