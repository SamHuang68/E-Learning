import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement } from 'react'
import type { AudioLessonPlaybackOptions, AudioLessonSegment } from './audioLessonTypes'

const buttonLifecycle = vi.hoisted(() => ({
  setSpeaking: vi.fn(),
  setters: [] as Array<ReturnType<typeof vi.fn>>,
  cleanups: [] as Array<() => void>,
}))

// 只替代 React 掛載邊界；播放事件、停止函式、音檔和語音核心均使用真實實作。
vi.mock('react', async (importOriginal) => ({
  ...await importOriginal<typeof import('react')>(),
  useState: () => {
    const setter = vi.fn((value: boolean) => buttonLifecycle.setSpeaking(value))
    buttonLifecycle.setters.push(setter)
    return [false, setter]
  },
  useRef: <T>(current: T) => ({ current }),
  useEffect: (effect: () => void | (() => void)) => {
    const cleanup = effect()
    if (cleanup) buttonLifecycle.cleanups.push(cleanup)
  },
}))

class TestUtterance extends EventTarget {
  text: string
  constructor(text: string) { super(); this.text = text }
  lang = ''
  rate = 1
  pitch = 1
  volume = 1
  voice: { name: string; lang: string } | null = null
  onstart: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: ((event: { error: string }) => void) | null = null
}

const clips: TestAudio[] = []
let throwClipOnPlay = false
class TestAudio {
  constructor() { clips.push(this) }
  private source = ''
  get src() { return this.source }
  set src(value: string) {
    this.source = value
    // 原生元素指定來源時會還原為預設速率；不可用不重設的替身掩蓋慢速失效。
    this.playbackRate = this.defaultPlaybackRate
  }
  preload = ''
  defaultPlaybackRate = 1
  playbackRate = 1
  currentTime = 0
  onplaying: (() => void) | null = null
  onended: (() => void) | null = null
  onerror: (() => void) | null = null
  play = vi.fn(() => {
    if (throwClipOnPlay) throw new Error('音檔啟動失敗')
    return Promise.resolve()
  })
  pause = vi.fn()
}

const segments: AudioLessonSegment[] = [
  { id: 'example', text: 'Please listen to this complete example sentence.', lang: 'en-US', kind: 'example' },
  { id: 'explanation', text: '請留意句尾的語調。', lang: 'zh-TW', kind: 'explanation' },
]

