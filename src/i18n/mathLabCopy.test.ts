import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import ts from 'typescript'
import { MATH_LAB_EN, mathLabCopy } from './mathLabCopy'

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/
const sampleValues = ['2', '3', '4']
const interpolate = (text: string) => text.replace(/\{v(\d+)\}/g, (_, index: string) => sampleValues[Number(index)])

function staticText(node: ts.Node): string | undefined {
  if (ts.isStringLiteralLike(node)) return node.text
  if (ts.isTemplateExpression(node)) {
    return [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join('')
  }
  return undefined
}

describe('數學教具英文文案', () => {
  it('每一筆文案均有無 CJK 英譯，插值參數完整，繁中保持原樣', () => {
    expect(Object.keys(MATH_LAB_EN).length).toBeGreaterThan(230)
    for (const [source, english] of Object.entries(MATH_LAB_EN)) {
      expect(english.length, source).toBeGreaterThan(0)
      expect(english, source).not.toMatch(CJK)
      expect(english.match(/\{v\d+\}/g)?.sort() ?? [], source).toEqual(source.match(/\{v\d+\}/g)?.sort() ?? [])
      expect(mathLabCopy('en', source, sampleValues), source).toBe(interpolate(english))
      expect(mathLabCopy('zh-Hant', source, sampleValues), source).toBe(interpolate(source))
    }
  })

  it('未知中文文案與缺少插值參數直接失敗', () => {
    expect(() => mathLabCopy('en', '尚未翻譯的新教具')).toThrow('Missing English math lab copy')
    expect(() => mathLabCopy('en', '還差 {v0}')).toThrow('Missing math lab interpolation')
  })

  it('插值內含 CJK 也直接失敗', () => {
    expect(() => mathLabCopy('en', '還差 {v0}', ['未翻譯'])).toThrow('CJK in English math lab copy')
    expect(mathLabCopy('en', '\\frac{1}{2}')).toBe('\\frac{1}{2}')
  })

  it('固定字串呼叫皆存在，未包裝的 JSX 文字與屬性沒有中文', () => {
    const files = ['labs', 'diagrams'].flatMap(dir => readdirSync(join(process.cwd(), 'src/math', dir))
      .filter(file => file.endsWith('.tsx') && !file.includes('Calculus'))
      .map(file => join(process.cwd(), 'src/math', dir, file)))
    files.push(join(process.cwd(), 'src/math/components/MathVisualHub.tsx'))
    const leaks: string[] = []
    let calls = 0
    for (const path of files) {
      const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      function visit(node: ts.Node) {
        if (ts.isJsxText(node) && CJK.test(node.text)) leaks.push(path + ': ' + node.text.trim())
        if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer) && CJK.test(node.initializer.text)) {
          leaks.push(path + ': ' + node.getText(source))
        }
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
          const [sourceArgument, englishArgument] = node.arguments
          if (node.expression.text === 'ml' && sourceArgument && ts.isStringLiteralLike(sourceArgument)) {
            expect(Object.hasOwn(MATH_LAB_EN, sourceArgument.text), sourceArgument.text).toBe(true)
            calls++
          }
          if (
            node.expression.text === 'copy'
            && sourceArgument
            && englishArgument
          ) {
            const sourceText = staticText(sourceArgument)
            const englishText = staticText(englishArgument)
            if (sourceText !== undefined && englishText !== undefined) {
              if (CJK.test(sourceText)) expect(englishText, sourceText).not.toMatch(CJK)
              calls++
            }
          }
        }
        ts.forEachChild(node, visit)
      }
      visit(source)
    }
    expect(calls).toBeGreaterThan(180)
    expect(leaks).toEqual([])
  })
})
