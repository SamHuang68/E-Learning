import { useEffect, useMemo, useRef, useState } from 'react'
import {
  isSpeechSupported,
  speakEnglish,
  speakSequence,
  stopSpeaking,
  warmVoices,
} from '../../utils/speech'
import { alphabet, starterWords, type PhonicsItem } from '../data/phonics'
import { TOEIC_ACCENTS } from '../data/accents'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { pickUi } from '../../i18n/pickUi'
import { localizeToeicData } from '../teachingCopy'
import { formatPhonicsListenFeedback, type PhonicsQuizFeedback } from './phonicsFeedback'

type Mode = 'alphabet' | 'words' | 'listen' | 'accent' | 'guide'

type Props = {
  mastered: string[]
  onMaster: (id: string) => void
  onXp?: (amount: number) => void
}

type AccentQuiz = {
  itemId: string
  accentCode: string
  userChoice: string | null
  feedback: PhonicsQuizFeedback
}

type ListenQuiz = {
  answerId: string
  optionIds: string[]
  feedback: PhonicsQuizFeedback
  selectedId?: string
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
  const { locale } = useI18n()
  const words = useMemo(
    () => starterWords.map((item) => localizeToeicData(item, locale)),
    [locale],
  )
  const accents = useMemo(
    () => TOEIC_ACCENTS.map((item) => localizeToeicData(item, locale)),
    [locale],
  )
  const ui = (zh: string, en: string) => pickUi(locale, zh, en)
  const [mode, setMode] = useState<Mode>('alphabet')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [voiceOk, setVoiceOk] = useState(isSpeechSupported())
  const [flashIndex, setFlashIndex] = useState(0)
  const [quiz, setQuiz] = useState<ListenQuiz | null>(null)
  const [accentQuiz, setAccentQuiz] = useState<AccentQuiz | null>(null)
  const [guideIndex, setGuideIndex] = useState(-1)
  const cancel = useRef({ cancelled: false })

  const pool = mode === 'words' || mode === 'listen' ? words : alphabet
  const quizAnswer = quiz ? words.find((item) => item.id === quiz.answerId) : undefined
  const quizOptions = quiz
    ? quiz.optionIds
      .map((id) => words.find((item) => item.id === id))
      .filter((item): item is PhonicsItem => item !== undefined)
    : []
  const accentItem = accentQuiz
    ? words.find((item) => item.id === accentQuiz.itemId)
    : undefined
  const accentTarget = accentQuiz
    ? accents.find((item) => item.code === accentQuiz.accentCode)
    : undefined
  const masteredSet = useMemo(() => new Set(mastered), [mastered])
  const total = alphabet.length + starterWords.length
  const masteredCount = mastered.filter(
    (id) =>
      alphabet.some((a) => a.id === id) || words.some((w) => w.id === id),
  ).length

  useEffect(() => {
    void warmVoices().then((voices) => {
      setVoiceOk(
        isSpeechSupported() &&
          voices.some((v) => v.lang.toLowerCase().startsWith('en')),
      )
    })
    return () => {
      cancel.current.cancelled = true
      stopSpeaking()
    }
  }, [])

  function speak(item: PhonicsItem) {
    cancel.current.cancelled = true
    stopSpeaking()
    setSelectedId(item.id)
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
    const source = words
    const answer = source[Math.floor(Math.random() * source.length)]
    const distractors = shuffle(source.filter((x) => x.id !== answer.id)).slice(
      0,
      3,
    )
    setQuiz({
      answerId: answer.id,
      optionIds: shuffle([answer, ...distractors]).map((item) => item.id),
      feedback: 'idle',
    })
    setSpeaking(true)
    speakEnglish(answer.speak, {
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    })
  }

  function answerQuiz(choice: PhonicsItem) {
    if (!quiz || !quizAnswer || quiz.feedback !== 'idle') return
    const correct = choice.id === quiz.answerId
    setQuiz({ ...quiz, selectedId: choice.id, feedback: correct ? 'correct' : 'wrong' })
    setSelectedId(choice.id)
    if (correct) {
      mark(choice)
      onXp?.(5)
    }
    speakEnglish(quizAnswer.speak)
  }

  function startAccentQuiz() {
    const item = words[Math.floor(Math.random() * words.length)]
    const accent = accents[Math.floor(Math.random() * accents.length)]
    setAccentQuiz({
      itemId: item.id,
      accentCode: accent.code,
      userChoice: null,
      feedback: 'idle',
    })
    speakEnglish(item.speak, { lang: accent.code })
  }

  function answerAccentQuiz(choiceCode: string) {
    if (!accentQuiz || accentQuiz.feedback !== 'idle') return
    const isCorrect = choiceCode === accentQuiz.accentCode
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
    cancel.current.cancelled = true
    stopSpeaking()
    cancel.current = signal
    setSpeaking(true)
    setMode('guide')
    await speakSequence(
      alphabet.slice(0, 10).map((a) => a.speak),
      500,
      (i) => {
        setGuideIndex(i)
        setSelectedId(alphabet[i]?.id ?? null)
      },
      signal,
      'en-US',
    )
    if (!signal.cancelled) {
      setSpeaking(false)
      setGuideIndex(-1)
    }
  }

  return (
    <section className="kana-lab phonics-lab" lang={locale}>
      <header className="kana-hero">
        <div>
          <p className="eyebrow">ORANGE · PHONICS</p>
          <h2>{ui('字母／常用字 · 4 國口音盲測', 'Letters, Core Words, and Four-Accent Challenge')}</h2>
          <p className="lede">
            {ui(
              '橘／棕證書打底：點字母聽音、跟讀高頻字，再用 4 國口音盲測強化英澳加美聽辨力。',
              'Build an Orange/Brown foundation by hearing letter names, repeating high-frequency words, and distinguishing American, British, Australian, and Canadian accents.',
            )}
          </p>
          <div className="kana-stats">
            <span>
              {ui('已掌握', 'Mastered')} {masteredCount}/{total}
            </span>
            <span className={speaking ? 'live' : ''}>
              {speaking
                ? ui('🔊 導讀中', '🔊 Guided playback')
                : voiceOk
                  ? ui('音訊就緒 · 多國口音', 'Audio ready · four accents')
                  : ui('音訊待命', 'Audio unavailable')}
            </span>
          </div>
        </div>
      </header>

      <div className="kana-toolbar">
        <div className="mode-tabs">
          {(
            [
              ['alphabet', ui('字母表', 'Alphabet')],
              ['words', ui('常用字', 'Core words')],
              ['listen', ui('聽音選字', 'Listen and choose')],
              ['accent', ui('4國口音盲測', 'Four-accent challenge')],
              ['guide', ui('字母導讀', 'Letter guide')],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={mode === id ? 'active' : ''}
              aria-pressed={mode === id}
              onClick={() => {
                cancel.current.cancelled = true
                stopSpeaking()
                setSpeaking(false)
                setGuideIndex(-1)
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
                selectedId === item.id ? 'selected' : '',
                masteredSet.has(item.id) ? 'mastered' : '',
                speaking && selectedId === item.id ? 'speaking' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                speak(item)
                mark(item)
              }}
            >
              <b lang="en">{item.label}</b>
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
              const next = (flashIndex - 1 + words.length) % words.length
              setFlashIndex(next)
              speak(words[next])
            }}
          >
            {ui('上一個', 'Previous')}
          </button>
          <button
            type="button"
            className="primary-btn inline"
            onClick={() => speak(words[flashIndex])}
          >
            🔊 {words[flashIndex]?.label}
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => {
              const next = (flashIndex + 1) % words.length
              setFlashIndex(next)
              speak(words[next])
            }}
          >
            {ui('下一個', 'Next')}
          </button>
        </div>
      )}

      {mode === 'listen' && (
        <div className="kana-listen">
          <div className="listen-prompt">
            <p className="eyebrow">LISTEN & CHOOSE</p>
            <h3>{ui('聽語音，選出正確單字', 'Listen and choose the word you hear')}</h3>
            <button
              type="button"
              className="speak-big"
              onClick={() => {
                if (quizAnswer) speak(quizAnswer)
                else startListen()
              }}
            >
              {speaking ? ui('播放中…', 'Playing…') : ui('🔊 播放題目', '🔊 Play prompt')}
            </button>
          </div>
          <div className="listen-options">
            {quizOptions.map((opt) => {
              const classes = ['listen-opt']
              if (quiz?.feedback !== 'idle' && opt.id === quiz?.answerId) {
                classes.push('correct')
              }
              if (
                quiz?.feedback === 'wrong' &&
                quiz.selectedId === opt.id &&
                opt.id !== quiz.answerId
              ) {
                classes.push('wrong')
              }
              return (
                <button
                  key={opt.id}
                  type="button"
                  lang="en"
                  className={classes.join(' ')}
                  aria-disabled={!quiz || quiz.feedback !== 'idle'}
                  tabIndex={quiz?.feedback !== 'idle' ? -1 : undefined}
                  aria-pressed={quiz?.selectedId === opt.id}
                  onClick={() => answerQuiz(opt)}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
          <p role="status" aria-live="polite" aria-atomic="true">
            {quiz && quizAnswer
              ? formatPhonicsListenFeedback(locale, quiz.feedback, quizAnswer.label)
              : ''}
          </p>
          <button
            type="button"
            className="primary-btn"
            onClick={startListen}
            style={{ maxWidth: 280, marginTop: '0.75rem' }}
          >
            {ui('下一題', 'Next question')}
          </button>
        </div>
      )}

      {mode === 'accent' && (
        <div className="kana-listen" style={{ maxWidth: '520px', margin: '0 auto' }}>
          <p className="lede">
            {ui(
              '🎧 盲測挑戰：仔細聆聽發音，辨析這屬於美式、英式、澳式或加拿大口音！',
              '🎧 Listen carefully and identify whether the pronunciation is American, British, Australian, or Canadian.',
            )}
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
              「{accentItem?.label || 'office'}」
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              {accentItem?.tip || ui('商業高頻字', 'High-frequency business word')}
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                if (accentItem && accentTarget) {
                  speakEnglish(accentItem.speak, { lang: accentTarget.code })
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
              {ui('🔊 重複播放口音', '🔊 Replay accent')}
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
            {accents.map((acc) => {
              const isSelected = accentQuiz?.userChoice === acc.code
              const isTarget = accentQuiz?.accentCode === acc.code
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
                  aria-disabled={!accentQuiz || accentQuiz.feedback !== 'idle'}
                  tabIndex={accentQuiz?.feedback !== 'idle' ? -1 : undefined}
                  aria-pressed={isSelected}
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

          <div role="status" aria-live="polite" aria-atomic="true">
          {accentQuiz && accentTarget && accentQuiz.feedback !== 'idle' && (
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
                  ? ui(
                    `🎉 辨析正確！(+10 XP) 這是 ${accentTarget.flag} ${accentTarget.name}`,
                    `🎉 Correct! (+10 XP) This is ${accentTarget.flag} ${accentTarget.name}.`,
                  )
                  : ui(
                    `❌ 這是 ${accentTarget.flag} ${accentTarget.name}`,
                    `❌ This is ${accentTarget.flag} ${accentTarget.name}.`,
                  )}
              </strong>
              <div style={{ marginTop: '0.25rem', fontSize: '0.72rem' }}>
                💡 <b>{ui('口音特徵：', 'Accent features: ')}</b>{accentTarget.features} ({accentTarget.testWeight})
              </div>
            </div>
          )}
          </div>

          <button
            type="button"
            className="primary-btn"
            onClick={startAccentQuiz}
            style={{ maxWidth: 280, margin: '0 auto', display: 'block' }}
          >
            {ui('➡️ 下一題盲測', '➡️ Next accent challenge')}
          </button>
        </div>
      )}

      {mode === 'guide' && (
        <div className="kana-guide">
          <p className="lede">{ui('整段導讀 A–J（可跟讀），使用 en-US 語音。', 'Hear and repeat letters A–J with an en-US voice.')}</p>
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
              {ui('▶ 開始導讀', '▶ Start guided playback')}
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => {
                cancel.current.cancelled = true
                stopSpeaking()
                setSpeaking(false)
                setGuideIndex(-1)
              }}
            >
              {ui('停止', 'Stop')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
