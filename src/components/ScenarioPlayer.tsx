import { useMemo, useState } from 'react'
import {
  enScenarios,
  jaScenarios,
  type ScenarioOption,
  type ScenarioScript,
} from '../data/scenarios'
import { useI18n } from '../i18n/i18n'

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
  const { locale } = useI18n()
  const isEn = locale === 'en'
  const bank = useMemo(
    () => scenarios ?? (track === 'ja' ? jaScenarios : enScenarios),
    [scenarios, track],
  )
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [beatIndex, setBeatIndex] = useState(0)
  const [pickedText, setPickedText] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const scenario = bank[scenarioIndex]
  const beat = scenario?.beats[beatIndex]
  const picked = beat?.options.find((option) => option.text === pickedText) ?? null

  function reset(nextScenarioIndex: number) {
    setScenarioIndex(nextScenarioIndex)
    setBeatIndex(0)
    setPickedText(null)
    setCorrectCount(0)
  }

  function choose(option: ScenarioOption) {
    if (pickedText) return
    setPickedText(option.text)
    if (option.correct) setCorrectCount((count) => count + 1)
  }

  function next() {
    if (!scenario) return
    if (beatIndex < scenario.beats.length - 1) {
      setBeatIndex((current) => current + 1)
      setPickedText(null)
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
      <section className="practice-view scenario-player" lang={locale}>
        <p className="eyebrow">SCENARIO</p>
        <div className="practice-card">
          <div className="flash-face">
            <strong>{isEn ? 'No scenario scripts available' : '沒有情境腳本'}</strong>
            <p>{isEn ? 'No scenario scripts are available.' : '目前沒有可用的情境腳本。'}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="practice-view scenario-player" lang={locale}>
      {onExit ? (
        <button type="button" className="ghost back" onClick={onExit}>
          {isEn ? '← Back' : '← 返回'}
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
            const done = pickedText !== null
            const isPicked = pickedText === option.text
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
                <span lang={track}>{option.text}</span>
                <span className="flash-meaning">{option.register}</span>
              </button>
            )
          })}
        </div>
        {picked ? (
          <p
            className={picked.correct ? 'status-line' : 'status-line warn'}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {picked.correct
              ? isEn
                ? `Appropriate register: ${picked.register}`
                : `語體合適：${picked.register}`
              : isEn
                ? `This option is ${picked.register}. Choose a more suitable business expression.`
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
            {beatIndex >= scenario.beats.length - 1
              ? isEn ? 'Complete scenario' : '完成情境'
              : isEn ? 'Next step →' : '下一步 →'}
          </button>
        </div>
      </div>
    </section>
  )
}
