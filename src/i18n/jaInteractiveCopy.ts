import { jaMockQuestions, type MockQuestion } from '../data/mock/ja'
import { jaPlacementQuestions } from '../data/placement/ja'
import { jaScenarios, type ScenarioScript } from '../data/scenarios'
import type { PlacementQuestion } from '../engine/placement'
import type { UiLocale } from './locale'

type ScenarioEnglishCopy = {
  title: string
  scene: string
  beats: ReadonlyArray<{
    prompt: string
    registers: readonly string[]
  }>
}

type QuestionEnglishCopy = {
  prompt: string
  choices: readonly string[]
  answer: string
}

export const JA_SCENARIO_EN: Readonly<Record<string, ScenarioEnglishCopy>> = {
  'ja-shop': {
    title: 'Shop Clerk: Asking About a Return',
    scene: 'You are at a stationery store and want to ask whether you can return or exchange an item.',
    beats: [
      {
        prompt: 'Start by addressing the shop clerk.',
        registers: ['polite', 'neutral', 'commanding'],
      },
      {
        prompt: 'The clerk asks you to explain the reason.',
        registers: ['polite', 'brusque', 'blunt'],
      },
      {
        prompt: 'Finally, express your thanks.',
        registers: ['polite', 'cold', 'rude'],
      },
    ],
  },
  'ja-coworker': {
    title: 'Coworker: Coordinating the Timeline',
    scene: 'You and a coworker are discussing when a report will be delivered.',
    beats: [
      {
        prompt: 'Your coworker asks whether you can finish it today.',
        registers: ['polite', 'too terse', 'shifts responsibility'],
      },
      {
        prompt: 'Offer an alternative.',
        registers: ['polite', 'vague', 'presumptive'],
      },
      {
        prompt: 'Ask your coworker to confirm the plan.',
        registers: ['polite', 'commanding', 'pressuring'],
      },
    ],
  },
  'ja-manager': {
    title: 'Manager: Progress Update',
    scene: 'You are reporting project progress and risks to your manager.',
    beats: [
      {
        prompt: 'Your manager asks for the current status.',
        registers: ['humble', 'plain', 'rude'],
      },
      {
        prompt: 'You need to report a risk of delay.',
        registers: ['professional', 'vague', 'blame-shifting'],
      },
      {
        prompt: 'Propose a mitigation plan.',
        registers: ['humble', 'vague', 'dismissive'],
      },
    ],
  },
  'ja-client': {
    title: 'Client: Confirming Requirements',
    scene: 'You are on the phone with a client to confirm requested changes.',
    beats: [
      {
        prompt: 'The client makes a new request. Respond first.',
        registers: ['humble', 'blunt refusal', 'flippant'],
      },
      {
        prompt: 'You need to confirm how the request will affect the delivery date.',
        registers: ['professional', 'vague', 'unilateral'],
      },
      {
        prompt: 'Close the conversation before ending the call.',
        registers: ['professional', 'too casual', 'impatient'],
      },
    ],
  },
}

