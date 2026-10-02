import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { CalculusCanvas } from './CalculusCanvas'

describe('CalculusCanvas 極限判定與邊界渲染測試', () => {
  it.each(['ln(x^2)', '1+0.001*x/((x^2)^0.5)', '1000+0.001*x/((x^2)^0.5)'])('does not infer a finite limit for %s', expression => {
    const html = renderToString(<CalculusCanvas expression={expression} x0={0} mode="limit_epsilon" />)
    expect(html).not.toContain('calc-singularity-hole')
    expect(html).not.toContain('數值估計')
  })

  it('keeps nonzero tiny secants and explains undefined endpoints accurately', () => {
    const linear = renderToString(<CalculusCanvas expression="x" x0={0} deltaX={1e-10} mode="tangent_secant" />)
    expect(linear).toContain('calc-secant-line')
    expect(linear).toContain('割線斜率 1')
    const pole = renderToString(<CalculusCanvas expression="1/x" x0={0} deltaX={0.5} mode="tangent_secant" />)
    expect(pole).not.toContain('Δx=0')
    expect(pole).toContain('端點函數值不存在')
  })
  it('does not erase a jump smaller than an absolute machine-epsilon cutoff', () => {
    const html = renderToString(<CalculusCanvas expression="0.00000000000000001*x/((x^2)^0.5)" x0={0} mode="limit_epsilon" />)
    expect(html).not.toContain('calc-singularity-hole')
  })

  it('renders reversed trapezoidal intervals as polygons and zero spans as empty', () => {
    const html = renderToString(<CalculusCanvas expression="x+1" mode="riemann_sum" intA={2} intB={0} slicesN={2} riemannMethod="trapezoidal" />)
    expect((html.match(/<polygon[^>]+data-testid="calc-riemann-bar"/g) ?? []).length).toBe(2)
    expect(html).not.toMatch(/(?:points|width|height)="[^"]*(?:NaN|Infinity)/)
    const empty = renderToString(<CalculusCanvas expression="x" mode="riemann_sum" intA={2} intB={2} />)
    expect(empty).not.toContain('calc-riemann-bar')
  })

  it('does not bridge the pole of 1/x and keeps all rendered coordinates finite', () => {
    const html = renderToString(<CalculusCanvas expression="1/x" x0={0} mode="limit_epsilon" />)
    const curve = html.match(/<path data-testid="calc-function-curve" d="([^"]*)"/)
    expect((curve?.[1].match(/M /g) ?? []).length).toBeGreaterThan(1)
    expect(html).not.toMatch(/(?:cx|cy|x1|y1|x2|y2|points|height|width|d)="[^"]*(?:NaN|Infinity)/)
  })

  it('honors Newton iteration count and isolates SVG ids between canvases', () => {
    const html = renderToString(<><CalculusCanvas expression="x^2-2" x0={3} mode="newton_slope_field" newtonSteps={1} /><CalculusCanvas expression="x^2-2" x0={3} mode="newton_slope_field" newtonSteps={3} /></>)
    expect(html).toContain('牛頓法完成 1 次迭代')
    expect(html).toContain('牛頓法完成 3 次迭代')
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('可去奇點 (x^2-1)/(x-1) 在 x0=1 時應正確判定有限極限 L=2 並標示為可去奇點', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="(x^2 - 1) / (x - 1)"
        x0={1}
        deltaX={0.01}
        mode="limit_epsilon"
      />
    )
    expect(html).toContain('數值估計')
    expect(html).toContain('數值估計 L≈2')
    // 應繪製可去奇點的空心圓標記
    expect(html).toContain('calc-singularity-hole')
  })

  it('斜率與高次項混合的可去奇點 (x+100*x^2)/x 在 x0=0 處應正確判定極限 L=1', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="(x + 100 * x^2) / x"
        x0={0}
        deltaX={0.01}
        mode="limit_epsilon"
      />
    )
    expect(html).toContain('數值估計')
    expect(html).toContain('數值估計 L≈1')
    expect(html).toContain('calc-singularity-hole')
  })

  it('超大尺度可去奇點 10000*(x^2-1)/(x-1) 在 x0=1 時應正確判定極限 L=20000 且不被人工數值上限誤殺', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="10000 * (x^2 - 1) / (x - 1)"
        x0={1}
        deltaX={0.01}
        mode="limit_epsilon"
      />
    )
    expect(html).toContain('數值估計')
    expect(html).toContain('數值估計 L≈20000')
    expect(html).toContain('calc-singularity-hole')
  })

  it('發散極點 1/(x^2) 在 x0=0 時絕不能誤判為可去奇點', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="1 / (x^2)"
        x0={0}
        deltaX={0.01}
        mode="limit_epsilon"
      />
    )
    expect(html).not.toContain('數值估計')
    expect(html).toContain('f(x0)=未定義')
    // 不應繪製可去奇點標記
    expect(html).not.toContain('calc-singularity-hole')
  })

  it('任意微小係數縮放後的發散極點 1e-30/(x^2) 在 x0=0 亦絕不誤判為可去奇點', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="0.000000000000000000000000000001 / (x^2)"
        x0={0}
        deltaX={0.01}
        mode="limit_epsilon"
      />
    )
    expect(html).not.toContain('數值估計')
    expect(html).toContain('f(x0)=未定義')
    expect(html).not.toContain('calc-singularity-hole')
  })

  it('當 deltaX=0 時割線退化但切線仍應維持繪製', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="x^2"
        x0={1}
        deltaX={0}
        mode="tangent_secant"
      />
    )
    // 應包含切線元素，而不包含割線
    expect(html).toContain('calc-tangent-line')
    expect(html).not.toContain('calc-secant-line')
  })

  it('當 deltaX 為負值 (如 deltaX=-3, x0=2) 時割線應正常跨越區間繪製且不縮成單點', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="x^2"
        x0={2}
        deltaX={-3}
        mode="tangent_secant"
      />
    )
    expect(html).toContain('calc-secant-line')
    expect(html).not.toContain('x1="100" y1="300" x2="100" y2="300"')
  })

  it('黎曼和模式下應正確渲染分割柱狀體', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="x^2"
        x0={1}
        deltaX={0.1}
        mode="riemann_sum"
        intA={0}
        intB={2}
        slicesN={10}
        riemannMethod="midpoint"
      />
    )
    expect(html).toContain('calc-riemann-bar')
  })

  it('圓柱殼法在 intA=0, slicesN=1 時應依取樣中點計算半徑，正確渲染旋轉殼幾何體', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="x + 1"
        x0={1}
        deltaX={0.1}
        mode="solids_revolution"
        intA={0}
        intB={2}
        slicesN={1}
        riemannMethod="midpoint"
        solidMethod="shell"
        rotationAngle={Math.PI * 2}
      />
    )
    expect(html).toContain('<ellipse')
  })

  it('圓盤法在不同旋轉角度 (π/2, π, 2π) 應平滑連續更新投影路徑而非固定階躍跳變', () => {
    const htmlQuarter = renderToString(
      <CalculusCanvas
        expression="x^2"
        x0={1}
        mode="solids_revolution"
        intA={0}
        intB={2}
        slicesN={4}
        solidMethod="disk"
        rotationAngle={Math.PI / 2}
      />
    )
    const htmlHalf = renderToString(
      <CalculusCanvas
        expression="x^2"
        x0={1}
        mode="solids_revolution"
        intA={0}
        intB={2}
        slicesN={4}
        solidMethod="disk"
        rotationAngle={Math.PI}
      />
    )
    const htmlFull = renderToString(
      <CalculusCanvas
        expression="x^2"
        x0={1}
        mode="solids_revolution"
        intA={0}
        intB={2}
        slicesN={4}
        solidMethod="disk"
        rotationAngle={Math.PI * 2}
      />
    )

    // π/2 與 π 產生不同幾何弧度路徑
    expect(htmlQuarter).toContain('solid-disk-arc')
    expect(htmlHalf).toContain('solid-disk-arc')
    expect(htmlQuarter).not.toBe(htmlHalf)
    // 2π 則渲染完整閉合橢圓
    expect(htmlFull).toContain('solid-disk-full')
    expect(htmlFull).toContain('<ellipse')
  })

  it('微小跳躍不連續點 0.001*x/(x^2)^0.5 在 x0=0 處左右極限相反，絕不可誤判為可去奇點', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="0.001 * x / ((x^2)^0.5)"
        x0={0}
        deltaX={0.01}
        mode="limit_epsilon"
      />
    )
    expect(html).not.toContain('數值估計')
    expect(html).toContain('f(x0)=未定義')
    expect(html).not.toContain('calc-singularity-hole')
  })

  it('零極限可去奇點 (100*x^2)/x 在 x0=0 處應正確判定極限 L=0 並標示為可去奇點', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="(100 * x^2) / x"
        x0={0}
        deltaX={0.01}
        mode="limit_epsilon"
      />
    )
    expect(html).toContain('數值估計')
    expect(html).toContain('數值估計 L≈0')
    expect(html).toContain('calc-singularity-hole')
  })

  it('超微小跳躍不連續點 0.000001*x/((x^2)^0.5) 在 x0=0 處左右極限相反，絕不可誤判為可去奇點', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="0.000001 * x / ((x^2)^0.5)"
        x0={0}
        deltaX={0.01}
        mode="limit_epsilon"
      />
    )
    expect(html).not.toContain('數值估計')
    expect(html).toContain('f(x0)=未定義')
    expect(html).not.toContain('calc-singularity-hole')
  })

  it('非零微小極限 (0.0001*x+x^2)/x 在 x0=0 處應精確判定極限 L=0.0001 且不被誤判歸零', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="(0.0001 * x + x^2) / x"
        x0={0}
        deltaX={0.01}
        mode="limit_epsilon"
      />
    )
    expect(html).toContain('數值估計')
    expect(html).toContain('數值估計 L≈0.0001')
    expect(html).toContain('calc-singularity-hole')
  })

  it('極小幅度跳躍 0.0000000000001*x/((x^2)^0.5) 在 x0=0 處左右極限相反，絕不可誤標為可去奇點', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="0.0000000000001 * x / ((x^2)^0.5)"
        x0={0}
        deltaX={0.01}
        mode="limit_epsilon"
      />
    )
    expect(html).not.toContain('數值估計')
    expect(html).toContain('f(x0)=未定義')
    expect(html).not.toContain('calc-singularity-hole')
  })

  it('平滑拋物線極小值 1000*(x-0.00625)^2+1 在頂點附近應保持連續完整曲線，不被誤切', () => {
    const html = renderToString(
      <CalculusCanvas
        expression="1000 * (x - 0.00625)^2 + 1"
        x0={0.00625}
        deltaX={0.01}
        mode="tangent_secant"
      />
    )
    // 拋物線處處連續，曲線 path 內部應為單一連續線段 (不含多個 "M ")
    const pathMatch = html.match(/<path data-testid="calc-function-curve" d="([^"]*)"/)
    expect(pathMatch).not.toBeNull()
    const pathD = pathMatch ? pathMatch[1] : ''
    const mCount = (pathD.match(/M /g) || []).length
    expect(mCount).toBe(1)
  })
})
