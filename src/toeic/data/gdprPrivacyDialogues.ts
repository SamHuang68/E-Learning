/**
 * TOEIC 多益英語：歐盟 GDPR 隱私保護、標準合約條款與跨境資料傳輸特訓題庫 (GDPR & International Data Privacy)
 * 涵蓋多益 Part 3/4/7 最常出現的歐盟資料保護法規 (General Data Protection Regulation / GDPR)、資料保護長 (Data Protection Officer / DPO)、跨境資料傳輸機制 (Standard Contractual Clauses / SCCs)、72小時資料外洩通報 (72-Hour Data Breach Notification Mandate)、資料主體存取與刪除請求 (Data Subject Access Request / DSAR) 及高額法定罰款 (Statutory Fines up to 4% of Global Turnover)。
 */

export interface GdprPrivacyScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    dataProtectionOfficer: string
    cloudInfrastructureDirector: string
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
  gdprPrivacyKeywordsTipsJa: string
}

export const GDPR_PRIVACY_SCENARIOS: GdprPrivacyScenarioItem[] = [
  {
    id: 'gdpr-privacy-compliance',
    title: '跨國雲端客戶資料管理：GDPR 標準合約條款與 72 小時外洩通報規範',
    titleJa: '多国籍クラウドデータ管理：GDPR 標準契約条項（SCC）と 72 時間情報漏洩報告義務',
    icon: '🛡️',
    targetAccent: 'en-GB',
    accentLabel: '英式口音 🇬🇧',
    audioScript: `Data Protection Officer: Good afternoon, Julian. Following our internal security audit of the European customer database, have we executed the updated Standard Contractual Clauses for our third-party analytics provider in Singapore?\nJulian: Yes, Fiona. Legal finalised the supplementary transfer impact assessment this morning. All transatlantic and Asia-Pacific telemetry is now end-to-end encrypted under our enterprise SCC framework.\nData Protection Officer: Excellent. Please ensure the incident response team reviews our mandatory notification protocol. Under Article 33 of the GDPR, any unauthorized access posing a risk to data subjects must be reported to the lead supervisory authority within seventy-two hours of becoming aware of the breach.\nJulian: Absolutely. Our automated SIEM alerts trigger instant escalation to both your desk and external counsel within fifteen minutes, avoiding any potential statutory fines of up to four percent of annual worldwide turnover.`,
    dialogueRoles: {
      dataProtectionOfficer: 'Fiona (Data Protection Officer)',
      cloudInfrastructureDirector: 'Julian (Director of Cloud Infrastructure)',
    },
    questions: [
      {
        id: 'gdpr-1',
        question: 'Under GDPR regulations, within how many hours must a data breach be reported to the supervisory authority?',
        questionJa: 'GDPR規制に基づき、データ漏洩は主たる監督当局へ何時間以内に報告されなければなりませんか？',
        options: [
          'Within twenty-four hours',
          'Within forty-eight hours',
          'Within seventy-two hours',
          'Within seven business days',
        ],
        correctIndex: 2,
        explanationZh: 'Fiona 明確指出依據 GDPR 第 33 條規定：「must be reported to the lead supervisory authority within seventy-two hours of becoming aware of the breach（必須在獲悉外洩事件起 72 小時內向主管機關通報）」。',
        explanationJa: '「インシデントの認知から72時間以内（within seventy-two hours）」に監督当局へ報告することが義務付けられています。',
      },
      {
        id: 'gdpr-2',
        question: 'What mechanism was executed to legally transfer European customer telemetry to the provider in Singapore?',
        questionJa: 'シンガポールのプロバイダーへ欧州顧客データを合法的に移転するためにどのような仕組みが締結されましたか？',
        options: [
          'A verbal gentlemen\'s agreement via video call',
          'Standard Contractual Clauses with a transfer impact assessment',
          'A public social media privacy statement',
          'An exemption waiver granted by the local chamber of commerce',
        ],
        correctIndex: 1,
        explanationZh: 'Julian 指出法務部門完成了傳輸衝擊評估，並在企業架構下簽署了「Standard Contractual Clauses（標準合約條款 SCCs）」。',
        explanationJa: '移転影響評価とともに「標準契約条項（Standard Contractual Clauses / SCC）」を締結して移転を適法化しました。',
      },
    ],
    gdprPrivacyKeywordsTipsJa: 'TOEICでは「compliance（法令遵守）」「data breach（情報漏洩）」「supervisory authority（監督当局）」「data subject（データ主体）」「Standard Contractual Clauses / SCCs（標準契約条項）」「turnover（売上高・回転率）」が頻出です。',
  },
]
