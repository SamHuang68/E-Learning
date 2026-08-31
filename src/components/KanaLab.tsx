import { useEffect, useMemo, useRef, useState } from 'react'
import {
  LEARN_ORDER,
  VOWEL_HEADERS,
  flattenKana,
  getKanaRows,
  getRowById,
  type KanaCell,
  type LearnRowId,
} from '../data/kana'
import {
  playKanaRomaji,
  playKanaSequence,
  stopKanaAudio,
  warmKanaAudio,
} from '../utils/kanaAudio'
import {
  defaultKanaProgress,
  loadKanaProgress,
  saveKanaProgress,
  type KanaProgress,
} from '../utils/storage'

type Mode = 'chart' | 'flash' | 'listen' | 'guide'
type Props = {
  onXp?: (amount: number) => void
  onProgressChange?: (mastered: number, total: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function KanaLab({ onXp, onProgressChange }: Props) {
  const [progress, setProgress] = useState<KanaProgress>(() => loadKanaProgress())
  const [mode, setMode] = useState<Mode>('chart')
  const [activeRow, setActiveRow] = useState<LearnRowId>('a')
  const [selected, setSelected] = useState<KanaCell | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [voiceOk] = useState(typeof Audio !== 'undefined')
  const [flashIndex, setFlashIndex] = useState(0)
  const [flashRevealed, setFlashRevealed] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [quiz, setQuiz] = useState<{
    answer: KanaCell
    options: KanaCell[]
    feedback: 'idle' | 'correct' | 'wrong'
  } | null>(null)
  const [guideIndex, setGuideIndex] = useState(-1)
  const [showDual, setShowDual] = useState(false)
  const cancelRef = useRef({ cancelled: false })

  const script = progress.script
  const rows = useMemo(() => getKanaRows(script, true), [script])
  const otherScript = script === 'hiragana' ? 'katakana' : 'hiragana'
  const otherRows = useMemo(() => getKanaRows(otherScript, true), [otherScript])
  const otherCellMap = useMemo(() => {
    const map = new Map<string, string>()
    otherRows.forEach((r) => {
      r.cells.forEach((c) => {
        if (c) map.set(c.romaji, c.char)
      })
    })
    return map
  }, [otherRows])
  const basicRows = useMemo(() => getKanaRows(script, false), [script])
  const activeCells = useMemo(() => {
    const row = getRowById(script, activeRow)
    return row ? row.cells.filter((c): c is KanaCell => c !== null) : []
  }, [script, activeRow])

  const masteredSet = useMemo(() => new Set(progress.mastered), [progress.mastered])
  const totalChars = useMemo(() => flattenKana(rows).length, [rows])
  const masteredCount = progress.mastered.filter((ch) =>
    flattenKana(rows).some((c) => c.char === ch),
  ).length

  useEffect(() => {
    saveKanaProgress(progress)
  }, [progress])

  useEffect(() => {
    const onHydrated = () => setProgress(loadKanaProgress())
    window.addEventListener('e-learning:progress-hydrated', onHydrated)
    return () =>
      window.removeEventListener('e-learning:progress-hydrated', onHydrated)
  }, [])

  useEffect(() => {
    onProgressChange?.(masteredCount, totalChars)
  }, [masteredCount, totalChars]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      cancelRef.current.cancelled = true
      stopKanaAudio()
    }
  }, [])

  useEffect(() => {
    // Reset practice state when script / row changes
    setFlashIndex(0)
    setFlashRevealed(false)
    setSelected(null)
    setQuiz(null)
    setGuideIndex(-1)
    cancelRef.current.cancelled = true
    stopKanaAudio()
    setSpeaking(false)
  }, [script, activeRow])

  function patch(p: Partial<KanaProgress>) {
    setProgress((prev) => ({ ...prev, ...p }))
  }

  function speak(cell: KanaCell) {
    setSelected(cell)
    setSpeaking(true)
    void warmKanaAudio()
    playKanaRomaji(cell.romaji, {
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    })
  }

  function markMastered(char: string) {
    if (masteredSet.has(char)) return
    patch({ mastered: [...progress.mastered, char] })
    onXp?.(3)
  }

  function startListenRound() {
    const pool = activeCells.length >= 2 ? activeCells : flattenKana(basicRows)
    if (pool.length < 2) return
    const answer = pool[Math.floor(Math.random() * pool.length)]
    const distractors = shuffle(pool.filter((c) => c.char !== answer.char)).slice(0, 3)
    const options = shuffle([answer, ...distractors])
    setQuiz({ answer, options, feedback: 'idle' })
    setSpeaking(true)
    playKanaRomaji(answer.romaji, {
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    })
  }

  function answerQuiz(choice: KanaCell) {
    if (!quiz || quiz.feedback !== 'idle') return
    const correct = choice.char === quiz.answer.char
    setQuiz({ ...quiz, feedback: correct ? 'correct' : 'wrong' })
    patch({
      quizCorrect: progress.quizCorrect + (correct ? 1 : 0),
      quizTotal: progress.quizTotal + 1,
    })
    if (correct) {
      markMastered(choice.char)
      onXp?.(5)
    }
    playKanaRomaji(quiz.answer.romaji)
  }

  function runGuide() {
    const cells = activeCells
    if (!cells.length) return

    cancelRef.current = { cancelled: false }
    setSpeaking(true)
    setMode('guide')
    setGuideIndex(0)
    setSelected(cells[0])

    void (async () => {
      // Unlock AudioContext in this click turn, then preload before first mora.
      await warmKanaAudio()
      if (cancelRef.current.cancelled) return
      await playKanaSequence(
        cells.map((c) => c.romaji),
        400,
        (i) => {
          setGuideIndex(i)
          setSelected(cells[i] ?? null)
        },
        cancelRef.current,
      )
      if (!cancelRef.current.cancelled) {
        setSpeaking(false)
        setGuideIndex(-1)
      }
    })()
  }

  function stopGuide() {
    cancelRef.current.cancelled = true
    stopKanaAudio()
    setSpeaking(false)
    setGuideIndex(-1)
  }

  function goFlash(delta: number) {
    if (!activeCells.length) return
    const next = (flashIndex + delta + activeCells.length) % activeCells.length
    setFlashIndex(next)
    setFlashRevealed(false)
    const cell = activeCells[next]
    if (autoPlay && cell) speak(cell)
  }

  useEffect(() => {
    if (mode === 'flash' && autoPlay && activeCells[flashIndex]) {
      speak(activeCells[flashIndex])
    }
    // intentionally only when entering flash / changing index via buttons
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  return (
    <section className="kana-lab">
      <header className="kana-hero">
        <div>
          <p className="eyebrow">FOUNDATION · 五十音</p>
          <h2>平假名／片假名 · 語音導讀互動</h2>
          <p className="lede">
            日文並非人人在學校必修——先打好五十音再進入 JLPT
            級距。點字聽音、跟讀閃卡、聽音選字；可自由選任一行練習。
          </p>
          <div className="kana-stats">
            <span>
              已掌握 {masteredCount}/{totalChars}
            </span>
            <span>
              聽辨 {progress.quizCorrect}/{progress.quizTotal || 0}
            </span>
            <span className={speaking ? 'live' : ''}>
              {speaking ? '🔊 導讀中' : voiceOk ? '音訊就緒 · MP3' : '瀏覽器不支援音訊'}
            </span>
          </div>
        </div>
        <div className="kana-script-toggle" role="group" aria-label="假名種類">
          <button
            type="button"
            className={script === 'hiragana' ? 'active' : ''}
            onClick={() => patch({ script: 'hiragana' })}
          >
            <strong>あ</strong>
            <span>平假名</span>
          </button>
          <button
            type="button"
            className={script === 'katakana' ? 'active' : ''}
            onClick={() => patch({ script: 'katakana' })}
          >
            <strong>ア</strong>
            <span>片假名</span>
          </button>
          <button
            type="button"
            className={showDual ? 'active' : ''}
            style={{ borderColor: showDual ? '#f59e0b' : undefined }}
            onClick={() => setShowDual(!showDual)}
            title="同時顯示平假名與片假名對照"
          >
            <strong style={{ color: showDual ? '#f59e0b' : undefined }}>あ/ア</strong>
            <span>雙向對照</span>
          </button>
        </div>
      </header>

      <div className="kana-toolbar">
        <div className="mode-tabs">
          {(
            [
              ['chart', '五十音表'],
              ['flash', '跟讀閃卡'],
              ['listen', '聽音選字'],
              ['guide', '整行導讀'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={mode === id ? 'active' : ''}
              onClick={() => {
                stopGuide()
                setMode(id)
                if (id === 'listen') startListenRound()
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="row-select">
          <span>練習行</span>
          <select
            value={activeRow}
            onChange={(e) => setActiveRow(e.target.value as LearnRowId)}
          >
            {LEARN_ORDER.map((id) => {
              const row = getRowById(script, id)
              return (
                <option key={id} value={id}>
                  {row?.label} {row?.labelZh}
                </option>
              )
            })}
          </select>
        </label>
      </div>

      {mode === 'chart' && (
        <div className="kana-chart-wrap">
          <div className="kana-chart-head">
            <span />
            {VOWEL_HEADERS.map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
          {rows.map((row) => (
            <div key={row.id} className="kana-chart-row">
              <div className="row-label">
                <strong>{row.label}</strong>
                <small>{row.labelZh}</small>
              </div>
              {row.cells.map((cell, idx) =>
                cell ? (
                  <button
                    key={cell.char}
                    type="button"
                    className={[
                      'kana-cell',
                      selected?.char === cell.char ? 'selected' : '',
                      masteredSet.has(cell.char) ? 'mastered' : '',
                      speaking && selected?.char === cell.char ? 'speaking' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      speak(cell)
                      markMastered(cell.char)
                    }}
                    aria-label={`${cell.char} ${cell.romaji}`}
                  >
                    <b>{cell.char}</b>
                    {showDual && (
                      <small style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700, margin: '-2px 0 1px' }}>
                        {otherCellMap.get(cell.romaji) || ''}
                      </small>
                    )}
                    <span>{cell.romaji}</span>
                  </button>
                ) : (
                  <div key={`empty-${row.id}-${idx}`} className="kana-cell empty" />
                ),
              )}
            </div>
          ))}
          <p className="hint-line">點任一假名即可語音導讀；聽過會標記為已掌握。</p>
        </div>
      )}

      {mode === 'flash' && (
        <div className="kana-flash">
          <div className="flash-stage">
            <button
              type="button"
              className="flash-kana"
              onClick={() => {
                const cell = activeCells[flashIndex]
                if (cell) {
                  speak(cell)
                  setFlashRevealed(true)
                }
              }}
            >
              {activeCells[flashIndex]?.char ?? '—'}
            </button>
            <div className={`kana-flash-meta ${flashRevealed ? 'show' : ''}`}>
              <strong>{activeCells[flashIndex]?.romaji}</strong>
              <span>{activeCells[flashIndex]?.tip ?? '點字重播語音'}</span>
            </div>
          </div>
          <div className="flash-actions">
            <label className="check">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
              />
              切換時自動朗讀
            </label>
            <button type="button" className="ghost" onClick={() => goFlash(-1)}>
              上一個
            </button>
            <button
              type="button"
              className="primary-btn inline"
              onClick={() => {
                const cell = activeCells[flashIndex]
                if (cell) {
                  setFlashRevealed(true)
                  speak(cell)
                  markMastered(cell.char)
                }
              }}
            >
              🔊 再聽一次
            </button>
            <button type="button" className="ghost" onClick={() => goFlash(1)}>
              下一個
            </button>
          </div>
          <p className="hint-line">
            {flashIndex + 1}/{activeCells.length} · 先聽音跟讀，再點開羅馬拼音核對
          </p>
        </div>
      )}

      {mode === 'listen' && (
        <div className="kana-listen">
          <div className="listen-prompt">
            <p className="eyebrow">LISTEN & CHOOSE</p>
            <h3>聽語音，選出正確假名</h3>
            <button
              type="button"
              className="speak-big"
              onClick={() => {
                if (quiz) {
                  setSpeaking(true)
                  playKanaRomaji(quiz.answer.romaji, {
                    onEnd: () => setSpeaking(false),
                    onError: () => setSpeaking(false),
                  })
                } else startListenRound()
              }}
            >
              {speaking ? '播放中…' : '🔊 播放題目'}
            </button>
          </div>
          <div className="listen-options">
            {(quiz?.options ?? []).map((opt) => {
              const isAnswer = opt.char === quiz?.answer.char
              const isPicked = selected?.char === opt.char
              const classes = ['listen-opt']
              if (quiz?.feedback !== 'idle' && isAnswer) classes.push('correct')
              if (quiz?.feedback === 'wrong' && isPicked && !isAnswer) {
                classes.push('wrong')
              }
              if (quiz?.feedback === 'wrong' && !isAnswer && !isPicked) {
                classes.push('dim')
              }
              return (
                <button
                  key={opt.char}
                  type="button"
                  className={classes.join(' ')}
                  disabled={!quiz || quiz.feedback !== 'idle'}
                  onClick={() => {
                    setSelected(opt)
                    answerQuiz(opt)
                  }}
                >
                  {opt.char}
                </button>
              )
            })}
          </div>
          {quiz?.feedback === 'correct' && (
            <p className="status-line">正確！{quiz.answer.char} = {quiz.answer.romaji}</p>
          )}
          {quiz?.feedback === 'wrong' && (
            <p className="status-line warn">
              再聽一次：答案是 {quiz.answer.char}（{quiz.answer.romaji}）
            </p>
          )}
          <button
            type="button"
            className="primary-btn"
            onClick={startListenRound}
            style={{ maxWidth: 280, marginTop: '0.75rem' }}
          >
            下一題
          </button>
        </div>
      )}

      {mode === 'guide' && (
        <div className="kana-guide">
          <p className="lede">
            整行語音導讀：依序朗讀「{getRowById(script, activeRow)?.label}」，可跟讀。
          </p>
          <div className="guide-strip">
            {activeCells.map((cell, i) => (
              <button
                key={cell.char}
                type="button"
                className={[
                  'kana-cell',
                  guideIndex === i ? 'speaking selected' : '',
                  masteredSet.has(cell.char) ? 'mastered' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => speak(cell)}
              >
                <b>{cell.char}</b>
                <span>{cell.romaji}</span>
              </button>
            ))}
          </div>
          <div className="flash-actions">
            <button
              type="button"
              className="primary-btn inline"
              onClick={runGuide}
              disabled={speaking}
            >
              ▶ 開始導讀
            </button>
            <button type="button" className="ghost" onClick={stopGuide}>
              停止
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => {
                activeCells.forEach((c) => markMastered(c.char))
              }}
            >
              標記本行已跟讀
            </button>
          </div>
        </div>
      )}

      {selected && (
        <aside className="kana-detail" aria-live="polite">
          <div>
            <strong className="detail-char">{selected.char}</strong>
            <div>
              <b>{selected.romaji}</b>
              <p>{selected.tip ?? '點擊可重複導讀'}</p>
            </div>
          </div>
          <button type="button" className="primary-btn inline" onClick={() => speak(selected)}>
            🔊 再讀一次
          </button>
        </aside>
      )}

      <div className="kana-reset-row">
        <button
          type="button"
          className="ghost"
          onClick={() => {
            if (confirm('確定重設五十音進度？')) {
              const fresh = defaultKanaProgress()
              setProgress(fresh)
              setActiveRow('a')
            }
          }}
        >
          重設五十音進度
        </button>
      </div>
    </section>
  )
}
