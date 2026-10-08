/**
 * 台灣華語：高頻成語、歇後語與台灣本土諺語文化資料庫 (Chinese Idioms & Taiwanese Proverbs)
 * 專門幫助日本語母語者掌握台灣人在生活與職場中最常使用的四字成語與在地趣味諺語。
 */

export interface IdiomItem {
  id: string
  idiomZh: string
  pinyin: string
  bopomofo: string
  type: '成語 (Idiom)' | '台灣諺語 (Proverb)' | '歇後語 (Twister)'
  meaningJa: string
  originStoryJa: string
  usageSituationJa: string
  exampleSentenceZh: string
  exampleSentenceJa: string
  quiz: {
    cloze: string // 如 "一舉____"
    options: string[]
    correctIndex: number
    explanationJa: string
  }
}

export const CHINESE_IDIOMS: IdiomItem[] = [
  {
    id: 'idiom-yijian-ergu',
    idiomZh: '一兼二顧，摸蜊仔兼洗褲',
    pinyin: 'yī jiān èr gù, mō lí zǐ jiān xǐ kù',
    bopomofo: 'ㄧ ㄐㄧㄢ ㄦˋ ㄍㄨˋ，ㄇㄛ ㄌㄧˊ ㄗˇ ㄐㄧㄢ ㄒㄧˇ ㄎㄨˋ',
    type: '台灣諺語 (Proverb)',
    meaningJa: '一石二鳥、一挙両得（川でシジミを獲りながらズボンも洗う）',
    originStoryJa: '台湾の農村で川に入ってシジミ（蜊仔）を採るついでに、履いているズボンも一緒に洗濯したという生活の知恵から生まれた台湾で最も有名な諺。',
    usageSituationJa: '一度の行動で2つのメリットが得られる時に台湾人が日常会話でよく使います。',
    exampleSentenceZh: '去夜市吃小吃順便買伴手禮，真是一兼二顧，摸蜊仔兼洗褲！',
    exampleSentenceJa: '夜市でグルメを楽しみつつお土産も買えるなんて、まさに一石二鳥だね！',
    quiz: {
      cloze: '去夜市吃小吃順便買伴手禮，真是一兼二顧，____！',
      options: ['摸蜊仔兼洗褲', '天上掉餡餅', '畫蛇添足', '井底之蛙'],
      correctIndex: 0,
      explanationJa: '台湾の定番諺「一兼二顧，摸蜊仔兼洗褲（一石二鳥）」が入ります。',
    },
  },
  {
    id: 'idiom-rujing-suisu',
    idiomZh: '入境隨俗',
    pinyin: 'rù jìng suí sú',
    bopomofo: 'ㄖㄨˋ ㄐㄧㄥˋ ㄙㄨㄟˊ ㄙㄨˊ',
    type: '成語 (Idiom)',
    meaningJa: '郷に入っては郷に従え',
    originStoryJa: 'ある土地に入ったら、その地域の風俗や習慣に従うのが礼儀であるという教え。',
    usageSituationJa: '台湾の夜市での注文ルールやMRTでの飲食禁止マナーなど、現地の文化に馴染む場面で使います。',
    exampleSentenceZh: '來到臺灣就要入境隨俗，搭捷運時絕對不能喝飲料。',
    exampleSentenceJa: '台湾に来たなら郷に従い、MRT（地下鉄）に乗る時は絶対に飲み物を飲んではいけません。',
    quiz: {
      cloze: '來到臺灣就要____，搭捷運時不能飲食。',
      options: ['入境隨俗', '畫龍點睛', '津津有味', '事倍功半'],
      correctIndex: 0,
      explanationJa: '現地の習慣に従うという意味の「入境隨俗」が正解です。',
    },
  },
  {
    id: 'idiom-jinjin-youwei',
    idiomZh: '津津有味',
    pinyin: 'jīn jīn yǒu wèi',
    bopomofo: 'ㄐㄧㄣ ㄐㄧㄣ ㄧㄡˇ ㄨㄟˋ',
    type: '成語 (Idiom)',
    meaningJa: '津々として味がある、非常に美味しく・興味深く楽しむ様子',
    originStoryJa: '「津津」は唾液が湧き出るほど食欲をそそる様子のこと。',
    usageSituationJa: '台湾グルメを美味しそうに食べている時や、面白い本・ドラマに熱中している時に使います。',
    exampleSentenceZh: '外國朋友第一次吃芒果雪花冰，吃得津津有味。',
    exampleSentenceJa: '外国人の友達が初めてマンゴー雪花かき氷を食べ、とても美味しそうに頬張っていました。',
    quiz: {
      cloze: '看他吃小籠包吃得____，我也忍不住想點一籠。',
      options: ['津津有味', '亂七八糟', '自相矛盾', '守株待兔'],
      correctIndex: 0,
      explanationJa: '美味しそうに味わう様子を表す「津津有味」が正解です。',
    },
  },
  {
    id: 'idiom-shiban-gongbei',
    idiomZh: '事半功倍',
    pinyin: 'shì bàn gōng bèi',
    bopomofo: 'ㄕˋ ㄅㄢˋ ㄍㄨㄥ ㄅㄟˋ',
    type: '成語 (Idiom)',
    meaningJa: '労力は半分で効果は倍（非常に効率が良い）',
    originStoryJa: '『孟子』公孫丑上より。良い学習法や道具を使うことで最小限の努力で最大の成果を上げることを指す。',
    usageSituationJa: '効率的な学習法やアプリを活用して成績を伸ばす場面で使います。',
    exampleSentenceZh: '用 3 秒破題訊號學文法，真是事半功倍！',
    exampleSentenceJa: '3秒解答シグナルを使って文法を学ぶと、労力半分で倍の効果が得られます！',
    quiz: {
      cloze: '掌握了正確的學習方法，複習起來自然____。',
      options: ['事半功倍', '事倍功半', '半斤八兩', '畫蛇添足'],
      correctIndex: 0,
      explanationJa: '効率よく成果が出る「事半功倍」が正解です（「事倍功半」は逆の意味で非効率）。',
    },
  },
]

