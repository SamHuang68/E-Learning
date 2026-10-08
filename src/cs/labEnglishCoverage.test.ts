import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

const HAN = /[\u3400-\u9fff\uf900-\ufaff]/u
const LAB_FILES = [
  'labs/VonNeumannArchitectureLab.tsx',
  'labs/PipelineHazardLab.tsx',
  'labs/CacheMappingLab.tsx',
  'labs/AiMatrixTransformerLab.tsx',
  'labs/ArchifyHardwareMap.tsx',
]

function textOf(node: ts.Node): string | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) {
    return node.text
  }
  if (ts.isTemplateExpression(node)) {
    return [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join('')
  }
  return undefined
}

describe('CS lab English display boundary', () => {
  it.each(LAB_FILES)('%s pairs every Han-bearing source literal with exact English copy', (relativePath) => {
    const filename = path.resolve(import.meta.dirname, relativePath)
    const source = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const uncovered: string[] = []

    const visit = (node: ts.Node): void => {
      const value = textOf(node)
      if (value && HAN.test(value)) {
        const call = node.parent
        const isPairedCopy = ts.isCallExpression(call)
          && ts.isIdentifier(call.expression)
          && call.expression.text === 'copy'
          && call.arguments[0] === node
          && call.arguments.length === 2
        const english = isPairedCopy ? textOf(call.arguments[1]) : undefined
        if (!isPairedCopy || !english || HAN.test(english)) {
          const position = source.getLineAndCharacterOfPosition(node.getStart(source))
          uncovered.push(`${relativePath}:${position.line + 1}:${position.character + 1}`)
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(source)

    expect(uncovered).toEqual([])
  })
})
