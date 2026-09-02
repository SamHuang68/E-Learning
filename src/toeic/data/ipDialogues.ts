/**
 * TOEIC 多益英語：商務智慧財產權、專利訴訟與技術授權特訓題庫 (Intellectual Property & Patent Licensing)
 * 涵蓋多益 Part 3/4/7 最常出現的專利侵權抗辯 (Patent Infringement Lawsuit)、非專屬全球技術授權合約 (Non-Exclusive Licensing Agreement)、權利金提撥計算 (Royalty Fees) 與專利審查核准 (Patent Grant)。
 */

export interface IpScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    chiefLegalOfficer: string
    seniorPatentAttorney: string
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
  ipKeywordsTipsJa: string
}

export const IP_SCENARIOS: IpScenarioItem[] = [
  {
    id: 'ip-licensing-agreement',
    title: '生醫晶片專利全球非專屬技術授權協議與權利金談判',
    titleJa: 'バイオ半導体特許のグローバル非独占的ライセンス契約とロイヤルティ交渉',
    icon: '⚖️',
    targetAccent: 'en-AU',
    accentLabel: '澳式口音 🇦🇺',
    audioScript: `Chief Legal Officer: Good morning, Douglas. Has the licensing committee finalized the terms for the non-exclusive patent licensing agreement with Orion Healthcare?\nDouglas: Yes, Fiona. They agreed to pay an upfront license fee of two million dollars, accompanied by a quarterly running royalty of four percent on all net sales generated from the licensed biosensor technology.\nChief Legal Officer: That represents an equitable resolution. What about the cross-licensing provision for any newly developed improvements?\nDouglas: The agreement contains a reciprocal grant-back clause. Furthermore, they consented to formally dismiss all outstanding patent infringement litigation currently pending before the international trade tribunal.`,
    dialogueRoles: {
      chiefLegalOfficer: 'Fiona (Chief Legal Officer, Corporate IP)',
      seniorPatentAttorney: 'Douglas (Senior Patent Litigator)',
    },
    questions: [
      {
        id: 'iq-1',
        question: 'What financial compensation will Orion Healthcare provide under the licensing contract?',
        questionJa: 'ライセンス契約に基づき、Orion Healthcare社はどのような金銭的補償を提供しますか？',
        options: [
          'A monthly retainer of fifty thousand dollars only',
          'A 2 million dollar upfront fee plus a 4 percent running royalty on net sales',
          'A 50 percent equity share in their pharmaceutical subsidiary',
          'Payment in corporate bonds maturing in ten years',
        ],
        correctIndex: 1,
        explanationZh: 'Douglas 說明「upfront license fee of two million dollars, accompanied by a quarterly running royalty of four percent on all net sales（兩百萬美元預付授權金，加上按淨銷售額百分之四提撥的季度持續權利金）」。',
        explanationJa: '「前払いライセンス料200万ドルに加え、純売上高の4％のランニングロイヤルティ」と述べています。',
      },
      {
        id: 'iq-2',
        question: 'What legal action will Orion Healthcare take regarding existing disputes?',
        questionJa: '既存の紛争に関して、Orion Healthcare社はどのような法的措置を取りますか？',
        options: [
          'File an injunction against manufacturing facilities',
          'Appeal the dispute to the Supreme Court immediately',
          'Formally dismiss all outstanding patent infringement litigation',
          'Demand a full refund of previous legal expenses',
        ],
        correctIndex: 2,
        explanationZh: 'Douglas 指出對方同意「formally dismiss all outstanding patent infringement litigation currently pending（正式撤回目前審理中的所有專利侵權訴訟）」。',
        explanationJa: '「現在係属中の未解決特許侵害訴訟をすべて正式に取り下げる（dismiss）」と述べています。',
      },
    ],
    ipKeywordsTipsJa: 'TOEICでは「intellectual property（知的財産）」「patent infringement（特許侵害）」「royalty fee（特許使用料・ロイヤルティ）」「non-exclusive license（非独占的実施権）」が頻出です。',
  },
]
