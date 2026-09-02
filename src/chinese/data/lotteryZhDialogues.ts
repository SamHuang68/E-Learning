/**
 * 台灣華語：台灣統一發票對獎兌領、超商消費折抵與彩券刮刮樂生活資料庫 (Taiwan Receipt Lottery Database)
 * 涵蓋日本語母語者在台灣最驚艷的生活文化：每奇數月（單月）25 日統一發票開獎、特別獎一千萬元、末三碼對中六獎兩百元、雲端發票載具自動對獎匯款、超商櫃檯直接兌換折抵購物、春節過年彩券行買刮刮樂「試試手氣」日常會話。
 */

export interface LotteryDialogueItem {
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
  lotteryGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const LOTTERY_DIALOGUES: LotteryDialogueItem[] = [
  {
    id: 'receipt-lottery-exchange',
    title: '台灣統一發票單月25日開獎：末三碼對中兩百元與超商直接折抵',
    titleJa: 'レシート宝くじ（統一發票）：奇数月25日抽選・末尾3桁200元当せん＆コンビニ引換',
    icon: '🧾',
    locationZh: '台灣連鎖便利商店收銀台',
    locationJa: '台湾のコンビニのレジ前',
    dialogueLines: [
      {
        speaker: 'TaiwanFriend',
        speakerJa: '台湾の友人',
        zh: '快把這兩個月累積的發票拿出來！每單月的二十五號是統一發票開獎日，最大獎有一千萬台幣喔！',
        pinyin: 'Kuài bǎ zhè liǎng ge yuè lěijī de fāpiào ná chūlái! Měi dānyuè de èrshíwǔ hào shì Tǒngyī Fāpiào kāijiǎngrì, zuìdàjiǎng yǒu yìqiānwàn Táibì ō!',
        ja: 'この2ヶ月で貯めたレシートを早く出して！奇数月の25日はレシート宝くじ（統一發票）の抽選日で、特賞はなんと1000万台湾元（約4700万円）だよ！',
      },
      {
        speaker: 'JapaneseTraveler',
        speakerJa: '日本人旅行者',
        zh: '我剛用手機 APP 掃描 QR code，竟然對中了末三碼！獲得了六獎兩百元！這張中獎發票要去哪裡兌換呢？',
        pinyin: 'Wǒ gāng yòng shǒujī APP sǎomiáo QR code, jìngrán duìzhòng le mò sānmǎ! Huòdé le liùjiǎng liǎngbǎi yuán! Zhè zhāng zhòngjiǎng fāpiào yào qù nǎlǐ duìhuàn ne?',
        ja: '今スマホアプリでQRコードを読み取ったら、なんと下3桁が一致しました！6等の200元が当たりました！この当せんレシートはどこで換金できますか？',
      },
      {
        speaker: 'TaiwanFriend',
        speakerJa: '台湾の友人',
        zh: '兩百元最方便了！直接在任何一家 7-11 或全家超商，背面寫上名字與居留證或護照號碼，就能當場換成現金或折抵買東西！',
        pinyin: 'Liǎngbǎi yuán zuì fāngbiàn le! Zhíjiē zài rènhé yìjiā 7-11 huò Quánjiā chāoshāng, bèimiàn xiěshàng míngzì yǔ jūliúzhèng huò hùzhào hàomǎ, jiù néng dāngchǎng huànchéng xiànjīn huò zhédǐ mǎi dōngxī!',
        ja: '200元なら一番手軽！セブンイレブンやファミリーマートにそのまま持って行き、裏面に名前とパスポート番号を書けば、その場ですぐ現金受け取りか買い物割引に使えるよ！',
      },
    ],
    lotteryGlossary: [
      {
        termZh: '統一發票 (Tǒngyī Fāpiào)',
        pinyin: 'Tǒngyī Fāpiào',
        meaningJa: 'レシート宝くじ（脱税防止のために台湾政府が1951年に開始した国民的制度）',
        tipJa: 'すべての買い物レシート上部に8桁の番号が印字されており、2ヶ月に1回抽選がある。',
      },
      {
        termZh: '末三碼 (mò sānmǎ)',
        pinyin: 'mò sānmǎ',
        meaningJa: '下3桁（頭獎3組の番号の下3桁が合致すれば六獎200元当せん）',
        tipJa: '手動で確認する際はまず下3桁だけを素早くチェックするのが台湾人の定番スタイル。',
      },
      {
        termZh: '載具 (zàijù)',
        pinyin: 'zàijù',
        meaningJa: 'スマホ電子レシートキャリア（バーコード提示でペーパーレス自動抽選＆口座振込）',
        tipJa: '「發票存載具」と言えば紙のレシートが出ず、当せん金が自動で銀行口座に振り込まれる。',
      },
    ],
  },
]
