import React, { useState } from 'react'
import { useI18n } from '../../i18n/i18n'
import { pickUi } from '../../i18n/pickUi'
import { VSEPR_SHAPES } from '../data/interactiveTools'

interface MoleculePreset {
  nameZh: string
  nameEn: string
  formula: string
  bp: number
  lp: number
}

const PRESET_MOLECULES: MoleculePreset[] = [
  { nameZh: '二氧化碳', nameEn: 'Carbon dioxide', formula: 'CO₂', bp: 2, lp: 0 },
  { nameZh: '三氟化硼', nameEn: 'Boron trifluoride', formula: 'BF₃', bp: 3, lp: 0 },
  { nameZh: '二氧化硫', nameEn: 'Sulfur dioxide', formula: 'SO₂', bp: 2, lp: 1 },
  { nameZh: '甲烷', nameEn: 'Methane', formula: 'CH₄', bp: 4, lp: 0 },
  { nameZh: '氨氣', nameEn: 'Ammonia', formula: 'NH₃', bp: 3, lp: 1 },
  { nameZh: '水分子', nameEn: 'Water', formula: 'H₂O', bp: 2, lp: 2 },
  { nameZh: '五氯化磷', nameEn: 'Phosphorus pentachloride', formula: 'PCl₅', bp: 5, lp: 0 },
  { nameZh: '四氟化硫', nameEn: 'Sulfur tetrafluoride', formula: 'SF₄', bp: 4, lp: 1 },
  { nameZh: '三氟化氯', nameEn: 'Chlorine trifluoride', formula: 'ClF₃', bp: 3, lp: 2 },
  { nameZh: '二氟化氙', nameEn: 'Xenon difluoride', formula: 'XeF₂', bp: 2, lp: 3 },
  { nameZh: '六氟化硫', nameEn: 'Sulfur hexafluoride', formula: 'SF₆', bp: 6, lp: 0 },
  { nameZh: '四氟化氙', nameEn: 'Xenon tetrafluoride', formula: 'XeF₄', bp: 4, lp: 2 },
]

/**
 * 化學動態實驗室：VSEPR 分子空間幾何與混成軌域 (VseprGeometryLab)
 * 探討價殼層電子對互斥理論 (VSEPR)、孤對電子壓縮效應、分子偶極極性與混成軌域 (sp, sp2, sp3, sp3d, sp3d2)。
 */
