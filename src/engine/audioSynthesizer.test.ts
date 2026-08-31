import { describe, it, expect } from 'vitest'
import { isAudioMuted, setAudioMuted, toggleAudioMute, playCorrectSound, playBadgeUnlockedSound } from './audioSynthesizer'

describe('Web Audio Synthesizer Engine', () => {
  it('handles mute toggling safely', () => {
    setAudioMuted(false)
    expect(isAudioMuted()).toBe(false)

    const next = toggleAudioMute()
    expect(next).toBe(true)
    expect(isAudioMuted()).toBe(true)

    setAudioMuted(false)
    expect(isAudioMuted()).toBe(false)
  })

  it('safely invokes sound playback without crashing in Node/jsdom', () => {
    expect(() => playCorrectSound()).not.toThrow()
    expect(() => playBadgeUnlockedSound()).not.toThrow()
  })
})
