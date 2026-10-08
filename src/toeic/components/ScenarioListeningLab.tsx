import { useState } from 'react'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

export type ToeicSupportLanguage = 'en' | 'zh' | 'ja'

type LocalizedText = Record<ToeicSupportLanguage, string>

type ScenarioQuestion = {
  id: string
  question: string
  questionJa: string
  options: string[]
  correctIndex: number
  explanationZh: string
  explanationJa: string
}

export type ScenarioListeningItem = {
  id: string
  title: string
  titleJa: string
  icon?: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: object
  questions: ScenarioQuestion[]
}

type Props<T extends ScenarioListeningItem> = {
  items: readonly T[]
  supportLang: ToeicSupportLanguage
  onEarnXp: (amount: number) => void
  className: string
  icon: string
  idleIcon?: string
  playingIcon?: string
  title: LocalizedText
  description: LocalizedText
  tipsKey?: keyof T & string
  accentColor?: string
  accentBackground?: string
  buttonBackground?: string
}

function pick(copy: LocalizedText, language: ToeicSupportLanguage): string {
  return copy[language]
}

function supportLanguageTag(language: ToeicSupportLanguage): 'en' | 'ja' | 'zh-Hant' {
  if (language === 'ja') return 'ja'
  if (language === 'zh') return 'zh-Hant'
  return 'en'
}

