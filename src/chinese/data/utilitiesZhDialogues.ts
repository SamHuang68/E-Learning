/**
 * 台灣華語：台灣水電費帳單、台電計費與搬家生活資料庫 (Taiwan Utilities & Relocation Dialogues Database)
 * 涵蓋日本語母語者在台灣生活必備之水電瓦斯繳費、台電夏季電價一度電多少錢、獨立電表抄表、大樓管理費與搬家打包等接地氣會話。
 */

export interface UtilitiesDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Tenant' | 'Landlord' | 'Mover'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  utilitiesGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const UTILITIES_DIALOGUES: UtilitiesDialogueItem[] = [
  {
    id: 'util-electricity-bill',
    title: '套房水電費結算與台電一度電計費',
    titleJa: 'ワンルームの光熱費精算と台湾電力の電気代（1kWhあたり単価）',
    icon: '⚡',
    locationZh: '租屋處門口電表旁',
    locationJa: 'アパートの各部屋の電気メーター前',
    dialogueLines: [
      {
        speaker: 'Landlord',
        speakerJa: '大家さん（房東）',
        zh: '大衛你好，這個月房租兩萬，加上獨立電表上個月是 150 度，一度電算五塊錢，總共是兩萬零七百五十元。',
        pinyin: 'Dàwèi nǐ hǎo, zhè gè yuè fángzū liǎngwàn, jiāshàng dúlì diàobiǎo shàng gè yuè shì yībǎi wǔshí dù, yí dù diàn suàn wǔ kuài qián, zǒnggòng shì liǎngwàn líng qībǎi wǔshí yuán.',
        ja: '大衛さんこんにちは。今月の家賃は2万元、個別の電気メーターで先月は150kWh、1kWhあたり5元計算で、合計2万750元になります。',
      },
      {
        speaker: 'Tenant',
        speakerJa: '入居者（日本人）',
        zh: '好的房東！請問水費跟網路費、大樓管理費是包含在房租裡面對不對？',
        pinyin: 'Hǎo de fángdōng! Qǐngwèn shuǐfèi gēn wǎnglùfèi, dàlóu guǎnlǐfèi shì bāohán zài fángzū lǐmiàn duì bú duì?',
        ja: '分かりました大家さん！水道代、インターネット代、マンション管理費は家賃に含まれているので合っていますよね？',
      },
      {
        speaker: 'Landlord',
        speakerJa: '大家さん',
        zh: '對的，水費跟高速網路、管理費都全包，只有冷氣跟房間用電看個人獨立電表實報實銷。',
        pinyin: 'Duì de, shuǐfèi gēn gāosù wǎnglù, guǎnlǐfèi dōu quán bāo, zhǐyǒu lěngqì gēn fángjiān yòngdiàn kàn gèrén dúlì diàobiǎo shí bào shí xiāo.',
        ja: 'その通りです。水道代・高速ネット・管理費は込みで、エアコンとお部屋の電気代だけ個別のメーターで実費精算です。',
      },
    ],
    utilitiesGlossary: [
      {
        termZh: '一度電 (yí dù diàn)',
        pinyin: 'yí dù diàn',
        meaningJa: '電気1キロワット時（1 kWh）',
        tipJa: '台湾の賃貸物件では「一度電 5元」などの固定単価制が一般的です（台電公式の夏期電気代上限規制あり）。',
      },
      {
        termZh: '獨立電表 (dúlì diàobiǎo)',
        pinyin: 'dúlì diàobiǎo',
        meaningJa: '部屋ごとの個別電気メーター',
        tipJa: '部屋の外壁やドア横に設置され、入居者自身で毎月の数値を読み取れます。',
      },
      {
        termZh: '管理費 (guǎnlǐfèi)',
        pinyin: 'guǎnlǐfèi',
        meaningJa: 'マンションの共益費・管理費',
        tipJa: 'エレベーター保守、ゴミ収集、コンシェルジュ（管理員）の受取代行サービス等の費用。',
      },
    ],
  },
  {
    id: 'util-moving-truck',
    title: '台灣專業搬家公司估價與紙箱包材準備',
    titleJa: '台湾の引越し業者（搬家公司）の見積もりとダンボール資材準備',
    icon: '🚚',
    locationZh: '客廳與搬家打包現場',
    locationJa: 'リビングの梱包現場',
    dialogueLines: [
      {
        speaker: 'Mover',
        speakerJa: '引越し業者',
        zh: '陳先生您好，我們是康福搬家。今天預計出一台三點五噸的貨車，有包含大型家電防撞包膜保護。',
        pinyin: 'Chén xiānsheng nín hǎo, wǒmen shì Kāngfú bānjiā. Jīntiān yùjì chū yì tái sāndiǎnwǔ dūn de huòchē, yǒu bāohán dàxíng jiādiàn fángzhuàng bāomó bǎohù.',
        ja: '陳様こんにちは、引越し業者です。本日は3.5トントラック1台でお伺いし、大型家電の緩衝フィルム保護も含んでおります。',
      },
      {
        speaker: 'Tenant',
        speakerJa: '入居者',
        zh: '辛苦了！易碎品的紙箱我都已經貼上紅色標籤，舊公寓五樓沒有電梯需要加收樓層費嗎？',
        pinyin: 'Xīnkǔ le! Yìsuìpǐn de zhǐxiāng wǒ dōu yǐjīng tiē shàng hóngsè biāoqiān, jiù gōngyù wǔlóu méiyǒu diàntī xūyào jiāshōu lóucéngfèi ma?',
        ja: 'お疲れ様です！割れ物のダンボールには赤い目印を貼ってあります。古いアパートの5階でエレベーターなしですが階段料金はかかりますか？',
      },
      {
        speaker: 'Mover',
        speakerJa: '引越し業者',
        zh: '先前報價已經包含無電梯爬梯費了，師傅動作很熟練，大約兩個小時就可以全部搬運完畢！',
        pinyin: 'Xiānqián bàojià yǐjīng bāohán wú diàntī pátīfèi le, shīfu dòngzuò hěn shúliàn, dàyuē liǎng gè xiǎoshí jiù kěyǐ quánbù bānyùn wánbì!',
        ja: '事前のお見積もりに階段作業代も含まれておりますのでご安心ください。手慣れたスタッフが約2時間で全て運び終えます！',
      },
    ],
    utilitiesGlossary: [
      {
        termZh: '易碎品 (yìsuìpǐn)',
        pinyin: 'yìsuìpǐn',
        meaningJa: 'ワレモノ（ガラス・陶器等）',
        tipJa: '荷造りダンボール（紙箱）に「易碎品・小心輕放」と書くのが台湾のルール。',
      },
      {
        termZh: '樓層費 (lóucéngfèi)',
        pinyin: 'lóucéngfèi',
        meaningJa: '階段作業料金（エレベーターなしの追加費）',
        tipJa: '台湾の古いアパート（公寓）はエレベーターがない場合が多く、1階上がるごとに約200〜300元加算。',
      },
      {
        termZh: '師傅 (shīfu)',
        pinyin: 'shīfu',
        meaningJa: '職人・プロの作業員（親しみを込めた敬称）',
        tipJa: '運転手、大工、引越し作業員、整備士など専門技術を持つ人を台湾では「師傅」と呼びます。',
      },
    ],
  },
]
