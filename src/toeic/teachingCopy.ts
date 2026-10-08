import type { UnitPractice, SpeakableCard } from '../data/practiceTypes'
import type { UiLocale } from '../i18n/locale'
import type { ToeicCertificate } from './data/certificates'
import { toeicPracticeMeaningEn } from './data/practiceContent'
import type { ToeicSolvingSignal } from './data/solvingSignals'
import { resolveToeicSupportEnglish } from './data/supportEnglish'

export type ToeicInstructionLang = 'zh' | 'ja'
export type TeachingFieldRole = 'identity' | 'target' | 'support' | 'neutral'
export type TeachingCoverageGap = {
  path: string
  field: string
  source: string
  reason: 'missing-translation' | 'unclassified-field'
}

/**
 * TOEIC English-mode field policy.
 *
 * - identity: persistence and grading contract; never rewritten.
 * - target: English material the learner is studying; kept byte-for-byte.
 * - support: labels, translations, explanations, hints, and learner guidance.
 * - neutral: numbers, booleans, colors, and other non-language metadata.
 */
export const TOEIC_FIELD_POLICY = Object.freeze({
  identity: [
    'id',
    'weekId',
    'correctIndex',
    'answer',
    'scoreMin',
    'scoreMax',
    'point',
  ],
  target: [
    'head',
    'reading',
    'sentence',
    'speakText',
    'audioScript',
    'question',
    'options',
    'chunk',
    'formula',
    'subjectLine',
    'formalBody',
    'semiFormalBody',
    'exampleSentenceEn',
    'answerEn',
    'en',
    'enLead',
    'stress',
    'pattern',
    'wrong',
  ],
  support: [
    'name',
    'region',
    'features',
    'title',
    'titleJa',
    'accentLabel',
    'audience',
    'mapTitle',
    'mapDesc',
    'disclaimer',
    'meaning',
    'meaningZh',
    'meaningJa',
    'sentenceZh',
    'scenario',
    'questionJa',
    'explanationZh',
    'explanationJa',
    'triggerFeature',
    'triggerFeatureJa',
    'threeSecondRule',
    'threeSecondRuleJa',
    'pitfallWarningZh',
    'pitfallWarningJa',
    'actionSignal',
    'actionSignalJa',
    'themeTitle',
    'themeTitleJa',
    'themeSubtitle',
    'themeSubtitleJa',
    'zh',
    'ja',
    'zhLead',
    'jaLead',
    'tip',
    'note',
    'why',
    'caption',
    'reason',
    'promptZh',
    'testWeight',
    'label',
    'desc',
    'explanation',
    'signal',
  ],
} as const)

const EAST_ASIAN = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/
const IDENTITY_FIELDS = new Set<string>(TOEIC_FIELD_POLICY.identity)
const TARGET_FIELDS = new Set<string>(TOEIC_FIELD_POLICY.target)
const SUPPORT_FIELDS = new Set<string>(TOEIC_FIELD_POLICY.support)

const TOEIC_COPY_EN: Readonly<Record<string, string>> = {
  '最上層以多益四色證書分數級距分級；橘／棕級含字母與高頻字語音導讀。':
    'Certificate bands organize the TOEIC pathway by score range. Orange and brown include alphabet and high-frequency word audio guidance.',
}

const CERTIFICATE_EN: Readonly<Record<ToeicCertificate['id'], {
  audience: string
  mapTitle: string
  mapDesc: string
}>> = {
  orange: {
    audience: 'For learners with basic vocabulary who are still building longer communication and business-context skills. Start with letter sounds and high-frequency words.',
    mapTitle: 'Foundation pathway',
    mapDesc: 'Letters and sounds → high-frequency words → short listening tasks for a solid TOEIC foundation.',
  },
  green: {
    audience: 'For learners working toward common Taiwan university graduation benchmarks and entry-level workplace communication.',
    mapTitle: 'Green pathway',
    mapDesc: 'Office routines, email, and Part 5/6 grammar for graduation and early-career goals.',
  },
  blue: {
    audience: 'For learners who can manage social and routine business needs and are preparing for multinational or overseas roles.',
    mapTitle: 'Blue pathway',
    mapDesc: 'Meetings, client communication, and Part 3/4 listening for multinational workplace readiness.',
  },
  gold: {
    audience: 'For advanced learners preparing to chair meetings, negotiate across borders, and handle complex business texts fluently.',
    mapTitle: 'Gold pathway',
    mapDesc: 'Meeting leadership, negotiation language, and advanced reading and listening for near-native business performance.',
  },
}

