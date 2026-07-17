import { useMemo, useState } from 'react'
import {
  enScenarios,
  jaScenarios,
  type ScenarioOption,
  type ScenarioScript,
} from '../data/scenarios'

type ScenarioResult = {
  scenarioId: string
  correct: number
  total: number
}

type Props = {
  track: 'ja' | 'en'
  scenarios?: ScenarioScript[]
  onComplete: (result: ScenarioResult) => void
  onExit?: () => void
}

export function ScenarioPlayer({ track, scenarios, onComplete, onExit }: Props) {
  const bank = useMemo(
    () => scenarios ?? (track === 'ja' ? jaScenarios : enScenarios),
    [scenarios, track],
  )
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [beatIndex, setBeatIndex] = useState(0)
  const [picked, setPicked] = useState<ScenarioOption | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const scenario = bank[scenarioIndex]
  const beat = scenario?.beats[beatIndex]

  function reset(nextScenarioIndex: number) {
    setScenarioIndex(nextScenarioIndex)
    setBeatIndex(0)
    setPicked(null)
    setCorrectCount(0)
  }

  function choose(option: ScenarioOption) {
    if (picked) return
    setPicked(option)
    if (option.correct) setCorrectCount((count) => count + 1)
  }

  function next() {
    if (!scenario) return
    if (beatIndex < scenario.beats.length - 1) {
      setBeatIndex((current) => current + 1)
      setPicked(null)
      return
    }
    onComplete({
      scenarioId: scenario.id,
      correct: correctCount,
      total: scenario.beats.length,
    })
  }

  if (!scenario || !beat) {
    return (
      <section className="practice-view scenario-player">
        <p className="eyebrow">SCENARIO</p>
        <div className="practice-card">
          <div className="flash-face">
            <strong>沒有情境腳本</strong>
            <p>No scenario scripts are available.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="practice-view scenario-player">
      {onExit ? (
        <button type="button" className="ghost back" onClick={onExit}>
          ← 返回
        </button>
      ) : null}
      <p className="eyebrow">SCENARIO · {track.toUpperCase()}</p>
      <h1>
        {scenario.title}
        <span>
          {beatIndex + 1} / {scenario.beats.length}
        </span>
      </h1>
      <p className="lede">{scenario.scene}</p>

      <div className="flash-actions">
        {bank.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            className={itemIndex === scenarioIndex ? 'primary-btn inline' : 'ghost'}
            onClick={() => reset(itemIndex)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="practice-card">
        <div className="flash-face">
          <span className="scenario-chip">Beat {beatIndex + 1}</span>
          <strong>{beat.prompt}</strong>
        </div>
        <div className="choice-grid">
          {beat.options.map((option) => {
            const done = picked !== null
            const isPicked = picked?.text === option.text
            const className =
              done && option.correct
                ? 'choice-btn correct'
                : done && isPicked
                  ? 'choice-btn wrong'
                  : 'choice-btn'
            return (
              <button
                type="button"
                key={option.text}
                className={className}
                disabled={done}
                onClick={() => choose(option)}
              >
                {option.text}
                <span className="flash-meaning">{option.register}</span>
              </button>
            )
          })}
        </div>
        {picked ? (
          <p className={picked.correct ? 'status-line' : 'status-line warn'}>
            {picked.correct
              ? `語體合適：${picked.register}`
              : `這個語體偏 ${picked.register}，請選更合適的商務／丁寧表現。`}
          </p>
        ) : null}
        <div className="flash-actions">
          <button
            type="button"
            className="primary-btn inline"
            disabled={!picked}
            onClick={next}
          >
            {beatIndex >= scenario.beats.length - 1 ? '完成情境' : '下一步 →'}
          </button>
        </div>
      </div>
    </section>
  )
}
