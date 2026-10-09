import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CHINESE_SUPPORT_EN, CONVERSATION_SCENES, type ConversationScene, type DialogueLine } from '../data/conversations'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'
import { AudioLesson } from '../../components/AudioLesson'
import { startAudioLesson } from '../../utils/audioLessonPlayback'
import { speakChinese } from '../../utils/speech'
import type { AudioLessonSegment } from '../../utils/audioLessonTypes'

interface Props {
  onEarnXp: (amount: number) => void
}

export const ChineseConversationLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedSceneId, setSelectedSceneId] = useState<string>(CONVERSATION_SCENES[0].id)
  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null)
  const [isPlayingAll, setIsPlayingAll] = useState(false)
  const stopSpeechRef = useRef<(() => void) | null>(null)
  const playbackRunRef = useRef(0)

  const activeScene: ConversationScene =
    CONVERSATION_SCENES.find((s) => s.id === selectedSceneId) ?? CONVERSATION_SCENES[0]
  const localizedScene = localizeChineseData(activeScene, locale, CHINESE_SUPPORT_EN)
  const localizedScenes = localizeChineseData(CONVERSATION_SCENES, locale, CHINESE_SUPPORT_EN)
  const audioSegments = useMemo<AudioLessonSegment[]>(() => {
    const scene = localizeChineseData(activeScene, locale, CHINESE_SUPPORT_EN)
    const lang = locale === 'en' ? 'en-US' : 'ja-JP'
    return [
      ...activeScene.dialogue.flatMap((line, index): AudioLessonSegment[] => [
        { id: `line-${index}-example`, text: line.zh, lang: 'zh-TW', kind: 'example' },
        { id: `line-${index}-explanation`, text: scene.dialogue[index].ja, lang, kind: 'explanation' },
      ]),
      { id: 'culture-tip', text: scene.cultureTipJa, lang, kind: 'explanation' },
    ]
  }, [activeScene, locale])

  function stopPlayback() {
    playbackRunRef.current += 1
    stopSpeechRef.current?.()
    stopSpeechRef.current = null
    setIsPlayingAll(false)
    setActiveLineIdx(null)
  }

  useEffect(() => {
    const handleHidden = () => {
      if (document.hidden) stopPlayback()
    }
    document.addEventListener('visibilitychange', handleHidden)
    return () => {
      document.removeEventListener('visibilitychange', handleHidden)
      stopPlayback()
    }
  }, [selectedSceneId, locale])

  function handlePlayAll() {
    if (isPlayingAll) {
      stopPlayback()
      return
    }

    stopPlayback()
    const run = ++playbackRunRef.current
    setIsPlayingAll(true)
    stopSpeechRef.current = startAudioLesson(
      activeScene.dialogue.map((line, index) => ({
        id: `dialogue-${index}`, text: line.zh, lang: 'zh-TW', kind: 'example',
      })),
      {
        rate: 0.9,
        shadow: false,
        onSegment: (index) => {
          if (run === playbackRunRef.current) setActiveLineIdx(index)
        },
        onPhase: (phase) => {
          if (run !== playbackRunRef.current) return
          if (phase === 'complete' || phase === 'stopped' || phase === 'error') {
            setIsPlayingAll(false)
            setActiveLineIdx(null)
            stopSpeechRef.current = null
          }
          if (phase === 'complete') {
            onEarnXp(15)
            playCorrectSound()
          }
        },
        onError: () => {
          if (run === playbackRunRef.current) {
            setIsPlayingAll(false)
            setActiveLineIdx(null)
          }
        },
      },
    )
  }

  return (
    <div className="math-lab chinese-conversation-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>💬</span> {locale === 'en' ? 'Practical Taiwan Mandarin Dialogues' : '台湾華語・実用シチュエーション会話 (Real-life Taiwanese Mandarin Dialogues)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Shadow practical dialogue for travel and business in Taiwan with audio, pinyin, and Bopomofo support.'
              : '台湾旅行や出張ですぐに使えるリアルな会話表現。音声再生とピンイン・注音対照でシャドーイング！'}
          </p>
        </div>
      </div>

      {/* 場景切換選單 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {localizedScenes.map((scene) => (
          <button aria-pressed={activeScene.id === scene.id}
            key={scene.id}
            type="button"
            className={`pill-btn ${activeScene.id === scene.id ? 'active' : ''}`}
            onClick={() => {
              stopPlayback()
              setSelectedSceneId(scene.id)
            }}
          >
            {scene.sceneCategory}: {scene.titleJa.split('（')[0]}
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
            {localizedScene.sceneCategory} · {localizedScene.titleZh}
          </span>
          <h4 lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: '0.2rem 0', fontSize: '0.95rem' }}>{localizedScene.titleJa}</h4>
          <p lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: 0, fontSize: '0.76rem', color: 'var(--muted)' }}>{localizedScene.descriptionJa}</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          onClick={handlePlayAll}
        >
          {isPlayingAll
            ? locale === 'en' ? '⏹ Stop playback' : '⏹ 停止播放'
            : locale === 'en' ? '▶ Play full dialogue (+15 XP)' : '▶ 全對話連續朗讀 (+15 XP)'}
        </button>
      </div>

      <AudioLesson
        lessonId={`chinese-conversation:${activeScene.id}:${locale}`}
        segments={audioSegments}
      />

      {/* 對話句子清單 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.8rem' }}>
        {activeScene.dialogue.map((line: DialogueLine, idx: number) => {
          const localizedLine = localizedScene.dialogue[idx]
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
                    {localizedLine.speaker}
                  </span>
                  <strong style={{ fontSize: '0.95rem' }}>{line.zh}</strong>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#f59e0b' }}>
                  <span lang="zh-Latn">{line.pinyin}</span> · {line.bopomofo}
                </div>
                <div lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.15rem' }}>
                  {localizedLine.ja}
                </div>
              </div>
              <button
                type="button"
                className="btn-play-ex"
                style={{ marginLeft: '0.5rem', flexShrink: 0 }}
                onClick={() => {
                  stopPlayback()
                  const run = ++playbackRunRef.current
                  setActiveLineIdx(idx)
                  const finish = () => {
                    if (run === playbackRunRef.current) setActiveLineIdx(null)
                  }
                  stopSpeechRef.current = speakChinese(line.zh, {
                    rate: 0.9, onEnd: finish, onError: finish, onCancel: finish,
                  })
                  onEarnXp(3)
                }}
              >
                {locale === 'en' ? '🔊 Repeat' : '🔊 跟讀'}
              </button>
            </div>
          )
        })}
      </div>

      {/* 台灣在地文化小貼士 */}
      <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '10px', padding: '0.75rem' }}>
        <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
          {locale === 'en' ? '💡 Taiwan culture tip:' : '💡 台湾ローカル豆知識 (Taiwan Culture Tip)：'}
        </span>
        <p lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.45 }}>
          {localizedScene.cultureTipJa}
        </p>
      </div>
    </div>
  )
}
