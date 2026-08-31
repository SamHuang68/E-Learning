import { useEffect, useMemo, useState } from 'react'
import {
  isSpeechSupported,
  speakEnglish,
  speakSequence,
  stopSpeaking,
  warmVoices,
} from '../../utils/speech'
import { alphabet, starterWords, type PhonicsItem } from '../data/phonics'
import { TOEIC_ACCENTS, type ToeicAccent } from '../data/accents'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

type Mode = 'alphabet' | 'words' | 'listen' | 'accent' | 'guide'

type Props = {
  mastered: string[]
  onMaster: (id: string) => void
  onXp?: (amount: number) => void
}

type AccentQuiz = {
  item: PhonicsItem
  accent: ToeicAccent
  userChoice: string | null
  feedback: 'idle' | 'correct' | 'wrong'
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
  const [accentQuiz, setAccentQuiz] = useState<AccentQuiz | null>(null)
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

  function startAccentQuiz() {
    const item = starterWords[Math.floor(Math.random() * starterWords.length)]
    const accent = TOEIC_ACCENTS[Math.floor(Math.random() * TOEIC_ACCENTS.length)]
    setAccentQuiz({
      item,
      accent,
      userChoice: null,
      feedback: 'idle',
    })
    speakEnglish(item.speak, { lang: accent.code })
  }

  function answerAccentQuiz(choiceCode: string) {
    if (!accentQuiz || accentQuiz.feedback !== 'idle') return
    const isCorrect = choiceCode === accentQuiz.accent.code
    setAccentQuiz({
      ...accentQuiz,
      userChoice: choiceCode,
      feedback: isCorrect ? 'correct' : 'wrong',
    })
    if (isCorrect) {
      playCorrectSound()
      onXp?.(10)
    } else {
      playWrongSound()
    }
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
          <h2>字母／常用字 · 4 國口音盲測</h2>
          <p className="lede">
            橘／棕證書打底：點字母聽音、跟讀高頻字，再用 4 國口音盲測強化英澳加美聽辨力。
          </p>
          <div className="kana-stats">
            <span>
              已掌握 {masteredCount}/{total}
            </span>
            <span className={speaking ? 'live' : ''}>
              {speaking
                ? '🔊 導讀中'
                : voiceOk
                  ? '音訊就緒 · 多國口音'
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
              ['accent', '4國口音盲測'],
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
                if (id === 'accent') startAccentQuiz()
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

      {mode === 'accent' && (
        <div className="kana-listen" style={{ maxWidth: '520px', margin: '0 auto' }}>
          <p className="lede">
            🎧 盲測挑戰：仔細聆聽發音，辨析這屬於美式、英式、澳式或加拿大口音！
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '1rem 0',
              padding: '1rem',
              background: 'var(--surface-soft)',
              borderRadius: '12px',
              border: '1px solid var(--line)',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              「{accentQuiz?.item.label || 'office'}」
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              {accentQuiz?.item.tip || '商業高頻字'}
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                if (accentQuiz) {
                  speakEnglish(accentQuiz.item.speak, { lang: accentQuiz.accent.code })
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                marginTop: '0.3rem',
              }}
            >
              🔊 重複播放口音
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
              marginBottom: '0.85rem',
            }}
          >
            {TOEIC_ACCENTS.map((acc) => {
              const isSelected = accentQuiz?.userChoice === acc.code
              const isTarget = accentQuiz?.accent.code === acc.code
              let btnBg = 'var(--surface)'
              let btnBorder = '1px solid var(--line)'
              let btnColor = 'var(--text-main)'

              if (accentQuiz && accentQuiz.feedback !== 'idle') {
                if (isTarget) {
                  btnBg = 'rgba(16, 185, 129, 0.15)'
                  btnBorder = '1.5px solid #10b981'
                  btnColor = '#059669'
                } else if (isSelected && !isTarget) {
                  btnBg = 'rgba(239, 68, 68, 0.15)'
                  btnBorder = '1.5px solid #ef4444'
                  btnColor = '#dc2626'
                }
              }

              return (
                <button
                  key={acc.code}
                  type="button"
                  onClick={() => answerAccentQuiz(acc.code)}
                  disabled={!accentQuiz || accentQuiz.feedback !== 'idle'}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: '8px',
                    border: btnBorder,
                    background: btnBg,
                    color: btnColor,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: accentQuiz && accentQuiz.feedback === 'idle' ? 'pointer' : 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{acc.flag}</span>
                  <span>{acc.name}</span>
                </button>
              )
            })}
          </div>

          {accentQuiz && accentQuiz.feedback !== 'idle' && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                background: accentQuiz.feedback === 'correct' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${accentQuiz.feedback === 'correct' ? '#10b981' : '#ef4444'}`,
                color: accentQuiz.feedback === 'correct' ? '#047857' : '#b91c1c',
                fontSize: '0.78rem',
                lineHeight: 1.5,
                marginBottom: '0.85rem',
              }}
            >
              <strong>
                {accentQuiz.feedback === 'correct'
                  ? `🎉 辨析正確！(+10 XP) 這是 ${accentQuiz.accent.flag} ${accentQuiz.accent.name}`
                  : `❌ 這是 ${accentQuiz.accent.flag} ${accentQuiz.accent.name}`}
              </strong>
              <div style={{ marginTop: '0.25rem', fontSize: '0.72rem' }}>
                💡 <b>口音特徵：</b>{accentQuiz.accent.features}（{accentQuiz.accent.testWeight}）
              </div>
            </div>
          )}

          <button
            type="button"
            className="primary-btn"
            onClick={startAccentQuiz}
            style={{ maxWidth: 280, margin: '0 auto', display: 'block' }}
          >
            ➡️ 下一題盲測
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
