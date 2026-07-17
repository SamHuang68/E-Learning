import {
  REGISTER_LABELS,
  type PracticeRegister,
  type SpeakableCard,
  type UnitPractice,
} from '../data/practiceTypes'

export type ExerciseKind =
  | 'recognize'
  | 'meaningToHead'
  | 'listenSelect'
  | 'fillBlank'
  | 'orderWords'
  | 'registerPick'
  | 'passageQuiz'

export type Exercise = {
  id: string
  kind: ExerciseKind
  card: SpeakableCard
  prompt: string
  promptZh?: string
  choices?: string[]
  answer: string
  lang: 'ja' | 'en'
  speakText?: string
  tags?: string[]
}

export type UnitPracticeKind = 'vocab' | 'reading' | 'listening' | 'grammar'

const DEFAULT_KINDS: ExerciseKind[] = [
  'recognize',
  'meaningToHead',
  'listenSelect',
  'fillBlank',
  'orderWords',
  'registerPick',
  'passageQuiz',
]

const UNIT_KIND_EXERCISES: Record<UnitPracticeKind, ExerciseKind[]> = {
  vocab: ['recognize', 'meaningToHead', 'fillBlank', 'orderWords'],
  reading: ['passageQuiz', 'listenSelect', 'orderWords'],
  listening: ['listenSelect', 'recognize', 'fillBlank'],
  grammar: ['registerPick', 'fillBlank', 'meaningToHead'],
}

const REGISTERS: PracticeRegister[] = [
  'casual',
  'polite',
  'sonkeigo',
  'kenjougo',
  'business',
]

export function cardsToExercises(
  cards: SpeakableCard[],
  lang: 'ja' | 'en',
  pool: SpeakableCard[],
  kinds: ExerciseKind[] = DEFAULT_KINDS,
): Exercise[] {
  const exerciseKinds = kinds.length > 0 ? kinds : DEFAULT_KINDS
  const choicePool = uniqueCards([...cards, ...pool])

  return cards.flatMap((card, cardIndex) => {
    const selectedKinds = uniqueValues([
      exerciseKinds[cardIndex % exerciseKinds.length],
      exerciseKinds[(cardIndex + 1) % exerciseKinds.length],
    ])
    const exercises = selectedKinds.reduce<Exercise[]>((items, kind, slot) => {
      const exercise =
        buildExercise(kind, card, lang, choicePool, cardIndex, slot) ??
        (kind === 'orderWords'
          ? buildExercise('recognize', card, lang, choicePool, cardIndex, slot)
          : null)

      if (
        exercise &&
        !items.some(
          (item) => item.kind === exercise.kind && item.card.id === card.id,
        )
      ) {
        items.push(exercise)
      }

      return items
    }, [])

    if (exercises.length > 0) return exercises.slice(0, 2)

    const fallback = buildExercise(
      'recognize',
      card,
      lang,
      choicePool,
      cardIndex,
      0,
    )
    return fallback ? [fallback] : []
  })
}

export function sessionFromUnitPractice(
  pack: UnitPractice | null | undefined,
  kind: UnitPracticeKind,
  lang: 'ja' | 'en',
): Exercise[] {
  if (!pack) return []

  const cards = cardsForUnitKind(pack, kind)
  const pool = uniqueCards([...pack.vocab, ...pack.passage, ...pack.grammar])
  return cardsToExercises(cards, lang, pool, UNIT_KIND_EXERCISES[kind])
}

export function gradeAnswer(ex: Exercise, userAnswer: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(ex.answer)
}

export function normalizeAnswer(s: string): string {
  return s
    .normalize('NFKC')
    .toLocaleLowerCase()
    .trim()
    .replace(/[\p{P}\p{S}]/gu, ' ')
    .replace(/\s+/g, ' ')
}

function cardsForUnitKind(
  pack: UnitPractice,
  kind: UnitPracticeKind,
): SpeakableCard[] {
  if (kind === 'vocab') return pack.vocab
  if (kind === 'grammar') return pack.grammar
  return pack.passage
}

