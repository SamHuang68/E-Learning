type SpeakOptions = {
  lang?: string
  rate?: number
  pitch?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: () => void
}

let jaVoice: SpeechSynthesisVoice | null = null
let enVoice: SpeechSynthesisVoice | null = null
let voicesReady = false
/**
 * Chrome/Edge often silently drops the first utterance after load (or after cancel).
 * We queue an inaudible pad once so the real kana becomes the second item.
 */
let needsUtterancePad = true
const SPEAK_AFTER_CANCEL_MS = 60

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
  jaVoice = pickVoice(list, 'ja')
  enVoice = pickEnglishVoice(list)
  voicesReady = true
}

function refreshVoicesSync() {
  if (!isSpeechSupported()) return
  const list = window.speechSynthesis.getVoices()
  if (list.length) assignVoices(list)
}

export function warmVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve([])
  }

  const synth = window.speechSynthesis
  const existing = synth.getVoices()
  if (existing.length) {
    assignVoices(existing)
    return Promise.resolve(existing)
  }

  return new Promise((resolve) => {
    let settled = false
    const done = () => {
      if (settled) return
      settled = true
      const list = synth.getVoices()
      assignVoices(list)
      resolve(list)
    }
    synth.addEventListener('voiceschanged', done, { once: true })
    window.setTimeout(done, 400)
  })
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function stopSpeaking() {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
  // After cancel, Chrome may drop the next real utterance again.
  needsUtterancePad = true
}

function attachResumeWatchdog(
  synth: SpeechSynthesis,
  utter: SpeechSynthesisUtterance,
) {
  const watch = window.setInterval(() => {
    if (!synth.speaking && !synth.pending) {
      window.clearInterval(watch)
      return
    }
    if (synth.paused) synth.resume()
  }, 120)

  const clear = () => window.clearInterval(watch)
  utter.addEventListener('end', clear)
  utter.addEventListener('error', clear)
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
  const voice = lang.startsWith('ja') ? jaVoice : enVoice
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
  const voice = lang.startsWith('ja') ? jaVoice : enVoice
  if (voice) pad.voice = voice
  synth.speak(pad)
}

/**
 * Keep the first real speak() in the same turn as a user gesture when possible.
 * Never gate the first kick behind await / .then().
 */
function speak(text: string, options: SpeakOptions = {}) {
  if (!isSpeechSupported() || !text.trim()) {
    options.onError?.()
    return
  }

  refreshVoicesSync()
  if (!voicesReady) void warmVoices()

  const lang = options.lang ?? 'ja-JP'
  const synth = window.speechSynthesis
  const utter = buildUtterance(text, lang, options)

  utter.onstart = () => options.onStart?.()
  utter.onend = () => options.onEnd?.()
  utter.onerror = () => options.onError?.()

  const kick = () => {
    if (synth.paused) synth.resume()
    if (needsUtterancePad) {
      needsUtterancePad = false
      queuePad(synth, lang)
    }
    attachResumeWatchdog(synth, utter)
    synth.speak(utter)
  }

  if (synth.speaking || synth.pending) {
    synth.cancel()
    needsUtterancePad = true
    window.setTimeout(kick, SPEAK_AFTER_CANCEL_MS)
  } else {
    kick()
  }
}

export function speakJapanese(text: string, options: SpeakOptions = {}) {
  speak(text, { ...options, lang: 'ja-JP' })
}

export function speakEnglish(text: string, options: SpeakOptions = {}) {
  speak(text, { ...options, lang: 'en-US' })
}

export async function speakSequence(
  items: string[],
  gapMs = 650,
  onIndex?: (index: number) => void,
  signal?: { cancelled: boolean },
  lang: 'ja-JP' | 'en-US' = 'ja-JP',
) {
  // No await before the first speak — preserves click user-activation on Chromium.
  refreshVoicesSync()
  void warmVoices()

  for (let i = 0; i < items.length; i += 1) {
    if (signal?.cancelled) break
    onIndex?.(i)
    await new Promise<void>((resolve) => {
      let done = false
      const finish = () => {
        if (done) return
        done = true
        resolve()
      }
      speak(items[i], {
        lang,
        onEnd: finish,
        onError: finish,
      })
      window.setTimeout(finish, 2500)
    })
    if (signal?.cancelled) break
    if (i < items.length - 1) {
      await new Promise((r) => setTimeout(r, gapMs))
    }
  }
}
