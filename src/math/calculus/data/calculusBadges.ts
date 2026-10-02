import type { CalculusLabMode } from '../types'
import { CALCULUS_PROBLEMS } from './calculusProblems'

/**
 * 微積分專屬微認證勳章庫
 */

export interface CalculusBadge {
  id: string
  title: string
  description: string
  icon: string
  condition: string
  /** A correct assessment answer in this mode earns the badge. No extra XP is awarded. */
  targetMode?: CalculusLabMode
}

export const CALCULUS_BADGES: CalculusBadge[] = [
  {
    id: 'badge-calc-tangent-seeker',
    title: '萊布尼茲切線之刃',
    description: '答對割線與切線模式的能力挑戰，記錄你的微分練習成果。',
    icon: '🗡️',
    condition: '答對至少一題割線與切線模式的能力挑戰',
    targetMode: 'tangent_secant',
  },
  {
    id: 'badge-calc-riemann-master',
    title: '阿基米德曲面精算師',
    description: '答對黎曼和模式的能力挑戰，記錄你的積分練習成果。',
    icon: '📊',
    condition: '答對至少一題黎曼和模式的能力挑戰',
    targetMode: 'riemann_sum',
  },
  {
    id: 'badge-calc-newton-hunter',
    title: '牛頓拉弗森獵根者',
    description: '答對牛頓法求根模式的能力挑戰，記錄你的迭代求根練習成果。',
    icon: '🎯',
    condition: '答對至少一題牛頓法求根模式的能力挑戰',
    targetMode: 'newton_slope_field',
  },
  {
    id: 'badge-calc-chain-rule-ace',
    title: '連鎖律千層酥破壁者',
    description: '連鎖律勳章尚未開放；目前不計入可解鎖總數。',
    icon: '⚡',
    condition: '尚未開放',
  },
]

export const AVAILABLE_CALCULUS_BADGES = CALCULUS_BADGES.filter((badge) => badge.targetMode)

/** Reuse existing learner-owned answers so badges survive dismissal, reload and route changes. */
export function getEarnedCalculusBadges(completedQuestions: readonly string[]): CalculusBadge[] {
  const completed = new Set(completedQuestions)
  const completedModes = new Set(
    CALCULUS_PROBLEMS.filter((problem) => completed.has(problem.id)).map((problem) => problem.targetMode),
  )
  return AVAILABLE_CALCULUS_BADGES.filter((badge) => completedModes.has(badge.targetMode!))
}
