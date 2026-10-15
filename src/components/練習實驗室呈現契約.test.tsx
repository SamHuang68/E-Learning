// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ToneListeningLab } from '../chinese/components/ToneListeningLab'
import { CHINESE_SUPPORT_EN, TONE_DRILLS } from '../chinese/data/toneDrills'
import { localizeChineseData } from '../chinese/teachingCopy'
import { CsPractice } from '../cs/components/CsPractice'
import { CS_CURRICULUM } from '../cs/data/curriculum'
import { playCorrectSound, playWrongSound } from '../engine/audioSynthesizer'
import { localizeCsUnit } from '../i18n/csTeachingCopy'
import { LocaleContext } from '../i18n/i18n'
import type { UiLocale } from '../i18n/locale'
import { translate } from '../i18n/messages'

// 掛載真實元件與教材，只隔離音效與原生語音；這些斷言不代表實際出聲驗收。
vi.mock('../engine/audioSynthesizer', () => ({
  playCorrectSound: vi.fn(),
  playWrongSound: vi.fn(),
}))

class ControlledUtterance {
  text: string
  lang = ''
  rate = 1
  constructor(text: string) { this.text = text }
}

const speech = { cancel: vi.fn(), speak: vi.fn() }
let host: HTMLDivElement
let root: Root

describe('練習實驗室樣式的限定範圍', () => {
  it('載入共同樣式，只停止裝飾偽元素，不隱藏內容或改寫圖形', () => {
    expect(readFileSync('src/main.tsx', 'utf8')).toContain("import './練習實驗室呈現.css'")
    const css = readFileSync('src/練習實驗室呈現.css', 'utf8')
    for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      expect(selector.trim()).not.toMatch(/^(?:body|html|button|input|select|svg|canvas|\.practice-card)\s*(?:,|$)/)
      if (/display:\s*none/.test(body)) expect(selector.trim()).toMatch(/::before$/)
      expect(body).not.toMatch(/visibility:\s*hidden|line-clamp|font-size:\s*0(?:px|rem|;)/)
      expect(selector).not.toMatch(/\b(?:svg|canvas|path)\b/)
    }
    expect(css).toContain(':focus-visible')
    expect(css).toContain('@media (max-width: 700px)')
    expect(css).toMatch(/\.cs-practice-options,\s+\.tone-drill-options\s*\{\s*grid-template-columns: minmax\(0, 1fr\);/)
  })

  it('數線標記沿用既有位置公式，補齊刻度版面且不另建計算來源', () => {
    const css = readFileSync('src/練習實驗室呈現.css', 'utf8')
    const source = readFileSync('src/math/labs/FractionLab.tsx', 'utf8')
    expect(source).toContain('Math.min(100, (value / 2) * 100)')
    expect(css).toMatch(/\.fraction-lab \.num-line-track\s*\{[^}]*position:\s*relative/)
    expect(css).toMatch(/\.fraction-lab \.num-line-marker\s*\{[^}]*position:\s*absolute/)
    expect(css).toMatch(/\.fraction-lab \.num-line-ticks\s*\{[^}]*justify-content:\s*space-between/)
    expect(css).not.toMatch(/\.num-line-marker\s*\{[^}]*\bleft:/)
  })
})

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('speechSynthesis', speech)
  vi.stubGlobal('SpeechSynthesisUtterance', ControlledUtterance)
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

async function mount(content: ReactNode, locale: UiLocale) {
  await act(async () => root.render(
    <LocaleContext.Provider value={{ locale, setLocale: () => {}, t: (key, vars) => translate(locale, key, vars) }}>
      {content}
    </LocaleContext.Provider>,
  ))
}

function element<T extends HTMLElement = HTMLElement>(selector: string, within: ParentNode = host): T {
  const found = within.querySelector<T>(selector)
  expect(found, `找不到元素：${selector}`).not.toBeNull()
  return found!
}

async function click(button: HTMLButtonElement) {
  await act(async () => button.click())
}

