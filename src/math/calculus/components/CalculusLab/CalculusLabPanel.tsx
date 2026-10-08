import React from 'react'
import type { CalculusLabMode, RiemannMethod } from '../../types'
import { useI18n } from '../../../../i18n/i18n'
import { PRESET_FUNCTIONS, PRESET_FUNCTIONS_EN } from '../../data/calculusLabPresets'

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
  const { locale } = useI18n()
  const copy = (zh: string, en: string) => locale === 'en' ? en : zh
  const presetFunctions = locale === 'en' ? PRESET_FUNCTIONS_EN : PRESET_FUNCTIONS
  return (
    <div className="calculus-lab-control-card">
      <div className="control-card-header">
        <h4>{copy('🎛️ 幾何實驗室參數面板', '🎛️ Geometry Lab Controls')}</h4>
        <span className="mode-badge">{mode.toUpperCase()}</span>
      </div>

      {/* 8 大核心實驗室模式切換 */}
      <div className="lab-mode-grid">
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'limit_epsilon' ? 'active' : ''}`}
          aria-pressed={mode === 'limit_epsilon'}
          onClick={() => onModeSelect('limit_epsilon')}
        >
          {copy('🔍 極限 ε-δ', '🔍 Limit ε–δ')}
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'tangent_secant' ? 'active' : ''}`}
          aria-pressed={mode === 'tangent_secant'}
          onClick={() => onModeSelect('tangent_secant')}
        >
          {copy('📈 割線切線', '📈 Secant and Tangent')}
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'optimization_mvt' ? 'active' : ''}`}
          aria-pressed={mode === 'optimization_mvt'}
          onClick={() => onModeSelect('optimization_mvt')}
        >
          {copy('🎯 均值極值', '🎯 Mean Value and Extrema')}
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'riemann_sum' ? 'active' : ''}`}
          aria-pressed={mode === 'riemann_sum'}
          onClick={() => onModeSelect('riemann_sum')}
        >
          {copy('📊 黎曼和', '📊 Riemann Sum')}
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'ftc_accumulation' ? 'active' : ''}`}
          aria-pressed={mode === 'ftc_accumulation'}
          onClick={() => onModeSelect('ftc_accumulation')}
        >
          {copy('🔄 FTC 基本定理', '🔄 Fundamental Theorem')}
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'taylor_series' ? 'active' : ''}`}
          aria-pressed={mode === 'taylor_series'}
          onClick={() => onModeSelect('taylor_series')}
        >
          {copy('〰️ 泰勒級數', '〰️ Taylor Series')}
        </button>
        <button
          type="button"
          className={`btn-mode-tab ${mode === 'newton_slope_field' ? 'active' : ''}`}
          aria-pressed={mode === 'newton_slope_field'}
          onClick={() => onModeSelect('newton_slope_field')}
        >
          {copy('⚡ 牛頓法求根', '⚡ Newton Root Finding')}
        </button>
      </div>

      {/* 函數選擇器與輸入框 */}
      <div className="form-group expr-select-group">
        <label htmlFor="calculus-preset-classic">{copy('快速挑選經典函數：', 'Choose a classic function:')}</label>
        <select
          id="calculus-preset-classic"
          value={expression}
          onChange={(e) => {
            const chosen = presetFunctions.find((p) => p.expr === e.target.value)
            onExpressionChange(e.target.value)
            if (chosen) onModeSelect(chosen.mode)
          }}
        >
          {presetFunctions.map((p, idx) => (
            <option key={idx} value={p.expr}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group expr-input-group">
        <label htmlFor="calculus-expression">{copy('自訂函數表達式 f(x)：', 'Custom function f(x):')}</label>
        <input
          id="calculus-expression"
          type="text"
          value={expression}
          onChange={(e) => onExpressionChange(e.target.value)}
          placeholder={copy('例如: x^3 - 3*x + 1', 'Example: x^3 - 3*x + 1')}
        />
      </div>

      {/* 動態參數滑桿區 */}
      <div className="sliders-section">
        {/* 切點 x0 */}
        <div className="slider-item">
          <div className="slider-label-row">
            <span id="calculus-x0-label">{copy('探索焦點 / 切點 x₀:', 'Focus / point of tangency x₀:')}</span>
            <strong>{x0.toFixed(2)}</strong>
          </div>
          <input
            type="range"
            aria-labelledby="calculus-x0-label"
            aria-valuetext={copy(`${x0.toFixed(2)} x 座標`, `x-coordinate ${x0.toFixed(2)}`)}
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
              <span id="calculus-dx-label">{copy('微元步長 Δx:', 'Increment Δx:')}</span>
              <strong className={deltaX < 0.1 ? 'highlight-green' : ''}>{deltaX.toFixed(3)}</strong>
            </div>
            <input
              type="range"
              aria-labelledby="calculus-dx-label"
              aria-valuetext={copy(`${deltaX.toFixed(3)} x 單位`, `${deltaX.toFixed(3)} x-units`)}
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
              <span id="calculus-epsilon-label">{copy('目標容忍誤差 ε:', 'Target tolerance ε:')}</span>
              <strong>{epsilon.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              aria-labelledby="calculus-epsilon-label"
              aria-valuetext={copy(`${epsilon.toFixed(2)} 函數值單位`, `${epsilon.toFixed(2)} function-value units`)}
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
                <span id="calculus-int-a-label">{copy('積分下限 a:', 'Lower integration bound a:')}</span>
                <strong>{intA.toFixed(1)}</strong>
              </div>
              <input
                type="range"
                aria-labelledby="calculus-int-a-label"
                aria-valuetext={copy(`${intA.toFixed(1)} x 座標`, `x-coordinate ${intA.toFixed(1)}`)}
                min="-1"
                max={intB - 0.5}
                step="0.5"
                value={intA}
                onChange={(e) => onParamChange({ intA: parseFloat(e.target.value) })}
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span id="calculus-int-b-label">{copy('積分上限 b:', 'Upper integration bound b:')}</span>
                <strong>{intB.toFixed(1)}</strong>
              </div>
              <input
                type="range"
                aria-labelledby="calculus-int-b-label"
                aria-valuetext={copy(`${intB.toFixed(1)} x 座標`, `x-coordinate ${intB.toFixed(1)}`)}
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
                <span id="calculus-slices-label">{copy('黎曼和切片數 N:', 'Riemann-sum slices N:')}</span>
                <strong>{slicesN}</strong>
              </div>
              <input
                type="range"
                aria-labelledby="calculus-slices-label"
                aria-valuetext={copy(`${slicesN} 個切片`, `${slicesN} slices`)}
                min="2"
                max="80"
                step="2"
                value={slicesN}
                onChange={(e) => onParamChange({ slicesN: parseInt(e.target.value, 10) })}
              />
            </div>

            <div className="riemann-method-selector">
              <label>{copy('採樣端點：', 'Sample point:')}</label>
              <div className="segmented-btn-group">
                <button
                  type="button"
                  className={`seg-btn ${riemannMethod === 'left' ? 'active' : ''}`}
                  aria-pressed={riemannMethod === 'left'}
                  onClick={() => onParamChange({ riemannMethod: 'left' })}
                >
                  {copy('左端點', 'Left endpoint')}
                </button>
                <button
                  type="button"
                  className={`seg-btn ${riemannMethod === 'midpoint' ? 'active' : ''}`}
                  aria-pressed={riemannMethod === 'midpoint'}
                  onClick={() => onParamChange({ riemannMethod: 'midpoint' })}
                >
                  {copy('中點', 'Midpoint')}
                </button>
                <button
                  type="button"
                  className={`seg-btn ${riemannMethod === 'right' ? 'active' : ''}`}
                  aria-pressed={riemannMethod === 'right'}
                  onClick={() => onParamChange({ riemannMethod: 'right' })}
                >
                  {copy('右端點', 'Right endpoint')}
                </button>
              </div>
            </div>
          </>
        )}

        {/* 泰勒多項式階數 */}
        {mode === 'taylor_series' && (
          <div className="slider-item">
            <div className="slider-label-row">
              <span id="calculus-order-label">{copy('泰勒展開多項式階數 N:', 'Taylor-polynomial order N:')}</span>
              <strong>{taylorOrder} {copy('階', 'order')}</strong>
            </div>
            <input
              type="range"
              aria-labelledby="calculus-order-label"
              aria-valuetext={copy(`${taylorOrder} 階`, `order ${taylorOrder}`)}
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
