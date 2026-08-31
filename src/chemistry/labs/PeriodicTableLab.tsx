import React, { useState } from 'react'

/**
 * 化學動態實驗室：元素週期表動態探測器 (PeriodicTableLab)
 * 探索原子序 1~36 號元素之電子組態、價電子數、電負度與原子半徑。
 */
export const PeriodicTableLab: React.FC = () => {
  const [selectedZ, setSelectedZ] = useState(6) // 預設碳 (C, Z=6)

  const elements = [
    { z: 1, sym: 'H', name: '氫', period: 1, group: 1, mass: 1.008, en: 2.20, r: 53, config: '1s¹', type: 'nonmetal' },
    { z: 2, sym: 'He', name: '氦', period: 1, group: 18, mass: 4.003, en: 0, r: 31, config: '1s²', type: 'noble' },
    { z: 3, sym: 'Li', name: '鋰', period: 2, group: 1, mass: 6.941, en: 0.98, r: 167, config: '[He] 2s¹', type: 'alkali' },
    { z: 4, sym: 'Be', name: '鈹', period: 2, group: 2, mass: 9.012, en: 1.57, r: 112, config: '[He] 2s²', type: 'alkaline' },
    { z: 5, sym: 'B', name: '硼', period: 2, group: 13, mass: 10.81, en: 2.04, r: 87, config: '[He] 2s² 2p¹', type: 'metalloid' },
    { z: 6, sym: 'C', name: '碳', period: 2, group: 14, mass: 12.01, en: 2.55, r: 67, config: '[He] 2s² 2p²', type: 'nonmetal' },
    { z: 7, sym: 'N', name: '氮', period: 2, group: 15, mass: 14.01, en: 3.04, r: 56, config: '[He] 2s² 2p³', type: 'nonmetal' },
    { z: 8, sym: 'O', name: '氧', period: 2, group: 16, mass: 16.00, en: 3.44, r: 48, config: '[He] 2s² 2p⁴', type: 'nonmetal' },
    { z: 9, sym: 'F', name: '氟', period: 2, group: 17, mass: 19.00, en: 3.98, r: 42, config: '[He] 2s² 2p⁵', type: 'halogen' },
    { z: 10, sym: 'Ne', name: '氖', period: 2, group: 18, mass: 20.18, en: 0, r: 38, config: '[He] 2s² 2p⁶', type: 'noble' },
    { z: 11, sym: 'Na', name: '鈉', period: 3, group: 1, mass: 22.99, en: 0.93, r: 190, config: '[Ne] 3s¹', type: 'alkali' },
    { z: 12, sym: 'Mg', name: '鎂', period: 3, group: 2, mass: 24.31, en: 1.31, r: 145, config: '[Ne] 3s²', type: 'alkaline' },
    { z: 13, sym: 'Al', name: '鋁', period: 3, group: 13, mass: 26.98, en: 1.61, r: 118, config: '[Ne] 3s² 3p¹', type: 'metal' },
    { z: 14, sym: 'Si', name: '矽', period: 3, group: 14, mass: 28.09, en: 1.90, r: 111, config: '[Ne] 3s² 3p²', type: 'metalloid' },
    { z: 15, sym: 'P', name: '磷', period: 3, group: 15, mass: 30.97, en: 2.19, r: 98, config: '[Ne] 3s² 3p³', type: 'nonmetal' },
    { z: 16, sym: 'S', name: '硫', period: 3, group: 16, mass: 32.07, en: 2.58, r: 88, config: '[Ne] 3s² 3p⁴', type: 'nonmetal' },
    { z: 17, sym: 'Cl', name: '氯', period: 3, group: 17, mass: 35.45, en: 3.16, r: 79, config: '[Ne] 3s² 3p⁵', type: 'halogen' },
    { z: 18, sym: 'Ar', name: '氬', period: 3, group: 18, mass: 39.95, en: 0, r: 71, config: '[Ne] 3s² 3p⁶', type: 'noble' },
    { z: 19, sym: 'K', name: '鉀', period: 4, group: 1, mass: 39.10, en: 0.82, r: 243, config: '[Ar] 4s¹', type: 'alkali' },
    { z: 20, sym: 'Ca', name: '鈣', period: 4, group: 2, mass: 40.08, en: 1.00, r: 194, config: '[Ar] 4s²', type: 'alkaline' },
    { z: 26, sym: 'Fe', name: '鐵', period: 4, group: 8, mass: 55.85, en: 1.83, r: 156, config: '[Ar] 3d⁶ 4s²', type: 'transition' },
    { z: 29, sym: 'Cu', name: '銅', period: 4, group: 11, mass: 63.55, en: 1.90, r: 145, config: '[Ar] 3d¹⁰ 4s¹', type: 'transition' },
  ]

  const current = elements.find((e) => e.z === selectedZ) || elements[5]

  return (
    <div className="math-lab chemistry-lab periodic-table-lab">
      <div className="lab-header">
        <div>
          <h3>🔬 元素週期律與原子構造探測器 (Periodic Table Lab)</h3>
          <p className="lab-desc">
            週期表橫列為「週期」（電子層數相同），縱行「族」（價電子數相同，化學性質相似）。
          </p>
        </div>
      </div>

      <div className="lab-workspace-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.4fr) minmax(220px, 1fr)', gap: '0.75rem' }}>
        <div className="elements-mini-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.35rem', background: '#0f172a', padding: '0.65rem', borderRadius: '8px' }}>
          {elements.map((el) => {
            const isSel = el.z === selectedZ
            return (
              <button
                key={el.z}
                type="button"
                onClick={() => setSelectedZ(el.z)}
                style={{
                  background: isSel ? '#2563eb' : '#1e293b',
                  border: isSel ? '2px solid #60a5fa' : '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.25rem 0.15rem',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{el.z}</span>
                <strong style={{ fontSize: '0.85rem' }}>{el.sym}</strong>
                <span style={{ fontSize: '0.65rem' }}>{el.name}</span>
              </button>
            )
          })}
        </div>

        <div className="element-detail-card" style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.35rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {current.sym}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.92rem' }}>{current.name} ({current.sym}) · 原子序 {current.z}</h4>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>原子量：{current.mass}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.74rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>週期 / 族：</span>
              <strong>第 {current.period} 週期 · 第 {current.group} 族</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>電子組態：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{current.config}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>電負度 (Pauling)：</span>
              <strong>{current.en > 0 ? current.en : '無 (鈍氣)'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>共價半徑：</span>
              <strong>{current.r} pm</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
