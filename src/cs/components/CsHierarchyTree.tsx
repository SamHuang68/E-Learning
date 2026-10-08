import React, { useId, useState } from 'react'
import { CS_CURRICULUM, isCsAdvancedUnit } from '../data/curriculum'
import type { CsNavSection } from './CsTopNav'
import { useI18n } from '../../i18n/i18n'
import { localizeCsUnit } from '../../i18n/csTeachingCopy'

interface Props {
  completedQuestions: string[]
  onNavigate: (section: CsNavSection, unitId?: string) => void
}

export const CsHierarchyTree: React.FC<Props> = ({ completedQuestions, onNavigate }) => {
  const treeId = useId()
  const { locale } = useI18n()
  const ui = locale === 'en'
    ? {
        syllabus: 'Curriculum',
        bands: 'Units 1–5: Foundations · Units 6–7: Advanced',
        guidance: 'Units 1–5 form the foundation path. Complete them before the advanced material in Units 6–7.',
        completionRate: 'Completion',
        tree: 'Tree',
        cards: 'Cards',
        overview: 'Introduction to Computer Science',
        overviewHint: 'Expand a unit to see its concepts, then open the textbook or practice set.',
        unit: 'Unit',
        advanced: 'Advanced',
        questions: 'questions',
        textbook: 'Textbook',
        practice: 'Practice',
        subtitle: 'Unit focus:',
        coreConcepts: 'Core concepts',
        lab: 'Lab',
        openLab: 'Open lab',
      }
    : {
        syllabus: '課綱',
        bands: '單元 1–5 概論 · 6–7 進階',
        guidance: '單元 1–5 為概論路徑；單元 6–7 標為進階，完成前面單元再讀。',
        completionRate: '完成率',
        tree: '樹狀',
        cards: '卡片',
        overview: '計算機概論',
        overviewHint: '點單元展開概念，再進讀本或練習。',
        unit: '單元',
        advanced: '進階',
        questions: '題',
        textbook: '讀本',
        practice: '練習',
        subtitle: '單元副標：',
        coreConcepts: '核心概念',
        lab: '實驗室',
        openLab: '開啟實驗室',
      }
  const curriculum = CS_CURRICULUM.map((unit) => localizeCsUnit(locale, unit))
  const [viewMode, setViewMode] = useState<'tree' | 'matrix'>('tree')
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(CS_CURRICULUM[0].id)

  const totalQuestions = curriculum.reduce((sum, u) => sum + u.questions.length, 0)
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
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              {ui.syllabus}
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.12rem 0.45rem',
                borderRadius: '4px',
                background: 'var(--surface-soft)',
                color: 'var(--muted)',
                fontWeight: 700,
                border: '1px solid var(--line)',
              }}
            >
              {ui.bands}
            </span>
          </div>
          <p style={{ margin: '0.2rem 0 0', color: 'var(--muted)', fontSize: '0.78rem' }}>
            {ui.guidance}
          </p>
        </div>

        {/* 檢視模式切換與整體掌握進度條 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '130px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
              <span style={{ color: 'var(--muted)' }}>{ui.completionRate}</span>
              <span style={{ fontWeight: 800, color: 'var(--navy)' }}>{progressRatio}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'var(--line)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${progressRatio}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #6366f1)', borderRadius: '999px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', background: 'var(--surface-soft)', padding: '2px', borderRadius: '6px', border: '1px solid var(--line)' }}>
            <button aria-pressed={viewMode === 'tree'}
              type="button"
              onClick={() => setViewMode('tree')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                borderRadius: '4px',
                border: 'none',
                background: viewMode === 'tree' ? 'var(--surface)' : 'transparent',
                color: viewMode === 'tree' ? 'var(--navy)' : 'var(--muted)',
                fontWeight: viewMode === 'tree' ? 800 : 500,
                cursor: 'pointer',
              }}
            >
              {ui.tree}
            </button>
            <button aria-pressed={viewMode === 'matrix'}
              type="button"
              onClick={() => setViewMode('matrix')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                borderRadius: '4px',
                border: 'none',
                background: viewMode === 'matrix' ? 'var(--surface)' : 'transparent',
                color: viewMode === 'matrix' ? 'var(--navy)' : 'var(--muted)',
                fontWeight: viewMode === 'matrix' ? 800 : 500,
                cursor: 'pointer',
              }}
            >
              {ui.cards}
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
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '10px',
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {/* 樹根：Root Node */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--line)' }}>
            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 900, color: 'var(--ink)' }}>
                {ui.overview}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
                {ui.overviewHint}
              </div>
            </div>
          </div>

          {/* 7 大分支主幹 (Branch Rails) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '0.75rem' }}>
            {curriculum.map((unit, idx) => {
              const isExpanded = expandedUnitId === unit.id
              const completedInUnit = unit.questions.filter((q) => completedQuestions.includes(q.id)).length
              const unitRatio = Math.round((completedInUnit / unit.questions.length) * 100)

              return (
                <div
                  key={unit.id}
                  style={{
                    border: isExpanded ? '1px solid var(--navy)' : '1px solid var(--line)',
                    background: isExpanded ? 'var(--surface-soft)' : 'var(--surface)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* 分支 Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      userSelect: 'none',
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`${treeId}-${unit.id}`}
                      onClick={() => setExpandedUnitId(isExpanded ? null : unit.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0, textAlign: 'left', background: 'transparent', border: 0, padding: '0.25rem 0', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.15s ease',
                          fontSize: '0.82rem',
                          color: 'var(--navy)',
                        }}
                      >
                        ▶
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '4px',
                          background: 'var(--surface-soft)',
                          color: 'var(--muted)',
                          fontWeight: 700,
                          border: '1px solid var(--line)',
                        }}
                      >
                        {ui.unit} {idx + 1}
                      </span>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--ink)' }}>
                        {unit.title}
                      </span>
                      {isCsAdvancedUnit(unit) ? <span className="cs-advanced-tag">{ui.advanced}</span> : null}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
                        {completedInUnit}/{unit.questions.length} {ui.questions} ({unitRatio}%)
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onNavigate('textbook')
                        }}
                        style={{
                          padding: '0.25rem 0.6rem',
                          fontSize: '0.74rem',
                          borderRadius: '4px',
                          background: 'var(--surface)',
                          color: 'var(--navy)',
                          border: '1px solid var(--line)',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        {ui.textbook}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onNavigate('practice', unit.id)
                        }}
                        style={{
                          padding: '0.25rem 0.6rem',
                          fontSize: '0.74rem',
                          borderRadius: '4px',
                          background: 'var(--navy)',
                          color: '#fff',
                          border: '1px solid var(--navy)',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        {ui.practice}
                      </button>
                    </div>
                  </div>

                  {/* 展開之概念葉節點 (Leaves) 與快捷入口 */}
                  {isExpanded && (
                    <div
                      id={`${treeId}-${unit.id}`}
                      style={{
                        marginTop: '0.75rem',
                        paddingTop: '0.65rem',
                        borderTop: '1px solid var(--line)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ fontSize: '0.76rem', color: 'var(--ink)', lineHeight: 1.5 }}>
                        <strong>{ui.subtitle}</strong> {unit.subtitle}
                      </div>

                      {/* 概念葉節點清單 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.2rem' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700 }}>
                          {ui.coreConcepts}
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.74rem', color: 'var(--ink)', lineHeight: 1.5 }}>
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
                          <span style={{ fontSize: '0.72rem', color: 'var(--navy)', fontWeight: 700 }}>
                            {ui.lab}
                          </span>
                          <button
                            type="button"
                            onClick={() => onNavigate(unit.suggestedLab as CsNavSection)}
                            style={{
                              padding: '0.25rem 0.65rem',
                              fontSize: '0.72rem',
                              borderRadius: '4px',
                              background: 'var(--surface)',
                              color: 'var(--navy)',
                              border: '1px solid var(--line)',
                              cursor: 'pointer',
                              fontWeight: 700,
                            }}
                          >
                            {ui.openLab}
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
          {curriculum.map((unit, idx) => {
            const completedInUnit = unit.questions.filter((q) => completedQuestions.includes(q.id)).length
            const unitRatio = Math.round((completedInUnit / unit.questions.length) * 100)

            return (
              <div
                key={unit.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.65rem',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        background: 'var(--surface-soft)',
                        color: 'var(--muted)',
                        fontWeight: 700,
                        border: '1px solid var(--line)',
                      }}
                    >
                      {ui.unit} {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                      {completedInUnit}/{unit.questions.length} {ui.questions} ({unitRatio}%)
                    </span>
                  </div>

                  <h3 style={{ margin: '0.4rem 0 0.2rem', fontSize: '0.92rem', fontWeight: 800, color: 'var(--ink)' }}>
                    {unit.title}
                    {isCsAdvancedUnit(unit) ? <span className="cs-advanced-tag">{ui.advanced}</span> : null}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                    {unit.subtitle}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => onNavigate('textbook')}
                    style={{
                      flex: 1,
                      padding: '0.35rem 0',
                      fontSize: '0.74rem',
                      borderRadius: '5px',
                      background: 'var(--surface)',
                      color: 'var(--navy)',
                      border: '1px solid var(--line)',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    {ui.textbook}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('practice', unit.id)}
                    style={{
                      flex: 1,
                      padding: '0.35rem 0',
                      fontSize: '0.74rem',
                      borderRadius: '5px',
                      background: 'var(--navy)',
                      color: '#fff',
                      border: '1px solid var(--navy)',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    {ui.practice}
                  </button>
                  {unit.suggestedLab && (
                    <button
                      type="button"
                      onClick={() => onNavigate(unit.suggestedLab as CsNavSection)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.74rem',
                        borderRadius: '5px',
                        background: 'var(--surface)',
                        color: 'var(--navy)',
                        border: '1px solid var(--line)',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      {ui.lab}
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
