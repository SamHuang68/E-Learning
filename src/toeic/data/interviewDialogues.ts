/**
 * TOEIC 多益英語：商務人力資源面試、職缺招聘與福利特訓題庫 (HR & Job Interview Practice)
 * 涵蓋多益 Part 3/4/7 最常出現的面試流程 (Job Interview)、職缺資格要求 (Qualifications)、福利薪酬 (Compensation & Benefits) 與錄取通知 (Offer Letter)。
 */

export interface InterviewScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    interviewer: string
    candidate: string
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
  hrKeywordsTipsJa: string
}

export const INTERVIEW_SCENARIOS: InterviewScenarioItem[] = [
  {
    id: 'interview-senior-analyst',
    title: '資深數據分析師求職面試與薪資福利',
    titleJa: 'シニアデータアナリストの採用面接と福利厚生（Compensation & Benefits）',
    icon: '👔',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Interviewer: Thank you for coming in today, Arthur. We were very impressed by your extensive background in business intelligence at Apex Logistics. Could you walk us through how you handled data migration across legacy systems?\nArthur: Absolutely. In my previous role, I spearheaded the transition from on-premise servers to a cloud data warehouse, which cut query latency by thirty percent while ensuring strict compliance with data privacy regulations.\nInterviewer: That aligns perfectly with our upcoming infrastructure overhaul. Regarding our benefits package, we offer comprehensive health insurance, a competitive 401(k) matching plan, and flexible remote work options. If selected, would you be available to start next month after a three-month probationary period?\nArthur: Yes, next month fits my transition timeline seamlessly.`,
    dialogueRoles: {
      interviewer: 'Brenda (HR Director, Nexus Tech)',
      candidate: 'Arthur (Senior Candidate)',
    },
    questions: [
      {
        id: 'iq-1',
        question: 'What accomplishment does Arthur highlight from his previous role?',
        questionJa: 'Arthurは前職でのどのような実績をアピールしていますか？',
        options: [
          'He increased advertising revenue',
          'He spearheaded a cloud data migration that reduced query latency',
          'He managed international customer service calls',
          'He designed the company logo and branding',
        ],
        correctIndex: 1,
        explanationZh: 'Arthur 明確說明「spearheaded the transition from on-premise servers to a cloud data warehouse, which cut query latency by thirty percent（主導雲端資料庫遷移，使查詢延遲減少 30%）」。',
        explanationJa: '「クラウドデータウェアハウスへの移行を主導し、クエリの遅延を30%削減した」と回答しています。',
      },
      {
        id: 'iq-2',
        question: 'What is mentioned about the employment terms?',
        questionJa: '雇用条件について言及されている点は何ですか？',
        options: [
          'Full-time relocation to another country is mandatory',
          'There is a three-month probationary period',
          'No remote work is permitted',
          'Health insurance is not provided during the first year',
        ],
        correctIndex: 1,
        explanationZh: '人資主管提及「after a three-month probationary period（經過 3 個月試用期）」。',
        explanationJa: '「3ヶ月の試用期間（probationary period）がある」と明確に述べています。',
      },
    ],
    hrKeywordsTipsJa: 'TOEICでは「probationary period（試用期間）」「benefits package（福利厚生一式）」「spearhead（主導する）」「on-premise vs cloud」が頻出キーワードです。',
  },
]