export const JA_MOCK_QUESTION_EN: Readonly<Record<string, QuestionEnglishCopy>> = {
  'ja-m-01': {
    prompt: '「切符」は何ですか。',
    choices: ['ticket', 'umbrella', 'chair', 'pencil'],
    answer: 'ticket',
  },
  'ja-m-02': {
    prompt: '「駅 ___ 会いましょう。」',
    choices: ['で', 'を', 'が', 'から'],
    answer: 'で',
  },
  'ja-m-03': {
    prompt: '「明日は休みです。だから、映画を見ます。」正しい説明は？',
    choices: ['明日映画を見る', '今日映画を見た', '明日仕事に行く', '映画館は休み'],
    answer: '明日映画を見る',
  },
  'ja-m-04': {
    prompt: '「忙しい」の読みは？',
    choices: ['いそがしい', 'たのしい', 'やさしい', 'むずかしい'],
    answer: 'いそがしい',
  },
  'ja-m-05': {
    prompt: '「もう昼ご飯を ___ 。」',
    choices: ['食べました', '食べますでした', '食べるました', '食べてますでした'],
    answer: '食べました',
  },
  'ja-m-06': {
    prompt: '「この図書館は静かですが、駅から遠いです。」図書館について正しいのは？',
    choices: ['静かだが遠い', 'うるさいが近い', '駅の中にある', '新しくない'],
    answer: '静かだが遠い',
  },
  'ja-m-07': {
    prompt: '「会議」は何ですか。',
    choices: ['meeting', 'shopping', 'travel', 'breakfast'],
    answer: 'meeting',
  },
  'ja-m-08': {
    prompt: '「友だち ___ プレゼントをもらいました。」',
    choices: ['に', 'を', 'で', 'へ'],
    answer: 'に',
  },
  'ja-m-09': {
    prompt: '「雨が降りそうです。傘を持って行ってください。」何をすすめていますか。',
    choices: ['傘を持つ', '傘を買わない', '外に出ない', '駅で待つ'],
    answer: '傘を持つ',
  },
  'ja-m-10': {
    prompt: '「予約」の意味は？',
    choices: ['reservation', 'cancellation', 'payment', 'explanation'],
    answer: 'reservation',
  },
  'ja-m-11': {
    prompt: '「資料を見せて ___ 。」もっと丁寧な依頼は？',
    choices: ['いただけますか', 'やる', 'だめ', 'おく'],
    answer: 'いただけますか',
  },
  'ja-m-12': {
    prompt: '「締め切りは金曜日です。遅れる場合は連絡してください。」いつまでですか。',
    choices: ['金曜日', '月曜日', '今日', '来月'],
    answer: '金曜日',
  },
}

export const JA_PLACEMENT_QUESTION_EN: Readonly<Record<string, QuestionEnglishCopy>> = {
  'ja-p-01': {
    prompt: '「ありがとう」のいみは？',
    choices: ['Thank you', 'Good morning', 'Goodbye', "I'm sorry"],
    answer: 'Thank you',
  },
  'ja-p-02': {
    prompt: 'Which particle should fill the blank in 「わたし ___ リンです。」?',
    choices: ['は', 'を', 'へ', 'で'],
    answer: 'は',
  },
  'ja-p-03': {
    prompt: 'What is the most common reading of 「本」?',
    choices: ['ほん', 'ひと', 'みず', 'やま'],
    answer: 'ほん',
  },
  'ja-p-04': {
    prompt: 'What is the speaker asking in 「いま なんじですか。」?',
    choices: ['What time is it now?', 'Where are you going?', 'How much is it?', 'What is your name?'],
    answer: 'What time is it now?',
  },
  'ja-p-05': {
    prompt: 'What does 「きのう」 mean?',
    choices: ['Yesterday', 'Tomorrow', 'Today', 'Every week'],
    answer: 'Yesterday',
  },
  'ja-p-06': {
    prompt: 'Which particle should fill the blank in 「コーヒー ___ 飲みます。」?',
    choices: ['を', 'に', 'が', 'と'],
    answer: 'を',
  },
  'ja-p-07': {
    prompt: 'Which meaning is closest to 「駅まで歩いて行きます。」?',
    choices: ['Walk to the station', 'Buy a ticket at the station', 'Return from the station', 'Take public transport to school'],
    answer: 'Walk to the station',
  },
  'ja-p-08': {
    prompt: 'When 「高い」 means "expensive," what is its antonym?',
    choices: ['安い', '広い', '新しい', '長い'],
    answer: '安い',
  },
  'ja-p-09': {
    prompt: 'Which particle should fill the blank in 「この店は静か ___ きれいです。」?',
    choices: ['で', 'を', 'より', 'まで'],
    answer: 'で',
  },
  'ja-p-10': {
    prompt: 'What does 「先生に聞いてください。」 mean?',
    choices: ['Please ask the teacher', 'The teacher is listening', 'Do not ask the teacher', 'I asked the teacher'],
    answer: 'Please ask the teacher',
  },
  'ja-p-11': {
    prompt: 'What does 「食べたことがあります」 mean?',
    choices: ['Have eaten it before', 'Be eating now', 'Cannot eat', 'Want to eat'],
    answer: 'Have eaten it before',
  },
  'ja-p-12': {
    prompt: 'What does 「もし雨なら、試合は中止です。」 mean?',
    choices: ['If it rains, the game will be canceled', 'The game starts after it rains', 'The game will definitely be canceled', 'Go home when the rain stops'],
    answer: 'If it rains, the game will be canceled',
  },
  'ja-p-13': {
    prompt: 'In 「資料を拝見します。」, what type of language is 「拝見」?',
    choices: ['Humble language', 'Honorific language', 'Plain form', 'Imperative form'],
    answer: 'Humble language',
  },
  'ja-p-14': {
    prompt: 'In what setting is 「この件につきまして」 commonly used?',
    choices: ['Business correspondence', 'Children’s games', 'Family forms of address', 'Restaurant menus'],
    answer: 'Business correspondence',
  },
  'ja-p-15': {
    prompt: 'What is the closest meaning of 「にもかかわらず」?',
    choices: ['Despite that', 'Therefore', 'In order to', 'While doing'],
    answer: 'Despite that',
  },
  'ja-p-16': {
    prompt: 'What style does 「経済の回復には時間を要する。」 use?',
    choices: ['Formal written style', 'Casual speech with someone close', 'Child-directed speech', 'Imperative tone'],
    answer: 'Formal written style',
  },
  'ja-p-17': {
    prompt: 'Which form of 「来る」 is 「お越しになる」?',
    choices: ['Honorific language', 'Humble language', 'Potential form', 'Passive form'],
    answer: 'Honorific language',
  },
  'ja-p-18': {
    prompt: 'What is the closest meaning of 「〜に先立って」?',
    choices: ['Prior to ...', 'Instead of ...', 'Regarding ...', 'Because ...'],
    answer: 'Prior to ...',
  },
}

