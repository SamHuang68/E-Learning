import type { MathSolvingSignal } from '../math/data/solvingSignals'
import type { UiLocale } from './locale'
import { mathTeachingCopy } from './mathTeachingCopy'

const EN: Record<string, [string, string, string, string, string]> = {
  "sig-lcm": [
    "Number and quantity · LCM and recurring events",
    "Look for recurring departures, flashing lights, or meetings; find the next simultaneous event.",
    "Use the least common multiple of the two periods.",
    "Bus A departs every 12 minutes and bus B every 18 minutes. Both leave at 8:00. When do they next leave together?",
    "LCM(12, 18) = 36 minutes, so the next departure together is at 8:36."
  ],
  "sig-gcd": [
    "Number and quantity · GCD and equal grouping",
    "Look for the largest equal square tiles or the greatest number of equal groups with no remainder.",
    "Use the greatest common divisor of the dimensions or quantities.",
    "Cut a 36 cm by 24 cm rectangle into equal squares of the greatest possible area. What is their side length?",
    "GCD(36, 24) = 12 cm. The rectangle makes (36/12) × (24/12) = 6 squares."
  ],
  "sig-circle-area": [
    "Geometry · Circle area and circumference",
    "Given diameter d or radius r, find the area or circumference.",
    "Halve the diameter for the radius. Area = πr²; circumference = 2πr.",
    "Find the area and circumference of a circular clock face with a diameter of 20 cm.",
    "r = 10 cm; area = 3.14 × 100 = 314 cm²; circumference = 2 × 3.14 × 10 = 62.8 cm."
  ],
  "sig-speed-distance": [
    "Number and quantity · Catch-up and meeting",
    "Look for two people chasing from the same starting point or moving toward each other from two points.",
    "Add speeds when approaching; subtract speeds when chasing. Divide the distance or lead by the relative speed.",
    "A walks at 80 m/min and B at 60 m/min. B has a 100 m lead when A starts. How long until A catches B?",
    "t = 100 / (80 - 60) = 5 minutes."
  ],
  "sig-fraction-div": [
    "Number and quantity · Divide by a fraction",
    "Look for a fraction divided by a fraction, or a whole inferred from a fractional part.",
    "Multiply by the reciprocal of the divisor. Simplify before multiplying.",
    "A bottle contains 4/5 liter of juice. Each cup holds 2/15 liter. How many cups can be filled?",
    "(4/5) ÷ (2/15) = (4/5) × (15/2) = 6 cups."
  ],
  "sig-ratio-proportion": [
    "Algebra and ratio · Proportions",
    "Given a : b = c : d, solve for the unknown x.",
    "Cross-multiply: a × d = b × c.",
    "A map scale is 3 : 500. What real length does 12 cm on the map represent?",
    "3 : 500 = 12 : x; 3x = 6000; x = 2000 cm = 20 m."
  ],
  "sig-pythagoras": [
    "Geometry · Pythagorean theorem and side ratios",
    "Look for a right triangle or rectangle diagonal with two side lengths known.",
    "Use addition to find the hypotenuse and subtraction to find a leg; remember triples such as 3:4:5 and 5:12:13.",
    "A right triangle has legs 5 and 12. Find its hypotenuse and area.",
    "The 5:12:13 triple gives hypotenuse 13; area = 5 × 12 / 2 = 30."
  ],
  "sig-quad-vertex": [
    "Functions · Quadratic vertex and extrema",
    "Given y = ax² + bx + c, find a maximum or minimum.",
    "Complete the square or use the axis. If a > 0 there is a minimum; if a < 0 there is a maximum.",
    "Find the maximum of y = -2x² + 8x + 1 and the x-value where it occurs.",
    "The axis is x = -8 / (2 × -2) = 2. Substitution gives the maximum y = 9."
  ],
  "sig-similar-area": [
    "Geometry · Similar figures and area ratios",
    "Two figures are similar and a side ratio is given; find an area or volume ratio.",
    "Length uses the first power, area the second, and volume the third.",
    "Similar triangles have side ratio 2:3. The smaller area is 20. Find the larger area.",
    "The area ratio is 2²:3² = 4:9, so the larger area is 20 × 9/4 = 45."
  ],
  "sig-quad-roots": [
    "Algebra · Quadratic discriminant and formula",
    "A quadratic is described as having distinct roots, a repeated root, or no real roots.",
    "Use D = b² - 4ac: D > 0 gives two roots, D = 0 a repeated root, and D < 0 no real roots.",
    "If x² - 6x + k = 0 has a repeated root, find k.",
    "Set D = 36 - 4k = 0, so k = 9."
  ],
  "sig-arithmetic-series": [
    "Algebra · Arithmetic sequences and series",
    "Given the first term, common difference, last term, or term count, find a term or partial sum.",
    "The nth term adds n - 1 differences; the sum is the average of first and last times n.",
    "An arithmetic sequence has a₁ = 3 and d = 4. Find S₁₀.",
    "a₁₀ = 3 + 9 × 4 = 39, so S₁₀ = 10(3 + 39)/2 = 210."
  ],
  "sig-circle-angles": [
    "Geometry · Central and inscribed angles",
    "A central angle and an inscribed angle subtend the same arc, or an inscribed angle subtends a diameter.",
    "An inscribed angle is half the central angle over the same arc; an angle subtending a diameter is 90°.",
    "A central angle subtending arc AB is 80°. Find the inscribed angle APB over the same arc.",
    "The inscribed angle is half the central angle: 80° / 2 = 40°."
  ],
  "sig-am-gm": [
    "Algebra · AM-GM extrema",
    "Positive quantities have a fixed product and the sum is minimized, or a fixed sum and the product is maximized.",
    "Arithmetic mean is at least the geometric mean, with equality when the terms are equal.",
    "For x > 0, find the minimum of x + 9/x and where it occurs.",
    "AM-GM gives x + 9/x ≥ 6, with equality when x = 9/x, so x = 3."
  ],
  "sig-remainder-thm": [
    "Polynomials · Remainder and factor theorems",
    "Find the remainder after division by ax - b, or decide whether x - c is a factor.",
    "Set the divisor to zero and substitute the resulting x-value into f(x).",
    "Find the remainder when f(x) = x⁴ - 3x² + 5x - 7 is divided by x - 2.",
    "Substitute x = 2: f(2) = 16 - 12 + 10 - 7 = 7."
  ],
  "sig-law-of-cosines": [
    "Trigonometry · Cosine law",
    "Two sides and the included angle are known, or all three sides are known and an angle is required.",
    "Use c² = a² + b² - 2ab cos C, the generalized Pythagorean relation.",
    "A triangle has a = 5, b = 8, and C = 60°. Find c.",
    "c² = 25 + 64 - 80(0.5) = 49, so c = 7."
  ],
  "sig-law-of-sines": [
    "Trigonometry · Sine law and circumradius",
    "Two angles and a side are known, or a circumradius R appears.",
    "A side divided by the sine of its opposite angle equals the circumdiameter 2R.",
    "A triangle has A = 30° and opposite side a = 6. Find R.",
    "6 / sin 30° = 12 = 2R, so R = 6."
  ],
  "sig-cauchy-schwarz": [
    "Vectors and algebra · Cauchy-Schwarz extrema",
    "A sum of squares is fixed and a linear expression must be maximized or minimized.",
    "The product of squared norms is at least the square of the dot product, with equality for proportional vectors.",
    "Given x² + y² = 5, find the maximum of 2x + y.",
    "(2² + 1²)(x² + y²) ≥ (2x + y)² gives 25 ≥ (2x + y)², so the maximum is 5."
  ],
  "sig-log-change-base": [
    "Exponentials and logarithms · Change of base",
    "Logarithms have different bases or the unknown appears in a base.",
    "Rewrite all logarithms with one base; products can then cancel numerator and denominator factors.",
    "Simplify log₂3 × log₃5 × log₅8.",
    "Change of base telescopes to log₂8 = 3."
  ],
  "sig-tangent-slope": [
    "Calculus · Derivative and tangent line",
    "A curve y = f(x) is given and a tangent slope or tangent equation at (x₀, y₀) is requested.",
    "The tangent slope is m = f′(x₀); then use point-slope form.",
    "Find the tangent line to f(x) = x³ - 3x + 2 at (2, 4).",
    "f′(x) = 3x² - 3, so m = 9 and y - 4 = 9(x - 2), or y = 9x - 14."
  ],
  "sig-bayes-prob": [
    "Probability · Conditional probability and Bayes theorem",
    "Given an observed result, find the probability that it came from a particular cause.",
    "The denominator is total probability; the numerator is the target branch probability.",
    "Machine A makes 60% of output with 2% defects; B makes 40% with 3% defects. Given a defect, what is the probability it came from A?",
    "Total defect probability is 0.6(0.02) + 0.4(0.03) = 0.024; P(A | defect) = 0.012 / 0.024 = 50%."
  ],
  "sig-factor-diff-squares": [
    "Algebra · Factoring a difference of squares",
    "The expression has the form a² - b².",
    "Factor directly as a² - b² = (a - b)(a + b).",
    "Factor x² - 9.",
    "x² - 3² = (x - 3)(x + 3)."
  ],
  "sig-factor-perfect-square": [
    "Algebra · Factoring a perfect-square trinomial",
    "The expression has the form a² ± 2ab + b².",
    "Use a² ± 2ab + b² = (a ± b)².",
    "Factor x² + 6x + 9.",
    "x² + 2·3x + 3² = (x + 3)²."
  ],
  "sig-factor-grouping": [
    "Algebra · Factoring by grouping",
    "A four-term polynomial can be grouped in pairs with a shared binomial factor.",
    "Factor each pair, then factor the shared binomial.",
    "Factor x³ + x² + 2x + 2.",
    "x²(x + 1) + 2(x + 1) = (x² + 2)(x + 1)."
  ],
  "sig-factor-sum-cubes": [
    "Algebra · Factoring a sum of cubes",
    "The expression has the form a³ + b³.",
    "Use a³ + b³ = (a + b)(a² - ab + b²).",
    "Factor x³ + 8.",
    "x³ + 2³ = (x + 2)(x² - 2x + 4)."
  ],
  "sig-factor-diff-cubes": [
    "Algebra · Factoring a difference of cubes",
    "The expression has the form a³ - b³.",
    "Use a³ - b³ = (a - b)(a² + ab + b²).",
    "Factor x³ - 27.",
    "x³ - 3³ = (x - 3)(x² + 3x + 9)."
  ],
  "sig-factor-quadratic": [
    "Algebra · Factoring a quadratic trinomial",
    "Factor ax² + bx + c.",
    "Find factor pairs whose product matches ac and whose sum matches b.",
    "Factor 2x² + 7x + 6.",
    "Since 2 × 6 = 12 and 3 + 4 = 7, the factorization is (2x + 3)(x + 2)."
  ],
  "sig-factor-rational-root": [
    "Algebra · Rational root theorem",
    "A higher-degree polynomial needs candidate rational roots for trial division.",
    "Candidates are ±p/q, where p divides the constant term and q divides the leading coefficient.",
    "Factor x³ - 6x² + 11x - 6.",
    "Test 1, 2, 3, 6. Since f(1) = 0, divide by x - 1 to obtain (x - 1)(x - 2)(x - 3)."
  ],
  "sig-factor-common-monomial": [
    "Algebra · Extracting a common monomial factor",
    "Every term has an evident common factor.",
    "Extract the greatest common factor, then factor what remains if possible.",
    "Factor 6x³ + 9x² - 3x.",
    "The GCF is 3x, giving 3x(2x² + 3x - 1)."
  ],
  "sig-factor-trinomial-group": [
    "Algebra · Splitting the middle term",
    "A trinomial can be rewritten as four terms and grouped.",
    "Split bx into two terms, group the pairs, and factor the common binomial.",
    "Factor x² + 5x + 6.",
    "x² + 2x + 3x + 6 = x(x + 2) + 3(x + 2) = (x + 3)(x + 2)."
  ],
  "sig-factor-synthetic": [
    "Algebra · Synthetic division",
    "Divide a polynomial by x - c and determine whether it divides evenly.",
    "Use c in synthetic division; a zero remainder means x - c is a factor.",
    "Is x³ - 3x² - 4x + 12 divisible by x - 2?",
    "Synthetic division by 2 gives quotient x² - x - 6 and remainder 0, so it factors as (x - 2)(x² - x - 6)."
  ]
}

