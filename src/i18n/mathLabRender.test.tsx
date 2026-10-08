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
// fresh-main 整合後的 zh-Hant 實際畫面 SHA-256；保留 main 行為與候選在地化。
const baselines: Record<string, string> = {
  "BlocksLab": "b166731a90016081beb63d9a484eeadd0105144ffb06c9e29926c72cf6057441",
  "CoordinateLab": "df68e82bac5592f918cad5c7b8f835767dd6f6110acde091a05597bacc330576",
  "FractionLab": "839e95fffdbb8eea512e9c6dae82a18017176d7dd3f2528806798b7c27eeb426",
  "MultiplicationLab": "355503bed0cefcf7e57cb064a515e529062c97ba77d19a223906fd76103a4bfe",
  "PythagorasLab": "59dbb7ea809dae4ec81233cf26abc6e8fcefb76745064171e76703265c1191b0",
  "UnitCircleLab": "ee108ced750e3f39a45f8a59af6193f6d2dcc3a97b14c317382fd1b505658d42",
  "AlgebraTilesLab": "9cd9fe36f4c3693d64947aafe43aa06caa94715f752f692a1e9c8daf0e7167e5",
  "BalanceScaleSolver": "cd8362a4e37bd3799ccb2a8c018aa26c5a1232231f94d60b11313271d482dc88",
  "BarModelSolver": "00a1be6d8579b2111ca8e26ff4683913d3468bdb2a754c6a451aac12d9c4e7d7",
  "GeometricProofsLab": "2562295d46ad50cd3f40aba688e7b9889323626dbae34e9de331999900831d6f",
  "MatrixTransformLab": "1fd1b28b756ec0fca1797e802cf785db993e1d44d7bbe59df40935bd1fa154d5",
  "BlocksLab empty": "bbf212509ebaed7dbaef175be0287b24266fc23b2fc68e796f3b1a4b42ed3e78",
  "BlocksLab match": "4d8dcfe8700b2cdf63b604d2b4b132c02c1c9c2c700d0509657da2768950ccb6",
  "BlocksLab excess": "e1850f4f53ebd69f6cffa211662e00b93d1961487d376bdb971a04baa825e82b",
  "FractionLab improper": "156655f6ba31b1462701a0b2c0e033ed47e415655642216c1c697d006f529be9",
  "CoordinateLab falling": "4719cb5e2c739ffcb0d37837eb2c46af8e17da56e32f803016c895fe83ac6136",
  "CoordinateLab horizontal": "7bc11e13fca50a41f96cf2378fb80ecf1d47173fbfca6bf12068ff4cb6cde0c6",
  "CoordinateLab quadratic up": "0a13ff415d0e4d27af64dc0446133563fb14b99d630272a2e4527dfde4788f0c",
  "CoordinateLab quadratic down": "740350f6d1c90af9400cc38162e99575048764baad085dd043f33bcce7a26ac9",
  "MultiplicationLab selected": "23492e98c5e8f25b05e15f22f5e1d702adfbb196010ec1c8761e27f39f911e3b",
  "MultiplicationLab quiz": "61838851ca90fe9f0a447c9f243a8c67f82c16a2d2f235425efa06e3c2267e7c",
  "MultiplicationLab correct": "934a80177f877f3d3bd9686d56c3fcf12d027525b6f2b6fd63842589f9e142c7",
  "UnitCircleLab 0": "8cc530e197e0075b0daac0c0a5d506515ae30fdc428dd63660bb9ef725ccd3a7",
  "UnitCircleLab 90": "8f0c6118258f59c4b017300cc6d892f58d2f0b27bf721ad6dad5140f5012bd97",
  "UnitCircleLab 135": "f3673bdca072d48dccbbb0f88417f9a9a192ffafaf061414a05731339e5f4a97",
  "UnitCircleLab 225": "cb289b05c3ec5020d2c32f174d1447de8bf539539764019995ce3d361a8fd4cf",
  "UnitCircleLab 315": "89c1baf82f7d4fff63d3fd91fd76edf518683ec4a96b2411ff4830e76554afa3",
  "AlgebraTilesLab tile-1": "9cd9fe36f4c3693d64947aafe43aa06caa94715f752f692a1e9c8daf0e7167e5",
  "AlgebraTilesLab tile-2": "067cc38923fdac1bc4f473160d16e3b715d341f754f5a6f8b3b2d11a539348c1",
  "AlgebraTilesLab tile-3": "de9d8722b1110bb4a2b98d41ee7509015c596413c4715a07081e8e4f343fc3c8",
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
  "MatrixTransformLab mat-shear": "1fd1b28b756ec0fca1797e802cf785db993e1d44d7bbe59df40935bd1fa154d5",
  "MatrixTransformLab mat-scale": "c82f72e2353176b6ffad7b694692e33a844ce6efc04c369a31b59c379da0eb49",
  "MatrixTransformLab mat-rot-45": "d59bd5cc090e585ca5f35b3f5efc22d88c3d5fc82549a6e759860cbbb74551b7",
  "MatrixTransformLab mat-reflect-y": "b72d829179d9f34767423e7c5ed57ee272ab515e89ac2ee92e37d1108ce25791",
  "MatrixTransformLab flipped": "f766d8f4481187b7ab54effc56c81b5ba616e63d75f8911be09745d09892ac59"
}
const requiredZhText: Partial<Record<string, string[]>> = {
  BlocksLab: ['3 條 (30)', '5 個 (5)'],
  'BlocksLab match': ['連續挑戰成功：2 次'],
  'FractionLab improper': ['假分數（可化為帶分數：2 又 1/4）'],
  'MultiplicationLab selected': ['意義：4 份，每份有 3 個（共連加 4 次 3）。'],
  'MultiplicationLab quiz': ['已連續答對：0 題'],
  PythagorasLab: ['直角三角形中：兩股平方和等於斜邊平方（', '）。', '）：'],
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
    it(scenario.name + ' 繁中畫面符合目前整合基準', () => {
      const html = render(scenario, 'zh-Hant')
      for (const text of requiredZhText[scenario.name] ?? []) expect(html).toContain(text)
      expect(createHash('sha256').update(html).digest('hex')).toBe(baselines[scenario.name])
    })
  }
  it('錯誤答案回饋隨目前語系呈現', () => {
    const scenario: Scenario = { name: 'wrong', component: 'MultiplicationLab', values: [null, null, true, 7, 8, '50', 0, 'wrong'] }
    expect(render(scenario, 'en')).toContain('Not quite: 7 × 8 = 56')
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
  "balance": "7e2f4d95b2f613c080473cda983c44fadc28369ed9383186f03ef4f776620379",
  "bar": "fcbdad54ba1767a06c2f796fe56483d40a69eb858891ac05c37606cb2a6394bc",
  "tiles": "ef112cd11b2c049f722682f3ae285710886bf505232ad620e0049c7ab97a7f1b",
  "matrix": "09ad93d6fd90080b72eb260768e7cd2063e5c1f6fc05529e766b24a2b841234b",
  "riemann": "d098e6c6958ea7d17567c2d0f65af1eb9000cfd91cabe12f14b38af24b36f01e",
  "proofs": "ebc952b493130bb5c111d3ea9bc81cb63bf99ac7aefa289ecabb3d395b50d1e8"
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
