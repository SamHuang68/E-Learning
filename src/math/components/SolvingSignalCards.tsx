import React, { useState } from 'react'
import { MATH_SOLVING_SIGNALS, type MathSolvingSignal } from '../data/solvingSignals'
import { MathFormula } from './MathFormula'

type Props = {
  initialStage?: 'elementary' | 'junior' | 'senior'
}

/**
 * 數學條件對公式卡片 (SolvingSignalCards)
 * 借鏡 English Chunker「看到情境訊號 ➜ 3 秒直覺決策」理念：
 * 看到條件就先寫第一步。例題不是計時測驗。
 */
export const SolvingSignalCards: React.FC<Props> = ({ initialStage = 'junior' }) => {
  const [selectedStage, setSelectedStage] = useState<'elementary' | 'junior' | 'senior'>(initialStage)

  const filteredSignals = MATH_SOLVING_SIGNALS.filter((s) => s.stage === selectedStage)

  return (
    <div className="solving-signals-container">
      <div className="signals-header-row">
        <div>
          <h3>看到條件，先寫第一步</h3>
          <p className="signals-sub">
            這些卡片只把條件對上公式。看過不等於會算。
          </p>
        </div>

        <div className="stage-switch-pills">
          <button
            type="button"
            className={`pill-btn ${selectedStage === 'elementary' ? 'active' : ''}`}
            onClick={() => setSelectedStage('elementary')}
          >
            國小訊號 (G1~G6)
          </button>
          <button
            type="button"
            className={`pill-btn ${selectedStage === 'junior' ? 'active' : ''}`}
            onClick={() => setSelectedStage('junior')}
          >
            國中訊號 (G7~G9)
          </button>
          <button
            type="button"
            className={`pill-btn ${selectedStage === 'senior' ? 'active' : ''}`}
            onClick={() => setSelectedStage('senior')}
          >
            高中訊號 (G10~G12)
          </button>
        </div>
      </div>

      <div className="signals-cards-grid">
        {filteredSignals.map((item: MathSolvingSignal) => (
          <div key={item.id} className="signal-card-item">
            <div className="signal-card-top">
              <span className="signal-topic-badge">{item.topic}</span>
              <span className="signal-grade-tag">{item.gradeBand}</span>
            </div>

            {/* 題目特徵訊號 */}
            <div className="signal-trigger-box">
              <span className="trigger-icon">🔍 看到題目訊號：</span>
              <p className="trigger-text">{item.problemSignal}</p>
            </div>

            {/* 3 秒口訣 */}
            <div className="signal-rule-box">
              <span className="rule-icon">口訣：</span>
              <p className="rule-text">{item.threeSecondRule}</p>
            </div>

            {/* 破題第一步算式 */}
            <div className="signal-formula-box">
              <span className="formula-label">破題第一步算式：</span>
              <div className="formula-math">
                <MathFormula math={`$$${item.firstStepFormula}$$`} block={true} />
              </div>
            </div>

            {/* 快速示範 */}
            <details className="example-details">
              <summary className="example-summary">查看例題</summary>
              <div className="example-content">
                <p><strong>題目：</strong>{item.exampleProblem.question}</p>
                <p className="quick-solve"><strong>怎麼想：</strong>{item.exampleProblem.quickSolve}</p>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}
