/**
 * TOEIC 多益英語：商務國際貿易、海關清關與關稅條款特訓題庫 (International Trade & Customs)
 * 涵蓋多益 Part 3/4/7 最常出現的國貿條規 (Incoterms: FOB vs CIF)、關稅稅率 (Customs Duties & Tariffs)、原產地證明 (Certificate of Origin) 與海運提單 (Bill of Lading / B/L)。
 */

export interface TradeScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    exportManager: string
    importComplianceLead: string
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
  tradeKeywordsTipsJa: string
}

export const TRADE_SCENARIOS: TradeScenarioItem[] = [
  {
    id: 'trade-incoterms-cif',
    title: '國際貿易條規 (FOB vs CIF) 與海關關稅申報',
    titleJa: 'インコタームズ（FOB vs CIF条件）と通関関税申告実務',
    icon: '🌐',
    targetAccent: 'en-GB',
    accentLabel: '英式口音 🇬🇧',
    audioScript: `Export Manager: Good afternoon, Oliver. Our client in Hamburg has requested that we revise the shipping agreement for the semiconductor packaging components from FOB to CIF terms.\nOliver: That means we would assume responsibility for freight charges and marine insurance until the shipment reaches the Port of Hamburg. Did they agree to absorb the tariff differential?\nExport Manager: Yes, they confirmed they will cover all European import duties and customs clearance fees upon arrival. However, their customs broker needs our certified Certificate of Origin and the finalized commercial invoice before the vessel docks next Tuesday.\nOliver: Splendid. I will coordinate with our maritime underwriter to issue the insurance policy and instruct our freight forwarder to release the original Bill of Lading.`,
    dialogueRoles: {
      exportManager: 'Eleanor (Director of Global Trade)',
      importComplianceLead: 'Oliver (Trade Compliance Specialist)',
    },
    questions: [
      {
        id: 'tq-1',
        question: 'Under the revised CIF terms, what additional responsibility does the seller take on?',
        questionJa: '変更されたCIF条件の下で、売主が新たに引き受ける責任は何ですか？',
        options: [
          'Paying European local distribution warehouse fees',
          'Paying for international freight and marine cargo insurance',
          'Providing free warranty maintenance in Hamburg for five years',
          'Manufacturing the components locally in Germany',
        ],
        correctIndex: 1,
        explanationZh: 'Oliver 說明「That means we would assume responsibility for freight charges and marine insurance until the shipment reaches the Port of Hamburg（代表我們將承擔運費與海上貨物保險直到貨物抵達漢堡港）」。',
        explanationJa: '「運賃（freight）と海上保険（marine insurance）の費用負担を引き受ける」と述べています。',
      },
      {
        id: 'tq-2',
        question: 'What document must the client\'s customs broker receive before next Tuesday?',
        questionJa: '顧客の通関業者は来週火曜日までにどの書類を受け取る必要がありますか？',
        options: [
          'The certified Certificate of Origin and commercial invoice',
          'The quarterly corporate financial statement',
          'Employee tax withholding records',
          'An updated product catalog with retail prices',
        ],
        correctIndex: 0,
        explanationZh: '經理表示「needs our certified Certificate of Origin and the finalized commercial invoice before the vessel docks next Tuesday（需要認證的原產地證明與商業發票）」。',
        explanationJa: '「原産地証明書（Certificate of Origin）と商業送り状（commercial invoice）」が必要です。',
      },
    ],
    tradeKeywordsTipsJa: 'TOEICでは「Incoterms（貿易条件）」「FOB（本船甲板渡し）vs CIF（運賃保険料込み）」「Bill of Lading / B/L（船荷証券）」「Certificate of Origin（原産地証明書）」が超重要です。',
  },
]
