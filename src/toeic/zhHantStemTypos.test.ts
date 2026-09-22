import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const STEM_FILES = [
  'src/toeic/data/practice/orange.ts',
  'src/toeic/data/practice/green.ts',
  'src/toeic/data/practice/blue.ts',
  'src/toeic/data/practice/gold.ts',
  'src/data/practice/n5n4.ts',
  'src/data/practice/n3.ts',
  'src/data/practice/n2n1.ts',
] as const

describe('zh-Hant practice stem typo sweep', () => {
  it('uses 時間, 身分, and 週 in practice stems', () => {
    const blob = STEM_FILES.map((file) => readFileSync(join(process.cwd(), file), 'utf8')).join('\n')
    expect(blob).toContain('請告知您下週有空的時間。')
    expect(blob).toContain("meaning: '身分確認'")
    expect(blob).toContain('延到下週。')
    expect(blob).not.toContain('的时间。')
    expect(blob).not.toContain("meaning: '身份確認'")
    expect(blob).not.toContain('延到下周。')
  })
})
