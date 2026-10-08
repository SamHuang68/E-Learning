import type {
  AlgebraTilePreset,
  BalanceEquationPreset,
  BarModelPreset,
  GeometricProofPreset,
  MatrixTransformPreset,
  RiemannPreset,
} from './diagramPresets'

/**
 * Exact English mirrors of the visual-math presets.
 *
 * IDs, numeric values, equations, and ordering intentionally match
 * `diagramPresets.ts`; only learner-facing prose is localized.
 */
export const BALANCE_PRESETS_EN: BalanceEquationPreset[] = [
  {
    id: 'bal-1',
    title: 'Introduction: Unknown on one side (x + 5 = 12)',
    equationLatex: 'x + 5 = 12',
    leftX: 1,
    leftConst: 5,
    rightX: 0,
    rightConst: 12,
    targetX: 7,
    hint: 'Remove 5 weights from both pans. Only the box x remains on the left pan.',
  },
  {
    id: 'bal-2',
    title: 'Intermediate: A multiple and a constant (2x + 3 = 11)',
    equationLatex: '2x + 3 = 11',
    leftX: 2,
    leftConst: 3,
    rightX: 0,
    rightConst: 11,
    targetX: 4,
    hint: 'First subtract 3 from both pans to get 2x = 8. Then divide both pans by 2 to get x = 4.',
  },
  {
    id: 'bal-3',
    title: 'Challenge: Unknowns on both sides (3x + 2 = x + 10)',
    equationLatex: '3x + 2 = x + 10',
    leftX: 3,
    leftConst: 2,
    rightX: 1,
    rightConst: 10,
    targetX: 4,
    hint: 'Remove one x from each pan to get 2x + 2 = 10. Then subtract 2 and divide by 2.',
  },
]

export const BAR_MODEL_PRESETS_EN: BarModelPreset[] = [
  {
    id: 'bar-sum-diff',
    title: 'Sum-and-difference problem: Ming and Hua\'s marbles',
    category: 'Sum and difference',
    story: 'Ming and Hua have 44 marbles altogether. Ming has 12 more marbles than Hua. How many marbles does each person have?',
    personA: { name: 'Ming', baseAmount: 16, extraAmount: 12, color: '#3b82f6' },
    personB: { name: 'Hua', baseAmount: 16, extraAmount: 0, color: '#10b981' },
    totalSum: 44,
    difference: 12,
    solutionSteps: [
      {
        stepNumber: 1,
        explanation: 'Subtract Ming\'s 12 extra marbles from the total of 44. The remainder is two equal copies of Hua\'s base amount.',
        formulaLatex: '44 - 12 = 32',
      },
      {
        stepNumber: 2,
        explanation: 'Divide 32 equally between the two bars to find Hua\'s amount.',
        formulaLatex: '32 \\div 2 = 16 \\text{ (Hua)}',
      },
      {
        stepNumber: 3,
        explanation: 'Add the extra 12 marbles to Hua\'s amount to find Ming\'s amount.',
        formulaLatex: '16 + 12 = 28 \\text{ (Ming)}',
      },
    ],
  },
  {
    id: 'bar-multiple',
    title: 'Multiplicative-comparison problem: A father and son\'s ages',
    category: 'Multiplicative comparison',
    story: 'A father is three times as old as his son. Their ages differ by 26 years. How old is each of them?',
    personA: { name: 'Father (3 parts)', baseAmount: 13, extraAmount: 26, color: '#6366f1' },
    personB: { name: 'Son (1 part)', baseAmount: 13, extraAmount: 0, color: '#f59e0b' },
    totalSum: 52,
    difference: 26,
    solutionSteps: [
      {
        stepNumber: 1,
        explanation: 'The father has 3 parts and the son has 1 part, so their difference is $3 - 1 = 2$ parts.',
        formulaLatex: '3 - 1 = 2 \\text{ (difference in parts)}',
      },
      {
        stepNumber: 2,
        explanation: 'The 26-year age difference represents 2 parts. Divide to find 1 part, the son\'s age.',
        formulaLatex: '26 \\div 2 = 13 \\text{ years (son)}',
      },
      {
        stepNumber: 3,
        explanation: 'Multiply the son\'s age by 3 to find the father\'s age.',
        formulaLatex: '13 \\times 3 = 39 \\text{ years (father)}',
      },
    ],
  },
]

