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

export function warmVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve([])
  }

  const synth = window.speechSynthesis
  const assign = (list: SpeechSynthesisVoice[]) => {
    jaVoice = pickVoice(list, 'ja')
    enVoice = pickEnglishVoice(list)
    voicesReady = true
  }

  const existing = synth.getVoices()
  if (existing.length) {
    assign(existing)
    return Promise.resolve(existing)
  }

  return new Promise((resolve) => {
    let settled = false
    const done = () => {
      if (settled) return
      settled = true
      const list = synth.getVoices()
      assign(list)
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
}

function speak(text: string, options: SpeakOptions = {}) {
  if (!isSpeechSupported() || !text.trim()) {
    options.onError?.()
    return
  }

  const lang = options.lang ?? 'ja-JP'
  const synth = window.speechSynthesis
  synth.cancel()

  const run = () => {
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    utter.rate = options.rate ?? (lang.startsWith('ja') ? 0.85 : 0.92)
    utter.pitch = options.pitch ?? 1
    const voice = lang.startsWith('ja') ? jaVoice : enVoice
    if (voice) utter.voice = voice

    utter.onstart = () => options.onStart?.()
    utter.onend = () => options.onEnd?.()
    utter.onerror = () => options.onError?.()

    if (synth.paused) synth.resume()
    synth.speak(utter)
  }

  if (!voicesReady) {
    void warmVoices().then(run)
  } else {
    run()
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
      window.setTimeout(finish, 2200)
    })
    if (signal?.cancelled) break
    await new Promise((r) => setTimeout(r, gapMs))
  }
}
