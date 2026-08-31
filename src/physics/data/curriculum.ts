/**
 * 臺灣 108 課綱物理課程架構 (Physics Track)
 * 完整涵蓋：
 * - 國中階段 (Junior High: G7, G8, G9)
 *   - G7 國中七年級 (基本測量、質量密度、溫度熱量，3 單元)
 *   - G8 國中八年級 (波動聲音、光學透鏡、力與平衡、壓力浮力，4 單元)
 *   - G9 國中九年級 (直線運動、牛頓定律、功與能、電路電磁，4 單元)
 * - 高中階段 (Senior High: G10, G11, G12)
 *   - G10 高中十年級 (必修物理，6 單元)
 *   - G11 高中十一年級 (選修物理 力學與波動，7 單元)
 *   - G12 高中十二年級 (選修物理 電磁學與近代物理，6 單元)
 */

export type PhysicsGradeId = 'g7' | 'g8' | 'g9' | 'g10' | 'g11' | 'g12'

export type PhysicsStage = 'junior' | 'senior'

export type PhysicsStrand =
  | 'mechanics' // 力學 (運動、牛頓力學、浮力、動量能量、萬有引力)
  | 'thermodynamics' // 熱學 (溫度、熱量、比熱、氣體動力論)
  | 'waves_optics' // 波動與光學 (波的傳播、聲波、幾何光學、干涉繞射)
  | 'electromagnetism' // 電磁學 (靜電、電路、磁場、電磁感應、交流電)
  | 'modern' // 近代物理 (微觀測量、基本交互作用、原子結構、量子現象、相對論)

export type PhysicsQuestionType = 'choice' | 'multi-choice' | 'fill' | 'step'

export type PhysicsQuestion = {
  id: string
  title: string
  strand: PhysicsStrand
  type: PhysicsQuestionType
  difficulty: 1 | 2 | 3 | 4 | 5
  question: string
  options?: string[]
  answer: string | number | number[]
  solution: string
  hint?: string
  competency?: string // 108 課綱核心素養與學習表現
  interactiveLab?: string // 關聯的互動實驗室 ID
}

export type PhysicsUnit = {
  id: number
  key: string
  title: string
  subtitle: string
  strand: PhysicsStrand
  band: string // '國中基礎' | '國中進階' | '國中衝刺' | '高中必修' | '高中選修'
  targetExam: string // '國中教育會考 (CAP)' | '學科能力測驗 (GSAT)' | '分科測驗 (AST)'
  concepts: string[] // 核心觀念與 KaTeX 物理公式
  questions: PhysicsQuestion[]
  suggestedLab?: string
  totalPoints: number
}

export type PhysicsGradeInfo = {
  id: PhysicsGradeId
  stage: PhysicsStage
  name: string
  nameEn: string
  band: string
  description: string
  targetExam: string
  units: PhysicsUnit[]
  labs: Array<{ id: string; name: string; description: string }>
}

/** 108 課綱物理五大主軸中文名稱 */
export const PHYSICS_STRAND_NAMES: Record<PhysicsStrand, string> = {
  mechanics: '力學 (運動、平衡、流體與能量)',
  thermodynamics: '熱學 (溫度、熱量與分子動力論)',
  waves_optics: '波動與光學 (聲、光現象與物理光學)',
  electromagnetism: '電磁學 (電路、電場、磁場與電磁感應)',
  modern: '近代物理 (微觀世界、量子現象與原子結構)',
}

// -------------------------------------------------------------
// G7 國中七年級 (3 單元)
// -------------------------------------------------------------
const G7_UNITS: PhysicsUnit[] = [
  {
    id: 1,
    key: 'g7_u1',
    title: '長度、體積測量與實驗誤差',
    subtitle: '最小刻度讀數、估計值規則與排水法測量',
    strand: 'modern',
    band: '國中基礎',
    targetExam: '國中教育會考 (CAP)',
    totalPoints: 100,
    suggestedLab: 'lab-j7-measurement',
    concepts: [
      '測量結果表示法：$\\text{測量值} = \\text{準確值} + \\text{一位估計值}$。估計值位在儀器最小刻度的下一位。',
      '不規則物體體積測量：排水法。固體放入量筒中，上升的液體體積即為物體體積 $V = V_2 - V_1$（需物體不溶於水且下沉）。',
      '多次測量平均值：去除離群值（顯著錯誤值）後取算術平均，以減少偶然誤差。',
    ],
    questions: [
      {
        id: 'g7_u1_q1',
        title: '直尺讀數與最小刻度判別',
        strand: 'modern',
        type: 'choice',
        difficulty: 1,
        question: '小明用一把直尺測量鉛筆長度，記錄為 $15.48\\text{ cm}$。試問這把直尺的「最小刻度」為何？',
        options: ['A. 1 公尺', 'B. 1 公分', 'C. 1 公釐 (0.1 cm)', 'D. 0.01 公分'],
        answer: 2,
        solution:
          '【解析】測量值 $15.48\\text{ cm}$ 中，準確值為 $15.4\\text{ cm}$，最後一位 $8$ 為估計值。\n' +
          '因此直尺的最小刻度為倒數第二位，即 $0.1\\text{ cm} = 1\\text{ mm}$ (公釐)。故選 (C)。',
        hint: '最後一位是估計值，倒數第二位即為最小刻度。',
        competency: '自-J-A1: 能正確讀取測量儀器刻度並記錄估計值。',
      },
    ],
  },
  {
    id: 2,
    key: 'g7_u2',
    title: '質量、密度與物質特性',
    subtitle: '天平操作、密度公式計算與沉浮條件判定',
    strand: 'mechanics',
    band: '國中基礎',
    targetExam: '國中教育會考 (CAP)',
    totalPoints: 100,
    suggestedLab: 'lab-j7-density',
    concepts: [
      '密度定義公式：$D = \\frac{M}{V}$（單位：$\\text{g/cm}^3$ 或 $\\text{kg/m}^3$，$1\\text{ g/cm}^3 = 1000\\text{ kg/m}^3$）。',
      '物質特性：同種均勻物質在定溫定壓下密度為定值，$M-V$ 關係圖為通過原點之直線，斜率即為密度 $D$。',
      '沉浮條件：物體密度 $D_{\\text{obj}} > D_{\\text{liq}}$ 則下沉；$D_{\\text{obj}} = D_{\\text{liq}}$ 則懸浮；$D_{\\text{obj}} < D_{\\text{liq}}$ 則浮於液面。',
    ],
    questions: [
      {
        id: 'g7_u2_q1',
        title: '質量體積圖形與密度計算',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 2,
        question: '量筒內裝有某液體，測得液體體積 $V = 30\\text{ cm}^3$ 時，量筒與液體總質量為 $54\\text{ g}$；當液體體積增為 $50\\text{ cm}^3$ 時，總質量為 $70\\text{ g}$。試問該液體的密度為多少 $\\text{g/cm}^3$？量筒空重為多少公克？',
        options: [
          'A. $D = 0.8\\text{ g/cm}^3$，量筒空重 $30\\text{ g}$',
          'B. $D = 1.0\\text{ g/cm}^3$，量筒空重 $24\\text{ g}$',
          'C. $D = 0.8\\text{ g/cm}^3$，量筒空重 $24\\text{ g}$',
          'D. $D = 1.2\\text{ g/cm}^3$，量筒空重 $18\\text{ g}$',
        ],
        answer: 0,
        solution:
          '【解析】\n' +
          '1. 液體增加體積 $\\Delta V = 50 - 30 = 20\\text{ cm}^3$。\n' +
          '2. 液體增加質量 $\\Delta M = 70 - 54 = 16\\text{ g}$。\n' +
          '3. 液體密度 $D = \\frac{\\Delta M}{\\Delta V} = \\frac{16}{20} = 0.8\\text{ g/cm}^3$。\n' +
          '4. 量筒空重 $M_{\\text{empty}} = 54 - (30 \\times 0.8) = 54 - 24 = 30\\text{ g}$。故選 (A)。',
        hint: '扣除量筒質量，斜率 $\\Delta M / \\Delta V$ 即為液體密度。',
        competency: '自-J-B1: 運用線性方程式與數據圖表分離容器與液體密度。',
      },
    ],
  },
  {
    id: 3,
    key: 'g7_u3',
    title: '溫度、比熱與熱量傳遞',
    subtitle: '熱量公式 H = msΔT、熱平衡與熱傳播三途徑',
    strand: 'thermodynamics',
    band: '國中基礎',
    targetExam: '國中教育會考 (CAP)',
    totalPoints: 100,
    suggestedLab: 'lab-j7-specific-heat',
    concepts: [
      '熱量計算公式：$H = m \\cdot s \\cdot \\Delta T$（$H$ 為熱量卡 $\\text{cal}$，$m$ 為質量公克，$s$ 為比熱 $\\text{cal/(g}\\cdot^\\circ\\text{C)}$，水的比熱為 $1.0$）。',
      '熱平衡：在絕熱系統中，高溫物體放出之熱量等於低溫物體吸收之熱量 $H_{\\text{放}} = H_{\\text{吸}}$，最終達到相同溫度。',
      '熱傳播三途徑：\n' +
        '1. 傳導 (Conduction)：主要發生於固體，金屬為良好熱導體。\n' +
        '2. 對流 (Convection)：發生於液體與氣體（流體），熱流體上升、冷流體下降。\n' +
        '3. 輻射 (Radiation)：不需介質，可在真空中傳遞（如太陽光熱）。黑色粗糙面吸熱快也散熱快。',
    ],
    questions: [
      {
        id: 'g7_u3_q1',
        title: '熱平衡混合末溫計算',
        strand: 'thermodynamics',
        type: 'choice',
        difficulty: 2,
        question: '將 $100\\text{ g}$、$80^\\circ\\text{C}$ 的熱水與 $200\\text{ g}$、$20^\\circ\\text{C}$ 的冷水混合於絕熱保溫杯中。若無熱量散失，混合達成熱平衡時之末溫為何？',
        options: ['A. $30^\\circ\\text{C}$', 'B. $40^\\circ\\text{C}$', 'C. $50^\\circ\\text{C}$', 'D. $60^\\circ\\text{C}$'],
        answer: 1,
        solution:
          '【解析】\n' +
          '設熱平衡溫度為 $T$：\n' +
          '熱水放熱 $H_{\\text{放}} = 100 \\times 1.0 \\times (80 - T)$\n' +
          '冷水吸熱 $H_{\\text{吸}} = 200 \\times 1.0 \\times (T - 20)$\n' +
          '由 $H_{\\text{放}} = H_{\\text{吸}} \\implies 100(80 - T) = 200(T - 20) \\implies 80 - T = 2T - 40 \\implies 3T = 120 \\implies T = 40^\\circ\\text{C}$。故選 (B)。',
        hint: '放熱量等於吸熱量：$m_1(T_1 - T) = m_2(T - T_2)$。',
        competency: '自-J-A2: 能運用熱量公式建立熱平衡方程並求解末溫。',
      },
    ],
  },
]

