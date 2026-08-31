import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RIEMANN_PRESETS } from '../data/diagramPresets'

/**
 * 黎曼和切片極限與微積分視覺化 (RiemannCalculusLab)
 * 高中微積分核心：將定積分看作長條切片無限細分的極限，親手調整切片數 N 觀察階梯逼近連續曲線。
 */
export const RiemannCalculusLab: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(RIEMANN_PRESETS[0].id)
  const [slicesN, setSlicesN] = useState<number>(8)
  const [sumMode, setSumMode] = useState<'left' | 'right' | 'mid'>('mid')

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const preset = RIEMANN_PRESETS.find((p) => p.id === selectedPresetId) ?? RIEMANN_PRESETS[0]

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
          <h3>📈 黎曼和與定積分切片極限 (Riemann Sum)</h3>
          <p>定積分不是玄學公式！拖動滑桿將切片數 $N$ 從 4 增加到 100，親眼目睹矩陣和收斂至平滑曲線面積。</p>
        </div>

        <div className="preset-tabs">
          {RIEMANN_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pill-btn ${p.id === selectedPresetId ? 'active' : ''}`}
              onClick={() => setSelectedPresetId(p.id)}
            >
              {p.title.split('：')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="riemann-workspace-grid">
        {/* Canvas 曲線與階梯和繪製區 */}
        <div className="canvas-container" style={{ width: '100%', overflow: 'hidden', minWidth: 0 }}>
          <div className="riemann-badges" style={{ flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.4rem' }}>
            <span className="badge-fn">🔴 曲線 ${preset.fnLatex}$</span>
            <span className="badge-slices">切片數 $N = {slicesN}$</span>
            <span className="badge-approx">
              黎曼和 $\approx {riemannSum.toFixed(3)}$ (精確值 {preset.exactIntegral})
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
              <label>切片細分數 $N$：<strong>{slicesN}</strong></label>
              <span className="dx-hint">$\Delta x = {dx.toFixed(3)}$</span>
            </div>
            <input
              type="range"
              aria-label="黎曼和切片細分數"
              aria-valuetext={`${slicesN} 個切片`}
              min="4"
              max="100"
              step="2"
              value={slicesN}
              onChange={(e) => setSlicesN(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="mode-toggle-group">
            <label className="group-title">取樣點模式：</label>
            <div className="btn-group">
              <button
                type="button"
                className={`btn-mode ${sumMode === 'left' ? 'active' : ''}`}
                onClick={() => setSumMode('left')}
              >
                左端點和 (Left)
              </button>
              <button
                type="button"
                className={`btn-mode ${sumMode === 'mid' ? 'active' : ''}`}
                onClick={() => setSumMode('mid')}
              >
                中點和 (Midpoint)
              </button>
              <button
                type="button"
                className={`btn-mode ${sumMode === 'right' ? 'active' : ''}`}
                onClick={() => setSumMode('right')}
              >
                右端點和 (Right)
              </button>
            </div>
          </div>

          <div className="convergence-card">
            <h5>🎯 極限逼近診斷：</h5>
            <div className="stat-row">
              <span>當前切片和：</span>
              <strong>{riemannSum.toFixed(4)}</strong>
            </div>
            <div className="stat-row">
              <span>微積分精確定積分：</span>
              <strong>{preset.exactIntegral.toFixed(4)}</strong>
            </div>
            <div className="stat-row">
              <span>誤差百分比：</span>
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
