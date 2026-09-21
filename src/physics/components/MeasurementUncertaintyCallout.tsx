import React from 'react'

/**
 * 測量不確定度呼叫框 (Measurement Uncertainty Callout)
 * 為物理實驗室提供實驗誤差、不確定度傳播與有效數字的雙語說明與範例。
 * Bilingual zh-Hant / en for STEM lab measurement uncertainty.
 */
export const MeasurementUncertaintyCallout: React.FC<{ labId: string }> = ({ labId }) => {
  const content = {
    projectile: {
      zh: '拋體實驗測量不確定度：初速 ±0.1 m/s、角度 ±0.5°、g ±0.01 m/s²。射程不確定度傳播 δR ≈ |∂R/∂v0|·δv0 + |∂R/∂θ|·δθ。範例：v0=25±0.1，θ=45±0.5° → δR ≈ 0.35 m。',
      en: 'Projectile lab measurement uncertainty: v0 ±0.1 m/s, angle ±0.5°, g ±0.01 m/s². Range uncertainty propagation δR ≈ |∂R/∂v0|·δv0 + |∂R/∂θ|·δθ. Example: v0=25±0.1, θ=45±0.5° → δR ≈ 0.35 m.',
    },
    shm: {
      zh: '簡諧運動實驗：週期 T=2π√(L/g)，δT/T = ½ δL/L + ½ δg/g。小角度近似另有系統誤差。多次測量取平均降低偶然誤差。',
      en: 'SHM lab: period T=2π√(L/g), δT/T = ½ δL/L + ½ δg/g. Small-angle approx adds systematic error. Average multiple measurements to reduce random error.',
    },
    default: {
      zh: '實驗室測量不確定度：區分系統誤差與偶然誤差，使用有效數字規則。儀器最小刻度之半為讀數不確定度。',
      en: 'Lab measurement uncertainty: distinguish systematic vs random error, apply significant figures rules. Half the smallest scale division as reading uncertainty.',
    },
  }
  const c = content[labId as keyof typeof content] || content.default
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '6px', margin: '1rem 0', fontSize: '0.85rem' }}>
      <strong>📏 {labId === 'projectile' ? 'Measurement Uncertainty Callout' : '測量不確定度呼叫框'} / Measurement Uncertainty</strong>
      <p style={{ margin: '0.5rem 0 0' }}>{c.zh}</p>
      <p style={{ margin: '0.25rem 0 0', color: 'var(--muted)' }}>{c.en}</p>
    </div>
  )
}
