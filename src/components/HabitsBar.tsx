type Props = {
  streak: number
  dailyDone: number
  dailyGoal: number
  compact?: boolean
}

export function HabitsBar({ streak, dailyDone, dailyGoal, compact = true }: Props) {
  const progress = dailyGoal > 0 ? Math.min(100, Math.round((dailyDone / dailyGoal) * 100)) : 0

  return (
    <aside className={compact ? 'habits-bar compact' : 'habits-bar'}>
      <div>
        <span className="eyebrow">HABIT</span>
        <strong>{streak} day streak</strong>
      </div>
      <div className="kana-progress-bar" aria-label={`Daily goal ${dailyDone}/${dailyGoal}`}>
        <i style={{ width: `${progress}%` }} />
      </div>
      <span>
        今日 {dailyDone}/{dailyGoal} cards
      </span>
    </aside>
  )
}
