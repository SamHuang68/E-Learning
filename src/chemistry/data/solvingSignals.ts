/**
 * 臺灣 108 課綱化學 · 3 秒破題訊號庫 (Chemistry Problem-Solving Signals)
 * 專為國中會考、高中學測與分科測驗設計：
 * 學生看到題目關鍵特徵 ➜ 3 秒直覺決策 ➜ 秒殺第一步算式與考點本質。
 */

export interface ChemistrySolvingSignal {
  id: string
  stage: 'junior' | 'senior'
  gradeBand: string // e.g. "國中八年級", "高中十年級", "高中選修"
  topic: string
  problemSignal: string // 題目出現的關鍵特徵／訊號關鍵字
  threeSecondRule: string // 3 秒直覺破題口訣
  firstStepFormula: string // 破題第一步算式 / LaTeX
  exampleProblem: {
    question: string
    quickSolve: string
  }
}

export const CHEMISTRY_SOLVING_SIGNALS: ChemistrySolvingSignal[] = [
  // 國中會考 (CAP) 階段
  {
    id: 'sig-solubility-cooling',
    stage: 'junior',
    gradeBand: '國中七年級',
    topic: '水溶液 · 降溫結晶析出量',
    problemSignal: '題目給定高低兩溫度之溶解度（$S_1, S_2$），由高溫飽和溶液降溫求「析出晶體質量」',
    threeSecondRule: '【抓水重乘溶解度差】飽和溶液降溫，水重保持不變！析出量等於水重乘以溶解度差值比！',
    firstStepFormula: 'W_{\\text{析出}} = W_{\\text{水 (g)}} \\times \\frac{S_{\\text{高}} - S_{\\text{低}}}{100\\text{ g 水}}',
    exampleProblem: {
      question: '硝酸鉀在 60°C 溶解度為 110 g/100g 水，20°C 為 32 g/100g 水。取 60°C 飽和溶液 210 g 降溫至 20°C，析出多少克硝酸鉀？',
      quickSolve: '210 g 飽和溶液恰含 100 g 水 ➜ 析出量 $= 100 \\times \\frac{110 - 32}{100} = 78\\text{ g}$。',
    },
  },
  {
    id: 'sig-mass-conservation-limiting',
    stage: 'junior',
    gradeBand: '國中八年級',
    topic: '化學反應 · 限量試劑判斷',
    problemSignal: '題目給定兩種反應物的質量或莫耳數，求「哪一個物質完全耗盡」或「生成物最大質量」',
    threeSecondRule: '【莫耳數除以係數】全部換算為莫耳數，$n/\\text{係數}$ 比值最小者就是限量試劑，由它決定產量！',
    firstStepFormula: '\\text{限量試劑} = \\min\\left( \\frac{n_A}{a},\\, \\frac{n_B}{b} \\right)',
    exampleProblem: {
      question: '4 莫耳 H2 與 3 莫耳 O2 反應生成水 (2H2 + O2 -> 2H2O)，何者為限量試劑？可生成幾莫耳水？',
      quickSolve: 'H2: $4/2 = 2$；O2: $3/1 = 3$ ➜ H2 較小為限量試劑，生成水 $4\\text{ mol}$。',
    },
  },
  {
    id: 'sig-metal-activity-redox',
    stage: 'junior',
    gradeBand: '國中八年級',
    topic: '氧化還原 · 金屬活性與置換',
    problemSignal: '題目給定金屬與金屬氧化物混合加熱（如 $A + BO \\rightarrow AO + B$），問反應能否自發發生',
    threeSecondRule: '【強搶弱氧，活性大搶走氧】活性大的單質金屬才能把活性小的金屬氧化物還原！',
    firstStepFormula: '\\text{活性順序: } \\text{K}>\\text{Na}>\\text{Ca}>\\text{Mg}>\\text{Al}>\\text{C}>\\text{Zn}>\\text{Fe}>\\text{Pb}>\\text{H}>\\text{Cu}>\\text{Ag}',
    exampleProblem: {
      question: '將鋁粉與氧化鐵粉末混合點燃 (鋁熱反應)，是否會劇烈反應？',
      quickSolve: '活性 $\\text{Al} > \\text{Fe}$，鋁能搶走鐵的氧 ➜ 發生反應生成 $\\text{Al}_2\\text{O}_3$ 與熔融鐵。',
    },
  },

  // 高中學測 (GSAT) 必修化學階段
  {
    id: 'sig-density-molarity',
    stage: 'senior',
    gradeBand: '高中十年級',
    topic: '化學計量 · 濃度雙向秒殺換算',
    problemSignal: '題目給定重量百分率濃度 $P\\%$ 與溶液比重/密度 $D\\text{ (g/cm}^3)$，要求「體積莫耳濃度 $M$」',
    threeSecondRule: '【10PD除以分子量】十倍百分率乘密度除分子量，1 秒出答案！',
    firstStepFormula: 'M = \\frac{10 \\times P\\% \\times D}{M_w}',
    exampleProblem: {
      question: '比重 1.84、重量百分率 98% 的濃硫酸 (分子量 98)，其體積莫耳濃度為何？',
      quickSolve: '$M = \\frac{10 \\times 98 \\times 1.84}{98} = 18.4\\text{ M}$。',
    },
  },
  {
    id: 'sig-combustion-analysis',
    stage: 'senior',
    gradeBand: '高中十年級',
    topic: '化學式 · 燃燒分析求實驗式',
    problemSignal: '取未知有機物燃燒，給定生成的 $\\text{CO}_2$ 克數與 $\\text{H}_2\\text{O}$ 克數，求「實驗式或分子式」',
    threeSecondRule: '【CO2求碳、H2O求氫、相減得氧】碳重 $44$ 分之 $12$，氫重 $18$ 分之 $2$，總重扣除得氧重！',
    firstStepFormula: 'W_{\\text{C}} = W_{\\text{CO}_2} \\times \\frac{12}{44},\\quad W_{\\text{H}} = W_{\\text{H}_2\\text{O}} \\times \\frac{2}{18},\\quad W_{\\text{O}} = W_{\\text{總}} - (W_{\\text{C}} + W_{\\text{H}})',
    exampleProblem: {
      question: '燃燒 4.6 g 樣品得 8.8 g CO2 與 5.4 g H2O，求 C, H, O 莫耳比？',
      quickSolve: 'C: $8.8 \\times \\frac{12}{44} = 2.4\\text{g} (0.2\\text{mol})$; H: $5.4 \\times \\frac{2}{18} = 0.6\\text{g} (0.6\\text{mol})$; O: $4.6 - 3.0 = 1.6\\text{g} (0.1\\text{mol})$ ➜ 比值 2:6:1 ➜ C2H6O。',
    },
  },
  {
    id: 'sig-atom-economy',
    stage: 'senior',
    gradeBand: '高中十年級',
    topic: '綠色化學 · 原子經濟性 (AE)',
    problemSignal: '題目給定合成反應方程式，要求評估「綠色化學原子經濟性 (Atom Economy, %)」',
    threeSecondRule: '【目標產物除以全部反應物】加成反應無副產物者必為 100%！',
    firstStepFormula: '\\text{AE (\\%)} = \\frac{\\text{目標產物分子量}}{\\sum \\text{所有反應物分子量}} \\times 100\\%',
    exampleProblem: {
      question: '乙烯與水加成合成乙醇 (C2H4 + H2O -> C2H5OH) 的原子經濟性為何？',
      quickSolve: '全部反應物原子均進入乙醇產物中，無任何副產物 ➜ 原子經濟性 $= 100\\%$。',
    },
  },

  // 高中分科測驗 (AST) 選修化學階段
  {
    id: 'sig-water-vapor-pressure',
    stage: 'senior',
    gradeBand: '高中十一年級',
    topic: '氣體定律 · 排水集氣蒸氣壓修正',
    problemSignal: '題目出現「排水集氣法」收集氣體，給定大氣壓與該溫度下「飽和水蒸氣壓」求分子量或莫耳數',
    threeSecondRule: '【第一步先扣水蒸氣壓】收集到的氣體是混合氣，乾燥氣體分壓必須先扣除飽和水蒸氣壓！',
    firstStepFormula: 'P_{\\text{乾燥氣體}} = P_{\\text{大氣}} - P_{\\text{水蒸氣(飽和)}}',
    exampleProblem: {
      question: '755 mmHg 下排水收集氣體，水溫時飽和水蒸氣壓為 25 mmHg，求乾燥氣體分壓？',
      quickSolve: '$P_{\\text{氣體}} = 755 - 25 = 730\\text{ mmHg} = \\frac{730}{760}\\text{ atm}$。',
    },
  },
  {
    id: 'sig-graham-diffusion',
    stage: 'senior',
    gradeBand: '高中十一年級',
    topic: '氣體動力論 · 格拉罕擴散定律',
    problemSignal: '題目比較兩氣體通過針孔「擴散速率比」或相同體積之「擴散時間比」',
    threeSecondRule: '【速率與根號分子量反比，時間與根號分子量正比】分子愈重跑愈慢、花時間愈長！',
    firstStepFormula: '\\frac{r_1}{r_2} = \\frac{t_2}{t_1} = \\sqrt{\\frac{M_2}{M_1}}',
    exampleProblem: {
      question: '同溫同壓同體積下，未知氣體擴散需 40 秒，甲烷 (CH4, M=16) 需 20 秒，求未知氣體分子量？',
      quickSolve: '時間比 $\\frac{40}{20} = 2 = \\sqrt{\\frac{M_x}{16}} \\implies M_x = 16 \\times 4 = 64$。',
    },
  },
  {
    id: 'sig-colligative-freezing',
    stage: 'senior',
    gradeBand: '高中十一年級',
    topic: '溶液依數性 · 凝固點下降求分子量',
    problemSignal: '題目給定溶質克數溶於溶劑中，測得「凝固點下降度數 $\\Delta T_f$」求未知溶質分子量 $M_w$',
    threeSecondRule: '【凝固點下降公式直接換算】$\\Delta T_f = i \\cdot K_f \\cdot m$，非電解質 $i=1$！',
    firstStepFormula: 'M_w = \\frac{K_f \\times W_{\\text{溶質 (g)}}}{\\Delta T_f \\times W_{\\text{溶劑 (kg)}}}',
    exampleProblem: {
      question: '3.6 g 非電解質溶於 100 g 水中，凝固點為 -0.372°C (Kf=1.86)，求分子量？',
      quickSolve: '$M_w = \\frac{1.86 \\times 3.6}{0.372 \\times 0.100} = 180\\text{ g/mol}$。',
    },
  },
  {
    id: 'sig-vsepr-hybridization',
    stage: 'senior',
    gradeBand: '高中十一年級',
    topic: '微觀結構 · VSEPR 構型與混成軌域',
    problemSignal: '題目給定分子式（如 $\\text{NH}_3, \\text{H}_2\\text{O}, \\text{SF}_4, \\text{XeF}_4$），要求判斷「中心原子混成軌域與鍵角構型」',
    threeSecondRule: '【算立體數 SN】$\\text{SN} = \\sigma\\text{ 鍵數} + \\text{孤對電子對數 (lp)}$。2=sp 直線, 3=sp2 平面三角, 4=sp3 四面體！',
    firstStepFormula: '\\text{SN} = \\frac{1}{2}\\left( \\text{中心價電子} + \\text{單價配位基數} - \\text{正電荷} + \\text{負電荷} \\right)',
    exampleProblem: {
      question: '水分子 (H2O) 中心氧原子的混成軌域與立體幾何構型？',
      quickSolve: 'O 外層 6 電子 + 2 個 H = 8 電子 = 4 對 (2 單鍵 + 2 孤對) ➜ $\\text{SN}=4 \\implies sp^3$ 混成，彎曲型 ($104.5^\\circ$)。',
    },
  },
  {
    id: 'sig-rate-law-half-life',
    stage: 'senior',
    gradeBand: '高中十一年級',
    topic: '反應動力學 · 一級反應半生期定值',
    problemSignal: '題目指出「反應物濃度每減少一半所需時間皆為固定值」，求反應級數或速率常數 $k$',
    threeSecondRule: '【半生期固定必為一級反應】一級反應半生期 $t_{1/2} = 0.693 / k$，與反應物濃度完全無關！',
    firstStepFormula: 'r = k[A]^1,\\quad t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{k}',
    exampleProblem: {
      question: '某分解反應半生期固定為 10 分鐘，經 30 分鐘後樣品剩餘比例？',
      quickSolve: '經過 3 個半生期 ➜ 剩餘 $(1/2)^3 = 1/8 = 12.5\\%$。',
    },
  },
  {
    id: 'sig-weak-acid-ph',
    stage: 'senior',
    gradeBand: '高中十二年級',
    topic: '酸鹼平衡 · 弱酸解離快速開根號',
    problemSignal: '題目給定單質子弱酸濃度 $C_0$ 與解離常數 $K_a$，要求「水溶液中 $[\\text{H}^+]$ 或 $\\text{pH}$」',
    threeSecondRule: '【開根號 Ka 乘 C0】只要 $C_0 / K_a \\ge 400$，直接 $[\\text{H}^+] = \\sqrt{C_0 \\cdot K_a}$！',
    firstStepFormula: '[\\text{H}^+] = \\sqrt{C_0 \\cdot K_a} \\implies \\text{pH} = \\frac{1}{2}(\\text{p}K_a - \\log C_0)',
    exampleProblem: {
      question: '0.10 M 醋酸溶液 (Ka = 1.0x10^-5) 的 pH 值為何？',
      quickSolve: '$[\\text{H}^+] = \\sqrt{0.10 \\times 1.0 \\times 10^{-5}} = 1.0 \\times 10^{-3}\\text{ M} \\implies \\text{pH} = 3.0$。',
    },
  },
  {
    id: 'sig-buffer-henderson',
    stage: 'senior',
    gradeBand: '高中十二年級',
    topic: '酸鹼滴定 · 緩衝溶液與半當量點',
    problemSignal: '題目出現「弱酸滴定加強鹼至中和一半」或「等莫耳弱酸與弱酸鹽混合」求 $\\text{pH}$',
    threeSecondRule: '【半當量點 pH 等於 pKa】弱酸與共軛鹼濃度相等時，對數項為 0，$\\text{pH}$ 直截等於 $\\text{p}K_a$！',
    firstStepFormula: '\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{A}^-]}{[\\text{HA}]} \\xrightarrow{[\\text{A}^-] = [\\text{HA}]} \\text{pH} = \\text{p}K_a',
    exampleProblem: {
      question: '0.1 M 醋酸 (pKa=4.74) 加入等體積 0.05 M NaOH 中和後，溶液 pH 為何？',
      quickSolve: '恰好中和一半，剩餘醋酸等於生成的醋酸鈉 ➜ $\\text{pH} = \\text{p}K_a = 4.74$。',
    },
  },
  {
    id: 'sig-cell-potential',
    stage: 'senior',
    gradeBand: '高中十二年級',
    topic: '電化學 · 電池標準電動勢 E°cell',
    problemSignal: '題目給定兩個電極半反應之「標準還原電位 $E^\\circ$」，求「組裝成伏打電池的標準電動勢」',
    threeSecondRule: '【大減小：陰極還原減陽極氧化】還原電位大的是陰極正極，小的為陽極負極，兩者相減必為正！',
    firstStepFormula: 'E^\\circ_{\\text{cell}} = E^\\circ_{\\text{red(陰極/大)}} - E^\\circ_{\\text{red(陽極/小)}}',
    exampleProblem: {
      question: '已知 Cu2+/Cu 為 +0.34V，Zn2+/Zn 為 -0.76V，求鋅銅電池標準電動勢？',
      quickSolve: '$E^\\circ_{\\text{cell}} = (+0.34) - (-0.76) = +1.10\\text{ V}$。',
    },
  },
  {
    id: 'sig-faraday-electrolysis',
    stage: 'senior',
    gradeBand: '高中十二年級',
    topic: '電解定量 · 法拉第電解定律',
    problemSignal: '題目給定電解電流 $I\\text{ (A)}$ 與時間 $t\\text{ (s)}$，求電極上「金屬析出克數或氣體體積」',
    threeSecondRule: '【It 除以 96500 得電子莫耳數】求得 $n(e^-)$ 後，除以轉移電子數得產物莫耳數！',
    firstStepFormula: 'n(e^-) = \\frac{I \\times t}{96500},\\quad W = \\frac{n(e^-)}{n_{\\text{轉移}}} \\times M_w',
    exampleProblem: {
      question: '以 9.65 A 電解 CuSO4 溶液 1000 秒，陰極析出銅 (Mw=63.5) 幾克？',
      quickSolve: '$n(e^-) = \\frac{9.65 \\times 1000}{96500} = 0.1\\text{ mol} \\implies n(\\text{Cu}) = \\frac{0.1}{2} = 0.05\\text{ mol} \\implies 0.05 \\times 63.5 = 3.18\\text{ g}$。',
    },
  },
]
