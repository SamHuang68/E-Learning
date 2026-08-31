import type { ChemistryQuestion } from './curriculum'

/**
 * 臺灣 108 課綱化學標準模擬試卷庫
 * 涵蓋：
 * 1. 國中教育會考 (CAP) 自然科化學試卷 (30 分鐘衝刺)
 * 2. 高中學科能力測驗 (GSAT) 自然科化學試卷 (40 分鐘精準評量)
 * 3. 高中分科測驗 (AST) 化學考科試卷 (60 分鐘進階試卷)
 */

export interface ChemistryMockExam {
  id: string
  title: string
  subtitle: string
  targetExam: 'CAP' | 'GSAT' | 'AST'
  durationMinutes: number
  totalPoints: number
  questions: ChemistryQuestion[]
}

export const CHEMISTRY_MOCK_EXAMS: Record<'cap' | 'gsat' | 'ast', ChemistryMockExam> = {
  cap: {
    id: 'exam_cap_chemistry',
    title: '國中教育會考 (CAP) 理化化學領域標準模擬試卷',
    subtitle: '檢測水溶液、原子分子、化學反應式計量、氧化還原、常見酸鹼鹽與生活有機化合物',
    targetExam: 'CAP',
    durationMinutes: 30,
    totalPoints: 100,
    questions: [
      {
        id: 'cap_q1',
        title: '飽和溶液濃度與溶解度判斷',
        strand: 'matter_structure',
        type: 'choice',
        difficulty: 2,
        question: '在 25°C 時，將 40 g 食鹽加入 100 g 水中充分攪拌後，燒杯底部尚殘留 4 g 未溶解的食鹽。下列敘述何者正確？',
        options: [
          'A. 此水溶液為未飽和溶液',
          'B. 在 25°C 時，食鹽的溶解度為 36 g / 100 g 水',
          'C. 繼續加入 10 g 水，未溶解的食鹽質量會增加',
          'D. 溶液的重量百分濃度為 40%',
        ],
        answer: 'B',
        solution: '底部有殘留未溶解固體，代表溶液已達到「飽和狀態」。實際溶解的食鹽質量為 $40 - 4 = 36\\text{ g}$，故 25°C 時食鹽在水中的溶解度為 $36\\text{ g}/100\\text{ g 水}$。故選 B。',
        hint: '溶解量 = 總加入量 - 殘留量 = 40 - 4 = 36 g。',
        competency: '國中會考生活化學：飽和溶液定義與溶解度判讀',
        tags: ['會考', '溶解度', '飽和溶液'],
      },
      {
        id: 'cap_q2',
        title: '化學反應前後原子與質量守恆',
        strand: 'reactions',
        type: 'choice',
        difficulty: 2,
        question: '甲物質與乙物質在密閉容器中完全反應生成丙物質與丁物質：甲 + 2乙 -> 丙 + 丁。已知 10 g 甲與 16 g 乙恰好完全反應，生成 18 g 丙，則生成丁物質的質量為多少克？',
        options: [
          'A. 6 g',
          'B. 8 g',
          'C. 10 g',
          'D. 12 g',
        ],
        answer: 'B',
        solution: '根據質量守恆定律：\n$$\\text{反應物質量總和} = \\text{生成物質量總和}$$\n$$W_{\\text{甲}} + W_{\\text{乙}} = W_{\\text{丙}} + W_{\\text{丁}}$$\n$$10\\text{ g} + 16\\text{ g} = 18\\text{ g} + W_{\\text{丁}}$$\n$$26\\text{ g} = 18\\text{ g} + W_{\\text{丁}} \\implies W_{\\text{丁}} = 8\\text{ g}$$。\n故選 B。',
        hint: '質量守恆：$10 + 16 = 18 + W_{\\text{丁}} \\implies W_{\\text{丁}} = 8\\text{ g}$。',
        competency: '質量守恆定律運算：密閉系統中反應物質量平衡',
        tags: ['會考', '質量守恆'],
      },
      {
        id: 'cap_q3',
        title: '常見酸鹼性質與指示劑檢驗',
        strand: 'electrochemistry',
        type: 'choice',
        difficulty: 2,
        question: '小華取三支試管分別裝有稀鹽酸、氫氧化鈉水溶液與純水，各滴入無色酚酞指示劑。下列哪一支試管會呈現「紅色」？',
        options: [
          'A. 稀鹽酸試管',
          'B. 氫氧化鈉水溶液試管',
          'C. 純水試管',
          'D. 三支試管皆維持無色',
        ],
        answer: 'B',
        solution: '酚酞指示劑在酸性與中性溶液中為無色，在鹼性溶液中呈粉紅色或紅色。氫氧化鈉水溶液為強鹼性，故滴入酚酞後會變為紅色。故選 B。',
        hint: '酚酞指示劑遇鹼變紅、遇酸與中性維持無色。',
        competency: '實驗檢驗：酸鹼指示劑變色特徵',
        tags: ['會考', '酚酞', '酸鹼指示劑'],
      },
      {
        id: 'cap_q4',
        title: '有機酯化反應特徵與產物鑑別',
        strand: 'organic',
        type: 'choice',
        difficulty: 2,
        question: '將乙酸與乙醇加入試管中，滴入數滴濃硫酸後置於熱水浴中加熱，下列關於產物的敘述何者錯誤？',
        options: [
          'A. 反應生成乙酸乙酯與水',
          'B. 產物具有特殊的水果香味',
          'C. 產物難溶於水且密度比水大，會沉在試管最底部',
          'D. 濃硫酸在此反應中擔任催化劑與脫水劑',
        ],
        answer: 'C',
        solution: '乙酸乙酯難溶於水，且密度約 $0.90\\text{ g/cm}^3$（小於水），因此會浮在水溶液的「最上層」而非沉在底部。選項 C 敘述錯誤，故選 C。',
        hint: '酯類密度小於水、難溶於水，浮在上層。',
        competency: '生活有機化學：酯化反應產物性質探究',
        tags: ['會考', '酯化反應', '乙酸乙酯'],
      },
    ],
  },

  gsat: {
    id: 'exam_gsat_chemistry',
    title: '高中學科能力測驗 (GSAT) 自然考科化學模擬試卷',
    subtitle: '聚焦 108 課綱必修化學素養題型、圖表跨領域判讀、物質分離、限量試劑與綠色永續化學',
    targetExam: 'GSAT',
    durationMinutes: 40,
    totalPoints: 100,
    questions: [
      {
        id: 'gsat_q1',
        title: '綠色化學十二原則與原子經濟評量',
        strand: 'organic',
        type: 'choice',
        difficulty: 3,
        question: '綠色化學強調在化學合成中減少廢棄物產生並提高原料利用效率。下列哪一種反應類型的「原子經濟性 (Atom Economy)」理論上可達到 100%？',
        options: [
          'A. 乙醇與乙酸的酯化反應生成乙酸乙酯',
          'B. 乙烯與水反應生成乙醇之加成反應',
          'C. 甲烷與氯氣的光照取代反應生成一氯甲烷',
          'D. 碳酸鈣高溫鍛燒生成氧化鈣與二氧化碳之分解反應',
        ],
        answer: 'B',
        solution: '原子經濟性定義為 $\\frac{\\text{目標產物分子量}}{\\sum \\text{反應物分子量}} \\times 100\\%$。加成反應（如 $\\text{C}_2\\text{H}_4 + \\text{H}_2\\text{O} \\rightarrow \\text{C}_2\\text{H}_5\\text{OH}$）中，所有反應物的原子全部併入單一產物中，無任何副產物生成，故理論原子經濟性達到 $100\\%$。故選 B。',
        hint: '加成反應無任何副產物 ➜ 原子經濟性 100%。',
        competency: '綠色化學核心素養：化學製程之環境永續性與原子利用率分析',
        tags: ['學測', '綠色化學', '原子經濟'],
      },
      {
        id: 'gsat_q2',
        title: '化學計量與氣體莫耳體積計算',
        strand: 'reactions',
        type: 'fill',
        difficulty: 3,
        question: '在標準狀況 (STP: $0^\\circ\\text{C}, 1\\text{ atm}$) 下，取 $13.0\\text{ g}$ 的鋅金屬（$\\text{Zn}$，原子量 65.0）與過量的稀硫酸完全反應：$\\text{Zn(s)} + \\text{H}_2\\text{SO}_4\\text{(aq)} \\rightarrow \\text{ZnSO}_4\\text{(aq)} + \\text{H}_2\\text{(g)}$。生成氫氣在 STP 下的體積為多少公升？',
        answer: 4.48,
        solution: '1. 鋅莫耳數 $n_{\\text{Zn}} = \\frac{13.0\\text{ g}}{65.0\\text{ g/mol}} = 0.20\\text{ mol}$。\n2. 根據係數比 $1 : 1$，生成氫氣莫耳數 $n_{\\text{H}_2} = 0.20\\text{ mol}$。\n3. STP 下氣體體積 $V = 0.20\\text{ mol} \\times 22.4\\text{ L/mol} = 4.48\\text{ L}$。',
        hint: '$n = 13.0 / 65.0 = 0.2\\text{ mol} \\implies 0.2 \\times 22.4 = 4.48\\text{ L}$。',
        competency: '化學計量運算：莫耳數與氣體標準體積換算',
        tags: ['學測', 'STP', '氣體計量'],
      },
      {
        id: 'gsat_q3',
        title: '同分異構物與路易斯結構判別',
        strand: 'matter_structure',
        type: 'multi-choice',
        difficulty: 3,
        question: '分子式為 $\\text{C}_2\\text{H}_6\\text{O}$ 的兩種同分異構物為乙醇（$\\text{C}_2\\text{H}_5\\text{OH}$）與二甲醚（$\\text{CH}_3\\text{OCH}_3$）。關於此兩者的性質比較，哪些正確？（應選 2 項）',
        options: [
          'A. 乙醇分子間可形成氫鍵，沸點遠高於二甲醚',
          'B. 乙醇能與金屬鈉反應產生氫氣，二甲醚則不能',
          'C. 兩者的路易斯結構中，氧原子周圍皆具有 1 對孤對電子',
          'D. 二甲醚在水中的溶解度大於乙醇',
          'E. 兩者的完全燃燒熱數值完全相同',
        ],
        answer: ['A', 'B'],
        solution: 'A 正確：乙醇分子具 $-\\text{OH}$ 可形成分子間氫鍵，沸點 78°C 遠高於二甲醚 (-24°C)。\nB 正確：醇類具活潑氫原子可與金屬鈉反應置換出 $\\text{H}_2$，醚類則不反應。\nC 錯誤：氧原子周圍皆具有 2 對孤對電子。\nD 錯誤：乙醇與水分子間可形成強烈氫鍵，可與水任意比例互溶。\nE 錯誤：結構不同，鍵能總和不同，燃燒熱不同。故選 A、B。',
        hint: '醇具氫鍵沸點高且能與鈉反應產氫；醚無法與鈉反應。',
        competency: '微觀分子結構與官能基特性：同分異構物理化性質比較',
        tags: ['學測', '同分異構物', '氫鍵'],
      },
    ],
  },

  ast: {
    id: 'exam_ast_chemistry',
    title: '高中分科測驗 (AST) 化學考科高階模擬試卷',
    subtitle: '選修化學深層探索：熱力學平衡、動力學速率定律、緩衝溶液、電極電位與有機反應機構',
    targetExam: 'AST',
    durationMinutes: 60,
    totalPoints: 100,
    questions: [
      {
        id: 'ast_q1',
        title: '初速率法與反應級數推導',
        strand: 'equilibrium_kinetics',
        type: 'choice',
        difficulty: 4,
        question: '反應 $A + 2B \\rightarrow C$，在固定溫度下測得：當 $[A]$ 加倍且 $[B]$ 減半時，反應速率增為原來的 2 倍；當 $[A]$ 與 $[B]$ 同時加倍時，反應速率增為原來的 8 倍。則此反應對 $A$ 與 $B$ 的反應級數分別為何？',
        options: [
          'A. 對 A 為 1 級，對 B 為 2 級',
          'B. 對 A 為 2 級，對 B 為 1 級',
          'C. 對 A 為 2 級，對 B 為 0 級',
          'D. 對 A 為 3 級，對 B 為 0 級',
        ],
        answer: 'B',
        solution: '設速率定律式 $r = k [A]^m [B]^n$。\n1. 條件一：$2^m \\cdot (1/2)^n = 2^1 \\implies m - n = 1$\n2. 條件二：$2^m \\cdot 2^n = 2^{m+n} = 8 = 2^3 \\implies m + n = 3$\n3. 解聯立方程式：\n- $(m - n) + (m + n) = 2m = 4 \\implies m = 2$\n- $n = 3 - 2 = 1$\n因此對 A 為 2 級，對 B 為 1 級，總級數為 3 級。故選 B。',
        hint: '$m - n = 1$ 且 $m + n = 3 \\implies m = 2, n = 1$。',
        competency: '動力學實驗數據聯立解構：反應級數與速率方程式推導',
        tags: ['分科測驗', '初速率法', '反應級數'],
      },
      {
        id: 'ast_q2',
        title: '弱酸緩衝體系 pH 精密計算',
        strand: 'electrochemistry',
        type: 'fill',
        difficulty: 4,
        question: '將 $0.20\\text{ M}$ 氫氰酸（$\\text{HCN}$，$\\text{p}K_a = 9.30$）$50\\text{ mL}$ 與 $0.10\\text{ M}\\text{ NaOH}$ 水溶液 $50\\text{ mL}$ 均勻混合。求所得緩衝溶液在 $25^\\circ\\text{C}$ 下的 $\\text{pH}$ 值。',
        answer: 9.3,
        solution: '1. 計算反應前莫耳數：\n- $n(\\text{HCN}) = 0.20 \\times 0.050 = 0.010\\text{ mol}$\n- $n(\\text{NaOH}) = 0.10 \\times 0.050 = 0.0050\\text{ mol}$\n2. 酸鹼中和後：\n- 消耗 $\\text{NaOH} = 0.0050\\text{ mol}$，生成 $\\text{CN}^- = 0.0050\\text{ mol}$\n- 剩餘 $\\text{HCN} = 0.010 - 0.0050 = 0.0050\\text{ mol}$\n3. 弱酸與共軛鹼莫耳數相等 $[\\text{CN}^-] = [\\text{HCN}]$（半當量點）：\n$$\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{CN}^-]}{[\\text{HCN}]} = 9.30 + \\log 1 = 9.30$$。',
        hint: '弱酸中和一半恰達半當量點 ➜ $\\text{pH} = \\text{p}K_a = 9.30$。',
        competency: '酸鹼平衡與緩衝溶液計量：半當量點狀態運算',
        tags: ['分科測驗', '緩衝溶液', 'Henderson-Hasselbalch'],
      },
      {
        id: 'ast_q3',
        title: '伏打電池電動勢與化學平衡熱力學關係',
        strand: 'electrochemistry',
        type: 'choice',
        difficulty: 4,
        question: '對於標準鋅銅電池：$\\text{Zn(s)} + \\text{Cu}^{2+}\\text{(aq, 1M)} \\rightarrow \\text{Zn}^{2+}\\text{(aq, 1M)} + \\text{Cu(s)}$，$E^\\circ_{\\text{cell}} = +1.10\\text{ V}$。若在銅半電池中「加入適量硫化鈉 (Na2S) 固體」，則電池電動勢 $E_{\\text{cell}}$ 的變化為何？',
        options: [
          'A. 電池電動勢增大',
          'B. 電池電動勢減小',
          'C. 電池電動勢保持不變',
          'D. 電池立即發生逆向自發充電',
        ],
        answer: 'B',
        solution: '1. 加入 $\\text{Na}_2\\text{S}$ 固體會解離出 $\\text{S}^{2-}$ 離子。\n2. $\\text{Cu}^{2+}$ 與 $\\text{S}^{2-}$ 反應生成極難溶的黑色 $\\text{CuS}$ 沉澱 ($K_{sp} \\approx 10^{-36}$)，使得銅半電池中的游離 $[\\text{Cu}^{2+}]$ 濃度劇烈下降。\n3. 根據能斯特方程式 $E = E^\\circ - \\frac{0.0592}{2}\\log\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]}$ 或勒沙特列原理：反應物 $[\\text{Cu}^{2+}]$ 劇降，反應正向驅動力降低，因此電池輸出電動勢 $E$ 顯著減小。故選 B。',
        hint: '加 S(2-) 沉澱 Cu2+ ➜ 反應物濃度下降 ➜ 電池電壓 E 減小。',
        competency: '電化學與沉澱平衡耦合：能斯特方程式與離子濃度對電位之影響',
        tags: ['分科測驗', '能斯特方程式', '電池電動勢'],
      },
    ],
  },
}
