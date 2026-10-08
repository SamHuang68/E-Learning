import { describe, expect, it } from 'vitest'
import appSource from '../MathApp.tsx?raw'
import practiceSource from './MathPractice.tsx?raw'
import todaySource from './MathToday.tsx?raw'

describe('localized math grade boundary', () => {
  it('does not send already-localized grade and unit fields back through the strict source translator', () => {
    const combined = [appSource, todaySource, practiceSource].join('\n')

    expect(combined).not.toMatch(/mathTeachingCopy\(locale,\s*gradeInfo\.(?:band|description|targetExam)\)/)
    expect(combined).not.toMatch(/mathTeachingCopy\(locale,\s*(?:currentUnit|unit|u)\.(?:title|subtitle)\)/)
    expect(combined).not.toMatch(/mathTeachingCopy\(locale,\s*(?:concept|lab\.(?:name|description))\)/)
  })

  it('continues localizing raw grade-list and fixed chrome strings at their source boundary', () => {
    expect(appSource).toContain("mathTeachingCopy(locale, g.band)")
    expect(appSource).toContain("mathTeachingCopy(locale, '返回課程')")
    expect(todaySource).toContain("mathTeachingCopy(locale, '開啟教具 →')")
  })
})
