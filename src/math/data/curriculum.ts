/**
 * 臺灣 108 課綱 K-12 數學課程架構定義
 * 涵蓋：國小 1~6 年級、國中 7~9 年級、高中 10~12 年級（數A/數B/數甲/數乙）
 */

export type MathStage = 'elementary' | 'junior' | 'senior'

export type MathGradeId =
  | 'g1'
  | 'g2'
  | 'g3'
  | 'g4'
  | 'g5'
  | 'g6'
  | 'g7'
  | 'g8'
  | 'g9'
  | 'g10'
  | 'g11'
  | 'g12'

export type MathStrand =
  | 'number' // 數與量
  | 'algebra' // 代數與方程式
  | 'geometry' // 幾何與空間形狀
  | 'function' // 坐標、函數與微積分
  | 'statistics' // 統計與機率

export type MathQuestionType = 'choice' | 'multi-choice' | 'fill' | 'step'

export type MathQuestion = {
  id: string
  title: string
  strand: MathStrand
  type: MathQuestionType
  difficulty: 1 | 2 | 3 | 4 | 5
  question: string
  options?: string[]
  answer: string | number | number[]
  solution: string
  hint?: string
  competency?: string // 108 課綱核心素養說明
  interactiveLab?: string // 關聯的互動實驗室教具
}

export type MathUnit = {
  id: number
  key: string
  title: string
  subtitle: string
  strand: MathStrand
  concepts: string[]
  questions: MathQuestion[]
  suggestedLab?: string
  totalPoints: number
}

export type MathGradeInfo = {
  id: MathGradeId
  stage: MathStage
  name: string
  nameEn: string
  band: string
  description: string
  targetExam?: string // e.g. 國中教育會考、學科能力測驗
  units: MathUnit[]
  labs: Array<{ id: string; name: string; description: string }>
}

/**
 * 12 個年級的基本資訊與目標對齊
 */
export const MATH_GRADES: Record<MathGradeId, {
  stage: MathStage
  name: string
  nameEn: string
  band: string
  description: string
  targetExam?: string
}> = {
  g1: {
    stage: 'elementary',
    name: '國小一年級',
    nameEn: 'Grade 1',
    band: '國小低年級',
    description: '數到 100、十進位位值、基礎加減法、分裝概念、時鐘整點與半點。',
  },
  g2: {
    stage: 'elementary',
    name: '國小二年級',
    nameEn: 'Grade 2',
    band: '國小低年級',
    description: '二位數直式加減、九九乘法表、長度公分公尺、平面圖形與角。',
  },
  g3: {
    stage: 'elementary',
    name: '國小三年級',
    nameEn: 'Grade 3',
    band: '國小中年級',
    description: '萬以內四則運算、除法直式、分數初步、一位小數、周長與面積、量角器。',
  },
  g4: {
    stage: 'elementary',
    name: '國小四年級',
    nameEn: 'Grade 4',
    band: '國小中年級',
    description: '億以內大數、多位數乘除、帶分數與假分數、二位小數、垂直平行與角度旋轉。',
  },
  g5: {
    stage: 'elementary',
    name: '國小五年級',
    nameEn: 'Grade 5',
    band: '國小高年級',
    description: '因數倍數、公因數公倍數、異分母分數加減乘法、扇形面積、體積表面積、未知數 x。',
  },
  g6: {
    stage: 'elementary',
    name: '國小六年級',
    nameEn: 'Grade 6',
    band: '國小高年級',
    description: '質因數分解、分數除法、比與比值、圓面積與扇形、柱體體積表面積、基準量與速率。',
  },
  g7: {
    stage: 'junior',
    name: '國中七年級 (國一)',
    nameEn: 'Grade 7',
    band: '國中基礎',
    description: '負數與數線、整數四則與科學記號、一元一次方程式、二元一次聯立方程式、直角坐標。',
    targetExam: '國中教育會考 (CAP)',
  },
  g8: {
    stage: 'junior',
    name: '國中八年級 (國二)',
    nameEn: 'Grade 8',
    band: '國中進階',
    description: '乘法公式、多項式四則、二次方根與畢氏定理、因式分解、一元二次方程式、三角形全等。',
    targetExam: '國中教育會考 (CAP)',
  },
  g9: {
    stage: 'junior',
    name: '國中九年級 (國三)',
    nameEn: 'Grade 9',
    band: '國中衝刺',
    description: '相似形與連比、圓形幾何性質、三角形三心 (外心/內心/重心)、二次函數與極值、統計機率。',
    targetExam: '國中教育會考 (CAP)',
  },
  g10: {
    stage: 'senior',
    name: '高中十年級 (高一必修)',
    nameEn: 'Grade 10',
    band: '高中必修',
    description: '實數與算幾不等式、多項式函數 (除法/餘式/勘根)、指數與對數、直線與圓、數據分析。',
    targetExam: '學科能力測驗 (GSAT)',
  },
  g11: {
    stage: 'senior',
    name: '高中十一年級 (高二 數A/數B)',
    nameEn: 'Grade 11',
    band: '高中選組',
    description: '廣義三角函數、空間向量與平面直線、二階矩陣與線性變換、條件機率與貝氏定理。',
    targetExam: '學科能力測驗 (GSAT)',
  },
  g12: {
    stage: 'senior',
    name: '高中十二年級 (高三 數甲/數乙)',
    nameEn: 'Grade 12',
    band: '高中選修',
    description: '極限與連續、微分學 (導函數/切線/極值)、定積分與面積、複數極式、二次曲線。',
    targetExam: '分科測驗 (AST) / 學測總複習',
  },
}

/** 取得特定學段包含的年級列表 */
export function getGradesByStage(stage: MathStage): MathGradeId[] {
  switch (stage) {
    case 'elementary':
      return ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
    case 'junior':
      return ['g7', 'g8', 'g9']
    case 'senior':
      return ['g10', 'g11', 'g12']
  }
}

/** 臺灣 108 課綱五大主題名稱對應 */
export const STRAND_NAMES: Record<MathStrand, string> = {
  number: '數與量',
  algebra: '代數與方程式',
  geometry: '空間與幾何',
  function: '函數與分析',
  statistics: '資料與機率',
}
