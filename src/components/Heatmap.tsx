import type { LearningMeta } from '../utils/storage'

type Props = {
  events: LearningMeta['events']
}

const DAY_MS = 24 * 60 * 60 * 1000

function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function shortLabel(key: string): string {
  const [, month, day] = key.split('-')
  return `${month}/${day}`
}

export function Heatmap({ events }: Props) {
  const today = new Date()
  const days = Array.from({ length: 35 }, (_, index) => {
    const day = new Date(today.getTime() - (34 - index) * DAY_MS)
    return dateKey(day)
  })
  const counts = events.reduce<Record<string, number>>((acc, event) => {
    const parsed = new Date(event.t)
    if (!Number.isFinite(parsed.getTime())) return acc
    const key = dateKey(parsed)
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
  const max = Math.max(1, ...Object.values(counts))

  return (
    <div className="heatmap-card" aria-label="Last 35 days activity">
      <div>
        <p className="eyebrow">ACTIVITY</p>
        <strong>35-day heatmap</strong>
      </div>
      <div className="heatmap-grid">
        {days.map((day) => {
          const count = counts[day] ?? 0
          const level = count === 0 ? 0 : Math.max(1, Math.ceil((count / max) * 4))
          return (
            <span
              key={day}
              className={`heatmap-cell level-${level}`}
              title={`${shortLabel(day)} · ${count} events`}
              aria-label={`${shortLabel(day)}: ${count} events`}
            />
          )
        })}
      </div>
    </div>
  )
}
