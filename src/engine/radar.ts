/**
 * 多維度練習紀錄雷達圖計算引擎 (Practice Coverage Radar Engine)
 * 將本機保存的作答、測驗與實驗室紀錄轉成探索指標，不宣稱正式能力診斷。
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
  track: 'math' | 'calculus' | 'physics' | 'chemistry' | 'ja' | 'en' | 'zh'
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
  // 依已保存的題號、測驗與實驗室紀錄加權；沒有證據時維持 0。
  const totalCompleted = completedQuestions.length
  const totalLabs = labCompleted.length

  const algebraBase = Math.min(100, totalCompleted * 6 + (labCompleted.includes('blocks') ? 20 : 0))
  const geometryBase = Math.min(
    100,
    totalLabs * 15 + (labCompleted.includes('pythagoras') ? 25 : 0),
  )
  const calculusBase = Math.min(
    100,
    (labCompleted.includes('calculus') ? 50 : 0) + (labCompleted.includes('unit-circle') ? 30 : 0),
  )
  const examAvg =
    Object.values(examScores).length > 0
      ? Object.values(examScores).reduce((a, b) => a + b, 0) / Object.values(examScores).length
      : 0
  const statisticsBase = Math.min(100, Math.round(examAvg * 0.9))
  const logicBase = Math.min(100, Math.round(geometryBase * 0.5 + algebraBase * 0.5))

  const dimensions: RadarDimension[] = [
    {
      key: 'algebra',
      label: '代數方程運算',
      score: algebraBase,
      fullMark: 100,
      description: '等量公理、因式分解與多項式運算能力',
      status: scoreToStatus(algebraBase),
    },
    {
      key: 'geometry',
      label: '空間幾何直觀',
      score: geometryBase,
      fullMark: 100,
      description: '畢氏定理、圓周角與平面坐標幾何',
      status: scoreToStatus(geometryBase),
    },
    {
      key: 'calculus',
      label: '函數與微積分',
      score: calculusBase,
      fullMark: 100,
      description: '三角函數、黎曼和切片與導函數極限',
      status: scoreToStatus(calculusBase),
    },
    {
      key: 'statistics',
      label: '數據統計分析',
      score: statisticsBase,
      fullMark: 100,
      description: '機率分布、數據圖表與綜合模擬考表現',
      status: scoreToStatus(statisticsBase),
    },
    {
      key: 'logic',
      label: '抽象邏輯證明',
      score: logicBase,
      fullMark: 100,
      description: '無字證明推導與破題訊號辨析',
      status: scoreToStatus(logicBase),
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
  const kanaScore = Math.min(100, cardsDone * 5)
  const vocabScore = Math.min(100, kanjiMasteredCount * 8)
  const grammarScore = Math.min(100, streak * 5)
  const keigoScore = Math.min(100, cardsDone * 3)
  const listeningScore = Math.min(100, speakingDone * 15)

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
  examScore = 0,
): TrackRadar {
  const chunksScore = Math.min(100, chunkCount * 12)
  const listeningScore = Math.min(100, Math.round((examScore / 990) * 100))
  const grammarScore = Math.min(100, cardsDone * 3)
  const readingScore = Math.min(100, Math.round((examScore / 990) * 100))
  const vocabScore = Math.min(100, cardsDone * 2)

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
      score: listeningScore,
      fullMark: 100,
      description: 'Part 1~4 圖片、簡短對話與廣播訊息',
      status: scoreToStatus(listeningScore),
    },
    {
      key: 'grammar',
      label: 'Part 5 文法結構',
      score: grammarScore,
      fullMark: 100,
      description: '詞性填空、連接詞、主被動時態',
      status: scoreToStatus(grammarScore),
    },
    {
      key: 'reading',
      label: '長文閱讀速讀',
      score: readingScore,
      fullMark: 100,
      description: 'Part 7 雙篇/三篇閱讀快速定位細節',
      status: scoreToStatus(readingScore),
    },
    {
      key: 'vocab',
      label: '核心商務字彙',
      score: vocabScore,
      fullMark: 100,
      description: '證書級距（Orange→Gold）高頻單字',
      status: scoreToStatus(vocabScore),
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

/**
 * 計算微積分專題多維能力雷達 (5 維：極限連續、導數切線、黎曼定積分、微積分基本定理、泰勒級數逼近)
 */
