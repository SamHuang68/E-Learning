import React, { useState } from 'react'
import { ALGEBRA_TILE_PRESETS } from '../data/diagramPresets'
import { MathFormula } from '../components/MathFormula'

/**
 * 代數拼圖與因式分解幾何面積實驗室 (AlgebraTilesLab)
 * 國中代數幾何：將二次多項式 x^2 + bx + c 拼裝成 (x+p)(x+q) 的大長方形面積。
 */
export const AlgebraTilesLab: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(ALGEBRA_TILE_PRESETS[0].id)
  const [showDimensions, setShowDimensions] = useState<boolean>(true)

  const preset = ALGEBRA_TILE_PRESETS.find((p) => p.id === selectedPresetId) ?? ALGEBRA_TILE_PRESETS[0]

  return (
    <div className="algebra-tiles-card">
      <div className="solver-top-bar">
        <div className="solver-title-block">
          <h3>🧩 代數拼圖因式分解 (Algebra Tiles)</h3>
          <p>因式分解不是死背十字交乘，而是把多項式拼成一個大長方形！面積等於長乘寬。</p>
        </div>

        <div className="preset-tabs">
          {ALGEBRA_TILE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pill-btn ${p.id === selectedPresetId ? 'active' : ''}`}
              onClick={() => setSelectedPresetId(p.id)}
            >
              {p.expressionLatex}
            </button>
          ))}
        </div>
      </div>

      <div className="tiles-header-box">
        <div className="formula-display">
          <span>展開式（總面積）：</span>
          <MathFormula math={`$${preset.expressionLatex}$`} />
          <span className="arrow-sep">➔ 因式分解（長 × 寬）：</span>
          <strong className="factored-highlight">
            <MathFormula math={`$${preset.factoredLatex}$`} />
          </strong>
        </div>
      </div>

      <div className="tiles-workspace-grid">
        {/* 幾何拼圖畫布 */}
        <div className="tiles-canvas-box">
          <div className="tiles-legend">
            <span className="legend-item"><i className="color-x2" /> $x^2$ (大正方形)</span>
            <span className="legend-item"><i className="color-x" /> $x$ (長條形)</span>
            <span className="legend-item"><i className="color-1" /> $1$ (單位小正方形)</span>
          </div>

          <div className="tiles-puzzle-container">
            {/* 上方寬度標註 */}
            {showDimensions && (
              <div className="dim-label top-dim">
                長度 = $x + {preset.dimY}$
              </div>
            )}

            <div className="puzzle-grid-layout">
              {/* 左方高度標註 */}
              {showDimensions && (
                <div className="dim-label left-dim">
                  寬度 = $x + {preset.dimX}$
                </div>
              )}

              {/* 核心拼圖四象限 */}
              <div className="tile-assembly-quad">
                {/* 1. 左上角：x^2 */}
                <div className="tile-block tile-x2">
                  <span>$x^2$</span>
                </div>

                {/* 2. 右上角：dimY 個 x (豎排長條) */}
                <div className="tile-col-x">
                  {Array.from({ length: preset.dimY }).map((_, i) => (
                    <div key={`tx-${i}`} className="tile-block tile-x-vert">
                      <span>$x$</span>
                    </div>
                  ))}
                </div>

                {/* 3. 左下角：dimX 個 x (橫排長條) */}
                <div className="tile-row-x">
                  {Array.from({ length: preset.dimX }).map((_, i) => (
                    <div key={`lx-${i}`} className="tile-block tile-x-horiz">
                      <span>$x$</span>
                    </div>
                  ))}
                </div>

                {/* 4. 右下角：dimX * dimY 個 1 (小正方形矩陣) */}
                <div
                  className="tile-grid-units"
                  style={{
                    gridTemplateColumns: `repeat(${preset.dimY}, 24px)`,
                    gridTemplateRows: `repeat(${preset.dimX}, 24px)`,
                  }}
                >
                  {Array.from({ length: preset.dimX * preset.dimY }).map((_, i) => (
                    <div key={`u-${i}`} className="tile-block tile-unit">
                      1
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 幾何解析面板 */}
        <div className="tiles-explanation-panel">
          <h4>💡 面積本質解析</h4>
          <p className="exp-text">{preset.explanation}</p>

          <div className="parts-sum-card">
            <h5>積木組成清單：</h5>
            <ul>
              <li><strong>$x^2$ 積木：</strong> 1 塊（左上角）</li>
              <li><strong>$x$ 積木：</strong> {preset.b} 塊（拆為 {preset.dimX} 橫條 + {preset.dimY} 豎條）</li>
              <li><strong>$1$ 單位積木：</strong> {preset.c} 塊（右下角 {preset.dimX} × {preset.dimY}）</li>
            </ul>
          </div>

          <div className="toggle-dim-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showDimensions}
                onChange={(e) => setShowDimensions(e.target.checked)}
              />
              顯示長寬邊長標註
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
