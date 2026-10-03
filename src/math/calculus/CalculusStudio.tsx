import { useCalculusCopy } from '../../i18n/calculusCopy'
import React, { useState, useMemo } from 'react'
import { CalculusBadgeDialog } from './components/CalculusBadgeDialog'
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
            aria-pressed={activeTab === 'canvas_lab'}
            onClick={() => setActiveTab('canvas_lab')}
          >
            {c("🎨 幾何動態實驗室 (Canvas Lab)")}</button>
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === 'step_solver' ? 'active' : ''}`}
            aria-pressed={activeTab === 'step_solver'}
            onClick={() => setActiveTab('step_solver')}
          >
            {c("📝 步驟式推導解題器 (Step Solver)")}</button>
          <button
            type="button"
            className={`studio-tab-btn ${activeTab === 'adaptive_practice' ? 'active' : ''}`}
            aria-pressed={activeTab === 'adaptive_practice'}
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
            showFocusControl={activeTab !== 'canvas_lab'}
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

      <CalculusBadgeDialog badges={newlyUnlockedBadges} onDismiss={clearBadgeNotification} />

    </div>
  )
}
export default CalculusStudio
