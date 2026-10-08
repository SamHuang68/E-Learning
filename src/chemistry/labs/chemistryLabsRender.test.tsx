import { afterEach, describe, expect, it, vi } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UI_LOCALE_KEY, type UiLocale } from '../../i18n/locale'
import { GasLawLab } from './GasLawLab'
import { PeriodicTableLab } from './PeriodicTableLab'
import { formatPeriodicTrendQuiz } from './periodicTrendQuiz'
import { SolubilityLab } from './SolubilityLab'
import { TitrationLab } from './TitrationLab'
import { VseprGeometryLab } from './VseprGeometryLab'

const state = vi.hoisted(() => ({ values: [] as unknown[], index: 0 }))

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return {
    ...actual,
    useState: (initial: unknown) => actual.useState(
      state.index < state.values.length ? state.values[state.index++] : initial,
    ),
  }
})

afterEach(() => vi.unstubAllGlobals())

const components = {
  PeriodicTableLab,
  VseprGeometryLab,
  TitrationLab,
  GasLawLab,
  SolubilityLab,
}

type LabName = keyof typeof components
type Scenario = { name: string; component: LabName; values?: unknown[] }

const scenarios: Scenario[] = [
  ...Object.keys(components).map((component) => ({
    name: `${component} default`,
    component: component as LabName,
  })),
  { name: 'PeriodicTableLab noble gas', component: 'PeriodicTableLab', values: [2, 'all'] },
  ...[
    [2, 0], [3, 0], [2, 1], [4, 0], [3, 1], [2, 2], [5, 0],
    [4, 1], [3, 2], [2, 3], [6, 0], [5, 1], [4, 2],
  ].map(([bp, lp]) => ({
    name: `VseprGeometryLab BP ${bp} LP ${lp}`,
    component: 'VseprGeometryLab' as const,
    values: [bp, lp],
  })),
  {
    name: 'TitrationLab weak acid half-equivalence',
    component: 'TitrationLab',
    values: ['weak', 'phenolphthalein', 12.5],
  },
  {
    name: 'SolubilityLab saturated sodium chloride',
    component: 'SolubilityLab',
    values: ['nacl', 20, 100, 50],
  },
]

function render(scenario: Scenario, locale: UiLocale): string {
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => key === UI_LOCALE_KEY ? locale : null,
  })
  state.values = scenario.values ?? []
  state.index = 0
  return renderToStaticMarkup(createElement(components[scenario.component]))
}

const HAN = /[\u3400-\u9fff\uf900-\ufaff]/u

describe('化學五個互動實驗的實際語系畫面', () => {
  it.each(scenarios)('$name 的英文文字與無障礙屬性不含漢字', (scenario) => {
    const html = render(scenario, 'en')
    expect(html).toContain('lang="en"')
    expect(html).not.toMatch(HAN)
    expect(html.length).toBeGreaterThan(0)
  })

  it.each([
    ['PeriodicTableLab', '元素週期律', '碳', '原子序 6 · 原子量 12.01'],
    ['VseprGeometryLab', '分子空間幾何', '四面體形', '109.5°'],
    ['TitrationLab', '酸鹼滴定', '當前溶液狀態', 'pH 1.60'],
    ['GasLawLab', '理想氣體定律', '氣體壓力', '$PV = nRT$'],
    ['SolubilityLab', '溶解度曲線', '未飽和溶液', 'KNO₃'],
  ] as const)('%s 保留繁中教學文案與科學資料', (component, heading, detail, science) => {
    const html = render({ name: component, component }, 'zh-Hant')
    expect(html).toContain('lang="zh-Hant"')
    expect(html).toContain(heading)
    expect(html).toContain(detail)
    expect(html).toContain(science)
  })

  it('相同語意狀態在兩種語系都由目前 locale 導出文字', () => {
    const periodic = { name: 'helium', component: 'PeriodicTableLab' as const, values: [2, 'all'] }
    expect(render(periodic, 'en')).toContain('Helium (He)')
    expect(render(periodic, 'zh-Hant')).toContain('氦 (He)')

    const titration = { name: 'weak', component: 'TitrationLab' as const, values: ['weak', 'phenolphthalein', 12.5] }
    expect(render(titration, 'en')).toContain('Current solution state:')
    expect(render(titration, 'zh-Hant')).toContain('當前溶液狀態：')

    const solubility = { name: 'saturated', component: 'SolubilityLab' as const, values: ['nacl', 20, 100, 50] }
    expect(render(solubility, 'en')).toContain('Saturated (')
    expect(render(solubility, 'zh-Hant')).toContain('飽和（析出')
  })

  it('週期趨勢測驗事件內容依目前語系導出且英文零漢字', () => {
    const english = formatPeriodicTrendQuiz('en')
    expect(english).toContain('Which element has the largest covalent atomic radius')
    expect(english).toContain('Correct: B')
    expect(english).not.toMatch(HAN)

    const zhHant = formatPeriodicTrendQuiz('zh-Hant')
    expect(zhHant).toContain('在第 3 週期中')
    expect(zhHant).toContain('正確答案：B')
  })
})

const sources = import.meta.glob([
  './PeriodicTableLab.tsx',
  './VseprGeometryLab.tsx',
  './TitrationLab.tsx',
  './GasLawLab.tsx',
  './SolubilityLab.tsx',
], {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

describe('化學實驗語系狀態契約', () => {
  it.each(Object.entries(sources))('%s 由目前語系即時導出文案', (_path, source) => {
    expect(source).toContain('const { locale } = useI18n()')
    expect(source).toContain('pickUi(locale')
    expect(source).toContain('lang={locale}')
    expect(source).not.toMatch(/useState(?:<[^>]*>)?\(\s*['"`][^'"`]*[\u3400-\u9fff]/u)
    expect(source).not.toMatch(/useState(?:<[^>]*>)?\(\s*(?:\(\)\s*=>\s*)?(?:copy|pickUi)\s*\(/u)
    expect(source).not.toMatch(/set[A-Z]\w*\(\s*copy\(/u)
  })

  it.each([
    ['./PeriodicTableLab.tsx', ['useState<number>(6)', "useState<string>('all')"]],
    ['./VseprGeometryLab.tsx', ['useState<number>(4)', 'useState<number>(0)']],
    ['./TitrationLab.tsx', ["useState<'strong' | 'weak'>('strong')", "useState<'phenolphthalein' | 'btb' | 'methyl_orange'>('phenolphthalein')", 'useState<number>(15)']],
    ['./GasLawLab.tsx', ['useState<number>(300)', 'useState<number>(24.5)', 'useState<number>(1.0)', "useState<'ideal' | 'boyle' | 'charles' | 'gay_lussac'>('ideal')"]],
    ['./SolubilityLab.tsx', ["useState<string>('kno3')", 'useState<number>(60)', 'useState<number>(100)', 'useState<number>(90)']],
  ] as const)('%s 僅保存穩定 ID、enum 或數值', (path, evidence) => {
    for (const snippet of evidence) expect(sources[path]).toContain(snippet)
  })

  it('週期表英文元素名沿用既有權威資料', () => {
    const source = sources['./PeriodicTableLab.tsx']
    expect(source).toContain("import { PERIODIC_TABLE_ELEMENTS } from '../data/interactiveTools'")
    expect(source).not.toContain('nameEn:')
  })

  it('VSEPR 英文幾何名沿用既有權威資料', () => {
    const source = sources['./VseprGeometryLab.tsx']
    expect(source).toContain("import { VSEPR_SHAPES } from '../data/interactiveTools'")
    expect(source).toContain('canonicalShape?.geometry')
  })
})
