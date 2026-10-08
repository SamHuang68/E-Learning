/**
 * 台灣華語：台灣中秋節家家戶戶烤肉、吃蛋黃酥、剝文旦戴柚子帽與賞月民俗生活資料庫 (Taiwanese Mid-Autumn Festival BBQ Database)
 * 涵蓋日本語母語者在台灣最驚喜的現代民俗風景：農曆八月十五中秋節、台灣獨一無二的「中秋全家騎樓戶外烤肉（萬家烤肉萬家香・吐司夾烤肉片）」、剝麻豆文旦柚子「把柚子皮剪成帽子戴在頭上或給毛小孩戴」、排隊瘋搶彰化現烤蛋黃酥、仰望中秋滿月與嫦娥奔月玉兔搗藥民俗對話。
 */

export interface MidAutumnDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'TaiwanHost' | 'JapaneseFriend'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  midAutumnGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const MID_AUTUMN_DIALOGUES: MidAutumnDialogueItem[] = [
  {
    id: 'mid-autumn-bbq-pomelo',
    title: '台灣中秋節：騎樓戶外烤肉香、剝文旦戴柚子帽與吃蛋黃酥',
    titleJa: '台湾の中秋節：路上バーベキュー文化・文旦の皮帽子とエッグ黄身パイ（蛋黃酥）',
    icon: '🌕',
    locationZh: '台灣住家一樓騎樓人行道與皎潔滿月下',
    locationJa: '台湾の民家1階の歩道（騎樓）と美しい満月の下',
    dialogueLines: [
      {
        speaker: 'TaiwanHost',
        speakerJa: '台湾の友人',
        zh: '中秋節快樂！走在路上是不是聞到滿街的烤肉香？在台灣，中秋節除了賞月吃月餅，最核心的活動就是全家在騎樓生炭火烤肉！',
        pinyin: 'Zhōngqiūjié kuàilè! Zǒu zài lùshang shì bú shì wéndào mǎnjiē de kǎoròu xiāng? Zài Táiwān, Zhōngqiūjié chúle shǎngyuè chī yuèbǐng, zuì héxīn de huódòng jiù shì quánjiā zài qílóu shēng tànhuǒ kǎoròu!',
        ja: '中秋節おめでとう！街を歩くとどこからも香ばしい焼き肉の匂いが漂ってくるでしょう？台湾では月見や月餅だけでなく、家族総出で軒先（騎樓）で炭火焼き肉をするのが一番の定番行事なんだ！',
      },
      {
        speaker: 'JapaneseFriend',
        speakerJa: '日本の友人',
        zh: '真的好熱鬧！烤好的豬肉片夾在白吐司裡吃，刷上甜甜鹹鹹的烤肉醬太美味了！桌上這頂綠色的小帽子又是什麼呢？',
        pinyin: 'Zhēnde hǎo rènào! Kǎo hǎo de zhūròupiàn jiá zài bái tǔsī lǐ chī, shuā shàng tiántián xiánxián de kǎoròujiàng tài měiwèi le! Zhuō shàng zhè dǐng lǜsè de xiǎo màozi yòu shì shénme ne?',
        ja: '本当に賑やかですね！焼き立ての豚肉スライスを白い食パンに挟んで、甘辛いバーベキュータレをつけて食べるの、最高に美味しいです！テーブルの上のこの緑の小さな帽子は何ですか？',
      },
      {
        speaker: 'TaiwanHost',
        speakerJa: '台湾の友人',
        zh: '那是我們剝麻豆文旦柚子的皮！剪成尖頂帽戴在頭上，保佑整年平安健康，連狗狗貓咪都會戴喔！再配一顆熱騰騰的現烤蛋黃酥，完美！',
        pinyin: 'Nà shì wǒmen bāo Mádòu wéndàn yòuzi de pí! Jiǎn chéng jiāndǐngmào dài zài tóushàng, bǎoyòu zhěngnián píng\'ān jiànkāng, lián gǒugou māomī dōu huì dài o! Zài pèi yì kē rètēngtēng de xiànkǎo dànhuángsū, wánměi!',
        ja: 'それは麻豆（マードウ）名産の文旦の皮だよ！先端を尖らせた帽子にして頭にかぶると、一年間の無病息災が祈願できるの。ワンちゃんや猫ちゃんにもかぶせるんだよ！焼きたての卵黄パイ（蛋黃酥）と一緒に食べれば完璧さ！',
      },
    ],
    midAutumnGlossary: [
      {
        termZh: '中秋烤肉 (Zhōngqiū kǎoròu)',
        pinyin: 'Zhōngqiū kǎoròu',
        meaningJa: '中秋節の炭火バーベキュー（台湾全土で一斉に行われる国民的風物詩）',
        tipJa: '1980年代の醤油メーカーのCM「一家烤肉萬家香」を機に定着し、歩道や路地裏にテーブルを並べて肉や海鮮を焼き合う。',
      },
      {
        termZh: '文旦柚子・柚子帽 (wéndàn yòuzi / yòuzimào)',
        pinyin: 'wéndàn yòuzi / yòuzimào',
        meaningJa: '麻豆文旦（ザボン・ポメロ）＆皮で作る帽子（魔除け・吉祥の伝統）',
        tipJa: '柚子（yòuzi）の発音が「佑子（子宝を守護する）」に通じるため縁起が良いとされ、皮を被って笑顔で記念撮影する。',
      },
      {
        termZh: '蛋黃酥 (dànhuángsū)',
        pinyin: 'dànhuángsū',
        meaningJa: '塩漬けアヒル卵黄と小豆餡のサクサク中華パイ（中秋の超人気ギフト）',
        tipJa: 'サクサクのパイ生地の中に、黄金色の満月を模した丸ごと一個の塩卵黄が包まれている。',
      },
    ],
  },
]