export function computeCalculusRadar(
  currentTheta = 0.0,
  solvedCount = 0,
  labExploredCount = 0,
): TrackRadar {
  const thetaBonus = Math.round(currentTheta * 15)
  const limitScore = Math.min(100, Math.max(0, solvedCount * 12 + labExploredCount * 5 + thetaBonus))
  const derivativeScore = Math.min(100, Math.max(0, solvedCount * 15 + labExploredCount * 4 + thetaBonus))
  const integralScore = Math.min(
    100,
    Math.max(0, solvedCount * 12 + labExploredCount * 10 + thetaBonus),
  )
  const seriesScore = Math.min(100, Math.max(0, solvedCount * 8 + labExploredCount * 4 + thetaBonus))
  const ftcScore = Math.min(100, Math.max(0, Math.round((derivativeScore + integralScore) / 2)))

  const dimensions: RadarDimension[] = [
    {
      key: 'limits',
      label: '極限與連續性 (ε-δ)',
      score: limitScore,
      fullMark: 100,
      description: '極限逼近、左右極限、連續性與漸近線判斷',
      status: scoreToStatus(limitScore),
    },
    {
      key: 'derivatives',
      label: '導數與切線極值',
      score: derivativeScore,
      fullMark: 100,
      description: '鏈鎖律、微分幾何斜率、臨界點與凹凸反曲點',
      status: scoreToStatus(derivativeScore),
    },
    {
      key: 'integrals',
      label: '黎曼和與定積分',
      score: integralScore,
      fullMark: 100,
      description: '分割逼近、梯形/辛普森法與旋轉體體積',
      status: scoreToStatus(integralScore),
    },
    {
      key: 'ftc',
      label: '微積分基本定理 (FTC)',
      score: ftcScore,
      fullMark: 100,
      description: '累積函數面積變化率與微分/積分互逆關係',
      status: scoreToStatus(ftcScore),
    },
    {
      key: 'taylor',
      label: '泰勒級數與逼近',
      score: seriesScore,
      fullMark: 100,
      description: '多項式局部逼近、收斂半徑與拉格朗日餘項',
      status: scoreToStatus(seriesScore),
    },
  ]

  const averageScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  )
  const sorted = [...dimensions].sort((a, b) => b.score - a.score)

  return {
    track: 'calculus',
    trackName: '∫ 微積分互動專題 (Calculus)',
    dimensions,
    averageScore,
    strongestDimension: sorted[0],
    weakestDimension: sorted[sorted.length - 1],
  }
}

/**
 * 物理題目前綴與領域分類器
 */
function classifyPhysicsQuestion(qId: string): 'mechanics' | 'thermo' | 'waves' | 'electromagnetism' | 'modern' {
  if (qId.includes('g7-u2') || qId.includes('g8-u1') || qId.includes('g8-u2') || qId.includes('optics') || qId.includes('wave') || qId.includes('sound') || qId.includes('light') || qId.includes('lens') || qId.includes('slit')) return 'waves'
  if (qId.includes('g7-u3') || qId.includes('thermo') || qId.includes('heat') || qId.includes('gas-law') || qId.includes('g12-u1')) return 'thermo'
  if (qId.includes('g9-u2') || qId.includes('g12-u2') || qId.includes('g12-u3') || qId.includes('circuit') || qId.includes('ohm') || qId.includes('em') || qId.includes('magnetic') || qId.includes('induction')) return 'electromagnetism'
  if (qId.includes('g12-u4') || qId.includes('g12-u5') || qId.includes('g12-u6') || qId.includes('modern') || qId.includes('quantum') || qId.includes('photoelectric') || qId.includes('bohr')) return 'modern'
  return 'mechanics'
}

/**
 * 計算臺灣物理多維能力雷達 (力學、熱學、波動光學、電磁學、近代物理)
 */
