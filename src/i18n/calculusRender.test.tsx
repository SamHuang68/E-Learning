import { PassThrough } from 'node:stream'
import { createHash } from 'node:crypto'
import { createElement, type ReactElement } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { CalculusApp } from '../calculus/CalculusApp'
import { CalculusStudio } from '../math/calculus/CalculusStudio'
import { CalculusLab } from '../math/labs/CalculusLab'
import { RiemannCalculusLab } from '../math/diagrams/RiemannCalculusLab'
import { CalculusLabPanel } from '../math/calculus/components/CalculusLab/CalculusLabPanel'
import { CalculusCanvas } from '../math/calculus/components/CalculusCanvas/CalculusCanvas'
import { CalculusAssessmentWidget } from '../math/calculus/components/CalculusAssessment/CalculusAssessmentWidget'
import { FormulaStepCard } from '../math/calculus/components/CalculusSolver/FormulaStepCard'
import { CALCULUS_PROBLEMS } from '../math/calculus/data/calculusProblems'
import { CALCULUS_BADGES } from '../math/calculus/data/calculusBadges'
import { CALCULUS_CATALOG } from '../math/calculus/data/calculusCatalog'
import { generateDerivationSteps } from '../math/calculus/engine'
import type { CalculusLabMode } from '../math/calculus/types'
import { CALCULUS_CONTENT_EN } from './calculusContentEn'
import { calculusCopy, loadCalculusCopy } from './calculusCopy'
import { UI_LOCALE_KEY, type UiLocale } from './locale'

const injected = vi.hoisted(() => ({ strings: {} as Record<string, string>, answered: false, reveal: false, badges: [] as unknown[] }))
vi.mock('react', async (original) => {
  const actual = await original<typeof import('react')>()
  return {
    ...actual,
    // Inject interactive states for SSR while keeping the real components and teaching data.
    useState: (initial: unknown) => actual.useState(
      typeof initial === 'string' && Object.hasOwn(injected.strings, initial) ? injected.strings[initial]
        : initial === false && injected.answered ? true
          : initial === 1 && injected.reveal ? 99
            : Array.isArray(initial) && initial.length === 0 && injected.badges.length ? injected.badges
              : initial,
    ),
  }
})

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/
const noop = () => {}
const MODES: CalculusLabMode[] = ['limit_epsilon', 'tangent_secant', 'optimization_mvt', 'riemann_sum', 'ftc_accumulation', 'solids_revolution', 'taylor_series', 'newton_slope_field']

async function render(element: ReactElement, locale: UiLocale = 'en') {
  vi.stubGlobal('localStorage', { getItem: (key: string) => key === UI_LOCALE_KEY ? locale : null })
  return new Promise<string>((resolve, reject) => {
    const output = new PassThrough()
    let html = ''
    output.on('data', chunk => { html += chunk.toString() })
    output.on('end', () => resolve(html.replace(/<!-- -->/g, '')))
    output.on('error', reject)
    const stream = renderToPipeableStream(element, { onAllReady: () => stream.pipe(output), onError: reject })
  })
}

function digest(html: string) { return createHash('sha256').update(html).digest('hex') }

beforeAll(async () => { await loadCalculusCopy() })
afterEach(() => {
  vi.unstubAllGlobals()
  injected.strings = {}
  injected.answered = false
  injected.reveal = false
  injected.badges = []
})