describe.each(['zh-Hant', 'en'] as const)('計概練習的呈現與作答契約（%s）', (locale) => {
  it.each([true, false])('作答正確=%s 時只回報一次，切換單元保留各題狀態', async (correct) => {
    const onCompleteQuestion = vi.fn()
    const onRecordError = vi.fn()
    const unit = localizeCsUnit(locale, CS_CURRICULUM[0])
    const question = unit.questions[0]
    const answerIndex = Number(question.answer)
    const wrongIndex = (answerIndex + 1) % question.options!.length
    const chosenIndex = correct ? answerIndex : wrongIndex
    await mount(<CsPractice onCompleteQuestion={onCompleteQuestion} onRecordError={onRecordError} />, locale)

    const card = element('.cs-practice-question')
    expect(element('.cs-practice-overview h3').textContent).toBe(unit.title)
    expect(element('.cs-practice-stem', card).textContent).toBe(question.question)
    expect([...card.querySelectorAll('.cs-practice-option-text')].map((option) => option.textContent)).toEqual(question.options)
    const options = [...card.querySelectorAll<HTMLButtonElement>('.cs-practice-option')]
    expect(options.every((option) => option.classList.contains('practice-card'))).toBe(true)
    expect(options.every((option) => option.getAttribute('aria-disabled') === 'false')).toBe(true)
    await click(options[chosenIndex])

    expect(element('[role="status"]', card).textContent).toBe(correct
      ? locale === 'en' ? 'Correct' : '答對了'
      : locale === 'en' ? 'Incorrect' : '答錯了')
    expect([...card.querySelectorAll('.cs-practice-feedback ol li')].map((step) => step.textContent)).toEqual(question.solution)
    expect(element('.cs-practice-keypoint', card).textContent).toContain(question.explanation)
    expect(options.every((option) => option.getAttribute('aria-disabled') === 'true')).toBe(true)
    expect(options[chosenIndex].getAttribute('aria-pressed')).toBe('true')
    expect(options[answerIndex].style.background).toBe('rgba(16, 185, 129, 0.15)')
    if (!correct) expect(options[wrongIndex].style.background).toBe('rgba(239, 68, 68, 0.15)')
    for (const option of options) await click(option)
    expect(options[chosenIndex].getAttribute('aria-pressed')).toBe('true')
    if (correct) {
      expect(onCompleteQuestion).toHaveBeenCalledExactlyOnceWith(question.id, 15)
      expect(onRecordError).not.toHaveBeenCalled()
      expect(playCorrectSound).toHaveBeenCalledTimes(1)
      expect(playWrongSound).not.toHaveBeenCalled()
    } else {
      expect(onRecordError).toHaveBeenCalledExactlyOnceWith(question.id)
      expect(onCompleteQuestion).not.toHaveBeenCalled()
      expect(playWrongSound).toHaveBeenCalledTimes(1)
      expect(playCorrectSound).not.toHaveBeenCalled()
    }

    const tabs = [...host.querySelectorAll<HTMLButtonElement>('.cs-practice-unit-tab')]
    await click(tabs[1])
    expect(tabs[1].getAttribute('aria-pressed')).toBe('true')
    expect(element('.cs-practice-overview h3').textContent).toBe(localizeCsUnit(locale, CS_CURRICULUM[1]).title)
    expect(host.querySelector('.cs-practice-feedback')).toBeNull()
    expect(element('.cs-practice-option').getAttribute('aria-disabled')).toBe('false')
    await click(tabs[0])
    expect(element('.cs-practice-option[aria-pressed="true"]').textContent).toContain(question.options![chosenIndex])
    await click(element<HTMLButtonElement>('.cs-practice-option'))
    expect(correct ? onCompleteQuestion : onRecordError).toHaveBeenCalledTimes(1)
  })
})

