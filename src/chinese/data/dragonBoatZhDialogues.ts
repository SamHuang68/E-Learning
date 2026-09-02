/**
 * 台灣華語：台灣端午節正午立蛋、南北粽大對決、划龍舟與懸掛菖蒲艾草民俗生活資料庫 (Taiwanese Dragon Boat Festival Database)
 * 涵蓋日本語母語者在台灣最熱血又美味的初夏節慶：農曆五月初五端午節、端午正午十二點「立蛋（生卵立て）」引陽氣、熱血沸騰划龍舟奪標、門口插艾草菖蒲辟邪驅蚊、以及全台灣最著名的「南部粽（生米水煮・軟糯沾花生粉）」vs「北部粽（油飯熟米蒸煮・粒粒分明）」世紀大對決日常對話。
 */

export interface DragonBoatDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'TaiwanGrandma' | 'JapaneseTraveler'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  dragonBoatGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const DRAGON_BOAT_DIALOGUES: DragonBoatDialogueItem[] = [
  {
    id: 'dragon-boat-zongzi-noon',
    title: '台灣端午節：正午立蛋求好運、南北粽大對決與懸掛菖蒲艾草',
    titleJa: '台湾の端午節：正午の生卵立て・南部粽vs北部粽の大論争とよもぎ除災',
    icon: '🛶',
    locationZh: '台灣阿嬤家客廳與飄著粽葉清香的廚房',
    locationJa: '台湾のおばあちゃんの家のリビングと笹の葉香る台所',
    dialogueLines: [
      {
        speaker: 'TaiwanGrandma',
        speakerJa: '台湾のおばあちゃん',
        zh: '今天是農曆五月初五端午節！快看時鐘，正中午十二點陽氣最重，小朋友都在地上挑戰「立蛋」，只要雞蛋站起來，一整年都會有好運喔！',
        pinyin: 'Jīntiān shì Nónglì wǔyuè chūwǔ Duānwǔjié! Kuài kàn shízhōng, zhèng zhōngwǔ shí\'èr diǎn yángqì zuì zhòng, xiǎopéngyǒu dōu zài dìshàng tiǎozhàn "lìdàn", zhǐyào jīdàn zhàn qǐlái, yì zhěng nián dōu huì yǒu hǎoyùn o!',
        ja: '今日は旧暦5月5日の端午節だよ！時計を見てごらん、正午の12時は一年で最も陽気が盛んな時間なんだ。みんな床で「卵立て（立蛋）」に挑戦していて、卵が直立すれば一年中幸運に恵まれると言われているよ！',
      },
      {
        speaker: 'JapaneseTraveler',
        speakerJa: '日本人旅行者',
        zh: '我立起來了！好神奇！廚房裡傳來好香的味道，正在煮的是台灣粽子嗎？',
        pinyin: 'Wǒ lì qǐlái le! Hǎo shénqí! Chúfáng lǐ chuán lái hǎo xiāng de wèidào, zhèngzài zhǔ de shì Táiwān zòngzi ma?',
        ja: '立ちました！不思議ですね！台所からとてもいい香りが漂ってきますが、茹でているのは台湾のちまき（粽子）ですか？',
      },
      {
        speaker: 'TaiwanGrandma',
        speakerJa: '台湾のおばあちゃん',
        zh: '是我們南部的水煮粽！生糯米包五花肉、香菇、栗子和鹹蛋黃，在滾水裡慢火煮透，口感軟糯綿密，吃的時候淋醬油膏撒花生粉！北部粽則是把熟糯米炒成油飯再蒸，粒粒分明，各有千秋！',
        pinyin: 'Shì wǒmen nánbù de shuǐzhǔzòng! Shēng nuòmǐ bāo wǔhuāròu, xiānggū, lìzi hàn xiándànhuáng, zài gǔnshuǐ lǐ mànhuǒ zhǔ tòu, kǒugǎn ruǎnnuò miánmì, chī de shíhòu lín jiàngyóugāo sǎ huāshēngfěn! Běibùzòng zéshì bǎ shú nuòmǐ chǎo chéng yóufàn zài zhēng, lìlì fēnmíng, gè yǒu qiānqiū!',
        ja: 'うちの南部の水煮ちまき（南部粽）だよ！生の餅米で豚の角煮、椎茸、栗、塩漬け卵黄を包んで、沸騰したお湯でコトコト煮込むから、もっちり柔らか。とろみ醤油とピーナッツ粉をかけて食べるのさ！北部は味付けしたおこわを蒸すからお米が立っていて、どちらも最高だよ！',
      },
    ],
    dragonBoatGlossary: [
      {
        termZh: '立蛋 (lìdàn)',
        pinyin: 'lìdàn',
        meaningJa: '端午節正午に生卵を立てる民俗行事（幸運と陽気充填の兆し）',
        tipJa: '端午節の正午（昼12時）は太陽の引力と陽気が最も高まる瞬間と信じられ、全国民がこぞって卵立てに挑む。',
      },
      {
        termZh: '南部粽 (nánbùzòng)',
        pinyin: 'nánbùzòng',
        meaningJa: '南部風水煮ちまき（生米と具を竹皮に包み、長時間茹で上げるため粘りと香りが豊か）',
        tipJa: '台湾南部では甘辛い醤油タレ（醬油膏）と香ばしいピーナッツ粉（花生粉）をたっぷりかけて食す。',
      },
      {
        termZh: '北部粽 (běibùzòng)',
        pinyin: 'běibùzòng',
        meaningJa: '北部風蒸しちまき（炒めて味付けした餅米・おこわを蒸籠で蒸し上げる、米粒がしっかり）',
        tipJa: '炒めた紅ネギ（油蔥酥）と胡椒のスパイスが効いており、香ばしさと歯ごたえが際立つ。',
      },
    ],
  },
]
