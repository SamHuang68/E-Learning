/**
 * TOEIC 多益英語：反海外腐敗法 FCPA 企業合規、第三方代理商盡職調查特訓題庫 (FCPA & Anti-Corruption Compliance)
 * 涵蓋多益 Part 3/4/7 最常出現的美國反海外腐敗法 (Foreign Corrupt Practices Act / FCPA)、反賄賂條款 (Anti-Bribery Provisions)、外國公務員不正當利益 (Prohibition of Corrupt Payments to Foreign Officials)、第三方中介盡職審查 (Third-Party Intermediary Due Diligence)、全面禁止疏通費 (Ban on Facilitation Payments) 及內部舉報人保護熱線 (Confidential Whistleblower System)。
 */

export interface FcpaComplianceScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    chiefComplianceOfficer: string
    regionalSalesDirector: string
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
  fcpaComplianceKeywordsTipsJa: string
}

export const FCPA_COMPLIANCE_SCENARIOS: FcpaComplianceScenarioItem[] = [
  {
    id: 'fcpa-anti-corruption-audit',
    title: '跨國招標合規審查：第三方中介經紀人巨額諮詢費與 FCPA 賄賂紅旗警訊',
    titleJa: '国際入札コンプライアンス審査：仲介業者の不透明な高額報酬と FCPA 贈賄レッドフラッグ',
    icon: '⚖️',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Chief Compliance Officer: Gregory, our automated compliance monitoring system flagged an urgent red flag regarding the prospective hospital equipment tender in Jakarta. Your regional division requested approval for a three hundred thousand dollar success fee payable to a local third-party consultant.\nGregory: Yes, Victoria. That consultant was recommended by municipal authorities to expedite the ministerial customs import permits and regulatory safety certifications.\nChief Compliance Officer: Under the US Foreign Corrupt Practices Act and our corporate code of ethics, that fee structure presents unacceptable bribery exposure. The consultant refused to disclose their beneficial ownership or submit to our standard forensic anti-corruption audit.\nGregory: Does this mean we must withdraw our engagement with that local intermediary?\nChief Compliance Officer: Precisely. We maintain zero tolerance for corrupt payments or off-the-books facilitation slush funds. Any compensation must reflect fair market value for documented legitimate services, and all third parties must sign our certified anti-bribery undertaking.`,
    dialogueRoles: {
      chiefComplianceOfficer: 'Victoria (Chief Compliance Officer)',
      regionalSalesDirector: 'Gregory (Regional Sales Director)',
    },
    questions: [
      {
        id: 'fcpa-1',
        question: 'What specific red flag triggered the compliance department\'s intervention?',
        questionJa: 'コンプライアンス部門の介入を引き起こした具体的な「レッドフラッグ（警告）」は何ですか？',
        options: [
          'A factory manufacturing defect that delayed hospital bed deliveries',
          'A three-hundred-thousand-dollar success fee to a consultant who refused ownership disclosure',
          'A currency devaluation occurring in the Southeast Asian market',
          'An unauthorized company advertisement aired on local television',
        ],
        correctIndex: 1,
        explanationZh: 'Victoria 指出合規紅旗為「a three hundred thousand dollar success fee payable to a local third-party consultant who refused to disclose beneficial ownership（支付給拒絕揭露最終受益人擁有權的當地中介顧問三十萬美元成功酬金）」。',
        explanationJa: '「実質的支配者の開示を拒絶したコンサルタントに対する30万ドルの成功報酬（success fee）」が不正リスクと判定されました。',
      },
      {
        id: 'fcpa-2',
        question: 'What is the company\'s policy regarding third-party compensation under the FCPA guidelines?',
        questionJa: 'FCPAガイドラインに基づく第三者への報酬に関する企業方針は何ですか？',
        options: [
          'All fees must be wired through offshore bank accounts in cash',
          'Payments must reflect fair market value for documented legitimate services with certified anti-bribery undertakings',
          'Consultants are allowed to pay minor facilitation tips to customs officers',
          'Only state-owned enterprises are permitted to act as sales brokers',
        ],
        correctIndex: 1,
        explanationZh: 'Victoria 強調所有報酬必須符合「fair market value for documented legitimate services, and all third parties must sign our certified anti-bribery undertaking（反映具合法證明文件之合理市場公允價值，且必須簽署反賄賂承諾保證書）」。',
        explanationJa: '「正当な業務に対する公正な市場価値（fair market value）を反映し、反贈賄誓約書を締結しなければならない」と規定されています。',
      },
    ],
    fcpaComplianceKeywordsTipsJa: 'TOEICでは「FCPA / Foreign Corrupt Practices Act（米国連邦海外腐敗行為防止法）」「red flag（不正の兆候・警告信号）」「beneficial ownership（実質的所有者）」「facilitation payment（円滑化賄賂／小額便宜供与金）」「code of ethics（企業倫理綱領）」が頻出です。',
  },
]
