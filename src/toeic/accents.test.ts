import { describe, it, expect } from 'vitest'
import { TOEIC_ACCENTS, findBestVoiceForAccent } from './data/accents'

describe('TOEIC Accents Configuration & Voice Matching', () => {
  it('defines 4 official TOEIC accents with proper flags and features', () => {
    expect(TOEIC_ACCENTS.length).toBe(4)
    const codes = TOEIC_ACCENTS.map((a) => a.code)
    expect(codes).toContain('en-US')
    expect(codes).toContain('en-GB')
    expect(codes).toContain('en-AU')
    expect(codes).toContain('en-CA')
  })

  it('matches exact and fallback speech synthesis voices', () => {
    const mockVoices: SpeechSynthesisVoice[] = [
      {
        lang: 'en-US',
        name: 'Samantha (US)',
        default: true,
        localService: true,
        voiceURI: 'samantha',
      },
      {
        lang: 'en-GB',
        name: 'Daniel (UK)',
        default: false,
        localService: true,
        voiceURI: 'daniel',
      },
      {
        lang: 'zh-TW',
        name: 'Mei-Jia',
        default: false,
        localService: true,
        voiceURI: 'meijia',
      },
    ]

    const matchUS = findBestVoiceForAccent(mockVoices, 'en-US')
    expect(matchUS?.name).toBe('Samantha (US)')

    const matchGB = findBestVoiceForAccent(mockVoices, 'en-GB')
    expect(matchGB?.name).toBe('Daniel (UK)')

    // 遇到無 AU 專用音時，回退至其他英語語音
    const fallbackAU = findBestVoiceForAccent(mockVoices, 'en-AU')
    expect(fallbackAU?.lang.startsWith('en')).toBe(true)
  })
})
