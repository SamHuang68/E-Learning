import React, { useState } from 'react'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { MathFormula } from '../../math/components/MathFormula'

interface Props {
  onEarnXp: (amount: number) => void
}

const TOKENS = ['The', 'neural', 'network', 'learns', 'fast']

// 預設注意力權重分佈 (Softmax(Q * K^T / sqrt(d)))
const ATTENTION_MATRIX: number[][] = [
  [0.65, 0.12, 0.08, 0.10, 0.05],
  [0.05, 0.58, 0.25, 0.08, 0.04],
  [0.08, 0.32, 0.42, 0.14, 0.04],
  [0.04, 0.10, 0.22, 0.52, 0.12],
  [0.02, 0.05, 0.11, 0.38, 0.44],
]

export const AiMatrixTransformerLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(3) // 'learns'
  const [hardwareMode, setHardwareMode] = useState<'cpu' | 'gpu'>('gpu')
  const [kvCacheEnabled, setKvCacheEnabled] = useState<boolean>(true)
  const [claimedXp, setClaimedXp] = useState(false)

  function handleSelectToken(idx: number) {
    playCorrectSound()
    setSelectedTokenIdx(idx)
    if (!claimedXp) {
      setClaimedXp(true)
      onEarnXp(15)
    }
  }

  function handleToggleHardware() {
    playCorrectSound()
    setHardwareMode((prev) => (prev === 'cpu' ? 'gpu' : 'cpu'))
    if (!claimedXp) {
      setClaimedXp(true)
      onEarnXp(15)
    }
  }

  const currentToken = TOKENS[selectedTokenIdx]
  const currentWeights = ATTENTION_MATRIX[selectedTokenIdx]

  return (
    <div className="math-lab ai-transformer-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🤖</span> 現代 AI 矩陣平行加速與 Transformer Self-Attention 實驗室
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            即時體驗 GPU 平行張量運算 (GEMM)、縮放點積自注意力機制 Softmax(QKᵀ/√d)V 與大模型 KV Cache 空間換時間！
          </p>
        </div>
      </div>

      {/* 算力架構與硬體對比儀表板 */}
      <div
        style={{
          background: hardwareMode === 'gpu'
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.12))'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(217, 119, 6, 0.12))',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          marginBottom: '0.85rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.8rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '1.8rem' }}>{hardwareMode === 'gpu' ? '🚀 🎛️' : '🐢 🖥️'}</div>
          <div>
            <strong style={{ fontSize: '0.92rem', display: 'block', color: hardwareMode === 'gpu' ? '#10b981' : '#ef4444' }}>
              當前推論晶片模式：{hardwareMode === 'gpu' ? 'GPU / TPU 平行張量核心 (Tensor Core)' : '傳統 CPU 循序純量迴圈'}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--text)', display: 'block' }}>
              {hardwareMode === 'gpu'
                ? '數千平行核心同步執行 GEMM 矩陣相乘！HBM3 高頻寬記憶體傳輸，大模型每秒輸出 85+ tokens！'
                : 'CPU 依序執行雙重巢狀迴圈 O(N³)，記憶體頻寬受限於 DDR 匯流排，推論延遲大幅升高！'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#2563eb', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>
              ⚡ 推論最佳化狀態：{kvCacheEnabled ? '✓ 已啟用 KV Cache（已生成 Token 鍵值免重算，O(1)極速響應）' : '✗ 未啟用 KV Cache（每步重算全部歷史 Context，延遲劇增）'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.76rem',
              background: hardwareMode === 'gpu' ? '#10b981' : 'linear-gradient(135deg, #ef4444, #dc2626)',
            }}
            onClick={handleToggleHardware}
          >
            切換為 {hardwareMode === 'gpu' ? 'CPU 模式' : 'GPU 模式'}
          </button>
          <button
            type="button"
            className="pill-btn"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.74rem' }}
            onClick={() => {
              setKvCacheEnabled((prev) => !prev)
              playCorrectSound()
              if (!claimedXp) {
                setClaimedXp(true)
                onEarnXp(15)
              }
            }}
          >
            {kvCacheEnabled ? '⚡ KV Cache 已開' : '⚪ 開啟 KV Cache'}
          </button>
        </div>
      </div>

      {/* 雙欄：左側 Token 點選與熱力圖，右側公式與數值分佈 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem', marginBottom: '0.85rem' }}>
        {/* 左側：輸入序列與注意力分佈 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              🔍 點擊待查詢 Token (Query Vector $Q$)：
            </span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {TOKENS.map((token, idx) => (
                <button
                  key={token}
                  type="button"
                  className={`pill-btn ${selectedTokenIdx === idx ? 'active' : ''}`}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                  onClick={() => handleSelectToken(idx)}
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '10px', padding: '0.8rem' }}>
            <strong style={{ fontSize: '0.82rem', display: 'block', marginBottom: '0.5rem' }}>
              「{currentToken}」對上下文各詞彙的注意力權重 α_i = Softmax(Q · K_iᵀ / √d_k)：
            </strong>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {TOKENS.map((token, idx) => {
                const weight = currentWeights[idx]
                const pct = Math.round(weight * 100)
                return (
                  <div key={token} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '65px', fontSize: '0.78rem', fontWeight: 600 }}>{token}</span>
                    <div style={{ flex: 1, height: '14px', background: 'var(--line)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: idx === selectedTokenIdx ? '#2563eb' : weight > 0.3 ? '#10b981' : '#94a3b8',
                          borderRadius: '999px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                    <span style={{ width: '45px', fontSize: '0.74rem', textAlign: 'right', fontWeight: 700, color: 'var(--muted)' }}>
                      {pct}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 右側：數學原理與架構重點 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            📐 Transformer 注意力數學本質
          </span>

          <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.82rem', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '0.4rem', overflowX: 'auto' }}>
              <MathFormula math="\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V" block />
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.74rem', color: 'var(--text)' }}>
              <li><strong>Q (Query)</strong>：當前詞彙想要尋找的關聯目標。</li>
              <li><strong>K (Key)</strong>：上下文中各詞彙暴露的特徵標籤。</li>
              <li><strong>縮放因子 √d_k</strong>：避免高維向量點積數值過大引發 Softmax 梯度消失。</li>
              <li><strong>V (Value)</strong>：加權融合提取出的上下文語意特徵向量。</li>
            </ul>
          </div>

          <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.65rem 0.75rem', fontSize: '0.74rem', color: 'var(--muted)', lineHeight: 1.45 }}>
            💡 <strong>工程實務：</strong>在本地端推論（如配備 96GB RAM 與 RTX 5080 16GB 顯卡執行 Ollama / Llama 3.3）時，啟用 <strong>FlashAttention-2</strong> 與 <strong>KV Cache</strong> 可大幅降低顯存讀寫次數，使大模型達到每秒近百字的流暢生成！
          </div>
        </div>
      </div>
    </div>
  )
}
