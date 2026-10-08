/**
 * 台湾華語・中国語：3秒文法動作シグナル決策樹 (Chinese Grammar 3-Second Action Signals)
 * 專為日本語母語者量身打造：針對「把字句」「被字句」「了1 vs 了2」「是…的」「過」「連動文」「使役兼語」「存現文」「比較句」「方向結果補語」提供直覺秒殺法則。
 */

export interface ChineseGrammarSignal {
  id: string
  pattern: string
  patternDescriptionJa: string
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
    pattern: '把字句',
    patternDescriptionJa: '処置文',
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
      wrong: '❌ 我把書看。',
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
    pattern: '被字句',
    patternDescriptionJa: '受け身文',
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
      wrong: '❌ 我被他稱讚了。',
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
    pattern: '了1 vs 了2',
    patternDescriptionJa: '完了 vs 変化',
    categoryJa: 'アスペクト・状態変化',
    meaningJa: '動詞の完了 vs 新たな状況の発生',
    signalTriggerJa: '「動作が終わった（完了）」のか「以前と状況が変わった（変化）」のかを見極める。',
    threeSecondRuleJa: '動詞の直後は「完了 (了1)」！文の末尾は「状況変化・〜になった (了2)」！文頭文末両方あれば「〜して〜になる」。',
    formula: '動詞 + 了 (完了) / 文末 + 了 (変化)',
    contrastExample: {
      zh: '下雨了！ vs 我買了一本書。',
      pinyin: 'xià yǔ le! vs wǒ mǎi le yì běn shū.',
      bopomofo: 'ㄒㄧㄚˋ ㄩˇ ˙ㄌㄜ! vs ㄨㄛˇ ㄇㄞˇ ˙ㄌㄜ ㄧˋ ㄅㄣˇ ㄕㄨ.',
      ja: '雨が降ってきた！（状態変化） vs 本を1冊買いました（動作完了）。',
      noteJa: '文末の「了」は「降っていなかった ➜ 降る状態に変わった」という変化を表します。',
    },
    pitfall: {
      wrong: '❌ 昨天我常去了那家咖啡店。',
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
    pattern: '是…的',
    patternDescriptionJa: '焦点強調構文',
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
      wrong: '❌ 我是昨天買了這本書的。',
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
    pattern: '動詞 + 過',
    patternDescriptionJa: '経験アスペクト',
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
      wrong: '❌ 我不吃過臭豆腐。',
      reasonJa: '「過去に〜したことがない」という経験の否定は必ず「沒（有）吃過」とします。',
    },
    quiz: {
      questionJa: '「私は九份へ行ったことがありません」の正しい中国語は？',
      options: ['我沒去過九份。', '我不去過九份。', '我沒去九份了。', '我去九份沒有。'],
      correctIndex: 0,
      explanationJa: '経験の否定は「沒 + 動詞 + 過」を用います（我沒去過九份）。',
    },
  },
  {
    id: 'sig-bi',
    pattern: '比較句',
    patternDescriptionJa: '比・比較構文',
    categoryJa: '比較・優劣',
    meaningJa: 'AはBより〜だ',
    signalTriggerJa: '2つの対象の大きさ・値段・気温などを比較する時。',
    threeSecondRuleJa: '「A + 比 + B + 形容詞」！「很」「非常」などの程度副詞は併用不可！具体的な差は形容詞の後ろに置く。',
    formula: 'A + 比 + B + 形容詞 + (差/得多/一點)',
    contrastExample: {
      zh: '今天比昨天熱一點。',
      pinyin: 'jīn tiān bǐ zuó tiān rè yì diǎn.',
      bopomofo: 'ㄐㄧㄣ ㄊㄧㄢ ㄅㄧˇ ㄗㄨㄛˊ ㄊㄧㄢ ㄖㄜˋ ㄧˋ ㄉㄧㄢˇ.',
      ja: '今日は昨日より少し暑いです。',
      noteJa: '形容詞「熱」の直後に差「一點」を添える。',
    },
    pitfall: {
      wrong: '❌ 今天比昨天很熱。',
      reasonJa: '「比」ですでに比較されているため、絶対的な程度を表す「很」は使いません。「今天比昨天熱得多」とします。',
    },
    quiz: {
      questionJa: '「台北は東京よりずっと暖かい」の正しい中国語は？',
      options: ['台北比東京暖和得多。', '台北比東京很暖和。', '台北比東京非常暖和。', '台北很比東京暖和。'],
      correctIndex: 0,
      explanationJa: '比較構文では「很」の代わりに「得多（ずっと）」を形容詞の後ろに置きます。',
    },
  },
  {
    id: 'sig-rang',
    pattern: '兼語文',
    patternDescriptionJa: '使役：讓 / 叫 / 請',
    categoryJa: '使役・依頼',
    meaningJa: '〜に…させる・してもらう',
    signalTriggerJa: '「人に〜させる」「人に〜してもらう」「人に頼む」時。',
    threeSecondRuleJa: '「主語 + 讓/叫/請 + 人 + 動詞」！「讓」は許可・使役、「請」は丁寧な依頼。',
    formula: '主語 + 讓/叫/請 + 人(兼語) + 動詞句',
    contrastExample: {
      zh: '這部台灣電影讓我非常感動。',
      pinyin: 'zhè bù tái wān diàn yǐng ràng wǒ fēi cháng gǎn dòng.',
      bopomofo: 'ㄓㄜˋ ㄅㄨˋ ㄊㄞˊ ㄨㄢ ㄉㄧㄢˋ ㄧㄥˇ ㄖㄤˋ ㄨㄛˇ ㄈㄟ ㄔㄤˊ ㄍㄢˇ ㄉㄨㄥˋ.',
      ja: 'この台湾映画は私をとても感動させました。',
      noteJa: '映画（主語）+ 讓 + 我（人）+ 感動（動作状態）。',
    },
    pitfall: {
      wrong: '❌ 我請他在。',
      reasonJa: '兼語（人）の後には具体的な動作や目的語が必要です。',
    },
    quiz: {
      questionJa: '「先生は学生に宿題をさせた」の正しい表現は？',
      options: ['老師讓學生寫作業。', '學生讓老師寫作業。', '老師寫作業讓學生。', '讓老師學生寫作業。'],
      correctIndex: 0,
      explanationJa: '「主語 (老師) + 讓 + 人 (學生) + 動作 (寫作業)」の語順になります。',
    },
  },
]

