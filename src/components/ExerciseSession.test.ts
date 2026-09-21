import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('practice answer field labels', () => {
  it('associates the shared fill-blank input with visible prompt ids', () => {
    const src = readFileSync(join(process.cwd(), 'src/components/ExerciseSession.tsx'), 'utf8')
    expect(src).toContain('id="exercise-fill-prompt"')
    expect(src).toContain('id="exercise-fill-stem"')
    expect(src).toContain('id="exercise-fill-answer"')
    expect(src).toContain('aria-labelledby="exercise-fill-prompt exercise-fill-stem"')
  })

  it('gives math fill practice a visible htmlFor label', () => {
    const src = readFileSync(join(process.cwd(), 'src/math/components/MathPractice.tsx'), 'utf8')
    expect(src).toContain('htmlFor="math-practice-answer"')
    expect(src).toContain('id="math-practice-answer"')
    expect(src).toContain("t('math.practice.answerLabel')")
  })
})

describe('SRS grade live region', () => {
  it('announces Good/Again outcomes with polite or assertive aria-live', () => {
    const src = readFileSync(join(process.cwd(), 'src/components/ExerciseSession.tsx'), 'utf8')
    expect(src).toContain("aria-live={feedback ? 'polite' : 'assertive'}")
    expect(src).toContain('aria-atomic="true"')
    expect(src).toContain('copy.srsGood')
    expect(src).toContain('copy.srsAgain')
    expect(src).toContain("srsGood: 'SRS Good'")
    expect(src).toContain("srsAgain: 'SRS Again'")
    expect(src).toContain('SRS Good（記住）')
    expect(src).toContain('SRS Again（再排）')
  })
})
