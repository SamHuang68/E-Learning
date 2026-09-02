/**
 * TOEIC 多益英語：商務公共關係、媒體記者會與新聞發布特訓題庫 (Public Relations & Press Release)
 * 涵蓋多益 Part 3/4/7 最常出現的新聞發布禁令 (Press Embargo)、媒體新聞包 (Media Kit)、新聞稿核簽 (Executive Sign-off) 與公關危機處理 (Crisis Communications & Spokesperson)。
 */

export interface PrScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    prDirector: string
    mediaRelationsManager: string
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
  prKeywordsTipsJa: string
}

export const PR_SCENARIOS: PrScenarioItem[] = [
  {
    id: 'pr-product-launch',
    title: '環保旗艦新品全球發表會新聞稿核發與媒體禁令',
    titleJa: 'エコ新製品グローバル発表記者会見と情報解禁（プレスエンバーゴ）',
    icon: '📰',
    targetAccent: 'en-GB',
    accentLabel: '英式口音 🇬🇧',
    audioScript: `PR Director: Good afternoon, Julian. The Chief Executive Officer has just given final executive sign-off on the press release for our carbon-neutral smartwatch.\nJulian: Excellent news. Have we established the press embargo time for tech journalists?\nPR Director: Yes, the embargo lifts precisely at nine o'clock tomorrow morning Central European Time. Please ensure the digital media kit—including high-resolution product photography, executive bios, and technical specifications—is securely distributed to our accredited media list this evening.\nJulian: Right away. I will also brief our official corporate spokesperson regarding potential inquiries about component supply chain sustainability during tomorrow's live Q&A session.`,
    dialogueRoles: {
      prDirector: 'Gillian (Director of Corporate Communications)',
      mediaRelationsManager: 'Julian (Senior Media Relations Lead)',
    },
    questions: [
      {
        id: 'pq-1',
        question: 'When will journalists be allowed to publish articles about the new product?',
        questionJa: 'ジャーナリストが新製品に関する記事の公開を許可されるのはいつですか？',
        options: [
          'Immediately after receiving the email',
          'At 9:00 AM tomorrow Central European Time',
          'Next Monday after the trade exhibition',
          'Only after the product officially hits store shelves',
        ],
        correctIndex: 1,
        explanationZh: '公關總監指出「the embargo lifts precisely at nine o\'clock tomorrow morning Central European Time（新聞禁令將於明天上午九點準時解除）」。',
        explanationJa: '「情報解禁（embargo）は明日の午前9時（中央ヨーロッパ時間）ちょうど」と述べています。',
      },
      {
        id: 'pq-2',
        question: 'What materials are included in the digital media kit?',
        questionJa: 'デジタルプレスキット（media kit）にはどのような資料が含まれていますか？',
        options: [
          'Customer credit card receipts and sales targets',
          'High-resolution photos, executive bios, and technical specs',
          'Confidential source code for the mobile software',
          'Employee salary schedules and office floor plans',
        ],
        correctIndex: 1,
        explanationZh: '經理說明媒體包包含「high-resolution product photography, executive bios, and technical specifications（高解析度產品照片、高管簡歷與技術規格）」。',
        explanationJa: '「高解像度写真、役員経歴書、技術仕様書」が含まれています。',
      },
    ],
    prKeywordsTipsJa: 'TOEICでは「press release（プレスリリース）」「embargo（報道解禁日時）」「media kit（報道用資料一式）」「spokesperson（公式広報担当者）」が頻出です。',
  },
]
