/**
 * 台灣華語：高頻量詞與名詞搭配資料庫 (Chinese Classifiers & Measure Words)
 * 專為日本語母語者掌握中文豐富且精確的量詞分類（形狀、功能、容器與文化習慣）。
 */

export interface MeasureWordItem {
  id: string
  classifierZh: string
  pinyin: string
  bopomofo: string
  categoryJa: string // 分類特徵（平面物、帶把手物、細長物、建築物等）
  usageRuleJa: string
  matchedNouns: Array<{
    nounZh: string
    pinyin: string
    meaningJa: string
    samplePhraseZh: string
  }>
  quiz: {
    nounZh: string
    meaningJa: string
    options: string[]
    correctIndex: number
    explanationJa: string
  }
}

export const MEASURE_WORDS: MeasureWordItem[] = [
  {
    id: 'mw-zhang',
    classifierZh: '張',
    pinyin: 'zhāng',
    bopomofo: 'ㄓㄤ',
    categoryJa: '平面・薄いもの、広げられるもの',
    usageRuleJa: '紙、チケット、テーブル、ベッド、写真、顔など、平らな面を持つ物体に広く使われます。',
    matchedNouns: [
      { nounZh: '桌子', pinyin: 'zhuōzi', meaningJa: '机・テーブル', samplePhraseZh: '一張四人桌' },
      { nounZh: '票', pinyin: 'piào', meaningJa: '切符・チケット', samplePhraseZh: '一張高鐵票' },
      { nounZh: '照片', pinyin: 'zhàopiàn', meaningJa: '写真', samplePhraseZh: '一張美麗的風景照' },
    ],
    quiz: {
      nounZh: '高鐵車票',
      meaningJa: '台湾新幹線の乗車券',
      options: ['張', '把', '條', '本'],
      correctIndex: 0,
      explanationJa: '薄い紙やチケットには「張」を使います（一張高鐵車票）。',
    },
  },
  {
    id: 'mw-ba',
    classifierZh: '把',
    pinyin: 'bǎ',
    bopomofo: 'ㄅㄚˇ',
    categoryJa: '取っ手・柄（え）のあるもの、手で握れるもの',
    usageRuleJa: '傘、ハサミ、ナイフ、椅子、扇子など、手で掴む部分（取っ手）がある道具に使います。',
    matchedNouns: [
      { nounZh: '雨傘', pinyin: 'yǔsǎn', meaningJa: '傘', samplePhraseZh: '一把折疊傘' },
      { nounZh: '椅子', pinyin: 'yǐzi', meaningJa: '椅子', samplePhraseZh: '一把木頭椅子' },
      { nounZh: '剪刀', pinyin: 'jiǎndāo', meaningJa: 'ハサミ', samplePhraseZh: '一把鋒利的剪刀' },
    ],
    quiz: {
      nounZh: '雨傘',
      meaningJa: '傘（持ち手がある道具）',
      options: ['把', '支', '條', '根'],
      correctIndex: 0,
      explanationJa: '傘やハサミなど手で握る取っ手があるものには「把」を使います（一把雨傘）。',
    },
  },
  {
    id: 'mw-dong-hu',
    classifierZh: '棟',
    pinyin: 'dòng',
    bopomofo: 'ㄉㄨㄥˋ',
    categoryJa: '独立した建物・高層ビル',
    usageRuleJa: '独立した一棟の建造物には「棟」、マンションの一世帯には「戶」を使います。',
    matchedNouns: [
      { nounZh: '大樓', pinyin: 'dàlóu', meaningJa: 'ビル・高層ビル', samplePhraseZh: '一棟台北101摩天大樓' },
      { nounZh: '公寓', pinyin: 'gōngyù', meaningJa: 'アパート・マンション棟', samplePhraseZh: '一棟老公寓' },
    ],
    quiz: {
      nounZh: '台北 101 大樓',
      meaningJa: '台北101ビル（巨大な建造物）',
      options: ['棟', '間', '個', '套'],
      correctIndex: 0,
      explanationJa: '独立した高層ビルや建築物には「棟」を使います（一棟大樓）。',
    },
  },
  {
    id: 'mw-tiao',
    classifierZh: '條',
    pinyin: 'tiáo',
    bopomofo: 'ㄊㄧㄠˊ',
    categoryJa: '細長くてしなやかなもの、道や川など',
    usageRuleJa: '道路、川、ズボン、魚、タオル、マフラーなど、細長く柔軟なものに使います。',
    matchedNouns: [
      { nounZh: '路', pinyin: 'lù', meaningJa: '道・道路', samplePhraseZh: '一條熱鬧的夜市街' },
      { nounZh: '魚', pinyin: 'yú', meaningJa: '魚', samplePhraseZh: '一條新鮮的虱目魚' },
      { nounZh: '褲子', pinyin: 'kùzi', meaningJa: 'ズボン', samplePhraseZh: '一條牛仔褲' },
    ],
    quiz: {
      nounZh: '牛仔褲',
      meaningJa: 'ジーンズ・ズボン',
      options: ['條', '件', '張', '個'],
      correctIndex: 0,
      explanationJa: 'ズボンやスカートなど下半身の細長い衣服には「條」を使います（一條牛仔褲）。上半身の服は「件」。',
    },
  },
]
