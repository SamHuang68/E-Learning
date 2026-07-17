export type Unit = {
  id: number
  title: string
  titleJa: string
  color: string
  words: number
  reading: number
  grammar: string
}

/** Top-level JLPT track (difficulty + audience). Kana is a separate foundation layer. */
export type JlptLevel = {
  id: string
  band: string
  tier: string
  color: string
  scoreHint: string
  audience: string
  mapTitle: string
  mapDesc: string
  units: Unit[]
}

export const jlptLevels: JlptLevel[] = [
  {
    id: 'n5n4',
    band: 'N5 / N4',
    tier: '基礎',
    color: '#3f8f7a',
    scoreHint: '生活常見詞彙與短句',
    audience:
      '適合初學者至基礎對話階段，測驗生活常見詞彙與短句。建議先完成五十音（平／片假名）再建單字與短句。',
    mapTitle: 'N5／N4 基礎課程地圖',
    mapDesc: '從問候、家庭、時間到旅行與日常溝通，建立可開口的日語基礎。',
    units: [
      {
        id: 1,
        title: '自我介紹與問候',
        titleJa: 'はじめまして',
        color: '#3f8f7a',
        words: 24,
        reading: 3,
        grammar: 'です／ます形',
      },
      {
        id: 2,
        title: '家庭與人物',
        titleJa: 'わたしの家族',
        color: '#4f91c7',
        words: 28,
        reading: 3,
        grammar: 'の・も・と',
      },
      {
        id: 3,
        title: '數字與時間',
        titleJa: 'なんじですか',
        color: '#6b7fd7',
        words: 32,
        reading: 4,
        grammar: '時・分の言い方',
      },
      {
        id: 4,
        title: '飲食與餐廳',
        titleJa: 'たべもの',
        color: '#c47a4a',
        words: 30,
        reading: 3,
        grammar: 'を・が・ください',
      },
      {
        id: 5,
        title: '旅行與交通',
        titleJa: 'りょこう',
        color: '#5a9b8a',
        words: 34,
        reading: 4,
        grammar: 'て形・へ・で',
      },
      {
        id: 6,
        title: '經驗與邀請',
        titleJa: 'けいけん',
        color: '#7a8f4f',
        words: 32,
        reading: 4,
        grammar: 'た形・ませんか',
      },
    ],
  },
  {
    id: 'n3',
    band: 'N3',
    tier: '中級',
    color: '#4f91c7',
    scoreHint: '稍複雜文章與常速對話',
    audience:
      '過渡級別，能理解稍複雜的文章與常速對話。適合已會五十音與基礎句型、準備銜接職場／留學前的學習者。',
    mapTitle: 'N3 中級課程地圖',
    mapDesc: '強化閱讀節奏、聽力常速與中級文法對比，銜接進階溝通。',
    units: [
      {
        id: 1,
        title: '日常長文閱讀',
        titleJa: 'ちょっとむずかしい話',
        color: '#4f91c7',
        words: 40,
        reading: 5,
        grammar: '〜ように／〜ことになる',
      },
      {
        id: 2,
        title: '常速對話聽解',
        titleJa: 'はやい会話',
        color: '#3f8f7a',
        words: 36,
        reading: 4,
        grammar: '〜てしまう／〜ておく',
      },
      {
        id: 3,
        title: '意見與理由',
        titleJa: 'いけん',
        color: '#6b7fd7',
        words: 38,
        reading: 4,
        grammar: '〜からだ／〜ためだ',
      },
      {
        id: 4,
        title: '職場入門情境',
        titleJa: 'しごとのきほん',
        color: '#c47a4a',
        words: 42,
        reading: 5,
        grammar: '敬語入門',
      },
      {
        id: 5,
        title: '新聞與公告',
        titleJa: 'お知らせ',
        color: '#5a9b8a',
        words: 40,
        reading: 5,
        grammar: '受身・使役入門',
      },
      {
        id: 6,
        title: '中級總複習',
        titleJa: 'まとめ',
        color: '#7a8f4f',
        words: 44,
        reading: 6,
        grammar: '連接表現總整',
      },
    ],
  },
  {
    id: 'n2n1',
    band: 'N2 / N1',
    tier: '進階',
    color: '#8a6d3b',
    scoreHint: '求職／留學常見門檻',
    audience:
      '求職或留學的常見門檻。N2 具備流利生活與職場溝通能力；N1 則要求理解專業評論及學術內容。',
    mapTitle: 'N2／N1 進階課程地圖',
    mapDesc: '從職場協商、專業閱讀到學術評論，對齊進階門檻。',
    units: [
      {
        id: 1,
        title: '職場流利溝通',
        titleJa: 'ビジネス会話',
        color: '#8a6d3b',
        words: 48,
        reading: 5,
        grammar: '敬語・謙譲語精練',
      },
      {
        id: 2,
        title: '會議與協商',
        titleJa: 'かいぎと交渉',
        color: '#4f91c7',
        words: 50,
        reading: 5,
        grammar: '婉曲・提案表現',
      },
      {
        id: 3,
        title: '專業評論閱讀',
        titleJa: 'ろんせつ',
        color: '#6b7fd7',
        words: 55,
        reading: 6,
        grammar: '硬質連接詞',
      },
      {
        id: 4,
        title: '學術短文理解',
        titleJa: 'レポート',
        color: '#3f8f7a',
        words: 58,
        reading: 6,
        grammar: '論文定型表現',
      },
      {
        id: 5,
        title: '社會議題討論',
        titleJa: 'しゃかもんだい',
        color: '#c47a4a',
        words: 52,
        reading: 6,
        grammar: '主張・反論結構',
      },
      {
        id: 6,
        title: 'N1 綜合演練',
        titleJa: '総合問題',
        color: '#7a8f4f',
        words: 60,
        reading: 7,
        grammar: '高級文法總整',
      },
    ],
  },
]

