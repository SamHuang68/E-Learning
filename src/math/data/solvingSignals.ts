/**
 * 臺灣 108 課綱數學 · 3 秒破題訊號庫 (Problem-Solving Signals)
 * 借鏡 English Chunker「看見動作訊號 ➜ 3 秒直覺決策」理念：
 * 幫助學生在看到題目關鍵特徵時，第一時間秒射連結出對應公式與破題第一步。
 */

export type MathSolvingSignal = {
  id: string
  stage: 'elementary' | 'junior' | 'senior'
  gradeBand: string // e.g. "國中八年級"
  topic: string
  problemSignal: string // 題目出現的關鍵特徵／訊號
  threeSecondRule: string // 3 秒直覺破題法
  firstStepFormula: string // 破題第一步算式 / LaTeX
  exampleProblem: {
    question: string
    quickSolve: string
  }
}

export const MATH_SOLVING_SIGNALS: MathSolvingSignal[] = [
  // 國小階段
  {
    id: 'sig-lcm',
    stage: 'elementary',
    gradeBand: '國小高年級',
    topic: '數與量 · 公倍數',
    problemSignal: '題目出現「同時發車／同時響鈴／分裝剛好整除，求下一次再次同時」',
    threeSecondRule: '【最小公倍數】看到「循環再次重合」直接求兩數的最小公倍數 [a, b]。',
    firstStepFormula: '\\text{LCM}[a, b] = \\frac{a \\times b}{\\text{GCD}(a, b)}',
    exampleProblem: {
      question: '公車 A 每 12 分鐘發一班，公車 B 每 18 分鐘發一班，早上 8:00 同時發車，幾分鐘後再次同時發車？',
      quickSolve: '看到「再次同時」，直覺求 $[12, 18] = 36$ 分鐘。',
    },
  },
  {
    id: 'sig-circle-area',
    stage: 'elementary',
    gradeBand: '國小高年級',
    topic: '空間與幾何 · 圓面積',
    problemSignal: '題目給定「半徑 $r$」或「直徑 $d$」，求圓形或扇形佔地面積',
    threeSecondRule: '【半徑平方乘圓周率】若是直徑要先除以 2 換半徑！',
    firstStepFormula: 'A = \\pi r^2 \\quad (\\pi \\approx 3.14)',
    exampleProblem: {
      question: '直徑 20 公分的披薩面積為何？',
      quickSolve: '直徑 20 ➜ 半徑 10 ➜ $3.14 \\times 10^2 = 314\\text{ cm}^2$。',
    },
  },

  // 國中階段
  {
    id: 'sig-pythagoras',
    stage: 'junior',
    gradeBand: '國中八年級',
    topic: '幾何 · 畢氏定理',
    problemSignal: '題目出現「直角三角形」或「長方形對角線」，已知兩邊長求第三邊',
    threeSecondRule: '【兩股平方和等於斜邊平方】先確認求的是斜邊（加法）還是股（減法）。',
    firstStepFormula: 'a^2 + b^2 = c^2 \\iff c = \\sqrt{a^2 + b^2}',
    exampleProblem: {
      question: '直角三角形兩股為 5 與 12，求斜邊？',
      quickSolve: '直覺聯想直角三邊比 5:12:13，或算 $\\sqrt{25+144} = 13$。',
    },
  },
  {
    id: 'sig-quad-vertex',
    stage: 'junior',
    gradeBand: '國中九年級',
    topic: '函數 · 二次函數極值',
    problemSignal: '題目給定二次式 $y = ax^2 + bx + c$，求「最大值」或「最小值」',
    threeSecondRule: '【配方法找頂點】$a > 0$ 有最小值，$a < 0$ 有最大值，極值就發生在頂點 $(h, k)$！',
    firstStepFormula: 'y = a(x - h)^2 + k \\implies x = h \\text{ 時有極值 } k',
    exampleProblem: {
      question: '二次函數 $y = -(x - 3)^2 + 8$ 的極值為何？',
      quickSolve: '開口向下 ($a=-1$)，頂點 $(3, 8)$，所以在 $x=3$ 時有最大值 8。',
    },
  },
  {
    id: 'sig-similar-area',
    stage: 'junior',
    gradeBand: '國中九年級',
    topic: '幾何 · 相似形面積比',
    problemSignal: '題目已知兩圖形相似 $\\triangle ABC \\sim \\triangle DEF$，給邊長比求面積比',
    threeSecondRule: '【面積比等於邊長平方比】周長比是一次方，面積比是二次方！',
    firstStepFormula: '\\frac{\\text{Area}_1}{\\text{Area}_2} = \\left(\\frac{s_1}{s_2}\\right)^2',
    exampleProblem: {
      question: '兩相似三角形邊長比 2 : 3，小三角形面積 20，大三角形面積？',
      quickSolve: '邊長比 2:3 ➜ 面積比 $4:9$ ➜ $20 \\times \\frac{9}{4} = 45$。',
    },
  },

  // 高中階段
  {
    id: 'sig-am-gm',
    stage: 'senior',
    gradeBand: '高中十年級',
    topic: '代數 · 算幾不等式',
    problemSignal: '題目給定正數條件 $a > 0, b > 0$ 且兩數「乘積為定值求和的最小值」或「和為定值求積的最大值」',
    threeSecondRule: '【算幾不等式】算術平均數 $\\ge$ 幾何平均數，等號成立於兩項相等！',
    firstStepFormula: '\\frac{a + b}{2} \\ge \\sqrt{ab} \\iff a + b \\ge 2\\sqrt{ab}',
    exampleProblem: {
      question: '設 $x > 0$，求 $x + \\frac{9}{x}$ 的最小值？',
      quickSolve: '$\\frac{x + 9/x}{2} \\ge \\sqrt{x \\cdot \\frac{9}{x}} = 3 \\implies x + 9/x \\ge 6$。',
    },
  },
  {
    id: 'sig-remainder-thm',
    stage: 'senior',
    gradeBand: '高中十年級',
    topic: '多項式 · 餘式定理',
    problemSignal: '題目要求多項式 $f(x)$ 除以一次式 $(x - c)$ 的「餘式」',
    threeSecondRule: '【令除式為零代入】不用直式長除法！直接把 $x = c$ 代入 $f(x)$ 算值！',
    firstStepFormula: 'r = f(c)',
    exampleProblem: {
      question: '$f(x) = x^4 - 3x + 5$ 除以 $x - 2$ 的餘式？',
      quickSolve: '直接代入 $x=2$ 得 $f(2) = 16 - 6 + 5 = 15$。',
    },
  },
  {
    id: 'sig-law-of-cosines',
    stage: 'senior',
    gradeBand: '高中十一年級',
    topic: '幾何 · 餘弦定理',
    problemSignal: '題目已知三角形「兩邊長與夾角 (SAS)」求第三邊，或「三邊長 (SSS)」求內角 $\\cos C$',
    threeSecondRule: '【餘弦定理】畢氏定理的推廣版，記得扣掉 $2ab\\cos C$！',
    firstStepFormula: 'c^2 = a^2 + b^2 - 2ab\\cos C \\iff \\cos C = \\frac{a^2 + b^2 - c^2}{2ab}',
    exampleProblem: {
      question: '三角形 $a=5, b=8, \\angle C=60^\\circ$，求邊長 $c$？',
      quickSolve: '$c^2 = 25 + 64 - 2(5)(8)(0.5) = 49 \\implies c = 7$。',
    },
  },
  {
    id: 'sig-tangent-slope',
    stage: 'senior',
    gradeBand: '高中十二年級',
    topic: '微積分 · 切線斜率',
    problemSignal: '題目給定曲線方程式 $y = f(x)$，要求通過點 $(x_0, y_0)$ 處的「切線斜率」或「切線方程式」',
    threeSecondRule: '【微分求導函數】切線斜率就是一階導數 $m = f\'(x_0)$！',
    firstStepFormula: 'm = f\'(x_0) \\implies y - y_0 = f\'(x_0)(x - x_0)',
    exampleProblem: {
      question: '曲線 $f(x) = x^3 - 3x$ 在 $x=2$ 處的切線斜率？',
      quickSolve: '$f\'(x) = 3x^2 - 3 \\implies f\'(2) = 12 - 3 = 9$。',
    },
  },
]
