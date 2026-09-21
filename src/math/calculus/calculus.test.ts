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
import { CALCULUS_CATALOG, catalogPrerequisiteRows } from './data/calculusCatalog'
import { catalogItemText, GRADIENT_INTUITION_SHEET } from './data/gradientIntuition'

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
      expect(CALCULUS_PROBLEMS.length).toBeGreaterThanOrEqual(9)
      const tiers = CALCULUS_PROBLEMS.map((p) => p.tier)
      expect(tiers).toContain('L1')
      expect(tiers).toContain('L2')
      expect(tiers).toContain('L3')
      expect(tiers).toContain('L4')
      const subPack = CALCULUS_PROBLEMS.filter((p) => p.conceptTag === 'calc-u-substitution')
      expect(subPack.length).toBe(5)
    })

    it('series convergence pack has six teaching items, not an exam-pass claim', () => {
      const seriesPack = CALCULUS_PROBLEMS.filter((p) => p.conceptTag === 'calc-series-convergence')
      expect(seriesPack.map((p) => p.id)).toEqual([
        'calc-prob-series1',
        'calc-prob-series2',
        'calc-prob-series3',
        'calc-prob-series4',
        'calc-prob-series5',
        'calc-prob-series6',
      ])
      const blob = seriesPack.map((p) => `${p.title}\n${p.questionText}\n${p.explanation}`).join('\n')
      expect(blob).toMatch(/通項/)
      expect(blob).toMatch(/geometric|等比/i)
      expect(blob).toMatch(/p-series|p-級數/i)
      expect(blob).toMatch(/ratio|比值/i)
      expect(blob).toMatch(/integral|積分/i)
      expect(blob).toMatch(/alternating|交錯/i)
      seriesPack.forEach((p) => {
        expect(p.explanation).toMatch(/教學/)
        expect(p.explanation).toMatch(/不是|非正式/)
        expect(p.options?.length).toBe(4)
        expect(p.correctIndex).toBe(0)
        expect(p.title).toMatch(/\//)
      })
      const seriesConcept = CALCULUS_CATALOG.find((c) => c.id === 'calc-series-convergence')
      expect(seriesConcept?.category).toBe('series')
      expect(seriesConcept?.description).toMatch(/非正式考試/)
    })

    it('implicit differentiation pack has five teaching items, not an exam-pass claim', () => {
      const pack = CALCULUS_PROBLEMS.filter((p) => p.conceptTag === 'calc-implicit-diff')
      expect(pack.map((p) => p.id)).toEqual([
        'calc-prob-implicit1',
        'calc-prob-implicit2',
        'calc-prob-implicit3',
        'calc-prob-implicit4',
        'calc-prob-implicit5',
      ])
      const blob = pack.map((p) => `${p.title}\n${p.questionText}\n${p.explanation}`).join('\n')
      expect(blob).toMatch(/隱函數/)
      expect(blob).toMatch(/circle|圓/i)
      expect(blob).toMatch(/product|乘積/i)
      expect(blob).toMatch(/sin y/i)
      expect(blob).not.toMatch(/≈/)
      pack.forEach((p) => {
        expect(p.tierLabel).toBe('隱函數微分專項')
        expect(p.explanation).toMatch(/教學/)
        expect(p.explanation).toMatch(/不是|非正式/)
        expect(p.options?.length).toBe(4)
        expect(p.correctIndex).toBe(0)
        expect(p.title).toMatch(/\//)
        expect(p.derivationSteps.length).toBeGreaterThan(0)
      })
      const concept = CALCULUS_CATALOG.find((c) => c.id === 'calc-implicit-diff')
      expect(concept?.category).toBe('derivative')
      expect(concept?.description).toMatch(/非正式考試/)
      expect(concept?.prerequisites).toContain('calc-chain-rule')
    })

    it('微積分專屬勳章庫應具備清晰的解鎖條件與 XP 獎勵', () => {
      expect(CALCULUS_BADGES.length).toBe(4)
      CALCULUS_BADGES.forEach((b) => {
        expect(b.id).toMatch(/^badge-calc-/)
        expect(b.xpReward).toBeGreaterThan(0)
      })
    })

    it('微積分概念目錄應包含 2PL IRT 參數與錯誤分類處方', () => {
      expect(CALCULUS_CATALOG.length).toBeGreaterThanOrEqual(6)
      CALCULUS_CATALOG.forEach((item) => {
        expect(typeof item.difficulty).toBe('number')
        expect(typeof item.discrimination).toBe('number')
        expect(Object.keys(item.distractorPrescriptions).length).toBeGreaterThan(0)
      })
    })

    it('catalog prerequisite ids resolve to named items (no dangling graph edges)', () => {
      const rows = catalogPrerequisiteRows()
      expect(rows.some((row) => row.prereqs.length > 0)).toBe(true)
      for (const row of rows) {
        for (const prereq of row.prereqs) {
          expect(prereq.known, `${row.id} -> ${prereq.id}`).toBe(true)
          expect(prereq.name).not.toBe(prereq.id)
        }
      }
      const uSub = rows.find((row) => row.id === 'calc-u-substitution')
      expect(uSub?.prereqs.map((p) => p.id)).toContain('calc-ftc-accumulation')
      expect(uSub?.prereqs.map((p) => p.id)).not.toContain('calc-ftc')
    })

    it('gradient intuition card rows cite 1-var catalog needles, not an exam-pass claim', () => {
      expect(GRADIENT_INTUITION_SHEET.map((row) => row.id)).toEqual([
        'partial',
        'vector',
        'directional',
        'steepest',
      ])
      GRADIENT_INTUITION_SHEET.forEach((row) => {
        const blob = catalogItemText(row.catalogId)
        expect(blob, row.id).toContain(row.catalogNeedle)
      })
    })
  })
})