// -------------------------------------------------------------
// G8 國中八年級 (4 單元)
// -------------------------------------------------------------
const G8_UNITS: PhysicsUnit[] = [
  {
    id: 1,
    key: 'g8_u1',
    title: '波動特性與聲波傳播',
    subtitle: '波速公式 v = fλ、回聲測距與聲音三要素',
    strand: 'waves_optics',
    band: '國中進階',
    targetExam: '國中教育會考 (CAP)',
    totalPoints: 100,
    suggestedLab: 'lab-j8-sound-wave',
    concepts: [
      '波的基本公式：$v = f \\lambda = \\frac{\\lambda}{T}$（波速 $=$ 頻率 $\\times$ 波長）。波傳遞的是「能量」與「波形」，介質只在原處振動不隨波前進。',
      '聲波傳播條件：需要介質（機械波），真空無法傳聲。聲速在固體 $>$ 液體 $>$ 氣體。空氣中聲速 $v \\approx 331 + 0.6T$ ($T$ 為攝氏溫度)。',
      '聲音三要素：\n' +
        '1. 響度 (Loudness)：由振幅決定，單位為分貝 (dB)。\n' +
        '2. 音調 (Pitch)：由振動頻率決定，頻率高則聲音尖銳，單位赫茲 (Hz)。人的聽覺範圍為 $20\\sim 20000\\text{ Hz}$。\n' +
        '3. 音色 (Timbre)：由波形決定，不同樂器波形不同。',
    ],
    questions: [
      {
        id: 'g8_u1_q1',
        title: '聲波回聲測距與時間差分析',
        strand: 'waves_optics',
        type: 'choice',
        difficulty: 2,
        question: '小華站在大峭壁前鳴槍，經過 $1.2\\text{ 秒}$ 後聽到回聲。已知當時氣溫下的聲速為 $340\\text{ m/s}$，試問小華與峭壁之間的距離為多少公尺？',
        options: ['A. 170 m', 'B. 204 m', 'C. 340 m', 'D. 408 m'],
        answer: 1,
        solution:
          '【解析】\n' +
          '回聲是聲波去程與回程來回行經的總路程：\n' +
          '$2d = v \\times t = 340 \\times 1.2 = 408\\text{ m}$\n' +
          '$d = \\frac{408}{2} = 204\\text{ m}$。故選 (B)。',
        hint: '回聲是來回兩倍距離：$d = \\frac{v \\times t}{2}$。',
        competency: '自-J-B2: 運用聲波反射與等速運動關係計算空間距離。',
      },
    ],
  },
  {
    id: 2,
    key: 'g8_u2',
    title: '光的反射、折射與透鏡成像',
    subtitle: '反射定律、折射偏向、凸透鏡實虛像與視力矯正',
    strand: 'waves_optics',
    band: '國中進階',
    targetExam: '國中教育會考 (CAP)',
    totalPoints: 100,
    suggestedLab: 'lab-j8-lens-optics',
    concepts: [
      '光的反射定律：入射角等於反射角，入射線、反射線與法線在同一平面上。平面鏡成「等大、正立、對稱的虛像」。',
      '光的折射規律：光從空氣斜射入水/玻璃中，折射線「偏向法線」（折射角 $<$ 入射角）；反之「偏離法線」。',
      '凸透鏡成像規律 (焦距 $f$)：\n' +
        '1. 物距 $p > 2f$ ➜ 倒立縮小實像 ($f < q < 2f$，照相機)。\n' +
        '2. 物距 $p = 2f$ ➜ 倒立等大實像 ($q = 2f$)。\n' +
        '3. 物距 $f < p < 2f$ ➜ 倒立放大實像 ($q > 2f$，投影機)。\n' +
        '4. 物距 $p < f$ ➜ 正立放大虛像 (放大鏡)。',
      '視力矯正：近視眼成像在視網膜前，用「凹透鏡」發散矯正；遠視眼成像在視網膜後，用「凸透鏡」會聚矯正。',
    ],
    questions: [
      {
        id: 'g8_u2_q1',
        title: '凸透鏡成像性質與物距關係判斷',
        strand: 'waves_optics',
        type: 'choice',
        difficulty: 2,
        question: '某凸透鏡之焦距為 $10\\text{ cm}$。若將蠟燭置於透鏡前方 $15\\text{ cm}$ 處，則在透鏡另一側的紙屏上所呈現的像性質為何？',
        options: [
          'A. 倒立縮小實像',
          'B. 倒立放大實像',
          'C. 正立放大虛像',
          'D. 正立縮小虛像',
        ],
        answer: 1,
        solution:
          '【解析】焦距 $f = 10\\text{ cm}$，兩倍焦距 $2f = 20\\text{ cm}$。\n' +
          '蠟燭物距 $p = 15\\text{ cm}$，介於一倍焦距與兩倍焦距之間 ($f < p < 2f$)，因此在透鏡另一側成像於 $q > 2f$ 處，成像性質為「倒立、放大、實像」（如投影機原理）。故選 (B)。',
        hint: '$f < p < 2f$ 時，成倒立放大實像。',
        competency: '自-J-A3: 辨識幾何光學透鏡成像特徵與生活光學儀器對應。',
      },
    ],
  },
  {
    id: 3,
    key: 'g8_u3',
    title: '力的作用、虎克定律與兩力平衡',
    subtitle: '彈簧伸長量比例、兩力平衡條件與摩擦力特性',
    strand: 'mechanics',
    band: '國中進階',
    targetExam: '國中教育會考 (CAP)',
    totalPoints: 100,
    suggestedLab: 'lab-j8-hooke-law',
    concepts: [
      '虎克定律 (在彈性限度內)：彈簧受力與「伸長量」成正比 $F = k \\cdot \\Delta x$（注意是伸長量 $\\Delta x = L - L_0$，非全長）。',
      '兩力平衡條件：大小相等、方向相反、作用在同一直線上、作用在同一物體上，合力為零保持靜止或等速。',
      '摩擦力：接觸面粗糙度與正向力越大，最大靜摩擦力越大。靜止時靜摩擦力等於推力 ($f_s = F_{\\text{push}}$)；運動時動摩擦力為定值。',
    ],
    questions: [
      {
        id: 'g8_u3_q1',
        title: '虎克定律彈簧伸長量計算',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 2,
        question: '一彈簧原長為 $12\\text{ cm}$，掛上 $30\\text{ gw}$ 的砝碼時全長變為 $15\\text{ cm}$。在彈性限度內，若改掛 $50\\text{ gw}$ 的砝碼，彈簧的全長將變為多少公分？',
        options: ['A. 16 cm', 'B. 17 cm', 'C. 18 cm', 'D. 20 cm'],
        answer: 1,
        solution:
          '【解析】\n' +
          '1. 原長 $L_0 = 12\\text{ cm}$。\n' +
          '2. 掛 $30\\text{ gw}$ 時，伸長量 $\\Delta x_1 = 15 - 12 = 3\\text{ cm}$。每 $10\\text{ gw}$ 伸長 $1\\text{ cm}$。\n' +
          '3. 改掛 $50\\text{ gw}$ 時，伸長量 $\\Delta x_2 = 50 \\times \\frac{3}{30} = 5\\text{ cm}$。\n' +
          '4. 彈簧全長 $L = 12 + 5 = 17\\text{ cm}$。故選 (B)。',
        hint: '注意：外力與「伸長量」成正比，算完全長要加上原長。',
        competency: '自-J-A4: 應用虎克定律比例關係推算彈簧形變與長度。',
      },
    ],
  },
  {
    id: 4,
    key: 'g8_u4',
    title: '液體壓力、大氣壓力與阿基米德浮力',
    subtitle: '液壓公式 P = hd、托里切利實驗與浮力原理',
    strand: 'mechanics',
    band: '國中進階',
    targetExam: '國中教育會考 (CAP)',
    totalPoints: 100,
    suggestedLab: 'lab-j8-buoyancy-pressure',
    concepts: [
      '固體壓力：$P = \\frac{F}{A}$（單位：$\\text{gw/cm}^2$ 或帕斯卡 $\\text{Pa} = \\text{N/m}^2$）。',
      '靜止液體內部壓力：$P = h \\times D$（$h$ 為液面垂直深度，$D$ 為液體密度，無特定方向且垂直於接觸面；連通管原理與帕斯卡原理）。',
      '大氣壓力：$1\\text{ atm} = 76\\text{ cm-Hg} = 1033.6\\text{ gw/cm}^2 \\approx 1013\\text{ hPa}$（托里切利水銀柱實驗）。',
      '阿基米德浮力原理：物體在流體中所受浮力等於「所排開流體的重量」 $B = V_{\\text{排}} \\times D_{\\text{液}}$。浮體浮力等於物重 ($B = W$)；沉體浮力小於物重 ($B = W - W\'$)。',
    ],
    questions: [
      {
        id: 'g8_u4_q1',
        title: '阿基米德浮力與沉體減輕重量分析',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 3,
        question: '體積為 $100\\text{ cm}^3$、質量為 $350\\text{ g}$ 的金屬塊完全沉入水中 (水密度 $1\\text{ g/cm}^3$)。彈簧秤懸掛金屬塊在水中的讀數（視重）為何？',
        options: ['A. 100 gw', 'B. 250 gw', 'C. 350 gw', 'D. 450 gw'],
        answer: 1,
        solution:
          '【解析】\n' +
          '1. 金屬塊完全沉入水中，排開水體積 $V_{\\text{排}} = 100\\text{ cm}^3$。\n' +
          '2. 所受浮力 $B = V_{\\text{排}} \\times D_{\\text{水}} = 100 \\times 1 = 100\\text{ gw}$。\n' +
          '3. 彈簧秤讀數（視重）$W\' = W - B = 350 - 100 = 250\\text{ gw}$。故選 (B)。',
        hint: '浮力 $B = V_{\\text{排}} \\times D_{\\text{液}}$，水中秤重 $W\' = W - B$。',
        competency: '自-J-B3: 綜合應用阿基米德原理與力的平衡解析物體在流體中的受力。',
      },
    ],
  },
]

