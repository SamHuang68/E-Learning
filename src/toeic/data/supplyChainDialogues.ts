/**
 * TOEIC 多益英語：商務供應鏈物流、倉儲庫存與發票條款特訓題庫 (Supply Chain & Logistics)
 * 涵蓋多益 Part 3/4/7 最常出現的貨物運送延遲 (Shipment Delay)、供應鏈管理 (Supply Chain)、庫存清點 (Inventory Audit) 與採購條款 (Purchase Order & Net 30)。
 */

export interface SupplyChainScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    logisticsManager: string
    procurementLead: string
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
  supplyChainKeywordsTipsJa: string
}

export const SUPPLY_CHAIN_SCENARIOS: SupplyChainScenarioItem[] = [
  {
    id: 'sc-freight-delay',
    title: '海運貨櫃清關延誤與緊急空運調度',
    titleJa: '海上コンテナ通関遅延と緊急航空便手配（Supply Chain Disruption）',
    icon: '🚢',
    targetAccent: 'en-AU',
    accentLabel: '澳式口音 🇦🇺',
    audioScript: `Logistics Manager: Morning, Liam. I just received word from our freight forwarder in Rotterdam. The container carrying our primary circuit assemblies has been held up at customs due to an inspection backlog.\nLiam: That is unfortunate news. Our production line in Melbourne will run out of safety stock by this Thursday. How long is the port delay expected to last?\nLogistics Manager: Port authorities estimate at least five working days. To prevent an entire assembly line shutdown, I recommend air-freighting a partial shipment of two thousand units immediately. The expedited air surcharge is steep, but it is far less expensive than halting production.\nLiam: Agreed. Please issue the revised purchase order right away and verify that the payment terms remain Net 30.`,
    dialogueRoles: {
      logisticsManager: 'Fiona (Global Logistics Manager)',
      procurementLead: 'Liam (Procurement Director)',
    },
    questions: [
      {
        id: 'scq-1',
        question: 'Why was the container held up at the port?',
        questionJa: 'コンテナが港で留め置かれている理由は何ですか？',
        options: [
          'Severe weather damaged the cargo',
          'There is an inspection backlog at customs',
          'The shipping vessel ran out of fuel',
          'The supplier failed to provide safety certificates',
        ],
        correctIndex: 1,
        explanationZh: '物流經理說明「held up at customs due to an inspection backlog（因為海關查驗積壓而在海關受阻）」。',
        explanationJa: '「税関の検査順番待ち（inspection backlog at customs）のため」と述べています。',
      },
      {
        id: 'scq-2',
        question: 'What solution does Fiona propose to avoid shutting down the assembly line?',
        questionJa: '組み立てラインの停止を防ぐため、Fionaはどのような解決策を提案していますか？',
        options: [
          'Postponing all customer orders by two months',
          'Air-freighting a partial shipment immediately',
          'Borrowing inventory from a direct competitor',
          'Switching to domestic suppliers permanently',
        ],
        correctIndex: 1,
        explanationZh: 'Fiona 建議「air-freighting a partial shipment of two thousand units immediately（立即空運兩千件部分貨物）」。',
        explanationJa: '「直ちに2,000個の一部部材を緊急航空輸送する（air-freighting a partial shipment）」と提案しています。',
      },
    ],
    supplyChainKeywordsTipsJa: 'TOEICでは「freight forwarder（運送取扱業者）」「customs backlog（税関の停滞）」「safety stock（安全在庫）」「Net 30（納品後30日払い）」が定番頻出単語です。',
  },
]
