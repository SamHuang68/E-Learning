/**
 * TOEIC 多益英語：商務差旅、機場登機與飯店住宿特訓題庫 (Business Travel & Accommodations)
 * 涵蓋多益聽力 Part 3/4 與閱讀 Part 7 最常出現的航班預訂、航班改簽、飯店入住、費用報銷 (Expense Report)。
 */

export interface TravelScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    traveler: string
    agent: string
  }
  questions: Array<{
    id: string
    question: string
    questionJa: string
    options: string[]
    correctIndex: number
    explanationZh: string
    explanationJa: string
  }>
  businessExpenseTipsJa: string
}

export const TRAVEL_SCENARIOS: TravelScenarioItem[] = [
  {
    id: 'travel-flight-upgrade',
    title: '機場櫃檯登機手續與商務艙升等',
    titleJa: '空港カウンターでのチェックインとビジネス席アップグレード',
    icon: '✈️',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Agent: Good morning, welcome to Pacific Skyways. Where are you flying today?\nPassenger: Good morning, I'm on flight PS-482 to London Heathrow. Here is my passport and confirmation receipt.\nAgent: Thank you, Mr. Clark. I see you are traveling in economy. Because you are an Executive Gold member, we have complimentary upgrades available for business class today. Would you like a window or an aisle seat?\nPassenger: That is fantastic news! I would definitely prefer an aisle seat with extra legroom. Also, could I confirm whether my checked luggage will be transferred directly to my connecting flight?\nAgent: Yes, your bags are checked through all the way to Zurich. Here is your boarding pass. Boarding begins at Gate 28 at 11:15 AM.`,
    dialogueRoles: {
      traveler: 'Mr. Clark (Executive Passenger)',
      agent: 'Check-in Agent (Pacific Skyways)',
    },
    questions: [
      {
        id: 'tq-1',
        question: 'Why does the passenger receive a complimentary upgrade?',
        questionJa: '乗客が無料でアップグレードを受けられる理由は何ですか？',
        options: [
          'Because the flight was overbooked',
          'Due to his executive loyalty status',
          'Because his original flight was cancelled',
          'He paid an additional fee online',
        ],
        correctIndex: 1,
        explanationZh: '地勤說明「Because you are an Executive Gold member, we have complimentary upgrades available（因為您是高階金卡會員）」。',
        explanationJa: '「Executive Gold member（上級マイレージ会員）であるため」と明記されています。',
      },
      {
        id: 'tq-2',
        question: 'Where will the passenger collect his checked luggage?',
        questionJa: '乗客は預け入れ荷物をどこで受け取りますか？',
        options: [
          'London Heathrow Airport',
          'Zurich Airport',
          'At the departure gate',
          'Customer service desk',
        ],
        correctIndex: 1,
        explanationZh: '地勤確認「your bags are checked through all the way to Zurich（行李將直掛至蘇黎世終點站）」。',
        explanationJa: '「最終目的地のチューリッヒまで直行（checked through）で運ばれる」と案内されています。',
      },
    ],
    businessExpenseTipsJa: 'TOEICでは「checked through（最終目的地まで荷物が直行する）」「aisle seat（通路側の席）」「boarding pass（搭乗券）」が頻出トリガー単語です。',
  },
]
