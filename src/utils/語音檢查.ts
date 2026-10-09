import type { AudioLessonPhase, AudioLessonSegment, AudioLessonSource } from './audioLessonTypes'

export type AudioCheck = {
  startedAt: number
  rate: number
  isCheck: boolean
  phase: AudioLessonPhase
  source: AudioLessonSource | null
  error: string | null
  heard: 'yes' | 'no' | null
  started: boolean
  events: { elapsedMs: number; phase: AudioLessonPhase }[]
}

/** 只取目前教材的第一句；不沿用整段音檔，避免片段與朗讀內容不一致。 */
export function checkExcerpt(segment: AudioLessonSegment): AudioLessonSegment | null {
  const text = segment.text.trim()
  if (!text) return null
  const sentence = text.match(/^.*?(?:[。！？]|[.!?](?:\s|$))/u)?.[0].trim() ?? text
  const points = Array.from(sentence)
  let excerpt = points.slice(0, 160).join('')
  if (points.length > 160 && segment.lang === 'en-US' && excerpt.includes(' ')) {
    excerpt = excerpt.slice(0, excerpt.lastIndexOf(' '))
  }
  return { id: segment.id, lang: segment.lang, kind: 'example', text: excerpt }
}

export function recordCheckPhase(check: AudioCheck, phase: AudioLessonPhase, now = Date.now()): AudioCheck {
  return { ...check, phase, started: check.started || phase === 'playing',
    events: [...check.events, { elapsedMs: Math.max(0, now - check.startedAt), phase }].slice(-16) }
}

/** 明列輸出欄位，不輸出教材文字、音檔網址、帳號、學習進度或完整聲音清單。 */
export function exportAudioCheck(check: AudioCheck): string {
  const source = check.source
  const short = (value: string | null | undefined) => value?.slice(0, 128) ?? null
  return JSON.stringify({
    schema: 1, at: new Date(check.startedAt).toISOString(), rate: check.rate,
    mode: check.isCheck ? 'check' : 'lesson', phase: check.phase,
    source: source ? {
      kind: source.kind, lang: source.lang,
      voice: source.voice ? { name: short(source.voice.name), lang: short(source.voice.lang),
        localService: source.voice.localService } : null,
      fallbackReason: short(source.fallbackReason),
    } : null,
    error: short(check.error), started: check.started, heard: check.heard,
    events: check.events.slice(-16).map(({ elapsedMs, phase }) => ({ elapsedMs, phase })),
  }, null, 2)
}
