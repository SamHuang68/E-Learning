/**
 * TOEIC 多益英語：專利授權權利金審計、最低保證金條款特訓題庫 (Patent Royalty Audit & Minimum Guarantee)
 * 涵蓋多益 Part 3/4/7 最常出現的智財授權合約 (Intellectual Property Licensing Agreement)、最低保證權利金條款 (Minimum Guaranteed Royalty / MGR)、第三方獨立查帳審計 (Independent Forensic Audit)、短報銷售少付權利金 (Royalty Underpayment Discrepancy)、年利率遲延利息 (Contractual Late Interest Penalty) 及查帳費用轉移條款 (Audit Fee Shifting Clause)。
 */

export interface RoyaltyAuditScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    intellectualPropertyLicensingDirector: string
    seniorAuditPartner: string
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
  royaltyAuditKeywordsTipsJa: string
}

export const ROYALTY_AUDIT_SCENARIOS: RoyaltyAuditScenarioItem[] = [
  {
    id: 'royalty-audit-underpayment',
    title: '專利晶片授權查帳：短報 18% 淨銷售額補繳與審計費用移轉條款',
    titleJa: '半導体特許ライセンス監査：18%の過少申告発覚と監査費用負担条項の適用',
    icon: '📊',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Intellectual Property Licensing Director: Raymond, have you concluded the forensic audit of Apex Microelectronics' quarterly royalty reports for our 5G baseband modem patents?\nRaymond: Yes, Sarah. The discrepancy is substantial. Our team examined their production manifests and found they underreported net worldwide sales by eighteen percent over the past three fiscal quarters.\nIntellectual Property Licensing Director: That is a severe contractual breach. Under Section 8 of our licensing pact, what is the total amount due?\nRaymond: The unpaid base royalties amount to four hundred and twenty thousand dollars, plus twelve percent contractual late interest. Furthermore, because the reporting shortfall exceeds the five percent threshold defined in Section 8.4, Apex is contractually obligated to reimburse our entire eighty-five thousand dollar audit fee.`,
    dialogueRoles: {
      intellectualPropertyLicensingDirector: 'Sarah (Licensing Director)',
      seniorAuditPartner: 'Raymond (Senior Forensic Audit Partner)',
    },
    questions: [
      {
        id: 'royalty-1',
        question: 'What did the forensic audit discover regarding Apex Microelectronics?',
        questionJa: '不正調査（フォレンジック監査）によってエイペックス・マイクロエレクトロニクス社に関して何が判明しましたか？',
        options: [
          'They accidentally overpaid royalties by fifty thousand dollars',
          'They underreported net worldwide sales by eighteen percent',
          'They filed for Chapter 11 corporate bankruptcy reorganization',
          'They exported restricted semiconductors without government export licenses',
        ],
        correctIndex: 1,
        explanationZh: 'Raymond 指出查帳發現「underreported net worldwide sales by eighteen percent over the past three fiscal quarters（在過去三季短報了全球淨銷售額達 18%）」。',
        explanationJa: '「過去3四半期にわたり世界純売上高を18%過少申告していた（underreported net sales by 18%）」ことが判明しました。',
      },
      {
        id: 'royalty-2',
        question: 'Why is Apex Microelectronics required to pay for the eighty-five thousand dollar audit fee?',
        questionJa: 'なぜエイペックス社は8万5千ドルの監査費用全額を負担しなければならないのですか？',
        options: [
          'Because their chief financial officer agreed verbally in the court',
          'Because the reporting shortfall exceeded the five percent contractual threshold',
          'Because they failed to submit their annual tax return to the treasury',
          'Because their business license had expired prior to the audit',
        ],
        correctIndex: 1,
        explanationZh: 'Raymond 說明因為短報比例超過合約第 8.4 條規定的 5% 門檻（`reporting shortfall exceeds the five percent threshold`），觸發審計費用轉移條款，因此必須負擔全額 8.5 萬美元審計費用。',
        explanationJa: '契約で定められた「過少申告の5%の許容基準（5% threshold）を超過したため」、監査費用負担条項が適用されました。',
      },
    ],
    royaltyAuditKeywordsTipsJa: 'TOEICでは「royalty audit（ライセンス料監査）」「underreported sales（過少申告売上）」「contractual breach（契約違反）」「audit fee shifting（監査費用負担転嫁条項）」「forensic accounting（不正会計調査）」が頻出です。',
  },
]
