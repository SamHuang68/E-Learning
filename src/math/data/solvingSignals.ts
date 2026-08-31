/**
 * 臺灣 108 課綱數學 · 3 秒破題訊號庫 (Problem-Solving Signals)
 * 借鏡 English Chunker「看見動作訊號 ➜ 3 秒直覺決策」理念：
 * 幫助學生在看到題目關鍵特徵時，第一時間秒射連結出對應公式與破題第一步。
 */

export type MathStage = 'elementary' | 'junior' | 'senior'

export type MathSolvingSignal = {
  id: string
  stage: MathStage
  gradeBand: string // e.g. "國小高年級" | "國中八年級" | "高中十一年級"
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
  // ===================== 國小階段 (Elementary) =====================
  {
    id: 'sig-lcm',
    stage: 'elementary',
    gradeBand: '國小五年級',
    topic: '數與量 · 最小公倍數與週期重合',
    problemSignal: '題目出現「同時發車／同時亮燈／每隔若干天再次相遇，求下一次同時」',
    threeSecondRule: '【最小公倍數】看到「週期循環再次重合」直接求兩數的最小公倍數 [a, b]！',
    firstStepFormula: '\\text{LCM}[a, b] = \\frac{a \\times b}{\\text{GCD}(a, b)}',
    exampleProblem: {
      question: '公車 A 每 12 分鐘發一班，公車 B 每 18 分鐘發一班，早上 8:00 同時發車，幾分鐘後再次同時發車？',
      quickSolve: '看到「再次同時」，直覺求 $[12, 18] = 36$ 分鐘，即 8:36 再次同時發車。',
    },
  },
  {
    id: 'sig-gcd',
    stage: 'elementary',
    gradeBand: '國小五年級',
    topic: '數與量 · 最大公因數與分裝分組',
    problemSignal: '題目出現「剪成大小相同且最大的正方形／將物品平分給最多人且不剩」',
    threeSecondRule: '【最大公因數】看到「切分最大／平分最多」直接求長寬或數量的最大公因數 (a, b)！',
    firstStepFormula: 's = \\text{GCD}(a, b), \\quad \\text{總塊數} = \\frac{a}{s} \\times \\frac{b}{s}',
    exampleProblem: {
      question: '一張長 36 公分、寬 24 公分的長方形紙，要剪成大小相同且面積最大的正方形，邊長最大幾公分？',
      quickSolve: '直覺求最大公因數 $(36, 24) = 12$ 公分，可剪出 $(36/12) \\times (24/12) = 6$ 個正方形。',
    },
  },
  {
    id: 'sig-circle-area',
    stage: 'elementary',
    gradeBand: '國小六年級',
    topic: '空間與幾何 · 圓面積與周長',
    problemSignal: '題目給定圓的「直徑 $d$」或「半徑 $r$」，求圓形面積或圓周長',
    threeSecondRule: '【直徑除以 2 換半徑，半徑平方乘圓周率】面積為 $\\pi r^2$，周長為 $2\\pi r$！',
    firstStepFormula: 'r = \\frac{d}{2} \\implies A = \\pi r^2, \\quad C = 2\\pi r \\quad (\\pi \\approx 3.14)',
    exampleProblem: {
      question: '直徑 20 公分的圓形時鐘表面，其面積與周長各為何？',
      quickSolve: '直徑 $20 \\implies r = 10$。面積 $= 3.14 \\times 10^2 = 314\\text{ cm}^2$；周長 $= 2 \\times 3.14 \\times 10 = 62.8\\text{ cm}$。',
    },
  },
  {
    id: 'sig-speed-distance',
    stage: 'elementary',
    gradeBand: '國小六年級',
    topic: '數與量 · 速率追趕與相遇問題',
    problemSignal: '題目出現「甲乙兩人同地出發後追趕（追及）」或「兩地同時相向而行（相遇）」',
    threeSecondRule: '【相遇速度相加，追趕速度相減】時間等於路徑差（或總距離）除以相對速度！',
    firstStepFormula: 't_{\\text{相遇}} = \\frac{\\text{總距離}}{v_1 + v_2}, \\quad t_{\\text{追趕}} = \\frac{\\text{領先距離}}{v_{\\text{快}} - v_{\\text{慢}}}',
    exampleProblem: {
      question: '甲每分走 80m，乙每分走 60m。乙先走 100m 後甲開始追，甲幾分鐘後追上乙？',
      quickSolve: '追趕問題速度相減：$t = \\frac{100}{80 - 60} = \\frac{100}{20} = 5$ 分鐘。',
    },
  },
  {
    id: 'sig-fraction-div',
    stage: 'elementary',
    gradeBand: '國小六年級',
    topic: '數與量 · 分數除法倒數相乘',
    problemSignal: '題目出現「分數除以分數」或「已知部分量求全部基準量」',
    threeSecondRule: '【除以一個分數等於乘以它的倒數】分子分母顛倒乘，能約分先約分！',
    firstStepFormula: '\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{a \\times d}{b \\times c}',
    exampleProblem: {
      question: '一瓶果汁有 $\\frac{4}{5}$ 公升，每 $\\frac{2}{15}$ 公升裝一杯，可裝幾杯？',
      quickSolve: '$\\frac{4}{5} \\div \\frac{2}{15} = \\frac{4}{5} \\times \\frac{15}{2} = 2 \\times 3 = 6$ 杯。',
    },
  },
  {
    id: 'sig-ratio-proportion',
    stage: 'elementary',
    gradeBand: '國小六年級',
    topic: '代數與比 · 正反比與外項乘積',
    problemSignal: '題目給定比例式 $a : b = c : d$，要求解未知數 $x$',
    threeSecondRule: '【內項相乘等於外項相乘】比值相等，內乘內等於外乘外直接解 $x$！',
    firstStepFormula: 'a : b = c : d \\iff a \\times d = b \\times c',
    exampleProblem: {
      question: '若地圖比例尺為 $3 : 500$，圖上 $12\\text{ cm}$ 代表實際長度多少？',
      quickSolve: '$3 : 500 = 12 : x \\implies 3x = 500 \\times 12 \\implies x = 2000\\text{ cm} = 20\\text{ m}$。',
    },
  },

  // ===================== 國中階段 (Junior) =====================
  {
    id: 'sig-pythagoras',
    stage: 'junior',
    gradeBand: '國中八年級',
    topic: '幾何 · 畢氏定理與邊長比',
    problemSignal: '題目出現「直角三角形」或「長方形對角線」，已知兩邊長求第三邊',
    threeSecondRule: '【兩股平方和等於斜邊平方】先確認求斜邊（加法）還是股（減法），牢記常用數組 3:4:5、5:12:13！',
    firstStepFormula: 'a^2 + b^2 = c^2 \\iff c = \\sqrt{a^2 + b^2}, \\quad a = \\sqrt{c^2 - b^2}',
    exampleProblem: {
      question: '直角三角形兩股為 5 與 12，求斜邊與面積？',
      quickSolve: '直覺反射 5:12:13 特殊邊長比，斜邊 $c = 13$；面積 $= \\frac{5 \\times 12}{2} = 30$。',
    },
  },
  {
    id: 'sig-quad-vertex',
    stage: 'junior',
    gradeBand: '國中九年級',
    topic: '函數 · 二次函數配方與極值',
    problemSignal: '題目給定二次式 $y = ax^2 + bx + c$，求「最大值」或「最小值」',
    threeSecondRule: '【配方法找頂點】$a > 0$ 開口向上有最小值，$a < 0$ 開口向下有最大值，極值在頂點 $(h, k)$！',
    firstStepFormula: 'y = a\\left(x + \\frac{b}{2a}\\right)^2 + \\frac{4ac - b^2}{4a} \\implies x = -\\frac{b}{2a} \\text{ 時有極值}',
    exampleProblem: {
      question: '二次函數 $y = -2x^2 + 8x + 1$ 的最大值為何？在 $x$ 為何時發生？',
      quickSolve: '$a=-2 < 0$，對稱軸 $x = -\\frac{8}{2(-2)} = 2$，代入得最大值 $y = -2(4) + 16 + 1 = 9$。',
    },
  },
  {
    id: 'sig-similar-area',
    stage: 'junior',
    gradeBand: '國中九年級',
    topic: '幾何 · 相似形周長比與面積比',
    problemSignal: '題目已知兩圖形相似 $\\triangle ABC \\sim \\triangle DEF$，給邊長比求面積比或體積比',
    threeSecondRule: '【長度比 1 次方、面積比 2 次方、體積比 3 次方】面積比等於邊長平方比！',
    firstStepFormula: '\\frac{\\text{Area}_1}{\\text{Area}_2} = \\left(\\frac{s_1}{s_2}\\right)^2, \\quad \\frac{\\text{Vol}_1}{\\text{Vol}_2} = \\left(\\frac{s_1}{s_2}\\right)^3',
    exampleProblem: {
      question: '兩相似三角形邊長比 2 : 3，小三角形面積為 20，大三角形面積為何？',
      quickSolve: '邊長比 2:3 ➜ 面積比 $2^2:3^2 = 4:9$ ➜ 大面積 $= 20 \\times \\frac{9}{4} = 45$。',
    },
  },
  {
    id: 'sig-quad-roots',
    stage: 'junior',
    gradeBand: '國中八年級',
    topic: '代數 · 一元二次方程式判別式與根公式',
    problemSignal: '題目出現「一元二次方程式 $ax^2+bx+c=0$ 有兩相等實根／相異實根／無解」',
    threeSecondRule: '【判別式 $D = b^2 - 4ac$】$D>0$ 兩相異實根；$D=0$ 重根；$D<0$ 無實數解！',
    firstStepFormula: 'D = b^2 - 4ac, \\quad x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    exampleProblem: {
      question: '若方程式 $x^2 - 6x + k = 0$ 有重根（兩相等實根），求 $k$ 之值？',
      quickSolve: '重根 $\\implies D = (-6)^2 - 4(1)(k) = 0 \\implies 36 - 4k = 0 \\implies k = 9$。',
    },
  },
  {
    id: 'sig-arithmetic-series',
    stage: 'junior',
    gradeBand: '國中八年級',
    topic: '代數 · 等差數列與級數求和',
    problemSignal: '題目給定等差數列首項 $a_1$、公差 $d$ 或末項 $a_n$，求第 $n$ 項或前 $n$ 項總和 $S_n$',
    threeSecondRule: '【第 n 項為首項加 (n-1) 個公差；總和為上底加下底乘高除以 2】梯形公式直觀記憶！',
    firstStepFormula: 'a_n = a_1 + (n - 1)d, \\quad S_n = \\frac{n(a_1 + a_n)}{2} = \\frac{n[2a_1 + (n - 1)d]}{2}',
    exampleProblem: {
      question: '等差數列首項 $a_1 = 3$，公差 $d = 4$，求前 10 項的總和 $S_{10}$？',
      quickSolve: '末項 $a_{10} = 3 + 9 \\times 4 = 39$ ➜ $S_{10} = \\frac{10(3 + 39)}{2} = 10 \\times 21 = 210$。',
    },
  },
  {
    id: 'sig-circle-angles',
    stage: 'junior',
    gradeBand: '國中九年級',
    topic: '幾何 · 圓心角與圓周角關係',
    problemSignal: '題目給定同弧所對的「圓心角」與「圓周角」，或直徑所對的圓周角',
    threeSecondRule: '【同弧所對圓周角等於圓心角的一半；直徑所對圓周角必為 90 度】',
    firstStepFormula: '\\angle \\text{周角} = \\frac{1}{2} \\angle \\text{心角} = \\frac{1}{2} \\widehat{AB}, \\quad \\text{半圓圓周角} = 90^\\circ',
    exampleProblem: {
      question: '圓 $O$ 上同弧 $AB$ 所對圓心角為 $80^\\circ$，則同弧所對圓周角 $\\angle APB$ 為幾度？',
      quickSolve: '圓周角為圓心角一半：$\\angle APB = \\frac{1}{2} \\times 80^\\circ = 40^\\circ$。',
    },
  },

  // ===================== 高中階段 (Senior) =====================
  {
    id: 'sig-am-gm',
    stage: 'senior',
    gradeBand: '高中十年級',
    topic: '代數 · 算幾不等式求極值',
    problemSignal: '題目給定正數條件 $a > 0, b > 0$ 且「乘積為定值求和之最小值」或「和為定值求積之最大值」',
    threeSecondRule: '【算幾不等式】算術平均數 $\\ge$ 幾何平均數，等號成立條件為項與項相等 ($a = b$)！',
    firstStepFormula: '\\frac{a + b}{2} \\ge \\sqrt{ab} \\iff a + b \\ge 2\\sqrt{ab} \\quad (a=b \\text{ 等號成立})',
    exampleProblem: {
      question: '設 $x > 0$，求 $x + \\frac{9}{x}$ 的最小值及發生時的 $x$ 值？',
      quickSolve: '$\\frac{x + 9/x}{2} \\ge \\sqrt{x \\cdot \\frac{9}{x}} = 3 \\implies x + \\frac{9}{x} \\ge 6$；當 $x = \\frac{9}{x} \\implies x = 3$ 時有最小值 6。',
    },
  },
  {
    id: 'sig-remainder-thm',
    stage: 'senior',
    gradeBand: '高中十年級',
    topic: '多項式 · 餘式定理與因式定理',
    problemSignal: '題目要求多項式 $f(x)$ 除以一次式 $(ax - b)$ 的「餘式」或判斷 $(x - c)$ 是否為因式',
    threeSecondRule: '【令除式為零直接代入】不需直式長除法！令除式為 0 解出 $x = b/a$ 代入 $f(x)$ 即為餘數！',
    firstStepFormula: 'f(x) = (ax - b)Q(x) + r \\implies r = f\\left(\\frac{b}{a}\\right), \\quad f(c) = 0 \\iff (x - c) \\mid f(x)',
    exampleProblem: {
      question: '$f(x) = x^4 - 3x^2 + 5x - 7$ 除以 $x - 2$ 的餘式為何？',
      quickSolve: '直接代入 $x=2$：$r = f(2) = 2^4 - 3(2^2) + 5(2) - 7 = 16 - 12 + 10 - 7 = 7$。',
    },
  },
  {
    id: 'sig-law-of-cosines',
    stage: 'senior',
    gradeBand: '高中十一年級',
    topic: '三角函數 · 餘弦定理求邊長與角度',
    problemSignal: '題目已知三角形「兩邊一夾角 (SAS)」求第三邊，或「三邊長 (SSS)」求內角 $\\cos C$',
    threeSecondRule: '【餘弦定理】畢氏定理推廣版，第三邊平方等於兩邊平方和扣掉 $2ab\\cos C$！',
    firstStepFormula: 'c^2 = a^2 + b^2 - 2ab\\cos C \\iff \\cos C = \\frac{a^2 + b^2 - c^2}{2ab}',
    exampleProblem: {
      question: '三角形 $a=5, b=8, \\angle C=60^\\circ$，求邊長 $c$？',
      quickSolve: '$c^2 = 25 + 64 - 2(5)(8)\\cos 60^\\circ = 89 - 80(0.5) = 49 \\implies c = 7$。',
    },
  },
  {
    id: 'sig-law-of-sines',
    stage: 'senior',
    gradeBand: '高中十一年級',
    topic: '三角函數 · 正弦定理與外接圓半徑',
    problemSignal: '題目已知「兩角一邊 (AAS/ASA)」求對邊，或出現「三角形外接圓半徑 $R$」',
    threeSecondRule: '【正弦定理】邊長與對角正弦成正比，比例常數恰等於外接圓直徑 $2R$！',
    firstStepFormula: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
    exampleProblem: {
      question: '三角形 $\\angle A = 30^\\circ$，對邊 $a = 6$，求外接圓半徑 $R$？',
      quickSolve: '$\\frac{a}{\\sin A} = 2R \\implies \\frac{6}{\\sin 30^\\circ} = 2R \\implies \\frac{6}{0.5} = 12 = 2R \\implies R = 6$。',
    },
  },
  {
    id: 'sig-cauchy-schwarz',
    stage: 'senior',
    gradeBand: '高中十一年級',
    topic: '向量與代數 · 柯西不等式求極值',
    problemSignal: '題目給定平方和條件 $a^2+b^2+c^2$ 與一次和 $ax+by+cz$，求極值',
    threeSecondRule: '【平方和之積 $\\ge$ 內積平方】$(a^2+b^2)(x^2+y^2) \\ge (ax+by)^2$，等號成立於成比例！',
    firstStepFormula: '(a_1^2 + a_2^2)(b_1^2 + b_2^2) \\ge (a_1 b_1 + a_2 b_2)^2 \\quad \\left(\\frac{a_1}{b_1} = \\frac{a_2}{b_2} \\text{ 等號}\\right)',
    exampleProblem: {
      question: '設 $x^2 + y^2 = 5$，求 $2x + y$ 的最大值？',
      quickSolve: '$(2^2 + 1^2)(x^2 + y^2) \\ge (2x + y)^2 \\implies 5 \\times 5 \\ge (2x+y)^2 \\implies -5 \\le 2x+y \\le 5$。最大值為 5。',
    },
  },
  {
    id: 'sig-log-change-base',
    stage: 'senior',
    gradeBand: '高中十年級',
    topic: '指數對數 · 對數換底公式與性質',
    problemSignal: '題目中對數底數不同（如 $\\log_2 3 \\times \\log_3 4$）或未知數在底數位置',
    threeSecondRule: '【換底公式】分子分母換成同底數（如以 10 為底或自然對數），連乘時分子分母可對角約分！',
    firstStepFormula: '\\log_a b = \\frac{\\log_c b}{\\log_c a} = \\frac{\\ln b}{\\ln a}, \\quad \\log_a b \\cdot \\log_b c = \\log_a c',
    exampleProblem: {
      question: '化簡 $\\log_2 3 \\times \\log_3 5 \\times \\log_5 8$ 之值？',
      quickSolve: '連乘換底約分：$\\frac{\\log 3}{\\log 2} \\times \\frac{\\log 5}{\\log 3} \\times \\frac{\\log 8}{\\log 5} = \\frac{\\log 8}{\\log 2} = \\log_2 8 = 3$。',
    },
  },
  {
    id: 'sig-tangent-slope',
    stage: 'senior',
    gradeBand: '高中十二年級',
    topic: '微積分 · 一階導數與切線方程式',
    problemSignal: '題目給定曲線方程式 $y = f(x)$，要求通過點 $(x_0, y_0)$ 處的「切線斜率」或「切線方程式」',
    threeSecondRule: '【微分求導函數】切線斜率就是一階導數 $m = f\'(x_0)$，再用點斜式列式！',
    firstStepFormula: 'm = f\'(x_0) \\implies y - f(x_0) = f\'(x_0)(x - x_0)',
    exampleProblem: {
      question: '曲線 $f(x) = x^3 - 3x + 2$ 在點 $(2, 4)$ 處的切線方程式為何？',
      quickSolve: '$f\'(x) = 3x^2 - 3 \\implies m = f\'(2) = 3(4) - 3 = 9$。切線為 $y - 4 = 9(x - 2) \\implies y = 9x - 14$。',
    },
  },
  {
    id: 'sig-bayes-prob',
    stage: 'senior',
    gradeBand: '高中十一年級',
    topic: '機率統計 · 條件機率與貝氏定理',
    problemSignal: '題目出現「已知某結果發生下，求該結果是由某特定原因造成的機率」（執果尋因）',
    threeSecondRule: '【貝氏定理分母為全機率，分子為特定分支路徑】畫樹狀圖求各路徑機率之和！',
    firstStepFormula: 'P(A_i \\mid B) = \\frac{P(A_i)P(B \\mid A_i)}{\\sum_{k} P(A_k)P(B \\mid A_k)} = \\frac{\\text{目標分支機率}}{\\text{全機率總和}}',
    exampleProblem: {
      question: '工廠甲機產量 60% 瑕疵率 2%，乙機產量 40% 瑕疵率 3%。抽得瑕疵品來自甲機的機率？',
      quickSolve: '全瑕疵率 $= 0.6(0.02) + 0.4(0.03) = 0.012 + 0.012 = 0.024$ ➜ $P(\\text{甲}\\mid\\text{瑕}) = \\frac{0.012}{0.024} = \\frac{1}{2} = 50\\%$。',
    },
  },
]
