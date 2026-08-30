import React from 'react'
import { TOEIC_CHUNK_WEEKS } from '../data/chunks'

type Props = {
  onBack: () => void
  onOpenChunkLab: () => void
}

/**
 * TOEIC 商務微故事對照複習 (ToeicStoryReview)
 * 借鏡 English Chunker 週末對照複習：
 * 1. 將本週 5 個核心 Chunks 串入一段連續商務情境故事
 * 2. 提供「3 秒動作訊號判斷對照表」，徹底釐清何時用哪一個語塊
 */
export const ToeicStoryReview: React.FC<Props> = ({ onBack, onOpenChunkLab }) => {
  const currentWeek = TOEIC_CHUNK_WEEKS[0]
  const story = currentWeek.microStory

  function speakText(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="toeic-story-review">
      <div className="review-top-bar">
        <button type="button" className="btn-back" onClick={onBack}>
          ← 返回今日學習
        </button>
        <button type="button" className="btn-secondary" onClick={onOpenChunkLab}>
          🎧 回到單字語塊跟讀練習
        </button>
      </div>

      <div className="review-hero-card">
        <span className="review-badge">WEEK 01 · 週末對照複習</span>
        <h2>{story.title}</h2>
        <p className="story-scenario">{story.scenario}</p>
      </div>

      {/* 5 句情境故事 */}
      <div className="story-sentences-card">
        <h3>📖 連貫商務情境故事 (Workplace Scenario)</h3>
        <div className="story-list">
          {story.sentences.map((st) => (
            <div key={st.seq} className="story-sentence-item">
              <span className="st-seq">{st.seq}</span>
              <div className="st-body">
                <p className="st-en">{st.en}</p>
                <p className="st-zh">{st.zh}</p>
              </div>
              <button
                type="button"
                className="btn-play-mini"
                onClick={() => speakText(st.en)}
                title="播放此句朗讀"
              >
                🔊
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3 秒判斷對照表 */}
      <div className="decision-table-card">
        <div className="table-head-info">
          <h3>🎯 答完再看：5 個相似 Chunk 怎麼分？</h3>
          <p>剛才猶豫的地方，用「下一個動作」三秒直覺判定：</p>
        </div>

        <div className="decision-table-wrap">
          <table className="decision-table">
            <thead>
              <tr>
                <th>Chunk 核心語塊</th>
                <th>看到什麼情境訊號</th>
                <th>3 秒直覺破題法</th>
              </tr>
            </thead>
            <tbody>
              {story.decisionTable.map((row, idx) => (
                <tr key={idx}>
                  <td className="chunk-name-cell">
                    <strong>{row.chunk}</strong>
                  </td>
                  <td className="signal-cell">{row.signal}</td>
                  <td className="rule-cell">
                    <span className="rule-pill">{row.threeSecondRule}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