export function ScenarioListeningLab<T extends ScenarioListeningItem>({
  items,
  supportLang,
  onEarnXp,
  className,
  icon,
  idleIcon = icon,
  playingIcon = '🔊',
  title,
  description,
  tipsKey,
  accentColor = '#0284c7',
  accentBackground = 'rgba(14, 165, 233, 0.15)',
  buttonBackground = 'linear-gradient(135deg, #0284c7, #0369a1)',
}: Props<T>) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showScript, setShowScript] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  if (items.length === 0) return null
  const activeItem = items[selectedIdx % items.length]
  const isJa = supportLang === 'ja'
  const supportLangTag = supportLanguageTag(supportLang)
  const questionLangTag = isJa ? 'ja' : 'en'
  const accentLangTag = supportLang === 'en' ? 'en' : 'zh-Hant'
  const tipsLangTag = supportLang === 'en' ? 'en' : 'ja'
  const roles = Object.values(activeItem.dialogueRoles as Record<string, string>)
  const tips = tipsKey ? activeItem[tipsKey] : undefined

  const chrome = {
    play: supportLang === 'en' ? 'Play audio' : supportLang === 'ja' ? '音声を聴く' : '播放音訊',
    playing: supportLang === 'en' ? 'Playing…' : supportLang === 'ja' ? '再生中…' : '播放中…',
    showScript: supportLang === 'en' ? 'Show transcript' : supportLang === 'ja' ? 'スクリプトを表示' : '顯示逐字稿',
    hideScript: supportLang === 'en' ? 'Hide transcript' : supportLang === 'ja' ? 'スクリプトを隠す' : '隱藏逐字稿',
    keyTerms: supportLang === 'en' ? 'Key TOEIC terms:' : supportLang === 'ja' ? 'TOEIC 頻出ポイント：' : 'TOEIC 高頻重點：',
    explanation: supportLang === 'en' ? 'Explanation:' : supportLang === 'ja' ? '解説：' : '解析：',
    correct: supportLang === 'en' ? 'Correct' : supportLang === 'ja' ? '正解' : '答對',
  }

  function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = activeItem.targetAccent
    utterance.rate = 0.95
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    setIsPlaying(true)
    window.speechSynthesis.speak(utterance)
  }

  function handleSelectOption(questionId: string, optionIndex: number, correctIndex: number) {
    if (submitted[questionId]) return
    setSelectedAnswers((previous) => ({ ...previous, [questionId]: optionIndex }))
    setSubmitted((previous) => ({ ...previous, [questionId]: true }))
    if (optionIndex === correctIndex) {
      onEarnXp(15)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  return (
    <div className={`math-lab ${className}`} lang={supportLangTag} style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span aria-hidden="true">{icon}</span> {pick(title, supportLang)}
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {pick(description, supportLang)}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`pill-btn ${selectedIdx === index ? 'active' : ''}`}
            lang={supportLangTag}
            aria-pressed={selectedIdx === index}
            onClick={() => {
              setSelectedIdx(index)
              setShowScript(false)
            }}
          >
            {item.icon && <span aria-hidden="true">{item.icon}</span>} {isJa ? item.titleJa : item.title}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '0.8rem' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center', textAlign: 'center' }}>
          <div aria-hidden="true" style={{ width: '64px', height: '64px', borderRadius: '50%', background: isPlaying ? 'rgba(16, 185, 129, 0.2)' : accentBackground, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
            {isPlaying ? playingIcon : idleIcon}
          </div>

          <div>
            <span lang={accentLangTag} style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: accentBackground, color: accentColor, fontWeight: 700 }}>
              {activeItem.accentLabel}
            </span>
            {roles[0] && <h3 lang="en" style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.05rem' }}>{roles[0]}</h3>}
            {roles.slice(1).map((role) => (
              <span key={role} lang="en" style={{ display: 'block', fontSize: '0.76rem', color: 'var(--muted)' }}>{role}</span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.6rem 1.4rem', borderRadius: '999px', background: isPlaying ? '#10b981' : buttonBackground }}
              onClick={() => speak(activeItem.audioScript)}
            >
              {isPlaying ? chrome.playing : `▶ ${chrome.play}`}
            </button>
            <button type="button" className="pill-btn" aria-expanded={showScript} onClick={() => setShowScript((shown) => !shown)}>
              {showScript ? chrome.hideScript : `📝 ${chrome.showScript}`}
            </button>
          </div>

          {showScript && (
            <div lang="en" style={{ background: 'var(--surface-soft)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--line)', textAlign: 'left', fontSize: '0.78rem', lineHeight: 1.55, color: 'var(--text)', marginTop: '0.4rem', whiteSpace: 'pre-line' }}>
              {activeItem.audioScript}
            </div>
          )}

          {typeof tips === 'string' && (
            <div style={{ marginTop: 'auto', background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.74rem', color: 'var(--muted)', textAlign: 'left', lineHeight: 1.45 }}>
              💡 <strong>{chrome.keyTerms}</strong> <span lang={tipsLangTag}>{tips}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {activeItem.questions.map((question, questionIndex) => (
            <div key={question.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span lang="en" style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: accentBackground, color: accentColor, fontWeight: 700 }}>
                  Question {questionIndex + 1}
                </span>
                <h4 lang={questionLangTag} style={{ margin: 0, fontSize: '0.9rem' }}>{isJa ? question.questionJa : question.question}</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.35rem', marginTop: '0.6rem' }}>
                {question.options.map((option, optionIndex) => {
                  const isPicked = selectedAnswers[question.id] === optionIndex
                  const isCorrect = optionIndex === question.correctIndex
                  const isDone = submitted[question.id]
                  const border = isDone && isCorrect ? '#10b981' : isDone && isPicked ? '#ef4444' : 'var(--line)'
                  const background = isDone && isCorrect
                    ? 'rgba(16, 185, 129, 0.15)'
                    : isDone && isPicked
                      ? 'rgba(239, 68, 68, 0.15)'
                      : 'var(--surface-soft)'
                  return (
                    <button
                      key={option}
                      type="button"
                      className="practice-card"
                      disabled={isDone}
                      style={{ padding: '0.55rem 0.8rem', borderRadius: '8px', border: `1px solid ${border}`, background, textAlign: 'left', cursor: isDone ? 'default' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      onClick={() => handleSelectOption(question.id, optionIndex, question.correctIndex)}
                    >
                      <span lang="en" style={{ fontSize: '0.82rem' }}>{option}</span>
                      {isDone && isCorrect && <span style={{ color: '#10b981', fontWeight: 700 }}>✓ {chrome.correct} (+15 XP)</span>}
                    </button>
                  )
                })}
              </div>

              {submitted[question.id] && (
                <div aria-live="polite" style={{ marginTop: '0.6rem', padding: '0.6rem', borderRadius: '8px', background: 'var(--surface-soft)', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                  💡 <strong>{chrome.explanation}</strong> {isJa ? question.explanationJa : question.explanationZh}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
