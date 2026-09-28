import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { SYNTHESIS_SERIES, TENSE_ROWS } from './data/synthesisSeries'
import { translate } from '../i18n/messages'

describe('TOEIC synthesis series', () => {
  it('keeps eight teaching series and a tense grid without a score claim', () => {
    expect(SYNTHESIS_SERIES).toHaveLength(8)
    expect(SYNTHESIS_SERIES.map((item) => item.id)).toEqual([
      'pos',
      'syntax',
      'verbal',
      'mechanics',
      'lexicon',
      'sound',
      'semantics',
      'function',
    ])
    expect(TENSE_ROWS).toHaveLength(4)
    expect(TENSE_ROWS[0]?.cells).toHaveLength(4)
    expect(translate('zh-Hant', 'en.synthesis.honesty')).toMatch(/不是多益分數/)
    expect(translate('en', 'en.synthesis.honesty')).toMatch(/Not a TOEIC score/)
    const view = readFileSync(join(process.cwd(), 'src/toeic/components/ToeicSynthesisSeries.tsx'), 'utf8')
    expect(view).toContain('scope="col"')
    expect(view).toContain('scope="row"')
    expect(view).toContain("t('en.synthesis.honesty')")
  })
})
