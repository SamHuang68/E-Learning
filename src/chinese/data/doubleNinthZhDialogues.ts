/**
 * 台灣華語：台灣九九重陽節登高踏青、敬老禮金、銅鑼杭菊茶與吃重陽糕民俗生活資料庫 (Taiwanese Double Ninth & Senior Reverence Database)
 * 涵蓋日本語母語者在台灣感受敬老尊賢與秋日踏青的傳統節慶：農曆九月初九「重陽節」、九九諧音「長長久久・延年益壽」、台灣各縣市政府發放「重陽敬老禮金」與百歲人瑞金鎖片、全家陪長輩「登高步道踏青遠眺」、沖泡苗栗銅鑼黃金杭菊菊花茶、品嚐軟糯香甜象徵步步高升的「重陽糕（花糕）」日常對話。
 */

export interface DoubleNinthDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'TaiwanElderly' | 'JapaneseYouth'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  doubleNinthGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const DOUBLE_NINTH_DIALOGUES: DoubleNinthDialogueItem[] = [
  {
    id: 'double-ninth-hiking-reverence',
    title: '台灣重陽節：登高遠眺踏青、領敬老禮金、泡銅鑼杭菊茶吃重陽糕',
    titleJa: '台湾の重陽節（ちょうようせつ）：秋のハイキング（登高）・敬老祝儀・菊茶と重陽餅',
    icon: '⛰️',
    locationZh: '秋高氣爽的台北象山步道涼亭與山下老字號糕餅店',
    locationJa: '秋晴れの台北・象山ハイキングコースの東屋と麓の老舗和菓子店',
    dialogueLines: [
      {
        speaker: 'TaiwanElderly',
        speakerJa: '台湾のシニア（おじいちゃん）',
        zh: '今天是農曆九月初九「九九重陽節」！在易經中「九」是陽數的最大值，二九相重代表「長長久久、福壽雙全」！早上里長才親自把市政府發的「重陽敬老禮金」送到家裡呢！',
        pinyin: 'Jīntiān shì Nónglì jiǔyuè chūjiǔ "Jiǔjiǔ Chóngyángjié"! Zài Yìjīng zhōng "jiǔ" shì yángshù de zuìdàzhí, èr-jiǔ xiāngchóng dàibiǎo "chángcháng-jiǔjiǔ, fúshòu-shuāngquán"! Zǎoshang lǐzhǎng cái qīnzì bǎ shìzhèngfǔ fā de "chóngyáng jìnglǎo lǐjīn" sòng dào jiālǐ ne!',
        ja: '今日は旧暦9月9日「重陽節」だよ！易経では「9」は最大の陽数で、9が重なることから「末長い健康と長寿（長長久久）」を意味するんだ。今朝も町の町長（里長）が市の「敬老祝い金」を自宅まで届けに来てくれたんだよ！',
      },
      {
        speaker: 'JapaneseYouth',
        speakerJa: '日本の若者（留学生）',
        zh: '今天天氣特別晴朗舒適！難怪步道上有好多三代同堂全家一起來爬山！',
        pinyin: 'Jīntiān tiānqì tèbié qínglǎng shūshì! Nánguài bùdào shàng yǒu hǎoduō sāndài-tóngtáng quánjiā yìqǐ lái páshān!',
        ja: '今日はとても秋晴れで心地よいですね！登山道に三世代ファミリーで登高ハイキングに来ている人が多いのも納得です！',
      },
      {
        speaker: 'TaiwanElderly',
        speakerJa: '台湾のシニア（おじいちゃん）',
        zh: '這叫「登高避禍、舒展身心」！爬到涼亭吹吹秋風，喝一杯剛泡好的苗栗銅鑼「杭菊菊花茶」清心明目，再配一塊軟糯的「重陽糕」，象徵生活步步高升，身體健健康康！',
        pinyin: 'Zhè jiào "dēnggāo bìhuò, shūzhǎn shēnxīn"! Pá dào liángtíng chuīchuī qiūfēng, hē yì bēi gāng pào hǎo de Miáolì Tóngluó "hángjú júhuāchá" qīngxīn míngmù, zài pèi yí kuài ruǎnnuò de "chóngyánggāo", xiàngzhēng shēnghuó bùbù-gāoshēng, shēntǐ jiànjiàn-kāngkāng!',
        ja: '「登高（山に登って厄除けをし、心身を伸びやかにする）」という伝統さ！東屋で秋の心地よい風を浴びながら、苗栗銅鑼産の淹れたて「杭菊茶（菊の花茶）」で目をすっきり癒し、もちもちの「重陽餅（蒸し菓子）」を食べれば、運気も健康も一歩一歩高まる（步步高升）縁起物だよ！',
      },
    ],
    doubleNinthGlossary: [
      {
        termZh: '重陽節・九九重陽 (Chóngyángjié)',
        pinyin: 'Chóngyángjié',
        meaningJa: '重陽の節句（旧暦9月9日・陽の極まるおめでたい長寿祈願と敬老の日）',
        tipJa: '台湾では「敬老節」としても広く親しまれ、各自治体から敬老祝儀金が支給される。',
      },
      {
        termZh: '登高 (dēnggāo)',
        pinyin: 'dēnggāo',
        meaningJa: '高所に登る風習（秋晴れの中、山や丘に登り厄除けと健康を祈るハイキング）',
        tipJa: '台北の象山や陽明山、台中の大坑步道など各地のハイキングコースが家族連れで賑わう。',
      },
      {
        termZh: '銅鑼杭菊茶 (Tóngluó hángjúchá)',
        pinyin: 'Tóngluó hángjúchá',
        meaningJa: '苗栗県銅鑼郷名産の食用品種菊花茶（清熱明目・目の疲れを癒す秋の銘茶）',
        tipJa: '11月には銅鑼の菊花畑が一面雪景色のように真っ白・黄色に染まる人気の花畑スポット。',
      },
      {
        termZh: '重陽糕 (chóngyánggāo)',
        pinyin: 'chóngyánggāo',
        meaningJa: '重陽の蒸し菓子（「糕」と「高」が同音で「步步高升・健康増進」を祈る縁起物）',
        tipJa: '米粉と小豆・ナツメなどを何層にも重ねて蒸し上げた伝統の祝い菓子。',
      },
    ],
  },
]

