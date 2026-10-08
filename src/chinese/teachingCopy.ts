import type { UiLocale } from '../i18n/locale'
import type { TocflQuestion } from './data/tocflExam'

export type ChineseTeachingFieldRole = 'identity' | 'target' | 'support' | 'neutral'
export type ChineseTeachingCoverageGap = {
  path: string
  field: string
  source: string
  reason: 'missing-translation' | 'unclassified-field'
}

/** Exact source-string to English mappings, colocated with each lazy data module. */
export type ChineseSupportDictionary = Readonly<Record<string, string>>

export type LocalizedTocflQuestion = Omit<TocflQuestion, 'level' | 'section'> & {
  level: TocflQuestion['level'] | 'A1 (Beginner)' | 'A2 (Basic)'
  section:
    | TocflQuestion['section']
    | 'Listening comprehension'
    | 'Vocabulary and grammar'
    | 'Reading comprehension'
}

/**
 * Chinese-track English-mode field policy.
 *
 * Hanzi, Bopomofo, pinyin, spoken prompts, examples, and answer choices are the
 * language being learned and must stay unchanged. Labels, Japanese learner
 * notes, translations, hints, context names, and explanations are support copy
 * and must be English in English UI mode.
 */
export const CHINESE_FIELD_POLICY = Object.freeze({
  identity: ['id', 'correctIndex', 'point', 'tone', 'strokeCount'],
  target: [
    'zh',
    'wordZh',
    'termZh',
    'idiomZh',
    'classifierZh',
    'locationZh',
    'exampleZh',
    'exampleSentenceZh',
    'exampleContextZh',
    'promptZh',
    'promptPinyin',
    'promptBopomofo',
    'audioText',
    'char',
    'exampleChar',
    'pinyin',
    'examplePinyin',
    'bopomofo',
    'pattern',
    'formula',
    'radical',
    'strokeSequence',
    'wordA',
    'wordB',
    'wrong',
    'options',
    'cloze',
    'samplePhraseZh',
    'patternZh',
    'taiwanesePinyin',
  ],
  support: [
    'title',
    'titleZh',
    'titleJa',
    'nameZh',
    'nameJa',
    'locationJa',
    'speakerJa',
    'ja',
    'meaningJa',
    'meaningZh',
    'meaningZhInJa',
    'meaningJaInJa',
    'exampleJa',
    'exampleSentenceJa',
    'exampleTranslationJa',
    'exampleContextJa',
    'categoryJa',
    'descriptionJa',
    'cultureTipJa',
    'pitfallAlertJa',
    'originStoryJa',
    'usageSituationJa',
    'usageRuleJa',
    'signalTriggerJa',
    'threeSecondRuleJa',
    'pitchDescriptionJa',
    'tipsJa',
    'strokeRuleJa',
    'promptJa',
    'explanationJa',
    'scenarioJa',
    'confusionPointJa',
    'section',
    'level',
    'tag',
    'type',
    'katakana',
    'sceneCategory',
    'speaker',
    'explanationZh',
    'mark',
  ],
} as const)

const EAST_ASIAN = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/
const JAPANESE_KANA = /[\u3040-\u30ff]/
const ENGLISH_WORD = /[A-Za-z]{2,}/
const GENERIC_PLACEHOLDER = /^(?:english|placeholder|todo|tbd|translation|unknown)$/i
const IDENTITY_FIELDS = new Set<string>(CHINESE_FIELD_POLICY.identity)
const TARGET_FIELDS = new Set<string>(CHINESE_FIELD_POLICY.target)
const SUPPORT_FIELDS = new Set<string>(CHINESE_FIELD_POLICY.support)

