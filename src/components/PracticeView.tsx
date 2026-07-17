import { useEffect, useState } from 'react'
import type { Unit } from '../data/course'
import { getJaPractice } from '../data/practiceContent'
import {
  REGISTER_LABELS,
  type SpeakableCard,
} from '../data/practiceTypes'
import { SpeakButton } from './SpeakButton'

type Props = {
  kind: 'vocab' | 'grammar' | 'reading'
  levelId: string
  unit: Unit
  onBack: () => void
  onProgress: () => void
}

const copy = {
  vocab: {
    eyebrow: 'VOCABULARY',
    title: '核心單字',
    action: '標記熟練 +1',
  },
  reading: {
    eyebrow: 'READING',
    title: '閱讀練習',
    action: '完成本題',
  },
  grammar: {
    eyebrow: 'GRAMMAR',
    title: '場面・敬語',
    action: '開始練習',
  },
}

function cardsForKind(
  kind: Props['kind'],
  pack: ReturnType<typeof getJaPractice>,
): SpeakableCard[] {
  if (!pack) return []
  if (kind === 'vocab') return pack.vocab
  if (kind === 'reading') return pack.passage
  return pack.grammar
}

export function PracticeView({
  kind,
  levelId,
  unit,
  onBack,
  onProgress,
}: Props) {
  const meta = copy[kind]
  const pack = getJaPractice(levelId, unit.id)
  const cards = cardsForKind(kind, pack)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [kind, levelId, unit.id])

  const card = cards[index]
  const total = cards.length
  const fallbackSpeak = unit.titleJa

  return (
    <section className="practice-view">
      <button type="button" className="ghost back" onClick={onBack}>
        ← 返回今日學習
      </button>
      <p className="eyebrow">{meta.eyebrow}</p>
      <h1>
        {meta.title}
        <span>Unit {unit.id}</span>
      </h1>
      <p className="lede">
        {kind === 'grammar'
          ? `本課重點：${unit.grammar}｜練習場面與敬語／丁寧語對照`
          : `圍繞「${unit.titleJa}」建立可輸出的日語基礎。`}
      </p>

      <div className="practice-card">
        {total > 0 && (
          <div className="practice-nav">
            <span>
              {index + 1} / {total}
            </span>
            <div className="nav-btns">
              <button
                type="button"
                className="ghost"
                disabled={index <= 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
              >
                ← 上一張
              </button>
              <button
                type="button"
                className="ghost"
                disabled={index >= total - 1}
                onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              >
                下一張 →
              </button>
            </div>
          </div>
        )}

        {card ? (
          <div className="flash-face">
            <strong>{card.head}</strong>
            {(card.reading || card.meaning) && (
              <span className="flash-meaning">
                {[card.reading, card.meaning].filter(Boolean).join(' · ')}
              </span>
            )}
            <p>{card.sentence}</p>
            {card.sentenceZh && (
              <span className="flash-sentence-zh">{card.sentenceZh}</span>
            )}
            <div className="flash-meta">
              <span className="scenario-chip">{card.scenario}</span>
              <span
                className="register-chip"
                data-register={card.register}
              >
                {REGISTER_LABELS[card.register].ja}
              </span>
            </div>
            <p className="flash-scenario">使用場景：{card.scenario}</p>
          </div>
        ) : (
          <div className="practice-empty">
            <strong>本單元內容準備中</strong>
            <p>
              「{unit.titleJa}」的練習卡尚未就緒，仍可先用單元標題練習發音。
            </p>
          </div>
        )}

        <div className="flash-actions">
          {card && (
            <>
              <SpeakButton lang="ja" text={card.head} label="單字播" />
              <SpeakButton
                lang="ja"
                text={card.speakText ?? card.sentence}
                label="整句播"
              />
            </>
          )}
          {!card && (
            <SpeakButton lang="ja" text={fallbackSpeak} label="播放單元標題" />
          )}
          <button
            type="button"
            className="primary-btn inline"
            onClick={onProgress}
          >
            {meta.action}
          </button>
        </div>
      </div>
    </section>
  )
}
