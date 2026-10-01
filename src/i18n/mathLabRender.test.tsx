import { loadCalculusCopy } from './calculusCopy'
import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createHash } from 'node:crypto'
import { BlocksLab } from '../math/labs/BlocksLab'
import { CoordinateLab } from '../math/labs/CoordinateLab'
import { FractionLab } from '../math/labs/FractionLab'
import { MultiplicationLab } from '../math/labs/MultiplicationLab'
import { PythagorasLab } from '../math/labs/PythagorasLab'
import { UnitCircleLab } from '../math/labs/UnitCircleLab'
import { AlgebraTilesLab } from '../math/diagrams/AlgebraTilesLab'
import { BalanceScaleSolver } from '../math/diagrams/BalanceScaleSolver'
import { BarModelSolver } from '../math/diagrams/BarModelSolver'
import { GeometricProofsLab } from '../math/diagrams/GeometricProofsLab'
import { MatrixTransformLab } from '../math/diagrams/MatrixTransformLab'
import { UI_LOCALE_KEY } from './locale'

const state = vi.hoisted(() => ({ values: [] as unknown[], index: 0 }))
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, useState: (initial: unknown) => actual.useState(
    state.index < state.values.length ? state.values[state.index++] : initial,
  ) }
})
beforeAll(() => loadCalculusCopy())
afterEach(() => vi.unstubAllGlobals())
const components = { BlocksLab, CoordinateLab, FractionLab, MultiplicationLab, PythagorasLab, UnitCircleLab, AlgebraTilesLab, BalanceScaleSolver, BarModelSolver, GeometricProofsLab, MatrixTransformLab }
type Scenario = { name: string; component: keyof typeof components; values?: unknown[] }
const scenarios: Scenario[] = [
  ...Object.keys(components).map(component => ({ name: component, component: component as keyof typeof components })),
  { name: 'BlocksLab empty', component: 'BlocksLab', values: [0, 0, 42, 0] },
  { name: 'BlocksLab match', component: 'BlocksLab', values: [4, 2, 42, 2] },
  { name: 'BlocksLab excess', component: 'BlocksLab', values: [9, 19, 42, 0] },
  { name: 'FractionLab improper', component: 'FractionLab', values: [9, 4] },
  { name: 'CoordinateLab falling', component: 'CoordinateLab', values: ['linear', -2, -3] },
  { name: 'CoordinateLab horizontal', component: 'CoordinateLab', values: ['linear', 0, 2] },
  { name: 'CoordinateLab quadratic up', component: 'CoordinateLab', values: ['quadratic', 1, 0, 2, 3, -1] },
  { name: 'CoordinateLab quadratic down', component: 'CoordinateLab', values: ['quadratic', 1, 0, -2, -3, 1] },
  { name: 'MultiplicationLab selected', component: 'MultiplicationLab', values: [3, 4] },
  { name: 'MultiplicationLab quiz', component: 'MultiplicationLab', values: [null, null, true] },
  { name: 'MultiplicationLab correct', component: 'MultiplicationLab', values: [null, null, true, 7, 8, '56', 1, 'correct'] },
  ...[0, 90, 135, 225, 315].map(angle => ({ name: 'UnitCircleLab ' + angle, component: 'UnitCircleLab' as const, values: [angle] })),
  ...['tile-1', 'tile-2', 'tile-3'].map(id => ({ name: 'AlgebraTilesLab ' + id, component: 'AlgebraTilesLab' as const, values: [id] })),
  ...['bal-1', 'bal-2', 'bal-3'].map(id => ({ name: 'BalanceScaleSolver ' + id, component: 'BalanceScaleSolver' as const, values: [id] })),
  { name: 'BalanceScaleSolver solved', component: 'BalanceScaleSolver', values: ['bal-1', 1, 0, 0, 7, []] },
  ...['bar-sum-diff', 'bar-multiple'].flatMap(id => [1, 3].map(step => ({ name: 'BarModelSolver ' + id + ' step ' + step, component: 'BarModelSolver' as const, values: [id, step] }))),
  ...['proof-am-gm', 'proof-inscribed-angle'].map(id => ({ name: 'GeometricProofsLab ' + id, component: 'GeometricProofsLab' as const, values: [id, 0.5] })),
  ...['mat-shear', 'mat-scale', 'mat-rot-45', 'mat-reflect-y'].map(id => ({ name: 'MatrixTransformLab ' + id, component: 'MatrixTransformLab' as const, values: [id] })),
  { name: 'MatrixTransformLab flipped', component: 'MatrixTransformLab', values: ['mat-reflect-y', -1, 0, 0, 1] },
]
// SHA-256 of the real zh-Hant renders before localization, captured from HEAD.
const baselines: Record<string, string> = {
  "BlocksLab": "83dcf55e8fb92d04253ac77b51b5bec4d92cfeed70e64aabd46034f3b618bbac",
  "CoordinateLab": "48693018c8d069289df1b872ae6c3d80eb5b25ae915072d445820a1b73378cc0",
  "FractionLab": "8116d3029281575c952eaf6ad2aa14ddf509b6ee9fe14d89c63accd41b6f9f11",
  "MultiplicationLab": "7d5e14909b09599f0b1ea778d7f3ac12a22e0d049c1292df9450c8b48e126f86",
  "PythagorasLab": "5bfdf094bc2fae377ade6d9063cb0f150378aac608a9d201d7c0c492b9da25de",
  "UnitCircleLab": "a4f320562e98843f713b3cfb2c540aeef06074157716f97d6d986a55c7dc715c",
  "AlgebraTilesLab": "644d073e2b14dd7b863a81213b9dea384a7a6d0269043de00ac0839752f26724",
  "BalanceScaleSolver": "cd8362a4e37bd3799ccb2a8c018aa26c5a1232231f94d60b11313271d482dc88",
  "BarModelSolver": "00a1be6d8579b2111ca8e26ff4683913d3468bdb2a754c6a451aac12d9c4e7d7",
  "GeometricProofsLab": "2562295d46ad50cd3f40aba688e7b9889323626dbae34e9de331999900831d6f",
  "MatrixTransformLab": "8fac1b6d6fc4222a2d93f4eac694ebb40dc17d437f7d73e578cd60294efb8061",
  "BlocksLab empty": "df9c571bb6b984e5127aebe6255c01c573525f820f95826909f3832b132c9bcb",
  "BlocksLab match": "90a5cd743aecf503dc33951f99a9230e03a0b5645cfcd298bb066dbf65fbd526",
  "BlocksLab excess": "f1ac76b769da1344d13ed27e51fdd6054afc97d26576df0de75f723d4ba25d47",
  "FractionLab improper": "e7bba6a3f2700bff4f753d2b9cc3390895b81ea1f0fbcd2ef3f342407b4a3354",
  "CoordinateLab falling": "af513d0caa7d88c83703e6609f342da799dfa2bb1efe7bdb32768a3e7f854bf8",
  "CoordinateLab horizontal": "ef8b268b07f4856373242bfb69076b6d18cb102115f6008c002ea8077d9bbc34",
  "CoordinateLab quadratic up": "50363f1e76a20a2aa43fcdc94a8a76e114975d6364b8c8e1ada75d3c2553903c",
  "CoordinateLab quadratic down": "8ef29b05b66e53098ecc918d634169581d3362995fdc717ab3db63a34950fa0a",
  "MultiplicationLab selected": "608f8c023a8803bc15a49664c0402f078ce0527de85464066d27cbf8e1f7c70d",
  "MultiplicationLab quiz": "104977cb3b85011c851d9eeb2964603b8db43e098741593c815ddf986444e3eb",
  "MultiplicationLab correct": "69c463f52f72730ec0289f005a117b5e8aabe13405678a110ec4fe166a08d258",
  "UnitCircleLab 0": "c3ca7bf0e8492d652c51d4d5e4968c0bab140cb047851d43afc32491e0c201a9",
  "UnitCircleLab 90": "65a26ad627c204c1b22dab57091fae909f430a2ec4e6a2d92d3cdd8ef490390d",
  "UnitCircleLab 135": "2fe3351547c69e79f7bae5ec0edae474417846b9c93397a35b2d27d1194ac347",
  "UnitCircleLab 225": "efb75cae685571082fae72479dcbc53f2ddf6643f2234ce78e1b7e33998d15c5",
  "UnitCircleLab 315": "2e46c75eaf857345ea30ec7f512184bd8abcf2cc0d14debd1dbeda6c766b7145",
  "AlgebraTilesLab tile-1": "644d073e2b14dd7b863a81213b9dea384a7a6d0269043de00ac0839752f26724",
  "AlgebraTilesLab tile-2": "bf76682a53255edefb38480eff899259fd1dbf6bf40eae6e77016e2070695b6f",
  "AlgebraTilesLab tile-3": "fa7eca50e36895cb412a0d504cff938e99d80f53d3f8549f58ecf6683c5697d5",
  "BalanceScaleSolver bal-1": "cd8362a4e37bd3799ccb2a8c018aa26c5a1232231f94d60b11313271d482dc88",
  "BalanceScaleSolver bal-2": "8d447d9156fe6340ab767820552280e17ed679c94f3e55decbdd9ba123ffbe94",
  "BalanceScaleSolver bal-3": "ed9217575058cc1bdde09d9ef1c8c680dd51142e325b433ee6f4a9f52a60403e",
  "BalanceScaleSolver solved": "57a09f5e3eac10d4aaf0de7a7bb2054f04b19b8805e5e244fdbb12404d437537",
  "BarModelSolver bar-sum-diff step 1": "00a1be6d8579b2111ca8e26ff4683913d3468bdb2a754c6a451aac12d9c4e7d7",
  "BarModelSolver bar-sum-diff step 3": "22cc4cbf9fdac1b1f47bf6479d0ddaef0e501509c38eada7e2bd258694584e13",
  "BarModelSolver bar-multiple step 1": "0efe0dc62c6703f4bb8f52b2b559fe7686a1aebd9e6bae4b77667f942b500e9f",
  "BarModelSolver bar-multiple step 3": "b8ec3c5a8d13251bb6cdb24f79f66f4b555c5a6718b997eefcd90d1cfa7d0352",
  "GeometricProofsLab proof-am-gm": "f8f6770eb5fbb09a21bf1ac529be200fa0d31a274a46d3e555297e35aebd2d07",
  "GeometricProofsLab proof-inscribed-angle": "28831c259a56919de2a7d7bd6c495150097c79f43393d3c7c1e81027e4ef5c99",
  "MatrixTransformLab mat-shear": "8fac1b6d6fc4222a2d93f4eac694ebb40dc17d437f7d73e578cd60294efb8061",
  "MatrixTransformLab mat-scale": "f85afac96f78486041af448d1165dfb5db5ee32066c5e0db027784f2a4175624",
  "MatrixTransformLab mat-rot-45": "66c11505d55e8e05a7f029ea872199e86aefa9dddfc97c449111aace2445578b",
  "MatrixTransformLab mat-reflect-y": "c7fa457d167d5449c309c6b0b1781ba8b7b2f01f0637b42aca6baba00304530e",
  "MatrixTransformLab flipped": "aefa7bfe6fa09ca28275ac3ebc09c05192871dfa90b5908d880b17b607cee35e"
}
function render(scenario: Scenario, locale: 'en' | 'zh-Hant') {
  vi.stubGlobal('localStorage', { getItem: (key: string) => key === UI_LOCALE_KEY ? locale : null })
  state.values = scenario.values ?? []; state.index = 0
  return renderToStaticMarkup(createElement(components[scenario.component]))
}
const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/
describe('數學教具實際畫面', () => {
  for (const scenario of scenarios) {
    it(scenario.name + ' 英文文字與屬性不含 CJK', () => {
      const html = render(scenario, 'en')
      expect(html).not.toMatch(CJK)
      expect(html).not.toContain('katex-error')
      expect(html.length).toBeGreaterThan(0)
    })
    it(scenario.name + ' 繁中畫面與修改前完全相同', () => {
      expect(createHash('sha256').update(render(scenario, 'zh-Hant')).digest('hex')).toBe(baselines[scenario.name])
    })
  }
  it('錯誤答案回饋隨目前語系呈現', () => {
    const scenario: Scenario = { name: 'wrong', component: 'MultiplicationLab', values: [null, null, true, 7, 8, '50', 0, 'wrong'] }
    expect(render(scenario, 'en')).toContain('Try again! 7 × 8 = 56')
    expect(render(scenario, 'en')).not.toMatch(CJK)
    expect(render(scenario, 'zh-Hant')).toContain('答錯囉！7 × 8 = 56')
  })
  it('已有推導紀錄在切換語言後仍重新翻譯', () => {
    const scenario: Scenario = { name: 'history', component: 'BalanceScaleSolver', values: ['bal-1', 1, 0, 0, 7, [
      { text: '兩邊同時減去 {v0} ➜ {v1}', values: [5, 'x = 7'] },
      { text: '兩邊各拿掉 1 個 x ➜ {v0}', values: ['2x + 2 = 10'] },
      { text: '兩邊同時除以 2 ➜ {v0}', values: ['x = 4'] },
    ]] }
    expect(render(scenario, 'en')).toContain('Subtract 5 from both sides ➜ x = 7')
    expect(render(scenario, 'en')).not.toMatch(CJK)
    expect(render(scenario, 'zh-Hant')).toContain('兩邊同時減去 5 ➜ x = 7')
  })
})
import { MathVisualHub, type DiagramTabId } from '../math/components/MathVisualHub'
const hubBaselines: Record<string, string> = {
  "balance": "27dd500e691df3a480ff90ae2ff8a2e41b9c476d5a88eb0d6afbfac6b46fefb4",
  "bar": "39b5aa90ad69f96e7e05c70708b9336ab08975c0289abe6f138b851c0db4d581",
  "tiles": "5dbc8303fb6927d3f4ddf52ea69d8bb5a54a7365cd6b31a6744f5a9564f401b5",
  "matrix": "f71e608836a86fdd0d493a00efcc21b531afd4daacd5edc8aedc1721844126eb",
  "riemann": "565655002a69eaac48c8490ca74432387c4741e01ff2d4bb776505304fb2b243",
  "proofs": "fb55d7fdc0551ce9dcb32dffd1f88b2e11a2ae681548b1d153bc31b464901e9f"
}
for (const tab of ['balance', 'bar', 'tiles', 'matrix', 'riemann', 'proofs'] as DiagramTabId[]) {
  for (const locale of ['en', 'zh-Hant'] as const) it('圖解中心 ' + tab + ' ' + locale, () => {
    vi.stubGlobal('localStorage', { getItem: (key: string) => key === UI_LOCALE_KEY ? locale : null })
    state.values = []; state.index = 0
    const html = renderToStaticMarkup(createElement(MathVisualHub, { initialTab: tab, onBack: () => {} }))
    if (locale === 'en') expect(html).not.toMatch(CJK)
    else expect(createHash('sha256').update(html).digest('hex')).toBe(hubBaselines[tab])
  })
}