// -------------------------------------------------------------
// G9 國中九年級 (4 單元)
// -------------------------------------------------------------
const G9_UNITS: PhysicsUnit[] = [
  {
    id: 1,
    key: 'g9_u1',
    title: '直線運動與速度加速度',
    subtitle: '位置-時間 (x-t) 圖、速度-時間 (v-t) 圖與等加速度',
    strand: 'mechanics',
    band: '國中衝刺',
    targetExam: '國中教育會考 (CAP)',
    totalPoints: 100,
    suggestedLab: 'lab-j9-linear-motion',
    concepts: [
      '平均速度與平均加速度：$\\bar{v} = \\frac{\\Delta x}{\\Delta t}$，$\\bar{a} = \\frac{\\Delta v}{\\Delta t}$。',
      '$x-t$ 圖與 $v-t$ 圖判讀：$x-t$ 圖斜率代表速度；$v-t$ 圖斜率代表加速度，$v-t$ 圖與時間軸所夾面積代表位移。',
      '打點計時器紙帶分析：相鄰點時間間隔 $T$ 固定，紙帶上兩點間距變大代表加速，間距相同代表等速。',
    ],
    questions: [
      {
        id: 'g9_u1_q1',
        title: 'v-t 圖加速度與位移綜合計算',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 2,
        question: '質點做直線運動，其 $v-t$ 圖由 $(0\\text{ s}, 0\\text{ m/s})$ 均勻加速到 $(5\\text{ s}, 30\\text{ m/s})$。試問該質點在 5 秒內的加速度量值與總位移分別為何？',
        options: [
          'A. $a = 6\\text{ m/s}^2, \\Delta x = 75\\text{ m}$',
          'B. $a = 6\\text{ m/s}^2, \\Delta x = 150\\text{ m}$',
          'C. $a = 30\\text{ m/s}^2, \\Delta x = 75\\text{ m}$',
          'D. $a = 5\\text{ m/s}^2, \\Delta x = 100\\text{ m}$',
        ],
        answer: 0,
        solution:
          '【解析】\n' +
          '1. 加速度 $a = \\frac{\\Delta v}{\\Delta t} = \\frac{30 - 0}{5} = 6\\text{ m/s}^2$。\n' +
          '2. 位移 $\\Delta x = \\frac{\\text{底} \\times \\text{高}}{2} = \\frac{5 \\times 30}{2} = 75\\text{ m}$。故選 (A)。',
        hint: '加速度看斜率 $\\Delta v / \\Delta t$，位移看三角形面積。',
        competency: '自-J-A5: 判讀 $v-t$ 圖形斜率與面積求算運動物理量。',
      },
    ],
  },
  {
    id: 2,
    key: 'g9_u2',
    title: '牛頓運動定律與重力',
    subtitle: '牛頓三大定律、作用力與反作用力及萬有引力',
    strand: 'mechanics',
    band: '國中衝刺',
    targetExam: '國中教育會考 (CAP)',
    totalPoints: 100,
    suggestedLab: 'lab-j9-newton-laws',
    concepts: [
      '牛頓第一運動定律 (慣性定律)：合力為零時，靜者恆靜，動者恆作等速度直線運動（如搭公車緊急煞車人往前傾）。',
      '牛頓第二運動定律 (運動定律)：$F_{\\text{net}} = m \\cdot a$（$1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2$，$1\\text{ kgw} \\approx 9.8\\text{ N}$）。',
      '牛頓第三運動定律 (作用與反作用力)：大小相等、方向相反、作用在同一直線上、同時產生同時消失、作用在「不同物體」上不可互相抵消（如火箭噴氣前進、游泳划水）。',
    ],
    questions: [
      {
        id: 'g9_u2_q1',
        title: '牛頓第二運動定律 F=ma 計算',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 2,
        question: '施加 $12\\text{ N}$ 的水平定力推動光滑地面上質量為 $3\\text{ kg}$ 的靜止木塊，推動 $4\\text{ 秒}$。試問木塊在 4 秒末的速度為何？',
        options: ['A. 4 m/s', 'B. 8 m/s', 'C. 16 m/s', 'D. 24 m/s'],
        answer: 2,
        solution:
          '【解析】\n' +
          '1. 由牛頓第二定律：$a = \\frac{F}{m} = \\frac{12}{3} = 4\\text{ m/s}^2$。\n' +
          '2. 4 秒末速度：$v = v_0 + at = 0 + (4 \\times 4) = 16\\text{ m/s}$。故選 (C)。',
        hint: '先用 $a = F/m$ 求加速度，再代入 $v = at$。',
        competency: '自-J-B4: 應用牛頓第二定律與等加速度公式求解速度。',
      },
    ],
  },
  {
    id: 3,
    key: 'g9_u3',
    title: '功與能、功率與力學能守恆',
    subtitle: '作功定義 W = Fs、動能位能轉換與簡單機械',
    strand: 'mechanics',
    band: '國中衝刺',
    targetExam: '國中教育會考 (CAP)',
    totalPoints: 100,
    suggestedLab: 'lab-j9-work-energy',
    concepts: [
      '功的定義：$W = F \\times s$（力的方向與位移平行，$1\\text{ J} = 1\\text{ N}\\cdot\\text{m}$）。若垂直則作功為零（如向心力不作功、手提重物等速水平前進不作功）。',
      '功率 (Power)：單位時間內所作的功 $P = \\frac{W}{t}$（單位：瓦特 $\\text{W} = \\text{J/s}$）。',
      '動能與重力位能：$E_k = \\frac{1}{2}mv^2$，$U = mgh$。在無摩擦阻力下，動能與位能相互轉換，總力學能守恆 $E_k + U = \\text{定值}$。',
      '簡單機械：槓桿原理 ($F_1 d_1 = F_2 d_2$)、滑輪（動滑輪省力一半但費一倍距離，不省功）。',
    ],
    questions: [
      {
        id: 'g9_u3_q1',
        title: '自由落體力學能守恆計算',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 2,
        question: '將質量為 $1\\text{ kg}$ 的球自離地 $20\\text{ m}$ 處由靜止自由釋放，取 $g = 10\\text{ m/s}^2$。球著地前瞬間的速率為何？',
        options: ['A. 10 m/s', 'B. 14.1 m/s', 'C. 20 m/s', 'D. 40 m/s'],
        answer: 2,
        solution:
          '【解析】由力學能守恆定律 $mgh = \\frac{1}{2}mv^2$：\n' +
          '$v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 20} = \\sqrt{400} = 20\\text{ m/s}$。故選 (C)。',
        hint: '重力位能完全轉為動能：$v = \\sqrt{2gh}$。',
        competency: '自-J-A6: 理解力學能守恆定律並計算能量轉換速率。',
      },
    ],
  },
  {
    id: 4,
    key: 'g9_u4',
    title: '靜電現象、基本電路與電流磁效應',
    subtitle: '歐姆定律 V = IR、串並聯電路、電功率與右手安培定則',
    strand: 'electromagnetism',
    band: '國中衝刺',
    targetExam: '國中教育會考 (CAP)',
    totalPoints: 100,
    suggestedLab: 'lab-j9-circuit-magnetism',
    concepts: [
      '歐姆定律：$V = I \\cdot R$（$V$ 為電壓伏特，$I$ 為電流安培，$R$ 為電阻歐姆）。',
      '串並聯電路特性：\n' +
        '1. 串聯：電流處處相等 $I_{\\text{total}} = I_1 = I_2$；總電阻 $R = R_1 + R_2$；總電壓相加 $V = V_1 + V_2$。\n' +
        '2. 並聯：各支路電壓相等 $V_{\\text{total}} = V_1 = V_2$；總電流相加 $I = I_1 + I_2$；總電阻變小 $\\frac{1}{R} = \\frac{1}{R_1} + \\frac{1}{R_2}$。',
      '電功率與用電度數：$P = I V = I^2 R = \\frac{V^2}{R}$。$1\\text{ 度電} = 1\\text{ 仟瓦}\\cdot\\text{小時} (1\\text{ kWh}) = 3.6 \\times 10^6\\text{ J}$。',
      '電流磁效應：載流長直導線周圍產生同心圓磁場（右手螺旋安培定則）；螺線管安培定則；右手開掌定則（大拇指電流、四指磁場、掌心為受力方向）。',
    ],
    questions: [
      {
        id: 'g9_u4_q1',
        title: '歐姆定律與串並聯電功率比較',
        strand: 'electromagnetism',
        type: 'choice',
        difficulty: 3,
        question: '甲、乙兩燈泡規格分別為「110V、100W」與「110V、50W」。若將兩燈泡「串聯」後接到 110V 的家用電源上，則哪一個燈泡較亮？',
        options: [
          'A. 甲燈泡較亮 (100W)',
          'B. 乙燈泡較亮 (50W)',
          'C. 兩燈泡一樣亮',
          'D. 兩燈泡皆燒毀不亮',
        ],
        answer: 1,
        solution:
          '【解析】\n' +
          '1. 由額定規格 $P = \\frac{V^2}{R} \\implies R = \\frac{V^2}{P}$。\n' +
          '甲電阻 $R_\\text{甲} = \\frac{110^2}{100} = 121\\,\\Omega$；乙電阻 $R_\\text{乙} = \\frac{110^2}{50} = 242\\,\\Omega$ ($R_\\text{乙} > R_\\text{甲}$)。\n' +
          '2. 兩燈泡「串聯」時電流 $I$ 相同，實際消耗電功率 $P = I^2 R$。\n' +
          '因 $R_\\text{乙} > R_\\text{甲}$，故乙消耗電功率大於甲，乙燈泡較亮！故選 (B)。',
        hint: '串聯電流相同，亮度看 $P = I^2 R$，電阻大的較亮。',
        competency: '自-J-B5: 靈活運用電阻計算與電功率公式比較電路亮度。',
      },
    ],
  },
]

