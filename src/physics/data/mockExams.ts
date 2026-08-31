/**
 * 臺灣 108 課綱物理模擬試卷庫 (Physics Mock Exams)
 * 涵蓋：
 * 1. 國中教育會考 (CAP) 物理專題模擬試卷 (G7~G9)
 * 2. 學科能力測驗 (GSAT) 自然科物理專題模擬試卷 (G10 必修物理)
 * 3. 分科測驗 (AST) 物理考科模擬試卷 (G11~G12 選修物理)
 */

import type { PhysicsQuestion } from './curriculum'

export type PhysicsMockExam = {
  id: string
  title: string
  subtitle: string
  stage: 'junior' | 'senior'
  targetExam: string
  timeMinutes: number
  totalPoints: number
  description: string
  questions: PhysicsQuestion[]
}

export const PHYSICS_MOCK_EXAMS: Record<string, PhysicsMockExam> = {
  cap: {
    id: 'cap',
    title: '國中教育會考 (CAP) 物理素養模擬試題',
    subtitle: '國中七至九年級物理全範圍核心素養評量',
    stage: 'junior',
    targetExam: '國中教育會考 (CAP)',
    timeMinutes: 45,
    totalPoints: 100,
    description: '涵蓋測量密度、熱量傳播、波動光學、力與運動、壓力浮力、基本電路與電流磁效應。',
    questions: [
      {
        id: 'mock_cap_q1',
        title: '液體浮力與彈簧秤讀數',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 3,
        question: '體積為 $80\\text{ cm}^3$、質量為 $200\\text{ g}$ 的固體完全沒入水中 (水密度 $1\\text{ g/cm}^3$)。在水中懸掛該物體之彈簧秤讀數為何？',
        options: ['A. 80 gw', 'B. 120 gw', 'C. 200 gw', 'D. 280 gw'],
        answer: 1,
        solution: '【解析】浮力 $B = V_{\\text{排}} \\times D = 80 \\times 1 = 80\\text{ gw}$。水中秤重 $W\' = W - B = 200 - 80 = 120\\text{ gw}$。故選 (B)。',
        competency: '自-J-B3: 浮力原理與秤重分析。',
      },
      {
        id: 'mock_cap_q2',
        title: '冷熱水混合熱平衡末溫',
        strand: 'thermodynamics',
        type: 'choice',
        difficulty: 2,
        question: '$200\\text{ g}$、$70^\\circ\\text{C}$ 之熱水與 $300\\text{ g}$、$20^\\circ\\text{C}$ 之冷水在絕熱杯中混合，達成平衡之溫度為何？',
        options: ['A. $35^\\circ\\text{C}$', 'B. $40^\\circ\\text{C}$', 'C. $45^\\circ\\text{C}$', 'D. $50^\\circ\\text{C}$'],
        answer: 1,
        solution: '【解析】$200(70 - T) = 300(T - 20) \\implies 140 - 2T = 3T - 60 \\implies 5T = 200 \\implies T = 40^\\circ\\text{C}$。故選 (B)。',
        competency: '自-J-A2: 熱量平衡方程求解。',
      },
      {
        id: 'mock_cap_q3',
        title: '凸透鏡物距與成像性質',
        strand: 'waves_optics',
        type: 'choice',
        difficulty: 2,
        question: '焦距為 $15\\text{ cm}$ 的凸透鏡，當蠟燭置於透鏡前 $25\\text{ cm}$ 處 ($f < p < 2f$)，紙屏上所呈現之像為何？',
        options: ['A. 倒立放大實像', 'B. 倒立縮小實像', 'C. 正立放大虛像', 'D. 倒立等大實像'],
        answer: 0,
        solution: '【解析】物距 $p=25\\text{ cm}$ 介於一倍焦距與兩倍焦距之間 ($15 < p < 30$)，成像為倒立放大實像。故選 (A)。',
        competency: '自-J-A3: 透鏡成像規律判斷。',
      },
      {
        id: 'mock_cap_q4',
        title: '牛頓第二運動定律速度計算',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 2,
        question: '質量 $2\\text{ kg}$ 的靜止物體受 $10\\text{ N}$ 水平定力推動 $3\\text{ 秒}$，3 秒末物體速度為何？',
        options: ['A. 5 m/s', 'B. 10 m/s', 'C. 15 m/s', 'D. 30 m/s'],
        answer: 2,
        solution: '【解析】$a = \\frac{F}{m} = \\frac{10}{2} = 5\\text{ m/s}^2$；$v = v_0 + at = 0 + (5 \\times 3) = 15\\text{ m/s}$。故選 (C)。',
        competency: '自-J-B4: 牛頓第二定律加速度與速度計算。',
      },
      {
        id: 'mock_cap_q5',
        title: '家用電路並聯總電流',
        strand: 'electromagnetism',
        type: 'choice',
        difficulty: 3,
        question: '在 110V 家用電路上並聯一台 1100W 的電暖器與一台 220W 的電視機，通過總電線的電流為多少安培？',
        options: ['A. 6 A', 'B. 10 A', 'C. 12 A', 'D. 15 A'],
        answer: 2,
        solution: '【解析】總功率 $P = 1100 + 220 = 1320\\text{ W}$。總電流 $I = \\frac{P}{V} = \\frac{1320}{110} = 12\\text{ A}$。故選 (C)。',
        competency: '自-J-B5: 電功率與電路總電流計算。',
      },
    ],
  },

  gsat: {
    id: 'gsat',
    title: '學科能力測驗 (GSAT) 物理科模擬試題',
    subtitle: '高一必修物理全範圍素養題型評量',
    stage: 'senior',
    targetExam: '學科能力測驗 (GSAT)',
    timeMinutes: 50,
    totalPoints: 100,
    description: '涵蓋四大基本交互作用、等加速度運動、法拉第電磁感應、質能互換與光電效應量子概念。',
    questions: [
      {
        id: 'mock_gsat_q1',
        title: '四大基本交互作用尺度與強度比較',
        strand: 'modern',
        type: 'choice',
        difficulty: 3,
        question: '關於自然界四大基本交互作用，下列敘述何者正確？',
        options: [
          'A. 質子間的強作用力隨距離平方成反比，為長程力',
          'B. 重力在微觀原子核內比庫侖靜電力更強',
          'C. 日常生活中的正向力與摩擦力微觀上皆源自電磁力',
          'D. 放射性 $\\beta$ 衰變是由強交互作用所主導',
        ],
        answer: 2,
        solution: '【解析】接觸力微觀機制皆為電子雲間的電磁力作用。強作用力為短程力 ($< 10^{-15}\\text{ m}$)；重力強度最弱；$\\beta$ 衰變由弱作用力主導。故選 (C)。',
        competency: '物-U-B2: 基本交互作用綜合分析。',
      },
      {
        id: 'mock_gsat_q2',
        title: 'v-t 圖斜率與面積物理意義',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 2,
        question: '質點在 $v-t$ 圖中，前 2 秒速度由 0 增加到 10 m/s，隨後 3 秒維持 10 m/s，最後 1 秒減速到 0。總位移為何？',
        options: ['A. 30 m', 'B. 40 m', 'C. 45 m', 'D. 60 m'],
        answer: 2,
        solution: '【解析】梯形面積：上底 3 秒 ($t=2\\sim 5$)，下底 6 秒 ($t=0\\sim 6$)，高 10 m/s。$\\Delta x = \\frac{(3 + 6) \\times 10}{2} = 45\\text{ m}$。故選 (C)。',
        competency: '物-U-B3: 運動圖形面積與位移計算。',
      },
      {
        id: 'mock_gsat_q3',
        title: '光電效應頻率與最大動能關係',
        strand: 'modern',
        type: 'choice',
        difficulty: 3,
        question: '用頻率為底限頻率 3 倍的單色光照射某金屬表面，光電子的最大動能為 $K_0$。若改用頻率為底限頻率 5 倍的單色光照射，光電子之最大動能為何？',
        options: ['A. $2K_0$', 'B. $3K_0$', 'C. $4K_0$', 'D. $5K_0$'],
        answer: 0,
        solution: '【解析】功函數 $W = h\\nu_0$。$K_0 = h(3\\nu_0) - h\\nu_0 = 2h\\nu_0$。改用 $5\\nu_0$ 時，$K\' = h(5\\nu_0) - h\\nu_0 = 4h\\nu_0 = 2K_0$。故選 (A)。',
        competency: '物-U-A4: 愛因斯坦光電方程式比例計算。',
      },
      {
        id: 'mock_gsat_q4',
        title: '法拉第電磁感應與冷次定律',
        strand: 'electromagnetism',
        type: 'choice',
        difficulty: 2,
        question: '磁鐵 S 極向下遠離封閉圓形線圈，由上方俯視線圈，感應電流方向與線圈受力方向為何？',
        options: [
          'A. 順時針，向上吸引力',
          'B. 逆時針，向上吸引力',
          'C. 順時針，向下排斥力',
          'D. 逆時針，向下排斥力',
        ],
        answer: 0,
        solution: '【解析】S 極向下遠離（向上的磁通量減少），線圈感應向上磁場以留住磁鐵（上端感應成 N 極）。由右手螺旋安培定則俯視為「順時針方向」，線圈受向上吸引力（去留）。故選 (A)。',
        competency: '物-U-A3: 冷次定律去留法則分析。',
      },
    ],
  },

  ast: {
    id: 'ast',
    title: '分科測驗 (AST) 物理考科進階模擬試卷',
    subtitle: '選修物理 I~V 全範圍深度推導與綜合解析',
    stage: 'senior',
    targetExam: '分科測驗 (AST)',
    timeMinutes: 80,
    totalPoints: 100,
    description: '涵蓋斜向拋射、一維碰撞、圓軌道衛星束縛能、SHM 震盪、雙狹縫干涉、克希荷夫電路、勞侖茲力與德布羅意物質波。',
    questions: [
      {
        id: 'mock_ast_q1',
        title: '一維正面彈碰與動能損失判定',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 4,
        question: '質量 $m$ 之質點以初速 $v$ 正面彈性碰撞靜止之質量 $M$ 質點。若碰撞後 $m$ 原路反彈且速率為 $\\frac{1}{3}v$，則質量比 $M : m$ 為何？',
        options: ['A. 2 : 1', 'B. 3 : 1', 'C. 4 : 1', 'D. 5 : 1'],
        answer: 0,
        solution: '【解析】彈碰末速公式 $v_1\' = \\frac{m - M}{m + M} v = -\\frac{1}{3}v \\implies \\frac{M - m}{M + m} = \\frac{1}{3} \\implies 3M - 3m = M + m \\implies 2M = 4m \\implies M = 2m$。比例為 $2 : 1$。故選 (A)。',
        competency: '物-S-A3: 彈性碰撞反彈速率與質量比反推。',
      },
      {
        id: 'mock_ast_q2',
        title: '帶電粒子在均勻磁場之迴旋半徑與動能',
        strand: 'electromagnetism',
        type: 'choice',
        difficulty: 4,
        question: '電荷為 $+q$、質量為 $m$ 的粒子在磁場 $B$ 中做半徑為 $R$ 的等速率圓周運動。該粒子的動能為何？',
        options: [
          'A. $\\frac{q^2 B^2 R^2}{2m}$',
          'B. $\\frac{q B R}{2m}$',
          'C. $\\frac{q^2 B^2 R}{m}$',
          'D. $\\frac{2m}{q^2 B^2 R^2}$',
        ],
        answer: 0,
        solution: '【解析】$qvB = m\\frac{v^2}{R} \\implies v = \\frac{qBR}{m}$。動能 $E_k = \\frac{1}{2}mv^2 = \\frac{1}{2}m\\left(\\frac{qBR}{m}\\right)^2 = \\frac{q^2 B^2 R^2}{2m}$。故選 (A)。',
        competency: '物-S-B4: 磁場迴旋運動動能解析式推導。',
      },
      {
        id: 'mock_ast_q3',
        title: '雙狹縫干涉與單狹縫繞射複合圖形',
        strand: 'waves_optics',
        type: 'choice',
        difficulty: 4,
        question: '雙狹縫實驗中雙縫間距 $d = 0.5\\text{ mm}$，每個狹縫單獨寬度 $b = 0.1\\text{ mm}$。試問在單狹縫中央繞射亮帶內，最多可容納多少條雙狹縫干涉亮紋？',
        options: ['A. 5 條', 'B. 9 條', 'C. 10 條', 'D. 11 條'],
        answer: 1,
        solution: '【解析】單狹縫第一暗紋角滿足 $\\sin\\theta = \\frac{\\lambda}{b}$。雙狹縫亮紋角滿足 $\\sin\\theta = m\\frac{\\lambda}{d}$。缺級條件為 $m = \\frac{d}{b} = \\frac{0.5}{0.1} = 5$ 級（第 $\\pm 5$ 級雙縫亮帶恰落在單縫第一暗帶中而消失）。因此中央亮帶內包含 $m = 0, \\pm 1, \\pm 2, \\pm 3, \\pm 4$ 共 $1 + 4 + 4 = 9$ 條干涉亮紋。故選 (B)。',
        competency: '物-S-A7: 雙狹縫干涉與單狹縫繞射缺級效應分析。',
      },
      {
        id: 'mock_ast_q4',
        title: '簡諧運動 SHM 端點與平衡點動能轉移',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 3,
        question: '一水平彈簧振子振幅為 $A$。當物體位移為 $x = \\frac{\\sqrt{3}}{2}A$ 時，其動能 $E_k$ 與彈力位能 $U$ 的比值 $E_k : U$ 為何？',
        options: ['A. 1 : 3', 'B. 3 : 1', 'C. 1 : 2', 'D. 1 : 4'],
        answer: 0,
        solution: '【解析】總能 $E = \\frac{1}{2}kA^2$。位能 $U = \\frac{1}{2}kx^2 = \\frac{1}{2}k\\left(\\frac{3}{4}A^2\\right) = \\frac{3}{4}E$。動能 $E_k = E - U = \\frac{1}{4}E$。因此 $E_k : U = \\frac{1}{4} : \\frac{3}{4} = 1 : 3$。故選 (A)。',
        competency: '物-S-A4: 簡諧運動力學能分配比例計算。',
      },
    ],
  },
}
