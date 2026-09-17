import React from 'react'
import type { LangId } from '../../utils/storage'
import type { CalculusLabMode } from '../../math/calculus/types'
import { TrackSwitcher } from '../../components/TrackSwitcher'
import { useI18n } from '../../i18n/i18n'

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

/**
 * 微積分專屬左側導覽列 (CalculusSidebar)
 * 專注模式：僅包含微積分工作台功能與 7 大核心課題，無跳轉干擾。
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
  const { t } = useI18n()
  const CALCULUS_UNITS_I18N: Array<{
    id: CalculusLabMode
    unitNum: number
    title: string
    subtitle: string
    icon: string
  }> = [
    { id: 'limit_epsilon', unitNum: 1, title: t('calculus.u1.title'), subtitle: t('calculus.u1.sub'), icon: '🎯' },
    { id: 'tangent_secant', unitNum: 2, title: t('calculus.u2.title'), subtitle: t('calculus.u2.sub'), icon: '📈' },
    { id: 'optimization_mvt', unitNum: 3, title: t('calculus.u3.title'), subtitle: t('calculus.u3.sub'), icon: '⚖️' },
    { id: 'riemann_sum', unitNum: 4, title: t('calculus.u4.title'), subtitle: t('calculus.u4.sub'), icon: '📊' },
    { id: 'ftc_accumulation', unitNum: 5, title: t('calculus.u5.title'), subtitle: t('calculus.u5.sub'), icon: '🔄' },
    { id: 'solids_revolution', unitNum: 6, title: t('calculus.u6.title'), subtitle: t('calculus.u6.sub'), icon: '🍩' },
    { id: 'taylor_series', unitNum: 7, title: t('calculus.u7.title'), subtitle: t('calculus.u7.sub'), icon: '✨' },
  ]
  return (
    <aside className="sidebar calculus-sidebar">
      <TrackSwitcher current="calculus" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
      {/* 品牌標誌 */}
      <button type="button" className="brand brand-button" onClick={() => onNav('canvas_lab')} aria-label={t('calculus.backLab')}>
        <div className="brand-mark calculus-mark">∫</div>
        <div>
          <strong>{t('calculus.brand')}</strong>
          <span className="brand-sub">{t('calculus.brandSub')}</span>
        </div>
      </button>

      {/* 主功能導覽 */}
      <nav className="nav-group" aria-label={t('nav.calculusAria')}>
        <p className="nav-heading">{t('calculus.workbench')}</p>
        <button
          type="button"
          className={`nav-item ${activeNav === 'canvas_lab' ? 'active' : ''}`}
          onClick={() => onNav('canvas_lab')}
          aria-current={activeNav === 'canvas_lab' ? 'page' : undefined}
        >
          <span className="nav-icon">🎨</span>
          <span className="nav-label">{t('calculus.canvas')}</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'step_solver' ? 'active' : ''}`}
          onClick={() => onNav('step_solver')}
          aria-current={activeNav === 'step_solver' ? 'page' : undefined}
        >
          <span className="nav-icon">📝</span>
          <span className="nav-label">{t('calculus.solver')}</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'adaptive_practice' ? 'active' : ''}`}
          onClick={() => onNav('adaptive_practice')}
          aria-current={activeNav === 'adaptive_practice' ? 'page' : undefined}
        >
          <span className="nav-icon">🎯</span>
          <span className="nav-label">{t('calculus.practice', { theta: currentTheta >= 0 ? `+${currentTheta.toFixed(2)}` : currentTheta.toFixed(2) })}</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeNav === 'badges' ? 'active' : ''}`}
          onClick={() => onNav('badges')}
          aria-current={activeNav === 'badges' ? 'page' : undefined}
        >
          <span className="nav-icon">🏆</span>
          <span className="nav-label">{t('calculus.badges', { unlocked: unlockedBadgeCount, total: totalBadgeCount })}</span>
        </button>
      </nav>

      {/* 7 大課題快速導覽 */}
      <nav className="nav-group calculus-units-nav" aria-label={t('calculus.unitsAria')}>
        <p className="nav-heading">{t('calculus.units')}</p>
        {CALCULUS_UNITS_I18N.map((u) => {
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
              aria-current={isSelected ? 'page' : undefined}
            >
              <span className="nav-icon">{u.icon}</span>
              <div className="unit-nav-label">
                <strong>{t('calculus.unitLabel', { n: u.unitNum, title: u.title })}</strong>
                <small>{u.subtitle}</small>
              </div>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
export default CalculusSidebar