describe('語音教學分段與播放生命週期', () => {
  const synth = {
    getVoices: () => [
      { name: 'US voice', lang: 'en-US' },
      { name: 'Japanese voice', lang: 'ja-JP' },
      { name: 'Taiwan voice', lang: 'zh-TW' },
    ],
    speak: vi.fn(), cancel: vi.fn(), resume: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    speaking: false, pending: false, paused: false,
  }
  let page: EventTarget & { hidden: boolean }
  let options: AudioLessonPlaybackOptions
  const audible = () => synth.speak.mock.calls.map(([utterance]) => utterance as TestUtterance).filter((utterance) => utterance.volume !== 0)
  const startUtterance = (utterance: TestUtterance) => {
    synth.speaking = true
    utterance.onstart?.()
  }
  const endUtterance = (utterance: TestUtterance) => {
    synth.speaking = false
    utterance.onend?.()
  }
  const completeUtterance = (utterance: TestUtterance) => {
    startUtterance(utterance)
    endUtterance(utterance)
  }
  const advanceClip = async (clip: TestAudio, durationMs: number) => {
    for (let elapsed = 0; elapsed < durationMs; elapsed += 250) {
      const step = Math.min(250, durationMs - elapsed)
      clip.currentTime += step / 1000 * clip.playbackRate
      await vi.advanceTimersByTimeAsync(step)
    }
  }

  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
    synth.speak.mockClear()
    synth.cancel.mockClear()
    synth.speaking = false
    synth.pending = false
    synth.paused = false
    synth.cancel.mockImplementation(() => { synth.speaking = false; synth.pending = false })
    clips.length = 0
    throwClipOnPlay = false
    buttonLifecycle.setSpeaking.mockClear()
    buttonLifecycle.setters.length = 0
    buttonLifecycle.cleanups.length = 0
    page = Object.assign(new EventTarget(), { hidden: false })
    vi.stubGlobal('document', page)
    vi.stubGlobal('SpeechSynthesisUtterance', TestUtterance)
    vi.stubGlobal('Audio', TestAudio)
    vi.stubGlobal('window', Object.assign(new EventTarget(), {
      speechSynthesis: synth,
      setTimeout, clearTimeout, setInterval, clearInterval,
    }))
    options = { rate: 0.8, shadow: false, onSegment: vi.fn(), onPhase: vi.fn(), onError: vi.fn() }
  })

  afterEach(() => {
    for (const cleanup of buttonLifecycle.cleanups) cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('教學等待真正的原生 start 才顯示播放，未開始的 end 不續播或完成', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson(segments, options)
    expect(options.onPhase).toHaveBeenLastCalledWith('preparing')
    audible()[0].onend?.()
    expect(options.onError).toHaveBeenCalledWith('playback-not-started')
    expect(options.onPhase).toHaveBeenLastCalledWith('error')
    expect(options.onPhase).not.toHaveBeenCalledWith('complete')
    expect(audible()).toHaveLength(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('音檔的 play 承諾完成仍在準備，只有 playing 事件才是播放', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/example.mp3' }], options)
    await Promise.resolve()
    expect(options.onPhase).toHaveBeenLastCalledWith('preparing')
    clips[0].onplaying?.()
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    clips[0].onended?.()
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
    expect(options.onError).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('未開始的音檔結束會回退至準備朗讀，不冒充已播完', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/example.mp3' }], options)
    clips[0].onended?.()
    expect(audible()).toHaveLength(1)
    expect(options.onPhase).toHaveBeenLastCalledWith('preparing')
    expect(options.onPhase).not.toHaveBeenCalledWith('complete')
    synth.speaking = true
    audible()[0].onstart?.()
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    synth.speaking = false
    audible()[0].onend?.()
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
  })

  it('音檔無啟動事件時到期只回退一次，朗讀也未啟動則可見失敗', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/no-events.mp3' }], options)
    const latePlaying = clips[0].onplaying
    const lateEnd = clips[0].onended
    await vi.advanceTimersByTimeAsync(10000)
    expect(clips[0].pause).toHaveBeenCalledOnce()
    expect(audible()).toHaveLength(1)
    expect(options.onPhase).toHaveBeenLastCalledWith('preparing')
    latePlaying?.()
    lateEnd?.()
    expect(options.onPhase).toHaveBeenLastCalledWith('preparing')
    await vi.advanceTimersByTimeAsync(10000)
    expect(audible()).toHaveLength(1)
    expect(options.onError).toHaveBeenCalledWith('playback-start-timeout')
    expect(options.onPhase).toHaveBeenLastCalledWith('error')
    expect(options.onPhase).not.toHaveBeenCalledWith('complete')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('音檔同步啟動例外也回收期限再回退，不遺留舊播放資源', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    throwClipOnPlay = true
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/throws.mp3' }], options)
    expect(clips[0].pause).toHaveBeenCalledOnce()
    expect(clips[0].onplaying).toBeNull()
    expect(clips[0].onended).toBeNull()
    expect(clips[0].onerror).toBeNull()
    expect(audible()).toHaveLength(1)
    completeUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
    expect(options.onError).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('已開始的音檔失敗會重新準備 TTS，真正 start 前不假稱播放', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/example.mp3' }], options)
    clips[0].onplaying?.()
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    clips[0].onerror?.()
    expect(options.onPhase).toHaveBeenLastCalledWith('preparing')
    startUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    await vi.advanceTimersByTimeAsync(15000)
    expect(options.onError).not.toHaveBeenCalled()
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    endUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
  })

  it('音檔 playing 後連續沒有進度與終止事件時回退，不永久播放', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/stalled.mp3' }], options)
    clips[0].onplaying?.()
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    await vi.advanceTimersByTimeAsync(9999)
    expect(audible()).toHaveLength(0)
    await vi.advanceTimersByTimeAsync(1)
    expect(clips[0].pause).toHaveBeenCalledOnce()
    expect(options.onPhase).toHaveBeenLastCalledWith('preparing')
    expect(audible().map((utterance) => utterance.text)).toEqual([segments[0].text])
    expect(options.onPhase).not.toHaveBeenCalledWith('complete')
    completeUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
    expect(options.onError).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it.each([0.25, 0.8, 1])('音檔以 %s 倍速持續前進超過一分鐘仍等真正 ended', async (rate) => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/long.mp3' }], { ...options, rate })
    clips[0].onplaying?.()
    await advanceClip(clips[0], 65000)
    expect(clips[0].currentTime).toBeCloseTo(65 * rate)
    expect(clips[0].pause).not.toHaveBeenCalled()
    expect(audible()).toHaveLength(0)
    expect(options.onError).not.toHaveBeenCalled()
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    expect(options.onPhase).not.toHaveBeenCalledWith('complete')
    clips[0].onended?.()
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('音檔短暫緩衝後真正前進會重新取得停滯寬限', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/buffering.mp3' }], options)
    clips[0].onplaying?.()
    await advanceClip(clips[0], 5000)
    for (let i = 0; i < 3; i += 1) {
      await vi.advanceTimersByTimeAsync(9000)
      expect(clips[0].pause).not.toHaveBeenCalled()
      clips[0].onplaying?.()
      await advanceClip(clips[0], 1000)
    }
    expect(audible()).toHaveLength(0)
    expect(options.onError).not.toHaveBeenCalled()
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    clips[0].onended?.()
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('音檔先前進再停滯時從最後進度起算，回退仍保留同原文與慢速', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/progress-then-stall.mp3' }], options)
    clips[0].onplaying?.()
    await advanceClip(clips[0], 15000)
    await vi.advanceTimersByTimeAsync(9999)
    expect(audible()).toHaveLength(0)
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    await vi.advanceTimersByTimeAsync(1)
    expect(clips[0].pause).toHaveBeenCalledOnce()
    expect(audible()).toHaveLength(1)
    expect(audible()[0].text).toBe(segments[0].text)
    expect(audible()[0].lang).toBe(segments[0].lang)
    expect(audible()[0].rate).toBe(options.rate)
    expect(options.onPhase).toHaveBeenLastCalledWith('preparing')
    completeUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
    expect(options.onError).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('反覆 playing 不新增 watcher 或延長停滯期限，失敗只回報一次', async () => {
    const { playClip } = await import('./mediaAudio')
    const onStart = vi.fn()
    const onEnd = vi.fn()
    const onError = vi.fn()
    playClip('audio/stalled.mp3', { onStart, onEnd, onError })
    const repeatedPlaying = clips[0].onplaying
    const lateEnd = clips[0].onended
    const lateError = clips[0].onerror
    repeatedPlaying?.()
    for (let i = 0; i < 9; i += 1) {
      await vi.advanceTimersByTimeAsync(1000)
      repeatedPlaying?.()
      expect(vi.getTimerCount()).toBe(1)
    }
    expect(onError).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1000)
    expect(onStart).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledExactlyOnceWith('playback-failed')
    expect(clips[0].pause).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
    repeatedPlaying?.()
    lateEnd?.()
    lateError?.()
    await vi.advanceTimersByTimeAsync(20000)
    expect(onError).toHaveBeenCalledOnce()
    expect(onEnd).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('音檔 onStart 同步 stop 也立即清理 watcher，晚到事件不復活', async () => {
    const { playClip } = await import('./mediaAudio')
    const onError = vi.fn()
    const onEnd = vi.fn()
    const stop = playClip('audio/stop-on-start.mp3', { onStart: () => stop(), onError, onEnd })
    const latePlaying = clips[0].onplaying
    const lateEnd = clips[0].onended
    const lateError = clips[0].onerror
    latePlaying?.()
    expect(clips[0].pause).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
    latePlaying?.()
    lateEnd?.()
    lateError?.()
    await vi.advanceTimersByTimeAsync(20000)
    expect(onEnd).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('音檔 onStart 同步換教學會清理舊 watcher，不影響新 owner', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    const newerOptions = { ...options, onPhase: vi.fn(), onError: vi.fn() }
    const oldPhase = vi.fn((phase: string) => {
      if (phase === 'playing') startAudioLesson([{ ...segments[0], audioSrc: 'audio/new.mp3' }], newerOptions)
    })
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/old.mp3' }], { ...options, onPhase: oldPhase })
    const latePlaying = clips[0].onplaying
    const lateEnd = clips[0].onended
    const lateError = clips[0].onerror
    latePlaying?.()
    expect(oldPhase).toHaveBeenLastCalledWith('stopped')
    expect(clips[0].pause).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(1)
    clips[1].onplaying?.()
    latePlaying?.()
    lateEnd?.()
    lateError?.()
    await advanceClip(clips[1], 20000)
    expect(clips[1].pause).not.toHaveBeenCalled()
    expect(audible()).toHaveLength(0)
    expect(newerOptions.onError).not.toHaveBeenCalled()
    expect(newerOptions.onPhase).toHaveBeenLastCalledWith('playing')
    clips[1].onended?.()
    expect(newerOptions.onPhase).toHaveBeenLastCalledWith('complete')
    expect(vi.getTimerCount()).toBe(0)
  })

  it.each(['ended', 'error', 'stop'] as const)('音檔真正開始後 %s 會清理進度 watcher', async (terminal) => {
    const { playClip } = await import('./mediaAudio')
    const onEnd = vi.fn()
    const onError = vi.fn()
    const stop = playClip('audio/terminal.mp3', { onEnd, onError })
    const latePlaying = clips[0].onplaying
    const lateEnd = clips[0].onended
    const lateError = clips[0].onerror
    latePlaying?.()
    await advanceClip(clips[0], 1000)
    if (terminal === 'ended') lateEnd?.()
    else if (terminal === 'error') lateError?.()
    else stop()
    expect(vi.getTimerCount()).toBe(0)
    latePlaying?.()
    lateEnd?.()
    lateError?.()
    await vi.advanceTimersByTimeAsync(20000)
    expect(vi.getTimerCount()).toBe(0)
    expect(onEnd).toHaveBeenCalledTimes(terminal === 'ended' ? 1 : 0)
    expect(onError).toHaveBeenCalledTimes(terminal === 'error' ? 1 : 0)
    if (terminal === 'error') expect(onError).toHaveBeenCalledWith('playback-failed')
  })

  it('停止準備中的音檔清理期限與遲到事件，舊 stop 不影響新長音檔', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    const oldStop = startAudioLesson([{ ...segments[0], audioSrc: 'audio/old.mp3' }], options)
    const lateStart = clips[0].onplaying
    const lateEnd = clips[0].onended
    const lateError = clips[0].onerror
    await vi.advanceTimersByTimeAsync(5000)
    oldStop()
    expect(options.onPhase).toHaveBeenLastCalledWith('stopped')
    expect(vi.getTimerCount()).toBe(0)
    const newerOptions = { ...options, onPhase: vi.fn(), onError: vi.fn() }
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/new.mp3' }], newerOptions)
    clips[1].onplaying?.()
    lateStart?.()
    lateEnd?.()
    lateError?.()
    oldStop()
    await advanceClip(clips[1], 20000)
    expect(clips[1].pause).not.toHaveBeenCalled()
    expect(audible()).toHaveLength(0)
    expect(options.onError).not.toHaveBeenCalled()
    expect(newerOptions.onError).not.toHaveBeenCalled()
    expect(newerOptions.onPhase).toHaveBeenLastCalledWith('playing')
    clips[1].onended?.()
    expect(newerOptions.onPhase).toHaveBeenLastCalledWith('complete')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('原生開始後遺失 end 且持續閒置，教學回報失敗而不續播', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson(segments, options)
    startUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    synth.speaking = false
    await vi.advanceTimersByTimeAsync(1800)
    expect(options.onError).toHaveBeenCalledExactlyOnceWith('playback-failed')
    expect(options.onPhase).toHaveBeenLastCalledWith('error')
    expect(options.onPhase).not.toHaveBeenCalledWith('complete')
    expect(audible()).toHaveLength(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('等候真實結束事件，不以 2.5 秒切斷長段落', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson(segments, options)
    expect(audible().map((utterance) => utterance.text)).toEqual([segments[0].text])
    expect(options.onSegment).toHaveBeenLastCalledWith(0)
    startUtterance(audible()[0])
    await vi.advanceTimersByTimeAsync(10000)
    expect(audible()).toHaveLength(1)
    endUtterance(audible()[0])
    expect(audible().map((utterance) => utterance.text)).toEqual(segments.map((segment) => segment.text))
    expect(audible()[1].lang).toBe('zh-TW')
    expect(audible()[1].rate).toBe(0.8)
    completeUtterance(audible()[1])
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
    expect(options.onError).not.toHaveBeenCalled()
  })

  it('示範與解說結束後保留跟讀留白，停止會取消留白與後續完成', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    options.shadow = true
    const stop = startAudioLesson(segments, options)
    completeUtterance(audible()[0])
    startUtterance(audible()[1])
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    endUtterance(audible()[1])
    expect(options.onPhase).toHaveBeenLastCalledWith('shadowing')
    expect(audible()).toHaveLength(2)
    await vi.advanceTimersByTimeAsync(100)
    expect(audible()).toHaveLength(2)
    stop()
    expect(options.onPhase).toHaveBeenLastCalledWith('stopped')
    await vi.advanceTimersByTimeAsync(20000)
    expect(audible()).toHaveLength(2)
    expect(options.onPhase).toHaveBeenLastCalledWith('stopped')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('新教學取消舊教學的留白，舊停止權限不能誤停新教學', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    options.shadow = true
    const oldStop = startAudioLesson(segments, options)
    completeUtterance(audible()[0])
    completeUtterance(audible()[1])
    expect(options.onPhase).toHaveBeenLastCalledWith('shadowing')
    const nextOptions = { ...options, shadow: false, onPhase: vi.fn() }
    startAudioLesson([segments[1]], nextOptions)
    startUtterance(audible()[2])
    expect(options.onPhase).toHaveBeenLastCalledWith('stopped')
    const cancels = synth.cancel.mock.calls.length
    oldStop()
    expect(synth.cancel).toHaveBeenCalledTimes(cancels)
    await vi.advanceTimersByTimeAsync(20000)
    expect(audible().map((utterance) => utterance.text)).toEqual([segments[0].text, segments[1].text, segments[1].text])
    endUtterance(audible()[2])
    expect(nextOptions.onPhase).toHaveBeenLastCalledWith('complete')
  })

  it('新單句朗讀會中斷教學留白，不容許舊教學稍後重新啟動', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    const { speakEnglish } = await import('./speech')
    options.shadow = true
    startAudioLesson(segments, options)
    completeUtterance(audible()[0])
    completeUtterance(audible()[1])
    expect(options.onPhase).toHaveBeenLastCalledWith('shadowing')
    speakEnglish('A new standalone sentence.')
    startUtterance(audible()[2])
    expect(options.onPhase).toHaveBeenLastCalledWith('stopped')
    await vi.advanceTimersByTimeAsync(20000)
    expect(audible().map((utterance) => utterance.text)).toEqual([segments[0].text, segments[1].text, 'A new standalone sentence.'])
  })

  it('頁面隱藏時停止，晚到的舊結束事件不會繼續教學', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson(segments, options)
    const oldEnd = audible()[0].onend
    page.hidden = true
    page.dispatchEvent(new Event('visibilitychange'))
    expect(options.onPhase).toHaveBeenLastCalledWith('stopped')
    oldEnd?.()
    await vi.advanceTimersByTimeAsync(20000)
    expect(audible()).toHaveLength(1)
    expect(vi.getTimerCount()).toBe(0)
    expect(options.onError).not.toHaveBeenCalled()
  })

  it('沿用的音檔播放器也套用使用者選擇的慢速', async () => {
    const { playClip } = await import('./mediaAudio')
    const stop = playClip('audio/example.mp3', { rate: 0.8 })
    expect(clips).toHaveLength(1)
    expect(clips[0].playbackRate).toBe(0.8)
    expect(clips[0].preload).toBe('none')
    stop()
  })

  it.each([0.7, 0.95, 1])('原生來源載入重設速率時仍保留 %s 倍速', async (rate) => {
    const { playClip } = await import('./mediaAudio')
    const stop = playClip('audio/example.mp3', { rate })
    expect(clips[0].defaultPlaybackRate).toBe(rate)
    expect(clips[0].playbackRate).toBe(rate)
    expect(clips[0].play).toHaveBeenCalledOnce()
    clips[0].src = clips[0].src
    expect(clips[0].playbackRate).toBe(rate)
    stop()
  })

  it('有指定音檔時優先播放音檔，結束後才進入下一段', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/example.mp3' }, segments[1]], options)
    expect(clips).toHaveLength(1)
    expect(clips[0].playbackRate).toBe(0.8)
    expect(audible()).toHaveLength(0)
    clips[0].onplaying?.()
    clips[0].onended?.()
    expect(audible().map((utterance) => utterance.text)).toEqual([segments[1].text])
    completeUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
  })

  it('音檔失敗只回退一次朗讀，保持相同語言與語速', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/missing.mp3' }], options)
    const oldError = clips[0].onerror
    oldError?.()
    oldError?.()
    await Promise.resolve()
    expect(audible()).toHaveLength(1)
    expect(audible()[0].text).toBe(segments[0].text)
    expect(audible()[0].lang).toBe('en-US')
    expect(audible()[0].rate).toBe(0.8)
    expect(clips[0].pause).toHaveBeenCalledOnce()
    completeUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
    expect(options.onError).not.toHaveBeenCalled()
  })

  it('新單句取消正在播放的教學音檔，舊音檔不能觸發回退或續播', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    const { speakEnglish } = await import('./speech')
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/example.mp3' }, segments[1]], options)
    const oldError = clips[0].onerror
    const oldEnd = clips[0].onended
    speakEnglish('A standalone sentence replaces the clip.')
    startUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('stopped')
    expect(clips[0].pause).toHaveBeenCalledOnce()
    oldError?.()
    oldEnd?.()
    await vi.advanceTimersByTimeAsync(20000)
    expect(audible().map((utterance) => utterance.text)).toEqual(['A standalone sentence replaces the clip.'])
    expect(options.onError).not.toHaveBeenCalled()
  })

  it('頁面離開時取消語音等待，遲到的就緒結果不會開始教學', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    vi.spyOn(synth, 'getVoices').mockReturnValue([])
    startAudioLesson(segments, options)
    window.dispatchEvent(new Event('pagehide'))
    expect(options.onPhase).toHaveBeenLastCalledWith('stopped')
    expect(vi.getTimerCount()).toBe(0)
    await vi.advanceTimersByTimeAsync(2000)
    expect(audible()).toHaveLength(0)
    expect(options.onError).not.toHaveBeenCalled()
  })

  it('原生播放拋出例外時回報可見錯誤並清理，不留續播計時器', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    synth.speak.mockImplementationOnce(() => { throw new Error('原生播放失敗') })
    startAudioLesson(segments, options)
    expect(options.onError).toHaveBeenCalledWith('playback-failed')
    expect(options.onPhase).toHaveBeenLastCalledWith('error')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('沒有音訊與原生朗讀時回報不支援，不把失敗當完成', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    vi.stubGlobal('Audio', undefined)
    vi.stubGlobal('SpeechSynthesisUtterance', undefined)
    startAudioLesson([{ ...segments[0], audioSrc: 'audio/example.mp3' }], options)
    expect(options.onError).toHaveBeenCalledWith('unsupported')
    expect(options.onPhase).toHaveBeenLastCalledWith('error')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('空教學回報 empty-lesson，無效語速回報 playback-failed', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    startAudioLesson([], options)
    expect(options.onError).toHaveBeenCalledWith('empty-lesson')
    options.onError = vi.fn()
    startAudioLesson(segments, { ...options, rate: Number.NaN })
    expect(options.onError).toHaveBeenCalledWith('playback-failed')
    expect(audible()).toHaveLength(0)
  })

  it('講解段落不加入跟讀留白，也不在完成後留下中斷訂閱', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    const { speakEnglish } = await import('./speech')
    startAudioLesson([segments[1]], { ...options, shadow: true })
    completeUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
    speakEnglish('The completed lesson stays complete.')
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
  })

  it('非瀏覽器環境回報不支援，不拋出環境例外', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    vi.stubGlobal('window', undefined)
    startAudioLesson(segments, options)
    expect(options.onError).toHaveBeenCalledWith('unsupported')
    expect(options.onPhase).toHaveBeenLastCalledWith('error')
  })

  it.each(['tts', 'clip', 'shadow'] as const)('單句音檔會取消 %s 教學，教學不會稍後重新開始', async (mode) => {
    const { SpeakButton } = await import('../components/SpeakButton')
    const { startAudioLesson } = await import('./audioLessonPlayback')
    const button = SpeakButton({ lang: 'en', text: 'A standalone clip.', audioSrc: 'audio/standalone.mp3' }) as ReactElement<{ onClick: () => void }>
    const lesson = mode === 'clip' ? [{ ...segments[0], audioSrc: 'audio/lesson.mp3' }] : segments
    startAudioLesson(lesson, { ...options, shadow: mode === 'shadow' })
    if (mode === 'shadow') {
      completeUtterance(audible()[0])
      completeUtterance(audible()[1])
      expect(options.onPhase).toHaveBeenLastCalledWith('shadowing')
    }
    button.props.onClick()
    expect(options.onPhase).toHaveBeenLastCalledWith('stopped')
    if (mode === 'clip') expect(clips[0].pause).toHaveBeenCalledOnce()
    clips.at(-1)?.onplaying?.()
    const count = audible().length
    await advanceClip(clips.at(-1)!, 20000)
    expect(audible()).toHaveLength(count)
    expect(buttonLifecycle.setSpeaking).toHaveBeenLastCalledWith(true)
  })

  it.each(['tts', 'clip', 'shadow'] as const)('%s 教學會取消舊單句音檔，舊卸載不能誤停新教學', async (mode) => {
    const { SpeakButton } = await import('../components/SpeakButton')
    const { startAudioLesson } = await import('./audioLessonPlayback')
    const button = SpeakButton({ lang: 'en', text: 'A standalone clip.', audioSrc: 'audio/standalone.mp3' }) as ReactElement<{ onClick: () => void }>
    button.props.onClick()
    const oldClip = clips[0]
    const oldError = oldClip.onerror
    const oldEnd = oldClip.onended
    startAudioLesson(mode === 'clip' ? [{ ...segments[0], audioSrc: 'audio/lesson.mp3' }] : segments, { ...options, shadow: mode === 'shadow' })
    expect(oldClip.pause).toHaveBeenCalledOnce()
    expect(buttonLifecycle.setSpeaking).toHaveBeenLastCalledWith(false)
    const cancelled = synth.cancel.mock.calls.length
    buttonLifecycle.cleanups[0]()
    oldError?.()
    oldEnd?.()
    expect(synth.cancel).toHaveBeenCalledTimes(cancelled)
    if (mode === 'clip') clips[1].onplaying?.()
    else startUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    if (mode === 'shadow') {
      completeUtterance(audible()[0])
      completeUtterance(audible()[1])
      expect(options.onPhase).toHaveBeenLastCalledWith('shadowing')
    }
  })

  it.each(['hidden', 'pagehide'] as const)('單句控制項在 %s 時也清理尚未完成的語音就緒等待', async (event) => {
    const { SpeakButton } = await import('../components/SpeakButton')
    vi.spyOn(synth, 'getVoices').mockReturnValue([])
    const button = SpeakButton({ lang: 'en', text: 'A pending standalone sentence.' }) as ReactElement<{ onClick: () => void }>
    button.props.onClick()
    if (event === 'hidden') {
      page.hidden = true
      page.dispatchEvent(new Event('visibilitychange'))
    } else window.dispatchEvent(new Event('pagehide'))
    expect(buttonLifecycle.setSpeaking).toHaveBeenLastCalledWith(false)
    expect(vi.getTimerCount()).toBe(0)
    await vi.advanceTimersByTimeAsync(2000)
    expect(audible()).toHaveLength(0)
  })

  it.each([
    ['clip', 'hidden'], ['clip', 'pagehide'], ['tts', 'hidden'], ['tts', 'pagehide'],
  ] as const)('單句 %s 在 %s 時只停止自身，晚到事件不會重播', async (mode, event) => {
    const { SpeakButton } = await import('../components/SpeakButton')
    const button = SpeakButton({ lang: 'en', text: 'A standalone sentence.', audioSrc: mode === 'clip' ? 'audio/standalone.mp3' : undefined }) as ReactElement<{ onClick: () => void }>
    button.props.onClick()
    const oldEnd = mode === 'clip' ? clips[0].onended : audible()[0].onend
    const oldClipError = mode === 'clip' ? clips[0].onerror : undefined
    const cancelCount = synth.cancel.mock.calls.length
    if (event === 'hidden') {
      page.hidden = true
      page.dispatchEvent(new Event('visibilitychange'))
    } else window.dispatchEvent(new Event('pagehide'))
    expect(buttonLifecycle.setSpeaking).toHaveBeenLastCalledWith(false)
    if (mode === 'clip') expect(clips[0].pause).toHaveBeenCalledOnce()
    else expect(synth.cancel).toHaveBeenCalledTimes(cancelCount + 1)
    expect(vi.getTimerCount()).toBe(0)
    oldEnd?.()
    oldClipError?.()
    await vi.advanceTimersByTimeAsync(2000)
    expect(audible()).toHaveLength(mode === 'clip' ? 0 : 1)
  })

  it('兩個單句音檔也互斥，舊按鈕卸載不能停止新按鈕音檔', async () => {
    const { SpeakButton } = await import('../components/SpeakButton')
    const oldButton = SpeakButton({ lang: 'en', text: 'Old clip.', audioSrc: 'audio/old.mp3' }) as ReactElement<{ onClick: () => void }>
    oldButton.props.onClick()
    const newButton = SpeakButton({ lang: 'en', text: 'New clip.', audioSrc: 'audio/new.mp3' }) as ReactElement<{ onClick: () => void }>
    newButton.props.onClick()
    expect(clips[0].pause).toHaveBeenCalledOnce()
    expect(clips[1].pause).not.toHaveBeenCalled()
    buttonLifecycle.cleanups[0]()
    expect(clips[1].pause).not.toHaveBeenCalled()
    expect(buttonLifecycle.setters[0]).toHaveBeenLastCalledWith(false)
    expect(buttonLifecycle.setters[1]).toHaveBeenLastCalledWith(true)
  })

  it('單句音檔回退自身朗讀不會被自己的新播放通知誤停', async () => {
    const { SpeakButton } = await import('../components/SpeakButton')
    const button = SpeakButton({ lang: 'en', text: 'Fallback belongs to the same button.', audioSrc: 'audio/missing.mp3' }) as ReactElement<{ onClick: () => void }>
    button.props.onClick()
    clips[0].onerror?.()
    expect(clips[0].pause).toHaveBeenCalledOnce()
    expect(audible().map((utterance) => utterance.text)).toEqual(['Fallback belongs to the same button.'])
    expect(buttonLifecycle.setSpeaking).toHaveBeenLastCalledWith(true)
    completeUtterance(audible()[0])
    expect(buttonLifecycle.setSpeaking).toHaveBeenLastCalledWith(false)
  })

  it('單句音檔會取消既有導讀的段間留白', async () => {
    const { SpeakButton } = await import('../components/SpeakButton')
    const { speakSequence } = await import('./speech')
    const button = SpeakButton({ lang: 'en', text: 'A new standalone clip.', audioSrc: 'audio/standalone.mp3' }) as ReactElement<{ onClick: () => void }>
    const sequence = speakSequence(['Old guide first.', 'Old guide second.'], 500, undefined, undefined, 'en-US')
    completeUtterance(audible()[0])
    await Promise.resolve()
    button.props.onClick()
    await sequence
    await vi.advanceTimersByTimeAsync(600)
    expect(audible().map((utterance) => utterance.text)).toEqual(['Old guide first.'])
    expect(clips).toHaveLength(1)
    expect(clips[0].pause).not.toHaveBeenCalled()
    expect(buttonLifecycle.setSpeaking).toHaveBeenLastCalledWith(true)
  })

  it('示範及連續解說全部播完才跟讀，顯示與留白長度皆使用該組原文', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    const group: AudioLessonSegment[] = [
      { ...segments[0], text: 'Hi.' },
      segments[1],
      { id: 'long-explanation', text: '很長的解說仍應先播完，再讓使用者跟讀原文。'.repeat(20), lang: 'zh-TW', kind: 'explanation' },
      { ...segments[0], id: 'next-example', text: 'The next example.' },
    ]
    startAudioLesson(group, { ...options, shadow: true })
    completeUtterance(audible()[0])
    startUtterance(audible()[1])
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    expect(options.onSegment).toHaveBeenLastCalledWith(1)
    expect(audible().map((utterance) => utterance.text)).toEqual(group.slice(0, 2).map((segment) => segment.text))
    endUtterance(audible()[1])
    startUtterance(audible()[2])
    expect(options.onPhase).toHaveBeenLastCalledWith('playing')
    expect(options.onSegment).toHaveBeenLastCalledWith(2)
    endUtterance(audible()[2])
    expect(options.onPhase).toHaveBeenLastCalledWith('shadowing')
    expect(options.onSegment).toHaveBeenLastCalledWith(0)
    expect(audible()).toHaveLength(3)
    await vi.advanceTimersByTimeAsync(1700)
    expect(audible()).toHaveLength(3)
    await vi.advanceTimersByTimeAsync(300)
    expect(audible()).toHaveLength(4)
    expect(audible()[3].text).toBe(group[3].text)
    expect(options.onSegment).toHaveBeenLastCalledWith(3)
  })

  it('組內解說後的留白維持自有停止權限，舊解說回呼不能影響新教學', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    const oldStop = startAudioLesson(segments, { ...options, shadow: true })
    completeUtterance(audible()[0])
    expect(audible()).toHaveLength(2)
    startUtterance(audible()[1])
    const oldExplanationEnd = audible()[1].onend
    synth.speaking = false
    oldExplanationEnd?.()
    expect(options.onPhase).toHaveBeenLastCalledWith('shadowing')
    expect(options.onSegment).toHaveBeenLastCalledWith(0)
    const nextOptions = { ...options, shadow: false, onPhase: vi.fn() }
    startAudioLesson([{ ...segments[0], id: 'new', text: 'A new lesson owns playback.' }], nextOptions)
    startUtterance(audible()[2])
    const cancels = synth.cancel.mock.calls.length
    oldStop()
    oldExplanationEnd?.()
    expect(synth.cancel).toHaveBeenCalledTimes(cancels)
    await vi.advanceTimersByTimeAsync(20000)
    expect(audible()).toHaveLength(3)
    expect(options.onPhase).toHaveBeenLastCalledWith('stopped')
    expect(nextOptions.onPhase).toHaveBeenLastCalledWith('playing')
    endUtterance(audible()[2])
    expect(nextOptions.onPhase).toHaveBeenLastCalledWith('complete')
  })

  it('只播示範時逐句立即留白，最後一句也跟讀完才完成', async () => {
    const { startAudioLesson } = await import('./audioLessonPlayback')
    const examples = [{ ...segments[0], text: 'Hi.' }, { ...segments[0], id: 'last-example', text: 'The final example.' }]
    startAudioLesson(examples, { ...options, shadow: true })
    completeUtterance(audible()[0])
    expect(options.onPhase).toHaveBeenLastCalledWith('shadowing')
    expect(options.onSegment).toHaveBeenLastCalledWith(0)
    expect(audible()).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(2000)
    expect(audible()).toHaveLength(2)
    completeUtterance(audible()[1])
    expect(options.onPhase).toHaveBeenLastCalledWith('shadowing')
    expect(options.onSegment).toHaveBeenLastCalledWith(1)
    await vi.advanceTimersByTimeAsync(20000)
    expect(options.onPhase).toHaveBeenLastCalledWith('complete')
    expect(vi.getTimerCount()).toBe(0)
  })
})
