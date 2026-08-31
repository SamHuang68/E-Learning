import type { BuilderConfig } from '../data/course'
import { LEARN_ORDER, type KanaScript, type LearnRowId } from '../data/kana'
import { defaultItemState, type ItemState } from '../engine/srs'
import type { ToeicBuilderConfig, ToeicCertificate } from '../toeic/data/certificates'

/** Late-bound write-through hook (wired by cloudProgress to avoid circular imports). */
let progressChangeHook: (() => void) | null = null

export function setProgressChangeHook(fn: (() => void) | null) {
  progressChangeHook = fn
}

export function notifyProgressChanged() {
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
const LEARNING_META_KEY = 'e-learning-meta'
const LEARNING_EVENT_LIMIT = 200

/** Learning target language/subject modules. */
export type LangId = 'ja' | 'en' | 'math' | 'calculus' | 'physics' | 'chemistry'
/** Top-level app view: language/subject picker or a learning module. */
export type AppView = 'hub' | LangId

function normalizeLang(value: string | null | undefined): AppView | null {
  if (value === 'hub') return 'hub'
  if (value === 'ja' || value === 'aoba') return 'ja'
  if (value === 'en' || value === 'toeic') return 'en'
  if (value === 'math') return 'math'
  if (value === 'calculus' || value === 'calc') return 'calculus'
  if (value === 'physics' || value === 'phys') return 'physics'
  if (value === 'chemistry' || value === 'chem') return 'chemistry'
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

export type LearningMeta = {
  items: Record<string, ItemState>
  streak: number
  lastActiveDate: string | null
  dailyGoalCards: number
  dailyDoneCards: number
  dailyDoneDate: string | null
  placementJa?: { levelId: string; score: number; at: string } | null
  placementEn?: {
    certificateId: string
    score: number
    band: string
    at: string
  } | null
  proUnlocked: boolean
  achievements: string[]
  events: Array<{ t: string; type: string; payload?: Record<string, unknown> }>
  kanjiMastered: string[]
  speakingDone: number
}

export type ToeicSavedPreset = {
  name: string
  config: ToeicBuilderConfig
  savedAt: string
}

export function loadLang(): AppView {
  const hash = window.location.hash.replace('#', '').trim()
  if (hash === 'en' || hash.startsWith('toeic')) return 'en'
  if (hash === 'calculus' || hash.startsWith('calc')) return 'calculus'
  if (hash === 'physics' || hash.startsWith('phys')) return 'physics'
  if (hash === 'chemistry' || hash.startsWith('chem')) return 'chemistry'
  if (hash === 'math' || hash.startsWith('math')) return 'math'
  if (
    hash === 'ja' ||
    hash.startsWith('aoba') ||
    hash.startsWith('builder')
  ) {
    return 'ja'
  }
  // 預設進入 E-Learning 統一學習主頁 (Hub)
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
  else if (view === 'math') window.location.hash = 'math'
  else if (view === 'calculus') window.location.hash = 'calculus'
  else if (view === 'physics') window.location.hash = 'physics'
  else if (view === 'chemistry') window.location.hash = 'chemistry'
  else if (view === 'ja') window.location.hash = 'aoba'
  else window.location.hash = 'hub'
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizeNumber(
  value: unknown,
  fallback: number,
  min = 0,
  integer = false,
): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  const bounded = Math.max(min, parsed)
  return integer ? Math.floor(bounded) : bounded
}

function normalizeDateKey(value: unknown): string | null {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : null
}

function normalizeIso(value: unknown, fallback: string): string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
    ? value
    : fallback
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function normalizePayload(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined
}

const SRS_GRADES = new Set(['again', 'hard', 'good', 'easy'])

function normalizeItemState(id: string, value: unknown): ItemState {
  const raw = isRecord(value) ? value : {}
  const fallback = defaultItemState(id)
  const lastResult =
    typeof raw.lastResult === 'string' && SRS_GRADES.has(raw.lastResult)
      ? raw.lastResult
      : undefined
  const item: ItemState = {
    id: typeof raw.id === 'string' ? raw.id : id,
    ease: normalizeNumber(raw.ease, fallback.ease, 1.3),
    intervalDays: normalizeNumber(raw.intervalDays, fallback.intervalDays),
    dueAt: normalizeIso(raw.dueAt, fallback.dueAt),
    correctStreak: normalizeNumber(
      raw.correctStreak,
      fallback.correctStreak,
      0,
      true,
    ),
    seen: normalizeNumber(raw.seen, fallback.seen, 0, true),
    lapses: normalizeNumber(raw.lapses, fallback.lapses, 0, true),
  }
  if (lastResult) item.lastResult = lastResult as ItemState['lastResult']
  return item
}

function normalizeItems(value: unknown): Record<string, ItemState> {
  if (!isRecord(value)) return {}
  return Object.fromEntries(
    Object.entries(value).map(([id, item]) => [id, normalizeItemState(id, item)]),
  )
}

function normalizeEvents(value: unknown): LearningMeta['events'] {
  if (!Array.isArray(value)) return []
  return value
    .flatMap((event) => {
      if (!isRecord(event) || typeof event.type !== 'string') return []
      const t = normalizeIso(event.t, new Date().toISOString())
      const payload = normalizePayload(event.payload)
      return payload
        ? [{ t, type: event.type, payload }]
        : [{ t, type: event.type }]
    })
    .slice(-LEARNING_EVENT_LIMIT)
}

function normalizePlacementJa(value: unknown): LearningMeta['placementJa'] {
  if (!isRecord(value) || typeof value.levelId !== 'string') return null
  return {
    levelId: value.levelId,
    score: normalizeNumber(value.score, 0),
    at: normalizeIso(value.at, new Date().toISOString()),
  }
}

function normalizePlacementEn(value: unknown): LearningMeta['placementEn'] {
  if (
    !isRecord(value) ||
    typeof value.certificateId !== 'string' ||
    typeof value.band !== 'string'
  ) {
    return null
  }
  return {
    certificateId: value.certificateId,
    score: normalizeNumber(value.score, 0),
    band: value.band,
    at: normalizeIso(value.at, new Date().toISOString()),
  }
}

function todayLocalKey(d = new Date()): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function previousLocalDateKey(today: string): string | null {
  const parts = today.split('-').map(Number)
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    return null
  }
  const [year, month, day] = parts
  return todayLocalKey(new Date(year, month - 1, day - 1))
}

function nextLocalStreak(
  prevStreak: number,
  lastActiveDate: string | null,
  today: string,
): number {
  if (lastActiveDate === today) return Math.max(1, prevStreak)
  if (lastActiveDate === previousLocalDateKey(today)) {
    return Math.max(0, prevStreak) + 1
  }
  return 1
}

function normalizeLearningMeta(raw: unknown): LearningMeta {
  const data = isRecord(raw) ? raw : {}
  const fallback = defaultLearningMeta()
  return {
    items: normalizeItems(data.items),
    streak: normalizeNumber(data.streak, fallback.streak, 0, true),
    lastActiveDate: normalizeDateKey(data.lastActiveDate),
    dailyGoalCards: normalizeNumber(
      data.dailyGoalCards,
      fallback.dailyGoalCards,
      1,
      true,
    ),
    dailyDoneCards: normalizeNumber(
      data.dailyDoneCards,
      fallback.dailyDoneCards,
      0,
      true,
    ),
    dailyDoneDate: normalizeDateKey(data.dailyDoneDate),
    placementJa: normalizePlacementJa(data.placementJa),
    placementEn: normalizePlacementEn(data.placementEn),
    proUnlocked: Boolean(data.proUnlocked),
    achievements: normalizeStringArray(data.achievements),
    events: normalizeEvents(data.events),
    kanjiMastered: normalizeStringArray(data.kanjiMastered),
    speakingDone: normalizeNumber(data.speakingDone, fallback.speakingDone, 0, true),
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

export function defaultLearningMeta(): LearningMeta {
  return {
    items: {},
    streak: 0,
    lastActiveDate: null,
    dailyGoalCards: 20,
    dailyDoneCards: 0,
    dailyDoneDate: null,
    placementJa: null,
    placementEn: null,
    proUnlocked: false,
    achievements: [],
    events: [],
    kanjiMastered: [],
    speakingDone: 0,
  }
}

export function loadLearningMeta(): LearningMeta {
  if (typeof localStorage === 'undefined') return defaultLearningMeta()
  try {
    const raw = localStorage.getItem(LEARNING_META_KEY)
    if (raw) return normalizeLearningMeta(JSON.parse(raw))
  } catch {
    /* ignore */
  }
  return defaultLearningMeta()
}

export function saveLearningMeta(meta: LearningMeta): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LEARNING_META_KEY, JSON.stringify(normalizeLearningMeta(meta)))
    } catch {
      /* ignore */
    }
  }
  notifyProgressChanged()
}

