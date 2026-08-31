import { useEffect, useMemo, useState } from 'react'
import { n5Kanji, type KanjiEntry } from '../data/kanji'
import { SpeakButton } from './SpeakButton'

type Mode = 'chart' | 'flash' | 'quiz'

type QuizState = {
  answer: KanjiEntry
  options: KanjiEntry[]
  picked: string | null
}

type Props = {
  entries?: KanjiEntry[]
  mastered: string[]
  onMaster: (id: string) => void
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

function buildQuiz(entries: KanjiEntry[]): QuizState | null {
  if (entries.length === 0) return null
  const answer = entries[Math.floor(Math.random() * entries.length)]
  const distractors = shuffle(entries.filter((entry) => entry.id !== answer.id)).slice(0, 3)
  return {
    answer,
    options: shuffle([answer, ...distractors]),
    picked: null,
  }
}

export function KanjiLab({ entries = n5Kanji, mastered, onMaster }: Props) {
  const [mode, setMode] = useState<Mode>('chart')
  const [flashIndex, setFlashIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [quiz, setQuiz] = useState<QuizState | null>(() => buildQuiz(entries))
  const masteredSet = useMemo(() => new Set(mastered), [mastered])
  const active = entries[flashIndex] ?? entries[0]

  useEffect(() => {
    setFlashIndex(0)
    setRevealed(false)
    setQuiz(buildQuiz(entries))
  }, [entries])

  function nextFlash(delta: number) {
    if (entries.length === 0) return
    setFlashIndex((current) => (current + delta + entries.length) % entries.length)
    setRevealed(false)
  }

  function masteryButton(entry: KanjiEntry) {
    const isMastered = masteredSet.has(entry.id)
    return (
      <button
        type="button"
        className={isMastered ? 'ghost' : 'primary-btn inline'}
        onClick={() => onMaster(entry.id)}
      >
        {isMastered ? '已掌握／切換' : '標記掌握'}
      </button>
    )
  }

  return (
    <section className="kana-lab kanji-lab">
      <header className="kana-hero">
        <div>
          <p className="eyebrow">KANJI · N5</p>
          <h2>N5 漢字實驗室</h2>
          <p className="lede">
            先看字形與常見詞，再用閃卡與選擇題確認讀音／意思。掌握狀態由父層進度保存。
          </p>
          <div className="kana-stats">
            <span>
              已掌握 {mastered.filter((id) => entries.some((entry) => entry.id === id)).length}/
              {entries.length}
            </span>
            <span>模式：{mode}</span>
          </div>
        </div>
      </header>

      <div className="kana-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
          <div className="mode-tabs">
            {(
              [
                ['chart', '漢字表'],
                ['flash', '閃卡'],
                ['quiz', '意思選擇'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={mode === id ? 'active' : ''}
                onClick={() => setMode(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>高頻直通：</span>
            {entries.slice(0, 8).map((k, idx) => (
              <button
                key={k.id}
                type="button"
                className="pill-btn"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.35rem',
                  fontWeight: 700,
                  borderColor: flashIndex === idx ? '#38bdf8' : undefined,
                }}
                onClick={() => {
                  setFlashIndex(idx)
                  setRevealed(false)
                  setMode('flash')
                }}
              >
                {k.char}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === 'chart' ? (
        <div className="choice-grid">
          {entries.map((entry) => (
            <article key={entry.id} className="practice-card">
              <div className="flash-face">
                <strong className="detail-char">{entry.char}</strong>
                <span className="flash-meaning">
                  {entry.readings.join(' / ')} · {entry.meaning}
                </span>
                <p>{entry.words.join('、')}</p>
              </div>
              <div className="flash-actions">
                <SpeakButton lang="ja" text={entry.readings.join('、')} label="讀音" />
                {masteryButton(entry)}
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {mode === 'flash' && active ? (
        <div className="practice-card">
          <div className="flash-face">
            <strong className="detail-char">{active.char}</strong>
            {revealed ? (
              <>
                <span className="flash-meaning">
                  {active.readings.join(' / ')} · {active.meaning}
                </span>
                <p>{active.words.join('、')}</p>
              </>
            ) : (
              <p>先說出讀音與意思，再翻面確認。</p>
            )}
          </div>
          <div className="flash-actions">
            <button type="button" className="ghost" onClick={() => nextFlash(-1)}>
              ← 上一張
            </button>
            <SpeakButton lang="ja" text={active.readings.join('、')} label="讀音" />
            <button
              type="button"
              className="primary-btn inline"
              onClick={() => setRevealed((value) => !value)}
            >
              {revealed ? '隱藏' : '翻面'}
            </button>
            {masteryButton(active)}
            <button type="button" className="ghost" onClick={() => nextFlash(1)}>
              下一張 →
            </button>
          </div>
        </div>
      ) : null}

      {mode === 'quiz' && quiz ? (
        <div className="practice-card">
          <div className="flash-face">
            <p className="eyebrow">QUIZ</p>
            <strong className="detail-char">{quiz.answer.char}</strong>
            <p>選出正確意思。</p>
          </div>
          <div className="choice-grid">
            {quiz.options.map((option) => {
              const done = quiz.picked !== null
              const isAnswer = option.id === quiz.answer.id
              const isPicked = option.id === quiz.picked
              const className =
                done && isAnswer
                  ? 'choice-btn correct'
                  : done && isPicked
                    ? 'choice-btn wrong'
                    : 'choice-btn'
              return (
                <button
                  type="button"
                  key={option.id}
                  className={className}
                  disabled={done}
                  onClick={() => {
                    setQuiz({ ...quiz, picked: option.id })
                    if (isAnswer) onMaster(option.id)
                  }}
                >
                  {option.meaning}
                </button>
              )
            })}
          </div>
          {quiz.picked ? (
            <p className="status-line">
              {quiz.picked === quiz.answer.id ? '正確！' : `答案：${quiz.answer.meaning}`} ·{' '}
              {quiz.answer.readings.join(' / ')}
            </p>
          ) : null}
          <div className="flash-actions">
            <SpeakButton lang="ja" text={quiz.answer.readings.join('、')} label="讀音" />
            <button
              type="button"
              className="primary-btn inline"
              onClick={() => setQuiz(buildQuiz(entries))}
            >
              下一題
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
