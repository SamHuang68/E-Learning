/**
 * 台湾華語・中国語：3秒文法動作シグナル決策樹 (Chinese Grammar 3-Second Action Signals)
 * 專為日本語母語者量身打造：針對「把字句」「被字句」「了1 vs 了2」「是…的」「過」等核心難關提供直覺秒殺法則。
 */

export interface ChineseGrammarSignal {
  id: string
  pattern: string
  categoryJa: string
  meaningJa: string
  signalTriggerJa: string // 看到什麼情境訊號
  threeSecondRuleJa: string // 3秒直覺判別法
  formula: string // 公式接續
  contrastExample: {
    zh: string
    pinyin: string
    bopomofo: string
    ja: string
    noteJa: string
  }
  pitfall: {
    wrong: string
    reasonJa: string
  }
  quiz: {
    questionJa: string
    options: string[]
    correctIndex: number
    explanationJa: string
  }
}

export const CHINESE_GRAMMAR_SIGNALS: ChineseGrammarSignal[] = [
  {
    id: 'sig-ba',
    pattern: '把字句 (処置文)',
    categoryJa: '語順・処置',
    meaningJa: '〜を（処置・移動・変化）させる',
    signalTriggerJa: '「特定の物を動かす・食べる・終えるなど、目的語に変化を与える動作」を言いたい時。',
    threeSecondRuleJa: '動詞の前に「把 ＋ 目的語」を前置！動詞単体では終わらせず、必ず「了・完・好・在〜」等の結果を添える！',
    formula: '主語 + 把 + 目的語 + 動詞 + 結果/補語/了',
    contrastExample: {
      zh: '請把這杯珍奶喝完。',
      pinyin: 'qǐng bǎ zhè bēi zhēn nǎi hē wán.',
      bopomofo: 'ㄑㄧㄥˇ ㄅㄚˇ ㄓㄜˋ ㄅㄟ ㄓㄣ ㄋㄞˇ ㄏㄜ ㄨㄢˊ.',
      ja: 'このタピオカミルクティーを飲み干してください。',
      noteJa: '目的語「這杯珍奶」を動詞「喝」の前に持ってきて、結果「完」で締めくくる。',
    },
    pitfall: {
      wrong: '❌ 我把書看。（間違い：動詞だけで文を終えてはならない）',
      reasonJa: '把字句の動詞の後には必ず「看完」「看了」「放在桌上」など処置の結果が必要です。',
    },
    quiz: {
      questionJa: '「宿題を書き終えた」を把字句で正しく表現しているものはどれ？',
      options: ['我把作業寫完了。', '我作業把寫。', '我把寫作業。', '我寫作業把完了。'],
      correctIndex: 0,
      explanationJa: '「主語 (我) + 把 + 目的語 (作業) + 動詞 (寫) + 結果補語 (完了)」の語順になります。',
    },
  },
  {
    id: 'sig-bei',
    pattern: '被字句 (受け身文)',
    categoryJa: '受身・被害',
    meaningJa: '〜に…される（不本意な被害・被動作）',
    signalTriggerJa: '「物が壊された・食べられた・盗まれた」など不利益・被害を被った時。',
    threeSecondRuleJa: '被害を受けた主語を文頭に置き、「被 + 行為者 + 動詞 + 結果補語」！行為者は省略可能。',
    formula: '主語(被害者/物) + 被 + (行為者) + 動詞 + 結果/了',
    contrastExample: {
      zh: '我的手機被他摔壞了。',
      pinyin: 'wǒ de shǒu jī bèi tā shuāi huài le.',
      bopomofo: 'ㄨㄛˇ ˙ㄉㄜ ㄕㄡˇ ㄐㄧ ㄅㄟˋ ㄊㄚ ㄕㄨㄞ ㄏㄨㄞˋ ˙ㄌㄜ.',
      ja: '私のスマホは彼に落とされて壊されてしまいました。',
      noteJa: '手機（被害物）+ 被 + 他（行為者）+ 摔（落とす）+ 壞了（壊れた結果）。',
    },
    pitfall: {
      wrong: '❌ 我被他稱讚了。（不自然：良いこと・称賛には通常「被」を使わない）',
      reasonJa: '中国語の受身「被」は伝統的に好ましくない被害事象に使われます。称賛は「他稱讚我」と能動態で表現するのが自然です。',
    },
    quiz: {
      questionJa: '「ケーキが弟に全部食べられてしまった」の正しい中国語は？',
      options: ['蛋糕被弟弟吃光了。', '弟弟被蛋糕吃光了。', '蛋糕把弟弟吃了。', '被弟弟蛋糕吃了。'],
      correctIndex: 0,
      explanationJa: '受け身の対象「蛋糕（ケーキ）」が文頭に来て、「被 + 弟弟 + 吃光了」となります。',
    },
  },
  {
    id: 'sig-le',
    pattern: '了1 vs 了2 (完了 vs 変化)',
    categoryJa: 'アスペクト・状態変化',
    meaningJa: '動詞の完了 vs 新たな状況の発生',
    signalTriggerJa: '「動作が終わった（完了）」のか「以前と状況が変わった（変化）」のかを見極める。',
    threeSecondRuleJa: '動詞の直後は「完了 (了1)」！文の末尾は「状況変化・〜になった (了2)」！文頭文末両方あれば「〜して〜になる」。',
    formula: '動詞 + 了 (完了) / 文末 + 了 (変化)',
    contrastExample: {
      zh: '下雨了！（変化） vs 我買了一本書。（完了）',
      pinyin: 'xià yǔ le! vs wǒ mǎi le yì běn shū.',
      bopomofo: 'ㄒㄧㄚˋ ㄩˇ ˙ㄌㄜ! vs ㄨㄛˇ ㄇㄞˇ ˙ㄌㄜ ㄧˋ ㄅㄣˇ ㄕㄨ.',
      ja: '雨が降ってきた！（状態変化） vs 本を1冊買いました（動作完了）。',
      noteJa: '文末の「了」は「降っていなかった ➜ 降る状態に変わった」という変化を表します。',
    },
    pitfall: {
      wrong: '❌ 昨天我常去了那家咖啡店。（間違い：「常（いつも）」など反復動作には「了」をつけない）',
      reasonJa: '習慣的・反復的な動作（常常・每天など）には完了の「了」を使いません。',
    },
    quiz: {
      questionJa: '「春が来た（暖かくなった）」という状況の変化を表す文末の「了」の使い方は？',
      options: ['春天來了，天氣變熱了。', '春天來，天氣熱了了。', '春天了來，天氣變了熱。', '春天來了過。'],
      correctIndex: 0,
      explanationJa: '文末の「了」は状況の新たな変化（春になった・暖かくなった）を表します。',
    },
  },
  {
    id: 'sig-shi-de',
    pattern: '是…的 (焦点強調構文)',
    categoryJa: '過去の焦点強調',
    meaningJa: '〜したのは（いつ/どこで/誰と/どうやって）だ',
    signalTriggerJa: '過去にすでに起きた確定事実について、「時間・場所・手段・同行者・理由」を詳しく強調したい時。',
    threeSecondRuleJa: '強調したい要素の直前に「是」、文末に「的」を挟み込む！動詞の完了「了」は使わない！',
    formula: '主語 + 是 + [強調要素(時間/場所/方式)] + 動詞 + 的',
    contrastExample: {
      zh: '我是搭高鐵來台北的。',
      pinyin: 'wǒ shì dā gāo tiě lái tái běi de.',
      bopomofo: 'ㄨㄛˇ ㄕˋ ㄉㄚ ㄍㄠ ㄊㄧㄝˇ ㄌㄞˊ ㄊㄞˊ ㄅㄟˇ ˙ㄉㄜ.',
      ja: '私が台北に来たのは、新幹線（台湾高鉄）に乗ってです。',
      noteJa: '台北に来たという既定事実の「移動手段 (搭高鐵)」を焦点化。',
    },
    pitfall: {
      wrong: '❌ 我是昨天買了這本書的。（間違い：「是…的」構文の中で「了」を重ねない）',
      reasonJa: '「是…的」自体が過去の確定事象を前提としているため、「了」を共存させる必要はありません。正しくは「我是昨天買這本書的」。',
    },
    quiz: {
      questionJa: '「私が台湾に来たのは去年です（時間の強調）」を表す正しい文は？',
      options: ['我是去年來台灣的。', '我去年來了台灣的。', '我是去年來台灣了。', '我是來台灣去年。'],
      correctIndex: 0,
      explanationJa: '時間「去年」を強調するために「是 + 去年 + 動詞(來台灣) + 的」の形にします。',
    },
  },
  {
    id: 'sig-guo',
    pattern: '動詞 + 過 (経験アスペクト)',
    categoryJa: '経験アスペクト',
    meaningJa: '〜したことがある（過去の経験）',
    signalTriggerJa: '「台湾へ行ったことがある・臭豆腐を食べたことがある」など生涯の経験を尋ねる・語る時。',
    threeSecondRuleJa: '動詞の直後に「過」を添える！否定は「沒(有) + 動詞 + 過」！',
    formula: '主語 + (沒)動詞 + 過 + 目的語',
    contrastExample: {
      zh: '你吃過台灣的牛肉麵嗎？',
      pinyin: 'nǐ chī guo tái wān de niú ròu miàn ma?',
      bopomofo: 'ㄋㄧˇ ㄔ ˙ㄍㄨㄛ ㄊㄞˊ ㄨㄢ ˙ㄉㄜ ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ ˙ㄇㄚ?',
      ja: '台湾の牛肉麺を食べたことがありますか？',
      noteJa: '「吃過」で「食べた経験があるか」を尋ねる表現。',
    },
    pitfall: {
      wrong: '❌ 我不吃過臭豆腐。（間違い：経験の否定は「不」ではなく「沒」を使う）',
      reasonJa: '「過去に〜したことがない」という経験の否定は必ず「沒（有）吃過」とします。',
    },
    quiz: {
      questionJa: '「私は九份へ行ったことがありません」の正しい中国語は？',
      options: ['我沒去過九份。', '我不去過九份。', '我沒去九份了。', '我去九份沒有。'],
      correctIndex: 0,
      explanationJa: '経験の否定は「沒 + 動詞 + 過」を用います（我沒去過九份）。',
    },
  },
]
