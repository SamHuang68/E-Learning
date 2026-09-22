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
    expect(src).toContain('aria-invalid={feedback === false}')
    expect(src).toContain("aria-errormessage={feedback === false ? 'exercise-grade-status' : undefined}")
    expect(src).toContain('id="exercise-grade-status"')
  })

  it('gives math fill practice a visible htmlFor label', () => {
    const src = readFileSync(join(process.cwd(), 'src/math/components/MathPractice.tsx'), 'utf8')
    expect(src).toContain('htmlFor="math-practice-answer"')
    expect(src).toContain('id="math-practice-answer"')
    expect(src).toContain("t('math.practice.answerLabel')")
    expect(src).toContain('aria-invalid={submitted && !isCorrect}')
    expect(src).toContain("aria-errormessage={submitted && !isCorrect ? 'math-practice-grade' : undefined}")
    expect(src).toContain('id="math-practice-grade"')
  })
})

describe('SRS grade live region', () => {
  it('announces Good/Again outcomes with polite aria-live', () => {
    const src = readFileSync(join(process.cwd(), 'src/components/ExerciseSession.tsx'), 'utf8')
    expect(src).toContain('aria-live="polite"')
    expect(src).toContain('aria-atomic="true"')
    expect(src).toContain('copy.srsGood')
    expect(src).toContain('copy.srsAgain')
    expect(src).toContain("srsGood: 'SRS Good'")
    expect(src).toContain("srsAgain: 'SRS Again'")
    expect(src).toContain('SRS Good（記住）')
    expect(src).toContain('SRS Again（再排）')
  })
})

describe('practice error/empty not color-only', () => {
  it('pairs graded choices and empty state with text marks', () => {
    const src = readFileSync(join(process.cwd(), 'src/components/ExerciseSession.tsx'), 'utf8')
    expect(src).toContain('choice-result-mark')
    expect(src).toContain("className={feedback ? 'status-line' : 'status-line warn'}")
    expect(src).toContain('copy.markCorrect')
    expect(src).toContain('copy.markWrong')
    expect(src).toContain('copy.emptyLead')
    expect(src).toContain("markCorrect: '正解'")
    expect(src).toContain("markCorrect: 'Correct choice'")
    expect(src).toContain("markWrong: '不是這項'")
    expect(src).toContain("markWrong: 'Not this one'")
  })
})
