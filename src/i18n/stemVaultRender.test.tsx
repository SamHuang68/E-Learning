import { PassThrough } from 'node:stream'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createElement, type ComponentType } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { ChemistryErrorVault } from '../chemistry/components/ChemistryErrorVault'
import { PhysicsErrorVault } from '../physics/components/PhysicsErrorVault'
import { getAllChemistryUnits } from '../chemistry/data/curriculum'
import { getAllPhysicsUnits } from '../physics/data/curriculum'
import { CHEMISTRY_MOCK_EXAMS } from '../chemistry/data/mockExams'
import { PHYSICS_MOCK_EXAMS } from '../physics/data/mockExams'
import { CHEMISTRY_SOLVING_SIGNALS } from '../chemistry/data/solvingSignals'
import { PHYSICS_SOLVING_SIGNALS } from '../physics/data/solvingSignals'
import { UI_LOCALE_KEY, type UiLocale } from './locale'

const expansion = vi.hoisted(() => ({ ids: {} as Record<string, boolean> }))
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return {
    ...actual,
    // SSR 無點擊事件；僅注入展開狀態，保留真實元件、題庫、翻譯與 KaTeX。
    useState: (initial: unknown) => actual.useState(
      initial && typeof initial === 'object' && Object.keys(initial).length === 0
        ? expansion.ids : initial,
    ),
  }
})

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/
type VaultProps = { errorQuestionIds: string[]; onRemoveError: (id: string) => void; onOpenLab?: (id: string) => void }

function renderVault(Component: ComponentType<VaultProps>, ids: string[], locale: UiLocale = 'en') {
  vi.stubGlobal('localStorage', { getItem: (key: string) => key === UI_LOCALE_KEY ? locale : null })
  expansion.ids = Object.fromEntries(ids.map(id => [id, true]))
  return new Promise<string>((resolve, reject) => {
    const output = new PassThrough()
    let html = ''
    output.on('data', chunk => { html += chunk.toString() })
    output.on('end', () => resolve(html))
    output.on('error', reject)
    const stream = renderToPipeableStream(createElement(Component, {
      errorQuestionIds: ids, onRemoveError: () => {}, onOpenLab: () => {},
    }), { onAllReady: () => stream.pipe(output), onError: reject })
  })
}

afterEach(() => vi.unstubAllGlobals())

it('直尺與層析題的真實展開步驟使用本題提示，不顯示無關訊號', async () => {
  for (const locale of ['en', 'zh-Hant'] as const) {
    const physics = await renderVault(PhysicsErrorVault, ['g7_u1_q1'], locale)
    const chemistry = await renderVault(ChemistryErrorVault, ['g10_u1_q1'], locale)
    const stepOne = (html: string) => html.split('class="vault-step-card"')[1]
    const physicsStep = stepOne(physics)
    const chemistryStep = stepOne(chemistry)
    expect(physicsStep).toContain(locale === 'en' ? 'The last digit is estimated' : '估計值')
    expect(chemistryStep).toContain('R_f')
    expect(physicsStep).not.toMatch(/photoelectric|光電/)
    expect(chemistryStep).not.toMatch(/crystall|結晶|析出/)
    expect(physics).toContain(locale === 'en' ? 'Mechanics' : '力學')
    expect(chemistry).toContain(locale === 'en' ? 'Matter' : '物質')
  }
})

for (const [name, Component, units, exams, signals] of [
  ['化學', ChemistryErrorVault, getAllChemistryUnits(), CHEMISTRY_MOCK_EXAMS, CHEMISTRY_SOLVING_SIGNALS],
  ['物理', PhysicsErrorVault, getAllPhysicsUnits(), PHYSICS_MOCK_EXAMS, PHYSICS_SOLVING_SIGNALS],
] as const) {
  describe(`${name}錯題庫實際展開畫面`, () => {
    for (const [source, questions] of [
      ['單元', units.flatMap<{ id: string; competency?: string }>(unit => unit.questions)],
      ['模擬考', Object.values(exams).flatMap<{ id: string; competency?: string }>(exam => exam.questions)],
    ] as const) {
      it(`${source}全部已知題目的英文卡片、步驟與屬性不含 CJK`, async () => {
        const ids = questions.map(q => q.id)
        expect(ids.length).toBeGreaterThan(0)
        const html = await renderVault(Component, ids)
        expect(html.match(/class="vault-steps-accordion"/g)).toHaveLength(ids.length)
        expect(html.match(/class="vault-step-card"/g)).toHaveLength(questions.reduce((n, q) => n + (q.competency ? 5 : 4), 0))
        expect(html).toContain('Collapse all steps')
        expect(html).not.toMatch(CJK)
      })
    }

    it('未知題號的英文備援卡片與步驟完整顯示', async () => {
      const html = await renderVault(Component, ['unknown-vault-id'])
      expect(html).toContain('unknown-vault-id')
      expect(html).toContain('review question')
      expect(html).toContain('review bank')
      expect(html).toContain('vault-steps-accordion')
      expect(html).toContain('Common pitfalls')
      expect(html).not.toMatch(CJK)
    })

    it('中文未知題號與已知題目並存，保留原始 ID 而不阻斷英文卡片', async () => {
      const id = '舊題-1'
      const html = await renderVault(Component, [units[0].questions[0].id, id])
      expect(html.match(/class="vault-card-item/g)).toHaveLength(2)
      expect(html).toContain(`review question (${id})`)
      expect(html).toContain('Collapse all steps')
      expect(html.replaceAll(id, '')).not.toMatch(CJK)
      const chinese = await renderVault(Component, [id], 'zh-Hant')
      expect(chinese).toContain(`${name}進階複習題目 (${id})`)
    })

    it('無解題訊號時的主軸插值、公式與盲區備援也不含 CJK', async () => {
      const saved = signals.splice(0)
      try {
        const html = await renderVault(Component, ['unknown-vault-id'])
        expect(html).toContain('Focus on')
        expect(html).toContain('select the applicable definition or relationship')
        expect(html).not.toContain('katex-error')
        expect(html).not.toMatch(CJK)
      } finally {
        signals.push(...saved as never[])
      }
    })

    it('繁中卡片保留原始題文與未知題號', async () => {
      const q = units[0].questions[0]
      const html = await renderVault(Component, [q.id, 'unknown-vault-id'], 'zh-Hant')
      expect(html).toContain(q.title)
      expect(html).toContain(`${name}進階複習題目 (unknown-vault-id)`)
      expect(html).toContain('⚠️ 常見盲區：')
    })
  })
}
