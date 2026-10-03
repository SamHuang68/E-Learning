import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  gradeAnswer,
  type Exercise,
  type ExerciseKind,
} from '../engine/exercises'
import { useI18n } from '../i18n/i18n'
import type { MessageKey } from '../i18n/messages'
import { SpeakButton } from './SpeakButton'
import { playCorrectSound } from '../engine/audioSynthesizer'

type ItemResult = { id: string; cardId: string; correct: boolean }

type Props = {
  title: string
  lang: 'ja' | 'en'
  exercises: Exercise[]
  onComplete: (result: {
    correct: number
    total: number
    itemResults: ItemResult[]
  }) => void
  onExit: () => void
}

const KIND_LABELS: Record<ExerciseKind, string> = {
  recognize: 'Recognize',
  meaningToHead: 'Meaning → Word',
  listenSelect: 'Listening',
  fillBlank: 'Fill blank',
  orderWords: 'Order words',
  registerPick: 'Register',
  passageQuiz: 'Passage quiz',
}

export function ExerciseSession({
  title,
  lang,
  exercises,
  onComplete,
  onExit,
}: Props) {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const [selectedChoice, setSelectedChoice] = useState('')
  const [textAnswer, setTextAnswer] = useState('')
  const [order, setOrder] = useState<number[]>([])
  const [results, setResults] = useState<ItemResult[]>([])
  const promptRef = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLDivElement>(null)
  const focusNext = useRef(false)

  const total = exercises.length
  const exercise = exercises[index]
  const completedResults = results.filter(
    (result): result is ItemResult => Boolean(result),
  )
  const correct = completedResults.filter((result) => result.correct).length
  const { t, locale } = useI18n()
  const meaningLang = lang === 'ja' ? locale : 'zh-Hant'
  const copy = uiCopy(t)

  useEffect(() => {
    setIndex(0)
    setDone(false)
    setResults([])
  }, [exercises])

  useEffect(() => {
    setFeedback(null)
    setSelectedChoice('')
    setTextAnswer('')
    setOrder([])
  }, [exercise?.id])

  useEffect(() => {
    if (!focusNext.current) return
    focusNext.current = false
    ;(done ? scoreRef.current : promptRef.current)?.focus()
  }, [index, done])

  function submitAnswer(answer: string) {
    if (!exercise || feedback !== null) return

    const isCorrect = gradeAnswer(exercise, answer)
    setFeedback(isCorrect)
    if (isCorrect) {
      playCorrectSound()
    }
    setSelectedChoice(answer)
    setResults((previous) => {
      const next = [...previous]
      next[index] = {
        id: exercise.id,
        cardId: exercise.card.id,
        correct: isCorrect,
      }
      return next
    })
  }

  function handleNext() {
    focusNext.current = true
    if (index >= total - 1) {
      setDone(true)
      return
    }
    setIndex((current) => Math.min(total - 1, current + 1))
  }

  function handleFinish() {
    onComplete({
      correct,
      total,
      itemResults: completedResults,
    })
  }

  if (total === 0 || !exercise) {
    return (
      <section className="practice-view exercise-session">
        <button type="button" className="ghost back" onClick={onExit}>
          {copy.exit}
        </button>
        <p className="eyebrow">EXERCISES</p>
        <h1>{title}</h1>
        <div className="practice-card">
          <div className="flash-face practice-empty">
            <strong>
              <span className="practice-state-prefix">{copy.emptyLead}</span>
              {copy.emptyTitle}
            </strong>
            <p>{copy.emptyBody}</p>
          </div>
          <div className="flash-actions">
            <button type="button" className="primary-btn inline" onClick={handleFinish}>
              {copy.finish}
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (done) {
    return (
      <section className="practice-view exercise-session">
        <p className="eyebrow">EXERCISES</p>
        <h1>{title}</h1>
        <div className="practice-card">
          <div className="flash-face" ref={scoreRef} tabIndex={-1} role="group" aria-label={`${copy.completeTitle} ${correct} / ${total}`}>
            <strong>
              {correct} / {total}
            </strong>
            <span className="flash-meaning">{copy.completeTitle}</span>
            <p>{copy.completeBody}</p>
          </div>
          <div className="flash-actions">
            <button type="button" className="ghost" onClick={onExit}>
              {copy.exit}
            </button>
            <button type="button" className="primary-btn inline" onClick={handleFinish}>
              {copy.finish}
            </button>
          </div>
        </div>
      </section>
    )
  }

  const progress = Math.round(((index + 1) / total) * 100)

  return (
    <section className="practice-view exercise-session">
      <button type="button" className="ghost back" onClick={onExit}>
        {copy.exit}
      </button>

      <p className="eyebrow">{KIND_LABELS[exercise.kind]}</p>
      <h1>
        {title}
        <span aria-live="polite" aria-atomic="true">
          {index + 1} / {total}
        </span>
      </h1>

      <div className="progress-bar-track" aria-hidden="true">
        <span className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="practice-card">
        <div className="flash-face" ref={promptRef} tabIndex={-1} role="group" aria-labelledby="exercise-question-text">
          <div id="exercise-question-text" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {renderPrompt(exercise, copy, meaningLang)}
          {exercise.promptZh && (
            <span className="flash-sentence-zh" lang={meaningLang}>{exercise.promptZh}</span>
          )}
          </div>
          {renderSpeakButton(exercise, lang, copy)}
        </div>

        {renderAnswerArea({
          exercise,
          feedback,
          selectedChoice,
          textAnswer,
          order,
          copy,
          meaningLang,
          setTextAnswer,
          setOrder,
          submitAnswer,
        })}

        {feedback !== null && (
          <p
            id="exercise-grade-status"
            className={feedback ? 'status-line' : 'status-line warn'}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {feedback
              ? `${copy.markCorrect} · ${copy.correct} ${copy.srsGood}`
              : `${copy.markWrong} · ${copy.wrong} ${exercise.answer} ${copy.srsAgain}`}
          </p>
        )}

        <div className="flash-actions">
          <button
            type="button"
            className="primary-btn inline"
            disabled={feedback === null}
            onClick={handleNext}
          >
            {index >= total - 1 ? copy.showScore : copy.next}
          </button>
        </div>
      </div>
    </section>
  )
}

function renderPrompt(
  exercise: Exercise,
  copy: ReturnType<typeof uiCopy>,
  meaningLang: string,
): ReactNode {
  if (exercise.kind === 'listenSelect') {
    return (
      <>
        <strong>{copy.listenPrompt}</strong>
        <p lang={exercise.lang}>{exercise.prompt}</p>
      </>
    )
  }

  if (exercise.kind === 'fillBlank') {
    return (
      <>
        <strong id="exercise-fill-prompt">{copy.fillPrompt}</strong>
        <p id="exercise-fill-stem" lang={exercise.lang}>{exercise.prompt}</p>
      </>
    )
  }

  if (exercise.kind === 'orderWords') {
    return (
      <>
        <strong>{copy.orderPrompt}</strong>
        <p lang={meaningLang}>{exercise.prompt}</p>
      </>
    )
  }

  if (exercise.kind === 'registerPick') {
    return (
      <>
        <strong>{copy.registerPrompt}</strong>
        <p lang={exercise.lang}>{exercise.prompt}</p>
      </>
    )
  }

  if (exercise.kind === 'passageQuiz') {
    return (
      <>
        <strong lang={exercise.lang}>{exercise.prompt}</strong>
        <p>{copy.passagePrompt}</p>
      </>
    )
  }

  return (
    <>
      <strong lang={exercise.kind === 'meaningToHead' ? meaningLang : exercise.lang}>{exercise.prompt}</strong>
      {exercise.card.reading && (
        <span className="flash-meaning" lang={exercise.lang}>{exercise.card.reading}</span>
      )}
    </>
  )
}

function renderSpeakButton(
  exercise: Exercise,
  lang: 'ja' | 'en',
  copy: ReturnType<typeof uiCopy>,
) {
  if (exercise.kind !== 'listenSelect' && exercise.kind !== 'recognize') {
    return null
  }

  return (
    <div className="flash-actions">
      <SpeakButton
        lang={lang}
        text={exercise.speakText ?? exercise.prompt}
        label={exercise.kind === 'listenSelect' ? copy.playAudio : copy.speakPrompt}
      />
    </div>
  )
}

function renderAnswerArea({
  exercise,
  feedback,
  selectedChoice,
  textAnswer,
  order,
  copy,
  meaningLang,
  setTextAnswer,
  setOrder,
  submitAnswer,
}: {
  exercise: Exercise
  feedback: boolean | null
  selectedChoice: string
  textAnswer: string
  order: number[]
  copy: ReturnType<typeof uiCopy>
  meaningLang: string
  setTextAnswer: (value: string) => void
  setOrder: (value: number[] | ((previous: number[]) => number[])) => void
  submitAnswer: (answer: string) => void
}) {
  if (exercise.kind === 'fillBlank') {
    return (
      <div className="flash-actions">
        <input
          id="exercise-fill-answer"
          type="text"
          lang={exercise.lang}
          value={textAnswer}
          onChange={(event) => setTextAnswer(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.nativeEvent.isComposing && textAnswer.trim()) {
              event.preventDefault()
              submitAnswer(textAnswer)
            }
          }}
          readOnly={feedback !== null}
          placeholder={copy.typeAnswer}
          aria-labelledby="exercise-fill-prompt exercise-fill-stem"
          aria-invalid={feedback === false}
          aria-errormessage={feedback === false ? 'exercise-grade-status' : undefined}
          aria-describedby={feedback !== null ? 'exercise-grade-status' : undefined}
        />
        <button
          type="button"
          className="primary-btn inline"
          disabled={!textAnswer.trim()}
          aria-disabled={feedback !== null}
          tabIndex={feedback !== null ? -1 : undefined}
          onClick={() => submitAnswer(textAnswer)}
        >
          {copy.check}
        </button>
      </div>
    )
  }

  if (exercise.kind === 'orderWords') {
    const tokens = exercise.choices ?? []
    const selectedAnswer = order.map((tokenIndex) => tokens[tokenIndex]).join(' ')

    return (
      <>
        <div className="order-bank" role="group" aria-label={copy.currentOrder} aria-invalid={feedback === false} aria-errormessage={feedback === false ? 'exercise-grade-status' : undefined}>
          {order.length > 0 ? (
            order.map((tokenIndex, selectedIndex) => (
              <button
                type="button"
                lang={exercise.lang}
                className="choice-btn"
                disabled={feedback !== null}
                key={`${tokenIndex}:${selectedIndex}`}
                onClick={(event) => {
                  event.currentTarget.closest('.exercise-session')?.querySelector<HTMLButtonElement>(`#exercise-order-token-${tokenIndex}`)?.focus()
                  setOrder((previous) =>
                    previous.filter((_, index) => index !== selectedIndex),
                  )
                }}
              >
                {tokens[tokenIndex]}
              </button>
            ))
          ) : (
            <span>{copy.tapWords}</span>
          )}
        </div>
        <div className="order-bank">
          {tokens.map((token, tokenIndex) => (
            <button
              id={`exercise-order-token-${tokenIndex}`}
              type="button"
              lang={exercise.lang}
              className="choice-btn"
              disabled={feedback !== null}
              key={`${token}:${tokenIndex}`}
              aria-pressed={order.includes(tokenIndex)}
              onClick={() => setOrder((previous) => previous.includes(tokenIndex)
                ? previous.filter((index) => index !== tokenIndex)
                : [...previous, tokenIndex])}
            >
              {token}
            </button>
          ))}
        </div>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {copy.currentOrder}: {selectedAnswer || copy.tapWords}
        </p>
        <div className="flash-actions">
          <button
            type="button"
            className="ghost"
            disabled={feedback !== null || order.length === 0}
            onClick={(event) => {
              event.currentTarget.closest('.exercise-session')?.querySelector<HTMLButtonElement>('#exercise-order-token-0')?.focus()
              setOrder([])
            }}
          >
            {copy.reset}
          </button>
          <button
            type="button"
            className="primary-btn inline"
            disabled={order.length !== tokens.length}
            aria-disabled={feedback !== null}
            tabIndex={feedback !== null ? -1 : undefined}
            onClick={() => submitAnswer(selectedAnswer)}
          >
            {copy.check}
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="choice-grid">
      {(exercise.choices ?? []).map((choice) => (
        <button
          type="button"
          className={choiceButtonClass(choice, exercise.answer, selectedChoice, feedback)}
          aria-disabled={feedback !== null}
          tabIndex={feedback !== null ? -1 : undefined}
          key={choice}
          aria-invalid={feedback === false && choice === selectedChoice}
          aria-errormessage={feedback === false && choice === selectedChoice ? 'exercise-grade-status' : undefined}
          onClick={() => submitAnswer(choice)}
        >
          <span lang={exercise.kind === 'meaningToHead' || exercise.kind === 'registerPick' ? exercise.lang : meaningLang}>{choice}</span>
          {feedback !== null && choice === exercise.answer ? (
            <span className="choice-result-mark">{copy.markCorrect}</span>
          ) : null}
          {feedback !== null && choice === selectedChoice && choice !== exercise.answer ? (
            <span className="choice-result-mark">{copy.markWrong}</span>
          ) : null}
        </button>
      ))}
    </div>
  )
}

function choiceButtonClass(
  choice: string,
  answer: string,
  selectedChoice: string,
  feedback: boolean | null,
) {
  if (feedback === null) return 'choice-btn'
  if (choice === answer) return 'choice-btn correct'
  if (choice === selectedChoice) return 'choice-btn wrong'
  return 'choice-btn'
}

function uiCopy(t: (key: MessageKey) => string) {
  return {
    check: t('exercise.check'),
    completeBody: t('exercise.completeBody'),
    completeTitle: t('exercise.completeTitle'),
    correct: t('exercise.correct'),
    currentOrder: t('exercise.currentOrder'),
    emptyBody: t('exercise.emptyBody'),
    emptyLead: t('exercise.emptyLead'),
    emptyTitle: t('exercise.emptyTitle'),
    exit: t('exercise.exit'),
    fillPrompt: t('exercise.fillPrompt'),
    finish: t('exercise.finish'),
    listenPrompt: t('exercise.listenPrompt'),
    markCorrect: t('exercise.markCorrect'),
    markWrong: t('exercise.markWrong'),
    next: t('exercise.next'),
    orderPrompt: t('exercise.orderPrompt'),
    passagePrompt: t('exercise.passagePrompt'),
    playAudio: t('exercise.playAudio'),
    registerPrompt: t('exercise.registerPrompt'),
    reset: t('exercise.reset'),
    showScore: t('exercise.showScore'),
    speakPrompt: t('exercise.speakPrompt'),
    srsAgain: t('exercise.srsAgain'),
    srsGood: t('exercise.srsGood'),
    tapWords: t('exercise.tapWords'),
    typeAnswer: t('exercise.typeAnswer'),
    wrong: t('exercise.wrong'),
  }
}
