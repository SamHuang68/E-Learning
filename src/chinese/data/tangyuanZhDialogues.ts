/**
 * 台灣華語：台灣傳統節慶冬至吃湯圓、搓紅白小圓、包餡爆漿大湯圓與添歲數民俗生活資料庫 (Taiwanese Dongzhi Tangyuan Database)
 * 涵蓋日本語母語者在台灣最溫暖的冬調節氣生活：一年中黑夜最長的「冬至」、全家人團聚搓紅白小湯圓（紅開運、白團圓）、俗諺「冬至吃湯圓，多長一歲」、爆漿甜大湯圓（流沙芝麻、香濃花生）、客家鹹湯圓（香菇肉絲茼蒿油蔥酥湯底）、祭拜祖先與地基主日常會話。
 */

export interface TangyuanDialogueItem {
  id: string
  title: string
  titleJa: string
  icon: string
  locationZh: string
  locationJa: string
  dialogueLines: Array<{
    speaker: 'TaiwanMom' | 'JapaneseStudent'
    speakerJa: string
    zh: string
    pinyin: string
    ja: string
  }>
  tangyuanGlossary: Array<{
    termZh: string
    pinyin: string
    meaningJa: string
    tipJa: string
  }>
}

export const TANGYUAN_DIALOGUES: TangyuanDialogueItem[] = [
  {
    id: 'dongzhi-tangyuan-gathering',
    title: '台灣冬至吃冬節圓：搓紅白小湯圓、爆漿黑芝麻大湯圓與吃了長一歲',
    titleJa: '台湾の冬至（トンジ）：紅白白玉団子作り・とろける黒胡麻湯圓と「1歳年を取る」伝統',
    icon: '🥣',
    locationZh: '台灣家庭廚房與溫暖餐桌旁',
    locationJa: '台湾の家庭のキッチンと食卓のそば',
    dialogueLines: [
      {
        speaker: 'TaiwanMom',
        speakerJa: '台湾のお母さん',
        zh: '今天是二十四節氣的冬至！是一整年黑夜最長的一天。我們台灣俗話說「吃過冬節圓，就多長一歲囉」！快來一起搓紅白小湯圓！',
        pinyin: 'Jīntiān shì èrshísì jiéqì de Dōngzhì! Shì yì zhěng nián hēiyè zuì cháng de yì tiān. Wǒmen Táiwān súhuà shuō "chī guò dōngjiéyuán, jiù duō zhǎng yí suì luo"! Kuài lái yìqǐ cuō hóngbái xiǎo tāngyuán!',
        ja: '今日は二十四節気の「冬至」だよ！1年で一番夜が長い日さ。台湾のことわざで「冬至の団子（冬節圓）を食べると、1歳年を取る」と言うんだよ！さあ、一緒に紅白の小さなお団子を丸めよう！',
      },
      {
        speaker: 'JapaneseStudent',
        speakerJa: '日本人留学生',
        zh: '紅白兩種顏色好喜氣！為什麼湯圓一定要有紅色和白色呢？鍋子裡煮的大湯圓又是什麼口味呢？',
        pinyin: 'Hóngbái liǎng zhǒng yánsè hǎo xǐqì! Wèishénme tāngyuán yídìng yào yǒu hóngsè hàn báisè ne? Guōzi lǐ zhǔ de dà tāngyuán yòu shì shénme kǒuwèi ne?',
        ja: '赤と白の2色でおめでたい雰囲気ですね！どうして湯圓は必ず赤と白があるのですか？お鍋で茹でている大きなお団子は何味ですか？',
      },
      {
        speaker: 'TaiwanMom',
        speakerJa: '台湾のお母さん',
        zh: '紅湯圓象徵「喜氣開運」，白湯圓象徵「闔家團圓平安」！鍋裡滾的是包餡大湯圓，有咬下去會流沙爆漿的黑芝麻與花生餡，配黑糖老薑湯最暖身！',
        pinyin: 'Hóng tāngyuán xiàngzhēng "xǐqì kāiyùn", bái tāngyuán xiàngzhēng "héjiā tuányuán píng\'ān"! Guō lǐ gǔn de shì bāoxiàn dà tāngyuán, yǒu yǎo xiàqù huì liúshā bàojiāng de hēi zhīma hàn huāshēng xiàn, pèi hēitáng lǎojiāng tāng zuì nuǎnshēn!',
        ja: '赤団子は「開運とめでたさ」、白団子は「家庭円満と無事」を意味するの！お鍋で踊っているのは餡入り大湯圓で、かじると中からとろ〜り溢れ出る黒胡麻やピーナッツ餡だよ。黒糖生姜スープと一緒に食べると体がポカポカ温まるよ！',
      },
    ],
    tangyuanGlossary: [
      {
        termZh: '冬節圓 (dōngjiéyuán)',
        pinyin: 'dōngjiéyuán',
        meaningJa: '冬至に食べる白玉団子（円満・団欒・長寿の象徴）',
        tipJa: '台湾では冬至に団子を食べることで太陽の復活を祝い、無事に年を越すための活力とする。',
      },
      {
        termZh: '紅白小湯圓 (hóngbái xiǎo tāngyuán)',
        pinyin: 'hóngbái xiǎo tāngyuán',
        meaningJa: '餡なしの小さな紅白白玉（赤＝開運、白＝家族円満）',
        tipJa: '両手のひらでくるくると丸め、甘いシロップや小豆スープ、あるいは塩味のスープに入れて楽しむ。',
      },
      {
        termZh: '包餡大湯圓 (bāoxiàn dà tāngyuán)',
        pinyin: 'bāoxiàn dà tāngyuán',
        meaningJa: '餡入り大粒湯圓（黒胡麻、ピーナッツ、豚挽肉などのジューシーな具入り）',
        tipJa: '熱々のシロップを噛むと中から濃厚な餡が溢れ出す台湾冬の至高のスイーツ。',
      },
    ],
  },
]
