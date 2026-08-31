import React, { useState } from 'react'
import { BalanceScaleSolver } from '../diagrams/BalanceScaleSolver'
import { BarModelSolver } from '../diagrams/BarModelSolver'
import { AlgebraTilesLab } from '../diagrams/AlgebraTilesLab'
import { MatrixTransformLab } from '../diagrams/MatrixTransformLab'
import { RiemannCalculusLab } from '../diagrams/RiemannCalculusLab'
import { GeometricProofsLab } from '../diagrams/GeometricProofsLab'

export type DiagramTabId = 'balance' | 'bar' | 'tiles' | 'matrix' | 'riemann' | 'proofs'

type Props = {
  initialTab?: DiagramTabId
  onBack: () => void
}

const TABS: Array<{ id: DiagramTabId; stage: string; icon: string; name: string; desc: string }> = [
  { id: 'balance', stage: '國小/國中', icon: '⚖️', name: '天平平衡模型', desc: '等量公理解一元一次方程式' },
  { id: 'bar', stage: '國小', icon: '📊', name: '長條模型 (Bar Model)', desc: '和差倍數應用題積木圖解' },
  { id: 'tiles', stage: '國中', icon: '🧩', name: '代數拼圖 (Algebra Tiles)', desc: '因式分解與二次多項式面積拼貼' },
  { id: 'matrix', stage: '高中', icon: '🌀', name: '矩陣線性變換', desc: '2D 空間網格扭曲與行列式面積比' },
  { id: 'riemann', stage: '高中', icon: '📈', name: '黎曼和切片微積分', desc: '定積分切片逼近與極限收斂' },
  { id: 'proofs', stage: '國中/高中', icon: '✨', name: '幾何無字證明', desc: '算幾不等式半圓垂線直觀證明' },
]

/**
 * 數學抽象圖示解題中心 (MathVisualHub)
 * 聚合 6 大幾何與代數視覺解題教具，告別死記硬背與純數字計算。
 */
export const MathVisualHub: React.FC<Props> = ({ initialTab = 'balance', onBack }) => {
  const [activeTab, setActiveTab] = useState<DiagramTabId>(initialTab)

  return (
    <div className="math-visual-hub">
      <div className="hub-top-bar">
        <button type="button" className="btn-back" onClick={onBack}>
          ← 返回今日學習
        </button>
        <span className="hub-tag">🎨 幾何直觀 · 抽象概念圖示解題</span>
      </div>

      {/* 6 大教具水平切換選單 */}
      <div className="visual-nav-grid">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              className={`visual-tab-card ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="tab-card-top">
                <span className="tab-icon">{tab.icon}</span>
                <span className="stage-pill">{tab.stage}</span>
              </div>
              <strong className="tab-name">{tab.name}</strong>
              <span className="tab-desc">{tab.desc}</span>
            </button>
          )
        })}
      </div>

      {/* 當前選中教具容器 */}
      <div className="active-visual-container">
        {activeTab === 'balance' && <BalanceScaleSolver />}
        {activeTab === 'bar' && <BarModelSolver />}
        {activeTab === 'tiles' && <AlgebraTilesLab />}
        {activeTab === 'matrix' && <MatrixTransformLab />}
        {activeTab === 'riemann' && <RiemannCalculusLab />}
        {activeTab === 'proofs' && <GeometricProofsLab />}
      </div>
    </div>
  )
}