type SignalEnglish = {
  title: string
  trigger: string
  rule: string
  explanation: string
  pitfall: string
}

const SIGNAL_EN: Readonly<Record<string, SignalEnglish>> = {
  'signal-causative': {
    title: 'Causative verbs with the base form',
    trigger: 'Look for make, have, or let followed by an object and a verb blank.',
    rule: 'When the object actively performs the action, choose the base verb, not to + verb.',
    explanation: 'Had is causative here. The assistant actively prepares the report, so the base form prepare is correct.',
    pitfall: 'When the object receives the action, use a past participle instead, as in had the car repaired.',
  },
  'signal-preposition-gerund': {
    title: 'Preposition followed by a gerund or noun',
    trigger: 'Look for a blank after a preposition such as in, on, at, by, for, without, after, or before.',
    rule: 'If the blank must take a following object, choose a gerund ending in -ing.',
    explanation: 'For is a preposition, and the following database is the object of updating, so updating is correct.',
    pitfall: 'A regular noun can follow a preposition, but use a gerund when the blank itself must take an object.',
  },
  'signal-conjunction-vs-preposition': {
    title: 'Conjunction or preposition: although versus despite',
    trigger: 'Check whether the words after the blank form a complete subject-verb clause or only a noun phrase.',
    rule: 'Use a conjunction before a subject-verb clause and a preposition before a noun phrase.',
    explanation: 'The severe weather conditions is a noun phrase with no verb. The concessive preposition despite is correct.',
    pitfall: 'Despite does not take of. Use despite or in spite of; use although before a clause.',
  },
  'signal-passive-voice': {
    title: 'Passive voice when no object follows',
    trigger: 'A transitive verb blank has no following object, or it is followed by a by-phrase.',
    rule: 'A transitive verb without its own object usually needs the passive form be + past participle.',
    explanation: 'The guidelines receive the action and will be is already present, so distributed is correct.',
    pitfall: 'Intransitive verbs such as arrive, happen, occur, and remain do not form a passive voice.',
  },
  'signal-sva-neither': {
    title: 'Subject-verb agreement with neither...nor',
    trigger: 'A verb blank follows a neither A nor B subject.',
    rule: 'Make the verb agree with the nearer noun, B.',
    explanation: 'The nearer noun intern is singular, so is is correct.',
    pitfall: 'Do not agree with the earlier plural noun managers. Either...or follows the same nearest-noun rule.',
  },
  'signal-adj-adv': {
    title: 'Part of speech: adjective or adverb',
    trigger: 'The blank modifies a verb such as worked, completed, or increased rather than a noun.',
    rule: 'Use an adverb, often ending in -ly, to modify a verb; use an adjective to modify a noun.',
    explanation: 'Completed is a verb, so it needs the adverb successfully.',
    pitfall: 'Do not choose by word family alone. First identify the word that the blank modifies.',
  },
  'signal-parallel-not-only': {
    title: 'Parallel structure with not only...but also',
    trigger: 'The two sides of not only...but also must use matching grammatical forms.',
    rule: 'Keep X and Y parallel: adjective with adjective, noun with noun, or -ing form with -ing form.',
    explanation: 'Practical is an adjective, so the parallel adjective affordable is correct.',
    pitfall: 'Do not switch to an adverb or verb on the second side. Both...and and either...or also require parallel form.',
  },
  'signal-relative-who-which': {
    title: 'Relative pronouns: who versus which',
    trigger: 'Identify whether the antecedent is a person or a thing before a relative-clause verb.',
    rule: 'Use who for a person and which for a thing. That can cover both, but not directly after a preposition.',
    explanation: 'Engineer refers to a person and the blank is the subject of designed, so who is correct.',
    pitfall: 'Do not use which for a person. Use whose for possession; whom is the formal object form.',
  },
  'signal-subjunctive-suggest': {
    title: 'Mandative subjunctive after suggest',
    trigger: 'A verb blank follows suggest, recommend, insist, or request + that.',
    rule: 'In American business English, use the base verb without -s; should may be omitted.',
    explanation: 'Suggested that takes the base form submit, not submits.',
    pitfall: 'Do not add -s to agree with team. This is the mandative subjunctive, not ordinary present-tense agreement.',
  },
  'signal-look-forward-to': {
    title: 'Prepositional to in look forward to',
    trigger: 'A verb blank follows look forward to, be used to, or object to.',
    rule: 'Here to is a preposition, so use a noun or an -ing form, not the base verb.',
    explanation: 'To is a preposition in look forward to, so meeting is correct.',
    pitfall: 'Do not treat this to as an infinitive marker. Want to, by contrast, takes the base verb.',
  },
  'signal-so-such': {
    title: 'Degree expressions: so versus such',
    trigger: 'Check whether the blank is followed by an adjective alone or by a/an + adjective + noun.',
    rule: 'Use so + adjective/adverb; use such + (a/an) + adjective + noun.',
    explanation: 'A successful launch is a noun phrase, so such is correct.',
    pitfall: 'Do not choose so merely because successful is an adjective; the full phrase includes the noun launch.',
  },
  'signal-for-since': {
    title: 'Present perfect: for versus since',
    trigger: 'A time expression follows has/have + past participle.',
    rule: 'Use for with a duration and since with a starting point such as a year, date, or then.',
    explanation: 'The year 2019 is a starting point, so since is correct.',
    pitfall: 'Do not use for before a year. For five years expresses a duration; during does not mark the starting point here.',
  },
}

