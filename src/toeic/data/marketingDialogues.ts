/**
 * TOEIC 多益英語：商務行銷、社群廣告與公關宣傳特訓題庫 (Marketing & PR Campaigns)
 * 涵蓋多益 Part 3/4/7 最常出現的產品發布 (Product Launch)、社交媒體行銷 (Social Media Campaign)、網紅合作 (Influencer) 與市場調查 (Market Survey)。
 */

export interface MarketingScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    marketingDirector: string
    brandSpecialist: string
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
  marketingKeywordsTipsJa: string
}

export const MARKETING_SCENARIOS: MarketingScenarioItem[] = [
  {
    id: 'mkt-eco-smartwatch',
    title: '環保智慧手錶社群行銷活動與發布會',
    titleJa: 'エコスマートウォッチのSNSマーケティングキャンペーンと新製品発表会',
    icon: '📱',
    targetAccent: 'en-GB',
    accentLabel: '英式口音 🇬🇧',
    audioScript: `Marketing Director: Good afternoon, team. With the upcoming launch of our eco-friendly smartwatch next month, we need to finalize our promotional timeline. Chloe, how are our influencer partnerships shaping up?\nChloe: Everything is on track. We have secured collaborations with twelve prominent tech vloggers and fitness lifestyle influencers. They will be posting unboxing reviews simultaneously on launch day to maximize social media reach.\nMarketing Director: Excellent. What about our targeted digital ad spend?\nChloe: We have allocated sixty percent of our marketing budget to short-form video ads across major platforms, focusing specifically on the recycled titanium chassis and seven-day battery endurance. Early analytics from our email teasers indicate a twenty-five percent higher click-through rate compared to last year's release.`,
    dialogueRoles: {
      marketingDirector: 'Julian (Head of Brand Marketing)',
      brandSpecialist: 'Chloe (Campaign Specialist)',
    },
    questions: [
      {
        id: 'mq-1',
        question: 'What strategy are the influencers using on the launch day?',
        questionJa: 'インフルエンサーは発売当日にどのようなプロモーション戦略を実施しますか？',
        options: [
          'Hosting in-person store signings',
          'Posting unboxing reviews simultaneously',
          'Offering discounts exclusively for radio listeners',
          'Conducting phone surveys with existing users',
        ],
        correctIndex: 1,
        explanationZh: 'Chloe 指出「They will be posting unboxing reviews simultaneously on launch day to maximize social media reach（他們將在發布日同步發布開箱評測以極大化社群觸及）」。',
        explanationJa: '「発売当日に一斉に開封レビュー（unboxing reviews simultaneously）を投稿する」と回答しています。',
      },
      {
        id: 'mq-2',
        question: 'What positive indicator did early email teasers show?',
        questionJa: '事前のティザーメールから得られた良好な指標は何ですか？',
        options: [
          'A twenty-five percent higher click-through rate',
          'A fifty percent reduction in production costs',
          'Full pre-order inventory sell-out within one hour',
          'Thousands of direct mail replies from retail stores',
        ],
        correctIndex: 0,
        explanationZh: 'Chloe 提及「a twenty-five percent higher click-through rate compared to last year\'s release（點擊率相較去年發布提升 25%）」。',
        explanationJa: '「前年の新製品に比べてクリック率が25%向上した（25% higher click-through rate）」と報告しています。',
      },
    ],
    marketingKeywordsTipsJa: 'TOEICでは「click-through rate（クリック率/CTR）」「target audience（ターゲット層）」「launch event（新製品発表会）」「brand awareness（ブランド認知度）」が最頻出です。',
  },
]