describe.each(['zh-Hant', 'en'] as const)('華語聲調練習的呈現與作答契約（%s）', (locale) => {
  it('保留教材語言、語音呼叫、正誤鎖定與下一題重設', async () => {
    const onEarnXp = vi.fn()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    await mount(<ToneListeningLab onEarnXp={onEarnXp} />, locale)
    const first = TONE_DRILLS[0]
    const localized = localizeChineseData(first, locale, CHINESE_SUPPORT_EN)
    const options = [...host.querySelectorAll<HTMLButtonElement>('.tone-drill-option')]
    expect(options).toHaveLength(2)
    expect(options.every((option) => option.classList.contains('practice-card'))).toBe(true)
    expect(options.map((option) => element('h3', option).textContent)).toEqual([first.pairA.zh, first.pairB.zh])
    expect([...host.querySelectorAll('.tone-drill-pinyin')].map((item) => [item.textContent, item.getAttribute('lang')]))
      .toEqual([[first.pairA.pinyin, 'zh-Latn'], [first.pairB.pinyin, 'zh-Latn']])
    expect([...host.querySelectorAll('.tone-drill-meaning')].map((item) => [item.textContent, item.getAttribute('lang')]))
      .toEqual([[localized.pairA.meaningJa, locale === 'en' ? 'en' : 'ja'], [localized.pairB.meaningJa, locale === 'en' ? 'en' : 'ja']])
    expect(element('.tone-drill-title').textContent).toBe(localized.titleJa)
    await click(element<HTMLButtonElement>('.tone-drill-play-button'))
    expect(speech.cancel).toHaveBeenCalledTimes(1)
    expect(speech.speak).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ text: first.pairA.zh, lang: 'zh-TW', rate: 0.8 }))

    await click(options[0])
    expect(onEarnXp).toHaveBeenCalledExactlyOnceWith(10)
    expect(options.every((option) => option.getAttribute('aria-disabled') === 'true')).toBe(true)
    expect(options[0].style.background).toBe('rgba(16, 185, 129, 0.15)')
    expect(element('.tone-drill-result').textContent).toContain('+10 XP')
    expect(element('.tone-drill-feedback > p').textContent).toContain(localized.confusionPointJa)
    expect(element('.tone-drill-example').textContent).toContain(first.exampleContextZh)
    await click(options[1])
    await click(options[0])
    expect(onEarnXp).toHaveBeenCalledTimes(1)
    expect(options[0].getAttribute('aria-pressed')).toBe('true')

    await click(element<HTMLButtonElement>('.tone-drill-next button'))
    expect(host.querySelector('.tone-drill-feedback')).toBeNull()
    expect(options.every((option) => option.getAttribute('aria-disabled') === 'false' && option.getAttribute('aria-pressed') === 'false')).toBe(true)
    expect(element('.tone-drill-counter').textContent).toContain('#2')
    expect(element('h3', options[0]).textContent).toBe(TONE_DRILLS[1].pairA.zh)
    await click(element<HTMLButtonElement>('.tone-drill-play-button'))
    expect(speech.speak).toHaveBeenLastCalledWith(expect.objectContaining({ text: TONE_DRILLS[1].pairB.zh, lang: 'zh-TW', rate: 0.8 }))
    expect(speech.speak).toHaveBeenCalledTimes(2)
    await click(options[0])
    expect(options[0].style.background).toBe('rgba(239, 68, 68, 0.15)')
    expect(options[1].style.background).toBe('rgba(16, 185, 129, 0.15)')
    expect(element('.tone-drill-result').textContent).toContain(locale === 'en' ? 'Not quite.' : '不正解。')
    await click(options[1])
    expect(options[0].getAttribute('aria-pressed')).toBe('true')
    expect(options.every((option) => option.getAttribute('aria-disabled') === 'true')).toBe(true)
    expect(onEarnXp).toHaveBeenCalledTimes(1)
    expect(playCorrectSound).toHaveBeenCalledTimes(1)
    expect(playWrongSound).toHaveBeenCalledTimes(1)
  })
})
