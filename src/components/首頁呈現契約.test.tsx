// @vitest-environment jsdom
import { act, type ComponentProps, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Hub } from '../Hub'
import { AuthContext, type AuthContextValue } from '../auth/AuthContext'
import { jlptLevels } from '../data/course'
import { LocaleProvider } from '../i18n/LocaleComponents'
import { saveUiLocale, type UiLocale } from '../i18n/locale'
import { translate } from '../i18n/messages'
import { loadToeicInstructionLang, type LangId } from '../utils/storage'
import { TodayView } from './TodayView'

// 使用實際元件、翻譯、課程及本機儲存；帳號情境固定為未登入，不建立網路連線。
const auth: AuthContextValue = {
  configured: true, backendKind: 'local', loading: false,
  session: null, user: null, syncStatus: 'local-only',
  signIn: async () => null, signUp: async () => null,
  signOut: async () => {}, deleteAccount: async () => null,
}
const tracks: LangId[] = ['math', 'calculus', 'physics', 'chemistry', 'cs', 'ja', 'en', 'zh']
let host: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
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
  await act(async () => root.render(
    <LocaleProvider>
      <AuthContext.Provider value={auth}>{content}</AuthContext.Provider>
    </LocaleProvider>,
  ))
}

function button(label: string, within: ParentNode = host) {
  const found = [...within.querySelectorAll('button')].find((item) => item.textContent?.trim() === label)
  expect(found, `找不到按鈕：${label}`).toBeDefined()
  return found!
}

async function click(element: HTMLButtonElement) {
  await act(async () => element.click())
}

