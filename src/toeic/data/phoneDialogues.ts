/**
 * TOEIC 多益英語：商務電話與語音信箱特訓題庫 (Phone & Voicemail Practice)
 * 涵蓋多益 Part 3 對話與 Part 4 簡短獨白中最高頻之語音信箱 (Voicemail)、轉接電話 (Call Transfer) 與預約改期。
 */

export interface PhoneScenarioItem {
  id: string
  title: string
  titleJa: string
  callerName: string
  callerCompany: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  questions: Array<{
    id: string
    question: string
    questionJa: string
    options: string[]
    correctIndex: number
    clueLocation?: string
    explanationZh: string
    explanationJa: string
  }>
}

export const PHONE_SCENARIOS: PhoneScenarioItem[] = [
  {
    id: 'phone-reschedule',
    title: '專案會議改期與留話語音信箱',
    titleJa: 'プロジェクト会議の日程変更と伝言ボイスメール（Voicemail）',
    callerName: 'Evelyn Reed',
    callerCompany: 'Vanguard Consulting',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Hello, this is Evelyn Reed calling from Vanguard Consulting for Mr. Davies. I am calling regarding our strategy meeting scheduled for tomorrow afternoon at 2:00 PM. Unfortunately, my connecting flight from Chicago has been delayed, so I will not be able to arrive in Seattle before 5:00 PM. Could we reschedule the presentation for Thursday morning at 10:00 AM instead? Please call me back at extension 4082 as soon as you get this message. Thank you.`,
    questions: [
      {
        id: 'pq-1',
        question: 'Why is the caller unable to attend the scheduled meeting?',
        questionJa: '電話主が予定通りの会議に出席できない理由は何ですか？',
        options: [
          'Her connecting flight was delayed',
          'She had a medical appointment',
          'Her presentation slides were lost',
          'The office was closed for renovation',
        ],
        correctIndex: 0,
        explanationZh: '留言明確說明「my connecting flight from Chicago has been delayed（芝加哥轉機航班延誤）」。',
        explanationJa: '「シカゴからの乗り継ぎ便が遅延したため」と明確に述べています。',
      },
      {
        id: 'pq-2',
        question: 'What time does Evelyn suggest for the rescheduled meeting?',
        questionJa: 'Evelynは変更後の日時としていつを提案していますか？',
        options: [
          'Tomorrow at 5:00 PM',
          'Thursday at 10:00 AM',
          'Friday at 2:00 PM',
          'Next Monday morning',
        ],
        correctIndex: 1,
        clueLocation: 'Could we reschedule the presentation for Thursday morning at 10:00 AM instead?',
        explanationZh: '電話中提議改在「Thursday morning at 10:00 AM（週四上午 10:00）」。',
        explanationJa: '「木曜日の午前10時」への日程変更を提案しています。',
      },
    ],
  },
]
