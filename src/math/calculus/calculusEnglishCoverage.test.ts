import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import { CALCULUS_PROBLEMS } from './data/calculusProblems'
import { CALCULUS_PROBLEM_ENGLISH, localizeCalculusProblem } from './data/calculusProblemEnglish'
import { CALCULUS_BADGES } from './data/calculusBadges'
import { CALCULUS_CATALOG, CALCULUS_CATALOG_ENGLISH_NAMES, catalogPrerequisiteRows } from './data/calculusCatalog'
import { generateDerivationSteps } from './engine'
import { tryParseMathExpression } from './engine/symbolic/parser'
import { PRESET_FUNCTIONS, PRESET_FUNCTIONS_EN } from './data/calculusLabPresets'
import { CALCULUS_CONTENT_EN } from '../../i18n/calculusContentEn'

const HAN = /[\u3400-\u9fff\uf900-\ufaff]/u
const COMPONENT_FILES = [
  'CalculusStudio.tsx',
  'components/CalculusAssessment/CalculusAssessmentWidget.tsx',
  'components/CalculusCanvas/CalculusCanvas.tsx',
  'components/CalculusLab/CalculusLabPanel.tsx',
  'components/CalculusSolver/FormulaStepCard.tsx',
  'components/CalculusSolver/StepByStepSolver.tsx',
]

function textOf(node: ts.Node): string | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) return node.text
  if (ts.isTemplateExpression(node)) return [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join('')
  return undefined
}

function canonicalKeyOf(node: ts.Node): string | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text.trim()
  if (!ts.isTemplateExpression(node)) return undefined
  return (node.head.text + node.templateSpans
    .map((span, index) => `{${index}}${span.literal.text}`)
    .join('')).trim()
}

function isInsideNamedVariable(node: ts.Node, name: string): boolean {
  for (let current: ts.Node | undefined = node.parent; current; current = current.parent) {
    if (ts.isVariableDeclaration(current) && ts.isIdentifier(current.name) && current.name.text === name) return true
  }
  return false
}

describe('reachable Calculus Studio English display boundary', () => {
  it('routes Canvas and badge copy through the canonical calculus dictionary', () => {
    const canvasSource = fs.readFileSync(path.resolve(import.meta.dirname, 'components/CalculusCanvas/CalculusCanvas.tsx'), 'utf8')
    const studioSource = fs.readFileSync(path.resolve(import.meta.dirname, 'CalculusStudio.tsx'), 'utf8')
    const badgeSource = fs.readFileSync(path.resolve(import.meta.dirname, 'data/calculusBadges.ts'), 'utf8')

    expect(canvasSource).not.toMatch(/\bcopy\(/)
    expect(canvasSource).not.toContain('const copy')
    expect(studioSource).not.toMatch(/\bcopy\(/)
    expect(studioSource).not.toContain('const copy')
    expect(studioSource).not.toContain('localizeCalculusBadge')
    expect(badgeSource).not.toContain('CALCULUS_BADGES_EN')
  })

  it.each(COMPONENT_FILES)('%s pairs every rendered Han literal with explicit or canonical English', (relativePath) => {
    const filename = path.resolve(import.meta.dirname, relativePath)
    const source = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const uncovered: string[] = []
    const visit = (node: ts.Node): void => {
      const value = textOf(node)
      if (value && HAN.test(value) && !isInsideNamedVariable(node, 'PRESET_FUNCTIONS')) {
        const call = node.parent
        const paired = ts.isCallExpression(call)
          && ts.isIdentifier(call.expression)
          && call.expression.text === 'copy'
          && call.arguments[0] === node
          && call.arguments.length === 2
        const english = paired ? textOf(call.arguments[1]) : undefined
        const canonical = ts.isCallExpression(call)
          && ts.isIdentifier(call.expression)
          && call.expression.text === 'c'
          && call.arguments[0] === node
          && call.arguments.length === 1
        const canonicalEnglish = canonical ? CALCULUS_CONTENT_EN[canonicalKeyOf(node) ?? ''] : undefined
        if ((!paired || !english || HAN.test(english))
          && (!canonical || !canonicalEnglish || HAN.test(canonicalEnglish))) {
          const position = source.getLineAndCharacterOfPosition(node.getStart(source))
          uncovered.push(`${relativePath}:${position.line + 1}:${position.character + 1}`)
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
    expect(uncovered).toEqual([])
  })

  it('covers every adaptive problem with Han-free English while preserving answer structure', () => {
    expect(Object.keys(CALCULUS_PROBLEM_ENGLISH).sort()).toEqual(CALCULUS_PROBLEMS.map((problem) => problem.id).sort())
    const localized = CALCULUS_PROBLEMS.map(localizeCalculusProblem)
    expect(HAN.test(JSON.stringify(localized.map(({ derivationSteps: _steps, ...visible }) => visible)))).toBe(false)
    expect(localized.map((problem) => ({
      id: problem.id,
      tier: problem.tier,
      conceptTag: problem.conceptTag,
      defaultExpr: problem.defaultExpr,
      defaultParams: problem.defaultParams,
      targetMode: problem.targetMode,
      difficulty: problem.difficulty,
      correctIndex: problem.correctIndex,
      optionCount: problem.options?.length,
    }))).toEqual(CALCULUS_PROBLEMS.map((problem) => ({
      id: problem.id,
      tier: problem.tier,
      conceptTag: problem.conceptTag,
      defaultExpr: problem.defaultExpr,
      defaultParams: problem.defaultParams,
      targetMode: problem.targetMode,
      difficulty: problem.difficulty,
      correctIndex: problem.correctIndex,
      optionCount: problem.options?.length,
    })))
  })

  it('keeps presets, badges, and prerequisite names complete and structurally aligned', () => {
    expect(PRESET_FUNCTIONS_EN.map(({ label: _label, ...item }) => item)).toEqual(PRESET_FUNCTIONS.map(({ label: _label, ...item }) => item))
    expect(HAN.test(JSON.stringify(PRESET_FUNCTIONS_EN))).toBe(false)

    for (const badge of CALCULUS_BADGES) {
      const translations = [badge.title, badge.description, badge.condition]
        .map((source) => CALCULUS_CONTENT_EN[source])
      expect(translations).toHaveLength(3)
      for (const english of translations) {
        expect(english).toBeTruthy()
        expect(HAN.test(english)).toBe(false)
      }
      expect(badge.condition).not.toMatch(/^(?:assessment:|unavailable$)/)
    }

    expect(Object.keys(CALCULUS_CATALOG_ENGLISH_NAMES).sort()).toEqual(CALCULUS_CATALOG.map((item) => item.id).sort())
    const englishRows = catalogPrerequisiteRows('en')
    expect(HAN.test(JSON.stringify(englishRows))).toBe(false)
    expect(englishRows.map((row) => ({ id: row.id, prereqIds: row.prereqs.map((p) => p.id) })))
      .toEqual(catalogPrerequisiteRows().map((row) => ({ id: row.id, prereqIds: row.prereqs.map((p) => p.id) })))
  })

  it('returns Han-free English derivation and parser states', () => {
    const outputs = [
      generateDerivationSteps('sin(x^2)', 'en'),
      generateDerivationSteps('x+', 'en'),
      generateDerivationSteps('mystery(x)', 'en'),
      tryParseMathExpression('', 'en'),
      tryParseMathExpression('sin(', 'en'),
      tryParseMathExpression('2..3', 'en'),
    ]
    expect(HAN.test(JSON.stringify(outputs))).toBe(false)
  })
})
