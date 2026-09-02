/**
 * 台灣華語：台灣夜市美食、手搖飲料與點餐文化資料庫 (Taiwan Night Market & Boba Tea Culture Database)
 * 涵蓋日本語母語者在台灣夜市點餐（雞排要不要切、要不要辣）、手搖飲料店客製化（甜度：全糖/半糖/微糖/無糖、冰塊：正常/少冰/微冰/去冰）等最道地的台灣飲食文化會話。
 */

export interface FoodDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Customer' | 'Vendor' | 'BobaStaff'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  foodGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const FOOD_DIALOGUES: FoodDialogueItem[] = [
  {
    id: 'food-boba-tea',
    title: '台灣連鎖手搖飲店點選珍珠奶茶（甜度與冰塊客製化）',
    titleJa: '台湾タピオカミルクティー（甘さ・氷のカスタマイズ注文）',
    icon: '🧋',
    locationZh: '手搖飲料店櫃檯',
    locationJa: 'ドリンクスタンド（手搖杯）のレジ',
    dialogueLines: [
      {
        speaker: 'BobaStaff',
        speakerJa: '店員',
        zh: '您好！今天想喝點什麼？需要載具或統編嗎？',
        pinyin: 'Nín hǎo! Jīntiān xiǎng hē diǎn shénme? Xūyào zàijù huò tǒngbiān ma?',
        ja: 'いらっしゃいませ！本日のお飲み物は何にされますか？スマホ電子レシート（載具）や会社番号は必要ですか？',
      },
      {
        speaker: 'Customer',
        speakerJa: '日本人客',
        zh: '我要一杯大杯波霸奶茶，甜度微糖（三分糖），冰塊微冰，謝謝！',
        pinyin: 'Wǒ yào yì bēi dàbēi bōbà nǎichá, tiándù wēitáng (sānfēntáng), bīngkuài wēibīng, xièxie!',
        ja: 'タピオカミルクティーのLサイズを1杯、甘さは微糖（30%）、氷少なめ（微冰）でお願いします！',
      },
      {
        speaker: 'BobaStaff',
        speakerJa: '店員',
        zh: '好的，大杯波霸奶茶微糖微冰。需要購買一元的環保提袋嗎？還是用自己的環保杯可以折五元喔！',
        pinyin: 'Hǎo de, dàbēi bōbà nǎichá wēitáng wēibīng. Xūyào gòumǎi yìyuán de huánbǎo tídài ma? Háishì yòng zìjǐ de huánbǎobēi kěyǐ zhé wǔyuán ō!',
        ja: 'かしこまりました。微糖・微冰ですね。1元のレジ袋はご利用ですか？ご持参のマイボトルなら5元引きになりますよ！',
      },
    ],
    foodGlossary: [
      {
        termZh: '微糖微冰 (wēitáng wēibīng)',
        pinyin: 'wēitáng wēibīng',
        meaningJa: '甘さ控えめ（30%）・氷少なめ',
        tipJa: '台湾の若者が最も注文する黄金比率。台湾の標準（全糖）は日本人にはかなり甘め。',
      },
      {
        termZh: '波霸 vs 珍珠 (bōbà vs zhēnzhū)',
        pinyin: 'bōbà vs zhēnzhū',
        meaningJa: '大粒タピオカ vs 小粒タピオカ',
        tipJa: '台湾の多くの店（50嵐等）では粒の大きさで呼び分けられます。',
      },
      {
        termZh: '自備環保杯折五元 (zìbèi huánbǎobēi zhé wǔyuán)',
        pinyin: 'zìbèi huánbǎobēi zhé wǔyuán',
        meaningJa: 'マイボトル持参で5元割引',
        tipJa: '台湾全土の環境保護政策により、ドリンク店で水筒を持参すると一律5TWD割引。',
      },
    ],
  },
  {
    id: 'food-chicken-cutlet',
    title: '夜市炸雞排攤經典二連問：要不要切？要不要辣？',
    titleJa: '夜市ジーパイ（炸雞排）定番の2大質問：切る？辛くする？',
    icon: '🍗',
    locationZh: '士林夜市超大雞排攤位',
    locationJa: '夜市の巨大フライドチキン屋台',
    dialogueLines: [
      {
        speaker: 'Vendor',
        speakerJa: '屋台のおじさん（老闆）',
        zh: '帥哥美女要幾份雞排？現炸要等三分鐘喔！要不要切？要不要辣？',
        pinyin: 'Shuàigē měinǚ yào jǐ fèn jīpái? Xiàn zhà yào děng sān fēnzhōng ō! Yào bú yào qiē? Yào bú yào là?',
        ja: 'いらっしゃい、チキンは何枚？揚げたてだから3分待ってね！切るかい？辛くするかい？',
      },
      {
        speaker: 'Customer',
        speakerJa: '日本人客',
        zh: '老闆我要一份！不要切，幫我加一點點小辣，還要多一點胡椒粉，謝謝！',
        pinyin: 'Lǎobǎn wǒ yào yí fèn! Bú yào qiē, bāng wǒ jiā yìdiǎndiǎn xiǎolà, hái yào duō yìdiǎn hújiāofěn, xièxie!',
        ja: '1枚ください！切らないでそのままで、ピリ辛（小辣）にしてコショウ（胡椒粉）多めでお願いします！',
      },
      {
        speaker: 'Vendor',
        speakerJa: '屋台のおじさん',
        zh: '好咧！雞排不切肉汁才會鎖住最好吃！總共九十塊，小心燙口喔！',
        pinyin: 'Hǎo lie! Jīpái bù qiē ròuzhī cái huì suǒzhù zuì hǎochī! Zǒnggòng jiǔshí kuài, xiǎoxīn tàng kǒu ō!',
        ja: 'あいよ！チキンは切らない方が肉汁が閉じ込められて一番ジューシーでうまいよ！合計90元、熱いから気をつけて！',
      },
    ],
    foodGlossary: [
      {
        termZh: '不要切 (bú yào qiē)',
        pinyin: 'bú yào qiē',
        meaningJa: '切らずにそのまま（まるごと）',
        tipJa: '台湾のローカル通は肉汁（肉汁）が逃げないよう「不切」でかぶりつくのが定番。',
      },
      {
        termZh: '胡椒鹽 / 梅子粉 (hújiāoyán / méizifěn)',
        pinyin: 'hújiāoyán / méizifěn',
        meaningJa: 'コショウ塩 / 梅パウダー（甘酸っぱい粉）',
        tipJa: 'フライドポテトやサツマイモボール（地瓜球）にかける台湾特有の調味料。',
      },
      {
        termZh: '外帶 vs 內用 (wàidài vs nèiyòng)',
        pinyin: 'wàidài vs nèiyòng',
        meaningJa: 'テイクアウト（持ち帰り） vs イートイン（店内で食べる）',
        tipJa: '夜市や食堂で座る前に必ず尋ねられる頻出単語。',
      },
    ],
  },
]
