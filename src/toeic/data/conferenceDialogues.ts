/**
 * TOEIC 多益英語：商務視訊會議、線上簡報與 Q&A 聽力特訓題庫 (Online Conference & Presentation)
 * 涵蓋多益 Part 3/4 現代職場高頻話題：線上會議 (Webinar / Virtual Meeting)、螢幕共享、靜音/解除靜音 (Mute/Unmute) 與簡報問答。
 */

export interface ConferenceScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    host: string
    speaker: string
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
  virtualMeetingTipsJa: string
}

export const CONFERENCE_SCENARIOS: ConferenceScenarioItem[] = [
  {
    id: 'conf-screen-sharing',
    title: '跨國視訊會議：螢幕共享與簡報提問',
    titleJa: 'オンラインビデオ会議：画面共有とプレゼン質疑応答（Q&A）',
    icon: '💻',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Host: Good morning everyone, thanks for joining our quarterly marketing sync. Before we begin, could whoever has background noise please put themselves on mute? Rachel, are you ready to share your slides?\nRachel: Yes, I believe I have co-host permissions now. Can everyone see my screen? We are looking at the Q3 user acquisition metrics.\nHost: Yes, the slide is coming through loud and clear. Please go ahead.\nRachel: Great. As you can see on the third chart, our social media ad campaign drove a forty percent surge in qualified leads. However, our server response times dipped slightly during peak traffic. At the end of the presentation, we will open the floor for questions.`,
    dialogueRoles: {
      host: 'David (Meeting Facilitator)',
      speaker: 'Rachel (Marketing Lead)',
    },
    questions: [
      {
        id: 'cq-1',
        question: 'What does the meeting host ask attendees to do at the beginning?',
        questionJa: '司会者は冒頭で参加者に何を要請していますか？',
        options: [
          'Turn on their video cameras',
          'Mute their microphones if there is background noise',
          'Send questions via the chat box',
          'Download the latest quarterly report',
        ],
        correctIndex: 1,
        explanationZh: '會議主持人要求「could whoever has background noise please put themselves on mute（有背景噪音者請先靜音）」。',
        explanationJa: '「周囲に雑音がある人はミュート（消音）にしてください」と要請しています。',
      },
      {
        id: 'cq-2',
        question: 'What happened during the peak traffic period according to Rachel?',
        questionJa: 'Rachelによると、トラフィックのピーク時に何が発生しましたか？',
        options: [
          'Advertising costs doubled',
          'Server response times dipped slightly',
          'New customer sign-ups were paused',
          'The presentation slides disconnected',
        ],
        correctIndex: 1,
        explanationZh: '簡報者指出「server response times dipped slightly during peak traffic（尖峰時段伺服器響應時間稍有下滑）」。',
        explanationJa: '「サーバーの応答速度がわずかに低下した（dipped slightly）」と報告しています。',
      },
    ],
    virtualMeetingTipsJa: '現代TOEICでは「on mute（ミュート状態）」「share one\'s screen（画面共有する）」「open the floor for questions（質疑応答に移る）」が極めて高頻度で出題されます。',
  },
]
