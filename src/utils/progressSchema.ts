/** Local progress export version. Not a hosted/cloud API contract. */
export const PROGRESS_BUNDLE_VERSION = 5 as const

/** Learning-event row schema. Missing `v` on import is treated as 1. */
export const LEARNING_EVENT_SCHEMA_VERSION = 1 as const

export type LearningEventV1 = {
  v: typeof LEARNING_EVENT_SCHEMA_VERSION
  t: string
  type: string
  payload?: Record<string, unknown>
}

export const PROGRESS_SCHEMA_MIGRATION_NOTES = [
  'v1: aoba + kana + toeic in this-browser localStorage',
  'v2-v3: STEM keys added; still local-only',
  'v4: eight tracks + signal mastery keys; export JSON only',
  'v5: learning events stamp v:1; unversioned events migrate as v:1. Not a cloud schema.',
] as const

export function isAcceptedProgressBundleVersion(version: unknown): version is 1 | 2 | 3 | 4 | 5 {
  return version === 1 || version === 2 || version === 3 || version === 4 || version === 5
}

export function migrateLearningEvent(raw: unknown): LearningEventV1 | null {
  if (!raw || typeof raw !== 'object') return null
  const event = raw as Record<string, unknown>
  if (typeof event.type !== 'string' || !event.type) return null
  const v = event.v
  if (v !== undefined && v !== LEARNING_EVENT_SCHEMA_VERSION) return null
  const t = typeof event.t === 'string' && event.t ? event.t : new Date().toISOString()
  const payload =
    event.payload && typeof event.payload === 'object' && !Array.isArray(event.payload)
      ? (event.payload as Record<string, unknown>)
      : undefined
  return payload
    ? { v: LEARNING_EVENT_SCHEMA_VERSION, t, type: event.type, payload }
    : { v: LEARNING_EVENT_SCHEMA_VERSION, t, type: event.type }
}
