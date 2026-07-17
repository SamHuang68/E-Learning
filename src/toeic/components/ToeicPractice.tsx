import { useEffect, useState } from 'react'
import { SpeakButton } from '../../components/SpeakButton'
import { ExerciseSession } from '../../components/ExerciseSession'
import { itemKey } from '../../data/contentPack'
import {
  REGISTER_LABELS,
  type SpeakableCard,
  type UnitPractice,
} from '../../data/practiceTypes'
import {
  cardsToExercises,
  sessionFromUnitPractice,
  type UnitPracticeKind,
} from '../../engine/exercises'
import {
  applyExerciseSessionResult,
  type ExerciseSessionResult,
} from '../../engine/sessionResults'
import type { ToeicUnit } from '../data/certificates'
import { getToeicPractice } from '../data/practiceContent'

type Props = {
  kind: 'vocab' | 'listening' | 'grammar'
  certificateId: string
  unit: ToeicUnit
  mode?: 'learn' | 'quiz'
  reviewIds?: string[]
  onBack: () => void
  onProgress: (delta?: number) => void
}

const copy = {
  vocab: {
    eyebrow: 'VOCABULARY',
    title: 'Word Practice',
    action: 'Mark done +XP',
  },
  listening: {
    eyebrow: 'LISTENING',
    title: 'Listen & Repeat',
    action: 'Mark done +XP',
  },
  grammar: {
    eyebrow: 'GRAMMAR',
    title: 'Polite Patterns',
    action: 'Mark done +XP',
  },
}

function cardsForKind(
  kind: Props['kind'],
  pack: ReturnType<typeof getToeicPractice>,
): SpeakableCard[] {
  if (!pack) return []
  if (kind === 'vocab') return pack.vocab
  if (kind === 'listening') return pack.passage
  return pack.grammar
}

function allCards(pack: UnitPractice | null): SpeakableCard[] {
  if (!pack) return []
  return [...pack.vocab, ...pack.passage, ...pack.grammar]
}

function reviewFilter(cards: SpeakableCard[], reviewIds?: string[]): SpeakableCard[] {
  if (!reviewIds) return cards
  const wanted = new Set(reviewIds)
  return cards.filter((card) => wanted.has(card.id) || wanted.has(itemKey('en', card.id)))
}

function filterPack(pack: UnitPractice | null, reviewIds?: string[]): UnitPractice | null {
  if (!pack || !reviewIds) return pack
  return {
    vocab: reviewFilter(pack.vocab, reviewIds),
    passage: reviewFilter(pack.passage, reviewIds),
    grammar: reviewFilter(pack.grammar, reviewIds),
  }
}

export function ToeicPractice({
  kind,
  certificateId,
  unit,
  mode,
  reviewIds,
  onBack,
  onProgress,
}: Props) {
  const meta = copy[kind]
  const pack = getToeicPractice(certificateId, unit.id)
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
  }, [cards.length, certificateId, kind, mode, unit.id])

  const card = cards[index]
  const total = cards.length
  const fallbackSpeak = unit.titleEn
  const exercises = isReview
    ? cardsToExercises(cards, 'en', allCards(pack))
    : sessionFromUnitPractice(
        filteredPack,
        (kind === 'listening' ? 'listening' : kind) as UnitPracticeKind,
        'en',
      )

  const modeTabs = (
    <div className="mode-tabs">
      <button
        type="button"
        className={activeMode === 'learn' ? 'active' : ''}
        onClick={() => setActiveMode('learn')}
      >
        Flash cards
      </button>
      <button
        type="button"
        className={activeMode === 'quiz' ? 'active' : ''}
        onClick={() => setActiveMode('quiz')}
      >
        Practice quiz
      </button>
    </div>
  )

  function handleQuizComplete(result: ExerciseSessionResult) {
    const saved = applyExerciseSessionResult(result, {
      track: 'en',
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
          title={`${isReview ? 'Today Review' : meta.title} · Unit ${unit.id}`}
          lang="en"
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
        ← Back
      </button>
      <p className="eyebrow">{meta.eyebrow}</p>
      <h1>
        {meta.title}
        <span>Unit {unit.id}</span>
      </h1>
      <p className="lede">
        {isReview
          ? 'Review due and new SRS cards for today.'
          : kind === 'grammar'
          ? `${unit.grammar} · scenario & business politeness`
          : unit.titleEn}
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
                ← Prev
              </button>
              <button
                type="button"
                className="ghost"
                disabled={index >= total - 1}
                onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              >
                Next →
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
                {REGISTER_LABELS[card.register].en}
              </span>
            </div>
            <p className="flash-scenario">Scenario: {card.scenario}</p>
          </div>
        ) : (
          <div className="practice-empty">
            <strong>Content coming soon</strong>
            <p>
              Practice cards for “{unit.titleEn}” are not ready yet. You can still
              hear the unit title.
            </p>
          </div>
        )}

        <div className="flash-actions">
          {card && kind === 'listening' && (
            <SpeakButton
              lang="en"
              text={card.speakText ?? card.sentence}
              label="Play line"
            />
          )}
          {card && kind !== 'listening' && (
            <>
              <SpeakButton lang="en" text={card.head} label="Word" />
              <SpeakButton
                lang="en"
                text={card.speakText ?? card.sentence}
                label="Sentence"
              />
            </>
          )}
          {!card && (
            <SpeakButton lang="en" text={fallbackSpeak} label="Unit title" />
          )}
          <button
            type="button"
            className="primary-btn inline"
            onClick={() => onProgress()}
          >
            {isReview ? 'Mark review +XP' : meta.action}
          </button>
        </div>
      </div>
    </section>
  )
}
