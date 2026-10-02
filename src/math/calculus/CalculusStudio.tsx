import { useCalculusCopy } from '../../i18n/calculusCopy'
import React, { useState, useMemo, useCallback } from 'react'
import { CalculusCanvas } from './components/CalculusCanvas/CalculusCanvas'
import { CalculusLabPanel } from './components/CalculusLab/CalculusLabPanel'
import { StepByStepSolver } from './components/CalculusSolver/StepByStepSolver'
import { CalculusAssessmentWidget } from './components/CalculusAssessment/CalculusAssessmentWidget'
import { generateDerivationSteps } from './engine'
import { useCalculusLearningCoordinator } from './hooks/useCalculusLearningCoordinator'
import { CalculusPrerequisiteGraph } from './components/CalculusPrerequisiteGraph'
import { GradientIntuitionCard } from './components/GradientIntuitionCard'
import type { CalculusLabMode, RiemannMethod, CalculusProblem } from './types'

export const CalculusStudio: React.FC = () => {
  const c = useCalculusCopy()
  const [activeTab, setActiveTab] = useState<'canvas_lab' | 'step_solver' | 'adaptive_practice'>('canvas_lab')
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
  const [newtonSteps, setNewtonSteps] = useState<number>(5)
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0)
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  // 認知學習調度與 IRT 狀態
  const {
    handleSolveProblem,
    clearBadgeNotification,
    currentTheta,
    newlyUnlockedBadges,
  } = useCalculusLearningCoordinator()

  // 原生 dialog 模態管理：常駐掛載，自動支援頂層焦點 trap、Escape 關閉、背景 inert 與關閉後焦點精確還原
  const handleCloseBadgeModal = useCallback(() => {
    const dialog = dialogRef.current
    if (dialog?.open) {
      dialog.close()
      // Answer buttons become disabled after submission, so native focus restoration
      // can land on body. Resume at the current problem's usable selector instead.
      if (document.activeElement === document.body || dialog.contains(document.activeElement)) {
        dialog.closest('.calculus-studio-container')
          ?.querySelector<HTMLButtonElement>('.btn-tier-pill.active')?.focus()
      }
    }
    clearBadgeNotification()
  }, [clearBadgeNotification])

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (newlyUnlockedBadges.length > 0 && !dialog.open) {
      dialog.showModal()
    }
  }, [newlyUnlockedBadges.length])

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
    if (p.defaultParams.newtonSteps !== undefined) setNewtonSteps(p.defaultParams.newtonSteps)
  }

  return (
    <div className="calculus-studio-container">
      {/* 專題頂部標題列與模式導覽 */}
      <header className="calculus-studio-header">
        <div className="title-group">
          <span className="studio-tag">{c("108 課綱數甲 · AP Calculus BC · 大一先修")}</span>
          <h2>{c("∫ 微積分互動專題 (Calculus Interactive Studio)")}</h2>
          <p className="subtitle">{c("以幾何動態為先、代數求解為本 · 雙向反應式即時推導工作台")}</p>
        </div>

        <div className="studio-tabs-row">
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === 'canvas_lab' ? 'active' : ''}`}
            onClick={() => setActiveTab('canvas_lab')}
          >
            {c("🎨 幾何動態實驗室 (Canvas Lab)")}</button>
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === 'step_solver' ? 'active' : ''}`}
            onClick={() => setActiveTab('step_solver')}
          >
            {c("📝 步驟式推導解題器 (Step Solver)")}</button>
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === 'adaptive_practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('adaptive_practice')}
          >
            {c("🎯 4 階認知能力挑戰 (IRT θ: ")}{currentTheta >= 0 ? `+${currentTheta.toFixed(2)}` : currentTheta.toFixed(2)})
          </button>
        </div>
      </header>

      <CalculusPrerequisiteGraph />
      <GradientIntuitionCard />

      {/* 主雙欄工作台 */}
      <main className="calculus-studio-workspace">
        {/* 左側互動操作區 */}
        <div className="studio-left-pane">
          {activeTab === 'canvas_lab' && (
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

          {activeTab === 'step_solver' && (
            <StepByStepSolver
              problemTitle={c(`求函數 f(x) = ${expression} 的符號導函數與臨界點`)}
              steps={dynamicSteps}
              currentStepIndex={currentStepIdx}
              onStepChange={setCurrentStepIdx}
            />
          )}

          {activeTab === 'adaptive_practice' && (
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
            newtonSteps={newtonSteps}
            onParamChange={(p) => {
              if (p.x0 !== undefined) setX0(p.x0)
              if (p.deltaX !== undefined) setDeltaX(p.deltaX)
              if (p.intA !== undefined) setIntA(p.intA)
              if (p.intB !== undefined) setIntB(p.intB)
              if (p.slicesN !== undefined) setSlicesN(p.slicesN)
            }}
          />
        </div>
      </main>

      {/* 微認證勳章解鎖彈窗 (常駐掛載以維持完整焦點還原生命週期) */}
      <dialog
        ref={dialogRef}
        className="calculus-badge-modal-dialog"
        aria-labelledby="badge-modal-title"
        onCancel={(e) => {
          e.preventDefault()
          handleCloseBadgeModal()
        }}
      >
        {newlyUnlockedBadges.length > 0 && (
          <div className="calculus-badge-modal-card">
            <div className="badge-unlock-animation">🏆</div>
            <h3 id="badge-modal-title">{c("恭喜解鎖微積分微認證！")}</h3>
            {newlyUnlockedBadges.map((badge) => (
              <div key={badge.id} className="unlocked-badge-detail">
                <span className="badge-icon-lg">{badge.icon}</span>
                <div>
                  <strong>{c(badge.title)}</strong>
                  <p>{c(badge.description)}</p>
                  <span className="reward-tag">+{badge.xpReward} XP</span>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn-close-modal"
              onClick={handleCloseBadgeModal}
              autoFocus
            >
              {c("太棒了，繼續挑戰！")}
            </button>
          </div>
        )}
      </dialog>
    </div>
  )
}
export default CalculusStudio
