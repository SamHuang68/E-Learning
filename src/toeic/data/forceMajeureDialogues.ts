/**
 * TOEIC 多益英語：商務不可抗力條款 (Force Majeure)、天災免責與商業保險理賠特訓題庫 (Force Majeure & Insurance Claims)
 * 涵蓋多益 Part 3/4/7 最常出現的不可抗力條款 (Force Majeure Clause)、天災免責 (Acts of God / Natural Catastrophes)、履約寬限通知 (Notice of Excusable Delay)、公證理賠師審查 (Insurance Claims Adjuster Assessment)、自負額免賠額 (Deductible) 與貨物全險 (Comprehensive Cargo Coverage)。
 */

export interface ForceMajeureScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    corporateRiskOfficer: string
    insuranceClaimsAdjuster: string
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
  forceMajeureKeywordsTipsJa: string
}

export const FORCE_MAJEURE_SCENARIOS: ForceMajeureScenarioItem[] = [
  {
    id: 'force-majeure-claim',
    title: '颱風颶風致供應鏈中斷：不可抗力免責宣告與商業貨物全險理賠',
    titleJa: '台風によるサプライチェーン寸断：不可抗力条項の行使と貨物保険求償',
    icon: '🌪️',
    targetAccent: 'en-GB',
    accentLabel: '英式口音 🇬🇧',
    audioScript: `Corporate Risk Officer: Good afternoon, Alistair. Following the Category 5 hurricane that closed the deep-water shipping berths in Liverpool, our key logistics provider has issued a formal notice invoking the force majeure clause.\nAlistair: Thank you, Eleanor. Under Clause 18 of the Master Freight Agreement, severe acts of God that make performance physically impossible indeed exempt both parties from contractual liquidated damages, provided prompt written notification was served within forty-eight hours.\nCorporate Risk Officer: That relieves our liability concerns. What about recovering the lost refrigerated cargo?\nAlistair: Our comprehensive marine insurance policy covers natural catastrophe losses in full, subject to our standard five-thousand-pound deductible. I will submit the surveyor's photographic evidence and bills of lading to the underwriters before noon tomorrow.`,
    dialogueRoles: {
      corporateRiskOfficer: 'Eleanor (Corporate Risk & Compliance Officer)',
      insuranceClaimsAdjuster: 'Alistair (Senior Marine Insurance Claims Adjuster)',
    },
    questions: [
      {
        id: 'fq-1',
        question: 'Under what condition does the force majeure clause exempt the logistics provider from delayed penalties?',
        questionJa: '不可抗力条項が物流業者の遅延損害金を免責するための条件は何ですか？',
        options: [
          'Immediate payment of double the standard freight rate',
          'Prompt written notification served within forty-eight hours',
          'Rerouting all cargo via air freight at their own expense',
          'Full replacement of all corporate leadership within one week',
        ],
        correctIndex: 1,
        explanationZh: 'Alistair 指出不可抗力條款免責的先決條件是「provided prompt written notification was served within forty-eight hours（在 48 小時內送達正式書面通知）」。',
        explanationJa: '「48時間以内に迅速な書面通知を行うことが条件で、違約金が免除される」と述べています。',
      },
      {
        id: 'fq-2',
        question: 'What financial deduction applies to the marine insurance claim for the lost cargo?',
        questionJa: '失われた貨物の海上保険求償において、どのような控除額が適用されますか？',
        options: [
          'A fifty percent reduction in total compensation payout',
          'A standard five-thousand-pound deductible',
          'A twenty percent surcharge on all future shipping policies',
          'No financial deductions whatsoever under catastrophic terms',
        ],
        correctIndex: 1,
        explanationZh: 'Alistair 說明海上保險將全額理賠天災損失，但需扣除「standard five-thousand-pound deductible（五千英鎊的標準自負額/免賠額）」。',
        explanationJa: '「標準の5,000ポンドの免責額（deductible）を差し引いた上で全額補償される」ためです。',
      },
    ],
    forceMajeureKeywordsTipsJa: 'TOEICでは「force majeure（不可抗力）」「act of God（天変地異・天災）」「excusable delay（免責的遅延）」「claims adjuster（保険損害査定人）」「deductible（自己負担金・免責金額）」が頻出です。',
  },
]