const CHINESE_COPY_EN: Readonly<Record<string, string>> = {
  '🌸 台湾華語・繁体字中国語スタジオ': '🌸 Taiwan Mandarin · Traditional Chinese Studio',
  '歡迎來到臺灣華語學習空間！': 'Welcome to the Taiwan Mandarin learning studio!',
  '日本語母語者の視点に立ち、四声の音高カーブ・日中漢字の落とし穴・3秒文法直感判断・リアル台湾会話を最短ルートで完全攻略。':
    'Build practical Taiwan Mandarin through tone contours, Traditional Chinese characters, quick grammar decisions, and real-life conversations.',
  '拼音・注音與四聲聲調': 'Pinyin, Bopomofo, and the four tones',
  '五度標記法による四声の高さの可視化と有気音・そり舌音のカタカナ発音ガイド。':
    'Visualize the four tones on a five-level pitch scale and practise aspirated and retroflex sounds.',
  '進入發音實驗室 →': 'Open pronunciation lab →',
  '日中同形異義語 (偽友詞)': 'False friends in shared characters',
  '「手紙＝トイレットペーパー」「汽車＝乗用車」など日本人が必ず陥る落とし穴を撃退。':
    'Compare familiar-looking characters whose meanings differ in Taiwan Mandarin.',
  '進入偽友詞庫 →': 'Open false-friends library →',
  '3秒文法動作決策樹': 'Three-second grammar decision tree',
  '把字句・被字句・了1/了2・是…的・過など、文法シグナルからの直感秒殺ルール。':
    'Use grammar signals to choose among ba, bei, le, shi...de, guo, and related patterns.',
  '進入文法決策樹 →': 'Open grammar decision tree →',
  '實用情境會話': 'Practical scenario conversations',
  'ドリンクスタンドの甘さ・氷指定から夜市小吃、台北MRT乗車まで生きた台湾華語。':
    'Practise Taiwan Mandarin for drink orders, night markets, and Taipei MRT travel.',
  '進入情境會話 →': 'Open scenario conversations →',
  '今日成就達成': 'Today’s progress',
  'XP 累積': 'XP earned',
  '🎯 建議今日目標：完成 1 組聲調練習與 1 組偽友詞避坑！':
    '🎯 Suggested goal: complete one tone drill and one false-friend activity.',
  '拼音・注音與四聲聲調實驗室 (Pinyin, Bopomofo & Tones)': 'Pinyin, Bopomofo, and Tone Lab',
  '日本語にはない「四声の高さのカーブ」と「有気音・そり舌音・鼻母音」を完全可視化。カタカナの目安と発音ポイントで攻略！':
    'Visualize tone contours and practise aspirated, retroflex, and nasal sounds with clear articulation cues.',
  '🎵 四聲聲調曲線 (Tones)': '🎵 Tone contours',
  '🔤 聲母 21 音 (Initials)': '🔤 21 initials',
  '🌊 韻母 16 音 (Finals)': '🌊 16 finals',
  '⚡ 常用生活單字 (Drills)': '⚡ Everyday word drills',
  '五度制調值座標 (5度標記法)': 'Five-level tone chart',
  '調符：': 'Tone mark: ',
  '🔊 聽示範音': '🔊 Play example',
  '💡 日本語ネイティブ向け発音のコツ：': '💡 Pronunciation tip:',
  '📖 代表例詞：': '📖 Example word:',
  'ピンイン：': 'Pinyin: ',
  '🔊 聽發音': '🔊 Play pronunciation',
  '🔊 跟讀': '🔊 Repeat',
  'TOCFL 華語文能力測驗 A1/A2 模擬測驗': 'TOCFL A1/A2 Practice Test',
  '本測驗包含聽力理解、詞彙語法與生活閱讀 5 大題。考試時間 10 分鐘，交卷後立即產出日語弱點診斷並自動收錄錯題！':
    'Five questions cover listening, vocabulary and grammar, and everyday reading. You have 10 minutes; missed items are saved for review.',
  '🚀 開始模擬測驗 (10 分鐘)': '🚀 Start practice test (10 minutes)',
  '⏸️ 暫停': '⏸️ Pause',
  '▶️ 繼續': '▶️ Resume',
  '📝 立即交卷': '📝 Submit now',
  '🔊 聽音檔朗讀': '🔊 Play prompt',
  '● 選擇': '● Selected',
  '← 上一題': '← Previous',
  '下一題 →': 'Next →',
  '✓ 完成交卷': '✓ Finish and submit',
  'TOCFL 模擬測驗成績診斷報告': 'TOCFL Practice Test Results',
  '🏆 恭喜達到 TOCFL A2 基礎級合格標準！': '🏆 Your practice score reached the A2 reference threshold.',
  '💪 距離 A2 合格還差一點，已將錯題存入錯題本！': '💪 Keep practising. Missed items were saved to your error notebook.',
  '試題詳細批改與日語解析：': 'Question review and English explanations:',
  '✓ 正解 (+10 分)': '✓ Correct (+10 points)',
  '❌ 答錯': '❌ Incorrect',
  '未作答': 'Not answered',
  '你的作答：': 'Your answer: ',
  '正確答案：': 'Correct answer: ',
  '💡 解說：': '💡 Explanation: ',
  '🔄 重新測驗': '🔄 Try again',
}

