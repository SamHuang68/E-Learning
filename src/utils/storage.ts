import type { BuilderConfig } from '../data/course'
import { LEARN_ORDER, type KanaScript, type LearnRowId } from '../data/kana'
import type { ToeicBuilderConfig, ToeicCertificate } from '../toeic/data/certificates'

/** Late-bound write-through hook (wired by cloudProgress to avoid circular imports). */
let progressChangeHook: (() => void) | null = null

export function setProgressChangeHook(fn: (() => void) | null) {
  progressChangeHook = fn
}

function notifyProgressChanged() {
  progressChangeHook?.()
}

const PRESETS_KEY = 'aoba-presets'
const API_KEY = 'aoba-groq-key'
const PROGRESS_KEY = 'aoba-progress'
const KANA_KEY = 'aoba-kana-progress'
/** Last selected learning language (or hub). */
const LANG_KEY = 'e-learning-lang'
/** Legacy hub/site key; read once for migration. */
const LEGACY_SITE_KEY = 'aoba-site'
const TOEIC_PROGRESS_KEY = 'toeic-progress'
const TOEIC_PRESETS_KEY = 'toeic-presets'

/** Learning target language modules. */
export type LangId = 'ja' | 'en'
/** Top-level app view: language picker or a language module. */
export type AppView = 'hub' | LangId

function normalizeLang(value: string | null | undefined): AppView | null {
  if (value === 'hub') return 'hub'
  if (value === 'ja' || value === 'aoba') return 'ja'
  if (value === 'en' || value === 'toeic') return 'en'
  return null
}

export type SavedPreset = {
  name: string
  config: BuilderConfig
  savedAt: string
}

export type ProgressState = {
  /** JLPT top-level track id: n5n4 | n3 | n2n1 */
  levelId: string
  unitId: number
  xp: number
  vocabDone: number
  readingDone: number
  grammarStarted: boolean
}

export type KanaProgress = {
  script: KanaScript
  unlockedRows: LearnRowId[]
  mastered: string[]
  quizCorrect: number
  quizTotal: number
}

export type ToeicProgress = {
  certificateId: ToeicCertificate['id']
  unitId: number
  xp: number
  vocabDone: number
  listeningDone: number
  grammarStarted: boolean
  phonicsMastered: string[]
}

export type ToeicSavedPreset = {
  name: string
  config: ToeicBuilderConfig
  savedAt: string
}

export function loadLang(): AppView {
  const hash = window.location.hash.replace('#', '')
  if (hash === 'en' || hash.startsWith('toeic')) return 'en'
  if (
    hash === 'ja' ||
    hash.startsWith('aoba') ||
    hash.startsWith('builder')
  ) {
    return 'ja'
  }
  if (hash === 'hub') return 'hub'
  try {
    const saved =
      normalizeLang(localStorage.getItem(LANG_KEY)) ??
      normalizeLang(localStorage.getItem(LEGACY_SITE_KEY))
    if (saved) return saved
  } catch {
    /* ignore */
  }
  return 'hub'
}

export function saveLang(view: AppView) {
  localStorage.setItem(LANG_KEY, view)
  try {
    localStorage.removeItem(LEGACY_SITE_KEY)
  } catch {
    /* ignore */
  }
  if (view === 'hub') window.location.hash = 'hub'
  else if (view === 'en') window.location.hash = 'toeic'
  else window.location.hash = 'aoba'
  notifyProgressChanged()
}

/** Write lang preference without changing the hash (used when hydrating from cloud). */
export function writeLangPreference(view: AppView) {
  localStorage.setItem(LANG_KEY, view)
  try {
    localStorage.removeItem(LEGACY_SITE_KEY)
  } catch {
    /* ignore */
  }
}

export function loadPresets(): SavedPreset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY)
    return raw ? (JSON.parse(raw) as SavedPreset[]) : []
  } catch {
    return []
  }
}

export function savePreset(name: string, config: BuilderConfig): SavedPreset[] {
  const presets = loadPresets().filter((p) => p.name !== name)
  const next = [
    { name, config, savedAt: new Date().toISOString() },
    ...presets,
  ].slice(0, 20)
  localStorage.setItem(PRESETS_KEY, JSON.stringify(next))
  return next
}

export function loadApiKey(): string {
  return localStorage.getItem(API_KEY) ?? ''
}

export function saveApiKey(key: string) {
  localStorage.setItem(API_KEY, key)
}

function migrateProgress(raw: Record<string, unknown>): ProgressState {
  const levelId =
    typeof raw.levelId === 'string'
      ? raw.levelId
      : typeof raw.semesterId === 'string'
        ? String(raw.semesterId).startsWith('n4')
          ? 'n5n4'
          : String(raw.semesterId).startsWith('n5')
            ? 'n5n4'
            : 'n5n4'
        : 'n5n4'
  return {
    levelId: ['n5n4', 'n3', 'n2n1'].includes(levelId) ? levelId : 'n5n4',
    unitId: Number(raw.unitId) || 1,
    xp: Number(raw.xp) || 0,
    vocabDone: Number(raw.vocabDone) || 0,
    readingDone: Number(raw.readingDone) || 0,
    grammarStarted: Boolean(raw.grammarStarted),
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (raw) return migrateProgress(JSON.parse(raw) as Record<string, unknown>)
  } catch {
    /* ignore */
  }
  return {
    levelId: 'n5n4',
    unitId: 1,
    xp: 0,
    vocabDone: 0,
    readingDone: 0,
    grammarStarted: false,
  }
}

