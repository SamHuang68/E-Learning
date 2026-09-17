/**
 * Honest merge of learner progress: never drop local or cloud evidence.
 * Used on login hydrate so a signed-out session cannot be silently clobbered
 * by an older/partial cloud row, and vice versa.
 */

import { estimateAbilityTheta, type UserResponse } from '../engine/adaptive'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function mergeNumericMax(a: unknown, b: unknown, fallback = 0): number {
  const left = Number(a)
  const right = Number(b)
  const leftOk = Number.isFinite(left) ? left : fallback
  const rightOk = Number.isFinite(right) ? right : fallback
  return Math.max(leftOk, rightOk)
}

export function mergeStringArray(a: unknown, b: unknown): string[] {
  const left = Array.isArray(a) ? a.filter((item): item is string => typeof item === 'string') : []
  const right = Array.isArray(b) ? b.filter((item): item is string => typeof item === 'string') : []
  return Array.from(new Set([...left, ...right]))
}

export function mergeNumberArray(a: unknown, b: unknown): number[] {
  const left = Array.isArray(a) ? a.filter((item): item is number => typeof item === 'number') : []
  const right = Array.isArray(b) ? b.filter((item): item is number => typeof item === 'number') : []
  return Array.from(new Set([...left, ...right]))
}

export function mergeExamScores(
  a: unknown,
  b: unknown,
): Record<string, number> {
  const left = isRecord(a) ? a : {}
  const right = isRecord(b) ? b : {}
  const keys = new Set([...Object.keys(left), ...Object.keys(right)])
  const next: Record<string, number> = {}
  for (const key of keys) {
    next[key] = mergeNumericMax(left[key], right[key], 0)
  }
  return next
}

/** Union of JSON objects; for shared keys prefer the non-empty / truthy side. */
export function mergeJsonRecords(
  local: unknown,
  cloud: unknown,
): Record<string, unknown> {
  const left = isRecord(local) ? local : {}
  const right = isRecord(cloud) ? cloud : {}
  const keys = new Set([...Object.keys(left), ...Object.keys(right)])
  const next: Record<string, unknown> = {}
  for (const key of keys) {
    const lv = left[key]
    const cv = right[key]
    if (lv === undefined) next[key] = cv
    else if (cv === undefined) next[key] = lv
    else if (lv === true || cv === true) next[key] = true
    else if (typeof lv === 'string' && lv === 'mastered') next[key] = lv
    else if (typeof cv === 'string' && cv === 'mastered') next[key] = cv
    else next[key] = lv
  }
  return next
}

export function mergeTrackProgress(
  local: unknown,
  cloud: unknown,
): Record<string, unknown> {
  const left = isRecord(local) ? local : {}
  const right = isRecord(cloud) ? cloud : {}
  const next: Record<string, unknown> = { ...right, ...left }
  next.xp = mergeNumericMax(left.xp, right.xp, 0)
  if ('completedQuestions' in left || 'completedQuestions' in right) {
    next.completedQuestions = mergeStringArray(left.completedQuestions, right.completedQuestions)
  }
  if ('errorQuestions' in left || 'errorQuestions' in right) {
    next.errorQuestions = mergeStringArray(left.errorQuestions, right.errorQuestions)
  }
  if ('labCompleted' in left || 'labCompleted' in right) {
    next.labCompleted = mergeStringArray(left.labCompleted, right.labCompleted)
  }
  if ('examScores' in left || 'examScores' in right) {
    next.examScores = mergeExamScores(left.examScores, right.examScores)
  }
  if ('mastered' in left || 'mastered' in right) {
    next.mastered = mergeStringArray(left.mastered, right.mastered)
  }
  if ('unlockedRows' in left || 'unlockedRows' in right) {
    next.unlockedRows = mergeStringArray(left.unlockedRows, right.unlockedRows)
  }
  if ('phonicsMastered' in left || 'phonicsMastered' in right) {
    next.phonicsMastered = mergeStringArray(left.phonicsMastered, right.phonicsMastered)
  }
  if ('masteredPinyin' in left || 'masteredPinyin' in right) {
    next.masteredPinyin = mergeStringArray(left.masteredPinyin, right.masteredPinyin)
  }
  if ('masteredFalseFriends' in left || 'masteredFalseFriends' in right) {
    next.masteredFalseFriends = mergeStringArray(left.masteredFalseFriends, right.masteredFalseFriends)
  }
  if ('masteredGrammarSignals' in left || 'masteredGrammarSignals' in right) {
    next.masteredGrammarSignals = mergeStringArray(
      left.masteredGrammarSignals,
      right.masteredGrammarSignals,
    )
  }
  if ('completedDialogues' in left || 'completedDialogues' in right) {
    next.completedDialogues = mergeStringArray(left.completedDialogues, right.completedDialogues)
  }
  if ('masteredTones' in left || 'masteredTones' in right) {
    next.masteredTones = mergeNumberArray(left.masteredTones, right.masteredTones)
  }
  for (const countKey of ['vocabDone', 'readingDone', 'listeningDone', 'quizCorrect', 'quizTotal'] as const) {
    if (countKey in left || countKey in right) {
      next[countKey] = mergeNumericMax(left[countKey], right[countKey], 0)
    }
  }
  if ('grammarStarted' in left || 'grammarStarted' in right) {
    next.grammarStarted = Boolean(left.grammarStarted) || Boolean(right.grammarStarted)
  }
  if ('calculusFsrs' in left || 'calculusFsrs' in right) {
    next.calculusFsrs = mergeFsrsMaps(left.calculusFsrs, right.calculusFsrs)
  }
  if ('calculusResponses' in left || 'calculusResponses' in right) {
    next.calculusResponses = mergeCalculusResponses(left.calculusResponses, right.calculusResponses)
  }
  if ('calculusTheta' in left || 'calculusTheta' in right || 'calculusResponses' in next) {
    next.calculusTheta = mergeCalculusTheta(left, right, next)
  }
  return next
}

