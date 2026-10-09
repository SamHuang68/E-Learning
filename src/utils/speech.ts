import { hasLessonVoice } from './audioLessonVoices'

export type SpeechPlaybackError = 'unsupported' | 'voice-unavailable' | 'playback-failed' |
  'playback-not-started' | 'playback-start-timeout'

export type SpeakOptions = {
  lang?: string
  rate?: number
  pitch?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: (code: SpeechPlaybackError) => void
  onCancel?: () => void
}

let jaVoice: SpeechSynthesisVoice | null = null
let enVoice: SpeechSynthesisVoice | null = null
/**
 * Chrome/Edge often silently drops the first utterance after load (or after cancel).
 * We queue an inaudible pad once so the real kana becomes the second item.
 */
let needsUtterancePad = true
const SPEAK_AFTER_CANCEL_MS = 60
const SPEECH_START_TIMEOUT_MS = 10000
const SPEECH_IDLE_GRACE_MS = 1500
let speechRun = 0
let activeStop: (() => void) | null = null
const speechRequestListeners = new Set<() => void>()

/** 單句音檔、原生朗讀與分段教學共用同一個新播放通知邊界。 */
export function notifyPlaybackRequest() {
  for (const listener of [...speechRequestListeners]) listener()
}

/** 訂閱新朗讀請求，讓音檔或跟讀留白也能被新播放中斷。 */
export function subscribeSpeechRequests(listener: () => void) {
  speechRequestListeners.add(listener)
  return () => { speechRequestListeners.delete(listener) }
}

function pickVoice(voices: SpeechSynthesisVoice[], langPrefix: string) {
  const matched = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(langPrefix),
  )
  if (!matched.length) return null
  return (
    matched.find((v) => /google|neural|premium|enhanced/i.test(v.name)) ??
    matched[0]
  )
}

function pickEnglishVoice(voices: SpeechSynthesisVoice[]) {
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  if (!en.length) return null
  return (
    en.find(
      (v) =>
        /en-us/i.test(v.lang) &&
        /google|neural|premium|enhanced/i.test(v.name),
    ) ??
    en.find((v) => /en-us/i.test(v.lang)) ??
    pickVoice(voices, 'en')
  )
}

function assignVoices(list: SpeechSynthesisVoice[]) {
  jaVoice = pickVoice(list.filter((voice) => voice.localService === true), 'ja') ??
    pickVoice(list, 'ja')
  enVoice = pickEnglishVoice(list)
}

function refreshVoicesSync() {
  if (!isSpeechSupported()) return
  const list = window.speechSynthesis.getVoices()
  if (list.length) assignVoices(list)
}

function voiceForLanguage(lang: string) {
  if (lang.startsWith('ja')) return jaVoice
  if (lang.toLowerCase() === 'zh-tw') {
    const matches = window.speechSynthesis.getVoices().filter((voice) => hasLessonVoice('zh-TW', [voice]))
    return pickVoice(matches, 'zh')
  }
  const matching = pickVoice(window.speechSynthesis.getVoices(), lang.toLowerCase())
  // Let the platform resolve an unavailable requested accent instead of forcing a US voice.
  return matching ?? (lang === 'en-US' ? enVoice : null)
}

export function warmVoices(signal?: AbortSignal): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve([])
  }

  if (signal?.aborted) return Promise.resolve([])
  const synth = window.speechSynthesis
  const existing = synth.getVoices()
  if (existing.length) {
    assignVoices(existing)
    return Promise.resolve(existing)
  }

  return new Promise((resolve) => {
    let settled = false
    const done = (list: SpeechSynthesisVoice[]) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      synth.removeEventListener('voiceschanged', changed)
      signal?.removeEventListener('abort', aborted)
      if (list.length) assignVoices(list)
      resolve(list)
    }
    const changed = () => {
      const list = synth.getVoices()
      if (list.length) done(list)
    }
    const aborted = () => done([])
    const timer = window.setTimeout(() => done(synth.getVoices()), 1500)
    synth.addEventListener('voiceschanged', changed)
    signal?.addEventListener('abort', aborted, { once: true })
  })
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && Boolean(window.speechSynthesis) &&
    typeof SpeechSynthesisUtterance !== 'undefined'
}

