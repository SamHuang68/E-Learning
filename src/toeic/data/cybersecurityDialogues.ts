/**
 * TOEIC 多益英語：商務資訊科技、網路資安與系統維護特訓題庫 (IT & Cybersecurity)
 * 涵蓋多益 Part 3/4/7 最常出現的網路資安威脅 (Cybersecurity Incident)、雙因子驗證 (Two-Factor Authentication / 2FA)、伺服器停機維護 (Scheduled Maintenance) 與雲端異地備份 (Offsite Cloud Backup)。
 */

export interface CybersecurityScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    chiefSecurityOfficer: string
    networkAdmin: string
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
  itKeywordsTipsJa: string
}

export const CYBERSECURITY_SCENARIOS: CybersecurityScenarioItem[] = [
  {
    id: 'cyber-phishing-breach',
    title: '釣魚郵件資安演練與強制實施雙因子驗證 (2FA)',
    titleJa: '標的型フィッシング演習と全社2要素認証（2FA）の義務化',
    icon: '🛡️',
    targetAccent: 'en-CA',
    accentLabel: '加式口音 🇨🇦',
    audioScript: `Security Officer: Good morning, team. Following our unannounced phishing simulation last week, seventeen employees clicked on malicious mock links. To mitigate credential theft, management has mandated the immediate rollout of hardware-based two-factor authentication for all enterprise logins.\nNetwork Admin: Understood. How will this impact employees who work remotely?\nSecurity Officer: They will need to register an authenticator security key on their mobile devices before next Monday. In addition, our core database servers will undergo scheduled maintenance this Saturday midnight, resulting in approximately two hours of system downtime. Please notify all department heads today so they can back up any active project files beforehand.`,
    dialogueRoles: {
      chiefSecurityOfficer: 'Elena (Chief Information Security Officer)',
      networkAdmin: 'Marcus (Senior Network Administrator)',
    },
    questions: [
      {
        id: 'cq-1',
        question: 'What security policy has management decided to mandate immediately?',
        questionJa: '経営陣が直ちに義務化を決定したセキュリティ方針は何ですか？',
        options: [
          'Banning personal laptops from the office',
          'Deploying hardware-based two-factor authentication',
          'Disabling all external email communications',
          'Replacing all desktop computers with tablets',
        ],
        correctIndex: 1,
        explanationZh: '資安長明確宣布「mandated the immediate rollout of hardware-based two-factor authentication（強制實施硬體雙因子驗證）」。',
        explanationJa: '「ハードウェアベースの2要素認証（2FA）の即時展開を義務付けた」と説明しています。',
      },
      {
        id: 'cq-2',
        question: 'What should department heads remind their teams to do before Saturday?',
        questionJa: '各部門長は土曜日までにチームに何を促すべきですか？',
        options: [
          'Back up active project files before system downtime',
          'Submit vacation requests for next week',
          'Update company profile photos',
          'Reinstall the operating system',
        ],
        correctIndex: 0,
        explanationZh: '資安長要求通知各部門主管「back up any active project files beforehand（事前備份所有進行中的專案檔案）」。',
        explanationJa: '「システム停止（downtime）の前に、作業中のファイルをバックアップするよう周知する」と指示しています。',
      },
    ],
    itKeywordsTipsJa: 'TOEICでは「two-factor authentication（2要素認証）」「credential theft（認証情報の窃盗）」「scheduled maintenance（定期保守点検）」「system downtime（稼働停止時間）」が頻出です。',
  },
]
