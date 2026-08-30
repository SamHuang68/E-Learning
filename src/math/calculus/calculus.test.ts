import { describe, it, expect } from 'vitest'
import {
  parseMathExpression,
  astToLatex,
  differentiateAST,
  compileASTToFunction,
  generateDerivationSteps,
  adaptiveSimpson,
  compositeSimpson,
  compositeTrapezoidal,
  highPrecisionDerivative,
  runNewtonRaphson,
  evaluateTaylorPolynomial,
} from './engine'
import { CALCULUS_PROBLEMS } from './data/calculusProblems'
import { CALCULUS_BADGES } from './data/calculusBadges'
import { CALCULUS_CATALOG } from './data/calculusCatalog'

describe('微積分專題 (Calculus Studio) 模組測試', () => {
  describe('符號運算子系統 (Symbolic Engine)', () => {
    it('應能正確解析多項式與二元運算 AST', () => {
      const ast = parseMathExpression('x^3 - 3*x + 2')
      expect(ast).toBeDefined()
      const latex = astToLatex(ast)
      expect(latex).toContain('x^{3}')
    })

    it('多項式符號微分應正確計算並化簡', () => {
      const ast = parseMathExpression('x^2 + 3*x')
      const diff = differentiateAST(ast, 'x')
      const fn = compileASTToFunction(diff)
      // (x^2 + 3x)' = 2x + 3
      expect(fn(0)).toBe(3)
      expect(fn(2)).toBe(7)
    })

    it('乘積法則 (Product Rule) 符號求導應正確', () => {
      const ast = parseMathExpression('x * sin(x)')
      const diff = differentiateAST(ast, 'x')
      const fn = compileASTToFunction(diff)
      // (x * sin(x))' = sin(x) + x * cos(x)
      // x = 0 => sin(0) + 0*cos(0) = 0
      expect(fn(0)).toBeCloseTo(0, 4)
      // x = pi => sin(pi) + pi*cos(pi) = 0 + pi*(-1) = -pi
      expect(fn(Math.PI)).toBeCloseTo(-Math.PI, 4)
    })

    it('應能自動產生結構化步驟推導鏈', () => {
      const steps = generateDerivationSteps('x^2 - 2*x + 2')
      expect(steps.length).toBeGreaterThanOrEqual(3)
      expect(steps[0].stepNumber).toBe(1)
      expect(steps[0].checkpoint).toBeDefined()
      expect(steps[1].afterLatex).toBeDefined()
    })
  })

  describe('數值計算子系統 (Numerical Engine)', () => {
    it('自適應辛普森積分法應能高精度計算拋物線面積', () => {
      // ∫_0^3 x^2 dx = 9.0
      const f = (x: number) => x * x
      const res = adaptiveSimpson(f, 0, 3)
      expect(res.value).toBeCloseTo(9.0, 5)
    })

    it('複合梯形與辛普森法則應正確運算', () => {
      const f = (x: number) => x * x
      const trap = compositeTrapezoidal(f, 0, 3, 30)
      const simp = compositeSimpson(f, 0, 3, 30)
      expect(trap).toBeCloseTo(9.0, 1)
      expect(simp).toBeCloseTo(9.0, 4)
    })

    it('五點中心差分法應能精確計算一階導數', () => {
      // f(x) = x^3 => f'(2) = 12
      const f = (x: number) => Math.pow(x, 3)
      const d = highPrecisionDerivative(f, 2)
      expect(d).toBeCloseTo(12.0, 4)
    })

    it('牛頓-拉弗森法應能在數步內收斂至多項式實根', () => {
      // f(x) = x^3 - 2x - 5, root ≈ 2.094551
      const f = (x: number) => Math.pow(x, 3) - 2 * x - 5
      const res = runNewtonRaphson(f, 2.0, 6)
      expect(res.converged).toBe(true)
      expect(res.root).toBeCloseTo(2.094551, 4)
    })

    it('泰勒多項式數值求值在展開中心附近應高度吻合', () => {
      // f(x) = sin(x) 在 x0=0 處 3 階泰勒展開為 x - x^3/6
      const f = (x: number) => Math.sin(x)
      const approx = evaluateTaylorPolynomial(f, 0, 3, 0.5)
      // 0.5 - 0.125/6 = 0.5 - 0.0208333 = 0.4791667
      // sin(0.5) = 0.4794255
      expect(approx).toBeCloseTo(Math.sin(0.5), 3)
    })
  })

  describe('題庫與微認證勳章規範 (Curriculum & Badges)', () => {
    it('應完整提供 4 階認知階梯題庫', () => {
      expect(CALCULUS_PROBLEMS.length).toBeGreaterThanOrEqual(4)
      const tiers = CALCULUS_PROBLEMS.map((p) => p.tier)
      expect(tiers).toContain('L1')
      expect(tiers).toContain('L2')
      expect(tiers).toContain('L3')
      expect(tiers).toContain('L4')
    })

    it('微積分專屬勳章庫應具備清晰的解鎖條件與 XP 獎勵', () => {
      expect(CALCULUS_BADGES.length).toBe(4)
      CALCULUS_BADGES.forEach((b) => {
        expect(b.id).toMatch(/^badge-calc-/)
        expect(b.xpReward).toBeGreaterThan(0)
      })
    })

    it('微積分概念目錄應包含 2PL IRT 參數與錯誤分類處方', () => {
      expect(CALCULUS_CATALOG.length).toBeGreaterThanOrEqual(5)
      CALCULUS_CATALOG.forEach((item) => {
        expect(typeof item.difficulty).toBe('number')
        expect(typeof item.discrimination).toBe('number')
        expect(Object.keys(item.distractorPrescriptions).length).toBeGreaterThan(0)
      })
    })
  })
})
