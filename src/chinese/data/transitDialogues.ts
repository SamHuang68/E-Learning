/**
 * 台灣華語：交通出行、捷運與悠遊卡生活情境資料庫 (Transit & Metro Dialogues Database)
 * 專為日本語母語者提供台北/高雄捷運、高鐵、台鐵、公車、計程車與悠遊卡 (EasyCard) 實用會話。
 */

export interface TransitScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  scenarioJa: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Tourist' | 'Clerk' | 'Driver' | 'Broadcast'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  usefulVocabulary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const TRANSIT_SCENARIOS: TransitScenarioItem[] = [
  {
    id: 'transit-easycard',
    title: '捷運站與便利商店：悠遊卡加值與感應',
    titleJa: 'MRT駅とコンビニ：悠遊カード（EasyCard）のチャージと利用',
    icon: '💳',
    scenarioJa: 'MRT駅の窓口やセブンイレブン・全家で悠遊カードにお金をチャージする際の会話。',
    locationZh: '台北捷運詢問處 / 7-11',
    locationJa: '台北MRT案内窓口 / コンビニ',
    dialogueLines: [
      {
        speaker: 'Tourist',
        speakerJa: '旅行者',
        zh: '不好意思，我想幫這張悠遊卡加值五百元。',
        pinyin: 'Bù hǎoyìsi, wǒ xiǎng bāng zhè zhāng yōuyóukǎ jiāzhí wǔbǎi yuán.',
        ja: 'すみません、この悠遊カードに500元チャージしたいのですが。',
      },
      {
        speaker: 'Clerk',
        speakerJa: '駅員/店員',
        zh: '好的，請把卡片放在感應區上。一共五百元，請確認螢幕金額。',
        pinyin: 'Hǎo de, qǐng bǎ kǎpiàn fàng zài gǎnyìng qū shàng. Yígòng wǔbǎi yuán, qǐng quèrèn yíngmù jīné.',
        ja: 'かしこまりました。カードをセンサーの上に置いてください。合計500元です、画面の金額をご確認ください。',
      },
      {
        speaker: 'Tourist',
        speakerJa: '旅行者',
        zh: '好的，謝謝！請問搭捷運到台北 101 要在哪裡換車？',
        pinyin: 'Hǎo de, xièxie! Qǐngwèn dā jiéyùn dào Táiběi Yī-Líng-Yī yào zài nǎlǐ huànchē?',
        ja: '分かりました、ありがとう！台北101までMRTで行くにはどこで乗り換えればいいですか？',
      },
      {
        speaker: 'Clerk',
        speakerJa: '駅員',
        zh: '搭紅線（淡水信義線）不用換車，直接坐到「台北 101/世貿站」下車即可。',
        pinyin: 'Dā hóngxiàn (Dànshuǐ Xìnyì xiàn) bú yòng huànchē, zhíjiē zuò dào "Táiběi Yī-Líng-Yī/Shìmào zhàn" xiàchē jíkě.',
        ja: '赤ライン（淡水信義線）なら乗り換えなしで、そのまま「台北101/世貿駅」で降りれば着きますよ。',
      },
    ],
    usefulVocabulary: [
      {
        termZh: '加值 (jiāzhí)',
        pinyin: 'jiāzhí',
        meaningJa: 'チャージする（入金する）',
        tipJa: '中国本土の「充値 (chōngzhí)」と異なり、台湾では「加值」が標準用語です。',
      },
      {
        termZh: '感應區 (gǎnyìng qū)',
        pinyin: 'gǎnyìng qū',
        meaningJa: 'ICカードリーダー（タッチ部分）',
        tipJa: '改札やレジで「請感應卡片（タッチしてください）」とよく案内されます。',
      },
      {
        termZh: '換車 / 轉乘 (huànchē / zhuǎnchéng)',
        pinyin: 'huànchē / zhuǎnchéng',
        meaningJa: '乗り換え',
        tipJa: '路線を乗り換える際に必須のフレーズ。',
      },
    ],
  },
  {
    id: 'transit-taxi',
    title: '計程車運將：指定路線與付費',
    titleJa: 'タクシー運転手との会話：目的地指定とお会計',
    icon: '🚕',
    scenarioJa: '台湾の黄色いタクシー（小黃）に乗り、行き先を告げて領収書をもらうまでの一連のやり取り。',
    locationZh: '計程車上',
    locationJa: 'タクシー車内',
    dialogueLines: [
      {
        speaker: 'Driver',
        speakerJa: '運転手（運將）',
        zh: '帥哥/美女，你要去哪裡？',
        pinyin: 'Shuàigē/Měinǚ, nǐ yào qù nǎlǐ?',
        ja: 'お客さん、どこまで行く？（※台湾特有の親しみを込めた呼びかけ）',
      },
      {
        speaker: 'Tourist',
        speakerJa: '旅行者',
        zh: '司機先生，請載我到饒河街觀光夜市，麻煩走市民大道比較不會塞車。',
        pinyin: 'Sījī xiānsheng, qǐng zài wǒ dào Ráohé jiē guānguāng yèshì, máfan zǒu Shìmín Dàdào bǐjiào bú huì sāichē.',
        ja: '運転手さん、饒河街観光夜市までお願いします。渋滞しにくい市民大道を通っていただけますか。',
      },
      {
        speaker: 'Driver',
        speakerJa: '運転手',
        zh: '沒問題！到了，一共是一百八十五塊。可以刷悠遊卡或 LINE Pay 喔。',
        pinyin: 'Méi wèntí! Dào le, yígòng shì yìbǎi bāshíwǔ kuài. Kěyǐ shuā yōuyóukǎ huò LINE Pay ō.',
        ja: '了解！着いたよ、全部で185元ね。悠遊カードかLINE Payも使えるよ。',
      },
      {
        speaker: 'Tourist',
        speakerJa: '旅行者',
        zh: '好的，我用悠遊卡刷。麻煩請給我一張收據（發票），謝謝！',
        pinyin: 'Hǎo de, wǒ yòng yōuyóukǎ shuā. Máfan qǐng gěi wǒ yì zhāng shōujù (fāpiào), xièxie!',
        ja: 'はい、悠遊カードで払います。レシート（領収書）を1枚いただけますか、ありがとう！',
      },
    ],
    usefulVocabulary: [
      {
        termZh: '塞車 (sāichē)',
        pinyin: 'sāichē',
        meaningJa: '渋滞する',
        tipJa: '台湾の通勤時間帯や休日の観光地で超頻出の単語。',
      },
      {
        termZh: '運將 (ùn-chiàng)',
        pinyin: 'ùn-chiàng',
        meaningJa: 'タクシー運転手（台湾語借用語）',
        tipJa: '日本語の「運ちゃん」が台湾語に取り入れられた親愛表現。',
      },
      {
        termZh: '收據 / 發票 (shōujù / fāpiào)',
        pinyin: 'shōujù / fāpiào',
        meaningJa: '領収書 / 統一発票（宝くじ付きレシート）',
        tipJa: '台湾のレシートは2ヶ月に一度当せん番号が発表される「統一發票」です。',
      },
    ],
  },
]
