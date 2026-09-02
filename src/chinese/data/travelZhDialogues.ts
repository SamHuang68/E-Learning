/**
 * 台灣華語：台灣高鐵、台鐵旅遊與名勝觀光資料庫 (Taiwan High Speed Rail & Tourism Dialogues Database)
 * 涵蓋日本語母語者在台灣搭乘高鐵（THSR：早鳥票、自由座、對號座、商務車廂）、台鐵觀光列車與造訪九份/阿里山等最實用會話。
 */

export interface RailwayDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Tourist' | 'StationStaff' | 'TourGuide'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  railwayGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const RAILWAY_DIALOGUES: RailwayDialogueItem[] = [
  {
    id: 'railway-thsr-ticket',
    title: '台灣高鐵臨櫃購買南下對號座車票',
    titleJa: '台湾新幹線（高鐵）窓口での指定席（對號座）購入',
    icon: '🚅',
    locationZh: '高鐵台北站售票窗口',
    locationJa: '台湾高鐵台北駅のチケット窓口',
    dialogueLines: [
      {
        speaker: 'Tourist',
        speakerJa: '日本人観光客',
        zh: '您好，我想買兩張今天下午兩點出發，到左營（高雄）的高鐵對號座，靠窗的位子。',
        pinyin: 'Nín hǎo, wǒ xiǎng mǎi liǎng zhāng jīntiān xiàwǔ liǎngdiǎn chūfā, dào Zuǒyíng (Gāoxióng) de Gāotiě duìhàozuò, kàochuāng de wèizi.',
        ja: 'こんにちは、今日の午後2時発、左営（高雄）行きの高鐵指定席を2枚、窓側の席で買いたいです。',
      },
      {
        speaker: 'StationStaff',
        speakerJa: '駅員',
        zh: '兩點十五分有直達車 137 車次，行車時間一小時三十四分鐘。請問要單程還是來回？',
        pinyin: 'Liǎngdiǎn shíwǔfēn yǒu zhídáchē yāo-sān-qī chēcì, xíngchē shíjiān yì xiǎoshí sānshísì fēnzhōng. Qǐngwèn yào dānchéng háishì láihuí?',
        ja: '2時15分発の直行便137列車がございます。所要時間は1時間34分です。片道ですか、それとも往復ですか？',
      },
      {
        speaker: 'Tourist',
        speakerJa: '日本人観光客',
        zh: '買單程票就好。請問刷信用卡可以累積高鐵點數嗎？',
        pinyin: 'Mǎi dānchéngpiào jiù hǎo. Qǐngwèn shuā xìnyòngkǎ kěyǐ lěijī Gāotiě diǎnshù ma?',
        ja: '片道で大丈夫です。クレジットカード決済でT-Goポイントは貯まりますか？',
      },
      {
        speaker: 'StationStaff',
        speakerJa: '駅員',
        zh: '可以的，請在感應機上感應您的會員條碼與信用卡。這是您的兩張車票，在第二月台上車。',
        pinyin: 'Kěyǐ de, qǐng zài gǎnyìngjī shàng gǎnyìng nín de huìyuán tiáomǎ yǔ xìnyòngkǎ. Zhè shì nín de liǎng zhāng chēpiào, zài dì\'èr yuètái shàngchē.',
        ja: 'はい、読み取り機に会員バーコードとクレジットカードをタッチしてください。こちらがチケット2枚です、2番ホームからご乗車ください。',
      },
    ],
    railwayGlossary: [
      {
        termZh: '自由座 vs 對號座 (zìyóuzuò vs duìhàozuò)',
        pinyin: 'zìyóuzuò vs duìhàozuò',
        meaningJa: '自由席（通常10〜12号車） vs 指定席',
        tipJa: '自由座は指定席より約3%割引になり、当日券売機でいつでも手軽に購入できます。',
      },
      {
        termZh: '早鳥票 (zǎoniǎopiào)',
        pinyin: 'zǎoniǎopiào',
        meaningJa: '早期割引チケット（早割）',
        tipJa: '乗車日の28日前から発売され、最大35%（65折）・20%（8折）・10%（9折）引きになります。',
      },
      {
        termZh: '月台 (yuètái)',
        pinyin: 'yuètái',
        meaningJa: '駅のプラットホーム',
        tipJa: '台湾の駅案内標識では「月台（Platform）」と表記されます。',
      },
    ],
  },
  {
    id: 'railway-alishan-tour',
    title: '阿里山林業鐵路與看日出會話',
    titleJa: '阿里山森林鉄道と日の出（祝山線）観光会話',
    icon: '🌲',
    locationZh: '阿里山森林遊樂區車站',
    locationJa: '阿里山駅の待合室',
    dialogueLines: [
      {
        speaker: 'TourGuide',
        speakerJa: '現地ガイド',
        zh: '明天清晨我們要搭祝山線觀日列車去看阿里山日出與雲海，清晨四點半在大廳集合。',
        pinyin: 'Míngtiān qīngchén wǒmen yào dā Zhùshānxiàn guānrì lièchē qù kàn Ālǐshān rìchū yǔ yúnhǎi, qīngchén sìdiǎnbàn zài dàtīng jíhé.',
        ja: '明朝は祝山線の日の出列車に乗って阿里山の日の出と雲海を見に行きます。朝4時30分にロビー集合です。',
      },
      {
        speaker: 'Tourist',
        speakerJa: '観光客',
        zh: '聽說山上清晨非常冷，需要準備厚外套跟手套對不對？',
        pinyin: 'Tīngshuō shānshàng qīngchén fēicháng lěng, xūyào zhǔnbèi hòu wàitào gēn shǒutào duì bú duì?',
        ja: '山の上は朝方とても寒いと聞きましたが、厚手のジャケットと手袋が必要ですよね？',
      },
      {
        speaker: 'TourGuide',
        speakerJa: '現地ガイド',
        zh: '沒錯！海拔兩千多公尺氣溫大約只有八度。看完日出後，還可以漫步神木群步道吸芬多精。',
        pinyin: 'Méi cuò! Hǎibá liǎngqiān duō gōngchǐ qìwēn dàyuē zhǐyǒu bādù. Kàn wán rìchū hòu, hái kěyǐ mànbù shénmùqún bùdào xī fēnduōjīng.',
        ja: 'その通りです！標高2,000m超で気温は約8度です。日の出鑑賞後は神木群遊歩道で森林浴が楽しめます。',
      },
    ],
    railwayGlossary: [
      {
        termZh: '雲海 (yúnhǎi)',
        pinyin: 'yúnhǎi',
        meaningJa: '雲海',
        tipJa: '阿里山五大奇観（日出・雲海・晩霞・森林・鉄路）の一つ。',
      },
      {
        termZh: '神木 (shénmù)',
        pinyin: 'shénmù',
        meaningJa: '樹齢千年以上のご神木（ヒノキ）',
        tipJa: '台湾の紅檜（ベニヒ）巨木群は世界的にも有名。',
      },
      {
        termZh: '芬多精 (fēnduōjīng)',
        pinyin: 'fēnduōjīng',
        meaningJa: 'フィトンチッド（森林浴成分）',
        tipJa: '森林浴で癒やされることを台湾では「吸芬多精」と表現します。',
      },
    ],
  },
]
