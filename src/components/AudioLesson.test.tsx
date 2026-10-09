import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LocaleContext } from '../i18n/i18n'
import { translate } from '../i18n/messages'
import type { AudioLessonSegment } from '../utils/audioLessonTypes'
import { AudioLesson } from './AudioLesson'
import { AudioSourceLabel } from './語音檢查面板'
import { hasLessonVoice } from '../utils/audioLessonVoices'

const { failedState } = vi.hoisted(() => ({ failedState: {
  active: false,
  phase: undefined as string | undefined,
  playback: undefined as { scope: string; index: number; total: number } | undefined,
  current: undefined as number | undefined,
  error: undefined as string | undefined,
} }))

// 明示的錯誤狀態 SSR 驗證，不將狀態注入當作瀏覽器播放證據。
vi.mock('react', async (importOriginal) => {
  const react = await importOriginal<typeof import('react')>()
  return {
    ...react,
    useState: (initial: unknown) => {
      const state = react.useState(initial)
      if (initial === 'idle' && failedState.phase) return [failedState.phase, state[1]]
      if (initial === 0 && failedState.current !== undefined) return [failedState.current, state[1]]
      if (initial === '' && failedState.error) return [failedState.error, state[1]]
      if (initial && typeof initial === 'object' && 'scope' in initial && failedState.playback) {
        return [failedState.playback, state[1]]
      }
      return initial === 'idle' && failedState.active ? ['error', state[1]] : state
    },
  }
})

const segments: AudioLessonSegment[] = [
  { id: 'original', text: 'こんにちは。', lang: 'ja-JP', kind: 'example' },
  { id: 'meaning', text: 'A greeting used during the day.', lang: 'en-US', kind: 'explanation' },
]

function render(locale: 'en' | 'zh-Hant', items = segments) {
  return renderToStaticMarkup(
    <LocaleContext.Provider value={{ locale, setLocale: () => {}, t: (key, vars) => translate(locale, key, vars) }}>
      <AudioLesson lessonId="greeting" segments={items} />
    </LocaleContext.Provider>,
  )
}

function installVoices(languages: string[]) {
  const voices = languages.map((lang) => ({ name: lang, lang })) as SpeechSynthesisVoice[]
  vi.stubGlobal('SpeechSynthesisUtterance', class {})
  vi.stubGlobal('window', { speechSynthesis: { getVoices: () => voices } })
  return voices
}

afterEach(() => {
  failedState.active = false
  failedState.phase = undefined
  failedState.playback = undefined
  failedState.current = undefined
  failedState.error = undefined
  vi.unstubAllGlobals()
})

