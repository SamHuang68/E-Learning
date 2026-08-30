/**
 * 數學抽象圖示解題預設資料庫 (Diagram Presets)
 * 涵蓋國小天平與長條圖、國中代數拼圖、高中二維矩陣空間變換、微積分黎曼和與幾何無字證明。
 */

export type BalanceEquationPreset = {
  id: string
  title: string
  equationLatex: string
  leftX: number
  leftConst: number
  rightX: number
  rightConst: number
  targetX: number
  hint: string
}

export type BarModelPreset = {
  id: string
  title: string
  category: '和差問題' | '倍數問題' | '基準量與比較量'
  story: string
  personA: { name: string; baseAmount: number; extraAmount: number; color: string }
  personB: { name: string; baseAmount: number; extraAmount: number; color: string }
  totalSum: number
  difference: number
  solutionSteps: Array<{
    stepNumber: number
    explanation: string
    formulaLatex: string
  }>
}

export type AlgebraTilePreset = {
  id: string
  title: string
  expressionLatex: string
  factoredLatex: string
  a: number // 系數 x^2
  b: number // 系數 x
  c: number // 常數
  dimX: number // 分解後邊長1 (x + p) 的 p
  dimY: number // 分解後邊長2 (x + q) 的 q
  explanation: string
}

export type MatrixTransformPreset = {
  id: string
  title: string
  description: string
  matrix: [[number, number], [number, number]] // [[a, b], [c, d]]
  det: number
  category: '旋轉' | '縮放' | '剪切 (Shear)' | '反射'
}

export type RiemannPreset = {
  id: string
  title: string
  functionName: string
  fnExpr: string // for evaluate e.g. "x^2"
  fnLatex: string
  rangeA: number
  rangeB: number
  exactIntegral: number
  explanation: string
}

export type GeometricProofPreset = {
  id: string
  title: string
  theoremName: string
  theoremLatex: string
  coreConcept: string
  interactiveGoal: string
  proofExplanation: string
}

// 1. 天平平衡方程式預設
export const BALANCE_PRESETS: BalanceEquationPreset[] = [
  {
    id: 'bal-1',
    title: '入門：單邊含未知數 (x + 5 = 12)',
    equationLatex: 'x + 5 = 12',
    leftX: 1,
    leftConst: 5,
    rightX: 0,
    rightConst: 12,
    targetX: 7,
    hint: '兩盤同時拿掉 5 顆砝碼，左盤就只剩下 1 個箱子 x！',
  },
  {
    id: 'bal-2',
    title: '進階：倍數與常數 (2x + 3 = 11)',
    equationLatex: '2x + 3 = 11',
    leftX: 2,
    leftConst: 3,
    rightX: 0,
    rightConst: 11,
    targetX: 4,
    hint: '先兩盤同時減去 3，得到 2x = 8；再兩盤同時除以 2，得到 x = 4。',
  },
  {
    id: 'bal-3',
    title: '挑戰：兩邊皆有未知數 (3x + 2 = x + 10)',
    equationLatex: '3x + 2 = x + 10',
    leftX: 3,
    leftConst: 2,
    rightX: 1,
    rightConst: 10,
    targetX: 4,
    hint: '先兩盤各拿掉 1 個 x，化簡為 2x + 2 = 10，再減 2 並除以 2。',
  },
]

