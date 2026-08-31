import React, { useState, useMemo } from 'react'

interface ElementData {
  z: number
  sym: string
  name: string
  period: number
  group: number
  mass: number
  en: number
  r: number
  config: string
  shells: number[] // e.g. [2, 4] for C
  type: 'alkali' | 'alkaline' | 'transition' | 'metal' | 'metalloid' | 'nonmetal' | 'halogen' | 'noble'
  valElectrons: number
}

const ELEMENTS: ElementData[] = [
  { z: 1, sym: 'H', name: '氫', period: 1, group: 1, mass: 1.008, en: 2.20, r: 53, config: '1s¹', shells: [1], type: 'nonmetal', valElectrons: 1 },
  { z: 2, sym: 'He', name: '氦', period: 1, group: 18, mass: 4.003, en: 0, r: 31, config: '1s²', shells: [2], type: 'noble', valElectrons: 2 },
  { z: 3, sym: 'Li', name: '鋰', period: 2, group: 1, mass: 6.941, en: 0.98, r: 167, config: '[He] 2s¹', shells: [2, 1], type: 'alkali', valElectrons: 1 },
  { z: 4, sym: 'Be', name: '鈹', period: 2, group: 2, mass: 9.012, en: 1.57, r: 112, config: '[He] 2s²', shells: [2, 2], type: 'alkaline', valElectrons: 2 },
  { z: 5, sym: 'B', name: '硼', period: 2, group: 13, mass: 10.81, en: 2.04, r: 87, config: '[He] 2s² 2p¹', shells: [2, 3], type: 'metalloid', valElectrons: 3 },
  { z: 6, sym: 'C', name: '碳', period: 2, group: 14, mass: 12.01, en: 2.55, r: 67, config: '[He] 2s² 2p²', shells: [2, 4], type: 'nonmetal', valElectrons: 4 },
  { z: 7, sym: 'N', name: '氮', period: 2, group: 15, mass: 14.01, en: 3.04, r: 56, config: '[He] 2s² 2p³', shells: [2, 5], type: 'nonmetal', valElectrons: 5 },
  { z: 8, sym: 'O', name: '氧', period: 2, group: 16, mass: 16.00, en: 3.44, r: 48, config: '[He] 2s² 2p⁴', shells: [2, 6], type: 'nonmetal', valElectrons: 6 },
  { z: 9, sym: 'F', name: '氟', period: 2, group: 17, mass: 19.00, en: 3.98, r: 42, config: '[He] 2s² 2p⁵', shells: [2, 7], type: 'halogen', valElectrons: 7 },
  { z: 10, sym: 'Ne', name: '氖', period: 2, group: 18, mass: 20.18, en: 0, r: 38, config: '[He] 2s² 2p⁶', shells: [2, 8], type: 'noble', valElectrons: 8 },
  { z: 11, sym: 'Na', name: '鈉', period: 3, group: 1, mass: 22.99, en: 0.93, r: 190, config: '[Ne] 3s¹', shells: [2, 8, 1], type: 'alkali', valElectrons: 1 },
  { z: 12, sym: 'Mg', name: '鎂', period: 3, group: 2, mass: 24.31, en: 1.31, r: 145, config: '[Ne] 3s²', shells: [2, 8, 2], type: 'alkaline', valElectrons: 2 },
  { z: 13, sym: 'Al', name: '鋁', period: 3, group: 13, mass: 26.98, en: 1.61, r: 118, config: '[Ne] 3s² 3p¹', shells: [2, 8, 3], type: 'metal', valElectrons: 3 },
  { z: 14, sym: 'Si', name: '矽', period: 3, group: 14, mass: 28.09, en: 1.90, r: 111, config: '[Ne] 3s² 3p²', shells: [2, 8, 4], type: 'metalloid', valElectrons: 4 },
  { z: 15, sym: 'P', name: '磷', period: 3, group: 15, mass: 30.97, en: 2.19, r: 98, config: '[Ne] 3s² 3p³', shells: [2, 8, 5], type: 'nonmetal', valElectrons: 5 },
  { z: 16, sym: 'S', name: '硫', period: 3, group: 16, mass: 32.07, en: 2.58, r: 88, config: '[Ne] 3s² 3p⁴', shells: [2, 8, 6], type: 'nonmetal', valElectrons: 6 },
  { z: 17, sym: 'Cl', name: '氯', period: 3, group: 17, mass: 35.45, en: 3.16, r: 79, config: '[Ne] 3s² 3p⁵', shells: [2, 8, 7], type: 'halogen', valElectrons: 7 },
  { z: 18, sym: 'Ar', name: '氬', period: 3, group: 18, mass: 39.95, en: 0, r: 71, config: '[Ne] 3s² 3p⁶', shells: [2, 8, 8], type: 'noble', valElectrons: 8 },
  { z: 19, sym: 'K', name: '鉀', period: 4, group: 1, mass: 39.10, en: 0.82, r: 243, config: '[Ar] 4s¹', shells: [2, 8, 8, 1], type: 'alkali', valElectrons: 1 },
  { z: 20, sym: 'Ca', name: '鈣', period: 4, group: 2, mass: 40.08, en: 1.00, r: 194, config: '[Ar] 4s²', shells: [2, 8, 8, 2], type: 'alkaline', valElectrons: 2 },
  { z: 21, sym: 'Sc', name: '鈧', period: 4, group: 3, mass: 44.96, en: 1.36, r: 184, config: '[Ar] 3d¹ 4s²', shells: [2, 8, 9, 2], type: 'transition', valElectrons: 3 },
  { z: 22, sym: 'Ti', name: '鈦', period: 4, group: 4, mass: 47.87, en: 1.54, r: 176, config: '[Ar] 3d² 4s²', shells: [2, 8, 10, 2], type: 'transition', valElectrons: 4 },
  { z: 23, sym: 'V', name: '釩', period: 4, group: 5, mass: 50.94, en: 1.63, r: 171, config: '[Ar] 3d³ 4s²', shells: [2, 8, 11, 2], type: 'transition', valElectrons: 5 },
  { z: 24, sym: 'Cr', name: '鉻', period: 4, group: 6, mass: 52.00, en: 1.66, r: 166, config: '[Ar] 3d⁵ 4s¹', shells: [2, 8, 13, 1], type: 'transition', valElectrons: 6 },
  { z: 25, sym: 'Mn', name: '錳', period: 4, group: 7, mass: 54.94, en: 1.55, r: 161, config: '[Ar] 3d⁵ 4s²', shells: [2, 8, 13, 2], type: 'transition', valElectrons: 7 },
  { z: 26, sym: 'Fe', name: '鐵', period: 4, group: 8, mass: 55.85, en: 1.83, r: 156, config: '[Ar] 3d⁶ 4s²', shells: [2, 8, 14, 2], type: 'transition', valElectrons: 8 },
  { z: 27, sym: 'Co', name: '鈷', period: 4, group: 9, mass: 58.93, en: 1.88, r: 152, config: '[Ar] 3d⁷ 4s²', shells: [2, 8, 15, 2], type: 'transition', valElectrons: 9 },
  { z: 28, sym: 'Ni', name: '鎳', period: 4, group: 10, mass: 58.69, en: 1.91, r: 149, config: '[Ar] 3d⁸ 4s²', shells: [2, 8, 16, 2], type: 'transition', valElectrons: 10 },
  { z: 29, sym: 'Cu', name: '銅', period: 4, group: 11, mass: 63.55, en: 1.90, r: 145, config: '[Ar] 3d¹⁰ 4s¹', shells: [2, 8, 18, 1], type: 'transition', valElectrons: 11 },
  { z: 30, sym: 'Zn', name: '鋅', period: 4, group: 12, mass: 65.38, en: 1.65, r: 142, config: '[Ar] 3d¹⁰ 4s²', shells: [2, 8, 18, 2], type: 'transition', valElectrons: 12 },
  { z: 31, sym: 'Ga', name: '鎵', period: 4, group: 13, mass: 69.72, en: 1.81, r: 136, config: '[Ar] 3d¹⁰ 4s² 4p¹', shells: [2, 8, 18, 3], type: 'metal', valElectrons: 3 },
  { z: 32, sym: 'Ge', name: '鍺', period: 4, group: 14, mass: 72.63, en: 2.01, r: 125, config: '[Ar] 3d¹⁰ 4s² 4p²', shells: [2, 8, 18, 4], type: 'metalloid', valElectrons: 4 },
  { z: 33, sym: 'As', name: '砷', period: 4, group: 15, mass: 74.92, en: 2.18, r: 114, config: '[Ar] 3d¹⁰ 4s² 4p³', shells: [2, 8, 18, 5], type: 'metalloid', valElectrons: 5 },
  { z: 34, sym: 'Se', name: '硒', period: 4, group: 16, mass: 78.97, en: 2.55, r: 103, config: '[Ar] 3d¹⁰ 4s² 4p⁴', shells: [2, 8, 18, 6], type: 'nonmetal', valElectrons: 6 },
  { z: 35, sym: 'Br', name: '溴', period: 4, group: 17, mass: 79.90, en: 2.96, r: 94, config: '[Ar] 3d¹⁰ 4s² 4p⁵', shells: [2, 8, 18, 7], type: 'halogen', valElectrons: 7 },
  { z: 36, sym: 'Kr', name: '氪', period: 4, group: 18, mass: 83.80, en: 0, r: 88, config: '[Ar] 3d¹⁰ 4s² 4p⁶', shells: [2, 8, 18, 8], type: 'noble', valElectrons: 8 },
]

