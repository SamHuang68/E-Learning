import type { MathEvaluator } from './adaptiveIntegrator'

/**
 * 五點高精度中心差分法 O(h^4) 計算一階導數
 */
export function highPrecisionDerivative(f: MathEvaluator, x: number, h = 1e-4): number {
  return (-f(x + 2 * h) + 8 * f(x + h) - 8 * f(x - h) + f(x - 2 * h)) / (12 * h)
}

/**
 * 五點中心差分法 O(h^4) 計算二階導數（凹凸性與反曲點）
 */
export function highPrecisionSecondDerivative(f: MathEvaluator, x: number, h = 1e-3): number {
  return (-f(x + 2 * h) + 16 * f(x + h) - 30 * f(x) + 16 * f(x - h) - f(x - 2 * h)) / (12 * h * h)
}

/**
 * 割線平均變化率 (Secant Average Rate of Change)
 */
export function secantAverageRate(f: MathEvaluator, x0: number, deltaX: number): number {
  if (Math.abs(deltaX) < 1e-12) return highPrecisionDerivative(f, x0)
  return (f(x0 + deltaX) - f(x0)) / deltaX
}
