/**
 * TOEIC 多益英語：商業營業中斷險理賠、停工營收損失法證審計特訓題庫 (Business Interruption Insurance Claim)
 * 涵蓋多益 Part 3/4/7 最常出現的商業綜合財產附加險 (Commercial Property & Business Interruption Policy)、毛利與持續固定成本理賠 (Lost Gross Profits & Continuing Fixed Operating Expenses)、72小時免賠等待期 (72-Hour Waiting Period Deductible)、法證理賠公估師審查 (Forensic Claims Adjuster Audit)、臨時替代廠房租賃額外費用 (Extra Expense Coverage) 及歷史營收基準查核 (Audited Historical Revenue Baseline)。
 */

export interface BusinessInterruptionScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    corporateRiskManager: string
    seniorForensicClaimsAdjuster: string
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
  businessInterruptionKeywordsTipsJa: string
}

export const BUSINESS_INTERRUPTION_SCENARIOS: BusinessInterruptionScenarioItem[] = [
  {
    id: 'business-interruption-fire-claim',
    title: '半導體封裝廠火災停工：營業中斷保險理賠與 72 小時等待期審定',
    titleJa: '半導体パッケージ工場の火災操業停止：休業損害保険金請求と72時間免責期間の算定',
    icon: '🏭',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Corporate Risk Manager: Good morning, Douglas. Thank you for visiting our cleanroom facility. As you know, an electrical transformer fire forced our packaging line into complete shutdown for eighteen business days last month.\nDouglas: Good morning, Brenda. Under your commercial policy's Business Interruption rider, we are reviewing your claim for two point four million dollars. Our forensic audit verifies your lost gross profit based on your prior twenty-four months of audited sales manifests.\nCorporate Risk Manager: Excellent. Does the preliminary adjustment also cover our continuing payroll obligations and the temporary rental fees for the cleanroom equipment we leased off-site?\nDouglas: Yes. Continuing normal operating expenses and extra mitigation expenses are fully covered under Section 4. However, please note that per policy endorsement 12B, the first seventy-two hours of lost production are designated as the waiting period deductible and will be deducted from the final payout settlement.`,
    dialogueRoles: {
      corporateRiskManager: 'Brenda (Corporate Risk Manager)',
      seniorForensicClaimsAdjuster: 'Douglas (Senior Forensic Claims Adjuster)',
    },
    questions: [
      {
        id: 'bii-1',
        question: 'What constitutes the deductible under this business interruption insurance policy?',
        questionJa: 'この休業損害保険（Business Interruption Insurance）における免責（控除）条件は何ですか？',
        options: [
          'A mandatory fifty-thousand-dollar cash deposit paid to the local fire department',
          'The first seventy-two hours of lost production as a waiting period deductible',
          'Ten percent of the factory\'s total inventory value before the fire',
          'A three-month delay before any claims can be formally filed',
        ],
        correctIndex: 1,
        explanationZh: 'Douglas 指出免賠額為「the first seventy-two hours of lost production are designated as the waiting period deductible（前 72 小時的產能損失被設定為等待期免賠額）」。',
        explanationJa: '「操業停止の最初の72時間分の損失が待機期間免責（waiting period deductible）として控除される」と明記されています。',
      },
      {
        id: 'bii-2',
        question: 'Which additional expenses are explicitly confirmed as covered under Section 4?',
        questionJa: '第4条に基づき、具体的に補償対象として確認された追加費用は何ですか？',
        options: [
          'Executive year-end discretionary bonuses and shareholder dividends',
          'Continuing normal operating expenses and temporary cleanroom equipment lease fees',
          'Complete legal defense costs for unrelated patent litigation',
          'Architectural design fees for a new international headquarters',
        ],
        correctIndex: 1,
        explanationZh: 'Douglas 確認「Continuing normal operating expenses and extra mitigation expenses（持續正常營運費用如薪資，以及異地租賃無塵室設備的額外費用）皆在保障範圍內」。',
        explanationJa: '「継続的な通常運営費用（給与など）および社外クリーンルーム設備の臨時リース費用」が補償対象となります。',
      },
    ],
    businessInterruptionKeywordsTipsJa: 'TOEICでは「Business Interruption Insurance / BII（休業損害保険）」「waiting period deductible（待機期間免責）」「lost gross profit（喪失粗利益）」「continuing normal operating expenses（継続的固定費）」「extra expense coverage（臨時追加費用補償）」が頻出です。',
  },
]
