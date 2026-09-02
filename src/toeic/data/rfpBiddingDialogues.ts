/**
 * TOEIC 多益英語：商務採購徵求建議書 (RFP)、供應商競標評審與履約合約特訓題庫 (RFP & Vendor Bidding Procurement)
 * 涵蓋多益 Part 3/4/7 最常出現的徵求建議書 (Request for Proposal / RFP)、投標截止時限 (Strict Submission Deadline)、密封比價 (Competitive Sealed Bidding)、加權評審評分表 (Weighted Evaluation Scoring Matrix)、主服務採購協議 (Master Services Agreement / MSA) 與延遲履約違約金 (Liquidated Damages for Delayed Delivery)。
 */

export interface RfpScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    chiefProcurementOfficer: string
    seniorContractsNegotiator: string
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
  rfpKeywordsTipsJa: string
}

export const RFP_SCENARIOS: RfpScenarioItem[] = [
  {
    id: 'rfp-vendor-evaluation',
    title: '跨國軟體系統整合採購 RFP 競標開標與供應商評審合約條款',
    titleJa: '基幹システム調達RFP入札評価とベンダー選定・損害賠償条項',
    icon: '📑',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Chief Procurement Officer: Good morning, Derek. Have all competing software vendors submitted their proposals before yesterday's strict five o'clock RFP deadline?\nDerek: Yes, Victoria. We received four sealed bids from certified tier-one enterprise providers. According to our weighted evaluation matrix, technical architecture accounts for forty percent, pricing thirty percent, and SLA guarantees twenty percent.\nChief Procurement Officer: Excellent. Which vendor emerged as the preferred bidder?\nDerek: Apex Global Solutions achieved the highest composite score. However, before executing the Master Services Agreement, we must ensure the contract includes our standard liquidated damages clause of one percent per day for any delivery milestone delays.`,
    dialogueRoles: {
      chiefProcurementOfficer: 'Victoria (Chief Procurement Officer)',
      seniorContractsNegotiator: 'Derek (Senior Contracts & Procurement Negotiator)',
    },
    questions: [
      {
        id: 'rq-1',
        question: 'According to the evaluation matrix, which criterion carries the highest weight?',
        questionJa: '評価マトリクスにおいて、最も高い配点比率を持つ基準はどれですか？',
        options: [
          'Pricing structure and payment milestones',
          'Technical architecture',
          'Service level agreement (SLA) guarantees',
          'Vendor geographic proximity to headquarters',
        ],
        correctIndex: 1,
        explanationZh: 'Derek 指出「technical architecture accounts for forty percent（技術架構佔權重百分之四十）」，高於價格（30%）與 SLA（20%）。',
        explanationJa: '「技術アーキテクチャが配点比率の40％を占める」と述べています。',
      },
      {
        id: 'rq-2',
        question: 'What contractual provision must be finalized before signing the Master Services Agreement?',
        questionJa: '基本合意契約（MSA）を締結する前に、どの契約条項を確定させる必要がありますか？',
        options: [
          'An unconditional non-compete clause for all former employees',
          'A liquidated damages clause for delivery milestone delays',
          'A mandatory transfer of corporate equity shares',
          'A complete refund policy valid for ten consecutive years',
        ],
        correctIndex: 1,
        explanationZh: 'Derek 說明合約必須包含「liquidated damages clause of one percent per day for any delivery milestone delays（針對任何交付里程碑延誤每日扣罰百分之一的預定違約金條款）」。',
        explanationJa: '「納品遅延に対する1日あたり1％の損害賠償予定（liquidated damages）条項」を盛り込む必要があるためです。',
      },
    ],
    rfpKeywordsTipsJa: 'TOEICでは「Request for Proposal / RFP（提案依頼書）」「sealed bid（封印入札）」「weighted matrix（加権評価表）」「liquidated damages（損害賠償額の予定・違約金）」「preferred bidder（優先交渉権者）」が頻出です。',
  },
]
