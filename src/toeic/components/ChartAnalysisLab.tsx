import React, { useState } from 'react'
import { CHART_QUESTIONS, type ChartQuestionItem } from '../data/chartQuestions'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export const ChartAnalysisLab: React.FC<Props> = ({ onEarnXp, instructionLang = 'zh' }) => {
  const isJa = instructionLang === 'ja'
  const [selectedChartIdx, setSelectedChartIdx] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  const activeItem: ChartQuestionItem = CHART_QUESTIONS[selectedChartIdx % CHART_QUESTIONS.length]

  function handleSelectOption(qId: string, optIdx: number, correctIdx: number) {
    if (submitted[qId]) return
    setSelectedOptions((prev) => ({ ...prev, [qId]: optIdx }))
    setSubmitted((prev) => ({ ...prev, [qId]: true }))

    if (optIdx === correctIdx) {
      onEarnXp(15)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  return (
    <div className="math-lab chart-analysis-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📊</span> {isJa ? 'TOEIC 図表問題・ビジュアルデータ読解ラボ' : 'TOEIC 商務圖表題與視覺數據分析實驗室'}
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {isJa
              ? 'リスニングPart 3/4やリーディングPart 7に頻出する長条図・円グラフ・スケジュール表の高速照合スキルを特訓！'
              : '訓練 Part 3/4 聽力與 Part 7 閱讀高頻圖表題：長條圖、圓餅圖與排程表的關鍵數值秒殺定位！'}
          </p>
        </div>
      </div>

      {/* 題目切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem' }}>
        {CHART_QUESTIONS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`pill-btn ${selectedChartIdx === idx ? 'active' : ''}`}
            onClick={() => setSelectedChartIdx(idx)}
          >
            {isJa ? item.titleJa : item.title}
          </button>
        ))}
      </div>

      {/* 雙欄佈局：左圖表、右題目 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
        {/* 左側：SVG 圖表展示 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
              {activeItem.chartType}
            </span>
            <strong style={{ fontSize: '0.86rem', color: 'var(--text)' }}>{activeItem.chartTitle}</strong>
          </div>

          {/* 長條圖渲染 */}
          {activeItem.chartType === 'BarChart' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.6rem' }}>
              {activeItem.chartData.map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                    <span style={{ color: 'var(--muted)' }}>{d.label}</span>
                    <strong style={{ color: '#38bdf8' }}>{d.value} {d.unit}</strong>
                  </div>
                  <div style={{ width: '100%', height: '18px', background: 'var(--surface-soft)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, (d.value / 65) * 100)}%`,
                        height: '100%',
                        background: d.value > 50 ? 'linear-gradient(90deg, #38bdf8, #10b981)' : 'linear-gradient(90deg, #64748b, #38bdf8)',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 圓餅圖/比例條渲染 */}
          {activeItem.chartType === 'PieChart' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.6rem' }}>
              <div style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden', width: '100%' }}>
                <div style={{ width: '40%', background: '#38bdf8' }} title="Alpha Cloud 40%" />
                <div style={{ width: '25%', background: '#f59e0b' }} title="Beta Services 25%" />
                <div style={{ width: '20%', background: '#10b981' }} title="Gamma Platform 20%" />
                <div style={{ width: '15%', background: '#64748b' }} title="Others 15%" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.4rem' }}>
                {activeItem.chartData.map((d, i) => {
                  const colors = ['#38bdf8', '#f59e0b', '#10b981', '#64748b']
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: colors[i % colors.length] }} />
                      <span>{d.label}: <strong>{d.value}%</strong></span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, display: 'block' }}>
              📝 Context Passage (問題文・会話抜粋)：
            </span>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.45, color: 'var(--text)' }}>
              {activeItem.scenarioPassage}
            </p>
          </div>
        </div>

        {/* 右側：問題與選項 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {activeItem.questions.map((q, qIdx) => (
            <div key={q.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
                  Question {qIdx + 1}
                </span>
                <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{isJa ? q.questionJa : q.question}</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.35rem', marginTop: '0.6rem' }}>
                {q.options.map((opt, optIdx) => {
                  const isPicked = selectedOptions[q.id] === optIdx
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
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                    >
                      <span style={{ fontSize: '0.82rem' }}>{opt}</span>
                      {isDone && isCorrect && <span style={{ color: '#10b981', fontWeight: 700 }}>✓ 正解 (+15 XP)</span>}
                    </button>
                  )
                })}
              </div>

              {submitted[q.id] && (
                <div style={{ marginTop: '0.6rem', padding: '0.6rem', borderRadius: '8px', background: 'var(--surface-soft)', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                  💡 <strong>{isJa ? '正解の根拠：' : '破題解析：'}</strong> {isJa ? q.explanationJa : q.explanationZh}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
