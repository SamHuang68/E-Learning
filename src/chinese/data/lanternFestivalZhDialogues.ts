/**
 * 台灣華語：台灣元宵節平溪天燈祈福、鹽水蜂炮、猜燈謎與滾元宵民俗生活資料庫 (Taiwanese Lantern Festival Database)
 * 涵蓋日本語母語者在台灣最震撼的元宵民俗文化：農曆正月十五「元宵節（小過年）」、新北平溪十分鐵道「放天燈祈福」、台南鹽水武廟「萬發蜂炮全副武裝驅瘟除煞」、廟埕前「猜燈謎（射燈虎）」、品嚐滾水現煮圓滾滾元宵日常對話。
 */

export interface LanternFestivalDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'TaiwanGuide' | 'JapaneseTourist'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  lanternFestivalGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const LANTERN_FESTIVAL_DIALOGUES: LanternFestivalDialogueItem[] = [
  {
    id: 'lantern-festival-sky-lantern-firecrackers',
    title: '台灣元宵節：平溪天燈祈福、台南鹽水蜂炮與廟口猜燈謎',
    titleJa: '台湾の元宵節：平渓ランタン（天燈）飛ばし・塩水蜂砲とランタンなぞなぞ（猜燈謎）',
    icon: '🏮',
    locationZh: '平溪十分鐵道旁與滿天繁星般的天燈夜空下',
    locationJa: '平渓・十分駅の線路脇と夜空を埋め尽くすランタンの下',
    dialogueLines: [
      {
        speaker: 'TaiwanGuide',
        speakerJa: '台湾のガイド',
        zh: '今天是農曆正月十五元宵節，也就是俗稱的「小過年」！台灣有句諺語「北天燈、南蜂炮」，我們現在在平溪十分老街，四色天燈每一面都代表不同的心願喔！',
        pinyin: 'Jīntiān shì Nónglì zhēngyuè shíwǔ Yuánxiāojié, yě jiùshì súchēng de "Xiǎoguònián"! Táiwān yǒu jù yànyǔ "Běi tiāndēng, Nán fēngpào", wǒmen xiànzài zài Píngxī Shífēn lǎojiē, sìsè tiāndēng měi yí miàn dōu dàibiǎo bùtóng de xīnyuàn o!',
        ja: '今日は旧暦1月15日の元宵節、いわゆる「小正月（小過年）」です！台湾には「北の天燈、南の蜂砲」という言葉があります。平渓の十分老街では、4色のランタン（天燈）のそれぞれの面に願い事を書きます！',
      },
      {
        speaker: 'JapaneseTourist',
        speakerJa: '日本人観光客',
        zh: '我用毛筆在紅色那一面寫了「身體健康」，黃色寫了「發大財」！點火之後熱氣灌滿整顆天燈，升空那一刻真的好浪漫好感動！',
        pinyin: 'Wǒ yòng máobǐ zài hóngsè nà yí miàn xiě le "shēntǐ jiànkāng", huángsè xiě le "fā dàcái"! Diǎnhuǒ zhīhòu rèqì guànmǎn zhěng kē tiāndēng, shēngkōng nà yí kè zhēnde hǎo làngmàn hǎo gǎndòng!',
        ja: '赤い面に毛筆で「身體健康（無病息災）」、黄色に「發大財（金運上昇）」と書きました！点火すると熱気が満ちて、夜空へふわりと舞い上がった瞬間、とても感動的でした！',
      },
      {
        speaker: 'TaiwanGuide',
        speakerJa: '台湾のガイド',
        zh: '南部台南鹽水的蜂炮則是震撼熱血，大家戴全罩式安全帽、穿厚外套進場「犁蜂炮」消災解厄！廟會現場還有掛燈籠猜燈謎，吃一碗熱呼呼的元宵，象徵圓圓滿滿！',
        pinyin: 'Nánbù Táinán Yánshuǐ de fēngpào zéshì zhènhàn rèxiě, dàjiā dài quánzhàoshì ānquánmào, chuān hòuwàitào jìnchǎng "lí fēngpào" xiāozāi jiě\'è! Miàohuì xiànchǎng hái yǒu guà dēnglóng cāi dēngmí, chī yì wǎn rèhūhū de yuánxiāo, xiàngzhēng yuányuán-mǎnmǎn!',
        ja: '南部の台南・塩水蜂砲は万発のロケット花火が飛び交う熱狂的なお祭りで、フルフェイスヘルメットと防護服で厄除けを祈願します！お寺の境内ではランタンのなぞなぞを解き、熱々の元宵団子を食べて円満を祝います！',
      },
    ],
    lanternFestivalGlossary: [
      {
        termZh: '放天燈 (fàng tiāndēng)',
        pinyin: 'fàng tiāndēng',
        meaningJa: 'スカイランタン（天燈）を夜空へ飛ばす伝統祈願（平渓十分の名物）',
        tipJa: '願い事を毛筆で四面に書き込み、下部の油染み金紙に火をつけて気球の原理で上空へ放つ。',
      },
      {
        termZh: '鹽水蜂炮 (Yánshuǐ fēngpào)',
        pinyin: 'Yánshuǐ fēngpào',
        meaningJa: '台南塩水蜂砲（無数のロケット花火を浴びて厄除けと開運を祈る天下の奇祭）',
        tipJa: '参加者は全身耐火服・厚手ジーンズ・フルフェイスヘルメット・タオルを巻いて完全防護で挑む。',
      },
      {
        termZh: '猜燈謎 (cāi dēngmí)',
        pinyin: 'cāi dēngmí',
        meaningJa: 'ランタンのなぞなぞ（射灯虎／知恵とひらめきを競う元宵節の風流な遊戯）',
        tipJa: '赤い提灯の下に貼られた文字遊びや地名のなぞなぞを解くと、景品や賞金がもらえる。',
      },
    ],
  },
]
