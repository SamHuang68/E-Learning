/**
 * 台湾華語・TOCFL（華語文能力測驗）A1/A2 模擬試験問題データベース
 * 專為日本語母語者設計：涵蓋聽力對話理解、詞彙與語法、閱讀理解，並附帶繁體中文、拼音、注音與日語詳細解析。
 */

export interface TocflQuestion {
  id: string
  level: 'A1 (入門級)' | 'A2 (基礎級)'
  section: '聽力理解 (Listening)' | '詞彙語法 (Grammar/Vocab)' | '閱讀理解 (Reading)'
  promptZh: string
  promptPinyin: string
  promptBopomofo: string
  promptJa: string // 日文題目說明
  audioText?: string
  options: Array<{
    zh: string
    pinyin: string
    ja: string
  }>
  correctIndex: number
  explanationJa: string // 日本語による詳細解説
  point: number
}

export const TOCFL_MOCK_QUESTIONS: TocflQuestion[] = [
  {
    id: 'tocfl-q1',
    level: 'A1 (入門級)',
    section: '詞彙語法 (Grammar/Vocab)',
    promptZh: '這杯珍珠奶茶是____買的？',
    promptPinyin: 'zhè bēi zhēn zhū nǎi chá shì ____ mǎi de?',
    promptBopomofo: 'ㄓㄜˋ ㄅㄟ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ ㄕˋ ____ ㄇㄞˇ ˙ㄉㄜ?',
    promptJa: '空欄に入る最も適切な疑問詞を選びなさい。（「このタピオカミルクティーは誰が買ったの？」）',
    options: [
      { zh: '誰', pinyin: 'shéi', ja: '誰（Who）' },
      { zh: '什麼', pinyin: 'shén me', ja: '何（What）' },
      { zh: '哪裡', pinyin: 'nǎ lǐ', ja: 'どこ（Where）' },
      { zh: '怎麼', pinyin: 'zěn me', ja: 'どうやって（How）' },
    ],
    correctIndex: 0,
    explanationJa: '「是…的」焦点強調構文において、動作主（誰が買ったのか）を尋ねる疑問代名詞は「誰 shéi」です。',
    point: 10,
  },
  {
    id: 'tocfl-q2',
    level: 'A1 (入門級)',
    section: '詞彙語法 (Grammar/Vocab)',
    promptZh: '請你把桌子上的垃圾____。',
    promptPinyin: 'qǐng nǐ bǎ zhuō zi shàng de lè sè ____.',
    promptBopomofo: 'ㄑㄧㄥˇ ㄋㄧˇ ㄅㄚˇ ㄓㄨㄛ ˙ㄗ ㄕㄤˋ ˙ㄉㄜ ㄌㄜˋ ㄙㄜˋ ____.',
    promptJa: '把字句として適切な述語動詞＋結果を選びなさい。（「テーブルのゴミを捨ててください。」）',
    options: [
      { zh: '丟掉', pinyin: 'diū diào', ja: '捨ててしまう（結果）' },
      { zh: '丟', pinyin: 'diū', ja: '捨てる（動詞単体・不完全）' },
      { zh: '在丟', pinyin: 'zài diū', ja: '捨てている最中' },
      { zh: '要丟', pinyin: 'yào diū', ja: '捨てたい' },
    ],
    correctIndex: 0,
    explanationJa: '把字句では動詞単体（丟）で文を終えることはできず、必ず「丟掉（捨ててしまう）」のように処置の結果を表す補語や助詞を添えます。',
    point: 10,
  },
  {
    id: 'tocfl-q3',
    level: 'A1 (入門級)',
    section: '聽力理解 (Listening)',
    promptZh: '男：「老闆，我要一份雞排，要切、微辣。」 女：「好的，總共八十五元。」 問：男的要怎麼吃雞排？',
    promptPinyin: 'nán: "lǎo bǎn, wǒ yào yí fèn jī pái, yào qiē, wēi là." nǚ: "hǎo de, zǒng gòng bā shí wǔ yuán." wèn: nán de yào zěn me chī jī pái?',
    promptBopomofo: 'ㄋㄢˊ: "ㄌㄠˇ ㄅㄢˇ... ㄧㄠˋ ㄑㄧㄝ, ㄨㄟ ㄌㄚˋ." ㄋㄩˇ: "... ㄅㄚ ㄕˊ ㄨˇ ㄩㄢˊ." ㄨㄣˋ: ...',
    promptJa: '会話を聞いて、男性の注文内容として正しいものを選びなさい。',
    audioText: '老闆，我要一份雞排，要切、微辣。好的，總共八十五元。',
    options: [
      { zh: '要切，有一點點辣', pinyin: 'yào qiē, yǒu yì diǎn diǎn là', ja: 'カットして、少しだけ辛く（微辣）' },
      { zh: '不要切，大辣', pinyin: 'bú yào qiē, dà là', ja: '切らずに、激辛' },
      { zh: '要切，不加辣', pinyin: 'yào qiē, bù jiā là', ja: 'カットして、辛さ抜き' },
      { zh: '不要切，微辣', pinyin: 'bú yào qiē, wēi là', ja: '切らずに、微辣' },
    ],
    correctIndex: 0,
    explanationJa: '男性は「要切（カットする）」、「微辣（少し辛い）」と注文しているため、正解は「要切，有一點點辣」です。',
    point: 10,
  },
  {
    id: 'tocfl-q4',
    level: 'A2 (基礎級)',
    section: '詞彙語法 (Grammar/Vocab)',
    promptZh: '我以前沒____台灣的高鐵，這次想試試看。',
    promptPinyin: 'wǒ yǐ qián méi ____ tái wān de gāo tiě, zhè cì xiǎng shì shi kàn.',
    promptBopomofo: 'ㄨㄛˇ ㄧˇ ㄑㄧㄢˊ ㄇㄟˊ ____ ㄊㄞˊ ㄨㄢ ˙ㄉㄜ ㄍㄠ ㄊㄧㄝˇ, ㄓㄜˋ ⠉ㄧˋ ㄒㄧㄤˇ ㄕˋ ˙ㄕ ㄎㄢˋ.',
    promptJa: '過去の経験の有無を表す適切な語句を選びなさい。（「以前台湾の新幹線に乗ったことがないので、今回乗ってみたい。」）',
    options: [
      { zh: '搭過', pinyin: 'dā guo', ja: '乗ったことがある（経験）' },
      { zh: '搭了', pinyin: 'dā le', ja: '乗った（完了）' },
      { zh: '在搭', pinyin: 'zài dā', ja: '乗っている（進行）' },
      { zh: '會搭', pinyin: 'huì dā', ja: '乗ることができる' },
    ],
    correctIndex: 0,
    explanationJa: '過去の経験の否定は「沒 ＋ 動詞 ＋ 過」（沒搭過＝乗ったことがない）を用います。',
    point: 10,
  },
  {
    id: 'tocfl-q5',
    level: 'A2 (基礎級)',
    section: '閱讀理解 (Reading)',
    promptZh: '【公告】台北捷運全線車站及車廂內一律「禁止飲食」，包含喝水、吃口香糖。違者將處新台幣1500元至7500元罰鍰。問：在台北捷運車廂裡可以做什麼？',
    promptPinyin: 'gōng gào: tái běi jié yùn quán xiàn chē zhàn jí chē xiāng nèi yí lǜ "jǐn zhǐ yǐn shí"...',
    promptBopomofo: 'ㄍㄨㄥ ㄍㄠˋ: ㄊㄞˊ ㄅㄟˇ ㄐㄧㄝˊ ㄩㄣˋ ...',
    promptJa: 'お知らせ文を読んで、MRT車内で許可されている行動を選びなさい。',
    options: [
      { zh: '看手機聽音樂', pinyin: 'kàn shǒu jī tīng yīn yuè', ja: 'スマホを見たり音楽を聴く' },
      { zh: '喝礦泉水', pinyin: 'hē kuàng quán shuǐ', ja: 'ミネラルウォーターを飲む（禁止）' },
      { zh: '吃口香糖', pinyin: 'chī kǒu xiāng táng', ja: 'ガムを噛む（禁止）' },
      { zh: '吃三明治', pinyin: 'chī sān míng zhì', ja: 'サンドイッチを食べる（禁止）' },
    ],
    correctIndex: 0,
    explanationJa: '台湾のMRTでは水やガムを含め「飲食厳禁」です。スマホの閲覧や音楽鑑賞は問題ありません。',
    point: 10,
  },
]
