import type { UnitPractice } from '../../data/practiceTypes'
import { orangePractice } from './practice/orange'
import { greenPractice } from './practice/green'
import { bluePractice } from './practice/blue'
import { goldPractice } from './practice/gold'
import { bluePracticeMeaningEn } from './practice/blueEnglish'
import { goldPracticeMeaningEn } from './practice/goldEnglish'
import { greenPracticeMeaningEn } from './practice/greenEnglish'
import { orangePracticeMeaningEn } from './practice/orangeEnglish'

export const toeicPracticeMeaningEn: Readonly<Record<string, string>> = Object.freeze({
  ...orangePracticeMeaningEn,
  ...greenPracticeMeaningEn,
  ...bluePracticeMeaningEn,
  ...goldPracticeMeaningEn,
})

export const toeicPracticeContent: Record<string, UnitPractice> = {
  ...orangePractice,
  ...greenPractice,
  ...bluePractice,
  ...goldPractice,
}

export function getToeicPractice(certId: string, unitId: number): UnitPractice | null {
  return toeicPracticeContent[`${certId}:${unitId}`] ?? null
}
