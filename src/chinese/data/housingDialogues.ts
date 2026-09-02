/**
 * 台灣華語：租屋與水電生活情境資料庫 (Taiwan Renting & Housing Dialogues Database)
 * 涵蓋日本語母語者在台灣生活最實用的租屋、押金合約、水電費瓦斯繳費、倒垃圾（垃圾車音樂）真實會話。
 */

export interface HousingDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Tenant' | 'Landlord' | 'Clerk'
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

export const HOUSING_DIALOGUES: HousingDialogueItem[] = [
  {
    id: 'housing-viewing',
    title: '租屋看房與房租押金確認',
    titleJa: '部屋の内見と家賃・敷金（押金）の確認',
    icon: '🏠',
    locationZh: '套房看屋現場',
    locationJa: 'ワンルーム（套房）内見現場',
    dialogueLines: [
      {
        speaker: 'Landlord',
        speakerJa: '大家さん（房東）',
        zh: '歡迎看房！這間獨立套房採光很好，附雙人床、書桌跟變頻冷氣。',
        pinyin: 'Huānyíng kànfáng! Zhè jiān dúlì tàofáng cǎiguāng hěn hǎo, fù shuāngrénchuáng, shūzhuō gēn biànpín lěngqì.',
        ja: '内見へようこそ！この独立ワンルームは日当たりが良く、ダブルベッド、机、インバーターエアコン付きです。',
      },
      {
        speaker: 'Tenant',
        speakerJa: '借主（房客）',
        zh: '房東您好，請問一個月租金是多少？押金需要幾個月？包含水電費和網路嗎？',
        pinyin: 'Fángdōng nín hǎo, qǐngwèn yí gè yuè zūjīn shì duōshǎo? Yājīn xūyào jǐ gè yuè? Bāohán shuǐdiànfèi hàn wǎnglù ma?',
        ja: '大家さんこんにちは。家賃は月いくらですか？敷金（押金）は何ヶ月分必要ですか？水道光熱費やネット代は含まれますか？',
      },
      {
        speaker: 'Landlord',
        speakerJa: '大家さん',
        zh: '月租一萬三千元，押金是兩個月。租金含網路和第四台，水電費依台電台水帳單自行繳費。',
        pinyin: 'Yuèzū yíwàn sānqiān yuán, yājīn shì liǎng gè yuè. Zūjīn hán wǎnglù hàn dì-sì-tái, shuǐdiànfèi yī Tái-diàn Tái-shuǐ zhàngdān zìxíng jiǎofèi.',
        ja: '月額1万3千元で、敷金は2ヶ月分です。家賃にネット代とケーブルテレビ代が含まれ、光熱費は公営請求書通り自己支払いです。',
      },
    ],
    usefulVocabulary: [
      {
        termZh: '套房 vs 雅房 (tàofáng vs yǎfáng)',
        pinyin: 'tàofáng vs yǎfáng',
        meaningJa: 'バス・トイレ付きワンルーム vs 風呂トイレ共同部屋',
        tipJa: '台湾で部屋を借りる際、自分専用の浴室がある部屋を「套房」と呼びます。',
      },
      {
        termZh: '押金 (yājīn)',
        pinyin: 'yājīn',
        meaningJa: '敷金・デポジット',
        tipJa: '台湾の法律では最大2ヶ月分までと規定されています。退去時に全額返還されます。',
      },
      {
        termZh: '台電計費 (Tái-diàn jìfèi)',
        pinyin: 'Tái-diàn jìfèi',
        meaningJa: '台湾電力の公式正規料金での計算',
        tipJa: '大家が「1度6元」など高額請求せず、国の公式請求書通りに払う優良条件。',
      },
    ],
  },
  {
    id: 'housing-trash',
    title: '台灣垃圾不落地下樓追垃圾車',
    titleJa: '台湾名物：定時音楽ゴミ収集車（ゴミ出しルール）',
    icon: '🚛',
    locationZh: '公寓樓下清運點',
    locationJa: 'アパート下のゴミ収集スポット',
    dialogueLines: [
      {
        speaker: 'Tenant',
        speakerJa: '日本人住人',
        zh: '外面傳來《給愛麗絲》的音樂，是垃圾車來了嗎？需要用專用垃圾袋嗎？',
        pinyin: 'Wàimiàn chuánlái "Gěi Àilìsī" de yīnyuè, shì lājīchē lái le ma? Xūyào yòng zhuānyòng lājīdài ma?',
        ja: '外から「エリーゼのために」の音楽が聞こえるけど、ゴミ収集車が来たのかな？専用ゴミ袋が必要？',
      },
      {
        speaker: 'Clerk',
        speakerJa: '近所の人/コンビニ店員',
        zh: '沒錯！台北市一定要用藍色專用垃圾袋，資源回收（紙類、塑膠、瓶罐）免費分開收。',
        pinyin: 'Méi cuò! Táiběi Shì yídìng yào yòng lánsè zhuānyòng lājīdài, zīyuán huíshōu (zhǐlèi, sùjiāo, píngguàn) miǎnfèi fēnkāi shōu.',
        ja: 'その通り！台北市は青い専用ゴミ袋が必須で、資源ゴミ（紙、プラ、瓶缶）は無料で分別回収してくれますよ。',
      },
      {
        speaker: 'Tenant',
        speakerJa: '日本人住人',
        zh: '了解！那廚餘是直接倒進垃圾車後面的廚餘桶對吧？',
        pinyin: 'Liǎojiě! Nà chúyú shì zhíjiē dào jìn lājīchē hòumiàn de chúyútǒng duì ba?',
        ja: '了解です！生ゴミはゴミ収集車の後ろにあるバケツに直接入れればいいですね？',
      },
    ],
    usefulVocabulary: [
      {
        termZh: '追垃圾車 (zhuī lājīchē)',
        pinyin: 'zhuī lājīchē',
        meaningJa: 'ゴミ収集車を追いかけてゴミを出す',
        tipJa: '台湾ではゴミ集積所に放置せず、住民が音楽（エリーゼのために / 乙女の祈り）に合わせて直接投げ入れます。',
      },
      {
        termZh: '專用垃圾袋 (zhuānyòng lājīdài)',
        pinyin: 'zhuānyòng lājīdài',
        meaningJa: '指定ゴミ袋',
        tipJa: '双北（台北・新北）ではコンビニのレジで店員にサイズを言って購入します。',
      },
      {
        termZh: '廚餘 (chúyú)',
        pinyin: 'chúyú',
        meaningJa: '生ゴミ・残飯',
        tipJa: '養豚用（熟廚餘）と堆肥用（生廚餘）に分かれるエコなシステムです。',
      },
    ],
  },
]
