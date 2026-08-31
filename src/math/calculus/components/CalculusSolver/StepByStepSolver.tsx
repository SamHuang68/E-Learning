import React, { useState } from 'react'
import { FormulaStepCard } from './FormulaStepCard'
import type { DerivationStep } from '../../types'

interface Props {
  problemTitle: string
  steps: DerivationStep[]
  currentStepIndex: number
  onStepChange: (index: number) => void
  onCheckpointAnswer?: (isCorrect: boolean, stepNumber: number) => void
  onSyncCanvas?: (params: Record<string, unknown>) => void
}

export const StepByStepSolver: React.FC<Props> = ({
  problemTitle,
  steps,
  currentStepIndex,
  onStepChange,
  onCheckpointAnswer,
}) => {
  const [revealedCount, setRevealedCount] = useState<number>(1)

  const handleRevealNext = () => {
    if (revealedCount < steps.length) {
      setRevealedCount(revealedCount + 1)
      onStepChange(revealedCount)
    }
  }

  return (
    <div className="step-by-step-solver-panel">
      <div className="solver-header">
        <div>
          <h4>📝 步驟式代數推導與解題器</h4>
          <p className="problem-title-display">{problemTitle}</p>
        </div>
        <span className="step-progress-indicator">
          進度：{revealedCount} / {steps.length} 步驟
        </span>
      </div>

      <div className="steps-stream-list">
        {steps.slice(0, revealedCount).map((step, idx) => (
          <FormulaStepCard
            key={step.id}
            step={step}
            isActive={currentStepIndex === idx}
            isCompleted={idx < revealedCount - 1}
            onSelect={() => onStepChange(idx)}
            onCheckpointComplete={(isCorrect) => onCheckpointAnswer?.(isCorrect, step.stepNumber)}
          />
        ))}
      </div>

      {revealedCount < steps.length && (
        <div className="solver-actions-bar">
          <button type="button" className="btn-reveal-next-step" onClick={handleRevealNext}>
            展開下一步推導 (Step {revealedCount + 1}) →
          </button>
        </div>
      )}

      {revealedCount >= steps.length && steps.length > 0 && (
        <div className="derivation-complete-banner">
          <span>✨</span>
          <div>
            <strong>完整推導鏈已解鎖！</strong>
            <small>右側幾何畫布已同步更新對應的特徵切線與臨界點坐標。</small>
          </div>
        </div>
      )}
    </div>
  )
}