function lastReviewMs(item: unknown): number {
  if (!isRecord(item)) return 0
  const raw = item.lastReview ?? item.last_review
  if (typeof raw !== 'string') return 0
  const ms = Date.parse(raw)
  return Number.isFinite(ms) ? ms : 0
}

function pickNewerFsrs(local: Record<string, unknown>, cloud: Record<string, unknown>): Record<string, unknown> {
  const localMs = lastReviewMs(local)
  const cloudMs = lastReviewMs(cloud)
  if (cloudMs !== localMs) return cloudMs > localMs ? cloud : local
  const localRev = Number(local.revision ?? local.syncRevision)
  const cloudRev = Number(cloud.revision ?? cloud.syncRevision)
  if (Number.isFinite(cloudRev) && Number.isFinite(localRev) && cloudRev !== localRev) {
    return cloudRev > localRev ? cloud : local
  }
  const localReps = Number(local.reps) || 0
  const cloudReps = Number(cloud.reps) || 0
  return cloudReps > localReps ? cloud : local
}

/** Per-card FSRS: prefer the side with newer lastReview (then revision / reps). */
export function mergeFsrsMaps(local: unknown, cloud: unknown): Record<string, unknown> {
  const left = isRecord(local) ? local : {}
  const right = isRecord(cloud) ? cloud : {}
  const keys = new Set([...Object.keys(left), ...Object.keys(right)])
  const next: Record<string, unknown> = {}
  for (const key of keys) {
    const lv = left[key]
    const cv = right[key]
    if (!isRecord(lv)) next[key] = cv
    else if (!isRecord(cv)) next[key] = lv
    else next[key] = pickNewerFsrs(lv, cv)
  }
  return next
}

function maxFsrsReview(map: unknown): number {
  if (!isRecord(map)) return 0
  return Object.values(map).reduce<number>((max, item) => Math.max(max, lastReviewMs(item)), 0)
}

