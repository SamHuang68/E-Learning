/**
 * 微積分專屬微認證勳章庫
 */

export interface CalculusBadge {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
  condition: string
}

export const CALCULUS_BADGES: CalculusBadge[] = [
  {
    id: 'badge-calc-tangent-seeker',
    title: '萊布尼茲切線之刃',
    description: '在畫布中將割線 Δx 逼近至 0.001 以下，成功捕捉切線瞬時變化率',
    icon: '🗡️',
    xpReward: 150,
    condition: 'deltaX < 0.001',
  },
  {
    id: 'badge-calc-riemann-master',
    title: '阿基米德曲面精算師',
    description: '使用自適應辛普森與黎曼和切片將定積分誤差縮減至 0.01% 以內',
    icon: '📊',
    xpReward: 200,
    condition: 'slicesN >= 100 && errorPct < 0.01',
  },
  {
    id: 'badge-calc-newton-hunter',
    title: '牛頓拉弗森獵根者',
    description: '在 4 步迭代內成功收斂非線性高階方程式之實數根',
    icon: '🎯',
    xpReward: 180,
    condition: 'newtonSteps <= 4 && converged',
  },
  {
    id: 'badge-calc-chain-rule-ace',
    title: '連鎖律千層酥破壁者',
    description: '連續無誤解開 3 道三重複合函數之符號鏈式求導題',
    icon: '⚡',
    xpReward: 250,
    condition: 'chain_rule_combo >= 3',
  },
]