export const VseprGeometryLab: React.FC = () => {
  const { locale } = useI18n()
  const copy = (zhHant: string, en: string) => pickUi(locale, zhHant, en)
  const [bp, setBp] = useState<number>(4) // 鍵結電子對 (BP)
  const [lp, setLp] = useState<number>(0) // 孤對電子對 (LP)

  const sn = bp + lp // 空間位阻數 (Steric Number)
  const canonicalShape = VSEPR_SHAPES.find((item) => item.bondingPairs === bp && item.lonePairs === lp)
  const geometry = (zhHant: string, fallbackEn: string) => copy(zhHant, canonicalShape?.geometry ?? fallbackEn)

  let shape = geometry('四面體形', 'Tetrahedral')
  let angle = '109.5°'
  let hybrid = 'sp³'
  let isPolar = false
  let example = 'CH₄, SiH₄, CCl₄'

  if (sn === 2) {
    shape = geometry('直線形', 'Linear')
    angle = '180°'
    hybrid = 'sp'
    isPolar = false
    example = 'BeCl₂, CO₂, C₂H₂'
  } else if (sn === 3) {
    if (lp === 0) {
      shape = geometry('平面三角形', 'Trigonal Planar')
      angle = '120°'
      hybrid = 'sp²'
      isPolar = false
      example = 'BF₃, SO₃, NO₃⁻'
    } else {
      shape = geometry('折線形', 'Bent')
      angle = copy('< 120°（約 119°）', '< 120° (about 119°)')
      hybrid = 'sp²'
      isPolar = true
      example = 'SO₂, O₃, NO₂⁻'
    }
  } else if (sn === 4) {
    if (lp === 0) {
      shape = geometry('四面體形', 'Tetrahedral')
      angle = '109.5°'
      hybrid = 'sp³'
      isPolar = false
      example = 'CH₄, NH₄⁺, SO₄²⁻'
    } else if (lp === 1) {
      shape = geometry('三角錐形', 'Trigonal Pyramidal')
      angle = copy('107.5°（LP 壓縮）', '107.5° (compressed by LP)')
      hybrid = 'sp³'
      isPolar = true
      example = 'NH₃, PCl₃, H₃O⁺'
    } else {
      shape = geometry('折線形', 'Bent')
      angle = copy('104.5°（雙 LP 壓縮）', '104.5° (compressed by two LPs)')
      hybrid = 'sp³'
      isPolar = true
      example = 'H₂O, OF₂, SCl₂'
    }
  } else if (sn === 5) {
    hybrid = 'sp³d'
    if (lp === 0) {
      shape = geometry('雙三角錐形', 'Trigonal Bipyramidal')
      angle = copy('90°（軸向）、120°（赤道面）', '90° (axial), 120° (equatorial)')
      isPolar = false
      example = 'PCl₅, PF₅'
    } else if (lp === 1) {
      shape = geometry('蹺蹺板形', 'Seesaw')
      angle = '< 90°, < 120°'
      isPolar = true
      example = 'SF₄, SeF₄'
    } else if (lp === 2) {
      shape = geometry('T 字形', 'T-shaped')
      angle = copy('< 90°（約 87.5°）', '< 90° (about 87.5°)')
      isPolar = true
      example = 'ClF₃, BrF₃'
    } else {
      shape = geometry('直線形', 'Linear')
      angle = '180°'
      isPolar = false
      example = 'XeF₂, I₃⁻'
    }
  } else if (sn === 6) {
    hybrid = 'sp³d²'
    if (lp === 0) {
      shape = geometry('八面體形', 'Octahedral')
      angle = '90°, 180°'
      isPolar = false
      example = 'SF₆, PF₆⁻'
    } else if (lp === 1) {
      shape = geometry('四角錐形', 'Square Pyramidal')
      angle = '< 90°'
      isPolar = true
      example = 'BrF₅, IF₅'
    } else {
      shape = geometry('平面四邊形', 'Square Planar')
      angle = '90°, 180°'
      isPolar = false
      example = 'XeF₄, ICl₄⁻'
    }
  }

  // SVG 幾何計算
  const svgWidth = 280
  const svgHeight = 180
  const cx = 140
  const cy = 90
  const bondLength = 52

  return (
    <div lang={locale} className="math-lab chemistry-lab vsepr-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 頂部標題 */}
      <div className="lab-header" style={{ marginBottom: '0.6rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📐</span> {copy('VSEPR 分子空間幾何與混成軌域實驗室', 'VSEPR Molecular Geometry and Hybridization Lab')}
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {copy(
              '空間位阻數 SN = BP + LP。孤對電子（LP）斥力大於鍵結電子對（BP），使鍵角受到壓縮。',
              'Steric number SN = BP + LP. Lone pairs (LP) repel more strongly than bonding pairs (BP), compressing bond angles.',
            )}
          </p>
        </div>
      </div>

      {/* 經典分子快速切換按鈕 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.55rem' }}>
        {PRESET_MOLECULES.map((m) => (
          <button
            key={m.formula}
            type="button"
            className={`pill-btn ${bp === m.bp && lp === m.lp ? 'active' : ''}`}
            style={{ padding: '0.15rem 0.35rem', fontSize: '0.66rem' }}
            onClick={() => {
              setBp(m.bp)
              setLp(m.lp)
            }}
          >
            {m.formula} ({copy(m.nameZh, m.nameEn)})
          </button>
        ))}
      </div>

      {/* 雙欄響應式佈局 */}
      <div
        className="lab-workspace-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))',
          gap: '0.75rem',
          alignItems: 'start',
          width: '100%',
        }}
      >
        {/* 左側分子 3D/2D 空間幾何視口 */}
        <div
          className="lab-canvas-box"
          style={{
            background: 'linear-gradient(180deg, #0b1329 0%, #0f172a 100%)',
            borderRadius: '10px',
            padding: '0.6rem',
            border: '1px solid #1e293b',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 0,
          }}
        >
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', fontSize: '0.72rem', color: '#94a3b8' }}>
            <span>{copy('空間幾何立體投影', 'Molecular Geometry Projection')}</span>
            <span style={{ color: isPolar ? '#f43f5e' : '#10b981', fontWeight: 600 }}>
              {isPolar ? copy('極性分子（μ > 0）', 'Polar molecule (μ > 0)') : copy('非極性分子（μ = 0）', 'Nonpolar molecule (μ = 0)')}
            </span>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'hidden' }}
          >
            {/* 中心原子 */}
            <circle cx={cx} cy={cy} r="18" fill="#2563eb" stroke="#60a5fa" strokeWidth="2.5" />
            <text x={cx} y={cy + 4.5} fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">A</text>

            {/* 鍵結原子 X (綠色球體) */}
            {Array.from({ length: bp }).map((_, i) => {
              const angleVal = (2 * Math.PI * i) / Math.max(2, sn) - Math.PI / 2
              const px = cx + bondLength * Math.cos(angleVal)
              const py = cy + bondLength * Math.sin(angleVal)
              return (
                <g key={`bp-node-${i}`}>
                  <line x1={cx} y1={cy} x2={px} y2={py} stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                  <circle cx={px} cy={py} r="11" fill="#10b981" stroke="#a7f3d0" strokeWidth="1.5" />
                  <text x={px} y={py + 3.5} fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">X</text>
                </g>
              )
            })}

            {/* 孤對電子 (黃色水滴/橢圓瓣) */}
            {Array.from({ length: lp }).map((_, i) => {
              const angleVal = (2 * Math.PI * (bp + i)) / Math.max(2, sn) - Math.PI / 2
              const px = cx + (bondLength - 6) * Math.cos(angleVal)
              const py = cy + (bondLength - 6) * Math.sin(angleVal)
              return (
                <g key={`lp-node-${i}`}>
                  <ellipse
                    cx={px}
                    cy={py}
                    rx="12"
                    ry="8"
                    fill="rgba(245, 158, 11, 0.25)"
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    strokeDasharray="3 2"
                  />
                  <text x={px} y={py + 3.5} fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle">::</text>
                </g>
              )
            })}

            {/* 底部幾何名標記 */}
            <text x={cx} y={svgHeight - 10} fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              {shape} · {angle}
            </text>
          </svg>
        </div>

        {/* 右側控制面板與幾何屬性 */}
        <div
          className="lab-controls-panel"
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
          {/* 大考高頻分子快照按鈕 */}
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '0.25rem' }}>
              🧪 {copy('大考高頻分子立體構型快照：', 'Common Exam Molecule Shapes:')}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem' }}>
              {[
                { label: copy('💧 H₂O（角形）', '💧 H₂O (Bent)'), bp: 2, lp: 2 },
                { label: copy('🌿 NH₃（三角錐）', '🌿 NH₃ (Trigonal Pyramidal)'), bp: 3, lp: 1 },
                { label: copy('💎 CH₄（四面體）', '💎 CH₄ (Tetrahedral)'), bp: 4, lp: 0 },
                { label: copy('📏 CO₂（直線）', '📏 CO₂ (Linear)'), bp: 2, lp: 0 },
                { label: copy('🪐 PCl₅（雙錐）', '🪐 PCl₅ (Trigonal Bipyramidal)'), bp: 5, lp: 0 },
                { label: copy('⭐ SF₆（八面體）', '⭐ SF₆ (Octahedral)'), bp: 6, lp: 0 },
              ].map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => {
                    setBp(m.bp)
                    setLp(m.lp)
                  }}
                  style={{
                    padding: '0.25rem 0.2rem',
                    fontSize: '0.65rem',
                    borderRadius: '6px',
                    border: bp === m.bp && lp === m.lp ? '1px solid #10b981' : '1px solid var(--line)',
                    background: bp === m.bp && lp === m.lp ? 'rgba(16,185,129,0.15)' : 'var(--surface-soft)',
                    color: bp === m.bp && lp === m.lp ? '#10b981' : 'var(--text-main)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'normal',
                    overflowWrap: 'anywhere',
                    lineHeight: 1.2,
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 鍵結對 (BP) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>{copy('$\\sigma$ 鍵結電子對（BP）：', '$\\sigma$ Bonding Pairs (BP):')}</span>
              <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>{copy(`${bp} 對`, `${bp} pairs`)}</strong>
            </div>
            <input
              type="range"
              aria-label={copy('鍵結電子對數量', 'Number of bonding pairs')}
              aria-valuetext={copy(`${bp} 對`, `${bp} pairs`)}
              min="1"
              max="6"
              step="1"
              value={bp}
              onChange={(e) => {
                const val = Number(e.target.value)
                setBp(val)
                if (val + lp > 6) setLp(6 - val)
              }}
              style={{ width: '100%', accentColor: '#10b981', margin: 0 }}
            />
          </div>

          {/* 孤對電子對 (LP) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>{copy('孤對電子（Lone Pairs, LP）：', 'Lone Pairs (LP):')}</span>
              <strong style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{copy(`${lp} 對`, `${lp} pairs`)}</strong>
            </div>
            <input
              type="range"
              aria-label={copy('孤對電子數量', 'Number of lone pairs')}
              aria-valuetext={copy(`${lp} 對`, `${lp} pairs`)}
              min="0"
              max={Math.max(0, 6 - bp)}
              step="1"
              value={lp}
              onChange={(e) => setLp(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b', margin: 0 }}
            />
          </div>

          {/* 幾何屬性卡 */}
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
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>{copy('空間位阻數（SN）：', 'Steric number (SN):')}</span>
              <strong>{copy(`${sn}（${hybrid} 混成軌域）`, `${sn} (${hybrid} hybridization)`)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>{copy('分子空間幾何：', 'Molecular geometry:')}</span>
              <strong style={{ color: '#2563eb' }}>{shape}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>{copy('理論／預測鍵角：', 'Theoretical / predicted bond angle:')}</span>
              <strong>{angle}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>{copy('代表化合物：', 'Representative compounds:')}</span>
              <span style={{ color: 'var(--ink)', fontFamily: 'monospace', fontWeight: 600 }}>{example}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VseprGeometryLab
