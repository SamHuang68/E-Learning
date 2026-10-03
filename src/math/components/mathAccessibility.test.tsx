import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MathToday } from './MathToday'
import { MathPractice } from './MathPractice'
import { G1_DATA } from '../data/elementary/g1_to_g3'
import { defaultMathProgress } from '../utils/mathStorage'
import { CalculusAssessmentWidget } from '../calculus/components/CalculusAssessment/CalculusAssessmentWidget'
import { CalculusLabPanel } from '../calculus/components/CalculusLab/CalculusLabPanel'
import { FormulaStepCard } from '../calculus/components/CalculusSolver/FormulaStepCard'
import { CalculusCanvas } from '../calculus/components/CalculusCanvas/CalculusCanvas'
import { CALCULUS_PROBLEMS } from '../calculus/data/calculusProblems'
import { generateDerivationSteps } from '../calculus/engine'

const noop = () => {}
afterEach(() => vi.unstubAllGlobals())

describe('math controls expose their current action and selection', () => {
  it('gives every selectable unit a native button while retaining the current unit', () => {
    const html = renderToString(<MathToday gradeInfo={G1_DATA} currentUnit={G1_DATA.units[1]} progress={defaultMathProgress()} onSelectUnit={noop} onStartPractice={noop} onOpenLab={noop} onOpenMock={noop} onOpenVault={noop} onOpenVisual={noop} />)
    const buttons = [...html.matchAll(/<button[^>]+class="unit-card-select"[^>]*aria-pressed="(true|false)"[^>]*>(.*?)<\/button>/g)]
    expect(buttons).toHaveLength(G1_DATA.units.length)
    expect(buttons.filter((button) => button[1] === 'true').map((button) => button[2])).toEqual([G1_DATA.units[1].title])
  })

  it('provides a named focus target for opt-in practice shortcuts without replacing native answer buttons', () => {
    const html = renderToString(<MathPractice unit={G1_DATA.units[0]} onBack={noop} />)
    expect(html).toContain(`role="region" aria-label="${G1_DATA.units[0].title}"`)
    expect(html).toContain('aria-keyshortcuts="A B C D 1 2 3 4 Enter Space H" tabindex="0"')
    expect([...html.matchAll(/class="option-btn"[^>]*aria-pressed="false"/g)]).toHaveLength(4)
  })

  it('distinguishes every calculus problem even when several share a tier label', () => {
    const html = renderToString(<CalculusAssessmentWidget currentTheta={0} onSolveProblem={noop} onSelectProblem={noop} />)
    const labels = [...html.matchAll(/class="btn-tier-pill[^"]*" aria-label="([^"]+)"/g)].map((match) => match[1])
    expect(labels).toHaveLength(CALCULUS_PROBLEMS.length)
    expect(new Set(labels).size).toBe(CALCULUS_PROBLEMS.length)
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1)
  })

  it('exposes the selected calculus mode and Riemann sampling endpoint', () => {
    const html = renderToString(<CalculusLabPanel mode="riemann_sum" expression="x^2" x0={1} deltaX={0.2} intA={0} intB={3} slicesN={20} riemannMethod="right" taylorOrder={3} epsilon={0.5} onModeSelect={noop} onExpressionChange={noop} onParamChange={noop} />)
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(2)
    expect(html).toMatch(/class="btn-mode-tab active" aria-pressed="true"/)
    expect(html).toMatch(/class="seg-btn active" aria-pressed="true"/)
  })

  it('makes derivation selection a native button separate from checkpoint controls', () => {
    const step = generateDerivationSteps('x^2')[0]
    const html = renderToString(<FormulaStepCard step={step} isActive isCompleted={false} onSelect={noop} />)
    expect(html).toMatch(/<button type="button" class="step-card-header" aria-current="step">/)
    expect(html).toMatch(/<\/button><div class="step-card-body">/)
    expect(html).toContain('class="btn-checkpoint-opt"')
  })

  it('offers a uniquely labelled keyboard alternative using the same canvas viewport and point', () => {
    const html = renderToString(<CalculusCanvas expression="x^2" mode="tangent_secant" x0={1.5} showFocusControl onParamChange={noop} />)
    const inputId = html.match(/<input id="([^"]+)" class="calculus-canvas-focus"/)?.[1]
    expect(inputId).toBeTruthy()
    expect(html).toContain(`for="${inputId}"`)
    expect(html).toContain('type="range" min="-1" max="5" step="0.01"')
    expect(html).toContain('value="1.5"')
    const readOnly = renderToString(<CalculusCanvas expression="x^2" mode="tangent_secant" showFocusControl />)
    expect(readOnly).not.toContain('class="calculus-canvas-focus"')
  })
})
