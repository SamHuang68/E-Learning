import React, { useState } from 'react'
import { PROOF_PRESETS } from '../data/diagramPresets'
import { MathFormula } from '../components/MathFormula'

/**
 * 幾何無字證明探索庫 (GeometricProofsLab)
 * 幾何直觀美學：算幾不等式半圓動態垂線、圓周角定理不變性等互動無字證明。
 */
export const GeometricProofsLab: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PROOF_PRESETS[0].id)
  const [splitRatio, setSplitRatio] = useState<number>(0.35) // 0.1 ~ 0.9 切分 a 與 b

  const preset = PROOF_PRESETS.find((p) => p.id === selectedPresetId) ?? PROOF_PRESETS[0]

  // 算幾不等式半圓幾何運算
  const totalDiameter = 10
  const valA = Number((totalDiameter * splitRatio).toFixed(2))
  const valB = Number((totalDiameter * (1 - splitRatio)).toFixed(2))
  const am = Number(((valA + valB) / 2).toFixed(2)) // 算術平均 5.00
  const gm = Number(Math.sqrt(valA * valB).toFixed(2)) // 幾何平均 sqrt(a*b)
  const isOptimal = Math.abs(valA - valB) < 0.2

  // SVG 坐標映射 (半圓半徑 R = 140, 圓心 (250, 220))
  const R = 140
  const cx = 250
  const cy = 220
  const px = cx - R + (splitRatio * 2 * R)
  const py = cy - Math.sqrt(Math.max(0, R * R - (px - cx) * (px - cx)))

  return (
    <div className="geometric-proofs-card">
      <div className="solver-top-bar">
        <div className="solver-title-block">
          <h3>✨ 幾何無字證明 (Proofs Without Words)</h3>
          <p>不用代數死背展開，拖動幾何圖形，定理的不變性與極值條件直接一眼看透！</p>
        </div>

        <div className="preset-tabs">
          {PROOF_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pill-btn ${p.id === selectedPresetId ? 'active' : ''}`}
              onClick={() => setSelectedPresetId(p.id)}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      <div className="proof-workspace-grid">
        {/* SVG 動態幾何證明畫布 */}
        <div className="proof-svg-box">
          <div className="proof-theorem-banner">
            <strong>{preset.theoremName}：</strong>
            <MathFormula math={`$${preset.theoremLatex}$`} />
          </div>

          <svg viewBox="0 0 500 280" className="proof-svg">
            {/* 半圓直徑與圓弧 */}
            <path
              d={`M ${cx - R},${cy} A ${R},${R} 0 0,1 ${cx + R},${cy} Z`}
              fill="#f8fafc"
              stroke="#64748b"
              strokeWidth="2"
            />
            <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#334155" strokeWidth="2.5" />

            {/* 分界點垂線段 (幾何平均 GM = sqrt(ab)) */}
            <line x1={px} y1={cy} x2={px} y2={py} stroke="#dc2626" strokeWidth="3" />
            <circle cx={px} cy={py} r="5" fill="#dc2626" />

            {/* 半徑線段 (算術平均 AM = (a+b)/2) */}
            <line x1={cx} y1={cy} x2={cx} y2={cy - R} stroke="#2563eb" strokeWidth="2.5" strokeDasharray="4,4" />
            <circle cx={cx} cy={cy - R} r="4" fill="#2563eb" />

            {/* 直徑上的長度標註 a 與 b */}
            <text x={(cx - R + px) / 2} y={cy + 22} fill="#3b82f6" fontSize="13" textAnchor="middle" fontWeight="bold">
              a = {valA}
            </text>
            <text x={(px + cx + R) / 2} y={cy + 22} fill="#10b981" fontSize="13" textAnchor="middle" fontWeight="bold">
              b = {valB}
            </text>

            {/* 垂線長度標註 */}
            <text x={px + 12} y={(cy + py) / 2} fill="#dc2626" fontSize="12" fontWeight="bold">
              垂線 = {gm}
            </text>
            <text x={cx + 10} y={cy - R + 20} fill="#2563eb" fontSize="12" fontWeight="bold">
              半徑 = {am}
            </text>
          </svg>

          {isOptimal && (
            <div className="optimal-banner">
              🎯 當 $a = b = 5$ 時，垂線剛好重合於圓半徑，$AM = GM = 5.00$（等號成立）！
            </div>
          )}
        </div>

        {/* 互動控制與無字證明解析 */}
        <div className="proof-controls-panel">
          <div className="slider-container">
            <label>拖曳直徑分割比 ($a$ vs $b$)：</label>
            <input
              type="range"
              aria-label="直徑分割比"
              aria-valuetext={`a 佔 ${(splitRatio * 100).toFixed(0)}%，b 佔 ${((1 - splitRatio) * 100).toFixed(0)}%`}
              min="0.1"
              max="0.9"
              step="0.01"
              value={splitRatio}
              onChange={(e) => setSplitRatio(parseFloat(e.target.value))}
            />
          </div>

          <div className="values-comparison-card">
            <h4>數值動態即時計算：</h4>
            <div className="val-row">
              <span>算術平均 AM = (a+b)/2（半徑）：</span>
              <strong className="blue-val">{am}</strong>
            </div>
            <div className="val-row">
              <span>幾何平均 GM = √ab（垂線）：</span>
              <strong className="red-val">{gm}</strong>
            </div>
            <div className="val-row diff-row">
              <span>幾何差值 AM − GM：</span>
              <strong>{(am - gm).toFixed(2)} ≥ 0</strong>
            </div>
          </div>

          <div className="proof-explanation-box">
            <h5>💡 無字證明原理：</h5>
            <p>{preset.proofExplanation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
