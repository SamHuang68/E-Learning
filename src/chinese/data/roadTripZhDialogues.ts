/**
 * 台灣華語：台灣租車自駕、中油加油站與環島公路旅行資料庫 (Taiwan Road Trip & Car Rental Database)
 * 涵蓋日本語母語者在台灣持日文駕照譯本租車（甲租乙還、車況巡檢、乙式全險）、中油加油站經典喊單（「九五加滿、載具統編、不用印發票」）、蘇花改行車安全與國道 ETC 扣款等最實用的日常會話。
 */

export interface RoadTripDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Driver' | 'RentalStaff' | 'GasAttendant'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  roadTripGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const ROAD_TRIP_DIALOGUES: RoadTripDialogueItem[] = [
  {
    id: 'road-gas-station',
    title: '台灣中油加油站經典對話：九五加滿、統編與手機載具',
    titleJa: '台湾ガソリンスタンド（中油）定番の会話：95満タン・スマホ受取レシート',
    icon: '⛽',
    locationZh: '中油直營加油站',
    locationJa: '台湾中油（CPC）直営ガソリンスタンド',
    dialogueLines: [
      {
        speaker: 'GasAttendant',
        speakerJa: 'スタンド店員',
        zh: '您好！請問加什麼油？要加多少？統編載具需要嗎？',
        pinyin: 'Nín hǎo! Qǐngwèn jiā shénme yóu? Yào jiā duōshǎo? Tǒngbiān zàijù xūyào ma?',
        ja: 'いらっしゃいませ！油種は何にされますか？給油量はどうされますか？会社統一番号やスマホ電子レシートはありますか？',
      },
      {
        speaker: 'Driver',
        speakerJa: '日本人ドライバー',
        zh: '九五無鉛加滿，用信用卡結帳，發票存手機載具，不用印紙本，謝謝！',
        pinyin: 'Jiǔwǔ wúqiān jiā mǎn, yòng xìnyòngkǎ jiézhàng, fāpiào cún shǒujī zàijù, bú yòng yìn zhǐběn, xièxie!',
        ja: 'レギュラー（95無鉛）満タンでお願いします。クレジットカードで支払い、レシートはスマホバーコード（載具）へ、紙は不要です！',
      },
      {
        speaker: 'GasAttendant',
        speakerJa: '店員',
        zh: '好的，九五加滿！油表從零開始算喔！總共一千兩百元，刷卡成功，祝您行車平安！',
        pinyin: 'Hǎo de, jiǔwǔ jiā mǎn! Yóubiǎo cóng líng kāishǐ suàn ō! Zǒnggòng yìqiān liǎngbǎi yuán, shuākǎ chénggōng, zhù nǐ xíngchē píng\'ān!',
        ja: 'かしこまりました、95満タンですね！メーターがゼロからスタートすることをご確認ください！合計1,200元、決済完了しました。安全運転でどうぞ！',
      },
    ],
    roadTripGlossary: [
      {
        termZh: '九五無鉛 (jiǔwǔ wúqiān)',
        pinyin: 'jiǔwǔ wúqiān',
        meaningJa: 'オクタン価95の無鉛ガソリン（台湾の一般乗用車で最も一般的）',
        tipJa: '台湾では92、95、98、超級柴油（ディーゼル）から選択します。',
      },
      {
        termZh: '加滿 (jiā mǎn)',
        pinyin: 'jiā mǎn',
        meaningJa: '満タンにする',
        tipJa: 'レンタカーの返却前（滿油還車）にも必ず使う重要フレーズ。',
      },
      {
        termZh: '甲租乙還 (jiǎ zū yǐ huán)',
        pinyin: 'jiǎ zū yǐ huán',
        meaningJa: '乗り捨て（別の営業所で返却）',
        tipJa: '台北で借りて高雄で返すなど、台湾一周（環島）の旅で人気。',
      },
    ],
  },
  {
    id: 'road-rental-inspection',
    title: '台北租車公司取車點交與自駕蘇花公路行車安全',
    titleJa: 'レンタカー受け取り・傷チェックと蘇花公路の安全運転ガイド',
    icon: '🚗',
    locationZh: '和運租車台北車站門市',
    locationJa: '台北駅前レンタカー店舗',
    dialogueLines: [
      {
        speaker: 'RentalStaff',
        speakerJa: 'レンタカー店員',
        zh: '佐藤先生您好！請出示您的日本駕照正本與台灣監理所官方日文譯本。我們已經幫您升級全方位免自負額安心車險。',
        pinyin: 'Zuǒténg xiānsheng nín hǎo! Qǐng chūshì nín de Rìběn jiàzhào zhèngběn yǔ Táiwān jiānlǐsuǒ guānfāng Rìwén yìběn. Wǒmen yǐjīng bāng nín shēngjí quánfāngwèi miǎn zìfù\'é ānxīn chēxiǎn.',
        ja: '佐藤様こんにちは！日本の運転免許証原本と公的中国語（日文）翻訳文をご提示ください。自己負担ゼロの安心免責補償にアップグレード済みです。',
      },
      {
        speaker: 'Driver',
        speakerJa: 'ドライバー',
        zh: '太感謝了！我們要開去花蓮，請問蘇花改有什麼需要特別注意的路況嗎？',
        pinyin: 'Tài gǎnxiè le! Wǒmen yào kāi qù Huālián, qǐngwèn Sūhuāgǎi yǒu shénme xūyào tèbié zhùyì de lùkuàng ma?',
        ja: 'ありがとうございます！花蓮までドライブするのですが、蘇花改バイパスで注意すべき道路状況はありますか？',
      },
      {
        speaker: 'RentalStaff',
        speakerJa: '店員',
        zh: '蘇花改長隧道很多，記得一定要全程開啟大燈，維持安全車距！車上已經裝好 eTag，國道過路費還車時會自動扣款結算喔！',
        pinyin: 'Sūhuāgǎi cháng suìdào hěn duō, jìde yídìng yào quánchéng kāiqǐ dàdēng, wéichí ānquán chējù! Chē shàng yǐjīng zhuāng hǎo eTag, guódào guòlùfèi huánchē shí huì zìdòng kòukuǎn jiésuàn ō!',
        ja: '蘇花改は長いトンネルが多いので、必ず常時ヘッドライトを点灯し車間距離を保ってください！ETC（eTag）搭載車ですので高速料金は返却時に自動精算となります！',
      },
    ],
    roadTripGlossary: [
      {
        termZh: '駕照日文譯本 (jiàzhào rìwén yìběn)',
        pinyin: 'jiàzhào rìwén yìběn',
        meaningJa: '日本の免許証の中国語翻訳文',
        tipJa: '日本人は国際免許証ではなく、JAF発行の公的翻訳文＋日本の免許原本で台湾で運転可能。',
      },
      {
        termZh: '蘇花改 (sūhuāgǎi)',
        pinyin: 'sūhuāgǎi',
        meaningJa: '蘇澳〜花蓮間の安全な改良バイパス道路',
        tipJa: '落石の危険が多かった旧道に比べ、直線トンネル中心で安全性が大幅に向上。',
      },
      {
        termZh: 'eTag / 國道電子收費',
        pinyin: 'eTag / guódào diànzǐ shōufèi',
        meaningJa: '台湾の高速道路全自動ETCシステム',
        tipJa: '料金所ストップ不要でフロントガラスのシールで自動検知。',
      },
    ],
  },
]
