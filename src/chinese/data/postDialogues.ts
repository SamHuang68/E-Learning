/**
 * 台灣華語：郵局包裹、超商取貨與物流生活資料庫 (Taiwan Post & Logistics Dialogues Database)
 * 涵蓋日本語母語者在台灣生活必備之超商（7-11 / 全家）店到店寄件取貨、報手機末三碼、郵局寄掛號與國際包裹等最接地氣日常會話。
 */

export interface PostDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Customer' | 'Clerk' | 'PostOfficeClerk'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  logisticsGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const POST_DIALOGUES: PostDialogueItem[] = [
  {
    id: 'post-convenience-pickup',
    title: '便利商店超商取貨與報手機末三碼',
    titleJa: 'コンビニでの荷物受け取りと携帯番号下3桁（超商取貨）',
    icon: '📦',
    locationZh: '7-11 / 全家便利商店櫃檯',
    locationJa: 'セブンイレブン / ファミリーマートのレジ',
    dialogueLines: [
      {
        speaker: 'Customer',
        speakerJa: '日本人客',
        zh: '你好，我要取貨。名字是林大衛，手機末三碼是 582。',
        pinyin: 'Nǐ hǎo, wǒ yào qǔhuò. Míngzi shì Lín Dàwèi, shǒujī mò sān mǎ shì wǔ-bā-èr.',
        ja: 'こんにちは、荷物の受け取りをお願いします。名前は林大衛、携帯番号の下3桁は582です。',
      },
      {
        speaker: 'Clerk',
        speakerJa: '店員',
        zh: '好的，請問有付款了嗎？如果已經付過款，需要看一下有照片的證件（居留證或護照）喔。',
        pinyin: 'Hǎo de, qǐngwèn yǒu fùkuǎn le ma? Rúguǒ yǐjīng fù guò kuǎn, xūyào kàn yíxià yǒu zhàopiàn de zhèngjiàn (jūliúzhèng huò hùzhào) ō.',
        ja: 'はい、お支払いはすでにお済みですか？支払い済み（0元受取）の場合は顔写真付き身分証（居留証またはパスポート）の提示が必要です。',
      },
      {
        speaker: 'Customer',
        speakerJa: '日本人客',
        zh: '這是貨到付款，一共是六百五十塊對嗎？我用現金付。',
        pinyin: 'Zhè shì huòdào fùkuǎn, yígòng shì liùbǎi wǔshí kuài duì ma? Wǒ yòng xiànjīn fù.',
        ja: 'これは代金引換（着払い）です。合計650元ですね？現金で支払います。',
      },
      {
        speaker: 'Clerk',
        speakerJa: '店員',
        zh: '收您一千，找您三百五十元，您的包裹在這裡，請在小白單上簽名。',
        pinyin: 'Shōu nín yìqiān, zhǎo nín sānbǎi wǔshí yuán, nín de bāoguǒ zài zhèlǐ, qǐng zài xiǎobáidān shàng qiānmíng.',
        ja: '1,000元お預かりします、350元のお返しです。お荷物はこちらです、レシート（小白單）にサインをお願いします。',
      },
    ],
    logisticsGlossary: [
      {
        termZh: '手機末三碼 (shǒujī mò sān mǎ)',
        pinyin: 'shǒujī mò sān mǎ',
        meaningJa: '携帯電話番号の下3桁',
        tipJa: '台湾のコンビニ受取で店員が荷物を検索する際、必ず聞かれる最重要フレーズ。',
      },
      {
        termZh: '貨到付款 (huòdào fùkuǎn)',
        pinyin: 'huòdào fùkuǎn',
        meaningJa: '代金引換（コンビニ着払い）',
        tipJa: '台湾のネット通販（Shopee等）で最も普及している安心な決済方法。',
      },
      {
        termZh: '店到店 (diàn dào diàn)',
        pinyin: 'diàn dào diàn',
        meaningJa: 'コンビニ店舗間配送（C2C配送）',
        tipJa: '全国のコンビニからコンビニへ約60元で荷物を送れる便利な仕組み。',
      },
    ],
  },
  {
    id: 'post-office-mail',
    title: '中華郵政臨櫃寄送航空包裹與掛號信',
    titleJa: '郵便局（中華郵政）窓口での国際小包と書留発送',
    icon: '📮',
    locationZh: '郵局郵務櫃檯',
    locationJa: '郵便局の発送窓口',
    dialogueLines: [
      {
        speaker: 'Customer',
        speakerJa: '日本人客',
        zh: '您好，我想把這個箱子寄航空包裹回日本東京，裡面是台灣名產茶葉跟鳳梨酥。',
        pinyin: 'Nín hǎo, wǒ xiǎng bǎ zhè gè xiāngzi jì hángkōng bāoguǒ huí Rìběn Dōngjīng, lǐmiàn shì Táiwān míngchǎn cháyè gēn fènglísū.',
        ja: 'こんにちは、この小包を日本の東京へ航空便で送りたいです。中身は台湾名物のお茶とパイナップルケーキです。',
      },
      {
        speaker: 'PostOfficeClerk',
        speakerJa: '郵便局員',
        zh: '好的，請先放在磅秤上秤重。請填寫這張國際包裹商業發票，並確認裡面沒有違禁品。',
        pinyin: 'Hǎo de, qǐng xiān fàng zài bàngchèng shàng chēngzhòng. Qǐng tiánxiě zhè zhāng guójì bāoguǒ shāngyè fāpiào, bìng quèrèn lǐmiàn méiyǒu wéijìnpǐn.',
        ja: 'はい、まず秤の上に載せて計量してください。税関告知書（商業インボイス）にご記入いただき、禁制品が入っていないことを確認してください。',
      },
      {
        speaker: 'Customer',
        speakerJa: '日本人客',
        zh: '填好了！請問大約幾天可以寄到？有包裹追蹤號碼可以查詢嗎？',
        pinyin: 'Tián hǎo le! Qǐngwèn dàyuē jǐ tiān kěyǐ jì dào? Yǒu bāoguǒ zhuīzōng hàomǎ kěyǐ cháxún ma?',
        ja: '記入できました！だいたい何日くらいで届きますか？追跡番号はありますか？',
      },
      {
        speaker: 'PostOfficeClerk',
        speakerJa: '郵便局員',
        zh: '航空包裹大約五到七個工作天會到，收據上的掛號郵件號碼可以上網追蹤進度。',
        pinyin: 'Hángkōng bāoguǒ dàyuē wǔ dào qī gè gōngzuòtiān huì dào, shōujù shàng de guàhào yóujiàn hàomǎ kěyǐ shàngwǎng zhuīzōng jìndù.',
        ja: '航空便なら約5〜7営業日で到着します。レシートに記載された書留番号でオンライン追跡が可能です。',
      },
    ],
    logisticsGlossary: [
      {
        termZh: '掛號 (guàhào)',
        pinyin: 'guàhào',
        meaningJa: '書留郵便（追跡付き）',
        tipJa: '台湾では重要書類は必ず「掛號信」で送ります。受取人の印鑑またはサインが必要。',
      },
      {
        termZh: '國際快捷 / EMS (guójì kuàijié)',
        pinyin: 'guójì kuàijié',
        meaningJa: '国際スピード郵便（EMS）',
        tipJa: '日本まで最短2〜3日で届く最速の国際配送サービス。',
      },
      {
        termZh: '郵遞區號 (yóudì qūhào)',
        pinyin: 'yóudì qūhào',
        meaningJa: '郵便番号（台湾は3+3桁）',
        tipJa: '台湾の郵便番号は主要3桁＋詳細3桁の「3+3制」です。',
      },
    ],
  },
]
