/**
 * TOEIC 多益英語：商務供應鏈責任、無衝突礦產稽核與勞動人權審查特訓題庫 (Conflict Minerals & Labor Audit)
 * 涵蓋多益 Part 3/4/7 最常出現的供應鏈 ESG 審查 (Supply Chain Due Diligence)、無衝突礦產驗證 (Conflict-Free 3TG Minerals: Tantalum, Tin, Tungsten, Gold)、負責任礦產倡議 (Responsible Minerals Initiative / RMI)、獨立第三方社會責任與勞動條件稽核 (Third-Party Labor Standards Audit) 與剛果民主共和國產地溯源認證 (DRC Chain of Custody Certifications)。
 */

export interface ConflictMineralsScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    procurementDirector: string
    esgAuditLead: string
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
  conflictMineralsKeywordsTipsJa: string
}

export const CONFLICT_MINERALS_SCENARIOS: ConflictMineralsScenarioItem[] = [
  {
    id: 'conflict-minerals-audit',
    title: '智慧型手機晶片零組件採購：無衝突礦產 3TG 與供應商勞動條件稽核',
    titleJa: 'スマートフォン部品調達：紛争鉱物3TG調査とサプライチェーン労働監査',
    icon: '💎',
    targetAccent: 'en-GB',
    accentLabel: '英式口音 🇬🇧',
    audioScript: `Procurement Director: Good afternoon, Alistair. Have you received the quarterly due diligence summary regarding our tantalum and gold capacitor suppliers?\nAlistair: Yes, Eleanor. All forty-two smelters and refiners in our upstream tier-one network have been officially validated by the Responsible Minerals Initiative as conflict-free. None of the raw ores originated from covered conflict zones in the Democratic Republic of the Congo.\nProcurement Director: Splendid. What about the unannounced social and labor compliance audits conducted across our Southeast Asian manufacturing plants?\nAlistair: The third-party inspectors reported full compliance with ILO working hour ceilings and fair wage benchmarks. Minor safety infractions concerning emergency exit signage were remediated within forty-eight hours.`,
    dialogueRoles: {
      procurementDirector: 'Eleanor (Global Procurement Director)',
      esgAuditLead: 'Alistair (ESG & Supply Chain Compliance Lead)',
    },
    questions: [
      {
        id: 'cm-1',
        question: 'What positive finding did the ESG compliance lead report regarding the capacitor smelters?',
        questionJa: 'コンデンサの製錬所に関して、ESGコンプライアンス責任者はどのような好ましい結果を報告しましたか？',
        options: [
          'All smelters have relocated to European headquarters',
          'All forty-two smelters are validated as conflict-free by the RMI',
          'Smelting costs were cut by fifty percent across all categories',
          'The suppliers will phase out tantalum completely by next month',
        ],
        correctIndex: 1,
        explanationZh: 'Alistair 說明一級供應鏈中的 42 家冶煉廠與精煉廠全部經過 RMI 官方驗證為「conflict-free（無衝突礦產）」。',
        explanationJa: '「42社すべての製錬所が責任ある鉱物イニシアチブ（RMI）により紛争鉱物不使用（conflict-free）と検証された」と報告しています。',
      },
      {
        id: 'cm-2',
        question: 'How quickly were the minor safety infractions remediated at the manufacturing plants?',
        questionJa: '製造工場で見つかった軽微な安全上の不備はどれくらいの期間で是正されましたか？',
        options: [
          'Within forty-eight hours',
          'After six fiscal quarters',
          'Within thirty business days',
          'Prior to the upcoming shareholder meeting',
        ],
        correctIndex: 0,
        explanationZh: 'Alistair 提到關於緊急出口標示的輕微違規事項已在「within forty-eight hours（48 小時內）」完成改善補救。',
        explanationJa: '「48時間以内（within forty-eight hours）に是正された」と説明されています。',
      },
    ],
    conflictMineralsKeywordsTipsJa: 'TOEICでは「due diligence（デューデリジェンス・適正調査）」「conflict-free / conflict minerals（紛争鉱物）」「smelter / refiner（製錬所・精錬所）」「compliance audit（コンプライアンス監査）」「remediate（是正・改善する）」が頻出です。',
  },
]
