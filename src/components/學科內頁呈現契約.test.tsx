// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { act, type ComponentProps, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ChineseToday } from '../chinese/components/ChineseToday'
import { LocaleProvider } from '../i18n/LocaleComponents'
import { saveUiLocale, type UiLocale } from '../i18n/locale'
import { translate } from '../i18n/messages'
import { ToeicToday } from '../toeic/components/ToeicToday'
import { toeicCertificates } from '../toeic/data/certificates'
import { localizeToeicCertificate } from '../toeic/teachingCopy'
import { speakEnglish } from '../utils/speech'

describe('學科共用樣式邊界', () => {
  it('七科只在各自根節點載入限定樣式，不影響日語與主頁', () => {
    for (const path of ['toeic/ToeicApp', 'math/MathApp', 'calculus/CalculusApp', 'physics/PhysicsApp', 'chemistry/ChemistryApp', 'cs/CsApp', 'chinese/ChineseApp']) {
      const source = readFileSync(`src/${path}.tsx`, 'utf8')
      expect(source).toContain("import '../學科內頁呈現.css'")
      expect(source.match(/className="[^"]*\blearning-course\b/g)).toHaveLength(1)
    }
    for (const path of ['src/Hub.tsx', 'src/App.tsx']) {
      expect(readFileSync(path, 'utf8')).not.toContain('learning-course')
    }
  })

  it('樣式只停用裝飾偽元素，不隱藏內容，並保留焦點與手機單欄', () => {
    const css = readFileSync('src/學科內頁呈現.css', 'utf8')
    const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    for (const [, selector, body] of rules) {
      expect(selector).toContain('.learning-course')
      if (/display:\s*none/.test(body)) expect(selector.trim()).toMatch(/::before$/)
      expect(body).not.toMatch(/visibility:\s*hidden|line-clamp|font-size:\s*0(?:px|rem|;)/)
    }
    expect(css).toContain(':focus-visible')
    expect(css).toContain('.course-today .task-grid { grid-template-columns: 1fr; overflow: visible; }')
    expect(css).toContain('.chinese-module-grid { grid-template-columns: 1fr; }')
  })
})

// 使用真實元件、課程及翻譯；僅隔離瀏覽器語音副作用，仍驗證朗讀呼叫。
vi.mock('../utils/speech', () => ({ speakEnglish: vi.fn() }))

let host: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.clearAllMocks()
  localStorage.clear()
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  localStorage.clear()
  vi.unstubAllGlobals()
})

async function mount(content: ReactNode, locale: UiLocale = 'zh-Hant') {
  saveUiLocale(locale)
  await act(async () => root.render(<LocaleProvider key={locale}>{content}</LocaleProvider>))
}

function button(label: string, within: ParentNode = host) {
  const found = [...within.querySelectorAll('button')].find((item) => item.textContent?.trim() === label)
  expect(found, `找不到按鈕：${label}`).toBeDefined()
  return found!
}

async function click(element: HTMLButtonElement) {
  await act(async () => element.click())
}

function toeicProps(certificateId = 'orange'): ComponentProps<typeof ToeicToday> {
  const cert = toeicCertificates.find((item) => item.id === certificateId)!
  const unit = cert.units[0]
  return {
    cert, unit,
    progress: {
      certificateId: cert.id, unitId: unit.id, xp: 0, vocabDone: 0,
      listeningDone: 0, grammarStarted: false, phonicsMastered: [],
    },
    onOpenPhonics: vi.fn(), onOpenBuilder: vi.fn(), onStartVocab: vi.fn(),
    onStartListening: vi.fn(), onStartGrammar: vi.fn(), onStartReview: vi.fn(),
    onStartMock: vi.fn(), onStartPlacement: vi.fn(), onSelectUnit: vi.fn(),
    dueCount: 0, streak: 0, dailyDone: 0, dailyGoal: 10,
  }
}