function scalarId(value: unknown): string {
  if (typeof value === 'string' && value.length > 0) return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

/**
 * Stable event identity: prefer id / nonce / timestamp when present so two
 * distinct attempts are kept even if IRT fields stringify the same.
 * Identical content without those ids shares a content fingerprint and must
 * not be treated as extra evidence (θ inflate).
 */
export function responseIdentity(entry: unknown): string {
  if (!isRecord(entry)) return `raw:${JSON.stringify(entry)}`
  const itemId = scalarId(entry.itemId)
  const eventId = scalarId(entry.id)
  if (eventId) return `id:${itemId}:${eventId}`
  const nonce = scalarId(entry.nonce)
  if (nonce) return `nonce:${itemId}:${nonce}`
  const answeredAt =
    scalarId(entry.answeredAt) ||
    scalarId(entry.timestamp) ||
    scalarId(entry.ts) ||
    scalarId(entry.answered_at)
  if (itemId && answeredAt) return `t:${itemId}:${answeredAt}`
  return `c:${contentFingerprint(entry)}`
}

function contentFingerprint(entry: Record<string, unknown>): string {
  return JSON.stringify({
    itemId: entry.itemId ?? null,
    isCorrect: entry.isCorrect ?? null,
    difficulty: entry.difficulty ?? null,
    discrimination: entry.discrimination ?? null,
    pseudoGuessing: entry.pseudoGuessing ?? null,
    responseTimeSec: entry.responseTimeSec ?? null,
  })
}

function identitySet(entries: unknown): Set<string> {
  const list = Array.isArray(entries) ? entries : []
  return new Set(list.map((entry) => responseIdentity(entry)))
}

function sameIdentitySet(left: Set<string>, right: Set<string>): boolean {
  if (left.size !== right.size) return false
  for (const key of left) {
    if (!right.has(key)) return false
  }
  return true
}

/** Union distinct calculus responses; never drop the shorter side. */
export function mergeCalculusResponses(local: unknown, cloud: unknown): unknown[] {
  const left = Array.isArray(local) ? local : []
  const right = Array.isArray(cloud) ? cloud : []
  const seen = new Set<string>()
  const next: unknown[] = []
  for (const entry of [...left, ...right]) {
    const key = responseIdentity(entry)
    if (seen.has(key)) continue
    seen.add(key)
    next.push(entry)
  }
  return next
}

function toUserResponses(entries: unknown[]): UserResponse[] {
  const out: UserResponse[] = []
  for (const entry of entries) {
    if (!isRecord(entry) || typeof entry.itemId !== 'string') continue
    out.push({
      itemId: entry.itemId,
      isCorrect: Boolean(entry.isCorrect),
      difficulty: Number(entry.difficulty) || 0,
      discrimination: Number(entry.discrimination) || 1.2,
      pseudoGuessing: Number(entry.pseudoGuessing) || 0.25,
      responseTimeSec: typeof entry.responseTimeSec === 'number' ? entry.responseTimeSec : undefined,
    })
  }
  return out
}

function finiteTheta(value: unknown): number | null {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

/**
 * θ rule: keep it consistent with retained evidence, never |θ| magnitude.
 * Prefer the side whose FSRS map has the newer max(lastReview) as the prior.
 * Re-estimate only when the union added distinct event identities; identical
 * content without distinct ids must not inflate θ by counting the same
 * attempt twice against an already-estimated prior.
 */
export function mergeCalculusTheta(
  local: Record<string, unknown>,
  cloud: Record<string, unknown>,
  merged: Record<string, unknown>,
): number {
  const localReview = maxFsrsReview(local.calculusFsrs)
  const cloudReview = maxFsrsReview(cloud.calculusFsrs)
  const chosenPrior =
    cloudReview > localReview
      ? (finiteTheta(cloud.calculusTheta) ?? finiteTheta(local.calculusTheta) ?? 0)
      : (finiteTheta(local.calculusTheta) ?? finiteTheta(cloud.calculusTheta) ?? 0)
  const responses = toUserResponses(
    Array.isArray(merged.calculusResponses) ? merged.calculusResponses : [],
  )
  if (responses.length === 0) return chosenPrior

  const mergedIds = identitySet(merged.calculusResponses)
  const localIds = identitySet(local.calculusResponses)
  const cloudIds = identitySet(cloud.calculusResponses)
  if (sameIdentitySet(mergedIds, localIds) && sameIdentitySet(mergedIds, cloudIds)) {
    return chosenPrior
  }
  const priorIds = cloudReview > localReview ? cloudIds : localIds
  if (sameIdentitySet(mergedIds, priorIds)) {
    const priorTheta =
      cloudReview > localReview
        ? finiteTheta(cloud.calculusTheta)
        : finiteTheta(local.calculusTheta)
    if (priorTheta != null) return priorTheta
    return chosenPrior
  }
  return estimateAbilityTheta(responses, chosenPrior).theta
}

function itemSeen(value: unknown): number {
  if (!isRecord(value)) return 0
  const seen = Number(value.seen)
  const reps = Number(value.reps)
  return Math.max(Number.isFinite(seen) ? seen : 0, Number.isFinite(reps) ? reps : 0)
}

export function mergeMetaItems(
  local: unknown,
  cloud: unknown,
): Record<string, unknown> {
  const left = isRecord(local) ? local : {}
  const right = isRecord(cloud) ? cloud : {}
  const keys = new Set([...Object.keys(left), ...Object.keys(right)])
  const next: Record<string, unknown> = {}
  for (const key of keys) {
    const lv = left[key]
    const cv = right[key]
    if (!isRecord(lv)) next[key] = cv
    else if (!isRecord(cv)) next[key] = lv
    else next[key] = itemSeen(lv) >= itemSeen(cv) ? lv : cv
  }
  return next
}

export function trackHasProgress(value: unknown): boolean {
  if (!isRecord(value)) return false
  if (mergeNumericMax(value.xp, 0, 0) > 0) return true
  if (mergeStringArray(value.completedQuestions, []).length > 0) return true
  if (mergeStringArray(value.mastered, []).length > 0) return true
  if (mergeStringArray(value.masteredPinyin, []).length > 0) return true
  if (Object.keys(mergeJsonRecords(value.calculusFsrs, {})).length > 0) return true
  return false
}