describe('共用語音教學介面', () => {
  it.each(['idle', 'preparing', 'playing', 'shadowing', 'complete', 'stopped', 'error'])('立即接續僅在留白時可用：%s', (phase) => {
    failedState.phase = phase
    const html = render('zh-Hant')
    expect(html).toContain('立即接續')
    if (phase === 'shadowing') {
      expect(html).not.toMatch(/disabled=""[^>]*>立即接續<\/button>/)
      expect(html).toContain('留白結束後會自動接續；練習完成可按「立即接續」')
    } else expect(html).toMatch(/disabled=""[^>]*>立即接續<\/button>/)
  })

  it('英文留白操作保留自動接續與最後一組完成的界線', () => {
    failedState.phase = 'shadowing'
    const html = render('en')
    expect(html).toContain('Continue now')
    expect(html).toContain('The lesson continues automatically after repeat time')
    expect(html).toContain('The last group finishes playback')
  })

  it.each([0, 1])('接續播放只檢查選段之後的語音需求，起點 %s', (current) => {
    installVoices(['en-US'])
    failedState.current = current
    const html = render('en')
    expect(html).toContain('Play from here')
    expect(html).toMatch(/disabled=""[^>]*>Play lesson<\/button>/)
    if (current === 0) expect(html).toMatch(/disabled=""[^>]*>Play from here<\/button>/)
    else expect(html).not.toMatch(/disabled=""[^>]*>Play from here<\/button>/)
  })

  it('剩餘段落仍須可播；具備音檔時不強制要求系統聲音', () => {
    installVoices(['ja-JP'])
    failedState.current = 1
    expect(render('en')).toMatch(/disabled=""[^>]*>Play from here<\/button>/)
    const html = render('en', [segments[0], { ...segments[1], audioSrc: 'audio/explanation.mp3' }])
    expect(html).toContain('Play from here')
    expect(html).not.toMatch(/disabled=""[^>]*>Play from here<\/button>/)
    expect(render('en', [])).toMatch(/disabled=""[^>]*>Play from here<\/button>/)
    expect(render('en', [])).not.toMatch(/<button[^>]*aria-describedby[^>]*>Play from here<\/button>/)
  })

  it.each([
    ['en', 'Remaining segments finished', 'Lesson finished'],
    ['zh-Hant', '剩餘段落播放完成', '導讀完成'],
  ] as const)('%s 接續播放完成不冒充全課完成', (locale, expected, misleading) => {
    failedState.phase = 'complete'
    failedState.playback = { scope: 'remaining', index: 0, total: 1 }
    failedState.current = 1
    const html = render(locale)
    expect(html).toContain(expected)
    expect(html).not.toContain(misleading)
    expect(html).toContain(locale === 'en' ? 'Earlier examples and their repeat time are skipped' : '不補播前方原文或其留白')
  })

  it('重新開啟時採用已儲存的慢速與關閉留白偏好', () => {
    vi.stubGlobal('localStorage', { getItem: (key: string) => key === 'e-learning-audio-lesson-v1'
      ? JSON.stringify({ rate: 0.7, shadow: false }) : null })
    const html = render('en')
    expect(html).toMatch(/<option value="0.7" selected="">Slow<\/option>/)
    expect(html).not.toMatch(/type="checkbox"[^>]*checked/)
    expect(html).toContain('Preferences stay in this browser')
  })

  it('段落選單保留原文及解說，第一段不可再往前', () => {
    const html = render('en')
    expect(html).toContain('Choose segment')
    expect(html).toContain('1 / 2 · Example · Japanese · こんにちは。')
    expect(html).toContain('2 / 2 · Explanation · English · A greeting used during the day.')
    expect(html).toMatch(/disabled=""[^>]*>Previous segment<\/button>/)
    expect(html).not.toMatch(/disabled=""[^>]*>Next segment<\/button>/)
    expect(html).toContain('Changing the selection stops playback')
  })

  it('最後一段不可往後，空教材不提供段落導航', () => {
    failedState.current = 1
    const html = render('en')
    expect(html).toMatch(/disabled=""[^>]*>Next segment<\/button>/)
    expect(html).not.toMatch(/disabled=""[^>]*>Previous segment<\/button>/)
    expect(render('en', [])).not.toContain('Choose segment')
  })

  it.each([true, false, null])('實際音源顯示本機、連線與未知的界線 %s', (localService) => {
    const source = { kind: 'speech' as const, lang: 'ja-JP' as const,
      voice: { name: 'Test voice', lang: 'ja-JP', localService }, fallbackReason: 'playback-start-timeout' }
    const html = renderToStaticMarkup(<AudioSourceLabel source={source} en={false} />)
    expect(html).toContain(localService === true ? '本機聲音' : localService === false ? '連線聲音' : '服務類型未知')
    expect(html).toContain('教材音檔未能播放，已改嘗試系統語音')
    const english = renderToStaticMarkup(<AudioSourceLabel source={source} en />)
    expect(english).not.toMatch(/[\u3400-\u9fff]/)
    expect(english).toContain('playback-start-timeout')
  })

  it('音檔來源不顯示舊聲音，瀏覽器預設聲音不捏造服務類型', () => {
    expect(renderToStaticMarkup(<AudioSourceLabel source={{ kind: 'clip', lang: 'en-US', voice: null }} en />))
      .toContain('Lesson audio')
    const html = renderToStaticMarkup(<AudioSourceLabel source={{ kind: 'speech', lang: 'en-US',
      voice: { name: null, lang: null, localService: null } }} en />)
    expect(html).toContain('Browser default voice')
    expect(html).toContain('Service type unknown')
  })
  it('音訊檢查沿用課文語言，明示事件與聽感的界線，不自動錄音或上傳', () => {
    installVoices(['ja-JP', 'en-US'])
    const html = render('zh-Hant')
    for (const text of ['音訊檢查與協助', '試播日語節錄', '試播英語節錄', '網頁無法判斷網站是否被靜音', '不錄音、不自動上傳']) expect(html).toContain(text)
    const english = render('en')
    expect(english).toContain('Audio check and help')
    expect(english).toContain('Test Japanese excerpt')
    expect(english).not.toMatch(/[\u3400-\u9fff]/)
  })
  it('英文介面提供全部操作與誠實的不支援提示，沒有意外中文', () => {
    const html = render('en')
    for (const text of ['Audio lesson', 'Play lesson', 'Play examples', 'Replay current', 'Stop', 'Speed', 'Normal', 'Slow', 'Leave time to repeat']) {
      expect(html).toContain(text)
    }
    expect(html).toContain('System speech is not supported in this browser')
    expect(html).toContain('not a human recording or pronunciation score')
    expect(html).not.toMatch(/[\u3400-\u9fff]/)
    expect(html).toMatch(/disabled=""[^>]*>Play lesson<\/button>/)
  })

  it('繁中介面保留播放、跟讀、速度與語音來源說明', () => {
    const html = render('zh-Hant')
    for (const text of ['語音教學', '播放導讀', '聽原文示範', '重播當句', '停止', '語速', '正常', '慢速', '留白跟讀', '部分聲音需要連線']) {
      expect(html).toContain(text)
    }
    expect(html).toContain('教材文字仍可使用')
  })

  it('需要所有解說語言才能播放導讀，仍可播放已具備聲音的原文', () => {
    installVoices(['ja-JP'])
    const html = render('en')
    expect(html).toContain('Missing voices: English')
    expect(html).toMatch(/disabled=""[^>]*>Play lesson<\/button>/)
    expect(html).not.toMatch(/disabled=""[^>]*>Play examples<\/button>/)
    expect(html).toContain('Check voices again')
  })

  it('具備日英聲音時啟用導讀，但不自動開始播放', () => {
    installVoices(['ja-JP', 'en-US'])
    const html = render('en')
    expect(html).not.toMatch(/disabled=""[^>]*>Play lesson<\/button>/)
    expect(html).toContain('Ready when you are')
    expect(html).not.toContain('audio-lesson-current')
  })

  it('沒有系統語音時，已有音檔的原文仍可用，解說不假裝可播放', () => {
    const html = render('en', [{ ...segments[0], audioSrc: 'audio/greeting.mp3' }, segments[1]])
    expect(html).not.toMatch(/disabled=""[^>]*>Play examples<\/button>/)
    expect(html).toMatch(/disabled=""[^>]*>Play lesson<\/button>/)
  })

  it.each([
    ['en', 'Plays supplied lesson audio when available, with system speech as fallback.', 'not a human recording'],
    ['zh-Hant', '有音檔時使用教材提供的音訊，無法播放時回退系統合成語音。', '非真人錄音'],
  ] as const)('%s 的音檔教材不被誤稱為純系統合成或非真人錄音', (locale, expected, misleading) => {
    const html = render(locale, [{ ...segments[0], audioSrc: 'audio/greeting.mp3' }, segments[1]])
    expect(html).toContain(expected)
    expect(html).not.toContain(misleading)
    expect(html).toContain(locale === 'en' ? 'not a pronunciation score' : '不做發音評分')
    expect(html).toContain(locale === 'en' ? 'some voices need the network' : '部分聲音需要連線')
  })

  it('空教材沒有可操作的假播放入口', () => {
    const html = render('en', [])
    expect(html).toContain('No spoken content is available yet')
    expect(html).toMatch(/disabled=""[^>]*>Play lesson<\/button>/)
  })

  it('臺灣華語聲音不以其他華語口音冒充', () => {
    expect(hasLessonVoice('zh-TW', installVoices(['zh-CN']))).toBe(false)
    expect(hasLessonVoice('zh-TW', installVoices(['zh-TW']))).toBe(true)
    expect(hasLessonVoice('zh-TW', installVoices(['zh-Hant-TW']))).toBe(true)
  })

  it('繁體字標籤不能把香港或中國區域聲音當作臺灣華語', () => {
    expect(hasLessonVoice('zh-TW', installVoices(['zh-Hant-HK']))).toBe(false)
    expect(hasLessonVoice('zh-TW', installVoices(['zh-Hant-CN']))).toBe(false)
    expect(hasLessonVoice('zh-TW', installVoices(['zh-Hant']))).toBe(true)
    expect(hasLessonVoice('zh-TW', installVoices(['zh-Hant-TW-x-local']))).toBe(true)
  })

  it.each([
    ['en', 'Playback failed; try again', 'Ready when you are'],
    ['zh-Hant', '播放失敗，可重試', '準備好即可開始'],
  ] as const)('%s 的錯誤主狀態不會同時宣稱已準備好', (locale, expected, misleading) => {
    failedState.active = true
    const html = render(locale)
    expect(html).toContain(expected)
    expect(html).not.toContain(misleading)
    expect(html).toContain('role="alert"')
  })

  it('次要控制沿用主題底色，停用控制有明確視覺與滑鼠狀態', () => {
    const css = readFileSync(new URL('./audioLesson.css', import.meta.url), 'utf8')
    expect(css).toMatch(/\.audio-lesson \.ghost\s*\{[^}]*background:\s*var\(--surface\)/)
    expect(css).toMatch(/\.audio-lesson button:disabled\s*\{[^}]*opacity:\s*0\.55/)
    expect(css).toMatch(/\.audio-lesson button:disabled\s*\{[^}]*cursor:\s*not-allowed/)
    expect(css).toMatch(/\.audio-lesson \.primary-btn:disabled:hover\s*\{[^}]*background:\s*var\(--btn-primary-bg\)/)
    expect(css).toMatch(/\.audio-lesson \.primary-btn:disabled:hover\s*\{[^}]*transform:\s*none/)
  })

  it.each([
    ['lesson', 2, 'Lesson finished'],
    ['examples', 1, 'Examples finished'],
    ['replay', 1, 'Current segment finished'],
  ])('完成訊息符合 %s 的實際播放範圍', (scope, total, expected) => {
    installVoices(['ja-JP', 'en-US'])
    failedState.phase = 'complete'
    failedState.playback = { scope, index: 0, total }
    const html = render('en')
    expect(html).toContain(expected)
    if (scope !== 'lesson') expect(html).not.toContain('Lesson finished')
    expect(html).toContain('Replay target')
    expect(html).toContain('こんにちは。')
  })

  it.each(['examples', 'replay'])('單獨 %s 的進度以選取段數而非全課計算', (scope) => {
    installVoices(['ja-JP', 'en-US'])
    failedState.phase = 'playing'
    failedState.playback = { scope, index: 0, total: 1 }
    expect(render('en')).toContain('Playing · 1/1')
    expect(render('en')).not.toContain('Playing · 1/2')
  })

  it.each([
    ['lesson', '導讀完成'],
    ['examples', '原文示範播放完成'],
    ['replay', '當句播放完成'],
  ])('繁中 %s 完成訊息保留準確範圍與重播目標', (scope, expected) => {
    installVoices(['ja-JP', 'en-US'])
    failedState.phase = 'complete'
    failedState.playback = { scope, index: 0, total: 1 }
    const html = render('zh-Hant')
    expect(html).toContain(expected)
    expect(html).toContain('重播目標')
    expect(html).toContain('原文示範 · 日語')
    expect(html).toContain('こんにちは。')
  })

  it.each(['stopped', 'error', 'complete'])('%s 後保留已選解說作為可見的重播目標', (phase) => {
    installVoices(['ja-JP', 'en-US'])
    failedState.phase = phase
    failedState.playback = { scope: 'lesson', index: 1, total: 2 }
    failedState.current = 1
    const html = render('en')
    expect(html).toContain('Replay target')
    expect(html).toContain('Explanation')
    expect(html).toContain('A greeting used during the day.')
  })

  it('準備階段不宣稱已開始播放，仍可停止', () => {
    installVoices(['ja-JP', 'en-US'])
    failedState.phase = 'preparing'
    failedState.playback = { scope: 'lesson', index: 0, total: 2 }
    const html = render('en')
    expect(html).toContain('Preparing audio · 1/2')
    expect(html).not.toContain('Playing ·')
    expect(html).not.toMatch(/disabled=""[^>]*>Stop<\/button>/)
  })

  it.each(['playback-not-started', 'playback-start-timeout'])('%s 提供可操作的未啟動說明', (error) => {
    failedState.phase = 'error'
    failedState.error = error
    expect(render('zh-Hant')).toContain('未確認語音開始播放')
    expect(render('en')).toContain('Audio did not start')
    expect(render('en')).toContain('then retry')
  })
})