export function stopSpeaking() {
  if (activeStop) {
    activeStop()
    return
  }
  speechRun += 1
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
  // After cancel, Chrome may drop the next real utterance again.
  needsUtterancePad = true
}

function attachResumeWatchdog(
  synth: SpeechSynthesis,
  hasStarted: () => boolean,
  onIdle: () => void,
) {
  let idleSince: number | null = null
  const watch = window.setInterval(() => {
    if (synth.speaking || synth.pending) {
      idleSince = null
      if (synth.paused) synth.resume()
    } else if (hasStarted()) {
      idleSince ??= Date.now()
      if (Date.now() - idleSince >= SPEECH_IDLE_GRACE_MS) onIdle()
    }
  }, 120)
  return () => window.clearInterval(watch)
}

function buildUtterance(
  text: string,
  lang: string,
  options: SpeakOptions,
): SpeechSynthesisUtterance {
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = lang
  utter.rate = options.rate ?? (lang.startsWith('ja') ? 0.85 : 0.92)
  utter.pitch = options.pitch ?? 1
  const voice = voiceForLanguage(lang)
  if (voice) utter.voice = voice
  return utter
}

/** Inaudible pad that absorbs Chrome's "drop first utterance" quirk. */
function queuePad(synth: SpeechSynthesis, lang: string) {
  const pad = new SpeechSynthesisUtterance(lang.startsWith('ja') ? 'あ' : 'a')
  pad.volume = 0
  pad.rate = 2
  pad.pitch = 1
  pad.lang = lang
  const voice = voiceForLanguage(lang)
  if (voice) pad.voice = voice
  synth.speak(pad)
}

/** 已就緒時同一點擊回合啟動；空清單才等待裝置語音，失敗須由介面提示重試。 */
function speak(text: string, options: SpeakOptions = {}) {
  notifyPlaybackRequest()
  activeStop?.()
  if (!isSpeechSupported() || !text.trim()) {
    options.onError?.(isSpeechSupported() ? 'playback-failed' : 'unsupported')
    return () => undefined
  }

  const run = ++speechRun

  const lang = options.lang ?? 'ja-JP'
  const synth = window.speechSynthesis
  const language = lang.split('-')[0].toLowerCase()
  let utter: SpeechSynthesisUtterance | null = null
  let running = true
  let started = false
  let timer = 0
  let startupTimer = 0
  let clearWatchdog: (() => void) | undefined
  const voiceWait = new AbortController()
  const cleanup = () => {
    window.clearTimeout(timer)
    window.clearTimeout(startupTimer)
    voiceWait.abort()
    clearWatchdog?.()
    if (utter) {
      utter.onstart = null
      utter.onend = null
      utter.onerror = null
    }
    if (run === speechRun) activeStop = null
  }
  const stop = () => {
    if (!running || run !== speechRun) return
    running = false
    cleanup()
    speechRun += 1
    synth.cancel()
    needsUtterancePad = true
    options.onCancel?.()
  }
  activeStop = stop
  const finish = (callback?: () => void) => {
    if (!running || run !== speechRun) return
    running = false
    cleanup()
    callback?.()
  }
  const fail = (code: SpeechPlaybackError) => finish(() => {
    // 先清理並取消自身，再通知介面；回呼啟動的新 owner 不會被誤停。
    synth.cancel()
    needsUtterancePad = true
    options.onError?.(code)
  })

  const kick = () => {
    if (!running || run !== speechRun || !utter) return
    try {
      if (synth.paused) synth.resume()
      if (needsUtterancePad) {
        needsUtterancePad = false
        queuePad(synth, lang)
      }
      startupTimer = window.setTimeout(() => fail('playback-start-timeout'), SPEECH_START_TIMEOUT_MS)
      clearWatchdog = attachResumeWatchdog(synth, () => started, () => fail('playback-failed'))
      synth.speak(utter)
    } catch {
      fail('playback-failed')
    }
  }

  const start = (voices: SpeechSynthesisVoice[]) => {
    if (!running || run !== speechRun) return
    const hasVoice = lang.toLowerCase() === 'zh-tw'
      ? hasLessonVoice('zh-TW', voices)
      : voices.some((voice) => voice.lang.toLowerCase().replaceAll('_', '-').split('-')[0] === language)
    if (!hasVoice) {
      finish(() => options.onError?.('voice-unavailable'))
      return
    }
    assignVoices(voices)
    try {
      utter = buildUtterance(text, lang, options)
    } catch {
      finish(() => options.onError?.('playback-failed'))
      return
    }
    utter.onstart = () => {
      if (!running || run !== speechRun || started) return
      started = true
      window.clearTimeout(startupTimer)
      options.onStart?.()
    }
    utter.onend = () => {
      if (started) finish(options.onEnd)
      else fail('playback-not-started')
    }
    utter.onerror = (event) => {
      if (event.error === 'canceled' || event.error === 'interrupted') {
        needsUtterancePad = true
        finish(options.onCancel)
      } else {
        finish(() => options.onError?.(
          event.error === 'language-unavailable' || event.error === 'voice-unavailable'
            ? 'voice-unavailable' : 'playback-failed',
        ))
      }
    }
    if (synth.speaking || synth.pending) {
      synth.cancel()
      needsUtterancePad = true
      timer = window.setTimeout(kick, SPEAK_AFTER_CANCEL_MS)
    } else kick()
  }
  const available = synth.getVoices()
  if (available.length) start(available)
  else void warmVoices(voiceWait.signal).then(start)
  return stop
}

