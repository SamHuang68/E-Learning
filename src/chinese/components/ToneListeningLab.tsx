import React, { useState } from 'react'
import { CHINESE_SUPPORT_EN, TONE_DRILLS, type ToneDrillItem } from '../data/toneDrills'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

export const ToneListeningLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [drillIdx, setDrillIdx] = useState(0)
  const [isPlayingTarget, setIsPlayingTarget] = useState<'A' | 'B'>('A')
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const currentDrill: ToneDrillItem = TONE_DRILLS[drillIdx % TONE_DRILLS.length]
  const localizedDrill = localizeChineseData(currentDrill, locale, CHINESE_SUPPORT_EN)

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  function handlePlayQuestion() {
    // 隨機選擇 A 或 B 播放音訊
    const target = isPlayingTarget === 'A' ? currentDrill.pairA.zh : currentDrill.pairB.zh
    speakChinese(target)
  }

  function handlePick(choice: 'A' | 'B') {
    if (hasSubmitted) return
    setSelectedAnswer(choice)
    setHasSubmitted(true)
    const isCorrect = choice === isPlayingTarget
    if (isCorrect) {
      onEarnXp(10)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  function handleNext() {
    setDrillIdx((prev) => prev + 1)
    setIsPlayingTarget(Math.random() > 0.5 ? 'A' : 'B')
    setSelectedAnswer(null)
    setHasSubmitted(false)
  }

  return (
    <div className="math-lab tone-listening-lab">
      {/* 標頭 */}
      <div className="lab-header">
        <div>
          <h3>
            <span>🎧</span> {locale === 'en' ? 'Four-Tone Listening Lab' : '四聲聲調辨音聽力實驗室 (Tone Listening Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc">
            {locale === 'en'
              ? 'Train your ear with blind listening comparisons of Mandarin minimal pairs that differ mainly by tone.'
              : '日本人学習者が最も聞き取りにくい「最小対立体（Minimal Pairs）」をブラインドで聴き分け、耳を鍛えよう！'}
          </p>
        </div>
      </div>

      {/* 測驗核心卡片 */}
      <div className="tone-drill-card">
        <div className="tone-drill-meta">
          <span className="tone-drill-counter">
            {locale === 'en' ? 'Question' : '問題'} #{drillIdx + 1} / {TONE_DRILLS.length}
          </span>
          <span lang={locale === 'en' ? 'en' : 'ja'} className="tone-drill-title">{localizedDrill.titleJa}</span>
        </div>

        {/* 播放按鈕 */}
        <div className="tone-drill-play">
          <button lang={locale === 'en' ? 'en' : 'ja'}
            type="button"
            className="btn-primary tone-drill-play-button"
            onClick={handlePlayQuestion}
          >
            {locale === 'en' ? '🔊 Play audio' : '🔊 音声を聴く (Play Audio)'}
          </button>
          <span lang={locale === 'en' ? 'en' : 'ja'} className="tone-drill-help">
            {locale === 'en'
              ? 'Listen to the pronunciation, then choose the word you heard.'
              : 'ボタンを押して発音を聞き、どちらの単語か判定してください'}
          </span>
        </div>

        {/* 二選一選項按鈕 */}
        <div className="tone-drill-options">
          <button
            type="button"
            className="practice-card tone-drill-option"
            aria-pressed={selectedAnswer === 'A'}
            aria-disabled={hasSubmitted}
            style={{
              borderColor:
                hasSubmitted && isPlayingTarget === 'A'
                  ? '#10b981'
                  : hasSubmitted && selectedAnswer === 'A'
                    ? '#ef4444'
                    : 'var(--line)',
              background:
                hasSubmitted && isPlayingTarget === 'A'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : hasSubmitted && selectedAnswer === 'A'
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'var(--surface-soft)',
              cursor: hasSubmitted ? 'default' : 'pointer',
            }}
            onClick={() => handlePick('A')}
          >
            <h3>{currentDrill.pairA.zh}</h3>
            <div lang="zh-Latn" className="tone-drill-pinyin">{currentDrill.pairA.pinyin}</div>
            <span lang={locale === 'en' ? 'en' : 'ja'} className="tone-drill-meaning">
              {localizedDrill.pairA.meaningJa}
            </span>
          </button>

          <button
            type="button"
            className="practice-card tone-drill-option"
            aria-pressed={selectedAnswer === 'B'}
            aria-disabled={hasSubmitted}
            style={{
              borderColor:
                hasSubmitted && isPlayingTarget === 'B'
                  ? '#10b981'
                  : hasSubmitted && selectedAnswer === 'B'
                    ? '#ef4444'
                    : 'var(--line)',
              background:
                hasSubmitted && isPlayingTarget === 'B'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : hasSubmitted && selectedAnswer === 'B'
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'var(--surface-soft)',
              cursor: hasSubmitted ? 'default' : 'pointer',
            }}
            onClick={() => handlePick('B')}
          >
            <h3>{currentDrill.pairB.zh}</h3>
            <div lang="zh-Latn" className="tone-drill-pinyin">{currentDrill.pairB.pinyin}</div>
            <span lang={locale === 'en' ? 'en' : 'ja'} className="tone-drill-meaning">
              {localizedDrill.pairB.meaningJa}
            </span>
          </button>
        </div>

        {/* 提交後的辨析解析 */}
        {hasSubmitted && (
          <div className="tone-drill-feedback">
            <div className="tone-drill-result" style={{ color: selectedAnswer === isPlayingTarget ? '#10b981' : '#ef4444' }}>
              {selectedAnswer === isPlayingTarget
                ? locale === 'en' ? '🎉 Correct! (+10 XP)' : '🎉 正解！(+10 XP)'
                : locale === 'en' ? '⚠️ Not quite. Listen once more and compare the tones.' : '⚠️ 不正解。もう一度音を聞き比べてみましょう。'}
            </div>
            <p lang={locale === 'en' ? 'en' : 'ja'}>
              💡 <strong>{locale === 'en' ? 'Listening cue: ' : '聞き分けのコツ：'}</strong><span>{localizedDrill.confusionPointJa}</span>
            </p>
            <div className="tone-drill-example">
              {locale === 'en' ? 'Target example: ' : '例文：'}{currentDrill.exampleContextZh}
            </div>

            <div className="tone-drill-next">
              <button lang={locale === 'en' ? 'en' : 'ja'} type="button" className="btn-primary" onClick={handleNext}>
                {locale === 'en' ? 'Next question →' : '次の問題へ →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
