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
import { PROGRESS_STORAGE_KEYS } from './progressKeys'
import {
  mergeJsonRecords,
  mergeMetaItems,
  mergeNumericMax,
  mergeStringArray,
  mergeTrackProgress,
  trackHasProgress,
} from './progressMerge'
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
import {
  DEFAULT_CS_PROGRESS,
  loadCsProgress,
  saveCsProgress,
  type CsProgress,
} from '../cs/utils/csStorage'
import {
  defaultChineseProgress,
  loadChineseProgress,
  saveChineseProgress,
  type ChineseProgressState,
} from '../chinese/utils/chineseStorage'

setProgressChangeHook(() => {
  scheduleCloudPush()
})

// Canonical STEM/CS progress stores emit track-specific events; route all of them
// through the same debounced cloud writer.
if (typeof window !== 'undefined') {
  ;['math', 'physics', 'chemistry', 'cs'].forEach((track) => {
    window.addEventListener(`${track}:progress-updated`, () => {
      scheduleCloudPush()
    })
    window.addEventListener(`${track}:signals-mastery-updated`, () => {
      scheduleCloudPush()
    })
  })
}

export type SignalMasteryMap = Record<string, unknown>

export type CloudProgressRow = {
  user_id: string
  aoba: ProgressState
  kana: KanaProgress
  toeic: ToeicProgress
  math: MathProgressState
  physics: PhysicsProgressState
  chemistry: ChemistryProgressState
  cs: CsProgress
  chinese: ChineseProgressState
  math_signals: SignalMasteryMap
  physics_signals: SignalMasteryMap
  chemistry_signals: SignalMasteryMap
  cs_signals: SignalMasteryMap
  lang: AppView
  meta: LearningMeta
  updated_at: string
}

export type SyncOutcome = 'migrated' | 'pulled' | 'merged' | 'skipped' | 'error'

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

function loadSignalMap(key: string): SignalMasteryMap {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as SignalMasteryMap)
      : {}
  } catch {
    return {}
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
    cs: loadCsProgress(),
    chinese: loadChineseProgress(),
    mathSignals: loadSignalMap(PROGRESS_STORAGE_KEYS.mathSignals),
    physicsSignals: loadSignalMap(PROGRESS_STORAGE_KEYS.physicsSignals),
    chemistrySignals: loadSignalMap(PROGRESS_STORAGE_KEYS.chemistrySignals),
    csSignals: loadSignalMap(PROGRESS_STORAGE_KEYS.csSignals),
    lang: loadLang(),
    meta: loadLearningMeta(),
  }
}

type LocalBundle = ReturnType<typeof localBundle>

function defaultCsProgress(): CsProgress {
  return { ...DEFAULT_CS_PROGRESS }
}

function normalizeLang(value: unknown): AppView {
  if (
    value === 'ja' ||
    value === 'en' ||
    value === 'zh' ||
    value === 'math' ||
    value === 'calculus' ||
    value === 'physics' ||
    value === 'chemistry' ||
    value === 'cs' ||
    value === 'hub'
  ) return value
  if (value === 'aoba') return 'ja'
  if (value === 'toeic') return 'en'
  if (value === 'calc') return 'calculus'
  if (value === 'chinese' || value === 'mandarin' || value === 'huayu') return 'zh'
  return 'hub'
}

function normalizeTrackJson<T extends object>(
  value: unknown,
  fallbackFactory: () => T,
  local: T,
): T {
  if (value && typeof value === 'object' && Object.keys(value as object).length > 0) {
    return { ...fallbackFactory(), ...(value as Partial<T>) }
  }
  return local
}

function normalizeSignalMap(value: unknown, local: SignalMasteryMap): SignalMasteryMap {
  if (value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0) {
    return value as SignalMasteryMap
  }
  return local
}

