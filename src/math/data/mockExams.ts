import type { MathQuestion } from './curriculum'

export type MockExamType = 'elementary' | 'cap' | 'gsat'

export type MathMockExamDefinition = {
  id: string
  type: MockExamType
  title: string
  subtitle: string
  targetGrade: string
  durationMinutes: number
  totalPoints: number
  gradingScale: string
  questions: MathQuestion[]
}

/**
 * 國小學力檢測、國中教育會考 (CAP)、大學學科能力測驗 (GSAT) 模擬考題組
 */
export const MOCK_EXAMS: Record<MockExamType, MathMockExamDefinition> = {
  elementary: {
    id: 'elem-mock-1',
    type: 'elementary',
    title: '國小高年級數學學力檢測',
    subtitle: '涵蓋小學 1~6 年級重點：四則運算、分數小數、面積體積、比與圓周率',
    targetGrade: '國小 5~6 年級',
    durationMinutes: 40,
    totalPoints: 100,
    gradingScale: '百分制（精熟 85~100 / 基礎 60~84 / 待加強 0~59）',
    questions: [
      {
        id: 'elem-m-1',
        title: '大數與多位數運算',
        strand: 'number',
        type: 'choice',
        difficulty: 2,
        question: '計算 $4500 \\times 600 =$ ？',
        options: ['270000', '2700000 ($2.7\\times 10^6$)', '27000000', '27000'],
        answer: 1,
        solution: '$45 \\times 6 = 270$，後面加上 4 個零：$2,700,000$（兩百七十萬）。',
      },
      {
        id: 'elem-m-2',
        title: '異分母分數乘除',
        strand: 'number',
        type: 'fill',
        difficulty: 3,
        question: '計算 $\\frac{5}{6} \\times \\frac{3}{10} =$ （請化為最簡分數小數形式，例如 0.25）',
        answer: 0.25,
        solution: '$\\frac{5 \\times 3}{6 \\times 10} = \\frac{15}{60} = \\frac{1}{4} = 0.25$。',
      },
      {
        id: 'elem-m-3',
        title: '圓面積應用',
        strand: 'geometry',
        type: 'fill',
        difficulty: 3,
        question: '半徑為 20 公分的圓形時鐘表面積是多少平方公分？（$\\pi$ 取 3.14）',
        answer: 1256,
        solution: '面積 $= 3.14 \\times 20 \\times 20 = 3.14 \\times 400 = 1256\\text{ cm}^2$。',
      },
      {
        id: 'elem-m-4',
        title: '速率與時間計算',
        strand: 'number',
        type: 'fill',
        difficulty: 3,
        question: '小明騎腳踏車時速 15 公里，從家裡到學校需要騎 24 分鐘，家裡到學校的距離是多少公里？',
        answer: 6,
        solution: '24 分鐘 $= \\frac{24}{60} = 0.4$ 小時。距離 $= 15 \\times 0.4 = 6$ 公里。',
      },
    ],
  },
  cap: {
    id: 'cap-mock-1',
    type: 'cap',
    title: '國中教育會考（CAP）數學科模擬試卷',
    subtitle: '對齊國中教育會考 25 題單選與 2 題非選擇題標準，換算 A++ ~ C 級分',
    targetGrade: '國中七～九年級',
    durationMinutes: 80,
    totalPoints: 100,
    gradingScale: '會考三等九級制（A++ / A+ / A / B++ / B+ / B / C）',
    questions: [
      {
        id: 'cap-m-1',
        title: '整數四則與指數律 (會考第 1 題)',
        strand: 'number',
        type: 'choice',
        difficulty: 2,
        question: '計算 $(-2)^3 \\times 5 - (-12) \\div (-4) =$ ？',
        options: ['-43', '-37', '37', '43'],
        answer: 0,
        solution: '$(-2)^3 = -8$；$(-8) \\times 5 = -40$；$(-12) \\div (-4) = 3$。原式 $= -40 - 3 = -43$。',
      },
      {
        id: 'cap-m-2',
        title: '乘法公式與根式化簡',
        strand: 'algebra',
        type: 'choice',
        difficulty: 3,
        question: '化簡 $(\\sqrt{7} + \\sqrt{3})(\\sqrt{7} - \\sqrt{3}) =$ ？',
        options: ['4', '10', '$2\\sqrt{7}$', '$4\\sqrt{21}$'],
        answer: 0,
        solution: '由平方差公式：$(\\sqrt{7})^2 - (\\sqrt{3})^2 = 7 - 3 = 4$。',
      },
      {
        id: 'cap-m-3',
        title: '二元一次方程式圖形',
        strand: 'algebra',
        type: 'choice',
        difficulty: 3,
        question: '坐標平面上，直線 $L: 3x - 4y = 12$ 不通過哪一個象限？',
        options: ['第一象限', '第二象限', '第三象限', '第四象限'],
        answer: 1,
        solution: '求直線截距：當 $y = 0$ 時 $x = 4$，通過 $(4, 0)$；當 $x = 0$ 時 $y = -3$，通過 $(0, -3)$。連線通過第一、三、四象限，不通過「第二象限」。',
      },
      {
        id: 'cap-m-4',
        title: '三角形三心與重心性質',
        strand: 'geometry',
        type: 'fill',
        difficulty: 4,
        question: '在 $\\triangle ABC$ 中，$G$ 為重心。若中線段 $AD = 12$ 公分，則線段 $AG$ 的長度是多少公分？',
        answer: 8,
        solution: '重心將中線分成 $2 : 1$ 的兩段：$AG = \\frac{2}{3} AD = \\frac{2}{3} \\times 12 = 8$ 公分。',
      },
      {
        id: 'cap-m-5',
        title: '二次函數頂點與極值 (會考非選核心)',
        strand: 'function',
        type: 'fill',
        difficulty: 4,
        question: '二次函數 $y = x^2 - 6x + 13$，其圖形的最低點（頂點）之 $y$ 坐標是多少？',
        answer: 4,
        solution: '配方法：$y = (x^2 - 6x + 9) - 9 + 13 = (x - 3)^2 + 4$。因此頂點為 $(3, 4)$，最低點 $y$ 坐標為 4。',
      },
    ],
  },
  gsat: {
    id: 'gsat-mock-1',
    type: 'gsat',
    title: '大學學科能力測驗（學測 GSAT）數學科模考',
    subtitle: '對齊 108 課綱學測 15 級分制（單選、多選倒扣計分、選填與混合題）',
    targetGrade: '高中十～十二年級',
    durationMinutes: 100,
    totalPoints: 100,
    gradingScale: '學測 15 級分制（頂標 12~15 / 前標 9~11 / 均標 6~8 / 後標 3~5 / 底標 1~2）',
    questions: [
      {
        id: 'gsat-m-1',
        title: '算幾不等式與極值 (學測單選)',
        strand: 'number',
        type: 'choice',
        difficulty: 3,
        question: '設 $a > 0, b > 0$ 且 $ab = 16$，則 $a + b$ 的最小值為何？',
        options: ['4', '8', '16', '32'],
        answer: 1,
        solution: '由算幾不等式：$\\frac{a+b}{2} \\ge \\sqrt{ab} = \\sqrt{16} = 4 \\Rightarrow a + b \\ge 8$。等號成立於 $a = b = 4$。',
      },
      {
        id: 'gsat-m-2',
        title: '三角函數和差角與正餘弦定理',
        strand: 'geometry',
        type: 'fill',
        difficulty: 4,
        question: '在 $\\triangle ABC$ 中，已知 $\\angle A = 30^\\circ$，外接圓半徑 $R = 6$，求對邊 $a$（線段 $BC$）的長度。',
        answer: 6,
        solution: '由正弦定理：$\\frac{a}{\\sin A} = 2R \\Rightarrow a = 2R\\sin 30^\\circ = 2(6)(0.5) = 6$。',
      },
      {
        id: 'gsat-m-3',
        title: '空間向量內積與外積',
        strand: 'geometry',
        type: 'fill',
        difficulty: 4,
        question: '設空間向量 $\\vec{u} = (1, 2, 2)$，$\\vec{v} = (2, -1, 2)$，求兩向量的內積 $\\vec{u} \\cdot \\vec{v}$。',
        answer: 4,
        solution: '內積公式：$\\vec{u} \\cdot \\vec{v} = 1(2) + 2(-1) + 2(2) = 2 - 2 + 4 = 4$。',
      },
      {
        id: 'gsat-m-4',
        title: '多項式微積分與切線斜率 (分科/學測選填)',
        strand: 'function',
        type: 'fill',
        difficulty: 5,
        question: '設 $f(x) = x^3 - 6x^2 + 9x + 2$，求導函數 $f\'(x) = 0$ 之兩實根中較大者。',
        answer: 3,
        solution: '$f\'(x) = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x - 1)(x - 3) = 0$。實根為 $x = 1$ 與 $x = 3$，較大者為 3。',
      },
    ],
  },
}
