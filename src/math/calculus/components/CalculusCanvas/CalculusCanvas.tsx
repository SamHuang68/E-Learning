import React, { useMemo } from 'react'
import { CoordinateViewport } from './CoordinateViewport'
import { parseMathExpression, compileASTToFunction, differentiateAST } from '../../engine'
import {
  highPrecisionDerivative,
  runNewtonRaphson,
  evaluateTaylorPolynomial,
} from '../../engine'
import type { CalculusCanvasProps } from '../../types'

export const CalculusCanvas: React.FC<CalculusCanvasProps> = ({
  expression,
  mode,
  x0 = 1.5,
  deltaX = 0.5,
  intA = 0,
  intB = 3,
  slicesN = 12,
  riemannMethod = 'midpoint',
  taylorOrder = 3,
  epsilon = 0.5,
  className = '',
}) => {
  const width = 600
  const height = 360

  // 1. 解析函數與求值器
  const ast = useMemo(() => parseMathExpression(expression), [expression])
  const f = useMemo(() => compileASTToFunction(ast), [ast])
  const fPrimeAst = useMemo(() => differentiateAST(ast, 'x'), [ast])
  const fPrime = useMemo(() => compileASTToFunction(fPrimeAst), [fPrimeAst])

  // 2. 視口座標計算 (自適應邊界)
  const transform = useMemo(() => {
    let minX = -1, maxX = 5
    let minY = -2, maxY = 10

    if (mode === 'limit_epsilon') {
      minX = Math.min(-0.5, x0 - 2.5)
      maxX = Math.max(3.5, x0 + 2.5)
    } else if (mode === 'riemann_sum' || mode === 'ftc_accumulation') {
      minX = Math.min(-0.5, intA - 1)
      maxX = Math.max(4.5, intB + 1)
    }

    return { minX, maxX, minY, maxY, width, height }
  }, [mode, x0, intA, intB, width, height])

  const vp = useMemo(() => new CoordinateViewport(transform), [transform])

  // 3. 採樣繪製主曲線 f(x)
  const curvePath = useMemo(() => {
    const points: string[] = []
    const step = (transform.maxX - transform.minX) / 120
    for (let x = transform.minX; x <= transform.maxX; x += step) {
      const y = f(x)
      if (Number.isFinite(y)) {
        points.push(`${vp.toScreenX(x).toFixed(1)},${vp.toScreenY(y).toFixed(1)}`)
      }
    }
    return `M ${points.join(' L ')}`
  }, [f, vp, transform])

  // 4. 數值與圖層數據
  const y0 = f(x0)
  const slope = fPrime(x0) || highPrecisionDerivative(f, x0)
  const x1 = x0 + deltaX
  const y1 = f(x1)
  const secantSlope = (y1 - y0) / (deltaX || 1e-6)

  // 黎曼和長條切片數據
  const riemannBars = useMemo(() => {
    if (mode !== 'riemann_sum' && mode !== 'ftc_accumulation') return []
    const bars: Array<{ x: number; w: number; h: number; sx: number; sy: number; sw: number; sh: number }> = []
    const endX = mode === 'ftc_accumulation' ? x0 : intB
    const dx = (endX - intA) / Math.max(1, slicesN)
    if (dx <= 0) return []

    for (let i = 0; i < slicesN; i++) {
      const xi = intA + i * dx
      let sampleX = xi
      if (riemannMethod === 'midpoint') sampleX = xi + dx / 2
      else if (riemannMethod === 'right') sampleX = xi + dx
      else if (riemannMethod === 'trapezoidal') sampleX = xi + dx / 2 // 近似

      const barH = f(sampleX)
      const sx = vp.toScreenX(xi)
      const sy = vp.toScreenY(Math.max(0, barH))
      const sw = vp.toScreenX(xi + dx) - sx
      const sh = Math.abs(vp.toScreenY(barH) - vp.toScreenY(0))

      bars.push({ x: xi, w: dx, h: barH, sx, sy, sw, sh })
    }
    return bars
  }, [mode, intA, intB, x0, slicesN, riemannMethod, f, vp])

  // 牛頓法切線數據
  const newtonResult = useMemo(() => {
    if (mode !== 'newton_slope_field') return null
    return runNewtonRaphson(f, x0, 5)
  }, [mode, f, x0])

  // 泰勒多項式曲線
  const taylorPath = useMemo(() => {
    if (mode !== 'taylor_series') return ''
    const points: string[] = []
    const step = (transform.maxX - transform.minX) / 100
    for (let x = transform.minX; x <= transform.maxX; x += step) {
      const y = evaluateTaylorPolynomial(f, x0, taylorOrder, x)
      if (Number.isFinite(y) && y > transform.minY - 5 && y < transform.maxY + 5) {
        points.push(`${vp.toScreenX(x).toFixed(1)},${vp.toScreenY(y).toFixed(1)}`)
      }
    }
    return `M ${points.join(' L ')}`
  }, [mode, f, x0, taylorOrder, vp, transform])

  return (
    <div className={`calculus-canvas-card ${className}`}>
      <div className="canvas-header-bar">
        <span className="canvas-badge">📈 60 FPS 向量幾何視口</span>
        <span className="canvas-coord-info">
          X: [{transform.minX.toFixed(1)}, {transform.maxX.toFixed(1)}] · Y: [{transform.minY.toFixed(1)}, {transform.maxY.toFixed(1)}]
        </span>
      </div>

      <div className="canvas-svg-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="calc-interactive-svg">
          <defs>
            <clipPath id="calculus-viewport-clip">
              <rect x="0" y="0" width={width} height={height} />
            </clipPath>
          </defs>

          {/* 坐標軸與網格 */}
          <line x1={vp.toScreenX(transform.minX)} y1={vp.toScreenY(0)} x2={vp.toScreenX(transform.maxX)} y2={vp.toScreenY(0)} stroke="#475569" strokeWidth="1.5" />
          <line x1={vp.toScreenX(0)} y1={vp.toScreenY(transform.minY)} x2={vp.toScreenX(0)} y2={vp.toScreenY(transform.maxY)} stroke="#475569" strokeWidth="1.5" />

          {/* 所有曲線、切線、割線、矩形在 clip-path 內渲染 */}
          <g clipPath="url(#calculus-viewport-clip)">

          {/* 1. 極限與 Epsilon-Delta 容忍帶 */}
          {mode === 'limit_epsilon' && (
            <>
              {/* 水平 Epsilon 帶 */}
              <rect
                x={vp.toScreenX(transform.minX)}
                y={vp.toScreenY(y0 + epsilon)}
                width={width}
                height={Math.abs(vp.toScreenY(y0 - epsilon) - vp.toScreenY(y0 + epsilon))}
                fill="rgba(34, 197, 94, 0.15)"
                stroke="#16a34a"
                strokeDasharray="4 2"
              />
              {/* 垂直 Delta 帶 */}
              <rect
                x={vp.toScreenX(x0 - deltaX)}
                y={0}
                width={Math.abs(vp.toScreenX(x0 + deltaX) - vp.toScreenX(x0 - deltaX))}
                height={height}
                fill="rgba(56, 189, 248, 0.12)"
                stroke="#0284c7"
                strokeDasharray="4 2"
              />
            </>
          )}

          {/* 2. 黎曼和矩形切片 */}
          {riemannBars.map((bar, idx) => (
            <rect
              key={idx}
              x={bar.sx}
              y={bar.sy}
              width={Math.max(1, bar.sw - 1)}
              height={bar.sh}
              fill="rgba(59, 130, 246, 0.25)"
              stroke="#2563eb"
              strokeWidth="1"
            />
          ))}

          {/* 3. 泰勒多項式曲線 */}
          {mode === 'taylor_series' && taylorPath && (
            <path d={taylorPath} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="5 3" />
          )}

          {/* 主函數曲線 f(x) */}
          <path d={curvePath} fill="none" stroke="#38bdf8" strokeWidth="3" />

          {/* 4. 割線與切線 (Tangent & Secant) */}
          {(mode === 'tangent_secant' || mode === 'optimization_mvt') && (
            <>
              {/* 割線 */}
              <line
                x1={vp.toScreenX(x0 - 1.5)}
                y1={vp.toScreenY(y0 - 1.5 * secantSlope)}
                x2={vp.toScreenX(x1 + 1.5)}
                y2={vp.toScreenY(y1 + 1.5 * secantSlope)}
                stroke="#f43f5e"
                strokeWidth="2"
              />
              {/* 切線 */}
              <line
                x1={vp.toScreenX(x0 - 1.2)}
                y1={vp.toScreenY(y0 - 1.2 * slope)}
                x2={vp.toScreenX(x0 + 1.2)}
                y2={vp.toScreenY(y0 + 1.2 * slope)}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              {/* 割線直角三角形 */}
              <polygon
                points={`
                  ${vp.toScreenX(x0)},${vp.toScreenY(y0)}
                  ${vp.toScreenX(x1)},${vp.toScreenY(y0)}
                  ${vp.toScreenX(x1)},${vp.toScreenY(y1)}
                `}
                fill="rgba(244, 63, 94, 0.15)"
                stroke="#f43f5e"
                strokeDasharray="2 2"
              />
              <circle cx={vp.toScreenX(x1)} cy={vp.toScreenY(y1)} r="5" fill="#f43f5e" />
            </>
          )}

          {/* 5. 牛頓法迭代階梯 */}
          {mode === 'newton_slope_field' && newtonResult && (
            <>
              {newtonResult.iterations.map((it, idx) => (
                <g key={idx}>
                  {/* 切線下穿至 xNext */}
                  <line
                    x1={vp.toScreenX(it.xCurrent)}
                    y1={vp.toScreenY(it.fx)}
                    x2={vp.toScreenX(it.xNext)}
                    y2={vp.toScreenY(0)}
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                  {/* 垂直折線回曲線上 */}
                  <line
                    x1={vp.toScreenX(it.xNext)}
                    y1={vp.toScreenY(0)}
                    x2={vp.toScreenX(it.xNext)}
                    y2={vp.toScreenY(f(it.xNext))}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  <circle cx={vp.toScreenX(it.xNext)} cy={vp.toScreenY(0)} r="4" fill="#f59e0b" />
                </g>
              ))}
            </>
          )}

          {/* 切點/探針焦點 P(x0, y0) */}
          <line x1={vp.toScreenX(x0)} y1={vp.toScreenY(0)} x2={vp.toScreenX(x0)} y2={vp.toScreenY(y0)} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={vp.toScreenX(x0)} cy={vp.toScreenY(y0)} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* 坐標軸標籤位於頂層 */}
          <text x={width - 24} y={vp.toScreenY(0) - 8} fill="#94a3b8" fontSize="12" fontWeight="bold">x</text>
          <text x={vp.toScreenX(0) + 8} y={20} fill="#94a3b8" fontSize="12" fontWeight="bold">y</text>
        </svg>
      </div>

      <div className="canvas-footer-legend">
        <span className="legend-item"><span className="dot blue" /> 原函數 f(x)</span>
        {(mode === 'tangent_secant' || mode === 'optimization_mvt') && (
          <>
            <span className="legend-item"><span className="line green-dash" /> 切線 f'(x0)={slope.toFixed(2)}</span>
            <span className="legend-item"><span className="line red" /> 割線 Δy/Δx={secantSlope.toFixed(2)}</span>
          </>
        )}
        {mode === 'riemann_sum' && (
          <span className="legend-item"><span className="box blue-fill" /> 黎曼和長條 (N={slicesN})</span>
        )}
        {mode === 'taylor_series' && (
          <span className="legend-item"><span className="line purple-dash" /> 泰勒多項式 (Order {taylorOrder})</span>
        )}
        {mode === 'newton_slope_field' && (
          <span className="legend-item"><span className="line orange" /> 牛頓法切線逼近軌跡</span>
        )}
      </div>
    </div>
  )
}
