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
]
