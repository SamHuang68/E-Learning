export const UI_ZH = {
  'ui.rootMissing': '找不到 #root',
  'ui.radarTitle': '{track} · 練習紀錄雷達',
  'ui.radarAvg': '紀錄指標：{score} / 100',
  'ui.radarStrong': '目前較多紀錄：',
  'ui.radarExplore': '可先探索：',
  'ui.radarPoints': '{label} ({score}分)',
  'ui.radarAriaTitle': '{track}練習紀錄雷達',
  'ui.radarAriaDesc': '本機紀錄指標 {score}。{details}。此圖不是能力診斷。',
  'ui.radarRow': '{label}：{score} / {total}',
} as const

export const UI_EN: { [K in keyof typeof UI_ZH]: string } = {
  'ui.rootMissing': 'Cannot find #root',
  'ui.radarTitle': '{track} · practice radar',
  'ui.radarAvg': 'Saved index: {score} / 100',
  'ui.radarStrong': 'Most saved evidence:',
  'ui.radarExplore': 'Explore next:',
  'ui.radarPoints': '{label} ({score})',
  'ui.radarAriaTitle': '{track} practice radar',
  'ui.radarAriaDesc': 'Local index {score}. {details}. This chart is not a skill diagnosis.',
  'ui.radarRow': '{label}: {score} / {total}',
}
