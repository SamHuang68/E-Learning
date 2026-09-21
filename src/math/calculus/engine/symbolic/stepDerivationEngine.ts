import { parseMathExpression, MathParseError } from './parser'
import { differentiateAST } from './differentiator'
import { astToLatex } from './ast'
import type { ASTNode } from './ast'
import type { DerivationStep } from '../../types'

/** Engine boundary typed error for undefined symbols (Calculus context: only x allowed as free var; e/pi constants; known funcs) */
export class UndefinedSymbolError extends Error {
  readonly symbol: string
  readonly allowed: readonly string[]
  constructor(symbol: string, allowed: readonly string[] = ['x', 'e', 'pi', 'sin', 'cos', 'tan', 'exp', 'ln', 'sqrt']) {
    const zh = `未定義符號「${symbol}」`
    const en = `Undefined symbol "${symbol}"`
    super(`${en} / ${zh}. Allowed: ${allowed.join(', ')}`)
    this.name = 'UndefinedSymbolError'
    this.symbol = symbol
    this.allowed = allowed
  }
}

function collectSymbols(node: ASTNode, symbols = new Set<string>()): Set<string> {
  switch (node.type) {
    case 'variable':
      symbols.add(node.name)
      break
    case 'func':
      symbols.add(node.name)
      collectSymbols(node.arg, symbols)
      break
    case 'binary':
      collectSymbols(node.left, symbols)
      collectSymbols(node.right, symbols)
      break
    case 'unary':
      collectSymbols(node.expr, symbols)
      break
  }
  return symbols
}

export function validateSymbols(ast: ASTNode, allowedVars: readonly string[] = ['x']): void {
  const symbols = collectSymbols(ast)
  const knownFuncs = ['sin', 'cos', 'tan', 'exp', 'ln', 'sqrt']
  const knownConsts = ['e', 'pi', 'PI', 'Pi', 'E']
  for (const s of symbols) {
    const lower = s.toLowerCase()
    if (allowedVars.includes(s) || knownConsts.includes(s) || knownFuncs.includes(lower)) continue
    throw new UndefinedSymbolError(s)
  }
}

const RULE_OPTIONS = [
  '和差與冪法則 (Power Rule)',
  '乘積法則 (Product Rule)',
  '商法則 (Quotient Rule)',
  '連鎖律 (Chain Rule)',
] as const

function isIdentityVariable(node: ASTNode, wrt = 'x'): boolean {
  return node.type === 'variable' && node.name === wrt
}

/**
 * 判斷最外層求導法則。複合函數（如 sin(x^2)、(x+1)^3）必須標為連鎖律，
 * 不得誤判成冪法則。
 */
export function outerDifferentiationRuleIndex(ast: ASTNode, wrt = 'x'): number {
  if (ast.type === 'unary') {
    return outerDifferentiationRuleIndex(ast.expr, wrt)
  }
  if (ast.type === 'func') {
    return isIdentityVariable(ast.arg, wrt) ? 0 : 3
  }
  if (ast.type === 'binary') {
    if (ast.op === '*') return 1
    if (ast.op === '/') return 2
    if (ast.op === '^') {
      const baseNeedsChain = ast.left.type !== 'variable' && ast.left.type !== 'constant'
      const expIsNonConstant = ast.right.type !== 'constant'
      if (baseNeedsChain || expIsNonConstant) return 3
      return 0
    }
  }
  return 0
}

/**
 * 步驟式微積分推導生成器
 * 自動為函數產生步驟式推導鏈
 */
export function generateDerivationSteps(exprStr: string): DerivationStep[] {
  let ast: ASTNode
  try {
    ast = parseMathExpression(exprStr)
  } catch (err) {
    const message = err instanceof MathParseError || err instanceof Error ? err.message : '無法解析表達式'
    return [
      {
        id: 'step-parse-error',
        stepNumber: 1,
        ruleName: '表達式無效',
        ruleLatex: '\\text{parse error}',
        beforeLatex: exprStr,
        afterLatex: '',
        explanation: `無法解析「${exprStr}」：${message}`,
        keyInsight: '請檢查括號是否成對、運算子是否缺運算元（例如 x+ 為不完整輸入）。',
      },
    ]
  }

  // Engine boundary: reject undefined symbols with typed error (deepen calculus symbol safety)
  try {
    validateSymbols(ast)
  } catch (err) {
    if (err instanceof UndefinedSymbolError) {
      return [{
        id: 'step-symbol-error',
        stepNumber: 1,
        ruleName: '未定義符號 / Undefined Symbol',
        ruleLatex: '\\text{error}',
        beforeLatex: exprStr,
        afterLatex: '',
        explanation: err.message,
        keyInsight: '僅允許 x 作為自由變數；e、pi 為常數；sin 等為已知函數。',
      }]
    }
    throw err
  }

  const originalLatex = astToLatex(ast)
  const steps: DerivationStep[] = []
  const correctIndex = outerDifferentiationRuleIndex(ast)

  // Step 1: 識別目標函數與結構
  steps.push({
    id: 'step-1-structure',
    stepNumber: 1,
    ruleName: '函數結構與微分算則識別',
    ruleLatex: `\\frac{d}{dx} [f(x)]`,
    beforeLatex: `f(x) = ${originalLatex}`,
    afterLatex: `\\frac{d}{dx} \\left[ ${originalLatex} \\right]`,
    explanation: '首先識別目標函數的代數結構（多項式和差、乘積、商法則或複合函數連鎖律）。',
    keyInsight: '確認最外層運算：複合函數（如 sin(x^2)）應套用連鎖律，而不是只看內層的冪次。',
    checkpoint: {
      prompt: `請確認對此函數求導的第一步主要法則：`,
      options: [...RULE_OPTIONS],
      correctIndex,
      hint: '觀察最外層是乘、除、複合函數，還是單純多項式冪次。',
    },
  })

  // Step 2: 符號求導
  const diffAst = differentiateAST(ast, 'x')
  const diffLatex = astToLatex(diffAst)

  steps.push({
    id: 'step-2-differentiate',
    stepNumber: 2,
    ruleName: '套用微積分基本算則',
    ruleLatex: `(u \\cdot v)' = u'v + uv' \\quad \\text{或} \\quad (u^n)' = n u^{n-1} u'`,
    beforeLatex: `\\frac{d}{dx} \\left[ ${originalLatex} \\right]`,
    afterLatex: `f'(x) = ${diffLatex}`,
    explanation: '依據各項結構分別求導，若遇到複合函數則必須乘上內層函數之導數。',
    keyInsight: '連鎖律千萬不可遺漏內層導數 g\'(x)。',
  })

  // Step 3: 化簡與臨界點分析
  steps.push({
    id: 'step-3-simplify',
    stepNumber: 3,
    ruleName: '代數化簡與臨界點條件',
    ruleLatex: `f'(x) = 0 \\implies \\text{Critical Points}`,
    beforeLatex: `f'(x) = ${diffLatex}`,
    afterLatex: `f'(x) = ${diffLatex} = 0`,
    explanation: '將導函數化為最簡因式，令導函數為零可求得水平切線處的臨界點 (Critical Points)。',
    keyInsight: '切線斜率為零的位置是探索局部極大值、極小值或反曲點的關鍵位置。',
  })

  return steps
}