export function computePhysicsRadar(
  completedQuestions: string[] = [],
  examScores: Record<string, number> = {},
  labCompleted: string[] = [],
): TrackRadar {
  const counts = { mechanics: 0, thermo: 0, waves: 0, electromagnetism: 0, modern: 0 }
  completedQuestions.forEach((qid) => {
    counts[classifyPhysicsQuestion(qid)]++
  })

  const examValues = Object.values(examScores)
  const examAvg = examValues.length > 0 ? examValues.reduce((a, b) => a + b, 0) / examValues.length : 0
  const examScoreBonus = Math.round((examAvg / 100) * 25)

  const mechanicsBase = Math.min(100, counts.mechanics * 8 + (labCompleted.includes('projectile') || labCompleted.includes('shm') ? 20 : 0) + examScoreBonus)
  const thermoBase = Math.min(100, counts.thermo * 10 + (labCompleted.includes('buoyancy') ? 15 : 0) + examScoreBonus)
  const wavesBase = Math.min(100, counts.waves * 10 + (labCompleted.includes('optics') ? 20 : 0) + examScoreBonus)
  const emBase = Math.min(100, counts.electromagnetism * 10 + (labCompleted.includes('circuit') ? 20 : 0) + examScoreBonus)
  const modernBase = Math.min(100, counts.modern * 12 + examScoreBonus)

  const dimensions: RadarDimension[] = [
    {
      key: 'mechanics',
      label: '力學與運動定律',
      score: mechanicsBase,
      fullMark: 100,
      description: '斜拋、牛頓定律、動量與力學能守恆、SHM',
      status: scoreToStatus(mechanicsBase),
    },
    {
      key: 'thermo',
      label: '熱學與分子動力論',
      score: thermoBase,
      fullMark: 100,
      description: '理想氣體狀態方程式、熱力學第一定律與氣體動能',
      status: scoreToStatus(thermoBase),
    },
    {
      key: 'waves',
      label: '波動與幾何物理光學',
      score: wavesBase,
      fullMark: 100,
      description: '波的反射折射干涉繞射、司乃耳定律、雙狹縫實驗',
      status: scoreToStatus(wavesBase),
    },
    {
      key: 'electromagnetism',
      label: '電磁學與電路分析',
      score: emBase,
      fullMark: 100,
      description: '庫侖定律、克希荷夫電路、勞侖茲力與法拉第電磁感應',
      status: scoreToStatus(emBase),
    },
    {
      key: 'modern',
      label: '近代物理與量子現象',
      score: modernBase,
      fullMark: 100,
      description: '光電效應、物質波、波耳原子模型與核反應',
      status: scoreToStatus(modernBase),
    },
  ]

  const averageScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  )
  const sorted = [...dimensions].sort((a, b) => b.score - a.score)

  return {
    track: 'physics',
    trackName: '⚛️ 臺灣物理 (國中+高中)',
    dimensions,
    averageScore,
    strongestDimension: sorted[0],
    weakestDimension: sorted[sorted.length - 1],
  }
}

/**
 * 化學題目前綴與領域分類器
 */
function classifyChemistryQuestion(qId: string): 'structure' | 'stoichiometry' | 'equilibrium' | 'acid_redox' | 'organic' {
  if (qId.includes('g7-u1') || qId.includes('g8-u1') || qId.includes('g10-u1') || qId.includes('g11-u3') || qId.includes('periodic') || qId.includes('vsepr') || qId.includes('hybrid')) return 'structure'
  if (qId.includes('g7-u2') || qId.includes('g8-u2') || qId.includes('g10-u2') || qId.includes('g11-u1') || qId.includes('g11-u2') || qId.includes('gas') || qId.includes('solubility')) return 'stoichiometry'
  if (qId.includes('g11-u4') || qId.includes('g11-u5') || qId.includes('rate') || qId.includes('equilibrium') || qId.includes('lechatelier') || qId.includes('ksp')) return 'equilibrium'
  if (qId.includes('g8-u4') || qId.includes('g9-u1') || qId.includes('g10-u4') || qId.includes('g12-u1') || qId.includes('g12-u2') || qId.includes('g12-u4') || qId.includes('g12-u5') || qId.includes('acid') || qId.includes('titration') || qId.includes('buffer') || qId.includes('redox') || qId.includes('faraday') || qId.includes('battery')) return 'acid_redox'
  if (qId.includes('g9-u2') || qId.includes('g9-u3') || qId.includes('g12-u6') || qId.includes('organic') || qId.includes('polymer') || qId.includes('ester')) return 'organic'
  return 'structure'
}

/**
 * 計算臺灣化學多維能力雷達 (物質構造、化學計量、化學平衡與動力學、酸鹼電化學、有機化學)
 */
