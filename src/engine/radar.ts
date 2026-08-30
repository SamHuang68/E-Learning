/**
 * 多維度知識與能力雷達圖計算引擎 (Knowledge Radar Engine)
 * 支援三軌（臺灣數學、あおば日語、多益英語）多維能力評估與弱點診斷。
 */

export type RadarDimension = {
  key: string
  label: string
  score: number // 0 ~ 100
  fullMark: number // 預設 100
  description: string
  status: 'mastered' | 'proficient' | 'developing' | 'needs_work'
}

export type TrackRadar = {
  track: 'math' | 'ja' | 'en'
  trackName: string
  dimensions: RadarDimension[]
  averageScore: number
  strongestDimension: RadarDimension
  weakestDimension: RadarDimension
}

/**
 * 依據分數判斷精通度狀態
 */
function scoreToStatus(score: number): RadarDimension['status'] {
  if (score >= 85) return 'mastered'
  if (score >= 70) return 'proficient'
  if (score >= 50) return 'developing'
  return 'needs_work'
}

/**
 * 計算臺灣 108 課綱數學多維能力雷達
 */
export function computeMathRadar(
  completedQuestions: string[],
  examScores: Record<string, number>,
  labCompleted: string[],
): TrackRadar {
  // 依題號或標籤加權估算各維度分數
  const totalCompleted = completedQuestions.length
  const totalLabs = labCompleted.length

  const algebraBase = Math.min(100, totalCompleted * 6 + (labCompleted.includes('blocks') ? 20 : 0))
  const geometryBase = Math.min(
    100,
    totalLabs * 15 + (labCompleted.includes('pythagoras') ? 25 : 10),
  )
  const calculusBase = Math.min(
    100,
    (labCompleted.includes('calculus') ? 50 : 0) + (labCompleted.includes('unit-circle') ? 30 : 0),
  )
  const examAvg =
    Object.values(examScores).length > 0
      ? Object.values(examScores).reduce((a, b) => a + b, 0) / Object.values(examScores).length
      : 60
  const statisticsBase = Math.min(100, Math.round(examAvg * 0.9))
  const logicBase = Math.min(100, Math.round(geometryBase * 0.5 + algebraBase * 0.5))

  const dimensions: RadarDimension[] = [
    {
      key: 'algebra',
      label: '代數方程運算',
      score: Math.max(30, algebraBase),
      fullMark: 100,
      description: '等量公理、因式分解與多項式運算能力',
      status: scoreToStatus(Math.max(30, algebraBase)),
    },
    {
      key: 'geometry',
      label: '空間幾何直觀',
      score: Math.max(25, geometryBase),
      fullMark: 100,
      description: '畢氏定理、圓周角與平面坐標幾何',
      status: scoreToStatus(Math.max(25, geometryBase)),
    },
    {
      key: 'calculus',
      label: '函數與微積分',
      score: Math.max(20, calculusBase),
      fullMark: 100,
      description: '三角函數、黎曼和切片與導函數極限',
      status: scoreToStatus(Math.max(20, calculusBase)),
    },
    {
      key: 'statistics',
      label: '數據統計分析',
      score: Math.max(35, statisticsBase),
      fullMark: 100,
      description: '機率分布、數據圖表與綜合模擬考表現',
      status: scoreToStatus(Math.max(35, statisticsBase)),
    },
    {
      key: 'logic',
      label: '抽象邏輯證明',
      score: Math.max(30, logicBase),
      fullMark: 100,
      description: '無字證明推導與破題訊號辨析',
      status: scoreToStatus(Math.max(30, logicBase)),
    },
  ]

  const averageScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  )
  const sorted = [...dimensions].sort((a, b) => b.score - a.score)

  return {
    track: 'math',
    trackName: '臺灣 108 課綱數學',
    dimensions,
    averageScore,
    strongestDimension: sorted[0],
    weakestDimension: sorted[sorted.length - 1],
  }
}

/**
 * 計算あおば日語多維能力雷達
 */
