import type { AudioLessonPhase, AudioLessonPlaybackOptions, AudioLessonSegment } from './audioLessonTypes'
import { notifyPlaybackRequest, speakText, stopSpeaking, subscribeSpeechRequests } from './speech'
import { playClip } from './mediaAudio'

let activeLessonStop: (() => void) | null = null

export function startAudioLesson(
  segments: AudioLessonSegment[],
  options: AudioLessonPlaybackOptions,
): () => void {
  if (typeof window === 'undefined') {
    options.onError('unsupported')
    options.onPhase('error')
    return () => undefined
  }
  activeLessonStop?.()
  // 登記自身訂閱前宣告新播放，先回收其他控制項的音檔與留白。
  notifyPlaybackRequest()
  stopSpeaking()
  let active = true
  let stopSegment: (() => void) | undefined
  let shadowTimer = 0
  let exampleIndex = -1
  let segmentRun = 0
  let ownSpeechRequest = false
  let unsubscribeSpeech: (() => void) | undefined
  const hidden = () => { if (document.hidden) stop() }
  const finish = (phase: AudioLessonPhase, code?: string) => {
    if (!active) return
    active = false
    window.clearTimeout(shadowTimer)
    unsubscribeSpeech?.()
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', hidden)
    window.removeEventListener('pagehide', stop)
    const stopCurrent = stopSegment
    stopSegment = undefined
    stopCurrent?.()
    if (activeLessonStop === stop) activeLessonStop = null
    if (code) options.onError(code)
    options.onPhase(phase)
  }
  const stop = () => finish('stopped')
  activeLessonStop = stop
  const play = (index: number) => {
    if (!active) return
    const segment = segments[index]
    if (!segment) {
      finish('complete')
      return
    }
    if (segment.kind === 'example') exampleIndex = index
    options.onSegment(index)
    if (!active) return
    options.onPhase('preparing')
    if (!active) return
    const run = ++segmentRun
    let mode: 'clip' | 'tts' | 'done' = segment.audioSrc ? 'clip' : 'tts'
    const current = () => active && run === segmentRun
    const setStop = (expected: 'clip' | 'tts', ownedStop: () => void) => {
      if (current() && mode === expected) stopSegment = ownedStop
      else ownedStop()
    }
    const ended = () => {
      if (!current() || mode === 'done') return
      mode = 'done'
      stopSegment = undefined
      const next = segments[index + 1]
      const example = segments[exampleIndex]
      // 示範與後續連續解說為同一組；組尾才回到示範原文供跟讀。
      if (options.shadow && example && (!next || next.kind === 'example')) {
        options.onSegment(exampleIndex)
        if (!active) return
        options.onPhase('shadowing')
        if (!active) return
        const duration = Math.max(1800, example.text.trim().length *
          (example.lang === 'en-US' ? 90 : 180) / options.rate + 600) *
          (options.shadowLength === 'extended' ? 2 : 1)
        let consumed = false
        const continuePlayback = () => {
          if (!current() || consumed) return
          consumed = true
          window.clearTimeout(shadowTimer)
          shadowTimer = 0
          exampleIndex = -1
          play(index + 1)
        }
        const deadline = performance.now() + duration
        shadowTimer = window.setTimeout(continuePlayback, duration)
        options.onShadowing?.(continuePlayback, deadline)
      } else play(index + 1)
    }
    const startTts = (fallbackReason?: string) => {
      if (!current()) return
      const isFallback = mode === 'clip'
      mode = 'tts'
      const previousStop = stopSegment
      stopSegment = undefined
      previousStop?.()
      if (isFallback) options.onPhase('preparing')
      if (!current()) return
      const source = { kind: 'speech' as const, lang: segment.lang, voice: null,
        ...(isFallback ? { fallbackReason: fallbackReason ?? 'playback-failed' } : {}) }
      options.onSource?.(source)
      if (!current()) return
      ownSpeechRequest = true
      try {
        setStop('tts', speakText(segment.text, {
          lang: segment.lang,
          rate: options.rate,
          onVoice: (voice) => { if (current() && mode === 'tts') options.onSource?.({ ...source, voice }) },
          onStart: () => { if (current() && mode === 'tts') options.onPhase('playing') },
          onEnd: () => { if (mode === 'tts') ended() },
          onCancel: () => { if (current()) stop() },
          onError: (code) => { if (current()) finish('error', code) },
        }))
      } finally {
        ownSpeechRequest = false
      }
    }
    if (segment.audioSrc) {
      options.onSource?.({ kind: 'clip', lang: segment.lang, voice: null })
      if (!current()) return
      try {
        setStop('clip', playClip(segment.audioSrc, {
          rate: options.rate,
          onStart: () => { if (current() && mode === 'clip') options.onPhase('playing') },
          onEnd: () => { if (mode === 'clip') ended() },
          onError: (code) => { if (current() && mode === 'clip') startTts(code) },
        }))
      } catch {
        startTts()
      }
    } else startTts()
  }
  unsubscribeSpeech = subscribeSpeechRequests(() => { if (!ownSpeechRequest) stop() })
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', hidden)
  window.addEventListener('pagehide', stop)
  if (!segments.length) finish('error', 'empty-lesson')
  else if (!Number.isFinite(options.rate) || options.rate <= 0) finish('error', 'playback-failed')
  else if (typeof document !== 'undefined' && document.hidden) stop()
  else play(0)
  return stop
}
