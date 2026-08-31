import React, { useState } from 'react'

/**
 * 物理動態實驗室：直流電路與歐姆定律 (CircuitLab)
 * 探討串並聯電阻、歐姆定律 V = IR 與電功率 P = IV = I^2 R。
 */
export const CircuitLab: React.FC = () => {
  const [voltage, setVoltage] = useState(12) // 電源電壓 (V)
  const [r1, setR1] = useState(4) // 電阻 1 (Ω)
  const [r2, setR2] = useState(6) // 電阻 2 (Ω)
  const [mode, setMode] = useState<'series' | 'parallel'>('series')

  // 等效電阻
  const req = mode === 'series' ? r1 + r2 : (r1 * r2) / (r1 + r2)
  // 總電流 (A)
  const totalCurrent = voltage / req
  // 總功率 (W)
  const totalPower = voltage * totalCurrent

  // 各自電流與電壓
  const i1 = mode === 'series' ? totalCurrent : voltage / r1
  const i2 = mode === 'series' ? totalCurrent : voltage / r2
  const v1 = mode === 'series' ? totalCurrent * r1 : voltage
  const v2 = mode === 'series' ? totalCurrent * r2 : voltage

  return (
    <div className="math-lab physics-lab circuit-lab">
      <div className="lab-header">
        <div>
          <h3>⚡ 直流電路與歐姆定律實驗室 (Circuit & Ohm's Law Lab)</h3>
          <p className="lab-desc">
            歐姆定律 V = IR，串聯時電流相等、電壓分壓；並聯時電壓相等、電流分流。
          </p>
        </div>
      </div>

      <div className="lab-workspace-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.3fr) minmax(240px, 1fr)', gap: '0.75rem' }}>
        <div className="lab-canvas-box" style={{ background: '#0f172a', borderRadius: '8px', padding: '0.65rem', border: '1px solid #1e293b' }}>
          <svg viewBox="0 0 300 180" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* 電源 */}
            <rect x="25" y="70" width="20" height="40" fill="#f59e0b" rx="3" />
            <text x="35" y="65" fill="#f59e0b" fontSize="10" textAnchor="middle">{voltage}V</text>

            {mode === 'series' ? (
              /* 串聯迴路 */
              <>
                <line x1="35" y1="70" x2="35" y2="30" stroke="#38bdf8" strokeWidth="2" />
                <line x1="35" y1="30" x2="100" y2="30" stroke="#38bdf8" strokeWidth="2" />
                {/* R1 */}
                <rect x="100" y="20" width="45" height="20" fill="#334155" stroke="#60a5fa" strokeWidth="1.5" rx="3" />
                <text x="122" y="34" fill="#fff" fontSize="9" textAnchor="middle">R1: {r1}Ω</text>
                <line x1="145" y1="30" x2="190" y2="30" stroke="#38bdf8" strokeWidth="2" />
                {/* R2 */}
                <rect x="190" y="20" width="45" height="20" fill="#334155" stroke="#60a5fa" strokeWidth="1.5" rx="3" />
                <text x="212" y="34" fill="#fff" fontSize="9" textAnchor="middle">R2: {r2}Ω</text>
                <line x1="235" y1="30" x2="270" y2="30" stroke="#38bdf8" strokeWidth="2" />
                <line x1="270" y1="30" x2="270" y2="150" stroke="#38bdf8" strokeWidth="2" />
                <line x1="270" y1="150" x2="35" y2="150" stroke="#38bdf8" strokeWidth="2" />
                <line x1="35" y1="150" x2="35" y2="110" stroke="#38bdf8" strokeWidth="2" />
              </>
            ) : (
              /* 並聯迴路 */
              <>
                <line x1="35" y1="70" x2="35" y2="30" stroke="#38bdf8" strokeWidth="2" />
                <line x1="35" y1="30" x2="120" y2="30" stroke="#38bdf8" strokeWidth="2" />
                <line x1="120" y1="30" x2="120" y2="150" stroke="#38bdf8" strokeWidth="2" />
                {/* 支路 1 */}
                <line x1="120" y1="50" x2="150" y2="50" stroke="#38bdf8" strokeWidth="2" />
                <rect x="150" y="40" width="45" height="20" fill="#334155" stroke="#60a5fa" strokeWidth="1.5" rx="3" />
                <text x="172" y="54" fill="#fff" fontSize="9" textAnchor="middle">R1: {r1}Ω</text>
                <line x1="195" y1="50" x2="230" y2="50" stroke="#38bdf8" strokeWidth="2" />
                {/* 支路 2 */}
                <line x1="120" y1="110" x2="150" y2="110" stroke="#38bdf8" strokeWidth="2" />
                <rect x="150" y="100" width="45" height="20" fill="#334155" stroke="#60a5fa" strokeWidth="1.5" rx="3" />
                <text x="172" y="114" fill="#fff" fontSize="9" textAnchor="middle">R2: {r2}Ω</text>
                <line x1="195" y1="110" x2="230" y2="110" stroke="#38bdf8" strokeWidth="2" />
                <line x1="230" y1="30" x2="230" y2="150" stroke="#38bdf8" strokeWidth="2" />
                <line x1="230" y1="150" x2="35" y2="150" stroke="#38bdf8" strokeWidth="2" />
                <line x1="35" y1="150" x2="35" y2="110" stroke="#38bdf8" strokeWidth="2" />
              </>
            )}

            {/* 總電流標籤 */}
            <text x="150" y="165" fill="#38bdf8" fontSize="10" textAnchor="middle">
              總電流 I = {totalCurrent.toFixed(2)} A (等效電阻 R_eq = {req.toFixed(2)} Ω)
            </text>
          </svg>
        </div>

        <div className="lab-controls-panel" style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>電路連接方式：</label>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button type="button" className={`pill-btn ${mode === 'series' ? 'active' : ''}`} style={{ flex: 1, padding: '0.2rem', fontSize: '0.72rem' }} onClick={() => setMode('series')}>串聯 (Series)</button>
              <button type="button" className={`pill-btn ${mode === 'parallel' ? 'active' : ''}`} style={{ flex: 1, padding: '0.2rem', fontSize: '0.72rem' }} onClick={() => setMode('parallel')}>並聯 (Parallel)</button>
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>電源電壓 V：</span>
              <strong style={{ color: '#2563eb' }}>{voltage} V</strong>
            </label>
            <input type="range" min="1" max="24" step="1" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>電阻 R1 / R2：</span>
              <strong style={{ color: '#2563eb' }}>{r1}Ω / {r2}Ω</strong>
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input type="range" min="1" max="20" step="1" value={r1} onChange={(e) => setR1(Number(e.target.value))} style={{ width: '50%', accentColor: '#2563eb' }} />
              <input type="range" min="1" max="20" step="1" value={r2} onChange={(e) => setR2(Number(e.target.value))} style={{ width: '50%', accentColor: '#2563eb' }} />
            </div>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>R1 電壓/電流：</span>
              <strong>{v1.toFixed(1)}V / {i1.toFixed(2)}A</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>R2 電壓/電流：</span>
              <strong>{v2.toFixed(1)}V / {i2.toFixed(2)}A</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>總消耗電功率 P：</span>
              <strong style={{ color: '#f59e0b' }}>{totalPower.toFixed(2)} W</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
