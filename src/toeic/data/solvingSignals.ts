/**
 * TOEIC 多益英語：3 秒秒殺破題訊號卡資料庫 (Toeic 3-Second Solving Signals)
 * 專為多益 Part 5 (Incomplete Sentences) & Part 6 (Text Completion) 設計。
 * 提供看到題幹特徵 ➜ 3 秒反射考點 ➜ 排除干擾選項的直覺破題法（支援繁中與日本語解説）。
 */

export interface ToeicSolvingSignal {
  id: string
  title: string
  titleJa: string
  category: 'Grammar' | 'Vocabulary' | 'Collocation' | 'Part of Speech'
  triggerFeature: string
  triggerFeatureJa: string
  threeSecondRule: string
  threeSecondRuleJa: string
  formula: string
  exampleQuestion: {
    question: string
    options: string[]
    correctIndex: number
    explanationZh: string
    explanationJa: string
  }
  pitfallWarningZh: string
  pitfallWarningJa: string
}

export const TOEIC_SOLVING_SIGNALS: ToeicSolvingSignal[] = [
  {
    id: 'signal-causative',
    title: '使役動詞接原形動詞 (Causative Verbs)',
    titleJa: '使役動詞（make / have / let）＋ 原形不定詞',
    category: 'Grammar',
    triggerFeature: '看到 make, have, let + 受詞 (O) 後方接動詞空格',
    triggerFeatureJa: '設問文に make / have / let ＋ 目的語があり、後ろの動詞の形を問う時',
    threeSecondRule: '使役動詞讓某人做某事，主動時 3 秒秒殺選「原形動詞 (V)」，絕不選 to V！',
    threeSecondRuleJa: '使役動詞の後ろの能動態は「原形不定詞（動詞の原形）」を瞬時に選択。to不定詞は不可！',
    formula: 'make / have / let + Object + Base Verb (V)',
    exampleQuestion: {
      question: 'The manager had the assistant _____ the quarterly financial report.',
      options: ['to prepare', 'prepare', 'prepared', 'preparing'],
      correctIndex: 1,
      explanationZh: 'had 是使役動詞，受詞 the assistant 主動準備報告，故選原形動詞 prepare。',
      explanationJa: 'had（使役動詞）＋ the assistant（目的語）＋ 動詞の原形（prepare）の形になります。',
    },
    pitfallWarningZh: '注意：若為被動語態（讓某事被完成），則接過去分詞 (p.p.)，如 had the car repaired。',
    pitfallWarningJa: '目的語が「物」で受動の意味になる場合は、過去分詞（p.p.）が続きます。',
  },
  {
    id: 'signal-preposition-gerund',
    title: '介係詞後方接 V-ing 或名詞 (Preposition + Gerund)',
    titleJa: '前置詞 ＋ 動名詞（-ing）または名詞',
    category: 'Part of Speech',
    triggerFeature: '看到 in, on, at, by, for, without, after, before 等介係詞後方接空格 + 受詞',
    triggerFeatureJa: '前置詞の直後に空欄があり、その直後に目的語の名詞が続いている時',
    threeSecondRule: '空格後方有名詞受詞時，3 秒秒殺選動名詞「V-ing」以帶出受詞！',
    threeSecondRuleJa: '空欄の後ろに名詞（目的語）がある場合は、目的語を取れる「動名詞（-ing）」を選択！',
    formula: 'Preposition + Gerund (V-ing) + Object (Noun)',
    exampleQuestion: {
      question: 'Employees are responsible for _____ the confidential customer database.',
      options: ['update', 'updating', 'updated', 'updates'],
      correctIndex: 1,
      explanationZh: '介係詞 for 後面接受詞 the database，必須使用具動詞特性的動名詞 updating。',
      explanationJa: '前置詞forの後ろに目的語databaseがあるため、動名詞updatingが正解です。',
    },
    pitfallWarningZh: '注意：若空格後無受詞，可接普通名詞；但後方有名詞時必須選動名詞。',
    pitfallWarningJa: '後ろに名詞の目的語がある時は普通名詞ではなく動名詞を選びます。',
  },
  {
    id: 'signal-conjunction-vs-preposition',
    title: '連接詞 vs 介係詞秒殺 (Although vs Despite)',
    titleJa: '接続詞 vs 前置詞の判別（Although vs Despite）',
    category: 'Grammar',
    triggerFeature: '空格後是「S + V 完整子句」還是「名詞片語 (Noun Phrase)」',
    triggerFeatureJa: '空欄の後ろが「S+Vの文」か「名詞句」かを確認する時',
    threeSecondRule: '後接 S + V 選連接詞 (Although/Because/While)；後接名詞選介係詞 (Despite/Due to/During)！',
    threeSecondRuleJa: '後ろに節（S+V）があれば接続詞、名詞句だけなら前置詞を3秒で仕分け！',
    formula: 'Conjunction + S + V / Preposition + Noun Phrase',
    exampleQuestion: {
      question: '_____ the severe weather conditions, the flight departed on schedule.',
      options: ['Although', 'Despite', 'Even though', 'Because'],
      correctIndex: 1,
      explanationZh: '空格後 the severe weather conditions 是名詞片語無動詞，表示轉折故選介係詞 Despite。',
      explanationJa: '空欄の後ろが名詞句（動詞なし）なので、譲歩の前置詞Despiteを選びます。',
    },
    pitfallWarningZh: 'Despite = In spite of（介係詞，後不加 of）；Although = Even though（連接詞）。',
    pitfallWarningJa: 'Despite of は誤り（Despite単体またはIn spite of）。',
  },
  {
    id: 'signal-passive-voice',
    title: '被動語態與無受詞判別 (Passive Voice without Object)',
    titleJa: '受動態の識別（後ろに目的語がない他動詞）',
    category: 'Grammar',
    triggerFeature: '及物動詞空格後「沒有受詞名詞」，或後接 by + 行為者',
    triggerFeatureJa: '他動詞の空欄の後ろに目的語がなく、前置詞句（by...等）が続く時',
    threeSecondRule: '及物動詞後無受詞 ➜ 90% 必為「be + p.p.」被動態！',
    threeSecondRuleJa: '本来目的語を取る他動詞の後ろに名詞がない場合、9割以上が受動態（be + p.p.）！',
    formula: 'Subject + be + Past Participle (p.p.) + (by Agent)',
    exampleQuestion: {
      question: 'The new safety guidelines will be _____ to all staff members by tomorrow.',
      options: ['distribute', 'distributing', 'distributed', 'distribution'],
      correctIndex: 2,
      explanationZh: '空格前有 will be，guidelines（指南）是被分發，後接 to all staff 無名詞受詞，選 distributed。',
      explanationJa: '主語ガイドラインは「配布される」側であり、will beに続く過去分詞distributedが正解。',
    },
    pitfallWarningZh: '注意：不及物動詞（如 arrive, happen, occur, remain）無被動態！',
    pitfallWarningJa: '自動詞（occur, remain等）は受動態にできません。',
  },
  {
    id: 'signal-sva-neither',
    title: '主謂一致：Neither A nor B (Nearest noun)',
    titleJa: '主語と動詞の一致：Neither A nor B（近い名詞）',
    category: 'Grammar',
    triggerFeature: 'Neither A nor B 後方接動詞空格',
    triggerFeatureJa: 'Neither A nor B の後ろで動詞の形を問う時',
    threeSecondRule: '動詞與較近的 B 一致，不是與 A 或語意上的兩人。',
    threeSecondRuleJa: '動詞は近い方の名詞 B に一致させる。A や「二人」に合わせない。',
    formula: 'Neither A nor B + Verb (agrees with B)',
    exampleQuestion: {
      question: 'Neither the managers nor the intern _____ available this afternoon.',
      options: ['is', 'are', 'be', 'were'],
      correctIndex: 0,
      explanationZh: '較近名詞 intern 是單數，選 is。教學陷阱解析，非正式 ETS 成績。',
      explanationJa: '近い名詞 intern が単数なので is。学習用の引っかけ解説であり、公式ETSスコアではありません。',
    },
    pitfallWarningZh: '誤把 managers 當主詞而選 are。Either...or 同樣看較近名詞。',
    pitfallWarningJa: 'managers に合わせて are を選ぶ誤り。Either...or も近い名詞に一致。',
  },
  {
    id: 'signal-adj-adv',
    title: '詞性：動詞後接副詞 (Adj vs Adv)',
    titleJa: '品詞：動詞の後ろは副詞（形容詞との混同）',
    category: 'Grammar',
    triggerFeature: '空格修飾動詞（worked / completed / increased）而非名詞',
    triggerFeatureJa: '空欄が動詞を修飾している（名詞ではない）時',
    threeSecondRule: '修飾動詞選 -ly 副詞；修飾名詞選形容詞。',
    threeSecondRuleJa: '動詞を修飾するなら副詞（-ly）。名詞を修飾するなら形容詞。',
    formula: 'Verb + adverb;  adjective + noun',
    exampleQuestion: {
      question: 'The audit team completed the review _____.',
      options: ['successfully', 'successful', 'success', 'succeed'],
      correctIndex: 0,
      explanationZh: 'completed 是動詞，需副詞 successfully。教學陷阱解析，非正式 ETS 成績。',
      explanationJa: 'completed は動詞なので副詞 successfully。学習用の引っかけ解説であり、公式ETSスコアではありません。',
    },
    pitfallWarningZh: '看到 success 詞族就選名詞。先問空格修飾誰。',
    pitfallWarningJa: 'success の語群を見て名詞を選ぶ誤り。何を修飾しているかを先に見る。',
  },
  {
    id: 'signal-parallel-not-only',
    title: '對等結構：not only A but also B',
    titleJa: '並列構造：not only A but also B',
    category: 'Grammar',
    triggerFeature: 'not only ... but also 兩側詞性或形式須對等',
    triggerFeatureJa: 'not only ... but also の両側の品詞・形が揃っているか',
    threeSecondRule: 'A 與 B 用同一詞性（都是形容詞、名詞或 V-ing）。',
    threeSecondRuleJa: 'A と B は同じ品詞（形容詞同士、名詞同士、V-ing 同士）。',
    formula: 'not only X but also Y (same part of speech)',
    exampleQuestion: {
      question: 'The proposal is not only practical but also _____.',
      options: ['affordable', 'afford', 'affordably', 'affording'],
      correctIndex: 0,
      explanationZh: 'practical 是形容詞，對等選 affordable。教學陷阱解析，非正式 ETS 成績。',
      explanationJa: 'practical が形容詞なので対になる affordable。学習用の引っかけ解説であり、公式ETSスコアではありません。',
    },
    pitfallWarningZh: '後側誤選副詞或動詞。both...and、either...or 同樣要對等。',
    pitfallWarningJa: '後ろを副詞や動詞にする誤り。both...and、either...or も並列。',
  },
  {
    id: 'signal-relative-who-which',
    title: '關係代名詞：who vs which',
    titleJa: '関係代名詞：who と which',
    category: 'Grammar',
    triggerFeature: '先行詞是人還是事物，後方接動詞',
    triggerFeatureJa: '先行詞が人か物事か、後ろに動詞が続く時',
    threeSecondRule: '人用 who；事物用 which；that 可兼用，但介係詞後不用 that。',
    threeSecondRuleJa: '人は who、物事は which。that は両方可だが前置詞の直後には使わない。',
    formula: 'person + who;  thing + which',
    exampleQuestion: {
      question: 'The engineer _____ designed the prototype will present it on Friday.',
      options: ['who', 'which', 'whose', 'where'],
      correctIndex: 0,
      explanationZh: '先行詞 engineer 是人，主格選 who。教學陷阱解析，非正式 ETS 成績。',
      explanationJa: '先行詞 engineer は人なので主格 who。学習用の引っかけ解説であり、公式ETSスコアではありません。',
    },
    pitfallWarningZh: '人卻選 which。所有格用 whose；受格口語可用 who，正式可用 whom。',
    pitfallWarningJa: '人なのに which を選ぶ誤り。所有は whose。目的格は口語 who、格式 whom。',
  },
  {
    id: 'signal-subjunctive-suggest',
    title: '假設語氣：suggest that + 原形',
    titleJa: '仮定法現在：suggest that ＋ 原形',
    category: 'Grammar',
    triggerFeature: 'suggest / recommend / insist / request that 後方動詞空格',
    triggerFeatureJa: 'suggest / recommend / insist / request that の後ろの動詞',
    threeSecondRule: '美式商務寫作常接原形動詞，不加 -s，也不用 should 也可。',
    threeSecondRuleJa: '米式ビジネスでは動詞の原形。-s を付けない。should は省略されやすい。',
    formula: 'suggest that + subject + base verb',
    exampleQuestion: {
      question: 'The director suggested that the team _____ the draft by noon.',
      options: ['submit', 'submits', 'submitted', 'submitting'],
      correctIndex: 0,
      explanationZh: 'suggested that 後接原形 submit，不是 submits。教學陷阱解析，非正式 ETS 成績。',
      explanationJa: 'suggested that の後ろは原形 submit であり submits ではない。学習用の引っかけ解説であり、公式ETSスコアではありません。',
    },
    pitfallWarningZh: '依主詞 team 而選 submits。這不是一般現在式一致。',
    pitfallWarningJa: '主語 team に合わせて submits を選ぶ誤り。通常の現在形一致ではない。',
  },
  {
    id: 'signal-look-forward-to',
    title: '介係詞 to：look forward to + V-ing',
    titleJa: '前置詞 to：look forward to ＋ V-ing',
    category: 'Grammar',
    triggerFeature: 'look forward to / be used to / object to 後方動詞空格',
    triggerFeatureJa: 'look forward to / be used to / object to の後ろの動詞',
    threeSecondRule: '此處 to 是介係詞，接 V-ing 或名詞，不接原形。',
    threeSecondRuleJa: 'ここの to は前置詞。V-ing か名詞であり、原形は不可。',
    formula: 'look forward to + gerund (V-ing)',
    exampleQuestion: {
      question: 'We look forward to _____ you at the Taipei office.',
      options: ['meeting', 'meet', 'met', 'meets'],
      correctIndex: 0,
      explanationZh: 'to 是介係詞，選 meeting。教學陷阱解析，非正式 ETS 成績。',
      explanationJa: 'to は前置詞なので meeting。学習用の引っかけ解説であり、公式ETSスコアではありません。',
    },
    pitfallWarningZh: '把 to 當不定詞而選 meet。want to 才接原形。',
    pitfallWarningJa: 'to 不定詞と誤解して meet を選ぶ。want to なら原形。',
  },
  {
    id: 'signal-so-such',
    title: '程度：so vs such',
    titleJa: '程度：so と such',
    category: 'Grammar',
    triggerFeature: '空格後是形容詞單獨出現，或 a/an + 形容詞 + 名詞',
    triggerFeatureJa: '空欄の後ろが形容詞だけか、a/an＋形容詞＋名詞か',
    threeSecondRule: 'so + 形容詞／副詞；such + (a/an) + 形容詞 + 名詞。',
    threeSecondRuleJa: 'so ＋ 形容詞／副詞。such ＋ (a/an) ＋ 形容詞 ＋ 名詞。',
    formula: 'so + adj;  such + a/an + adj + noun',
    exampleQuestion: {
      question: 'It was _____ a successful launch that orders doubled in a week.',
      options: ['such', 'so', 'too', 'enough'],
      correctIndex: 0,
      explanationZh: 'a successful launch 是名詞片語，選 such。教學陷阱解析，非正式 ETS 成績。',
      explanationJa: 'a successful launch は名詞句なので such。学習用の引っかけ解説であり、公式ETSスコアではありません。',
    },
    pitfallWarningZh: '看到 successful 就選 so。so successful a launch 較少見。',
    pitfallWarningJa: 'successful を見て so を選ぶ誤り。so successful a launch は稀。',
  },
  {
    id: 'signal-for-since',
    title: '現在完成：for vs since',
    titleJa: '現在完了：for と since',
    category: 'Grammar',
    triggerFeature: 'has/have + p.p. 後方空格接時間',
    triggerFeatureJa: 'has/have ＋ 過去分詞の後ろで時を表す語句',
    threeSecondRule: 'for 接一段時間；since 接起點（年份、日期、then）。',
    threeSecondRuleJa: 'for は期間。since は起点（年・日付・then）。',
    formula: 'for + duration;  since + starting point',
    exampleQuestion: {
      question: 'Ms. Chen has worked at this branch _____ 2019.',
      options: ['since', 'for', 'during', 'while'],
      correctIndex: 0,
      explanationZh: '2019 是起點，選 since。教學陷阱解析，非正式 ETS 成績。',
      explanationJa: '2019 は起点なので since。学習用の引っかけ解説であり、公式ETSスコアではありません。',
    },
    pitfallWarningZh: '年份卻選 for。for five years 才接期間。during 不與完成式起點搭配。',
    pitfallWarningJa: '年なのに for を選ぶ誤り。for five years は期間。during は起点に使わない。',
  },
]
