/**
 * Eight-track Hub rollup guards. Missing / corrupt localStorage must not
 * produce NaN, negative, or >100% chrome. Not a mastery or exam score.
 */

export function safeXp(value: unknown): number {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN
  if (!Number.isFinite(n) || n < 0) return 0
  return n
}

export function safeIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

export function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, Math.round(value)))
}

/** Sum JA/EN/ZH + STEM XP. Calculus lives in the math store — not double-counted. */
export function rollupEightTrackXp(parts: {
  math?: unknown
  physics?: unknown
  chemistry?: unknown
  cs?: unknown
  ja?: unknown
  toeic?: unknown
  chinese?: unknown
}): number {
  return (
    safeXp(parts.math) +
    safeXp(parts.physics) +
    safeXp(parts.chemistry) +
    safeXp(parts.cs) +
    safeXp(parts.ja) +
    safeXp(parts.toeic) +
    safeXp(parts.chinese)
  )
}
