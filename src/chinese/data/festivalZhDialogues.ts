/**
 * 台灣華語：台灣傳統節慶文化、廟宇拜拜與年節採買資料庫 (Taiwan Festivals & Temple Culture Database)
 * 涵蓋日本語母語者深度體驗台灣民間信仰（行天宮/龍山寺擲筊：聖筊・笑筊・陰筊、求平安符過香爐）、大稻埕迪化街採買年貨、端午立蛋、中秋烤肉等最接地氣的文化生活會話。
 */

export interface FestivalDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Tourist' | 'LocalFriend' | 'Vendor'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  festivalGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const FESTIVAL_DIALOGUES: FestivalDialogueItem[] = [
  {
    id: 'fest-temple-poe',
    title: '艋舺龍山寺拜拜、擲筊問事與求平安符過香爐',
    titleJa: '龍山寺での参拝・ポエ占い（擲筊）とお守りの香炉回し',
    icon: '🏮',
    locationZh: '龍山寺大殿拜拜處',
    locationJa: '龍山寺の本堂前',
    dialogueLines: [
      {
        speaker: 'LocalFriend',
        speakerJa: '台湾の友人',
        zh: '拿起這對紅色的木筊，在心裡默念自己的姓名、農曆生日跟地址，接著把問題清楚向神明請示，雙手拋下。',
        pinyin: 'Ná qǐ zhè duì hóngsè de mùjiǎo, zài xīnlǐ mòniàn zìjǐ de xìngmíng, nónglì shēngrì gēn dìzhǐ, jiēzhe bǎ wèntí qīngchǔ xiàng shénmíng qǐngshì, shuāngshǒu pāo xià.',
        ja: 'この赤い三日月型の木片（木筊）を手に取って、心の中で自分の氏名・旧暦の生年月日・住所を念じ、神様に質問を明確に伝えてから両手で落とします。',
      },
      {
        speaker: 'Tourist',
        speakerJa: '日本人旅行者',
        zh: '哇！一平面一凸面，這個是什麼意思呢？',
        pinyin: 'Wā! Yì píngmiàn yì tūmiàn, zhè gè shì shénme yìsi ne?',
        ja: 'わあ！表（平面）と裏（凸面）が1つずつ出ました！これはどういう意味ですか？',
      },
      {
        speaker: 'LocalFriend',
        speakerJa: '台湾の友人',
        zh: '太棒了！這叫「聖筊」，代表神明贊同並應允你的願望！等一下去拿平安符，在主爐上方順時針繞三圈「過香爐」就可以帶在身邊保平安囉！',
        pinyin: 'Tài bàng le! Zhè jiào "shèngjiǎo", dàibiǎo shénmíng zàntóng bìng yīngyǔn nǐ de yuànwàng! Děng yíxià qù ná píng\'ānfú, zài zhǔlú shàngfāng shùnshízhēn rào sān quān "guò xiānglú" jiù kěyǐ dài zài shēnbiān bǎo píng\'ān luō!',
        ja: '素晴らしい！それは「聖筊（シェンジャオ）」と言って、神様が願いを聞き入れ同意してくれた合図です！後でお守りを取って、大香炉の上で時計回りに3周回す「過香爐」をすれば、肌身離さず持ってご利益を受けられますよ！',
      },
    ],
    festivalGlossary: [
      {
        termZh: '聖筊 vs 笑筊 vs 陰筊',
        pinyin: 'shèngjiǎo vs xiàojiǎo vs yīnjiǎo',
        meaningJa: '神の同意（一表一裏） vs 笑い/再考（両表） vs 不可/怒り（両裏）',
        tipJa: '台湾の寺廟で行われる最も一般的な神意確認の作法。',
      },
      {
        termZh: '過香爐 (guò xiānglú)',
        pinyin: 'guò xiānglú',
        meaningJa: 'お守りを香炉の煙の上で時計回りに3回回す作法',
        tipJa: '神様の霊力と加護をお守り（平安符）に吹き込む儀式。',
      },
      {
        termZh: '香油錢 (xiāngyóuqián)',
        pinyin: 'xiāngyóuqián',
        meaningJa: 'お賽銭・お線香代',
        tipJa: 'お線香やお守りをいただく際に感謝の気持ちとして納めるお金。',
      },
    ],
  },
  {
    id: 'fest-dihua-street',
    title: '台北大稻埕迪化街年貨大街試吃採買與過年伴手禮',
    titleJa: '大稲埕・迪化街の年越し問屋街での試食と春節お土産選び',
    icon: '🧧',
    locationZh: '迪化街年貨大街攤位',
    locationJa: '旧正月前の迪化街マーケット',
    dialogueLines: [
      {
        speaker: 'Vendor',
        speakerJa: '問屋の店員',
        zh: '帥哥美女來試吃看看！台灣產的頂級野生烏魚子，還有紅棗、牛軋糖跟開心果，試吃不用錢，喜歡再買！',
        pinyin: 'Shuàigē měinǚ lái shìchī kànkan! Táiwān chǎn de dǐngjí yěshēng wūyúzǐ, hái yǒu hóngzǎo, niúgátáng gēn kāixīnguǒ, shìchī bú yòng qián, xǐhuan zài mǎi!',
        ja: 'お兄さんお姉さん試食してみて！台湾産の最高級カラスミ（烏魚子）、ナツメ、ヌガー（牛軋糖）、ピスタチオだよ！試食はタダだから気に入ったら買ってね！',
      },
      {
        speaker: 'Tourist',
        speakerJa: '旅行者',
        zh: '這個牛軋糖好香濃而且不黏牙！老闆請問如果買三盒送禮可以算便宜一點嗎？',
        pinyin: 'Zhè gè niúgátáng hǎo xiāngnóng érqiě bù nián yá! Lǎobǎn qǐngwèn rúguǒ mǎi sān hé sònglǐ kěyǐ suàn piányi yìdiǎn ma?',
        ja: 'このヌガー、ミルクの香りが濃厚で歯にくっつかないですね！お土産に3箱買ったら少しオマケしてもらえますか？',
      },
      {
        speaker: 'Vendor',
        speakerJa: '店員',
        zh: '過年討個大吉大利！算你買三送一，再送你一包阿里山高山茶包，祝你新年大發財！',
        pinyin: 'Guònián tǎo gè dàjí dàlì! Suàn nǐ mǎi sān sòng yī, zài sòng nǐ yì bāo Ālǐshān gāoshān chábāo, zhù nǐ xīnnián dà fācái!',
        ja: '新年の縁起担ぎだ！3箱買ったら1箱プレゼント（買三送一）にして、阿里山高山茶のティーバッグも付けちゃうよ！良いお年を！',
      },
    ],
    festivalGlossary: [
      {
        termZh: '買三送一 (mǎi sān sòng yī)',
        pinyin: 'mǎi sān sòng yī',
        meaningJa: '3つ買うと1つ無料（実質25%オフ）',
        tipJa: '台湾の商店や夜市で非常によく使われる販促フレーズ。',
      },
      {
        termZh: '烏魚子 (wūyúzǐ)',
        pinyin: 'wūyúzǐ',
        meaningJa: 'カラスミ（ボラの卵巣の塩漬け乾燥品）',
        tipJa: '台湾の春節（過年）の食卓や贈答品に欠かせない高級珍味。',
      },
      {
        termZh: '討個吉利 (tǎo gè jílì)',
        pinyin: 'tǎo gè jílì',
        meaningJa: '縁起を担ぐ・幸運を呼び込む',
        tipJa: 'お正月やお祝いの席で値引きや乾杯をする際の決まり文句。',
      },
    ],
  },
]
