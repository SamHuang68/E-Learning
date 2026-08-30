/**
 * 高精度自適應辛普森數值積分器 (Adaptive Simpson Integrator)
 * 支援複合辛普森 1/3 法則、複合梯形法則與自動曲率細分
 */

export type MathEvaluator = (x: number) => number

/**
 * 複合梯形法則 (Composite Trapezoidal Rule)
 */
export function compositeTrapezoidal(f: MathEvaluator, a: number, b: number, n: number): number {
  if (n <= 0) return 0
  const h = (b - a) / n
  let sum = 0.5 * (f(a) + f(b))
  for (let i = 1; i < n; i++) {
    sum += f(a + i * h)
  }
  return sum * h
}

/**
 * 複合辛普森 1/3 法則 (Composite Simpson's Rule)
 */
export function compositeSimpson(f: MathEvaluator, a: number, b: number, n: number): number {
  if (n <= 0) return 0
  if (n % 2 !== 0) n += 1 // 必須為偶數分割區間
  const h = (b - a) / n
  let sum = f(a) + f(b)

  for (let i = 1; i < n; i++) {
    const x = a + i * h
    sum += i % 2 === 0 ? 2 * f(x) : 4 * f(x)
  }
  return (h / 3) * sum
}

/**
 * 自適應辛普森積分法 (Adaptive Simpson's Method)
 * 依據曲線局部曲率自動動態調整細分深度
 */
export function adaptiveSimpson(
  f: MathEvaluator,
  a: number,
  b: number,
  tol = 1e-7,
  maxDepth = 15,
): { value: number; evaluations: number } {
  let count = 0
  const evalFn = (x: number) => {
    count++
    return f(x)
  }

  function simpsonStep(a: number, b: number, fa: number, fb: number, fc: number): number {
    return ((b - a) / 6) * (fa + 4 * fc + fb)
  }

  function recursiveAux(
    a: number,
    b: number,
    eps: number,
    s: number,
    fa: number,
    fb: number,
    fc: number,
    depth: number,
  ): number {
    const c = (a + b) / 2
    const d = (a + c) / 2
    const e = (c + b) / 2
    const fd = evalFn(d)
    const fe = evalFn(e)
    const sl = simpsonStep(a, c, fa, fc, fd)
    const sr = simpsonStep(c, b, fc, fb, fe)
    const s2 = sl + sr
    const delta = s2 - s

    if (depth <= 0 || Math.abs(delta) <= 15 * eps) {
      return s2 + delta / 15
    }
    return (
      recursiveAux(a, c, eps / 2, sl, fa, fc, fd, depth - 1) +
      recursiveAux(c, b, eps / 2, sr, fc, fb, fe, depth - 1)
    )
  }

  const c = (a + b) / 2
  const fa = evalFn(a)
  const fb = evalFn(b)
  const fc = evalFn(c)
  const initialS = simpsonStep(a, b, fa, fb, fc)
  const value = recursiveAux(a, b, tol, initialS, fa, fb, fc, maxDepth)

  return { value, evaluations: count }
}
