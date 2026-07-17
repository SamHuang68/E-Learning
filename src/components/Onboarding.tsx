import { useState } from 'react'
import type { LangId, LearningMeta } from '../utils/storage'

type Props = {
  track: LangId
  meta: LearningMeta
  onComplete: (meta: LearningMeta) => void
  onRunPlacement: () => void
}

const dailyGoals = [10, 20, 30]

export function Onboarding({ track, meta, onComplete, onRunPlacement }: Props) {
  const isJapanese = track === 'ja'
  const [dailyGoal, setDailyGoal] = useState(
    dailyGoals.includes(meta.dailyGoalCards) ? meta.dailyGoalCards : 20,
  )
  const [jlptDate, setJlptDate] = useState('')
  const [toeicBand, setToeicBand] = useState('470-725')

  function complete(runPlacement: boolean) {
    const eventPayload = isJapanese
      ? { track, jlptDate: jlptDate || 'undecided', dailyGoal }
      : { track, toeicBand, dailyGoal }
    onComplete({
      ...meta,
      onboardingDone: true,
      dailyGoalCards: dailyGoal,
      events: [
        ...meta.events,
        {
          t: new Date().toISOString(),
          type: 'onboarding_done',
          payload: eventPayload,
        },
      ].slice(-200),
    })
    if (runPlacement) onRunPlacement()
  }

  return (
    <section className="study-section onboarding-panel">
      <div className="unit-banner">
        <div>
          <span className="unit-pill">FIRST RUN · SETUP</span>
          <h2>{isJapanese ? '設定 JLPT 學習目標' : 'Set your TOEIC target'}</h2>
          <p>
            {isJapanese
              ? '先選目標日期與每天卡片量；也可以立刻做分級測驗，讓 Aoba 幫你建議起點。'
              : 'Pick a score band and daily card load; placement can route you to the right certificate level.'}
          </p>
        </div>
      </div>

      <div className="onboarding-grid">
        <div className="practice-card onboarding-card">
          <p className="eyebrow">TRACK GOAL</p>
          {isJapanese ? (
            <label className="onboarding-field">
              <span>JLPT 目標日期（可留空）</span>
              <input
                type="date"
                value={jlptDate}
                onChange={(event) => setJlptDate(event.target.value)}
              />
            </label>
          ) : (
            <label className="onboarding-field">
              <span>TOEIC score band</span>
              <select
                value={toeicBand}
                onChange={(event) => setToeicBand(event.target.value)}
              >
                <option value="10-465">Orange/Brown · 10-465</option>
                <option value="470-725">Green · 470-725</option>
                <option value="730-855">Blue · 730-855</option>
                <option value="860-990">Gold · 860-990</option>
              </select>
            </label>
          )}
        </div>

        <div className="practice-card onboarding-card">
          <p className="eyebrow">DAILY GOAL</p>
          <div className="goal-card-row">
            {dailyGoals.map((goal) => (
              <button
                key={goal}
                type="button"
                className={dailyGoal === goal ? 'active' : ''}
                onClick={() => setDailyGoal(goal)}
              >
                <strong>{goal}</strong>
                <span>cards/day</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="daily-review">
        <div>
          <p className="eyebrow">OPTIONAL PLACEMENT</p>
          <h2>{isJapanese ? '要先測級嗎？' : 'Run placement now?'}</h2>
          <span>
            {isJapanese
              ? '略過也沒問題，稍後可從側欄重新分級。'
              : 'You can skip this and retake placement from the sidebar later.'}
          </span>
        </div>
        <div className="flash-actions">
          <button type="button" className="ghost" onClick={() => complete(false)}>
            {isJapanese ? '先進入今日學習' : 'Start today'}
          </button>
          <button
            type="button"
            className="primary-btn inline"
            onClick={() => complete(true)}
          >
            {isJapanese ? '儲存並分級 →' : 'Save & place →'}
          </button>
        </div>
      </div>
    </section>
  )
}
