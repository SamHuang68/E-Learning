/**
 * 台灣華語：台灣公司年終尾牙聚餐、吃刈包潤餅、摸彩抽大獎與雞頭文化資料庫 (Taiwan Weiya Year-End Banquet Database)
 * 涵蓋日本語母語者在台灣職場最期待的年度盛會：農曆十二月十六尾牙、年終尾牙大聚餐、吃「刈包（虎咬豬，夾焢肉酸菜花生粉，象徵咬住財富）」、白斬雞「雞頭指向」的傳統典故與現代幽默化解（雞頭對老闆全體加薪）、摸彩抽特獎全場大喊「加碼！加碼！」、互道祝賀「新年業績長紅、年終獎金入袋」。
 */

export interface WeiyaDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Colleague' | 'JapaneseExpat'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  weiyaGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const WEIYA_DIALOGUES: WeiyaDialogueItem[] = [
  {
    id: 'weiya-annual-banquet',
    title: '台灣公司年終尾牙：吃刈包虎咬豬、摸彩大喊加碼與雞頭幽默化解',
    titleJa: '台湾の忘年会（尾牙）：角煮パオ（虎咬豬）・大抽選会「加碼（ボーナス上乗せ）」と鶏頭マナー',
    icon: '🧧',
    locationZh: '公司年終尾牙大型宴會廳',
    locationJa: '会社の忘年会（尾牙）大宴会場',
    dialogueLines: [
      {
        speaker: 'Colleague',
        speakerJa: '台湾の先輩',
        zh: '今天是一年一度的尾牙！桌上這道白切雞，以前老傳統如果雞頭對準誰就代表誰要被解雇，現在大家直接把雞頭轉向老闆，起鬨要「加碼加薪」！',
        pinyin: 'Jīntiān shì yì nián yí dù de wěiyá! Zhuō shàng zhè dào báiqiējī, yǐqián lǎo chuántǒng rúguǒ jītóu duìzhǔn shéi jiù dàibiǎo shéi yào bèi jiěgù, xiànzài dàjiā zhíjiē bǎ jītóu zhuǎnxiàng lǎobǎn, qǐhòng yào "jiāmǎ jiāxīn"!',
        ja: '今日は年に一度の「尾牙（忘年会）」だよ！テーブルの蒸し鶏だけど、昔の伝統では鶏の頭が向いた人がクビ（解雇）という合図だったんだ。今はみんな頭を社長に向けて「ボーナス上乗せ（加碼）＆昇給！」って盛り上がるのがお決まりさ！',
      },
      {
        speaker: 'JapaneseExpat',
        speakerJa: '日本人駐在員',
        zh: '哈哈！大家一起大喊「加碼！加碼！」太有活力了！還有這道像白色夾心漢堡的食物是什麼呢？',
        pinyin: 'Hāhā! Dàjiā yìqǐ dà hǎn "jiāmǎ! jiāmǎ!" tài yǒu huólì le! Hái yǒu zhè dào xiàng báisè jiāxīn hànbǎo de shíwù shì shénme ne?',
        ja: 'はは！みんなで「加碼（ジャーマー）！加碼！」と叫ぶのは大迫力ですね！この白いハンバーガーのような料理は何ですか？',
      },
      {
        speaker: 'Colleague',
        speakerJa: '台湾の先輩',
        zh: '這是「刈包」，又叫「虎咬豬」！裡面包肥瘦適中的滷焢肉、酸菜、香菜和花生糖粉，象徵把一整年的福氣與財富統統咬進肚子裡，大發利市！',
        pinyin: 'Zhè shì "guàbāo", yòu jiào "hǔ yǎo zhū"! Lǐmiàn bāo féishòu shìzhōng de lǔ kòngròu, suāncài, xiāngcài hàn huāshēng tángfěn, xiàngzhēng bǎ yì zhěng nián de fúqì yǔ cáifù tǒngtǒng yǎo jìn dùzi lǐ, dà fā lì shì!',
        ja: 'これは「刈包（グァパオ）」、別名「虎咬豬（トラが豚を噛む）」だよ！角煮、高菜漬け、パクチー、ピーナッツシュガーを挟んであって、1年分の福と金運をガブッと丸呑みして商売繁盛を祈る縁起物なんだ！',
      },
    ],
    weiyaGlossary: [
      {
        termZh: '尾牙 (wěiyá)',
        pinyin: 'wěiyá',
        meaningJa: '台湾の忘年会・慰労大宴会（旧暦12月16日の土地神への感謝祭が起源）',
        tipJa: '日本の忘年会と異なり会社主催で全額会社負担。高級ホテルでの豪華コース料理や豪華芸能人ライブ、高額賞金抽選会が名物。',
      },
      {
        termZh: '加碼 (jiāmǎ)',
        pinyin: 'jiāmǎ',
        meaningJa: '抽選会の賞金・賞品の上乗せコール（「社長、もっと賞金出して！」の合図）',
        tipJa: '会場全体で「加碼！加碼！」とコールし、経営陣や役員がポケットマネーで現金10万〜100万元を追加提供するのが最高潮の盛り上がり。',
      },
      {
        termZh: '虎咬豬・刈包 (hǔ yǎo zhū)',
        pinyin: 'hǔ yǎo zhū',
        meaningJa: '台湾式角煮バーガー（虎が豚肉を噛んでいる姿に見える縁起物）',
        tipJa: '福を噛んで離さない、お財布がパンパンに膨らむという意味が込められ、尾牙で必ず食べられる。',
      },
    ],
  },
]
