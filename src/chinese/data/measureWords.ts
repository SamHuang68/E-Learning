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
    explanationZh?: string
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
  {
    id: 'mw-ben',
    classifierZh: '本',
    pinyin: 'běn',
    bopomofo: 'ㄅㄣˇ',
    categoryJa: '冊子・綴じた印刷物',
    usageRuleJa: '本、雑誌、ノートなど、ページが綴じてあるものに使います。',
    matchedNouns: [
      { nounZh: '書', pinyin: 'shū', meaningJa: '本', samplePhraseZh: '一本繁體中文書' },
      { nounZh: '雜誌', pinyin: 'zázhì', meaningJa: '雑誌', samplePhraseZh: '一本時尚雜誌' },
      { nounZh: '筆記本', pinyin: 'bǐjìběn', meaningJa: 'ノート', samplePhraseZh: '一本空白筆記本' },
    ],
    quiz: {
      nounZh: '筆記本',
      meaningJa: 'ノート',
      options: ['本', '張', '冊', '個'],
      correctIndex: 0,
      explanationJa: '綴じたノートや書籍には「本」を使います（一本筆記本）。学習用ドリルであり、流利度や TOCFL 合格を保証しません。',
      explanationZh: '裝訂成冊的書、雜誌、筆記本用「本」。教學練習，不是華語流利度或 TOCFL 通過保證。',
    },
  },
  {
    id: 'mw-jian-clothes',
    classifierZh: '件',
    pinyin: 'jiàn',
    bopomofo: 'ㄐㄧㄢˋ',
    categoryJa: '上衣・事案',
    usageRuleJa: 'シャツ、コートなど上半身の衣服や「事情」に使います。ズボンは「條」。',
    matchedNouns: [
      { nounZh: '衣服', pinyin: 'yīfu', meaningJa: '服', samplePhraseZh: '一件短袖衣服' },
      { nounZh: '外套', pinyin: 'wàitào', meaningJa: '上着', samplePhraseZh: '一件薄外套' },
      { nounZh: '事情', pinyin: 'shìqing', meaningJa: '用事・件', samplePhraseZh: '一件急事' },
    ],
    quiz: {
      nounZh: '襯衫',
      meaningJa: 'シャツ',
      options: ['件', '條', '張', '把'],
      correctIndex: 0,
      explanationJa: 'シャツなど上半身の服は「件」（一件襯衫）。ズボンは「條」。学習用であり TOCFL 合格保証ではありません。',
      explanationZh: '上衣、外套用「件」；褲子用「條」。教學練習，不是 TOCFL 通過保證。',
    },
  },
  {
    id: 'mw-zhi-animal',
    classifierZh: '隻',
    pinyin: 'zhī',
    bopomofo: 'ㄓ',
    categoryJa: '動物（台湾では隻）',
    usageRuleJa: '猫、犬、鳥など動物の数え方。台湾華語では「隻」が一般的です。',
    matchedNouns: [
      { nounZh: '貓', pinyin: 'māo', meaningJa: '猫', samplePhraseZh: '一隻小花貓' },
      { nounZh: '狗', pinyin: 'gǒu', meaningJa: '犬', samplePhraseZh: '一隻導盲犬' },
      { nounZh: '鳥', pinyin: 'niǎo', meaningJa: '鳥', samplePhraseZh: '一隻麻雀' },
    ],
    quiz: {
      nounZh: '流浪貓',
      meaningJa: '野良猫',
      options: ['隻', '條', '頭', '支'],
      correctIndex: 0,
      explanationJa: '猫や犬は「隻」（一隻貓）。「支」はペン類です。学習用であり流利度保証ではありません。',
      explanationZh: '台灣華語數動物多用「隻」，不要和「支」（筆）搞混。教學練習，不是流利度保證。',
    },
  },
  {
    id: 'mw-zhi-pen',
    classifierZh: '支',
    pinyin: 'zhī',
    bopomofo: 'ㄓ',
    categoryJa: '細長く硬い棒状のもの',
    usageRuleJa: 'ペン、歯ブラシ、ろうそくなど、細長く硬いものに使います。動物の「隻」と混同注意。',
    matchedNouns: [
      { nounZh: '原子筆', pinyin: 'yuánzǐbǐ', meaningJa: 'ボールペン', samplePhraseZh: '一支藍色原子筆' },
      { nounZh: '螢光筆', pinyin: 'yíngguāngbǐ', meaningJa: '蛍光ペン', samplePhraseZh: '一支黃色螢光筆' },
      { nounZh: '牙刷', pinyin: 'yáshuā', meaningJa: '歯ブラシ', samplePhraseZh: '一支新牙刷' },
    ],
    quiz: {
      nounZh: '原子筆',
      meaningJa: 'ボールペン',
      options: ['支', '隻', '條', '根'],
      correctIndex: 0,
      explanationJa: 'ボールペンは「支」（一支原子筆）。動物は「隻」。学習用であり検定合格保証ではありません。',
      explanationZh: '筆、牙刷用「支」；動物用「隻」。教學練習，不是檢定通過保證。',
    },
  },
  {
    id: 'mw-bei',
    classifierZh: '杯',
    pinyin: 'bēi',
    bopomofo: 'ㄅㄟ',
    categoryJa: 'カップ・グラスに入った飲み物',
    usageRuleJa: 'コーヒー、茶、タピオカドリンクなど、カップ単位の飲み物に使います。',
    matchedNouns: [
      { nounZh: '咖啡', pinyin: 'kāfēi', meaningJa: 'コーヒー', samplePhraseZh: '一杯美式咖啡' },
      { nounZh: '珍珠奶茶', pinyin: 'zhēnzhū nǎichá', meaningJa: 'タピオカミルクティー', samplePhraseZh: '一杯微糖珍珠奶茶' },
      { nounZh: '綠茶', pinyin: 'lǜchá', meaningJa: '緑茶', samplePhraseZh: '一杯冰綠茶' },
    ],
    quiz: {
      nounZh: '珍珠奶茶',
      meaningJa: 'タピオカミルクティー',
      options: ['杯', '瓶', '碗', '罐'],
      correctIndex: 0,
      explanationJa: '手搖飲料はカップ単位で「杯」（一杯珍珠奶茶）。学習用であり流利度保証ではありません。',
      explanationZh: '手搖、咖啡用「杯」；整瓶未開用「瓶」。教學練習，不是流利度保證。',
    },
  },
  {
    id: 'mw-liang',
    classifierZh: '輛',
    pinyin: 'liàng',
    bopomofo: 'ㄌㄧㄤˋ',
    categoryJa: '車輪のある乗り物',
    usageRuleJa: '自動車、バス、タクシーなど、車体のある乗り物に使います。',
    matchedNouns: [
      { nounZh: '汽車', pinyin: 'qìchē', meaningJa: '乗用車', samplePhraseZh: '一輛白色轎車' },
      { nounZh: '公車', pinyin: 'gōngchē', meaningJa: 'バス', samplePhraseZh: '一輛市區公車' },
      { nounZh: '計程車', pinyin: 'jìchéngchē', meaningJa: 'タクシー', samplePhraseZh: '一輛小黃計程車' },
    ],
    quiz: {
      nounZh: '計程車',
      meaningJa: 'タクシー',
      options: ['輛', '台', '條', '艘'],
      correctIndex: 0,
      explanationJa: 'タクシーやバスは「輛」。自転車・家電は「台」が多いです。学習用であり TOCFL 合格保証ではありません。',
      explanationZh: '汽車、公車、計程車用「輛」；腳踏車、家電常用「台」。教學練習，不是 TOCFL 通過保證。',
    },
  },
  {
    id: 'mw-tai',
    classifierZh: '台',
    pinyin: 'tái',
    bopomofo: 'ㄊㄞˊ',
    categoryJa: '機械・家電・自転車',
    usageRuleJa: 'パソコン、エアコン、YouBike など機械や自転車に台湾でよく使います。',
    matchedNouns: [
      { nounZh: '電腦', pinyin: 'diànnǎo', meaningJa: 'パソコン', samplePhraseZh: '一台筆記型電腦' },
      { nounZh: '冷氣', pinyin: 'lěngqì', meaningJa: 'エアコン', samplePhraseZh: '一台變頻冷氣' },
      { nounZh: 'YouBike', pinyin: 'YouBike', meaningJa: '台北の公共自転車', samplePhraseZh: '一台 YouBike' },
    ],
    quiz: {
      nounZh: '筆記型電腦',
      meaningJa: 'ノートパソコン',
      options: ['台', '輛', '個', '部'],
      correctIndex: 0,
      explanationJa: 'パソコンやエアコンは「台」（一台電腦）。学習用であり流利度保証ではありません。',
      explanationZh: '電腦、冷氣、YouBike 常用「台」。教學練習，不是流利度保證。',
    },
  },
  {
    id: 'mw-jian-room',
    classifierZh: '間',
    pinyin: 'jiān',
    bopomofo: 'ㄐㄧㄢ',
    categoryJa: '部屋・区画された空間',
    usageRuleJa: '部屋、教室、オフィスなど、仕切られた室内空間に使います。建物全体は「棟」。',
    matchedNouns: [
      { nounZh: '房間', pinyin: 'fángjiān', meaningJa: '部屋', samplePhraseZh: '一間單人套房' },
      { nounZh: '教室', pinyin: 'jiàoshì', meaningJa: '教室', samplePhraseZh: '一間空教室' },
      { nounZh: '辦公室', pinyin: 'bàngōngshì', meaningJa: '事務所', samplePhraseZh: '一間小小的辦公室' },
    ],
    quiz: {
      nounZh: '單人房',
      meaningJa: 'シングルルーム',
      options: ['間', '棟', '套', '個'],
      correctIndex: 0,
      explanationJa: '部屋は「間」（一間房）。建物全体は「棟」。学習用であり検定合格保証ではありません。',
      explanationZh: '房間、教室用「間」；整棟建築用「棟」。教學練習，不是檢定通過保證。',
    },
  },
  {
    id: 'mw-jia',
    classifierZh: '家',
    pinyin: 'jiā',
    bopomofo: 'ㄐㄧㄚ',
    categoryJa: '店舗・会社などの事業所',
    usageRuleJa: 'レストラン、コンビニ、会社など、店舗や企業単位に使います。',
    matchedNouns: [
      { nounZh: '餐廳', pinyin: 'cāntīng', meaningJa: 'レストラン', samplePhraseZh: '一家夜市附近的餐廳' },
      { nounZh: '便利商店', pinyin: 'biànlì shāngdiàn', meaningJa: 'コンビニ', samplePhraseZh: '一家 24 小時便利商店' },
      { nounZh: '公司', pinyin: 'gōngsī', meaningJa: '会社', samplePhraseZh: '一家新創公司' },
    ],
    quiz: {
      nounZh: '便利商店',
      meaningJa: 'コンビニ',
      options: ['家', '間', '棟', '個'],
      correctIndex: 0,
      explanationJa: 'コンビニや会社は「家」（一家便利商店）。学習用であり TOCFL 合格保証ではありません。',
      explanationZh: '餐廳、超商、公司用「家」。教學練習，不是 TOCFL 通過保證。',
    },
  },
  {
    id: 'mw-wei',
    classifierZh: '位',
    pinyin: 'wèi',
    bopomofo: 'ㄨㄟˋ',
    categoryJa: '人を数える丁寧な言い方',
    usageRuleJa: 'お客様、先生など、人を丁寧に数えるときに「位」を使います。「個」より敬意があります。',
    matchedNouns: [
      { nounZh: '客人', pinyin: 'kèrén', meaningJa: 'お客様', samplePhraseZh: '兩位客人' },
      { nounZh: '老師', pinyin: 'lǎoshī', meaningJa: '先生', samplePhraseZh: '一位國文老師' },
      { nounZh: '旅客', pinyin: 'lǚkè', meaningJa: '旅行者', samplePhraseZh: '三位旅客' },
    ],
    quiz: {
      nounZh: '客人',
      meaningJa: 'お客様',
      options: ['位', '個', '口', '名'],
      correctIndex: 0,
      explanationJa: 'お客様は丁寧に「位」（兩位客人）。学習用であり流利度保証ではありません。',
      explanationZh: '對人客氣時用「位」，不要隨手放「個」。教學練習，不是流利度保證。',
    },
  },
  {
    id: 'mw-shuang',
    classifierZh: '雙',
    pinyin: 'shuāng',
    bopomofo: 'ㄕㄨㄤ',
    categoryJa: '対になっているもの',
    usageRuleJa: '靴、靴下、箸など、二つで一組のものに使います。',
    matchedNouns: [
      { nounZh: '鞋子', pinyin: 'xiézi', meaningJa: '靴', samplePhraseZh: '一雙運動鞋' },
      { nounZh: '襪子', pinyin: 'wàzi', meaningJa: '靴下', samplePhraseZh: '一雙白襪子' },
      { nounZh: '筷子', pinyin: 'kuàizi', meaningJa: '箸', samplePhraseZh: '一雙免洗筷' },
    ],
    quiz: {
      nounZh: '運動鞋',
      meaningJa: 'スニーカー',
      options: ['雙', '隻', '件', '條'],
      correctIndex: 0,
      explanationJa: '靴一組は「雙」（一雙鞋）。片方だけなら「隻」。学習用であり検定合格保証ではありません。',
      explanationZh: '成雙的鞋、襪、筷用「雙」；單邊用「隻」。教學練習，不是檢定通過保證。',
    },
  },
  {
    id: 'mw-ke-round',
    classifierZh: '顆',
    pinyin: 'kē',
    bopomofo: 'ㄎㄜ',
    categoryJa: '小さく丸い粒',
    usageRuleJa: '薬、飴、星など、小さく丸いものに使います。木は「棵」。',
    matchedNouns: [
      { nounZh: '藥', pinyin: 'yào', meaningJa: '薬', samplePhraseZh: '一顆感冒藥' },
      { nounZh: '糖果', pinyin: 'tángguǒ', meaningJa: '飴', samplePhraseZh: '一顆薄荷糖' },
      { nounZh: '星星', pinyin: 'xīngxing', meaningJa: '星', samplePhraseZh: '一顆星星' },
    ],
    quiz: {
      nounZh: '感冒藥',
      meaningJa: '風邪薬',
      options: ['顆', '棵', '個', '粒'],
      correctIndex: 0,
      explanationJa: '錠剤は「顆」（一顆藥）。木は「棵」。学習用であり TOCFL 合格保証ではありません。',
      explanationZh: '藥丸、糖果用「顆」；樹用「棵」。教學練習，不是 TOCFL 通過保證。',
    },
  },
]
