/**
 * 台灣華語：台灣七夕拜月老、台北霞海城隍廟求紅線、過香爐與求良緣民俗生活資料庫 (Taiwanese Yuelao & Love Ribbons Database)
 * 涵蓋日本語母語者在台灣最浪漫靈驗的傳統民間信仰：農曆七月初七「七夕情人節」、台北大稻埕霞海城隍廟與台中樂成宮「拜月下老人（月老神）」、供奉紅棗枸杞桂圓「早生貴子結好緣」、詳細報上姓名八字與擇偶條件、擲筊連續求得三個聖筊求取「姻緣紅線與鉛錢」、順時針過香爐三圈放入皮夾隨身攜帶日常對話。
 */

export interface YuelaoLoveDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'TaiwanFriend' | 'JapaneseTraveler'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  yuelaoGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const YUELAO_LOVE_DIALOGUES: YuelaoLoveDialogueItem[] = [
  {
    id: 'yuelao-dihua-love-ribbon',
    title: '台灣七夕拜月老：霞海城隍廟求紅線、鉛錢過香爐與求良緣',
    titleJa: '台湾の七夕・月下老人参拝：霞海城隍廟の赤い糸（紅線）・鉛銭の香炉くぐりと良縁祈願',
    icon: '🏮',
    locationZh: '台北大稻埕霞海城隍廟香煙裊裊的正殿前',
    locationJa: '台北・大稲埕の霞海城隍廟、線香の煙漂う本殿前',
    dialogueLines: [
      {
        speaker: 'TaiwanFriend',
        speakerJa: '台湾の友人',
        zh: '今天是農曆七月初七七夕情人節！我們來台北大稻埕霞海城隍廟拜全台灣最靈驗的「月下老人」！供桌上要準備紅棗、枸杞、桂圓和喜糖，象徵早日找到好對象，感情甜甜蜜蜜！',
        pinyin: 'Jīntiān shì Nónglì qīyuè chūqī Qīxì Qíngrénjié! Wǒmen lái Táiběi Dàdàochéng Xiáhǎi Chénghuángmiào bài quán Táiwān zuì língyàn de "Yuèxià Lǎorén"! Gòngzhuō shàng yào zhǔnbèi hóngzǎo, gǒuqǐ, guìyuán hàn xǐtáng, xiàngzhēng zǎorì zhǎodào hǎo duìxiàng, gǎnqíng tiántián-mìmì!',
        ja: '今日は旧暦7月7日の七夕（台湾のバレンタインデー）！台湾で最もご利益があると名高い台北・大稲埕の霞海城隍廟の「月下老人（縁結びの神様）」にお参りしに来たよ！お供え物にはナツメ、クコ、竜眼、キャンディを用意して、甘い良縁と円満を祈願するんだ！',
      },
      {
        speaker: 'JapaneseTraveler',
        speakerJa: '日本人旅行者',
        zh: '跟月老講心願的時候，真的要把對方的個性、外表甚至價值觀都講得很詳細嗎？',
        pinyin: 'Gēn Yuèlǎo jiǎng xīnyuàn de shíhòu, zhēnde yào bǎ duìfāng de gèxìng, wàibiǎo shènzhì jiàzhíguān dōu jiǎng de hěn xiángxì ma?',
        ja: '月老様に願い事をお伝えするとき、相手の性格や外見、価値観まで詳しく具体的にお話しした方がいいのですか？',
      },
      {
        speaker: 'TaiwanFriend',
        speakerJa: '台湾の友人',
        zh: '沒錯！報上自己的姓名生辰八字與住址後，條列越清楚月老越好幫你牽線！擲筊求得月老答應後，拿到「姻緣紅線」和「鉛錢（台語音同結緣）」，在香爐上方順時針繞三圈過爐，放進皮夾隨身攜帶，良緣很快就到！',
        pinyin: 'Méi cuò! Bào shàng zìjǐ de xìngmíng shēngchén bāzì hàn zhùzhǐ hòu, tiáoliè yuè qīngchǔ Yuèlǎo yuè hǎo bāng nǐ qiānxiàn! Zhíjiǎo qiú dé Yuèlǎo dāyìng hòu, nádào "yīnyuán hóngxiàn" hàn "qiánqián", zài xiānglú shàngfāng shùnshízhēn rào sān quān guòlú, fàng jìn píjiá suíshēn xiédài, liángyuán hěn kuài jiù dào!',
        ja: 'その通り！自分の氏名・生年月日・現住所を名乗り、理想の条件を具体的に伝えるほど月老様も縁を結びやすいのさ。おみくじで許可を得たら「赤い糸」と「鉛銭（台湾語で縁結びと同音）」を授かり、香炉の煙の上で時計回りに3回回して（過爐）、財布に入れて大切に持ち歩くんだよ！',
      },
    ],
    yuelaoGlossary: [
      {
        termZh: '月下老人・月老 (Yuèxià Lǎorén / Yuèlǎo)',
        pinyin: 'Yuèxià Lǎorén',
        meaningJa: '月下老人（男女の運命の赤い糸を結ぶ中国・台湾伝統の婚姻・縁結びの神様）',
        tipJa: '右手に杖、左手に婚姻簿を持ち、白髪と長い髭をたくわえた慈悲深い老人の姿をしている。',
      },
      {
        termZh: '姻緣紅線 (yīnyuán hóngxiàn)',
        pinyin: 'yīnyuán hóngxiàn',
        meaningJa: '運命の赤い糸（月老から授かり良縁を引き寄せるお守り）',
        tipJa: '香炉の煙の上で3回時計回りに回して煙を浴びせ（過爐）、財布やポーチに入れて身につける。',
      },
      {
        termZh: '鉛錢 (qiánqián)',
        pinyin: 'qiánqián',
        meaningJa: '鉛の古銭お守り（台湾語で「鉛（iân）」の発音が「縁（iân）」と同音で縁起が良い）',
        tipJa: '赤い糸と一緒に結ばれて授与され、「月老と有縁・良縁成就」を象徴する。',
      },
    ],
  },
]
