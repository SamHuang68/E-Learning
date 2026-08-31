import React from 'react'

type Props = {
  comboCount: number
  totalXp: number
  level: number
  recentXpGained?: number
}

/**
 * 連擊與經驗值即時激勵橫幅 (ComboBanner)
 */
export const ComboBanner: React.FC<Props> = ({
  comboCount,
  totalXp,
  level,
  recentXpGained,
}) => {
  if (comboCount < 2 && !recentXpGained) {
    return null
  }

  const multiplier = comboCount >= 10 ? 2.0 : comboCount >= 5 ? 1.5 : comboCount >= 3 ? 1.2 : 1.0

  return (
    <div className={`combo-banner ${comboCount >= 5 ? 'super-combo' : ''}`}>
      <div className="combo-left">
        <span className="combo-icon">⚡</span>
        <span className="combo-text">
          連擊 <strong>{comboCount} Combo!</strong>
        </span>
        {multiplier > 1.0 && <span className="multiplier-pill">{multiplier}x XP</span>}
      </div>

      <div className="combo-right">
        {recentXpGained && recentXpGained > 0 && (
          <span className="xp-gain-anim">+{recentXpGained} XP</span>
        )}
        <span className="level-badge">
          Lv.{level} · {totalXp} XP
        </span>
      </div>
    </div>
  )
}
