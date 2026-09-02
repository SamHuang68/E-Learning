/**
 * 台灣華語：台灣手搖飲料店極致客製化、甜度冰塊加料與環保杯折扣資料庫 (Taiwan Boba Milk Tea Customization Database)
 * 涵蓋日本語母語者在台灣最愛的手搖茶飲文化：甜度階梯（無糖・微糖3分・半糖5分・少糖7分・全糖）、冰塊階梯（去冰・微冰・少冰・正常冰・常溫・溫熱）、珍珠配料（大波霸・小粉圓・椰果・仙草凍・布丁）、自備大口徑環保杯現折 5 元、封膜機封口與吸管插杯技巧日常會話。
 */

export interface BobaDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Customer' | 'BobaBarista'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  bobaGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const BOBA_DIALOGUES: BobaDialogueItem[] = [
  {
    id: 'boba-custom-order',
    title: '台灣手搖茶客製點單：微糖微冰加波霸、自備大口徑環保杯折五元',
    titleJa: '台湾ドリンクスタンドの神カスタム：微糖微氷・大粒タピオカ＆マイボトル5元引',
    icon: '🧋',
    locationZh: '連鎖手搖飲料店櫃檯',
    locationJa: '台湾のドリンクスタンド（手搖茶飲店）の注文レジ',
    dialogueLines: [
      {
        speaker: 'BobaBarista',
        speakerJa: '店員',
        zh: '你好！歡迎光臨，今天想喝點什麼茶飲呢？甜度跟冰塊都可以客製化調整喔！',
        pinyin: 'Nǐ hǎo! Huānyíng guānglín, jīntiān xiǎng hē diǎn shénme cháyǐn ne? Tiándù gēn bīngkuài dōu kěyǐ kèzhìhuà tiáozhěng ō!',
        ja: 'いらっしゃいませ！本日は何にされますか？甘さと氷の量は細かくカスタマイズできますよ！',
      },
      {
        speaker: 'Customer',
        speakerJa: '日本人客',
        zh: '我要一杯大杯四季春青茶，加波霸！甜度要微糖（三分糖），冰塊要微冰！我有自備大口徑保溫環保杯！',
        pinyin: 'Wǒ yào yībēi dàbēi sìjìchūn qīngchá, jiā bōbà! Tiándù yào wēitáng (sānfēntáng), bīngkuài yào wēibīng! Wǒ yǒu zìbèi dàkǒujìng bǎowēn huánbǎobēi!',
        ja: '四季春烏龍茶のLサイズを1杯、大粒タピオカ（波霸）トッピングで！甘さは微糖（3分糖）、氷は微氷でお願いします！タピオカ用の太いストローが入るマイボトルを持参しています！',
      },
      {
        speaker: 'BobaBarista',
        speakerJa: '店員',
        zh: '好的！微糖微冰加波霸！自備環保杯幫您現折五元！發票需要印紙本還是存手機載具？',
        pinyin: 'Hǎo de! Wēitáng wēibīng jiā bōbà! Zìbèi huánbǎobēi bāng nín xiàn zhé wǔ yuán! Fāpiào xūyào yìn zhǐběn háishì cún shǒujī zàijù?',
        ja: 'かしこまりました！微糖・微氷に大粒タピオカですね！マイボトル持参で5元引きいたします！レシートは紙で印刷しますか、スマホの電子キャリア（載具）に入れますか？',
      },
    ],
    bobaGlossary: [
      {
        termZh: '微糖微冰 (wēitáng wēibīng)',
        pinyin: 'wēitáng wēibīng',
        meaningJa: '甘さ3分・氷少なめ（台湾人が一番よく頼む黄金比率）',
        tipJa: '台湾のお茶はシロップなしでも香り高いので、3分糖（微糖）や無糖が大人に大人気。',
      },
      {
        termZh: '波霸 vs 粉圓',
        pinyin: 'bōbà vs fěnyuán',
        meaningJa: '大粒タピオカ（波霸）vs 小粒タピオカ（粉圓）',
        tipJa: 'モチモチの噛みごたえを楽しみたいなら「波霸（ボバ）」を指定するのが通の頼み方。',
      },
      {
        termZh: '封膜機 (fēngmójī)',
        pinyin: 'fēngmójī',
        meaningJa: 'カップ自動シーラー（ビニールフィルム密閉包装機）',
        tipJa: '台湾発明の密閉技術。ストローの尖った先端を斜め45度にして勢いよく一発で刺すのがコツ。',
      },
    ],
  },
]
