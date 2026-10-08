import type { CalculusProblem } from '../types'

export type CalculusProblemDisplayCopy = Pick<
  CalculusProblem,
  'title' | 'tierLabel' | 'questionText' | 'options' | 'explanation'
>

/** Exact learner-facing English copy for every reachable adaptive-practice item. */
export const CALCULUS_PROBLEM_ENGLISH: Readonly<Record<string, CalculusProblemDisplayCopy>> = {
  'calc-prob-l1-tangent': {
    title: 'Observe How a Parabola’s Tangent Slope Changes',
    tierLabel: 'Concept Exploration',
    questionText: 'For the parabola f(x) = x^2 - 2x + 2, move the point of tangency x0 to 1.0 and observe the tangent slope m.',
    options: ['m = 0 (horizontal tangent at the vertex)', 'm = 2', 'm = -2', 'm = 1'],
    explanation: 'At x = 1, f\'(1) = 2(1) - 2 = 0. The tangent is horizontal there, corresponding to the parabola’s lowest point, a local minimum.',
  },
  'calc-prob-l2-riemann': {
    title: 'Approximate a Definite Integral with Riemann Sums',
    tierLabel: 'Two-Way Derivation',
    questionText: 'Find the definite-integral area of f(x) = x^2 over [0, 3]. Set the midpoint Riemann-sum partition count N to at least 20 and observe the value it approaches.',
    options: ['9.00', '4.50', '27.00', '6.00'],
    explanation: 'By the Fundamental Theorem of Calculus, ∫_0^3 x^2 dx = [(1/3)x^3]_0^3 = (1/3)(27) - 0 = 9.0.',
  },
  'calc-prob-l3-box-opt': {
    title: 'Maximize the Volume of an Open-Top Box',
    tierLabel: 'Applied Modeling',
    questionText: 'A square sheet of cardboard has side length 12 cm. Squares of side x are cut from its corners and the sheet is folded into an open-top box with volume V(x) = x(12 - 2x)^2. At what value of x is the volume greatest?',
    options: ['x = 2 cm (maximum volume 128 cm³)', 'x = 3 cm', 'x = 1.5 cm', 'x = 4 cm'],
    explanation: 'Expand V(x) = 4x^3 - 48x^2 + 144x. Then V\'(x) = 12x^2 - 96x + 144 = 12(x-2)(x-6) = 0. In the physically valid range 0 < x < 6, x = 2 gives the maximum volume V(2) = 2(8)^2 = 128 cm³.',
  },
  'calc-prob-l4-newton': {
    title: 'Newton–Raphson Root Finding and Divergence Safeguards',
    tierLabel: 'Counterexample Reasoning',
    questionText: 'The equation f(x) = x^3 - 2x - 5 = 0 has a real solution. Starting from x0 = 2.0, how many tangent iterations are needed for convergence?',
    options: ['Converges to x ≈ 2.094551 within 3 steps', 'More than 10 steps', 'Diverges with no solution', 'The tangents oscillate'],
    explanation: 'At x0 = 2.0, f(2) = -1 and f\'(2) = 10, so x1 = 2 - (-1)/10 = 2.1. Only 3 iterations are needed to reach six decimal places: x ≈ 2.094551.',
  },
  'calc-prob-l5-prod1': {
    title: 'Product Rule: Differentiate x·sin(x)',
    tierLabel: 'Product-Rule Practice',
    questionText: 'Use the product rule to find the derivative of f(x) = x · sin(x).',
    options: ['sin(x) + x·cos(x)', 'cos(x) - x·sin(x)', 'x·cos(x)', 'sin(x)'],
    explanation: 'The product rule is (uv)\' = u\'v + uv\'. With u=x and v=sin(x), the derivative is 1·sin(x) + x·cos(x) = sin(x) + x cos(x).',
  },
  'calc-prob-l5-prod2': {
    title: 'Product Rule: Differentiate x·e^x',
    tierLabel: 'Product-Rule Practice',
    questionText: 'Find the derivative of f(x) = x · e^x.',
    options: ['e^x + x·e^x', 'e^x - x·e^x', 'x·e^x', 'e^x'],
    explanation: 'With u=x and v=e^x, u\'=1 and v\'=e^x. Therefore f\'(x) = e^x + x e^x = e^x(1+x).',
  },
  'calc-prob-l5-prod3': {
    title: 'Product Rule: Differentiate sin(x)·cos(x)',
    tierLabel: 'Product-Rule Practice',
    questionText: 'Find the derivative of f(x) = sin(x) · cos(x).',
    options: ['cos²(x) - sin²(x)', 'cos(x) - sin(x)', '2 sin(x) cos(x)', '0'],
    explanation: 'Let u=sin(x) and v=cos(x). Then f\'(x) = cos(x)·cos(x) + sin(x)·(-sin(x)) = cos²(x) - sin²(x) = cos(2x).',
  },
  'calc-prob-l5-prod4': {
    title: 'Product Rule: Differentiate x²·ln(x)',
    tierLabel: 'Product-Rule Practice',
    questionText: 'Find the derivative of f(x) = x² · ln(x).',
    options: ['2x ln(x) + x', '2x ln(x) - x', 'x² / x', '2x / x'],
    explanation: 'For u=x² and v=ln(x), u\'=2x and v\'=1/x. Thus f\'(x) = 2x ln(x) + x²(1/x) = 2x ln(x) + x.',
  },
  'calc-prob-l5-prod5': {
    title: 'Product Rule: Differentiate e^x·sin(x)',
    tierLabel: 'Product-Rule Practice',
    questionText: 'Find the derivative of f(x) = e^x · sin(x).',
    options: ['e^x (sin(x) + cos(x))', 'e^x (sin(x) - cos(x))', 'e^x sin(x)', 'cos(x)'],
    explanation: 'For u=e^x and v=sin(x), u\'=e^x and v\'=cos(x). Thus f\'(x) = e^x sin(x) + e^x cos(x) = e^x(sin(x)+cos(x)).',
  },
  'calc-prob-sub1': {
    title: 'u-Substitution: ∫ 2x cos(x²) dx',
    tierLabel: 'Two-Way Derivation',
    questionText: 'Use u = x² to evaluate ∫ 2x cos(x²) dx.',
    options: ['sin(x²) + C', 'cos(x²) + C', '2x sin(x²) + C', '-sin(x²) + C'],
    explanation: 'Let u = x², so du = 2x dx. Then ∫ cos(u) du = sin(u) = sin(x²) + C.',
  },
  'calc-prob-sub2': {
    title: 'u-Substitution: ∫ x/(x²+1) dx',
    tierLabel: 'Two-Way Derivation',
    questionText: 'Use u = x² + 1 to evaluate the indefinite integral.',
    options: ['(1/2) ln|x²+1| + C', 'ln|x²+1| + C', '1/(x²+1) + C', 'arctan(x) + C'],
    explanation: 'Let u = x²+1, so du=2x dx. Then (1/2)∫du/u = (1/2)ln|u| + C.',
  },
  'calc-prob-sub3': {
    title: 'u-Substitution: ∫ e^{sin x} cos x dx',
    tierLabel: 'Applied Modeling',
    questionText: 'Use u = sin x to evaluate ∫ e^{sin x} cos x dx.',
    options: ['e^{sin x} + C', 'e^{cos x} + C', 'sin x * e^{sin x} + C', 'cos x + C'],
    explanation: 'Let u=sin x, so du=cos x dx. Then ∫e^u du = e^u = e^{sin x} + C.',
  },
  'calc-prob-sub4': {
    title: 'u-Substitution: ∫ 3x²/(x³+2) dx',
    tierLabel: 'Two-Way Derivation',
    questionText: 'Use u = x³ + 2 to simplify this rational-function integral.',
    options: ['ln|x³+2| + C', 'ln|x³+2|/3 + C', '1/(x³+2) + C', 'arctan(x³+2) + C'],
    explanation: 'Let u=x³+2, so du=3x² dx. Then ∫du/u = ln|u| + C.',
  },
  'calc-prob-sub5': {
    title: 'u-Substitution: ∫ sec²(x)/(1+tan x) dx',
    tierLabel: 'Applied Modeling',
    questionText: 'Use u = tan x + 1 to evaluate this trigonometric integral.',
    options: ['ln|1+tan x| + C', 'tan x + C', 'sec x + C', 'ln|sec x| + C'],
    explanation: 'Let u=1+tan x, so du=sec²x dx. Then ∫du/u = ln|u| + C.',
  },
  'calc-prob-series1': {
    title: 'Term Test: Σ n/(n+1)',
    tierLabel: 'Series-Convergence Practice',
    questionText: 'Determine whether Σ_{n=1}^∞ n/(n+1) converges or diverges. This is a teaching exercise, not an official exam result.',
    options: ['Diverges: the terms approach 1, not 0', 'Converges to 1', 'Converges conditionally', 'The terms approach 0, so it converges'],
    explanation: 'Because lim n/(n+1) = 1 ≠ 0, the term test proves divergence. Terms approaching 0 is necessary but not sufficient for convergence. This teaching exercise does not guarantee an exam result.',
  },
  'calc-prob-series2': {
    title: 'Geometric Series: Σ (1/3)^n',
    tierLabel: 'Series-Convergence Practice',
    questionText: 'Determine whether the geometric series Σ_{n=0}^∞ (1/3)^n converges.',
    options: ['Converges because |r| = 1/3 < 1', 'Diverges because it has infinitely many terms', 'The ratio test gives L = 1, so it is inconclusive', 'Its terms do not approach 0'],
    explanation: 'A geometric series Σr^n converges when |r| < 1. Here r = 1/3. This is a teaching classification, not an exam-pass guarantee.',
  },
  'calc-prob-series3': {
    title: 'p-Series: Σ 1/n^2',
    tierLabel: 'Series-Convergence Practice',
    questionText: 'Determine whether the p-series Σ_{n=1}^∞ 1/n^2 converges or diverges.',
    options: ['Converges because p = 2 > 1', 'Diverges as a harmonic series', 'Converges conditionally', 'The ratio test gives L = 1 at p = 2, so it is inconclusive'],
    explanation: 'The p-series Σ1/n^p converges for p > 1 and diverges for p ≤ 1. Here p = 2. This teaching exercise does not guarantee an exam result.',
  },
  'calc-prob-series4': {
    title: 'Ratio Test: Σ n/2^n',
    tierLabel: 'Series-Convergence Practice',
    questionText: 'Use the ratio test to determine whether Σ_{n=1}^∞ n/2^n converges.',
    options: ['Converges: L = 1/2 < 1', 'Diverges: L > 1', 'Inconclusive: L = 1', 'The terms do not approach 0'],
    explanation: '|a_{n+1}/a_n| = ((n+1)/n)·(1/2) → 1/2 < 1, so the ratio test proves absolute convergence. The test is inconclusive when L = 1. This teaching exercise does not guarantee an exam result.',
  },
  'calc-prob-series5': {
    title: 'Integral Test: Σ 1/n^3',
    tierLabel: 'Series-Convergence Practice',
    questionText: 'Use the integral test to determine whether Σ_{n=1}^∞ 1/n^3 converges.',
    options: ['Converges: ∫_1^∞ x^{-3} dx is finite', 'Diverges: the integral is infinite', 'The ratio is L = 1, so it is inconclusive', 'Only the root test can be used'],
    explanation: 'The function f(x)=x^{-3} is positive, continuous, and decreasing. Because ∫_1^∞x^{-3}dx = 1/2 is finite, the series converges. This teaching exercise does not guarantee an exam result.',
  },
  'calc-prob-series6': {
    title: 'Alternating Series: Σ (-1)^{n+1}/n',
    tierLabel: 'Series-Convergence Practice',
    questionText: 'Classify the convergence of the alternating harmonic series Σ_{n=1}^∞ (-1)^{n+1}/n.',
    options: ['Conditional convergence: the Leibniz test holds but the absolute series diverges', 'Absolute convergence', 'Divergence', 'The ratio is L = 1 and the terms do not approach 0'],
    explanation: 'Because b_n=1/n decreases to 0, the Leibniz test proves convergence. Since Σ1/n diverges, the convergence is conditional. This teaching exercise does not guarantee an exam result.',
  },
  'calc-prob-implicit1': {
    title: 'Circle: Find y\' at (3,4) from x^2 + y^2 = 25',
    tierLabel: 'Implicit-Differentiation Practice',
    questionText: 'Starting with x^2 + y^2 = 25, find y\' at (3, 4). This is a teaching exercise, not an official exam result.',
    options: ['y\' = -3/4', 'y\' = 3/4 (incorrectly treating y as a constant)', 'y\' = -4/3', 'y\' = 0 because the circle’s tangent is horizontal'],
    explanation: 'Differentiate both sides with respect to x: 2x + 2y y\' = 0, so y\' = -x/y. At (3,4), this is -3/4. Treating y as a constant would give 2x=0, which is not implicit differentiation. This teaching exercise does not guarantee an exam result.',
  },
  'calc-prob-implicit2': {
    title: 'Product: Find y\' from xy = 6',
    tierLabel: 'Implicit-Differentiation Practice',
    questionText: 'Starting with xy = 6, find y\'. Remember to apply the product rule to xy.',
    options: ['y\' = -y/x', 'y\' = 0 (incorrectly treating y as a constant)', 'y\' = 6', 'y\' = y/x'],
    explanation: '(xy)\' = y + x y\' = 0, so y\' = -y/x. This is equivalent to differentiating the explicit function y=6/x. This teaching exercise does not guarantee an exam result.',
  },
  'calc-prob-implicit3': {
    title: 'Parabola: Find y\' from y^2 = 4x',
    tierLabel: 'Implicit-Differentiation Practice',
    questionText: 'Starting with y^2 = 4x, find y\' by implicit differentiation without taking the square root first.',
    options: ['y\' = 2/y', 'y\' = 2y', 'y\' = 4', 'y\' = 1/(2y) (the factor 4 on the right was omitted)'],
    explanation: 'Because 2y y\' = 4, y\' = 2/y for y ≠ 0. Taking a square root creates upper and lower branches, while implicit differentiation handles both at once. This teaching exercise does not guarantee an exam result.',
  },
  'calc-prob-implicit4': {
    title: 'Trigonometric Relation: Find y\' from sin y = x',
    tierLabel: 'Implicit-Differentiation Practice',
    questionText: 'Starting with sin y = x, find y\'.',
    options: ['y\' = 1/cos y (cos y ≠ 0)', 'y\' = cos y', 'y\' = 1/sin y', 'y\' = -sin y'],
    explanation: 'Because cos y · y\' = 1, y\' = 1/cos y, equivalently sec y. This is the implicit-function form of the arcsine derivative 1/sqrt(1-x^2). This teaching exercise does not guarantee an exam result.',
  },
  'calc-prob-implicit5': {
    title: 'Mixed Terms: Find y\' at (1,1) from x^2 + xy + y^2 = 3',
    tierLabel: 'Implicit-Differentiation Practice',
    questionText: 'Starting with x^2 + xy + y^2 = 3, find y\' at (1, 1).',
    options: ['y\' = -1', 'y\' = 1', 'y\' = 0 (after incorrectly treating y as constant)', 'y\' = -2'],
    explanation: 'Differentiate to get 2x + (y + x y\') + 2y y\' = 0. At (1,1), 2 + 1 + y\' + 2y\' = 0, so 3 + 3y\' = 0 and y\' = -1. Omitting the product rule or treating y as constant gives the wrong answer. This teaching exercise does not guarantee an exam result.',
  },
}

export function localizeCalculusProblem(problem: CalculusProblem): CalculusProblem {
  const display = CALCULUS_PROBLEM_ENGLISH[problem.id]
  if (!display) throw new Error(`Missing exact English calculus problem copy: ${problem.id}`)
  return { ...problem, ...display }
}
