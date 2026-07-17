export type ScenarioOption = {
  text: string
  register: string
  correct: boolean
}

export type ScenarioBeat = {
  prompt: string
  options: ScenarioOption[]
}

export type ScenarioScript = {
  id: string
  title: string
  scene: string
  beats: ScenarioBeat[]
}

export const jaScenarios: ScenarioScript[] = [
  {
    id: 'ja-shop',
    title: '店員：退貨詢問',
    scene: '你在文具店想詢問是否能退換商品。',
    beats: [
      {
        prompt: '你要先向店員開口。',
        options: [
          { text: 'すみません、返品できますか。', register: '丁寧', correct: true },
          { text: 'これ返す。', register: '普通', correct: false },
          { text: '返品しろ。', register: '命令', correct: false },
        ],
      },
      {
        prompt: '店員請你說明原因。',
        options: [
          { text: 'サイズを間違えてしまいました。', register: '丁寧', correct: true },
          { text: 'サイズが違うんだよ。', register: '粗略', correct: false },
          { text: '店が悪いです。', register: '直接', correct: false },
        ],
      },
      {
        prompt: '最後要表達感謝。',
        options: [
          { text: 'ご対応ありがとうございます。', register: '丁寧', correct: true },
          { text: 'まあいいです。', register: '冷淡', correct: false },
          { text: '早くして。', register: '失禮', correct: false },
        ],
      },
    ],
  },
  {
    id: 'ja-coworker',
    title: '同事：協調時程',
    scene: '你和同事討論報告交付時間。',
    beats: [
      {
        prompt: '同事問你今天是否能完成。',
        options: [
          { text: '今日中は少し難しそうです。', register: '丁寧', correct: true },
          { text: '無理。', register: '過短', correct: false },
          { text: 'あなたがやって。', register: '推責', correct: false },
        ],
      },
      {
        prompt: '你提出替代方案。',
        options: [
          { text: '明日の午前中までなら提出できます。', register: '丁寧', correct: true },
          { text: '明日かな。知らないけど。', register: '曖昧', correct: false },
          { text: '来週でいいよね。', register: '擅自決定', correct: false },
        ],
      },
      {
        prompt: '你想請對方確認。',
        options: [
          { text: 'この予定で問題ないか確認していただけますか。', register: '丁寧', correct: true },
          { text: '確認して。', register: '命令', correct: false },
          { text: '問題ないでしょ。', register: '壓迫', correct: false },
        ],
      },
    ],
  },
  {
    id: 'ja-manager',
    title: '上司：進度回報',
    scene: '你向上司回報專案進度與風險。',
    beats: [
      {
        prompt: '上司問目前狀況。',
        options: [
          { text: '現在、全体の七割ほど完了しております。', register: '謙讓', correct: true },
          { text: 'だいたい終わってます。', register: '普通', correct: false },
          { text: '見れば分かります。', register: '失禮', correct: false },
        ],
      },
      {
        prompt: '你需要報告一個延遲風險。',
        options: [
          { text: '確認工程に想定より時間がかかっております。', register: '商務', correct: true },
          { text: 'ちょっと遅れます。', register: '含糊', correct: false },
          { text: '他部署のせいです。', register: '責任轉嫁', correct: false },
        ],
      },
      {
        prompt: '你提出補救措施。',
        options: [
          { text: '本日中に優先順位を見直し、明朝共有いたします。', register: '謙讓', correct: true },
          { text: 'まあ頑張ります。', register: '含糊', correct: false },
          { text: '残業すればいいでしょう。', register: '粗略', correct: false },
        ],
      },
    ],
  },
  {
    id: 'ja-client',
    title: '客戶：需求確認',
    scene: '你在電話中向客戶確認修改需求。',
    beats: [
      {
        prompt: '客戶提出新需求，你先回應。',
        options: [
          { text: 'ご要望を確認させていただきます。', register: '謙讓', correct: true },
          { text: 'それは無理です。', register: '直接拒絕', correct: false },
          { text: 'はいはい。', register: '輕率', correct: false },
        ],
      },
      {
        prompt: '你需要確認交期影響。',
        options: [
          { text: '納期への影響を確認し、本日中にご連絡いたします。', register: '商務', correct: true },
          { text: '遅くなるかもしれませんね。', register: '含糊', correct: false },
          { text: '納期は変えます。', register: '單方決定', correct: false },
        ],
      },
      {
        prompt: '結束通話前要收尾。',
        options: [
          { text: '引き続きどうぞよろしくお願いいたします。', register: '商務', correct: true },
          { text: 'じゃあ。', register: '過度隨意', correct: false },
          { text: 'もう大丈夫ですか。', register: '不耐', correct: false },
        ],
      },
    ],
  },
]