async function search(query: string) {
  const input = host.querySelector<HTMLInputElement>('input[type="search"]')
  expect(input, '首頁必須提供搜尋輸入欄位').not.toBeNull()
  await act(async () => {
    // 使用原生 setter，讓 React 收到真正的輸入變更而非僅改 DOM 值。
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, query)
    input!.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

function todayProps(): ComponentProps<typeof TodayView> {
  const level = jlptLevels[0]
  const unit = level.units[0]
  return {
    level, unit,
    progress: { levelId: level.id, unitId: unit.id, xp: 0, vocabDone: 0, readingDone: 0, grammarStarted: false },
    onOpenBuilder: vi.fn(), onOpenKana: vi.fn(), onStartVocab: vi.fn(),
    onStartReading: vi.fn(), onStartGrammar: vi.fn(), onStartReview: vi.fn(),
    onStartMock: vi.fn(), onStartPlacement: vi.fn(), onSelectUnit: vi.fn(),
    dueCount: 0, streak: 0, dailyDone: 0, dailyGoal: 10,
  }
}

describe('首頁呈現與入口契約', () => {
  it('空進度仍呈現八軌卡片，八個主要入口分別呼叫正確路由', async () => {
    const onChoose = vi.fn()
    await mount(<Hub onChoose={onChoose} onOpenPrivacy={vi.fn()} />)
    const cards = [...host.querySelectorAll('.hub-card')]
    expect(cards).toHaveLength(tracks.length)
    for (const track of tracks) {
      const card = cards.find((item) => item.querySelector('h3')?.textContent === translate('zh-Hant', `track.${track}`))
      expect(card, `缺少學習入口：${track}`).toBeDefined()
      const entry = card!.querySelector<HTMLButtonElement>('button.hub-card-hit')!
      expect(entry.disabled).toBe(false)
      await click(entry)
      expect(onChoose).toHaveBeenLastCalledWith(track)
    }
    expect(onChoose).toHaveBeenCalledTimes(8)
  })

  it('搜尋縮小卡片集合，無結果可清除並恢復八軌入口', async () => {
    await mount(<Hub onChoose={vi.fn()} onOpenPrivacy={vi.fn()} />)
    await search(translate('zh-Hant', 'track.chemistry'))
    expect(host.querySelectorAll('.hub-card')).toHaveLength(1)
    expect(host.querySelector('.hub-card h3')?.textContent).toBe(translate('zh-Hant', 'track.chemistry'))
    await search('不存在的課程 qzx987')
    expect(host.querySelectorAll('.hub-card')).toHaveLength(0)
    expect(host.querySelector('.hub-search-empty[role="status"]')).not.toBeNull()
    await click(button(translate('zh-Hant', 'hub.search.showAll')))
    expect(host.querySelector<HTMLInputElement>('input[type="search"]')?.value).toBe('')
    expect(host.querySelectorAll('.hub-card')).toHaveLength(8)
  })

  it('多益教學語言與主要入口互不巢狀，切換保存偏好而進入課程才導頁', async () => {
    const onChoose = vi.fn()
    await mount(<Hub onChoose={onChoose} onOpenPrivacy={vi.fn()} />)
    const card = host.querySelector('.en-track-card')!
    const entry = card.querySelector<HTMLButtonElement>('button.hub-card-hit')!
    expect(card.querySelector('button button')).toBeNull()
    for (const [language, key] of [['ja', 'hub.toeicJa'], ['zh', 'hub.toeicZh']] as const) {
      const choice = button(translate('zh-Hant', key), card)
      expect(entry.contains(choice)).toBe(false)
      await click(choice)
      expect(choice.getAttribute('aria-pressed')).toBe('true')
      expect(loadToeicInstructionLang()).toBe(language)
      expect(onChoose).not.toHaveBeenCalled()
    }
    await click(entry)
    expect(onChoose).toHaveBeenCalledExactlyOnceWith('en')
  })

  it('實際切換英文與繁體中文時，首頁標題、搜尋標籤及八軌名稱一起更新', async () => {
    await mount(<Hub onChoose={vi.fn()} onOpenPrivacy={vi.fn()} />)
    for (const locale of ['en', 'zh-Hant'] as const) {
      await click(host.querySelector<HTMLButtonElement>(`.locale-toggle button[lang="${locale}"]`)!)
      expect(host.querySelector('h1')?.textContent).toBe(translate(locale, 'hub.title'))
      expect(host.querySelector('label[for="hub-track-search"]')?.textContent).toBe(translate(locale, 'hub.search.label'))
      expect([...host.querySelectorAll('.hub-card h3')].map((item) => item.textContent)).toEqual(
        tracks.map((track) => translate(locale, `track.${track}`)),
      )
    }
  })
})

describe.each(['zh-Hant', 'en'] as const)('今日學習頁呈現契約（%s）', (locale) => {
  it('首次學習保留所有學習入口，主按鈕開始詞彙，沒有到期項目時停用複習', async () => {
    const props = todayProps()
    await mount(<TodayView {...props} />, locale)
    await click(button(translate(locale, 'todayView.emptyCta')))
    expect(props.onStartVocab).toHaveBeenCalledTimes(1)
    const tasks = host.querySelectorAll<HTMLButtonElement>('.task-grid button')
    expect(tasks).toHaveLength(3)
    await click(tasks[0])
    await click(tasks[1])
    await click(tasks[2])
    expect(props.onStartVocab).toHaveBeenCalledTimes(2)
    expect(props.onStartReading).toHaveBeenCalledTimes(1)
    expect(props.onStartGrammar).toHaveBeenCalledTimes(1)
    for (const [key, callback] of [
      ['todayView.kanaCta', props.onOpenKana],
      ['todayView.builder', props.onOpenBuilder],
      ['todayView.placement', props.onStartPlacement],
    ] as const) {
      await click(button(translate(locale, key)))
      expect(callback).toHaveBeenCalledTimes(1)
    }
    await click(host.querySelector<HTMLButtonElement>('.unit-test-card')!)
    expect(props.onStartMock).toHaveBeenCalledTimes(1)
    const units = host.querySelectorAll<HTMLButtonElement>('.unit-map button')
    expect(units).toHaveLength(props.level.units.length)
    await click(units[1])
    expect(props.onSelectUnit).toHaveBeenCalledExactlyOnceWith(props.level.units[1].id)
    const review = button(translate(locale, 'todayView.review'))
    expect(review.disabled).toBe(true)
    await click(review)
    expect(props.onStartReview).not.toHaveBeenCalled()
    expect(host.textContent).toContain(translate(locale, 'todayView.planTitle'))
    expect(host.querySelector('[lang="ja"]')?.textContent).toBe(props.unit.titleJa)
  })

  it('非零進度呈現真實數字、到期複習及單元選取，未提供測程度回呼時不顯示入口', async () => {
    const props = todayProps()
    props.progress = { ...props.progress, vocabDone: 3, readingDone: 1, grammarStarted: true, xp: 20 }
    props.dueCount = 4
    props.streak = 7
    props.dailyDone = 2
    props.onStartPlacement = undefined
    await mount(<TodayView {...props} />, locale)
    // 此課為六個詞彙、三篇閱讀；完成一半詞彙、一篇閱讀並開始文法時為 41%。
    expect(host.querySelector('.progress-ring strong')?.textContent).toBe('41%')
    expect(host.textContent).toContain(translate(locale, 'todayView.done', { done: 3, total: props.unit.words }))
    expect(host.textContent).toContain(translate(locale, 'todayView.answered', { done: 1, total: props.unit.reading }))
    expect(host.textContent).toContain(translate(locale, 'todayView.streak', { streak: 7, done: 2, goal: 10 }))
    expect(host.textContent).toContain(translate(locale, 'todayView.due', { count: 4 }))
    const review = button(translate(locale, 'todayView.review'))
    expect(review.disabled).toBe(false)
    await click(review)
    expect(props.onStartReview).toHaveBeenCalledTimes(1)
    const units = host.querySelectorAll<HTMLButtonElement>('.unit-map button')
    expect(units).toHaveLength(props.level.units.length)
    await click(units[1])
    expect(props.onSelectUnit).toHaveBeenCalledExactlyOnceWith(props.level.units[1].id)
    expect([...host.querySelectorAll('button')].some((item) => item.textContent?.trim() === translate(locale, 'todayView.placement'))).toBe(false)
    expect(host.querySelector('[lang="ja"]')?.textContent).toBe(props.unit.titleJa)
  })
})
