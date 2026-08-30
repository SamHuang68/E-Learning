/**
 * あおば日語 · 易混淆文法動作訊號對照庫 (Grammar Action Signals)
 * 借鏡 English Chunker 動作訊號決策樹：
 * 讓學員在 3 秒內透過關鍵訊號判斷日語句型與語態，擺脫死背文法。
 */

export type JapaneseGrammarSignal = {
  id: string
  category: string
  pattern: string
  meaningZh: string
  signalTrigger: string // 看到什麼情境訊號
  threeSecondRule: string // 3秒判斷口訣
  formula: string
  contrastExample: {
    ja: string
    kana: string
    zh: string
    note: string
  }
  pitfall: {
    wrong: string
    reason: string
  }
  quiz: {
    promptZh: string
    answerJa: string
    options: string[]
    correctIndex: number
    explanation: string
  }
}

export type GrammarSignalGroup = {
  id: string
  title: string
  subtitle: string
  description: string
  signals: JapaneseGrammarSignal[]
}

export const JAPANESE_SIGNAL_GROUPS: GrammarSignalGroup[] = [
  {
    id: 'auxiliary-verbs',
    title: '補助動詞三兄弟：〜ておく vs 〜てある vs 〜てしまう',
    subtitle: '事前準備、事後狀態、還是遺憾完成？',
    description: '日語中最常見的三個「て形補助動詞」，透過「動作發生在事前、事後、還是情緒」即可在 3 秒內精準分辨。',
    signals: [
      {
        id: 'te-oku',
        category: '補助動詞',
        pattern: '〜ておく（ておきます）',
        meaningZh: '事先做好準備／保持原狀放著',
        signalTrigger: '事情「還沒發生」，為了之後的某件事「提前做準備」',
        threeSecondRule: '【事前準備】為了明天/之後，現在先做起來放。',
        formula: '動詞て形 + おく（口語縮約：〜とく）',
        contrastExample: {
          ja: '旅行の前に、切符を買っておきます。',
          kana: 'りょこうのまえに、きっぷをかっておきます。',
          zh: '旅行之前，先買好車票。',
          note: '為了之後的旅行，提前先買好。',
        },
        pitfall: {
          wrong: '切符を買ってあります。（若此時根本還沒買）',
          reason: '〜てある 是「已經被某人買好並擺在那的狀態」，不能用來表示「現在打算先去買」。',
        },
        quiz: {
          promptZh: '為了明天的會議，我先預約好會議室。',
          answerJa: '明日の会議のために、会議室を予約しておきます。',
          options: [
            '会議室を予約しておきます。',
            '会議室を予約してあります。',
            '会議室を予約してしまいます。',
            '会議室を予約させられます。',
          ],
          correctIndex: 0,
          explanation: '「為了明天先做好準備」是經典的 〜ておく 情境。',
        },
      },
      {
        id: 'te-aru',
        category: '補助動詞',
        pattern: '〜てある（他動詞＋てあります）',
        meaningZh: '某事已經被做好，目前處於完成的存續狀態',
        signalTrigger: '看著眼前「已經被完成擺好」的現場結果（主語通常配助詞 が）',
        threeSecondRule: '【事後結果】已經被某人弄好了，就擺在眼前。',
        formula: '名詞 + が + 他動詞て形 + ある',
        contrastExample: {
          ja: 'カレンダーに今月の予定が書いてあります。',
          kana: 'カレンダーにこんげつのよていが・かいてあります。',
          zh: '月曆上寫著這個月的行程。',
          note: '重點在於「行程已經被寫在月曆上」的客觀留存狀態。',
        },
        pitfall: {
          wrong: 'カレンダーに予定を書いてあります。',
          reason: '〜てある 描述事物狀態時，焦點在於受詞狀態，助詞需用「が」而非「を」。',
        },
        quiz: {
          promptZh: '門上貼著一張便條紙（描述眼前狀態）。',
          answerJa: 'ドアにメモが貼ってあります。',
          options: [
            'ドアにメモが貼っておきます。',
            'ドアにメモが貼ってあります。',
            'ドアにメモを貼ってしまいました。',
            'ドアにメモが貼られます。',
          ],
          correctIndex: 1,
          explanation: '描述某人貼好且現在依然貼在門上的狀態，用「他動詞て形＋あります」。',
        },
      },
      {
        id: 'te-shimau',
        category: '補助動詞',
        pattern: '〜てしまう（てしまいます）',
        meaningZh: '徹底做完／遺憾後悔不小心發生',
        signalTrigger: '東西弄丟了、遲到了、或者把整本書一口氣看完了',
        threeSecondRule: '【徹底/遺憾】糟糕不小心搞砸了，或痛快徹底全部做完。',
        formula: '動詞て形 + しまう（口語縮約：〜ちゃう／〜じゃう）',
        contrastExample: {
          ja: '財布を電車に忘れてしまいました。',
          kana: 'さいふをでんしゃにわすれてしまいました。',
          zh: '不小心把錢包忘在電車上了。',
          note: '帶有強烈的遺憾、糟糕、後悔的情緒。',
        },
        pitfall: {
          wrong: '財布を忘れておきました。',
          reason: '〜ておく 是故意提前準備，沒有人會「故意把錢包遺忘在電車上」。',
        },
        quiz: {
          promptZh: '真糟糕，作業本不小心弄濕了。',
          answerJa: '宿題を濡らしてしまいました。',
          options: [
            '宿題を濡らしておきました。',
            '宿題が濡らしてあります。',
            '宿題を濡らしてしまいました。',
            '宿題を濡らさせました。',
          ],
          correctIndex: 2,
          explanation: '表達不小心出錯的遺憾情緒，使用 〜てしまう。',
        },
      },
    ],
  },
  {
    id: 'giving-receiving',
    title: '授受動詞三向圖：あげる vs もらう vs くれる',
    subtitle: '誰給誰？視點在誰身上？',
    description: '日語授受動詞的核心在於「恩惠與視點流向」：我給別人、我得到、還是別人給我。',
    signals: [
      {
        id: 'ageru',
        category: '授受動詞',
        pattern: '〜あげる（差し上げる）',
        meaningZh: '我（或我方）給對方東西／為對方做某事',
        signalTrigger: '動作方向由「我（我方）」流向「對方」',
        threeSecondRule: '【我給人】由內向外給出去。',
        formula: '私（が）＋ 人（に）＋ 物をあげる',
        contrastExample: {
          ja: '私は友達に誕生日プレゼントをあげました。',
          kana: 'わたしはともだちにたんじょうびプレゼントをあげました。',
          zh: '我送了朋友生日禮物。',
          note: '送出的主體是我。',
        },
        pitfall: {
          wrong: '友達は私にプレゼントをあげました。',
          reason: '別人給我絕對不能用 あげる，必須用 くれる！',
        },
        quiz: {
          promptZh: '我借了一把傘給同事。',
          answerJa: '私は同僚に傘を貸してあげました。',
          options: [
            '私は同僚に傘を貸してあげました。',
            '同僚は私に傘を貸してあげました。',
            '私は同僚に傘を貸してくれました。',
            '私は同僚に傘を貸してもらいました。',
          ],
          correctIndex: 0,
          explanation: '主詞是「我」，動作給予對象是「同事」，用 〜てあげる。',
        },
      },
      {
        id: 'kureru',
        category: '授受動詞',
        pattern: '〜くれる（くださる）',
        meaningZh: '別人（對方）主動給我（或我方）',
        signalTrigger: '動作方向由「外人」流向「我（或我的家人）」',
        threeSecondRule: '【人給我】別人主動向我施惠。',
        formula: '人（が）＋ 私（に）＋ 物をくれる',
        contrastExample: {
          ja: '田中さんが私に日本語を教えてくれました。',
          kana: 'たなかさんがわたしににほんごをおしえてくれました。',
          zh: '田中先生熱心教了我日語。',
          note: '主詞是田中先生，受惠者是我。',
        },
        pitfall: {
          wrong: '私は田中さんに教えてくれました。',
          reason: '主詞是「私」時不能配 くれる。',
        },
        quiz: {
          promptZh: '經理借了一本書給我。',
          answerJa: '部長が私に本を貸してくださいました。',
          options: [
            '私は部長に本を貸してくださいました。',
            '部長が私に本を貸してくださいました。',
            '部長が私に本を貸して差し上げました。',
            '私が部長に本を貸していただきました。',
          ],
          correctIndex: 1,
          explanation: '上級長官主動借書給我，使用 くれる 的敬語「くださる」。',
        },
      },
      {
        id: 'morau',
        category: '授受動詞',
        pattern: '〜もらう（いただく）',
        meaningZh: '我（從某人那裡）得到／請對方為我做',
        signalTrigger: '主詞是「我」，從某人身上獲得幫助（強調我方領受恩惠）',
        threeSecondRule: '【我領受】我向別人請求並得到恩惠。',
        formula: '私（が）＋ 人（に／から）＋ 物をもらう',
        contrastExample: {
          ja: '私は先生に推薦状を書いていただきました。',
          kana: 'わたしはせんせいにすいせんじょうをかいていただきました。',
          zh: '我請老師幫我寫了推薦信（領受了老師的恩惠）。',
          note: '主詞是我，向老師領受恩惠，使用 もらう 的謙讓語 いただく。',
        },
        pitfall: {
          wrong: '先生は私に書いていただきました。',
          reason: 'いただく/もらう 的主詞必須是領受者（我方），不能把老師當主詞。',
        },
        quiz: {
          promptZh: '我請前輩幫我看過這份報告了。',
          answerJa: '私は先輩にレポートを見ていただきました。',
          options: [
            '先輩は私にレポートを見ていただきました。',
            '私は先輩にレポートを見てあげました。',
            '私は先輩にレポートを見ていただきました。',
            '私は先輩にレポートを見させました。',
          ],
          correctIndex: 2,
          explanation: '主詞是「我」，領受前輩的指點，用 〜てもらう（謙讓語 いただく）。',
        },
      },
    ],
  },
]
