import type { ChemistryQuestion } from '../data/curriculum'

export type ChemistryLabId =
  | 'titration'
  | 'periodic'
  | 'vsepr'
  | 'gas'
  | 'solubility'

export type ChemistryLabDefinition = Readonly<{
  id: ChemistryLabId
  name: string
  icon: string
  badge: string
  description: string
}>

const CHEMISTRY_LABS: Readonly<Record<ChemistryLabId, ChemistryLabDefinition>> = {
  titration: {
    id: 'titration',
    name: '酸鹼滴定與 pH 曲線實驗室',
    icon: '🧪',
    badge: '酸鹼中和與滴定曲線',
    description: '即時模擬強弱酸鹼滴定過程，觀測指示劑顏色漸變與 pH 突變滴定曲線。',
  },
  periodic: {
    id: 'periodic',
    name: '元素週期表探測器',
    icon: '🔬',
    badge: '元素週期規律性',
    description: '全景互動探索 1~36 號元素之電子組態、原子半徑、電負度與週期性變化。',
  },
  vsepr: {
    id: 'vsepr',
    name: 'VSEPR 分子空間幾何實驗室',
    icon: '📐',
    badge: '分子幾何與混成軌域',
    description: '立體旋轉探索價殼層電子對互斥理論、AXE 型態、混成軌域與空間幾何鍵角。',
  },
  gas: {
    id: 'gas',
    name: '理想氣體定律 PV=nRT 實驗室',
    icon: '🎈',
    badge: '氣體狀態與定律',
    description: '動態調節容器體積、溫度與氣體莫耳數，即時量測壓力變化並驗證氣體定律。',
  },
  solubility: {
    id: 'solubility',
    name: '溶解度與結晶析出實驗室',
    icon: '🧊',
    badge: '溶液飽和與結晶平衡',
    description: '升降溫動態調控水溶液飽和度，計算高低溫溶解度差異與晶體析出量。',
  },
}

/**
 * 現有五個互動實驗室能直接支援的 canonical 題目。
 *
 * 單元的 suggestedLab 是自然語言描述，且多數描述的實驗並不存在於五個可導覽頁面；
 * 因此不可把 suggestedLab、主軸或通用化學字詞當作路由契約。新增題目必須先確認
 * 互動實驗室能實際重現其核心模型，再明確加入此表。
 */
const LAB_ID_BY_QUESTION_ID = {
  g7_u1_q1: 'solubility',
  g7_u1_q2: 'solubility',
  g8_u4_q4: 'gas',
  g10_u2_q2: 'periodic',
  g10_u4_q1: 'gas',
  g11_u9_q2: 'vsepr',
  g12_u13_q1: 'titration',
  g12_u13_q2: 'titration',
  cap_q1: 'solubility',
  cap_q3: 'titration',
  gsat_q2: 'gas',
} as const satisfies Readonly<Record<string, ChemistryLabId>>

/** 只有具備明確 canonical 契約的題目才提供實驗室 CTA。 */
export function resolveChemistryLab(
  question: Pick<ChemistryQuestion, 'id'>,
): ChemistryLabDefinition | undefined {
  const labId = LAB_ID_BY_QUESTION_ID[
    question.id as keyof typeof LAB_ID_BY_QUESTION_ID
  ]
  return labId ? CHEMISTRY_LABS[labId] : undefined
}