export const ALGEBRA_TILE_PRESETS_EN: AlgebraTilePreset[] = [
  {
    id: 'tile-1',
    title: 'Perfect-square identity (x + 2)²',
    expressionLatex: 'x^2 + 4x + 4',
    factoredLatex: '(x + 2)^2',
    a: 1,
    b: 4,
    c: 4,
    dimX: 2,
    dimY: 2,
    explanation: 'One large square with area $x^2$, four rectangles with area $x$, and four unit tiles form a large square with side length $(x+2)$.',
  },
  {
    id: 'tile-2',
    title: 'Factoring by decomposition (x + 2)(x + 3)',
    expressionLatex: 'x^2 + 5x + 6',
    factoredLatex: '(x + 2)(x + 3)',
    a: 1,
    b: 5,
    c: 6,
    dimX: 2,
    dimY: 3,
    explanation: 'Place one $x^2$ tile in the upper left. Split the five $x$ tiles into a row of two and a column of three. The lower-right gap holds exactly $2 \\times 3 = 6$ unit tiles.',
  },
  {
    id: 'tile-3',
    title: 'Factoring (x + 1)(x + 4)',
    expressionLatex: 'x^2 + 5x + 4',
    factoredLatex: '(x + 1)(x + 4)',
    a: 1,
    b: 5,
    c: 4,
    dimX: 1,
    dimY: 4,
    explanation: 'The rectangle has length $(x+4)$ and width $(x+1)$, so its expanded area is exactly $x^2 + 5x + 4$.',
  },
]

export const MATRIX_PRESETS_EN: MatrixTransformPreset[] = [
  {
    id: 'mat-shear',
    title: 'Horizontal shear',
    description: 'Keep the vertical coordinate unchanged and shift each horizontal coordinate according to its vertical coordinate. The area scale factor is det(A) = 1.',
    matrix: [[1, 1], [0, 1]],
    det: 1,
    category: 'Shear',
  },
  {
    id: 'mat-scale',
    title: 'Nonuniform scaling (Scale 2x, 1.5y)',
    description: 'Scale the horizontal axis by 2 and the vertical axis by 1.5. The total area scale factor is det(A) = 3.',
    matrix: [[2, 0], [0, 1.5]],
    det: 3,
    category: 'Scaling',
  },
  {
    id: 'mat-rot-45',
    title: 'Counterclockwise rotation by 45°',
    description: 'Preserve shape and length while rotating counterclockwise by 45 degrees. Here det(A) = 1.',
    matrix: [[0.707, -0.707], [0.707, 0.707]],
    det: 1,
    category: 'Rotation',
  },
  {
    id: 'mat-reflect-y',
    title: 'Reflection across the vertical axis',
    description: 'Reverse the sign of each horizontal coordinate, flipping the plane and changing its orientation. Here det(A) = -1.',
    matrix: [[-1, 0], [0, 1]],
    det: -1,
    category: 'Reflection',
  },
]

export const RIEMANN_PRESETS_EN: RiemannPreset[] = [
  {
    id: 'riemann-parabola',
    title: 'Definite integral under a parabola: f(x) = x²',
    functionName: 'Quadratic polynomial',
    fnExpr: 'x*x',
    fnLatex: 'f(x) = x^2',
    rangeA: 0,
    rangeB: 3,
    exactIntegral: 9,
    explanation: 'A classic problem in the spirit of Archimedes: drag the slice count $N$ and watch the rectangular sums converge to the exact value 9.',
  },
  {
    id: 'riemann-linear',
    title: 'Definite integral of a linear function: f(x) = 2x + 1',
    functionName: 'Linear function',
    fnExpr: '2*x + 1',
    fnLatex: 'f(x) = 2x + 1',
    rangeA: 0,
    rangeB: 4,
    exactIntegral: 20,
    explanation: 'The geometric area of the trapezoid is $(\\text{top}+\\text{bottom})\\times \\text{height} \\div 2 = (1+9)\\times 4 \\div 2 = 20$.',
  },
]

export const PROOF_PRESETS_EN: GeometricProofPreset[] = [
  {
    id: 'proof-am-gm',
    title: 'Semicircle proof of the AM–GM inequality',
    theoremName: 'Arithmetic mean ≥ geometric mean (AM–GM inequality)',
    theoremLatex: '\\frac{a+b}{2} \\ge \\sqrt{ab}',
    coreConcept: 'In a semicircle with diameter a+b, the radius is (a+b)/2 and the perpendicular segment from the diameter to the arc has length sqrt(ab).',
    interactiveGoal: 'Drag the division point along the diameter. The perpendicular segment never exceeds the radius, and the two coincide only when a = b.',
    proofExplanation: 'By the intersecting-chords theorem, or equivalently by similar triangles, the perpendicular has length $h = \\sqrt{ab}$. The radius $R = \\frac{a+b}{2}$ is the greatest perpendicular distance within the semicircle, so $\\frac{a+b}{2} \\ge \\sqrt{ab}$ always holds.',
  },
  {
    id: 'proof-inscribed-angle',
    title: 'Dynamic proof of the inscribed-angle theorem',
    theoremName: 'An inscribed angle is half the central angle subtending the same arc',
    theoremLatex: '\\angle APB = \\frac{1}{2} \\angle AOB',
    coreConcept: 'As the vertex P moves freely along the major arc, the inscribed angle remains constant and equal to half the central angle.',
    interactiveGoal: 'Drag P along the circle and observe the two isosceles triangles in the exterior-angle construction, revealing the angle invariant.',
    proofExplanation: 'Join P to O and extend the segment. In the isosceles triangles $\\triangle APO$ and $\\triangle BPO$, the base angles are equal. The exterior-angle theorem shows that the central angle is twice the sum of the corresponding base angles, so $\\angle APB = \\frac{1}{2}\\angle AOB$.',
  },
]
