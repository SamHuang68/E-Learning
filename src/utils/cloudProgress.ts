import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import {
  applyCloudBundle,
  defaultKanaProgress,
  defaultToeicProgress,
  loadKanaProgress,
  loadLang,
  loadProgress,
  loadToeicProgress,
  setProgressChangeHook,
  type AppView,
  type KanaProgress,
  type ProgressState,
  type ToeicProgress,
} from './storage'

setProgressChangeHook(() => {
  scheduleCloudPush()
})

export type CloudProgressRow = {
  user_id: string
  aoba: ProgressState
  kana: KanaProgress
  toeic: ToeicProgress
  lang: AppView
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
    lang: loadLang(),
  }
}

function normalizeLang(value: unknown): AppView {
  if (value === 'ja' || value === 'en' || value === 'hub') return value
  if (value === 'aoba') return 'ja'
  if (value === 'toeic') return 'en'
  return 'hub'
}

function normalizeRow(data: Record<string, unknown>): Omit<CloudProgressRow, 'user_id'> {
  return {
    aoba: (data.aoba as ProgressState) ?? loadProgress(),
    kana: (data.kana as KanaProgress) ?? defaultKanaProgress(),
    toeic: (data.toeic as ToeicProgress) ?? defaultToeicProgress(),
    lang: normalizeLang(data.lang),
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
      .select('user_id, aoba, kana, toeic, lang, updated_at')
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
        lang: bundle.lang,
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
      lang: row.lang,
    })
    allowPush = true
    emit('synced')
    return 'pulled'
  } catch {
    allowPush = Boolean(cloudUserId)
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
      lang: bundle.lang,
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
    lang: 'hub' as AppView,
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
    allowPush = true
    emit('synced')
    return true
  } catch {
    emit('error')
    return false
  }
}
