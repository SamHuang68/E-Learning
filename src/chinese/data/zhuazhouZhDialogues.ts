/**
 * 台灣華語：台灣傳統嬰兒滿周歲「度晬・抓周」、紅龜粿與腳踏龜平安長大民俗生活資料庫 (Taiwanese Zhuazhou First Birthday Database)
 * 涵蓋日本語母語者在台灣家庭最感動的生命民俗禮俗：寶寶滿一歲「度晬（dùcuì）」、頭戴虎頭帽腳穿虎頭鞋避邪除煞、雙腳踩象徵長壽平安的「紅龜粿（腳踏龜）」、米篩抓周道具（算盤、毛筆、聽診器、金元寶、雞腿、印章、滑鼠、麥克風）預測未來志向日常對話與吉祥祝福語。
 */

export interface ZhuazhouDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'Grandma' | 'JapaneseParent'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  zhuazhouGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const ZHUAZHOU_DIALOGUES: ZhuazhouDialogueItem[] = [
  {
    id: 'zhuazhou-first-birthday',
    title: '台灣寶寶滿周歲「抓周」：戴虎頭帽、腳踏紅龜粿與米篩預測志向',
    titleJa: '台湾の満1歳のお祝い「抓周（選び取り）」：虎の帽子・亀の草餅踏み・将来占い',
    icon: '👶',
    locationZh: '台灣家庭滿周歲抓周慶祝客廳',
    locationJa: '台湾の家庭の満1歳「抓周」お祝いリビング',
    dialogueLines: [
      {
        speaker: 'Grandma',
        speakerJa: '台湾のおばあちゃん',
        zh: '來！寶寶滿一歲在台灣叫「度晬」！先戴上虎頭帽、穿虎頭鞋，虎虎生風驅邪除煞，一生健健康康無病無痛！',
        pinyin: 'Lái! Bǎobǎo mǎn yí suì zài Táiwān jiào "dùcuì"! Xiān dài shàng hǔtóumào, chuān hǔtóuxié, hǔhǔshēngfēng qūxié chúshà, yìshēng jiànjiànkāngkāng wúbìng wútòng!',
        ja: 'さあ！台湾では満1歳の誕生日を「度晬（ドーツェイ）」と呼ぶのよ！まずは虎の帽子と虎の靴を履かせて魔除けをし、一生病気知らずで健やかに育つよう祈るの！',
      },
      {
        speaker: 'JapaneseParent',
        speakerJa: '日本人の親',
        zh: '太可愛了！地上這兩個紅色的印有龜紋的糕點是什麼呢？要讓寶寶踩上去嗎？',
        pinyin: "Tài kě'ài le! Dìshàng zhè liǎng ge hóngsè de yìn yǒu guīwén de gāodiǎn shì shénme ne? Yào ràng bǎobǎo cǎi shàngqù ma?",
        ja: 'すごく可愛いですね！床に置いてあるこの2つの赤い亀の模様の餅菓子は何ですか？赤ちゃんに踏ませるのですか？',
      },
      {
        speaker: 'Grandma',
        speakerJa: '台湾のおばあちゃん',
        zh: '對！這叫「腳踏龜」，踩兩顆紅龜粿象徵「腳踏龜，長命百歲、大富大貴」！踩完抱進大米篩裡抓周，看他抓算盤當會計師、抓聽診器當良醫，還是抓滑鼠當科技新貴！',
        pinyin: 'Duì! Zhè jiào "jiǎotàguī", cǎi liǎng kē hóngguīguǒ xiàngzhēng "jiǎotàguī, chángmìng bǎisuì, dàfù dàguì"! Cǎi wán bào jìn dàmǐshāi lǐ zhuāzhōu, kàn tā zhuā suànpán dāng kuàijìshī, zhuā tīngzhěnqì dāng liángyī, háishì zhuā huáshǔ dāng kējì xīnguì!',
        ja: 'そう！これは「腳踏龜（亀踏み）」と言って、赤い亀草餅（紅龜粿）を両足で踏んで長寿と富貴を祈るの！そのあと大きな竹ざる（米篩）に入れて「選び取り（抓周）」よ！そろばん（会計士）、聴診器（医師）、マウス（ITエンジニア）など何を掴むか楽しみね！',
      },
    ],
    zhuazhouGlossary: [
      {
        termZh: '度晬 (dùcuì)',
        pinyin: 'dùcuì',
        meaningJa: '満1歳の誕生日（台湾語由来の古風で格式ある祝福の言葉）',
        tipJa: '赤ちゃんが無事に厳しい乳児期を乗り越え満1歳を迎えたことを一族総出で神仏と先祖に感謝する。',
      },
      {
        termZh: '腳踏龜・紅龜粿 (jiǎotàguī / hóngguīguǒ)',
        pinyin: 'jiǎotàguī / hóngguīguǒ',
        meaningJa: '亀草餅踏み（赤・紫の長寿を象徴する亀型餅を踏んで歩き始めを祝う）',
        tipJa: '日本の「一升餅」に似た儀式。右足で富貴を、左足で健康長寿を踏み固める意味がある。',
      },
      {
        termZh: '抓周 (zhuāzhōu)',
        pinyin: 'zhuāzhōu',
        meaningJa: '選び取り儀式（米篩の中に置かれた道具から赤ちゃんが最初に手にした物で将来を占う）',
        tipJa: '鶏肉（一生食べ物に困らない）、金元宝（金運）、筆・本（学者）、聴診器（医師）、マウス（IT）などが並ぶ。',
      },
    ],
  },
]
