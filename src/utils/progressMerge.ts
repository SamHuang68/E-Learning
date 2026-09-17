/**
 * Honest merge of learner progress: never drop local or cloud evidence.
 * Used on login hydrate so a signed-out session cannot be silently clobbered
 * by an older/partial cloud row, and vice versa.
 */

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
  if ('calculusTheta' in left || 'calculusTheta' in right) {
    const localTheta = Number(left.calculusTheta)
    const cloudTheta = Number(right.calculusTheta)
    const localAbs = Number.isFinite(localTheta) ? Math.abs(localTheta) : 0
    const cloudAbs = Number.isFinite(cloudTheta) ? Math.abs(cloudTheta) : 0
    next.calculusTheta = localAbs >= cloudAbs ? localTheta : cloudTheta
  }
  if ('calculusFsrs' in left || 'calculusFsrs' in right) {
    next.calculusFsrs = mergeJsonRecords(left.calculusFsrs, right.calculusFsrs)
  }
  if ('calculusResponses' in left || 'calculusResponses' in right) {
    const localResp = Array.isArray(left.calculusResponses) ? left.calculusResponses : []
    const cloudResp = Array.isArray(right.calculusResponses) ? right.calculusResponses : []
    next.calculusResponses = localResp.length >= cloudResp.length ? localResp : cloudResp
  }
  return next
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
