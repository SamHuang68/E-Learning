import React, { useState } from 'react'
import { FALSE_FRIENDS_DATA, type FalseFriendItem } from '../data/falseFriends'

interface Props {
  onEarnXp: (amount: number) => void
}

export const FalseFriendsLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedItem, setSelectedItem] = useState<FalseFriendItem>(FALSE_FRIENDS_DATA[0])
  const [selectedTag, setSelectedTag] = useState<string>('all')

  const filteredItems = FALSE_FRIENDS_DATA.filter((item) => {
    if (selectedTag === 'all') return true
    return item.tag === selectedTag
  })

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="math-lab false-friends-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⛩️</span> 日中同形異義語・偽友詞實驗室 (False Friends & Kanji Pitfalls)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            同じ漢字でも日中で意味がまったく異なる要注意単語！「手紙・汽車・勉強・愛人・大丈夫」などの大誤解を完全防止。
          </p>
        </div>
      </div>

      {/* 類別篩選 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {['all', '日常生活', '交通飲食', '職場商務', '感情社交'].map((tag) => (
          <button
            key={tag}
            type="button"
            className={`pill-btn ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag === 'all' ? '全部單字' : tag}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
        {/* 左側：單字選單清單 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '420px', overflowY: 'auto' }}>
          {filteredItems.map((item) => {
            const isSelected = selectedItem.id === item.id
            return (
              <button
                key={item.id}
                type="button"
                className="practice-card"
                style={{
                  padding: '0.65rem 0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderColor: isSelected ? '#f59e0b' : 'var(--line)',
                  background: isSelected ? 'rgba(245, 158, 11, 0.1)' : 'var(--surface)',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  textAlign: 'left',
                }}
                onClick={() => {
                  setSelectedItem(item)
                  speakChinese(item.wordZh)
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.05rem', color: isSelected ? '#f59e0b' : 'var(--text-main)' }}>
                    {item.wordZh}
                  </strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--muted)', marginLeft: '0.4rem' }}>
                    {item.pinyin}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.15rem' }}>
                    中：{item.meaningZhInJa.replace(/【|】/g, '')}
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'var(--surface-soft)', color: 'var(--muted)' }}>
                  {item.tag}
                </span>
              </button>
            )
          })}
        </div>

        {/* 右側：深度避坑對照卡 */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '14px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{selectedItem.wordZh}</h2>
                <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontFamily: 'monospace' }}>
                  {selectedItem.pinyin} ({selectedItem.bopomofo})
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                speakChinese(selectedItem.wordZh)
                onEarnXp(5)
              }}
            >
              🔊 單字朗讀
            </button>
          </div>

          {/* 日中對比矩陣 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '0.6rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700, display: 'block' }}>🇹🇼 中国語の意味</span>
              <strong style={{ fontSize: '0.85rem', color: '#ef4444' }}>{selectedItem.meaningZhInJa}</strong>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', padding: '0.6rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 700, display: 'block' }}>🇯🇵 日本語の「{selectedItem.wordJa}」</span>
              <strong style={{ fontSize: '0.85rem', color: '#3b82f6' }}>{selectedItem.meaningJaInJa}</strong>
            </div>
          </div>

          {/* 避坑地雷警示 */}
          <div style={{ background: 'var(--surface-soft)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '0.74rem', color: '#f59e0b', fontWeight: 700, display: 'block' }}>
              ⚠️ ネイティブの避坑アドバイス：
            </span>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.45 }}>{selectedItem.pitfallAlertJa}</p>
          </div>

          {/* 情境例句與發音跟讀 */}
          <div style={{ background: 'var(--surface-soft)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>📝 リアル例文：</span>
              <button
                type="button"
                className="pill-btn"
                style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                onClick={() => speakChinese(selectedItem.exampleSentenceZh)}
              >
                🔊 聽句子
              </button>
            </div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>{selectedItem.exampleSentenceZh}</strong>
            <div style={{ fontSize: '0.72rem', color: '#f59e0b' }}>{selectedItem.examplePinyin}</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
              {selectedItem.exampleTranslationJa}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