function buildExercise(
  kind: ExerciseKind,
  card: SpeakableCard,
  lang: 'ja' | 'en',
  pool: SpeakableCard[],
  cardIndex: number,
  slot: number,
): Exercise | null {
  const base = {
    id: `${card.id}:${kind}:${cardIndex}:${slot}`,
    kind,
    card,
    lang,
    speakText: card.speakText ?? card.sentence,
    tags: [kind, card.register, card.scenario].filter(Boolean),
  }

  if (kind === 'recognize') {
    return {
      ...base,
      prompt: card.head,
      promptZh: card.sentenceZh,
      choices: choicesFromPool(pool, card.meaning, 'meaning', base.id),
      answer: card.meaning,
      speakText: card.speakText ?? card.head,
    }
  }

  if (kind === 'meaningToHead') {
    return {
      ...base,
      prompt: card.meaning,
      promptZh: card.sentenceZh,
      choices: choicesFromPool(pool, card.head, 'head', base.id),
      answer: card.head,
      speakText: card.speakText ?? card.sentence,
    }
  }

  if (kind === 'listenSelect') {
    return {
      ...base,
      prompt:
        lang === 'ja'
          ? '音声を聞いて、意味を選んでください。'
          : 'Listen and choose the meaning.',
      promptZh: card.sentenceZh,
      choices: choicesFromPool(pool, card.meaning, 'meaning', base.id),
      answer: card.meaning,
      speakText: card.speakText ?? card.sentence ?? card.head,
    }
  }

  if (kind === 'fillBlank') {
    const prompt = blankFirstHead(card, lang)
    if (!prompt) return null

    return {
      ...base,
      prompt,
      promptZh: card.sentenceZh,
      answer: card.head,
      speakText: card.speakText ?? card.sentence,
    }
  }

  if (kind === 'orderWords') {
    const tokens = sentenceTokens(card, lang)
    if (tokens.length < 2) return null

    return {
      ...base,
      prompt: card.meaning,
      promptZh: card.sentenceZh,
      choices: deterministicShuffle(tokens, base.id),
      answer: tokens.join(' '),
      speakText: card.speakText ?? card.sentence,
    }
  }

  if (kind === 'registerPick') {
    const answer = REGISTER_LABELS[card.register][lang]
    return {
      ...base,
      prompt:
        lang === 'ja'
          ? `場面「${card.scenario}」に合うレジスターを選んでください。`
          : `Choose the register for this scenario: ${card.scenario}.`,
      promptZh: card.sentenceZh,
      choices: REGISTERS.map((register) => REGISTER_LABELS[register][lang]),
      answer,
    }
  }

  return {
    ...base,
    prompt: card.sentence,
    promptZh: card.sentenceZh,
    choices: choicesFromPool(pool, card.meaning, 'meaning', base.id),
    answer: card.meaning,
    speakText: card.speakText ?? card.sentence,
  }
}

function choicesFromPool(
  pool: SpeakableCard[],
  answer: string,
  field: 'meaning' | 'head',
  seed: string,
): string[] {
  const distractors = uniqueValues(
    pool
      .map((card) => card[field].trim())
      .filter((value) => value && normalizeAnswer(value) !== normalizeAnswer(answer)),
  )

  return deterministicShuffle(
    uniqueValues([
      answer,
      ...deterministicShuffle(distractors, `${seed}:distractors`).slice(0, 3),
    ]),
    `${seed}:choices`,
  )
}

function blankFirstHead(card: SpeakableCard, lang: 'ja' | 'en'): string | null {
  const sentence = card.sentence
  const head = card.head.trim()
  if (!sentence.trim() || !head) return null

  const sentenceForSearch = lang === 'en' ? sentence.toLocaleLowerCase() : sentence
  const headForSearch = lang === 'en' ? head.toLocaleLowerCase() : head
  const index = sentenceForSearch.indexOf(headForSearch)

  if (index < 0) return null
  return `${sentence.slice(0, index)}____${sentence.slice(index + head.length)}`
}

function sentenceTokens(card: SpeakableCard, lang: 'ja' | 'en'): string[] {
  const sentence = card.sentence.trim()
  if (!sentence) return []
  if (/\s/.test(sentence)) return sentence.split(/\s+/).filter(Boolean)
  if (lang === 'en') return sentence.split(/\s+/).filter(Boolean)

  const head = card.head.trim()
  if (head && sentence.includes(head)) {
    const index = sentence.indexOf(head)
    return [
      ...splitJapaneseChunk(sentence.slice(0, index)),
      head,
      ...splitJapaneseChunk(sentence.slice(index + head.length)),
    ].filter(Boolean)
  }

  const sentenceChunks = splitJapaneseChunk(sentence)
  return sentenceChunks.length > 1 ? sentenceChunks : []
}

function splitJapaneseChunk(chunk: string): string[] {
  return (
    chunk
      .match(/[^、。！？!?\s]+[、。！？!?]?/g)
      ?.map((part) => part.trim())
      .filter(Boolean) ?? []
  )
}

function deterministicShuffle<T>(items: T[], seed: string): T[] {
  return [...items]
    .map((item, index) => ({
      item,
      rank: hashString(`${seed}:${index}:${String(item)}`),
    }))
    .sort((a, b) => a.rank - b.rank)
    .map(({ item }) => item)
}

function uniqueCards(cards: SpeakableCard[]): SpeakableCard[] {
  const seen = new Set<string>()
  return cards.filter((card) => {
    if (seen.has(card.id)) return false
    seen.add(card.id)
    return true
  })
}

function uniqueValues<T>(values: T[]): T[] {
  return [...new Set(values)]
}

function hashString(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return hash
}
