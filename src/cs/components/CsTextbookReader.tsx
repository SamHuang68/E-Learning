import React, { useState } from 'react'
import { CS_TEXTBOOK_CHAPTERS, type TextbookChapter } from '../data/textbookData'
import { MathFormula } from '../../math/components/MathFormula'

interface Props {
  onSelectSection?: (section: string) => void
  onEarnXp?: (amount: number) => void
}

export const CsTextbookReader: React.FC<Props> = ({ onSelectSection, onEarnXp }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('cs-ch-1')
  const [activeTab, setActiveTab] = useState<'all' | 'history' | 'principles' | 'architecture' | 'philosophy'>('all')
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set(['cs-ch-1']))

  const currentChapter: TextbookChapter =
    CS_TEXTBOOK_CHAPTERS.find((c) => c.id === selectedChapterId) || CS_TEXTBOOK_CHAPTERS[0]

  const handleSelectChapter = (id: string) => {
    setSelectedChapterId(id)
    if (!readChapters.has(id)) {
      const updated = new Set(readChapters).add(id)
      setReadChapters(updated)
      if (onEarnXp) {
        onEarnXp(25) // 閱讀新章節獎勵 25 XP
      }
    }
  }

  return (
    <div
      className="cs-textbook-reader"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg, #0f172a)',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* 頂部章節選單橫條 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1rem',
          borderBottom: '1px solid var(--line, rgba(255,255,255,0.1))',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', marginRight: '0.25rem' }}>
          📖 教科書專題章節：
        </span>
        {CS_TEXTBOOK_CHAPTERS.map((ch) => {
          const isSelected = ch.id === selectedChapterId
          const isRead = readChapters.has(ch.id)
          return (
            <button
              key={ch.id}
              onClick={() => handleSelectChapter(ch.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.32rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 800 : 500,
                background: isSelected
                  ? 'rgba(56, 189, 248, 0.2)'
                  : isRead
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'transparent',
                color: isSelected ? '#38bdf8' : isRead ? '#94a3b8' : '#64748b',
                border: isSelected ? '1px solid #38bdf8' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{isRead ? '✅' : '📑'}</span>
              <span>
                第 {ch.chapterNumber} 章：{ch.title.split('與')[0]}
              </span>
            </button>
          )
        })}
      </div>

      {/* 核心內容區 (左右雙欄或主讀者視窗) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* 主研讀閱讀器 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem 2rem',
            maxWidth: '1100px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* 章節標題 Banner */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                }}
              >
                CHAPTER {currentChapter.chapterNumber}
              </span>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                {currentChapter.strand}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: 'auto' }}>
                ⏱️ 預估研讀時間：{currentChapter.readingTimeMinutes} 分鐘
              </span>
            </div>

            <h1 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc' }}>
              第 {currentChapter.chapterNumber} 章：{currentChapter.title}
            </h1>
            <div style={{ fontSize: '0.88rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '0.75rem' }}>
              {currentChapter.englishTitle}
            </div>

            {/* 先驗知識膠囊 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>前置先驗知識：</span>
              {currentChapter.prerequisites.map((p, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.72rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#e2e8f0',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* 模組內容標籤切換 */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '1px solid var(--line, rgba(255,255,255,0.1))',
              paddingBottom: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            {[
              { id: 'all', label: '📖 全文深度研讀' },
              { id: 'history', label: '🏛️ 歷史背景與動機' },
              { id: 'principles', label: '📐 第一性原理與數學推導' },
              { id: 'architecture', label: '⚙️ 微架構與工程剖析' },
              { id: 'philosophy', label: '🤔 深度思辨與批判' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: activeTab === tab.id ? '#38bdf8' : '#94a3b8',
                  border: activeTab === tab.id ? '1px solid #38bdf8' : '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 1. 歷史背景與科學思想動機 */}
          {(activeTab === 'all' || activeTab === 'history') && (
            <section style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                  一、歷史脈絡與科學思想動機
                </h2>
              </div>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--line, rgba(255,255,255,0.08))',
                  borderRadius: '8px',
                  padding: '1rem 1.25rem',
                  lineHeight: 1.7,
                  fontSize: '0.88rem',
                  color: '#cbd5e1',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>🕰️ 關鍵年代：</span>
                    <div style={{ fontWeight: 700, color: '#f8fafc', marginTop: '0.15rem' }}>{currentChapter.historicalContext.era}</div>
                  </div>
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>👥 代表先驅科學家：</span>
                    <div style={{ fontWeight: 700, color: '#f8fafc', marginTop: '0.15rem' }}>
                      {currentChapter.historicalContext.keyFigures.join('、')}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ color: '#f8fafc' }}>🎯 核心科學動機：</strong>
                  <p style={{ margin: '0.25rem 0', color: '#e2e8f0' }}>{currentChapter.historicalContext.coreMotivation}</p>
                </div>

                <div>
                  <strong style={{ color: '#f8fafc' }}>💡 突破創舉之由來：</strong>
                  <p style={{ margin: '0.25rem 0', color: '#e2e8f0' }}>{currentChapter.historicalContext.breakthroughStory}</p>
                </div>
              </div>
            </section>
          )}

          {/* 2. 第一性原理與核心定理推導 */}
          {(activeTab === 'all' || activeTab === 'principles') && (
            <section style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📐</span>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>
                  二、第一性原理與核心數學推導
                </h2>
              </div>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--line, rgba(255,255,255,0.08))',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  lineHeight: 1.7,
                }}
              >
                <p style={{ margin: '0 0 1rem', fontSize: '0.92rem', color: '#e2e8f0', fontWeight: 500 }}>
                  {currentChapter.firstPrinciples.summary}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {currentChapter.firstPrinciples.mathematicalDerivations.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        borderLeft: '4px solid #34d399',
                        padding: '0.9rem 1.1rem',
                        borderRadius: '0 8px 8px 0',
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#34d399', marginBottom: '0.4rem' }}>
                        定理 {idx + 1}：{item.topic}
                      </div>
                      <div
                        style={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '6px',
                          overflowX: 'auto',
                          marginBottom: '0.4rem',
                          textAlign: 'center',
                        }}
                      >
                        <MathFormula math={item.formula} block />
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{item.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 3. 微架構與工程剖析 */}
          {(activeTab === 'all' || activeTab === 'architecture') && (
            <section style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f43f5e' }}>
                  三、微架構與工程實現剖析
                </h2>
              </div>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--line, rgba(255,255,255,0.08))',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  lineHeight: 1.7,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc', marginBottom: '0.4rem' }}>
                  {currentChapter.architecturalDeepDive.sectionTitle}
                </div>
                <p style={{ margin: '0 0 1rem', fontSize: '0.86rem', color: '#cbd5e1' }}>
                  {currentChapter.architecturalDeepDive.content}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {currentChapter.architecturalDeepDive.keySubsystems.map((sub, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        padding: '0.85rem',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#f43f5e' }}>{sub.name}</span>
                        <span style={{ fontSize: '0.7rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          {sub.role}
                        </span>
                      </div>
                      <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                        {sub.technicalMechanism}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 直通關聯向量架構圖快速入口 */}
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.12)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <strong style={{ color: '#818cf8', fontSize: '0.85rem' }}>🏛️ 向量架構視覺化驗證：</strong>
                    <div style={{ color: '#cbd5e1', fontSize: '0.78rem' }}>
                      在 Archify 七度向量地圖中探索本章對應的硬體微架構、時序圖與記憶體流。
                    </div>
                  </div>
                  {onSelectSection && (
                    <button
                      onClick={() => onSelectSection('arch-map')}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        background: '#6366f1',
                        color: '#fff',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      前往 Archify 向量圖 ↗
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* 4. 工業界頂級實例 */}
          {activeTab === 'all' && (
            <section style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🏭</span>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24' }}>
                  四、工業界標竿工程實例
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem' }}>
                {currentChapter.industrialCaseStudies.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid var(--line, rgba(255,255,255,0.08))',
                      borderRadius: '8px',
                      padding: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                        {item.companyOrProject}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>{item.systemName}</strong>
                    </div>
                    <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6 }}>
                      {item.appliedSolution}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. 哲學思辨與深度批判思考 */}
          {(activeTab === 'all' || activeTab === 'philosophy') && (
            <section style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🤔</span>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#a855f7' }}>
                  五、批判性思維與第一性哲學思辨
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentChapter.deepThinkingQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      borderLeft: '4px solid #a855f7',
                      borderRadius: '0 8px 8px 0',
                      padding: '1rem 1.25rem',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#e9d5ff', marginBottom: '0.4rem' }}>
                      思辨題 {idx + 1}：{q.question}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.7 }}>
                      {q.philosophicalAnalysis}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. 經典著作與論文導讀 */}
          {activeTab === 'all' && (
            <section style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📚</span>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#94a3b8' }}>
                  六、經典必讀原著與論文典範
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentChapter.classicReferences.map((ref, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>{ref.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>作者：{ref.author}</div>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                      {ref.significance}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
