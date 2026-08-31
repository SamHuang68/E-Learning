/**
 * 臺灣 108 課綱化學 (Chemistry Track) 完整課程架構與型別定義
 * 涵蓋：
 * - 國中理化化學領域 G7~G9 (國中會考 CAP 核心)
 * - 高中必修化學 G10 (學測 GSAT 核心)
 * - 高中選修化學 G11~G12 (分科測驗 AST 核心)
 */

export type ChemistryGradeId = 'g7' | 'g8' | 'g9' | 'g10' | 'g11' | 'g12'

export type ChemistryStage = 'junior' | 'senior'

export type ChemistryBand = '國中必修' | '高中必修' | '選修'

export type ChemistryTargetExam = '國中教育會考 (CAP)' | '學科能力測驗 (GSAT)' | '分科測驗 (AST)'

/**
 * 108 課綱化學五大核心主軸 (Strands)
 * 1. matter_structure: 物質的組成與構造 (原子、分子、晶體與化學鍵)
 * 2. reactions: 化學反應與化學計量 (反應式、質量守恆、反應熱與基礎反應類型)
 * 3. equilibrium_kinetics: 物質狀態、反應速率與化學平衡 (氣體、溶液、動力學、動態平衡)
 * 4. electrochemistry: 酸鹼鹽與電化學 (酸鹼解離、滴定、氧化還原、電池、電解)
 * 5. organic: 有機化合物與生物分子 (官能基、有機反應、聚合物與綠色永續化學)
 */
export type ChemistryStrand =
  | 'matter_structure'
  | 'reactions'
  | 'equilibrium_kinetics'
  | 'electrochemistry'
  | 'organic'

export type ChemistryQuestionType = 'choice' | 'multi-choice' | 'fill'

export interface ChemistryQuestion {
  /** 題目唯一識別碼 */
  id: string
  /** 題目標題或簡述 */
  title: string
  /** 所屬化學主軸 */
  strand: ChemistryStrand
  /** 題型：單選、多選或計算填充 */
  type: ChemistryQuestionType
  /** 難易度星級 1~5 */
  difficulty: 1 | 2 | 3 | 4 | 5
  /** 題目本文 (支援 Markdown 與 KaTeX 公式) */
  question: string
  /** 選項列表 (單選與多選題必填) */
  options?: string[]
  /** 正確答案：單選/填充為字串或數值，多選為選項陣列 (如 ['A', 'C', 'D']) */
  answer: string | number | string[]
  /** 詳細步驟解析與觀念剖析 */
  solution: string
  /** 提示技巧或考點指引 */
  hint?: string
  /** 108 課綱核心素養與評量指標 (e.g. 探究與實作、科學論證、圖表判讀) */
  competency?: string
  /** 素養標籤 */
  tags?: string[]
}

export interface ChemistryUnit {
  /** 單元序號 */
  id: number
  /** 單元鍵名代碼 */
  key: string
  /** 單元完整名稱 */
  title: string
  /** 單元副標題或學習重點 */
  subtitle: string
  /** 所屬化學主題主軸 */
  strand: ChemistryStrand
  /** 課程層級分類 (國中必修 / 高中必修 / 選修) */
  band: string
  /** 目標升學考試對象 */
  targetExam: ChemistryTargetExam
  /** 核心觀念與 KaTeX 重點公式集 */
  concepts: string[]
  /** 108 課綱建議實驗或探究實作 */
  suggestedLab: string
  /** 單元練習與素養評量題目庫 */
  questions: ChemistryQuestion[]
  /** 單元總分 (預設 100) */
  totalPoints: number
}

export interface ChemistryGradeInfo {
  /** 年級識別代碼 (g7~g12) */
  id: ChemistryGradeId
  /** 階段名稱 (junior | senior) */
  stage: ChemistryStage
  /** 年級全稱 */
  name: string
  /** 英文名稱 */
  nameEn: string
  /** 課程屬性類別 */
  band: string
  /** 課程概述 */
  description: string
  /** 目標大考 */
  targetExam: ChemistryTargetExam
  /** 包含單元清單 */
  units: ChemistryUnit[]
  /** 關聯的探究實驗清單 */
  labs: Array<{ id: string; name: string; description: string }>
}

/** 108 課綱五大主題中文名稱對照表 */
export const CHEMISTRY_STRAND_NAMES: Record<ChemistryStrand, string> = {
  matter_structure: '物質的組成與構造',
  reactions: '化學反應與計量',
  equilibrium_kinetics: '物質狀態與化學平衡',
  electrochemistry: '酸鹼平衡與電化學',
  organic: '有機化學與化學應用',
}

import { G7_CHEMISTRY_UNITS, G7_CHEMISTRY_LABS } from './g7'
import { G8_CHEMISTRY_UNITS, G8_CHEMISTRY_LABS } from './g8'
import { G9_CHEMISTRY_UNITS, G9_CHEMISTRY_LABS } from './g9'
import { G10_CHEMISTRY_UNITS, G10_CHEMISTRY_LABS } from './g10'
import { G11_CHEMISTRY_UNITS, G11_CHEMISTRY_LABS } from './g11'
import { G12_CHEMISTRY_UNITS, G12_CHEMISTRY_LABS } from './g12'