const TYPE_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  alkali: { bg: '#ef444422', border: '#ef4444', text: '#f87171', label: '鹼金屬' },
  alkaline: { bg: '#f59e0b22', border: '#f59e0b', text: '#fbbf24', label: '鹼土金屬' },
  transition: { bg: '#8b5cf622', border: '#8b5cf6', text: '#a78bfa', label: '過渡金屬' },
  metal: { bg: '#3b82f622', border: '#3b82f6', text: '#60a5fa', label: '主族金屬' },
  metalloid: { bg: '#10b98122', border: '#10b981', text: '#34d399', label: '類金屬' },
  nonmetal: { bg: '#06b6d422', border: '#06b6d4', text: '#22d3ee', label: '非金屬' },
  halogen: { bg: '#ec489922', border: '#ec4899', text: '#f472b6', label: '鹵素' },
  noble: { bg: '#64748b22', border: '#64748b', text: '#94a3b8', label: '鈍氣' },
}

/**
 * 化學動態實驗室：元素週期表動態探測器 (PeriodicTableLab)
 * 涵蓋原子序 1~36 元素電子組態、波耳原子模型電子軌域分佈、電負度與共價半徑週期律。
 */
export const PeriodicTableLab: React.FC = () => {
  const [selectedZ, setSelectedZ] = useState<number>(6) // 預設碳 (C, Z=6)
  const [filterType, setFilterType] = useState<string>('all')

  const filteredElements = useMemo(() => {
    if (filterType === 'all') return ELEMENTS
    return ELEMENTS.filter((e) => e.type === filterType)
  }, [filterType])

  const current = ELEMENTS.find((e) => e.z === selectedZ) || ELEMENTS[5]
  const currentTypeMeta = TYPE_COLORS[current.type] || TYPE_COLORS.nonmetal

  // 波耳模型軌域幾何 (SVG)
  const bohrSvgSize = 180
  const bohrCx = 90
  const bohrCy = 90
  const shellRadii = [22, 38, 54, 70] // K, L, M, N 軌域半徑

  return (
    <div className="math-lab chemistry-lab periodic-table-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 頂部標題 */}
      <div className="lab-header" style={{ marginBottom: '0.6rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🔬</span> 元素週期律與波耳原子模型探測器 (Periodic Table Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            週期表橫列為「週期」（同週期電子層數相同），縱行「族」（同族價電子數相同，化學性質相似）。
          </p>
        </div>
      </div>

      {/* 元素類別過濾器 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.55rem' }}>
        <button
          type="button"
          className={`pill-btn ${filterType === 'all' ? 'active' : ''}`}
          style={{ padding: '0.15rem 0.4rem', fontSize: '0.68rem' }}
          onClick={() => setFilterType('all')}
        >
          全部 (1~36)
        </button>
        {Object.entries(TYPE_COLORS).map(([key, meta]) => (
          <button
            key={key}
            type="button"
            className={`pill-btn ${filterType === key ? 'active' : ''}`}
            style={{ padding: '0.15rem 0.4rem', fontSize: '0.68rem' }}
            onClick={() => setFilterType(key)}
          >
            {meta.label}
          </button>
        ))}
      </div>

      {/* 雙欄響應式佈局 */}
      <div
        className="lab-workspace-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '0.75rem',
          alignItems: 'start',
          width: '100%',
        }}
      >
        {/* 左側微型元素網格 (支援 6 欄自適應) */}
        <div
          className="elements-mini-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))',
            gap: '0.3rem',
            background: 'linear-gradient(180deg, #0b1329 0%, #0f172a 100%)',
            padding: '0.6rem',
            borderRadius: '10px',
            border: '1px solid #1e293b',
            maxHeight: '260px',
            overflowY: 'auto',
            minWidth: 0,
          }}
        >
          {filteredElements.map((el) => {
            const isSel = el.z === selectedZ
            const typeMeta = TYPE_COLORS[el.type]
            return (
              <button
                key={el.z}
                type="button"
                onClick={() => setSelectedZ(el.z)}
                style={{
                  background: isSel ? '#2563eb' : typeMeta.bg,
                  border: isSel ? '2px solid #60a5fa' : `1px solid ${typeMeta.border}`,
                  borderRadius: '6px',
                  padding: '0.2rem 0.1rem',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.15s ease',
                  minHeight: '42px',
                }}
              >
                <span style={{ fontSize: '0.58rem', color: '#94a3b8', lineHeight: 1 }}>{el.z}</span>
                <strong style={{ fontSize: '0.85rem', lineHeight: 1.1 }}>{el.sym}</strong>
                <span style={{ fontSize: '0.62rem', color: isSel ? '#fff' : typeMeta.text, lineHeight: 1 }}>{el.name}</span>
              </button>
            )
          })}
        </div>

        {/* 右側元素詳細資訊卡與波耳原子模型 */}
        <div
          className="element-detail-card"
          style={{
            background: 'var(--surface)',
            padding: '0.65rem',
            borderRadius: '10px',
            border: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            minWidth: 0,
          }}
        >
          {/* 元素標題與波耳模型預覽 */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '0.45rem' }}>
            {/* 波耳原子軌域 SVG */}
            <div style={{ width: '85px', height: '85px', flexShrink: 0, background: '#0b1329', borderRadius: '8px', border: '1px solid #1e293b', overflow: 'hidden' }}>
              <svg viewBox={`0 0 ${bohrSvgSize} ${bohrSvgSize}`} style={{ width: '100%', height: '100%', display: 'block' }}>
                {/* 原子核 */}
                <circle cx={bohrCx} cy={bohrCy} r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
                <text x={bohrCx} y={bohrCy + 3.5} fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                  +{current.z}
                </text>

                {/* 各殼層軌域與電子 (K, L, M, N) */}
                {current.shells.map((eCount, sIdx) => {
                  const r = shellRadii[sIdx]
                  return (
                    <g key={`shell-${sIdx}`}>
                      <circle cx={bohrCx} cy={bohrCy} r={r} fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                      {Array.from({ length: eCount }).map((_, eIdx) => {
                        const angle = (2 * Math.PI * eIdx) / eCount
                        const ex = bohrCx + r * Math.cos(angle)
                        const ey = bohrCy + r * Math.sin(angle)
                        return <circle key={`e-${sIdx}-${eIdx}`} cx={ex} cy={ey} r="3" fill="#facc15" stroke="#000" strokeWidth="0.5" />
                      })}
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* 元素基本卡 */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', whiteSpace: 'nowrap' }}>
                  {current.name} ({current.sym})
                </h4>
                <span
                  style={{
                    fontSize: '0.62rem',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    background: currentTypeMeta.bg,
                    border: `1px solid ${currentTypeMeta.border}`,
                    color: currentTypeMeta.text,
                    fontWeight: 600,
                  }}
                >
                  {currentTypeMeta.label}
                </span>
              </div>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: 'var(--muted)' }}>
                原子序 {current.z} · 原子量 {current.mass}
              </p>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: '#2563eb', fontFamily: 'monospace', fontWeight: 600 }}>
                {current.config} (層: {current.shells.join('-')})
              </p>
            </div>
          </div>

          {/* 數值面板 */}
          <div
            style={{
              background: 'var(--surface-soft)',
              padding: '0.45rem 0.55rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.22rem',
              border: '1px solid var(--line)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>週期 / 族：</span>
              <strong>第 {current.period} 週期 · 第 {current.group} 族</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>價電子數 (Valence)：</span>
              <strong style={{ color: '#2563eb' }}>{current.valElectrons} 個</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>電負度 (Pauling EN)：</span>
              <strong style={{ color: current.en > 0 ? '#10b981' : 'var(--muted)' }}>
                {current.en > 0 ? current.en.toFixed(2) : '無 (鈍氣惰性)'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>共價原子半徑：</span>
              <strong style={{ color: '#f59e0b' }}>{current.r} pm</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PeriodicTableLab