export const CHINESE_SUPPORT_EN = {
  "台灣諺語 (Proverb)": "Taiwanese proverb",
  "一石二鳥、一挙両得（川でシジミを獲りながらズボンも洗う）": "Two benefits from one action—gathering clams while washing one's trousers",
  "台湾の農村で川に入ってシジミ（蜊仔）を採るついでに、履いているズボンも一緒に洗濯したという生活の知恵から生まれた台湾で最も有名な諺。": "This well-known Taiwan proverb grew from rural ingenuity: people waded into a river to gather clams and washed the trousers they were wearing at the same time.",
  "一度の行動で2つのメリットが得られる時に台湾人が日常会話でよく使います。": "It is commonly used in Taiwan when one action produces two benefits.",
  "夜市でグルメを楽しみつつお土産も買えるなんて、まさに一石二鳥だね！": "Enjoying night-market food while buying souvenirs really gives us two benefits at once.",
  "台湾の定番諺「一兼二顧，摸蜊仔兼洗褲（一石二鳥）」が入ります。": "The blank takes the familiar Taiwan proverb meaning 'two benefits from one action.'",
  "成語 (Idiom)": "Four-character idiom",
  "郷に入っては郷に従え": "When in Rome, do as the Romans do",
  "ある土地に入ったら、その地域の風俗や習慣に従うのが礼儀であるという教え。": "It teaches that visitors should respect the customs and practices of the place they enter.",
  "台湾の夜市での注文ルールやMRTでの飲食禁止マナーなど、現地の文化に馴染む場面で使います。": "Use it when adapting to local culture, such as night-market ordering conventions or the MRT's no-food-and-drink rule.",
  "台湾に来たなら郷に従い、MRT（地下鉄）に乗る時は絶対に飲み物を飲んではいけません。": "When in Taiwan, follow local customs and do not drink while riding the MRT.",
  "現地の習慣に従うという意味の「入境隨俗」が正解です。": "The correct idiom means to follow local customs after entering a place.",
  "津々として味がある、非常に美味しく・興味深く楽しむ様子": "Enjoying something with great relish or interest",
  "「津津」は唾液が湧き出るほど食欲をそそる様子のこと。": "The repeated word describes something so appetising that it makes the mouth water.",
  "台湾グルメを美味しそうに食べている時や、面白い本・ドラマに熱中している時に使います。": "Use it for someone relishing Taiwan food or becoming absorbed in an engaging book or drama.",
  "外国人の友達が初めてマンゴー雪花かき氷を食べ、とても美味しそうに頬張っていました。": "My friend from abroad ate mango snow ice for the first time and savoured every bite.",
  "美味しそうに味わう様子を表す「津津有味」が正解です。": "The correct idiom describes enjoying something with relish.",
  "労力は半分で効果は倍（非常に効率が良い）": "Half the effort for twice the result—highly efficient",
  "『孟子』公孫丑上より。良い学習法や道具を使うことで最小限の努力で最大の成果を上げることを指す。": "From the Mencius, this idiom describes achieving greater results with less effort by using an effective method or tool.",
  "効率的な学習法やアプリを活用して成績を伸ばす場面で使います。": "Use it when an efficient study method or app improves learning results.",
  "3秒解答シグナルを使って文法を学ぶと、労力半分で倍の効果が得られます！": "Learning grammar with three-second answer signals can produce twice the result with half the effort.",
  "効率よく成果が出る「事半功倍」が正解です（「事倍功半」は逆の意味で非効率）。": "The correct idiom means achieving strong results efficiently; reversing its halves means the opposite, poor efficiency.",
} as const
