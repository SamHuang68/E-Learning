/**
 * 台湾華語・中国語：実用シチュエーション会話資料庫 (Real-life Taiwanese Mandarin Dialogues)
 * 包含夜市點餐、手搖飲客製化、捷運交通、商務拜訪與生活對話。
 */

export interface DialogueLine {
  speaker: string
  zh: string
  pinyin: string
  bopomofo: string
  ja: string
}

export interface ConversationScene {
  id: string
  titleZh: string
  titleJa: string
  sceneCategory: '夜市美食' | '交通出行' | '購物消費' | '商務職場'
  descriptionJa: string
  dialogue: DialogueLine[]
  cultureTipJa: string
}

export const CONVERSATION_SCENES: ConversationScene[] = [
  {
    id: 'scene-boba',
    titleZh: '手搖飲料店點餐（甜度與冰塊客製化）',
    titleJa: 'ドリンクスタンドでの注文（甘さと氷のカスタム）',
    sceneCategory: '夜市美食',
    descriptionJa: '台湾のドリンクスタンドでタピオカミルクティーを自分好みの甘さ・氷でスムーズに注文する定番会話です。',
    dialogue: [
      {
        speaker: '店員',
        zh: '你好！請問今天要喝什麼？',
        pinyin: 'nǐ hǎo! qǐng wèn jīn tiān yào hē shén me?',
        bopomofo: 'ㄋㄧˇ ㄏㄠˇ! ㄑㄧㄥˇ ㄨㄣˋ ㄐㄧㄣ ㄊㄧㄢ ㄧㄠˋ ㄏㄜ ㄕㄣˊ ˙ㄇㄜ?',
        ja: 'いらっしゃいませ！本日は何をお飲みになりますか？',
      },
      {
        speaker: '客人',
        zh: '我要一杯珍珠奶茶，中杯。',
        pinyin: 'wǒ yào yì bēi zhēn zhū nǎi chá, zhōng bēi.',
        bopomofo: 'ㄨㄛˇ ㄧㄠˋ ㄧˋ ㄅㄟ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ, ㄓㄨㄥ ㄅㄟ.',
        ja: 'タピオカミルクティーを1杯、Mサイズでお願いします。',
      },
      {
        speaker: '店員',
        zh: '好的，請問甜度跟冰塊呢？',
        pinyin: 'hǎo de, qǐng wèn tián dù gēn bīng kuài ne?',
        bopomofo: 'ㄏㄠˇ ˙ㄉㄜ, ㄑㄧㄥˇ ㄨㄣˋ ㄊㄧㄢˊ ㄉㄨˋ ㄍㄣ ㄅㄧㄥ ㄎㄨㄞˋ ˙ㄋㄜ?',
        ja: 'かしこまりました。甘さと氷の量はどうなさいますか？',
      },
      {
        speaker: '客人',
        zh: '微糖、去冰，謝謝！',
        pinyin: 'wēi táng, qù bīng, xiè xie!',
        bopomofo: 'ㄨㄟ ㄊㄤˊ, ㄑㄩˋ ㄅㄧㄥ, ㄒㄧㄝˋ ˙ㄒㄧㄝ!',
        ja: '微糖（30%）、氷なし（去冰）でお願いします！',
      },
      {
        speaker: '店員',
        zh: '總共五十元，需要載具或統編嗎？',
        pinyin: 'zǒng gòng wǔ shí yuán, xū yào zài jù huò tǒng biān ma?',
        bopomofo: 'ㄗㄨㄥˇ ㄍㄨㄥˋ ㄨˇ ㄕˊ ㄩㄢˊ, ㄒㄩ ㄧㄠˋ ㄗㄞˋ ㄐㄩˋ ㄏㄨㄛˋ ㄊㄨㄥˇ ㄅㄧㄢ ˙ㄇㄚ?',
        ja: '合計50元になります。スマホ電子レシートや企業番号は必要ですか？',
      },
      {
        speaker: '客人',
        zh: '不用，印發票就好，謝謝！',
        pinyin: 'bú yòng, yìn fā piào jiù hǎo, xiè xie!',
        bopomofo: 'ㄅㄨˊ ㄩㄥˋ, ㄧㄣˋ ㄈㄚ ㄆㄧㄠˋ ㄐㄧㄡˋ ㄏㄠˇ, ㄒㄧㄝˋ ˙ㄒㄧㄝ!',
        ja: 'いりません、紙のレシートを印刷してください。ありがとう！',
      },
    ],
    cultureTipJa: '台湾のドリンク呪文：甘さは「無糖 (0%) / 微糖 (30%) / 半糖 (50%) / 少糖 (70%) / 全糖 (100%)」、氷は「去冰 (氷なし) / 微冰 (少なめ) / 少冰 / 正常冰」と指定します。',
  },
  {
    id: 'scene-night-market',
    titleZh: '士林夜市點小吃（外帶與內用）',
    titleJa: '夜市でローカルフードの注文（テイクアウト・店内飲食）',
    sceneCategory: '夜市美食',
    descriptionJa: '夜市で小籠包や鶏排（フライドチキン）を注文し、辛さや持ち帰り・店内飲食を伝える会話です。',
    dialogue: [
      {
        speaker: '老闆',
        zh: '帥哥/美女，要內用還是外帶？',
        pinyin: 'shuài gē / měi nǚ, yào nèi yòng hái shì wài dài?',
        bopomofo: 'ㄕㄨㄞˋ ㄍㄜ / ㄇㄟˇ ㄋㄩˇ, ㄧㄠˋ ㄋㄟˋ ㄩㄥˋ ㄏㄞˊ ㄕˋ ㄨㄞˋ ㄉㄞˋ?',
        ja: 'お兄さん/お姉さん、店内で召し上がるか、お持ち帰りですか？',
      },
      {
        speaker: '客人',
        zh: '我要內用，一份大雞排跟一籠小籠包。',
        pinyin: 'wǒ yào nèi yòng, yí fèn dà jī pái gēn yì lóng xiǎo lóng bāo.',
        bopomofo: 'ㄨㄛˇ ㄧㄠˋ ㄋㄟˋ ㄩㄥˋ, ㄧˊ ㄈㄣˋ ㄉㄚˋ ㄐㄧ ㄆㄞˊ ㄍㄣ ㄧˋ ㄌㄨㄥˊ ㄒㄧㄠˇ ㄌㄨㄥˊ ㄅㄠ.',
        ja: '店内で食べます。大きなフライドチキン1人前と小籠包を1セイロください。',
      },
      {
        speaker: '老闆',
        zh: '雞排要切嗎？要不要加辣？',
        pinyin: 'jī pái yào qiē ma? yào bu yào jiā là?',
        bopomofo: 'ㄐㄧ ㄆㄞˊ ㄧㄠˋ ㄑㄧㄝ ˙ㄇㄚ? ㄧㄠˋ ˙ㄅㄨ ㄧㄠˋ ㄐㄧㄚ ㄌㄚˋ?',
        ja: 'チキンは切りますか？唐辛子スパイスはかけますか？',
      },
      {
        speaker: '客人',
        zh: '要切，微辣就好，謝謝老闆！',
        pinyin: 'yào qiē, wēi là jiù hǎo, xiè xie lǎo bǎn!',
        bopomofo: 'ㄧㄠˋ ㄑㄧㄝ, ㄨㄟ ㄌㄚˋ ㄐㄧㄡˋ ㄏㄠˇ, ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄌㄠˇ ㄅㄢˇ!',
        ja: 'カットしてください、辛さは少し（ピリ辛）でお願いします。マスターありがとう！',
      },
    ],
    cultureTipJa: '台湾の屋台では「內用 nèi yòng（店内飲食）」と「外帶 wài dài（テイクアウト）」を最初に聞かれます。呼びかけの「帥哥/美女」は親しみを込めた挨拶です。',
  },
  {
    id: 'scene-mrt',
    titleZh: '搭乘台北捷運與悠遊卡加值',
    titleJa: '台北MRTの乗車と悠遊カード（EasyCard）のチャージ',
    sceneCategory: '交通出行',
    descriptionJa: '駅の窓口で悠遊カードのチャージや行き先を尋ねる実用的な会話です。',
    dialogue: [
      {
        speaker: '旅客',
        zh: '你好，請問我想去台北101，要搭哪一條線？',
        pinyin: 'nǐ hǎo, qǐng wèn wǒ xiǎng qù tái běi 101, yào dā nǎ yì tiáo xiàn?',
        bopomofo: 'ㄋㄧˇ ㄏㄠˇ, ㄑㄧㄥˇ ㄨㄣˋ ㄨㄛˇ ㄒㄧㄤˇ ㄑㄩˋ ㄊㄞˊ ㄅㄟˇ 101, ㄧㄠˋ ㄉㄚ ㄋㄚˇ ㄧˋ ㄊㄧㄠˊ ㄒㄧㄢˋ?',
        ja: 'すみません、台北101に行きたいのですが、どの路線に乗ればいいですか？',
      },
      {
        speaker: '站務員',
        zh: '請搭紅色的淡水信義線，在「台北101/世貿站」下車。',
        pinyin: 'qǐng dā hóng sè de dàn shuǐ xìn yì xiàn, zài "tái běi 101 / shì mào zhàn" xià chē.',
        bopomofo: 'ㄑㄧㄥˇ ㄉㄚ ㄏㄨㄥˊ ㄙㄜˋ ˙ㄉㄜ ㄉㄢˋ ㄕㄨㄟˇ ㄒㄧㄣˋ ㄧˋ ㄒㄧㄢˋ, ㄗㄞˋ ... ㄒㄧㄚˋ ㄔㄜ.',
        ja: '赤色の「淡水信義線」に乗って、「台北101/世貿駅」で降りてください。',
      },
      {
        speaker: '旅客',
        zh: '好的，順便幫我的悠遊卡加值五百元。',
        pinyin: 'hǎo de, shùn biàn bāng wǒ de yōu yóu kǎ jiā zhí wǔ bǎi yuán.',
        bopomofo: 'ㄏㄠˇ ˙ㄉㄜ, ㄕㄨㄣˋ ㄅㄧㄢˋ ㄅㄤ ㄨㄛˇ ˙ㄉㄜ ㄧㄡ ㄧㄡˊ ㄎㄚˇ ㄐㄧㄚ ㄓˊ ㄨˇ ㄅㄞˇ ㄩㄢˊ.',
        ja: 'わかりました。ついでにこの悠遊カードに500元チャージをお願いします。',
      },
      {
        speaker: '站務員',
        zh: '加值完成，請收好您的卡片和收據。',
        pinyin: 'jiā zhí wán chéng, qǐng shōu hǎo nín de kǎ piàn hé shōu jù.',
        bopomofo: 'ㄐㄧㄚ ㄓˊ ㄨㄢˊ ㄔㄥˊ, ㄑㄧㄥˇ ㄕㄡ ㄏㄠˇ ㄋㄧㄣˊ ˙ㄉㄜ ㄎㄚˇ ㄆㄧㄢˋ ㄏㄜˊ ㄕㄡ ㄐㄩˋ.',
        ja: 'チャージ完了しました。カードとお控えをお受け取りください。',
      },
    ],
    cultureTipJa: '台湾の地下鉄（MRT）車内・改札内は飲食厳禁（ガムや水も禁止）で、罰金対象となるのでご注意ください。',
  },
]
