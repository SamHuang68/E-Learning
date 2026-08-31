import React, { useState } from 'react'
import { CHEMISTRY_SOLVING_SIGNALS, type ChemistrySolvingSignal } from '../data/solvingSignals'
import { MathFormula } from '../../math/components/MathFormula'

export const ChemistrySignalsView: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<'junior' | 'senior'>('senior')

  const signals = CHEMISTRY_SOLVING_SIGNALS.filter((s: ChemistrySolvingSignal) => s.stage === selectedStage)

  return (
    <div className="solving-signals-container">
      <div className="section-title-row" style={{ marginBottom: '0.45rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>⚡ 化學 3 秒破題訊號決策卡 (Chemistry Solving Signals)</h3>
          <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
            看見題目關鍵字 ➜ 0.5 秒反射核心公式、反應式與微觀模型！
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button
            type="button"
            className={`pill-btn ${selectedStage === 'junior' ? 'active' : ''}`}
            onClick={() => setSelectedStage('junior')}
          >
            國中化學 (G7~G9)
          </button>
          <button
            type="button"
            className={`pill-btn ${selectedStage === 'senior' ? 'active' : ''}`}
            onClick={() => setSelectedStage('senior')}
          >
            高中化學 (G10~G12)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.45rem' }}>
        {signals.map((sig: ChemistrySolvingSignal) => (
          <div key={sig.id} className="concept-item-card" style={{ borderLeftColor: '#059669', padding: '0.5rem 0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <span className="concept-idx" style={{ color: '#059669' }}>{sig.topic}</span>
              <span className="unit-strand" style={{ fontSize: '0.65rem' }}>{sig.gradeBand}</span>
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>
              🎯 關鍵訊號：{sig.problemSignal}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#065f46', background: '#ecfdf5', padding: '0.25rem 0.4rem', borderRadius: '4px', marginBottom: '0.25rem' }}>
              ⚡ 破題口訣：{sig.threeSecondRule}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink)' }}>
              <MathFormula math={sig.firstStepFormula} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