/** @deprecated use jlptLevels — kept for any stray imports during migration */
export const semesters = jlptLevels.map((l) => ({
  id: l.id,
  label: `${l.band} · ${l.tier}`,
  mapTitle: l.mapTitle,
  mapDesc: l.mapDesc,
  units: l.units,
}))

export const themes = [
  { id: 'travel', label: '旅行會話', labelEn: 'Travel' },
  { id: 'business', label: '商務日語', labelEn: 'Business' },
  { id: 'daily', label: '日常生活', labelEn: 'Daily Life' },
  { id: 'anime', label: '動漫文化', labelEn: 'Anime' },
  { id: 'jlpt', label: 'JLPT 備考', labelEn: 'JLPT Prep' },
  { id: 'food', label: '美食點餐', labelEn: 'Food' },
]

export const levels = [
  { id: 'n5', label: 'N5', desc: '初學', icon: 'あ' },
  { id: 'n4', label: 'N4', desc: '基礎', icon: 'い' },
  { id: 'n3', label: 'N3', desc: '中級', icon: 'う' },
  { id: 'n2', label: 'N2', desc: '進階', icon: 'え' },
  { id: 'n1', label: 'N1', desc: '高級', icon: 'お' },
]

export const modes = [
  {
    id: 'flashcards',
    label: '單字記憶',
    labelEn: 'Flashcards',
    desc: '高頻字卡循環，先辨識再產出',
  },
  {
    id: 'conversation',
    label: '情境對話',
    labelEn: 'Conversation',
    desc: '雙人角色扮演，自然口語節奏',
  },
  {
    id: 'grammar',
    label: '文法精練',
    labelEn: 'Grammar Drill',
    desc: '句型拆解＋替換練習',
  },
  {
    id: 'immersion',
    label: '沉浸故事',
    labelEn: 'Immersion',
    desc: '短篇敘事帶出語感與文化',
  },
]

export type Template = {
  id: string
  title: string
  desc: string
  icon: string
  config: Partial<BuilderConfig>
}

export type HostConfig = {
  name: string
  gender: string
  tone: string
  persona: string
}

export type BuilderConfig = {
  topic: string
  theme: string
  level: string
  mode: string
  hostA: HostConfig
  hostB: HostConfig
}

export const defaultConfig: BuilderConfig = {
  topic: '東京三日旅遊會話',
  theme: 'travel',
  level: 'n4',
  mode: 'conversation',
  hostA: {
    name: 'Yuki',
    gender: 'female',
    tone: '溫柔、清楚、鼓勵型',
    persona: '東京出身的日語老師，擅長旅行日語與敬語切換，會用簡單日文解釋。',
  },
  hostB: {
    name: 'Ken',
    gender: 'male',
    tone: '活潑、好奇、提問型',
    persona: '剛到日本的台灣學習者，會問實用問題並偶發自然錯誤供訂正。',
  },
}

export const templates: Template[] = [
  {
    id: 'travel-n5',
    title: '初學者旅行',
    desc: '車站、點餐、問路三段對話',
    icon: '列車',
    config: {
      topic: '第一次到日本：車站與便利商店',
      theme: 'travel',
      level: 'n5',
      mode: 'conversation',
    },
  },
  {
    id: 'jlpt-n3',
    title: 'JLPT N3 衝刺',
    desc: '文法對比＋閱讀理解節奏',
    icon: '試験',
    config: {
      topic: 'N3 文法對比：てしまう vs ておく',
      theme: 'jlpt',
      level: 'n3',
      mode: 'grammar',
    },
  },
  {
    id: 'business',
    title: '商務郵件',
    desc: '會議邀請與謙讓語練習',
    icon: '会議',
    config: {
      topic: '商務日語：會議邀請郵件與電話確認',
      theme: 'business',
      level: 'n2',
      mode: 'conversation',
      hostA: {
        name: 'Sato',
        gender: 'female',
        tone: '專業、簡潔、有禮',
        persona: '日企總務，熟悉敬語與商務書信慣例。',
      },
      hostB: {
        name: 'Lin',
        gender: 'male',
        tone: '謹慎、求證型',
        persona: '外商業務，正在學習商業敬語與郵件格式。',
      },
    },
  },
  {
    id: 'anime',
    title: '動漫口語',
    desc: '日常口語與角色語氣差異',
    icon: '物語',
    config: {
      topic: '動漫對話裡的口語與男女用語差異',
      theme: 'anime',
      level: 'n3',
      mode: 'immersion',
    },
  },
  {
    id: 'vocab',
    title: '飲食字庫',
    desc: '菜單單字＋點餐句型',
    icon: '料理',
    config: {
      topic: '居酒屋菜單與點餐必備字彙',
      theme: 'food',
      level: 'n5',
      mode: 'flashcards',
    },
  },
]
