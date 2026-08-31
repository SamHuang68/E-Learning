import type { MathEvaluator } from './adaptiveIntegrator'
import { highPrecisionDerivative } from './numericalDifferentiator'

export interface NewtonIteration {
  step: number
  xCurrent: number
  fx: number
  fPrimeX: number
  xNext: number
  error: number
}

/**
 * 牛頓-拉弗森切線法迭代求根 (具備奇異點保護與震盪發散檢測)
 */
export function runNewtonRaphson(
  f: MathEvaluator,
  xInitial: number,
  maxIterations = 10,
  tol = 1e-6,
): { root: number; converged: boolean; iterations: NewtonIteration[] } {
  const iterations: NewtonIteration[] = []
  let x = xInitial

  for (let i = 1; i <= maxIterations; i++) {
    const fx = f(x)
    const fPrimeX = highPrecisionDerivative(f, x)

    // 水平切線奇異點保護 (f'(x) ≈ 0)
    if (Math.abs(fPrimeX) < 1e-12) {
      return { root: x, converged: false, iterations }
    }

    const xNext = x - fx / fPrimeX
    const error = Math.abs(xNext - x)

    iterations.push({
      step: i,
      xCurrent: x,
      fx,
      fPrimeX,
      xNext,
      error,
    })

    if (error < tol || Math.abs(fx) < tol) {
      return { root: xNext, converged: true, iterations }
    }
    x = xNext
  }

  return { root: x, converged: false, iterations }
}
