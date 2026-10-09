import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

class TestUtterance extends EventTarget {
  text: string
  constructor(text: string) { super(); this.text = text }
  lang = ''
  rate = 1
  pitch = 1
  volume = 1
  voice: { name: string; lang: string; localService?: boolean } | null = null
  onstart: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: ((event: { error: string }) => void) | null = null
}

describe('speech language selection and cancellation', () => {
  let voices: { name: string; lang: string; localService?: boolean }[] = [
    { name: 'US voice', lang: 'en-US' },
    { name: 'British voice', lang: 'en-GB' },
    { name: 'Australian voice', lang: 'en-AU' },
    { name: 'Japanese voice', lang: 'ja-JP' },
  ]
  let voiceEvents = new EventTarget()
  const synth = {
    getVoices: () => voices,
    speak: vi.fn(), cancel: vi.fn(), resume: vi.fn(),
    addEventListener: (name: string, listener: EventListener) => voiceEvents.addEventListener(name, listener),
    removeEventListener: (name: string, listener: EventListener) => voiceEvents.removeEventListener(name, listener),
    speaking: false, pending: false, paused: false,
  }

  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
    synth.speaking = false
    synth.pending = false
    synth.paused = false
    synth.cancel.mockImplementation(() => { synth.speaking = false; synth.pending = false })
    voiceEvents = new EventTarget()
    voices = [
      { name: 'US voice', lang: 'en-US' },
      { name: 'British voice', lang: 'en-GB' },
      { name: 'Australian voice', lang: 'en-AU' },
      { name: 'Japanese voice', lang: 'ja-JP' },
    ]
    synth.speak.mockClear()
    vi.stubGlobal('SpeechSynthesisUtterance', TestUtterance)
    vi.stubGlobal('window', {
      speechSynthesis: synth,
      setTimeout, clearTimeout, setInterval, clearInterval,
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('回報聲音時取消，不得再送出靜音墊句或正文', async () => {
    const { speakJapanese, stopSpeaking } = await import('./speech')
    speakJapanese('こんにちは。', { onVoice: () => stopSpeaking() })
    expect(synth.speak).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('瀏覽器自行選聲時不捏造實際聲音或服務類型', async () => {
    const { speakEnglish } = await import('./speech')
    const onVoice = vi.fn()
    speakEnglish('Welcome.', { lang: 'en-CA', onVoice })
    expect(onVoice).toHaveBeenCalledExactlyOnceWith({ name: null, lang: null, localService: null })
  })

  it.each([true, false, undefined])('回報實際聲音與服務來源 %s，靜音墊句不重複回報', async (localService) => {
    const { speakJapanese } = await import('./speech')
    voices = [{ name: '測試聲音', lang: 'ja-JP', localService }]
    const onVoice = vi.fn()
    speakJapanese('こんにちは。', { onVoice })
    expect(onVoice).toHaveBeenCalledExactlyOnceWith({
      name: '測試聲音', lang: 'ja-JP', localService: localService ?? null,
    })
  })

  it.each(['en-US', 'en-GB', 'en-AU'])('uses the requested %s language and matching installed voice', async (lang) => {
    const { speakEnglish } = await import('./speech')
    speakEnglish('Welcome to the office.', { lang })
    const utterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    expect(utterance.lang).toBe(lang)
    expect(utterance.voice?.lang).toBe(lang)
  })

  it('defaults to US English without overriding an unavailable requested accent', async () => {
    const { speakEnglish } = await import('./speech')
    speakEnglish('Welcome.')
    expect(synth.speak.mock.calls.at(-1)?.[0].lang).toBe('en-US')
    speakEnglish('Welcome.', { lang: 'en-CA' })
    expect(synth.speak.mock.calls.at(-1)?.[0].lang).toBe('en-CA')
    expect(synth.speak.mock.calls.at(-1)?.[0].voice).toBeNull()
  })

  it('Google 日語排在前方時仍優先本機日語，朗讀與靜音墊句使用同一聲音', async () => {
    const { speakJapanese } = await import('./speech')
    const localJapanese = { name: 'Microsoft Haruka', lang: 'ja-JP', localService: true }
    voices = [
      { name: 'Google 日本語', lang: 'ja-JP', localService: false },
      { name: 'Microsoft English', lang: 'en-US', localService: true },
      localJapanese,
    ]
    speakJapanese('こんにちは。')
    const [pad, utterance] = synth.speak.mock.calls.map(([item]) => item as TestUtterance)
    expect(pad.volume).toBe(0)
    expect(pad.lang).toBe('ja-JP')
    expect(pad.voice).toBe(localJapanese)
    expect(utterance.text).toBe('こんにちは。')
    expect(utterance.voice).toBe(localJapanese)
  })

  it('沒有本機日語時保留原本的 Google 日語回退', async () => {
    const { speakJapanese } = await import('./speech')
    const googleJapanese = { name: 'Google 日本語', lang: 'ja-JP', localService: false }
    voices = [
      { name: 'Japanese voice', lang: 'ja-JP', localService: false },
      { name: 'Microsoft English', lang: 'en-US', localService: true },
      googleJapanese,
    ]
    speakJapanese('こんにちは。')
    for (const [item] of synth.speak.mock.calls) {
      expect((item as TestUtterance).voice).toBe(googleJapanese)
    }
    expect(synth.speak).toHaveBeenCalled()
  })

  it('日語本機優先不改變英語原本的 Google 品質優先策略', async () => {
    const { speakEnglish } = await import('./speech')
    const googleEnglish = { name: 'Google US English', lang: 'en-US', localService: false }
    voices = [
      { name: 'Microsoft English', lang: 'en-US', localService: true },
      googleEnglish,
      { name: 'Microsoft Haruka', lang: 'ja-JP', localService: true },
    ]
    speakEnglish('Welcome to the office.')
    for (const [item] of synth.speak.mock.calls) {
      expect((item as TestUtterance).voice).toBe(googleEnglish)
    }
    expect(synth.speak).toHaveBeenCalled()
  })

  it('每次日語播放重新選擇最新清單，本機聲音新增或移除不黏住舊聲音', async () => {
    const { speakJapanese, stopSpeaking } = await import('./speech')
    const googleJapanese = { name: 'Google 日本語', lang: 'ja-JP', localService: false }
    const localJapanese = { name: 'Microsoft Haruka', lang: 'ja-JP', localService: true }
    voices = [googleJapanese]
    speakJapanese('最初の文です。')
    expect(synth.speak.mock.calls.at(-1)?.[0].voice).toBe(googleJapanese)
    stopSpeaking()
    synth.speak.mockClear()

    voices = [googleJapanese, localJapanese]
    voiceEvents.dispatchEvent(new Event('voiceschanged'))
    speakJapanese('次の文です。')
    for (const [item] of synth.speak.mock.calls) {
      expect((item as TestUtterance).voice).toBe(localJapanese)
    }
    expect(synth.speak).toHaveBeenCalled()
    stopSpeaking()
    synth.speak.mockClear()

    voices = [googleJapanese]
    voiceEvents.dispatchEvent(new Event('voiceschanged'))
    speakJapanese('最後の文です。')
    for (const [item] of synth.speak.mock.calls) {
      expect((item as TestUtterance).voice).toBe(googleJapanese)
    }
    expect(synth.speak).toHaveBeenCalled()
  })

  it('does not start a queued utterance after Stop', async () => {
    const { speakEnglish, stopSpeaking } = await import('./speech')
    synth.speaking = true
    speakEnglish('This pending line should be cancelled.')
    stopSpeaking()
    vi.advanceTimersByTime(100)
    expect(synth.speak).not.toHaveBeenCalled()
  })

  it('keeps only the latest request when speech is being cancelled', async () => {
    const { speakEnglish } = await import('./speech')
    synth.speaking = true
    speakEnglish('Old line.')
    speakEnglish('Latest line.', { lang: 'en-GB' })
    vi.advanceTimersByTime(100)
    const audible = synth.speak.mock.calls.map(([utterance]) => utterance as TestUtterance).filter((u) => u.volume !== 0)
    expect(audible).toHaveLength(1)
    expect(audible[0].text).toBe('Latest line.')
    expect(audible[0].lang).toBe('en-GB')
  })

  it('回傳自有停止權限，舊權限不能取消新的播放', async () => {
    const { speakEnglish } = await import('./speech')
    const oldCancelled = vi.fn()
    const oldStop = speakEnglish('Old line.', { onCancel: oldCancelled })
    expect(typeof oldStop).toBe('function')
    const newStop = speakEnglish('New line.')
    expect(oldCancelled).toHaveBeenCalledOnce()
    const cancels = synth.cancel.mock.calls.length
    oldStop()
    expect(synth.cancel).toHaveBeenCalledTimes(cancels)
    newStop()
    expect(synth.cancel).toHaveBeenCalledTimes(cancels + 1)
  })

  it('缺少目標語言音色時回報不可用，不播放其他語言', async () => {
    const { speakJapanese } = await import('./speech')
    voices = [{ name: 'US voice', lang: 'en-US' }]
    const onError = vi.fn()
    speakJapanese('こんにちは。', { onError })
    expect(onError).toHaveBeenCalledWith('voice-unavailable')
    expect(synth.speak).not.toHaveBeenCalled()
  })

  it('初始清單為空時先等候裝置語音，再開始播放', async () => {
    const { speakEnglish } = await import('./speech')
    voices = []
    speakEnglish('Ready after the device voices load.')
    expect(synth.speak).not.toHaveBeenCalled()
    voices = [{ name: 'US voice', lang: 'en-US' }]
    voiceEvents.dispatchEvent(new Event('voiceschanged'))
    await Promise.resolve()
    const utterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    expect(utterance.text).toBe('Ready after the device voices load.')
    expect(utterance.voice?.lang).toBe('en-US')
  })

  it('長段落等候真正結束事件，不以固定時間切斷', async () => {
    const { speakSequence } = await import('./speech')
    void speakSequence(['長い説明を最後まで聞いてください。', '次の文です。'], 0)
    const audible = () => synth.speak.mock.calls.map(([utterance]) => utterance as TestUtterance).filter((utterance) => utterance.volume !== 0)
    synth.speaking = true
    audible()[0].onstart?.()
    await vi.advanceTimersByTimeAsync(20000)
    expect(audible().map((utterance) => utterance.text)).toEqual(['長い説明を最後まで聞いてください。'])
    synth.speaking = false
    audible()[0].onend?.()
    await vi.advanceTimersByTimeAsync(1)
    expect(audible().map((utterance) => utterance.text)).toEqual(['長い説明を最後まで聞いてください。', '次の文です。'])
  })

  it('臺灣華語不以其他地區的華語音色代替', async () => {
    const { speakChinese } = await import('./speech')
    voices = [{ name: 'Mandarin voice', lang: 'zh-CN' }]
    const onError = vi.fn()
    speakChinese('請聽臺灣華語。', { onError })
    expect(onError).toHaveBeenCalledWith('voice-unavailable')
    expect(synth.speak).not.toHaveBeenCalled()
  })

  it('臺灣華語可使用裝置已提供的繁體華語音色', async () => {
    const { speakChinese } = await import('./speech')
    voices = [{ name: 'Traditional Mandarin voice', lang: 'zh-Hant-TW' }]
    speakChinese('請聽臺灣華語。')
    const utterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    expect(utterance.lang).toBe('zh-TW')
    expect(utterance.voice?.lang).toBe('zh-Hant-TW')
  })

  it('停止語音就緒等待後移除計時器，遲到的清單不會啟動播放', async () => {
    const { speakEnglish } = await import('./speech')
    voices = []
    const onCancel = vi.fn()
    const onError = vi.fn()
    const stop = speakEnglish('Do not start after cancellation.', { onCancel, onError })
    stop()
    expect(onCancel).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
    voices = [{ name: 'US voice', lang: 'en-US' }]
    voiceEvents.dispatchEvent(new Event('voiceschanged'))
    await vi.advanceTimersByTimeAsync(2000)
    expect(synth.speak).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('裝置持續沒有語音時回報不可用，清理就緒等待計時器', async () => {
    const { speakEnglish } = await import('./speech')
    voices = []
    const onError = vi.fn()
    speakEnglish('No installed voice.', { onError })
    await vi.advanceTimersByTimeAsync(1500)
    expect(onError).toHaveBeenCalledWith('voice-unavailable')
    expect(synth.speak).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('缺少原生 utterance 建構子時回報不支援', async () => {
    const { speakEnglish } = await import('./speech')
    vi.stubGlobal('SpeechSynthesisUtterance', undefined)
    const onError = vi.fn()
    speakEnglish('Unsupported speech.', { onError })
    expect(onError).toHaveBeenCalledWith('unsupported')
    expect(synth.speak).not.toHaveBeenCalled()
  })

  it('未收到真正開始就結束時回報錯誤，不冒充成功', async () => {
    const { speakEnglish } = await import('./speech')
    const onEnd = vi.fn()
    const onError = vi.fn()
    speakEnglish('This sentence never started.', { onEnd, onError })
    const utterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    utterance.onend?.()
    expect(onError).toHaveBeenCalledWith('playback-not-started')
    expect(onEnd).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('啟動期限內完全沒有事件時回報錯誤並回收，不永久等候', async () => {
    const { speakEnglish } = await import('./speech')
    const onError = vi.fn()
    speakEnglish('The native engine emits no events.', { onError })
    await vi.advanceTimersByTimeAsync(9999)
    expect(onError).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(onError).toHaveBeenCalledWith('playback-start-timeout')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('真正開始後原生引擎持續閒置但遺失結束事件時回報失敗', async () => {
    const { speakEnglish } = await import('./speech')
    const onEnd = vi.fn()
    const onError = vi.fn()
    speakEnglish('Started but then lost its terminal event.', { onEnd, onError })
    const utterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    synth.speaking = true
    utterance.onstart?.()
    await vi.advanceTimersByTimeAsync(500)
    synth.speaking = false
    await vi.advanceTimersByTimeAsync(1800)
    expect(onError).toHaveBeenCalledWith('playback-failed')
    expect(onEnd).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('啟動逾時後遲到的開始與結束回呼都不能冒充成功', async () => {
    const { speakEnglish } = await import('./speech')
    const onStart = vi.fn()
    const onEnd = vi.fn()
    const onError = vi.fn()
    speakEnglish('Late events are no longer owned.', { onStart, onEnd, onError })
    const utterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    const lateStart = utterance.onstart
    const lateEnd = utterance.onend
    await vi.advanceTimersByTimeAsync(10000)
    lateStart?.()
    lateEnd?.()
    expect(onError).toHaveBeenCalledExactlyOnceWith('playback-start-timeout')
    expect(onStart).not.toHaveBeenCalled()
    expect(onEnd).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('停止準備會清理自身期限，舊權限及遲到事件不會取消新 owner', async () => {
    const { speakEnglish } = await import('./speech')
    const oldError = vi.fn()
    const oldCancelled = vi.fn()
    const oldStop = speakEnglish('Old pending owner.', { onError: oldError, onCancel: oldCancelled })
    const old = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    const lateStart = old.onstart
    const lateEnd = old.onend
    await vi.advanceTimersByTimeAsync(5000)
    oldStop()
    expect(oldCancelled).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
    const newEnd = vi.fn()
    const newError = vi.fn()
    const newCancelled = vi.fn()
    speakEnglish('A long new owner.', { onEnd: newEnd, onError: newError, onCancel: newCancelled })
    const newer = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    synth.speaking = true
    newer.onstart?.()
    const cancelCount = synth.cancel.mock.calls.length
    lateStart?.()
    lateEnd?.()
    oldStop()
    await vi.advanceTimersByTimeAsync(20000)
    expect(synth.cancel).toHaveBeenCalledTimes(cancelCount)
    expect(oldError).not.toHaveBeenCalled()
    expect(newError).not.toHaveBeenCalled()
    expect(newCancelled).not.toHaveBeenCalled()
    synth.speaking = false
    newer.onend?.()
    expect(newEnd).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('真正開始後 pending 的長句不被啟動期限或閒置偵測切斷', async () => {
    const { speakEnglish } = await import('./speech')
    const onEnd = vi.fn()
    const onError = vi.fn()
    speakEnglish('A long utterance remains pending in the native queue.', { onEnd, onError })
    const utterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    synth.pending = true
    utterance.onstart?.()
    await vi.advanceTimersByTimeAsync(25000)
    expect(onError).not.toHaveBeenCalled()
    expect(onEnd).not.toHaveBeenCalled()
    synth.pending = false
    utterance.onend?.()
    expect(onEnd).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('短暫閒置後恢復 speaking 會重設 grace，不累積成長句失敗', async () => {
    const { speakEnglish } = await import('./speech')
    const onError = vi.fn()
    const onEnd = vi.fn()
    speakEnglish('Temporary native idle is not a terminal event.', { onError, onEnd })
    const utterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    synth.speaking = true
    utterance.onstart?.()
    for (let i = 0; i < 3; i += 1) {
      synth.speaking = false
      await vi.advanceTimersByTimeAsync(1200)
      synth.speaking = true
      await vi.advanceTimersByTimeAsync(240)
    }
    expect(onError).not.toHaveBeenCalled()
    synth.speaking = false
    utterance.onend?.()
    expect(onEnd).toHaveBeenCalledOnce()
  })

  it('導讀未真正開始就 end 時也不續播第二句', async () => {
    const { speakSequence } = await import('./speech')
    const sequence = speakSequence(['Never started.', 'Must not continue.'], 500, undefined, undefined, 'en-US')
    const utterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    utterance.onend?.()
    await sequence
    await vi.advanceTimersByTimeAsync(20000)
    const audible = synth.speak.mock.calls.map(([item]) => item as TestUtterance).filter((item) => item.volume !== 0)
    expect(audible.map((item) => item.text)).toEqual(['Never started.'])
    expect(vi.getTimerCount()).toBe(0)
  })

  it.each(['canceled', 'interrupted'])('原生 %s 是停止，不冒充播放失敗', async (error) => {
    const { speakEnglish } = await import('./speech')
    const onCancel = vi.fn()
    const onError = vi.fn()
    speakEnglish('An interrupted sentence.', { onCancel, onError })
    const utterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    utterance.onerror?.({ error })
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onError).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('保存的舊回呼不能結束新播放', async () => {
    const { speakEnglish } = await import('./speech')
    const oldEnd = vi.fn()
    const newEnd = vi.fn()
    speakEnglish('Old sentence.', { onEnd: oldEnd })
    const oldUtterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    const savedEnd = oldUtterance.onend
    speakEnglish('New sentence.', { onEnd: newEnd })
    savedEnd?.()
    expect(oldEnd).not.toHaveBeenCalled()
    expect(newEnd).not.toHaveBeenCalled()
    const newUtterance = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    synth.speaking = true
    newUtterance.onstart?.()
    synth.speaking = false
    newUtterance.onend?.()
    expect(newEnd).toHaveBeenCalledOnce()
  })

  it.each(['single', 'lesson'] as const)('導讀段間留白會讓出新 %s 播放，舊導讀不會搶回所有權', async (kind) => {
    const { speakEnglish, speakSequence } = await import('./speech')
    const { startAudioLesson } = await import('./audioLessonPlayback')
    vi.stubGlobal('window', Object.assign(new EventTarget(), {
      speechSynthesis: synth, setTimeout, clearTimeout, setInterval, clearInterval,
    }))
    let sequenceComplete = false
    const sequence = speakSequence(['First guide line.', 'Old second guide line.'], 500, undefined, undefined, 'en-US')
      .then(() => { sequenceComplete = true })
    const first = synth.speak.mock.calls.at(-1)?.[0] as TestUtterance
    synth.speaking = true
    first.onstart?.()
    synth.speaking = false
    first.onend?.()
    await Promise.resolve()
    expect(sequenceComplete).toBe(false)
    const newerCancelled = vi.fn()
    if (kind === 'single') speakEnglish('The new owner.', { onCancel: newerCancelled })
    else startAudioLesson([{ id: 'new', text: 'The new owner.', lang: 'en-US', kind: 'example' }], {
      rate: 1, shadow: false, onSegment: vi.fn(), onPhase: newerCancelled, onError: vi.fn(),
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(sequenceComplete).toBe(true)
    await vi.advanceTimersByTimeAsync(600)
    const audible = synth.speak.mock.calls.map(([utterance]) => utterance as TestUtterance).filter((utterance) => utterance.volume !== 0)
    expect(audible.map((utterance) => utterance.text)).toEqual(['First guide line.', 'The new owner.'])
    if (kind === 'single') expect(newerCancelled).not.toHaveBeenCalled()
    else expect(newerCancelled).not.toHaveBeenCalledWith('stopped')
    const newer = audible.at(-1)
    synth.speaking = true
    newer?.onstart?.()
    synth.speaking = false
    newer?.onend?.()
    await sequence
  })
})