export function saveProgress(progress: ProgressState) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  notifyProgressChanged()
}

export function defaultKanaProgress(): KanaProgress {
  return {
    script: 'hiragana',
    unlockedRows: [...LEARN_ORDER],
    mastered: [],
    quizCorrect: 0,
    quizTotal: 0,
  }
}

export function loadKanaProgress(): KanaProgress {
  try {
    const raw = localStorage.getItem(KANA_KEY)
    if (raw) {
      return { ...defaultKanaProgress(), ...(JSON.parse(raw) as KanaProgress) }
    }
  } catch {
    /* ignore */
  }
  return defaultKanaProgress()
}

export function saveKanaProgress(progress: KanaProgress) {
  localStorage.setItem(KANA_KEY, JSON.stringify(progress))
  notifyProgressChanged()
}

export function defaultToeicProgress(): ToeicProgress {
  return {
    certificateId: 'orange',
    unitId: 1,
    xp: 0,
    vocabDone: 0,
    listeningDone: 0,
    grammarStarted: false,
    phonicsMastered: [],
  }
}

export function loadToeicProgress(): ToeicProgress {
  try {
    const raw = localStorage.getItem(TOEIC_PROGRESS_KEY)
    if (raw) {
      return { ...defaultToeicProgress(), ...(JSON.parse(raw) as ToeicProgress) }
    }
  } catch {
    /* ignore */
  }
  return defaultToeicProgress()
}

export function saveToeicProgress(progress: ToeicProgress) {
  localStorage.setItem(TOEIC_PROGRESS_KEY, JSON.stringify(progress))
  notifyProgressChanged()
}

export type ProgressExportBundle = {
  version: 1
  exportedAt: string
  aoba: ProgressState
  kana: KanaProgress
  toeic: ToeicProgress
  lang: AppView
}

/** Progress-only export. Never includes Groq API key or builder presets. */
export function exportProgressBundle(): ProgressExportBundle {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    aoba: loadProgress(),
    kana: loadKanaProgress(),
    toeic: loadToeicProgress(),
    lang: loadLang(),
  }
}

export function importProgressBundle(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return false
  const data = raw as Partial<ProgressExportBundle>
  if (data.version !== 1) return false
  if (!data.aoba || !data.kana || !data.toeic) return false

  applyCloudBundle({
    aoba: migrateProgress(data.aoba as unknown as Record<string, unknown>),
    kana: { ...defaultKanaProgress(), ...data.kana },
    toeic: { ...defaultToeicProgress(), ...data.toeic },
    lang: normalizeLang(typeof data.lang === 'string' ? data.lang : null) ?? 'hub',
  })
  notifyProgressChanged()
  return true
}

/** Apply a cloud/import bundle to localStorage without scheduling another pull. */
export function applyCloudBundle(bundle: {
  aoba: ProgressState
  kana: KanaProgress
  toeic: ToeicProgress
  lang: AppView
}) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(migrateProgress(bundle.aoba as unknown as Record<string, unknown>)))
  localStorage.setItem(
    KANA_KEY,
    JSON.stringify({ ...defaultKanaProgress(), ...bundle.kana }),
  )
  localStorage.setItem(
    TOEIC_PROGRESS_KEY,
    JSON.stringify({ ...defaultToeicProgress(), ...bundle.toeic }),
  )
  writeLangPreference(bundle.lang)
}

/** Clear learning progress cache only — keeps Groq key and builder presets. */
export function clearLocalProgressCache() {
  localStorage.removeItem(PROGRESS_KEY)
  localStorage.removeItem(KANA_KEY)
  localStorage.removeItem(TOEIC_PROGRESS_KEY)
  localStorage.removeItem(LANG_KEY)
  try {
    localStorage.removeItem(LEGACY_SITE_KEY)
  } catch {
    /* ignore */
  }
}

export function loadToeicPresets(): ToeicSavedPreset[] {
  try {
    const raw = localStorage.getItem(TOEIC_PRESETS_KEY)
    return raw ? (JSON.parse(raw) as ToeicSavedPreset[]) : []
  } catch {
    return []
  }
}

export function saveToeicPreset(
  name: string,
  config: ToeicBuilderConfig,
): ToeicSavedPreset[] {
  const presets = loadToeicPresets().filter((p) => p.name !== name)
  const next = [
    { name, config, savedAt: new Date().toISOString() },
    ...presets,
  ].slice(0, 20)
  localStorage.setItem(TOEIC_PRESETS_KEY, JSON.stringify(next))
  return next
}
