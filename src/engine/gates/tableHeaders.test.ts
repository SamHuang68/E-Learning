import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('practice table headers', () => {
  it('gives SignalDecisionView and ToeicStoryReview th/scope', () => {
    const ja = readFileSync(join(process.cwd(), 'src/aoba/components/SignalDecisionView.tsx'), 'utf8')
    expect(ja).toContain('<th scope="col">句型 Pattern</th>')
    expect(ja).toContain('<th scope="row" className="pattern-cell">')

    const toeic = readFileSync(join(process.cwd(), 'src/toeic/components/ToeicStoryReview.tsx'), 'utf8')
    expect(toeic).toContain('<th scope="col">Chunk 核心語塊</th>')
    expect(toeic).toContain('<th scope="row" className="chunk-name-cell">')
  })
})
