import React, { useEffect, useMemo, useRef, useState } from 'react'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { pickUi } from '../../i18n/pickUi'
import { TOCFL_MOCK_QUESTIONS } from '../data/tocflExam'
import { chineseTeachingCopy, localizeTocflQuestion } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
  onRecordError: (questionId: string) => void
}

export const ChineseMockExam: React.FC<Props> = ({ onEarnXp, onRecordError }) => {
  const { locale } = useI18n()
  const questions = useMemo(
    () => TOCFL_MOCK_QUESTIONS.map((question) => localizeTocflQuestion(question, locale)),
    [locale],
  )
  const text = (value: string) => chineseTeachingCopy(locale, value)
  const [isStarted, setIsStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [isFinished, setIsFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const handleSubmitRef = useRef<() => void>(() => undefined)

  useEffect(() => {
    if (!isStarted || isFinished || !isTimerRunning) return
    timerRef.current = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleSubmitRef.current()
          return 0
        }
        return previous - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isStarted, isFinished, isTimerRunning])

  function speakChinese(value: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(value)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  function handleSubmit() {
    setIsFinished(true)
    if (timerRef.current) clearInterval(timerRef.current)
    let totalEarned = 0
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctIndex) totalEarned += question.point
      else onRecordError(question.id)
    })
    if (totalEarned > 0) {
      onEarnXp(totalEarned)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }
  handleSubmitRef.current = handleSubmit

  const currentQuestion = questions[currentIndex]
  const totalScore = questions.reduce(
    (score, question, index) => score + (userAnswers[index] === question.correctIndex ? question.point : 0),
    0,
  )
  const maxScore = questions.reduce((score, question) => score + question.point, 0)
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const questionLabel = (index: number) => pickUi(locale, `第 ${index + 1} 題`, `Question ${index + 1}`)

  if (!isStarted) {
    return (
      <div className="math-lab chinese-mock-exam" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
        <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)' }}>
          <span aria-hidden="true" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🇹🇼 📝</span>
          <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.4rem' }}>{text('TOCFL 華語文能力測驗 A1/A2 模擬測驗')}</h2>
          <p style={{ margin: '0 auto 1.2rem', maxWidth: '480px', fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            {text('本測驗包含聽力理解、詞彙語法與生活閱讀 5 大題。考試時間 10 分鐘，交卷後立即產出日語弱點診斷並自動收錄錯題！')}
          </p>
          <button
            type="button"
            className="btn-primary"
            style={{ padding: '0.65rem 1.8rem', fontSize: '0.95rem' }}
            onClick={() => {
              setIsStarted(true)
              setTimeLeft(600)
              setIsTimerRunning(true)
              setIsFinished(false)
              setUserAnswers({})
              setCurrentIndex(0)
            }}
          >
            {text('🚀 開始模擬測驗 (10 分鐘)')}
          </button>
        </div>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="math-lab chinese-mock-exam" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.2rem' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <span aria-hidden="true" style={{ fontSize: '2rem' }}>🎉</span>
            <h2 style={{ margin: '0.2rem 0', fontSize: '1.3rem' }}>{text('TOCFL 模擬測驗成績診斷報告')}</h2>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', margin: '0.4rem 0' }}>
              {totalScore} / {maxScore} {pickUi(locale, '分', 'points')}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              {text(totalScore >= 40
                ? '🏆 恭喜達到 TOCFL A2 基礎級合格標準！'
                : '💪 距離 A2 合格還差一點，已將錯題存入錯題本！')}
            </span>
          </div>

          <h3 style={{ margin: '0 0 0.6rem', fontSize: '0.95rem' }}>{text('試題詳細批改與日語解析：')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index]
              const isCorrect = userAnswer === question.correctIndex
              return (
                <div
                  key={question.id}
                  style={{
                    background: 'var(--surface-soft)',
                    border: `1px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                    borderRadius: '10px',
                    padding: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{questionLabel(index)} · {question.section}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isCorrect ? '#10b981' : '#ef4444' }}>
                      {text(isCorrect ? '✓ 正解 (+10 分)' : '❌ 答錯')}
                    </span>
                  </div>
                  <strong lang="zh-Hant" style={{ fontSize: '0.9rem', display: 'block' }}>{question.promptZh}</strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                    {text('你的作答：')}{userAnswer !== undefined ? question.options[userAnswer]?.zh : text('未作答')}
                    {' · '}{text('正確答案：')}<strong>{question.options[question.correctIndex]?.zh}</strong>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', marginTop: '0.3rem', lineHeight: 1.4 }}>
                    <strong>{text('💡 解說：')}</strong><span lang={locale === 'en' ? 'en' : 'ja'}>{question.explanationJa}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
            <button type="button" className="btn-primary" onClick={() => setIsStarted(false)}>
              {text('🔄 重新測驗')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="math-lab chinese-mock-exam" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid var(--line)', marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span aria-hidden="true">⏱️</span>
          <strong style={{ fontSize: '0.9rem', color: timeLeft < 60 ? '#ef4444' : '#f59e0b', fontFamily: 'monospace' }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </strong>
          <button type="button" className="pill-btn" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }} onClick={() => setIsTimerRunning((value) => !value)}>
            {text(isTimerRunning ? '⏸️ 暫停' : '▶️ 繼續')}
          </button>
        </div>
        <button type="button" className="btn-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }} onClick={handleSubmit}>
          {text('📝 立即交卷')}
        </button>
      </div>

      <nav aria-label={pickUi(locale, '題號導覽', 'Question navigation')} style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {questions.map((question, index) => {
          const isAnswered = userAnswers[index] !== undefined
          const isCurrent = currentIndex === index
          return (
            <button aria-pressed={isCurrent}
              key={question.id}
              type="button"
              className={`pill-btn ${isCurrent ? 'active' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', background: isCurrent ? '#f59e0b' : isAnswered ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface-soft)', borderColor: isAnswered ? '#10b981' : 'var(--line)' }}
              onClick={() => setCurrentIndex(index)}
            >
              {questionLabel(index)} {isAnswered && '✓'}
            </button>
          )
        })}
      </nav>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>{currentQuestion.level}</span>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'var(--surface-soft)', border: '1px solid var(--line)' }}>{currentQuestion.section}</span>
          </div>
          {currentQuestion.audioText && (
            <button type="button" className="pill-btn" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }} onClick={() => speakChinese(currentQuestion.audioText!)}>
              {text('🔊 聽音檔朗讀')}
            </button>
          )}
        </div>
        <h2 lang="zh-Hant" style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.05rem', lineHeight: 1.4 }}>{currentQuestion.promptZh}</h2>
        <div lang="zh-Latn" style={{ fontSize: '0.76rem', color: '#f59e0b', marginBottom: '0.2rem' }}>{currentQuestion.promptPinyin}</div>
        <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginBottom: '0.8rem' }}>💡 <span lang={locale === 'en' ? 'en' : 'ja'}>{currentQuestion.promptJa}</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {currentQuestion.options.map((option, optionIndex) => {
            const isSelected = userAnswers[currentIndex] === optionIndex
            return (
              <button
                key={`${currentQuestion.id}-${optionIndex}`}
                type="button"
                className="practice-card"
                aria-pressed={isSelected}
                style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-soft)', borderColor: isSelected ? '#f59e0b' : 'var(--line)', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setUserAnswers((previous) => ({ ...previous, [currentIndex]: optionIndex }))}
              >
                <span>
                  <strong lang="zh-Hant" style={{ fontSize: '0.9rem' }}>{option.zh}</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--muted)', marginLeft: '0.5rem' }}><span lang="zh-Latn">{option.pinyin}</span> · <span lang={locale === 'en' ? 'en' : 'ja'}>{option.ja}</span></span>
                </span>
                {isSelected && <span style={{ color: '#f59e0b', fontWeight: 700 }}>{text('● 選擇')}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" className="pill-btn" disabled={currentIndex === 0} onClick={() => setCurrentIndex((value) => value - 1)}>{text('← 上一題')}</button>
        {currentIndex < questions.length - 1 ? (
          <button type="button" className="btn-primary" onClick={() => setCurrentIndex((value) => value + 1)}>{text('下一題 →')}</button>
        ) : (
          <button type="button" className="btn-primary" style={{ background: '#10b981' }} onClick={handleSubmit}>{text('✓ 完成交卷')}</button>
        )}
      </div>
    </div>
  )
}