describe('微積分實際畫面英文與繁中回歸', () => {
  for (const nav of ['canvas_lab', 'step_solver', 'adaptive_practice', 'badges']) {
    for (const locale of ['en', 'zh-Hant'] as const) {
      it(`${locale === 'en' ? '英文無 CJK' : '繁中基準'}：獨立路由 ${nav}`, async () => {
        injected.strings = { canvas_lab: nav }
        injected.reveal = true
        injected.answered = true
        injected.badges = CALCULUS_BADGES
        const html = await render(createElement(CalculusApp, { onBackHub: noop, onSwitchLang: noop }), locale)
        if (locale === 'en') expect(html).not.toMatch(CJK)
        else expect(digest(html)).toMatchSnapshot()
      })
    }
  }
  for (const tab of ['canvas_lab', 'step_solver', 'adaptive_practice']) {
    for (const locale of ['en', 'zh-Hant'] as const) {
      it(`${locale === 'en' ? '英文無 CJK' : '繁中基準'}：數學工作台 ${tab}`, async () => {
        injected.strings = { canvas_lab: tab }
        injected.answered = true
        injected.reveal = true
        injected.badges = CALCULUS_BADGES
        const html = await render(createElement(CalculusStudio), locale)
        if (locale === 'en') expect(html).not.toMatch(CJK)
        else expect(digest(html)).toMatchSnapshot()
      })
    }
  }
  for (const mode of ['derivative', 'integral']) {
    for (const locale of ['en', 'zh-Hant'] as const) {
      it(`${locale === 'en' ? '英文無 CJK' : '繁中基準'}：微積分教具 ${mode}`, async () => {
        injected.strings = { derivative: mode }
        const html = await render(createElement(CalculusLab), locale)
        if (locale === 'en') expect(html).not.toMatch(CJK)
        else expect(digest(html)).toMatchSnapshot()
      })
    }
  }
  for (const locale of ['en', 'zh-Hant'] as const) {
    it(`${locale === 'en' ? '英文無 CJK' : '繁中基準'}：黎曼和教具`, async () => {
      const html = await render(createElement(RiemannCalculusLab), locale)
      if (locale === 'en') expect(html).not.toMatch(CJK)
      else expect(digest(html)).toMatchSnapshot()
    })
  }
  for (const mode of MODES) {
    for (const locale of ['en', 'zh-Hant'] as const) {
      it(`${locale === 'en' ? '英文無 CJK' : '繁中基準'}：參數、SVG、圖形描述 ${mode}`, async () => {
        const params = { mode, expression: 'x^2 - 2*x + 2', x0: 1.5, deltaX: 0.5, intA: 0, intB: 3, slicesN: 16, riemannMethod: 'midpoint' as const, taylorOrder: 3, epsilon: 0.5 }
        const html = await render(<><CalculusLabPanel {...params} onModeSelect={noop} onExpressionChange={noop} onParamChange={noop} /><CalculusCanvas {...params} /></>, locale)
        if (locale === 'en') expect(html).not.toMatch(CJK)
        else expect(digest(html)).toMatchSnapshot()
      })
    }
  }
  for (const problem of CALCULUS_PROBLEMS) {
    it(`英文題目與所有教學步驟無 CJK：${problem.id}`, async () => {
      injected.strings = { [CALCULUS_PROBLEMS[0].id]: problem.id }
      injected.answered = true
      const html = await render(<><CalculusAssessmentWidget currentTheta={0} onSolveProblem={noop} onSelectProblem={noop} />{problem.derivationSteps.map(step => <FormulaStepCard key={step.id} step={step} isActive isCompleted onSelect={noop} />)}</>)
      expect(html).not.toMatch(CJK)
    })
  }
  for (const expression of ['x^2', 'x*sin(x)', 'x/(x+1)', 'sin(x^2)', 'x+', '(x', 'sin()', 'y', 'ln(x)', '', '1..2', 'x$', 'sin', 'foo(x)']) {
    it(`英文動態推導、錯誤、未定義值無 CJK：${expression}`, async () => {
      injected.answered = true
      const steps = generateDerivationSteps(expression)
      const html = await render(<><CalculusCanvas expression={expression} mode="tangent_secant" x0={0} />{steps.map(step => <FormulaStepCard key={step.id} step={step} isActive isCompleted onSelect={noop} />)}</>)
      expect(html).not.toMatch(CJK)
    })
  }
})

describe('微積分文案完整性', () => {
  it('所有英文表格值不含 CJK，繁中來源逐字保留', () => {
    for (const [source, english] of Object.entries(CALCULUS_CONTENT_EN)) {
      expect(english.trim()).not.toBe('')
      expect(english).not.toMatch(CJK)
      expect(calculusCopy('en', source)).toBe(english)
      expect(calculusCopy('zh-Hant', source)).toBe(source)
    }
  })
  it('所有題目、步驟、徽章與課程來源文字均有英文', () => {
    function check(value: unknown) {
      if (typeof value === 'string') expect(calculusCopy('en', value)).not.toMatch(CJK)
      else if (Array.isArray(value)) value.forEach(check)
      else if (value && typeof value === 'object') Object.values(value).forEach(check)
    }
    check(CALCULUS_PROBLEMS)
    check(CALCULUS_BADGES)
    check(CALCULUS_CATALOG)
  })
  it('缺漏或無效英文文案立即失敗', () => {
    expect(() => calculusCopy('en', '尚未收錄的微積分文案')).toThrow('缺少有效')
    CALCULUS_CONTENT_EN['測試錯誤文案'] = '仍是中文'
    try { expect(() => calculusCopy('en', '測試錯誤文案')).toThrow('缺少有效') }
    finally { delete CALCULUS_CONTENT_EN['測試錯誤文案'] }
  })
})