describe('多益內頁呈現契約', () => {
  it('首次學習呈現零進度與真實課程數量，主入口朗讀標題並開始詞彙', async () => {
    const props = toeicProps()
    await mount(<ToeicToday {...props} />)
    expect(host.querySelector('.progress-ring strong')?.textContent).toBe('0%')
    expect(host.querySelector('.result-panel strong')?.textContent).toBe('0%')
    expect(host.querySelector('.unit-banner h2')?.textContent).toBe(props.unit.titleEn)
    expect(host.querySelector('.banner-actions span')?.textContent).toBe(`Vocab ${props.unit.words} · Listening ${props.unit.listening} · Grammar 1`)
    const tasks = host.querySelectorAll('.task-grid button')
    expect(tasks[0].querySelector('p')?.textContent).toBe(`0/${props.unit.words} words`)
    expect(tasks[1].querySelector('p')?.textContent).toBe(`0/${props.unit.listening} items`)
    expect(tasks[2].querySelector('p')?.textContent).toBe('Not started · choose polite forms by scenario')
    await click(button(translate('zh-Hant', 'todayView.start'), host.querySelector('.unit-banner')!))
    expect(speakEnglish).toHaveBeenCalledExactlyOnceWith(props.unit.titleEn)
    expect(props.onStartVocab).toHaveBeenCalledTimes(1)
  })

  it('非零進度保留完成數、文法狀態、連續天數與到期複習', async () => {
    const props = toeicProps()
    props.progress = { ...props.progress, vocabDone: 3, listeningDone: 1, grammarStarted: true, xp: 20 }
    props.dueCount = 4
    props.streak = 7
    props.dailyDone = 2
    await mount(<ToeicToday {...props} />)
    // 真實橘證書首單元為六個詞彙、三題聽力；既有加權方式得到 41%。
    expect(host.querySelector('.progress-ring strong')?.textContent).toBe('41%')
    expect(host.querySelector('.result-panel strong')?.textContent).toBe('41%')
    expect(host.querySelector('.result-panel')?.textContent).toContain('Vocab: 3/6')
    expect(host.querySelector('.result-panel')?.textContent).toContain('Listening: 1/3')
    expect(host.querySelector('.task-grid button:last-child p')?.textContent).toBe('In progress · register, scenario, and polite choices')
    expect(host.textContent).toContain('7-day streak · 2/10 cards')
    expect(host.textContent).toContain('Today candidate queue: 4 cards.')
    const review = button(translate('zh-Hant', 'todayView.review'))
    expect(review.disabled).toBe(false)
    await click(review)
    expect(props.onStartReview).toHaveBeenCalledTimes(1)
  })

  it('三項主要任務依詞彙、聽力、文法順序呈現並先於複習與發音支援區', async () => {
    const props = toeicProps()
    await mount(<ToeicToday {...props} />)
    const grid = host.querySelector('.task-grid')!
    const tasks = [...grid.querySelectorAll<HTMLButtonElement>('button')]
    expect(tasks).toHaveLength(3)
    expect(tasks.map((item) => item.querySelector('h3')?.textContent)).toEqual([
      props.unit.title, 'Listening', `Polite / diplomatic｜${props.unit.grammar}`,
    ])
    for (const [index, callback] of [props.onStartVocab, props.onStartListening, props.onStartGrammar].entries()) {
      await click(tasks[index])
      expect(callback).toHaveBeenCalledTimes(1)
    }
    expect(speakEnglish).not.toHaveBeenCalled()
    const support = [...host.querySelectorAll('.daily-review')]
    expect(support).toHaveLength(2)
    for (const panel of support) {
      expect(grid.compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0)
    }
  })

  it('沒有到期項目時停用複習，複習說明連結仍可取得', async () => {
    const props = toeicProps()
    await mount(<ToeicToday {...props} />)
    const review = button(translate('zh-Hant', 'todayView.review'))
    expect(review.disabled).toBe(true)
    await click(review)
    expect(props.onStartReview).not.toHaveBeenCalled()
    const guide = host.querySelector<HTMLAnchorElement>('a.srs-guide-link')!
    expect(guide.getAttribute('href')).toBe(`${import.meta.env.BASE_URL}srs-review.html`)
    expect(guide.getAttribute('aria-label')).toBe(translate('zh-Hant', 'todayView.srsGuideAria'))
  })

  it('僅橘證書提供基礎發音入口，其餘真實證書保留三項主要任務', async () => {
    for (const cert of toeicCertificates) {
      const props = toeicProps(cert.id)
      await mount(<ToeicToday {...props} />)
      const phonics = [...host.querySelectorAll('button')].find((item) => item.textContent?.trim() === translate('zh-Hant', 'en.phonicsCta'))
      if (cert.id === 'orange') {
        expect(phonics).toBeDefined()
        await click(phonics!)
        expect(props.onOpenPhonics).toHaveBeenCalledTimes(1)
      } else {
        expect(phonics).toBeUndefined()
        expect(props.onOpenPhonics).not.toHaveBeenCalled()
      }
      expect(host.querySelectorAll('.task-grid button')).toHaveLength(3)
    }
  })

  it('英文模式保留真實單元、教學說明、建課、測程度與模擬測驗入口', async () => {
    const props = toeicProps()
    await mount(<ToeicToday {...props} />, 'en')
    const localized = localizeToeicCertificate(props.cert, 'en')
    expect(host.querySelector('.unit-banner p')?.textContent).toBe(localized.audience)
    expect(host.querySelector('.unit-map h3')?.textContent).toBe(localized.mapTitle)
    expect(host.querySelector('.task-grid h3')?.textContent).toBe(props.unit.titleEn)
    const units = [...host.querySelectorAll<HTMLButtonElement>('.unit-map button')]
    expect(units.map((item) => item.querySelector('small')?.textContent)).toEqual(props.cert.units.map((unit) => unit.titleEn))
    expect(units[0].classList.contains('active')).toBe(true)
    await click(units[1])
    expect(props.onSelectUnit).toHaveBeenCalledExactlyOnceWith(props.cert.units[1].id)
    await click(button('Open lesson builder →'))
    await click(button('Retake placement →'))
    await click(host.querySelector<HTMLButtonElement>('.unit-test-card')!)
    expect(props.onOpenBuilder).toHaveBeenCalledTimes(1)
    expect(props.onStartPlacement).toHaveBeenCalledTimes(1)
    expect(props.onStartMock).toHaveBeenCalledTimes(1)
    await mount(<ToeicToday {...props} onStartPlacement={undefined} />, 'en')
    expect([...host.querySelectorAll('button')].some((item) => item.textContent?.trim() === 'Retake placement →')).toBe(false)
  })
})

