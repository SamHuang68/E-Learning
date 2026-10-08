import type { AudioLessonLanguage } from './audioLessonTypes'

export function hasLessonVoice(lang: AudioLessonLanguage, voices: SpeechSynthesisVoice[]) {
  const requested = lang.toLowerCase()
  return voices.some((voice) => {
    const actual = voice.lang.toLowerCase().replaceAll('_', '-')
    return requested === 'zh-tw'
      ? /^zh-tw(?:-|$)/.test(actual) || actual === 'zh-hant' || /^zh-hant-tw(?:-|$)/.test(actual)
      : actual.split('-')[0] === requested.split('-')[0]
  })
}