function upsertPayload(userId: string, bundle: LocalBundle, updatedAt: string) {
  return {
    user_id: userId,
    aoba: bundle.aoba,
    kana: bundle.kana,
    toeic: bundle.toeic,
    math: bundle.math,
    physics: bundle.physics,
    chemistry: bundle.chemistry,
    cs: bundle.cs,
    chinese: bundle.chinese,
    math_signals: bundle.mathSignals,
    physics_signals: bundle.physicsSignals,
    chemistry_signals: bundle.chemistrySignals,
    cs_signals: bundle.csSignals,
    lang: bundle.lang,
    meta: bundle.meta,
    updated_at: updatedAt,
  }
}

const CLOUD_SELECT_COLUMNS =
  'user_id, aoba, kana, toeic, math, physics, chemistry, cs, chinese, math_signals, physics_signals, chemistry_signals, cs_signals, lang, meta, updated_at'

async function upsertAndVerify(
  userId: string,
  bundle: LocalBundle,
): Promise<boolean> {
  const sb = getSupabase()
  if (!sb) return false
  const updatedAt = new Date().toISOString()
  const payload = upsertPayload(userId, bundle, updatedAt)
  const { error } = await sb.from('user_progress').upsert(payload)
  if (error) return false
  const { data, error: readError } = await sb
    .from('user_progress')
    .select('user_id, updated_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (readError || !data) return false
  const row = data as { user_id?: string; updated_at?: string }
  return row.user_id === userId && typeof row.updated_at === 'string'
}

function applyBundle(bundle: LocalBundle) {
  applyCloudBundle({
    aoba: bundle.aoba,
    kana: bundle.kana,
    toeic: bundle.toeic,
    math: bundle.math,
    physics: bundle.physics,
    chemistry: bundle.chemistry,
    cs: bundle.cs,
    chinese: bundle.chinese,
    mathSignals: bundle.mathSignals,
    physicsSignals: bundle.physicsSignals,
    chemistrySignals: bundle.chemistrySignals,
    csSignals: bundle.csSignals,
    lang: bundle.lang,
    meta: bundle.meta,
  })
  saveMathProgress(bundle.math)
  savePhysicsProgress(bundle.physics)
  saveChemistryProgress(bundle.chemistry)
  saveCsProgress(bundle.cs)
  saveChineseProgress(bundle.chinese)
}

function mergeLearningMeta(local: LearningMeta, cloud: LearningMeta): LearningMeta {
  return {
    ...cloud,
    ...local,
    items: mergeMetaItems(local.items, cloud.items) as LearningMeta['items'],
    streak: mergeNumericMax(local.streak, cloud.streak, 0),
    dailyGoalCards: mergeNumericMax(local.dailyGoalCards, cloud.dailyGoalCards, 20),
    dailyDoneCards: mergeNumericMax(local.dailyDoneCards, cloud.dailyDoneCards, 0),
    lastActiveDate: local.lastActiveDate || cloud.lastActiveDate,
    dailyDoneDate: local.dailyDoneDate || cloud.dailyDoneDate,
    proUnlocked: Boolean(local.proUnlocked) || Boolean(cloud.proUnlocked),
    achievements: mergeStringArray(local.achievements, cloud.achievements),
    kanjiMastered: mergeStringArray(local.kanjiMastered, cloud.kanjiMastered),
    speakingDone: mergeNumericMax(local.speakingDone, cloud.speakingDone, 0),
    events: [...(cloud.events ?? []), ...(local.events ?? [])].slice(-200),
    placementJa: local.placementJa ?? cloud.placementJa,
    placementEn: local.placementEn ?? cloud.placementEn,
  }
}

function mergeAoba(local: ProgressState, cloud: ProgressState): ProgressState {
  const merged = mergeTrackProgress(local, cloud)
  const richer = (local.xp || 0) >= (cloud.xp || 0) ? local : cloud
  return {
    levelId: typeof richer.levelId === 'string' ? richer.levelId : 'n5n4',
    unitId: Number(richer.unitId) || 1,
    xp: Number(merged.xp) || 0,
    vocabDone: Number(merged.vocabDone) || 0,
    readingDone: Number(merged.readingDone) || 0,
    grammarStarted: Boolean(merged.grammarStarted),
  }
}

function localHasProgress(bundle: LocalBundle): boolean {
  return (
    trackHasProgress(bundle.aoba) ||
    trackHasProgress(bundle.kana) ||
    trackHasProgress(bundle.toeic) ||
    trackHasProgress(bundle.math) ||
    trackHasProgress(bundle.physics) ||
    trackHasProgress(bundle.chemistry) ||
    trackHasProgress(bundle.cs) ||
    trackHasProgress(bundle.chinese) ||
    Object.keys(bundle.mathSignals).length > 0 ||
    Object.keys(bundle.physicsSignals).length > 0 ||
    Object.keys(bundle.chemistrySignals).length > 0 ||
    Object.keys(bundle.csSignals).length > 0 ||
    Object.keys(bundle.meta.items ?? {}).length > 0
  )
}

function cloudHasProgress(bundle: LocalBundle): boolean {
  return localHasProgress(bundle)
}

function mergeBundles(local: LocalBundle, cloud: LocalBundle): LocalBundle {
  return {
    aoba: mergeAoba(local.aoba, cloud.aoba),
    kana: {
      ...defaultKanaProgress(),
      ...mergeTrackProgress(local.kana, cloud.kana),
    } as KanaProgress,
    toeic: {
      ...defaultToeicProgress(),
      ...mergeTrackProgress(local.toeic, cloud.toeic),
    } as ToeicProgress,
    math: {
      ...defaultMathProgress(),
      ...mergeTrackProgress(local.math, cloud.math),
    } as MathProgressState,
    physics: {
      ...defaultPhysicsProgress(),
      ...mergeTrackProgress(local.physics, cloud.physics),
    } as PhysicsProgressState,
    chemistry: {
      ...defaultChemistryProgress(),
      ...mergeTrackProgress(local.chemistry, cloud.chemistry),
    } as ChemistryProgressState,
    cs: {
      ...defaultCsProgress(),
      ...mergeTrackProgress(local.cs, cloud.cs),
    } as CsProgress,
    chinese: {
      ...defaultChineseProgress(),
      ...mergeTrackProgress(local.chinese, cloud.chinese),
    } as ChineseProgressState,
    mathSignals: mergeJsonRecords(local.mathSignals, cloud.mathSignals),
    physicsSignals: mergeJsonRecords(local.physicsSignals, cloud.physicsSignals),
    chemistrySignals: mergeJsonRecords(local.chemistrySignals, cloud.chemistrySignals),
    csSignals: mergeJsonRecords(local.csSignals, cloud.csSignals),
    lang: local.lang !== 'hub' ? local.lang : cloud.lang,
    meta: mergeLearningMeta(local.meta, cloud.meta),
  }
}

function normalizeRow(data: Record<string, unknown>): Omit<CloudProgressRow, 'user_id'> & {
  mathSignals: SignalMasteryMap
  physicsSignals: SignalMasteryMap
  chemistrySignals: SignalMasteryMap
  csSignals: SignalMasteryMap
} {
  const math = normalizeTrackJson(data.math, defaultMathProgress, loadMathProgress())
  const physics = normalizeTrackJson(data.physics, defaultPhysicsProgress, loadPhysicsProgress())
  const chemistry = normalizeTrackJson(data.chemistry, defaultChemistryProgress, loadChemistryProgress())
  const cs = normalizeTrackJson(data.cs, defaultCsProgress, loadCsProgress())
  const chinese = normalizeTrackJson(
    data.chinese ?? data.zh,
    defaultChineseProgress,
    loadChineseProgress(),
  )

  return {
    aoba: (data.aoba as ProgressState) ?? loadProgress(),
    kana: (data.kana as KanaProgress) ?? defaultKanaProgress(),
    toeic: (data.toeic as ToeicProgress) ?? defaultToeicProgress(),
    math,
    physics,
    chemistry,
    cs,
    chinese,
    math_signals: normalizeSignalMap(
      data.math_signals ?? data.mathSignals,
      loadSignalMap(PROGRESS_STORAGE_KEYS.mathSignals),
    ),
    physics_signals: normalizeSignalMap(
      data.physics_signals ?? data.physicsSignals,
      loadSignalMap(PROGRESS_STORAGE_KEYS.physicsSignals),
    ),
    chemistry_signals: normalizeSignalMap(
      data.chemistry_signals ?? data.chemistrySignals,
      loadSignalMap(PROGRESS_STORAGE_KEYS.chemistrySignals),
    ),
    cs_signals: normalizeSignalMap(
      data.cs_signals ?? data.csSignals,
      loadSignalMap(PROGRESS_STORAGE_KEYS.csSignals),
    ),
    mathSignals: normalizeSignalMap(
      data.math_signals ?? data.mathSignals,
      loadSignalMap(PROGRESS_STORAGE_KEYS.mathSignals),
    ),
    physicsSignals: normalizeSignalMap(
      data.physics_signals ?? data.physicsSignals,
      loadSignalMap(PROGRESS_STORAGE_KEYS.physicsSignals),
    ),
    chemistrySignals: normalizeSignalMap(
      data.chemistry_signals ?? data.chemistrySignals,
      loadSignalMap(PROGRESS_STORAGE_KEYS.chemistrySignals),
    ),
    csSignals: normalizeSignalMap(
      data.cs_signals ?? data.csSignals,
      loadSignalMap(PROGRESS_STORAGE_KEYS.csSignals),
    ),
    lang: normalizeLang(data.lang),
    meta: (data.meta as LearningMeta) ?? defaultLearningMeta(),
    updated_at:
      typeof data.updated_at === 'string'
        ? data.updated_at
        : new Date().toISOString(),
  }
}

/** After sign-in: upload local if no cloud row; otherwise merge then verify. */
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
      .select(CLOUD_SELECT_COLUMNS)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error

    const local = localBundle()

    if (!data) {
      const verified = await upsertAndVerify(userId, local)
      if (!verified) throw new Error('migrate-unverified')
      allowPush = true
      emit('synced')
      return 'migrated'
    }

    const row = normalizeRow(data as Record<string, unknown>)
    const cloud: LocalBundle = {
      aoba: row.aoba,
      kana: row.kana,
      toeic: row.toeic,
      math: row.math,
      physics: row.physics,
      chemistry: row.chemistry,
      cs: row.cs,
      chinese: row.chinese,
      mathSignals: row.mathSignals,
      physicsSignals: row.physicsSignals,
      chemistrySignals: row.chemistrySignals,
      csSignals: row.csSignals,
      lang: row.lang,
      meta: row.meta,
    }

    const merged = mergeBundles(local, cloud)
    applyBundle(merged)
    const verified = await upsertAndVerify(userId, merged)
    if (!verified) {
      allowPush = false
      emit('error')
      return 'error'
    }
    allowPush = true
    emit('synced')
    const bothSides = localHasProgress(local) && cloudHasProgress(cloud)
    return bothSides ? 'merged' : 'pulled'
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
  if (!sb || !cloudUserId || !allowPush) return false

  emit('syncing')
  try {
    const bundle = localBundle()
    const verified = await upsertAndVerify(cloudUserId, bundle)
    if (!verified) throw new Error('push-unverified')
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

  const fresh: LocalBundle = {
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
    cs: defaultCsProgress(),
    chinese: defaultChineseProgress(),
    mathSignals: {},
    physicsSignals: {},
    chemistrySignals: {},
    csSignals: {},
    lang: 'hub' as AppView,
    meta: defaultLearningMeta(),
  }

  emit('syncing')
  try {
    applyBundle(fresh)
    const verified = await upsertAndVerify(cloudUserId, fresh)
    if (!verified) throw new Error('reset-unverified')
    allowPush = true
    emit('synced')
    return true
  } catch {
    emit('error')
    return false
  }
}
