/**
 * 台灣華語：聲調辨音聽力測驗與最小對立體資料庫 (Tone Minimal Pairs & Listening Drills)
 * 專為日本語母語者提供最易混淆的聲調對比（如 3 聲 vs 4 聲、1 聲 vs 2 聲）。
 */

export interface ToneDrillItem {
  id: string
  titleJa: string
  confusionPointJa: string
  pairA: {
    zh: string
    pinyin: string
    toneNum: number
    meaningJa: string
  }
  pairB: {
    zh: string
    pinyin: string
    toneNum: number
    meaningJa: string
  }
  exampleContextZh: string
  exampleContextJa: string
}

export const TONE_DRILLS: ToneDrillItem[] = [
  {
    id: 'tone-mai-mai',
    titleJa: '買（mǎi 3声）vs 賣（mài 4声）',
    confusionPointJa: '「買う」と「売る」で意味が正反対。3声は低く抑えて少し上げ、4声は高所から一気に下降。',
    pairA: { zh: '買', pinyin: 'mǎi', toneNum: 3, meaningJa: '買う（購入する）' },
    pairB: { zh: '賣', pinyin: 'mài', toneNum: 4, meaningJa: '売る（販売する）' },
    exampleContextZh: '老闆，我想買一杯珍珠奶茶。/ 這家店賣很多好吃的芒果冰。',
    exampleContextJa: '店長、タピオカミルクティーを1杯買いたいです。/ この店は美味しいマンゴーかき氷をたくさん売っています。',
  },
  {
    id: 'tone-shuijiao',
    titleJa: '水餃（shuǐjiǎo）vs 睡覺（shuìjiào）',
    confusionPointJa: '「水餃子」は3声＋3声（変調で2声+3声）、「寝る」は4声＋4声の急降下。',
    pairA: { zh: '水餃', pinyin: 'shuǐ jiǎo', toneNum: 3, meaningJa: '水餃子（台湾の定番グルメ）' },
    pairB: { zh: '睡覺', pinyin: 'shuì jiào', toneNum: 4, meaningJa: '寝る・睡眠をとる' },
    exampleContextZh: '我要十顆豬肉韭菜水餃。/ 我今天太累了，想早點睡覺。',
    exampleContextJa: '豚肉ニラ水餃子を10個ください。/ 今日は疲れすぎたので、早く寝たいです。',
  },
  {
    id: 'tone-lianxi',
    titleJa: '練習（liànxí 4声+2声）vs 聯繫（liánxì 2声+4声）',
    confusionPointJa: '2声と4声の順序が逆。練習は「下がり→上がり」、聯繫は「上がり→下がり」。',
    pairA: { zh: '練習', pinyin: 'liàn xí', toneNum: 4, meaningJa: '練習する・トレーニング' },
    pairB: { zh: '聯繫', pinyin: 'lián xì', toneNum: 2, meaningJa: '連絡する・コンタクトを取る' },
    exampleContextZh: '每天練習中文聽力進步很快。/ 請保持聯繫，有事隨時發訊息。',
    exampleContextJa: '毎日中国語のリスニングを練習すると上達が早いです。/ 連絡を取り合いましょう。何かあればメッセージください。',
  },
  {
    id: 'tone-tang-tang',
    titleJa: '湯（tāng 1声）vs 糖（táng 2声）',
    confusionPointJa: '手搖飲（ドリンク店）で超重要！1声は高く平ら、2声は下から上へ引き上げる。',
    pairA: { zh: '湯', pinyin: 'tāng', toneNum: 1, meaningJa: 'スープ（貢丸湯、牛肉湯など）' },
    pairB: { zh: '糖', pinyin: 'táng', toneNum: 2, meaningJa: '砂糖・甘さの指定（無糖/微糖/半糖）' },
    exampleContextZh: '喝一碗熱熱的貢丸湯很舒服。/ 我的珍奶要半糖少冰。',
    exampleContextJa: '温かい肉団子スープを飲むと心地よいです。/ 私のタピオカは半糖・少なめ氷で。',
  },
  {
    id: 'tone-si-shi',
    titleJa: '四（sì 4声）vs 十（shí 2声）',
    confusionPointJa: '日本人学習者の最大の難関！平舌音「s」＋4声 vs そり舌音「sh」＋2声。',
    pairA: { zh: '四', pinyin: 'sì', toneNum: 4, meaningJa: '数字の「4」（ス / 急降下）' },
    pairB: { zh: '十', pinyin: 'shí', toneNum: 2, meaningJa: '数字の「10」（舌を巻いて上昇）' },
    exampleContextZh: '四是四，十是十，十四是十四，四十是四十。',
    exampleContextJa: '（有名な早口言葉）4は4、10は10、14は14、40は40。',
  },
]
