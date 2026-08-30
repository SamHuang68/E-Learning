import { G1_DATA, G2_DATA, G3_DATA } from './elementary/g1_to_g3'
import { G4_DATA, G5_DATA, G6_DATA } from './elementary/g4_to_g6'
import { G7_DATA, G8_DATA, G9_DATA } from './junior/g7_to_g9'
import { G10_DATA, G11_DATA, G12_DATA } from './senior/g10_to_g12'
import type { MathGradeId, MathGradeInfo, MathStage, MathUnit } from './curriculum'

export const ALL_MATH_GRADES: Record<MathGradeId, MathGradeInfo> = {
  g1: G1_DATA,
  g2: G2_DATA,
  g3: G3_DATA,
  g4: G4_DATA,
  g5: G5_DATA,
  g6: G6_DATA,
  g7: G7_DATA,
  g8: G8_DATA,
  g9: G9_DATA,
  g10: G10_DATA,
  g11: G11_DATA,
  g12: G12_DATA,
}

export const MATH_GRADE_LIST: MathGradeInfo[] = Object.values(ALL_MATH_GRADES)

/** 取得指定年級資料 */
export function getGradeInfo(gradeId: MathGradeId): MathGradeInfo {
  return ALL_MATH_GRADES[gradeId] ?? ALL_MATH_GRADES.g1
}

/** 取得指定年級下的指定單元 */
export function getGradeUnit(gradeId: MathGradeId, unitId: number): MathUnit {
  const grade = getGradeInfo(gradeId)
  return grade.units.find((u) => u.id === unitId) ?? grade.units[0]
}

/** 根據 Stage 取得該學段所有年級 */
export function getGradesInStage(stage: MathStage): MathGradeInfo[] {
  return MATH_GRADE_LIST.filter((g) => g.stage === stage)
}