export const enScenarios: ScenarioScript[] = [
  {
    id: 'en-email',
    title: 'Email: deadline update',
    scene: 'You need to tell a colleague that a draft will be late.',
    beats: [
      {
        prompt: 'Open the email politely.',
        options: [
          { text: 'I hope you are doing well.', register: 'polite', correct: true },
          { text: 'Listen, the draft is late.', register: 'abrupt', correct: false },
          { text: 'Bad news.', register: 'too casual', correct: false },
        ],
      },
      {
        prompt: 'Explain the delay.',
        options: [
          { text: 'The data review is taking longer than expected.', register: 'professional', correct: true },
          { text: 'The data is annoying.', register: 'emotional', correct: false },
          { text: 'It is not my fault.', register: 'defensive', correct: false },
        ],
      },
      {
        prompt: 'Close with a new time.',
        options: [
          { text: 'I will send the revised draft by 3 p.m. tomorrow.', register: 'specific', correct: true },
          { text: 'I will send it sometime.', register: 'vague', correct: false },
          { text: 'Wait for it.', register: 'rude', correct: false },
        ],
      },
    ],
  },
  {
    id: 'en-meeting',
    title: 'Meeting: clarify action items',
    scene: 'You are chairing a short project meeting.',
    beats: [
      {
        prompt: 'Bring the group back to the agenda.',
        options: [
          { text: 'Let us return to the main agenda item.', register: 'facilitation', correct: true },
          { text: 'Stop talking about that.', register: 'rude', correct: false },
          { text: 'Anyway, whatever.', register: 'dismissive', correct: false },
        ],
      },
      {
        prompt: 'Assign an action item.',
        options: [
          { text: 'Could you prepare the cost summary by Friday?', register: 'polite request', correct: true },
          { text: 'You do the cost thing.', register: 'unclear', correct: false },
          { text: 'Someone should handle it.', register: 'vague', correct: false },
        ],
      },
      {
        prompt: 'Confirm next steps.',
        options: [
          { text: 'To confirm, we have three next steps before Friday.', register: 'clear', correct: true },
          { text: 'You all know what to do.', register: 'unclear', correct: false },
          { text: 'Meeting over.', register: 'abrupt', correct: false },
        ],
      },
    ],
  },
  {
    id: 'en-client',
    title: 'Client: service issue',
    scene: 'A client reports that a delivery arrived late.',
    beats: [
      {
        prompt: 'Acknowledge the concern.',
        options: [
          { text: 'I am sorry for the inconvenience this has caused.', register: 'empathetic', correct: true },
          { text: 'That happens sometimes.', register: 'dismissive', correct: false },
          { text: 'You should have called earlier.', register: 'blaming', correct: false },
        ],
      },
      {
        prompt: 'Offer an investigation.',
        options: [
          { text: 'I will check the shipping record and update you today.', register: 'professional', correct: true },
          { text: 'I guess I can look.', register: 'weak', correct: false },
          { text: 'Ask the courier yourself.', register: 'unhelpful', correct: false },
        ],
      },
      {
        prompt: 'Set expectation.',
        options: [
          { text: 'You can expect a clear response by 5 p.m.', register: 'specific', correct: true },
          { text: 'Maybe later.', register: 'vague', correct: false },
          { text: 'No promises.', register: 'negative', correct: false },
        ],
      },
    ],
  },
  {
    id: 'en-negotiation',
    title: 'Negotiation: timeline trade-off',
    scene: 'You need to negotiate a shorter timeline without sounding aggressive.',
    beats: [
      {
        prompt: 'State your constraint.',
        options: [
          { text: 'We are working with a tight launch window.', register: 'diplomatic', correct: true },
          { text: 'Your schedule is too slow.', register: 'blunt', correct: false },
          { text: 'Hurry up.', register: 'rude', correct: false },
        ],
      },
      {
        prompt: 'Ask for flexibility.',
        options: [
          { text: 'Would there be any flexibility on the review period?', register: 'diplomatic', correct: true },
          { text: 'Cut the review period.', register: 'command', correct: false },
          { text: 'You must change your process.', register: 'forceful', correct: false },
        ],
      },
      {
        prompt: 'Offer a trade-off.',
        options: [
          { text: 'If helpful, we can reduce the scope of the first release.', register: 'collaborative', correct: true },
          { text: 'Just remove whatever.', register: 'careless', correct: false },
          { text: 'We will not compromise.', register: 'rigid', correct: false },
        ],
      },
    ],
  },
]
