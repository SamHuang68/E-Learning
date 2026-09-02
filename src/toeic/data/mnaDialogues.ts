/**
 * TOEIC 多益英語：商務企業併購、重組與盡職調查特訓題庫 (Mergers & Acquisitions / M&A Due Diligence)
 * 涵蓋多益 Part 3/4/7 最常出現的盡職調查 (Due Diligence Audit)、保密協議 (Non-Disclosure Agreement / NDA)、反壟斷監管審查 (Antitrust Regulatory Approval) 與股東大會表決 (Shareholder Vote & Synergies)。
 */

export interface MnaScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    managingPartner: string
    leadFinancialAuditor: string
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
  mnaKeywordsTipsJa: string
}

export const MNA_SCENARIOS: MnaScenarioItem[] = [
  {
    id: 'mna-due-diligence',
    title: '跨國半導體封測廠併購案盡職調查與監管機關審查',
    titleJa: '半導体企業のM&A（企業買収）デューデリジェンスと独禁法審査',
    icon: '🤝',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Managing Partner: Good morning, Charles. Have your auditors concluded the comprehensive financial due diligence for our proposed acquisition of Apex Microelectronics?\nCharles: Yes, Cynthia. We meticulously reviewed their patent portfolio, pending litigation, and audited balance sheets for the past five fiscal years. Their debt-to-equity ratio is stable, and their proprietary packaging technology aligns perfectly with our expected manufacturing synergies.\nManaging Partner: That is reassuring. What remains on the critical timeline before we present the tender offer to their board of directors?\nCharles: We must secure antitrust clearance from regulatory commissions in both Brussels and Washington, followed by a formal shareholder proxy vote next quarter. All parties remain bound by the strict non-disclosure agreement until the official joint press conference.`,
    dialogueRoles: {
      managingPartner: 'Cynthia (Managing Partner, Investment Banking)',
      leadFinancialAuditor: 'Charles (Lead Forensic Auditor)',
    },
    questions: [
      {
        id: 'mq-1',
        question: 'What positive conclusion did the financial due diligence team reach?',
        questionJa: '財務デューデリジェンスチームが下した前向きな結論は何ですか？',
        options: [
          'Apex has zero corporate debt and no competitors',
          'Their packaging tech aligns with expected manufacturing synergies',
          'Apex agreed to lay off their entire executive committee',
          'All pending patent litigation has been immediately dismissed',
        ],
        correctIndex: 1,
        explanationZh: 'Charles 報告指出「their proprietary packaging technology aligns perfectly with our expected manufacturing synergies（專利封裝技術與我們預期的製造綜效完美契合）」。',
        explanationJa: '「特許パッケージング技術が想定される製造シナジーと完璧に一致している」と報告しています。',
      },
      {
        id: 'mq-2',
        question: 'What milestone is required before presenting the tender offer to the board?',
        questionJa: '取締役会に買付提案（tender offer）を行う前に必要なマイルストーンは何ですか？',
        options: [
          'Securing antitrust regulatory clearance in Brussels and Washington',
          'Redesigning the corporate logo and brand identity',
          'Relocating the global headquarters to Tokyo',
          'Conducting a public survey of five thousand consumers',
        ],
        correctIndex: 0,
        explanationZh: 'Charles 表示「must secure antitrust clearance from regulatory commissions in both Brussels and Washington（必須取得布魯塞爾與華盛頓監管機構的反壟斷核准）」。',
        explanationJa: '「ブリュッセルとワシントンの規制当局から独占禁止法の承認（antitrust clearance）を得ること」です。',
      },
    ],
    mnaKeywordsTipsJa: 'TOEICでは「due diligence（デューデリジェンス・適格性資産査定）」「acquisition（買収）」「synergy（相乗効果）」「antitrust clearance（独禁法審査承認）」が頻出です。',
  },
]
