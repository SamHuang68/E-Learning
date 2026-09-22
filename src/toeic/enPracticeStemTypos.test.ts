import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const STEM_FILES = [
  'src/toeic/data/practice/orange.ts',
  'src/toeic/data/practice/green.ts',
  'src/toeic/data/practice/blue.ts',
  'src/toeic/data/practice/gold.ts',
  'src/data/placement/en.ts',
  'src/data/mock/en.ts',
] as const

describe('EN practice stem typo sweep', () => {
  it('fixes reported-speech head, blank punctuation, and leading spaces', () => {
    const blob = STEM_FILES.map((file) => readFileSync(join(process.cwd(), file), 'utf8')).join('\n')
    expect(blob).toContain("head: 'Reported speech'")
    expect(blob).not.toContain("head: 'Report speech'")
    expect(blob).not.toMatch(/means ___ \./)
    expect(blob).not.toMatch(/meaning: ' /)
  })
})
