import React, { useState } from 'react'
import { CS_CURRICULUM } from '../data/curriculum'
import type { CsNavSection } from './CsTopNav'

interface Props {
  completedQuestions: string[]
  onNavigate: (section: CsNavSection, unitId?: string) => void
}

export const CsHierarchyTree: React.FC<Props> = ({ completedQuestions, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'tree' | 'matrix'>('tree')
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(CS_CURRICULUM[0].id)

  const totalQuestions = CS_CURRICULUM.reduce((sum, u) => sum + u.questions.length, 0)
  const totalCompleted = completedQuestions.length
  const progressRatio = totalQuestions > 0 ? Math.round((totalCompleted / totalQuestions) * 100) : 0

  return (
    <div
      className="cs-hierarchy-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%',
      }}
    >
      {/* 頂部：一頁式知識概覽指標看板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🌳</span>
            <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.01em' }}>
              計算機概論知識體系階層樹 (Knowledge Hierarchy)
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.12rem 0.45rem',
                borderRadius: '4px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontWeight: 700,
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              7 大領域 · 105 道題庫
            </span>
          </div>
          <p style={{ margin: '0.2rem 0 0', color: '#94a3b8', fontSize: '0.78rem' }}>
            涵蓋從底層二進位數位邏輯、CPU微架構、作業系統、分散式網路，延伸至現代 AI 加速晶片與大模型前沿演算法的一頁全景圖。
          </p>
        </div>

        {/* 檢視模式切換與整體掌握進度條 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '130px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
              <span style={{ color: '#94a3b8' }}>全域通關率</span>
              <span style={{ fontWeight: 800, color: '#38bdf8' }}>{progressRatio}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${progressRatio}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #6366f1)', borderRadius: '999px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                borderRadius: '4px',
                border: 'none',
                background: viewMode === 'tree' ? 'rgba(99, 102, 241, 0.35)' : 'transparent',
                color: viewMode === 'tree' ? '#818cf8' : '#94a3b8',
                fontWeight: viewMode === 'tree' ? 800 : 500,
                cursor: 'pointer',
              }}
            >
              🌳 樹狀展開
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                borderRadius: '4px',
                border: 'none',
                background: viewMode === 'matrix' ? 'rgba(99, 102, 241, 0.35)' : 'transparent',
                color: viewMode === 'matrix' ? '#818cf8' : '#94a3b8',
                fontWeight: viewMode === 'matrix' ? 800 : 500,
                cursor: 'pointer',
              }}
            >
              🗂️ 矩陣卡片
            </button>
          </div>
        </div>
      </div>

      {/* 核心展示區：樹狀分支 vs 矩陣卡片 */}
      {viewMode === 'tree' ? (
        <div
          className="cs-tree-canvas"
          style={{
            flex: 1,
            minHeight: '480px',
            background: 'rgba(11, 15, 25, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {/* 樹根：Root Node */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
              }}
            >
              💻
            </div>
            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#f8fafc' }}>
                計算機科學核心大樹 (Computer Science Knowledge Root)
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                7 大分支主幹 · 點擊任一主幹展開核心概念葉節點 · 直達刷題與專案實驗室
              </div>
            </div>
          </div>

          {/* 7 大分支主幹 (Branch Rails) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '0.75rem' }}>
            {CS_CURRICULUM.map((unit, idx) => {
              const isExpanded = expandedUnitId === unit.id
              const completedInUnit = unit.questions.filter((q) => completedQuestions.includes(q.id)).length
              const unitRatio = Math.round((completedInUnit / unit.questions.length) * 100)

              return (
                <div
                  key={unit.id}
                  style={{
                    border: isExpanded ? '1px solid rgba(99, 102, 241, 0.45)' : '1px solid rgba(255, 255, 255, 0.06)',
                    background: isExpanded ? 'rgba(30, 41, 59, 0.65)' : 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* 分支 Header */}
                  <div
                    onClick={() => setExpandedUnitId(isExpanded ? null : unit.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.85rem', color: isExpanded ? '#38bdf8' : '#64748b' }}>
                        {isExpanded ? '▼' : '▶'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          background: 'rgba(99, 102, 241, 0.2)',
                          color: '#a5b4fc',
                          fontWeight: 700,
                        }}
                      >
                        Branch {idx + 1}
                      </span>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f1f5f9' }}>
                        {unit.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                        {completedInUnit}/{unit.questions.length} 題 ({unitRatio}%)
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onNavigate('practice', unit.id)
                        }}
                        style={{
                          padding: '0.25rem 0.65rem',
                          fontSize: '0.74rem',
                          borderRadius: '4px',
                          background: 'rgba(6, 182, 212, 0.2)',
                          color: '#38bdf8',
                          border: '1px solid rgba(6, 182, 212, 0.4)',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        🚀 進入刷題
                      </button>
                    </div>
                  </div>

                  {/* 展開之概念葉節點 (Leaves) 與快捷入口 */}
                  {isExpanded && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        paddingTop: '0.65rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                        <strong>單元副標：</strong> {unit.subtitle}
                      </div>

                      {/* 概念葉節點清單 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.2rem' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                          🌱 核心概念葉節點 (Leaf Concepts & Principles)：
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                          {unit.concepts.map((concept, cIdx) => (
                            <li key={cIdx} style={{ marginBottom: '0.25rem' }}>
                              {concept}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 關聯實作教具直通按鈕 */}
                      {unit.suggestedLab && (
                        <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 700 }}>
                            🔬 推薦探索教具：
                          </span>
                          <button
                            type="button"
                            onClick={() => onNavigate(unit.suggestedLab as CsNavSection)}
                            style={{
                              padding: '0.25rem 0.65rem',
                              fontSize: '0.72rem',
                              borderRadius: '4px',
                              background: 'rgba(168, 85, 247, 0.2)',
                              color: '#c084fc',
                              border: '1px solid rgba(168, 85, 247, 0.4)',
                              cursor: 'pointer',
                              fontWeight: 700,
                            }}
                          >
                            直通實驗室 ↗
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* 矩陣卡片模式 (Matrix View) */
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0.85rem',
          }}
        >
          {CS_CURRICULUM.map((unit, idx) => {
            const completedInUnit = unit.questions.filter((q) => completedQuestions.includes(q.id)).length
            const unitRatio = Math.round((completedInUnit / unit.questions.length) * 100)

            return (
              <div
                key={unit.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.65rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: '#818cf8',
                        fontWeight: 700,
                      }}
                    >
                      單元 {idx + 1} · {unit.band}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {completedInUnit}/{unit.questions.length} 題 ({unitRatio}%)
                    </span>
                  </div>

                  <h3 style={{ margin: '0.4rem 0 0.2rem', fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                    {unit.title}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    {unit.subtitle}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => onNavigate('practice', unit.id)}
                    style={{
                      flex: 1,
                      padding: '0.35rem 0',
                      fontSize: '0.74rem',
                      borderRadius: '5px',
                      background: 'rgba(6, 182, 212, 0.2)',
                      color: '#38bdf8',
                      border: '1px solid rgba(6, 182, 212, 0.35)',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    題庫練習
                  </button>
                  {unit.suggestedLab && (
                    <button
                      type="button"
                      onClick={() => onNavigate(unit.suggestedLab as CsNavSection)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.74rem',
                        borderRadius: '5px',
                        background: 'rgba(168, 85, 247, 0.2)',
                        color: '#c084fc',
                        border: '1px solid rgba(168, 85, 247, 0.35)',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      教具
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
