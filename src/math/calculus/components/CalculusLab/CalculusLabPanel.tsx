import React from 'react'
import type { CalculusLabMode, RiemannMethod } from '../../types'

interface Props {
  mode: CalculusLabMode
  expression: string
  x0: number
  deltaX: number
  intA: number
  intB: number
  slicesN: number
  riemannMethod: RiemannMethod
  taylorOrder: number
  epsilon: number
  onModeSelect: (mode: CalculusLabMode) => void
  onExpressionChange: (expr: string) => void
  onParamChange: (params: {
    x0?: number
    deltaX?: number
    intA?: number
    intB?: number
    slicesN?: number
    riemannMethod?: RiemannMethod
    taylorOrder?: number
    epsilon?: number
  }) => void
}

const PRESET_FUNCTIONS: Array<{ label: string; expr: string; mode: CalculusLabMode }> = [
  { label: '拋物線 f(x) = x² - 2x + 2', expr: 'x^2 - 2*x + 2', mode: 'tangent_secant' },
  { label: '三次多項式 f(x) = x³ - 3x + 1', expr: 'x^3 - 3*x + 1', mode: 'optimization_mvt' },
  { label: '定積分拋物線 f(x) = x²', expr: 'x^2', mode: 'riemann_sum' },
  { label: '三角振盪 f(x) = sin(x) + 1.5', expr: 'sin(x) + 1.5', mode: 'ftc_accumulation' },
  { label: '泰勒級數正弦 f(x) = sin(x)', expr: 'sin(x)', mode: 'taylor_series' },
  { label: '牛頓法多項式 f(x) = x³ - 2x - 5', expr: 'x^3 - 2*x - 5', mode: 'newton_slope_field' },
]

