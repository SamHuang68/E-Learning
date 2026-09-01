import React, { useState } from 'react'
import { CONVERSATION_SCENES, type ConversationScene, type DialogueLine } from '../data/conversations'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const ChineseConversationLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(CONVERSATION_SCENES[0].id)
  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null)
  const [isPlayingAll, setIsPlayingAll] = useState(false)

  const activeScene: ConversationScene =
    CONVERSATION_SCENES.find((s) => s.id === selectedSceneId) ?? CONVERSATION_SCENES[0]

  function speakLine(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.9
    if (onEnd) utterance.onend = onEnd
    window.speechSynthesis.speak(utterance)
  }

  function handlePlayAll() {
    if (isPlayingAll) {
      window.speechSynthesis.cancel()
      setIsPlayingAll(false)
      setActiveLineIdx(null)
      return
    }

    setIsPlayingAll(true)
    let currentIdx = 0

    function playNext() {
      if (currentIdx >= activeScene.dialogue.length) {
        setIsPlayingAll(false)
        setActiveLineIdx(null)
        onEarnXp(15)
        playCorrectSound()
        return
      }
      setActiveLineIdx(currentIdx)
      speakLine(activeScene.dialogue[currentIdx].zh, () => {
        currentIdx += 1
        setTimeout(playNext, 600)
      })
    }

    playNext()
  }

  return (
    <div className="math-lab chinese-conversation-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>💬</span> 台湾華語・実用シチュエーション会話 (Real-life Taiwanese Mandarin Dialogues)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾旅行や出張ですぐに使えるリアルな会話表現。音声再生とピンイン・注音対照でシャドーイング！
          </p>
        </div>
      </div>

      {/* 場景切換選單 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {CONVERSATION_SCENES.map((scene) => (
          <button
            key={scene.id}
            type="button"
            className={`pill-btn ${activeScene.id === scene.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedSceneId(scene.id)
              setActiveLineIdx(null)
              setIsPlayingAll(false)
            }}
          >
            {scene.sceneCategory}：{scene.titleJa.split('（')[0]}
          </button>
        ))}
      </div>

      {/* 場景資訊卡 */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '0.85rem',
          marginBottom: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.6rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>
            {activeScene.sceneCategory} · {activeScene.titleZh}
          </span>
          <h4 style={{ margin: '0.2rem 0', fontSize: '0.95rem' }}>{activeScene.titleJa}</h4>
          <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--muted)' }}>{activeScene.descriptionJa}</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          onClick={handlePlayAll}
        >
          {isPlayingAll ? '⏹ 停止播放' : '▶ 全對話連續朗讀 (+15 XP)'}
        </button>
      </div>

      {/* 對話句子清單 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.8rem' }}>
        {activeScene.dialogue.map((line: DialogueLine, idx: number) => {
          const isCurrentActive = activeLineIdx === idx
          const isUser = line.speaker === '客人' || line.speaker === '旅客'
          return (
            <div
              key={idx}
              style={{
                background: isCurrentActive
                  ? 'rgba(245, 158, 11, 0.12)'
                  : isUser
                  ? 'var(--surface-soft)'
                  : 'var(--surface)',
                border: isCurrentActive ? '1px solid #f59e0b' : '1px solid var(--line)',
                borderRadius: '10px',
                padding: '0.75rem 0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.35rem',
                      borderRadius: '4px',
                      background: isUser ? '#f59e0b' : '#3b82f6',
                      color: '#fff',
                    }}
                  >
                    {line.speaker}
                  </span>
                  <strong style={{ fontSize: '0.95rem' }}>{line.zh}</strong>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#f59e0b' }}>
                  {line.pinyin} · {line.bopomofo}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.15rem' }}>
                  {line.ja}
                </div>
              </div>
              <button
                type="button"
                className="btn-play-ex"
                style={{ marginLeft: '0.5rem', flexShrink: 0 }}
                onClick={() => {
                  setActiveLineIdx(idx)
                  speakLine(line.zh)
                  onEarnXp(3)
                }}
              >
                🔊 跟讀
              </button>
            </div>
          )
        })}
      </div>

      {/* 台灣在地文化小貼士 */}
      <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '10px', padding: '0.75rem' }}>
        <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
          💡 台湾ローカル豆知識 (Taiwan Culture Tip)：
        </span>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.45 }}>
          {activeScene.cultureTipJa}
        </p>
      </div>
    </div>
  )
}
