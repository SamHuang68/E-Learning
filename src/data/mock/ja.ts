export type MockQuestion = {
  id: string
  prompt: string
  choices: string[]
  answer: string
  tag: 'vocab' | 'grammar' | 'reading'
}

export const jaMockQuestions: MockQuestion[] = [
  {
    id: 'ja-m-01',
    prompt: '「切符」は何ですか。',
    choices: ['車票', '雨傘', '椅子', '鉛筆'],
    answer: '車票',
    tag: 'vocab',
  },
  {
    id: 'ja-m-02',
    prompt: '「駅 ___ 会いましょう。」',
    choices: ['で', 'を', 'が', 'から'],
    answer: 'で',
    tag: 'grammar',
  },
  {
    id: 'ja-m-03',
    prompt: '「明日は休みです。だから、映画を見ます。」正しい説明は？',
    choices: ['明日映画を見る', '今日映画を見た', '明日仕事に行く', '映画館は休み'],
    answer: '明日映画を見る',
    tag: 'reading',
  },
  {
    id: 'ja-m-04',
    prompt: '「忙しい」の読みは？',
    choices: ['いそがしい', 'たのしい', 'やさしい', 'むずかしい'],
    answer: 'いそがしい',
    tag: 'vocab',
  },
  {
    id: 'ja-m-05',
    prompt: '「もう昼ご飯を ___ 。」',
    choices: ['食べました', '食べますでした', '食べるました', '食べてますでした'],
    answer: '食べました',
    tag: 'grammar',
  },
  {
    id: 'ja-m-06',
    prompt: '「この図書館は静かですが、駅から遠いです。」図書館について正しいのは？',
    choices: ['静かだが遠い', 'うるさいが近い', '駅の中にある', '新しくない'],
    answer: '静かだが遠い',
    tag: 'reading',
  },
  {
    id: 'ja-m-07',
    prompt: '「会議」は何ですか。',
    choices: ['meeting', 'shopping', 'travel', 'breakfast'],
    answer: 'meeting',
    tag: 'vocab',
  },
  {
    id: 'ja-m-08',
    prompt: '「友だち ___ プレゼントをもらいました。」',
    choices: ['に', 'を', 'で', 'へ'],
    answer: 'に',
    tag: 'grammar',
  },
  {
    id: 'ja-m-09',
    prompt: '「雨が降りそうです。傘を持って行ってください。」何をすすめていますか。',
    choices: ['傘を持つ', '傘を買わない', '外に出ない', '駅で待つ'],
    answer: '傘を持つ',
    tag: 'reading',
  },
  {
    id: 'ja-m-10',
    prompt: '「予約」の意味は？',
    choices: ['預約', '取消', '付款', '說明'],
    answer: '預約',
    tag: 'vocab',
  },
  {
    id: 'ja-m-11',
    prompt: '「資料を見せて ___ 。」もっと丁寧な依頼は？',
    choices: ['いただけますか', 'やる', 'だめ', 'おく'],
    answer: 'いただけますか',
    tag: 'grammar',
  },
  {
    id: 'ja-m-12',
    prompt: '「締め切りは金曜日です。遅れる場合は連絡してください。」いつまでですか。',
    choices: ['金曜日', '月曜日', '今日', '来月'],
    answer: '金曜日',
    tag: 'reading',
  },
]
