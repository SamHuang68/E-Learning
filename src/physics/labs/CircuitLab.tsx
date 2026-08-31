import React, { useState } from 'react'

/**
 * 物理動態實驗室：直流電路與歐姆定律 (CircuitLab)
 * 探討串並聯電阻、歐姆定律 V = IR、分壓分流原理與焦耳電功率 P = IV = I^2 R。
 */
export const CircuitLab: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(12) // 電源電壓 (V)
  const [r1, setR1] = useState<number>(4) // 電阻 1 (Ω)
  const [r2, setR2] = useState<number>(6) // 電阻 2 (Ω)
  const [mode, setMode] = useState<'series' | 'parallel'>('series')

  // 等效電阻 Req
  const req = mode === 'series' ? r1 + r2 : (r1 * r2) / (r1 + r2)
  // 總電流 I (A)
  const totalCurrent = voltage / Math.max(0.1, req)
  // 總功率 P (W)
  const totalPower = voltage * totalCurrent

  // 各自電流、電壓與消耗功率
  const i1 = mode === 'series' ? totalCurrent : voltage / Math.max(0.1, r1)
  const i2 = mode === 'series' ? totalCurrent : voltage / Math.max(0.1, r2)
  const v1 = mode === 'series' ? totalCurrent * r1 : voltage
  const v2 = mode === 'series' ? totalCurrent * r2 : voltage
  const p1 = v1 * i1
  const p2 = v2 * i2

  // SVG 幾何參數
  const svgWidth = 360
  const svgHeight = 210

  return (
    <div className="math-lab physics-lab circuit-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 頂部標題 */}
      <div className="lab-header" style={{ marginBottom: '0.6rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⚡</span> 直流電路與歐姆定律實驗室 (Circuit & Ohm's Law Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            歐姆定律 $V = IR$：串聯電路電流處處相等、電壓分壓 ($V = V_1 + V_2$)；並聯電路電壓相等、電流分流 ($I = I_1 + I_2$)。
          </p>
        </div>
      </div>

      {/* 經典電路情境快照切換 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.55rem' }}>
        <button
          type="button"
          className="pill-btn"
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: mode === 'series' && r1 === 4 && r2 === 6 ? 'rgba(56, 189, 248, 0.2)' : undefined }}
          onClick={() => { setMode('series'); setVoltage(12); setR1(4); setR2(6); }}
        >
          🔗 串聯分壓 (12V, 4Ω + 6Ω)
        </button>
        <button
          type="button"
          className="pill-btn"
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: mode === 'parallel' && r1 === 6 && r2 === 3 ? 'rgba(56, 189, 248, 0.2)' : undefined }}
          onClick={() => { setMode('parallel'); setVoltage(12); setR1(6); setR2(3); }}
        >
          🔀 並聯分流 (12V, 6Ω // 3Ω)
        </button>
        <button
          type="button"
          className="pill-btn"
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: voltage === 24 ? 'rgba(250, 204, 21, 0.2)' : undefined }}
          onClick={() => { setVoltage(24); setR1(10); setR2(10); }}
        >
          ⚡ 高壓對稱負載 (24V, 10Ω + 10Ω)
        </button>
      </div>

      {/* 雙欄響應式佈局 */}
      <div
        className="lab-workspace-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '0.75rem',
          alignItems: 'start',
          width: '100%',
        }}
      >
        {/* 左側 SVG 電路拓撲圖 */}
        <div
          className="lab-canvas-box"
          style={{
            background: 'linear-gradient(180deg, #0b1329 0%, #0f172a 100%)',
            borderRadius: '10px',
            padding: '0.6rem',
            border: '1px solid #1e293b',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.72rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} />
              動態電路拓撲與電流流向
            </span>
            <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>Req = {req.toFixed(2)} Ω</span>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'hidden' }}
          >
            <defs>
              <marker id="circuit-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* 電源 (左側) */}
            <rect x="25" y="80" width="22" height="46" rx="4" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="36" y="107" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">{voltage}V</text>
            <text x="36" y="73" fill="#f59e0b" fontSize="8.5" fontWeight="bold" textAnchor="middle">＋ 電源</text>
            <text x="36" y="137" fill="#94a3b8" fontSize="8.5" textAnchor="middle">－</text>

            {mode === 'series' ? (
              /* 串聯線路拓撲 */
              <g>
                {/* 導線路徑 */}
                <line x1="36" y1="80" x2="36" y2="35" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="36" y1="35" x2="110" y2="35" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#circuit-arrow)" />

                {/* 電阻 R1 */}
                <rect x="110" y="24" width="55" height="22" rx="4" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.8" />
                <text x="137" y="38" fill="#fff" fontSize="9.5" fontWeight="bold" textAnchor="middle">R₁: {r1}Ω</text>
                <text x="137" y="18" fill="#93c5fd" fontSize="7.5" textAnchor="middle">{v1.toFixed(1)}V / {i1.toFixed(2)}A</text>

                <line x1="165" y1="35" x2="220" y2="35" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#circuit-arrow)" />

                {/* 電阻 R2 */}
                <rect x="220" y="24" width="55" height="22" rx="4" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.8" />
                <text x="247" y="38" fill="#fff" fontSize="9.5" fontWeight="bold" textAnchor="middle">R₂: {r2}Ω</text>
                <text x="247" y="18" fill="#93c5fd" fontSize="7.5" textAnchor="middle">{v2.toFixed(1)}V / {i2.toFixed(2)}A</text>

                <line x1="275" y1="35" x2="330" y2="35" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="330" y1="35" x2="330" y2="175" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="330" y1="175" x2="36" y2="175" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#circuit-arrow)" />
                <line x1="36" y1="175" x2="36" y2="126" stroke="#38bdf8" strokeWidth="2.5" />
              </g>
            ) : (
              /* 並聯線路拓撲 */
              <g>
                <line x1="36" y1="80" x2="36" y2="35" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="36" y1="35" x2="135" y2="35" stroke="#38bdf8" strokeWidth="2.5" />

                {/* 節點 1 */}
                <circle cx="135" cy="35" r="3.5" fill="#38bdf8" />
                <line x1="135" y1="35" x2="135" y2="175" stroke="#38bdf8" strokeWidth="2.5" />

                {/* 支路 1 (R1) */}
                <line x1="135" y1="60" x2="175" y2="60" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#circuit-arrow)" />
                <rect x="175" y="49" width="55" height="22" rx="4" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.8" />
                <text x="202" y="63" fill="#fff" fontSize="9.5" fontWeight="bold" textAnchor="middle">R₁: {r1}Ω</text>
                <text x="202" y="44" fill="#93c5fd" fontSize="7.5" textAnchor="middle">{v1.toFixed(1)}V / {i1.toFixed(2)}A</text>
                <line x1="230" y1="60" x2="275" y2="60" stroke="#38bdf8" strokeWidth="2" />

                {/* 支路 2 (R2) */}
                <line x1="135" y1="140" x2="175" y2="140" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#circuit-arrow)" />
                <rect x="175" y="129" width="55" height="22" rx="4" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.8" />
                <text x="202" y="143" fill="#fff" fontSize="9.5" fontWeight="bold" textAnchor="middle">R₂: {r2}Ω</text>
                <text x="202" y="124" fill="#93c5fd" fontSize="7.5" textAnchor="middle">{v2.toFixed(1)}V / {i2.toFixed(2)}A</text>
                <line x1="230" y1="140" x2="275" y2="140" stroke="#38bdf8" strokeWidth="2" />

                {/* 節點 2 */}
                <line x1="275" y1="35" x2="275" y2="175" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="275" cy="175" r="3.5" fill="#38bdf8" />

                <line x1="275" y1="175" x2="36" y2="175" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#circuit-arrow)" />
                <line x1="36" y1="175" x2="36" y2="126" stroke="#38bdf8" strokeWidth="2.5" />
              </g>
            )}

            {/* 總電流標籤 */}
            <text x="180" y="196" fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              總迴路電流 I = {totalCurrent.toFixed(2)} A (總電功率 P = {totalPower.toFixed(2)} W)
            </text>
          </svg>
        </div>

        {/* 右側控制面板與電學數據 */}
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
          {/* 連接方式切換 */}
          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
              電路連接模式：
            </label>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                type="button"
                className={`pill-btn ${mode === 'series' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.25rem', fontSize: '0.72rem', textAlign: 'center' }}
                onClick={() => setMode('series')}
              >
                串聯 (Series, $I$ 相等)
              </button>
              <button
                type="button"
                className={`pill-btn ${mode === 'parallel' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.25rem', fontSize: '0.72rem', textAlign: 'center' }}
                onClick={() => setMode('parallel')}
              >
                並聯 (Parallel, $V$ 相等)
              </button>
            </div>
          </div>

          {/* 電源電壓 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>電源電壓 $V$：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{voltage} V</strong>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              step="1"
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', margin: 0 }}
            />
          </div>

          {/* 電阻 R1 與 R2 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>電阻 $R_1 / R_2$：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{r1} Ω / {r2} Ω</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={r1}
                onChange={(e) => setR1(Number(e.target.value))}
                style={{ width: '50%', accentColor: '#2563eb', margin: 0 }}
              />
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={r2}
                onChange={(e) => setR2(Number(e.target.value))}
                style={{ width: '50%', accentColor: '#2563eb', margin: 0 }}
              />
            </div>
          </div>

          {/* 數據面板 */}
          <div
            style={{
              background: 'var(--surface-soft)',
              padding: '0.45rem 0.55rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              border: '1px solid var(--line)',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>$R_1$ 耗電功率 $P_1 = I_1^2 R_1$：</span>
              <strong style={{ fontFamily: 'monospace' }}>{p1.toFixed(2)} W ({v1.toFixed(1)}V / {i1.toFixed(2)}A)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>$R_2$ 耗電功率 $P_2 = I_2^2 R_2$：</span>
              <strong style={{ fontFamily: 'monospace' }}>{p2.toFixed(2)} W ({v2.toFixed(1)}V / {i2.toFixed(2)}A)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--line)', paddingTop: '0.2rem' }}>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>總等效耗能 P(總)：</span>
              <strong style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{totalPower.toFixed(2)} W</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircuitLab
