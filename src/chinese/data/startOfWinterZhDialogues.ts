/**
 * 台灣華語：台灣立冬補冬、炭火薑母鴨、麻油雞與羊肉爐生活資料庫 (Taiwanese Start of Winter & Ginger Duck Database)
 * 涵蓋日本語母語者在台灣感受最溫暖熱鬧的冬日美食文化：農曆二十四節氣「立冬」、台灣俗諺「立冬補冬、補嘴空」、冬夜騎樓矮桌圍坐炭火「薑母鴨（老薑、紅面番鴨、黑麻油與米酒藥膳）」、手工麵線拌鴨油油蔥酥、特調甘甜微辣「豆腐乳醬」、濃醇全酒「麻油雞」與彰化溪湖清燉「羊肉爐」日常對話。
 */

export interface StartOfWinterDialogueItem {
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
  winterTonicGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const START_OF_WINTER_DIALOGUES: StartOfWinterDialogueItem[] = [
  {
    id: 'winter-tonic-ginger-duck',
    title: '台灣立冬補冬：騎樓炭火薑母鴨、麵線拌鴨油、沾濃郁豆腐乳醬',
    titleJa: '台湾の立冬「補冬（冬の滋養強壮）」：炭火生姜鴨鍋（薑母鴨）・アヒル油の素麺・豆腐乳タレ',
    icon: '🦆',
    locationZh: '立冬夜晚熱氣騰騰、高朋滿座的騎樓炭火薑母鴨老店',
    locationJa: '立冬の夜、湯気と活気に満ちた軒先（騎樓）の炭火生姜鴨鍋（薑母鴨）専門店',
    dialogueLines: [
      {
        speaker: 'TaiwanFoodie',
        speakerJa: '台湾のグルメ通',
        zh: '今天是二十四節氣的「立冬」！台灣人有句老話叫「立冬補冬，補嘴空」，意思是用熱呼呼的藥膳美食來慰勞一整年的辛勞！今晚一定要吃「炭火薑母鴨」！',
        pinyin: 'Jīntiān shì èrshísì jiéqì de "Lìdōng"! Táiwān rén yǒu jù lǎohuà jiào "Lìdōng bǔ dōng, bǔ zuǐ kōng", yìsi shì yòng rèhūhū de yàoshàn měishí lái wèiláo yì zhěng nián de xīnláo! Jīnwǎn yídìng yào chī "tànhuǒ jiāngmǔyā"!',
        ja: '今日は二十四節気の「立冬」！台湾には「立冬補冬、補嘴空（立冬に滋養食を食べて口と体を満たす）」ということわざがあって、薬膳のご馳走で一年の労をねぎらうんだ！今夜は絶対「炭火生姜鴨鍋（薑母鴨）」だよ！',
      },
      {
        speaker: 'JapaneseFoodLover',
        speakerJa: '日本のグルメ好き',
        zh: '陶鍋底下用的是真正的紅泥木炭爐耶！湯頭飄著濃濃的黑麻油、老薑和米酒香氣！',
        pinyin: 'Táoguō dǐxià yòng de shì zhēnzhèng de hóngní mùtànlú ye! Tāngtóu piāozhe nóngnóng de hēimáyóu, lǎojiāng hàn mǐjiǔ xiāngqì!',
        ja: '土鍋の下は本物の赤泥炭火コンロですね！スープから黒胡麻油、ひね生姜（老薑）、米酒の香ばしい香りが漂って食欲をそそります！',
      },
      {
        speaker: 'TaiwanFoodie',
        speakerJa: '台湾のグルメ通',
        zh: '紅面番鴨肉質緊實有嚼勁，沾上特調的「辣味豆腐乳醬」是靈魂吃法！再點一盤熱騰騰的「手工麵線」拌鴨油和蒜酥，全身從頭到腳都暖和起來！',
        pinyin: 'Hóngmiàn fānyā ròuzhí jǐnshí yǒu jiáojìn, zhānshàng tètiáo de "làwèi dòufurǔjiàng" shì línghún chīfǎ! Zài diǎn yì pán rèténgténg de "shǒugōng miànxiàn" bàn yāyóu hàn suànsū, quánshēn cóng tóu dào jiǎo dōu nuǎnhuo qǐlái!',
        ja: 'バリケン鴨（紅面番鴨）の引き締まった肉質を、特製の「ピリ辛豆腐乳（発酵豆腐タレ）」にディップするのが一番の醍醐味！アヒル油と揚げニンニクを絡めた「手打ち素麺（麵線）」を食べれば、つま先までポカポカだよ！',
      },
    ],
    winterTonicGlossary: [
      {
        termZh: '立冬補冬 (Lìdōng bǔ dōng)',
        pinyin: 'Lìdōng bǔ dōng',
        meaningJa: '立冬の滋養強壮習慣（本格的な冬の到来に備え、温熱性の鍋料理を食べる風習）',
        tipJa: '薑母鴨のほか、麻油雞（鶏肉の胡麻油煮）や羊肉爐（羊肉鍋）の店に行列ができる。',
      },
      {
        termZh: '薑母鴨 (jiāngmǔyā)',
        pinyin: 'jiāngmǔyā',
        meaningJa: '生姜鴨鍋（老薑・黒胡麻油・米酒・漢方生薬で鴨肉を炒め煮込んだ台湾の代表的冬鍋）',
        tipJa: '「薑母」とは栽培後数年経った辛味と薬効の強い「ひね生姜」のこと。',
      },
      {
        termZh: '豆腐乳醬 (dòufurǔjiàng)',
        pinyin: 'dòufurǔjiàng',
        meaningJa: '発酵豆腐だれ（チーズのように濃厚でまろやかな薑母鴨・羊肉爐必須のつけダレ）',
        tipJa: '甘みとコクがあり、唐辛子醤油（辣椒醬油）とお好みでブレンドして食べる。',
      },
      {
        termZh: '鴨油麵線 (yāyóu miànxiàn)',
        pinyin: 'yāyóu miànxiàn',
        meaningJa: 'アヒル油和え素麺（茹でたて極細素麺に鍋の鴨油・フライドオニオン・刻みニンニクを絡めた定番主食）',
        tipJa: '鍋が煮立つまでの間にまず注文して空腹を満たすのが台湾ローカルの通な頼み方。',
      },
    ],
  },
]
