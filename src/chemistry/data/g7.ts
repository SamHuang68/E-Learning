import type { ChemistryUnit } from './curriculum'

/**
 * 108 課綱 G7 國中理化 (化學基礎篇：水溶液與混合物分離)
 * 對接國中教育會考 (CAP) 基本觀念與實驗素養。
 */
export const G7_CHEMISTRY_UNITS: ChemistryUnit[] = [
  {
    id: 101,
    key: 'g7_u1_solutions_and_solubility',
    title: '水溶液、濃度與溶解度',
    subtitle: '溶液組成（溶質/溶劑）、重量百分濃度 (%)、體積百分濃度、百萬分濃度 (ppm)、飽和溶液與溶解度曲線',
    strand: 'matter_structure',
    band: '必修',
    targetExam: '學科能力測驗 (GSAT)', // 會考與學測基礎
    concepts: [
      '溶液基本定義：溶液 = 溶質 + 溶劑。均勻混合物，顆粒直徑 $< 1\\text{ nm}$，靜置不產生沉澱，能通過濾紙。',
      '重量百分濃度計算：$P\\% = \\frac{W_{\\text{溶質}}}{W_{\\text{溶液}}} \\times 100\\% = \\frac{W_{\\text{溶質}}}{W_{\\text{溶質}} + W_{\\text{溶劑}}} \\times 100\\%$。',
      '百萬分濃度 (ppm)：$\\text{ppm} = \\frac{W_{\\text{溶質 (mg)}}}{W_{\\text{溶液 (kg)}}} = \\frac{W_{\\text{溶質}}}{W_{\\text{溶液}}} \\times 10^6$。',
      '溶解度定義：定溫下，$100\\text{ g}$ 溶劑所能溶解溶質的最大克數（$\\text{g 溶質} / 100\\text{ g 水}$）。',
      '飽和與未飽和：未飽和溶液可繼續溶解溶質；飽和溶液已達動態溶解平衡；過飽和溶液不穩定，加入晶種或震盪即析出結晶。',
    ],
    suggestedLab: '溶解度與濃度實作：硝酸鉀在不同水溫下之溶解度測定與降溫結晶觀察',
    totalPoints: 100,
    questions: [
      {
        id: 'g7_u1_q1',
        title: '重量百分濃度計算與食鹽水配製',
        strand: 'matter_structure',
        type: 'fill',
        difficulty: 2,
        question: '在 $20^\\circ\\text{C}$ 時，將 $20\\text{ g}$ 的食鹽溶於 $80\\text{ g}$ 的純水中充分攪拌使其完全溶解，則此食鹽水的「重量百分濃度」為多少 %？',
        answer: 20,
        solution: '重量百分濃度公式：\n$$P\\% = \\frac{W_{\\text{溶質}}}{W_{\\text{溶質}} + W_{\\text{溶劑}}} \\times 100\\% = \\frac{20\\text{ g}}{20\\text{ g} + 80\\text{ g}} \\times 100\\% = \\frac{20}{100} \\times 100\\% = 20\\%$$。',
        hint: '分母是溶液總質量（溶質 + 水 = 20 + 80 = 100 g）。',
        competency: '數學運算與定量分析：溶液濃度配製計算',
        tags: ['重量百分濃度', '水溶液', '國中理化'],
      },
      {
        id: 'g7_u1_q2',
        title: '溶解度曲線與降溫結晶析出質量',
        strand: 'matter_structure',
        type: 'choice',
        difficulty: 3,
        question: '已知硝酸鉀在 $60^\\circ\\text{C}$ 時的溶解度為 $110\\text{ g}/100\\text{ g 水}$，在 $20^\\circ\\text{C}$ 時的溶解度為 $32\\text{ g}/100\\text{ g 水}$。今取 $60^\\circ\\text{C}$ 的飽和硝酸鉀水溶液 $210\\text{ g}$，降溫冷卻至 $20^\\circ\\text{C}$，若水分未蒸發，則可析出多少克的硝酸鉀晶體？',
        options: [
          'A. 32 g',
          'B. 78 g',
          'C. 110 g',
          'D. 142 g',
        ],
        answer: 'B',
        solution: '1. 分析 $60^\\circ\\text{C}$ 飽和溶液的組成：\n- 溶解度為 $110\\text{ g}/100\\text{ g 水}$ ➜ 飽和溶液總質量為 $110 + 100 = 210\\text{ g}$。\n- 因此 $210\\text{ g}$ 飽和溶液中恰好含有 $100\\text{ g 水}$ 與 $110\\text{ g 硝酸鉀}$。\n2. 降溫至 $20^\\circ\\text{C}$：\n- $100\\text{ g 水}$ 最多只能溶解 $32\\text{ g}$ 硝酸鉀。\n3. 析出結晶質量：\n$$\\text{析出晶體} = 110\\text{ g} - 32\\text{ g} = 78\\text{ g}$$。\n故選 B。',
        hint: '210 g 飽和溶液恰為 100 g 水 + 110 g 溶質，降溫後析出 $110 - 32 = 78\\text{ g}$。',
        competency: '圖表判讀與實驗數據推理：溶解度曲線與結晶量計算',
        tags: ['溶解度曲線', '結晶析出', '硝酸鉀'],
      },
    ],
  },
  {
    id: 102,
    key: 'g7_u2_mixtures_separation',
    title: '物質的分類與混合物分離',
    subtitle: '純物質與混合物、物理性質與化學性質、過濾法、結晶法、簡易蒸餾與濾紙層析',
    strand: 'matter_structure',
    band: '必修',
    targetExam: '學科能力測驗 (GSAT)',
    concepts: [
      '物質分類體系：純物質 (元素如 $\\text{Fe}, \\text{O}_2$、化合物如 $\\text{H}_2\\text{O}, \\text{NaCl}$，具固定熔沸點) 與 混合物 (如 空氣、食鹽水，無固定熔沸點)。',
      '分離混合物之物理原理與公式：\n  - 過濾法：依據顆粒大小分離固體與液體（如 泥沙不溶顆粒留在濾紙上）。\n  - 蒸發結晶法：依據溶質熔沸點高於溶劑，加熱蒸發水份析出晶體：$\\text{NaCl(aq)} \\xrightarrow{\\Delta} \\text{NaCl(s)} + \\text{H}_2\\text{O(g)}$。\n  - 蒸餾法：依據沸點差異分離液體混合物（水 $100^\\circ\\text{C}$ 與乙醇 $78.3^\\circ\\text{C}$）。\n  - 濾紙層析：依據成分在固定相與流動相間的附著力與移動速率差異：$R_f = \\frac{\\text{物質移動距離}}{\\text{溶劑前沿移動距離}}$。',
    ],
    suggestedLab: '粗鹽提純實作：粗鹽溶解、過濾除雜、蒸發結晶獲得精鹽',
    totalPoints: 100,
    questions: [
      {
        id: 'g7_u2_q1',
        title: '粗鹽提純實驗各步驟之操作與原理',
        strand: 'matter_structure',
        type: 'choice',
        difficulty: 2,
        question: '在「粗鹽提純」實驗中，包含「溶解、過濾、蒸發結晶」三個主要步驟。下列關於實驗操作的敘述，何者正確？',
        options: [
          'A. 過濾時，漏斗頸下端應離開燒杯內壁懸空，以加速滴落',
          'B. 過濾能將溶於水中的泥沙顆粒除去，但不能除去溶解的食鹽',
          'C. 蒸發皿中的水分必須全部完全煮乾燒焦，才能熄滅酒精燈',
          'D. 濾紙摺疊後撕去一小角是為了增加透水孔徑',
        ],
        answer: 'B',
        solution: '過濾原理是利用顆粒大小差異，不溶於水的泥沙大顆粒留在濾紙上，而溶解在水中的鈉離子與氯離子能穿透濾紙孔隙進入濾液中，故 B 正確。\nA 錯誤：漏斗頸尖端應緊貼燒杯內壁，使濾液順流避免噴濺。\nC 錯誤：蒸發時當出現大量固體晶體且剩餘微量水分時即應熄火，利用餘溫烘乾。\nD 錯誤：撕去一小角是為了使濾紙與漏斗內壁緊密貼合不漏氣。故選 B。',
        hint: '過濾只能分離「未溶解的固體顆粒與液體」，無法分離溶解的溶質。',
        competency: '實驗操作素養：基本實驗器材操作規範與物質分離技術',
        tags: ['粗鹽提純', '過濾', '實驗操作'],
      },
    ],
  },
]

export const G7_CHEMISTRY_LABS = [
  {
    id: 'lab_g7_solubility_curve',
    name: '硝酸鉀溶解度曲線測定實驗',
    description: '測定不同水溫下的飽和溶解度，繪製溶解度曲線並計算降溫析出率。',
  },
  {
    id: 'lab_g7_salt_purification',
    name: '粗鹽提純與蒸發結晶實作',
    description: '練習溶解、摺疊濾紙過濾、陶瓷纖維網加熱蒸發結晶之標準實驗技能。',
  },
]
