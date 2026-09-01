import React, { useState, useEffect, useRef } from 'react'
import { TOCFL_MOCK_QUESTIONS, type TocflQuestion } from '../data/tocflExam'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
  onRecordError: (questionId: string) => void
}

export const ChineseMockExam: React.FC<Props> = ({ onEarnXp, onRecordError }) => {
  const [isStarted, setIsStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [isFinished, setIsFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 分鐘
  const [isTimerRunning, setIsTimerRunning] = useState(true)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isStarted || isFinished || !isTimerRunning) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isStarted, isFinished, isTimerRunning])

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  function handleSelectOption(optIdx: number) {
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }))
  }

  function handleSubmit() {
    setIsFinished(true)
    if (timerRef.current) clearInterval(timerRef.current)

    let totalEarned = 0
    TOCFL_MOCK_QUESTIONS.forEach((q, idx) => {
      const userAns = userAnswers[idx]
      if (userAns === q.correctIndex) {
        totalEarned += q.point
      } else {
        onRecordError(q.id)
      }
    })

    if (totalEarned > 0) {
      onEarnXp(totalEarned)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  const currentQ: TocflQuestion = TOCFL_MOCK_QUESTIONS[currentIndex]

  // 計算分數
  const totalScore = TOCFL_MOCK_QUESTIONS.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctIndex ? acc + q.point : acc
  }, 0)

  const maxScore = TOCFL_MOCK_QUESTIONS.reduce((acc, q) => acc + q.point, 0)

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="math-lab chinese-mock-exam" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {!isStarted ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🇹🇼 📝</span>
          <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.4rem' }}>TOCFL 華語文能力測驗 A1/A2 模擬測驗</h2>
          <p style={{ margin: '0 auto 1.2rem', maxWidth: '480px', fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            本測驗包含聽力理解、詞彙語法與生活閱讀 5 大題。考試時間 10 分鐘，交卷後立即產出日語弱點診斷並自動收錄錯題！
          </p>
          <button
            type="button"
            className="btn-primary"
            style={{ padding: '0.65rem 1.8rem', fontSize: '0.95rem' }}
            onClick={() => {
              setIsStarted(true)
              setTimeLeft(600)
              setIsFinished(false)
              setUserAnswers({})
              setCurrentIndex(0)
            }}
          >
            🚀 開始模擬測驗 (10 分鐘)
          </button>
        </div>
      ) : !isFinished ? (
        <div>
          {/* 計時器與題號導覽 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid var(--line)', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1rem' }}>⏱️</span>
              <strong style={{ fontSize: '0.9rem', color: timeLeft < 60 ? '#ef4444' : '#f59e0b', fontFamily: 'monospace' }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </strong>
              <button
                type="button"
                className="pill-btn"
                style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}
                onClick={() => setIsTimerRunning((prev) => !prev)}
              >
                {isTimerRunning ? '⏸️ 暫停' : '▶️ 繼續'}
              </button>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
              onClick={handleSubmit}
            >
              📝 立即交卷
            </button>
          </div>

          {/* 題號膠囊網格 */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
            {TOCFL_MOCK_QUESTIONS.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined
              const isCurrent = currentIndex === idx
              return (
                <button
                  key={idx}
                  type="button"
                  className={`pill-btn ${isCurrent ? 'active' : ''}`}
                  style={{
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.75rem',
                    background: isCurrent ? '#f59e0b' : isAnswered ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface-soft)',
                    borderColor: isAnswered ? '#10b981' : 'var(--line)',
                  }}
                  onClick={() => setCurrentIndex(idx)}
                >
                  第 {idx + 1} 題 {isAnswered && '✓'}
                </button>
              )
            })}
          </div>

          {/* 題目卡 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
                  {currentQ.level}
                </span>
                <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'var(--surface-soft)', border: '1px solid var(--line)' }}>
                  {currentQ.section}
                </span>
              </div>
              {currentQ.audioText && (
                <button
                  type="button"
                  className="pill-btn"
                  style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}
                  onClick={() => speakChinese(currentQ.audioText!)}
                >
                  🔊 聽音檔朗讀
                </button>
              )}
            </div>

            <h3 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.05rem', lineHeight: 1.4 }}>{currentQ.promptZh}</h3>
            <div style={{ fontSize: '0.76rem', color: '#f59e0b', marginBottom: '0.2rem' }}>{currentQ.promptPinyin}</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginBottom: '0.8rem' }}>💡 {currentQ.promptJa}</div>

            {/* 選項清單 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentIndex] === optIdx
                return (
                  <button
                    key={optIdx}
                    type="button"
                    className="practice-card"
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-soft)',
                      borderColor: isSelected ? '#f59e0b' : 'var(--line)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onClick={() => handleSelectOption(optIdx)}
                  >
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{opt.zh}</strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--muted)', marginLeft: '0.5rem' }}>{opt.pinyin} · {opt.ja}</span>
                    </div>
                    {isSelected && <span style={{ color: '#f59e0b', fontWeight: 700 }}>● 選擇</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 下一題 / 上一題導覽按鈕 */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="pill-btn"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
            >
              ← 上一題
            </button>
            {currentIndex < TOCFL_MOCK_QUESTIONS.length - 1 ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
              >
                下一題 →
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                style={{ background: '#10b981' }}
                onClick={handleSubmit}
              >
                ✓ 完成交卷
              </button>
            )}
          </div>
        </div>
      ) : (
        /* 成績單與診斷報告 */
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.2rem' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🎉</span>
            <h2 style={{ margin: '0.2rem 0', fontSize: '1.3rem' }}>TOCFL 模擬測驗成績診斷報告</h2>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', margin: '0.4rem 0' }}>
              {totalScore} / {maxScore} 分
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              {totalScore >= 40 ? '🏆 恭喜達到 TOCFL A2 基礎級合格標準！' : '💪 距離 A2 合格還差一點，已將錯題存入錯題本！'}
            </span>
          </div>

          {/* 各題批改與解析 */}
          <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.95rem' }}>試題詳細批改與日語解析：</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {TOCFL_MOCK_QUESTIONS.map((q, idx) => {
              const userAns = userAnswers[idx]
              const isCorrect = userAns === q.correctIndex
              return (
                <div
                  key={q.id}
                  style={{
                    background: 'var(--surface-soft)',
                    border: `1px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                    borderRadius: '10px',
                    padding: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                      第 {idx + 1} 題 · {q.section}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isCorrect ? '#10b981' : '#ef4444' }}>
                      {isCorrect ? '✓ 正解 (+10 分)' : '❌ 答錯'}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>{q.promptZh}</strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                    你的作答：{userAns !== undefined ? q.options[userAns]?.zh : '未作答'} ｜ 正確答案：<strong>{q.options[q.correctIndex]?.zh}</strong>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', marginTop: '0.3rem', lineHeight: 1.4 }}>
                    💡 <strong>解說：</strong>{q.explanationJa}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsStarted(false)}
            >
              🔄 重新測驗
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
