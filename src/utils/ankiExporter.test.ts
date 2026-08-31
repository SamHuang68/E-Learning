import { describe, it, expect } from 'vitest'
import { exportToAnkiCsv, type AnkiCard } from './ankiExporter'

describe('Anki Exporter Module', () => {
  it('should format cards into RFC4180 CSV with Anki headers', () => {
    const cards: AnkiCard[] = [
      {
        front: 'get back to you',
        back: '確認之後再回覆你',
        tags: 'TOEIC Business_Chunks',
      },
      {
        front: '〜ておく',
        back: '事先準備',
        tags: 'Aoba Japanese_Grammar',
      },
    ]

    const csv = exportToAnkiCsv(cards)
    expect(csv).toContain('#separator:Comma')
    expect(csv).toContain('#html:true')
    expect(csv).toContain('"get back to you"')
    expect(csv).toContain('"確認之後再回覆你"')
    expect(csv).toContain('"〜ておく"')
  })

  it('should escape double quotes in cards properly', () => {
    const cards: AnkiCard[] = [
      {
        front: 'He said "hello"',
        back: '他說「你好」',
        tags: 'Quotes',
      },
    ]
    const csv = exportToAnkiCsv(cards)
    expect(csv).toContain('"He said ""hello"""')
  })

  it('should generate valid tags and HTML for error vault questions', () => {
    const cards: AnkiCard[] = [
      {
        front: '<div>[物理 錯題] 拋體運動</div>',
        back: '<div>解題步驟：v_y = v0 sinθ - gt</div>',
        tags: '物理_Error_Vault E_Learning',
      },
    ]
    const csv = exportToAnkiCsv(cards)
    expect(csv).toContain('物理_Error_Vault')
    expect(csv).toContain('v_y = v0 sinθ - gt')
  })
})
