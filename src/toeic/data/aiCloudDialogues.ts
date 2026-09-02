/**
 * TOEIC 多益英語：商務企業人工智慧轉型、雲端運算與資料中心特訓題庫 (AI Transformation & Cloud Infrastructure)
 * 涵蓋多益 Part 3/4/7 最常出現的在地化推論架構 (On-Premise LLM Inference Deployment)、高頻寬 GPU 運算集群採購 (High-Bandwidth GPU Server Procurement)、雲端服務水準協議 (Cloud SLA 99.99% Uptime Guarantee) 與機敏資料隱私治理 (Data Governance & Air-Gapped Security)。
 */

export interface AiCloudScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    chiefTechnologyOfficer: string
    infrastructureArchitect: string
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
  aiCloudKeywordsTipsJa: string
}

export const AI_CLOUD_SCENARIOS: AiCloudScenarioItem[] = [
  {
    id: 'ai-cloud-procurement',
    title: '跨國金融集團自建本地端 AI 推論集群與雲端備援 SLA 談判',
    titleJa: '金融機関のオンプレミスAI推論クラスタ構築とクラウドSLA交渉',
    icon: '🤖',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Chief Technology Officer: Good afternoon, Marcus. Have we finalized the infrastructure blueprint for our proprietary enterprise AI customer service engine?\nMarcus: Yes, Beverly. To satisfy regulatory compliance and ensure zero leakage of customer financial records, we are deploying an air-gapped on-premise inference cluster with dedicated high-bandwidth GPU accelerators.\nChief Technology Officer: Excellent choice. What about our failover redundancy and hybrid cloud backup provider?\nMarcus: We negotiated an enterprise service level agreement guaranteeing 99.99 percent uptime. Any scheduled server firmware maintenance must occur strictly during off-peak weekend maintenance windows with twelve hours of advance notification.`,
    dialogueRoles: {
      chiefTechnologyOfficer: 'Beverly (Group Chief Technology Officer)',
      infrastructureArchitect: 'Marcus (Lead Cloud Infrastructure Architect)',
    },
    questions: [
      {
        id: 'aq-1',
        question: 'Why did the financial group choose an air-gapped on-premise AI cluster?',
        questionJa: '金融グループが完全隔離（air-gapped）のオンプレミスAIクラスタを選択した理由は何ですか？',
        options: [
          'To cut electrical power costs by ninety percent',
          'To satisfy compliance and prevent customer financial data leakage',
          'Because cloud service providers are completely banned by law',
          'To eliminate the need for software engineering personnel',
        ],
        correctIndex: 1,
        explanationZh: 'Marcus 表示為了「satisfy regulatory compliance and ensure zero leakage of customer financial records（符合法規合規並確保客戶金融資料零外洩）」，採用實體隔離本地端推論集群。',
        explanationJa: '「規制遵守を満たし、顧客の金融記録のデータ漏洩を完全に防ぐため」と述べています。',
      },
      {
        id: 'aq-2',
        question: 'What term is specified in the hybrid cloud service level agreement (SLA)?',
        questionJa: 'ハイブリッドクラウドのサービス品質保証（SLA）で規定されている条件は何ですか？',
        options: [
          'Unrestricted unannounced maintenance during business hours',
          'Guaranteed 99.99 percent uptime with maintenance during weekend windows',
          'A mandatory hardware replacement cycle every six months',
          'Zero reimbursement for unexpected service disruptions',
        ],
        correctIndex: 1,
        explanationZh: 'Marcus 指出「agreement guaranteeing 99.99 percent uptime... maintenance must occur strictly during off-peak weekend maintenance windows（保證 99.99% 正常運作時間，維護僅限週末離峰時段）」。',
        explanationJa: '「稼働率99.99％の保証と、週末のオフピーク時間帯での計画メンテナンス」が規定されています。',
      },
    ],
    aiCloudKeywordsTipsJa: 'TOEICでは「on-premise（自社運用・オンプレミス）」「uptime / downtime（稼働・停止時間）」「redundancy（冗長性・バックアップ）」「service level agreement（SLA保証契約）」が頻出です。',
  },
]
