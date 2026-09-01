/**
 * 教育遊戲化與動機激勵引擎 (Gamification & Motivation Engine)
 * 實作難度加權 XP、Combo 連擊倍率、等級進階、連勝保護 (Streak Freeze) 與三軌微認證徽章。
 */

export type BadgeCategory = 'math' | 'calculus' | 'physics' | 'chemistry' | 'ja' | 'en' | 'zh' | 'universal'

export type Badge = {
  id: string
  title: string
  description: string
  icon: string
  category: BadgeCategory
  xpReward: number
  unlockedAt?: string
}

export const BADGE_CATALOG: Badge[] = [
  // 1. 全域 / SRS 記憶徽章
  {
    id: 'badge-first-step',
    title: '啟程第一步',
    description: '完成首次題目練習或卡片複習',
    icon: '🌱',
    category: 'universal',
    xpReward: 50,
  },
  {
    id: 'badge-streak-7',
    title: '一週恆心勳章',
    description: '連續學習達 7 天，建立穩定微學習習慣',
    icon: '🔥',
    category: 'universal',
    xpReward: 150,
  },
  {
    id: 'badge-fsrs-master',
    title: '記憶百鍊大師',
    description: '累積完成 50 次 FSRS 間隔提取複習',
    icon: '🧠',
    category: 'universal',
    xpReward: 200,
  },
  {
    id: 'badge-combo-10',
    title: '勢如破竹 10 連擊',
    description: '在單次練習中達成連續 10 題正確',
    icon: '⚡',
    category: 'universal',
    xpReward: 100,
  },

  // 2. 臺灣數學模組徽章
  {
    id: 'badge-math-balance',
    title: '天平平衡宗師',
    description: '透過等量公理成功解開 5 道一元一次方程式',
    icon: '⚖️',
    category: 'math',
    xpReward: 120,
  },
  {
    id: 'badge-math-algebra-tiles',
    title: '代數幾何拼圖手',
    description: '完成二次多項式與乘法公式之面積積木拼裝',
    icon: '🧩',
    category: 'math',
    xpReward: 150,
  },
  {
    id: 'badge-math-matrix-warp',
    title: '高維空間領航員',
    description: '探索 2D 矩陣線性變換與行列式面積縮放',
    icon: '🌀',
    category: 'math',
    xpReward: 180,
  },
  {
    id: 'badge-math-riemann-limit',
    title: '阿基米德極限切片',
    description: '親手調節黎曼和切片數逼近連續曲線定積分',
    icon: '📈',
    category: 'math',
    xpReward: 200,
  },

  // 3. 微積分專題徽章
  {
    id: 'badge-calc-riemann-pro',
    title: '黎曼和連續切片宗師',
    description: '透過無限細分切片逼近定積分極限',
    icon: '🍩',
    category: 'calculus',
    xpReward: 200,
  },

  // 4. 物理模組徽章
  {
    id: 'badge-phys-projectile',
    title: '力學拋體領航者',
    description: '成功模擬斜拋運動並解開力學運動定律題目',
    icon: '🚀',
    category: 'physics',
    xpReward: 150,
  },
  {
    id: 'badge-phys-optics-master',
    title: '光學司乃耳之眼',
    description: '完成司乃耳折射實驗並掌握全反射臨界角',
    icon: '🌈',
    category: 'physics',
    xpReward: 150,
  },
  {
    id: 'badge-phys-circuit-pro',
    title: '歐姆與電磁探索家',
    description: '完成直流電路實驗與電磁感應分析',
    icon: '⚡',
    category: 'physics',
    xpReward: 180,
  },

  // 5. 化學模組徽章
  {
    id: 'badge-chem-periodic-explorer',
    title: '週期表元素探測手',
    description: '探索元素週期律並掌握族群電子排列',
    icon: '🔬',
    category: 'chemistry',
    xpReward: 150,
  },
  {
    id: 'badge-chem-vsepr-architect',
    title: 'VSEPR 空間幾何建築師',
    description: '建立 3D 分子空間模型並掌握混成軌域幾何',
    icon: '📐',
    category: 'chemistry',
    xpReward: 160,
  },
  {
    id: 'badge-chem-titration-pro',
    title: '酸鹼滴定鍊金術士',
    description: '完成 pH 滴定曲線模擬與緩衝溶液計算',
    icon: '🧪',
    category: 'chemistry',
    xpReward: 180,
  },

  // 6. あおば日語模組徽章
  {
    id: 'badge-ja-kana-pro',
    title: '五十音無雙',
    description: '完成清音、濁音與拗音完整發音演練',
    icon: '🌸',
    category: 'ja',
    xpReward: 100,
  },
  {
    id: 'badge-ja-signals-ace',
    title: '3 秒文法動作訊號王',
    description: '掌握補助動詞與授受動詞之情境決策樹',
    icon: '⛩️',
    category: 'ja',
    xpReward: 150,
  },

  // 7. 多益英語模組徽章
  {
    id: 'badge-toeic-chunk-master',
    title: '商務語塊直覺大師',
    description: '完成高頻商務語塊三階段跟讀與主動輸出',
    icon: '💼',
    category: 'en',
    xpReward: 150,
  },
  {
    id: 'badge-toeic-gold-seeker',
    title: '黃金證書挑戰者',
    description: '在多益模擬測驗中獲得 Blue / Gold 級距認證',
    icon: '🏆',
    category: 'en',
    xpReward: 250,
  },
  {
    id: 'badge-toeic-signals-pro',
    title: '多益3秒秒殺神手',
    description: '掌握使役動詞、動名詞與連接詞判別等秒殺破題法則',
    icon: '🎯',
    category: 'en',
    xpReward: 160,
  },

  // 7. 台湾華語（日本語母語者）模組徽章
  {
    id: 'badge-zh-tone-master',
    title: '四聲發音大師',
    description: '精通五度標記法四聲音高曲線與拼音注音對照',
    icon: '🗣️',
    category: 'zh',
    xpReward: 120,
  },
  {
    id: 'badge-zh-false-friend-ace',
    title: '偽友詞避坑達人',
    description: '完全掌握手紙、汽車、勉強、大丈夫等高頻日中同形異義語',
    icon: '⛩️',
    category: 'zh',
    xpReward: 150,
  },
  {
    id: 'badge-zh-tocfl-pass',
    title: 'TOCFL 模擬考首捷',
    description: '完成 TOCFL A1/A2 華語文能力模擬測驗並取得合格評級',
    icon: '🇹🇼',
    category: 'zh',
    xpReward: 200,
  },
]