describe.each(['zh-Hant', 'en'] as const)('華語內頁呈現契約（%s）', (locale) => {
  it('四個真實模組保留教學標題與各自路由，首次學習呈現零經驗值', async () => {
    const onNavigate = vi.fn()
    await mount(<ChineseToday xp={0} onNavigate={onNavigate} />, locale)
    const cards = [...host.querySelectorAll<HTMLButtonElement>('button.practice-card')]
    expect(cards.map((card) => card.querySelector('strong')?.textContent)).toEqual(locale === 'en'
      ? ['Pinyin, Bopomofo, and the four tones', 'False friends in shared characters', 'Three-second grammar decision tree', 'Practical scenario conversations']
      : ['拼音・注音與四聲聲調', '日中同形異義語 (偽友詞)', '3秒文法動作決策樹', '實用情境會話'])
    for (const [index, route] of ['pinyin', 'false-friends', 'signals', 'conversations'].entries()) {
      await click(cards[index])
      expect(onNavigate).toHaveBeenLastCalledWith(route)
    }
    expect(onNavigate).toHaveBeenCalledTimes(4)
    expect(host.textContent).toContain(locale === 'en' ? '0 XP earned' : '0 XP 累積')
  })

  it('既有經驗值與教學語言說明完整呈現，改版不遺失日文教學內容', async () => {
    await mount(<ChineseToday xp={135} onNavigate={vi.fn()} />, locale)
    expect(host.textContent).toContain(locale === 'en' ? '135 XP earned' : '135 XP 累積')
    expect(host.querySelector('h2')?.textContent).toBe(locale === 'en'
      ? 'Welcome to the Taiwan Mandarin learning studio!' : '歡迎來到臺灣華語學習空間！')
    const descriptions = [...host.querySelectorAll('.practice-card p')]
    expect(descriptions).toHaveLength(4)
    for (const description of descriptions) {
      expect(description.getAttribute('lang')).toBe(locale === 'en' ? 'en' : 'ja')
      expect(description.textContent?.length).toBeGreaterThan(20)
    }
    expect(descriptions[3].textContent).toBe(locale === 'en'
      ? 'Practise Taiwan Mandarin for drink orders, night markets, and Taipei MRT travel.'
      : 'ドリンクスタンドの甘さ・氷指定から夜市小吃、台北MRT乗車まで生きた台湾華語。')
    expect(host.querySelector('.hero-desc')?.getAttribute('lang')).toBe(locale === 'en' ? 'en' : 'ja')
  })
})