// 2. 新加坡長條模型應用題
export const BAR_MODEL_PRESETS: BarModelPreset[] = [
  {
    id: 'bar-sum-diff',
    title: '和差問題：小明與小華的彈珠',
    category: '和差問題',
    story: '小明和小華共有 44 顆彈珠，小明比小華多 12 顆。請問小華和小明各有多少顆？',
    personA: { name: '小明', baseAmount: 16, extraAmount: 12, color: '#3b82f6' },
    personB: { name: '小華', baseAmount: 16, extraAmount: 0, color: '#10b981' },
    totalSum: 44,
    difference: 12,
    solutionSteps: [
      {
        stepNumber: 1,
        explanation: '從總數 44 扣掉小明多出來的 12 顆，剩下的就是「兩段一樣長的小華基準量」。',
        formulaLatex: '44 - 12 = 32',
      },
      {
        stepNumber: 2,
        explanation: '將 32 平分給 2 段，算出小華的數量。',
        formulaLatex: '32 \\div 2 = 16 \\text{ (小華)}',
      },
      {
        stepNumber: 3,
        explanation: '小華的數量加上多出的 12 顆，就是小明的數量。',
        formulaLatex: '16 + 12 = 28 \\text{ (小明)}',
      },
    ],
  },
  {
    id: 'bar-multiple',
    title: '倍數問題：爸爸與兒子的年齡',
    category: '倍數問題',
    story: '爸爸今年的年齡是兒子的 3 倍，兩人的年齡相差 26 歲。請問兒子和爸爸今年幾歲？',
    personA: { name: '爸爸 (3份)', baseAmount: 13, extraAmount: 26, color: '#6366f1' },
    personB: { name: '兒子 (1份)', baseAmount: 13, extraAmount: 0, color: '#f59e0b' },
    totalSum: 52,
    difference: 26,
    solutionSteps: [
      {
        stepNumber: 1,
        explanation: '爸爸是 3 份，兒子是 1 份，相差 $3 - 1 = 2$ 份。',
        formulaLatex: '3 - 1 = 2 \\text{ (份數差)}',
      },
      {
        stepNumber: 2,
        explanation: '年齡差 26 歲對應 2 份，算出 1 份（兒子的年齡）。',
        formulaLatex: '26 \\div 2 = 13 \\text{ 歲 (兒子)}',
      },
      {
        stepNumber: 3,
        explanation: '兒子的年齡乘 3，得出爸爸年齡。',
        formulaLatex: '13 \\times 3 = 39 \\text{ 歲 (爸爸)}',
      },
    ],
  },
]

// 3. 代數面積拼圖 (Algebra Tiles)
export const ALGEBRA_TILE_PRESETS: AlgebraTilePreset[] = [
  {
    id: 'tile-1',
    title: '完全平方公式 (x + 2)²',
    expressionLatex: 'x^2 + 4x + 4',
    factoredLatex: '(x + 2)^2',
    a: 1,
    b: 4,
    c: 4,
    dimX: 2,
    dimY: 2,
    explanation: '一個面積 $x^2$ 的大正方形，加上 4 個面積 $x$ 的長條，以及 4 個面積 1 的小積木，恰好拼成邊長 $(x+2)$ 的大正方形！',
  },
  {
    id: 'tile-2',
    title: '十字交乘法 (x + 2)(x + 3)',
    expressionLatex: 'x^2 + 5x + 6',
    factoredLatex: '(x + 2)(x + 3)',
    a: 1,
    b: 5,
    c: 6,
    dimX: 2,
    dimY: 3,
    explanation: '1 個 $x^2$ 放在左上角，5 個 $x$ 分拆為 2 個放橫排、3 個放豎排，右下角剛好填滿 $2 \\times 3 = 6$ 個單位積木！',
  },
  {
    id: 'tile-3',
    title: '因式分解 (x + 1)(x + 4)',
    expressionLatex: 'x^2 + 5x + 4',
    factoredLatex: '(x + 1)(x + 4)',
    a: 1,
    b: 5,
    c: 4,
    dimX: 1,
    dimY: 4,
    explanation: '長方形長為 $(x+4)$，寬為 $(x+1)$，面積展開剛好等於 $x^2 + 5x + 4$。',
  },
]

