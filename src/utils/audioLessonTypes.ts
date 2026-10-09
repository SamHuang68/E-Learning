export type AudioLessonLanguage = 'ja-JP' | 'en-US' | 'zh-TW'

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
  onSegment: (index: number) => void
  onPhase: (phase: AudioLessonPhase) => void
  onError: (code: string) => void
}
