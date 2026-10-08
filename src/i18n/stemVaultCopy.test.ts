import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import ts from 'typescript'
import { getAllPhysicsUnits, PHYSICS_STRAND_NAMES } from '../physics/data/curriculum'
import { getAllChemistryUnits } from '../chemistry/data/curriculum'
import { loadStemVaultContentCopy, localizeStemVaultQuestion, STEM_VAULT_EN, stemVaultCopy } from './stemVaultCopy'
import { STEM_VAULT_CONTENT_EN } from './stemVaultContentEn'
import { PHYSICS_MOCK_EXAMS } from '../physics/data/mockExams'
import { CHEMISTRY_MOCK_EXAMS } from '../chemistry/data/mockExams'
import { PHYSICS_SOLVING_SIGNALS } from '../physics/data/solvingSignals'
import { CHEMISTRY_SOLVING_SIGNALS } from '../chemistry/data/solvingSignals'
import { localizePhysicsSignal } from '../physics/locale/content'
import { localizeChemistrySignal } from '../chemistry/locale/content'
import { AI_CLOUD_SCENARIOS } from '../toeic/data/aiCloudDialogues'
import { toeicCertificates } from '../toeic/data/certificates'
import { localizeToeicCertificate } from './toeicCertificateCopy'

describe('有資料錯題庫英文介面', () => {
  it('所有學段、靜態介面與關聯教具都有英文，繁中來源保持一致', () => {
    const labels = [
      ...[...getAllPhysicsUnits(), ...getAllChemistryUnits()].map((unit) => unit.band),
      ...Object.values(PHYSICS_STRAND_NAMES),
    ]
    for (const path of [
      'src/physics/components/PhysicsErrorVault.tsx',
      'src/chemistry/components/ChemistryErrorVault.tsx',
      'src/math/components/MathErrorVault.tsx',
      'src/physics/components/PhysicsToday.tsx',
      'src/chemistry/components/ChemistryToday.tsx',
    ]) {
      const source = readFileSync(path, 'utf8')
      const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      function visit(node: ts.Node) {
        if (ts.isCallExpression(node) && node.expression.getText(file) === 'stemVaultCopy') {
          const label = node.arguments[1]
          if (label && ts.isStringLiteral(label)) labels.push(label.text)
        }
        ts.forEachChild(node, visit)
      }
      visit(file)
      for (const match of source.matchAll(/name: '([^']+)'/g)) labels.push(match[1])
    }
    for (const label of labels) {
      expect(stemVaultCopy('en', label), label).not.toMatch(/[\u3400-\u9fff]/)
      expect(stemVaultCopy('zh-Hant', label)).toBe(label)
    }
    expect(() => stemVaultCopy('en', '未定義測試文字')).toThrow()
  })

  it('每筆英文介面與教材對照皆非空且不含 CJK，繁中來源不變', async () => {
    await loadStemVaultContentCopy()
    for (const [source, english] of Object.entries({ ...STEM_VAULT_EN, ...STEM_VAULT_CONTENT_EN })) {
      expect(english.trim(), source).not.toBe('')
      expect(english, source).not.toMatch(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/)
      expect(stemVaultCopy('en', source), source).toBe(english)
      expect(stemVaultCopy('zh-Hant', source)).toBe(source)
    }
    expect(() => stemVaultCopy('en', 'Missing English entry')).toThrow()
    expect(() => stemVaultCopy('en', 'toString')).toThrow()
  })

  it('動態題號與主軸插值保持英文，缺少參數或中文參數皆拋錯', () => {
    expect(stemVaultCopy('en', '化學進階複習題目 ({id})', { id: 'unknown-123' }))
      .toBe('Advanced chemistry review question (unknown-123)')
    expect(stemVaultCopy('zh-Hant', '化學進階複習題目 ({id})', { id: 'unknown-123' }))
      .toBe('化學進階複習題目 (unknown-123)')
    expect(() => stemVaultCopy('en', '化學進階複習題目 ({id})', {})).toThrow()
    expect(() => stemVaultCopy('en', '化學進階複習題目 ({id})', { id: '中文題號' })).toThrow()
    expect(() => stemVaultCopy('en', '鎖定本題物理主軸【{strand}】，釐清已知物理量與待求未知量之函數關係。', { strand: '力學' })).toThrow()
  })

  it('所有題目與訊號皆有英文，且題號、答案、繁中內容與公式結構保持不變', async () => {
    await loadStemVaultContentCopy()
    const questions = [
      ...getAllPhysicsUnits().flatMap(unit => unit.questions),
      ...getAllChemistryUnits().flatMap(unit => unit.questions),
      ...Object.values(PHYSICS_MOCK_EXAMS).flatMap(exam => exam.questions),
      ...Object.values(CHEMISTRY_MOCK_EXAMS).flatMap(exam => exam.questions),
    ]
    for (const question of questions) {
      const before = JSON.stringify(question)
      const english = localizeStemVaultQuestion('en', question)
      expect(english.id).toBe(question.id)
      expect(english.answer).toBe(question.answer)
      expect(english.options?.length).toBe(question.options?.length)
      expect(localizeStemVaultQuestion('zh-Hant', question)).toEqual(question)
      expect(JSON.stringify(question)).toBe(before)
    }
    const formulas = (text: string) => [...text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+?)\$/g)]
      .map(match => (match[1] ?? match[2])
        .replaceAll('\text{', '\\text{')
        .replace(/\\text\{[^{}]*\}/g, '')
        .replaceAll('質量數', 'mass number').replaceAll('中子數', 'neutron count')
        .replaceAll('生成氣體係數', 'gaseous product coefficients')
        .replaceAll('反應氣體係數', 'gaseous reactant coefficients')
        .replace(/\s/g, ''))
    for (const [source, english] of Object.entries(STEM_VAULT_CONTENT_EN)) {
      expect(formulas(english).sort(), source).toEqual(formulas(source).sort())
    }
    const signalText = (signal: {
      gradeBand: string
      topic: string
      problemSignal: string
      threeSecondRule: string
      firstStepFormula: string
      exampleProblem: { question: string; quickSolve: string }
    }) => [
      signal.gradeBand,
      signal.topic,
      signal.problemSignal,
      signal.threeSecondRule,
      signal.firstStepFormula,
      signal.exampleProblem.question,
      signal.exampleProblem.quickSolve,
    ]
    for (const signal of PHYSICS_SOLVING_SIGNALS) {
      const english = localizePhysicsSignal(signal, 'en')
      expect(localizePhysicsSignal(signal, 'zh-Hant')).toBe(signal)
      for (const text of signalText(english)) {
        expect(text).not.toMatch(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/)
      }
    }
    for (const signal of CHEMISTRY_SOLVING_SIGNALS) {
      const english = localizeChemistrySignal(signal, 'en')
      expect(localizeChemistrySignal(signal, 'zh-Hant')).toBe(signal)
      for (const text of signalText(english)) {
        expect(text).not.toMatch(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/)
      }
    }
  })

  it('AI Cloud 教材全部具備英文情境及解析，不更動標準答案', () => {
    for (const cert of toeicCertificates) {
      const localized = localizeToeicCertificate(cert, 'en')
      expect(localized.units).toBe(cert.units)
      expect(localizeToeicCertificate(cert, 'zh-Hant')).toBe(cert)
      for (const text of [localized.audience, localized.mapTitle, localized.mapDesc]) {
        expect(text).not.toMatch(/[\u3400-\u9fff]/)
      }
    }
    for (const scenario of AI_CLOUD_SCENARIOS) {
      for (const text of [scenario.titleEn, scenario.accentLabelEn, scenario.aiCloudKeywordsTipsEn]) {
        expect(text).toBeTruthy()
        expect(text).not.toMatch(/[\u3400-\u9fff]/)
      }
      for (const q of scenario.questions) {
        expect(q.explanationEn).toBeTruthy()
        expect(q.explanationEn).not.toMatch(/[\u3400-\u9fff]/)
        expect(q.options[q.correctIndex]).toBeTruthy()
      }
    }
  })
})
