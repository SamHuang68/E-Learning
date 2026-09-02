/**
 * TOEIC 多益英語：海上貨物保險、共同海損宣告與海損分攤特訓題庫 (Marine Cargo Insurance & General Average)
 * 涵蓋多益 Part 3/4/7 最常出現的國際海事法共同海損 (Declaration of General Average)、應急拋棄貨物以拯救船舶與全員 (Voluntary Jettison of Cargo)、共同海損分攤保證書 (General Average Bond and Guarantee)、英國協會貨物條款全險 (Institute Cargo Clauses (A) / All Risks Coverage) 及海損理算師 (Average Adjuster) 分攤計算。
 */

export interface MarineInsuranceScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    maritimeClaimsDirector: string
    freightLogisticsManager: string
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
  marineInsuranceKeywordsTipsJa: string
}

export const MARINE_INSURANCE_SCENARIOS: MarineInsuranceScenarioItem[] = [
  {
    id: 'marine-insurance-general-average',
    title: '跨國貨輪暴風雨拋貨應急：共同海損宣告與貨主保證金分攤程序',
    titleJa: 'コンテナ船荒天による貨物投棄：共同海損（General Average）宣言と負担保証手続き',
    icon: '🚢',
    targetAccent: 'en-GB',
    accentLabel: '英式口音 🇬🇧',
    audioScript: `Maritime Claims Director: Thomas, we just received formal notification from the vessel owner regarding the Pacific Voyager. Due to severe cyclonic conditions in the South China Sea, the captain declared General Average after jettisoning forty heavy containers to rebalance the listing hull and save the crew.\nThomas: Good heavens, Alistair! We have eight high-value machinery containers on board that vessel bound for Singapore. Were our shipments among those sacrificed?\nMaritime Claims Director: Fortunately, our containers remain intact on the lower deck. However, under maritime York-Antwerp Rules, because the voyage was successfully saved, all surviving cargo owners, along with the shipowner, must contribute proportionally to cover the total sacrifice and salvage expenses.\nThomas: Understood. I will immediately instruct our marine cargo underwriters to issue the General Average Guarantee and deposit the required cash bond so the port authority can release our machinery upon berthing.`,
    dialogueRoles: {
      maritimeClaimsDirector: 'Alistair (Maritime Claims Director)',
      freightLogisticsManager: 'Thomas (Global Freight Logistics Manager)',
    },
    questions: [
      {
        id: 'ga-1',
        question: 'Why did the ship\'s captain formally declare General Average?',
        questionJa: '船長が正式に共同海損（General Average）を宣言した理由は何ですか？',
        options: [
          'The vessel experienced an engine room fire caused by electrical failure',
          'The captain voluntarily jettisoned containers during a severe cyclone to stabilize the ship',
          'The crew went on strike demanding higher offshore maritime wages',
          'Pirates hijacked the container ship off the coast of Singapore',
        ],
        correctIndex: 1,
        explanationZh: 'Alistair 說明船長宣告共同海損是因為「jettisoning forty heavy containers to rebalance the listing hull and save the crew during severe cyclonic conditions（在強烈氣旋風暴中為平衡傾斜船體並拯救船員而主動拋棄四十只重型貨櫃）」。',
        explanationJa: '「猛烈なサイクロンの中で船体を安定させ乗組員を救うため、自発的にコンテナを投棄（jettisoning containers）したため」です。',
      },
      {
        id: 'ga-2',
        question: 'What action must Thomas take to obtain the release of the intact machinery containers at the port?',
        questionJa: 'トーマスは港で無事だった機械コンテナの引き渡しを受けるために何をしなければなりませんか？',
        options: [
          'File a criminal lawsuit against the shipping company in London',
          'Have their marine underwriters issue a General Average Guarantee and deposit a bond',
          'Purchase replacement containers from the local shipyard',
          'Personally travel to Singapore to inspect the hull for structural cracks',
        ],
        correctIndex: 1,
        explanationZh: 'Thomas 承諾立即指示保險公司「issue the General Average Guarantee and deposit the required cash bond（出具共同海損保證函並繳納所需現金保證金）」以利海關與港務放行貨物。',
        explanationJa: '保険引受人（underwriters）に「共同海損保証状（General Average Guarantee）を発行させ保証金を供託させる」必要があります。',
      },
    ],
    marineInsuranceKeywordsTipsJa: 'TOEICでは「General Average（共同海損）」「jettison（緊急貨物投棄）」「York-Antwerp Rules（ヨーク・アントワープ規則）」「salvage expenses（海難救助費用）」「General Average Guarantee（共同海損分担保証状）」が頻出です。',
  },
]
