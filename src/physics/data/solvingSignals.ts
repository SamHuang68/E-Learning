/**
 * 臺灣 108 課綱物理 · 3 秒破題訊號庫 (Physics Problem-Solving Signals)
 * 涵蓋國中物理 (G7~G9) 與高中物理 (G10~G12)
 * 核心理念：
 * 「看見題目特徵訊號 ➜ 3 秒直覺決策 ➜ 直擊第一步關鍵公式」
 */

import type { PhysicsStage, PhysicsStrand } from './curriculum'

export type PhysicsSolvingSignal = {
  id: string
  stage: PhysicsStage
  gradeBand: string // e.g. "國中七年級" | "國中八年級" | "國中九年級" | "高一必修" | "高二選修" | "高三選修"
  strand: PhysicsStrand
  topic: string
  problemSignal: string // 題目出現的關鍵特徵／訊號
  threeSecondRule: string // 3 秒直覺破題法與口訣
  firstStepFormula: string // 破題第一步算式 / LaTeX
  exampleProblem: {
    question: string
    quickSolve: string
  }
}

export const PHYSICS_SOLVING_SIGNALS: PhysicsSolvingSignal[] = [
  // ===================== 國中物理階段 =====================
  {
    id: 'sig-j-density',
    stage: 'junior',
    gradeBand: '國中七年級',
    strand: 'mechanics',
    topic: '質量與密度 · M-V 斜率分離法',
    problemSignal: '題目給定量筒裝不同體積液體的總質量數據，求「液體密度」或「量筒空重」',
    threeSecondRule: '【質量差除以體積差等於密度】斜率即為液體密度，再用總重減去液體質量得空量筒重！',
    firstStepFormula: 'D_{\\text{liq}} = \\frac{\\Delta M}{\\Delta V} = \\frac{M_2 - M_1}{V_2 - V_1}, \\quad M_{\\text{empty}} = M_1 - D_{\\text{liq}}V_1',
    exampleProblem: {
      question: '裝 $20\\text{ cm}^3$ 液體時總重 $38\\text{ g}$，裝 $50\\text{ cm}^3$ 時總重 $62\\text{ g}$，求液體密度？',
      quickSolve: '$D = \\frac{62 - 38}{50 - 20} = \\frac{24}{30} = 0.8\\text{ g/cm}^3$；空量筒重 $38 - (20 \\times 0.8) = 22\\text{ g}$。',
    },
  },
  {
    id: 'sig-j-heat',
    stage: 'junior',
    gradeBand: '國中七年級',
    strand: 'thermodynamics',
    topic: '熱量與比熱 · 絕熱混合熱平衡',
    problemSignal: '題目出現「高溫物體放入低溫水中，絕熱達成熱平衡求末溫或比熱」',
    threeSecondRule: '【放熱等於吸熱】高溫放熱 $H_1 = m_1 s_1 (T_1 - T)$ 等於低溫吸熱 $H_2 = m_2 s_2 (T - T_2)$！',
    firstStepFormula: 'm_1 s_1 (T_1 - T_{\\text{final}}) = m_2 s_2 (T_{\\text{final}} - T_2)',
    exampleProblem: {
      question: '$100\\text{ g}$、$80^\\circ\\text{C}$ 熱水與 $200\\text{ g}$、$20^\\circ\\text{C}$ 冷水混合，末溫為何？',
      quickSolve: '$100(80 - T) = 200(T - 20) \\implies 80 - T = 2T - 40 \\implies 3T = 120 \\implies T = 40^\\circ\\text{C}$。',
    },
  },
  {
    id: 'sig-j-buoyancy',
    stage: 'junior',
    gradeBand: '國中八年級',
    strand: 'mechanics',
    topic: '流體力學 · 阿基米德浮力與視重',
    problemSignal: '題目出現「物體沉入液體中在彈簧秤下的讀數」或「浮體浮在液面上」',
    threeSecondRule: '【浮力等於排開液重；浮體浮力等於物重；沉體浮力等於減輕的重量】',
    firstStepFormula: 'B = V_{\\text{排}} \\times D_{\\text{液}} = W_{\\text{空氣中}} - W\'_{\\text{液體中}}',
    exampleProblem: {
      question: '體積 $50\\text{ cm}^3$ 的鋁塊完全沒入水中，在空氣中重 $135\\text{ gw}$，在水中秤得重量？',
      quickSolve: '浮力 $B = 50 \\times 1 = 50\\text{ gw}$ ➜ 水中讀數 $W\' = 135 - 50 = 85\\text{ gw}$。',
    },
  },
  {
    id: 'sig-j-circuits',
    stage: 'junior',
    gradeBand: '國中九年級',
    strand: 'electromagnetism',
    topic: '電學 · 燈泡串並聯亮度速判',
    problemSignal: '題目給定燈泡額定規格（如 110V-100W、110V-50W），比較「串聯」或「並聯」時誰比較亮',
    threeSecondRule: '【先算電阻 $R = V^2/P$；串聯電流同 $I^2R$ 電阻大較亮；並聯電壓同 $V^2/R$ 電阻小較亮】',
    firstStepFormula: 'R = \\frac{V_{\\text{額定}}^2}{P_{\\text{額定}}}, \\quad \\text{串聯: } P \\propto R, \\quad \\text{並聯: } P \\propto \\frac{1}{R}',
    exampleProblem: {
      question: '100W (甲) 與 50W (乙) 兩燈泡串聯接 110V，哪顆燈泡較亮？',
      quickSolve: '$R_\\text{乙} > R_\\text{甲}$，串聯電流相同 $P = I^2 R$，故電阻較大的乙燈泡 (50W 規格) 較亮！',
    },
  },

  // ===================== 高中物理階段 =====================
  {
    id: 'sig-kinematics-select',
    stage: 'senior',
    gradeBand: '高一必修 / 高二選修',
    strand: 'mechanics',
    topic: '直線運動 · 等加速度公式速選',
    problemSignal: '題目給定已知量與求未知量（$v_0, v, a, t, \\Delta x$），思考該用哪一個公式',
    threeSecondRule: '【缺誰用誰速算法】缺 $\\Delta x$ 用第 1 式；缺 $a$ 用平均速度；缺 $t$ 用平方差第 3 式；缺 $v$ 用第 2 式！',
    firstStepFormula: '\\text{缺 } t \\implies v^2 = v_0^2 + 2a\\Delta x, \\quad \\text{缺 } a \\implies \\Delta x = \\frac{v_0 + v}{2}t',
    exampleProblem: {
      question: '一汽車以初速 $20\\text{ m/s}$ 煞車，煞車距離為 $40\\text{ m}$，若煞車過程為等減速度，求減速度量值與煞車時間？',
      quickSolve: '缺 $t$ 直接用 $0^2 = 20^2 - 2a(40) \\implies a = 5\\text{ m/s}^2$；缺 $a$ 用 $40 = \\frac{20+0}{2}t \\implies t = 4\\text{ s}$。',
    },
  },
  {
    id: 'sig-projectile-ortho',
    stage: 'senior',
    gradeBand: '高二選修',
    strand: 'mechanics',
    topic: '平面運動 · 斜向拋射拆解',
    problemSignal: '題目出現「初速 $v_0$、仰角 $\\theta$ 斜向拋射，求飛行時間、最高點或水平射程」',
    threeSecondRule: '【水平等速、鉛直垂直落體】第一步拆分 $v_{0x} = v_0\\cos\\theta$ 與 $v_{0y} = v_0\\sin\\theta$，飛行時間由 $v_{0y}$ 獨自決定！',
    firstStepFormula: 'T = \\frac{2v_0\\sin\\theta}{g}, \\quad H = \\frac{(v_0\\sin\\theta)^2}{2g}, \\quad R = \\frac{v_0^2\\sin(2\\theta)}{g}',
    exampleProblem: {
      question: '以 $25\\text{ m/s}$、仰角 $53^\\circ$ 拋出一石子 ($g=10\\text{ m/s}^2$)，求最大高度與飛行時間？',
      quickSolve: '$v_{0y} = 25 \\times 0.8 = 20\\text{ m/s}$ ➜ 飛行時間 $T = \\frac{2(20)}{10} = 4\\text{ s}$ ➜ 最高點 $H = \\frac{20^2}{20} = 20\\text{ m}$。',
    },
  },
  {
    id: 'sig-system-acc',
    stage: 'senior',
    gradeBand: '高二選修',
    strand: 'mechanics',
    topic: '牛頓力學 · 連接體系統法',
    problemSignal: '題目出現「多個木塊用繩子連接、光滑斜面懸掛滑輪系統，求整組加速度或內部繩張力」',
    threeSecondRule: '【先系統求 $a$，再隔離求內力 $T$】系統加速度等於運動方向淨外力除以總質量！',
    firstStepFormula: 'a_{\\text{sys}} = \\frac{\\sum F_{\\text{ext, drive}} - \\sum F_{\\text{ext, resist}}}{\\sum m_i}',
    exampleProblem: {
      question: '光滑桌面上 $m_1 = 3\\text{ kg}$ 經輕繩跨過定滑輪懸掛 $m_2 = 2\\text{ kg}$ ($g=10\\text{ m/s}^2$)，求系統加速度？',
      quickSolve: '驅動力為 $m_2 g = 20\\text{ N}$，總質量 $3+2 = 5\\text{ kg}$ ➜ $a = \\frac{20}{5} = 4\\text{ m/s}^2$。',
    },
  },
  {
    id: 'sig-momentum-collision',
    stage: 'senior',
    gradeBand: '高二選修',
    strand: 'mechanics',
    topic: '動量與碰撞 · 彈碰 vs 完全非彈碰',
    problemSignal: '題目出現「兩物體碰撞、合體、爆炸、水平光滑無外力作用」',
    threeSecondRule: '【動量恆守恆；合體共速最失能；彈碰接近等於分離】完全非彈碰共速為質心速度 $v_{\\text{cm}}$！',
    firstStepFormula: 'm_1 v_1 + m_2 v_2 = (m_1 + m_2) v_{\\text{cm}}, \\quad v_1 - v_2 = -(v_1\' - v_2\') \\quad (e=1)',
    exampleProblem: {
      question: '$2\\text{ kg}$ 小車以 $6\\text{ m/s}$ 撞上靜止的 $4\\text{ kg}$ 小車並合為一體，合體後速度？',
      quickSolve: '動量守恆直接求質心速度：$v\' = \\frac{2 \\times 6 + 0}{2 + 4} = 2\\text{ m/s}$。',
    },
  },
  {
    id: 'sig-centripetal-force',
    stage: 'senior',
    gradeBand: '高二選修',
    strand: 'mechanics',
    topic: '圓周運動 · 向心力來源分析',
    problemSignal: '題目出現「轉彎車輛、圓錐擺、過山車軌道最高點、人造衛星」',
    threeSecondRule: '【向心力不是新力，是沿法線方向的合力】第一步畫受力圖，取指向圓心方向合力等於 $m\\frac{v^2}{R}$！',
    firstStepFormula: 'F_{\\text{net, radial}} = m\\frac{v^2}{R} = m\\omega^2 R = m\\left(\\frac{2\\pi}{T}\\right)^2 R',
    exampleProblem: {
      question: '過山車在半徑 $R = 10\\text{ m}$ 鉛直圓形軌道內側最高點恰不脫落 ($g=10\\text{ m/s}^2$)，求臨界速率？',
      quickSolve: '恰不脫落即正向力 $N = 0$，重力完全充當向心力：$mg = m\\frac{v^2}{R} \\implies v = \\sqrt{gR} = 10\\text{ m/s}$。',
    },
  },
  {
    id: 'sig-satellite-energy',
    stage: 'senior',
    gradeBand: '高二選修',
    strand: 'mechanics',
    topic: '萬有引力 · 圓軌道能量比例',
    problemSignal: '題目出現「人造衛星在半徑 $r$ 圓軌道運轉，求動能、重力位能與總力學能」',
    threeSecondRule: '【黃金比例 $1 : -2 : -1$】動能必為正，位能為負且為動能的兩倍，總能為負且量值等於動能！',
    firstStepFormula: 'E_k = \\frac{GMm}{2r}, \\quad U = -\\frac{GMm}{r}, \\quad E_{\\text{total}} = -\\frac{GMm}{2r} \\implies E_k : U : E = 1 : -2 : -1',
    exampleProblem: {
      question: '若某衛星在軌道上的動能為 $4 \\times 10^9\\text{ J}$，其重力位能與總力學能分別為何？',
      quickSolve: '由黃金比例直接寫出：位能 $U = -2E_k = -8 \\times 10^9\\text{ J}$，總能 $E = -E_k = -4 \\times 10^9\\text{ J}$。',
    },
  },
  {
    id: 'sig-shm-frequency',
    stage: 'senior',
    gradeBand: '高二選修',
    strand: 'mechanics',
    topic: '簡諧運動 · 回復力與週期',
    problemSignal: '題目出現「彈簧振子、浮體小震盪、單擺微幅擺動，求振盪週期或極值」',
    threeSecondRule: '【找出回復力常數 $k_{\\text{eff}}$】將受力化簡為 $F = -k_{\\text{eff}} x$，週期直接套 $T = 2\\pi\\sqrt{\\frac{m}{k_{\\text{eff}}}}$！',
    firstStepFormula: 'F_{\\text{net}} = -k x \\implies \\omega = \\sqrt{\\frac{k}{m}}, \\quad T = 2\\pi\\sqrt{\\frac{m}{k}}, \\quad E = \\frac{1}{2}kA^2',
    exampleProblem: {
      question: '質量 $m = 1\\text{ kg}$ 的木塊接在 $k = 100\\text{ N/m}$ 的彈簧上，振幅 $A = 0.1\\text{ m}$，求最大動能與週期？',
      quickSolve: '$T = 2\\pi\\sqrt{\\frac{1}{100}} = \\frac{\\pi}{5}\\text{ s}$；最大動能 $E_k = \\frac{1}{2}(100)(0.1)^2 = 0.5\\text{ J}$。',
    },
  },
  {
    id: 'sig-double-slit-fringe',
    stage: 'senior',
    gradeBand: '高三選修',
    strand: 'waves_optics',
    topic: '物理光學 · 干涉與繞射條紋公式',
    problemSignal: '題目出現「雙狹縫干涉相鄰亮帶寬」或「單狹縫繞射中央亮帶寬」',
    threeSecondRule: '【雙縫等寬 $\\frac{\\lambda L}{d}$；單縫中央雙倍寬 $2\\frac{\\lambda L}{b}$】雙縫看縫距 $d$，單縫看縫寬 $b$！',
    firstStepFormula: '\\text{雙狹縫: } \\Delta y = \\frac{\\lambda L}{d}, \\qquad \\text{單狹縫中央亮帶: } W_0 = \\frac{2\\lambda L}{b}',
    exampleProblem: {
      question: '用波長 $500\\text{ nm}$ 之光照射縫寬 $0.1\\text{ mm}$ 的單狹縫，屏距 $2\\text{ m}$，中央亮帶寬度？',
      quickSolve: '$W_0 = \\frac{2 \\times (500 \\times 10^{-9}) \\times 2}{0.1 \\times 10^{-3}} = 2 \\times 10^{-2}\\text{ m} = 20\\text{ mm}$。',
    },
  },
  {
    id: 'sig-gas-rms-speed',
    stage: 'senior',
    gradeBand: '高三選修',
    strand: 'thermodynamics',
    topic: '熱學 · 分子平均動能與速率',
    problemSignal: '題目出現「氣體絕對溫度 $T$、求單分子平均動能或分子方均根速率 $v_{\\text{rms}}$」',
    threeSecondRule: '【單分子動能看溫度 $T$；方均根速率除以分子量 $M$】先將攝氏溫標換為絕對溫標 K！',
    firstStepFormula: '\\overline{E}_k = \\frac{3}{2}k_B T, \\qquad v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}} = \\sqrt{\\frac{3k_B T}{m}}',
    exampleProblem: {
      question: '氧氣 ($M=32$) 在 $300\\text{ K}$ 時的方均根速率為 $v_0$，則氫氣 ($M=2$) 在 $600\\text{ K}$ 時的方均根速率？',
      quickSolve: '$v_{\\text{rms}} \\propto \\sqrt{\\frac{T}{M}}$ ➜ $\\frac{v_{\\text{H}}}{v_{\\text{O}}} = \\sqrt{\\frac{600/2}{300/32}} = \\sqrt{300 \\times \\frac{32}{300}} = \\sqrt{32} = 4\\sqrt{2}$ 倍。',
    },
  },
  {
    id: 'sig-lorentz-cyclotron',
    stage: 'senior',
    gradeBand: '高三選修',
    strand: 'electromagnetism',
    topic: '磁場 · 勞侖茲力等速率圓周',
    problemSignal: '題目出現「帶電粒子 $q$ 以速度 $v$ 垂直射入均勻磁場 $B$，求迴旋半徑或週期」',
    threeSecondRule: '【磁力作向心力，半徑看動量 $p$，週期無關速率 $v$】$R = \\frac{mv}{qB} = \\frac{\\sqrt{2mE_k}}{qB}$！',
    firstStepFormula: 'R = \\frac{mv}{qB} = \\frac{p}{qB}, \\qquad T = \\frac{2\\pi m}{qB} \\quad (T \\text{ 與 } v, R \\text{ 無關})',
    exampleProblem: {
      question: '兩粒子動量相同、電量相同，質量比 $1:4$ 垂直進入同磁場，其軌道半徑比與週期比？',
      quickSolve: '$R = \\frac{p}{qB} \\implies R_1:R_2 = 1:1$；$T = \\frac{2\\pi m}{qB} \\implies T_1:T_2 = m_1:m_2 = 1:4$。',
    },
  },
  {
    id: 'sig-motional-emf',
    stage: 'senior',
    gradeBand: '高三選修',
    strand: 'electromagnetism',
    topic: '電磁感應 · 導線切割磁力線',
    problemSignal: '題目出現「金屬棒長 $L$ 在磁場 $B$ 中以速率 $v$ 切割運動，求感應電動勢或電流受力」',
    threeSecondRule: '【電動勢 $BLv$；右手開掌判正極；外力功等於焦耳熱】右手四指磁場、大拇指運動方向，掌心推出正電荷即為高電位端！',
    firstStepFormula: '\\mathcal{E} = B L v, \\quad I = \\frac{BLv}{R}, \\quad F_{\\text{magnetic}} = I L B = \\frac{B^2 L^2 v}{R}',
    exampleProblem: {
      question: '長 $0.5\\text{ m}$ 導線在 $0.4\\text{ T}$ 磁場中以 $10\\text{ m/s}$ 垂直切割，迴路電阻 $2\\,\\Omega$，求感應電流？',
      quickSolve: '$\\mathcal{E} = 0.4 \\times 0.5 \\times 10 = 2\\text{ V}$ ➜ $I = \\frac{2}{2} = 1\\text{ A}$。',
    },
  },
  {
    id: 'sig-photoelectric-cutoff',
    stage: 'senior',
    gradeBand: '高一必修 / 高三選修',
    strand: 'modern',
    topic: '近代物理 · 愛因斯坦光電方程式',
    problemSignal: '題目出現「光電效應、入射光頻率 $\\nu$、功函數 $W$、截止電壓 $V_s$」',
    threeSecondRule: '【入射能量等於功函數加最大動能】光強決定電子數量，頻率決定電子動能與截止電壓！',
    firstStepFormula: 'h\\nu = W + K_{\\max} = W + e V_s \\iff e V_s = h\\nu - h\\nu_0',
    exampleProblem: {
      question: '某金屬底限頻率為 $\\nu_0$，用頻率 $3\\nu_0$ 之光照射，逸出光電子之最大動能與截止電壓？',
      quickSolve: '$K_{\\max} = h(3\\nu_0) - h\\nu_0 = 2h\\nu_0$；截止電壓 $V_s = \\frac{2h\\nu_0}{e}$。',
    },
  },
  {
    id: 'sig-bohr-transition',
    stage: 'senior',
    gradeBand: '高三選修',
    strand: 'modern',
    topic: '近代物理 · 波耳能階躍遷',
    problemSignal: '題目出現「氫原子從高能階 $n_2$ 躍遷至低能階 $n_1$，求釋放光子之能量或波長」',
    threeSecondRule: '【能階負十三點六除以 $n$ 平方】落回 $n=1$ 萊曼系 (UV)，落回 $n=2$ 巴爾麥系 (可見光)，落回 $n=3$ 帕森系 (IR)！',
    firstStepFormula: '\\Delta E = E_{n_2} - E_{n_1} = 13.6\\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)\\text{ eV} = \\frac{hc}{\\lambda} \\approx \\frac{12400\\text{ \\AA}\\cdot\\text{eV}}{\\lambda}',
    exampleProblem: {
      question: '氫原子電子從 $n=4$ 躍遷至 $n=2$ 能階，輻射光子能量？',
      quickSolve: '$\\Delta E = 13.6\\left(\\frac{1}{4} - \\frac{1}{16}\\right) = 13.6 \\times \\frac{3}{16} = 2.55\\text{ eV}$ (巴爾麥系青色可見光)。',
    },
  },
  {
    id: 'sig-circuit-kcl',
    stage: 'senior',
    gradeBand: '高三選修',
    strand: 'electromagnetism',
    topic: '電路學 · 節點電壓速算法',
    problemSignal: '題目出現「多電源、多電阻並聯或橋式電路，求某支路電流」',
    threeSecondRule: '【設接地點為 $0\\text{V}$，未知節點設 $V_x$ 列 KCL】流入等於流出，一條一元一次方程式秒殺！',
    firstStepFormula: '\\sum I_{\\text{out}} = 0 \\implies \\frac{V_x - V_1}{R_1} + \\frac{V_x - V_2}{R_2} + \\frac{V_x - V_3}{R_3} = 0',
    exampleProblem: {
      question: '節點 $V_x$ 透過 $2\\,\\Omega$ 連接 $10\\text{V}$，透過 $3\\,\\Omega$ 連接 $0\\text{V}$，透過 $6\\,\\Omega$ 連接 $0\\text{V}$，求 $V_x$？',
      quickSolve: '$\\frac{V_x - 10}{2} + \\frac{V_x - 0}{3} + \\frac{V_x - 0}{6} = 0 \\implies 3(V_x - 10) + 2V_x + V_x = 0 \\implies 6V_x = 30 \\implies V_x = 5\\text{ V}$。',
    },
  },
  {
    id: 'sig-doppler-frequency',
    stage: 'senior',
    gradeBand: '高二選修',
    strand: 'waves_optics',
    topic: '波動學 · 都卜勒視頻率',
    problemSignal: '題目出現「聲源鳴笛移動、觀察者移動或兩者同時移動，求聽到的頻率」',
    threeSecondRule: '【分子是觀察者 $v_O$，分母是波源 $v_S$；接近變大、遠離變小】接近時分子加、分母減！',
    firstStepFormula: 'f\' = f \\left(\\frac{v \\pm v_O}{v \\mp v_S}\\right) \\quad (\\text{接近: 分子}+, \\text{分母}-)',
    exampleProblem: {
      question: '聲速 $340\\text{ m/s}$，波源以 $20\\text{ m/s}$ 接近靜止觀察者，鳴笛 $640\\text{ Hz}$，聽到的頻率？',
      quickSolve: '接近分母減：$f\' = 640 \\times \\frac{340}{340 - 20} = 640 \\times \\frac{340}{320} = 680\\text{ Hz}$。',
    },
  },
]

/** 取得所有物理 3 秒破題訊號卡清單 (共 19 組) */
export function getPhysicsSolvingSignals(): PhysicsSolvingSignal[] {
  return PHYSICS_SOLVING_SIGNALS
}

/** 依學段 (國中/高中) 篩選破題訊號卡 */
export function getPhysicsSignalsByStage(stage: PhysicsStage): PhysicsSolvingSignal[] {
  return PHYSICS_SOLVING_SIGNALS.filter((s) => s.stage === stage)
}

/** 依主題領域篩選破題訊號卡 */
export function getPhysicsSignalsByStrand(strand: PhysicsStrand): PhysicsSolvingSignal[] {
  return PHYSICS_SOLVING_SIGNALS.filter((s) => s.strand === strand)
}
