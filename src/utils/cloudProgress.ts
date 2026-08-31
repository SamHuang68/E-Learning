import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import {
  applyCloudBundle,
  defaultKanaProgress,
  defaultLearningMeta,
  defaultToeicProgress,
  loadKanaProgress,
  loadLang,
  loadLearningMeta,
  loadProgress,
  loadToeicProgress,
  setProgressChangeHook,
  type AppView,
  type KanaProgress,
  type LearningMeta,
  type ProgressState,
  type ToeicProgress,
} from './storage'
import {
  loadMathProgress,
  saveMathProgress,
  defaultMathProgress,
  type MathProgressState,
} from '../math/utils/mathStorage'
import {
  defaultPhysicsProgress,
  loadPhysicsProgress,
  savePhysicsProgress,
  type PhysicsProgressState,
} from '../physics/utils/physicsStorage'
import {
  defaultChemistryProgress,
  loadChemistryProgress,
  saveChemistryProgress,
  type ChemistryProgressState,
} from '../chemistry/utils/chemistryStorage'

setProgressChangeHook(() => {
  scheduleCloudPush()
})

// Canonical STEM progress stores emit track-specific events; route all of them
// through the same debounced cloud writer.
if (typeof window !== 'undefined') {
  ;['math', 'physics', 'chemistry'].forEach((track) => {
    window.addEventListener(`${track}:progress-updated`, () => {
      scheduleCloudPush()
    })
  })
}

export type CloudProgressRow = {
  user_id: string
  aoba: ProgressState
  kana: KanaProgress
  toeic: ToeicProgress
  math: MathProgressState
  physics: PhysicsProgressState
  chemistry: ChemistryProgressState
  lang: AppView
  meta: LearningMeta
  updated_at: string
}

export type SyncOutcome = 'migrated' | 'pulled' | 'skipped' | 'error'

let cloudUserId: string | null = null
/** Blocks write-through until first pull/migrate finishes (avoids racing stale local). */
let allowPush = false
let pushTimer: ReturnType<typeof setTimeout> | null = null
let pushInFlight: Promise<void> | null = null

type SyncListener = (status: SyncUiStatus) => void
export type SyncUiStatus = 'local-only' | 'syncing' | 'synced' | 'error'

let listeners = new Set<SyncListener>()
let lastStatus: SyncUiStatus = 'local-only'

function emit(status: SyncUiStatus) {
  lastStatus = status
  listeners.forEach((fn) => fn(status))
}

export function getSyncStatus(): SyncUiStatus {
  return lastStatus
}

export function subscribeSyncStatus(fn: SyncListener): () => void {
  listeners.add(fn)
  fn(lastStatus)
  return () => {
    listeners.delete(fn)
  }
}

export function setCloudUserId(userId: string | null) {
  cloudUserId = userId
  allowPush = false
  if (!userId) {
    if (pushTimer) {
      clearTimeout(pushTimer)
      pushTimer = null
    }
    emit('local-only')
  }
}

function localBundle() {
  return {
    aoba: loadProgress(),
    kana: loadKanaProgress(),
    toeic: loadToeicProgress(),
    math: loadMathProgress(),
    physics: loadPhysicsProgress(),
    chemistry: loadChemistryProgress(),
    lang: loadLang(),
    meta: loadLearningMeta(),
  }
}

function normalizeLang(value: unknown): AppView {
  if (
    value === 'ja' ||
    value === 'en' ||
    value === 'math' ||
    value === 'calculus' ||
    value === 'physics' ||
    value === 'chemistry' ||
    value === 'hub'
  ) return value
  if (value === 'aoba') return 'ja'
  if (value === 'toeic') return 'en'
  if (value === 'calc') return 'calculus'
  return 'hub'
}

function normalizeRow(data: Record<string, unknown>): Omit<CloudProgressRow, 'user_id'> {
  const math = data.math && typeof data.math === 'object' && Object.keys(data.math).length > 0
    ? { ...defaultMathProgress(), ...(data.math as Partial<MathProgressState>) }
    : loadMathProgress()
  const physics = data.physics && typeof data.physics === 'object' && Object.keys(data.physics).length > 0
    ? { ...defaultPhysicsProgress(), ...(data.physics as Partial<PhysicsProgressState>) }
    : loadPhysicsProgress()
  const chemistry = data.chemistry && typeof data.chemistry === 'object' && Object.keys(data.chemistry).length > 0
    ? { ...defaultChemistryProgress(), ...(data.chemistry as Partial<ChemistryProgressState>) }
    : loadChemistryProgress()

  return {
    aoba: (data.aoba as ProgressState) ?? loadProgress(),
    kana: (data.kana as KanaProgress) ?? defaultKanaProgress(),
    toeic: (data.toeic as ToeicProgress) ?? defaultToeicProgress(),
    math,
    physics,
    chemistry,
    lang: normalizeLang(data.lang),
    meta: (data.meta as LearningMeta) ?? defaultLearningMeta(),
    updated_at:
      typeof data.updated_at === 'string'
        ? data.updated_at
        : new Date().toISOString(),
  }
}