export function speakJapanese(text: string, options: SpeakOptions = {}) {
  return speak(text, { ...options, lang: 'ja-JP' })
}

export function speakEnglish(text: string, options: SpeakOptions = {}) {
  return speak(text, { ...options, lang: options.lang ?? 'en-US' })
}

export function speakChinese(text: string, options: SpeakOptions = {}) {
  return speak(text, { ...options, lang: 'zh-TW' })
}

export function speakText(text: string, options: SpeakOptions) {
  return speak(text, options)
}

export async function speakSequence(
  items: string[],
  gapMs = 650,
  onIndex?: (index: number) => void,
  signal?: { cancelled: boolean },
  lang: 'ja-JP' | 'en-US' = 'ja-JP',
) {
  if (typeof window === 'undefined') return
  // 首句已就緒時直接啟動；整個導讀與段間留白均持續保有中斷訂閱。
  refreshVoicesSync()
  let cancelled = false
  let ownRequest = false
  let gapTimer = 0
  let stopCurrent: (() => void) | undefined
  let resolveWait: (() => void) | undefined
  const cancel = () => {
    if (cancelled) return
    cancelled = true
    window.clearTimeout(gapTimer)
    gapTimer = 0
    const finishWait = resolveWait
    resolveWait = undefined
    const ownedStop = stopCurrent
    stopCurrent = undefined
    ownedStop?.()
    finishWait?.()
  }
  const unsubscribe = subscribeSpeechRequests(() => { if (!ownRequest) cancel() })
  try {
    for (let i = 0; i < items.length; i += 1) {
      if (signal?.cancelled || cancelled) break
      onIndex?.(i)
      if (signal?.cancelled || cancelled) break
      await new Promise<void>((resolve) => {
        let done = false
        const finish = () => {
          if (done) return
          done = true
          stopCurrent = undefined
          resolveWait = undefined
          resolve()
        }
        resolveWait = finish
        ownRequest = true
        try {
          const ownedStop = speak(items[i], {
            lang,
            onEnd: finish,
            onError: cancel,
            onCancel: cancel,
          })
          if (done || cancelled) ownedStop()
          else stopCurrent = ownedStop
        } finally {
          ownRequest = false
        }
      })
      if (signal?.cancelled || cancelled) break
      if (i < items.length - 1) {
        await new Promise<void>((resolve) => {
          resolveWait = () => { resolveWait = undefined; resolve() }
          gapTimer = window.setTimeout(() => {
            gapTimer = 0
            resolveWait?.()
          }, gapMs)
        })
      }
    }
  } finally {
    unsubscribe()
    cancel()
  }
}
