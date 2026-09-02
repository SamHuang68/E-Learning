/**
 * 台灣華語：台灣租屋修繕、水電師傅叫修與大樓管委會生活資料庫 (Taiwan Home Repair & Landlord Database)
 * 涵蓋日本語母語者在台灣租屋時最常遇到的修繕情境：冷氣滴水漏水向房東報修、水龍頭換墊片水電師傅（水電行）到府叫修、總開關跳電（無熔絲開關）以及大樓管委會管理費與公設規約等接地氣日常會話。
 */

export interface RepairDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Tenant' | 'Landlord' | 'Plumber' | 'Guard'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  repairGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const REPAIR_DIALOGUES: RepairDialogueItem[] = [
  {
    id: 'repair-aircon-leak',
    title: '租屋冷氣漏水滴水向房東報修與水電師傅約時間',
    titleJa: 'アパートのエアコン水漏れを大家さんに連絡・修理予約',
    icon: '🔧',
    locationZh: '租屋套房與房東 LINE 對話',
    locationJa: '賃貸アパート・大家さんとのLINEやりとり',
    dialogueLines: [
      {
        speaker: 'Tenant',
        speakerJa: '日本人入居者',
        zh: '房東先生您好，客廳的分離式冷氣昨天晚上開始一直滴水，而且吹出來的風不太涼，可以麻煩您請水電師傅來檢查一下嗎？',
        pinyin: 'Fángdōng xiānsheng nín hǎo, kètīng de fēnlíshì lěngqì zuótiān wǎnshang kāishǐ yìzhí dīshuǐ, érqiě chuī chūlái de fēng bú tài liáng, kěyǐ máfan nín qǐng shuǐdiàn shīfu lái jiǎnchá yíxià ma?',
        ja: '大家さんこんにちは。リビングのセパレート型エアコンが昨晩からずっとポタポタ水漏れしており、冷えも悪いです。水回り・電気の業者さんに点検をお願いできますか？',
      },
      {
        speaker: 'Landlord',
        speakerJa: '大家さん',
        zh: '沒問題！可能是排水管積污垢堵塞了。我已經聯絡配合的水電行，師傅明天下午兩點過去，修繕費用我會全額負擔，請放心！',
        pinyin: 'Méi wèntí! Kěnéng shì páishuǐguǎn jī wūgòu dǔsè le. Wǒ yǐjīng liánluò pèihé de shuǐdiànháng, shīfu míngtiān xiàwǔ liǎng diǎn guòqù, xiūshàn fèiyòng wǒ huì quán\'é fùdān, qǐng fàngxīn!',
        ja: '了解しました！ドレン排水管に汚れが詰まったのかもしれません。馴染みの電器店（水電行）に連絡しました。職人さんが明日午後2時に伺います。修理費は全額こちらで負担しますのでご安心を！',
      },
      {
        speaker: 'Tenant',
        speakerJa: '入居者',
        zh: '太好了，非常感謝房東迅速處理！明天下午兩點我會留在家裡等師傅。',
        pinyin: 'Tài hǎo le, fēicháng gǎnxiè fángdōng xùnsù chǔlǐ! Míngtiān xiàwǔ liǎng diǎn wǒ huì liú zài jiālǐ děng shīfu.',
        ja: '助かりました、迅速なご対応本当にありがとうございます！明日午後2時は在宅して職人さんをお待ちします。',
      },
    ],
    repairGlossary: [
      {
        termZh: '水電師傅 (shuǐdiàn shīfu)',
        pinyin: 'shuǐdiàn shīfu',
        meaningJa: '水道・電気設備工事の専門職人',
        tipJa: '台湾では水漏れ・電気トラブル全般を「水電行（水道電器店）」に依頼するのが一般的。',
      },
      {
        termZh: '報修 (bàoxiū)',
        pinyin: 'bàoxiū',
        meaningJa: '故障を管理会社や大家に連絡して修理依頼すること',
        tipJa: '自然損耗による故障の場合、修繕費（修繕費）は賃貸借契約上、大家負担（房東負擔）となります。',
      },
      {
        termZh: '跳電 (tiàodiàn)',
        pinyin: 'tiàodiàn',
        meaningJa: 'ブレーカーが落ちること（停電）',
        tipJa: '電子レンジとドライヤーの同時使用などで配電盤の「無熔絲開關（ノーヒューズブレーカー）」が作動する現象。',
      },
    ],
  },
  {
    id: 'repair-hoa-committee',
    title: '大樓管委會管理費繳納、社區公設規約與包裹代收',
    titleJa: 'マンション管理費納入・共用施設ルールと荷物預かり',
    icon: '🏢',
    locationZh: '現代電梯大樓管理室櫃檯',
    locationJa: 'マンション1階管理フロント・コンシェルジュ',
    dialogueLines: [
      {
        speaker: 'Tenant',
        speakerJa: '住民（入居者）',
        zh: '總幹事早安！我想繳交這兩個月的社區管理費，請問可以使用街口支付或轉帳嗎？順便領取昨天的掛號信。',
        pinyin: 'Zǒnggànshì zǎo\'ān! Wǒ xiǎng jiǎojiāo zhè liǎng gè yuè de shèqū guǎnlǐfèi, qǐngwèn kěyǐ yòng Jiēkǒu Zhīfù huò zhuǎnzhàng ma? Shùnbiàn lǐngqǔ zuótiān de guàhàoxìn.',
        ja: 'マネージャー（総幹事）おはようございます！今月と来月の2ヶ月分の管理費を納めたいのですが、スマホ決済（JKOPAY）や銀行振込は使えますか？ついでに昨日の書留郵便も受け取りたいです。',
      },
      {
        speaker: 'Guard',
        speakerJa: 'コミュニティ総幹事',
        zh: '沒問題，刷社區 APP 的條碼就可以直接扣款繳費囉！另外頂樓曬被場開放時間是早上八點到晚上十點，使用後請隨手關燈喔！',
        pinyin: 'Méi wèntí, shuā shèqū APP de tiáomǎ jiù kěyǐ zhíjiē kòukuǎn jiǎofèi luō! Lìngwài dǐnglóu shàibèichǎng kāifàng shíjiān shì zǎoshang bā diǎn dào wǎnshang shí diǎn, shǐyòng hòu qǐng suíshǒu guāndēng ō!',
        ja: '大丈夫です、マンション管理アプリのバーコードを提示いただければ即時決済できます！なお屋上の布団干し場は朝8時〜夜10時開放ですので、使用後は消灯をお願いしますね！',
      },
    ],
    repairGlossary: [
      {
        termZh: '管委會 / 總幹事',
        pinyin: 'guǎnwěihuì / zǒnggànshì',
        meaningJa: '管理委員会（理事会） / 管理業務主任者（マネージャー）',
        tipJa: '台湾のマンションの最高責任者。生活の困りごと全般を相談可能。',
      },
      {
        termZh: '管理費 (guǎnlǐfèi)',
        pinyin: 'guǎnlǐfèi',
        meaningJa: '共益費・管理費（通常1坪あたりいくらで計算）',
        tipJa: 'エレベーター保守、ゴミ収集、24時間警備員代行などが含まれます。',
      },
    ],
  },
]
