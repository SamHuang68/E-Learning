/**
 * 台灣華語：台灣老街文創、傳統工藝手作與茶藝體驗資料庫 (Taiwan Crafts & Tea Culture Database)
 * 涵蓋日本語母語者在台灣十分老街放天燈寫毛筆字願望、鶯歌手拉胚捏陶、九份茶坊品茗高山烏龍茶（聞香杯・茶海・沖泡法）等最具台灣文化深度的交流會話。
 */

export interface CraftsDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Tourist' | 'Instructor' | 'TeaMaster'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  craftsGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const CRAFTS_DIALOGUES: CraftsDialogueItem[] = [
  {
    id: 'craft-shifen-lantern',
    title: '新北十分老街放天燈：四面毛筆題字祈福與冉冉升空',
    titleJa: '十分老街の天燈（スカイランタン）上げ：4面に毛筆で願い事を書く',
    icon: '🏮',
    locationZh: '十分鐵道旁天燈店家',
    locationJa: '十分駅の線路沿いランタン店',
    dialogueLines: [
      {
        speaker: 'Instructor',
        speakerJa: '天燈店の店員',
        zh: '這盞四色天燈代表不同福氣：紅色求平安、黃色招財富、藍色保事業、粉色促姻緣！請用毛筆在四個面寫下你們的心願。',
        pinyin: 'Zhè zhǎn sìsè tiāndēng dàibiǎo bùtóng fúqì: hóngsè qiú píng\'ān, huángsè zhāo cáifù, lánsè bǎo shìyè, fěnsè cù yīnyuán! Qǐng yòng máobǐ zài sì gè miàn xiě xià nǐmen de xīnyuàn.',
        ja: 'この4色ランタンはそれぞれご利益が違います：赤は無病息災、黄は金運、青は仕事運、ピンクは良縁です！筆で4つの面に願い事を書いてくださいね。',
      },
      {
        speaker: 'Tourist',
        speakerJa: '日本人観光客',
        zh: '我寫了「身體健康、步步高升」！請問點火的時候要怎麼抓著天燈呢？',
        pinyin: 'Wǒ xiě le "shēntǐ jiànkāng, bùbù gāoshēng"! Qǐngwèn diǎnhuǒ de shíhou yào zěnme zhuā zhe tiāndēng ne?',
        ja: '「身体健康（無病息災）、步步高升（トントン拍子に出世）」と書きました！火をつける時はどうやってランタンを持てばいいですか？',
      },
      {
        speaker: 'Instructor',
        speakerJa: '店員',
        zh: '四個角輕輕捏著底部竹框，等熱氣充滿整個燈身感覺往上飄時，我喊一二三大家一起放手！天燈飛得又高又遠，願望一定實現！',
        pinyin: 'Sì gè jiǎo qīngqīng niē zhe dǐbù zhúkuāng, děng rèqì chōngmǎn zhěnggè dēngshēn gǎnjué wǎng shàng piāo shí, wǒ hǎn yī èr sān dàjiā yìqǐ fàngshǒu! Tiāndēng fēi de yòu gāo yòu yuǎn, yuànwàng yídìng shíxiàn!',
        ja: '四隅の竹枠の下を軽く持って、熱気が満ちて上に浮き上がりそうになったら、私が1・2・3と合図するので一斉に手を離してください！天高く飛べば願いは必ず叶います！',
      },
    ],
    craftsGlossary: [
      {
        termZh: '步步高升 (bùbù gāoshēng)',
        pinyin: 'bùbù gāoshēng',
        meaningJa: '一歩一歩順調に出世する（仕事運向上）',
        tipJa: '台湾の天燈や年賀状で最も好まれる縁起の良い四字成語。',
      },
      {
        termZh: '心想事成 (xīnxiǎng shìchéng)',
        pinyin: 'xīnxiǎng shìchéng',
        meaningJa: '心に思い描いた願いが全て叶う',
        tipJa: 'あらゆる願い事に使える万能の祝福フレーズ。',
      },
      {
        termZh: '天燈 (tiāndēng)',
        pinyin: 'tiāndēng',
        meaningJa: 'スカイランタン（孔明燈）',
        tipJa: '平渓・十分エリアの伝統民俗。平渓天燈節は世界的にも有名なイベント。',
      },
    ],
  },
  {
    id: 'craft-jiufen-teahouse',
    title: '九份阿妹茶樓台灣高山烏龍茶茶藝品茗與聞香杯',
    titleJa: '九份茶房での台湾高山烏龍茶体験：聞香杯と茶芸のお作法',
    icon: '🍵',
    locationZh: '九份阿妹茶樓觀海座位',
    locationJa: '九份のレトロな茶藝館（阿妹茶樓）',
    dialogueLines: [
      {
        speaker: 'TeaMaster',
        speakerJa: '茶芸師（茶藝師）',
        zh: '歡迎光臨！今天為兩位準備的是阿里山特級金萱高山烏龍茶，帶有天然淡淡的奶香與花香。',
        pinyin: 'Huānyíng guānglín! Jīntiān wèi liǎng wèi zhǔnbèi de shì Ālǐshān tèjí jīnxuān gāoshān wūlóngchá, dài yǒu tiānrán dàndàn de nǎixiāng yǔ huāxiāng.',
        ja: 'いらっしゃいませ！本日ご用意したのは阿里山特級金萱（きんせん）高山烏龍茶です。ほのかな天然のミルクと花の香りが特徴です。',
      },
      {
        speaker: 'Tourist',
        speakerJa: '観光客',
        zh: '這個細長高高的杯子是用來喝茶的嗎？跟旁邊矮矮的小茶杯有什麼不一樣？',
        pinyin: 'Zhè gè xìcháng gāogāo de bēizi shì yòng lái hē chá de ma? Gēn pángbiān ǎi\'ǎi de xiǎo chábēi yǒu shénme bù yíyàng?',
        ja: 'この細長くて背の高い器でお茶を飲むのですか？隣の背の低い小さな茶杯とはどう違うのですか？',
      },
      {
        speaker: 'TeaMaster',
        speakerJa: '茶芸師',
        zh: '高的叫做「聞香杯」，用來聚集茶湯深層香氣；矮的叫「品茗杯」，用來細細品嚐回甘！先將聞香杯倒扣滾動，放在鼻子前深呼吸，就能聞到醉人的茶香囉！',
        pinyin: 'Gāo de jiào zuò "wénxiāngbēi", yòng lái jùjí chátāng shēncéng xiāngqì; ǎi de jiào "pǐnmíngbēi", yòng lái xìxì pǐncháng huígān! Xiān jiāng wénxiāngbēi dàokòu gǔndòng, fàng zài bízi qián shēnhūxī, jiù néng wén dào zuìrén de cháxiāng luō!',
        ja: '細長いのは「聞香杯（アロマカップ）」でお茶の奥深い香りを集めるもの、低いのが「品茗杯」でお茶を味わう杯です！聞香杯を手のひらで転がして鼻に近づけると、うっとりするような香りを楽しめますよ！',
      },
    ],
    craftsGlossary: [
      {
        termZh: '聞香杯 vs 品茗杯',
        pinyin: 'wénxiāngbēi vs pǐnmíngbēi',
        meaningJa: '香りを楽しむ縦長杯 vs お茶を飲む平杯',
        tipJa: '台湾の工夫茶（本格茶芸）ならではの独自の茶器。',
      },
      {
        termZh: '回甘 (huígān)',
        pinyin: 'huígān',
        meaningJa: '飲んだ後に喉の奥から広がる甘い余韻（アフターテイスト）',
        tipJa: '上質な台湾高山茶を評価する際の最高の褒め言葉。',
      },
      {
        termZh: '金萱烏龍茶 (jīnxuān wūlóngchá)',
        pinyin: 'jīnxuān wūlóngchá',
        meaningJa: '台茶12号（ミルキーな香りが大人気の台湾品種）',
        tipJa: '香料不使用なのに天然のミルク香が漂い、女性や外国人観光客に絶大な人気。',
      },
    ],
  },
]
