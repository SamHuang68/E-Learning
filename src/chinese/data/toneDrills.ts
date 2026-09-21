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
  {
    id: 'tone-ma-ma',
    titleJa: '媽（mā 1声）vs 麻（má 2声）',
    confusionPointJa: '1声は高く平ら、2声は低くから上昇。家族 vs 植物の区別。',
    pairA: { zh: '媽', pinyin: 'mā', toneNum: 1, meaningJa: 'お母さん' },
    pairB: { zh: '麻', pinyin: 'má', toneNum: 2, meaningJa: '麻（植物・麻薬）' },
    exampleContextZh: '我媽是老師。/ 這是麻油雞。',
    exampleContextJa: '私の母は先生です。/ これはごま油の鶏肉料理です。',
  },
  {
    id: 'tone-xue-xue',
    titleJa: '學（xué 2声）vs 雪（xuě 3声）',
    confusionPointJa: '2声上昇 vs 3声低く抑えて上がる。学ぶ vs 雪の区別。',
    pairA: { zh: '學', pinyin: 'xué', toneNum: 2, meaningJa: '学ぶ・勉強する' },
    pairB: { zh: '雪', pinyin: 'xuě', toneNum: 3, meaningJa: '雪' },
    exampleContextZh: '我每天學中文。/ 今天下雪了。',
    exampleContextJa: '毎日中国語を勉強します。/ 今日は雪が降りました。',
  },
  {
    id: 'tone-xiang-xiang',
    titleJa: '想（xiǎng 3声）vs 像（xiàng 4声）',
    confusionPointJa: '3声 vs 4声。思う vs 似ているの区別。',
    pairA: { zh: '想', pinyin: 'xiǎng', toneNum: 3, meaningJa: '思う・考え' },
    pairB: { zh: '像', pinyin: 'xiàng', toneNum: 4, meaningJa: '似ている・像' },
    exampleContextZh: '我想吃飯。/ 他很像他爸爸。',
    exampleContextJa: 'ご飯を食べたいです。/ 彼はお父さんにとても似ています。',
  },
  {
    id: 'tone-kan-kan',
    titleJa: '看（kàn 4声）vs 刊（kān 1声）',
    confusionPointJa: '4声急降下 vs 1声高平。見る vs 刊行の区別。',
    pairA: { zh: '看', pinyin: 'kàn', toneNum: 4, meaningJa: '見る・読む' },
    pairB: { zh: '刊', pinyin: 'kān', toneNum: 1, meaningJa: '刊行する・雑誌' },
    exampleContextZh: '我看書。/ 這是新刊雜誌。',
    exampleContextJa: '本を読みます。/ これは新刊の雑誌です。',
  },
  {
    id: 'tone-shi-shi',
    titleJa: '是（shì 4声）vs 十（shí 2声）',
    confusionPointJa: '4声 vs 2声。です vs 10の区別、早口言葉で重要。',
    pairA: { zh: '是', pinyin: 'shì', toneNum: 4, meaningJa: 'です・である' },
    pairB: { zh: '十', pinyin: 'shí', toneNum: 2, meaningJa: '10' },
    exampleContextZh: '我是學生。/ 十個蘋果。',
    exampleContextJa: '私は学生です。/ りんごを10個。',
  },
  {
    id: 'tone-ji-ji',
    titleJa: '雞（jī 1声）vs 急（jí 2声）',
    confusionPointJa: '1声 vs 2声。鶏 vs 急ぐの区別。',
    pairA: { zh: '雞', pinyin: 'jī', toneNum: 1, meaningJa: '鶏' },
    pairB: { zh: '急', pinyin: 'jí', toneNum: 2, meaningJa: '急ぐ・緊急' },
    exampleContextZh: '我吃雞肉。/ 不要急，慢慢來。',
    exampleContextJa: '鶏肉を食べます。/ 急がないで、ゆっくり。',
  },
  {
    id: 'tone-fan-fan',
    titleJa: '飯（fàn 4声）vs 反（fǎn 3声）',
    confusionPointJa: '4声 vs 3声。ご飯 vs 反対の区別。',
    pairA: { zh: '飯', pinyin: 'fàn', toneNum: 4, meaningJa: 'ご飯・食事' },
    pairB: { zh: '反', pinyin: 'fǎn', toneNum: 3, meaningJa: '反対・反する' },
    exampleContextZh: '吃飯了。/ 反對這個想法。',
    exampleContextJa: 'ご飯を食べましょう。/ この考えに反対です。',
  },
  {
    id: 'tone-yi-yi',
    titleJa: '一（yī 1声）vs 疑（yí 2声）',
    confusionPointJa: '1声 vs 2声。一 vs 疑うの区別。',
    pairA: { zh: '一', pinyin: 'yī', toneNum: 1, meaningJa: '1・一つの' },
    pairB: { zh: '疑', pinyin: 'yí', toneNum: 2, meaningJa: '疑う・疑問' },
    exampleContextZh: '一個人。/ 懷疑他。',
    exampleContextJa: '一人。/ 彼を疑う。',
  },
  {
    id: 'tone-chang-chang',
    titleJa: '唱（chàng 4声）vs 常（cháng 2声）',
    confusionPointJa: '4声 vs 2声。歌う vs 常の区別。',
    pairA: { zh: '唱', pinyin: 'chàng', toneNum: 4, meaningJa: '歌う' },
    pairB: { zh: '常', pinyin: 'cháng', toneNum: 2, meaningJa: 'いつも・常' },
    exampleContextZh: '唱歌很好聽。/ 常來這裡。',
    exampleContextJa: '歌を歌うのはとてもいい。/ よくここに来る。',
  },
  {
    id: 'tone-gong-gong',
    titleJa: '公（gōng 1声）vs 共（gòng 4声）',
    confusionPointJa: '1声 vs 4声。公 vs 共の区別。',
    pairA: { zh: '公', pinyin: 'gōng', toneNum: 1, meaningJa: '公の・公共' },
    pairB: { zh: '共', pinyin: 'gòng', toneNum: 4, meaningJa: '共に・共産' },
    exampleContextZh: '公共汽車。/ 共同努力。',
    exampleContextJa: 'バス。/ 共に努力する。',
  },
]