export function computeAobaRadar(
  cardsDone: number,
  kanjiMasteredCount: number,
  speakingDone: number,
  streak: number,
): TrackRadar {
  const kanaScore = Math.min(100, 50 + cardsDone * 2)
  const vocabScore = Math.min(100, kanjiMasteredCount * 8 + 30)
  const grammarScore = Math.min(100, 40 + streak * 5)
  const keigoScore = Math.min(100, 35 + cardsDone * 3)
  const listeningScore = Math.min(100, speakingDone * 15 + 30)

  const dimensions: RadarDimension[] = [
    {
      key: 'kana',
      label: '五十音與假名',
      score: kanaScore,
      fullMark: 100,
      description: '清音、濁音、拗音聽讀與拼寫',
      status: scoreToStatus(kanaScore),
    },
    {
      key: 'vocab',
      label: '漢字與生活詞彙',
      score: vocabScore,
      fullMark: 100,
      description: 'JLPT 高頻核心詞彙與漢字讀音',
      status: scoreToStatus(vocabScore),
    },
    {
      key: 'grammar',
      label: '動作訊號文法',
      score: grammarScore,
      fullMark: 100,
      description: '補助動詞、授受動詞與時態判斷',
      status: scoreToStatus(grammarScore),
    },
    {
      key: 'keigo',
      label: '職場敬語溝通',
      score: keigoScore,
      fullMark: 100,
      description: '丁寧語、尊敬語、謙讓語情境切換',
      status: scoreToStatus(keigoScore),
    },
    {
      key: 'listening',
      label: '聽力跟讀發音',
      score: listeningScore,
      fullMark: 100,
      description: 'Shadowing 跟讀與語調高低重音',
      status: scoreToStatus(listeningScore),
    },
  ]

  const averageScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  )
  const sorted = [...dimensions].sort((a, b) => b.score - a.score)

  return {
    track: 'ja',
    trackName: 'あおば日語 (JLPT)',
    dimensions,
    averageScore,
    strongestDimension: sorted[0],
    weakestDimension: sorted[sorted.length - 1],
  }
}

/**
 * 計算多益英語多維能力雷達
 */
export function computeToeicRadar(
  cardsDone: number,
  chunkCount: number,
  examScore = 650,
): TrackRadar {
  const chunksScore = Math.min(100, chunkCount * 12 + 40)
  const listeningScore = Math.min(100, Math.round((examScore / 990) * 100) + 10)
  const grammarScore = Math.min(100, 45 + cardsDone * 3)
  const readingScore = Math.min(100, Math.round((examScore / 990) * 100) - 5)
  const vocabScore = Math.min(100, 50 + cardsDone * 2)

  const dimensions: RadarDimension[] = [
    {
      key: 'chunks',
      label: '高頻商務語塊',
      score: chunksScore,
      fullMark: 100,
      description: '固定搭配、介系詞語塊與 3 秒反射',
      status: scoreToStatus(chunksScore),
    },
    {
      key: 'listening',
      label: '聽力理解辨析',
      score: Math.max(30, listeningScore),
      fullMark: 100,
      description: 'Part 1~4 圖片、簡短對話與廣播訊息',
      status: scoreToStatus(Math.max(30, listeningScore)),
    },
    {
      key: 'grammar',
      label: 'Part 5 文法結構',
      score: Math.max(30, grammarScore),
      fullMark: 100,
      description: '詞性填空、連接詞、主被動時態',
      status: scoreToStatus(Math.max(30, grammarScore)),
    },
    {
      key: 'reading',
      label: '長文閱讀速讀',
      score: Math.max(25, readingScore),
      fullMark: 100,
      description: 'Part 7 雙篇/三篇閱讀快速定位細節',
      status: scoreToStatus(Math.max(25, readingScore)),
    },
    {
      key: 'vocab',
      label: '核心商務字彙',
      score: Math.max(35, vocabScore),
      fullMark: 100,
      description: '證書級距（Orange→Gold）高頻單字',
      status: scoreToStatus(Math.max(35, vocabScore)),
    },
  ]

  const averageScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  )
  const sorted = [...dimensions].sort((a, b) => b.score - a.score)

  return {
    track: 'en',
    trackName: 'TOEIC 多益商務英語',
    dimensions,
    averageScore,
    strongestDimension: sorted[0],
    weakestDimension: sorted[sorted.length - 1],
  }
}
