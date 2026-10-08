import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import {
  ALGEBRA_TILE_PRESETS,
  BALANCE_PRESETS,
  BAR_MODEL_PRESETS,
  MATRIX_PRESETS,
  PROOF_PRESETS,
  RIEMANN_PRESETS,
} from './data/diagramPresets'
import {
  ALGEBRA_TILE_PRESETS_EN,
  BALANCE_PRESETS_EN,
  BAR_MODEL_PRESETS_EN,
  MATRIX_PRESETS_EN,
  PROOF_PRESETS_EN,
  RIEMANN_PRESETS_EN,
} from './data/diagramPresets.en'

const HAN = /[\u3400-\u9fff\uf900-\ufaff]/u
const LAB_FILES = [
  'labs/BlocksLab.tsx',
  'labs/MultiplicationLab.tsx',
  'labs/FractionLab.tsx',
  'labs/CoordinateLab.tsx',
  'labs/PythagorasLab.tsx',
  'labs/UnitCircleLab.tsx',
]
const VISUAL_COMPONENT_FILES = [
  'diagrams/BalanceScaleSolver.tsx',
  'diagrams/BarModelSolver.tsx',
  'diagrams/AlgebraTilesLab.tsx',
  'diagrams/MatrixTransformLab.tsx',
  'diagrams/RiemannCalculusLab.tsx',
  'diagrams/GeometricProofsLab.tsx',
]

function textOf(node: ts.Node): string | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) return node.text
  if (ts.isTemplateExpression(node)) return [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join('')
  return undefined
}

describe('reachable math lab English display boundary', () => {
  it.each([...LAB_FILES, ...VISUAL_COMPONENT_FILES])('%s pairs every Han-bearing source literal with exact English copy', (relativePath) => {
    const filename = path.resolve(import.meta.dirname, relativePath)
    const source = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const uncovered: string[] = []
    const visit = (node: ts.Node): void => {
      const value = textOf(node)
      if (value && HAN.test(value)) {
        const call = node.parent
        const paired = ts.isCallExpression(call)
          && ts.isIdentifier(call.expression)
          && call.expression.text === 'copy'
          && call.arguments[0] === node
          && call.arguments.length === 2
        const english = paired ? textOf(call.arguments[1]) : undefined
        if (!paired || !english || HAN.test(english)) {
          const position = source.getLineAndCharacterOfPosition(node.getStart(source))
          uncovered.push(`${relativePath}:${position.line + 1}:${position.character + 1}`)
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
    expect(uncovered).toEqual([])
  })

  it('keeps every English visual preset Han-free and structurally aligned', () => {
    const englishPresets = [
      BALANCE_PRESETS_EN,
      BAR_MODEL_PRESETS_EN,
      ALGEBRA_TILE_PRESETS_EN,
      MATRIX_PRESETS_EN,
      RIEMANN_PRESETS_EN,
      PROOF_PRESETS_EN,
    ]
    expect(HAN.test(JSON.stringify(englishPresets))).toBe(false)

    expect(BALANCE_PRESETS_EN.map(({ title: _title, hint: _hint, ...structural }) => structural))
      .toEqual(BALANCE_PRESETS.map(({ title: _title, hint: _hint, ...structural }) => structural))
    expect(ALGEBRA_TILE_PRESETS_EN.map(({ title: _title, explanation: _explanation, ...structural }) => structural))
      .toEqual(ALGEBRA_TILE_PRESETS.map(({ title: _title, explanation: _explanation, ...structural }) => structural))
    expect(MATRIX_PRESETS_EN.map(({ title: _title, description: _description, category: _category, ...structural }) => structural))
      .toEqual(MATRIX_PRESETS.map(({ title: _title, description: _description, category: _category, ...structural }) => structural))
    expect(RIEMANN_PRESETS_EN.map(({ title: _title, functionName: _functionName, explanation: _explanation, ...structural }) => structural))
      .toEqual(RIEMANN_PRESETS.map(({ title: _title, functionName: _functionName, explanation: _explanation, ...structural }) => structural))
    expect(PROOF_PRESETS_EN.map(({ title: _title, theoremName: _theoremName, coreConcept: _coreConcept, interactiveGoal: _interactiveGoal, proofExplanation: _proofExplanation, ...structural }) => structural))
      .toEqual(PROOF_PRESETS.map(({ title: _title, theoremName: _theoremName, coreConcept: _coreConcept, interactiveGoal: _interactiveGoal, proofExplanation: _proofExplanation, ...structural }) => structural))

    const barStructure = (presets: typeof BAR_MODEL_PRESETS) => presets.map((preset) => ({
      id: preset.id,
      personA: { baseAmount: preset.personA.baseAmount, extraAmount: preset.personA.extraAmount, color: preset.personA.color },
      personB: { baseAmount: preset.personB.baseAmount, extraAmount: preset.personB.extraAmount, color: preset.personB.color },
      totalSum: preset.totalSum,
      difference: preset.difference,
      stepNumbers: preset.solutionSteps.map((step) => step.stepNumber),
    }))
    expect(barStructure(BAR_MODEL_PRESETS_EN)).toEqual(barStructure(BAR_MODEL_PRESETS))
  })
})
