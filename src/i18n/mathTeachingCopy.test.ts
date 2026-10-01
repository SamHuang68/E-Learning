import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import ts from 'typescript'
import katex from 'katex'
import { MATH_GRADE_LIST } from '../math/data/gradeStore'
import { MATH_TEACHING_EN, mathTeachingCopy } from './mathTeachingCopy'

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/

function expectEnglish(source: string) {
  expect(Object.hasOwn(MATH_TEACHING_EN, source), source).toBe(true)
  const translated = mathTeachingCopy('en', source)
  expect(translated, source).not.toMatch(CJK)
  expect(translated.trim(), source).not.toBe('')
  expect(mathTeachingCopy('zh-Hant', source), source).toBe(source)
}

function mathComponents(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? mathComponents(path) : path.endsWith('.tsx') ? [path] : []
  })
}

describe('數學教材的英文翻譯覆蓋', () => {
  for (const grade of MATH_GRADE_LIST) {
    it(`${grade.id} 的年級說明、學段、考試說明與教具都有英文`, () => {
      const strings = [grade.band, grade.description,
        ...(grade.targetExam ? [grade.targetExam] : []),
        ...grade.labs.flatMap(lab => [lab.name, lab.description])]
      for (const source of strings) expectEnglish(source)
    })

    for (const unit of grade.units) {
      it(`${grade.id}:${unit.id} 的標題、副標與所有概念都有英文`, () => {
        for (const source of [unit.title, unit.subtitle, ...unit.concepts]) expectEnglish(source)
      })
    }
  }

  it('涵蓋全部十二年級與三十六個課程單元', () => {
    expect(MATH_GRADE_LIST).toHaveLength(12)
    expect(MATH_GRADE_LIST.flatMap(grade => grade.units)).toHaveLength(36)
    expect(new Set(MATH_GRADE_LIST.map(grade => grade.stage))).toEqual(new Set(['elementary', 'junior', 'senior']))
  })

  it('直接呼叫與訊號卡包裝函式的固定文案都有明確翻譯', () => {
    const sources: string[] = []
    for (const path of mathComponents(join(process.cwd(), 'src/math'))) {
      const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      function visit(node: ts.Node) {
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
          const name = node.expression.text
          const argument = name === 'mathTeachingCopy' ? node.arguments[1]
            : name === 'text' && path.endsWith('SolvingSignalCards.tsx') ? node.arguments[0] : undefined
          if (argument && ts.isStringLiteralLike(argument)) sources.push(argument.text)
        }
        ts.forEachChild(node, visit)
      }
      visit(source)
    }
    expect(sources.length).toBeGreaterThanOrEqual(22)
    for (const source of sources) expectEnglish(source)
  })

  it('教具切換列沒有硬編碼的中文文字、標題或無障礙標籤', () => {
    const path = join(process.cwd(), 'src/math/MathApp.tsx')
    const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const leaks: string[] = []
    function visit(node: ts.Node) {
      if (ts.isJsxText(node) && CJK.test(node.text)) leaks.push(node.text.trim())
      if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer) && CJK.test(node.initializer.text)) {
        leaks.push(node.getText(source))
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
    expect(leaks).toEqual([])
  })

  it('考試說明保留教學題與正式分數的界線', () => {
    expect(mathTeachingCopy('en', '國中教學題，不是會考分數')).toBe('Junior high practice questions, not CAP scores')
    expect(mathTeachingCopy('en', '高中教學題，不是學測分數')).toBe('Senior high practice questions, not GSAT scores')
    expect(mathTeachingCopy('en', '高中教學題，不是分科測驗分數')).toBe('Senior high practice questions, not AST scores')
  })

  it('缺漏字串與物件原型屬性明確失敗，不退回原文', () => {
    for (const source of ['尚未收錄的教學字串', 'toString', 'constructor', '__proto__']) {
      expect(() => mathTeachingCopy('en', source)).toThrow('缺少數學教材英文翻譯')
      expect(mathTeachingCopy('zh-Hant', source)).toBe(source)
    }
    expect(mathTeachingCopy('en', '')).toBe('')
  })

  it('整張英文表沒有東亞文字或空白譯文，數學公式可正確渲染', () => {
    for (const [source, translated] of Object.entries(MATH_TEACHING_EN)) {
      expectEnglish(source)
      for (const [, formula] of translated.matchAll(/\$([^$]+)\$/g)) {
        expect(() => katex.renderToString(formula, { throwOnError: true }), source).not.toThrow()
      }
    }
  })
})