const TOCFL_EN: Readonly<Record<string, {
  prompt: string
  options: readonly string[]
  explanation: string
}>> = {
  'tocfl-q1': {
    prompt: 'Choose the most appropriate question word for the blank: “Who bought this cup of bubble tea?”',
    options: ['Who', 'What', 'Where', 'How'],
    explanation: 'The shi...de focus construction asks who performed the action, so shéi (“who”) is correct.',
  },
  'tocfl-q2': {
    prompt: 'Choose the predicate and result complement that correctly completes the ba construction: “Please throw away the rubbish on the table.”',
    options: ['Throw away completely', 'Throw', 'Be throwing', 'Want to throw'],
    explanation: 'A ba construction normally needs a completed or bounded result. Diūdiào states “throw away,” while diū alone is incomplete here.',
  },
  'tocfl-q3': {
    prompt: 'Listen to the dialogue and choose the man’s chicken-cutlet order.',
    options: ['Cut into pieces and mildly spicy', 'Not cut and very spicy', 'Cut into pieces with no spice', 'Not cut and mildly spicy'],
    explanation: 'The man says yào qiē (cut it) and wēi là (mildly spicy), so the first option matches both details.',
  },
  'tocfl-q4': {
    prompt: 'Choose the phrase that expresses a past experience: “I have never taken Taiwan High Speed Rail before, so I want to try it this time.”',
    options: ['Have taken before', 'Took / completed', 'Be taking', 'Know how to take'],
    explanation: 'A negative past experience uses méi + verb + guo. Therefore méi dā guo means “have never taken.”',
  },
  'tocfl-q5': {
    prompt: 'Read the notice and choose the action that is allowed inside a Taipei MRT carriage.',
    options: ['Use a phone and listen to music', 'Drink bottled water', 'Chew gum', 'Eat a sandwich'],
    explanation: 'Eating and drinking, including water and chewing gum, are prohibited on the Taipei MRT. Using a phone or listening to music is allowed.',
  },
}

function fieldName(path: readonly string[]): string {
  for (let index = path.length - 1; index >= 0; index -= 1) {
    if (!/^\d+$/.test(path[index])) return path[index]
  }
  return ''
}

export function chineseFieldRole(path: readonly string[]): ChineseTeachingFieldRole {
  const key = fieldName(path)
  if (IDENTITY_FIELDS.has(key)) return 'identity'
  if (
    TARGET_FIELDS.has(key) ||
    /^(?:noun|sentence|phrase|question|answer|exampleSentence|exampleContext|prompt|location|word|term).*Zh$/.test(key)
  ) {
    return 'target'
  }
  if (
    SUPPORT_FIELDS.has(key) ||
    /(?:Ja|TipJa|RuleJa|TranslationJa|DescriptionJa)$/.test(key)
  ) {
    return 'support'
  }
  return 'neutral'
}

export function hasNonEnglishLearnerScript(text: string): boolean {
  return EAST_ASIAN.test(text)
}

function exactEnglishSupport(
  source: string,
  path: readonly string[],
  dictionary: ChineseSupportDictionary,
): string {
  const translated = dictionary[source]
  if (
    typeof translated !== 'string' ||
    !translated.trim() ||
    translated === source ||
    !ENGLISH_WORD.test(translated) ||
    JAPANESE_KANA.test(translated) ||
    GENERIC_PLACEHOLDER.test(translated.trim())
  ) {
    throw new Error(`Missing Chinese-track English translation at ${path.join('.')}: ${source}`)
  }
  return translated
}

