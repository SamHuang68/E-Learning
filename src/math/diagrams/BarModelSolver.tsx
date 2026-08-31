import React, { useState } from 'react'
import { BAR_MODEL_PRESETS } from '../data/diagramPresets'
import { MathFormula } from '../components/MathFormula'

/**
 * 新加坡長條模型應用題解題器 (BarModelSolver)
 * 將國小文字題（和差問題、倍數問題）轉換為視覺化長條積木，一眼看穿幾份與差額。
 */
export const BarModelSolver: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(BAR_MODEL_PRESETS[0].id)
  const [currentStep, setCurrentStep] = useState<number>(1)

  const preset = BAR_MODEL_PRESETS.find((p) => p.id === selectedPresetId) ?? BAR_MODEL_PRESETS[0]

  return (
    <div className="bar-model-card">
      <div className="solver-top-bar">
        <div className="solver-title-block">
          <h3>📊 新加坡長條模型圖解應用題 (Bar Model)</h3>
          <p>文字題不用瞎猜！畫出長條圖，對齊基準量，解法直接躍然紙上。</p>
        </div>

        <div className="preset-tabs">
          {BAR_MODEL_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pill-btn ${p.id === selectedPresetId ? 'active' : ''}`}
              onClick={() => {
                setSelectedPresetId(p.id)
                setCurrentStep(1)
              }}
            >
              {p.title.split('：')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="story-question-banner">
        <span className="story-badge">題目情境</span>
        <p className="story-text">{preset.story}</p>
      </div>

      <div className="bar-model-workspace-grid">
        {/* 長條視覺化區 */}
        <div className="bar-visual-container">
          <h4>長條積木對照圖 (Visual Bars)</h4>

          <div className="bars-stack">
            {/* 對象 A */}
            <div className="bar-row">
              <span className="person-label">{preset.personA.name}</span>
              <div className="bar-track">
                <div
                  className="bar-segment base"
                  style={{
                    flex: preset.personA.baseAmount,
                    background: preset.personA.color,
                  }}
                >
                  基準段
                </div>
                {preset.personA.extraAmount > 0 && (
                  <div
                    className="bar-segment extra"
                    style={{
                      flex: preset.personA.extraAmount,
                      background: '#f43f5e',
                    }}
                  >
                    多出 {preset.difference}
                  </div>
                )}
              </div>
            </div>

            {/* 對象 B */}
            <div className="bar-row">
              <span className="person-label">{preset.personB.name}</span>
              <div className="bar-track">
                <div
                  className="bar-segment base"
                  style={{
                    flex: preset.personB.baseAmount,
                    background: preset.personB.color,
                  }}
                >
                  基準段
                </div>
                {preset.personA.extraAmount > 0 && (
                  <div
                    className="bar-segment ghost"
                    style={{ flex: preset.personA.extraAmount }}
                  >
                    <span className="diff-marker">差額：{preset.difference}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="total-bracket-box">
            <span>兩者總合 = <strong>{preset.totalSum}</strong></span>
          </div>
        </div>

        {/* 逐步圖解思考引導 */}
        <div className="solution-steps-panel">
          <h4>💡 逐步拆解思維 (Step-by-Step Logic)</h4>

          <div className="steps-flow">
            {preset.solutionSteps.map((step) => {
              const isVisible = step.stepNumber <= currentStep
              return (
                <div
                  key={step.stepNumber}
                  className={`step-flow-item ${isVisible ? 'active' : 'locked'}`}
                >
                  <div className="step-header">
                    <span className="step-badge">第 {step.stepNumber} 步</span>
                    <p className="step-exp">{step.explanation}</p>
                  </div>
                  {isVisible ? (
                    <div className="step-formula">
                      <MathFormula math={`$$${step.formulaLatex}$$`} block={true} />
                    </div>
                  ) : (
                    <div className="step-locked-hint">（點擊下一步解鎖算式）</div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="step-actions-row">
            <button
              type="button"
              className="btn-next-step"
              onClick={() => setCurrentStep((s) => Math.min(preset.solutionSteps.length, s + 1))}
              disabled={currentStep >= preset.solutionSteps.length}
            >
              ▶ 看下一步推導
            </button>
            <button
              type="button"
              className="btn-reset"
              onClick={() => setCurrentStep(1)}
            >
              ↺ 從頭回放
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
