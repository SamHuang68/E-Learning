import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

class TestUtterance extends EventTarget {
  text: string
  constructor(text: string) { super(); this.text = text }
  lang = ''
  rate = 1
  pitch = 1
  volume = 1
  voice: { name: string; lang: string } | null = null
}

describe('speech language selection and cancellation', () => {
  const voices = [
    { name: 'US voice', lang: 'en-US' },
    { name: 'British voice', lang: 'en-GB' },
    { name: 'Australian voice', lang: 'en-AU' },
    { name: 'Japanese voice', lang: 'ja-JP' },
  ]
  const synth = {
    getVoices: () => voices,
    speak: vi.fn(), cancel: vi.fn(), resume: vi.fn(),
    addEventListener: vi.fn(), speaking: false, pending: false, paused: false,
  }

  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
    synth.speaking = false
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
})
