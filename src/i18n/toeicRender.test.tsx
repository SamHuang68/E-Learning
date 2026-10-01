import { createHash } from 'node:crypto'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ToeicSidebar } from '../toeic/components/ToeicSidebar'
import { ToeicToday } from '../toeic/components/ToeicToday'
import { ToeicBuilder } from '../toeic/components/ToeicBuilder'
import { buildPrompt } from '../toeic/buildPrompt'
import { defaultToeicConfig, toeicCertificates, toeicThemes } from '../toeic/data/certificates'
import { localizeToeicCertificate } from './toeicCertificateCopy'
import { UI_LOCALE_KEY, type UiLocale } from './locale'

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/
const noop = () => {}

function selectLocale(locale: UiLocale) {
  vi.stubGlobal('localStorage', { getItem: (key: string) => key === UI_LOCALE_KEY ? locale : null })
}

function renderSidebar(index: number, locale: UiLocale, instructionLang: 'zh' | 'ja' = 'zh') {
  selectLocale(locale)
  const cert = localizeToeicCertificate(toeicCertificates[index], locale)
  return renderToStaticMarkup(createElement(ToeicSidebar, {
    nav: 'today', onNav: noop, cert, unit: cert.units[0], progressPct: 0,
    phonicsCount: 0, instructionLang, onBackHub: noop, onSwitchLang: noop,
  }))
}

function renderToday(index: number, unitIndex: number, locale: UiLocale) {
  selectLocale(locale)
  const cert = localizeToeicCertificate(toeicCertificates[index], locale)
  const unit = cert.units[unitIndex]
  return renderToStaticMarkup(createElement(ToeicToday, {
    cert, unit,
    progress: { certificateId: cert.id, unitId: unit.id, xp: 0, vocabDone: 0, listeningDone: 0, grammarStarted: false, phonicsMastered: [] },
    onOpenPhonics: noop, onOpenBuilder: noop, onStartVocab: noop, onStartListening: noop,
    onStartGrammar: noop, onStartReview: noop, onStartMock: noop, onStartPlacement: noop,
    onSelectUnit: noop, dueCount: 0, streak: 0, dailyDone: 0, dailyGoal: 10,
  }))
}

afterEach(() => vi.unstubAllGlobals())

describe('TOEIC 實際頁面語言', () => {
  for (const [index, source] of toeicCertificates.entries()) {
    it(`${source.id} 英文側欄僅保留明訂的日文解說按鈕`, () => {
      const html = renderSidebar(index, 'en')
      // 僅移除精確匹配的日文解說按鈕文字，不豁免其他節點或屬性。
      expect(html.match(/>🇯🇵 日本語解説<\/button>/g)).toHaveLength(1)
      const checked = html.replace('>🇯🇵 日本語解説</button>', '></button>')
      expect(checked).not.toMatch(CJK)
      expect(html).toContain(`>${source.disclaimerEn}</p>`)
      expect(html).not.toContain(source.disclaimer)
      for (const icon of ['≡', '↗', '✎', '◎', '♫']) expect(html).toContain(`<span>${icon}</span>`)
    })

    for (const [unitIndex, unit] of source.units.entries()) {
      it(`${source.id} 單元 ${unit.id} 今日頁不含 CJK`, () => {
        const html = renderToday(index, unitIndex, 'en')
        expect(html).toContain(source.nameEn)
        expect(html).not.toMatch(CJK)
      })
    }
  }

  it('英文課程工具及所有證書主題產出的固定提示詞不含 CJK', () => {
    selectLocale('en')
    expect(renderToStaticMarkup(createElement(ToeicBuilder))).not.toMatch(CJK)
    for (const cert of toeicCertificates) {
      for (const theme of toeicThemes) {
        const prompt = buildPrompt({ ...defaultToeicConfig, certificateId: cert.id, theme: theme.id }, 'en')
        expect(prompt).toContain(cert.nameEn)
        expect(prompt).toContain(theme.labelEn)
        expect(prompt).not.toMatch(CJK)
      }
    }
  })

  it('繁中與日文解說側欄、繁中今日頁與課程工具的完整輸出保持原樣', () => {
    const html = toeicCertificates.flatMap((_, index) => [
      renderSidebar(index, 'zh-Hant'), renderSidebar(index, 'zh-Hant', 'ja'),
      ...toeicCertificates[index].units.map((_, unitIndex) => renderToday(index, unitIndex, 'zh-Hant')),
    ])
    selectLocale('zh-Hant')
    html.push(renderToStaticMarkup(createElement(ToeicBuilder)))
    // 修改前的真實 HTML 基準，涵蓋四個證書、24 個單元及日文解說側欄。
    expect(createHash('sha256').update(html.join('\n')).digest('hex')).toBe('a5f80cbda3d6e7102d399a29b79e2b8d70f7a805db1532f58348432067585373')
  })
})