/**
 * 完整國中與高中化學六個年級學程資料庫
 */
export const CHEMISTRY_GRADES: Record<ChemistryGradeId, ChemistryGradeInfo> = {
  g7: {
    id: 'g7',
    stage: 'junior',
    name: '國中七年級 (理化水溶液篇)',
    nameEn: 'Grade 7 Junior Chemistry: Solutions',
    band: '國中必修',
    description: '涵蓋水溶液濃度計算、溶解度曲線、過飽和結晶與混合物物理分離純化技巧。',
    targetExam: '國中教育會考 (CAP)',
    units: G7_CHEMISTRY_UNITS,
    labs: G7_CHEMISTRY_LABS,
  },
  g8: {
    id: 'g8',
    stage: 'junior',
    name: '國中八年級 (理化化學核心篇)',
    nameEn: 'Grade 8 Junior Chemistry: Reactions & Periodic Table',
    band: '國中必修',
    description: '涵蓋原子結構、元素週期表、化學反應式計量、質量守恆、氧化還原與常見酸鹼鹽。',
    targetExam: '國中教育會考 (CAP)',
    units: G8_CHEMISTRY_UNITS,
    labs: G8_CHEMISTRY_LABS,
  },
  g9: {
    id: 'g9',
    stage: 'junior',
    name: '國中九年級 (理化化學應用篇)',
    nameEn: 'Grade 9 Junior Chemistry: Electrolytes & Organics',
    band: '國中必修',
    description: '涵蓋電解質導電性、離子電中性、有機化合物、酯化與皂化反應、生活塑膠聚合物。',
    targetExam: '國中教育會考 (CAP)',
    units: G9_CHEMISTRY_UNITS,
    labs: G9_CHEMISTRY_LABS,
  },
  g10: {
    id: 'g10',
    stage: 'senior',
    name: '高中十年級 (高一必修化學)',
    nameEn: 'Grade 10 Compulsory Chemistry',
    band: '高中必修',
    description: '涵蓋物質組成、原子構造與週期表、化學鍵結、化學計量、生活常見反應與綠色化學永續議題。',
    targetExam: '學科能力測驗 (GSAT)',
    units: G10_CHEMISTRY_UNITS,
    labs: G10_CHEMISTRY_LABS,
  },
  g11: {
    id: 'g11',
    stage: 'senior',
    name: '高中十一年級 (選修化學：狀態與平衡)',
    nameEn: 'Grade 11 Elective Chemistry: States & Equilibrium',
    band: '選修',
    description: '涵蓋氣體定律、相圖與溶液依數性、原子軌域混成與分子幾何、化學動力學與動態平衡常數。',
    targetExam: '分科測驗 (AST)',
    units: G11_CHEMISTRY_UNITS,
    labs: G11_CHEMISTRY_LABS,
  },
  g12: {
    id: 'g12',
    stage: 'senior',
    name: '高中十二年級 (選修化學：酸鹼電化學與有機)',
    nameEn: 'Grade 12 Elective Chemistry: Acid-Base, Electrochemistry & Organic',
    band: '選修',
    description: '涵蓋酸鹼鹽水解、緩衝溶液、溶度積沉澱、氧化還原電極電位、法拉第電解定律與有機官能基反應。',
    targetExam: '分科測驗 (AST)',
    units: G12_CHEMISTRY_UNITS,
    labs: G12_CHEMISTRY_LABS,
  },
}

/** 取得所有年級代碼清單 */
export function getAllChemistryGradeIds(): ChemistryGradeId[] {
  return ['g7', 'g8', 'g9', 'g10', 'g11', 'g12']
}

/** 取得特定學段 (junior | senior) 的年級清單 */
export function getChemistryGradesByStage(stage: ChemistryStage): ChemistryGradeId[] {
  switch (stage) {
    case 'junior':
      return ['g7', 'g8', 'g9']
    case 'senior':
      return ['g10', 'g11', 'g12']
  }
}

/** 取得特定年級完整資訊 */
export function getChemistryGradeInfo(gradeId: ChemistryGradeId): ChemistryGradeInfo {
  const grade = CHEMISTRY_GRADES[gradeId]
  if (!grade) {
    throw new Error(`Invalid chemistry grade id: ${gradeId}`)
  }
  return grade
}

/** 取得特定年級中的指定單元 */
export function getChemistryGradeUnit(gradeId: ChemistryGradeId, unitId: number): ChemistryUnit {
  const grade = getChemistryGradeInfo(gradeId)
  const unit = grade.units.find((u) => u.id === unitId)
  if (!unit) {
    throw new Error(`Unit ${unitId} not found in chemistry grade ${gradeId}`)
  }
  return unit
}

/** 取得全學程所有單元完整清單 */
export function getAllChemistryUnits(): ChemistryUnit[] {
  return [
    ...G7_CHEMISTRY_UNITS,
    ...G8_CHEMISTRY_UNITS,
    ...G9_CHEMISTRY_UNITS,
    ...G10_CHEMISTRY_UNITS,
    ...G11_CHEMISTRY_UNITS,
    ...G12_CHEMISTRY_UNITS,
  ]
}