function fieldName(path: readonly string[]): string {
  for (let index = path.length - 1; index >= 0; index -= 1) {
    if (!/^\d+$/.test(path[index])) return path[index]
  }
  return ''
}

export function toeicFieldRole(path: readonly string[]): TeachingFieldRole {
  const key = fieldName(path)
  if (IDENTITY_FIELDS.has(key)) return 'identity'
  if (TARGET_FIELDS.has(key)) return 'target'
  if (
    SUPPORT_FIELDS.has(key) ||
    /(?:Zh|Ja|TipsJa|Hint|Description|Subtitle)$/.test(key)
  ) {
    return 'support'
  }
  return 'neutral'
}

export function hasEastAsianScript(text: string): boolean {
  return EAST_ASIAN.test(text)
}

function cleanEnglishIdentifier(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const cleaned = value
    .replace(/[_-]+/g, ' ')
    .replace(/\b(?:toeic|signal|scenario)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned || EAST_ASIAN.test(cleaned)) return null
  return cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function objectLabel(parent: Record<string, unknown>, key: string): string {
  const candidates = [
    parent.titleEn,
    parent.nameEn,
    parent.head,
    parent.chunk,
    parent.question,
    parent.id,
    key,
  ]
  for (const candidate of candidates) {
    const cleaned = cleanEnglishIdentifier(candidate)
    if (cleaned) return cleaned
  }
  return 'TOEIC practice'
}

function pairedEnglish(parent: Record<string, unknown>, key: string): string | null {
  const pairedKey = key === 'zh' || key === 'ja'
    ? 'en'
    : key.endsWith('Zh') || key.endsWith('Ja')
      ? `${key.slice(0, -2)}En`
      : key === 'zhLead' || key === 'jaLead'
        ? 'enLead'
        : `${key}En`
  if (!pairedKey) return null
  const candidate = parent[pairedKey]
  return typeof candidate === 'string' && candidate.trim() && !EAST_ASIAN.test(candidate)
    ? candidate
    : null
}

function accentLabel(code: unknown): string {
  switch (code) {
    case 'en-GB': return 'British English accent'
    case 'en-AU': return 'Australian English accent'
    case 'en-CA': return 'Canadian English accent'
    default: return 'American English accent'
  }
}

function correctAnswer(parent: Record<string, unknown>): string | null {
  if (!Array.isArray(parent.options) || typeof parent.correctIndex !== 'number') return null
  const answer = parent.options[parent.correctIndex]
  return typeof answer === 'string' && !EAST_ASIAN.test(answer) ? answer : null
}

function isToeicCertificate(value: Record<string, unknown>): value is Record<string, unknown> & ToeicCertificate {
  return (
    typeof value.id === 'string' &&
    Object.hasOwn(CERTIFICATE_EN, value.id) &&
    typeof value.nameEn === 'string' &&
    Array.isArray(value.units)
  )
}

function isSpeakableCard(value: Record<string, unknown>): value is Record<string, unknown> & SpeakableCard {
  return (
    typeof value.id === 'string' &&
    typeof value.head === 'string' &&
    typeof value.sentence === 'string' &&
    typeof value.meaning === 'string' &&
    typeof value.scenario === 'string'
  )
}

function isUnitPractice(value: Record<string, unknown>): value is Record<string, unknown> & UnitPractice {
  return Array.isArray(value.vocab) && Array.isArray(value.passage) && Array.isArray(value.grammar)
}

function isToeicSignal(value: Record<string, unknown>): value is Record<string, unknown> & ToeicSolvingSignal {
  return typeof value.id === 'string' && Object.hasOwn(SIGNAL_EN, value.id) && typeof value.formula === 'string'
}

function exactCertificate(certificate: ToeicCertificate): ToeicCertificate {
  const english = CERTIFICATE_EN[certificate.id]
  return {
    ...certificate,
    name: certificate.nameEn,
    audience: english.audience,
    mapTitle: english.mapTitle,
    mapDesc: english.mapDesc,
    disclaimer: certificate.disclaimerEn,
    units: certificate.units.map((unit) => ({ ...unit, title: unit.titleEn })),
  }
}

function exactCard(card: SpeakableCard): SpeakableCard {
  const meaning = toeicPracticeMeaningEn[card.id]
  if (!meaning) throw new Error(`Missing TOEIC practice English gloss: ${card.id}`)
  return {
    ...card,
    meaning,
    sentenceZh: card.sentence,
  }
}

function exactPractice(pack: UnitPractice): UnitPractice {
  return {
    vocab: pack.vocab.map(exactCard),
    passage: pack.passage.map(exactCard),
    grammar: pack.grammar.map(exactCard),
  }
}

function exactSignal(signal: ToeicSolvingSignal): ToeicSolvingSignal {
  const english = SIGNAL_EN[signal.id]
  if (!english) throw new Error(`Missing TOEIC signal English copy: ${signal.id}`)
  return {
    ...signal,
    title: english.title,
    titleJa: english.title,
    triggerFeature: english.trigger,
    triggerFeatureJa: english.trigger,
    threeSecondRule: english.rule,
    threeSecondRuleJa: english.rule,
    exampleQuestion: {
      ...signal.exampleQuestion,
      explanationZh: english.explanation,
      explanationJa: english.explanation,
    },
    pitfallWarningZh: english.pitfall,
    pitfallWarningJa: english.pitfall,
  }
}

function englishSupport(
  key: string,
  parent: Record<string, unknown>,
): string {
  const paired = pairedEnglish(parent, key)
  if (paired) return paired

  const exact = resolveToeicSupportEnglish(key, parent)
  if (exact) return exact

  const label = objectLabel(parent, key)
  if (key === 'name' && typeof parent.nameEn === 'string') return parent.nameEn
  if (key === 'title' && typeof parent.titleEn === 'string') return parent.titleEn
  if (key === 'disclaimer' && typeof parent.disclaimerEn === 'string') return parent.disclaimerEn
  if (key === 'accentLabel') return accentLabel(parent.targetAccent)
  if (key === 'questionJa' && typeof parent.question === 'string') return parent.question
  if (key === 'region' && typeof parent.code === 'string') return accentLabel(parent.code)
  const answer = correctAnswer(parent)
  throw new Error(
    `Missing TOEIC English translation for ${key} (${answer ?? label})`,
  )
}

function localizeValue(
  value: unknown,
  path: readonly string[],
  parent: Record<string, unknown> | null,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) => localizeValue(item, [...path, String(index)], parent))
  }
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>
    if (isToeicCertificate(source)) return exactCertificate(source)
    if (isUnitPractice(source)) return exactPractice(source)
    if (isSpeakableCard(source)) return exactCard(source)
    if (isToeicSignal(source)) return exactSignal(source)
    const localized: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(source)) {
      localized[key] = localizeValue(child, [...path, key], source)
    }
    return localized
  }
  if (typeof value !== 'string' || !EAST_ASIAN.test(value)) return value

  const role = toeicFieldRole(path)
  if (role === 'identity' || role === 'target') return value
  if (role !== 'support' || !parent) {
    throw new Error(`Unclassified TOEIC English-mode field: ${path.join('.')}`)
  }
  const translated = englishSupport(fieldName(path), parent)
  if (!translated.trim() || EAST_ASIAN.test(translated)) {
    throw new Error(`Invalid TOEIC English support at ${path.join('.')}`)
  }
  return translated
}

