/**
 * 台灣華語：台灣寵物友善、動物醫院與毛小孩領養生活資料庫 (Taiwan Pet Friendly & Veterinary Database)
 * 涵蓋日本語母語者在台灣養毛小孩最常接觸的情境：動物醫院初診打晶片（寵物登記與狂犬病疫苗金屬頸牌）、年度血液健檢與結紮手術、寵物友善餐廳（牽繩與推車禮儀）、台灣「支持認養不棄養」收容所領養日常對話。
 */

export interface PetDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'PetOwner' | 'Vet' | 'CafeStaff'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  petGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const PET_DIALOGUES: PetDialogueItem[] = [
  {
    id: 'pet-vet-clinic',
    title: '台北動物醫院毛小孩初診：植入晶片、狂犬病疫苗與健檢',
    titleJa: '動物病院での初診：マイクロチップ装着・狂犬病ワクチン接種と健康診断',
    icon: '🐶',
    locationZh: '台灣連鎖動物醫院診間',
    locationJa: '台北の動物病院（獸醫診所）の診察室',
    dialogueLines: [
      {
        speaker: 'PetOwner',
        speakerJa: '日本人飼い主',
        zh: '醫師您好！我們家柴犬剛剛滿六個月，今天想來做寵物登記、植入晶片，並施打狂犬病疫苗與核心八合一預防針。',
        pinyin: 'Yīshī nín hǎo! Wǒmen jiā cháiqiǎn gānggāng mǎn liù gè yuè, jīntiān xiǎng lái zuò chǒngwù dēngjì, zhírù jīngpiàn, bìng shīdǎ kuángquǎnbìng yìmiáo yǔ héxīn bāhéyī yùfángzhēn.',
        ja: '先生こんにちは！うちの柴犬がちょうど生後6ヶ月になったので、ペット登録・マイクロチップ装着・狂犬病予防接種・混合ワクチンをお願いしたいです。',
      },
      {
        speaker: 'Vet',
        speakerJa: '獣医師（獸醫）',
        zh: '太棒了！先幫毛小孩量體重、聽心音並量肛溫。今天打完狂犬病疫苗後，會發放當年度的防狂犬病金屬頸牌，外出散步時記得繫在項圈上喔！',
        pinyin: 'Tài bàng le! Xiān bāng máoxiǎohái liáng tǐzhòng, tīng xīnyīn bìng liáng gāngwēn. Jīntiān dǎ wán kuángquǎnbìng yìmiáo hòu, huì fāfàng dāngniándù de fáng kuángquǎnbìng jīnshǔ jǐngpái, wàichū sànbù shí jìde xì zài xiàngquān shàng ō!',
        ja: '素晴らしいですね！まず体重測定、聴診、検温（直腸温）をしますね。狂犬病ワクチン接種後、今年度の金属製注射済票プレートをお渡ししますので、お散歩時は首輪につけてくださいね！',
      },
      {
        speaker: 'PetOwner',
        speakerJa: '飼い主',
        zh: '了解！另外想請教醫師，在台灣帶狗狗去寵物友善咖啡廳或搭捷運，有什麼特別規定嗎？',
        pinyin: 'Liǎojiě! Lìngwài xiǎng qǐngjiào yīshī, zài Táiwān dài gǒugǒu qù chǒngwù yǒushàn kāfēitīng huò dā jiéyùn, yǒu shénme tèbié guīdìng ma?',
        ja: 'わかりました！あと台湾で犬をペット同伴カフェに連れて行ったりMRTに乗せる場合、何か特別なルールはありますか？',
      },
      {
        speaker: 'Vet',
        speakerJa: '獣医師',
        zh: '台北捷運規定毛小孩一定要放在符合尺寸的寵物提箱或推車內，頭尾不能露出來；在寵物友善餐廳則務必繫上牽繩，公狗可以穿戴禮貌帶喔！',
        pinyin: 'Táiběi jiéyùn guīdìng máoxiǎohái yídìng yào fàng zài fúhé chǐcùn de chǒngwù tíxiāng huò tuīchē nèi, tóu wěi bù néng lù chūlái; zài chǒngwù yǒushàn cāntīng zé wùbì xì shàng qiānshéng, gōnggǒu kěyǐ chuāndài lǐmàodài ō!',
        ja: '台北MRTでは規定サイズのキャリーバッグやペットカートに入れ、頭や尾を出さないことが義務付けられています。ペット可カフェではリード（牽繩）を着用し、男の子のワンちゃんはマナーベルト（禮貌帶）を着用すると安心ですよ！',
      },
    ],
    petGlossary: [
      {
        termZh: '毛小孩 (máoxiǎohái)',
        pinyin: 'máoxiǎohái',
        meaningJa: 'ペット（家族同然の愛犬・愛猫を愛情込めて呼ぶ台湾華語）',
        tipJa: '台湾では「毛寶貝（毛ベイビー）」とも呼ばれ、ペットへの愛情表現として広く浸透。',
      },
      {
        termZh: '寵物登記與晶片',
        pinyin: 'chǒngwù dēngjì yǔ jīngpiàn',
        meaningJa: 'ペット戸籍登録とマイクロチップ装着',
        tipJa: '台湾では法律により犬猫のマイクロチップ登録が義務化されています。',
      },
      {
        termZh: '禮貌帶 (lǐmàodài)',
        pinyin: 'lǐmàodài',
        meaningJa: 'マナーベルト・マーキング防止おむつ',
        tipJa: '室内カフェやホテルでの粗相やマーキングを防ぐエチケットグッズ。',
      },
    ],
  },
]