export const CHINESE_SUPPORT_EN = {
  "台灣中秋節：騎樓戶外烤肉香、剝文旦戴柚子帽與吃蛋黃酥": "Mid-Autumn Festival in Taiwan: Street-Side Barbecue, Pomelo Hats, and Yolk Pastries",
  "台湾の中秋節：路上バーベキュー文化・文旦の皮帽子とエッグ黄身パイ（蛋黃酥）": "Mid-Autumn Festival in Taiwan: Barbecue, Pomelo-Peel Hats, and Egg-Yolk Pastries",
  "台湾の民家1階の歩道（騎樓）と美しい満月の下": "Under the full moon in the covered arcade outside a Taiwanese home",
  "台湾の友人": "Taiwanese friend",
  "中秋節おめでとう！街を歩くとどこからも香ばしい焼き肉の匂いが漂ってくるでしょう？台湾では月見や月餅だけでなく、家族総出で軒先（騎樓）で炭火焼き肉をするのが一番の定番行事なんだ！": "Happy Mid-Autumn Festival! You can smell barbecue everywhere in the streets. Along with admiring the moon and eating mooncakes, families in Taiwan commonly barbecue over charcoal together in the covered arcade outside their home.",
  "日本の友人": "Japanese friend",
  "本当に賑やかですね！焼き立ての豚肉スライスを白い食パンに挟んで、甘辛いバーベキュータレをつけて食べるの、最高に美味しいです！テーブルの上のこの緑の小さな帽子は何ですか？": "It is so lively! Freshly grilled pork in white bread with sweet and savoury barbecue sauce tastes wonderful. What is this little green hat on the table?",
  "それは麻豆（マードウ）名産の文旦の皮だよ！先端を尖らせた帽子にして頭にかぶると、一年間の無病息災が祈願できるの。ワンちゃんや猫ちゃんにもかぶせるんだよ！焼きたての卵黄パイ（蛋黃酥）と一緒に食べれば完璧さ！": "It is the peel of a Madou pomelo. People shape it into a pointed hat and wear it as a playful wish for health through the year—even dogs and cats get one. Add a freshly baked egg-yolk pastry and the celebration is complete.",
  "中秋節の炭火バーベキュー（台湾全土で一斉に行われる国民的風物詩）": "The Mid-Autumn charcoal barbecue enjoyed by families across Taiwan",
  "1980年代の醤油メーカーのCM「一家烤肉萬家香」を機に定着し、歩道や路地裏にテーブルを並べて肉や海鮮を焼き合う。": "The custom became widespread after a 1980s soy-sauce advertisement; families set out tables in arcades and alleys to grill meat and seafood.",
  "麻豆文旦（ザボン・ポメロ）＆皮で作る帽子（魔除け・吉祥の伝統）": "Madou pomelo and the festive hat made from its peel",
  "柚子（yòuzi）の発音が「佑子（子宝を守護する）」に通じるため縁起が良いとされ、皮を被って笑顔で記念撮影する。": "Pomelo is considered auspicious through a wordplay associating its name with protecting children, so people wear the peel for cheerful photos.",
  "塩漬けアヒル卵黄と小豆餡のサクサク中華パイ（中秋の超人気ギフト）": "A flaky pastry filled with red-bean paste and a salted duck-egg yolk, popular as a Mid-Autumn gift",
  "サクサクのパイ生地の中に、黄金色の満月を模した丸ごと一個の塩卵黄が包まれている。": "The flaky pastry encloses a whole golden salted egg yolk representing the full moon.",
} as const
