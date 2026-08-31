import React, { useState } from 'react'

/**
 * 化學動態實驗室：酸鹼滴定與 pH 曲線 (TitrationLab)
 * 模擬強鹼 NaOH (0.1M) 滴定強酸 HCl (25mL, 0.1M) 與弱酸 CH3COOH (25mL, 0.1M, pKa=4.74)。
 */
export const TitrationLab: React.FC = () => {
  const [acidType, setAcidType] = useState<'strong' | 'weak'>('strong')
  const [vTitrant, setVTitrant] = useState(15) // 已加入 NaOH 體積 (mL)

  const cAcid = 0.1 // M
  const vAcid = 25 // mL
  const cBase = 0.1 // M
  const pKa = 4.74 // CH3COOH

  const vEquiv = (cAcid * vAcid) / cBase // 當量點 25mL

  // 計算 pH
  let ph = 7.0
  if (vTitrant === 0) {
    ph = acidType === 'strong' ? 1.0 : 0.5 * (pKa - Math.log10(cAcid))
  } else if (vTitrant < vEquiv) {
    if (acidType === 'strong') {
      const remainingMol = (cAcid * vAcid - cBase * vTitrant) / 1000
      const totalVolL = (vAcid + vTitrant) / 1000
      ph = -Math.log10(remainingMol / totalVolL)
    } else {
      // 緩衝溶液 Henderson-Hasselbalch: pH = pKa + log([A-]/[HA])
      const ratio = vTitrant / (vEquiv - vTitrant)
      ph = pKa + Math.log10(ratio)
    }
  } else if (vTitrant === vEquiv) {
    ph = acidType === 'strong' ? 7.0 : 8.72 // 弱酸強鹼水解呈微鹼性
  } else {
    // 過量強鹼
    const excessMol = (cBase * (vTitrant - vEquiv)) / 1000
    const totalVolL = (vAcid + vTitrant) / 1000
    const poh = -Math.log10(excessMol / totalVolL)
    ph = 14 - poh
  }

  // 滴定曲線路徑 (0~50mL)
  const curvePoints: Array<{ v: number; phVal: number }> = []
  for (let v = 0; v <= 50; v += 1) {
    let p = 7.0
    if (v === 0) {
      p = acidType === 'strong' ? 1.0 : 2.87
    } else if (v < 25) {
      if (acidType === 'strong') {
        const rem = (cAcid * vAcid - cBase * v) / 1000
        p = -Math.log10(rem / ((vAcid + v) / 1000))
      } else {
        p = pKa + Math.log10(v / (25 - v))
      }
    } else if (v === 25) {
      p = acidType === 'strong' ? 7.0 : 8.72
    } else {
      const exc = (cBase * (v - 25)) / 1000
      p = 14 + Math.log10(exc / ((vAcid + v) / 1000))
    }
    curvePoints.push({ v, phVal: Math.min(14, Math.max(0, p)) })
  }

  const svgPath = curvePoints
    .map((pt, idx) => {
      const sx = 30 + pt.v * 5.0
      const sy = 160 - (pt.phVal / 14) * 130
      return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`
    })
    .join(' ')

  const curSx = 30 + vTitrant * 5.0
  const curSy = 160 - (ph / 14) * 130

  return (
    <div className="math-lab chemistry-lab titration-lab">
      <div className="lab-header">
        <div>
          <h3>🧪 酸鹼滴定與 pH 曲線實驗室 (Acid-Base Titration)</h3>
          <p className="lab-desc">
            滴定終點與當量點：強酸強鹼滴定當量點 pH=7；弱酸強鹼滴定半當量點 pH = pKa，當量點 pH &gt; 7。
          </p>
        </div>
      </div>

      <div className="lab-workspace-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.3fr) minmax(240px, 1fr)', gap: '0.75rem' }}>
        <div className="lab-canvas-box" style={{ background: '#0f172a', borderRadius: '8px', padding: '0.65rem', border: '1px solid #1e293b' }}>
          <svg viewBox="0 0 300 180" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* 坐標軸 */}
            <line x1="30" y1="160" x2="290" y2="160" stroke="#475569" strokeWidth="1.5" />
            <line x1="30" y1="20" x2="30" y2="160" stroke="#475569" strokeWidth="1.5" />
            <text x="35" y="25" fill="#94a3b8" fontSize="8">pH</text>
            <text x="280" y="155" fill="#94a3b8" fontSize="8">V (mL)</text>

            {/* pH=7 中性基準線 */}
            <line x1="30" y1={160 - 0.5 * 130} x2="290" y2={160 - 0.5 * 130} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
            <text x="15" y={160 - 0.5 * 130 + 3} fill="#64748b" fontSize="7">7</text>

            {/* 當量點 V=25mL 鉛直線 */}
            <line x1={30 + 25 * 5.0} y1="20" x2={30 + 25 * 5.0} y2="160" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

            {/* S 型滴定曲線 */}
            <path d={svgPath} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

            {/* 當前點 */}
            <circle cx={curSx} cy={curSy} r="5" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
            <text x={curSx} y={curSy - 8} fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">
              pH {ph.toFixed(2)}
            </text>
          </svg>
        </div>

        <div className="lab-controls-panel" style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>被滴定酸液種類：</label>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button type="button" className={`pill-btn ${acidType === 'strong' ? 'active' : ''}`} style={{ flex: 1, padding: '0.2rem', fontSize: '0.72rem' }} onClick={() => setAcidType('strong')}>強酸 HCl (0.1M)</button>
              <button type="button" className={`pill-btn ${acidType === 'weak' ? 'active' : ''}`} style={{ flex: 1, padding: '0.2rem', fontSize: '0.72rem' }} onClick={() => setAcidType('weak')}>弱酸 CH₃COOH (pKa 4.74)</button>
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>加入 0.1M NaOH 體積：</span>
              <strong style={{ color: '#2563eb' }}>{vTitrant} mL</strong>
            </label>
            <input type="range" min="0" max="50" step="0.5" value={vTitrant} onChange={(e) => setVTitrant(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>當前溶液 pH：</span>
              <strong style={{ color: ph < 7 ? '#ef4444' : ph > 7 ? '#3b82f6' : '#10b981' }}>{ph.toFixed(2)} ({ph < 7 ? '酸性' : ph > 7 ? '鹼性' : '中性'})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>當量點體積：</span>
              <strong>25.0 mL</strong>
            </div>
            {acidType === 'weak' && vTitrant === 12.5 && (
              <div style={{ color: '#8b5cf6', fontWeight: 600 }}>
                ★ 半當量點：[CH₃COOH] = [CH₃COO⁻]，pH = pKa = 4.74
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
