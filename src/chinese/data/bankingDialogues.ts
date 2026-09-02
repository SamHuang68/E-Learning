/**
 * 台灣華語：銀行開戶、換匯與金融生活資料庫 (Taiwan Banking & Finance Dialogues Database)
 * 涵蓋日本語母語者在台灣生活必備之銀行開戶 (開戶)、外幣兌換 (換匯)、印章 (印鑑) 與 ATM 轉帳會話。
 */

export interface BankingDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Customer' | 'Teller' | 'ATM'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  usefulVocabulary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const BANKING_DIALOGUES: BankingDialogueItem[] = [
  {
    id: 'banking-open-account',
    title: '銀行臨櫃開戶與提款卡申請',
    titleJa: '銀行窓口での口座開設とキャッシュカード発行',
    icon: '🏦',
    locationZh: '台灣銀行營業部臨櫃',
    locationJa: '台湾の銀行窓口',
    dialogueLines: [
      {
        speaker: 'Teller',
        speakerJa: '銀行員（行員）',
        zh: '先生您好，請出示您的號碼牌。今天想要辦理什麼業務呢？',
        pinyin: 'Xiānsheng nín hǎo, qǐng chūshì nín de hàomǎpái. Jīntiān xiǎng yào bànlǐ shénme yèwù ne?',
        ja: 'いらっしゃいませ。番号札をお出しください。本日はどのようなご用件でしょうか？',
      },
      {
        speaker: 'Customer',
        speakerJa: '日本人顧客',
        zh: '您好，我想開立一個活期儲蓄存款帳戶，並申請一張可以跨國提款的提款卡。',
        pinyin: 'Nín hǎo, wǒ xiǎng kāilì yí gè huóqí chúxù cúnkuǎn zhànghù, bìng shēnqǐng yì zhāng kěyǐ kuàguó tíkuǎn de tíkuǎnkǎ.',
        ja: 'こんにちは、普通預金口座を開設し、海外でも引き出し可能なキャッシュカードを申請したいです。',
      },
      {
        speaker: 'Teller',
        speakerJa: '銀行員',
        zh: '好的，請提供您的居留證（或統一證號）、護照，以及您的個人私章（印鑑）。',
        pinyin: 'Hǎo de, qǐng tígōng nín de jūliúzhèng (huò tǒngyī zhènghào), hùzhào, yǐjí nín de gèrén sīzhāng (yìnjiàn).',
        ja: 'かしこまりました。居留証（または統一番号）、パスポート、そしてご印鑑をお預かりします。',
      },
    ],
    usefulVocabulary: [
      {
        termZh: '開戶 (kāihù)',
        pinyin: 'kāihù',
        meaningJa: '銀行口座を開設する',
        tipJa: '台湾では「開立帳戶」の略称として「開戶」と日常的に使われます。',
      },
      {
        termZh: '印章 / 私章 (yìnzhāng / sīzhāng)',
        pinyin: 'yìnzhāng / sīzhāng',
        meaningJa: '印鑑・認め印',
        tipJa: '台湾の銀行手続きでは署名（サイン）に加え、漢字の「印章」が依然として極めて重視されます。',
      },
      {
        termZh: '居留證 (jūliúzhèng)',
        pinyin: 'jūliúzhèng',
        meaningJa: '台湾外僑居留証（ARC）',
        tipJa: '外国人が銀行口座を開く際の最重要身分証明書。',
      },
    ],
  },
  {
    id: 'banking-exchange',
    title: '日圓現鈔兌換新台幣',
    titleJa: '日本円現金から台湾元（TWD）への両替',
    icon: '💴',
    locationZh: '外幣兌換處',
    locationJa: '外貨両替窓口',
    dialogueLines: [
      {
        speaker: 'Customer',
        speakerJa: '日本人顧客',
        zh: '請問今天日幣現鈔買入的匯率是多少？我想把十萬日幣換成台幣現鈔。',
        pinyin: 'Qǐngwèn jīntiān Rìbì xiànchāo mǎirù de huìlǜ shì duōshǎo? Wǒ xiǎng bǎ shíwàn Rìbì huàn chéng Táibì xiànchāo.',
        ja: '本日の日本円現金の買取レートはいくらですか？10万円を台湾元の現金に両替したいのですが。',
      },
      {
        speaker: 'Teller',
        speakerJa: '銀行員',
        zh: '今天日幣買入匯率是 0.215。十萬日圓扣除手續費後，可以換得新台幣兩萬一千四百元。',
        pinyin: 'Jīntiān Rìbì mǎirù huìlǜ shì líng diǎn èr yī wǔ. Shíwàn Rìyuán kòuchú shǒuxùfèi hòu, kěyǐ huàndé Xīn Táibì liǎngwàn yìqiān sìbǎi yuán.',
        ja: '本日の日本円買取レートは0.215です。10万円から手数料を差し引き、台湾元で2万1,400元となります。',
      },
      {
        speaker: 'Customer',
        speakerJa: '日本人顧客',
        zh: '好的，麻煩請給我幾張千元大鈔，以及一些百元紙鈔，謝謝！',
        pinyin: 'Hǎo de, máfan qǐng gěi wǒ jǐ zhāng qiānyuán dàchāo, yǐjí yìxiē bǎiyuán zhǐchāo, xièxie!',
        ja: '分かりました、千元札を何枚かと、百元札も混ぜていただけますか、ありがとう！',
      },
    ],
    usefulVocabulary: [
      {
        termZh: '匯率 (huìlǜ)',
        pinyin: 'huìlǜ',
        meaningJa: '為替レート（換算レート）',
        tipJa: '銀行の電光掲示板に「買入（買い取り）」と「賣出（売り）」が表示されます。',
      },
      {
        termZh: '手續費 (shǒuxùfèi)',
        pinyin: 'shǒuxùfèi',
        meaningJa: '手数料',
        tipJa: '台湾の空港や銀行窓口で1回あたり約100元の固定手数料がかかる場合があります。',
      },
      {
        termZh: '大鈔 vs 零錢 (dàchāo vs língqián)',
        pinyin: 'dàchāo vs língqián',
        meaningJa: '高額紙幣（千元札等） vs 小銭・細かいお金',
        tipJa: '「找零（おつり）」や両替の際に便利な実用表現。',
      },
    ],
  },
]
