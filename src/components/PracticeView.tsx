import { useI18n } from '../i18n/i18n'
import { jaTeachingCopy, localizeJaPractice } from '../i18n/jaTeachingCopy'
import { useEffect, useMemo, useState } from 'react'
import type { Unit } from '../data/course'
import { itemKey } from '../data/contentPack'
import { getJaPractice } from '../data/practiceContent'
import {
  REGISTER_LABELS,
  type SpeakableCard,
  type UnitPractice,
} from '../data/practiceTypes'
import {
  cardsToExercises,
  sessionFromUnitPractice,
  type UnitPracticeKind,
} from '../engine/exercises'
import {
  applyExerciseSessionResult,
  type ExerciseSessionResult,
} from '../engine/sessionResults'
import { ExerciseSession } from './ExerciseSession'
import { SpeakButton } from './SpeakButton'
import { AudioLesson } from './AudioLesson'
import type { AudioLessonSegment } from '../utils/audioLessonTypes'

type Props = {
  kind: 'vocab' | 'grammar' | 'reading'
  levelId: string
  unit: Unit
  mode?: 'learn' | 'quiz'
  reviewIds?: string[]
  onBack: () => void
  onProgress: (delta?: number) => void
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

function allCards(pack: UnitPractice | null): SpeakableCard[] {
  if (!pack) return []
  return [...pack.vocab, ...pack.passage, ...pack.grammar]
}

function reviewFilter(cards: SpeakableCard[], reviewIds?: string[]): SpeakableCard[] {
  if (!reviewIds) return cards
  const wanted = new Set(reviewIds)
  return cards.filter((card) => wanted.has(card.id) || wanted.has(itemKey('ja', card.id)))
}

function filterPack(pack: UnitPractice | null, reviewIds?: string[]): UnitPractice | null {
  if (!pack || !reviewIds) return pack
  return {
    vocab: reviewFilter(pack.vocab, reviewIds),
    passage: reviewFilter(pack.passage, reviewIds),
    grammar: reviewFilter(pack.grammar, reviewIds),
  }
}

export function PracticeView({
  kind,
  levelId,
  unit,
  mode,
  reviewIds,
  onBack,
  onProgress,
}: Props) {
  const { locale } = useI18n()
  const text = (value: string) => jaTeachingCopy(locale, value)
  const meta = { ...copy[kind], title: text(copy[kind].title), action: text(copy[kind].action) }
  const rawPack = getJaPractice(levelId, unit.id)
  const pack = useMemo(() => localizeJaPractice(rawPack, locale), [rawPack, locale])
  const isReview = Boolean(reviewIds)
  const sourceCards = isReview ? allCards(pack) : cardsForKind(kind, pack)
  const cards = reviewFilter(sourceCards, reviewIds)
  const filteredPack = filterPack(pack, reviewIds)
  const [index, setIndex] = useState(0)
  const [activeMode, setActiveMode] = useState<'learn' | 'quiz'>(
    mode ?? (cards.length > 0 ? 'quiz' : 'learn'),
  )

  useEffect(() => {
    setIndex(0)
    setActiveMode(mode ?? (cards.length > 0 ? 'quiz' : 'learn'))
  }, [cards.length, kind, levelId, mode, unit.id])

  const card = cards[index]
  const total = cards.length
  const fallbackSpeak = unit.titleJa
  const explanationLang = locale === 'en' ? 'en-US' : 'zh-TW'
  const audioSegments: AudioLessonSegment[] = card ? [
    { id: 'sentence', text: card.speakText ?? card.sentence, lang: 'ja-JP', kind: 'example', audioSrc: card.audio?.src },
    { id: 'meaning', text: card.meaning, lang: explanationLang, kind: 'explanation' },
    ...(card.sentenceZh ? [{ id: 'translation', text: card.sentenceZh, lang: explanationLang, kind: 'explanation' } as AudioLessonSegment] : []),
    { id: 'scenario', text: card.scenario, lang: explanationLang, kind: 'explanation' },
  ] : []
  const exercises = isReview
    ? cardsToExercises(cards, 'ja', allCards(pack))
    : sessionFromUnitPractice(filteredPack, kind as UnitPracticeKind, 'ja')

  const modeTabs = (
    <div className="mode-tabs">
      <button
        type="button"
        className={activeMode === 'learn' ? 'active' : ''}
        aria-pressed={activeMode === 'learn'}
        onClick={() => setActiveMode('learn')}
      >
        {text('認識閃卡')}
      </button>
      <button
        type="button"
        className={activeMode === 'quiz' ? 'active' : ''}
        aria-pressed={activeMode === 'quiz'}
        onClick={() => setActiveMode('quiz')}
      >
        {text('答題練習')}
      </button>
    </div>
  )

  function handleQuizComplete(result: ExerciseSessionResult) {
    const saved = applyExerciseSessionResult(result, {
      track: 'ja',
      kind,
      review: isReview,
    })
    onProgress(saved.correctCards)
    onBack()
  }

  if (activeMode === 'quiz') {
    return (
      <>
        {modeTabs}
        <ExerciseSession
          title={`${isReview ? text('今日複習') : meta.title} · Unit ${unit.id}`}
          lang="ja"
          exercises={exercises}
          onComplete={handleQuizComplete}
          onExit={onBack}
        />
      </>
    )
  }

  return (
    <section className="practice-view">
      <button type="button" className="ghost back" onClick={onBack}>
        {text('← 返回今日學習')}
      </button>
      <p className="eyebrow">{meta.eyebrow}</p>
      <h2>
        {meta.title}
        <span>Unit {unit.id}</span>
      </h2>
      <p className="lede">
        {isReview
          ? text('根據今日 SRS 佇列複習到期與新卡。')
          : kind === 'grammar'
          ? locale === 'en' ? `Focus: ${unit.grammar} | Practice scenarios and register contrasts` : `本課重點：${unit.grammar}｜練習場面與敬語／丁寧語對照`
          : locale === 'en' ? `Build practical Japanese around ${unit.titleJa}.` : `圍繞「${unit.titleJa}」建立可輸出的日語基礎。`}
      </p>

      {modeTabs}

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
                {text('← 上一張')}
              </button>
              <button
                type="button"
                className="ghost"
                disabled={index >= total - 1}
                onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              >
                {text('下一張 →')}
              </button>
            </div>
          </div>
        )}

        {card ? (
          <div className="flash-face" role="status" aria-live="polite" aria-atomic="true">
            <strong lang="ja">{card.head}</strong>
            {(card.reading || card.meaning) && (
              <span className="flash-meaning">
                {card.reading && <span lang="ja">{card.reading}</span>}
                {card.reading && card.meaning ? ' · ' : null}
                {card.meaning && <span lang={locale}>{card.meaning}</span>}
              </span>
            )}
            <p lang="ja">{card.sentence}</p>
            {card.sentenceZh && (
              <span className="flash-sentence-zh" lang={locale}>{card.sentenceZh}</span>
            )}
            <div className="flash-meta">
              <span className="scenario-chip">{card.scenario}</span>
              <span
                className="register-chip"
                data-register={card.register}
              >
                {REGISTER_LABELS[card.register][locale === 'en' ? 'en' : 'ja']}
              </span>
            </div>
            <p className="flash-scenario">{locale === 'en' ? 'Scenario: ' : '使用場景：'}{card.scenario}</p>
          </div>
        ) : (
          <div className="practice-empty">
            <strong>{text('本單元內容準備中')}</strong>
            <p>
              {locale === 'en' ? `Cards for ${unit.titleJa} are not ready yet. Practice pronunciation with the unit title.` : `「${unit.titleJa}」的練習卡尚未就緒，仍可先用單元標題練習發音。`}
            </p>
          </div>
        )}

        {card && (
          <AudioLesson
            lessonId={`ja:${levelId}:${unit.id}:${kind}:${isReview ? 'review' : 'learn'}:${card.id}:${locale}`}
            title={locale === 'en' ? 'Audio lesson' : '語音教學'}
            segments={audioSegments}
          />
        )}

        <div className="flash-actions">
          {card && (
            <>
              <SpeakButton lang="ja" text={card.head} label={text('單字播')} />
              <SpeakButton
                lang="ja"
                text={card.speakText ?? card.sentence}
                label={text('整句播')}
              />
            </>
          )}
          {!card && (
            <SpeakButton lang="ja" text={fallbackSpeak} label={text('播放單元標題')} />
          )}
          <button
            type="button"
            className="primary-btn inline"
            disabled={!card}
            onClick={() => onProgress()}
          >
            {isReview ? text('標記複習 +1') : meta.action}
          </button>
        </div>
      </div>
    </section>
  )
}