const FORMULA_EN: Record<string, string> = {
  "sig-gcd": "s = \\text{GCD}(a, b), \\quad \\text{tiles} = \\frac{a}{s} \\times \\frac{b}{s}",
  "sig-speed-distance": "t_{\\text{meeting}} = \\frac{\\text{distance}}{v_1 + v_2}, \\quad t_{\\text{catch}} = \\frac{\\text{lead}}{v_{\\text{fast}} - v_{\\text{slow}}}",
  "sig-quad-vertex": "y = a\\left(x + \\frac{b}{2a}\\right)^2 + \\frac{4ac - b^2}{4a} \\implies x = -\\frac{b}{2a} \\text{ at the extremum}",
  "sig-circle-angles": "\\angle \\text{inscribed} = \\frac{1}{2} \\angle \\text{central} = \\frac{1}{2} \\widehat{AB}, \\quad \\text{angle in a semicircle} = 90^\\circ",
  "sig-am-gm": "\\frac{a + b}{2} \\ge \\sqrt{ab} \\iff a + b \\ge 2\\sqrt{ab} \\quad (\\text{equality when } a=b)",
  "sig-cauchy-schwarz": "(a_1^2 + a_2^2)(b_1^2 + b_2^2) \\ge (a_1 b_1 + a_2 b_2)^2 \\quad (\\text{equality for proportional vectors})",
  "sig-bayes-prob": "P(A_i \\mid B) = \\frac{P(A_i)P(B \\mid A_i)}{\\sum_k P(A_k)P(B \\mid A_k)}",
  "sig-factor-quadratic": "ax^2 + bx + c = (px + q)(rx + s), \\quad pr=a, \\ qs=c, \\ ps+qr=b",
  "sig-factor-rational-root": "\\text{candidate rational root} = \\pm \\frac{\\text{factor of the constant term}}{\\text{factor of the leading coefficient}}",
  "sig-factor-common-monomial": "\\text{GCF} \\times (\\text{remaining polynomial})",
  "sig-factor-synthetic": "\\text{synthetic division: } c \\mid a\\ b\\ c\\ d \\longrightarrow \\text{quotient and remainder}"
}

export function localizeMathSignal(item: MathSolvingSignal, locale: UiLocale): MathSolvingSignal {
  const copy = EN[item.id]
  if (locale !== 'en') return item
  if (!copy) throw new Error(`Missing English math signal: ${item.id}`)
  const firstStepFormula = FORMULA_EN[item.id] ?? item.firstStepFormula
  if (/[\u3400-\u9fff\uf900-\ufaff]/u.test(firstStepFormula)) {
    throw new Error(`English math signal formula still contains Han characters: ${item.id}`)
  }
  return { ...item, gradeBand: mathTeachingCopy(locale, item.gradeBand), topic: copy[0], problemSignal: copy[1], threeSecondRule: copy[2], firstStepFormula, exampleProblem: { question: copy[3], quickSolve: copy[4] } }
}
