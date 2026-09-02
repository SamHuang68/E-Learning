/**
 * TOEIC 多益英語：雲端服務層級協議 SLA、可用性 99.99% 與停機服務點數補償特訓題庫 (Cloud SLA & Service Credits)
 * 涵蓋多益 Part 3/4/7 最常出現的雲端企業服務層級協議 (Enterprise Service Level Agreement / SLA)、99.99% 高可用性承諾 (Four Nines Uptime Commitment)、非計畫性停機事故 (Unscheduled Downtime Outage)、服務點數抵扣賠償 (Service Credits Reimbursement)、重大事件災難復原 (Disaster Recovery & Multi-AZ Failover) 及平均修復時間 (Mean Time to Resolution / MTTR)。
 */

export interface CloudSlaScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    chiefInformationOfficer: string
    cloudAccountExecutive: string
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
  cloudSlaKeywordsTipsJa: string
}

export const CLOUD_SLA_SCENARIOS: CloudSlaScenarioItem[] = [
  {
    id: 'cloud-sla-outage-credits',
    title: '跨國雲端平台非計畫停機：SLA 99.99% 違約認定與 25% 服務點數折抵',
    titleJa: 'クラウドプラットフォーム障害：SLA 99.99% 違反認定と 25% サービスクレジット返金',
    icon: '☁️',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Chief Information Officer: Derek, we experienced a forty-seven minute unscheduled outage on our European payment gateway cluster last Thursday. According to Section 4 of our enterprise SLA, our guaranteed monthly uptime is 99.99%.\nDerek: I sincerely apologize for the disruption, Karen. Our post-mortem analysis confirmed a fiber cut at our Frankfurt data center which delayed automated DNS failover to the Dublin availability zone.\nChief Information Officer: Given that our monthly downtime exceeded the permitted four minutes and twenty seconds for four-nines availability, we expect prompt processing of our service credits.\nDerek: Absolutely. Per our contract matrix, because availability dropped below 99.9% for the billing cycle, your organization is entitled to a 25% service credit on your monthly recurring infrastructure invoice. I have already applied the credit directly to your account.`,
    dialogueRoles: {
      chiefInformationOfficer: 'Karen (Chief Information Officer)',
      cloudAccountExecutive: 'Derek (Enterprise Cloud Account Executive)',
    },
    questions: [
      {
        id: 'sla-1',
        question: 'What caused the unscheduled downtime on the payment gateway cluster?',
        questionJa: '決済ゲートウェイクラスターの予期せぬダウンタイムの原因は何でしたか？',
        options: [
          'A catastrophic cyberattack on the database',
          'A fiber cut at the Frankfurt facility delaying DNS failover',
          'A sudden power outage across North America',
          'A software update deployed without administrative authorization',
        ],
        correctIndex: 1,
        explanationZh: 'Derek 指出故障原因為「a fiber cut at our Frankfurt data center which delayed automated DNS failover（法蘭克福機房光纖中斷導致 DNS 自動切換備援延誤）」。',
        explanationJa: '「フランクフルトデータセンターでの光ファイバー切断（fiber cut）によるDNSフェイルオーバーの遅延」が原因でした。',
      },
      {
        id: 'sla-2',
        question: 'What compensation is Karen\'s organization entitled to receive under the enterprise SLA?',
        questionJa: 'カレンの組織はエンタープライズSLAに基づきどのような補償を受け取る権利がありますか？',
        options: [
          'A complete cash refund with interest delivered via bank wire',
          'A 25% service credit applied to the monthly recurring invoice',
          'One year of complimentary hardware replacement',
          'An apology letter published on the vendor\'s official website',
        ],
        correctIndex: 1,
        explanationZh: 'Derek 確認 Karen 的公司享有「a 25% service credit on your monthly recurring infrastructure invoice（每月常態基礎架構帳單 25% 服務抵用點數折抵）」。',
        explanationJa: '月額インフラ請求書に対する「25%のサービスクレジット（25% service credit）」が適用されます。',
      },
    ],
    cloudSlaKeywordsTipsJa: 'TOEICでは「Service Level Agreement / SLA（サービス水準合意書）」「uptime guarantee（稼働率保証）」「unscheduled outage（予期せぬシステム停止）」「service credits（利用料金相殺クレジット）」「failover（冗長化切り替え）」が頻出です。',
  },
]
