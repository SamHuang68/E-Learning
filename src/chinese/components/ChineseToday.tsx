import React from 'react'
import type { ChineseNavSection } from './ChineseSidebar'

interface Props {
  xp: number
  onNavigate: (section: ChineseNavSection) => void
}

export const ChineseToday: React.FC<Props> = ({ xp, onNavigate }) => {
  return (
    <div className="chinese-today-view" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 歡迎 Hero 卡片 */}
      <div
        className="signal-hero-card"
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15))',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '14px',
          padding: '1.2rem 1.4rem',
          marginBottom: '1rem',
        }}
      >
        <span className="signal-badge" style={{ background: '#f59e0b', color: '#000', fontWeight: 800 }}>
          🌸 台湾華語・繁体字中国語スタジオ
        </span>
        <h2 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.4rem' }}>
          歡迎來到台湾華語學習空間！
        </h2>
        <p className="hero-desc" style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5 }}>
          日本語母語者の視点に立ち、四声の音高カーブ・日中漢字の落とし穴・3秒文法直感判断・リアル台湾会話を最短ルートで完全攻略。
        </p>
      </div>

      {/* 4 大核心模組快速直通卡 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
        <button
          type="button"
          className="practice-card"
          style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--line)' }}
          onClick={() => onNavigate('pinyin')}
        >
          <div style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>🗣️</div>
          <strong style={{ fontSize: '0.95rem', display: 'block' }}>拼音・注音與四聲聲調</strong>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.74rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            五度標記法による四声の高さの可視化と有気音・そり舌音のカタカナ発音ガイド。
          </p>
          <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, marginTop: '0.5rem', display: 'inline-block' }}>
            進入發音實驗室 →
          </span>
        </button>

        <button
          type="button"
          className="practice-card"
          style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--line)' }}
          onClick={() => onNavigate('false-friends')}
        >
          <div style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>⛩️</div>
          <strong style={{ fontSize: '0.95rem', display: 'block' }}>日中同形異義語 (偽友詞)</strong>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.74rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            「手紙＝トイレットペーパー」「汽車＝乗用車」など日本人が必ず陥る落とし穴を撃退。
          </p>
          <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, marginTop: '0.5rem', display: 'inline-block' }}>
            進入偽友詞庫 →
          </span>
        </button>

        <button
          type="button"
          className="practice-card"
          style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--line)' }}
          onClick={() => onNavigate('signals')}
        >
          <div style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>⚡</div>
          <strong style={{ fontSize: '0.95rem', display: 'block' }}>3秒文法動作決策樹</strong>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.74rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            把字句・被字句・了1/了2・是…的・過など、文法シグナルからの直感秒殺ルール。
          </p>
          <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, marginTop: '0.5rem', display: 'inline-block' }}>
            進入文法決策樹 →
          </span>
        </button>

        <button
          type="button"
          className="practice-card"
          style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--line)' }}
          onClick={() => onNavigate('conversations')}
        >
          <div style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>💬</div>
          <strong style={{ fontSize: '0.95rem', display: 'block' }}>實用情境會話</strong>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.74rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            ドリンクスタンドの甘さ・氷指定から夜市小吃、台北MRT乗車まで生きた台湾華語。
          </p>
          <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, marginTop: '0.5rem', display: 'inline-block' }}>
            進入情境會話 →
          </span>
        </button>
      </div>

      {/* 學習統計儀表 */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>今日成就達成</span>
          <strong style={{ fontSize: '1.2rem', color: '#f59e0b' }}>{xp} XP 累積</strong>
        </div>
        <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
          🎯 建議今日目標：完成 1 組聲調練習與 1 組偽友詞避坑！
        </div>
      </div>
    </div>
  )
}
