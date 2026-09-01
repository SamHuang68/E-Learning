/**
 * 台湾華語・中国語：日中同形異義語・偽友詞資料庫 (False Friends / 陷阱字詞)
 * 解決日本語母語者看漢字望文生義的致命誤區。
 */

export interface FalseFriendItem {
  id: string
  wordZh: string
  wordJa: string
  pinyin: string
  bopomofo: string
  meaningZhInJa: string // 中文意思（用日文說明）
  meaningJaInJa: string // 日文意思
  pitfallAlertJa: string // 避坑注意
  exampleSentenceZh: string
  examplePinyin: string
  exampleTranslationJa: string
  tag: '日常生活' | '交通飲食' | '職場商務' | '感情社交'
}

export const FALSE_FRIENDS_DATA: FalseFriendItem[] = [
  {
    id: 'ff-tegami',
    wordZh: '手紙',
    wordJa: '手紙',
    pinyin: 'shǒu zhǐ',
    bopomofo: 'ㄕㄡˇ ㄓˇ',
    meaningZhInJa: '【トイレットペーパー・ティッシュペーパー】（衛生紙）',
    meaningJaInJa: '【便り・レター】（中国語では「信 xìn」）',
    pitfallAlertJa: '台湾のレストランで「手紙をください」と頼むとトイレットペーパーを渡されます！手紙を送りたい時は「信 xìn」を使いましょう。',
    exampleSentenceZh: '請問洗手間裡有手紙（衛生紙）嗎？',
    examplePinyin: 'qǐng wèn xǐ shǒu jiān lǐ yǒu shǒu zhǐ ma?',
    exampleTranslationJa: 'すみません、お手洗いにトイレットペーパーはありますか？',
    tag: '日常生活',
  },
  {
    id: 'ff-kisha',
    wordZh: '汽車',
    wordJa: '汽車',
    pinyin: 'qì chē',
    bopomofo: 'ㄑㄧˋ ㄔㄜ',
    meaningZhInJa: '【自動車・乗用車・車全般】（Car）',
    meaningJaInJa: '【蒸気機関車・汽車】（中国語では「火車 huǒ chē」）',
    pitfallAlertJa: '中国語の「汽車」は普通の乗用車（Car）のこと。線路を走る電車・列車は「火車 huǒ chē」です！',
    exampleSentenceZh: '他在台北買了一輛新汽車。',
    examplePinyin: 'tā zài tái běi mǎi le yí liàng xīn qì chē.',
    exampleTranslationJa: '彼は台北で新しい乗用車を1台買いました。',
    tag: '交通飲食',
  },
  {
    id: 'ff-benkyo',
    wordZh: '勉強',
    wordJa: '勉強',
    pinyin: 'miǎn qiǎng',
    bopomofo: 'ㄇㄧㄢˇ ㄑㄧㄤˇ',
    meaningZhInJa: '【無理やり〜する・しぶしぶ行う・かろうじて】',
    meaningJaInJa: '【学習・学問】（中国語では「學習 xué xí」）',
    pitfallAlertJa: '「我要勉強中国語」と言うと「無理やり嫌々中国語をやる」という意味に！勉強するは「學習 / 唸書」と言います。',
    exampleSentenceZh: '如果不想去就別勉強了。',
    examplePinyin: 'rú guǒ bù xiǎng qù jiù bié miǎn qiǎng le.',
    exampleTranslationJa: 'もし行きたくないなら、無理しないでね。',
    tag: '日常生活',
  },
  {
    id: 'ff-aijin',
    wordZh: '愛人',
    wordJa: '愛人',
    pinyin: 'ài ren',
    bopomofo: 'ㄞˋ ˙ㄖㄣ',
    meaningZhInJa: '【配偶者（夫・妻）・正式な伴侶】',
    meaningJaInJa: '【不倫相手・愛人】（中国語では「情人 / 小三」）',
    pitfallAlertJa: '中国語圏で「這是我的愛人」と紹介されたら「私の妻/夫です」という健全な配偶者の紹介です！誤解しないようにしましょう。',
    exampleSentenceZh: '這是我愛人，我們結婚十年了。',
    examplePinyin: 'zhè shì wǒ ài ren, wǒ men jié hūn shí nián le.',
    exampleTranslationJa: 'こちらは私の配偶者（妻/夫）です。結婚して10年になります。',
    tag: '感情社交',
  },
  {
    id: 'ff-daijobu',
    wordZh: '大丈夫',
    wordJa: '大丈夫',
    pinyin: 'dà zhàng fū',
    bopomofo: 'ㄉㄚˋ ㄓㄤˋ ㄈㄨ',
    meaningZhInJa: '【一人前の立派な男子・男気のある人】',
    meaningJaInJa: '【問題ない・OK】（中国語では「沒關係 / 沒事」）',
    pitfallAlertJa: '「大丈夫ですか？」と言いたい時に「大丈夫嗎？」は通じません。「沒事嗎？/ 沒關係」を使いましょう。',
    exampleSentenceZh: '男子漢大丈夫，敢作敢當。',
    examplePinyin: 'nán zǐ hàn dà zhàng fū, gǎn zuò gǎn dāng.',
    exampleTranslationJa: '一人前の立派な男子たるもの、自分の行動に責任を持つべきだ。',
    tag: '感情社交',
  },
  {
    id: 'ff-hashiru',
    wordZh: '走',
    wordJa: '走る',
    pinyin: 'zǒu',
    bopomofo: 'ㄗㄡˇ',
    meaningZhInJa: '【歩く・立ち去る・帰る】（Walk / Leave）',
    meaningJaInJa: '【走る・駆ける】（中国語では「跑 pǎo」）',
    pitfallAlertJa: '「我們走吧」は「歩いて行こう / さあ帰ろう」の意味。「走る（Run）」は中国語では「跑 pǎo」と言います。',
    exampleSentenceZh: '吃飽後我們去散步走走吧。',
    examplePinyin: 'chī bǎo hòu wǒ men qù sàn bù zǒu zou ba.',
    exampleTranslationJa: 'お腹がいっぱいになったら、お散歩して歩きましょう。',
    tag: '日常生活',
  },
  {
    id: 'ff-kokuso',
    wordZh: '告訴',
    wordJa: '告訴',
    pinyin: 'gào sù',
    bopomofo: 'ㄍㄠˋ ㄙㄨˋ',
    meaningZhInJa: '【教える・伝える・知らせる】（Tell）',
    meaningJaInJa: '【法的に訴える・告訴する】',
    pitfallAlertJa: '「請告訴我」は「訴訟を起こしてください」ではなく「私に教えてください」という日常最頻出の表現です。',
    exampleSentenceZh: '請告訴我捷運站怎麼走？',
    examplePinyin: 'qǐng gào sù wǒ jié yùn zhàn zěn me zǒu?',
    exampleTranslationJa: 'MRTの駅への行き方を教えていただけますか？',
    tag: '職場商務',
  },
  {
    id: 'ff-hoshin',
    wordZh: '放心',
    wordJa: '放心',
    pinyin: 'fàng xīn',
    bopomofo: 'ㄈㄤˋ ㄒㄧㄣ',
    meaningZhInJa: '【安心する・心配しない】（Relieved）',
    meaningJaInJa: '【気が抜けてぼんやりする・放心状態】',
    pitfallAlertJa: '中国語の「放心」は「心を解き放つ ➜ 安心する」というポジティブな意味。「請放心＝ご安心ください」。',
    exampleSentenceZh: '這件事交給我處理，請您放心！',
    examplePinyin: 'zhè jiàn shì jiāo gěi wǒ chǔ lǐ, qǐng nín fàng xīn!',
    exampleTranslationJa: 'この件は私にお任せください、どうぞご安心ください！',
    tag: '職場商務',
  },
  {
    id: 'ff-musume',
    wordZh: '娘',
    wordJa: '娘',
    pinyin: 'niáng',
    bopomofo: 'ㄋㄧㄤˊ',
    meaningZhInJa: '【母親・お母さん】（または女性らしい・女っぽい）',
    meaningJaInJa: '【自分の娘・女の子】（中国語では「女兒 nǚ ér」）',
    pitfallAlertJa: '中国語の「娘」は「お母さん（例：娘親・姑娘）」のこと。自分の娘は「女兒 nǚ ér」です。',
    exampleSentenceZh: '他從小就很孝順爹娘。',
    examplePinyin: 'tā cóng xiǎo jiù hěn xiào shùn diē niáng.',
    exampleTranslationJa: '彼は幼い頃から父母（両親）によく孝行していました。',
    tag: '日常生活',
  },
  {
    id: 'ff-roba',
    wordZh: '老婆',
    wordJa: '老婆',
    pinyin: 'lǎo pó',
    bopomofo: 'ㄌㄠˇ ㄆㄛˊ',
    meaningZhInJa: '【妻・奥さん・愛妻】（日常会話での親密な呼び方）',
    meaningJaInJa: '【年老いた女性・おばあさん】（中国語では「老太太 / 阿婆」）',
    pitfallAlertJa: '「我老婆」は「私の妻（My Wife）」のこと！日本語の「年老いた女性」の意味ではないのでびっくりしないでください。',
    exampleSentenceZh: '我老婆做的滷肉飯非常好吃。',
    examplePinyin: 'wǒ lǎo pó zuò de lǔ ròu fàn fēi cháng hǎo chī.',
    exampleTranslationJa: '私の妻が作るルーローハンはとても美味しいです。',
    tag: '感情社交',
  },
]
