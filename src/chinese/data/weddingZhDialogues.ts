/**
 * 台灣華語：台灣傳統婚禮喜酒紅包行情報稅、禮金雙數禁忌與吉祥賀詞資料庫 (Taiwan Wedding Red Envelope Database)
 * 涵蓋日本語母語者在台灣參加喜宴（喝喜酒）必備民俗智慧：紅包禮金雙數吉利（避開單數、諧音四與八）、場地級距（五星級飯店・婚宴會館・流水席辦桌）、出席一人與攜伴紅包行情、紅包袋直式書寫格式（右上寫祝賀人、中間寫四字賀詞如百年好合/永浴愛河、左下角落款敬賀）、收禮櫃檯簽到領喜餅卡。
 */

export interface WeddingDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Colleague' | 'JapaneseGuest'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  weddingGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const WEDDING_DIALOGUES: WeddingDialogueItem[] = [
  {
    id: 'wedding-red-packet',
    title: '台灣參加婚禮喝喜酒：紅包禮金行情、雙數禁忌與封面祝賀吉祥話',
    titleJa: '台湾の結婚式（喜酒）：ご祝儀（紅包）相場・偶数マナーと袋の書き方',
    icon: '💒',
    locationZh: '五星級飯店婚宴迎賓禮金桌前',
    locationJa: '5つ星ホテルの披露宴受付（禮金桌）前',
    dialogueLines: [
      {
        speaker: 'JapaneseGuest',
        speakerJa: '日本人ゲスト',
        zh: '今天是我第一次在台灣參加婚禮「喝喜酒」！我準備了一包三千六百元的紅包，這樣金額會不會失禮？',
        pinyin: 'Jīntiān shì wǒ dì-yī cì zài Táiwān cānjiā hūnlǐ "hē xǐjiǔ"! Wǒ zhǔnbèi le yì bāo sānqiān liùbǎi yuán de hóngbāo, zhèyàng jīné huì bú huì shīlǐ?',
        ja: '今日が台湾で初めての結婚式（披露宴＝「喝喜酒」）参列です！ご祝儀に3600元を用意したのですが、失礼な金額になっていませんか？',
      },
      {
        speaker: 'Colleague',
        speakerJa: '台湾の同僚',
        zh: '三千六百元非常大方而且非常吉利！台灣紅包講究「雙數」，但一定要避開「四」和「八」！三千二、三千六或六千都是最受歡迎的數字！',
        pinyin: 'Sānqiān liùbǎi yuán fēicháng dàfāng érqiě fēicháng jílì! Táiwān hóngbāo jiǎngjiù "shuāngshù", dàn yídìng yào bìkāi "sì" hàn "bā"! Sānqiān èr, sānqiān liù huò liùqiān dōu shì zuì shòuhuānyíng de shùzì!',
        ja: '3600元はとても気前が良くて縁起も抜群だよ！台湾のご祝儀は「偶数」が基本だけど、「4（死）」と「8（別れに通じる場合あり）」は避けるのが鉄則！3200、3600、6000元が定番の人気金額だよ！',
      },
      {
        speaker: 'Colleague',
        speakerJa: '台湾の同僚',
        zh: '紅包袋封面記得不要封口，直式寫法：右上寫新人名字，中間寫「百年好合」或「永浴愛河」，左下寫你的名字加上「敬賀」！交給收禮處後還可以領喜餅喔！',
        pinyin: 'Hóngbāodài fēngmiàn jìdé bú yào fēngkǒu, zhíshì xiěfǎ: yòushàng xiě xīnrén míngzì, zhōngjiān xiě "bǎinián hǎohé" huò "yǒngyù àihé", zuǒxià xiě nǐ de míngzì jiāshàng "jìnghè"! Jiāo gěi shōulǐchù hòu hái kěyǐ lǐng xǐbǐng ō!',
        ja: '紅包の封筒は糊付けせず折り込むだけにしてね。縦書きで右上に新郎新婦の名前、中央に「百年好合（末永く円満に）」か「永浴愛河（愛の河に浴す）」、左下に自分の名前＋「敬賀」と書くんだ。受付に渡したら引き出物のクッキー（喜餅）も受け取れるよ！',
      },
    ],
    weddingGlossary: [
      {
        termZh: '喝喜酒 (hē xǐjiǔ)',
        pinyin: 'hē xǐjiǔ',
        meaningJa: '結婚披露宴に出席すること（文字通り「祝いの酒を飲む」）',
        tipJa: '台湾では「結婚式に行く」ことを日常会話で「去喝喜酒」と表現する。',
      },
      {
        termZh: '紅包雙數吉利 (shuāngshù)',
        pinyin: 'hóngbāo shuāngshù jílì',
        meaningJa: 'ご祝儀は偶数で包む（2000, 2200, 2600, 3200, 3600, 6000, 6600元など）',
        tipJa: '日本の奇数文化と正反対なので注意！台湾では割り切れる偶数が「対・ペア」として喜ばれる。',
      },
      {
        termZh: '喜餅 (xǐbǐng)',
        pinyin: 'xǐbǐng',
        meaningJa: '婚礼の焼き菓子・引き出物クッキー（新婦側が女性ゲストや親族に贈る）',
        tipJa: '受付で引換券（喜餅卡）と交換で渡される。大判の中華菓子（大餅）と洋風クッキーのセットが多い。',
      },
    ],
  },
]
