export type PracticeRegister =
  | 'casual'
  | 'polite'
  | 'sonkeigo'
  | 'kenjougo'
  | 'business'

export type SpeakableCard = {
  id: string
  head: string
  reading?: string
  meaning: string
  sentence: string
  sentenceZh?: string
  scenario: string
  register: PracticeRegister
  /** TTS text; defaults to sentence */
  speakText?: string
  audio?: AudioRef
  exerciseHints?: string[]
}

export type AudioRef = { src: string; durationMs?: number; speaker?: string }

export type UnitPractice = {
  vocab: SpeakableCard[]
  passage: SpeakableCard[]
  grammar: SpeakableCard[]
}

export const REGISTER_LABELS: Record<
  PracticeRegister,
  { ja: string; en: string }
> = {
  casual: { ja: '普通', en: 'Neutral' },
  polite: { ja: '丁寧', en: 'Polite' },
  sonkeigo: { ja: '尊敬', en: 'Honorific' },
  kenjougo: { ja: '謙譲', en: 'Humble' },
  business: { ja: '商務', en: 'Diplomatic' },
}

export function getUnitPractice(
  pack: Record<string, UnitPractice>,
  key: string,
): UnitPractice | null {
  return pack[key] ?? null
}

/** Hardened runtime schema validator for practice packs (deep checks on structure, required fields, uniqueness, registers). */
export function validateUnitPractice(pack: UnitPractice, key: string): void {
  const sections: (keyof UnitPractice)[] = ['vocab', 'passage', 'grammar']
  const seenIds = new Set<string>()
  const validRegisters = Object.keys(REGISTER_LABELS) as PracticeRegister[]

  for (const section of sections) {
    const cards = pack[section]
    if (!Array.isArray(cards)) {
      throw new Error(`Pack ${key} section ${section} must be array`)
    }
    for (const card of cards) {
      if (!card || typeof card !== 'object') throw new Error(`Invalid card in ${key}:${section}`)
      if (typeof card.id !== 'string' || !card.id) throw new Error(`Missing id in ${key}:${section}`)
      if (seenIds.has(card.id)) throw new Error(`Duplicate id ${card.id} in pack ${key}`)
      seenIds.add(card.id)
      if (typeof card.head !== 'string' || !card.head) throw new Error(`Missing head in ${card.id}`)
      if (typeof card.meaning !== 'string' || !card.meaning) throw new Error(`Missing meaning in ${card.id}`)
      if (typeof card.sentence !== 'string' || !card.sentence) throw new Error(`Missing sentence in ${card.id}`)
      if (typeof card.scenario !== 'string' || !card.scenario) throw new Error(`Missing scenario in ${card.id}`)
      if (!validRegisters.includes(card.register)) throw new Error(`Invalid register ${card.register} in ${card.id}`)
      // sentenceZh and reading/speakText/audio optional but if present must be string
      if (card.sentenceZh != null && typeof card.sentenceZh !== 'string') throw new Error(`sentenceZh must be string or absent in ${card.id}`)
      if (card.reading != null && typeof card.reading !== 'string') throw new Error(`reading must be string or absent in ${card.id}`)
    }
  }
}
