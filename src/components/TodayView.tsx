import type { CSSProperties } from 'react'
import type { JlptLevel, Unit } from '../data/course'
import type { ProgressState } from '../utils/storage'
import { HeroArt } from './HeroArt'

type Props = {
  level: JlptLevel
  unit: Unit
  progress: ProgressState
  onOpenBuilder: () => void
  onOpenKana: () => void
  onStartVocab: () => void
  onStartReading: () => void
  onStartGrammar: () => void
  onSelectUnit: (id: number) => void
}

export function TodayView({
  level,
  unit,
  progress,
  onOpenBuilder,
  onOpenKana,
  onStartVocab,
  onStartReading,
  onStartGrammar,
  onSelectUnit,
}: Props) {
  const vocabPct = Math.round((progress.vocabDone / unit.words) * 100)
  const readingPct = Math.round((progress.readingDone / unit.reading) * 100)
  const grammarPct = progress.grammarStarted ? 40 : 0
  const overall = Math.round((vocabPct + readingPct + grammarPct) / 3)
  const ringDeg = Math.round((overall / 100) * 360)

  return (
    <section className="study-section today-view">
      <section
        className="unit-banner"
        style={{ '--unit-color': level.color } as CSSProperties}
      >
        <div>
          <span className="unit-pill">
            {level.band} · {level.tier} · Unit {unit.id}
          </span>
          <h2>{unit.titleJa}</h2>
          <p>{level.audience}</p>
          <div className="banner-actions">
            <button type="button" onClick={onStartVocab}>
              開始本課 →
            </button>
            <span>
              單字 {unit.words} · 閱讀 {unit.reading} · 文法 1
            </span>
          </div>
        </div>
        <HeroArt />
        <div
          className="progress-ring"
          style={{ '--progress': `${ringDeg}deg` } as CSSProperties}
        >
          <div>
            <strong>{overall}%</strong>
            <small>單元進度</small>
          </div>
        </div>
      </section>

      <div className="daily-review">
        <div>
          <p className="eyebrow">FOUNDATION · 五十音</p>
          <h2>還沒背完假名？</h2>
          <span>
            日文在台灣並非人人必修——先完成平假名／片假名語音導讀，再挑戰{' '}
            {level.band}。
          </span>
        </div>
        <button type="button" className="primary-btn inline" onClick={onOpenKana}>
          進入五十音 →
        </button>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">TODAY&apos;S PLAN</p>
          <h2>本單元學習路徑</h2>
        </div>
        <span>依序完成三項任務</span>
      </div>

      <div className="task-grid">
        <button type="button" onClick={onStartVocab}>
          <i>Aa</i>
          <span>TASK 01</span>
          <h3>核心單字</h3>
          <p>
            {progress.vocabDone}/{unit.words} 已完成
          </p>
          <b>前往學習 →</b>
        </button>
        <button type="button" onClick={onStartReading}>
          <i>読</i>
          <span>TASK 02</span>
          <h3>{unit.title}</h3>
          <p>
            {progress.readingDone}/{unit.reading} 題已作答
          </p>
          <b>前往學習 →</b>
        </button>
        <button type="button" onClick={onStartGrammar}>
          <i>文</i>
          <span>TASK 03</span>
          <h3>{unit.grammar}</h3>
          <p>{progress.grammarStarted ? '進行中' : '尚未練習'}</p>
          <b>前往學習 →</b>
        </button>
      </div>

      <div className="result-panel">
        <div>
          <strong>{overall}%</strong>
          <span>Unit {unit.id} 完成度</span>
        </div>
        <ul>
          <li>
            單字熟練：{progress.vocabDone}/{unit.words}
          </li>
          <li>
            閱讀作答：{progress.readingDone}/{unit.reading}
          </li>
          <li>文法練習：{progress.grammarStarted ? '進行中' : '尚未開始'}</li>
        </ul>
        <p>
          適合對象：{level.tier}（{level.band}）。可用課程設計器客製下一堂課。
        </p>
        <button type="button" className="text-link" onClick={onOpenBuilder}>
          打開課程設計器 →
        </button>
      </div>

      <button type="button" className="unit-test-card">
        <span>FINAL CHECKPOINT</span>
        <div>
          <strong>單元總測驗 · 15 題</strong>
          <small>單字 8 題＋閱讀 3 題＋文法 4 題，80 分過關</small>
        </div>
        <b>開始測驗 →</b>
      </button>

      <div className="unit-map">
        <h3>{level.mapTitle}</h3>
        <p>{level.mapDesc}</p>
        <div>
          {level.units.map((u) => (
            <button
              key={u.id}
              type="button"
              className={u.id === unit.id ? 'active' : ''}
              onClick={() => onSelectUnit(u.id)}
            >
              {u.id}
              <small>{u.title}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
