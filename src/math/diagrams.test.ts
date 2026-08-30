import { describe, it, expect } from 'vitest'
import {
  BALANCE_PRESETS,
  BAR_MODEL_PRESETS,
  ALGEBRA_TILE_PRESETS,
  MATRIX_PRESETS,
  RIEMANN_PRESETS,
  PROOF_PRESETS,
} from './data/diagramPresets'

describe('Math Visual Diagrammatic Solvers & Presets', () => {
  describe('Balance Scale Presets', () => {
    it('should have valid balance equations with solvable positive targets', () => {
      expect(BALANCE_PRESETS.length).toBeGreaterThanOrEqual(3)
      BALANCE_PRESETS.forEach((p) => {
        expect(p.id).toBeTruthy()
        expect(p.equationLatex).toBeTruthy()
        // 驗證代入 targetX 是否左右平衡：leftX * targetX + leftConst == rightX * targetX + rightConst
        const leftTotal = p.leftX * p.targetX + p.leftConst
        const rightTotal = p.rightX * p.targetX + p.rightConst
        expect(leftTotal).toBe(rightTotal)
      })
    })
  })

  describe('Bar Model Presets', () => {
    it('should have consistent sum and difference in word problems', () => {
      expect(BAR_MODEL_PRESETS.length).toBeGreaterThanOrEqual(2)
      BAR_MODEL_PRESETS.forEach((p) => {
        expect(p.story).toBeTruthy()
        expect(p.solutionSteps.length).toBeGreaterThanOrEqual(2)
        // 驗證 personA + personB 總和
        const total = p.personA.baseAmount + p.personA.extraAmount + p.personB.baseAmount + p.personB.extraAmount
        expect(total).toBe(p.totalSum)
      })
    })
  })

  describe('Algebra Tiles Presets', () => {
    it('should have correct factorization dimensions matching expansion', () => {
      expect(ALGEBRA_TILE_PRESETS.length).toBeGreaterThanOrEqual(3)
      ALGEBRA_TILE_PRESETS.forEach((p) => {
        // (x + dimX)(x + dimY) = x^2 + (dimX + dimY)x + (dimX * dimY)
        expect(p.dimX + p.dimY).toBe(p.b)
        expect(p.dimX * p.dimY).toBe(p.c)
      })
    })
  })

  describe('Matrix Transformation Presets', () => {
    it('should calculate determinant correctly for 2x2 matrices', () => {
      expect(MATRIX_PRESETS.length).toBeGreaterThanOrEqual(4)
      MATRIX_PRESETS.forEach((p) => {
        const [[a, b], [c, d]] = p.matrix
        const calcDet = Number((a * d - b * c).toFixed(3))
        expect(calcDet).toBeCloseTo(p.det, 2)
      })
    })
  })

  describe('Riemann Sum Presets', () => {
    it('should have valid integration ranges and exact analytical values', () => {
      expect(RIEMANN_PRESETS.length).toBeGreaterThanOrEqual(2)
      RIEMANN_PRESETS.forEach((p) => {
        expect(p.rangeB).toBeGreaterThan(p.rangeA)
        expect(p.exactIntegral).toBeGreaterThan(0)
      })
    })
  })

  describe('Geometric Proof Presets', () => {
    it('should have proof explanations and theorem LaTeX', () => {
      expect(PROOF_PRESETS.length).toBeGreaterThanOrEqual(2)
      PROOF_PRESETS.forEach((p) => {
        expect(p.theoremLatex).toBeTruthy()
        expect(p.proofExplanation).toBeTruthy()
      })
    })
  })
})
