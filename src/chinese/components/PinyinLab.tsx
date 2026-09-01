import React, { useState } from 'react'
import {
  CHINESE_TONES,
  INITIALS_DATA,
  FINALS_DATA,
  PINYIN_DRILL_WORDS,
  type ToneData,
  type PhonemeData,
} from '../data/pinyinBopomofo'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const PinyinLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedTone, setSelectedTone] = useState<ToneData>(CHINESE_TONES[0])
  const [selectedInitial, setSelectedInitial] = useState<PhonemeData>(INITIALS_DATA[0])
  const [selectedFinal, setSelectedFinal] = useState<PhonemeData>(FINALS_DATA[0])
  const [activeTab, setActiveTab] = useState<'tones' | 'initials' | 'finals' | 'drills'>('tones')

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="math-lab pinyin-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標題 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🗣️</span> 拼音・注音與四聲聲調實驗室 (Pinyin, Bopomofo & Tones)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            日本語にはない「四声の高さのカーブ」と「有気音・そり舌音・鼻母音」を完全可視化。カタカナの目安と発音ポイントで攻略！
          </p>
        </div>
      </div>

      {/* 模式分頁 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`pill-btn ${activeTab === 'tones' ? 'active' : ''}`}
          onClick={() => setActiveTab('tones')}
        >
          🎵 四聲聲調曲線 (Tones)
        </button>
        <button
          type="button"
          className={`pill-btn ${activeTab === 'initials' ? 'active' : ''}`}
          onClick={() => setActiveTab('initials')}
        >
          🔤 聲母 21 音 (Initials)
        </button>
        <button
          type="button"
          className={`pill-btn ${activeTab === 'finals' ? 'active' : ''}`}
          onClick={() => setActiveTab('finals')}
        >
          🌊 韻母 16 音 (Finals)
        </button>
        <button
          type="button"
          className={`pill-btn ${activeTab === 'drills' ? 'active' : ''}`}
          onClick={() => setActiveTab('drills')}
        >
          ⚡ 常用生活單字 (Drills)
        </button>
      </div>

      {/* 1. 四聲聲調可視化 */}
      {activeTab === 'tones' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
          {/* 左側：四聲調值 SVG 動態音高曲線 */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, alignSelf: 'flex-start', marginBottom: '0.4rem' }}>
              五度制調值座標 (5度標記法)
            </span>
            <svg viewBox="0 0 320 200" style={{ width: '100%', maxWidth: '320px', height: 'auto', background: 'var(--surface-soft)', borderRadius: '8px' }}>
              {/* 五度座標網格 5(高) ~ 1(低) */}
              {[5, 4, 3, 2, 1].map((val, idx) => {
                const y = 30 + idx * 35
                return (
                  <g key={val}>
                    <line x1="45" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                    <text x="35" y={y + 4} fill="var(--muted)" fontSize="10" fontWeight="bold" textAnchor="end">{val}</text>
                  </g>
                )
              })}

              {/* 第一聲 55 高平 */}
              <line
                x1="60"
                y1="30"
                x2="280"
                y2="30"
                stroke={selectedTone.tone === 1 ? '#f59e0b' : '#64748b'}
                strokeWidth={selectedTone.tone === 1 ? '4' : '2'}
              />
              <text x="290" y="34" fill={selectedTone.tone === 1 ? '#f59e0b' : '#64748b'} fontSize="10" fontWeight="bold">1聲(55)</text>

              {/* 第二聲 35 高升 */}
              <path
                d="M 60 100 Q 170 85 280 30"
                fill="none"
                stroke={selectedTone.tone === 2 ? '#10b981' : '#64748b'}
                strokeWidth={selectedTone.tone === 2 ? '4' : '2'}
              />
              <text x="290" y="48" fill={selectedTone.tone === 2 ? '#10b981' : '#64748b'} fontSize="10" fontWeight="bold">2聲(35)</text>

              {/* 第三聲 214 降升 */}
              <path
                d="M 60 135 Q 150 175 280 65"
                fill="none"
                stroke={selectedTone.tone === 3 ? '#3b82f6' : '#64748b'}
                strokeWidth={selectedTone.tone === 3 ? '4' : '2'}
              />
              <text x="290" y="70" fill={selectedTone.tone === 3 ? '#3b82f6' : '#64748b'} fontSize="10" fontWeight="bold">3聲(214)</text>

              {/* 第四聲 51 全降 */}
              <line
                x1="60"
                y1="30"
                x2="280"
                y2="170"
                stroke={selectedTone.tone === 4 ? '#ef4444' : '#64748b'}
                strokeWidth={selectedTone.tone === 4 ? '4' : '2'}
              />
              <text x="290" y="174" fill={selectedTone.tone === 4 ? '#ef4444' : '#64748b'} fontSize="10" fontWeight="bold">4聲(51)</text>
            </svg>

            {/* 四聲選單切換 */}
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.6rem', width: '100%' }}>
              {CHINESE_TONES.map((t) => (
                <button
                  key={t.tone}
                  type="button"
                  className={`pill-btn ${selectedTone.tone === t.tone ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.25rem', fontSize: '0.72rem', textAlign: 'center' }}
                  onClick={() => {
                    setSelectedTone(t)
                    speakChinese(t.exampleChar)
                  }}
                >
                  第{t.tone}聲
                </button>
              ))}
            </div>
          </div>

          {/* 右側：聲調詳細指南與發音示範 */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#f59e0b' }}>{selectedTone.nameJa}</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>調符：{selectedTone.mark}</span>
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                onClick={() => {
                  speakChinese(selectedTone.exampleChar)
                  onEarnXp(5)
                  playCorrectSound()
                }}
              >
                🔊 聽示範音 ({selectedTone.exampleChar})
              </button>
            </div>

            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block' }}>💡 日本語ネイティブ向け発音のコツ：</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.45 }}>{selectedTone.pitchDescriptionJa}</p>
            </div>

            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block' }}>📖 代表例詞：</span>
              <strong style={{ fontSize: '0.9rem' }}>{selectedTone.exampleZh}</strong>
              <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>ピンイン：{selectedTone.examplePinyin}</div>
              <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '0.2rem' }}>{selectedTone.exampleJa}</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 聲母 (Initials) */}
      {activeTab === 'initials' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.4rem', marginBottom: '0.8rem' }}>
            {INITIALS_DATA.map((item) => (
              <button
                key={item.id}
                type="button"
                className="practice-card"
                style={{
                  padding: '0.5rem 0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  borderColor: selectedInitial.id === item.id ? '#f59e0b' : 'var(--line)',
                  background: selectedInitial.id === item.id ? 'rgba(245, 158, 11, 0.1)' : 'var(--surface)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                }}
                onClick={() => {
                  setSelectedInitial(item)
                  speakChinese(item.exampleChar)
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '1rem' }}>{item.pinyin}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>{item.bopomofo}</span>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{item.katakana}</span>
              </button>
            ))}
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.6rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong style={{ fontSize: '1.2rem' }}>{selectedInitial.pinyin}</strong>
                <span style={{ fontSize: '0.9rem', color: '#f59e0b' }}>{selectedInitial.bopomofo}</span>
                <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'var(--surface-soft)', border: '1px solid var(--line)' }}>
                  {selectedInitial.categoryJa}
                </span>
              </div>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: 'var(--muted)' }}>
                {selectedInitial.tipsJa}
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                speakChinese(selectedInitial.exampleChar)
                onEarnXp(5)
              }}
            >
              🔊 聽發音 ({selectedInitial.exampleChar} · {selectedInitial.exampleMeaningJa})
            </button>
          </div>
        </div>
      )}

      {/* 3. 韻母 (Finals) */}
      {activeTab === 'finals' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.4rem', marginBottom: '0.8rem' }}>
            {FINALS_DATA.map((item) => (
              <button
                key={item.id}
                type="button"
                className="practice-card"
                style={{
                  padding: '0.5rem 0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  borderColor: selectedFinal.id === item.id ? '#38bdf8' : 'var(--line)',
                  background: selectedFinal.id === item.id ? 'rgba(56, 189, 248, 0.1)' : 'var(--surface)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                }}
                onClick={() => {
                  setSelectedFinal(item)
                  speakChinese(item.exampleChar)
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '1rem' }}>{item.pinyin}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{item.bopomofo}</span>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{item.katakana}</span>
              </button>
            ))}
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.6rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong style={{ fontSize: '1.2rem' }}>{selectedFinal.pinyin}</strong>
                <span style={{ fontSize: '0.9rem', color: '#38bdf8' }}>{selectedFinal.bopomofo}</span>
                <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'var(--surface-soft)', border: '1px solid var(--line)' }}>
                  {selectedFinal.categoryJa}
                </span>
              </div>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: 'var(--muted)' }}>
                {selectedFinal.tipsJa}
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                speakChinese(selectedFinal.exampleChar)
                onEarnXp(5)
              }}
            >
              🔊 聽發音 ({selectedFinal.exampleChar} · {selectedFinal.exampleMeaningJa})
            </button>
          </div>
        </div>
      )}

      {/* 4. 常用單字拼音實戰 */}
      {activeTab === 'drills' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.6rem' }}>
          {PINYIN_DRILL_WORDS.map((w, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ fontSize: '1.05rem', display: 'block' }}>{w.zh}</strong>
                <div style={{ fontSize: '0.74rem', color: '#f59e0b' }}>{w.pinyin} · {w.bopomofo}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{w.ja}</div>
                <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '0.2rem' }}>💡 {w.tipJa}</div>
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                onClick={() => {
                  speakChinese(w.zh)
                  onEarnXp(5)
                }}
              >
                🔊 跟讀
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
