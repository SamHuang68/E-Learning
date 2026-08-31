import React from 'react'
import type { PhysicsGradeId, PhysicsStage } from '../data/curriculum'
import { getPhysicsGradeInfo } from '../data/curriculum'
import type { PhysicsProgressState } from '../utils/physicsStorage'

export type PhysicsNavId = 'today' | 'practice' | 'mock' | 'vault' | 'labs' | 'signals'

type Props = {
  activeNav: PhysicsNavId
  onNav: (nav: PhysicsNavId) => void
  currentGradeId: PhysicsGradeId
  onSelectGrade: (gradeId: PhysicsGradeId) => void
  progress: PhysicsProgressState
}

export const PhysicsSidebar: React.FC<Props> = ({
  activeNav,
  onNav,
  currentGradeId,
  onSelectGrade,
  progress,
}) => {
  const stages: Array<{ id: PhysicsStage; title: string; grades: PhysicsGradeId[] }> = [
    {
      id: 'junior',
      title: '國中自然物理 (G7 ~ G9)',
      grades: ['g7', 'g8', 'g9'],
    },
    {
      id: 'senior',
      title: '高中物理 (G10 ~ G12)',
      grades: ['g10', 'g11', 'g12'],
    },
  ]

  return (
    <aside className="sidebar math-sidebar physics-sidebar">
      {/* 品牌商標 */}
      <div className="brand" onClick={() => onNav('today')} role="button" tabIndex={0}>
        <div className="brand-mark math-mark" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>⚛️</div>
        <div>
          <strong>高中/國中物理 108課綱</strong>
          <span className="brand-sub">物理素養與探究實作</span>
        </div>
      </div>

      {/* 主功能導覽 */}
      <nav className="nav-group" aria-label="物理核心功能">
        <button
          type="button"
          className={activeNav === 'today' ? 'active' : ''}
          onClick={() => onNav('today')}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">今日學習 (首頁)</span>
        </button>
        <button
          type="button"
          className={activeNav === 'practice' ? 'active' : ''}
          onClick={() => onNav('practice')}
        >
          <span className="nav-icon">✏️</span>
          <span className="nav-label">單元題庫練習</span>
        </button>
        <button
          type="button"
          className={activeNav === 'mock' ? 'active' : ''}
          onClick={() => onNav('mock')}
        >
          <span className="nav-icon">🎯</span>
          <span className="nav-label">會考/學測/分科模考</span>
        </button>
        <button
          type="button"
          className={activeNav === 'vault' ? 'active' : ''}
          onClick={() => onNav('vault')}
        >
          <span className="nav-icon">📖</span>
          <span className="nav-label">錯題本 ({progress.errorQuestions.length})</span>
        </button>
        <button
          type="button"
          className={activeNav === 'signals' ? 'active' : ''}
          onClick={() => onNav('signals')}
        >
          <span className="nav-icon">⚡</span>
          <span className="nav-label">3秒破題訊號卡</span>
        </button>
        <button
          type="button"
          className={activeNav === 'labs' ? 'active' : ''}
          onClick={() => onNav('labs')}
        >
          <span className="nav-icon">🧪</span>
          <span className="nav-label">動態物理實驗室</span>
        </button>
      </nav>

      {/* 年級與學段快速切換 */}
      <div className="grades-nav-group">
        <span className="nav-heading">學段與年級切換</span>
        {stages.map((st) => (
          <div key={st.id} className="stage-block">
            <span className="stage-title">{st.title}</span>
            <div className="grades-pill-grid">
              {st.grades.map((gid) => {
                const info = getPhysicsGradeInfo(gid)
                const isSelected = gid === currentGradeId
                return (
                  <button
                    key={gid}
                    type="button"
                    className={`grade-pill-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectGrade(gid)}
                    title={info.name}
                  >
                    {gid.toUpperCase()}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
