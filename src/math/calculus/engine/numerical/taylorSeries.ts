import type { MathEvaluator } from './adaptiveIntegrator'
import { highPrecisionDerivative, highPrecisionSecondDerivative } from './numericalDifferentiator'

/**
 * 階乘計算
 */
export function factorial(n: number): number {
  if (n <= 1) return 1
  let res = 1
  for (let i = 2; i <= n; i++) res *= i
  return res
}

/**
 * 泰勒級數多項式求值 (支援最高 10 階)
 */
export function evaluateTaylorPolynomial(
  f: MathEvaluator,
  x0: number,
  order: number,
  x: number,
): number {
  if (order < 0) return 0

  // 0 階
  let sum = f(x0)
  if (order === 0) return sum

  // 1 階
  const d1 = highPrecisionDerivative(f, x0)
  const dx = x - x0
  sum += d1 * dx
  if (order === 1) return sum

  // 2 階
  const d2 = highPrecisionSecondDerivative(f, x0)
  sum += (d2 / 2) * Math.pow(dx, 2)
  if (order === 2) return sum

  // 3~8 階以高精度差分近似
  const h = 1e-2
  for (let k = 3; k <= Math.min(order, 8); k++) {
    // 數值 k 階導數近似
    const dk = numericalKthDerivative(f, x0, k, h)
    sum += (dk / factorial(k)) * Math.pow(dx, k)
  }

  return sum
}

function numericalKthDerivative(f: MathEvaluator, x: number, k: number, h: number): number {
  if (k === 1) return highPrecisionDerivative(f, x, h)
  if (k === 2) return highPrecisionSecondDerivative(f, x, h)
  return (numericalKthDerivative(f, x + h, k - 1, h) - numericalKthDerivative(f, x - h, k - 1, h)) / (2 * h)
}
