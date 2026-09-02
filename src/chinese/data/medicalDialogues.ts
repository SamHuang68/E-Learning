/**
 * 台灣華語：看病就醫、健保診所與藥局生活資料庫 (Taiwan Medical & Clinic Dialogues Database)
 * 涵蓋日本語母語者在台灣看病就醫（健保卡、掛號費、量體溫）、向醫生描述症狀（頭痛、發燒、拉肚子、過敏）、藥局領藥（三餐飯後）等最接地氣的實用對話。
 */

export interface MedicalDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Patient' | 'Doctor' | 'Nurse' | 'Pharmacist'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  symptomGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const MEDICAL_DIALOGUES: MedicalDialogueItem[] = [
  {
    id: 'medical-clinic',
    title: '診所掛號與向醫師描述感冒症狀',
    titleJa: 'クリニックでの受付（健保カード）と医師への症状説明',
    icon: '🩺',
    locationZh: '耳鼻喉科 / 家醫科診所',
    locationJa: '耳鼻科 / 内科クリニック',
    dialogueLines: [
      {
        speaker: 'Nurse',
        speakerJa: '看護師/受付',
        zh: '您好，請出示健保卡或居留證，初次看診請先填寫初診初診單。掛號費兩百元。',
        pinyin: 'Nín hǎo, qǐng chūshì jiànbǎokǎ huò jūliúzhèng, chūcì kànzhěn qǐng xiān tiánxiě chūzhěndān. Guàhàofèi liǎngbǎi yuán.',
        ja: 'こんにちは、健康保険カードか居留証をご提示ください。初診の場合はこちらの問診票にご記入ください。診察受付料は200元です。',
      },
      {
        speaker: 'Doctor',
        speakerJa: '医師',
        zh: '請坐。今天哪裡不舒服呢？發燒幾天了？有沒有喉嚨痛或流鼻水？',
        pinyin: 'Qǐng zuò. Jīntiān nǎlǐ bù shūfu ne? Fāshāo jǐ tiān le? Yǒu méiyǒu hóulóng tòng huò liú bíshuǐ?',
        ja: 'どうぞお座りください。今日はどこが具合悪いですか？熱は何日続いていますか？喉の痛みや鼻水はありますか？',
      },
      {
        speaker: 'Patient',
        speakerJa: '日本人患者',
        zh: '醫生您好，我從昨天開始發高燒、全身痠痛，而且喉嚨很痛、一直咳嗽。',
        pinyin: 'Yīshēng nín hǎo, wǒ cóng zuótiān kāishǐ fā gāoshāo, quánshēn suāntòng, érqiě hóulóng hěn tòng, yìzhí késou.',
        ja: '先生こんにちは。昨日から高熱が出て体中が痛み、喉が痛くて咳が止まりません。',
      },
      {
        speaker: 'Doctor',
        speakerJa: '医師',
        zh: '我先看一下喉嚨，嘴巴張開說「啊—」。扁桃腺有點紅腫發炎，我幫您開退燒藥跟消炎藥。',
        pinyin: 'Wǒ xiān kàn yíxià hóulóng, zuǐba zhāngkāi shuō "ā—". Biǎntáoxiàn yǒudiǎn hóngzhǒng fāyán, wǒ bāng nín kāi tuìshāoyào gēn xiāoyányào.',
        ja: 'まず喉を拝見しますね、口を開けて「あー」と言ってください。扁桃腺が赤く腫れて炎症を起こしています。解熱剤と抗炎症薬を処方しますね。',
      },
    ],
    symptomGlossary: [
      {
        termZh: '健保卡 (jiànbǎokǎ)',
        pinyin: 'jiànbǎokǎ',
        meaningJa: '全民健康保険カード',
        tipJa: '台湾の国民皆保険カード。外国人も居留証取得後6ヶ月で加入義務があり、医療費が非常に安くなります。',
      },
      {
        termZh: '全身痠痛 (quánshēn suāntòng)',
        pinyin: 'quánshēn suāntòng',
        meaningJa: '体中がだるくて痛い・関節痛',
        tipJa: 'インフルエンザや発熱時に特有の「痠痛（だる痛い）」を表す定番表現。',
      },
      {
        termZh: '過敏 (guòmǐn)',
        pinyin: 'guòmǐn',
        meaningJa: 'アレルギー',
        tipJa: '「我對海鮮過敏（エビアレルギーです）」「藥物過敏（薬物アレルギー）」のように使います。',
      },
    ],
  },
  {
    id: 'medical-pharmacy',
    title: '健保藥局領藥與服藥指示',
    titleJa: '調剤薬局での受け取りと服用方法（三食後）',
    icon: '💊',
    locationZh: '健保特約藥局',
    locationJa: '調剤薬局窓口',
    dialogueLines: [
      {
        speaker: 'Pharmacist',
        speakerJa: '薬剤師',
        zh: '陳先生是嗎？這是您三天的藥。白色藥丸是退燒止痛，黃色膠囊是抗生素。',
        pinyin: 'Chén xiānsheng shì ma? Zhè shì nín sān tiān de yào. Báisè yàowán shì tuìshāo zhǐtòng, huángsè jiāonáng shì kàngshēngsù.',
        ja: '陳様ですね？こちらが3日分のお薬です。白い錠剤は解熱鎮痛剤、黄色いカプセルは抗生物質です。',
      },
      {
        speaker: 'Patient',
        speakerJa: '患者',
        zh: '請問這兩種藥都是飯後吃嗎？吃完會不會想睡覺？',
        pinyin: 'Qǐngwèn zhè liǎng zhǒng yào dōu shì fànhòu chī ma? Chī wán huì bú huì xiǎng shuìjiào?',
        ja: 'この2種類のお薬は両方とも食後に飲むのですか？飲むと眠気が出ますか？',
      },
      {
        speaker: 'Pharmacist',
        speakerJa: '薬剤師',
        zh: '三餐飯後三十分鐘服用。止痛藥稍有嗜睡成分，服藥後請避免開車或騎機車。',
        pinyin: 'Sāncān fànhòu sānshí fēnzhōng fúyòng. Zhǐtòngyào shāoyǒu shìshuì chéngfèn, fúyào hòu qǐng bìmiǎn kāichē huò qí jīchē.',
        ja: '毎食後30分に水で服用してください。鎮痛薬にやや眠気を誘う成分が入っていますので、運転はお控えください。',
      },
    ],
    symptomGlossary: [
      {
        termZh: '飯後服用 (fànhòu fúyòng)',
        pinyin: 'fànhòu fúyòng',
        meaningJa: '食後服用',
        tipJa: '台湾の薬袋（藥袋）に印刷される最頻出の服用指示文。',
      },
      {
        termZh: '嗜睡 (shìshuì)',
        pinyin: 'shìshuì',
        meaningJa: '眠気（副作用）',
        tipJa: '風邪薬やアレルギー薬の注意書きに「可能引起嗜睡（眠気を催す可能性あり）」と書かれます。',
      },
      {
        termZh: '止痛藥 (zhǐtòngyào)',
        pinyin: 'zhǐtòngyào',
        meaningJa: '痛み止め・鎮痛剤',
        tipJa: 'アセトアミノフェン（普拿疼 / Panadol）などが台湾の常備薬として有名。',
      },
    ],
  },
]
