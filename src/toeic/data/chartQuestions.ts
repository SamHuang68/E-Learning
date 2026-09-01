/**
 * TOEIC 多益英語：商務圖表與視覺數據分析題庫 (Graphic & Visual Chart Practice)
 * 涵蓋多益 Part 3/4 聽力題組與 Part 7 閱讀中最常出現的 Bar Chart (長條圖)、Pie Chart (圓餅圖) 與 Schedule (時程表)。
 */

export interface ChartQuestionItem {
  id: string
  title: string
  titleJa: string
  chartType: 'BarChart' | 'PieChart' | 'Schedule'
  chartTitle: string
  chartData: Array<{ label: string; value: number; unit?: string; note?: string }>
  scenarioPassage: string
  questions: Array<{
    id: string
    question: string
    questionJa: string
    options: string[]
    correctIndex: number
    explanationZh: string
    explanationJa: string
  }>
}

export const CHART_QUESTIONS: ChartQuestionItem[] = [
  {
    id: 'chart-q-revenue-q3',
    title: '各區域季度營收長條圖分析',
    titleJa: '地域別四半期売上高（Q3 Regional Sales Bar Chart）',
    chartType: 'BarChart',
    chartTitle: 'Q3 Regional Sales Revenue ($ in Millions)',
    chartData: [
      { label: 'North America', value: 45, unit: '$M' },
      { label: 'Europe (EMEA)', value: 32, unit: '$M' },
      { label: 'Asia-Pacific', value: 58, unit: '$M' },
      { label: 'Latin America', value: 15, unit: '$M' },
    ],
    scenarioPassage: `Look at the graphic. The executive committee will award the annual regional performance bonus to the sales division that generated more than $50 million in revenue during the third quarter.`,
    questions: [
      {
        id: 'cq-1',
        question: 'Which regional division will receive the annual performance bonus?',
        questionJa: '年間業績ボーナスを獲得する地域部門はどこですか？',
        options: ['North America', 'Europe (EMEA)', 'Asia-Pacific', 'Latin America'],
        correctIndex: 2,
        explanationZh: '圖表中 Asia-Pacific 營收為 58 百萬美元，超過 50 百萬的獎金門檻。',
        explanationJa: 'グラフ上で5000万ドルを超えているのは「Asia-Pacific (58M)」のみであるため、Asia-Pacificが正解です。',
      },
    ],
  },
  {
    id: 'chart-q-market-share',
    title: '雲端運算產品市佔率圓餅圖',
    titleJa: 'クラウドサービス市場シェア（Cloud Market Share Pie Chart）',
    chartType: 'PieChart',
    chartTitle: 'Enterprise Cloud Market Share (%)',
    chartData: [
      { label: 'Alpha Cloud', value: 40, unit: '%' },
      { label: 'Beta Services', value: 25, unit: '%' },
      { label: 'Gamma Platform', value: 20, unit: '%' },
      { label: 'Others', value: 15, unit: '%' },
    ],
    scenarioPassage: `Look at the graphic. Our company is seeking a merger with the second largest provider in the market to consolidate our market presence.`,
    questions: [
      {
        id: 'cq-2',
        question: 'Which provider is targeted for the proposed merger?',
        questionJa: '合併のターゲットとなっているプロバイダーはどれですか？',
        options: ['Alpha Cloud', 'Beta Services', 'Gamma Platform', 'Others'],
        correctIndex: 1,
        explanationZh: '文中提及欲與市場第二大供應商合併。圓餅圖中第二大為佔比 25% 的 Beta Services。',
        explanationJa: '市場シェア第2位のプロバイダーは25%を占める「Beta Services」です。',
      },
    ],
  },
]