/** After sign-in: upload local if no cloud row; otherwise cloud overwrites local. */
export async function hydrateFromCloud(userId: string): Promise<SyncOutcome> {
  const sb = getSupabase()
  if (!sb) {
    emit('local-only')
    return 'skipped'
  }

  cloudUserId = userId
  emit('syncing')

  try {
    const { data, error } = await sb
      .from('user_progress')
      .select('user_id, aoba, kana, toeic, math, physics, chemistry, lang, meta, updated_at')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      const bundle = localBundle()
      const { error: upsertError } = await sb.from('user_progress').upsert({
        user_id: userId,
        aoba: bundle.aoba,
        kana: bundle.kana,
        toeic: bundle.toeic,
        math: bundle.math,
        physics: bundle.physics,
        chemistry: bundle.chemistry,
        lang: bundle.lang,
        meta: bundle.meta,
        updated_at: new Date().toISOString(),
      })
      if (upsertError) throw upsertError
      allowPush = true
      emit('synced')
      return 'migrated'
    }

    const row = normalizeRow(data as Record<string, unknown>)
    applyCloudBundle({
      aoba: row.aoba,
      kana: row.kana,
      toeic: row.toeic,
      math: row.math,
      physics: row.physics,
      chemistry: row.chemistry,
      lang: row.lang,
      meta: row.meta,
    })
    saveMathProgress(row.math)
    savePhysicsProgress(row.physics)
    saveChemistryProgress(row.chemistry)
    allowPush = true
    emit('synced')
    return 'pulled'
  } catch {
    // A failed pull must never unlock write-through: stale local state could
    // overwrite a cloud row that we were unable to read.
    allowPush = false
    emit('error')
    return 'error'
  }
}

export async function pushProgressNow(): Promise<boolean> {
  const sb = getSupabase()
  if (!sb || !cloudUserId) return false

  emit('syncing')
  try {
    const bundle = localBundle()
    const { error } = await sb.from('user_progress').upsert({
      user_id: cloudUserId,
      aoba: bundle.aoba,
      kana: bundle.kana,
      toeic: bundle.toeic,
      math: bundle.math,
      physics: bundle.physics,
      chemistry: bundle.chemistry,
      lang: bundle.lang,
      meta: bundle.meta,
      updated_at: new Date().toISOString(),
    })
    if (error) throw error
    emit('synced')
    return true
  } catch {
    emit('error')
    return false
  }
}

/** Debounced write-through after localStorage saves. */
export function scheduleCloudPush() {
  if (!allowPush || !cloudUserId || !isSupabaseConfigured()) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => {
    pushTimer = null
    pushInFlight = pushProgressNow().then(() => undefined)
  }, 400)
}

export async function flushCloudPush(): Promise<void> {
  if (pushTimer) {
    clearTimeout(pushTimer)
    pushTimer = null
    await pushProgressNow()
    return
  }
  if (pushInFlight) await pushInFlight
}

/** Reset cloud progress to defaults and mirror locally. */
export async function resetCloudProgress(): Promise<boolean> {
  const sb = getSupabase()
  if (!sb || !cloudUserId) return false

  const fresh = {
    aoba: {
      levelId: 'n5n4',
      unitId: 1,
      xp: 0,
      vocabDone: 0,
      readingDone: 0,
      grammarStarted: false,
    } satisfies ProgressState,
    kana: defaultKanaProgress(),
    toeic: defaultToeicProgress(),
    math: defaultMathProgress(),
    physics: defaultPhysicsProgress(),
    chemistry: defaultChemistryProgress(),
    lang: 'hub' as AppView,
    meta: defaultLearningMeta(),
  }

  emit('syncing')
  try {
    const { error } = await sb.from('user_progress').upsert({
      user_id: cloudUserId,
      ...fresh,
      updated_at: new Date().toISOString(),
    })
    if (error) throw error
    applyCloudBundle(fresh)
    saveMathProgress(fresh.math)
    savePhysicsProgress(fresh.physics)
    saveChemistryProgress(fresh.chemistry)
    allowPush = true
    emit('synced')
    return true
  } catch {
    emit('error')
    return false
  }
}
