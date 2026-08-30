import { parseMathExpression } from './parser'
import { differentiateAST } from './differentiator'
import { astToLatex } from './ast'
import type { DerivationStep } from '../../types'

/**
 * 步驟式微積分推導生成器
 * 自動為函數產生步驟式推導鏈
 */
export function generateDerivationSteps(exprStr: string): DerivationStep[] {
  const ast = parseMathExpression(exprStr)
  const originalLatex = astToLatex(ast)
  const steps: DerivationStep[] = []

  // Step 1: 識別目標函數與結構
  steps.push({
    id: 'step-1-structure',
    stepNumber: 1,
    ruleName: '函數結構與微分算則識別',
    ruleLatex: `\\frac{d}{dx} [f(x)]`,
    beforeLatex: `f(x) = ${originalLatex}`,
    afterLatex: `\\frac{d}{dx} \\left[ ${originalLatex} \\right]`,
    explanation: '首先識別目標函數的代數結構（多項式和差、乘積、商法則或複合函數連鎖律）。',
    keyInsight: '確認主要運算符號以決定第一步應套用的求導法則。',
    checkpoint: {
      prompt: `請確認對此函數求導的第一步主要法則：`,
      options: ['和差與冪法則 (Power Rule)', '乘積法則 (Product Rule)', '商法則 (Quotient Rule)', '連鎖律 (Chain Rule)'],
      correctIndex: ast.type === 'binary' && ast.op === '*' ? 1 : ast.type === 'binary' && ast.op === '/' ? 2 : 0,
      hint: '觀察最外層的運算符號是乘號、除號還是多項式加減。',
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