export function recordActivity(cardsCompleted = 1): LearningMeta {
  const completed = normalizeNumber(cardsCompleted, 1, 0, true)
  const today = todayLocalKey()
  const meta = loadLearningMeta()
  const dailyDoneCards =
    (meta.dailyDoneDate === today ? meta.dailyDoneCards : 0) + completed
  const nextMeta: LearningMeta = {
    ...meta,
    streak: nextLocalStreak(meta.streak, meta.lastActiveDate, today),
    lastActiveDate: today,
    dailyDoneCards,
    dailyDoneDate: today,
  }
  saveLearningMeta(nextMeta)
  return nextMeta
}

export function appendLearningEvent(
  type: string,
  payload?: Record<string, unknown>,
): void {
  const meta = loadLearningMeta()
  const event =
    payload === undefined
      ? { t: new Date().toISOString(), type }
      : { t: new Date().toISOString(), type, payload }
  saveLearningMeta({
    ...meta,
    events: [...meta.events, event].slice(-LEARNING_EVENT_LIMIT),
  })
}

export type ProgressExportBundle = {
  version: 2 | 3
  exportedAt: string
  aoba: ProgressState
  kana: KanaProgress
  toeic: ToeicProgress
  math?: unknown
  physics?: unknown
  chemistry?: unknown
  lang: AppView
  meta: LearningMeta
}