export const CHINESE_SUPPORT_EN = {
  "台灣重陽節：登高遠眺踏青、領敬老禮金、泡銅鑼杭菊茶吃重陽糕": "Double Ninth Festival in Taiwan: Hiking, Senior Gifts, Chrysanthemum Tea, and Festival Cake",
  "台湾の重陽節（ちょうようせつ）：秋のハイキング（登高）・敬老祝儀・菊茶と重陽餅": "Double Ninth Festival in Taiwan: Autumn Hiking, Senior Gifts, Chrysanthemum Tea, and Festival Cake",
  "秋晴れの台北・象山ハイキングコースの東屋と麓の老舗和菓子店": "A pavilion on Taipei's Elephant Mountain trail and a traditional cake shop below",
  "台湾のシニア（おじいちゃん）": "Older Taiwanese man",
  "今日は旧暦9月9日「重陽節」だよ！易経では「9」は最大の陽数で、9が重なることから「末長い健康と長寿（長長久久）」を意味するんだ。今朝も町の町長（里長）が市の「敬老祝い金」を自宅まで届けに来てくれたんだよ！": "Today is the Double Ninth Festival, the ninth day of the ninth lunar month. In the I Ching, nine is the highest yang number, so the two nines evoke lasting health and longevity. This morning the neighbourhood chief delivered the city's senior-honouring gift money to my home.",
  "日本の若者（留学生）": "Young Japanese exchange student",
  "今日はとても秋晴れで心地よいですね！登山道に三世代ファミリーで登高ハイキングに来ている人が多いのも納得です！": "The clear autumn weather is wonderful today. No wonder so many three-generation families have come to hike up the mountain together.",
  "「登高（山に登って厄除けをし、心身を伸びやかにする）」という伝統さ！東屋で秋の心地よい風を浴びながら、苗栗銅鑼産の淹れたて「杭菊茶（菊の花茶）」で目をすっきり癒し、もちもちの「重陽餅（蒸し菓子）」を食べれば、運気も健康も一歩一歩高まる（步步高升）縁起物だよ！": "It is the tradition of climbing high to ward off misfortune and refresh body and mind. In the pavilion, we can enjoy the autumn breeze, freshly brewed chrysanthemum tea from Tongluo in Miaoli, and chewy Double Ninth cake. The cake's name sounds like 'high,' making it a wish for step-by-step advancement in fortune and health.",
  "重陽の節句（旧暦9月9日・陽の極まるおめでたい長寿祈願と敬老の日）": "The Double Ninth Festival on the ninth day of the ninth lunar month, honouring older people and wishing for longevity",
  "台湾では「敬老節」としても広く親しまれ、各自治体から敬老祝儀金が支給される。": "In Taiwan it is also widely observed as Senior Citizens' Day, and local governments may distribute celebratory gifts.",
  "高所に登る風習（秋晴れの中、山や丘に登り厄除けと健康を祈るハイキング）": "The custom of climbing a hill or mountain in autumn to seek health and ward off misfortune",
  "台北の象山や陽明山、台中の大坑步道など各地のハイキングコースが家族連れで賑わう。": "Trails such as Elephant Mountain and Yangmingshan in Taipei and Dakeng in Taichung fill with families.",
  "苗栗県銅鑼郷名産の食用品種菊花茶（清熱明目・目の疲れを癒す秋の銘茶）": "An edible chrysanthemum tea associated with Tongluo, Miaoli, traditionally enjoyed as a refreshing autumn drink",
  "11月には銅鑼の菊花畑が一面雪景色のように真っ白・黄色に染まる人気の花畑スポット。": "In November, Tongluo's white and yellow chrysanthemum fields become a popular flower-viewing destination.",
  "重陽の蒸し菓子（「糕」と「高」が同音で「步步高升・健康増進」を祈る縁起物）": "A steamed Double Ninth cake whose name sounds like 'high,' expressing a wish for steady progress and health",
  "米粉と小豆・ナツメなどを何層にも重ねて蒸し上げた伝統の祝い菓子。": "This traditional celebration cake is steamed in layers of rice flour, red beans, dates, and other ingredients.",
} as const
