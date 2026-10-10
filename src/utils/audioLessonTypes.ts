import type { SpeechVoiceSelection } from './speech'

export type AudioLessonLanguage = 'ja-JP' | 'en-US' | 'zh-TW'

export type AudioLessonShadowLength = 'standard' | 'extended'

export type AudioLessonSource = {
  kind: 'clip' | 'speech'
  lang: AudioLessonLanguage
  voice: SpeechVoiceSelection | null
  fallbackReason?: string
}

export type AudioLessonSegment = {
  id: string
  text: string
  lang: AudioLessonLanguage
  kind: 'example' | 'explanation'
  audioSrc?: string
}

export type AudioLessonPhase =
  | 'preparing'
  | 'playing'
  | 'shadowing'
  | 'complete'
  | 'stopped'
  | 'error'

export type AudioLessonPlaybackOptions = {
  rate: number
  shadow: boolean
  shadowLength?: AudioLessonShadowLength
  onSegment: (index: number) => void
  onPhase: (phase: AudioLessonPhase) => void
  onError: (code: string) => void
  onSource?: (source: AudioLessonSource) => void
  // deadline 為 performance.now() 時基的毫秒期限，僅供顯示。
  onShadowing?: (continuePlayback: () => void, deadline: number) => void
}