function auditValue(
  value: unknown,
  path: readonly string[],
  parent: Record<string, unknown> | null,
  gaps: TeachingCoverageGap[],
) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => auditValue(item, [...path, String(index)], parent, gaps))
    return
  }
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>
    if (
      isToeicCertificate(source) ||
      isUnitPractice(source) ||
      isSpeakableCard(source) ||
      isToeicSignal(source)
    ) {
      return
    }
    for (const [key, child] of Object.entries(source)) {
      auditValue(child, [...path, key], source, gaps)
    }
    return
  }
  if (typeof value !== 'string' || !EAST_ASIAN.test(value)) return
  const role = toeicFieldRole(path)
  const field = fieldName(path)
  if (role === 'identity' || role === 'target') return
  if (role !== 'support' || !parent) {
    gaps.push({ path: path.join('.'), field, source: value, reason: 'unclassified-field' })
    return
  }
  try {
    englishSupport(field, parent)
  } catch {
    gaps.push({ path: path.join('.'), field, source: value, reason: 'missing-translation' })
  }
}

/** Returns every unresolved English support leaf without mutating the source. */
export function auditToeicEnglishCoverage(value: unknown, root = 'root'): TeachingCoverageGap[] {
  const gaps: TeachingCoverageGap[] = []
  auditValue(value, [root], null, gaps)
  return gaps
}

