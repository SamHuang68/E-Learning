import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CAPITAL_TABLE, COLLOCATION_ROWS, FUNCTION_TABLE, NONFINITE_TABLE, NOTE_FOLDERS, PATTERN_TABLE, POS_TABLE, PREPOSITION_ROWS, PUNCTUATION_MARKS, SEMANTICS_TABLE, SOUND_TABLE, STUDY_STAGES, SYNTHESIS_SERIES, TENSE_ROWS, TRANSITION_TABLE } from './data/synthesisSeries'
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
    expect(PREPOSITION_ROWS.map((row) => row.relation.en)).toEqual(['Time', 'Place', 'Direction', 'Abstract'])
    expect(PUNCTUATION_MARKS.length).toBeGreaterThanOrEqual(9)
    expect(STUDY_STAGES.length).toBeGreaterThanOrEqual(5)
    expect(NOTE_FOLDERS.some((row) => row.zh.includes('假分數'))).toBe(true)
    expect(COLLOCATION_ROWS.some((row) => row.chunk === 'make a decision')).toBe(true)
    expect(POS_TABLE.rows.length).toBeGreaterThanOrEqual(8)
    expect(PATTERN_TABLE.rows).toHaveLength(5)
    expect(NONFINITE_TABLE.rows).toHaveLength(3)
    expect(TRANSITION_TABLE.rows).toHaveLength(4)
    expect(SOUND_TABLE.rows).toHaveLength(5)
    expect(FUNCTION_TABLE.rows).toHaveLength(8)
    expect(FUNCTION_TABLE.rows.some((row) => row.cells[2].en.includes('not a company template'))).toBe(true)
    expect(SEMANTICS_TABLE.rows.map((row) => row.id)).toEqual(['syn', 'ant', 'homo', 'poly', 'homonym', 'meta'])
    expect(SEMANTICS_TABLE.rows.some((row) => row.cells[2].zh.includes('完全相同'))).toBe(true)
    expect(CAPITAL_TABLE.rows).toHaveLength(4)
    expect(translate('zh-Hant', 'en.synthesis.honesty')).toMatch(/不是多益分數/)
    expect(translate('en', 'en.synthesis.honesty')).toMatch(/Not a TOEIC score/)
    const view = readFileSync(join(process.cwd(), 'src/toeic/components/ToeicSynthesisSeries.tsx'), 'utf8')
    expect(view).toContain('scope="col"')
    expect(view).toContain('scope="row"')
    expect(view).toContain("t('en.synthesis.honesty')")
  })
})