/** Progress-only export. Never includes Groq API key or builder presets. */
export function exportProgressBundle(): ProgressExportBundle {
  let mathData: unknown = null
  let physicsData: unknown = null
  let chemistryData: unknown = null
  try {
    const rawM = localStorage.getItem('math_108_progress_v1')
    if (rawM) mathData = JSON.parse(rawM)
    const rawP = localStorage.getItem('physics_108_progress_v1')
    if (rawP) physicsData = JSON.parse(rawP)
    const rawC = localStorage.getItem('chemistry_108_progress_v1')
    if (rawC) chemistryData = JSON.parse(rawC)
  } catch {
    /* ignore */
  }

  return {
    version: 3,
    exportedAt: new Date().toISOString(),
    aoba: loadProgress(),
    kana: loadKanaProgress(),
    toeic: loadToeicProgress(),
    math: mathData,
    physics: physicsData,
    chemistry: chemistryData,
    lang: loadLang(),
    meta: loadLearningMeta(),
  }
}

export function importProgressBundle(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return false
  const data = raw as Record<string, unknown>
  const version = data.version
  if (version !== 1 && version !== 2 && version !== 3) return false
  if (!data.aoba || !data.kana || !data.toeic) return false

  applyCloudBundle({
    aoba: migrateProgress(data.aoba as Record<string, unknown>),
    kana: { ...defaultKanaProgress(), ...(data.kana as KanaProgress) },
    toeic: { ...defaultToeicProgress(), ...(data.toeic as ToeicProgress) },
    math: data.math,
    physics: data.physics,
    chemistry: data.chemistry,
    lang: normalizeLang(typeof data.lang === 'string' ? data.lang : null) ?? 'hub',
    meta: normalizeLearningMeta(data.meta),
  })
  notifyProgressChanged()
  return true
}

/** Apply a cloud/import bundle to localStorage without scheduling another pull. */
export function applyCloudBundle(bundle: {
  aoba: ProgressState
  kana: KanaProgress
  toeic: ToeicProgress
  math?: unknown
  physics?: unknown
  chemistry?: unknown
  lang: AppView
  meta?: LearningMeta
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
  if (bundle.math) {
    localStorage.setItem('math_108_progress_v1', JSON.stringify(bundle.math))
  }
  if (bundle.physics) {
    localStorage.setItem('physics_108_progress_v1', JSON.stringify(bundle.physics))
  }
  if (bundle.chemistry) {
    localStorage.setItem('chemistry_108_progress_v1', JSON.stringify(bundle.chemistry))
  }
  localStorage.setItem(
    LEARNING_META_KEY,
    JSON.stringify(normalizeLearningMeta(bundle.meta)),
  )
  writeLangPreference(bundle.lang)
}

/** Clear learning progress cache only — keeps Groq key and builder presets. */
export function clearLocalProgressCache() {
  localStorage.removeItem(PROGRESS_KEY)
  localStorage.removeItem(KANA_KEY)
  localStorage.removeItem(TOEIC_PROGRESS_KEY)
  localStorage.removeItem(LEARNING_META_KEY)
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