// -------------------------------------------------------------
// G10 高中十年級 (必修物理 - 6 單元)
// -------------------------------------------------------------
const G10_UNITS: PhysicsUnit[] = [
  {
    id: 1,
    key: 'g10_u1',
    title: '科學的態度與方法與物質測量',
    subtitle: 'SI 基本單位制、數量級估計與實驗誤差分析',
    strand: 'modern',
    band: '高中必修',
    targetExam: '學科能力測驗 (GSAT)',
    totalPoints: 100,
    suggestedLab: 'lab-measurement-error',
    concepts: [
      '國際單位制 (SI) 的七個基本單位：公尺 ($\\text{m}$)、公斤 ($\\text{kg}$)、秒 ($\\text{s}$)、安培 ($\\text{A}$)、克耳文 ($\\text{K}$)、莫耳 ($\\text{mol}$)、燭光 ($\\text{cd}$)。',
      '數量級估計 (Order of Magnitude)：若數值寫為 $a \\times 10^n$，當 $a < \\sqrt{10} \\approx 3.162$ 時取 $10^n$；當 $a \\ge \\sqrt{10}$ 時取 $10^{n+1}$。',
      '測量與誤差：系統誤差 (儀器校準、實驗方法偏差) 與偶然誤差 (環境隨機擾動、讀數估計誤差)。有效數字運算規則。',
    ],
    questions: [
      {
        id: 'g10_u1_q1',
        title: '國際單位制 SI 基本單位判別',
        strand: 'modern',
        type: 'choice',
        difficulty: 1,
        question: '下列何者「全部」為國際單位制 (SI) 中的基本物理量單位？',
        options: [
          'A. 公尺 (m)、牛頓 (N)、秒 (s)',
          'B. 公斤 (kg)、公尺 (m)、安培 (A)',
          'C. 焦耳 (J)、克耳文 (K)、莫耳 (mol)',
          'D. 庫侖 (C)、公斤 (kg)、燭光 (cd)',
        ],
        answer: 1,
        solution:
          '【解析】SI 七大基本單位為：長度 (m)、質量 (kg)、時間 (s)、電流 (A)、溫度 (K)、物質量 (mol)、發光強度 (cd)。\n' +
          '牛頓 (N)、焦耳 (J)、庫侖 (C) 皆為導出單位 ($1\\text{ N} = 1\\text{ kg}\\cdot\\text{m}/\\text{s}^2$, $1\\text{ C} = 1\\text{ A}\\cdot\\text{s}$)。故選 (B)。',
        hint: '回想 SI 制的 7 大基本量：m, kg, s, A, K, mol, cd。',
        competency: '物-U-A1: 認識科學基本量與測量單位標準。',
      },
      {
        id: 'g10_u1_q2',
        title: '數量級估計與日常生活應用',
        strand: 'modern',
        type: 'choice',
        difficulty: 2,
        question: '已知正常成年人每次心跳約射出 $70\\text{ mL}$ 的血液，平均心率每分鐘 72 次。試估算一個人一生 (以 80 歲計算) 心臟輸出的總血量數量級約為多少公升 ($\\text{L}$)？',
        options: [
          'A. $10^6\\text{ L}$',
          'B. $10^7\\text{ L}$',
          'C. $10^8\\text{ L}$',
          'D. $10^9\\text{ L}$',
        ],
        answer: 2,
        solution:
          '【解析】\n' +
          '1. 一年的心跳總次數：$72 \\times 60 \\times 24 \\times 365 \\approx 3.78 \\times 10^7$ 次。\n' +
          '2. 80 年心跳總次數：$80 \\times 3.78 \\times 10^7 \\approx 3.03 \\times 10^9$ 次。\n' +
          '3. 總射血量：$3.03 \\times 10^9 \\times 0.070\\text{ L} \\approx 2.12 \\times 10^8\\text{ L}$。\n' +
          '4. 因 $2.12 < \\sqrt{10} \\approx 3.16$，數量級取 $10^8\\text{ L}$。故選 (C)。',
        hint: '先算 80 年總分鐘數，再乘每分鐘射血量 $72 \\times 0.07\\text{ L}$。',
        competency: '物-U-B1: 運用數量級估計與科學記號解決日常生活實際問題。',
      },
    ],
  },
  {
    id: 2,
    key: 'g10_u2',
    title: '物質的組成與基本交互作用',
    subtitle: '原子核內部構造、夸克模型與四大基本作用力',
    strand: 'modern',
    band: '高中必修',
    targetExam: '學科能力測驗 (GSAT)',
    totalPoints: 100,
    suggestedLab: 'lab-fundamental-forces',
    concepts: [
      '物質結構階層：原子 (約 $10^{-10}\\text{ m}$) ➜ 原子核 (約 $10^{-15}\\text{ m}$) ➜ 質子/中子 ➜ 夸克 (上夸克 $u$ 帶電 $+2/3 e$，下夸克 $d$ 帶電 $-1/3 e$)。質子為 $uud$，中子為 $udd$。',
      '四大基本交互作用力：\n' +
        '1. 重力 (Gravitational force)：長程力，強度最弱 ($10^{-38}$)，決定天體運行。\n' +
        '2. 電磁力 (Electromagnetic force)：長程力，強度次強 ($10^{-2}$)，決定原子分子鍵結與一切日常接觸力。\n' +
        '3. 強作用力 (Strong force)：短程力 ($< 10^{-15}\\text{ m}$)，強度最強 ($1$)，克服質子間靜電斥力束縛夸克與核子。\n' +
        '4. 弱作用力 (Weak force)：極短程力 ($< 10^{-18}\\text{ m}$)，強度約 $10^{-13}$，主導放射性 $\\beta$ 衰變與恆星核融合。',
    ],
    questions: [
      {
        id: 'g10_u2_q1',
        title: '夸克組成與電荷守恆分析',
        strand: 'modern',
        type: 'choice',
        difficulty: 2,
        question: '質子由兩個上夸克 ($u$) 與一個下夸克 ($d$) 組成，中子由一個上夸克 ($u$) 與兩個下夸克 ($d$) 組成。若上夸克帶電量為 $+2/3 e$，則下列關於中子與下夸克帶電量的敘述何者正確？',
        options: [
          'A. 下夸克帶電量為 $-1/3 e$，中子淨電量為 $0$',
          'B. 下夸克帶電量為 $+1/3 e$，中子淨電量為 $+1 e$',
          'C. 下夸克帶電量為 $-2/3 e$，中子淨電量為 $-1 e$',
          'D. 下夸克帶電量為 $+2/3 e$，中子淨電量為 $+2 e$',
        ],
        answer: 0,
        solution:
          '【解析】\n' +
          '質子淨電量 $+1 e = 2(+2/3 e) + q_d = +4/3 e + q_d \\implies q_d = -1/3 e$。\n' +
          '中子由 $udd$ 組成，其總電量為 $(+2/3 e) + (-1/3 e) + (-1/3 e) = 0$。故選 (A)。',
        hint: '質子 $uud$ 電量 $+1e$，中子 $udd$ 電量 $0$。',
        competency: '物-U-A2: 認識夸克模型與亞原子微觀粒子結構。',
      },
    ],
  },
  {
    id: 3,
    key: 'g10_u3',
    title: '物體的運動與牛頓運動定律',
    subtitle: '等加速度運動、v-t 圖形特徵與天體萬有引力',
    strand: 'mechanics',
    band: '高中必修',
    targetExam: '學科能力測驗 (GSAT)',
    totalPoints: 100,
    suggestedLab: 'lab-newton-motion',
    concepts: [
      '運動圖形關鍵：$x-t$ 圖斜率為瞬時速度 $v$；$v-t$ 圖斜率為加速度 $a$，$v-t$ 圖與時間軸所夾面積為位移 $\\Delta x$。',
      '等加速度運動三大公式：\n' +
        '1. $v = v_0 + at$\n' +
        '2. $\\Delta x = v_0 t + \\frac{1}{2}at^2$\n' +
        '3. $v^2 = v_0^2 + 2a\\Delta x$',
      '牛頓三大運動定律與萬有引力：克卜勒第三定律 $\\frac{T^2}{R^3} = \\text{定值}$。',
    ],
    questions: [
      {
        id: 'g10_u3_q1',
        title: 'v-t 運動圖形面積與斜率分析',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 2,
        question: '一輛電動車自靜止出發做直線運動，其 $v-t$ 圖中，在 $t=0$ 到 $t=4\\text{ s}$ 內以等加速度增加到 $20\\text{ m/s}$，隨後 $t=4$ 到 $t=10\\text{ s}$ 維持 $20\\text{ m/s}$ 等速行駛。試問前 10 秒內電動車行駛之總位移為多少公尺？',
        options: ['A. 120 m', 'B. 140 m', 'C. 160 m', 'D. 200 m'],
        answer: 2,
        solution:
          '【解析】$v-t$ 圖所夾梯形面積即為總位移 $\\Delta x = \\frac{(6 + 10) \\times 20}{2} = 160\\text{ m}$。故選 (C)。',
        hint: '$v-t$ 圖與時間軸所夾面積代表位移。',
        competency: '物-U-B3: 判讀並計算速度-時間圖形之物理量。',
      },
    ],
  },
  {
    id: 4,
    key: 'g10_u4',
    title: '電與磁的統一與光',
    subtitle: '電流磁效應、法拉第電磁感應與電磁波家族',
    strand: 'electromagnetism',
    band: '高中必修',
    targetExam: '學科能力測驗 (GSAT)',
    totalPoints: 100,
    suggestedLab: 'lab-faraday-induction',
    concepts: [
      '法拉第電磁感應定律：$\\mathcal{E} = -N\\frac{\\Delta \\Phi_B}{\\Delta t}$。',
      '冷次定律：感應電流所建立的磁場，必反抗原磁通量的變化（增反減同、來拒去留）。',
      '電磁波譜：無線電波 ➜ 微波 ➜ 紅外線 ➜ 可見光 ➜ 紫外線 ➜ X 射線 ➜ $\\gamma$ 射線（真空速率皆為 $c$）。',
    ],
    questions: [
      {
        id: 'g10_u4_q1',
        title: '冷次定律感應電流方向判讀',
        strand: 'electromagnetism',
        type: 'choice',
        difficulty: 2,
        question: '將一條形磁鐵 N 極垂直快速插向水平銅線圈。由上往下俯視線圈，感應電流方向為何？受力方向為何？',
        options: [
          'A. 順時針，向下排斥力',
          'B. 逆時針，向下排斥力',
          'C. 順時針，向上吸引力',
          'D. 逆時針，向上吸引力',
        ],
        answer: 1,
        solution:
          '【解析】N 極向下接近，感應磁場向上抵消（來拒），右手螺旋得電流為逆時針方向；線圈受向下排斥力。故選 (B)。',
        hint: '增反減同，右手螺旋判斷逆時針。',
        competency: '物-U-A3: 能以冷次定律分析電磁感應受力與電流方向。',
      },
    ],
  },
  {
    id: 5,
    key: 'g10_u5',
    title: '能量形式與微觀熱現象',
    subtitle: '功與動能、力學能守恆、質能互換與熱力學概念',
    strand: 'thermodynamics',
    band: '高中必修',
    targetExam: '學科能力測驗 (GSAT)',
    totalPoints: 100,
    suggestedLab: 'lab-energy-conservation',
    concepts: [
      '力學能守恆：在只有重力/彈力作功時，$E_{\\text{total}} = E_k + U = \\text{定值}$。',
      '愛因斯坦質能互換：$E = mc^2$ 或 $\\Delta E = \\Delta m \\cdot c^2$。',
      '微觀熱現象：溫度是分子平均動能的巨觀表現；$1\\text{ cal} \\approx 4.186\\text{ J}$。',
    ],
    questions: [
      {
        id: 'g10_u5_q1',
        title: '太陽核融合質能互換計算',
        strand: 'modern',
        type: 'fill',
        difficulty: 3,
        question: '太陽每秒因核融合損失 $4.0 \\times 10^9\\text{ kg}$ 質量，取 $c = 3.0 \\times 10^8\\text{ m/s}$，每秒輻射總能量為多少焦耳 (J)？(輸入科學記號如 3.6e26)',
        answer: '3.6e26',
        solution: '【解析】$\\Delta E = \\Delta m \\cdot c^2 = (4.0 \\times 10^9) \\times (3.0 \\times 10^8)^2 = 3.6 \\times 10^{26}\\text{ J}$。',
        hint: '代入公式 $E = mc^2$。',
        competency: '物-U-C2: 應用質能當量公式分析核反應釋能。',
      },
    ],
  },
  {
    id: 6,
    key: 'g10_u6',
    title: '量子現象與近代科技',
    subtitle: '普朗克光子假說、光電效應、原子光譜與半導體元件',
    strand: 'modern',
    band: '高中必修',
    targetExam: '學科能力測驗 (GSAT)',
    totalPoints: 100,
    suggestedLab: 'lab-photoelectric-intro',
    concepts: [
      '光子能量：$E = h\\nu = \\frac{hc}{\\lambda}$（光強決定光子數，頻率決定光子動能）。',
      '氫原子能階：$E_n = -\\frac{13.6}{n^2}\\text{ eV}$，躍遷輻射光子 $h\\nu = E_2 - E_1$。',
      '半導體與超導體：P-N 二極體、LED 光電轉換、邁斯納效應完全抗磁性。',
    ],
    questions: [
      {
        id: 'g10_u6_q1',
        title: '光電效應光強與頻率本質',
        strand: 'modern',
        type: 'choice',
        difficulty: 2,
        question: '單色光照射金屬產生光電效應，若頻率不變僅光強增為 2 倍，何者正確？',
        options: [
          'A. 逸出光電子最大動能變為 2 倍',
          'B. 單位時間逸出光電子數變為 2 倍',
          'C. 金屬功函數變為 2 倍',
          'D. 截止電壓變為 2 倍',
        ],
        answer: 1,
        solution: '【解析】光強加倍使入射光子數加倍，單位時間逸出的光電子數加倍；光電子最大動能與截止電壓不變。故選 (B)。',
        hint: '光強影響光子數目，頻率影響光子能量。',
        competency: '物-U-A4: 辨析光電效應光強與頻率的微觀意義。',
      },
    ],
  },
]

