import React from 'react'
import type { CsProgress } from '../utils/csStorage'
import { CS_CURRICULUM } from '../data/curriculum'
import { computeCsRadar } from '../../engine/radar'
import type { CsNavSection } from './CsSidebar'

interface Props {
  progress: CsProgress
  onNavigate: (section: CsNavSection) => void
}

export const CsToday: React.FC<Props> = ({ progress, onNavigate }) => {
  const radar = computeCsRadar(
    progress.completedQuestions,
    progress.examScores,
    progress.labCompleted,
  )

  const totalQuestions = CS_CURRICULUM.reduce((sum, u) => sum + u.questions.length, 0)
  const completedCount = progress.completedQuestions.length
  const pct = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* 頂部歡迎 Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(16, 185, 129, 0.12))',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '1.2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.74rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.2)', color: '#2563eb', fontWeight: 700 }}>
            COMPUTER SCIENCE · VON NEUMANN TO AI
          </span>
          <h2 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.25rem' }}>
            計算機概論學習儀表板
          </h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)', maxWidth: '580px', lineHeight: 1.4 }}>
            貫通軟硬體本質、馮紐曼五大單元（CU, ALU, MU, IU, OU）、二補數、作業系統排程，延伸至現代 GPU 平行張量核心、TPU 脈動陣列與 Transformer 自注意力大模型架構！
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', background: 'var(--surface)', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block' }}>累積經驗值</span>
            <strong style={{ fontSize: '1.1rem', color: '#2563eb' }}>{progress.xp} XP</strong>
          </div>
          <div style={{ textAlign: 'center', background: 'var(--surface)', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block' }}>題庫完成率</span>
            <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>{pct}%</strong>
          </div>
        </div>
      </div>

      {/* 雙欄：左側五維雷達，右側快捷通道 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
        {/* 左側：能力雷達維度指標 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <strong style={{ fontSize: '0.88rem' }}>五大核心維度指標</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>平均分：{radar.averageScore} / 100</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {radar.dimensions.map((dim) => (
              <div key={dim.key} style={{ background: 'var(--surface-soft)', padding: '0.5rem 0.7rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{dim.label}</span>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: dim.score >= 70 ? '#10b981' : '#2563eb' }}>
                    {dim.score} 分
                  </span>
                </div>
                <div style={{ height: '6px', background: 'var(--line)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${dim.score}%`,
                      height: '100%',
                      background: dim.score >= 70 ? '#10b981' : 'linear-gradient(90deg, #2563eb, #3b82f6)',
                      borderRadius: '999px',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--muted)', display: 'block', marginTop: '0.2rem' }}>
                  {dim.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：學習快捷通道與跨領域推薦 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem' }}>
            <strong style={{ fontSize: '0.88rem', display: 'block', marginBottom: '0.6rem' }}>
              🚀 推薦學習單元與動態實驗室
            </strong>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                type="button"
                className="practice-card"
                style={{ padding: '0.6rem 0.8rem', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                onClick={() => onNavigate('von-neumann')}
              >
                <span style={{ fontSize: '1.3rem' }}>⚙️</span>
                <div>
                  <strong style={{ fontSize: '0.82rem', display: 'block' }}>馮紐曼五大單元動態資料流實驗室</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>觀察取指、解碼、執行與寫回機器週期資料流向 (+15 XP)</span>
                </div>
              </button>

              <button
                type="button"
                className="practice-card"
                style={{ padding: '0.6rem 0.8rem', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                onClick={() => onNavigate('ai-transformer')}
              >
                <span style={{ fontSize: '1.3rem' }}>🤖</span>
                <div>
                  <strong style={{ fontSize: '0.82rem', display: 'block' }}>現代 AI 矩陣平行加速與 Self-Attention 實驗室</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>體驗 GPU GEMM 矩陣相乘與 Transformer 注意力熱力圖 (+15 XP)</span>
                </div>
              </button>

              <button
                type="button"
                className="practice-card"
                style={{ padding: '0.6rem 0.8rem', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                onClick={() => onNavigate('signals')}
              >
                <span style={{ fontSize: '1.3rem' }}>⚡</span>
                <div>
                  <strong style={{ fontSize: '0.82rem', display: 'block' }}>3 秒秒殺訊號卡與翻轉快答特訓</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>15 組大考資工高頻破題口訣快問快答</span>
                </div>
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '12px', padding: '0.8rem 1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
              💡 跨領域知識協同 (Cross-Track Synergy)
            </span>
            <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--muted)', lineHeight: 1.45 }}>
              • <strong>微積分 ⟷ 計算機概論</strong>：梯度下降偏微分與神經網絡 Backpropagation 權重更新本質一致。<br />
              • <strong>物理 ⟷ 計算機概論</strong>：半導體 CMOS 能階、量子穿隧效應與邏輯閘電壓高低電平對應。<br />
              • <strong>現代 AI 資源調配</strong>：本地端 96GB RAM 與 RTX 5080 16GB 顯卡，結合 Ollama 與 INT4 量化達到極限推論效率。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
