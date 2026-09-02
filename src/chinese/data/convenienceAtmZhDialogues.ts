/**
 * 台灣華語：台灣超商生活金融智慧、ATM 跨行轉帳與無卡提款生活資料庫 (Taiwan Convenience Store & ATM Finance Database)
 * 涵蓋日本語母語者在台灣超商（7-11・全家）最常碰到的生活日常：ATM 跨行轉帳（輸入銀行代號與帳號・手續費 15 元）、手機無卡提款一次性驗證碼、包裹取件核對證件、現煮咖啡自備環保杯現折 5 元以及多功能事務機台操作。
 */

export interface ConvenienceAtmDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Customer' | 'Clerk'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  convenienceGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const CONVENIENCE_ATM_DIALOGUES: ConvenienceAtmDialogueItem[] = [
  {
    id: 'convenience-atm-service',
    title: '超商 ATM 跨行轉帳、零錢存款與自備環保杯省五元',
    titleJa: 'コンビニATMでの他行振込・カードレス引き出し＆マイボトル持参で5元割引',
    icon: '🏪',
    locationZh: '台灣連鎖超商門市內',
    locationJa: '台湾のコンビニ（超商・便利商店）店内',
    dialogueLines: [
      {
        speaker: 'Customer',
        speakerJa: '日本人客',
        zh: '不好意思，請問櫃檯可以幫我刷這張水電帳單嗎？另外我要一杯大杯熱拿鐵，我有自備環保保溫杯！',
        pinyin: 'Bù hǎoyìsi, qǐngwèn guìtái kěyǐ bāng wǒ shuā zhè zhāng shuǐdiàn zhàngdān ma? Lìngwài wǒ yào yībēi dàbēi rè nátiě, wǒ yǒu zìbèi huánbǎo bǎowēnbēi!',
        ja: 'すみません、レジでこの光熱費の請求書をバーコード決済できますか？あとホットカフェラテのラージサイズを1つ、マイボトル（保冷保温タンブラー）を持参しています！',
      },
      {
        speaker: 'Clerk',
        speakerJa: '超商門市店員',
        zh: '沒問題！水電費刷好了，發票幫您存載具嗎？咖啡自備環保杯折五元喔！如果您要跨行轉帳或無卡提款，旁邊的中國信託或台新 ATM 都有支援日語介面喔！',
        pinyin: 'Méi wèntí! Shuǐdiànfèi shuā hǎo le, fāpiào bāng nín cún zàijù ma? Kāfēi zìbèi huánbǎo bēi zhé wǔ yuán ō! Rúguǒ nín yào kuàháng zhuǎnzhàng huò wúkǎ tíkuǎn, pángbiān de Zhōngguó Xìntuō huò Táixīn ATM dōu yǒu zhīyuán Rìyǔ jièmiàn ō!',
        ja: 'かしこまりました！光熱費のお支払い完了です。レシートは電子キャリア（載具）に入れますか？マイボトル割引で5元引きです！他行振込やカードレス引き出しでしたら、横のATMに日本語画面対応もありますよ！',
      },
      {
        speaker: 'Customer',
        speakerJa: '日本人客',
        zh: '太方便了！我還要順便領包裹，手機後三碼是 852，收件人姓名是田中健一，這是我的外僑居留證核對身分。',
        pinyin: 'Tài fāngbiàn le! Wǒ hái yào shùnbiàn lǐng bāoguǒ, shǒujī hòusānmǎ shì 852, shōujiànrén xìngmíng shì Tiánzhōng Jiànyī, zhè shì wǒ de wàiqiáo jūliúzhèng h किसानों核對 shēnfèn.',
        ja: 'とても便利ですね！あと通販の荷物受け取りもお願いします。携帯番号の下3桁は852、受取人は田中健一で、身分確認用の居留証（ARC）はこちらです。',
      },
    ],
    convenienceGlossary: [
      {
        termZh: '跨行轉帳 (kuàháng zhuǎnzhàng)',
        pinyin: 'kuàháng zhuǎnzhàng',
        meaningJa: '他行振込（ATMやモバイルバンキングでの銀行間送金）',
        tipJa: '台湾では他行振込手数料が一律15元（約70円）と非常に安価で即時着金。',
      },
      {
        termZh: '自備環保杯省五元',
        pinyin: 'zìbèi huánbǎo bēi shěng wǔ yuán',
        meaningJa: 'マイボトル持参で5台湾元引き',
        tipJa: '環境保護署の政策により、超商やカフェでタンブラーを持参すると一律5元割引。',
      },
      {
        termZh: '無卡提款 (wúkǎ tíkuǎn)',
        pinyin: 'wúkǎ tíkuǎn',
        meaningJa: 'カードレスATM引き出し（スマホアプリのワンタイムパスワード）',
        tipJa: 'キャッシュカードを持ち歩かなくても、銀行アプリの一時認証コードで現金を引き出せる。',
      },
    ],
  },
]
