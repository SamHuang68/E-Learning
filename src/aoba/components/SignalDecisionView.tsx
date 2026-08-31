import React, { useState } from 'react'
import { JAPANESE_SIGNAL_GROUPS, type GrammarSignalGroup, type JapaneseGrammarSignal } from '../data/grammarSignals'
import { playCorrectSound } from '../../engine/audioSynthesizer'

type Props = {
  onBack: () => void
}

/**
 * あおば日語 · 文法動作訊號決策室 (SignalDecisionView)
 * 借鏡 English Chunker 3 秒動作判別法：
 * 透過「看到什麼訊號 ➜ 3秒直覺判別」對照表，配合主動檢索測驗，搞懂日語最難搞的補助動詞與授受動詞。
 */
export const SignalDecisionView: React.FC<Props> = ({ onBack }) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(JAPANESE_SIGNAL_GROUPS[0].id)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState<string>('')

  const currentGroup: GrammarSignalGroup =
    JAPANESE_SIGNAL_GROUPS.find((g) => g.id === selectedGroupId) ?? JAPANESE_SIGNAL_GROUPS[0]

  const filteredSignals = currentGroup.signals.filter((s) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    return (
      s.pattern.toLowerCase().includes(term) ||
      s.meaningZh.toLowerCase().includes(term) ||
      s.signalTrigger.toLowerCase().includes(term) ||
      s.threeSecondRule.toLowerCase().includes(term)
    )
  })

  function handleSelectOption(signalId: string, optionIdx: number) {
    setQuizAnswers((prev) => ({ ...prev, [signalId]: optionIdx }))
    setShowSolutions((prev) => ({ ...prev, [signalId]: true }))
    const targetSig = currentGroup.signals.find((s) => s.id === signalId)
    if (targetSig && targetSig.quiz.correctIndex === optionIdx) {
      playCorrectSound()
    }
  }

  return (
    <div className="signal-decision-view">
      <div className="signal-top-bar">
        <button type="button" className="btn-back" onClick={onBack}>
          ← 返回今日學習
        </button>
        <div className="signal-group-pills">
          {JAPANESE_SIGNAL_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`pill-btn ${g.id === currentGroup.id ? 'active' : ''}`}
              onClick={() => setSelectedGroupId(g.id)}
            >
              {g.title.split('：')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 搜尋過濾列 */}
      <div style={{ margin: '0.6rem 0', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 搜尋文法訊號（如：〜ておく、準備、授受、完了…）"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '0.45rem 0.8rem',
            borderRadius: '8px',
            border: '1px solid var(--line)',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            fontSize: '0.82rem',
          }}
        />
        {searchTerm && (
          <button
            type="button"
            className="pill-btn"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
            onClick={() => setSearchTerm('')}
          >
            ✕ 清除
          </button>
        )}
      </div>

      {/* 標頭卡片 */}
      <div className="signal-hero-card">
        <span className="signal-badge">文法動作判準 · 3 秒決策樹</span>
        <h2>{currentGroup.title}</h2>
        <p className="hero-desc">{currentGroup.description}</p>
      </div>

      {/* 3 秒判斷對照表 */}
      <div className="signal-table-card">
        <h3>🎯 看到什麼情境訊號？3 秒快速判別表 ({filteredSignals.length} 組)</h3>
        <div className="table-responsive">
          <table className="decision-table">
            <thead>
              <tr>
                <th>句型 Pattern</th>
                <th>看到什麼情境訊號 (Trigger)</th>
                <th>3 秒直覺判準</th>
                <th>公式接續</th>
              </tr>
            </thead>
            <tbody>
              {filteredSignals.map((sig) => (
                <tr key={sig.id}>
                  <td className="pattern-cell">
                    <strong>{sig.pattern}</strong>
                    <span className="cat-tag">{sig.category}</span>
                  </td>
                  <td className="signal-trigger-cell">{sig.signalTrigger}</td>
                  <td className="rule-cell">
                    <span className="rule-pill">{sig.threeSecondRule}</span>
                  </td>
                  <td className="formula-cell">{sig.formula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 各句型深度解析與對比例句 */}
      <div className="signals-deep-list">
        {filteredSignals.map((sig: JapaneseGrammarSignal) => {
          const userAnswer = quizAnswers[sig.id]
          const isSubmitted = showSolutions[sig.id]
          const isCorrect = isSubmitted && userAnswer === sig.quiz.correctIndex

          return (
            <div key={sig.id} className="signal-item-card">
              <div className="item-header">
                <div className="pattern-badge">{sig.pattern}</div>
                <div className="meaning-tag">{sig.meaningZh}</div>
              </div>

              {/* 經典例句 */}
              <div className="contrast-box">
                <span className="box-title">經典對比例句：</span>
                <p className="ja-sent">{sig.contrastExample.ja}</p>
                <p className="kana-sent">{sig.contrastExample.kana}</p>
                <p className="zh-sent">{sig.contrastExample.zh}</p>
                <div className="note-pill">💡 {sig.contrastExample.note}</div>
              </div>

              {/* 避坑指南 */}
              <div className="pitfall-box">
                <span className="pitfall-alert">⚠ 避坑注意：</span>
                <p className="wrong-text">❌ {sig.pitfall.wrong}</p>
                <p className="reason-text">{sig.pitfall.reason}</p>
              </div>

              {/* 主動檢索測驗 (Active Recall Quiz) */}
              <div className="signal-quiz-box">
                <div className="quiz-q-title">
                  <span>換你判斷：</span>
                  <strong>{sig.quiz.promptZh}</strong>
                </div>

                <div className="quiz-options-grid">
                  {sig.quiz.options.map((opt, optIdx) => {
                    let btnClass = 'quiz-opt-btn'
                    if (isSubmitted) {
                      if (optIdx === sig.quiz.correctIndex) btnClass += ' correct'
                      else if (userAnswer === optIdx) btnClass += ' wrong'
                    }
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        className={btnClass}
                        onClick={() => handleSelectOption(sig.id, optIdx)}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </button>
                    )
                  })}
                </div>

                {isSubmitted && (
                  <div className={`quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
                    <p>
                      {isCorrect ? '🎉 答對了！精準命中動作訊號！' : '❌ 選錯囉！再看一次解析：'}
                    </p>
                    <p className="expl-text">{sig.quiz.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