// -------------------------------------------------------------
// G11 高中十一年級 (選修物理 力學與波動 - 7 單元)
// -------------------------------------------------------------
const G11_UNITS: PhysicsUnit[] = [
  {
    id: 1,
    key: 'g11_u1',
    title: '直線運動與平面拋體運動',
    subtitle: '等加速度公式、二維向量分解與斜向拋射軌跡',
    strand: 'mechanics',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-projectile-motion',
    concepts: [
      '斜向拋射 (仰角 $\\theta$)：$T = \\frac{2v_0\\sin\\theta}{g}$，$H = \\frac{(v_0\\sin\\theta)^2}{2g}$，$R = \\frac{v_0^2\\sin(2\\theta)}{g}$。',
      '水平拋射軌跡：拋物線 $y = \\frac{g}{2v_0^2}x^2$。',
    ],
    questions: [
      {
        id: 'g11_u1_q1',
        title: '斜向拋射水平射程計算',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 3,
        question: '以 $v_0 = 20\\text{ m/s}$、仰角 $30^\\circ$ 從地面斜向拋出質點 ($g=10\\text{ m/s}^2$)，著地水平射程為何？',
        options: ['A. $10\\sqrt{3}\\text{ m}$', 'B. $20\\sqrt{3}\\text{ m}$', 'C. $30\\text{ m}$', 'D. $40\\sqrt{3}\\text{ m}$'],
        answer: 1,
        solution: '【解析】$T = \\frac{2(20\\sin 30^\\circ)}{10} = 2\\text{ s}$；$R = (20\\cos 30^\\circ) \\times 2 = 20\\sqrt{3}\\text{ m}$。故選 (B)。',
        hint: '水平速度乘飛行時間 $T = 2v_y / g$。',
        competency: '物-S-A1: 具備二維拋體運動向量正交分解能力。',
      },
    ],
  },
  {
    id: 2,
    key: 'g11_u2',
    title: '牛頓運動定律與動態力學分析',
    subtitle: '摩擦力模型、斜面滑塊、連接體與假想慣性力',
    strand: 'mechanics',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-atwood-machine',
    concepts: [
      '連接體系統法：$a = \\frac{\\text{運動方向淨外力}}{\\text{系統總質量}}$；求內部張力再用隔離法。',
      '等效重力場：$\\vec{g}_{\\text{eff}} = \\vec{g} - \\vec{a}$。',
    ],
    questions: [
      {
        id: 'g11_u2_q1',
        title: '阿特伍德機連接體張力與加速度',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 3,
        question: '滑輪兩端掛 $m_1 = 3\\text{ kg}$ 與 $m_2 = 2\\text{ kg}$ ($g=10\\text{ m/s}^2$)，木塊加速度與繩張力為何？',
        options: [
          'A. $a = 2\\text{ m/s}^2, T = 24\\text{ N}$',
          'B. $a = 2\\text{ m/s}^2, T = 20\\text{ N}$',
          'C. $a = 1\\text{ m/s}^2, T = 24\\text{ N}$',
          'D. $a = 5\\text{ m/s}^2, T = 30\\text{ N}$',
        ],
        answer: 0,
        solution: '【解析】$a = \\frac{(3 - 2) \\times 10}{3 + 2} = 2\\text{ m/s}^2$；$T = m_2(g + a) = 2(10 + 2) = 24\\text{ N}$。故選 (A)。',
        hint: '系統法求 $a$，隔離法求 $T$。',
        competency: '物-S-A2: 運用系統法與隔離法分析連接體。',
      },
    ],
  },
  {
    id: 3,
    key: 'g11_u3',
    title: '靜力平衡與力矩分析',
    subtitle: '力矩定義、轉動平衡條件、重心質心與傾倒滑動判定',
    strand: 'mechanics',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-torque-equilibrium',
    concepts: [
      '剛體平衡：$\\sum \\vec{F} = 0$ 且 $\\sum \\vec{\\tau} = 0$。',
      '斜面上滑動 $\\tan\\theta > \\mu_s$；翻倒條件為重力作用線越出支撐底邊。',
    ],
    questions: [
      {
        id: 'g11_u3_q1',
        title: '長梯靠牆平衡臨界角分析',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 4,
        question: '均勻長梯靠在光滑鉛直牆面上，地面靜摩擦係數 $\\mu_s$。長梯與地面夾角 $\\theta$ 欲維持平衡之條件？',
        options: [
          'A. $\\tan\\theta \\ge \\frac{1}{2\\mu_s}$',
          'B. $\\tan\\theta \\le \\frac{1}{2\\mu_s}$',
          'C. $\\tan\\theta \\ge \\frac{1}{\\mu_s}$',
          'D. $\\sin\\theta \\ge 2\\mu_s$',
        ],
        answer: 0,
        solution: '【解析】對梯腳取力矩平衡：$W(\\frac{L}{2}\\cos\\theta) = N_1(L\\sin\\theta) \\implies N_1 = \\frac{W}{2\\tan\\theta} \\le \\mu_s W \\implies \\tan\\theta \\ge \\frac{1}{2\\mu_s}$。故選 (A)。',
        hint: '取梯腳為支點列力矩平衡。',
        competency: '物-S-B1: 剛體力矩平衡與臨界條件推導。',
      },
    ],
  },
  {
    id: 4,
    key: 'g11_u4',
    title: '動量守恆與碰撞動力學',
    subtitle: '衝量動量定理、質心運動、一維彈碰與非彈性碰撞',
    strand: 'mechanics',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-collision-cart',
    concepts: [
      '動量守恆：$\\sum \\vec{p}_i = \\sum \\vec{p}_f$。',
      '一維彈碰公式：$v_1\' = \\frac{m_1 - m_2}{m_1 + m_2}v_1 + \\frac{2m_2}{m_1 + m_2}v_2$，$v_1 - v_2 = -(v_1\' - v_2\')$。',
    ],
    questions: [
      {
        id: 'g11_u4_q1',
        title: '一維彈性碰撞末速公式',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 3,
        question: '$2\\text{ kg}$ 球 A 以 $6\\text{ m/s}$ 正面彈性碰撞靜止之 $1\\text{ kg}$ 球 B，碰撞後兩球速度？',
        options: [
          'A. $v_1\' = 2\\text{ m/s}, v_2\' = 8\\text{ m/s}$',
          'B. $v_1\' = 1\\text{ m/s}, v_2\' = 6\\text{ m/s}$',
          'C. $v_1\' = 3\\text{ m/s}, v_2\' = 6\\text{ m/s}$',
          'D. $v_1\' = 0\\text{ m/s}, v_2\' = 12\\text{ m/s}$',
        ],
        answer: 0,
        solution: '【解析】$v_1\' = \\frac{2 - 1}{3}(6) = 2\\text{ m/s}$，$v_2\' = \\frac{2(2)}{3}(6) = 8\\text{ m/s}$。故選 (A)。',
        hint: '代入一維彈碰公式。',
        competency: '物-S-A3: 一維彈性碰撞公式計算。',
      },
    ],
  },
  {
    id: 5,
    key: 'g11_u5',
    title: '萬有引力與天體運動',
    subtitle: '重力場與重力位能、圓軌道人造衛星、束縛能與逃逸速度',
    strand: 'mechanics',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-orbital-mechanics',
    concepts: [
      '圓軌道衛星能量黃金比：$E_k : U : E = 1 : -2 : -1$ ($E_k = \\frac{GMm}{2r}, U = -\\frac{GMm}{r}, E = -\\frac{GMm}{2r}$)。',
      '逃逸速度：$v_{\\text{esc}} = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2}v_{\\text{orbit}}$。',
    ],
    questions: [
      {
        id: 'g11_u5_q1',
        title: '人造衛星軌道動能位能比例',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 3,
        question: '圓軌道衛星之動能 $E_k$、重力位能 $U$ 與總能量 $E$ 比例為何？',
        options: [
          'A. $E_k : U : E = 1 : -2 : -1$',
          'B. $E_k : U : E = 1 : -1 : 0$',
          'C. $E_k : U : E = 2 : -1 : 1$',
          'D. $E_k : U : E = 1 : 2 : 3$',
        ],
        answer: 0,
        solution: '【解析】黃金比例 $E_k : U : E = 1 : -2 : -1$。故選 (A)。',
        hint: '動能為正，位能為負且為動能2倍，總能為負且等於-動能。',
        competency: '物-S-B2: 衛星軌道能量黃金比例。',
      },
    ],
  },
  {
    id: 6,
    key: 'g11_u6',
    title: '功、能量與簡諧運動 (SHM)',
    subtitle: '保守力與位能、彈簧振子振盪、單擺週期與能量守恆',
    strand: 'mechanics',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-shm-oscillation',
    concepts: [
      'SHM 週期：$T = 2\\pi\\sqrt{\\frac{m}{k}}$；單擺 $T = 2\\pi\\sqrt{\\frac{L}{g}}$。',
      'SHM 能量守恆：$E = \\frac{1}{2}mv^2 + \\frac{1}{2}kx^2 = \\frac{1}{2}kA^2$。',
    ],
    questions: [
      {
        id: 'g11_u6_q1',
        title: 'SHM 最大速率與能量守恆',
        strand: 'mechanics',
        type: 'choice',
        difficulty: 3,
        question: '$m = 0.5\\text{ kg}$ 接在 $k = 50\\text{ N/m}$ 彈簧上，振幅 $0.2\\text{ m}$，通過平衡點之最大速率？',
        options: ['A. 1.0 m/s', 'B. 2.0 m/s', 'C. 4.0 m/s', 'D. 10 m/s'],
        answer: 1,
        solution: '【解析】$\\omega = \\sqrt{\\frac{50}{0.5}} = 10\\text{ rad/s}$，$v_{\\max} = R\\omega = 0.2 \\times 10 = 2.0\\text{ m/s}$。故選 (B)。',
        hint: '$v_{\\max} = R\\sqrt{k/m}$。',
        competency: '物-S-A4: 簡諧運動角頻率與極值計算。',
      },
    ],
  },
  {
    id: 7,
    key: 'g11_u7',
    title: '波動力學、聲波與都卜勒效應',
    subtitle: '波的傳播疊加、弦線管柱駐波、共鳴與都卜勒效應頻率公式',
    strand: 'waves_optics',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-standing-waves',
    concepts: [
      '駐波：相鄰節點間距 $\\frac{\\lambda}{2}$。',
      '都卜勒效應：$f\' = f \\left(\\frac{v \\pm v_O}{v \\mp v_S}\\right)$。',
    ],
    questions: [
      {
        id: 'g11_u7_q1',
        title: '都卜勒效應波源接近視頻率',
        strand: 'waves_optics',
        type: 'choice',
        difficulty: 3,
        question: '聲速 $340\\text{ m/s}$，鳴笛車以 $34\\text{ m/s}$ ($f=900\\text{ Hz}$) 駛向靜止觀察者，聽到頻率？',
        options: ['A. 818 Hz', 'B. 900 Hz', 'C. 1000 Hz', 'D. 1100 Hz'],
        answer: 2,
        solution: '【解析】$f\' = 900 \\times \\frac{340}{340 - 34} = 900 \\times \\frac{340}{306} = 1000\\text{ Hz}$。故選 (C)。',
        hint: '波源接近分母減。',
        competency: '物-S-A5: 都卜勒效應公式計算。',
      },
    ],
  },
]

