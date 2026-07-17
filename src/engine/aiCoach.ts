import type { LearningMeta } from '../utils/storage'

export function buildWeakReviewIds(meta: LearningMeta, limit = 5): string[] {
  return Object.values(meta.items)
    .filter(
      (item) =>
        item.lastResult === 'again' ||
        item.ease <= 2 ||
        item.lapses > 0,
    )
    .sort((a, b) => {
      if (a.lastResult === 'again' && b.lastResult !== 'again') return -1
      if (a.lastResult !== 'again' && b.lastResult === 'again') return 1
      if (a.ease !== b.ease) return a.ease - b.ease
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
    })
    .slice(0, Math.max(0, limit))
    .map((item) => item.id)
}

export function buildScenarioMission(track: 'ja' | 'en'): {
  title: string
  checklist: string[]
} {
  if (track === 'ja') {
    return {
      title: '今日の敬語ミッション',
      checklist: [
        '先用一句丁寧語開場，不直接命令對方',
        '說明原因時使用「〜てしまいました／〜ております」降低衝突',
        '收尾用「よろしくお願いいたします」或感謝語',
      ],
    }
  }

  return {
    title: 'Business register mission',
    checklist: [
      'Open with a polite acknowledgement',
      'State one clear constraint without blaming the other person',
      'Close with a specific next step and deadline',
    ],
  }
}
