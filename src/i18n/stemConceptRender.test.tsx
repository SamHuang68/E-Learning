import { PassThrough } from 'node:stream'
import { createElement, type ReactNode } from 'react'
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChemistryToday } from '../chemistry/components/ChemistryToday'
import { ChemistryPractice } from '../chemistry/components/ChemistryPractice'
import { PhysicsToday } from '../physics/components/PhysicsToday'
import { PhysicsPractice } from '../physics/components/PhysicsPractice'
import { PhysicsFormulaSheet } from '../physics/components/PhysicsFormulaSheet'
import { CHEMISTRY_GRADES } from '../chemistry/data/curriculum'
import { PHYSICS_GRADES } from '../physics/data/curriculum'
import { defaultChemistryProgress } from '../chemistry/utils/chemistryStorage'
import { defaultPhysicsProgress } from '../physics/utils/physicsStorage'
import { MathFormula } from '../math/components/MathFormula'
import { loadStemConceptCopy, stemConceptCopy } from './stemConceptCopy'
import { CHEMISTRY_CONCEPT_CONTENT_EN } from './chemistryConceptContentEn'
import { PHYSICS_CONCEPT_CONTENT_EN } from './physicsConceptContentEn'
import { UI_LOCALE_KEY, type UiLocale } from './locale'
import { localizeChemistryGrade } from '../chemistry/locale/content'
import { localizePhysicsGrade } from '../physics/locale/content'

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/
const noop = () => {}
const actions = {
  onSelectUnit: noop, onStartPractice: noop, onOpenLab: noop, onOpenMock: noop,
  onOpenVault: noop, onOpenSignals: noop, onOpenFormulas: noop,
  onAnswerCorrect: noop, onAnswerWrong: noop, onNextUnit: noop,
}

function render(node: ReactNode, locale: UiLocale) {
  vi.stubGlobal('localStorage', { getItem: (key: string) => key === UI_LOCALE_KEY ? locale : null })
  return new Promise<string>((resolve, reject) => {
    const output = new PassThrough()
    let html = ''
    output.on('data', chunk => { html += chunk.toString() })
    output.on('end', () => resolve(html))
    output.on('error', reject)
    const stream = renderToPipeableStream(node, { onAllReady: () => stream.pipe(output), onError: reject })
  })
}

afterEach(() => vi.unstubAllGlobals())

describe('理化全部年級概念卡的真實渲染', () => {
  for (const grade of Object.values(CHEMISTRY_GRADES)) {
    for (const unit of grade.units) {
      for (const surface of ['Today', 'Practice'] as const) {
        it(`chemistry ${unit.key} ${surface} 英文無 CJK 且繁中概念不變`, async () => {
          const localizedGrade = localizeChemistryGrade(grade, 'en')
          const localizedUnit = localizedGrade.units.find((candidate) => candidate.key === unit.key)
          if (!localizedUnit) throw new Error(`Missing localized chemistry unit fixture: ${unit.key}`)
          const enNode = surface === 'Today'
            ? createElement(ChemistryToday, { gradeInfo: localizedGrade, currentUnit: localizedUnit, progress: defaultChemistryProgress(), ...actions })
            : createElement(ChemistryPractice, { unit: localizedUnit, completedQuestions: [], errorQuestions: [], ...actions })
          const zhNode = surface === 'Today'
            ? createElement(ChemistryToday, { gradeInfo: grade, currentUnit: unit, progress: defaultChemistryProgress(), ...actions })
            : createElement(ChemistryPractice, { unit, completedQuestions: [], errorQuestions: [], ...actions })
          const en = await render(enNode, 'en')
          expect(en).not.toMatch(CJK)
          expect(en).not.toContain('katex-error')
          const zh = await render(zhNode, 'zh-Hant')
          for (const [index, concept] of unit.concepts.entries()) {
            expect(zh).toContain(renderToStaticMarkup(<MathFormula math={concept} />))
            expect(en).toContain(renderToStaticMarkup(<MathFormula math={localizedUnit.concepts[index]} />))
          }
        })
      }
    }
  }
  for (const grade of Object.values(PHYSICS_GRADES)) {
    for (const unit of grade.units) {
      for (const surface of ['Today', 'Practice'] as const) {
        it(`physics ${unit.key} ${surface} 英文無 CJK 且繁中概念不變`, async () => {
          const localizedGrade = localizePhysicsGrade(grade, 'en')
          const localizedUnit = localizedGrade.units.find((candidate) => candidate.key === unit.key)
          if (!localizedUnit) throw new Error(`Missing localized physics unit fixture: ${unit.key}`)
          const enNode = surface === 'Today'
            ? createElement(PhysicsToday, { gradeInfo: localizedGrade, currentUnit: localizedUnit, progress: defaultPhysicsProgress(), ...actions })
            : createElement(PhysicsPractice, { unit: localizedUnit, completedQuestions: [], errorQuestions: [], ...actions })
          const zhNode = surface === 'Today'
            ? createElement(PhysicsToday, { gradeInfo: grade, currentUnit: unit, progress: defaultPhysicsProgress(), ...actions })
            : createElement(PhysicsPractice, { unit, completedQuestions: [], errorQuestions: [], ...actions })
          const en = await render(enNode, 'en')
          expect(en).not.toMatch(CJK)
          expect(en).not.toContain('katex-error')
          const zh = await render(zhNode, 'zh-Hant')
          for (const [index, concept] of unit.concepts.entries()) {
            expect(zh).toContain(renderToStaticMarkup(<MathFormula math={concept} />))
            expect(en).toContain(renderToStaticMarkup(<MathFormula math={localizedUnit.concepts[index]} />))
          }
        })
      }
    }
  }

  it('物理公式總表也使用相同的英文概念', async () => {
    const en = await render(<PhysicsFormulaSheet onBack={noop} />, 'en')
    expect(en).not.toMatch(CJK)
    expect(en).not.toContain('katex-error')
    const zh = await render(<PhysicsFormulaSheet onBack={noop} />, 'zh-Hant')
    for (const grade of Object.values(PHYSICS_GRADES)) {
      for (const unit of grade.units) {
        for (const concept of unit.concepts) expect(zh).toContain(renderToStaticMarkup(<MathFormula math={concept} />))
      }
    }
  })

  it('概念翻譯完整、缺鍵拒絕輸出、繁中逐字保留', async () => {
    await loadStemConceptCopy()
    for (const [source, english] of Object.entries({ ...CHEMISTRY_CONCEPT_CONTENT_EN, ...PHYSICS_CONCEPT_CONTENT_EN })) {
      expect(english.trim(), source).not.toBe('')
      expect(english, source).not.toMatch(CJK)
      expect(stemConceptCopy('en', source)).toBe(english)
    }
    const concepts = [...Object.values(PHYSICS_GRADES), ...Object.values(CHEMISTRY_GRADES)]
      .flatMap(grade => grade.units.flatMap(unit => unit.concepts))
    expect(concepts).toHaveLength(179)
    for (const concept of concepts) {
      expect(stemConceptCopy('en', concept)).not.toMatch(CJK)
      expect(stemConceptCopy('zh-Hant', concept)).toBe(concept)
    }
    expect(() => stemConceptCopy('en', 'missing-concept')).toThrow('Missing English STEM concept')
  })
})
