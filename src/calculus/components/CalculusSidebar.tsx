import React from 'react'
import type { LangId } from '../../utils/storage'
import type { CalculusLabMode } from '../../math/calculus/types'

export type CalculusNavId = 'canvas_lab' | 'step_solver' | 'adaptive_practice' | 'badges'

type Props = {
  activeNav: CalculusNavId
  onNav: (nav: CalculusNavId) => void
  currentMode: CalculusLabMode
  onSelectMode: (mode: CalculusLabMode) => void
  currentTheta: number
  unlockedBadgeCount: number
  totalBadgeCount: number
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

const CALCULUS_UNITS: Array<{
  id: CalculusLabMode
  unitNum: number
  title: string
  subtitle: string
  icon: string
}> = [
  {
    id: 'limit_epsilon',
    unitNum: 1,
    title: '極限與連續性逼近',
    subtitle: 'ε-δ 動態定義與夾擠',
    icon: '🎯',
  },
  {
    id: 'tangent_secant',
    unitNum: 2,
    title: '導數與割線切線逼近',
    subtitle: '割線斜率趨近瞬時變化率',
    icon: '📈',
  },
  {
    id: 'optimization_mvt',
    unitNum: 3,
    title: '均值定理與極值最佳化',
    subtitle: 'Rolle 定理與臨界點切線',
    icon: '⚖️',
  },
  {
    id: 'riemann_sum',
    unitNum: 4,
    title: '黎曼和與定積分面積',
    subtitle: '矩形分割、梯形法與誤差',
    icon: '📊',
  },
  {
    id: 'ftc_accumulation',
    unitNum: 5,
    title: '微積分基本定理 (FTC)',
    subtitle: '累積面積變化率與原函數',
    icon: '🔄',
  },
  {
    id: 'solids_revolution',
    unitNum: 6,
    title: '旋轉體體積切片',
    subtitle: '圓盤法與薄殼法 3D 展開',
    icon: '🍩',
  },
  {
    id: 'taylor_series',
    unitNum: 7,
    title: '泰勒級數多項式逼近',
    subtitle: '高階導數與局部多項式擬合',
    icon: '✨',
  },
]

/**
 * 微積分專屬左側導覽列 (CalculusSidebar)
 * 提供四軌快速切換、功能導航與 7 大微積分核心課題跳轉。
 */
export const CalculusSidebar: React.FC<Props> = ({
  activeNav,
  onNav,
  currentMode,
  onSelectMode,
  currentTheta,
  unlockedBadgeCount,
  totalBadgeCount,
  onBackHub,
  onSwitchLang,
}) => {
  return (
    <aside className="sidebar calculus-sidebar">
      {/* 品牌標誌 */}
      <div className="brand" onClick={() => onNav('canvas_lab')} role="button" tabIndex={0}>
        <div className="brand-mark calculus-mark">∫</div>
        <div>
          <strong>微積分互動專題</strong>
          <span className="brand-sub">Calculus Studio</span>
        </div>
      </div>

      {/* 四軌切換膠囊 */}
      <div className="lang-switch four-ways" role="group" aria-label="四大學習軌道切換">
        <button type="button" onClick={() => onSwitchLang('ja')}>
          あ 日本語
        </button>
        <button type="button" onClick={() => onSwitchLang('en')}>
          T 多益
        </button>
        <button type="button" onClick={() => onSwitchLang('math')}>
          ∑ 數學
        </button>
        <button type="button" className="active" aria-current="true" disabled>
          ∫ 微積分
        </button>
      </div>

      {/* 返回學習總覽 */}
      <div className="sidebar-top-actions">
        <button type="button" className="hub-back" onClick={onBackHub}>
          ← 回學習總覽 (Hub)
        </button>
      </div>

      {/* 核心工作台功能 */}
      <nav className="nav-group" aria-label="微積分工作台選單">
        <p className="nav-heading">工作台功能</p>
        <button
          type="button"
          className={`nav-item ${activeNav === 'canvas_lab' ? 'active' : ''}`}
          onClick={() => onNav('canvas_lab')}
        >
          <span className="nav-icon">🎨</span>
          <span>幾何動態實驗室 (Canvas)</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'step_solver' ? 'active' : ''}`}
          onClick={() => onNav('step_solver')}
        >
          <span className="nav-icon">📝</span>
          <span>步驟式推導解題器</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'adaptive_practice' ? 'active' : ''}`}
          onClick={() => onNav('adaptive_practice')}
        >
          <span className="nav-icon">🎯</span>
          <span>4 階能力挑戰 (θ: {currentTheta >= 0 ? `+${currentTheta.toFixed(2)}` : currentTheta.toFixed(2)})</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'badges' ? 'active' : ''}`}
          onClick={() => onNav('badges')}
        >
          <span className="nav-icon">🏆</span>
          <span>微認證成就館 ({unlockedBadgeCount}/{totalBadgeCount})</span>
        </button>
      </nav>

      {/* 7 大課題快速導覽 */}
      <nav className="nav-group calculus-units-nav" aria-label="微積分核心課題">
        <p className="nav-heading">7 大核心課題教具</p>
        {CALCULUS_UNITS.map((u) => {
          const isSelected = activeNav === 'canvas_lab' && currentMode === u.id
          return (
            <button
              key={u.id}
              type="button"
              className={`nav-item unit-item ${isSelected ? 'active' : ''}`}
              onClick={() => {
                onSelectMode(u.id)
                onNav('canvas_lab')
              }}
            >
              <span className="nav-icon">{u.icon}</span>
              <div className="unit-nav-label">
                <strong>單元 {u.unitNum} · {u.title}</strong>
                <small>{u.subtitle}</small>
              </div>
            </button>
          )
        })}
      </nav>

      {/* 底部導覽 */}
      <div className="sidebar-footer">
        <button type="button" className="btn-sidebar-link" onClick={onBackHub}>
          ← 返回學習中心 (Hub)
        </button>
        <div className="track-switchers">
          <span>切換其他軌道：</span>
          <button type="button" onClick={() => onSwitchLang('math')}>臺灣數學</button>
          <button type="button" onClick={() => onSwitchLang('ja')}>日語</button>
          <button type="button" onClick={() => onSwitchLang('en')}>多益</button>
        </div>
      </div>
    </aside>
  )
}
export default CalculusSidebar
