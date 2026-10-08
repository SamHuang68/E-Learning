import React, { useId, useMemo } from 'react'
import { CoordinateViewport } from './CoordinateViewport'
import {
  tryParseMathExpression,
  compileASTToFunction,
  differentiateAST,
  formatCalcNumber,
} from '../../engine'
import {
  highPrecisionDerivative,
  runNewtonRaphson,
  evaluateTaylorPolynomial,
} from '../../engine'
import type { CalculusCanvasProps } from '../../types'
import { useI18n } from '../../../../i18n/i18n'
import { useCalculusCopy } from '../../../../i18n/calculusCopy'

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
  newtonSteps = 5,
  solidMethod = 'disk',
  rotationAngle = Math.PI * 2,
  showFocusControl = false,
  onParamChange,
  onCanvasTelemetry,
  className = '',
}) => {
  const canvasId = useId()
  const { locale } = useI18n()
  const c = useCalculusCopy()
  const width = 600
  const height = 360

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const matrix = e.currentTarget.getScreenCTM()
    if (!matrix) return
    const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse())
    const mathX = vp.toMathX(point.x)
    if (Number.isFinite(mathX)) {
      onParamChange?.({ x0: Number(mathX.toFixed(2)) })
      onCanvasTelemetry?.({ action: 'select_x0', value: Number(mathX.toFixed(2)) })
    }
  }

  // 1. 解析函數與求值器（無效輸入不得回落到 x^2+1）
  const parsed = useMemo(() => tryParseMathExpression(expression, locale), [expression, locale])
  const ast = parsed.ok ? parsed.ast : null
  const f = useMemo(
    () => (ast ? compileASTToFunction(ast) : () => Number.NaN),
    [ast],
  )
  const fPrimeAst = useMemo(() => (ast ? differentiateAST(ast, 'x') : null), [ast])
  const fPrime = useMemo(
    () => (fPrimeAst ? compileASTToFunction(fPrimeAst) : () => Number.NaN),
    [fPrimeAst],
  )

  // 2. 視口座標計算 (自適應邊界)
  const transform = useMemo(() => {
    let minX = -1, maxX = 5
    let minY = -2, maxY = 10

    if (mode === 'limit_epsilon') {
      minX = Math.min(-0.5, x0 - 2.5)
      maxX = Math.max(3.5, x0 + 2.5)
    } else if (mode === 'riemann_sum' || mode === 'solids_revolution') {
      const startX = Math.min(intA, intB)
      const endX = Math.max(intA, intB)
      minX = Math.min(-0.5, startX - 1)
      maxX = Math.max(4.5, endX + 1)
    } else if (mode === 'ftc_accumulation') {
      const startX = Math.min(intA, x0)
      const endX = Math.max(intA, x0)
      minX = Math.min(-0.5, startX - 1)
      maxX = Math.max(4.5, endX + 1)
    }

    return { minX, maxX, minY, maxY, width, height }
  }, [mode, x0, intA, intB, width, height])

  const vp = useMemo(() => new CoordinateViewport(transform), [transform])

  // 3. 採樣繪製主曲線 f(x)（含中點細分奇點與漸近線跳躍截斷保護）
  const curvePath = useMemo(() => {
    const subpaths: string[] = []
    let currentSegment: string[] = []
    const step = (transform.maxX - transform.minX) / 240
    let prevY: number | null = null
    const yRange = transform.maxY - transform.minY

    for (let x = transform.minX; x <= transform.maxX; x += step) {
      const y = f(x)
      const isFinite = Number.isFinite(y)

      let isDiscontinuous = !isFinite
      if (isFinite && prevY !== null) {
        // 自適應二分細分檢驗 (最多深度 3 層)，精準捕捉端點邊界極點 (如 1+0.001/(x-0.024)) 同時保護平滑極小值拋物線
        const hasPole = (xL: number, yL: number, xR: number, yR: number, parentDiff: number, depth: number): boolean => {
          if (depth > 3) return false
          const xM = (xL + xR) / 2
          const yM = f(xM)
          if (!Number.isFinite(yM)) return true

          const expectedM = (yL + yR) / 2
          const diff = Math.abs(yM - expectedM)

          // 數值暴衝超過繪圖範圍，必為極點
          if (Math.abs(yM) > yRange * 2.5 && Math.abs(yM) > Math.max(Math.abs(yL), Math.abs(yR)) * 1.5) {
            return true
          }

          if (depth >= 1) {
            // 若深入細分時中點偏離度隨區間縮小反而放大，代表奇點發散
            if (diff > 1.2 * parentDiff && diff > 0.05) return true
            // 若深入細分時偏離度顯著收縮 (<= 0.6 倍)，代表為平滑二階可微曲線 (如拋物線極值)，絕非極點
            if (diff <= 0.6 * parentDiff) return false
          }

          if (diff > 0.05 && diff > Math.abs(yR - yL) * 0.25) {
            return (
              hasPole(xL, yL, xM, yM, diff, depth + 1) ||
              hasPole(xM, yM, xR, yR, diff, depth + 1)
            )
          }
          return false
        }

        const initialDiff = Math.abs(f(x - step / 2) - (prevY + y) / 2)
        // Floating-point sampling can land beside a pole instead of exactly on it.
        // A steep linear crossing has a matching midpoint and is retained.
        const poleCrossing = Math.sign(prevY) !== Math.sign(y)
          && Math.abs(y - prevY) > yRange * 2
          && initialDiff > Math.abs(y - prevY) * 0.4
        if (poleCrossing || hasPole(x - step, prevY, x, y, initialDiff, 0)) {
          isDiscontinuous = true
        }
      }

      if (!isFinite || isDiscontinuous) {
        if (currentSegment.length > 0) {
          subpaths.push(`M ${currentSegment.join(' L ')}`)
          currentSegment = []
        }
      }

      if (isFinite) {
        currentSegment.push(`${vp.toScreenX(x).toFixed(1)},${vp.toScreenY(y).toFixed(1)}`)
        prevY = y
      } else {
        prevY = null
      }
    }
    if (currentSegment.length > 0) {
      subpaths.push(`M ${currentSegment.join(' L ')}`)
    }
    return subpaths.join(' ')
  }, [f, vp, transform])

  // 4. 數值與圖層數據
  const y0 = f(x0)
  // 目標極限值 (支援可去不連續點之左右極限逼近，並防禦發散極點與跳躍不連續點)
  const limitValue = useMemo(() => {
    if (Number.isFinite(y0)) return y0
    // 採 5 步長幾何縮小取樣檢驗極限存在性，步長依序縮小 10 倍 (1e-2 ~ 1e-6)
    const steps = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6]
    const leftVals: number[] = []
    const rightVals: number[] = []
    for (const h of steps) {
      const lv = f(x0 - h)
      const rv = f(x0 + h)
      if (!Number.isFinite(lv) || !Number.isFinite(rv)) return Number.NaN
      leftVals.push(lv)
      rightVals.push(rv)
    }

    // 計算相鄰差值序列 d_k = |y_{k} - y_{k-1}|
    const dL: number[] = []
    const dR: number[] = []
    for (let k = 1; k < steps.length; k++) {
      dL.push(Math.abs(leftVals[k] - leftVals[k - 1]))
      dR.push(Math.abs(rightVals[k] - rightVals[k - 1]))
    }

    // 1. 發散檢驗：若相鄰差值隨步長縮小呈現幾何放大，表示發散至無窮大 (如 k/x^p)
    for (let k = 1; k < dL.length; k++) {
      if (dL[k] > 1.8 * dL[k - 1] && dL[k] > Math.abs(leftVals[k]) * 1e-13) return Number.NaN
      if (dR[k] > 1.8 * dR[k - 1] && dR[k] > Math.abs(rightVals[k]) * 1e-13) return Number.NaN
    }

    // 2. 收斂外推檢驗 (Richardson Extrapolation / Aitken Acceleration)：
    // 相鄰差值必須單調衰減
    const lastDiffL = dL[dL.length - 1]
    const lastDiffR = dR[dR.length - 1]
    const prevDiffL = dL[dL.length - 2]
    const prevDiffR = dR[dR.length - 2]
    if (lastDiffL > prevDiffL + 1e-12 || lastDiffR > prevDiffR + 1e-12) return Number.NaN

    // 計算收斂外推值，保留非零微小極限 (如 (0.0001*x+x^2)/x -> 0.0001)
    const ratioL = prevDiffL > 0 ? lastDiffL / prevDiffL : 0.1
    const ratioR = prevDiffR > 0 ? lastDiffR / prevDiffR : 0.1
    const roundoff = Number.EPSILON * 64 * Math.max(...leftVals.map(Math.abs), ...rightVals.map(Math.abs))
    // A constant/increasing difference (e.g. ln(x²)) does not support extrapolation.
    if ((lastDiffL > roundoff && ratioL >= 0.9) || (lastDiffR > roundoff && ratioR >= 0.9)) return Number.NaN
    // A persistent two-sided gap is a jump even after adding a large constant.
    const lastGap = Math.abs(leftVals[4] - rightVals[4])
    const previousGap = Math.abs(leftVals[3] - rightVals[3])
    if (lastGap > roundoff && lastGap >= previousGap * 0.9) return Number.NaN
    const extrapolateL = leftVals[4] + (ratioL < 0.9 ? ((leftVals[4] - leftVals[3]) * ratioL) / (1 - ratioL) : 0)
    const extrapolateR = rightVals[4] + (ratioR < 0.9 ? ((rightVals[4] - rightVals[3]) * ratioR) / (1 - ratioR) : 0)

    // 左右兩側估計值 (僅在雙精度浮點機器精度邊界 1e-15 內視為零)
    // Scale roundoff to the samples; an absolute cutoff would erase tiny jumps.
    const estL = Math.abs(extrapolateL) <= roundoff ? 0 : extrapolateL
    const estR = Math.abs(extrapolateR) <= roundoff ? 0 : extrapolateR

    // 3. 左右側一致性檢驗：
    if (estL === 0 && estR === 0) {
      return 0
    }

    // 純相對差距檢驗：無論數值多微小 (如 1e-13 或 1e-14)，相對差距大於 0.5% (0.005) 即判定雙側極限不存在
    // 任何幅度的跳躍不連續點 (如 eps*sgn(x)) 相對差距永遠是 200%，在此全部精準排除！
    const maxEst = Math.max(Math.abs(estL), Math.abs(estR))
    if (maxEst > 0) {
      const relJump = Math.abs(estL - estR) / maxEst
      if (relJump > 0.005) return Number.NaN
    } else {
      if (Math.abs(estL - estR) > 1e-15) return Number.NaN
    }

    return (estL + estR) / 2
  }, [f, x0, y0])

  const symbolicSlope = fPrime(x0)
  const slope = Number.isFinite(symbolicSlope)
    ? symbolicSlope
    : parsed.ok
      ? highPrecisionDerivative(f, x0)
      : Number.NaN
  const x1 = x0 + deltaX
  const y1 = f(x1)
  const secantSlope = deltaX === 0 ? Number.NaN : (y1 - y0) / deltaX
  const secantLabel = deltaX === 0 ? c('未定義 (Δx=0)')
    : !Number.isFinite(y0) || !Number.isFinite(y1) ? c('未定義（端點函數值不存在）')
      : !Number.isFinite(secantSlope) ? c('未定義（數值超出範圍）')
        : formatCalcNumber(secantSlope, locale)
  const probeText = parsed.ok
    ? Number.isFinite(y0)
      ? c(`x=${formatCalcNumber(x0, locale)}，f=${formatCalcNumber(y0, locale)}，f'=${formatCalcNumber(slope, locale)}`)
      : Number.isFinite(limitValue)
        ? c(`x=${formatCalcNumber(x0, locale)}，f(x0)=未定義，數值估計 L≈${formatCalcNumber(limitValue, locale)}（不代表極限證明）`)
        : c(`x=${formatCalcNumber(x0, locale)}，f(x0)=未定義`)
    : c(`無法求值：${parsed.error}`)

  // 黎曼和長條與旋轉體切片數據（支援左、右、中點矩形與真實梯形法，含反向區間與奇點防護）
  const riemannBars = useMemo(() => {
    if (mode !== 'riemann_sum' && mode !== 'ftc_accumulation' && mode !== 'solids_revolution') return []
    const bars: Array<{
      x: number
      sampleX: number
      w: number
      h: number
      sx: number
      sy: number
      sw: number
      sh: number
      polygonPoints?: string
    }> = []
    const endX = mode === 'ftc_accumulation' ? x0 : intB
    const startX = Math.min(intA, endX)
    const targetX = Math.max(intA, endX)
    const span = targetX - startX
    if (span <= 0) return []
    const dx = span / Math.max(1, slicesN)

    for (let i = 0; i < slicesN; i++) {
      const xi = startX + i * dx
      const xNext = xi + dx

      if (riemannMethod === 'trapezoidal') {
        const yL = f(xi)
        const yR = f(xNext)
        if (!Number.isFinite(yL) || !Number.isFinite(yR)) continue
        const sxL = vp.toScreenX(xi)
        const sxR = vp.toScreenX(xNext)
        const sy0 = vp.toScreenY(0)
        const syL = vp.toScreenY(yL)
        const syR = vp.toScreenY(yR)
        const polygonPoints = `${sxL.toFixed(1)},${sy0.toFixed(1)} ${sxL.toFixed(1)},${syL.toFixed(1)} ${sxR.toFixed(1)},${syR.toFixed(1)} ${sxR.toFixed(1)},${sy0.toFixed(1)}`

        bars.push({
          x: xi,
          sampleX: xi + dx / 2,
          w: dx,
          h: (yL + yR) / 2,
          sx: sxL,
          sy: Math.min(syL, syR),
          sw: sxR - sxL,
          sh: Math.abs(Math.max(syL, syR) - sy0),
          polygonPoints,
        })
      } else {
        let barH = 0
        let sampleX = xi
        if (riemannMethod === 'midpoint') {
          sampleX = xi + dx / 2
          barH = f(sampleX)
        } else if (riemannMethod === 'right') {
          sampleX = xi + dx
          barH = f(sampleX)
        } else if (riemannMethod === 'simpson') {
          sampleX = xi + dx / 2
          // Simpson 法二次插值等效高度：(f(xi) + 4*f(xi+dx/2) + f(xNext)) / 6
          const yL = f(xi)
          const yM = f(sampleX)
          const yR = f(xNext)
          barH = (yL + 4 * yM + yR) / 6
        } else {
          // 預設 left 端點
          sampleX = xi
          barH = f(sampleX)
        }

        if (!Number.isFinite(barH)) continue
        const sx = vp.toScreenX(xi)
        const sy = vp.toScreenY(Math.max(0, barH))
        const sw = vp.toScreenX(xNext) - sx
        const sh = Math.abs(vp.toScreenY(barH) - vp.toScreenY(0))

        bars.push({ x: xi, sampleX, w: dx, h: barH, sx, sy, sw, sh })
      }
    }
    return bars
  }, [mode, intA, intB, x0, slicesN, riemannMethod, f, vp])

  // 牛頓法切線數據 (支援自訂 newtonSteps 參數)
  const newtonResult = useMemo(() => {
    if (mode !== 'newton_slope_field') return null
    const steps = Math.max(1, Math.min(20, Math.floor(newtonSteps || 5)))
    return runNewtonRaphson(f, x0, steps)
  }, [mode, f, x0, newtonSteps])

  // 泰勒多項式曲線（交由 clipPath 自然裁切，遇非有限值安全斷開子路徑）
  const taylorPath = useMemo(() => {
    if (mode !== 'taylor_series') return ''
    const subpaths: string[] = []
    let currentSegment: string[] = []
    const step = (transform.maxX - transform.minX) / 160
    for (let x = transform.minX; x <= transform.maxX; x += step) {
      const y = evaluateTaylorPolynomial(f, x0, taylorOrder, x)
      if (Number.isFinite(y)) {
        currentSegment.push(`${vp.toScreenX(x).toFixed(1)},${vp.toScreenY(y).toFixed(1)}`)
      } else {
        if (currentSegment.length > 0) {
          subpaths.push(`M ${currentSegment.join(' L ')}`)
          currentSegment = []
        }
      }
    }
    if (currentSegment.length > 0) {
      subpaths.push(`M ${currentSegment.join(' L ')}`)
    }
    return subpaths.join(' ')
  }, [mode, f, x0, taylorOrder, vp, transform])

  const graphSummary = useMemo(() => {
    if (!parsed.ok) {
      return c(`函數 f(x)=${expression} 無法解析：${parsed.error}`)
    }
    const base = Number.isFinite(y0)
      ? c(`函數 f(x)=${expression}，顯示範圍 x 從 ${transform.minX.toFixed(1)} 到 ${transform.maxX.toFixed(1)}，y 從 ${transform.minY.toFixed(1)} 到 ${transform.maxY.toFixed(1)}。探索點 x=${formatCalcNumber(x0, locale)}，f(x)=${formatCalcNumber(y0, locale)}。`)
      : Number.isFinite(limitValue)
        ? c(`函數 f(x)=${expression}，顯示範圍 x 從 ${transform.minX.toFixed(1)} 到 ${transform.maxX.toFixed(1)}，y 從 ${transform.minY.toFixed(1)} 到 ${transform.maxY.toFixed(1)}。探索點 x=${formatCalcNumber(x0, locale)}，f(x0) 未定義，數值估計 L≈${formatCalcNumber(limitValue, locale)}。`)
        : c(`函數 f(x)=${expression}，顯示範圍 x 從 ${transform.minX.toFixed(1)} 到 ${transform.maxX.toFixed(1)}，y 從 ${transform.minY.toFixed(1)} 到 ${transform.maxY.toFixed(1)}。探索點 x=${formatCalcNumber(x0, locale)}，f(x0) 未定義。`)
    if (mode === 'tangent_secant' || mode === 'optimization_mvt') {
      return c(`${base} 切線斜率 ${formatCalcNumber(slope, locale)}；割線斜率 ${secantLabel}。`)
    }
    if (mode === 'riemann_sum' || mode === 'ftc_accumulation') {
      return c(`${base} 積分區間 ${intA.toFixed(1)} 到 ${(mode === 'ftc_accumulation' ? x0 : intB).toFixed(1)}，使用 ${slicesN} 個切片。`)
    }
    if (mode === 'taylor_series') return c(`${base} 顯示 ${taylorOrder} 階泰勒多項式近似。`)
    if (mode === 'limit_epsilon') return c(`${base} epsilon 容忍度 ${epsilon.toFixed(2)}，delta x ${deltaX.toFixed(3)}。`)
    if (mode === 'newton_slope_field' && newtonResult) {
      return c(`${base} 牛頓法完成 ${newtonResult.iterations.length} 次迭代。`)
    }
    if (mode === 'solids_revolution') {
      return solidMethod === 'shell'
        ? c(`${base} 旋轉體使用 ${slicesN} 個圓柱殼切片。`)
        : c(`${base} 旋轉體使用 ${slicesN} 個圓盤切片。`)
    }
    return base
  }, [c, deltaX, epsilon, expression, intA, intB, limitValue, locale, mode, newtonResult, parsed, secantLabel, slicesN, slope, solidMethod, taylorOrder, transform, x0, y0])

  return (
    <div className={`calculus-canvas-card ${className}`}>
      <div className="canvas-header-bar">
        <span className="canvas-badge">{c('📈 60 FPS 向量幾何視口')}</span>
        <span className="canvas-coord-info">
          X: [{transform.minX.toFixed(1)}, {transform.maxX.toFixed(1)}] · Y: [{transform.minY.toFixed(1)}, {transform.maxY.toFixed(1)}]
        </span>
      </div>
      {showFocusControl && onParamChange && (
        <div className="slider-item">
          <label className="slider-label-row" htmlFor={`calculus-canvas-x0-${canvasId}`}>
            <span>{c('探索焦點 / 切點 x₀:')}</span>
            <strong>{x0.toFixed(2)}</strong>
          </label>
          <input
            id={`calculus-canvas-x0-${canvasId}`}
            className="calculus-canvas-focus"
            type="range"
            min={transform.minX}
            max={transform.maxX}
            step={0.01}
            value={x0}
            aria-valuetext={c(`${x0.toFixed(2)} x 座標`)}
            onChange={(event) => {
              const nextX = Number(event.target.value)
              onParamChange({ x0: nextX })
              onCanvasTelemetry?.({ action: 'select_x0', value: nextX })
            }}
          />
        </div>
      )}
      <p
        className={`canvas-probe-readout ${parsed.ok ? '' : 'canvas-probe-error'}`}
        data-testid="calculus-probe"
        role={parsed.ok ? undefined : 'alert'}
      >
        {probeText}
      </p>
      {parsed.ok ? null : (
        <p className="canvas-parse-error">{c('請修正函數表達式後再求值（不完整輸入如 x+ 會被拒絕）。')}</p>
      )}

      <div className="canvas-svg-container" style={{ width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="calc-interactive-svg"
          style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }}
          role="img"
          onClick={handleCanvasClick}
          aria-labelledby={`calculus-graph-title-${canvasId} calculus-graph-desc-${canvasId}`}
        >
          <title id={`calculus-graph-title-${canvasId}`}>{`${c('互動函數圖：')}${expression}`}</title>
          <desc id={`calculus-graph-desc-${canvasId}`}>{graphSummary}</desc>
          <defs>
            <clipPath id={`calculus-viewport-clip-${canvasId}`}>
              <rect x="0" y="0" width={width} height={height} />
            </clipPath>
            <pattern id={`calculus-minor-grid-${canvasId}`} width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(148, 163, 184, 0.22)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect x="0" y="0" width={width} height={height} fill={`url(#calculus-minor-grid-${canvasId})`} />

          {/* 坐標軸與網格 */}
          <line x1={vp.toScreenX(transform.minX)} y1={vp.toScreenY(0)} x2={vp.toScreenX(transform.maxX)} y2={vp.toScreenY(0)} stroke="#64748b" strokeWidth="1.5" />
          <line x1={vp.toScreenX(0)} y1={vp.toScreenY(transform.minY)} x2={vp.toScreenX(0)} y2={vp.toScreenY(transform.maxY)} stroke="#64748b" strokeWidth="1.5" />

          {/* 所有曲線、切線、割線、矩形在 clip-path 內渲染 */}
          <g clipPath={`url(#calculus-viewport-clip-${canvasId})`}>

          {/* 1. 極限與 Epsilon-Delta 容忍帶 */}
          {mode === 'limit_epsilon' && (
            <>
              {/* 水平 Epsilon 帶 (以目標極限值 limitValue 為中心，支援可去奇點) */}
              {Number.isFinite(limitValue) && (
                <rect
                  x={vp.toScreenX(transform.minX)}
                  y={vp.toScreenY(limitValue + epsilon)}
                  width={width}
                  height={Math.abs(vp.toScreenY(limitValue - epsilon) - vp.toScreenY(limitValue + epsilon))}
                  fill="rgba(34, 197, 94, 0.15)"
                  stroke="#16a34a"
                  strokeDasharray="4 2"
                />
              )}
              {/* 垂直 Delta 帶 (以 |deltaX| 對稱展開，避免負值位移偏離) */}
              {Math.abs(deltaX) > 0 && (
                <rect
                  x={vp.toScreenX(x0 - Math.abs(deltaX))}
                  y={0}
                  width={Math.abs(vp.toScreenX(x0 + Math.abs(deltaX)) - vp.toScreenX(x0 - Math.abs(deltaX)))}
                  height={height}
                  fill="rgba(56, 189, 248, 0.12)"
                  stroke="#0284c7"
                  strokeDasharray="4 2"
                />
              )}
            </>
          )}

          {/* 2. 黎曼和切片（支援矩形與真實梯形） */}
          {riemannBars.map((bar, idx) =>
            bar.polygonPoints ? (
              <polygon
                key={idx}
                data-testid="calc-riemann-bar"
                points={bar.polygonPoints}
                fill="rgba(59, 130, 246, 0.2)"
                stroke="#2563eb"
                strokeWidth="1"
              />
            ) : (
              <rect
                key={idx}
                data-testid="calc-riemann-bar"
                x={bar.sx}
                y={bar.sy}
                width={Math.max(1, bar.sw - 1)}
                height={bar.sh}
                fill="rgba(59, 130, 246, 0.2)"
                stroke="#2563eb"
                strokeWidth="1"
              />
            ),
          )}

          {/* 3. 泰勒多項式曲線 */}
          {mode === 'taylor_series' && taylorPath && (
            <path d={taylorPath} fill="none" stroke="#9333ea" strokeWidth="2.5" strokeDasharray="5 3" />
          )}

          {/* 主函數曲線 f(x) */}
          <path data-testid="calc-function-curve" d={curvePath} fill="none" stroke="#38bdf8" strokeWidth="3" />

          {/* 4. 割線與切線 (Tangent & Secant) */}
          {(mode === 'tangent_secant' || mode === 'optimization_mvt') && (
            <>
              {/* 切線：只依賴有限的 y0 與 slope */}
              {Number.isFinite(y0) && Number.isFinite(slope) && (
                <line
                  data-testid="calc-tangent-line"
                  x1={vp.toScreenX(x0 - 1.2)}
                  y1={vp.toScreenY(y0 - 1.2 * slope)}
                  x2={vp.toScreenX(x0 + 1.2)}
                  y2={vp.toScreenY(y0 + 1.2 * slope)}
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              )}
              {/* 割線與直角三角形：檢查 y0, y1 與 secantSlope (支援正負方向 deltaX) */}
              {Number.isFinite(y0) &&
                Number.isFinite(y1) &&
                Number.isFinite(secantSlope) && (() => {
                  const minSecX = Math.min(x0, x1) - 1.2
                  const maxSecX = Math.max(x0, x1) + 1.2
                  return (
                    <>
                      <line
                        data-testid="calc-secant-line"
                        x1={vp.toScreenX(minSecX)}
                        y1={vp.toScreenY(y0 + secantSlope * (minSecX - x0))}
                        x2={vp.toScreenX(maxSecX)}
                        y2={vp.toScreenY(y0 + secantSlope * (maxSecX - x0))}
                        stroke="#f43f5e"
                        strokeWidth="2"
                      />
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
                  )
                })()}
            </>
          )}

          {/* 5. 牛頓法迭代階梯 */}
          {mode === 'newton_slope_field' && newtonResult && (
            <>
              {newtonResult.iterations.filter(it => [it.xCurrent, it.fx, it.xNext, f(it.xNext)].every(Number.isFinite)).map((it, idx) => (
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

          {/* 6. 旋轉體幾何展開與圓盤切片 */}
          {mode === 'solids_revolution' && (
            <g className="calculus-solids-layer">
              {/* x 軸下方鏡像對稱曲線 -f(x)：僅在圓盤法繞 x 軸旋轉時呈現 */}
              {solidMethod === 'disk' && (
                <path
                  d={curvePath}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.6"
                  transform={`matrix(1 0 0 -1 0 ${2 * vp.toScreenY(0)})`}
                />
              )}
              {/* 旋轉微元：依 rotationAngle (0 ~ 2pi) 連續平滑投影幾何，消除硬性階躍門檻 */}
              {rotationAngle > 0 &&
                (() => {
                  const theta = Math.min(Math.PI * 2, Math.max(0, rotationAngle))
                  const isFull = theta >= Math.PI * 2 - 0.05
                  const largeArc = theta > Math.PI ? 1 : 0
                  return solidMethod === 'shell'
                    ? riemannBars.map((bar, idx) => {
                        const radiusX = Math.abs(vp.toScreenX(bar.sampleX) - vp.toScreenX(0))
                        if (radiusX < 2) return null
                        const cx = vp.toScreenX(0)
                        const yBottom = vp.toScreenY(0)
                        const yTop = vp.toScreenY(bar.h)
                        const rx = radiusX
                        const ry = Math.max(3, radiusX * 0.22)
                        const xEndTop = cx + rx * Math.sin(theta)
                        const yEndTop = yTop - ry * Math.cos(theta)
                        const xEndBot = cx + rx * Math.sin(theta)
                        const yEndBot = yBottom - ry * Math.cos(theta)

                        return (
                          <g key={`solid-shell-${idx}`}>
                            {isFull ? (
                              <>
                                <ellipse cx={cx} cy={yTop} rx={rx} ry={ry} fill="rgba(2, 132, 199, 0.08)" stroke="#0284c7" strokeWidth="1.2" />
                                <ellipse cx={cx} cy={yBottom} rx={rx} ry={ry} fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
                                <line x1={cx - rx} y1={yBottom} x2={cx - rx} y2={yTop} stroke="#0284c7" strokeWidth="1" />
                                <line x1={cx + rx} y1={yBottom} x2={cx + rx} y2={yTop} stroke="#0284c7" strokeWidth="1" />
                              </>
                            ) : (
                              <>
                                {/* 頂部扇面 */}
                                <path
                                  d={`M ${cx} ${yTop} L ${cx} ${yTop - ry} A ${rx} ${ry} 0 ${largeArc} 1 ${xEndTop.toFixed(1)} ${yEndTop.toFixed(1)} Z`}
                                  fill="rgba(2, 132, 199, 0.08)"
                                  stroke="#0284c7"
                                  strokeWidth="1.2"
                                />
                                {/* 底部展開弧 */}
                                <path
                                  d={`M ${cx} ${yBottom - ry} A ${rx} ${ry} 0 ${largeArc} 1 ${xEndBot.toFixed(1)} ${yEndBot.toFixed(1)}`}
                                  fill="none"
                                  stroke="#0284c7"
                                  strokeWidth="1"
                                  strokeDasharray="3 3"
                                />
                                {/* 起始母線與終端母線 */}
                                <line x1={cx} y1={yBottom - ry} x2={cx} y2={yTop - ry} stroke="#0284c7" strokeWidth="1" />
                                <line x1={xEndBot} y1={yEndBot} x2={xEndTop} y2={yEndTop} stroke="#0284c7" strokeWidth="1" />
                              </>
                            )}
                          </g>
                        )
                      })
                    : riemannBars.map((bar, idx) => {
                        const rx = Math.max(3, bar.sw / 2)
                        const ry = Math.max(2, Math.abs(vp.toScreenY(bar.h) - vp.toScreenY(0)))
                        const cx = bar.sx + bar.sw / 2
                        const cy = vp.toScreenY(0)
                        const xEnd = cx + rx * Math.sin(theta)
                        const yEnd = cy - ry * Math.cos(theta)

                        return isFull ? (
                          <ellipse
                            key={`solid-disk-${idx}`}
                            data-testid="solid-disk-full"
                            cx={cx}
                            cy={cy}
                            rx={rx}
                            ry={ry}
                            fill="rgba(2, 132, 199, 0.12)"
                            stroke="#0284c7"
                            strokeWidth="1"
                            strokeDasharray={idx % 2 === 1 ? '2 2' : undefined}
                          />
                        ) : (
                          <path
                            key={`solid-disk-arc-${idx}`}
                            data-testid="solid-disk-arc"
                            d={`M ${cx} ${cy} L ${cx} ${cy - ry} A ${rx} ${ry} 0 ${largeArc} 1 ${xEnd.toFixed(1)} ${yEnd.toFixed(1)} Z`}
                            fill="rgba(2, 132, 199, 0.12)"
                            stroke="#0284c7"
                            strokeWidth="1"
                          />
                        )
                      })
                })()}
            </g>
          )}

          {/* 切點/探針焦點 P(x0, y0) 或可去奇點空心圓 */}
          {Number.isFinite(y0) ? (
            <>
              <line x1={vp.toScreenX(x0)} y1={vp.toScreenY(0)} x2={vp.toScreenX(x0)} y2={vp.toScreenY(y0)} stroke="#0284c7" strokeWidth="1.25" strokeDasharray="3 3" />
              <circle cx={vp.toScreenX(x0)} cy={vp.toScreenY(y0)} r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            </>
          ) : Number.isFinite(limitValue) ? (
            <>
              <line x1={vp.toScreenX(x0)} y1={vp.toScreenY(0)} x2={vp.toScreenX(x0)} y2={vp.toScreenY(limitValue)} stroke="#0284c7" strokeWidth="1.25" strokeDasharray="3 3" />
              <circle
                data-testid="calc-singularity-hole"
                cx={vp.toScreenX(x0)}
                cy={vp.toScreenY(limitValue)}
                r="6"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="2.5"
              />
            </>
          ) : null}
          </g>

          {/* 坐標軸標籤位於頂層 */}
          <text x={width - 24} y={vp.toScreenY(0) - 8} fill="#94a3b8" fontSize="12" fontWeight="bold">x</text>
          <text x={vp.toScreenX(0) + 8} y={20} fill="#94a3b8" fontSize="12" fontWeight="bold">y</text>
        </svg>
      </div>

      <p className="sr-only" aria-live="polite">{graphSummary}</p>

      <div className="canvas-footer-legend">
        <span className="legend-item"><span className="dot blue" /> {c('原函數 f(x)')}</span>
        {(mode === 'tangent_secant' || mode === 'optimization_mvt') && (
          <>
            <span className="legend-item"><span className="line green-dash" /> {c("切線 f'(x0)=")}{formatCalcNumber(slope, locale)}</span>
            <span className="legend-item"><span className="line red" /> {c('割線 Δy/Δx=')}{secantLabel}</span>
          </>
        )}
        {mode === 'riemann_sum' && (
          <span className="legend-item"><span className="box blue-fill" /> {c('黎曼和長條 (N=')}{slicesN})</span>
        )}
        {mode === 'solids_revolution' && (
          <span className="legend-item"><span className="box blue-fill" /> {c('旋轉切片輪廓')} (N={slicesN}, {solidMethod})</span>
        )}
        {mode === 'taylor_series' && (
          <span className="legend-item"><span className="line purple-dash" /> {c('泰勒多項式 (Order')}{' '}{taylorOrder})</span>
        )}
        {mode === 'newton_slope_field' && (
          <span className="legend-item"><span className="line orange" /> {c('牛頓法切線逼近軌跡')}</span>
        )}
      </div>
    </div>
  )
}
