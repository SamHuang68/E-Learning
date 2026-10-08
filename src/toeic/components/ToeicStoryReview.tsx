import React, { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { TOEIC_CHUNK_WEEKS } from '../data/chunks'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'

type Props = {
  onBack: () => void
  onOpenChunkLab: () => void
  instructionLang?: 'zh' | 'ja'
}

/**
 * TOEIC 商務微故事對照複習 (ToeicStoryReview)
 * 借鏡 English Chunker 週末對照複習：
 * 1. 將本週 5 個核心 Chunks 串入一段連續商務情境故事
 * 2. 提供「3 秒動作訊號判斷對照表」，徹底釐清何時用哪一個語塊
 */
export const ToeicStoryReview: React.FC<Props> = ({
  onBack,
  onOpenChunkLab,
  instructionLang = 'zh',
}) => {
  const { locale } = useI18n()
  const supportLang = toeicSupportLang(locale, instructionLang)
  const weeks = useMemo(
    () => localizeToeicData(TOEIC_CHUNK_WEEKS, locale, instructionLang),
    [instructionLang, locale],
  )
  const currentWeek = weeks[0]
  const story = currentWeek.microStory
  const copy = supportLang === 'en'
    ? {
        back: '← Back to Today',
        chunks: '🎧 Back to Business Chunk Practice',
        badge: 'WEEK 01 · WEEKEND REVIEW',
        storyTitle: '📖 Connected Workplace Story',
        tableTitle: '🎯 Check Your Answer: How Do These Five Chunks Differ?',
        tableLead: 'Use the next action as your three-second clue whenever two expressions seem similar:',
        chunk: 'Core chunk',
        signal: 'Situation clue',
        rule: 'Three-second decision rule',
        play: 'Play this sentence',
      }
    : supportLang === 'ja'
      ? {
          back: '← 今日の学習に戻る',
          chunks: '🎧 単語・チャンク音読練習に戻る',
          badge: 'WEEK 01 · 週末対照復習',
          storyTitle: '📖 つながりのあるビジネスシーン',
          tableTitle: '🎯 解答後に確認：5つの類似チャンクの使い分け',
          tableLead: '迷ったときは「次の動作」を3秒で判断しましょう：',
          chunk: '中心チャンク',
          signal: 'シーンの手がかり',
          rule: '3秒判断ルール',
          play: 'この文を再生',
        }
      : {
          back: '← 返回今日學習',
          chunks: '🎧 回到單字語塊跟讀練習',
          badge: 'WEEK 01 · 週末對照複習',
          storyTitle: '📖 連貫商務情境故事',
          tableTitle: '🎯 答完再看：5 個相似 Chunk 怎麼分？',
          tableLead: '剛才猶豫的地方，用「下一個動作」三秒直覺判定：',
          chunk: 'Chunk 核心語塊',
          signal: '看到什麼情境訊號',
          rule: '3 秒直覺破題法',
          play: '播放此句朗讀',
        }

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
          {copy.back}
        </button>
        <button type="button" className="btn-secondary" onClick={onOpenChunkLab}>
          {copy.chunks}
        </button>
      </div>

      <div className="review-hero-card">
        <span className="review-badge">{copy.badge}</span>
        <h2>{story.title}</h2>
        <p className="story-scenario">{story.scenario}</p>
      </div>

      {/* 5 句情境故事 */}
      <div className="story-sentences-card">
        <h3>{copy.storyTitle}</h3>
        <div className="story-list">
          {story.sentences.map((st) => (
            <div key={st.seq} className="story-sentence-item">
              <span className="st-seq">{st.seq}</span>
              <div className="st-body">
                <p className="st-en">{st.en}</p>
                {st.zh !== st.en ? <p className="st-zh">{st.zh}</p> : null}
              </div>
              <button
                type="button"
                className="btn-play-mini"
                onClick={() => speakText(st.en)}
                title={copy.play}
                aria-label={copy.play}
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
          <h3>{copy.tableTitle}</h3>
          <p>{copy.tableLead}</p>
        </div>

        <div className="decision-table-wrap">
          <table className="decision-table">
            <thead>
              <tr>
                <th scope="col">{copy.chunk}</th>
                <th scope="col">{copy.signal}</th>
                <th scope="col">{copy.rule}</th>
              </tr>
            </thead>
            <tbody>
              {story.decisionTable.map((row, idx) => (
                <tr key={idx}>
                  <th scope="row" className="chunk-name-cell">
                    <strong>{row.chunk}</strong>
                  </th>
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