/**
 * Strict, immutable localizer for any TOEIC data export. English UI mode always
 * produces English learner support, even when the saved instruction preference
 * is Japanese. Outside English UI mode, the selected instruction track remains
 * unchanged so consumers can choose the source Japanese fields when available.
 */
export function localizeToeicData<T>(
  value: T,
  locale: UiLocale,
  instructionLang: ToeicInstructionLang = 'zh',
): T {
  if (toeicSupportLang(locale, instructionLang) !== 'en') return value
  return localizeValue(value, [], null) as T
}

/** English UI always uses English learner support; Japanese is opt-in elsewhere. */
export function toeicSupportLang(
  locale: UiLocale,
  instructionLang: ToeicInstructionLang = 'zh',
): 'en' | 'zh' | 'ja' {
  if (locale === 'en') return 'en'
  return instructionLang === 'ja' ? 'ja' : 'zh'
}

export function localizeToeicCertificate(
  certificate: ToeicCertificate,
  locale: UiLocale,
): ToeicCertificate {
  return locale === 'en' ? exactCertificate(certificate) : certificate
}

export function localizeToeicPractice(
  pack: UnitPractice | null,
  locale: UiLocale,
): UnitPractice | null {
  if (!pack || locale !== 'en') return pack
  return exactPractice(pack)
}

export function localizeToeicCard(card: SpeakableCard, locale: UiLocale): SpeakableCard {
  return locale === 'en' ? exactCard(card) : card
}

export function localizeToeicSignal(
  signal: ToeicSolvingSignal,
  locale: UiLocale,
  instructionLang: ToeicInstructionLang = 'zh',
): ToeicSolvingSignal {
  return toeicSupportLang(locale, instructionLang) === 'en' ? exactSignal(signal) : signal
}

export function toeicTeachingCopy(locale: UiLocale, text: string): string {
  if (locale !== 'en') return text
  const translated = TOEIC_COPY_EN[text]
  if (translated === undefined) throw new Error(`Missing TOEIC English teaching copy: ${text}`)
  return translated
}
