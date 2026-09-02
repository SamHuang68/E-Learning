/**
 * 台灣華語：台灣百元熱炒聚會、搶買單文化與夜市生活採買資料庫 (Taiwan Rechao Dining & Bargaining Database)
 * 涵蓋日本語母語者在台灣最接地氣的聚餐文化：百元熱炒店點菜（蔥爆牛肉・三杯雞・鳳梨蝦球・白飯免費自己盛）、拿金牌啤酒乾杯、結帳搶買單（「這攤我請！下次換你！」）以及夜市採買親切寒暄日常會話。
 */

export interface RechaoDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'DinerA' | 'DinerB' | 'Waiter' | 'Vendor'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  rechaoGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const RECHAO_DIALOGUES: RechaoDialogueItem[] = [
  {
    id: 'rechao-dining',
    title: '台北百元熱炒經典聚餐：金牌台啤、招牌菜與搶買單',
    titleJa: '台北の熱炒（台湾居酒屋）：台湾ビール・定番料理と熱烈なおごり合い',
    icon: '🍻',
    locationZh: '長安東路百元熱炒海產店',
    locationJa: '長安東路の熱炒ストリート（台湾式大衆海鮮居酒屋）',
    dialogueLines: [
      {
        speaker: 'DinerA',
        speakerJa: '台湾の友人',
        zh: '來熱炒店就是要熱熱鬧鬧！我們先點蔥爆牛肉、三杯雞、鳳梨蝦球跟炒水蓮！冰箱有冰透的金牌台灣啤酒，自己拿喔！',
        pinyin: 'Lái rèchǎodiàn jiù shì yào rèrènàonào! Wǒmen xiān diǎn cōngbào niúròu, sānbēijī, fènglí xiāqiú gēn chǎo shuǐlián! Bīngxiāng yǒu bīngtòu de jīnpái Táiwān píjiǔ, zìjǐ ná ō!',
        ja: '熱炒に来たらワイワイ賑やかにやらなきゃね！まずネギ牛肉炒め、三杯鶏、パイナップルエビマヨ、台湾水蓮菜炒めを頼もう！冷蔵庫にキンキンに冷えた金牌台湾ビールがあるからセルフで取ってきて！',
      },
      {
        speaker: 'DinerB',
        speakerJa: '日本人同僚',
        zh: '好豐盛！聽說熱炒店的白飯都是免費無限續碗的對不對？我來幫大家裝白飯！乾杯！',
        pinyin: 'Hǎo fēngshèng! Tīngshuō rèchǎodiàn de báifàn dōu shì miǎnfèi wúxiàn xùwǎn de duì bú duì? Wǒ lái bāng dàjiā zhuāng báifàn! Gānbēi!',
        ja: '豪華ですね！熱炒は白ご飯がおかわり無料（食べ放題）って本当ですか？僕が皆の分をよそってきますね！乾杯（カンパイ）！',
      },
      {
        speaker: 'DinerA',
        speakerJa: '台湾の友人',
        zh: '（結帳時拿出錢包）這頓我請！你們大老遠來台灣出差，絕對不能讓你們付錢！下次去東京再換你們請我！',
        pinyin: '(Jiézhàng shí ná chū qiánbāo) Zhè dùn wǒ qǐng! Nǐmen dàlǎoyuǎn lái Táiwān chūchāi, juéduì bù néng ràng nǐmen fùqián! Xià cì qù Dōngjīng zài huàn nǐmen qǐng wǒ!',
        ja: '（お会計で財布を奪い合う）ここは僕のおごり！はるばる台湾に出張に来てくれたんだから、払わせるわけにはいかないよ！今度東京に行った時にごちそうして！',
      },
    ],
    rechaoGlossary: [
      {
        termZh: '熱炒 (rèchǎo)',
        pinyin: 'rèchǎo',
        meaningJa: '台湾風の大衆海鮮居酒屋・一品料理店',
        tipJa: '強火の中華鍋で一気に炒めるスピード料理が特徴。小皿で多品目を楽しめる。',
      },
      {
        termZh: '我請客！ (wǒ qǐngkè)',
        pinyin: 'wǒ qǐngkè',
        meaningJa: '僕のおごり！ここは出させて！',
        tipJa: '台湾ではレジ前で伝票を取り合っておごり合うのが人情味あふれる伝統マナー。',
      },
      {
        termZh: '水蓮 (shuǐlián)',
        pinyin: 'shuǐlián',
        meaningJa: 'タイワンウスバサイシン（台湾南部の美濃特産シャキシャキ野菜）',
        tipJa: 'ニンニクや破布子（タイワンイヌツゲ）と一緒に強火で炒めると絶品。',
      },
    ],
  },
]
