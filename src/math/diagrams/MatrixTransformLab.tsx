import React, { useState, useEffect, useRef } from 'react'
import { MATRIX_PRESETS, type MatrixTransformPreset } from '../data/diagramPresets'

/**
 * 二維矩陣空間線性變換畫布 (MatrixTransformLab)
 * 高中線性代數核心：將矩陣看作二維網格基底向量 i, j 的扭曲與變換，行列式 det(A) 代表面積放大率。
 */
export const MatrixTransformLab: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(MATRIX_PRESETS[0].id)
  const [a, setA] = useState<number>(1)
  const [b, setB] = useState<number>(1)
  const [c, setC] = useState<number>(0)
  const [d, setD] = useState<number>(1)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  function applyPreset(p: MatrixTransformPreset) {
    setSelectedPresetId(p.id)
    setA(p.matrix[0][0])
    setB(p.matrix[0][1])
    setC(p.matrix[1][0])
    setD(p.matrix[1][1])
  }

  // 行列式 det(A) = ad - bc
  const det = Number((a * d - b * c).toFixed(3))

  // 在 Canvas 繪製線性變換網格
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const cx = width / 2
    const cy = height / 2
    const scale = 35 // 每個單位長度對應 35 像素

    ctx.clearRect(0, 0, width, height)

    // 1. 繪製變換後的二維坐標網格線
    const range = 6
    ctx.lineWidth = 1
    ctx.strokeStyle = '#e2e8f0'

    // 垂直網格線 (變換後)
    for (let gx = -range; gx <= range; gx++) {
      ctx.beginPath()
      for (let gy = -range; gy <= range; gy++) {
        const tx = gx * a + gy * b
        const ty = gx * c + gy * d
        const px = cx + tx * scale
        const py = cy - ty * scale
        if (gy === -range) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
    }

    // 水平網格線 (變換後)
    for (let gy = -range; gy <= range; gy++) {
      ctx.beginPath()
      for (let gx = -range; gx <= range; gx++) {
        const tx = gx * a + gy * b
        const ty = gx * c + gy * d
        const px = cx + tx * scale
        const py = cy - ty * scale
        if (gx === -range) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
    }

    // 2. 著色單位正方形變換後的平行四邊形 (det(A) 面積)
    const p0 = { x: cx, y: cy }
    const p1 = { x: cx + a * scale, y: cy - c * scale } // 變換後的 i_hat
    const p2 = { x: cx + (a + b) * scale, y: cy - (c + d) * scale }
    const p3 = { x: cx + b * scale, y: cy - d * scale } // 變換後的 j_hat

    ctx.fillStyle = det >= 0 ? 'rgba(59, 130, 246, 0.25)' : 'rgba(239, 68, 68, 0.25)'
    ctx.beginPath()
    ctx.moveTo(p0.x, p0.y)
    ctx.lineTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.lineTo(p3.x, p3.y)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = det >= 0 ? '#2563eb' : '#dc2626'
    ctx.lineWidth = 2
    ctx.stroke()

    // 3. 繪製坐標主軸 X/Y
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, cy)
    ctx.lineTo(width, cy)
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, height)
    ctx.stroke()

    // 4. 繪製基底向量 i_hat (紅色) 與 j_hat (綠色)
    // i_hat 箭頭 (a, c)
    ctx.strokeStyle = '#ef4444'
    ctx.fillStyle = '#ef4444'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(p1.x, p1.y)
    ctx.stroke()

    // j_hat 箭頭 (b, d)
    ctx.strokeStyle = '#10b981'
    ctx.fillStyle = '#10b981'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(p3.x, p3.y)
    ctx.stroke()
  }, [a, b, c, d, det])

  return (
    <div className="matrix-transform-card">
      <div className="solver-top-bar">
        <div className="solver-title-block">
          <h3>🌀 2D 矩陣空間線性變換 (3Blue1Brown 幾何視覺化)</h3>
          <p>矩陣不是一堆數字，而是「空間的拉伸、旋轉與剪切」！觀察基底向量與面積縮放比例。</p>
        </div>

        <div className="preset-tabs">
          {MATRIX_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pill-btn ${p.id === selectedPresetId ? 'active' : ''}`}
              onClick={() => applyPreset(p)}
            >
              {p.title.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="matrix-workspace-grid">
        {/* Canvas 畫布區 */}
        <div className="canvas-container">
          <div className="canvas-badges">
            <span className="badge-i">🔴 基底 î = ({a}, {c})</span>
            <span className="badge-j">🟢 基底 ĵ = ({b}, {d})</span>
            <span className={`badge-det ${det < 0 ? 'flipped' : ''}`}>
              面積比例 det(A) = {det} {det < 0 ? '（空間手性翻轉）' : ''}
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={440}
            height={360}
            className="matrix-canvas"
          />
        </div>

        {/* 矩陣參數控制滑桿 */}
        <div className="matrix-controls-panel">
          <div className="matrix-display-box">
            <h4>目前變換矩陣 A：</h4>
            <div className="matrix-bracket">
              <span className="m-left">[</span>
              <div className="m-values">
                <div><span>{a}</span><span>{b}</span></div>
                <div><span>{c}</span><span>{d}</span></div>
              </div>
              <span className="m-right">]</span>
            </div>
          </div>

          <div className="sliders-stack">
            <div className="slider-row">
              <label>î_x (a)：{a}</label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
              />
            </div>
            <div className="slider-row">
              <label>ĵ_x (b)：{b}</label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={b}
                onChange={(e) => setB(parseFloat(e.target.value))}
              />
            </div>
            <div className="slider-row">
              <label>î_y (c)：{c}</label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={c}
                onChange={(e) => setC(parseFloat(e.target.value))}
              />
            </div>
            <div className="slider-row">
              <label>ĵ_y (d)：{d}</label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={d}
                onChange={(e) => setD(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="det-insight-card">
            <h5>💡 行列式幾何意義：</h5>
            <p>
              藍色著色區域為原本 $1 \times 1$ 的單位正方形，經過矩陣 $A$ 變換後形成的平行四邊形。
              其面積恰好為 $|\det(A)| = |{det}|$！
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
