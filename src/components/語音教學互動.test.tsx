// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LocaleContext } from '../i18n/i18n'
import { translate } from '../i18n/messages'
import { LOCAL_PREFERENCE_KEYS } from '../utils/progressKeys'
import type { AudioLessonSegment } from '../utils/audioLessonTypes'
import { AudioLesson } from './AudioLesson'

// 掛載真實 React 與播放器；只控制原生語音事件和時間，不冒充瀏覽器聲音驗收。
class ControlledUtterance {
  constructor(public text: string) {}
  lang = ''
  rate = 1
  pitch = 1
  volume = 1
  voice = null
  onstart: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: ((event: { error: string }) => void) | null = null
}

const samples: AudioLessonSegment[] = [
  { id: 'first', text: 'Hi.', lang: 'en-US', kind: 'example' },
  { id: 'second', text: 'Bye.', lang: 'en-US', kind: 'example' },
]
const utterances: ControlledUtterance[] = []
const synth = {
  getVoices: () => [{ name: '受控英語', lang: 'en-US', localService: true }],
  speaking: false, pending: false, paused: false,
  speak: (utterance: ControlledUtterance) => { if (utterance.volume !== 0) utterances.push(utterance) },
  cancel: () => { synth.speaking = false; synth.pending = false },
  resume: () => {},
  addEventListener: () => {}, removeEventListener: () => {},
}
let host: HTMLDivElement
let root: Root

async function mount(locale: 'zh-Hant' | 'en' = 'zh-Hant') {
  await act(async () => root.render(
    <LocaleContext.Provider value={{ locale, setLocale: () => {}, t: (key, vars) => translate(locale, key, vars) }}>
      <AudioLesson lessonId="interaction-lesson" segments={samples} />
    </LocaleContext.Provider>,
  ))
}

function button(name: string) {
  const element = [...host.querySelectorAll('button')].find((item) => item.textContent === name)
  expect(element, `找不到按鈕：${name}`).toBeDefined()
  return element!
}

function select(name: string) {
  const label = [...host.querySelectorAll('label')].find((item) => item.firstChild?.textContent === name)
  const element = label?.querySelector('select')
  expect(element, `找不到選單：${name}`).toBeDefined()
  return element!
}

async function choose(name: string, value: string) {
  await act(async () => {
    const element = select(name)
    element.value = value
    element.dispatchEvent(new Event('change', { bubbles: true }))
    // 送達 jsdom 偏好寫入排入的零延遲 storage 事件，不清除播放器計時器。
    await vi.advanceTimersByTimeAsync(0)
  })
}

async function click(name: string) {
  await act(async () => button(name).click())
}

async function completeSpeech() {
  await act(async () => {
    const utterance = utterances.at(-1)!
    synth.speaking = true
    utterance.onstart?.()
    synth.speaking = false
    utterance.onend?.()
  })
}

beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date', 'performance'] })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('SpeechSynthesisUtterance', ControlledUtterance)
  vi.stubGlobal('speechSynthesis', synth)
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
  localStorage.clear()
  await vi.advanceTimersByTimeAsync(0)
  utterances.length = 0
  synth.cancel()
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('語音教學的真實元件互動', () => {
  it('留白中更改設定會停止舊播放並清除倒數', async () => {
    await mount()
    await click('聽原文示範')
    await completeSpeech()
    expect(host.querySelector('[role="timer"]')).not.toBeNull()
    expect(vi.getTimerCount()).toBeGreaterThan(0)
    await choose('留白長度', 'extended')
    expect(host.querySelector('.audio-lesson-status')?.textContent).toBe('已停止')
    expect(host.querySelector('[role="timer"]')).toBeNull()
    expect(button('立即接續').disabled).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
    await act(async () => vi.advanceTimersByTimeAsync(5000))
    expect(utterances.map((item) => item.text)).toEqual(['Hi.'])
  })

  it('立即接續後舊計時器不能再次前進或提早結束下一組', async () => {
    await mount()
    await click('聽原文示範')
    await completeSpeech()
    await click('立即接續')
    expect(utterances.map((item) => item.text)).toEqual(['Hi.', 'Bye.'])
    await act(async () => {
      synth.speaking = true
      utterances.at(-1)!.onstart?.()
      await vi.advanceTimersByTimeAsync(2000)
    })
    expect(host.querySelector('.audio-lesson-status')?.textContent).toBe('播放中 · 2/2')
    expect(host.querySelector('[role="timer"]')).toBeNull()
    expect(utterances).toHaveLength(2)
    await completeSpeech()
    expect(host.querySelector('.audio-lesson-status')?.textContent).toContain('輪到你')
    await click('立即接續')
    expect(host.querySelector('.audio-lesson-status')?.textContent).toBe('原文示範播放完成')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('關閉再開啟留白保留長度，重新掛載仍沿用保存結果', async () => {
    await mount()
    await choose('留白長度', 'extended')
    const toggle = host.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    await act(async () => toggle.click())
    expect(select('留白長度').disabled).toBe(true)
    expect(select('留白長度').value).toBe('extended')
    await act(async () => toggle.click())
    expect(select('留白長度').disabled).toBe(false)
    expect(select('留白長度').value).toBe('extended')
    await act(async () => root.unmount())
    root = createRoot(host)
    await mount()
    expect(select('留白長度').value).toBe('extended')
    expect(host.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked).toBe(true)
  })

  it('儲存遭拒仍套用當前設定並顯示失敗，恢復後才清除提示', async () => {
    await mount()
    const save = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('受控儲存拒絕') })
    await choose('語速', '0.7')
    expect(select('語速').value).toBe('0.7')
    expect(host.querySelector('[role="alert"]')?.textContent).toContain('偏好未能儲存')
    expect(localStorage.getItem(LOCAL_PREFERENCE_KEYS.audioLesson)).toBeNull()
    save.mockRestore()
    await choose('語速', '0.95')
    expect(host.querySelector('[role="alert"]')).toBeNull()
    expect(JSON.parse(localStorage.getItem(LOCAL_PREFERENCE_KEYS.audioLesson)!)).toMatchObject({ rate: 0.95 })
  })

  it('循環次數由介面傳入播放器，立即接續只結束本次留白', async () => {
    await mount()
    await choose('每組練習', '2')
    await click('聽原文示範')
    expect(host.querySelector('.audio-lesson-status')?.textContent).toContain('本組第 1/2 次')
    await completeSpeech()
    await click('立即接續')
    expect(utterances.map((item) => item.text)).toEqual(['Hi.', 'Hi.'])
    expect(host.querySelector('.audio-lesson-status')?.textContent).toContain('本組第 2/2 次')
    await completeSpeech()
    await click('立即接續')
    expect(utterances.map((item) => item.text)).toEqual(['Hi.', 'Hi.', 'Bye.'])
    expect(host.querySelector('.audio-lesson-status')?.textContent).toContain('本組第 1/2 次')
    await completeSpeech()
    await click('立即接續')
    await completeSpeech()
    await click('立即接續')
    expect(utterances.map((item) => item.text)).toEqual(['Hi.', 'Hi.', 'Bye.', 'Bye.'])
    expect(host.querySelector('.audio-lesson-status')?.textContent).toBe('原文示範播放完成')
    expect(host.querySelector('[role="timer"]')).toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('三次偏好仍讓重播當句及試播固定一次，英文輪次與保存結果一致', async () => {
    await mount('en')
    await choose('Rounds per group', '3')
    await click('Replay current')
    expect(host.querySelector('.audio-lesson-status')?.textContent).not.toContain('Round')
    await completeSpeech()
    await click('Continue now')
    expect(utterances).toHaveLength(1)
    expect(host.querySelector('.audio-lesson-status')?.textContent).toBe('Current segment finished')
    await click('Test English excerpt')
    await completeSpeech()
    expect(utterances).toHaveLength(2)
    expect(host.querySelector('[role="timer"]')).toBeNull()
    expect(host.querySelector('.audio-lesson-status')?.textContent).toBe('Test events finished; confirm whether you heard it')
    await click('Play examples')
    expect(host.querySelector('.audio-lesson-status')?.textContent).toContain('Round 1 of 3')
    await completeSpeech()
    await click('Continue now')
    expect(host.querySelector('.audio-lesson-status')?.textContent).toContain('Round 2 of 3')
    await click('Stop')
    expect(vi.getTimerCount()).toBe(0)
    expect(JSON.parse(localStorage.getItem(LOCAL_PREFERENCE_KEYS.audioLesson)!)).toMatchObject({ repeatCount: 3 })
    await act(async () => root.unmount())
    root = createRoot(host)
    await mount('en')
    expect(select('Rounds per group').value).toBe('3')
  })
})
