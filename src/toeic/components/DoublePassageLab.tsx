import React, { useState } from 'react'
import { DOUBLE_PASSAGE_SETS, type DoublePassageSet } from '../data/doublePassages'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export const DoublePassageLab: React.FC<Props> = ({ onEarnXp, instructionLang = 'zh' }) => {
  const isJa = instructionLang === 'ja'
  const [selectedSetId] = useState<string>(DOUBLE_PASSAGE_SETS[0].id)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  const activeSet: DoublePassageSet =
    DOUBLE_PASSAGE_SETS.find((s) => s.id === selectedSetId) ?? DOUBLE_PASSAGE_SETS[0]

  function handleSelectOption(qId: string, optIdx: number, correctIdx: number) {
    if (submitted[qId]) return
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }))
    setSubmitted((prev) => ({ ...prev, [qId]: true }))

    if (optIdx === correctIdx) {
      onEarnXp(15)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  return (
    <div className="math-lab double-passage-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📑</span> {isJa ? 'TOEIC Part 7 複数文書・クロス読解ラボ' : 'TOEIC Part 7 雙篇閱讀交叉推論實驗室'}
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {isJa
              ? '2つの文書（契約書＋メール等）の情報を照合して正解を導く多益最難関Part 7の速読＆同義語言い換えスキルをマスター！'
              : '訓練橫跨契約條款與往來電子郵件之交叉定位比對與同義替換 (Paraphrase) 破題技巧！'}
          </p>
        </div>
      </div>

      {/* 左右雙篇閱讀區 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
        {/* Passage 1 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
              Passage 1 · {activeSet.passage1.type}
            </span>
          </div>
          <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.88rem', color: '#38bdf8' }}>{activeSet.passage1.heading}</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--text)', whiteSpace: 'pre-line' }}>
            {activeSet.passage1.content}
          </p>
        </div>

        {/* Passage 2 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
              Passage 2 · {activeSet.passage2.type}
            </span>
          </div>
          <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.88rem', color: '#f59e0b' }}>{activeSet.passage2.heading}</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--text)', whiteSpace: 'pre-line' }}>
            {activeSet.passage2.content}
          </p>
        </div>
      </div>

      {/* 同義替換線索卡 */}
      <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '10px', padding: '0.65rem 0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>
          💡 {isJa ? '言い換え（Paraphrase）の発見：' : '高頻同義替換線索：'}
        </span>
        {activeSet.synonymMatches.map((syn, idx) => (
          <div key={idx} style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--text)' }}>{syn.wordInP1}</strong> ⟷ <strong style={{ color: 'var(--text)' }}>{syn.wordInP2}</strong> ({isJa ? syn.meaningJa : syn.meaningZh})
          </div>
        ))}
      </div>

      {/* 測驗題目 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {activeSet.questions.map((q, idx) => (
          <div
            key={q.id}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
                Question {idx + 1}
              </span>
              <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{isJa ? q.questionJa : q.question}</h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.35rem', marginTop: '0.6rem' }}>
              {q.options.map((opt, optIdx) => {
                const isPicked = selectedAnswers[q.id] === optIdx
                const isCorrect = optIdx === q.correctIndex
                const isDone = submitted[q.id]

                let border = 'var(--line)'
                let bg = 'var(--surface-soft)'
                if (isDone) {
                  if (isCorrect) {
                    border = '#10b981'
                    bg = 'rgba(16, 185, 129, 0.15)'
                  } else if (isPicked) {
                    border = '#ef4444'
                    bg = 'rgba(239, 68, 68, 0.15)'
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    className="practice-card"
                    style={{
                      padding: '0.55rem 0.8rem',
                      borderRadius: '8px',
                      border: `1px solid ${border}`,
                      background: bg,
                      textAlign: 'left',
                      cursor: isDone ? 'default' : 'pointer',
                    }}
                    onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                  >
                    <span style={{ fontSize: '0.82rem' }}>{opt}</span>
                  </button>
                )
              })}
            </div>

            {submitted[q.id] && (
              <div style={{ marginTop: '0.6rem', padding: '0.6rem', borderRadius: '8px', background: 'var(--surface-soft)', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '0.2rem' }}>
                  🔍 {isJa ? 'クロス参照の根拠：' : '交叉比對定位點：'} {q.clueLocation}
                </div>
                <div>{isJa ? q.explanationJa : q.explanationZh}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
