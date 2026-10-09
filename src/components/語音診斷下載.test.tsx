import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { AudioCheckPanel } from './語音檢查面板'
import type { AudioCheck } from '../utils/語音檢查'
import { exportAudioCheck } from '../utils/語音檢查'

const check: AudioCheck = {
  startedAt: Date.UTC(2026, 9, 9, 12, 34, 56), rate: 0.7, isCheck: true,
  phase: 'complete', source: null, error: null, heard: null, started: true,
  events: [{ elapsedMs: 1200, phase: 'complete' }],
}

function render(en: boolean, attempt: AudioCheck | null = check) {
  return renderToStaticMarkup(<AudioCheckPanel en={en} check={attempt} samples={[]}
    canPlay={() => false} languageName={() => ''} onPlay={() => {}}
    onRefresh={() => {}} onHeard={() => {}} />)
}

describe('語音診斷下載', () => {
  it('未開始嘗試或診斷被清除時不提供空白或舊下載', () => {
    expect(render(false, null)).not.toContain('download=')
    expect(render(true, null)).not.toContain('data:application/json')
  })

  it.each(['preparing', 'stopped', 'error'] as const)('%s 匯出目前快照，不自行宣稱播放或下載成功', (phase) => {
    const attempt = { ...check, phase, started: false, heard: null,
      text: '不可匯出的教材', account: '不可匯出的帳號',
      source: { kind: 'speech' as const, lang: 'zh-TW' as const,
        voice: { name: '繁體聲音 & "測試"', lang: 'zh-TW', localService: true },
        audioSrc: 'https://private.example/lesson.mp3' },
    }
    const html = render(false, attempt)
    const uri = html.match(/href="(data:application\/json[^"]+)"/)![1]
    const report = decodeURIComponent(uri.split(',')[1])
    expect(report).toBe(exportAudioCheck(attempt))
    expect(JSON.parse(report)).toMatchObject({ phase, started: false, heard: null })
    expect(JSON.parse(report).source.voice.name).toBe('繁體聲音 & "測試"')
    expect(report).not.toMatch(/不可匯出|private\.example|audioSrc/)
    expect(html).not.toContain('已下載')
    expect(html).toContain('已保存的檔案仍會留在裝置')
  })

  it.each([false, true])('提供可離線保存的原生 JSON 下載，英文介面=%s', (en) => {
    const html = render(en)
    const link = html.match(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/)
    expect(link, '需要獨立於剪貼簿的下載連結').not.toBeNull()
    expect(link![2]).toBe(en ? 'Download report' : '下載診斷紀錄')
    expect(link![0]).toContain('download="語音診斷-2026-10-09T12-34-56-000Z.json"')
    expect(link![1]).toMatch(/^data:application\/json;charset=utf-8,/)
    const report = JSON.parse(decodeURIComponent(link![1].split(',')[1]))
    expect(report).toMatchObject({ schema: 1, at: '2026-10-09T12:34:56.000Z',
      rate: 0.7, phase: 'complete', started: true, heard: null,
      events: [{ elapsedMs: 1200, phase: 'complete' }],
    })
    expect(html).toContain(en ? 'Check your browser downloads' : '請到瀏覽器下載清單確認')
  })
})