export const CalculusLabPanel: React.FC<Props> = ({
  mode,
  expression,
  x0,
  deltaX,
  intA,
  intB,
  slicesN,
  riemannMethod,
  taylorOrder,
  epsilon,
  onModeSelect,
  onExpressionChange,
  onParamChange,
}) => {
  return (
    <div className="calculus-lab-control-card">
      <div className="control-card-header">
        <h4>🎛️ 幾何實驗室參數面板</h4>
        <span className="mode-badge">{mode.toUpperCase()}</span>
      </div>

      {/* 8 大核心實驗室模式切換 */}
      <div className="lab-mode-grid">
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'limit_epsilon' ? 'active' : ''}`}
          onClick={() => onModeSelect('limit_epsilon')}
        >
          🔍 極限 ε-δ
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'tangent_secant' ? 'active' : ''}`}
          onClick={() => onModeSelect('tangent_secant')}
        >
          📈 割線切線
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'optimization_mvt' ? 'active' : ''}`}
          onClick={() => onModeSelect('optimization_mvt')}
        >
          🎯 均值極值
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'riemann_sum' ? 'active' : ''}`}
          onClick={() => onModeSelect('riemann_sum')}
        >
          📊 黎曼和
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'ftc_accumulation' ? 'active' : ''}`}
          onClick={() => onModeSelect('ftc_accumulation')}
        >
          🔄 FTC 基本定理
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'taylor_series' ? 'active' : ''}`}
          onClick={() => onModeSelect('taylor_series')}
        >
          〰️ 泰勒級數
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'newton_slope_field' ? 'active' : ''}`}
          onClick={() => onModeSelect('newton_slope_field')}
        >
          ⚡ 牛頓法求根
        </button>
      </div>

      {/* 函數選擇器與輸入框 */}
      <div className="form-group expr-select-group">
        <label>快速挑選經典函數：</label>
        <select
          value={expression}
          onChange={(e) => {
            const chosen = PRESET_FUNCTIONS.find((p) => p.expr === e.target.value)
            onExpressionChange(e.target.value)
            if (chosen) onModeSelect(chosen.mode)
          }}
        >
          {PRESET_FUNCTIONS.map((p, idx) => (
            <option key={idx} value={p.expr}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group expr-input-group">
        <label>自訂函數表達式 f(x)：</label>
        <input
          type="text"
          value={expression}
          onChange={(e) => onExpressionChange(e.target.value)}
          placeholder="例如: x^3 - 3*x + 1"
        />
      </div>

      {/* 動態參數滑桿區 */}
      <div className="sliders-section">
        {/* 切點 x0 */}
        <div className="slider-item">
          <div className="slider-label-row">
            <span>探索焦點 / 切點 x₀:</span>
            <strong>{x0.toFixed(2)}</strong>
          </div>
          <input
            type="range"
            min="-1"
            max="4"
            step="0.1"
            value={x0}
            onChange={(e) => onParamChange({ x0: parseFloat(e.target.value) })}
          />
        </div>

        {/* 割線步長 deltaX */}
        {(mode === 'tangent_secant' || mode === 'limit_epsilon') && (
          <div className="slider-item">
            <div className="slider-label-row">
              <span>微元步長 Δx:</span>
              <strong className={deltaX < 0.1 ? 'highlight-green' : ''}>{deltaX.toFixed(3)}</strong>
            </div>
            <input
              type="range"
              min="0.005"
              max="2.0"
              step="0.005"
              value={deltaX}
              onChange={(e) => onParamChange({ deltaX: parseFloat(e.target.value) })}
            />
          </div>
        )}

        {/* Epsilon 容忍度 */}
        {mode === 'limit_epsilon' && (
          <div className="slider-item">
            <div className="slider-label-row">
              <span>目標容忍誤差 ε:</span>
              <strong>{epsilon.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              value={epsilon}
              onChange={(e) => onParamChange({ epsilon: parseFloat(e.target.value) })}
            />
          </div>
        )}

        {/* 黎曼和與 FTC 積分上下限 [intA, intB] */}
        {(mode === 'riemann_sum' || mode === 'ftc_accumulation') && (
          <>
            <div className="slider-item">
              <div className="slider-label-row">
                <span>積分下限 a:</span>
                <strong>{intA.toFixed(1)}</strong>
              </div>
              <input
                type="range"
                min="-1"
                max={intB - 0.5}
                step="0.5"
                value={intA}
                onChange={(e) => onParamChange({ intA: parseFloat(e.target.value) })}
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>積分上限 b:</span>
                <strong>{intB.toFixed(1)}</strong>
              </div>
              <input
                type="range"
                min={intA + 0.5}
                max="5"
                step="0.5"
                value={intB}
                onChange={(e) => onParamChange({ intB: parseFloat(e.target.value) })}
              />
            </div>
          </>
        )}

        {/* 黎曼和切片數 N */}
        {mode === 'riemann_sum' && (
          <>
            <div className="slider-item">
              <div className="slider-label-row">
                <span>黎曼和切片數 N:</span>
                <strong>{slicesN}</strong>
              </div>
              <input
                type="range"
                min="2"
                max="80"
                step="2"
                value={slicesN}
                onChange={(e) => onParamChange({ slicesN: parseInt(e.target.value, 10) })}
              />
            </div>

            <div className="riemann-method-selector">
              <label>採樣端點：</label>
              <div className="segmented-btn-group">
                <button
                  type="button"
                  className={`seg-btn ${riemannMethod === 'left' ? 'active' : ''}`}
                  onClick={() => onParamChange({ riemannMethod: 'left' })}
                >
                  左端點
                </button>
                <button
                  type="button"
                  className={`seg-btn ${riemannMethod === 'midpoint' ? 'active' : ''}`}
                  onClick={() => onParamChange({ riemannMethod: 'midpoint' })}
                >
                  中點
                </button>
                <button
                  type="button"
                  className={`seg-btn ${riemannMethod === 'right' ? 'active' : ''}`}
                  onClick={() => onParamChange({ riemannMethod: 'right' })}
                >
                  右端點
                </button>
              </div>
            </div>
          </>
        )}

        {/* 泰勒多項式階數 */}
        {mode === 'taylor_series' && (
          <div className="slider-item">
            <div className="slider-label-row">
              <span>泰勒展開多項式階數 N:</span>
              <strong>{taylorOrder} 階</strong>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              step="1"
              value={taylorOrder}
              onChange={(e) => onParamChange({ taylorOrder: parseInt(e.target.value, 10) })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
