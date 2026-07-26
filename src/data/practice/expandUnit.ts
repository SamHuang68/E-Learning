import type { SpeakableCard, UnitPractice } from '../practiceTypes'
import { getDefaultGrammar, getPracticeThemeBank } from './banks/themeBanks'

export type UnitDepthTargets = {
  vocab: number
  passage: number
  grammar: number
}

type SectionName = keyof UnitPractice
type SectionSuffix = 'v' | 'p' | 'g'

const suffixBySection: Record<SectionName, SectionSuffix> = {
  vocab: 'v',
  passage: 'p',
  grammar: 'g',
}

function nextIndex(cards: SpeakableCard[], suffix: SectionSuffix): number {
  const pattern = new RegExp(`-${suffix}(\\d+)$`)
  const maxSeen = cards.reduce((max, card) => {
    const match = pattern.exec(card.id)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)
  return maxSeen + 1
}

function passageSeed(
  key: string,
  topic: string,
  index: number,
): Omit<SpeakableCard, 'id'> {
  const bank = getPracticeThemeBank(key)
  if (bank.language === 'en') {
    return {
      head: topic,
      meaning: `${bank.title} listening passage`,
      sentence: `In this ${bank.scenario} passage, the speaker explains ${topic}, gives one key detail, and confirms the next step.`,
      sentenceZh: `在「${bank.title}」聽力短文中，說話者說明 ${topic}、提供一個重點細節，並確認下一步。`,
      scenario: bank.scenario,
      register: bank.register,
    }
  }

  const connectors = ['まず', '次に', 'そのあと', '最後に']
  return {
    head: topic,
    meaning: `${bank.title}の読解練習`,
    sentence: `${connectors[index % connectors.length]}、${topic}について短い文章を読みます。大切な語句を確認してから、自分の言葉で要点を伝えます。`,
    sentenceZh: `閱讀關於「${topic}」的短文。先確認重要詞語，再用自己的話說出重點。`,
    scenario: bank.scenario,
    register: bank.register,
  }
}

function fillSection(
  key: string,
  section: SectionName,
  cards: SpeakableCard[],
  target: number,
  seeds: Omit<SpeakableCard, 'id'>[],
): SpeakableCard[] {
  if (cards.length >= target) return [...cards]

  const suffix = suffixBySection[section]
  const prefix = key.replace(':', '-')
  const output = [...cards]
  const firstGeneratedIndex = nextIndex(cards, suffix)

  for (let i = output.length; i < target; i += 1) {
    const seed = seeds[(i - cards.length) % seeds.length]
    output.push({
      ...seed,
      id: `${prefix}-${suffix}${firstGeneratedIndex + i - cards.length}`,
    })
  }

  return output
}

export function ensureUnitDepth(
  key: string,
  pack: UnitPractice,
  targets: UnitDepthTargets,
): UnitPractice {
  const bank = getPracticeThemeBank(key)
  const passageSeeds = bank.passageTopics.map((topic, index) =>
    passageSeed(key, topic, index),
  )
  const grammarSeeds =
    bank.grammar && bank.grammar.length > 0
      ? [...bank.grammar, ...getDefaultGrammar(key, bank.scenario, bank.register)]
      : getDefaultGrammar(key, bank.scenario, bank.register)

  return {
    vocab: fillSection(key, 'vocab', pack.vocab, targets.vocab, bank.vocab),
    passage: fillSection(key, 'passage', pack.passage, targets.passage, passageSeeds),
    grammar: fillSection(key, 'grammar', pack.grammar, targets.grammar, grammarSeeds),
  }
}
