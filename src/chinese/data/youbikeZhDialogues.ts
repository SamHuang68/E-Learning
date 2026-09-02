/**
 * 台灣華語：台灣微笑單車 YouBike 2.0 騎乘、公車捷運雙向轉乘優惠與報修資料庫 (Taiwan YouBike Transit Database)
 * 涵蓋日本語母語者在台灣最普遍的綠色代步工具：YouBike 2.0 智慧車機（悠遊卡靠卡借車・手機 APP 掃碼借車）、座椅高度快拆板桿、座墊反轉（椅墊轉向後方代表車輛故障請勿租借）、車鈴前後煞車測試、搭捷運/公車一小時內轉乘微笑單車享現折 5 元優惠以及入柱還車確認。
 */

export interface YouBikeDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'RiderA' | 'RiderB'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  youbikeGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const YOUBIKE_DIALOGUES: YouBikeDialogueItem[] = [
  {
    id: 'youbike-rental-transit',
    title: '台北 YouBike 2.0 悠遊卡感應借車、座墊反轉與捷運轉乘優惠',
    titleJa: 'YouBike 2.0の借り方・サドル反転（故障車サイン）とMRT乗継割引',
    icon: '🚲',
    locationZh: '台北捷運忠孝復興站 YouBike 租借站',
    locationJa: 'MRT忠孝復興駅のYouBike（シェアサイクル）ステーション',
    dialogueLines: [
      {
        speaker: 'RiderA',
        speakerJa: '台湾の友人',
        zh: '從捷運站出來騎 YouBike 只要五分鐘！你看那台車的座墊被反轉 180 度朝後，那是台灣人的默契，代表「這台車故障了請不要借」，我們選旁邊這台！',
        pinyin: 'Cóng jiéyùnzhàn chūlái qí YouBike zhǐ yào wǔ fēnzhōng! Nǐ kàn nà tái chē de zuòdiàn bèi fǎnzhuǎn 180 dù cháo hòu, nà shì Táiwānrén de mòqì, dàibiǎo "zhè tái chē gùzhàng le qǐng bú yào jiè", wǒmen xuǎn pángbiān zhè tái!',
        ja: 'MRT駅からYouBikeに乗れば5分で着くよ！見て、あの自転車サドルが180度後ろ向きに反転されてるでしょ？あれは台湾人の暗黙のサインで「この自転車は故障中だから借りないで」って意味なんだ。隣のにしよう！',
      },
      {
        speaker: 'RiderB',
        speakerJa: '日本人留学生',
        zh: '原來座墊反轉是壞車的標記，太聰明了！我用悠遊卡嗶一下車機螢幕就解鎖了！剛剛搭捷運出站，是不是有雙向轉乘折五元的優惠？',
        pinyin: 'Yuánlái zuòdiàn fǎnzhuǎn shì huàichē de biāojì, tài cōngmíng le! Wǒ yòng Yōuyóukǎ bī yíxià chējī yíngmù jiù jiěsuǒ le! Gānggāng dā jiéyùn chūzhàn, shì bú shì yǒu shuāngxiàng zhuǎnchéng zhé wǔ yuán de yōuhuì?',
        ja: 'サドル反転が故障車のサインだったんですね、賢い！悠遊カード（EasyCard）をスマート車載モニターにタッチしたらすぐ解錠できました！さっきMRTを降りたばかりですが、乗継割引で5元引きになりますか？',
      },
      {
        speaker: 'RiderA',
        speakerJa: '台湾の友人',
        zh: '沒錯！一小時內公車捷運轉乘 YouBike 都有扣減補助！還車時把車頭凸出卡榫推入車柱，聽到「嗶嗶」兩聲、螢幕顯示還車成功扣款就完成囉！',
        pinyin: 'Méi cuò! Yì xiǎoshí nèi gōngchē jiéyùn zhuǎnchéng YouBike dōu yǒu kòujiǎn bǔzhù! Huánchē shí bǎ chētóu túchū kǎsǔn tuīrù chēzhù, tīngdào "bībī" liǎng shēng, yíngmù xiǎnshì huánchē chénggōng kòukuǎn jiù wánchéng luō!',
        ja: 'その通り！1時間以内のMRT・路線バスとYouBikeの相互乗り継ぎは割引補助が出るよ！返却時は前輪の金属ジョイントをスタンドに押し込んで、「ピピッ」と2回鳴って画面に返却完了と出ればOKだよ！',
      },
    ],
    youbikeGlossary: [
      {
        termZh: '座墊反轉 (zuòdiàn fǎnzhuǎn)',
        pinyin: 'zuòdiàn fǎnzhuǎn',
        meaningJa: 'サドル反転（自転車の故障・チェーン外れ・パンクの合図）',
        tipJa: '台湾では乗車前点検で故障を見つけたらサドルを逆向きにして次の人へ知らせるマナーがある。',
      },
      {
        termZh: '雙向轉乘優惠',
        pinyin: 'shuāngxiàng zhuǎnchéng yōuhuì',
        meaningJa: 'MRT・路線バスとYouBikeの相互乗り継ぎ割引（5元引き）',
        tipJa: '同一の悠遊カードで60分以内に公共交通機関を乗り継ぐと割引が自動適用される。',
      },
      {
        termZh: '卡榫入柱 (kǎsǔn rùzhù)',
        pinyin: 'kǎsǔn rùzhù',
        meaningJa: 'ジョイント金具をステーションのロック柱に差し込む（返却ロック）',
        tipJa: '青いライトが点滅から点灯に変わり、音が鳴って返却完了。',
      },
    ],
  },
]
