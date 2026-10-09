import { describe, expect, it } from 'vitest'
import { checkExcerpt, exportAudioCheck, recordCheckPhase, type AudioCheck } from './語音檢查'

const check: AudioCheck = { startedAt: 1000, rate: 0.7, isCheck: true, phase: 'preparing',
  source: null, error: null, heard: null, started: false, events: [] }

describe('語音檢查的節錄與資料界線', () => {
  it.each([['ja-JP', 'こんにちは。次の文です。', 'こんにちは。'], ['zh-TW', '你好。下一句。', '你好。']] as const)(
    '%s 句號後無空白仍只取第一句', (lang, text, expected) => {
      expect(checkExcerpt({ id: 'one', lang, kind: 'example', text })?.text).toBe(expected)
    },
  )
  it('保留語言與來源識別，只試播第一句，不誤播整段音檔', () => {
    expect(checkExcerpt({ id: 'one', lang: 'ja-JP', kind: 'explanation', text: 'こんにちは。 次の文です。', audioSrc: 'private.mp3' }))
      .toEqual({ id: 'one', lang: 'ja-JP', kind: 'example', text: 'こんにちは。' })
  })
  it('空文字不產生試播；長句有界且不切斷 Unicode 字元', () => {
    expect(checkExcerpt({ id: 'one', lang: 'zh-TW', kind: 'example', text: '  ' })).toBeNull()
    const sample = checkExcerpt({ id: 'one', lang: 'zh-TW', kind: 'example', text: '𠮷'.repeat(200) })!
    expect(Array.from(sample.text)).toHaveLength(160)
    expect(sample.text).toBe('𠮷'.repeat(160))
  })
  it('英語長句不截斷最後一個單字', () => {
    const sample = checkExcerpt({ id: 'one', lang: 'en-US', kind: 'example', text: 'word '.repeat(60) })!
    expect(sample.text.length).toBeLessThanOrEqual(160)
    expect(sample.text.endsWith('word')).toBe(true)
  })
  it('播放完成不等於使用者聽到；紀錄最多保留十六筆', () => {
    let current = recordCheckPhase(check, 'playing', 1200)
    for (let index = 0; index < 30; index++) current = recordCheckPhase(current, 'complete', 1400 + index)
    expect(current.started).toBe(true)
    expect(current.heard).toBeNull()
    expect(current.events).toHaveLength(16)
    expect(current.events.at(-1)).toEqual({ elapsedMs: 429, phase: 'complete' })
  })
  it('匯出明列欄位，排除教材、帳號、網址與未宣告欄位', () => {
    const report = exportAudioCheck({ ...check,
      source: { kind: 'speech', lang: 'en-US', voice: { name: 'x'.repeat(200), lang: 'en-US', localService: null } },
      text: 'private lesson', account: 'private account', audioSrc: 'https://private.example',
      events: [{ elapsedMs: 10, phase: 'playing', secret: 'private event' }],
    } as unknown as AudioCheck)
    expect(report).not.toContain('private')
    expect(JSON.parse(report).source.voice.name).toHaveLength(128)
    expect(JSON.parse(report).source.voice.localService).toBeNull()
    expect(JSON.parse(report).heard).toBeNull()
    expect(JSON.parse(report).events).toEqual([{ elapsedMs: 10, phase: 'playing' }])
  })
})
