/**
 * 台灣華語：台灣冬夜名物「刈包（虎咬豬）」咬住福氣與溫熱「四神湯」生活資料庫 (Taiwanese Guabao & Sishen Soup Database)
 * 涵蓋日本語母語者在台灣必吃的傳統街頭美食與民俗象徵：冬夜排隊名店熱氣蒸騰的白胖鬆軟刈包（又名「虎咬豬」，白麵皮宛如老虎大嘴咬住肥厚紅燒爌肉，寓意將一年晦氣咬碎、咬住滿滿財富福氣）、肥瘦自選（全肥、半肥半瘦、偏瘦）、滿滿現炒微酸爽脆酸菜、純花生粉拌白糖與新鮮香菜；搭配一碗熬煮至乳白色的藥膳溫補「四神湯（茯苓、芡實、蓮子、淮山藥）」，軟爛豬小腸或排骨、噴上靈魂當歸藥酒香氣四溢。
 */

export interface GuabaoSishenDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'TaiwanFoodie' | 'JapaneseFoodLover'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  guabaoGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const GUABAO_SISHEN_DIALOGUES: GuabaoSishenDialogueItem[] = [
  {
    id: 'guabao-sishen-night-market',
    title: '台灣傳統名物：夜市炭蒸刈包「虎咬豬」咬住財富、熱氣騰騰當歸四神湯',
    titleJa: '台湾の伝統名物：夜市の蒸し立て刈包「虎咬猪（福を噛みしめる）」＆当帰の四神湯',
    icon: '🍔',
    locationZh: '冬夜飄著老滷汁與當歸藥酒香氣的刈包四神湯排隊名店',
    locationJa: '冬の夜、秘伝の煮込みタレと当帰薬酒の香りが漂う刈包＆四神湯の行列店',
    dialogueLines: [
      {
        speaker: 'TaiwanFoodie',
        speakerJa: '台湾のグルメ通',
        zh: '這家刈包老店是冬夜的靈魂！刈包外型像一個裝滿錢的錢包，又被叫做「虎咬豬」，因為白胖的蒸包像老虎張嘴咬住厚厚的三層肉，象徵把壞運咬碎、咬住一整年的福氣與財富！',
        pinyin: 'Zhè jiā guàbāo lǎodiàn shì dōngyè de línghún! Guàbāo wàixíng xiàng yí ge zhuāngmǎn qián de qiánbāo, yòu bèi jiàozuò "hǔ yǎo zhū", yīnwèi báipàng de zhēngbāo xiàng hǎohǔ zhāngzuǐ yǎozhù hòuhòu de sāncéngròu, xiàngzhēng bǎ huàiyùn yǎosuì, yǎozhù yì zhěng nián de fúqì hàn cáifù!',
        ja: 'この刈包の老舗は冬の夜のソウルフード！刈包は見た目がお金で膨らんだ財布に似ていて、「虎咬猪（トラが豚を噛む）」とも呼ばれるよ。白くてふわふわの蒸しパンがトラの口で、厚切りの角煮を噛みしめる姿から、厄を噛み砕き一年の福と財運を掴む縁起物なんだ！',
      },
      {
        speaker: 'JapaneseFoodLover',
        speakerJa: '日本のグルメ好き',
        zh: '點餐的時候老闆問我要「半肥半瘦」還是「瘦肉多一點」！裡面還鋪滿了現炒酸菜、花生粉和新鮮香菜！',
        pinyin: 'Diǎncān de shíhou lǎobǎn wèn wǒ yào "bàn féi bàn shòu" háishì "shòuròu duō yìdiǎn"! Lǐmiàn hái pūmǎn le xiàn chǎo suāncài, huāshēngfěn hàn xīnxiān xiāngcài!',
        ja: '注文のときに店主から「赤身と脂身のバランス（半肥半瘦）にする？それとも赤身多め？」と聞かれました！中には炒めた高菜漬け（酸菜）、ピーナッツ粉、刻みパクチーがぎっしり挟まれています！',
      },
      {
        speaker: 'TaiwanFoodie',
        speakerJa: '台湾のグルメ通',
        zh: '一口咬下去肉汁混合花生糖粉的甜鹹香氣絕配！吃刈包一定要配一碗熱騰騰的「四神湯」，茯苓、芡實、蓮子、山藥慢熬，再淋幾滴當歸藥酒，健脾去濕全身超舒暢！',
        pinyin: 'Yì kǒu yǎo xiàqù ròuzhī hùnhé huāshēng tángfěn de tiánxián xiāngqì juépèi! Chī guàbāo yídìng yào pèi yì wǎn rèténgténg de "sìshéntāng", fúlíng, qiànshí, liánzǐ, shānyao màn áo, zài lín jǐ dī dāngguī yàojiǔ, jiànpí qùshī quánshēn chāo shūchàng!',
        ja: '一口かじると、角煮の肉汁とピーナッツシュガーの甘じょっぱい香りが完璧に調和するよ！刈包を食べるときは、熱々の「四神湯（スーシェンタン）」を合わせるのが定番。漢方の生薬（ブクリョウ・オニバス・ハスの実・山芋）と豚小腸を煮込み、仕上げの当帰酒を数滴たらせば、体の湿気を払ってぽかぽかだよ！',
      },
    ],
    guabaoGlossary: [
      {
        termZh: '刈包 / 虎咬豬 (guàbāo / hǔ yǎo zhū)',
        pinyin: 'guàbāo / hǔ yǎo zhū',
        meaningJa: '台湾式角煮バーガー（白蒸しパンに豚角煮・酸菜・ピーナッツ粉・パクチーを挟んだ伝統食）',
        tipJa: '外見が財布やトラの口に見えることから「福と金運を呼び込む」縁起物として親しまれる。',
      },
      {
        termZh: '半肥半瘦 (bàn féi bàn shòu)',
        pinyin: 'bàn féi bàn shòu',
        meaningJa: '脂身と赤身の黄金比（もっともジューシーで人気のある角煮の部位指定）',
        tipJa: '脂身が苦手な人は「偏瘦（赤身多め）」や「全瘦（赤身のみ）」と注文可能。',
      },
      {
        termZh: '花生糖粉與酸菜 (huāshēng tángfěn & suāncài)',
        pinyin: 'huāshēng tángfěn & suāncài',
        meaningJa: 'ピーナッツシュガー＆高菜炒め（刈包に欠かせない甘みと酸味のアクセント）',
        tipJa: '酸菜の塩気と酸味が角煮の油っぽさを絶妙に中和してくれる。',
      },
      {
        termZh: '四神湯 (sìshéntāng)',
        pinyin: 'sìshéntāng',
        meaningJa: '四神スープ（茯苓・オニバス・蓮の実・山芋と豚モツを煮込んだ薬膳スープ）',
        tipJa: '卓上にある「当帰薬酒（漢方漬け米酒）」をスープに回しかけて香りを高めて飲む。',
      },
    ],
  },
]
