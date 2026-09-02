/**
 * TOEIC 多益英語：商務企業永續發展、ESG 碳盤查與碳權交易特訓題庫 (ESG & Carbon Offsetting)
 * 涵蓋多益 Part 3/4/7 最常出現的範疇一二三溫室氣體排放 (Scope 1, 2, and 3 Emissions)、碳邊境調整機制 (Carbon Border Adjustment Mechanism / CBAM)、碳信用額度抵銷 (Carbon Offset Credits) 與第三方獨立審查 (Independent ESG Assurance Audit)。
 */

export interface EsgScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    chiefSustainabilityOfficer: string
    supplyChainDecarbonizationLead: string
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
  esgKeywordsTipsJa: string
}

export const ESG_SCENARIOS: EsgScenarioItem[] = [
  {
    id: 'esg-carbon-accounting',
    title: '跨國製造業年度 ESG 永續報告查證與範疇三供應鏈碳盤查',
    titleJa: '製造業のESGサステナビリティ報告書監査とScope 3排出量算定',
    icon: '🌱',
    targetAccent: 'en-CA',
    accentLabel: '加式口音 🇨🇦',
    audioScript: `Chief Sustainability Officer: Good morning, Raymond. How is our progress on compiling the audited greenhouse gas inventory for the upcoming annual ESG sustainability report?\nRaymond: We have already finalized and verified our direct Scope 1 emissions from factory operations and Scope 2 emissions from purchased electricity. However, calculating our indirect Scope 3 supply chain emissions from overseas logistics partners remains a complex challenge.\nChief Sustainability Officer: That is critical, especially since the European Union's Carbon Border Adjustment Mechanism will soon mandate verified carbon declarations for all steel and aluminum component imports.\nRaymond: Absolutely. We have contracted a certified independent environmental auditing firm to validate our carbon reduction data, and we plan to procure verified gold standard carbon offset credits to neutralize any remaining residual emissions.`,
    dialogueRoles: {
      chiefSustainabilityOfficer: 'Elena (Chief Sustainability Officer)',
      supplyChainDecarbonizationLead: 'Raymond (Supply Chain Decarbonization Lead)',
    },
    questions: [
      {
        id: 'eq-1',
        question: 'Which category of emissions is currently presenting a measurement challenge for the company?',
        questionJa: '現在、企業にとって算定が課題となっている排出量カテゴリーはどれですか？',
        options: [
          'Scope 1 direct emissions from manufacturing machinery',
          'Scope 2 indirect emissions from electricity consumption',
          'Scope 3 supply chain emissions from overseas logistics partners',
          'Emissions from employee home heating during remote work',
        ],
        correctIndex: 2,
        explanationZh: 'Raymond 指出「calculating our indirect Scope 3 supply chain emissions from overseas logistics partners remains a complex challenge（計算海外物流夥伴的範疇三間接供應鏈排放仍具高度挑戰）」。',
        explanationJa: '「海外物流パートナーからのScope 3間接排出量の算定が依然として複雑な課題」と述べています。',
      },
      {
        id: 'eq-2',
        question: 'Why is verified carbon accounting especially urgent for the organization?',
        questionJa: '組織にとって検証済みの炭素会計が特に緊急を要する理由は何ですか？',
        options: [
          'The European Union CBAM will mandate verified carbon declarations',
          'Their major bank has threatened immediate loan cancellation',
          'Local utility companies are shutting down regional power grids',
          'Customers are demanding 100 percent refund on past purchases',
        ],
        correctIndex: 0,
        explanationZh: '永續長 Elena 說明「the European Union\'s Carbon Border Adjustment Mechanism will soon mandate verified carbon declarations（歐盟碳邊境調整機制即將強制要求經查證的碳排放申報）」。',
        explanationJa: '「EUの炭素国境調整措置（CBAM）により検証済み炭素申告が義務化されるため」です。',
      },
    ],
    esgKeywordsTipsJa: 'TOEICでは「sustainability（持続可能性）」「carbon footprint / offset（炭素フットプリント・相殺）」「Scope 1/2/3 emissions（排出量分類）」「compliance（法令遵守・適合性）」が頻出です。',
  },
]
