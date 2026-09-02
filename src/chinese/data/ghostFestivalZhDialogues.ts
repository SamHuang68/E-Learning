/**
 * 台灣華語：台灣農曆七月中元普渡拜拜、好兄弟供品禁忌、放水燈與搶孤民俗生活資料庫 (Taiwanese Zhongyuan Ghost Festival Database)
 * 涵蓋日本語母語者在台灣最震撼的民間信仰：農曆七月鬼門開、家戶公司門口普渡拜拜招待「好兄弟」、供品水果禁忌（避開香蕉李子梨子「招你來」與旺旺）、放水燈（基隆望海巷子夜照亮水路引導孤魂）、頭城與恆春「搶孤」塗牛油登頂奪錦旗等日常對話與民俗詞彙。
 */

export interface GhostFestivalDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'TaiwanHost' | 'JapaneseNeighbor'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  ghostFestivalGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const GHOST_FESTIVAL_DIALOGUES: GhostFestivalDialogueItem[] = [
  {
    id: 'ghost-festival-pudu',
    title: '台灣農曆七月中元普渡：敬拜好兄弟、供品水果禁忌與慈悲放水燈',
    titleJa: '台湾の旧暦7月中元普渡（鬼節）：好兄弟へのもてなし・果物のタブーと灯籠流し',
    icon: '🏮',
    locationZh: '台灣公司大樓大門前普渡供桌旁',
    locationJa: '台湾のオフィスビル玄関前の普渡（供養）テーブル横',
    dialogueLines: [
      {
        speaker: 'TaiwanHost',
        speakerJa: '台湾の同僚',
        zh: '今天是農曆七月十五中元普渡！我們在大樓門口擺桌拜拜，恭敬稱呼孤魂野鬼為「好兄弟」，準備整箱飲料、泡麵和白米招待他們！',
        pinyin: 'Jīntiān shì Nónglì qīyuè shíwǔ Zhōngyuán Pǔdù! Wǒmen zài dàlóu ménkǒu bǎizhuō bàibài, gōngjìng chēnghu gūhún yěguǐ wéi "hǎoxiōngdì", zhǔnbèi zhěngxiāng yǐnliào, pàomiàn hàn báimǐ zhāodài tāmen!',
        ja: '今日は旧暦7月15日の中元普渡だよ！ビルの玄関前に供養台を並べて、無縁仏たちを敬意を込めて「好兄弟（義兄弟）」と呼び、箱買いした飲み物やカップ麺、お米でおもてなしするんだ！',
      },
      {
        speaker: 'JapaneseNeighbor',
        speakerJa: '日本人駐在員',
        zh: '桌上的水果看起來很豐富，但為什麼沒有看到香蕉、李子和梨子呢？',
        pinyin: 'Zhuō shàng de shuǐguǒ kàn qǐlái hěn fēngfù, dàn wèishénme méiyǒu kàndào xiāngjiāo, lǐzi hàn lízi ne?',
        ja: 'テーブルの果物はとても豪華ですが、どうしてバナナ（香蕉）、すもも（李子）、梨（梨子）が見当たらないのですか？',
      },
      {
        speaker: 'TaiwanHost',
        speakerJa: '台湾の同僚',
        zh: '問得好！因為台語諧音「蕉李梨」聽起來像「招你來」，拜好兄弟千萬不能用，否則會把鬼魂招進家裡！我們通常拜蘋果代表「平平安安」！',
        pinyin: 'Wèn de hǎo! Yīnwèi Táiyǔ xiéyīn "jiāo-lǐ-lí" tīng qǐlái xiàng "zhāo nǐ lái", bài hǎoxiōngdì qiānwàn bùnéng yòng, fǒuzé huì bǎ guǐhún zhāo jìn jiālǐ! Wǒmen tōngcháng bài píngguǒ dàibiǎo "píngpíng ān\'ān"!',
        ja: 'いい質問だね！台湾語で「バナナ・すもも・梨」の語呂合わせが「あなたを招き寄せる（招你來）」に聞こえるから、好兄弟の供養には絶対タブーなんだ！普段は「無病息災（平平安安）」を願ってリンゴ（蘋果）を供えるよ！',
      },
    ],
    ghostFestivalGlossary: [
      {
        termZh: '好兄弟 (hǎoxiōngdì)',
        pinyin: 'hǎoxiōngdì',
        meaningJa: '無縁仏・孤魂への親愛と畏敬の呼び名（「鬼」と直接呼ぶのを避ける台湾の礼儀）',
        tipJa: '旧暦7月（鬼月）にあの世から戻ってくる霊魂を恐怖の対象ではなく、温かくもてなすべき客として扱う。',
      },
      {
        termZh: '中元普渡 (Zhōngyuán Pǔdù)',
        pinyin: 'Zhōngyuán Pǔdù',
        meaningJa: '中元節の大規模な施餓鬼・供養祭（企業や商店街が総出で膨大な供物を捧げる）',
        tipJa: '供物一つ一つに線香を挿し、「各姓好兄弟」への敬意と平穏を祈願する。',
      },
      {
        termZh: '搶孤・放水燈 (qiǎnggū / fàngshuǐdēng)',
        pinyin: 'qiǎnggū / fàngshuǐdēng',
        meaningJa: '牛脂が塗られた高柱に登る伝統競技（搶孤）＆水難者を導く灯籠流し（放水燈）',
        tipJa: '頭城や恒春の搶孤は勇壮な伝統行事であり、基隆の放水燈は海の精霊を陸の宴へと案内する慈悲の儀式。',
      },
    ],
  },
]
