import { useEffect, useMemo, useState } from 'react'
import {
  isSpeechSupported,
  speakEnglish,
  speakSequence,
  stopSpeaking,
  warmVoices,
} from '../../utils/speech'
import { alphabet, starterWords, type PhonicsItem } from '../data/phonics'

type Mode = 'alphabet' | 'words' | 'listen' | 'guide'

type Props = {
  mastered: string[]
  onMaster: (id: string) => void
  onXp?: (amount: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function PhonicsLab({ mastered, onMaster, onXp }: Props) {
  const [mode, setMode] = useState<Mode>('alphabet')
  const [selected, setSelected] = useState<PhonicsItem | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [voiceOk, setVoiceOk] = useState(isSpeechSupported())
  const [flashIndex, setFlashIndex] = useState(0)
  const [quiz, setQuiz] = useState<{
    answer: PhonicsItem
    options: PhonicsItem[]
    feedback: 'idle' | 'correct' | 'wrong'
  } | null>(null)
  const [guideIndex, setGuideIndex] = useState(-1)
  const [cancel, setCancel] = useState({ cancelled: false })

  const pool = mode === 'words' || mode === 'listen' ? starterWords : alphabet
  const masteredSet = useMemo(() => new Set(mastered), [mastered])
  const total = alphabet.length + starterWords.length
  const masteredCount = mastered.filter(
    (id) =>
      alphabet.some((a) => a.id === id) || starterWords.some((w) => w.id === id),
  ).length

  useEffect(() => {
    void warmVoices().then((voices) => {
      setVoiceOk(
        isSpeechSupported() &&
          voices.some((v) => v.lang.toLowerCase().startsWith('en')),
      )
    })
    return () => {
      setCancel({ cancelled: true })
      stopSpeaking()
    }
  }, [])

  function speak(item: PhonicsItem) {
    setSelected(item)
    setSpeaking(true)
    speakEnglish(item.speak, {
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    })
  }

  function mark(item: PhonicsItem) {
    if (masteredSet.has(item.id)) return
    onMaster(item.id)
    onXp?.(3)
  }

  function startListen() {
    const source = starterWords
    const answer = source[Math.floor(Math.random() * source.length)]
    const distractors = shuffle(source.filter((x) => x.id !== answer.id)).slice(
      0,
      3,
    )
    setQuiz({
      answer,
      options: shuffle([answer, ...distractors]),
      feedback: 'idle',
    })
    setSpeaking(true)
    speakEnglish(answer.speak, {
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    })
  }

  function answerQuiz(choice: PhonicsItem) {
    if (!quiz || quiz.feedback !== 'idle') return
    const correct = choice.id === quiz.answer.id
    setQuiz({ ...quiz, feedback: correct ? 'correct' : 'wrong' })
    setSelected(choice)
    if (correct) {
      mark(choice)
      onXp?.(5)
    }
    speakEnglish(quiz.answer.speak)
  }

  async function runGuide() {
    const signal = { cancelled: false }
    setCancel(signal)
    setSpeaking(true)
    setMode('guide')
    await speakSequence(
      alphabet.slice(0, 10).map((a) => a.speak),
      500,
      (i) => {
        setGuideIndex(i)
        setSelected(alphabet[i] ?? null)
      },
      signal,
      'en-US',
    )
    setSpeaking(false)
    setGuideIndex(-1)
  }

  return (
    <section className="kana-lab phonics-lab">
      <header className="kana-hero">
        <div>
          <p className="eyebrow">ORANGE · PHONICS</p>
          <h2>字母／常用字 · en-US 點讀</h2>
          <p className="lede">
            橘／棕證書打底：點字母聽音、跟讀高頻字，再用聽音選字確認。
          </p>
          <div className="kana-stats">
            <span>
              已掌握 {masteredCount}/{total}
            </span>
            <span className={speaking ? 'live' : ''}>
              {speaking
                ? '🔊 導讀中'
                : voiceOk
                  ? '音訊就緒 · en-US'
                  : '音訊待命'}
            </span>
          </div>
        </div>
      </header>

      <div className="kana-toolbar">
        <div className="mode-tabs">
          {(
            [
              ['alphabet', '字母表'],
              ['words', '常用字'],
              ['listen', '聽音選字'],
              ['guide', '字母導讀'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={mode === id ? 'active' : ''}
              onClick={() => {
                stopSpeaking()
                setMode(id)
                setFlashIndex(0)
                if (id === 'listen') startListen()
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(mode === 'alphabet' || mode === 'words') && (
        <div className="phonics-grid">
          {pool.map((item) => (
            <button
              key={item.id}
              type="button"
              className={[
                'kana-cell',
                selected?.id === item.id ? 'selected' : '',
                masteredSet.has(item.id) ? 'mastered' : '',
                speaking && selected?.id === item.id ? 'speaking' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                speak(item)
                mark(item)
              }}
            >
              <b>{item.label}</b>
              <span>{item.tip}</span>
            </button>
          ))}
        </div>
      )}

      {mode === 'words' && (
        <div className="flash-actions" style={{ marginTop: '0.75rem' }}>
          <button
            type="button"
            className="ghost"
            onClick={() => {
              const next = (flashIndex - 1 + starterWords.length) % starterWords.length
              setFlashIndex(next)
              speak(starterWords[next])
            }}
          >
            上一個
          </button>
          <button
            type="button"
            className="primary-btn inline"
            onClick={() => speak(starterWords[flashIndex])}
          >
            🔊 {starterWords[flashIndex]?.label}
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => {
              const next = (flashIndex + 1) % starterWords.length
              setFlashIndex(next)
              speak(starterWords[next])
            }}
          >
            下一個
          </button>
        </div>
      )}

      {mode === 'listen' && (
        <div className="kana-listen">
          <div className="listen-prompt">
            <p className="eyebrow">LISTEN & CHOOSE</p>
            <h3>聽語音，選出正確單字</h3>
            <button
              type="button"
              className="speak-big"
              onClick={() => {
                if (quiz) speak(quiz.answer)
                else startListen()
              }}
            >
              {speaking ? '播放中…' : '🔊 播放題目'}
            </button>
          </div>
          <div className="listen-options">
            {(quiz?.options ?? []).map((opt) => {
              const classes = ['listen-opt']
              if (quiz?.feedback !== 'idle' && opt.id === quiz?.answer.id) {
                classes.push('correct')
              }
              if (
                quiz?.feedback === 'wrong' &&
                selected?.id === opt.id &&
                opt.id !== quiz.answer.id
              ) {
                classes.push('wrong')
              }
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={classes.join(' ')}
                  disabled={!quiz || quiz.feedback !== 'idle'}
                  onClick={() => answerQuiz(opt)}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={startListen}
            style={{ maxWidth: 280, marginTop: '0.75rem' }}
          >
            下一題
          </button>
        </div>
      )}

      {mode === 'guide' && (
        <div className="kana-guide">
          <p className="lede">整段導讀 A–J（可跟讀），使用 en-US 語音。</p>
          <div className="guide-strip">
            {alphabet.slice(0, 10).map((cell, i) => (
              <button
                key={cell.id}
                type="button"
                className={[
                  'kana-cell',
                  guideIndex === i ? 'speaking selected' : '',
                  masteredSet.has(cell.id) ? 'mastered' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => speak(cell)}
              >
                <b>{cell.label}</b>
              </button>
            ))}
          </div>
          <div className="flash-actions">
            <button
              type="button"
              className="primary-btn inline"
              onClick={() => void runGuide()}
              disabled={speaking}
            >
              ▶ 開始導讀
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => {
                cancel.cancelled = true
                stopSpeaking()
                setSpeaking(false)
              }}
            >
              停止
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
