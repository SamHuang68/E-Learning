/**
 * 台湾華語・生活台湾語（台湾閩南語）借用・日常頻出単語集 (Taiwanese Loanwords & Culture Guide)
 * 解決日本人が台湾現地で耳にする「台湾語由来の中国語フレーズ」の疑問を解消！
 */

export interface LoanwordItem {
  id: string
  wordZh: string
  taiwanesePinyin: string
  meaningZh: string
  meaningJa: string
  usageSituationJa: string
  exampleZh: string
  exampleJa: string
}

export const TAIWANESE_LOANWORDS: LoanwordItem[] = [
  {
    id: 'tw-phann-si',
    wordZh: '歹勢',
    taiwanesePinyin: 'pháinn-sè (パイセー)',
    meaningZh: '不好意思 / 對不起',
    meaningJa: 'すみません・申し訳ない・恐縮です',
    usageSituationJa: '人に道を譲ってもらう時や、軽くお詫び・感謝する時に台湾人が最もよく使う挨拶です。',
    exampleZh: '歹勢啦，借過一下！',
    exampleJa: 'すみません、ちょっと通してください！',
  },
  {
    id: 'tw-tsiah-pa-bue',
    wordZh: '呷飽沒',
    taiwanesePinyin: 'tsia̍h-pá--buē (チャッパーベー)',
    meaningZh: '吃飽了嗎？（問候語）',
    meaningJa: 'ご飯食べた？（台湾の伝統的な親愛の挨拶）',
    usageSituationJa: '実際に食事をしたかを厳密に尋ねるだけでなく、「こんにちは、元気？」という親しい間柄の挨拶です。',
    exampleZh: '阿伯，你呷飽沒？',
    exampleJa: 'おじさん、ご飯食べた？（こんにちは！）',
  },
  {
    id: 'tw-ku-mo',
    wordZh: '龜毛',
    taiwanesePinyin: 'ku-moo (グーマオ)',
    meaningZh: '過於吹毛求疵 / 囉嗦細節',
    meaningJa: 'こだわりが強すぎる・細かいことにうるさい・優柔不断',
    usageSituationJa: '細かい条件にこだわりすぎてなかなか決められない性格や態度を指す定番俗語です。',
    exampleZh: '他挑衣服很龜毛，選了半小時還沒好。',
    exampleJa: '彼は服選びのこだわりが強すぎて、30分経ってもまだ決まりません。',
  },
  {
    id: 'tw-a-kong-ma',
    wordZh: '阿公 / 阿嬤',
    taiwanesePinyin: 'a-kong / a-má (アコン / アマー)',
    meaningZh: '爺爺 / 奶奶・外婆',
    meaningJa: 'おじいちゃん / おばあちゃん',
    usageSituationJa: '台湾では親しみを込めて高齢者を「阿公」「阿嬤」と呼びます。夜市の屋台の看板でも頻出！',
    exampleZh: '這家阿嬤古早味紅茶非常好喝。',
    exampleJa: 'このおばあちゃんの昔ながらの紅茶はとても美味しいです。',
  },
  {
    id: 'tw-ho-ka-tsai',
    wordZh: '好家在',
    taiwanesePinyin: 'hó-ka-tsài (ホーカザイ)',
    meaningZh: '幸好 / 還好 / 謝天謝地',
    meaningJa: 'よかった〜・不幸中の幸い・命拾いした',
    usageSituationJa: '危ないところで難を逃れたり、ギリギリ間に合った時に言う安堵のフレーズ。',
    exampleZh: '好家在有帶傘，剛好下大雨！',
    exampleJa: '傘を持ってきてよかった、ちょうど大雨が降ってきた！',
  },
]

export const CHINESE_SUPPORT_EN = {
  "不好意思 / 對不起": "Excuse me / sorry",
  "すみません・申し訳ない・恐縮です": "Excuse me, sorry, or thank you for the trouble",
  "人に道を譲ってもらう時や、軽くお詫び・感謝する時に台湾人が最もよく使う挨拶です。": "One of Taiwan's most common expressions when asking someone to make way, making a light apology, or showing appreciation.",
  "すみません、ちょっと通してください！": "Excuse me, please let me pass.",
  "吃飽了嗎？（問候語）": "Have you eaten? (a greeting)",
  "ご飯食べた？（台湾の伝統的な親愛の挨拶）": "Have you eaten? A traditional affectionate greeting in Taiwan",
  "実際に食事をしたかを厳密に尋ねるだけでなく、「こんにちは、元気？」という親しい間柄の挨拶です。": "It may be a warm greeting between people who know each other, similar to asking how someone is, rather than a literal question about a meal.",
  "おじさん、ご飯食べた？（こんにちは！）": "Uncle, have you eaten? Hello!",
  "過於吹毛求疵 / 囉嗦細節": "Overly fussy / preoccupied with details",
  "こだわりが強すぎる・細かいことにうるさい・優柔不断": "Overly particular, fussy about details, or indecisive",
  "細かい条件にこだわりすぎてなかなか決められない性格や態度を指す定番俗語です。": "A common colloquial term for an attitude so particular about small conditions that making a decision becomes difficult.",
  "彼は服選びのこだわりが強すぎて、30分経ってもまだ決まりません。": "He is so particular about choosing clothes that he still has not decided after thirty minutes.",
  "爺爺 / 奶奶・外婆": "Grandfather / grandmother",
  "おじいちゃん / おばあちゃん": "Grandpa / grandma",
  "台湾では親しみを込めて高齢者を「阿公」「阿嬤」と呼びます。夜市の屋台の看板でも頻出！": "In Taiwan, agong and ama are affectionate terms for older people and often appear in night-market stall names.",
  "このおばあちゃんの昔ながらの紅茶はとても美味しいです。": "This grandma's traditional black tea is delicious.",
  "幸好 / 還好 / 謝天謝地": "Fortunately / luckily / thank goodness",
  "よかった〜・不幸中の幸い・命拾いした": "What a relief; fortunately; a lucky escape",
  "危ないところで難を逃れたり、ギリギリ間に合った時に言う安堵のフレーズ。": "An expression of relief after narrowly avoiding trouble or arriving just in time.",
  "傘を持ってきてよかった、ちょうど大雨が降ってきた！": "Good thing I brought an umbrella—the heavy rain has just started.",
} as const
