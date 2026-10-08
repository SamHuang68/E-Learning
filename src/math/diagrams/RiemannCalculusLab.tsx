import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RIEMANN_PRESETS } from '../data/diagramPresets'
import { RIEMANN_PRESETS_EN } from '../data/diagramPresets.en'
import { useI18n } from '../../i18n/i18n'

/**
 * 黎曼和切片極限與微積分視覺化 (RiemannCalculusLab)
 * 高中微積分核心：將定積分看作長條切片無限細分的極限，親手調整切片數 N 觀察階梯逼近連續曲線。
 */
export const RiemannCalculusLab: React.FC = () => {
  const { locale } = useI18n()
  const copy = (zh: string, en: string) => locale === 'en' ? en : zh
  const presets = locale === 'en' ? RIEMANN_PRESETS_EN : RIEMANN_PRESETS
  const [selectedPresetId, setSelectedPresetId] = useState<string>(RIEMANN_PRESETS[0].id)
  const [slicesN, setSlicesN] = useState<number>(8)
  const [sumMode, setSumMode] = useState<'left' | 'right' | 'mid'>('mid')

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const preset = presets.find((p) => p.id === selectedPresetId) ?? presets[0]

  // 計算函數值 f(x)
  const evalFn = useCallback((x: number): number => {
    if (preset.id === 'riemann-parabola') return x * x
    if (preset.id === 'riemann-linear') return 2 * x + 1
    return x
  }, [preset.id])

  // 計算黎曼和數值
  const dx = (preset.rangeB - preset.rangeA) / slicesN
  let riemannSum = 0
  for (let i = 0; i < slicesN; i++) {
    let evalX = preset.rangeA + i * dx
    if (sumMode === 'right') evalX += dx
    else if (sumMode === 'mid') evalX += dx / 2
    riemannSum += evalFn(evalX) * dx
  }

  // 繪製微積分曲線與黎曼切片
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)

    const padLeft = 40
    const padBottom = 30
    const plotW = width - padLeft - 20
    const plotH = height - padBottom - 20

    const minX = preset.rangeA
    const maxX = preset.rangeB + 0.5
    const maxY = preset.id === 'riemann-parabola' ? 10 : 10

    const mapX = (x: number) => padLeft + ((x - minX) / (maxX - minX)) * plotW
    const mapY = (y: number) => height - padBottom - (y / maxY) * plotH

    // 1. 繪製坐標軸
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(padLeft, height - padBottom)
    ctx.lineTo(width - 10, height - padBottom)
    ctx.moveTo(padLeft, height - padBottom)
    ctx.lineTo(padLeft, 10)
    ctx.stroke()

    // 2. 繪製黎曼和矩形切片
    const currentDx = (preset.rangeB - preset.rangeA) / slicesN
    for (let i = 0; i < slicesN; i++) {
      const leftX = preset.rangeA + i * currentDx
      const rightX = leftX + currentDx
      let sampleX = leftX
      if (sumMode === 'right') sampleX = rightX
      else if (sumMode === 'mid') sampleX = leftX + currentDx / 2

      const h = evalFn(sampleX)
      const pxLeft = mapX(leftX)
      const pxRight = mapX(rightX)
      const pyTop = mapY(h)
      const pyBase = mapY(0)

      ctx.fillStyle = 'rgba(59, 130, 246, 0.35)'
      ctx.fillRect(pxLeft, pyTop, pxRight - pxLeft, pyBase - pyTop)
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 1
      ctx.strokeRect(pxLeft, pyTop, pxRight - pxLeft, pyBase - pyTop)
    }

    // 3. 繪製連續函數曲線 f(x)
    ctx.strokeStyle = '#dc2626'
    ctx.lineWidth = 3
    ctx.beginPath()
    const steps = 100
    for (let s = 0; s <= steps; s++) {
      const x = minX + (s / steps) * (maxX - minX)
      const y = evalFn(x)
      const px = mapX(x)
      const py = mapY(y)
      if (s === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }, [preset, slicesN, sumMode, evalFn])

  const errorPct = Math.abs((riemannSum - preset.exactIntegral) / preset.exactIntegral) * 100

  return (
    <div className="riemann-calculus-card">
      <div className="solver-top-bar">
        <div className="solver-title-block">
          <h3>{copy('📈 黎曼和與定積分切片極限 (Riemann Sum)', '📈 Riemann Sums and Definite Integrals')}</h3>
          <p>{copy('定積分不是玄學公式！拖動滑桿將切片數 $N$ 從 4 增加到 100，親眼目睹矩陣和收斂至平滑曲線面積。', 'Increase the slice count $N$ from 4 to 100 and watch the rectangular sum converge to the area under a smooth curve.')}</p>
        </div>

        <div className="preset-tabs">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pill-btn ${p.id === selectedPresetId ? 'active' : ''}`}
              onClick={() => setSelectedPresetId(p.id)}
            >
              {p.title.split(locale === 'en' ? ':' : '：')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="riemann-workspace-grid">
        {/* Canvas 曲線與階梯和繪製區 */}
        <div className="canvas-container" style={{ width: '100%', overflow: 'hidden', minWidth: 0 }}>
          <div className="riemann-badges" style={{ flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.4rem' }}>
            <span className="badge-fn">{copy('🔴 曲線 ', '🔴 Curve ')}${preset.fnLatex}$</span>
            <span className="badge-slices">{copy('切片數 ', 'Slices ')}$N = {slicesN}$</span>
            <span className="badge-approx">
              {copy('黎曼和 ', 'Riemann sum ')}$\approx {riemannSum.toFixed(3)}$ ({copy('精確值', 'exact value')} {preset.exactIntegral})
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={450}
            height={280}
            className="riemann-canvas"
            style={{ width: '100%', height: 'auto', display: 'block', maxWidth: '100%' }}
          />
        </div>

        {/* 控制面板 */}
        <div className="riemann-controls-panel">
          <div className="slider-box">
            <div className="slider-label-row">
              <label>{copy('切片細分數 ', 'Number of slices ')}$N${copy('：', ': ')}<strong>{slicesN}</strong></label>
              <span className="dx-hint">$\Delta x = {dx.toFixed(3)}$</span>
            </div>
            <input
              type="range"
              aria-label={copy('黎曼和切片細分數', 'Number of Riemann-sum slices')}
              aria-valuetext={copy(`${slicesN} 個切片`, `${slicesN} slices`)}
              min="4"
              max="100"
              step="2"
              value={slicesN}
              onChange={(e) => setSlicesN(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="mode-toggle-group">
            <label className="group-title">{copy('取樣點模式：', 'Sample-point mode:')}</label>
            <div className="btn-group">
              <button
                type="button"
                className={`btn-mode ${sumMode === 'left' ? 'active' : ''}`}
                onClick={() => setSumMode('left')}
              >
                {copy('左端點和 (Left)', 'Left-endpoint sum')}
              </button>
              <button
                type="button"
                className={`btn-mode ${sumMode === 'mid' ? 'active' : ''}`}
                onClick={() => setSumMode('mid')}
              >
                {copy('中點和 (Midpoint)', 'Midpoint sum')}
              </button>
              <button
                type="button"
                className={`btn-mode ${sumMode === 'right' ? 'active' : ''}`}
                onClick={() => setSumMode('right')}
              >
                {copy('右端點和 (Right)', 'Right-endpoint sum')}
              </button>
            </div>
          </div>

          <div className="convergence-card">
            <h5>{copy('🎯 極限逼近診斷：', '🎯 Convergence Check:')}</h5>
            <div className="stat-row">
              <span>{copy('當前切片和：', 'Current rectangular sum:')}</span>
              <strong>{riemannSum.toFixed(4)}</strong>
            </div>
            <div className="stat-row">
              <span>{copy('微積分精確定積分：', 'Exact definite integral:')}</span>
              <strong>{preset.exactIntegral.toFixed(4)}</strong>
            </div>
            <div className="stat-row">
              <span>{copy('誤差百分比：', 'Percentage error:')}</span>
              <span className={`err-pill ${errorPct < 1 ? 'good' : ''}`}>
                {errorPct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