function looksLikeTocflQuestion(value: Record<string, unknown>): value is Record<string, unknown> & TocflQuestion {
  return typeof value.id === 'string' && value.id.startsWith('tocfl-q') && Array.isArray(value.options)
}

function localizeValue(
  value: unknown,
  path: readonly string[],
  parent: Record<string, unknown> | null,
  dictionary: ChineseSupportDictionary,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) => localizeValue(item, [...path, String(index)], parent, dictionary))
  }
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>
    if (looksLikeTocflQuestion(source)) return localizeTocflQuestion(source, 'en')
    const localized: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(source)) {
      localized[key] = localizeValue(child, [...path, key], source, dictionary)
    }
    return localized
  }
  if (typeof value !== 'string' || !EAST_ASIAN.test(value)) return value

  const role = chineseFieldRole(path)
  if (role === 'identity' || role === 'target') return value
  if (role !== 'support' || !parent) {
    throw new Error(`Unclassified Chinese-track English-mode field: ${path.join('.')}`)
  }
  return exactEnglishSupport(value, path, dictionary)
}

function auditValue(
  value: unknown,
  path: readonly string[],
  parent: Record<string, unknown> | null,
  gaps: ChineseTeachingCoverageGap[],
  dictionary: ChineseSupportDictionary,
) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => auditValue(item, [...path, String(index)], parent, gaps, dictionary))
    return
  }
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>
    if (looksLikeTocflQuestion(source)) return
    for (const [key, child] of Object.entries(source)) {
      auditValue(child, [...path, key], source, gaps, dictionary)
    }
    return
  }
  if (typeof value !== 'string' || !EAST_ASIAN.test(value)) return
  const role = chineseFieldRole(path)
  const field = fieldName(path)
  if (role === 'identity' || role === 'target') return
  if (role !== 'support' || !parent) {
    gaps.push({ path: path.join('.'), field, source: value, reason: 'unclassified-field' })
    return
  }
  try {
    exactEnglishSupport(value, path, dictionary)
  } catch {
    gaps.push({ path: path.join('.'), field, source: value, reason: 'missing-translation' })
  }
}

/** Returns every unresolved English support leaf without mutating the source. */
export function auditChineseEnglishCoverage(
  value: unknown,
  dictionary: ChineseSupportDictionary,
  root = 'root',
): ChineseTeachingCoverageGap[] {
  const gaps: ChineseTeachingCoverageGap[] = []
  auditValue(value, [root], null, gaps, dictionary)
  return gaps
}

/** Strict, immutable localizer for any Chinese-track data export. */
export function localizeChineseData<T>(
  value: T,
  locale: UiLocale,
  dictionary: ChineseSupportDictionary,
): T {
  if (locale !== 'en') return value
  return localizeValue(value, [], null, dictionary) as T
}

/**
 * Exact English learner copy for the five TOCFL mock questions. The Chinese
 * prompt, Bopomofo, pinyin, audio text, answer choices, ids, and answer index
 * remain untouched.
 */
export function localizeTocflQuestion(
  question: TocflQuestion,
  locale: UiLocale,
): LocalizedTocflQuestion {
  if (locale !== 'en') return question
  const english = TOCFL_EN[question.id]
  if (!english) throw new Error(`Missing TOCFL English learner copy: ${question.id}`)
  if (english.options.length !== question.options.length) {
    throw new Error(`TOCFL English option count mismatch: ${question.id}`)
  }
  return {
    ...question,
    level: question.level.startsWith('A2') ? 'A2 (Basic)' : 'A1 (Beginner)',
    section:
      question.section.includes('Listening')
        ? 'Listening comprehension'
        : question.section.includes('Reading')
          ? 'Reading comprehension'
          : 'Vocabulary and grammar',
    promptJa: english.prompt,
    options: question.options.map((option, index) => ({
      ...option,
      ja: english.options[index],
    })),
    explanationJa: english.explanation,
  }
}

export function chineseTeachingCopy(locale: UiLocale, text: string): string {
  if (locale !== 'en') return text
  const translated = CHINESE_COPY_EN[text]
  if (translated === undefined) throw new Error(`Missing Chinese-track English teaching copy: ${text}`)
  return translated
}
