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