// -------------------------------------------------------------
// G12 高中十二年級 (選修物理 電磁學與近代物理 - 6 單元)
// -------------------------------------------------------------
const G12_UNITS: PhysicsUnit[] = [
  {
    id: 1,
    key: 'g12_u1',
    title: '熱學與氣體分子動力論',
    subtitle: '理想氣體方程式、方均根速率、分子動能與熱力學第一定律',
    strand: 'thermodynamics',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-gas-kinetics',
    concepts: [
      '氣體分子動力論：$\\bar{E}_k = \\frac{3}{2}k_B T$，$v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}}$。',
      '熱力學第一定律：$Q = \\Delta U + W$。',
    ],
    questions: [
      {
        id: 'g12_u1_q1',
        title: '氣體分子方均根速率升溫比例',
        strand: 'thermodynamics',
        type: 'choice',
        difficulty: 3,
        question: '氦氣由 $27^\\circ\\text{C}$ 升溫至 $327^\\circ\\text{C}$，方均根速率變為原本多少倍？',
        options: ['A. $\\sqrt{2}$ 倍', 'B. 2 倍', 'C. $2\\sqrt{3}$ 倍', 'D. 4 倍'],
        answer: 0,
        solution: '【解析】$T_1 = 300\\text{ K}, T_2 = 600\\text{ K}$，$\\frac{v_2}{v_1} = \\sqrt{\\frac{600}{300}} = \\sqrt{2}$ 倍。故選 (A)。',
        hint: '絕對溫度換算 $T = ^\\circ\\text{C} + 273$。',
        competency: '物-S-A6: 氣體分子動力論與絕對溫度換算。',
      },
    ],
  },
  {
    id: 2,
    key: 'g12_u2',
    title: '幾何光學與物理光學',
    subtitle: '折射全反射、薄透鏡成像、楊氏雙狹縫干涉與單狹縫繞射',
    strand: 'waves_optics',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-double-slit-interference',
    concepts: [
      '雙狹縫干涉條紋間距：$\\Delta y = \\frac{\\lambda L}{d}$。',
      '單狹縫繞射中央亮帶寬度：$W_0 = \\frac{2\\lambda L}{b}$。',
    ],
    questions: [
      {
        id: 'g12_u2_q1',
        title: '雙狹縫干涉相鄰條紋寬度',
        strand: 'waves_optics',
        type: 'choice',
        difficulty: 3,
        question: '雙狹縫 $d = 0.2\\text{ mm}$，屏距 $L = 1.0\\text{ m}$，波長 $\\lambda = 600\\text{ nm}$，相鄰亮紋間距？',
        options: ['A. 0.3 mm', 'B. 1.5 mm', 'C. 3.0 mm', 'D. 6.0 mm'],
        answer: 2,
        solution: '【解析】$\\Delta y = \\frac{(6 \\times 10^{-7}) \\times 1}{0.2 \\times 10^{-3}} = 3.0 \\times 10^{-3}\\text{ m} = 3.0\\text{ mm}$。故選 (C)。',
        hint: '$\\Delta y = \\lambda L / d$。',
        competency: '物-S-A7: 雙狹縫干涉條紋間距計算。',
      },
    ],
  },
  {
    id: 3,
    key: 'g12_u3',
    title: '靜電學、電場與電位',
    subtitle: '庫侖定律、均勻電場帶電粒子運動、電位能與電容儲能',
    strand: 'electromagnetism',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-electric-field-mapping',
    concepts: [
      '電位差作功：$E_k = qV$。',
      '平行板電容儲能：$U_C = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C}$。',
    ],
    questions: [
      {
        id: 'g12_u3_q1',
        title: '電位差加速粒子動能 eV 換算',
        strand: 'electromagnetism',
        type: 'choice',
        difficulty: 2,
        question: '$+2e$ 的 $\\alpha$ 粒子經 $500\\text{ V}$ 加速，獲得動能為多少 eV？',
        options: ['A. 250 eV', 'B. 500 eV', 'C. 1000 eV', 'D. 2000 eV'],
        answer: 2,
        solution: '【解析】$E_k = qV = (2e) \\times 500\\text{ V} = 1000\\text{ eV}$。故選 (C)。',
        hint: '$E_k = qV$。',
        competency: '物-S-B3: 電位差與動能 eV 換算。',
      },
    ],
  },
  {
    id: 4,
    key: 'g12_u4',
    title: '電流、電阻與直流電路',
    subtitle: '微觀電流模型、電阻率溫度係數、克希荷夫定律與 RC 暫態',
    strand: 'electromagnetism',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-kirchhoff-circuit',
    concepts: [
      '克希荷夫定律：$\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$ (KCL)，$\\sum \\Delta V = 0$ (KVL)。',
      'RC 暫態：時間常數 $\\tau = RC$。',
    ],
    questions: [
      {
        id: 'g12_u4_q1',
        title: '三電阻並聯等效電阻與電流',
        strand: 'electromagnetism',
        type: 'choice',
        difficulty: 4,
        question: '$2\\,\\Omega, 3\\,\\Omega, 6\\,\\Omega$ 並聯接 $12\\text{ V}$ 直流電源，等效電阻與總電流？',
        options: [
          'A. $R_{\\text{eq}} = 1\\,\\Omega, I_{\\text{total}} = 12\\text{ A}$',
          'B. $R_{\\text{eq}} = 2\\,\\Omega, I_{\\text{total}} = 6\\text{ A}$',
          'C. $R_{\\text{eq}} = 11\\,\\Omega, I_{\\text{total}} = 1.09\\text{ A}$',
          'D. $R_{\\text{eq}} = 3\\,\\Omega, I_{\\text{total}} = 4\\text{ A}$',
        ],
        answer: 0,
        solution: '【解析】$\\frac{1}{R_{\\text{eq}}} = \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{6} = 1 \\implies R_{\\text{eq}} = 1\\,\\Omega$；$I = \\frac{12}{1} = 12\\text{ A}$。故選 (A)。',
        hint: '並聯電阻倒數相加。',
        competency: '物-S-A8: 並聯電阻與歐姆定律計算。',
      },
    ],
  },
  {
    id: 5,
    key: 'g12_u5',
    title: '電流磁效應與電磁感應',
    subtitle: '勞侖茲力迴旋運動、載流導線受力、法拉第感應與動生電動勢',
    strand: 'electromagnetism',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-cyclotron-lorentz',
    concepts: [
      '磁場迴旋運動：$R = \\frac{mv}{qB} = \\frac{p}{qB}$，$T = \\frac{2\\pi m}{qB}$。',
      '動生電動勢：$\\mathcal{E} = BLv$。',
    ],
    questions: [
      {
        id: 'g12_u5_q1',
        title: '同動能質子與 alpha 粒子磁場半徑比',
        strand: 'electromagnetism',
        type: 'choice',
        difficulty: 3,
        question: '動能相同的質子 ($m, +e$) 與 $\\alpha$ 粒子 ($4m, +2e$) 垂直射入均勻磁場，半徑比 $R_p : R_\\alpha$？',
        options: ['A. 1 : 1', 'B. 1 : 2', 'C. 1 : 4', 'D. 2 : 1'],
        answer: 0,
        solution: '【解析】$R = \\frac{\\sqrt{2mE_k}}{qB} \\propto \\frac{\\sqrt{m}}{q}$；質子 $\\frac{\\sqrt{1}}{1} = 1$，$\\alpha$ 粒子 $\\frac{\\sqrt{4}}{2} = 1$，半徑比 $1:1$。故選 (A)。',
        hint: '半徑與 $\\sqrt{m}/q$ 成正比。',
        competency: '物-S-B4: 帶電粒子磁場迴旋半徑比例分析。',
      },
    ],
  },
  {
    id: 6,
    key: 'g12_u6',
    title: '原子結構與量子近代物理',
    subtitle: '黑體輻射、愛因斯坦光電方程式、波耳原子模型與德布羅意物質波',
    strand: 'modern',
    band: '高中選修',
    targetExam: '分科測驗 (AST)',
    totalPoints: 100,
    suggestedLab: 'lab-bohr-hydrogen-model',
    concepts: [
      '愛因斯坦光電方程式：$h\\nu = W + eV_s$。',
      '德布羅意物質波：$\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2mE_k}}$。',
    ],
    questions: [
      {
        id: 'g12_u6_q1',
        title: '電子物質波波長與加速電壓公式',
        strand: 'modern',
        type: 'choice',
        difficulty: 4,
        question: '靜止電子經電位差 $V$ 加速後，其德布羅意物質波長 $\\lambda$ 為何？',
        options: [
          'A. $\\lambda = \\frac{h}{\\sqrt{2m e V}}$',
          'B. $\\lambda = \\frac{h}{2m e V}$',
          'C. $\\lambda = \\frac{\\sqrt{2m e V}}{h}$',
          'D. $\\lambda = \\frac{h}{\\sqrt{m e V}}$',
        ],
        answer: 0,
        solution: '【解析】$E_k = eV \\implies p = \\sqrt{2m(eV)} \\implies \\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2meV}}$。故選 (A)。',
        hint: '$\\lambda = h/p = h/\\sqrt{2mE_k}$。',
        competency: '物-S-A9: 物質波波長解析式推導。',
      },
    ],
  },
]

