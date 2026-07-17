import { summarizeEvents } from '../engine/analytics'
import type { LearningMeta } from '../utils/storage'

type Props = {
  meta: LearningMeta
}

export function AnalyticsPanel({ meta }: Props) {
  const summary = summarizeEvents(meta.events)
  const rows = Object.entries(summary.byType).sort((a, b) => b[1] - a[1])

  return (
    <section className="data-controls analytics-panel" aria-label="學習事件統計">
      <p className="eyebrow">ANALYTICS</p>
      <h2>事件統計</h2>
      {rows.length === 0 ? (
        <p className="data-controls-lede">尚無事件紀錄。</p>
      ) : (
        <div className="choice-grid">
          {rows.map(([type, count]) => (
            <div key={type} className="practice-card">
              <div className="flash-face">
                <strong>{type}</strong>
                <span className="flash-meaning">{count} events</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
