import React, { useState } from 'react'
import { CHINESE_IDIOMS, CHINESE_SUPPORT_EN, type IdiomItem } from '../data/idioms'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

export const IdiomsLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedIdiomId, setSelectedIdiomId] = useState<string>(CHINESE_IDIOMS[0].id)
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<Record<string, number>>({})
  const [showQuizResult, setShowQuizResult] = useState<Record<string, boolean>>({})

  const activeIdiom: IdiomItem =
    CHINESE_IDIOMS.find((item) => item.id === selectedIdiomId) ?? CHINESE_IDIOMS[0]
  const localizedIdiom = localizeChineseData(activeIdiom, locale, CHINESE_SUPPORT_EN)

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleAnswerQuiz(optIdx: number) {
    if (showQuizResult[activeIdiom.id]) return
    setSelectedQuizOpt((prev) => ({ ...prev, [activeIdiom.id]: optIdx }))
    setShowQuizResult((prev) => ({ ...prev, [activeIdiom.id]: true }))

    if (optIdx === activeIdiom.quiz.correctIndex) {
      onEarnXp(15)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  return (
    <div className="math-lab idioms-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📜</span> {locale === 'en' ? 'Mandarin Idioms and Taiwan Proverbs Lab' : '成語故事與台灣生活諺語實驗室 (Idioms & Proverbs Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Learn the origin and natural use of four-character idioms and Taiwan proverbs heard in conversation and the news.'
              : '台湾人の日常会話やニュースで頻出する「四字熟語」と、台湾の生活感あふれる「諺（ことわざ）」の由来・使い方をマスター！'}
          </p>
        </div>
      </div>

      {/* 膠囊選擇列 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {CHINESE_IDIOMS.map((item) => (
          <button aria-pressed={activeIdiom.id === item.id}
            key={item.id}
            type="button"
            className={`pill-btn ${activeIdiom.id === item.id ? 'active' : ''}`}
            onClick={() => setSelectedIdiomId(item.id)}
          >
            {item.idiomZh.split('，')[0]}
          </button>
        ))}
      </div>

      {/* 內容分欄佈局 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '0.8rem' }}>
        {/* 左側：成語由來與文化解析 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
                {localizedIdiom.type}
              </span>
              <h2 style={{ margin: '0.3rem 0 0.1rem', fontSize: '1.35rem', color: '#f59e0b' }}>
                {activeIdiom.idiomZh}
              </h2>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
                <span lang="zh-Latn">{activeIdiom.pinyin}</span> · {activeIdiom.bopomofo}
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
              onClick={() => speakChinese(activeIdiom.idiomZh)}
            >
              {locale === 'en' ? '🔊 Play idiom' : '🔊 聽朗讀'}
            </button>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>{locale === 'en' ? 'English meaning:' : '🇯🇵 日本語の意味：'}</span>
            <strong lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.88rem' }}>{localizedIdiom.meaningJa}</strong>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, display: 'block' }}>{locale === 'en' ? '📖 Origin and background:' : '📖 由来・背景ストーリー：'}</span>
            <p lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.45 }}>{localizedIdiom.originStoryJa}</p>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>{locale === 'en' ? 'When to use it:' : 'どんな場面で使う？：'}</span>
            <p lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.45 }}>{localizedIdiom.usageSituationJa}</p>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>{locale === 'en' ? 'Target dialogue example:' : '実用会話例文：'}</span>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, margin: '0.15rem 0' }}>{activeIdiom.exampleSentenceZh}</div>
            <div lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{localizedIdiom.exampleSentenceJa}</div>
          </div>
        </div>

        {/* 右側：成語情境填空實戰 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
              {locale === 'en' ? '🎯 Idiom cloze challenge' : '🎯 成語情境填空挑戰 (Quick Cloze Drill)'}
            </span>
            <h4 style={{ margin: '0.4rem 0 0.6rem', fontSize: '0.94rem', lineHeight: 1.45 }}>
              {activeIdiom.quiz.cloze}
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem' }}>
            {activeIdiom.quiz.options.map((opt, optIdx) => {
              const isPicked = selectedQuizOpt[activeIdiom.id] === optIdx
              const isCorrect = optIdx === activeIdiom.quiz.correctIndex
              const isDone = showQuizResult[activeIdiom.id]

              let border = 'var(--line)'
              let bg = 'var(--surface-soft)'
              if (isDone) {
                if (isCorrect) {
                  border = '#10b981'
                  bg = 'rgba(16, 185, 129, 0.15)'
                } else if (isPicked) {
                  border = '#ef4444'
                  bg = 'rgba(239, 68, 68, 0.15)'
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  className="practice-card"
                  style={{
                    padding: '0.65rem 0.85rem',
                    textAlign: 'left',
                    borderRadius: '8px',
                    border: `1px solid ${border}`,
                    background: bg,
                    cursor: isDone ? 'default' : 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onClick={() => handleAnswerQuiz(optIdx)}
                >
                  <span style={{ fontSize: '0.86rem' }}>{opt}</span>
                  {isDone && isCorrect && <span style={{ color: '#10b981', fontWeight: 700 }}>{locale === 'en' ? '✓ Correct (+15 XP)' : '✓ 正解 (+15 XP)'}</span>}
                </button>
              )
            })}
          </div>

          {showQuizResult[activeIdiom.id] && (
            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.45 }}>
              💡 <strong>{locale === 'en' ? 'Explanation: ' : '解説：'}</strong><span lang={locale === 'en' ? 'en' : 'ja'}>{localizedIdiom.quiz.explanationJa}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