/**
 * 臺灣 108 課綱完整物理學程 (國中 G7~G9 + 高中 G10~G12)
 */
export const PHYSICS_GRADES: Record<PhysicsGradeId, PhysicsGradeInfo> = {
  g7: {
    id: 'g7',
    stage: 'junior',
    name: '國中七年級 (國一物理基礎)',
    nameEn: 'Grade 7 Physics Foundation',
    band: '國中基礎',
    description: '長度體積測量與誤差估計、質量密度與浮沉特性、溫度比熱與熱量傳播。',
    targetExam: '國中教育會考 (CAP)',
    units: G7_UNITS,
    labs: [
      { id: 'lab-j7-measurement', name: '量筒讀數與排水法測量', description: '操作排水法測量不規則固體體積與讀數估計值。' },
      { id: 'lab-j7-density', name: '質量體積 M-V 密度實驗室', description: '測量不同液體與金屬塊密度並繪製 M-V 直線圖。' },
      { id: 'lab-j7-specific-heat', name: '比熱與熱平衡混合模擬', description: '不同質量與初溫液體混合熱平衡過程動態呈現。' },
    ],
  },
  g8: {
    id: 'g8',
    stage: 'junior',
    name: '國中八年級 (國二物理進階)',
    nameEn: 'Grade 8 Physics Intermediate',
    band: '國中進階',
    description: '波動聲速與回聲、光的反射折射與透鏡成像、虎克定律與兩力平衡、液壓氣壓與阿基米德浮力。',
    targetExam: '國中教育會考 (CAP)',
    units: G8_UNITS,
    labs: [
      { id: 'lab-j8-sound-wave', name: '聲波振幅頻率與示波器', description: '調整音調與響度，即時觀測聲波波形與分貝變化。' },
      { id: 'lab-j8-lens-optics', name: '凸透鏡光具座成像實驗室', description: '移動蠟燭物距，觀測紙屏上實像與放大鏡虛像。' },
      { id: 'lab-j8-hooke-law', name: '彈簧伸長量與虎克定律模擬', description: '懸掛不同砝碼驗證受力與伸長量成正比。' },
      { id: 'lab-j8-buoyancy-pressure', name: '阿基米德浮力與液體壓力計', description: '沉浮物體排開液體體積與水深壓力即時計算。' },
    ],
  },
  g9: {
    id: 'g9',
    stage: 'junior',
    name: '國中九年級 (國三物理衝刺)',
    nameEn: 'Grade 9 Physics Advanced (CAP)',
    band: '國中衝刺',
    description: '直線運動與速度加速度、牛頓三大運動定律、功與能力學能守恆、歐姆定律與電流磁效應。',
    targetExam: '國中教育會考 (CAP)',
    units: G9_UNITS,
    labs: [
      { id: 'lab-j9-linear-motion', name: '打點計時器與 v-t 圖分析', description: '滑車等加速度運動紙帶點距與速度時間圖換算。' },
      { id: 'lab-j9-newton-laws', name: '牛頓第二定律 F=ma 氣墊軌道', description: '調整推力與質量，驗證加速度比例關係。' },
      { id: 'lab-j9-work-energy', name: '單擺與斜面力學能守恆', description: '動能與位能動態轉換及機械效率圖解。' },
      { id: 'lab-j9-circuit-magnetism', name: '基本電路與安培定則模擬', description: '串並聯電路電壓電流表讀數與磁針偏轉方向。' },
    ],
  },
  g10: {
    id: 'g10',
    stage: 'senior',
    name: '高中十年級 (高一必修物理)',
    nameEn: 'Grade 10 Physics (Required)',
    band: '高中必修',
    description: '科學的態度與方法、物質組成與四大基本交互作用、物體運動定律、電與磁的統一、能量與微觀熱現象、量子現象與近代科技。',
    targetExam: '學科能力測驗 (GSAT)',
    units: G10_UNITS,
    labs: [
      { id: 'lab-measurement-error', name: '測量與誤差分析實驗室', description: '游標卡尺、螺旋測微器讀數與有效數字估計。' },
      { id: 'lab-fundamental-forces', name: '宇宙四大基本交互作用模擬', description: '微觀原子核尺度強弱作用力與宏觀重力電磁力對比。' },
      { id: 'lab-newton-motion', name: '牛頓運動定律與 v-t 圖分析室', description: '即時調整初速與受力，視覺化動態 v-t 圖與位移面積。' },
      { id: 'lab-faraday-induction', name: '法拉第電磁感應與冷次定律實驗室', description: '磁鐵穿過線圈之感應電流方向與磁通量圖表分析。' },
      { id: 'lab-energy-conservation', name: '單擺與力學能守恆動態模擬', description: '位能與動能即時能量長條圖轉換。' },
      { id: 'lab-photoelectric-intro', name: '光電效應入門實驗室', description: '調整光強與波長，觀察光電子逸出與截止電壓。' },
    ],
  },
  g11: {
    id: 'g11',
    stage: 'senior',
    name: '高中十一年級 (高二選修物理 力學與波動)',
    nameEn: 'Grade 11 Physics (Mechanics & Waves)',
    band: '高中選修',
    description: '直線與平面拋體運動、牛頓力學動態分析、剛體靜力平衡與力矩、動量守恆與碰撞、萬有引力天體力學、功與簡諧運動 (SHM)、波動與都卜勒效應。',
    targetExam: '分科測驗 (AST) / 高二進階',
    units: G11_UNITS,
    labs: [
      { id: 'lab-projectile-motion', name: '斜向拋射軌跡與射程模擬器', description: '調整拋射仰角與初速，即時觀測最高點、飛行時間與射程。' },
      { id: 'lab-atwood-machine', name: '阿特伍德機與連接體力學實驗室', description: '滑輪連接體加速度與繩張力隔離體圖解。' },
      { id: 'lab-torque-equilibrium', name: '剛體靜力平衡與力矩支點實驗室', description: '任意選定參考支點，驗證合力為零與合力矩為零。' },
      { id: 'lab-collision-cart', name: '一維碰撞與動量守恆氣墊軌道', description: '彈性碰撞、完全非彈性碰撞之速度與動能損失計算。' },
      { id: 'lab-orbital-mechanics', name: '天體引力與人造衛星軌道模擬', description: '第一宇宙速度、逃逸速度與橢圓軌道克卜勒定律。' },
      { id: 'lab-shm-oscillation', name: '彈簧振子簡諧運動 (SHM) 相位圖', description: '位移、速度、加速度三角函數震盪與相空間軌跡。' },
      { id: 'lab-standing-waves', name: '弦線與管柱駐波共鳴實驗室', description: '調整諧波次數與邊界條件，即時觀察節點與腹點分佈。' },
    ],
  },
  g12: {
    id: 'g12',
    stage: 'senior',
    name: '高中十二年級 (高三選修物理 電磁學與近代物理)',
    nameEn: 'Grade 12 Physics (Electromagnetism & Modern)',
    band: '高中選修',
    description: '熱學與氣體分子動力論、幾何光學與物理光學干涉繞射、靜電學與電位電容、直流電路與克希荷夫定律、電流磁效應與動生電動勢、原子結構與德布羅意物質波。',
    targetExam: '分科測驗 (AST)',
    units: G12_UNITS,
    labs: [
      { id: 'lab-gas-kinetics', name: '氣體分子動力論 3D 碰撞盒子', description: '分子速度分佈麥克斯韋分佈與溫度方均根速率。' },
      { id: 'lab-double-slit-interference', name: '楊氏雙狹縫干涉與單狹縫繞射儀', description: '波長、狹縫寬度與屏距對條紋光強分佈的調控。' },
      { id: 'lab-electric-field-mapping', name: '等位線與電場分佈測繪模擬', description: '點電荷與帶電平板周圍空間之電場向量與電位地形圖。' },
      { id: 'lab-kirchhoff-circuit', name: '複雜直流電路克希荷夫求解器', description: '多電源多迴路節點電壓與支路電流即時分析。' },
      { id: 'lab-cyclotron-lorentz', name: '迴旋加速器與勞侖茲力偏轉室', description: '帶電粒子在均勻磁場與電場中的螺旋與圓周運動。' },
      { id: 'lab-bohr-hydrogen-model', name: '波耳氫原子能階光譜發射室', description: '電子躍遷能階、光子波長發射與光譜線對應。' },
    ],
  },
}

