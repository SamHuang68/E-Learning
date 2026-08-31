import React, { useState, useMemo } from 'react'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { CalculusSidebar, type CalculusNavId } from './components/CalculusSidebar'
import { CalculusCanvas } from '../math/calculus/components/CalculusCanvas/CalculusCanvas'
import { CalculusLabPanel } from '../math/calculus/components/CalculusLab/CalculusLabPanel'
import { StepByStepSolver } from '../math/calculus/components/CalculusSolver/StepByStepSolver'
import { CalculusAssessmentWidget } from '../math/calculus/components/CalculusAssessment/CalculusAssessmentWidget'
import { generateDerivationSteps } from '../math/calculus/engine'
import { useCalculusLearningCoordinator } from '../math/calculus/hooks/useCalculusLearningCoordinator'
import { CALCULUS_BADGES } from '../math/calculus/data/calculusBadges'
import type { CalculusLabMode, RiemannMethod, CalculusProblem } from '../math/calculus/types'
import type { LangId } from '../utils/storage'

type Props = {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

const PRESET_FORMULAS = [
  { label: '拋物線二次函數: f(x) = x^2 - 2x + 2', expr: 'x^2 - 2*x + 2', x0: 1.5, deltaX: 0.5 },
  { label: '三次多項式極值: f(x) = x^3 - 3x', expr: 'x^3 - 3*x', x0: 1.0, deltaX: 0.4 },
  { label: '正弦週期函數: f(x) = sin(x)', expr: 'sin(x)', x0: 1.57, deltaX: 0.3 },
  { label: '自然指數函數: f(x) = e^x', expr: 'e^x', x0: 1.0, deltaX: 0.2 },
  { label: '有理函數: f(x) = 1 / (1 + x^2)', expr: '1 / (1 + x^2)', x0: 0.5, deltaX: 0.3 },
  { label: '半拋物線定積分: f(x) = 4 - x^2', expr: '4 - x^2', x0: 1.0, deltaX: 0.5, intA: 0, intB: 2 },
  { label: '高次多項式: f(x) = x^4 - 4x^2', expr: 'x^4 - 4*x^2', x0: 1.414, deltaX: 0.3 },
]

/**
 * 獨立微積分學習軌道主應用程式 (CalculusApp)
 * 涵蓋 108 課綱數甲、AP Calculus BC 與大一微積分先修。
 * 提供 7 大幾何動態實驗室、符號推導解題器、4 階 IRT 自適應挑戰與微認證成就館。
 */
export const CalculusApp: React.FC<Props> = ({ onBackHub, onSwitchLang }) => {
  const [activeNav, setActiveNav] = useState<CalculusNavId>('canvas_lab')
  const [mode, setMode] = useState<CalculusLabMode>('tangent_secant')
  const [expression, setExpression] = useState<string>('x^2 - 2*x + 2')
  const [x0, setX0] = useState<number>(1.5)
  const [deltaX, setDeltaX] = useState<number>(0.5)
  const [intA, setIntA] = useState<number>(0)
  const [intB, setIntB] = useState<number>(3)
  const [slicesN, setSlicesN] = useState<number>(16)
  const [riemannMethod, setRiemannMethod] = useState<RiemannMethod>('midpoint')
  const [taylorOrder, setTaylorOrder] = useState<number>(3)
  const [epsilon, setEpsilon] = useState<number>(0.5)
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0)

  // 認知學習調度與 IRT 狀態
  const {
    handleSolveProblem,
    clearBadgeNotification,
    currentTheta,
    newlyUnlockedBadges,
  } = useCalculusLearningCoordinator()

  // 自動為當前表達式產生推導步驟
  const dynamicSteps = useMemo(() => generateDerivationSteps(expression), [expression])

  const handleSelectProblem = (p: CalculusProblem) => {
    setExpression(p.defaultExpr)
    setMode(p.targetMode)
    if (p.defaultParams.x0 !== undefined) setX0(p.defaultParams.x0)
    if (p.defaultParams.deltaX !== undefined) setDeltaX(p.defaultParams.deltaX)
    if (p.defaultParams.intA !== undefined) setIntA(p.defaultParams.intA)
    if (p.defaultParams.intB !== undefined) setIntB(p.defaultParams.intB)
    if (p.defaultParams.slicesN !== undefined) setSlicesN(p.defaultParams.slicesN)
    if (p.defaultParams.taylorOrder !== undefined) setTaylorOrder(p.defaultParams.taylorOrder)
    if (p.defaultParams.epsilon !== undefined) setEpsilon(p.defaultParams.epsilon)
  }

  function handleSelectPreset(expr: string) {
    const found = PRESET_FORMULAS.find((f) => f.expr === expr)
    setExpression(expr)
    if (found) {
      if (found.x0 !== undefined) setX0(found.x0)
      if (found.deltaX !== undefined) setDeltaX(found.deltaX)
      if (found.intA !== undefined) setIntA(found.intA)
      if (found.intB !== undefined) setIntB(found.intB)
    }
  }

  const navLabelMap: Record<CalculusNavId, string> = {
    canvas_lab: '幾何動態實驗室',
    step_solver: '步驟式推導解題器',
    adaptive_practice: '4 階能力挑戰 (IRT)',
    badges: '微認證成就館',
  }

  return (
    <main className="app-shell calculus-shell">
      {/* 獨立微積分側邊欄 */}
      <CalculusSidebar
        activeNav={activeNav}
        onNav={setActiveNav}
        currentMode={mode}
        onSelectMode={setMode}
        currentTheta={currentTheta}
        unlockedBadgeCount={newlyUnlockedBadges.length > 0 ? newlyUnlockedBadges.length : 2}
        totalBadgeCount={CALCULUS_BADGES.length}
        onBackHub={onBackHub}
        onSwitchLang={onSwitchLang}
      />

      <section className="content calculus-content">
        {/* 頂部導航軌跡麵包屑 */}
        <Breadcrumbs
          items={[
            { label: '學習總覽 (Hub)', onClick: onBackHub },
            { label: '∫ 微積分互動專題', onClick: () => setActiveNav('canvas_lab') },
            { label: navLabelMap[activeNav], active: true },
          ]}
        />

        {/* 專題頂部標題與快速函數選單 */}
        <header className="topbar calculus-topbar">
          <div>
            <p className="eyebrow">
              臺灣 108 課綱數甲 · AP Calculus BC · 大一微積分先修
            </p>
            <h1>∫ 微積分互動專題 (Calculus Studio)</h1>
          </div>

          <div className="header-actions">
            {/* 預設公式快速挑選 */}
            <label className="unit-select formula-select">
              <span>示範函數</span>
              <select
                value={expression}
                onChange={(e) => handleSelectPreset(e.target.value)}
              >
                {PRESET_FORMULAS.map((f) => (
                  <option key={f.expr} value={f.expr}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="theta-indicator">
              <small>能力值 (IRT θ)</small>
              <strong>{currentTheta >= 0 ? `+${currentTheta.toFixed(2)}` : currentTheta.toFixed(2)}</strong>
            </div>

            <div className="xp">
              <span>★</span>
              <strong>+150 XP</strong>
            </div>
          </div>
        </header>

        {/* 成就館獨立展示 */}
        {activeNav === 'badges' && (
          <div className="calculus-badges-gallery-view">
            <div className="section-header-row">
              <div>
                <h2>🏆 微積分認知微認證成就館</h2>
                <p className="section-subtext">完成 4 階能力挑戰與推導解題，解鎖對應領域微認證勳章</p>
              </div>
            </div>

            <div className="badges-grid-catalog">
              {CALCULUS_BADGES.map((b) => (
                <div key={b.id} className="badge-card-item">
                  <div className="badge-card-header">
                    <span className="badge-icon-display">{b.icon}</span>
                    <span className="badge-reward-pill">+{b.xpReward} XP</span>
                  </div>
                  <h3>{b.title}</h3>
                  <p className="badge-card-desc">{b.description}</p>
                  <div className="badge-criteria-box">
                    <small>解鎖條件：</small>
                    <span>{b.condition}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-badge-challenge"
                    onClick={() => setActiveNav('adaptive_practice')}
                  >
                    前往挑戰 →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 主雙欄工作台 (Canvas Lab / Step Solver / Adaptive Practice) */}
        {activeNav !== 'badges' && (
          <div className="calculus-studio-workspace">
            {/* 左側互動操作區 */}
            <div className="studio-left-pane">
              {activeNav === 'canvas_lab' && (
                <CalculusLabPanel
                  mode={mode}
                  expression={expression}
                  x0={x0}
                  deltaX={deltaX}
                  intA={intA}
                  intB={intB}
                  slicesN={slicesN}
                  riemannMethod={riemannMethod}
                  taylorOrder={taylorOrder}
                  epsilon={epsilon}
                  onModeSelect={setMode}
                  onExpressionChange={setExpression}
                  onParamChange={(p) => {
                    if (p.x0 !== undefined) setX0(p.x0)
                    if (p.deltaX !== undefined) setDeltaX(p.deltaX)
                    if (p.intA !== undefined) setIntA(p.intA)
                    if (p.intB !== undefined) setIntB(p.intB)
                    if (p.slicesN !== undefined) setSlicesN(p.slicesN)
                    if (p.riemannMethod !== undefined) setRiemannMethod(p.riemannMethod)
                    if (p.taylorOrder !== undefined) setTaylorOrder(p.taylorOrder)
                    if (p.epsilon !== undefined) setEpsilon(p.epsilon)
                  }}
                />
              )}

              {activeNav === 'step_solver' && (
                <StepByStepSolver
                  problemTitle={`求函數 f(x) = ${expression} 的符號導函數與臨界點`}
                  steps={dynamicSteps}
                  currentStepIndex={currentStepIdx}
                  onStepChange={setCurrentStepIdx}
                />
              )}

              {activeNav === 'adaptive_practice' && (
                <CalculusAssessmentWidget
                  currentTheta={currentTheta}
                  onSelectProblem={handleSelectProblem}
                  onSolveProblem={(problem, isCorrect) => handleSolveProblem(problem, isCorrect)}
                />
              )}
            </div>

            {/* 右側 60 FPS 幾何反應式畫布 */}
            <div className="studio-right-pane">
              <CalculusCanvas
                expression={expression}
                mode={mode}
                x0={x0}
                deltaX={deltaX}
                intA={intA}
                intB={intB}
                slicesN={slicesN}
                riemannMethod={riemannMethod}
                taylorOrder={taylorOrder}
                epsilon={epsilon}
                onParamChange={(p) => {
                  if (p.x0 !== undefined) setX0(p.x0)
                  if (p.deltaX !== undefined) setDeltaX(p.deltaX)
                  if (p.intA !== undefined) setIntA(p.intA)
                  if (p.intB !== undefined) setIntB(p.intB)
                  if (p.slicesN !== undefined) setSlicesN(p.slicesN)
                }}
              />
            </div>
          </div>
        )}

        {/* 底部頁腳 */}
        <footer className="math-footer calculus-footer">
          <span>∫ 微積分互動學習平台 · 幾何動態可視化、符號步驟推導與 2PL IRT 自適應評量</span>
          <span>進度儲存於本機 · 支援離線學習與 FSRS 間隔重複</span>
        </footer>
      </section>

      {/* 微認證勳章解鎖彈窗 */}
      {newlyUnlockedBadges.length > 0 && (
        <div className="calculus-badge-modal-overlay" onClick={clearBadgeNotification}>
          <div className="calculus-badge-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="badge-unlock-animation">🏆</div>
            <h3>恭喜解鎖微積分微認證！</h3>
            {newlyUnlockedBadges.map((badge) => (
              <div key={badge.id} className="unlocked-badge-detail">
                <span className="badge-icon-lg">{badge.icon}</span>
                <div>
                  <strong>{badge.title}</strong>
                  <p>{badge.description}</p>
                  <span className="reward-tag">+{badge.xpReward} XP</span>
                </div>
              </div>
            ))}
            <button type="button" className="btn-close-modal" onClick={clearBadgeNotification}>
              太棒了，繼續挑戰！
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
export default CalculusApp