function copyFor<T>(copies: Readonly<Record<string, T>>, id: string, area: string): T {
  if (!Object.hasOwn(copies, id)) throw new Error(`缺少${area}英文支援翻譯：${id}`)
  return copies[id]
}

function assertQuestionContract(
  source: MockQuestion | PlacementQuestion,
  copy: QuestionEnglishCopy,
  area: string,
) {
  if (copy.choices.length !== source.choices.length) {
    throw new Error(`${area}選項數量不一致：${source.id}`)
  }
  const sourceAnswerIndex = source.choices.indexOf(source.answer)
  const localizedAnswerIndex = copy.choices.indexOf(copy.answer)
  if (sourceAnswerIndex < 0 || localizedAnswerIndex !== sourceAnswerIndex) {
    throw new Error(`${area}答案位置不一致：${source.id}`)
  }
}

function localizeQuestion<T extends MockQuestion | PlacementQuestion>(
  source: T,
  copies: Readonly<Record<string, QuestionEnglishCopy>>,
  area: string,
): T {
  const copy = copyFor(copies, source.id, area)
  assertQuestionContract(source, copy, area)
  return {
    ...source,
    prompt: copy.prompt,
    choices: [...copy.choices],
    answer: copy.answer,
  }
}

export function localizeJaScenarios(
  locale: UiLocale,
  source: ScenarioScript[] = jaScenarios,
): ScenarioScript[] {
  if (locale !== 'en') return source
  return source.map((scenario) => {
    const copy = copyFor(JA_SCENARIO_EN, scenario.id, '日語情境')
    if (copy.beats.length !== scenario.beats.length) {
      throw new Error(`日語情境步驟數量不一致：${scenario.id}`)
    }
    return {
      ...scenario,
      title: copy.title,
      scene: copy.scene,
      beats: scenario.beats.map((beat, beatIndex) => {
        const beatCopy = copy.beats[beatIndex]
        if (beatCopy.registers.length !== beat.options.length) {
          throw new Error(`日語情境選項數量不一致：${scenario.id}#${beatIndex + 1}`)
        }
        return {
          ...beat,
          prompt: beatCopy.prompt,
          options: beat.options.map((option, optionIndex) => ({
            ...option,
            register: beatCopy.registers[optionIndex],
          })),
        }
      }),
    }
  })
}

export function localizeJaMockQuestions(
  locale: UiLocale,
  source: MockQuestion[] = jaMockQuestions,
): MockQuestion[] {
  if (locale !== 'en') return source
  return source.map((question) => localizeQuestion(question, JA_MOCK_QUESTION_EN, '日語模擬試題'))
}

export function localizeJaPlacementQuestions(
  locale: UiLocale,
  source: PlacementQuestion[] = jaPlacementQuestions,
): PlacementQuestion[] {
  if (locale !== 'en') return source
  return source.map((question) => localizeQuestion(question, JA_PLACEMENT_QUESTION_EN, '日語分級試題'))
}