export function computeChemistryRadar(
  completedQuestions: string[] = [],
  examScores: Record<string, number> = {},
  labCompleted: string[] = [],
): TrackRadar {
  const counts = { structure: 0, stoichiometry: 0, equilibrium: 0, acid_redox: 0, organic: 0 }
  completedQuestions.forEach((qid) => {
    counts[classifyChemistryQuestion(qid)]++
  })

  const examValues = Object.values(examScores)
  const examAvg = examValues.length > 0 ? examValues.reduce((a, b) => a + b, 0) / examValues.length : 0
  const examScoreBonus = Math.round((examAvg / 100) * 25)

  const structureBase = Math.min(100, counts.structure * 8 + (labCompleted.includes('periodic') || labCompleted.includes('vsepr') ? 20 : 0) + examScoreBonus)
  const stoichiometryBase = Math.min(100, counts.stoichiometry * 8 + (labCompleted.includes('gas') || labCompleted.includes('solubility') ? 20 : 0) + examScoreBonus)
  const equilibriumBase = Math.min(100, counts.equilibrium * 10 + examScoreBonus)
  const acidRedoxBase = Math.min(100, counts.acid_redox * 8 + (labCompleted.includes('titration') ? 20 : 0) + examScoreBonus)
  const organicBase = Math.min(100, counts.organic * 10 + examScoreBonus)

  const dimensions: RadarDimension[] = [
    {
      key: 'structure',
      label: '物質構造與化學鍵',
      score: structureBase,
      fullMark: 100,
      description: '週期表規律、電子排列、VSEPR 分子幾何與混成軌域',
      status: scoreToStatus(structureBase),
    },
    {
      key: 'stoichiometry',
      label: '化學計量與氣體溶液',
      score: stoichiometryBase,
      fullMark: 100,
      description: '莫耳數反應式計量、理想氣體定律與溶液依數性',
      status: scoreToStatus(stoichiometryBase),
    },
    {
      key: 'equilibrium',
      label: '反應速率與化學平衡',
      score: equilibriumBase,
      fullMark: 100,
      description: '碰撞學說、活化能、勒沙特列平衡移動與 Ksp',
      status: scoreToStatus(equilibriumBase),
    },
    {
      key: 'acid_redox',
      label: '酸鹼滴定與電化學電池',
      score: acidRedoxBase,
      fullMark: 100,
      description: 'pH 緩衝溶液、滴定曲線、氧化數與法拉第電解定律',
      status: scoreToStatus(acidRedoxBase),
    },
    {
      key: 'organic',
      label: '有機化學與生物聚合物',
      score: organicBase,
      fullMark: 100,
      description: '官能基異構物命名、取代加成酯化反應與高分子聚合物',
      status: scoreToStatus(organicBase),
    },
  ]

  const averageScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  )
  const sorted = [...dimensions].sort((a, b) => b.score - a.score)

  return {
    track: 'chemistry',
    trackName: '🧪 臺灣化學 (國中+高中)',
    dimensions,
    averageScore,
    strongestDimension: sorted[0],
    weakestDimension: sorted[sorted.length - 1],
  }
}

/**
 * 計算台灣華語・繁體中文多維能力雷達 (Chinese for Japanese Speakers Track Radar)
 */
export function computeChineseRadar(
  xp: number,
  masteredFalseFriendsCount: number,
  masteredSignalsCount: number,
  completedDialoguesCount: number,
  errorQuestionsCount: number = 0,
): TrackRadar {
  const tonesBase = Math.min(100, Math.round(xp * 0.4) + 20)
  const falseFriendsBase = Math.min(100, masteredFalseFriendsCount * 10 + (xp > 50 ? 20 : 0))
  const signalsBase = Math.min(100, masteredSignalsCount * 15 + (xp > 100 ? 25 : 0))
  const dialogueBase = Math.min(100, completedDialoguesCount * 25 + (xp > 30 ? 20 : 0))
  const tocflBase = Math.max(10, Math.min(100, Math.round(xp * 0.5) - errorQuestionsCount * 5 + 30))

  const dimensions: RadarDimension[] = [
    {
      key: 'tones_pronunciation',
      label: '四聲聲調與拼音發音',
      score: tonesBase,
      fullMark: 100,
      description: '五度標記法四聲音高曲線、有気音與そり舌音發音精確度',
      status: scoreToStatus(tonesBase),
    },
    {
      key: 'false_friends',
      label: '日中同形異義語辨析',
      score: falseFriendsBase,
      fullMark: 100,
      description: '手紙・汽車・勉強・大丈夫等高頻日中偽友詞避坑掌握度',
      status: scoreToStatus(falseFriendsBase),
    },
    {
      key: 'grammar_signals',
      label: '3秒文法動作訊號樹',
      score: signalsBase,
      fullMark: 100,
      description: '把字句、被字句、了1/了2、是…的焦點強調構文秒殺法則',
      status: scoreToStatus(signalsBase),
    },
    {
      key: 'practical_dialogue',
      label: '生活情境對話與跟讀',
      score: dialogueBase,
      fullMark: 100,
      description: '手搖飲微糖去冰、士林夜市點餐、MRT捷運與超商咖啡對話',
      status: scoreToStatus(dialogueBase),
    },
    {
      key: 'tocfl_competency',
      label: 'TOCFL 華語文測驗實力',
      score: tocflBase,
      fullMark: 100,
      description: 'TOCFL A1/A2 聽力理解、詞彙語法與閱讀理解應試落點',
      status: scoreToStatus(tocflBase),
    },
  ]

  const averageScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  )
  const sorted = [...dimensions].sort((a, b) => b.score - a.score)

  return {
    track: 'zh',
    trackName: '🇹🇼 台湾華語 (日本語で学ぶ)',
    dimensions,
    averageScore,
    strongestDimension: sorted[0],
    weakestDimension: sorted[sorted.length - 1],
  }
}