export const CHINESE_SUPPORT_EN = {
  "処置文": "Disposal construction",
  "語順・処置": "Word order and disposal",
  "〜を（処置・移動・変化）させる": "Act on, move, or change a specific object",
  "「特定の物を動かす・食べる・終えるなど、目的語に変化を与える動作」を言いたい時。": "Use it when an action such as moving, eating, or finishing causes a change to a specific object.",
  "動詞の前に「把 ＋ 目的語」を前置！動詞単体では終わらせず、必ず「了・完・好・在〜」等の結果を添える！": "Place 把 + object before the verb. Do not end with a bare verb; add a result or location such as 了, 完, 好, or 在 plus a place.",
  "このタピオカミルクティーを飲み干してください。": "Please finish this bubble milk tea.",
  "目的語「這杯珍奶」を動詞「喝」の前に持ってきて、結果「完」で締めくくる。": "Move the object 這杯珍奶 before the verb 喝 and finish with the result complement 完.",
  "把字句の動詞の後には必ず「看完」「看了」「放在桌上」など処置の結果が必要です。": "A 把 sentence needs a bounded result after the verb, such as 看完, 看了, or 放在桌上.",
  "「宿題を書き終えた」を把字句で正しく表現しているものはどれ？": "Which 把 sentence correctly says 'I finished writing the homework'?",
  "「主語 (我) + 把 + 目的語 (作業) + 動詞 (寫) + 結果補語 (完了)」の語順になります。": "The order is subject 我 + 把 + object 作業 + verb 寫 + result complement 完了.",
  "受身・被害": "Passive and affected events",
  "受け身文": "Passive construction",
  "〜に…される（不本意な被害・被動作）": "Be affected by someone else's action, often adversely",
  "「物が壊された・食べられた・盗まれた」など不利益・被害を被った時。": "Use it when something is broken, eaten, stolen, or otherwise adversely affected.",
  "被害を受けた主語を文頭に置き、「被 + 行為者 + 動詞 + 結果補語」！行為者は省略可能。": "Put the affected subject first, followed by 被 + agent + verb + result complement. The agent may be omitted.",
  "私のスマホは彼に落とされて壊されてしまいました。": "My phone was dropped and broken by him.",
  "手機（被害物）+ 被 + 他（行為者）+ 摔（落とす）+ 壞了（壊れた結果）。": "手機, the affected object, + 被 + 他, the agent, + 摔, drop, + 壞了, the resulting damage.",
  "中国語の受身「被」は伝統的に好ましくない被害事象に使われます。称賛は「他稱讚我」と能動態で表現するのが自然です。": "被 is traditionally associated with unwanted or adverse events. For praise, the active 他稱讚我 is more natural in this lesson's context.",
  "「ケーキが弟に全部食べられてしまった」の正しい中国語は？": "Which sentence correctly says 'The cake was completely eaten by my younger brother'?",
  "受け身の対象「蛋糕（ケーキ）」が文頭に来て、「被 + 弟弟 + 吃光了」となります。": "The affected item 蛋糕 comes first, followed by 被 + 弟弟 + 吃光了.",
  "アスペクト・状態変化": "Aspect and change of state",
  "完了 vs 変化": "Completion versus change of state",
  "動詞の完了 vs 新たな状況の発生": "Completed action versus the onset of a new situation",
  "「動作が終わった（完了）」のか「以前と状況が変わった（変化）」のかを見極める。": "Decide whether an action was completed or the situation changed from its earlier state.",
  "動詞の直後は「完了 (了1)」！文の末尾は「状況変化・〜になった (了2)」！文頭文末両方あれば「〜して〜になる」。": "了 directly after a verb marks completion; sentence-final 了 marks a new situation. When both functions appear, the sentence can express completing an action and reaching a new state.",
  "雨が降ってきた！（状態変化） vs 本を1冊買いました（動作完了）。": "It has started raining, a change of state, versus I bought a book, a completed action.",
  "文末の「了」は「降っていなかった ➜ 降る状態に変わった」という変化を表します。": "Sentence-final 了 shows the change from not raining to raining.",
  "習慣的・反復的な動作（常常・每天など）には完了の「了」を使いません。": "Do not normally use completion 了 for habitual or repeated actions marked by words such as 常常 or 每天.",
  "「春が来た（暖かくなった）」という状況の変化を表す文末の「了」の使い方は？": "Which use of sentence-final 了 expresses the change 'Spring has come; it has become warmer'?",
  "文末の「了」は状況の新たな変化（春になった・暖かくなった）を表します。": "Sentence-final 了 marks the new situation: spring has arrived and the weather has become warmer.",
  "過去の焦点強調": "Focusing a detail of a past event",
  "焦点強調構文": "Focus construction",
  "〜したのは（いつ/どこで/誰と/どうやって）だ": "It was at this time, place, with this person, or by this means that something happened",
  "過去にすでに起きた確定事実について、「時間・場所・手段・同行者・理由」を詳しく強調したい時。": "Use it to emphasise the time, place, means, companion, or reason of an established past event.",
  "強調したい要素の直前に「是」、文末に「的」を挟み込む！動詞の完了「了」は使わない！": "Place 是 before the focused element and 的 at the end. Do not add completion 了 to this pattern.",
  "私が台北に来たのは、新幹線（台湾高鉄）に乗ってです。": "It was by Taiwan High Speed Rail that I came to Taipei.",
  "台北に来たという既定事実の「移動手段 (搭高鐵)」を焦点化。": "The established fact is coming to Taipei; the construction focuses on the means, 搭高鐵.",
  "「是…的」自体が過去の確定事象を前提としているため、「了」を共存させる必要はありません。正しくは「我是昨天買這本書的」。": "是…的 already presupposes an established event, so completion 了 is unnecessary. The correct form is 我是昨天買這本書的.",
  "「私が台湾に来たのは去年です（時間の強調）」を表す正しい文は？": "Which sentence correctly means 'It was last year that I came to Taiwan,' with the time in focus?",
  "時間「去年」を強調するために「是 + 去年 + 動詞(來台灣) + 的」の形にします。": "To focus on 去年, use 是 + 去年 + the action 來台灣 + 的.",
  "経験アスペクト": "Experiential aspect",
  "〜したことがある（過去の経験）": "Have done something before",
  "「台湾へ行ったことがある・臭豆腐を食べたことがある」など生涯の経験を尋ねる・語る時。": "Use it to ask or talk about life experience, such as having visited Taiwan or eaten stinky tofu.",
  "動詞の直後に「過」を添える！否定は「沒(有) + 動詞 + 過」！": "Put 過 directly after the verb. The negative is 沒有 or 沒 + verb + 過.",
  "台湾の牛肉麺を食べたことがありますか？": "Have you ever eaten Taiwan beef noodles?",
  "「吃過」で「食べた経験があるか」を尋ねる表現。": "吃過 asks whether someone has the experience of eating it.",
  "「過去に〜したことがない」という経験の否定は必ず「沒（有）吃過」とします。": "Negate the experience with 沒有 or 沒 + verb + 過, as in 沒吃過.",
  "「私は九份へ行ったことがありません」の正しい中国語は？": "Which sentence correctly says 'I have never been to Jiufen'?",
  "経験の否定は「沒 + 動詞 + 過」を用います（我沒去過九份）。": "A negative experience uses 沒 + verb + 過: 我沒去過九份.",
  "比較・優劣": "Comparison",
  "比・比較構文": "Comparison construction with 比",
  "AはBより〜だ": "A is more adjective than B",
  "2つの対象の大きさ・値段・気温などを比較する時。": "Use it to compare two things in size, price, temperature, or another quality.",
  "「A + 比 + B + 形容詞」！「很」「非常」などの程度副詞は併用不可！具体的な差は形容詞の後ろに置く。": "Use A + 比 + B + adjective. Do not insert 很 or 非常 as an absolute degree adverb; put a specific difference after the adjective.",
  "今日は昨日より少し暑いです。": "Today is a little hotter than yesterday.",
  "形容詞「熱」の直後に差「一點」を添える。": "Place the degree of difference 一點 directly after the adjective 熱.",
  "「比」ですでに比較されているため、絶対的な程度を表す「很」は使いません。「今天比昨天熱得多」とします。": "比 already establishes comparison, so do not use the absolute degree marker 很. Say 今天比昨天熱得多.",
  "「台北は東京よりずっと暖かい」の正しい中国語は？": "Which sentence correctly says 'Taipei is much warmer than Tokyo'?",
  "比較構文では「很」の代わりに「得多（ずっと）」を形容詞の後ろに置きます。": "In a comparison, put 得多 after the adjective to mean 'much' rather than using 很.",
  "使役・依頼": "Causative and request",
  "使役：讓 / 叫 / 請": "Causative constructions with 讓, 叫, or 請",
  "〜に…させる・してもらう": "Make, let, or ask someone to do something",
  "「人に〜させる」「人に〜してもらう」「人に頼む」時。": "Use it when making or allowing someone to act, asking someone to act, or requesting help.",
  "「主語 + 讓/叫/請 + 人 + 動詞」！「讓」は許可・使役、「請」は丁寧な依頼。": "Use subject + 讓, 叫, or 請 + person + verb. 讓 expresses permission or causation; 請 makes a polite request.",
  "この台湾映画は私をとても感動させました。": "This Taiwan film moved me deeply.",
  "映画（主語）+ 讓 + 我（人）+ 感動（動作状態）。": "Film as subject + 讓 + 我 as the affected person + 感動 as the resulting state.",
  "兼語（人）の後には具体的な動作や目的語が必要です。": "The person after the causative verb must be followed by a specific action or predicate.",
  "「先生は学生に宿題をさせた」の正しい表現は？": "Which sentence correctly means 'The teacher made the students do their homework'?",
  "「主語 (老師) + 讓 + 人 (學生) + 動作 (寫作業)」の語順になります。": "The order is subject 老師 + 讓 + person 學生 + action 寫作業.",
} as const