export type GamificationState = {
  totalXp: number
  level: number
  currentCombo: number
  maxCombo: number
  streakFreezes: number // 剩餘連勝凍結券數量 (防止斷簽)
  unlockedBadgeIds: string[]
}

export function defaultGamificationState(): GamificationState {
  return {
    totalXp: 0,
    level: 1,
    currentCombo: 0,
    maxCombo: 0,
    streakFreezes: 2, // 預設提供 2 張防挫折凍結券
    unlockedBadgeIds: [],
  }
}

/**
 * 計算等級：Level = floor(sqrt(totalXp / 25)) + 1
 * Level 1: 0~24 XP, Level 2: 25~99 XP, Level 3: 100~224 XP, Level 5: 400 XP...
 */
export function calculateLevel(totalXp: number): number {
  if (totalXp <= 0) return 1
  return Math.floor(Math.sqrt(totalXp / 25)) + 1
}

/**
 * 計算升至下一級所需的經驗值進度
 */
export function calculateLevelProgress(totalXp: number): {
  currentLevel: number
  levelStartXP: number
  nextLevelXP: number
  progressPct: number
} {
  const currentLevel = calculateLevel(totalXp)
  const levelStartXP = Math.pow(currentLevel - 1, 2) * 25
  const nextLevelXP = Math.pow(currentLevel, 2) * 25
  const span = nextLevelXP - levelStartXP
  const earned = totalXp - levelStartXP
  const progressPct = span > 0 ? Math.min(100, Math.max(0, Math.round((earned / span) * 100))) : 0

  return {
    currentLevel,
    levelStartXP,
    nextLevelXP,
    progressPct,
  }
}

/**
 * 依據難度與 Combo 連擊計算獲得之經驗值 (XP)
 */
export function calculateQuestionXp(
  difficulty: 'easy' | 'medium' | 'hard' | 'challenge',
  isCorrect: boolean,
  comboCount: number,
): { xpEarned: number; multiplier: number } {
  if (!isCorrect) return { xpEarned: 2, multiplier: 1.0 } // 答錯提供 2 XP 鼓勵思考

  let base = 10
  switch (difficulty) {
    case 'easy':
      base = 10
      break
    case 'medium':
      base = 20
      break
    case 'hard':
      base = 35
      break
    case 'challenge':
      base = 50
      break
  }

  // Combo 倍率階梯
  let multiplier = 1.0
  if (comboCount >= 10) multiplier = 2.0
  else if (comboCount >= 5) multiplier = 1.5
  else if (comboCount >= 3) multiplier = 1.2

  const xpEarned = Math.round(base * multiplier)
  return { xpEarned, multiplier }
}

/**
 * 更新答題後的 Combo 與總經驗值
 */
export function recordAnswerGamification(
  state: GamificationState,
  difficulty: 'easy' | 'medium' | 'hard' | 'challenge',
  isCorrect: boolean,
): { nextState: GamificationState; xpEarned: number; leveledUp: boolean; newBadges: Badge[] } {
  const nextCombo = isCorrect ? state.currentCombo + 1 : 0
  const maxCombo = Math.max(state.maxCombo, nextCombo)
  const { xpEarned } = calculateQuestionXp(difficulty, isCorrect, nextCombo)

  const newTotalXp = state.totalXp + xpEarned
  const oldLevel = state.level
  const newLevel = calculateLevel(newTotalXp)
  const leveledUp = newLevel > oldLevel

  // 檢查是否有新解鎖徽章
  const unlockedSet = new Set(state.unlockedBadgeIds)
  const newBadges: Badge[] = []

  // 首步徽章
  if (!unlockedSet.has('badge-first-step')) {
    unlockedSet.add('badge-first-step')
    newBadges.push(BADGE_CATALOG.find((b) => b.id === 'badge-first-step')!)
  }

  // 10 連擊徽章
  if (nextCombo >= 10 && !unlockedSet.has('badge-combo-10')) {
    unlockedSet.add('badge-combo-10')
    newBadges.push(BADGE_CATALOG.find((b) => b.id === 'badge-combo-10')!)
  }

  return {
    nextState: {
      ...state,
      totalXp: newTotalXp,
      level: newLevel,
      currentCombo: nextCombo,
      maxCombo,
      unlockedBadgeIds: [...unlockedSet],
    },
    xpEarned,
    leveledUp,
    newBadges,
  }
}
