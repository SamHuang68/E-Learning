/**
 * 台灣華語：台灣清明節掃墓祭祖、壓墓紙、包潤餅（春捲）與花生糖粉民俗生活資料庫 (Taiwanese Tomb Sweeping & Popiah Database)
 * 涵蓋日本語母語者在台灣最感受慎終追遠與美食創意的春季傳統：農曆二十四節氣「清明節」、上山掃墓培墓與「壓墓紙（掛紙）」、台灣獨特寒食習俗「全家手作包潤餅（ポピア／生春巻き）」、餅皮鋪花生粉糖粉吸水防破、高麗菜豆干紅糟肉香菜南部油麵捲起大口品嚐日常對話。
 */

export interface QingmingPopiahDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'TaiwanFamilyElder' | 'JapaneseGuest'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  qingmingGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const QINGMING_POPIAH_DIALOGUES: QingmingPopiahDialogueItem[] = [
  {
    id: 'qingming-tomb-sweeping-popiah',
    title: '台灣清明節：掃墓壓墓紙慎終追遠、手作包潤餅撒花生糖粉',
    titleJa: '台湾の清明節：お墓参り（掃墓）・墓紙（掛紙）と手作り生春巻き（潤餅・ポピア）文化',
    icon: '🌱',
    locationZh: '清明祭祖後全家齊聚客廳長桌包潤餅',
    locationJa: '清明節の墓参り後、家族全員で生春巻き（潤餅）を包む食卓',
    dialogueLines: [
      {
        speaker: 'TaiwanFamilyElder',
        speakerJa: '台湾のご家族（長老）',
        zh: '早上去公墓掃墓培墓，用石頭把黃紅綠彩色的「墓紙」壓在墳上，代表子孫前來探望修繕。回到家最重要的就是大家一起動手包「潤餅」！',
        pinyin: 'Zǎoshang qù gōngmù sǎomù péimù, yòng shítou bǎ huáng hóng lǜ cǎisè de "mùzhǐ" yā zài fénshàng, dàibiǎo zǐsūn qiánlái tànwàng xiūshàn. Huídào jiā zuì zhòngyào de jiù shì dàjiā yìqǐ dòngshǒu bāo "rùnbǐng"!',
        ja: '午前中にお墓参り（掃墓）をして、カラフルな墓紙（掛紙）を小石で墓石に押さえてきました。子孫が手入れした証です。そして帰宅後の一大イベントが家族で「潤餅（ポピア）」を包むことなんだ！',
      },
      {
        speaker: 'JapaneseGuest',
        speakerJa: '日本からの来客',
        zh: '桌上擺了十幾種配料好豐盛！包潤餅有特定的順序和技巧嗎？',
        pinyin: 'Zhuō shàng bǎi le shíjǐ zhǒng pèiliào hǎo fēngshèng! Bāo rùnbǐng yǒu tèdìng de shùnxù hàn jìqiǎo ma?',
        ja: 'テーブルに10種類以上の具材が並んですごいご馳走ですね！潤餅を包む特別な順番やコツはあるのですか？',
      },
      {
        speaker: 'TaiwanFamilyElder',
        speakerJa: '台湾のご家族（長老）',
        zh: '鋪上兩張微薄Q彈的潤餅皮，底層一定要先撒滿厚厚一層「花生糖粉」，這樣不但香甜，還能吸收高麗菜炒料的湯汁防止餅皮濕破！再放紅燒肉、蛋酥、豆干，南部還會加炒油麵，捲緊大口咬下超滿足！',
        pinyin: 'Pūshàng liǎng zhāng wēibáo Q-tán de rùnbǐngpí, dǐcéng yídìng yào xiān sǎmǎn hòuhòu yì céng "huāshēng tángfěn", zhèyàng búdàn xiāngtián, hái néng xīshōu gāolìcài chǎoliào de tāngzhī fángzhǐ bǐngpí shīpò! Zài fàng hóngshāoròu, dànsū, dòugān, nánbù hái huì jiā chǎo yóumiàn, juǎn jǐn dàkǒu yǎoxià chāo mǎnzú!',
        ja: 'もちもちの薄い皮を2枚重ねて敷き、底にたっぷり「ピーナッツ砂糖粉」を振るのが最大の秘訣！甘く香ばしいだけでなく、炒めキャベツの水分を吸って皮が破れるのを防ぐんだ。紅麹豚肉、錦糸卵、押し豆腐、南部なら焼きそば（油麵）も入れてギュッと巻いて食べるのさ！',
      },
    ],
    qingmingGlossary: [
      {
        termZh: '壓墓紙 (yā mùzhǐ / 掛紙)',
        pinyin: 'yā mùzhǐ / guàzhǐ',
        meaningJa: 'お墓に五色紙を小石で留める清明節の儀礼（子孫繁栄と墓守の印）',
        tipJa: '風で飛ばないよう黄・赤・白などの墓紙（掛紙）を墓の上に点々と小石で重石留めする。',
      },
      {
        termZh: '潤餅 (rùnbǐng / 春捲)',
        pinyin: 'rùnbǐng',
        meaningJa: '台湾風手巻き生春巻き（清明・寒食節の伝統料理・豊富な炒め具材を巻く）',
        tipJa: '南部ではピーナッツ砂糖粉が多めで炒めた油麺が入るなど、地域ごとの個性が際立つ。',
      },
      {
        termZh: '花生糖粉 (huāshēng tángfěn)',
        pinyin: 'huāshēng tángfěn',
        meaningJa: 'すりおろしピーナッツと粉砂糖のミックス（潤餅の破れ防止と風味の要）',
        tipJa: '皮の上に真っ先に敷き詰めることで、野菜から染み出る水分をブロックする生活の知恵。',
      },
    ],
  },
]