// 4. 二維矩陣空間線性變換預設
export const MATRIX_PRESETS: MatrixTransformPreset[] = [
  {
    id: 'mat-shear',
    title: '水平剪切變換 (Horizontal Shear)',
    description: '保持 y 軸高度不變，依 y 坐標水平推移 x，面積縮放比 det(A) = 1。',
    matrix: [
      [1, 1],
      [0, 1],
    ],
    det: 1,
    category: '剪切 (Shear)',
  },
  {
    id: 'mat-scale',
    title: '非均勻縮放變換 (Scale 2x, 1.5y)',
    description: 'x 軸放大 2 倍，y 軸放大 1.5 倍，總面積放大 det(A) = 3 倍。',
    matrix: [
      [2, 0],
      [0, 1.5],
    ],
    det: 3,
    category: '縮放',
  },
  {
    id: 'mat-rot-45',
    title: '逆時針旋轉 45° (Rotation 45°)',
    description: '保持幾何形狀與長度不變，逆時針旋轉 45 度，det(A) = 1。',
    matrix: [
      [0.707, -0.707],
      [0.707, 0.707],
    ],
    det: 1,
    category: '旋轉',
  },
  {
    id: 'mat-reflect-y',
    title: 'Y 軸鏡像翻轉 (Reflection)',
    description: 'x 坐標變號，平面空間被翻轉（手性改變），det(A) = -1。',
    matrix: [
      [-1, 0],
      [0, 1],
    ],
    det: -1,
    category: '反射',
  },
]

// 5. 黎曼和與切片微積分預設
export const RIEMANN_PRESETS: RiemannPreset[] = [
  {
    id: 'riemann-parabola',
    title: '拋物線下方定積分：f(x) = x²',
    functionName: '二次多項式',
    fnExpr: 'x*x',
    fnLatex: 'f(x) = x^2',
    rangeA: 0,
    rangeB: 3,
    exactIntegral: 9, // [x^3/3]_0^3 = 9
    explanation: '阿基米德經典問題：拖動切片數 $N$，觀察矩形階梯和如何逐步收斂至精確值 9。',
  },
  {
    id: 'riemann-linear',
    title: '線性梯形定積分：f(x) = 2x + 1',
    functionName: '一次直線',
    fnExpr: '2*x + 1',
    fnLatex: 'f(x) = 2x + 1',
    rangeA: 0,
    rangeB: 4,
    exactIntegral: 20, // [x^2 + x]_0^4 = 16 + 4 = 20
    explanation: '幾何梯形面積 $(上底+下底)\\times 高 \\div 2 = (1+9)\\times 4 \\div 2 = 20$。',
  },
]

// 6. 幾何無字證明
export const PROOF_PRESETS: GeometricProofPreset[] = [
  {
    id: 'proof-am-gm',
    title: '算幾不等式半圓無字證明',
    theoremName: '算術平均數 ≥ 幾何平均數 (AM-GM Inequality)',
    theoremLatex: '\\frac{a+b}{2} \\ge \\sqrt{ab}',
    coreConcept: '直徑為 a+b 的半圓中，半徑長度為 (a+b)/2，而垂直於直徑交圓周的垂線段長為 sqrt(ab)。',
    interactiveGoal: '拖曳直徑上的分界點，觀察直角三角形垂線永遠不會超過圓的半徑，唯有當 a = b 時兩線重合（等號成立）！',
    proofExplanation: '根據圓冪定理/母子相似性質，垂線長 $h = \\sqrt{ab}$。由於半徑 $R = \\frac{a+b}{2}$ 是圓內最長的垂直距離，故 $\\frac{a+b}{2} \\ge \\sqrt{ab}$ 恆成立。',
  },
  {
    id: 'proof-inscribed-angle',
    title: '圓周角定理動態證明',
    theoremName: '同弧所對圓周角等於圓心角的一半',
    theoremLatex: '\\angle APB = \\frac{1}{2} \\angle AOB',
    coreConcept: '無論圓周上的頂點 P 在優弧上如何自由滑動，其角度值永遠恆定且為圓心角的一半。',
    interactiveGoal: '拖曳圓周上的頂點 P，觀察三角形外角定理的雙等腰三角形結構，體會角度守恆之美。',
    proofExplanation: '連接 PO 並延長，利用等腰三角形 $\\triangle APO$ 與 $\\triangle BPO$ 的底角相等，由外角定理可得圓心角等於兩底角和之兩倍，故 $\\angle APB = \\frac{1}{2}\\angle AOB$。',
  },
]