/** 取得特定學段包含的物理年級清單 */
export function getPhysicsGradesByStage(stage: PhysicsStage): PhysicsGradeId[] {
  if (stage === 'junior') return ['g7', 'g8', 'g9']
  return ['g10', 'g11', 'g12']
}

/** 取得所有物理年級 ID 清單 (G7~G12 共 6 個年級) */
export function getAllPhysicsGradeIds(): PhysicsGradeId[] {
  return ['g7', 'g8', 'g9', 'g10', 'g11', 'g12']
}

/** 取得指定物理年級之詳細資訊 */
export function getPhysicsGradeInfo(gradeId: PhysicsGradeId): PhysicsGradeInfo {
  return PHYSICS_GRADES[gradeId]
}

/** 取得指定年級與單元編號之物理單元 */
export function getPhysicsUnit(gradeId: PhysicsGradeId, unitId: number): PhysicsUnit | undefined {
  return PHYSICS_GRADES[gradeId]?.units.find((u) => u.id === unitId)
}

/** 取得所有物理單元總清單 */
export function getAllPhysicsUnits(): PhysicsUnit[] {
  return Object.values(PHYSICS_GRADES).flatMap((g) => g.units)
}

/** 依主題領域 (Strand) 篩選物理單元 */
export function getUnitsByPhysicsStrand(strand: PhysicsStrand): PhysicsUnit[] {
  return getAllPhysicsUnits().filter((u) => u.strand === strand)
}
